/**
 * 文档站截图：起一个只读静态服务器指向 docs/.vitepress/dist，逐个页面截图。
 * 用途是人工复核渲染结果，不进入 verify（需要本机 Chrome）。
 *
 *   node scripts/docs-shots.mjs button input card
 *   node scripts/docs-shots.mjs --dark button input card   # 用暗色令牌截图
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const ROOT = 'docs/.vitepress/dist'
const OUT = 'artifacts/docs-shots'

const argv = process.argv.slice(2)
const dark = argv.includes('--dark')
const PAGES = argv.filter((a) => !a.startsWith('--'))

if (!fs.existsSync(ROOT)) {
  console.error('缺少 docs/.vitepress/dist，先跑 pnpm docs:build')
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const rootAbs = path.resolve(ROOT)
  const filePath = path.resolve(rootAbs, `.${urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath}`)
  if (!filePath.startsWith(rootAbs) || !fs.existsSync(filePath)) {
    res.writeHead(404)
    res.end('not found')
    return
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({
  viewport: { width: 1024, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: dark ? 'dark' : 'light',
})

if (dark) {
  // 组件令牌走 [data-theme='dark']；同时给页面底色，避免白底上叠暗色组件
  await page.addInitScript(() => {
    document.documentElement.dataset.theme = 'dark'
  })
  await page.addStyleTag({ content: 'html { background: #000 !important; }' })
}

for (const name of PAGES) {
  await page.goto(`http://127.0.0.1:${port}/components/${name}.html`, { waitUntil: 'networkidle' })
  if (dark) {
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark'
    })
    await page.addStyleTag({ content: 'html, body { background: #000 !important; }' })
  }
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, `docs-${dark ? 'dark-' : ''}${name}.png`), fullPage: false })
  console.log(`  ✓ ${dark ? 'dark ' : ''}${name}`)
}

await browser.close()
server.close()
console.log(`截图完成 → ${OUT}`)
