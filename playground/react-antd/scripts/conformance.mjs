import http from 'node:http'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

/**
 * L2 一致性校验器。
 *
 * 两层检查：
 *   1) 通用规则——由 spec 驱动，任何实现都必须满足（类名空间、data 声明、布尔取值、
 *      aria 与 data 的对应、引用完整性、内联样式禁令……）。
 *   2) 用例断言——实现自己声明的、针对具体状态的期望（部件存在性、顺序、属性值）。
 *
 * 校验器不认识任何框架，只认识 DOM + 协议。
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, '..')
const DIST = path.join(PKG_ROOT, 'dist')
const SPEC_DIR = path.resolve(PKG_ROOT, '..', '..', 'spec', 'components')
const VIEWPORT = { width: 1280, height: 800 }

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

const snapshotFn = () => {
  const root = document.querySelector('[data-case-root]')
  const el = root && root.firstElementChild
  if (!el) return null

  const walk = (n) => {
    const attrs = {}
    for (const a of n.attributes) {
      if (a.name === 'class') continue
      attrs[a.name] = a.value
    }
    return {
      tag: n.tagName.toLowerCase(),
      classes: Array.from(n.classList),
      attrs,
      inlineStyle: n.getAttribute('style'),
      text: Array.from(n.childNodes)
        .filter((x) => x.nodeType === Node.TEXT_NODE)
        .map((x) => x.textContent || '')
        .join('')
        .trim(),
      children: Array.from(n.children).map(walk),
    }
  }

  const tree = walk(el)
  const portals = Array.from(document.querySelectorAll('.av-select__dropdown'))
    .filter((p) => !el.contains(p))
    .map((p) => ({ tree: walk(p), parentTag: (p.parentElement && p.parentElement.tagName.toLowerCase()) || null }))
  return { tree, portals }
}

const flat = (n, out = []) => {
  out.push(n)
  for (const k of n.children ?? []) flat(k, out)
  return out
}

const specs = new Map()
async function loadSpec(component) {
  if (specs.has(component)) return specs.get(component)
  const file = path.join(SPEC_DIR, `${component.toLowerCase()}.spec.json`)
  const spec = JSON.parse(await fsp.readFile(file, 'utf8'))
  specs.set(component, spec)
  return spec
}

/** 通用规则：由 spec 推导，实现无关 */
function genericChecks(snap, spec) {
  const fails = []
  const rootClass = spec.anatomy.root.class
  const parts = Object.entries(spec.anatomy.parts ?? {})
  const allowed = new Map()
  allowed.set(rootClass, { name: 'root', ...spec.anatomy.root })
  for (const [name, p] of parts) allowed.set(p.class, { name, ...p })

  const all = [...flat(snap.tree), ...snap.portals.flatMap((p) => flat(p.tree))]

  const roots = all.filter((n) => n.classes.includes(rootClass))
  if (roots.length !== 1) fails.push(`根节点必须恰好 1 个，实际 ${roots.length}`)

  const rootTags = Array.isArray(spec.anatomy.root.tag) ? spec.anatomy.root.tag : [spec.anatomy.root.tag]
  if (roots[0] && !rootTags.includes(roots[0].tag)) {
    fails.push(`根节点标签应为 ${rootTags.join(' | ')}，实际 <${roots[0].tag}>`)
  }

  const GEOMETRY_PROPS = new Set([
    'width', 'min-width', 'max-width', 'height', 'max-height',
    'left', 'top', 'right', 'bottom', 'inset', 'inset-inline-start', 'inset-inline-end', 'transform',
  ])

  for (const n of all) {
    const where = `<${n.tag}${n.classes.length ? '.' + n.classes.join('.') : ''}>`

    for (const c of n.classes) {
      if (/^(is|has)-/.test(c)) fails.push(`${where} 出现状态类名 ${c}`)
      if (c.startsWith('ant-') || c.startsWith('css-')) fails.push(`${where} 出现外部实现类名 ${c}`)
    }

    const decl = n.classes.map((c) => allowed.get(c)).find(Boolean)
    if (!decl) continue

    if (n.inlineStyle !== null) {
      if (decl.portal === true) {
        // portal 部件允许几何内联样式（宽高与定位），但不许夹带视觉属性
        const props = n.inlineStyle
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => s.split(':')[0].trim())
        const bad = props.filter((p) => !GEOMETRY_PROPS.has(p))
        if (bad.length) {
          fails.push(`${where} 的 portal 内联样式只允许几何属性，出现了：${bad.join(', ')}`)
        }
      } else {
        fails.push(`${where} 使用内联 style（协议禁止用 style 表达状态或样式）`)
      }
    }

    const declaredData = Object.keys(decl.data ?? {})
    const mirror = decl.mirror ?? []

    for (const [key, value] of Object.entries(n.attrs)) {
      if (!key.startsWith('data-')) continue
      const bare = key.slice(5)
      if (!declaredData.includes(bare) && !mirror.includes(bare)) {
        fails.push(`${where} 的 ${key} 未在协议（${decl.name}）中声明`)
        continue
      }
      const rule = decl.data?.[bare]
      if (!rule) continue
      if (rule.kind === 'boolean' && value !== 'true') {
        fails.push(`${where} 的 ${key}="${value}"，布尔值必须为 "true"`)
      }
      if (rule.enum && !rule.enum.includes(value)) {
        fails.push(`${where} 的 ${key}="${value}" 不在枚举 [${rule.enum.join(', ')}] 内`)
      }
    }

    for (const [bare, rule] of Object.entries(decl.data ?? {})) {
      if (rule.required && n.attrs[`data-${bare}`] === undefined) {
        fails.push(`${where} 缺少必填属性 data-${bare}`)
      }
    }

    const has = (k) => n.attrs[`data-${k}`] === 'true'
    const sub = flat(n)
    if (has('disabled') && !sub.some((x) => x.attrs.disabled !== undefined || x.attrs['aria-disabled'] === 'true')) {
      fails.push(`${where} 有 data-disabled，但自身与后代都没有原生 disabled 或 aria-disabled`)
    }
    if (has('invalid') && n.attrs['aria-invalid'] !== 'true') fails.push(`${where} 有 data-invalid，缺 aria-invalid`)
    if (has('loading') && n.attrs['aria-busy'] !== 'true') fails.push(`${where} 有 data-loading，缺 aria-busy`)
    if (has('selected') && n.attrs['aria-selected'] !== 'true') fails.push(`${where} 有 data-selected，缺 aria-selected`)
    if (has('pressed') && n.attrs['aria-pressed'] !== 'true') fails.push(`${where} 有 data-pressed，缺 aria-pressed`)
    if (n.attrs['data-state'] === 'open' && n.attrs['aria-expanded'] !== undefined && n.attrs['aria-expanded'] !== 'true') {
      fails.push(`${where} 的 data-state="open" 与 aria-expanded 不一致`)
    }
  }

  // 引用完整性：aria-controls / aria-activedescendant / aria-owns 必须指向存在的节点
  const ids = new Set(all.map((n) => n.attrs.id).filter(Boolean))
  for (const n of all) {
    for (const key of ['aria-controls', 'aria-activedescendant', 'aria-owns']) {
      const v = n.attrs[key]
      if (v && !ids.has(v)) fails.push(`<${n.tag}> 的 ${key}="${v}" 指向不存在的节点`)
    }
  }

  // option 单节点：不允许"ARIA 镜像"另起一份 role=option
  const roleOptions = all.filter((n) => n.attrs.role === 'option')
  const classOptions = all.filter((n) => n.classes.some((c) => c.endsWith('__option')))
  for (const n of roleOptions) {
    if (!n.classes.some((c) => c.endsWith('__option'))) {
      fails.push(`<${n.tag}> 是 role="option" 但不带协议 option 类名（禁止 ARIA 镜像节点）`)
    }
  }
  if (roleOptions.length !== classOptions.length) {
    fails.push(`role="option" 节点数 ${roleOptions.length} 与协议 option 节点数 ${classOptions.length} 不一致`)
  }

  return fails
}

