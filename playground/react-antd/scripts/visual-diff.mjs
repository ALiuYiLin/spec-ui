import http from 'node:http'
import fsp from 'node:fs/promises'
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
const ARTIFACTS = path.resolve(PKG_ROOT, '..', '..', 'artifacts')
const VIEWPORT = { width: 1280, height: 800 }

/** 用 --page=vue.html 可以让另一套实现跑同一份比对 */
const PAGE = (process.argv.find((a) => a.startsWith('--page=')) ?? '--page=ref.html').slice('--page='.length)

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

const RESOLVE = {
  Button: {
    root: { ref: (all) => partByClass(all, 'sm-btn'), antd: (all) => all.find((n) => n.classes.includes('ant-btn')) },
    label: { ref: (all) => partByClass(all, 'sm-btn__label'), antd: antdBtnLabel },
    icon: {
      ref: (all) => partByClass(all, 'sm-btn__icon'),
      antd: (all) =>
        all.find((n) => n.classes.includes('ant-btn-icon') && !n.classes.includes('ant-btn-loading-icon')),
    },
    spinner: {
      ref: (all) => partByClass(all, 'sm-btn__spinner'),
      antd: (all) => all.find((n) => n.classes.includes('ant-btn-loading-icon')),
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
    clear: {
      ref: (all) => partByClass(all, 'sm-select__clear'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-clear')),
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

  Modal: {
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
  { component: 'Button', ref: 'ref-button-size-lg', antd: 'button-size-lg', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-circle', antd: 'button-shape-circle', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-icon', antd: 'button-icon', targets: ['root', 'icon', 'label'] },
  { component: 'Button', ref: 'ref-button-loading', antd: 'button-loading', targets: ['root', 'spinner'] },
  { component: 'Button', ref: 'ref-button-disabled', antd: 'button-disabled', targets: ['root'] },

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
    targets: ['root', 'control', 'placeholder', 'arrow'],
  },
  { component: 'Select', ref: 'ref-select-filled', antd: 'select-closed-filled', targets: ['root', 'control', 'value'] },
  { component: 'Select', ref: 'ref-select-clear', antd: 'select-closed-filled-clear', targets: ['clear', 'arrow'] },
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

  // ---- Select：交互态 ----
  {
    component: 'Select',
    ref: 'ref-select-clear',
    antd: 'select-closed-filled-hover',
    pseudo: ['hover'],
    targets: ['root', 'control', 'clear', 'arrow'],
  },
  { component: 'Select', ref: 'ref-select-focused', antd: 'select-focused', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-open-highlighted', antd: 'select-open-highlighted', targets: ['option0'] },

  // ---- Input ----
  { component: 'Input', ref: 'ref-input-basic', antd: 'input-basic', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-value', antd: 'input-value', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-disabled', antd: 'input-disabled', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-error', antd: 'input-error', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-sm', antd: 'input-sm', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-lg', antd: 'input-lg', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-basic', antd: 'input-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Input', ref: 'ref-input-focus', antd: 'input-focus', targets: ['root'] },
  { component: 'Input', ref: 'ref-input-prefix', antd: 'input-prefix', targets: ['root', 'prefix'] },
  {
    component: 'Input',
    ref: 'ref-input-clear',
    antd: 'input-clear',
    // 清除按钮是图形部件（SVG + currentColor），antd 那边是 button，字体会落到 UA 默认 Arial
    targets: ['root', { name: 'clear', ignore: ['font-family'] }],
  },
  {
    component: 'Input',
    ref: 'ref-input-clear',
    antd: 'input-clear-hover',
    pseudo: ['hover'],
    targets: ['root', { name: 'clear', ignore: ['font-family'] }],
  },

  // ---- Checkbox ----
  { component: 'Checkbox', ref: 'ref-checkbox-unchecked', antd: 'checkbox-unchecked', targets: ['root', 'control', 'box', 'label'] },
  { component: 'Checkbox', ref: 'ref-checkbox-checked', antd: 'checkbox-checked', targets: ['box'] },
  { component: 'Checkbox', ref: 'ref-checkbox-indeterminate', antd: 'checkbox-indeterminate', targets: ['box'] },
  { component: 'Checkbox', ref: 'ref-checkbox-disabled', antd: 'checkbox-disabled', targets: ['root', 'box'] },
  { component: 'Checkbox', ref: 'ref-checkbox-unchecked', antd: 'checkbox-hover', pseudo: ['hover'], targets: ['box'] },
  { component: 'Checkbox', ref: 'ref-checkbox-focus', antd: 'checkbox-focus', targets: ['box'] },

  // ---- Radio ----
  { component: 'Radio', ref: 'ref-radio-unchecked', antd: 'radio-unchecked', targets: ['root', 'control', 'box', 'label'] },
  { component: 'Radio', ref: 'ref-radio-checked', antd: 'radio-checked', targets: ['box'] },
  { component: 'Radio', ref: 'ref-radio-disabled', antd: 'radio-disabled', targets: ['root', 'box'] },
  { component: 'Radio', ref: 'ref-radio-unchecked', antd: 'radio-hover', pseudo: ['hover'], targets: ['box'] },
  { component: 'Radio', ref: 'ref-radio-focus', antd: 'radio-focus', targets: ['box'] },

  // ---- Switch ----
  { component: 'Switch', ref: 'ref-switch-off', antd: 'switch-off', targets: ['root', 'handle'] },
  { component: 'Switch', ref: 'ref-switch-on', antd: 'switch-on', targets: ['root', 'handle'] },
  { component: 'Switch', ref: 'ref-switch-disabled', antd: 'switch-disabled', targets: ['root'] },
  { component: 'Switch', ref: 'ref-switch-off', antd: 'switch-hover', pseudo: ['hover'], targets: ['root'] },
  { component: 'Switch', ref: 'ref-switch-focus', antd: 'switch-focus', targets: ['root'] },
  { component: 'Switch', ref: 'ref-switch-small', antd: 'switch-small', targets: ['root', 'handle'] },

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
      'inner',
    ],
  },
  {
    component: 'Tooltip',
    ref: 'ref-tooltip-bottom',
    antd: 'tooltip-bottom',
    targets: [
      { name: 'root', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'width', 'height'] },
      'inner',
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
      'content',
    ],
  },
  {
    component: 'Popover',
    ref: 'ref-popover-notitle',
    antd: 'popover-notitle',
    targets: [
      { name: 'root', ignore: ['left', 'right', 'top', 'bottom', 'transform', 'transform-origin', 'width', 'height'] },
      'inner',
      'content',
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
    ],
  },
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

  for (const pair of PAIRS) {
    const rc = caseById.get(pair.ref)
    if (!rc) {
      failures.push({ pair: pair.ref, target: '-', msg: '参考实现里找不到该用例' })
      continue
    }

    await page.goto(`${base}${PAGE}?case=${encodeURIComponent(pair.ref)}`, { waitUntil: 'load' })
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
        selector: '[data-case-root] > *',
      })
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
      for (const p of PROPS) {
        if (ignore.has(p) || IGNORE_ALWAYS.has(p)) continue
        const a = antdEl.style[p]
        const b = refEl.style[p]
        if (a === undefined || b === undefined) {
          diffs.push({ p, a: a ?? '(未采集)', b: b ?? '(未采集)' })
          continue
        }
        if (!sameValue(p, a, b)) diffs.push({ p, a, b })
      }

      const compared = PROPS.length - ignore.size - IGNORE_ALWAYS.size
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
