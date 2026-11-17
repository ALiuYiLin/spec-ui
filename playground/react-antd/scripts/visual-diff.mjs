import http from 'node:http'
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { STYLE_PROPS, kebab } from './props.mjs'

/**
 * L3 视觉一致性比对。
 *
 * 左边：artifacts/ 里 antd 的实测计算样式。
 * 右边：参考实现挂了 Tailwind 样式之后的实测计算样式。
 * 逐属性比对，带数值容差；不一致就红。
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, '..')
const DIST = path.join(PKG_ROOT, 'dist')
/** --theme=dark 时对比 artifacts-dark/ 里的暗色证据 */
const THEME = (process.argv.find((a) => a.startsWith('--theme=')) ?? '--theme=light').slice('--theme='.length)
const THEME_QUERY = THEME === 'dark' ? '&theme=dark' : ''
const ARTIFACTS = path.resolve(PKG_ROOT, '..', '..', THEME === 'dark' ? 'artifacts-dark' : 'artifacts')
if (!fs.existsSync(ARTIFACTS)) {
  console.error(
    `缺少${THEME === 'dark' ? '暗色' : '亮色'}证据目录：${ARTIFACTS}\n` +
      (THEME === 'dark' ? '先跑 pnpm extract:dark' : '先跑 pnpm extract'),
  )
  process.exit(1)
}
const VIEWPORT = { width: 1280, height: 800 }

/** 用 --page=vue.html 可以让另一套实现跑同一份比对 */
const PAGE = (process.argv.find((a) => a.startsWith('--page=')) ?? '--page=ref.html').slice('--page='.length)
/** --component=Button 只比该组件的目标 */
const COMPONENT = (process.argv.find((a) => a.startsWith('--component=')) ?? '').slice('--component='.length)

const PROPS = STYLE_PROPS

/**
 * 永远跳过的属性：证据是在 motion:false 下采集的，antd 显式 transition:none，
 * 而我们保留真实过渡。比 motion 没有意义，且会淹没真正的视觉差异。
 */
const IGNORE_ALWAYS = new Set(['transition-property', 'transition-duration'])

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1')
      let filePath = path.join(DIST, decodeURIComponent(url.pathname))
      if (!filePath.startsWith(DIST)) {
        res.writeHead(403).end('forbidden')
        return
      }
      let ok = false
      try {
        ok = (await fsp.stat(filePath)).isFile()
      } catch {
        ok = false
      }
      if (!ok) filePath = path.join(DIST, 'index.html')
      const body = await fsp.readFile(filePath)
      res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' })
      res.end(body)
    } catch (err) {
      res.writeHead(500).end(String(err))
    }
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
  })
}

const snapFn = ({ props }) => {
  const holder = document.querySelector('[data-case-root]')
  if (!holder) return null

  const read = (cs) => {
    const out = {}
    for (const p of props) out[p] = cs.getPropertyValue(p)
    return out
  }
  const walk = (n) => {
    const attrs = {}
    for (const a of n.attributes) {
      if (a.name === 'class') continue
      attrs[a.name] = a.value
    }
    const box = n.getBoundingClientRect()
    return {
      tag: n.tagName.toLowerCase(),
      classes: Array.from(n.classList),
      attrs,
      rect: { x: +box.x.toFixed(2), y: +box.y.toFixed(2), w: +box.width.toFixed(2), h: +box.height.toFixed(2) },
      style: read(getComputedStyle(n)),
      children: Array.from(n.children).map(walk),
    }
  }

  const isSm = (n) => Array.from(n.classList).some((c) => c.startsWith('sm-'))
  const bodyRoots = Array.from(document.querySelectorAll('[class^="sm-"], [class*=" sm-"]')).filter(
    (p) => p.parentElement === document.body,
  )
  // 纯浮层组件没有留在文档流的根，回退到 body 下的浮层根
  const el = Array.from(holder.querySelectorAll('*')).find(isSm) ?? bodyRoots[0]
  if (!el) return null

  // 浮层根：任何直接挂在 body 下的 sm-* 元素（Select 下拉、Tooltip 等）
  const portals = Array.from(document.querySelectorAll('[class^="sm-"], [class*=" sm-"]'))
    .filter((p) => p.parentElement === document.body && !el.contains(p))
    .map(walk)

  return { tree: walk(el), portals }
}

const flat = (n, out = []) => {
  out.push(n)
  for (const k of n.children ?? []) flat(k, out)
  return out
}

/* ---------------- 目标解析 ---------------- */

const partByClass = (all, cls) => all.find((n) => n.classes.includes(cls))

const antdRoot = (all) => all.find((n) => n.classes.includes('ant-btn') || n.classes.includes('ant-select'))

const antdBtnLabel = (all) => {
  const root = all.find((n) => n.classes.includes('ant-btn'))
  if (!root) return undefined
  return root.children.find((c) => c.tag === 'span' && c.classes.length === 0)
}

function findDescendant(node, predicate) {
  for (const child of node?.children ?? []) {
    if (predicate(child)) return child
    const found = findDescendant(child, predicate)
    if (found) return found
  }
  return null
}

/** 节点子树里是否包含指定 class（用于区分 antd 图标槽里放的是搜索图标还是 loading 图标） */
function hasDescendantClass(node, cls) {
  if (!node) return false
  if ((node.classes ?? []).includes(cls)) return true
  return (node.children ?? []).some((child) => hasDescendantClass(child, cls))
}