/**
 * 自检：拿一批"故意写错"的 DOM 喂给通用规则，确认校验器真的会报错。
 * 没有这一步，"22/22 全绿"可能只是校验器什么都没查。
 */
const SELFTEST_FIXTURES = [
  {
    name: '状态类名',
    component: 'Button',
    html: `<button class="av-btn is-loading" data-variant="default" data-size="md" data-shape="default"><span class="av-btn__label">x</span></button>`,
    expect: ['is-loading'],
  },
  {
    name: '未声明的 data',
    component: 'Button',
    html: `<button class="av-btn" data-variant="default" data-size="md" data-shape="default" data-foo="1"><span class="av-btn__label">x</span></button>`,
    expect: ['data-foo'],
  },
  {
    name: '内联 style',
    component: 'Button',
    html: `<button class="av-btn" style="color:red" data-variant="default" data-size="md" data-shape="default"><span class="av-btn__label">x</span></button>`,
    expect: ['内联 style'],
  },
  {
    name: 'loading 缺 aria-busy',
    component: 'Button',
    html: `<button class="av-btn" data-variant="default" data-size="md" data-shape="default" data-loading="true"><span class="av-btn__label">x</span></button>`,
    expect: ['aria-busy'],
  },
  {
    name: 'ARIA 镜像 option + 悬空引用',
    component: 'Select',
    html: `<div class="av-select" data-variant="outlined" data-size="md" data-status="default" data-state="open">
      <div class="av-select__control">
        <span class="av-select__search"><input class="av-select__input" role="combobox" aria-expanded="true" aria-controls="missing-id" /></span>
      </div>
      <div class="av-select__dropdown" data-state="open">
        <div class="av-select__listbox" role="listbox" id="lb">
          <div role="option" aria-selected="false" id="mirror-1"></div>
          <div class="av-select__option" role="option" aria-selected="false" id="opt-1"></div>
        </div>
      </div>
    </div>`,
    expect: ['指向不存在的节点', 'ARIA 镜像', '不一致'],
  },
  {
    name: 'icon 嵌在 label 内部',
    component: 'Button',
    html: `<button class="av-btn" data-variant="default" data-size="md" data-shape="default"><span class="av-btn__label"><span class="av-btn__icon" aria-hidden="true"></span>提交</span></button>`,
    assert: [{ k: 'childOf', on: 'icon', of: 'root' }],
    expect: ['直接子节点'],
  },
  {
    name: '浮层未 portal 到 body',
    component: 'Select',
    html: `<div class="av-select" data-variant="outlined" data-size="md" data-status="default" data-state="open">
      <div class="av-select__control">
        <span class="av-select__search"><input class="av-select__input" role="combobox" aria-expanded="true" aria-controls="lb" /></span>
      </div>
      <div class="av-select__dropdown" data-state="open">
        <div class="av-select__listbox" role="listbox" id="lb"></div>
      </div>
    </div>`,
    assert: [{ k: 'parentIsBody', on: 'dropdown' }],
    expect: ['不在 portal 子树中'],
  },
]

