import http from 'node:http'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { STYLE_PROPS } from './props.mjs'

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

  const el = Array.from(holder.querySelectorAll('*')).find((n) =>
    Array.from(n.classList).some((c) => c.startsWith('av-')),
  )
  if (!el) return null

  const portals = Array.from(document.querySelectorAll('.av-select__dropdown'))
    .filter((p) => !el.contains(p))
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
    root: { ref: (all) => partByClass(all, 'av-btn'), antd: (all) => all.find((n) => n.classes.includes('ant-btn')) },
    label: { ref: (all) => partByClass(all, 'av-btn__label'), antd: antdBtnLabel },
    icon: {
      ref: (all) => partByClass(all, 'av-btn__icon'),
      antd: (all) =>
        all.find((n) => n.classes.includes('ant-btn-icon') && !n.classes.includes('ant-btn-loading-icon')),
    },
    spinner: {
      ref: (all) => partByClass(all, 'av-btn__spinner'),
      antd: (all) => all.find((n) => n.classes.includes('ant-btn-loading-icon')),
    },
  },
  Select: {
    root: { ref: (all) => partByClass(all, 'av-select'), antd: (all) => all.find((n) => n.classes.includes('ant-select')) },
    control: {
      ref: (all) => partByClass(all, 'av-select__control'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-selector')),
    },
    value: {
      ref: (all) => partByClass(all, 'av-select__value'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-selection-item')),
    },
    placeholder: {
      ref: (all) => partByClass(all, 'av-select__placeholder'),
      antd: (all) => all.find((n) => n.classes.includes('ant-select-selection-placeholder')),
    },
    dropdown: {
      ref: (all, portals) => portals?.[0],
      antd: (all, portals) => portals?.[0],
    },
    option: null, // 需要 index，见下方
  },
}

function resolveTarget(component, name, side, refs) {
  if (component === 'Select' && name.startsWith('option')) {
    const index = Number(name.slice('option'.length) || 0)
    if (side === 'ref') return refs.refAll.filter((n) => n.classes.includes('av-select__option'))[index]
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
  // box-shadow / transform 等列表值：规范化空白后比较
  const norm = (v) => v.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim()
  return norm(a) === norm(b)
}

const PAIRS = [
  { component: 'Button', ref: 'ref-button-default', antd: 'button-default-md', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-primary', antd: 'button-primary-md', targets: ['root', 'label'] },
  { component: 'Button', ref: 'ref-button-size-lg', antd: 'button-size-lg', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-circle', antd: 'button-shape-circle', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-icon', antd: 'button-icon', targets: ['root', 'icon', 'label'] },
  { component: 'Button', ref: 'ref-button-loading', antd: 'button-loading', targets: ['root'] },
  { component: 'Button', ref: 'ref-button-disabled', antd: 'button-disabled', targets: ['root'] },

  { component: 'Select', ref: 'ref-select-closed', antd: 'select-closed-empty', targets: ['root', 'control', 'placeholder'] },
  { component: 'Select', ref: 'ref-select-filled', antd: 'select-closed-filled', targets: ['root', 'control', 'value'] },
  { component: 'Select', ref: 'ref-select-open', antd: 'select-open', targets: ['root', 'control', { name: 'dropdown', ignore: ['left', 'right', 'top', 'bottom', 'transform-origin'] }, 'option0'] },
  { component: 'Select', ref: 'ref-select-open-selected', antd: 'select-open-filled', targets: ['option1'] },
  // ref-select-open-empty 暂不比对：antd 的空态带插图（内容资产），不属于样式层
  { component: 'Select', ref: 'ref-select-disabled', antd: 'select-disabled', targets: ['root', 'control'] },
  { component: 'Select', ref: 'ref-select-status-error', antd: 'select-status-error', targets: ['control'] },
  { component: 'Select', ref: 'ref-select-size-sm', antd: 'select-size-sm', targets: ['root', 'control'] },
]

async function main() {
  const { server, port } = await startServer()
  const base = `http://127.0.0.1:${port}/`
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: 'zh-CN' })
  const page = await context.newPage()

  await page.goto(`${base}ref.html`, { waitUntil: 'load' })
  await page.waitForSelector('[data-case-root] > *', { timeout: 20000 })
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

    await page.goto(`${base}ref.html?case=${encodeURIComponent(pair.ref)}`, { waitUntil: 'load' })
    await page.waitForSelector('[data-case-root] > *', { timeout: 20000 })
    for (const a of rc.actions ?? []) {
      if (a.type === 'focus') await page.focus(a.selector)
      else if (a.type === 'press') await page.keyboard.press(a.key)
    }
    await page.waitForTimeout(60)

    const refSnap = await page.evaluate(snapFn, { props: PROPS })
    const antdRecord = JSON.parse(
      await fsp.readFile(path.join(ARTIFACTS, pair.component.toLowerCase(), `${pair.antd}.json`), 'utf8'),
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