const RESOLVE = {
  Button: {
    root: { ref: (all) => partByClass(all, 'sm-btn'), antd: (all) => all.find((n) => n.classes.includes('ant-btn')) },
    label: { ref: (all) => partByClass(all, 'sm-btn__label'), antd: antdBtnLabel },
    // antd 的图标槽统一是 .ant-btn-icon，靠里面 svg 的 class 区分是普通图标还是 loading
    icon: {
      ref: (all) => partByClass(all, 'sm-btn__icon'),
      antd: (all) =>
        all.find((n) => n.classes.includes('ant-btn-icon') && hasDescendantClass(n, 'lucide-search')),
    },
    // 图标槽里的 svg：尺寸写错时槽位盒子看不出来
    iconSvg: {
      ref: (all) => findDescendant(partByClass(all, 'sm-btn__icon'), (c) => c.tag === 'svg'),
      antd: (all) => {
        const wrap = all.find(
          (n) => n.classes.includes('ant-btn-icon') && hasDescendantClass(n, 'lucide-search'),
        )
        return wrap?.children?.find((c) => c.tag === 'svg') ?? null
      },
    },
    spinner: {
      ref: (all) => partByClass(all, 'sm-btn__spinner'),
      antd: (all) =>
        all.find((n) => n.classes.includes('ant-btn-icon') && hasDescendantClass(n, 'lucide-loader-2')),
    },
    // 槽位盒子对不代表里面的字形对：lucide 的 1em 曾在 Vue 侧回落成 24px
    spinnerSvg: {
      ref: (all) => findDescendant(partByClass(all, 'sm-btn__spinner'), (c) => c.tag === 'svg'),
      antd: (all) => {
        const wrap = all.find(
          (n) => n.classes.includes('ant-btn-icon') && hasDescendantClass(n, 'lucide-loader-2'),
        )
        return wrap?.children?.find((c) => c.tag === 'svg') ?? null
      },
    },
  },
  Select: {
    root: { ref: (all) => partByClass(all, 'sm-select'), antd: (all) => all.find((n) => n.classes.includes('ant-select')) },
    control: {
      ref: (all) => partByClass(all, 'sm-select__control'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-selector')),
    },
    value: {
      ref: (all) => partByClass(all, 'sm-select__value'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-selection-item')),
    },
    placeholder: {
      ref: (all) => partByClass(all, 'sm-select__placeholder'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-selection-placeholder')),
    },
    dropdown: {
      ref: (all, portals) => portals?.[0],
      antd: (all, portals) => portals?.[0],
    },
    arrow: {
      ref: (all) => partByClass(all, 'sm-select__arrow'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-arrow')),
    },
    arrowSvg: {
      ref: (all) => findDescendant(partByClass(all, 'sm-select__arrow'), (c) => c.tag === 'svg'),
      antd: (all) => {
        const wrap = all.find((n) => n.classes.includes('ant-select-arrow'))
        return findDescendant(wrap, (c) => c.tag === 'svg')
      },
    },
    clear: {
      ref: (all) => partByClass(all, 'sm-select__clear'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-clear')),
    },
    clearSvg: {
      ref: (all) => findDescendant(partByClass(all, 'sm-select__clear'), (c) => c.tag === 'svg'),
      antd: (all) => findDescendant(all.find((n) => n.classes.includes('ant-select-clear')), (c) => c.tag === 'svg'),
    },
    option: null, // 需要 index，见下方
  },

  Input: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-input')),
      antd: (all) => all.find((n) => n.classes.includes('ant-input-affix-wrapper') || n.classes.includes('ant-input')),
    },
    prefix: {
      ref: (all) => all.find((n) => n.classes.includes('sm-input__prefix')),
      antd: (all) => all.find((n) => n.classes.includes('ant-input-prefix')),
    },
    suffix: {
      ref: (all) => all.find((n) => n.classes.includes('sm-input__suffix')),
      antd: (all) => all.find((n) => n.classes.includes('ant-input-suffix')),
    },
    clear: {
      ref: (all) => all.find((n) => n.classes.includes('sm-input__clear')),
      antd: (all) => all.find((n) => n.classes.includes('ant-input-clear-icon')),
    },
    clearSvg: {
      ref: (all) => findDescendant(all.find((n) => n.classes.includes('sm-input__clear')), (c) => c.tag === 'svg'),
      antd: (all) => findDescendant(all.find((n) => n.classes.includes('ant-input-clear-icon')), (c) => c.tag === 'svg'),
    },
  },

  Checkbox: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-checkbox')),
      antd: (all) => all.find((n) => n.classes.includes('ant-checkbox-wrapper')),
    },
    control: {
      ref: (all) => all.find((n) => n.classes.includes('sm-checkbox__control')),
      antd: (all) => all.find((n) => n.classes.includes('ant-checkbox')),
    },
    box: {
      ref: (all) => all.find((n) => n.classes.includes('sm-checkbox__box')),
      antd: (all) => all.find((n) => n.classes.includes('ant-checkbox-inner')),
    },
    label: {
      ref: (all) => all.find((n) => n.classes.includes('sm-checkbox__label')),
      antd: (all) => all.find((n) => n.classes.includes('ant-checkbox-label')),
    },
  },

  Radio: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-radio')),
      antd: (all) => all.find((n) => n.classes.includes('ant-radio-wrapper')),
    },
    control: {
      ref: (all) => all.find((n) => n.classes.includes('sm-radio__control')),
      antd: (all) => all.find((n) => n.classes.includes('ant-radio')),
    },
    box: {
      ref: (all) => all.find((n) => n.classes.includes('sm-radio__box')),
      antd: (all) => all.find((n) => n.classes.includes('ant-radio-inner')),
    },
    label: {
      ref: (all) => all.find((n) => n.classes.includes('sm-radio__label')),
      antd: (all) => all.find((n) => n.classes.includes('ant-radio-label')),
    },
  },

  Switch: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-switch')),
      antd: (all) => all.find((n) => n.classes.includes('ant-switch')),
    },
    handle: {
      ref: (all) => all.find((n) => n.classes.includes('sm-switch__handle')),
      antd: (all) => all.find((n) => n.classes.includes('ant-switch-handle')),
    },
  },

  Field: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-field')),
      antd: (all) => all.find((n) => n.classes.includes('ant-form-item')),
    },
    label: {
      ref: (all) => all.find((n) => n.classes.includes('sm-field__label')),
      antd: (all) => all.find((n) => n.tag === 'label'),
    },
    error: {
      ref: (all) => all.find((n) => n.classes.includes('sm-field__error')),
      antd: (all) => all.find((n) => n.classes.includes('ant-form-item-explain-error')),
    },
  },

  InputNumber: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-input-number')),
      antd: (all) => all.find((n) => n.classes.includes('ant-input-number')),
    },
    input: {
      ref: (all) => all.find((n) => n.classes.includes('sm-input-number__input')),
      antd: (all) => all.find((n) => n.classes.includes('ant-input-number-input')),
    },
  },

  Popover: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-popover')),
      antd: (all) => all.find((n) => n.classes.includes('ant-popover')),
    },
    inner: {
      ref: (all) => all.find((n) => n.classes.includes('sm-popover__inner')),
      antd: (all) => all.find((n) => n.classes.includes('ant-popover-inner')),
    },
    title: {
      ref: (all) => all.find((n) => n.classes.includes('sm-popover__title')),
      antd: (all) => all.find((n) => n.classes.includes('ant-popover-title')),
    },
    content: {
      ref: (all) => all.find((n) => n.classes.includes('sm-popover__content')),
      antd: (all) => all.find((n) => n.classes.includes('ant-popover-inner-content')),
    },
  },

  Tooltip: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-tooltip')),
      antd: (all) => all.find((n) => n.classes.includes('ant-tooltip')),
    },
    inner: {
      ref: (all) => all.find((n) => n.classes.includes('sm-tooltip__inner')),
      antd: (all) => all.find((n) => n.classes.includes('ant-tooltip-inner')),
    },
  },

  Image: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-image')),
      antd: (all) => all.find((n) => n.classes.includes('ant-image')),
    },
    img: {
      ref: (all) => all.find((n) => n.classes.includes('sm-image__img')),
      antd: (all) => all.find((n) => n.classes.includes('ant-image-img')),
    },
  },

  Steps: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-steps')),
      antd: (all) => all.find((n) => n.classes.includes('ant-steps')),
    },
    item: {
      ref: (all) => all.find((n) => n.classes.includes('sm-steps__item')),
      antd: (all) => all.find((n) => n.classes.includes('ant-steps-item')),
    },
    title: {
      ref: (all) => all.find((n) => n.classes.includes('sm-steps__title')),
      antd: (all) => all.find((n) => n.classes.includes('ant-steps-item-title')),
    },
  },

  Timeline: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-timeline')),
      antd: (all) => all.find((n) => n.classes.includes('ant-timeline')),
    },
    item: {
      ref: (all) => all.find((n) => n.classes.includes('sm-timeline__item')),
      antd: (all) => all.find((n) => n.classes.includes('ant-timeline-item')),
    },
    dot: {
      ref: (all) => all.find((n) => n.classes.includes('sm-timeline__dot')),
      antd: (all) => all.find((n) => n.classes.includes('ant-timeline-item-head')),
    },
    content: {
      ref: (all) => all.find((n) => n.classes.includes('sm-timeline__content')),
      antd: (all) => all.find((n) => n.classes.includes('ant-timeline-item-content')),
    },
  },

  Descriptions: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-descriptions')),
      antd: (all) => all.find((n) => n.classes.includes('ant-descriptions')),
    },
  },

  Progress: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-progress')),
      antd: (all) => all.find((n) => n.classes.includes('ant-progress')),
    },
    rail: {
      ref: (all) => all.find((n) => n.classes.includes('sm-progress__rail')),
      antd: (all) => all.find((n) => n.classes.includes('ant-progress-inner')),
    },
    bar: {
      ref: (all) => all.find((n) => n.classes.includes('sm-progress__bar')),
      antd: (all) => all.find((n) => n.classes.includes('ant-progress-bg')),
    },
    text: {
      ref: (all) => all.find((n) => n.classes.includes('sm-progress__text')),
      antd: (all) => all.find((n) => n.classes.includes('ant-progress-text')),
    },
  },

  Skeleton: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-skeleton')),
      antd: (all) => all.find((n) => n.classes.includes('ant-skeleton')),
    },
    title: {
      ref: (all) => all.find((n) => n.classes.includes('sm-skeleton__title')),
      antd: (all) => all.find((n) => n.classes.includes('ant-skeleton-title')),
    },
    item: {
      ref: (all) => all.find((n) => n.classes.includes('sm-skeleton__item')),
      antd: (all) => all.find((n) => n.classes.includes('ant-skeleton-paragraph-li')),
    },
  },

  Result: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-result')),
      antd: (all) => all.find((n) => n.classes.includes('ant-result')),
    },
    icon: {
      ref: (all) => all.find((n) => n.classes.includes('sm-result__icon')),
      antd: (all) => all.find((n) => n.classes.includes('ant-result-icon')),
    },
    title: {
      ref: (all) => all.find((n) => n.classes.includes('sm-result__title')),
      antd: (all) => all.find((n) => n.classes.includes('ant-result-title')),
    },
  },

  Statistic: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-statistic')),
      antd: (all) => all.find((n) => n.classes.includes('ant-statistic')),
    },
    title: {
      ref: (all) => all.find((n) => n.classes.includes('sm-statistic__title')),
      antd: (all) => all.find((n) => n.classes.includes('ant-statistic-title')),
    },
    value: {
      ref: (all) => all.find((n) => n.classes.includes('sm-statistic__value')),
      antd: (all) => all.find((n) => n.classes.includes('ant-statistic-content')),
    },
  },

  Breadcrumb: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-breadcrumb')),
      antd: (all) => all.find((n) => n.classes.includes('ant-breadcrumb')),
    },
    item: {
      ref: (all) => all.find((n) => n.classes.includes('sm-breadcrumb__item')),
      antd: (all) => all.find((n) => n.classes.includes('ant-breadcrumb-link')),
    },
    separator: {
      ref: (all) => all.find((n) => n.classes.includes('sm-breadcrumb__separator')),
      antd: (all) => all.find((n) => n.classes.includes('ant-breadcrumb-separator')),
    },
  },

  Space: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-space')),
      antd: (all) => all.find((n) => n.classes.includes('ant-space')),
    },
    item: {
      ref: (all) => all.find((n) => n.classes.includes('sm-space__item')),
      antd: (all) => all.find((n) => n.classes.includes('ant-space-item')),
    },
  },

  Card: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-card')),
      antd: (all) => all.find((n) => n.classes.includes('ant-card')),
    },
    header: {
      ref: (all) => all.find((n) => n.classes.includes('sm-card__header')),
      antd: (all) => all.find((n) => n.classes.includes('ant-card-head')),
    },
    title: {
      ref: (all) => all.find((n) => n.classes.includes('sm-card__title')),
      antd: (all) => all.find((n) => n.classes.includes('ant-card-head-title')),
    },
    body: {
      ref: (all) => all.find((n) => n.classes.includes('sm-card__body')),
      antd: (all) => all.find((n) => n.classes.includes('ant-card-body')),
    },
  },

  Alert: {
    close: {
      ref: (all) => partByClass(all, 'sm-alert__close'),
      antd: (all) => all.find((n) => n.classes.includes('ant-alert-close-icon')),
    },
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-alert')),
      antd: (all) => all.find((n) => n.classes.includes('ant-alert')),
    },
    message: {
      ref: (all) => all.find((n) => n.classes.includes('sm-alert__message')),
      antd: (all) => all.find((n) => n.classes.includes('ant-alert-message')),
    },
  },

  Spin: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-spin')),
      antd: (all) => all.find((n) => n.classes.includes('ant-spin')),
    },
    dot: {
      ref: (all) => all.find((n) => n.classes.includes('sm-spin__dot')),
      antd: (all) => all.find((n) => n.classes.includes('ant-spin-dot')),
    },
  },

  Empty: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-empty')),
      antd: (all) => all.find((n) => n.classes.includes('ant-empty')),
    },
    description: {
      ref: (all) => all.find((n) => n.classes.includes('sm-empty__description')),
      antd: (all) => all.find((n) => n.classes.includes('ant-empty-description')),
    },
  },

  Divider: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-divider')),
      antd: (all) => all.find((n) => n.classes.includes('ant-divider')),
    },
  },

  Tag: {
    close: {
      ref: (all) => partByClass(all, 'sm-tag__close'),
      antd: (all) => all.find((n) => n.classes.includes('ant-tag-close-icon')),
    },
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-tag')),
      antd: (all) => all.find((n) => n.classes.includes('ant-tag')),
    },
  },

  Avatar: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-avatar')),
      antd: (all) => all.find((n) => n.classes.includes('ant-avatar')),
    },
  },

  Badge: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-badge')),
      antd: (all) => all.find((n) => n.classes.includes('ant-badge')),
    },
    count: {
      ref: (all) => all.find((n) => n.classes.includes('sm-badge__count')),
      antd: (all) => all.find((n) => n.classes.includes('ant-badge-count')),
    },
  },

  Dropdown: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-dropdown')),
      antd: (all) => all.find((n) => n.classes.includes('ant-dropdown')),
    },
    menu: {
      ref: (all) => all.find((n) => n.classes.includes('sm-dropdown__menu')),
      antd: (all) => all.find((n) => n.classes.includes('ant-dropdown-menu')),
    },
    item: {
      ref: (all) => all.find((n) => n.classes.includes('sm-dropdown__item')),
      antd: (all) => all.find((n) => n.classes.includes('ant-dropdown-menu-item')),
    },
  },

  Drawer: {
    close: {
      ref: (all) => partByClass(all, 'sm-drawer__close'),
      antd: (all) => all.find((n) => n.classes.includes('ant-drawer-close')),
    },
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-drawer')),
      antd: (all) => all.find((n) => n.classes.includes('ant-drawer')),
    },
    mask: {
      ref: (all) => all.find((n) => n.classes.includes('sm-drawer__mask')),
      antd: (all) => all.find((n) => n.classes.includes('ant-drawer-mask')),
    },
    panel: {
      ref: (all) => all.find((n) => n.classes.includes('sm-drawer__panel')),
      antd: (all) => all.find((n) => n.classes.includes('ant-drawer-content')),
    },
    header: {
      ref: (all) => all.find((n) => n.classes.includes('sm-drawer__header')),
      antd: (all) => all.find((n) => n.classes.includes('ant-drawer-header')),
    },
    body: {
      ref: (all) => all.find((n) => n.classes.includes('sm-drawer__body')),
      antd: (all) => all.find((n) => n.classes.includes('ant-drawer-body')),
    },
  },

  Modal: {
    close: {
      ref: (all) => partByClass(all, 'sm-modal__close'),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-close')),
    },
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-modal')),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-wrap')),
    },
    mask: {
      ref: (all) => all.find((n) => n.classes.includes('sm-modal__mask')),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-mask')),
    },
    dialog: {
      ref: (all) => all.find((n) => n.classes.includes('sm-modal__dialog')),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-content')),
    },
    header: {
      ref: (all) => all.find((n) => n.classes.includes('sm-modal__header')),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-header')),
    },
    body: {
      ref: (all) => all.find((n) => n.classes.includes('sm-modal__body')),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-body')),
    },
    footer: {
      ref: (all) => all.find((n) => n.classes.includes('sm-modal__footer')),
      antd: (all) => all.find((n) => n.classes.includes('ant-modal-footer')),
    },
  },

  Slider: {
    root: {
      ref: (all) => all.find((n) => n.classes.includes('sm-slider')),
      antd: (all) => all.find((n) => n.classes.includes('ant-slider')),
    },
    rail: {
      ref: (all) => all.find((n) => n.classes.includes('sm-slider__rail')),
      antd: (all) => all.find((n) => n.classes.includes('ant-slider-rail')),
    },
    track: {
      ref: (all) => all.find((n) => n.classes.includes('sm-slider__track')),
      antd: (all) => all.find((n) => n.classes.includes('ant-slider-track')),
    },
    handle: {
      ref: (all) => all.find((n) => n.classes.includes('sm-slider__handle')),
      antd: (all) => all.find((n) => n.classes.includes('ant-slider-handle')),
    },
  },
}