async function runSelftest(page, base) {
  console.log('selftest: 确认校验器会拒绝错误实现')
  let ok = 0
  for (const f of SELFTEST_FIXTURES) {
    await page.goto(`${base}ref.html`, { waitUntil: 'load' })
    await page.waitForSelector('[data-case-root] > *', { timeout: 20000 })
    await page.evaluate((html) => {
      const root = document.querySelector('[data-case-root]')
      if (root) root.innerHTML = html
    }, f.html)

    const snap = await page.evaluate(snapshotFn)
    const spec = await loadSpec(f.component)
    const ctx = makeContext(snap, spec)
    const messages = [...genericChecks(snap, spec)]
    for (const a of f.assert ?? []) {
      const r = evalAssertion(a, ctx)
      if (r) messages.push(r)
    }
    const joined = messages.join('\n')
    const missing = f.expect.filter((e) => !joined.includes(e))

    if (missing.length) {
      console.log(`  ✗ ${f.name} —— 未报出：${missing.join(' / ')}`)
      console.log(`      实际报错：${joined || '（无）'}`)
    } else {
      ok += 1
      console.log(`  ✓ ${f.name} 被正确拒绝`)
    }
  }
  console.log('')
  console.log(`selftest: ${ok}/${SELFTEST_FIXTURES.length} 通过`)
  if (ok !== SELFTEST_FIXTURES.length) process.exitCode = 1
}

function makeContext(snap, spec) {
  const all = [...flat(snap.tree), ...snap.portals.flatMap((p) => flat(p.tree))]
  const parents = new Map()
  const link = (n) => {
    for (const c of n.children ?? []) {
      parents.set(c, n)
      link(c)
    }
  }
  link(snap.tree)
  for (const p of snap.portals) link(p.tree)

  const rootClass = spec.anatomy.root.class
  const root = all.find((n) => n.classes.includes(rootClass))
  const partEls = (name) => {
    const p = spec.anatomy.parts?.[name]
    if (!p) throw new Error(`用例引用了协议里不存在的部件：${name}`)
    return all.filter((n) => n.classes.includes(p.class))
  }
  const pick = (on, index) => {
    if (!on || on === 'root') return root
    const els = partEls(on)
    return index === undefined ? els[0] : els[index]
  }
  return { all, spec, root, partEls, pick, snap, parents }
}

