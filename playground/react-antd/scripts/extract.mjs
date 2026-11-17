import http from 'node:http'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { STYLE_PROPS, kebab } from './props.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, '..')
const DIST = path.join(PKG_ROOT, 'dist')
/** --theme=dark 时采集暗色证据，单独落到 artifacts-dark/，不覆盖亮色基线 */
const THEME = (process.argv.find((a) => a.startsWith('--theme=')) ?? '--theme=light').slice('--theme='.length)
const THEME_QUERY = THEME === 'dark' ? '&theme=dark' : ''
const ARTIFACTS = path.resolve(PKG_ROOT, '..', '..', THEME === 'dark' ? 'artifacts-dark' : 'artifacts')
const VIEWPORT = { width: 1280, height: 800 }

const PSEUDOS = ['::before', '::after']
const PORTAL_SELECTOR = '.case-portal'

const KILL_ANIM = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;}`

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
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

const snapshotFn = ({ props, pseudos, portalSelector }) => {
  const root = document.querySelector('[data-case-root]')
  const el = root && root.firstElementChild
  if (!el) return null

  const read = (cs) => {
    const out = {}
    for (const p of props) out[p] = cs.getPropertyValue(p)
    return out
  }

  const walk = (node) => {
    const cs = getComputedStyle(node)
    const box = node.getBoundingClientRect()
    const attrs = {}
    for (const a of node.attributes) {
      if (a.name === 'class' || a.name === 'style') continue
      attrs[a.name] = a.value
    }
    const ownText = Array.from(node.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent || '')
      .join('')
      .trim()

    const out = {
      tag: node.tagName.toLowerCase(),
      classes: Array.from(node.classList),
      attrs,
      rect: {
        x: +box.x.toFixed(2),
        y: +box.y.toFixed(2),
        w: +box.width.toFixed(2),
        h: +box.height.toFixed(2),
      },
      style: read(cs),
      ownText,
    }

    const pseudo = {}
    for (const p of pseudos) {
      const pcs = getComputedStyle(node, p)
      const content = pcs.getPropertyValue('content')
      if (content && content !== 'none' && content !== 'normal') pseudo[p] = read(pcs)
    }
    if (Object.keys(pseudo).length) out.pseudo = pseudo

    out.children = Array.from(node.children).map(walk)
    return out
  }

  const tree = walk(el)
  const portals = []
  if (portalSelector) {
    for (const p of document.querySelectorAll(portalSelector)) {
      if (el.contains(p) || p.contains(el)) continue
      portals.push(walk(p))
    }
  }
  return { tree, portals }
}

async function readJson(file) {
  return JSON.parse(await fsp.readFile(file, 'utf8'))
}

const countNodes = (n) => 1 + (n.children ?? []).reduce((acc, k) => acc + countNodes(k), 0)

async function main() {
  await fsp.access(path.join(DIST, 'index.html')).catch(() => {
    throw new Error(`未找到 dist/index.html，请先运行 pnpm build（查找路径：${DIST}）`)
  })

  const antdVersion = (await readJson(path.join(PKG_ROOT, 'node_modules', 'antd', 'package.json'))).version
  const reactVersion = (await readJson(path.join(PKG_ROOT, 'node_modules', 'react', 'package.json'))).version

  const { server, port } = await startServer()
  const base = `http://127.0.0.1:${port}/`
  console.log(`static server  ${base}`)
  console.log(`artifacts      ${ARTIFACTS}`)

  let browser
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true })
    console.log('browser        chrome')
  } catch (err) {
    console.warn(`chrome 启动失败（${err.message}），回退 msedge`)
    browser = await chromium.launch({ channel: 'msedge', headless: true })
    console.log('browser        msedge')
  }

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: 'zh-CN',
  })
  await context.addInitScript((css) => {
    const inject = () => {
      const style = document.createElement('style')
      style.setAttribute('data-extract', 'kill-anim')
      style.textContent = css
      document.head && document.head.appendChild(style)
    }
    if (document.head) inject()
    else document.addEventListener('DOMContentLoaded', inject)
  }, KILL_ANIM)

  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  page.on('pageerror', (err) => console.error(`  [pageerror] ${err.message}`))

  await page.goto(base, { waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('[data-case-root] > *') || document.body.querySelector('[class^="sm-"], [class*=" sm-"]'), { timeout: 20000 })
  const cases = await page.evaluate(() => window.__SPECMARK_CASES__)
  if (!Array.isArray(cases) || !cases.length) throw new Error('页面没有暴露 __SPECMARK_CASES__，检查 App.tsx')

  const source = {
    lib: 'antd',
    version: antdVersion,
    react: reactVersion,
    browser: `Chromium/${browser.version()}`,
    ua: await page.evaluate(() => navigator.userAgent),
    viewport: VIEWPORT,
    dpr: 1,
    locale: 'zh-CN',
  }

  const byComponent = new Map()
  const failures = []

  for (const c of cases) {
    const outDir = path.join(ARTIFACTS, kebab(c.component))
    await fsp.mkdir(outDir, { recursive: true })
    if (!byComponent.has(c.component)) byComponent.set(c.component, { dir: outDir, cases: [] })

    const t0 = Date.now()
    try {
      await page.goto(`${base}?case=${encodeURIComponent(c.id)}${THEME_QUERY}`, { waitUntil: 'load' })
      await page.waitForFunction(() => document.querySelector('[data-case-root] > *') || document.body.querySelector('[class^="sm-"], [class*=" sm-"]'), { timeout: 20000 })
      await page.evaluate(() => document.fonts.ready.then(() => undefined))

      for (const a of c.actions ?? []) {
        if (a.type === 'focus') await page.focus(a.selector)
        else if (a.type === 'press') await page.keyboard.press(a.key)
        else if (a.type === 'click') await page.click(a.selector)
      }
      // 交互后给 React 一个确定的落地窗口：focus 事件 → 状态更新 → 类名/DOM 变更
      // 只等 rAF 会偶发抓不到 ant-select-focused（实测过一次丢焦点）。
      if ((c.actions ?? []).length) await page.waitForTimeout(80)
      if (c.portal) {
        await page.waitForSelector(PORTAL_SELECTOR, { state: 'attached', timeout: 10000 })
      }

      let forced = []
      if (c.pseudo.length) {
        const { root } = await cdp.send('DOM.getDocument', { depth: 0 })
        const { nodeId } = await cdp.send('DOM.querySelector', {
          nodeId: root.nodeId,
          selector: '[data-case-root] > *',
        })
        if (nodeId) {
          await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: c.pseudo })
          forced = c.pseudo
        }
      }

      await page.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined)))),
      )

      const snap = await page.evaluate(snapshotFn, {
        props: STYLE_PROPS,
        pseudos: PSEUDOS,
        portalSelector: PORTAL_SELECTOR,
      })
      if (!snap) throw new Error('快照为空：找不到 [data-case-root] > *')

      // 截图失败不应丢掉证据：Modal 这类全屏浮层的根节点可能零尺寸
      let portalPng = null
      try {
        const rootHandle = await page.$('[data-case-root] > *')
        if (rootHandle) {
          await rootHandle.screenshot({ path: path.join(outDir, `${c.id}.png`), animations: 'disabled' })
        }
        const portalHandle = await page.$(PORTAL_SELECTOR)
        if (portalHandle) {
          portalPng = `${c.id}.portal.png`
          await portalHandle.screenshot({ path: path.join(outDir, portalPng), animations: 'disabled' })
        }
      } catch (err) {
        console.warn(`  ! 截图失败（证据仍保留）：${c.id} ${err instanceof Error ? err.message.split('\n')[0] : err}`)
      }

      const record = {
        component: c.component,
        caseId: c.id,
        state: c.state,
        pseudoForced: forced,
        actions: c.actions ?? [],
        source,
        tree: snap.tree,
        portals: snap.portals,
      }
      await fsp.writeFile(path.join(outDir, `${c.id}.json`), JSON.stringify(record, null, 2), 'utf8')

      byComponent.get(c.component).cases.push({
        id: c.id,
        state: c.state,
        pseudoForced: forced,
        portal: Boolean(c.portal),
        nodes: countNodes(snap.tree),
        portalNodes: snap.portals.map(countNodes),
        rootClass: snap.tree.classes.filter((x) => x.startsWith('ant-')).join(' '),
        json: `${c.id}.json`,
        screenshot: `${c.id}.png`,
        portalScreenshot: portalPng,
        ms: Date.now() - t0,
      })

      console.log(
        `  ✓ ${c.id.padEnd(30)} nodes=${String(countNodes(snap.tree)).padEnd(3)} portals=${snap.portals.length}  ${
          Date.now() - t0
        }ms`,
      )
    } catch (err) {
      failures.push({ id: c.id, error: String(err && err.message ? err.message : err) })
      console.error(`  ✗ ${c.id}  ${err && err.message ? err.message : err}`)
    }
  }

  for (const [component, group] of byComponent) {
    const manifest = {
      component,
      source,
      capturedAt: new Date().toISOString(),
      styleProps: STYLE_PROPS,
      cases: group.cases,
      failures: failures.filter((f) => group.cases.every((c) => c.id !== f.id)),
    }
    await fsp.writeFile(path.join(group.dir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
  }

  await browser.close()
  await new Promise((r) => server.close(r))

  const ok = [...byComponent.values()].reduce((n, g) => n + g.cases.length, 0)
  console.log('')
  console.log(`captured ${ok}/${cases.length}${failures.length ? `, failed ${failures.length}` : ''}`)
  if (failures.length) {
    for (const f of failures) console.error(`  - ${f.id}: ${f.error}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