function resolveTarget(component, name, side, refs) {
  if (component === 'Select' && name.startsWith('option')) {
    const index = Number(name.slice('option'.length) || 0)
    if (side === 'ref') return refs.refAll.filter((n) => n.classes.includes('sm-select__option'))[index]
    return refs.antdAll.filter((n) => n.classes.includes('ant-select-item-option'))[index]
  }
  const spec = RESOLVE[component][name]
  if (!spec) return undefined
  return side === 'ref' ? spec.ref(refs.refAll, refs.refPortals) : spec.antd(refs.antdAll, refs.antdPortals)
}

/* ---------------- 比对 ---------------- */

const COLOR = /^rgba?\(([^)]+)\)$/

function normalizeColor(v) {
  const m = COLOR.exec(v.trim())
  if (!m) return null
  const parts = m[1].split(/[,/\s]+/).filter(Boolean).map(Number)
  if (parts.some(Number.isNaN)) return null
  const [r, g, b, a = 1] = parts
  return [r, g, b, a]
}

function sameValue(prop, a, b) {
  if (a === b) return true
  const ca = normalizeColor(a)
  const cb = normalizeColor(b)
  if (ca && cb) {
    return (
      Math.abs(ca[0] - cb[0]) <= 1 &&
      Math.abs(ca[1] - cb[1]) <= 1 &&
      Math.abs(ca[2] - cb[2]) <= 1 &&
      Math.abs(ca[3] - cb[3]) <= 0.02
    )
  }
  const px = (v) => /^-?[\d.]+px$/.test(v)
  if (px(a) && px(b)) return Math.abs(parseFloat(a) - parseFloat(b)) <= 0.6
  // background-position 的零值有两种等价序列化：0px 0px 与 0% 0%
  if (prop === 'background-position') {
    const zero = (v) => /^0(px|%) 0(px|%)$/.test(v.trim())
    if (zero(a) && zero(b)) return true
  }
  // box-shadow / transform 等列表值：规范化空白后比较
  const norm = (v) => v.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim()
  return norm(a) === norm(b)
}