function evalAssertion(a, ctx) {
  const { pick, partEls } = ctx
  switch (a.k) {
    case 'part': {
      const els = partEls(a.name)
      const want = a.count ?? 1
      if (a.count === undefined) return els.length >= 1 ? null : `缺少部件 ${a.name}`
      return els.length === want ? null : `部件 ${a.name} 数量应为 ${want}，实际 ${els.length}`
    }
    case 'absent': {
      const els = partEls(a.name)
      return els.length === 0 ? null : `不应出现的部件 ${a.name} 出现了 ${els.length} 次`
    }
    case 'data': {
      const el = pick(a.on, a.index)
      if (!el) return `找不到断言目标 ${a.on ?? 'root'}`
      const v = el.attrs[`data-${a.key}`]
      return v === a.value ? null : `${a.on ?? 'root'} 的 data-${a.key} 期望 "${a.value}"，实际 ${v === undefined ? '缺失' : `"${v}"`}`
    }
    case 'noData': {
      const el = pick(a.on, a.index)
      if (!el) return `找不到断言目标 ${a.on ?? 'root'}`
      const v = el.attrs[`data-${a.key}`]
      return v === undefined ? null : `${a.on ?? 'root'} 不应有 data-${a.key}，实际 "${v}"`
    }
    case 'attr': {
      const el = pick(a.on, a.index)
      if (!el) return `找不到断言目标 ${a.on ?? 'root'}`
      const v = el.attrs[a.key]
      if (a.value === undefined) return v !== undefined ? null : `${a.on ?? 'root'} 缺少属性 ${a.key}`
      return v === a.value ? null : `${a.on ?? 'root'} 的属性 ${a.key} 期望 "${a.value}"，实际 ${v === undefined ? '缺失' : `"${v}"`}`
    }
    case 'noAttr': {
      const el = pick(a.on, a.index)
      if (!el) return `找不到断言目标 ${a.on ?? 'root'}`
      return el.attrs[a.key] === undefined ? null : `${a.on ?? 'root'} 不应有属性 ${a.key}`
    }
    case 'childOf': {
      const el = pick(a.on)
      if (!el) return `找不到断言目标 ${a.on}`
      const parent = pick(a.of)
      if (!parent) return `找不到父级 ${a.of}`
      return ctx.parents.get(el) === parent ? null : `${a.on} 必须是 ${a.of} 的直接子节点`
    }
    case 'parentIsBody': {
      const el = pick(a.on)
      if (!el) return `找不到断言目标 ${a.on}`
      const entry = ctx.snap.portals.find((p) => p.tree === el)
      if (!entry) return `${a.on} 不在 portal 子树中`
      return entry.parentTag === 'body' ? null : `${a.on} 的父节点应为 body，实际 <${entry.parentTag}>`
    }
    case 'order': {
      const before = partEls(a.before)[0]
      const after = partEls(a.after)[0]
      if (!before) return `排序断言缺少部件 ${a.before}`
      if (!after) return `排序断言缺少部件 ${a.after}`
      return ctx.all.indexOf(before) < ctx.all.indexOf(after) ? null : `${a.before} 应出现在 ${a.after} 之前`
    }
    case 'text': {
      const el = pick(a.on, a.index)
      if (!el) return `找不到断言目标 ${a.on ?? 'root'}`
      return el.text === a.value ? null : `${a.on ?? 'root'} 文本期望 "${a.value}"，实际 "${el.text}"`
    }
    default:
      return `未知断言类型 ${a.k}`
  }
}

async function main() {
  await fsp.access(path.join(DIST, 'ref.html')).catch(() => {
    throw new Error('未找到 dist/ref.html，请先 pnpm build')
  })

  const { server, port } = await startServer()
  const base = `http://127.0.0.1:${port}/`
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: 'zh-CN' })
  const page = await context.newPage()
  page.on('pageerror', (err) => console.error(`  [pageerror] ${err.message}`))

  await page.goto(`${base}ref.html`, { waitUntil: 'load' })
  await page.waitForSelector('[data-case-root] > *', { timeout: 20000 })

  if (process.argv.includes('--selftest')) {
    await runSelftest(page, base)
    await browser.close()
    await new Promise((r) => server.close(r))
    return
  }

  const cases = await page.evaluate(() => window.__CONFORMANCE__)
  if (!Array.isArray(cases) || !cases.length) throw new Error('ref 页面没有暴露 __CONFORMANCE__')

  let pass = 0
  const failed = []

  for (const c of cases) {
    await page.goto(`${base}ref.html?case=${encodeURIComponent(c.id)}`, { waitUntil: 'load' })
    await page.waitForSelector('[data-case-root] > *', { timeout: 20000 })

    for (const a of c.actions ?? []) {
      if (a.type === 'focus') await page.focus(a.selector)
      else if (a.type === 'press') await page.keyboard.press(a.key)
      else if (a.type === 'click') await page.click(a.selector)
    }
    await page.waitForTimeout(60)

    const snap = await page.evaluate(snapshotFn)
    const spec = await loadSpec(c.component)
    const ctx = makeContext(snap, spec)

    const failures = [...genericChecks(snap, spec)]
    for (const a of c.assert) {
      const r = evalAssertion(a, ctx)
      if (r) failures.push(r)
    }

    if (failures.length) {
      failed.push({ id: c.id, failures })
      console.log(`  ✗ ${c.id}`)
      for (const f of failures) console.log(`      · ${f}`)
    } else {
      pass += 1
      console.log(`  ✓ ${c.id}`)
    }
  }

  await browser.close()
  await new Promise((r) => server.close(r))

  console.log('')
  console.log(`conformance: ${pass}/${cases.length} passed`)
  if (failed.length) {
    console.log(`failed: ${failed.map((f) => f.id).join(', ')}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