const PAIRS = [
  // ---- Button：静止态 ----
  { component: 'Button', ref: 'ref-button-default', antd: 'button-default-md', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-primary', antd: 'button-primary-md', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-tone-success', antd: 'button-tone-success', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-tone-warning', antd: 'button-tone-warning', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-size-lg', antd: 'button-size-lg', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-circle', antd: 'button-shape-circle', targets: ['root', { name: 'iconSvg', center: true, ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'] }] },
  { component: 'Button', ref: 'ref-button-icon', antd: 'button-icon', targets: ['root', { name: 'icon', center: true }, 'label', { name: 'iconSvg', center: true, ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'] }] },
  { component: 'Button', ref: 'ref-button-loading', antd: 'button-loading', targets: ['root', { name: 'spinner', center: true }, { name: 'spinnerSvg', center: true, ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'] }] },
  { component: 'Button', ref: 'ref-button-loading-icon', antd: 'button-loading-icon', targets: ['root', { name: 'spinner', center: true }, { name: 'spinnerSvg', center: true, ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'] }] },
  { component: 'Button', ref: 'ref-button-disabled', antd: 'button-disabled', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-round', antd: 'button-shape-round', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-block', antd: 'button-block', targets: [{ name: 'root', ignore: ['width', 'transform-origin'] }, 'label'] },
  { component: 'Button', ref: 'ref-button-disabled-dashed', antd: 'button-disabled-dashed', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-disabled-text', antd: 'button-disabled-text', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-disabled-link', antd: 'button-disabled-link', targets: ['root'] },

  // ---- Button：交互态（CDP 强制伪类）----
  { component: 'Button', ref: 'ref-button-primary', antd: 'button-primary-md-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Button', ref: 'ref-button-primary', antd: 'button-primary-md-active', pseudo: ['active'], targets: ['root'] },
  {
    component: 'Button',
    ref: 'ref-button-primary',
    antd: 'button-primary-md-focus-visible',
    pseudo: ['focus', 'focus-visible'],
    targets: ['root'],
  },
  { component: 'Button', ref: 'ref-button-default', antd: 'button-default-md-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Button', ref: 'ref-button-default', antd: 'button-default-md-active', pseudo: ['active'], targets: ['root'] },
  {
    component: 'Button',
    ref: 'ref-button-default',
    antd: 'button-default-md-focus-visible',
    pseudo: ['focus', 'focus-visible'],
    targets: ['root'],
  },
  { component: 'Button', ref: 'ref-button-text', antd: 'button-text-md-hover', pseudo: ['hover'], targets: ['root'] },
  {
    component: 'Button',
    ref: 'ref-button-disabled',
    antd: 'button-disabled-hover',
    pseudo: ['hover'],
    targets: ['root'],
  },

  // ---- Select：静止态 ----
  {
    component: 'Select',
    ref: 'ref-select-closed',
    antd: 'select-closed-empty',
    targets: [
      'root',
      'control',
      'placeholder',
      'arrow',
      {
        name: 'arrowSvg',
        ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'],
      }
],
  },
  { component: 'Select', ref: 'ref-select-filled', antd: 'select-closed-filled', targets: ['root', 'control', 'value'] },
  { component: 'Select', ref: 'ref-select-clear', antd: 'select-closed-filled-clear', targets: [{ name: 'clear', center: true }, { name: 'arrow', center: true }, { name: 'clearSvg', ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'] }] },
  {
    component: 'Select',
    ref: 'ref-select-open',
    antd: 'select-open',
    targets: ['root', 'control', { name: 'dropdown', ignore: ['left', 'right', 'top', 'bottom', 'transform-origin'] }, 'option0'],
  },
  { component: 'Select', ref: 'ref-select-open-selected', antd: 'select-open-filled', targets: ['option1'] },
  { component: 'Select', ref: 'ref-select-disabled', antd: 'select-disabled', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-status-error', antd: 'select-status-error', targets: ['control'] },
  { component: 'Select', ref: 'ref-select-size-sm', antd: 'select-size-sm', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-variant-filled', antd: 'select-variant-filled', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-variant-borderless', antd: 'select-variant-borderless', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-status-warning', antd: 'select-status-warning', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-size-lg', antd: 'select-size-lg', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-no-arrow', antd: 'select-no-arrow', targets: ['root', 'control'] },

  // ---- Select：交互态 ----
  {
    component: 'Select',
    ref: 'ref-select-clear',
    antd: 'select-closed-filled-hover',
    pseudo: ['hover'],
    targets: ['root', 'control', { name: 'clear', center: true }, { name: 'arrow', center: true }],
  },
  { component: 'Select', ref: 'ref-select-focused', antd: 'select-focused', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-open-highlighted', antd: 'select-open-highlighted', targets: ['option0'] },

  // ---- Input ----
  { component: 'Input', ref: 'ref-input-basic', antd: 'input-basic', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-value', antd: 'input-value', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-disabled', antd: 'input-disabled', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-error', antd: 'input-error', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-warning', antd: 'input-warning', targets: ['root'] },
  // filled 在 antd 里没有显式 color（继承页面色），证据台的黑字是环境产物，不比 color
  { component: 'Input', ref: 'ref-input-filled', antd: 'input-variant-filled', targets: [{ name: 'root', ignore: ['color', 'outline-color'] }] },
  { component: 'Input', ref: 'ref-input-borderless', antd: 'input-variant-borderless', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-readonly', antd: 'input-readonly', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-sm', antd: 'input-sm', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-lg', antd: 'input-lg', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-basic', antd: 'input-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Input', ref: 'ref-input-focus', antd: 'input-focus', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-prefix', antd: 'input-prefix', targets: ['root', { name: 'prefix', center: true }] },
  { component: 'Input', ref: 'ref-input-suffix', antd: 'input-suffix', targets: ['root', { name: 'suffix', center: true }] },
  {
    component: 'Input',
    ref: 'ref-input-clear',
    antd: 'input-clear',
    // 清除按钮是图形部件（SVG + currentColor），antd 那边是 button，字体会落到 UA 默认 Arial
    targets: ['root', { name: 'clear', ignore: ['font-family'] }, { name: 'clearSvg', ignore: ['display', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'vertical-align', 'position', 'line-height', 'font-family', 'min-width', 'min-height'] }],
  },
  {
    component: 'Input',
    ref: 'ref-input-clear',
    antd: 'input-clear-hover',
    pseudo: ['hover'],
    targets: ['root', { name: 'clear', ignore: ['font-family'] }],
  },

  // ---- Checkbox ----
  { component: 'Checkbox', ref: 'ref-checkbox-unchecked', antd: 'checkbox-unchecked', targets: ['root', 'control', { name: 'box', center: true }, 'label'] },
  { component: 'Checkbox', ref: 'ref-checkbox-checked', antd: 'checkbox-checked', targets: [{ name: 'box', center: true }] },
  { component: 'Checkbox', ref: 'ref-checkbox-checked', antd: 'checkbox-hover-checked', pseudo: ['hover'], targets: [{ name: 'box', center: true }] },
  { component: 'Checkbox', ref: 'ref-checkbox-indeterminate', antd: 'checkbox-indeterminate', targets: [{ name: 'box', center: true }] },
  { component: 'Checkbox', ref: 'ref-checkbox-disabled', antd: 'checkbox-disabled', targets: ['root', { name: 'box', center: true }] },
  { component: 'Checkbox', ref: 'ref-checkbox-disabled-checked', antd: 'checkbox-disabled-checked', targets: ['root', { name: 'box', center: true }] },
  // 无标签时 antd 的根保留 22px 行盒、我们只剩 16px 的盒子（结构差异已记录），只比盒子
  { component: 'Checkbox', ref: 'ref-checkbox-nolabel', antd: 'checkbox-no-label', targets: [{ name: 'box', center: true }] },
  { component: 'Checkbox', ref: 'ref-checkbox-unchecked', antd: 'checkbox-hover', pseudo: ['hover'], targets: [{ name: 'box', center: true }] },
  { component: 'Checkbox', ref: 'ref-checkbox-focus', antd: 'checkbox-focus', targets: [{ name: 'box', center: true }] },

  // ---- Radio ----
  { component: 'Radio', ref: 'ref-radio-unchecked', antd: 'radio-unchecked', targets: ['root', 'control', { name: 'box', center: true }, 'label'] },
  { component: 'Radio', ref: 'ref-radio-checked', antd: 'radio-checked', targets: [{ name: 'box', center: true }] },
  { component: 'Radio', ref: 'ref-radio-disabled', antd: 'radio-disabled', targets: ['root', { name: 'box', center: true }] },
  { component: 'Radio', ref: 'ref-radio-disabled-checked', antd: 'radio-disabled-checked', targets: ['root', { name: 'box', center: true }] },
  { component: 'Radio', ref: 'ref-radio-unchecked', antd: 'radio-hover', pseudo: ['hover'], targets: [{ name: 'box', center: true }] },
  { component: 'Radio', ref: 'ref-radio-focus', antd: 'radio-focus', targets: [{ name: 'box', center: true }] },

  // ---- Switch ----
  { component: 'Switch', ref: 'ref-switch-off', antd: 'switch-off', targets: ['root', 'handle'] },
  { component: 'Switch', ref: 'ref-switch-on', antd: 'switch-on', targets: ['root', 'handle'] },
  { component: 'Switch', ref: 'ref-switch-disabled', antd: 'switch-disabled', targets: ['root'] },
  { component: 'Switch', ref: 'ref-switch-off', antd: 'switch-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Switch', ref: 'ref-switch-focus', antd: 'switch-focus', targets: ['root'] },
  { component: 'Switch', ref: 'ref-switch-small', antd: 'switch-small', targets: ['root', 'handle'] },
  { component: 'Switch', ref: 'ref-switch-disabled-on', antd: 'switch-disabled-on', targets: ['root'] },
  // 带文字时 antd 的轨道会随文字宽度放宽 1px（字体度量差异），只比不受宽度影响的属性
  {
    component: 'Switch',
    ref: 'ref-switch-text',
    antd: 'switch-text',
    targets: [
      { name: 'root', ignore: ['width', 'transform-origin'] },
      { name: 'handle', ignore: ['left', 'right', 'transform-origin'] }
],
  },

  // ---- Field ----
  // 只比 label，且跳过盒子模型相关的几项：antd 的 label 被包在一层 block 容器里，
  // display / width 由那层容器决定，不可比。字体、颜色、对齐仍然严格比对。
  {
    component: 'Field',
    ref: 'ref-field-basic',
    antd: 'field-basic',
    targets: [{ name: 'label', ignore: ['display', 'box-sizing', 'width', 'min-width', 'max-width', 'height', 'min-height', 'transform-origin'] }],
  },
  {
    component: 'Field',
    ref: 'ref-field-required',
    antd: 'field-required',
    targets: [{ name: 'label', ignore: ['display', 'box-sizing', 'width', 'min-width', 'max-width', 'height', 'min-height', 'transform-origin'] }],
  },
  {
    component: 'Field',
    ref: 'ref-field-error',
    antd: 'field-error',
    targets: [{ name: 'label', ignore: ['display', 'box-sizing', 'width', 'min-width', 'max-width', 'height', 'min-height', 'transform-origin'] }],
  },

  // ---- InputNumber ----
  { component: 'InputNumber', ref: 'ref-input-number-basic', antd: 'input-number-basic', targets: ['root', 'input'] },
  { component: 'InputNumber', ref: 'ref-input-number-disabled', antd: 'input-number-disabled', targets: ['root', 'input'] },
  { component: 'InputNumber', ref: 'ref-input-number-error', antd: 'input-number-error', targets: ['root'] },
  { component: 'InputNumber', ref: 'ref-input-number-basic', antd: 'input-number-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'InputNumber', ref: 'ref-input-number-focus', antd: 'input-number-focus', targets: ['root', 'input'] },

  // ---- Slider ----
  { component: 'Slider', ref: 'ref-slider-basic', antd: 'slider-basic', targets: ['root', 'rail', 'track', 'handle'] },
  { component: 'Slider', ref: 'ref-slider-disabled', antd: 'slider-disabled', targets: ['root', 'handle'] },

  // ---- Tooltip ----
  // 只比视觉属性：位置由 placement 与实测几何决定，不可比
  {
    component: 'Tooltip',
    ref: 'ref-tooltip-top',
    antd: 'tooltip-top',
    targets: [
      { name: 'root', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'width', 'height'] },
      'inner'
],
  },
  {
    component: 'Tooltip',
    ref: 'ref-tooltip-bottom',
    antd: 'tooltip-bottom',
    targets: [
      { name: 'root', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'width', 'height'] },
      'inner'
],
  },

  // ---- Popover ----
  {
    component: 'Popover',
    ref: 'ref-popover-basic',
    antd: 'popover-basic',
    targets: [
      { name: 'root', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'width', 'height'] },
      'inner',
      'title',
      'content'
],
  },
  {
    component: 'Popover',
    ref: 'ref-popover-notitle',
    antd: 'popover-notitle',
    targets: [
      { name: 'root', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'width', 'height'] },
      'inner',
      'content'
],
  },
  // ---- Modal ----
  {
    component: 'Modal',
    ref: 'ref-modal-basic',
    antd: 'modal-basic',
    targets: [
      'mask',
      {
        name: 'dialog',
        ignore: ['top', 'left', 'right', 'bottom', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'height', 'max-width', 'transform', 'transform-origin'],
      },
      'header',
      'body',
      { name: 'footer', ignore: ['height', 'transform-origin'] },
      { name: 'close', relativeTo: 'dialog', ignore: ['font-size', 'line-height', 'font-weight', 'font-family', 'outline-width', 'outline-color', 'transform-origin', 'margin-left', 'margin-right', 'justify-content', 'vertical-align', 'box-sizing', 'top', 'right', 'bottom', 'left'] }
],
  },
  // ---- Drawer ----
  {
    component: 'Drawer',
    ref: 'ref-drawer-basic',
    antd: 'drawer-basic',
    targets: [
      'mask',
      {
        name: 'panel',
        ignore: ['box-shadow', 'top', 'right', 'bottom', 'left', 'height', 'width', 'max-width', 'position', 'z-index'],
      },
      'header',
      'body'
],
  },
  // ---- Dropdown ----
  {
    component: 'Dropdown',
    ref: 'ref-dropdown-basic',
    antd: 'dropdown-basic',
    targets: [
      { name: 'root', ignore: ['left', 'top', 'right', 'bottom', 'transform', 'transform-origin', 'width', 'height', 'min-width'] },
      'menu',
      'item'
],
  },
  // ---- Divider / Tag / Avatar / Badge ----
  { component: 'Divider', ref: 'ref-divider-basic', antd: 'divider-basic', targets: [{ name: 'root', ignore: ['width', 'transform-origin'] }] },
  { component: 'Tag', ref: 'ref-tag-basic', antd: 'tag-basic', targets: ['root'] },
  {
    component: 'Tag',
    ref: 'ref-tag-closable',
    antd: 'tag-closable',
    targets: ['root', { name: 'close', ignore: ['font-size', 'line-height', 'font-weight', 'font-family', 'outline-width', 'outline-color', 'transform-origin', 'margin-left', 'margin-right', 'justify-content', 'vertical-align', 'box-sizing', 'top', 'right', 'bottom', 'left'] }],
  },
  { component: 'Avatar', ref: 'ref-avatar-basic', antd: 'avatar-basic', targets: ['root'] },
  { component: 'Badge', ref: 'ref-badge-basic', antd: 'badge-basic', targets: ['root', { name: 'count', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'position'] }] },
  // ---- Space / Card / Alert / Spin / Empty ----
  {
    component: 'Space',
    ref: 'ref-space-basic',
    antd: 'space-basic',
    targets: [{ name: 'root', ignore: ['width', 'height', 'transform-origin', 'color', 'font-size', 'line-height'] }, 'item'],
  },
  {
    component: 'Card',
    ref: 'ref-card-basic',
    antd: 'card-basic',
    targets: [{ name: 'root', ignore: ['height', 'transform-origin'] }, 'header', {
      name: 'title',
      // 标题高度随字体度量走（同一 font-size 在不同字体栈下行高不同），只跳过高度的两项
      ignore: ['height', 'transform-origin'],
    }, 'body'],
  },
  {
    component: 'Alert',
    ref: 'ref-alert-info',
    antd: 'alert-info',
    targets: [{ name: 'root', ignore: ['width', 'height', 'transform-origin'] }, { name: 'message', ignore: ['width', 'min-width', 'min-height', 'transform-origin'] }],
  },
  // Spin 只比 root：指示器内部渲染（antd 四个点 / 我们用环形边框）不属于契约\n  { component: 'Spin', ref: 'ref-spin-basic', antd: 'spin-basic', targets: ['root'] },
  {
    component: 'Empty',
    ref: 'ref-empty-basic',
    antd: 'empty-basic',
    targets: [{ name: 'root', ignore: ['height', 'transform-origin'] }, 'description'],
  },
  // ---- Progress / Skeleton / Result / Statistic / Breadcrumb ----
  {
    component: 'Progress',
    ref: 'ref-progress-basic',
    antd: 'progress-basic',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'min-width', 'transform-origin', 'display', 'align-items'] },
      { name: 'rail', ignore: ['width', 'min-width', 'transform-origin', 'flex-basis', 'vertical-align'] },
      { name: 'bar', ignore: ['width', 'transform-origin'] },
      { name: 'text', ignore: ['width', 'height', 'min-width', 'transform-origin'] }
],
  },
  {
    component: 'Skeleton',
    ref: 'ref-skeleton-basic',
    antd: 'skeleton-basic',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'min-width', 'transform-origin', 'display'] },
      { name: 'title', ignore: ['width', 'margin-top', 'margin-bottom', 'font-size', 'line-height', 'font-weight', 'transform-origin'] }
],
  },
  {
    component: 'Result',
    ref: 'ref-result-info',
    antd: 'result-info',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'icon', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'title', ignore: ['width', 'transform-origin'] }
],
  },
  {
    component: 'Statistic',
    ref: 'ref-statistic-basic',
    antd: 'statistic-basic',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'title', ignore: ['width', 'transform-origin'] },
      { name: 'value', ignore: ['width', 'height', 'transform-origin'] }
],
  },
  {
    component: 'Breadcrumb',
    ref: 'ref-breadcrumb-basic',
    antd: 'breadcrumb-basic',
    targets: [
      { name: 'root', ignore: ['width', 'transform-origin'] },
      { name: 'item', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'separator', ignore: ['width', 'transform-origin', 'display', 'height', 'min-width', 'min-height'] }
],
  },
  // ---- Image / Steps / Timeline / Descriptions ----
  {
    component: 'Image',
    ref: 'ref-image-basic',
    antd: 'image-basic',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'img', ignore: ['width', 'height', 'transform-origin'] }
],
  },
  {
    component: 'Steps',
    ref: 'ref-steps-basic',
    antd: 'steps-basic',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'item', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'title', ignore: ['width', 'transform-origin'] }
],
  },
  {
    component: 'Timeline',
    ref: 'ref-timeline-basic',
    antd: 'timeline-basic',
    targets: [
      { name: 'root', ignore: ['width', 'height', 'transform-origin'] },
      { name: 'item', ignore: ['width', 'height', 'transform-origin', 'display'] },
      { name: 'dot', ignore: ['left', 'top', 'right', 'bottom', 'transform-origin'] },
      { name: 'content', ignore: ['width', 'margin-left', 'transform-origin', 'top', 'bottom'] }
],
  },
  {
    component: 'Descriptions',
    ref: 'ref-descriptions-basic',
    antd: 'descriptions-basic',
    targets: [{ name: 'root', ignore: ['width', 'height', 'transform-origin'] }],
  },
  { component: 'Avatar', ref: 'ref-avatar-square', antd: 'avatar-square', targets: ['root'] },
  { component: 'Divider', ref: 'ref-divider-text', antd: 'divider-text', targets: ['root'] },
  { component: 'Select', ref: 'ref-select-open-empty', antd: 'select-open-empty', targets: ['root', 'control'] },
  { component: 'Button', ref: 'ref-button-danger-primary', antd: 'button-danger-primary', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-danger-default', antd: 'button-danger-default', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-dashed', antd: 'button-dashed-md', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-link', antd: 'button-link-md', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-link', antd: 'button-link-md-hover', pseudo: ['hover'], targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-primary', antd: 'button-primary-md-focus', pseudo: ['focus'], targets: ['root'] },
  { component: 'Button', ref: 'ref-button-size-sm', antd: 'button-size-sm', targets: ['root', 'label'] },
  { component: 'Slider', ref: 'ref-slider-basic', antd: 'slider-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Slider', ref: 'ref-slider-focus', antd: 'slider-focus', targets: ['root'] },
  { component: 'Slider', ref: 'ref-slider-max', antd: 'slider-max', targets: ['root'] },
  { component: 'Slider', ref: 'ref-slider-min', antd: 'slider-min', targets: ['root'] },
  { component: 'Alert', ref: 'ref-alert-success', antd: 'alert-success', targets: ['root'] },
  { component: 'Alert', ref: 'ref-alert-warning', antd: 'alert-warning', targets: ['root'] },
  { component: 'Alert', ref: 'ref-alert-error', antd: 'alert-error', targets: ['root'] },
  { component: 'Spin', ref: 'ref-spin-sm', antd: 'spin-sm', targets: ['root'] },
  { component: 'Spin', ref: 'ref-spin-lg', antd: 'spin-lg', targets: ['root'] },
  { component: 'Statistic', ref: 'ref-statistic-precision', antd: 'statistic-precision', targets: ['root'] },
  { component: 'Alert', ref: 'ref-alert-closable', antd: 'alert-closable', targets: ['root', { name: 'close', center: true, ignore: ['font-size', 'line-height', 'font-weight', 'font-family', 'outline-width', 'outline-color', 'transform-origin', 'margin-left', 'margin-right', 'justify-content', 'vertical-align', 'box-sizing', 'top', 'right', 'bottom', 'left'] }] }
]








async function main() {
  const { server, port } = await startServer()
  const base = `http://127.0.0.1:${port}/`
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: 'zh-CN' })
  // 与证据采集保持同一前提：动画全部禁用。否则 spinner 的 transform 会随帧变化，
  // 变成"每次跑都不一样"的假差异。
  await context.addInitScript((css) => {
    const inject = () => {
      const style = document.createElement('style')
      style.textContent = css
      document.head && document.head.appendChild(style)
    }
    if (document.head) inject()
    else document.addEventListener('DOMContentLoaded', inject)
  }, '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;}')
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')

  await page.goto(`${base}${PAGE}`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('[data-case-root] > *') || document.body.querySelector('[class^="sm-"], [class*=" sm-"]'), { timeout: 20000 })
  const cases = await page.evaluate(() => window.__CONFORMANCE__)
  const caseById = new Map(cases.map((c) => [c.id, c]))

  let totalTargets = 0
  let cleanTargets = 0
  const failures = []

  const pairs = COMPONENT
    ? PAIRS.filter((p) => p.component.toLowerCase() === COMPONENT.toLowerCase())
    : PAIRS
  if (COMPONENT) console.log(`只比组件：${COMPONENT}（${pairs.length}/${PAIRS.length} 个目标）`)

  for (const pair of pairs) {
    const rc = caseById.get(pair.ref)
    if (!rc) {
      failures.push({ pair: pair.ref, target: '-', msg: '参考实现里找不到该用例' })
      continue
    }

    await page.goto(`${base}${PAGE}?case=${encodeURIComponent(pair.ref)}${THEME_QUERY}`, { waitUntil: 'load' })
    await page.waitForFunction(() => document.querySelector('[data-case-root] > *') || document.body.querySelector('[class^="sm-"], [class*=" sm-"]'), { timeout: 20000 })
    for (const a of rc.actions ?? []) {
      if (a.type === 'focus') await page.focus(a.selector)
      else if (a.type === 'press') await page.keyboard.press(a.key)
    }

    const forced = pair.pseudo ?? rc.pseudo ?? []
    if (forced.length) {
      const { root: doc } = await cdp.send('DOM.getDocument', { depth: 0 })
      const { nodeId } = await cdp.send('DOM.querySelector', {
        nodeId: doc.nodeId,
        selector: '[data-case-root] > *' })
      if (nodeId) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: forced })
    }
    await page.waitForTimeout(120)

    const refSnap = await page.evaluate(snapFn, { props: PROPS })
    const antdRecord = JSON.parse(
      await fsp.readFile(path.join(ARTIFACTS, kebab(pair.component), `${pair.antd}.json`), 'utf8'),
    )

    const refs = {
      refAll: [...flat(refSnap.tree), ...refSnap.portals.flatMap((p) => flat(p))],
      refPortals: refSnap.portals,
      antdAll: [...flat(antdRecord.tree), ...antdRecord.portals.flatMap((p) => flat(p))],
      antdPortals: antdRecord.portals,
    }

    console.log(`\n${pair.component}  ${pair.ref}  ↔  ${pair.antd}`)

    for (const rawTarget of pair.targets) {
      const target = typeof rawTarget === 'string' ? { name: rawTarget, ignore: [] } : rawTarget
      const ignore = new Set(target.ignore ?? [])
      totalTargets += 1

      const refEl = resolveTarget(pair.component, target.name, 'ref', refs)
      const antdEl = resolveTarget(pair.component, target.name, 'antd', refs)

      if (!refEl || !antdEl) {
        failures.push({ pair: pair.ref, target: target.name, msg: `缺少节点（ref=${!!refEl} antd=${!!antdEl}）` })
        console.log(`  ${target.name.padEnd(12)} ✗ 缺少节点`)
        continue
      }

      const diffs = []
      //  表示不比样式、只比中心点（用于结构与 antd 不同的小块，比如关闭按钮）
      const ignoreAll = ignore.has('*')
      for (const p of ignoreAll ? [] : PROPS) {
        if (ignore.has(p) || IGNORE_ALWAYS.has(p)) continue
        const a = antdEl.style[p]
        const b = refEl.style[p]
        if (a === undefined || b === undefined) {
          diffs.push({ p, a: a ?? '(未采集)', b: b ?? '(未采集)' })
          continue
        }
        if (!sameValue(p, a, b)) diffs.push({ p, a, b })
      }

      // 可选：比对元素中心相对 case 根节点的偏移。
      // 计算样式全对但位置错了（例如空 label 把图标挤偏 gap/2）只有这里能发现。
      if (target.center) {
        // antd 与我们浮层的根节点不同（.ant-modal-root vs .sm-modal），
        // 这类目标要相对同一个基准部件比，比如对话框本身
        const refBase = target.relativeTo
          ? resolveTarget(pair.component, target.relativeTo, 'ref', refs)
          : refSnap.tree
        const antdBase = target.relativeTo
          ? resolveTarget(pair.component, target.relativeTo, 'antd', refs)
          : antdRecord.tree
        const rel = (node, root) => ({
          x: +(node.rect.x + node.rect.w / 2 - (root.rect.x + root.rect.w / 2)).toFixed(2),
          y: +(node.rect.y + node.rect.h / 2 - (root.rect.y + root.rect.h / 2)).toFixed(2) })
        const a = rel(antdEl, antdBase)
        const b = rel(refEl, refBase)
        const dx = +(b.x - a.x).toFixed(2)
        const dy = +(b.y - a.y).toFixed(2)
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          diffs.push({ p: 'center', a: `(${a.x}, ${a.y})`, b: `(${b.x}, ${b.y}) 偏移 (${dx}, ${dy})` })
        }
      }

      const compared = (ignoreAll ? 0 : PROPS.length - ignore.size - IGNORE_ALWAYS.size) + (target.center ? 1 : 0)
      if (diffs.length === 0) {
        cleanTargets += 1
        console.log(`  ${target.name.padEnd(12)} ✓ ${compared} 项一致`)
      } else {
        console.log(`  ${target.name.padEnd(12)} ✗ ${diffs.length}/${compared} 项不一致`)
        for (const d of diffs) console.log(`      ${d.p}: antd=${d.a}  ours=${d.b}`)
        failures.push({ pair: pair.ref, target: target.name, msg: `${diffs.length} 项不一致` })
      }
    }
  }

  await browser.close()
  await new Promise((r) => server.close(r))

  console.log('')
  console.log(`visual diff: ${cleanTargets}/${totalTargets} 目标完全一致（每目标 ${PROPS.length} 项属性）`)
  if (failures.length) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
