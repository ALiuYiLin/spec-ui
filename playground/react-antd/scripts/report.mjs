import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTIFACTS = path.resolve(__dirname, '..', '..', '..', 'artifacts')

const readJson = async (f) => JSON.parse(await fsp.readFile(f, 'utf8'))
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m])

const STYLE = `
  :root { color-scheme: light dark; }
  body { margin: 0; padding: 32px; font: 14px/1.6 ui-sans-serif, system-ui, "Segoe UI", sans-serif;
         background: Canvas; color: CanvasText; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 15px; margin: 32px 0 12px; opacity: .8; }
  a { color: inherit; }
  .meta { opacity: .6; font-size: 12px; font-family: ui-monospace, monospace; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .card { margin: 0; border: 1px solid color-mix(in srgb, CanvasText 15%, transparent);
          border-radius: 10px; overflow: hidden; background: Canvas; }
  .shot { display: flex; align-items: center; justify-content: center; min-height: 88px;
          padding: 16px; background: #fff; gap: 8px; flex-wrap: wrap; }
  .shot img { max-width: 100%; }
  figcaption { padding: 8px 10px; border-top: 1px solid color-mix(in srgb, CanvasText 12%, transparent); }
  figcaption b { font-size: 12px; display: block; font-weight: 600; }
  .tag { display: inline-block; font-size: 11px; opacity: .65; }
  code { display: block; font-size: 11px; opacity: .55; word-break: break-all; }
`

const dirs = (await fsp.readdir(ARTIFACTS, { withFileTypes: true })).filter((d) => d.isDirectory())

const hub = []

for (const d of dirs) {
  const dir = path.join(ARTIFACTS, d.name)
  let manifest
  try {
    manifest = await readJson(path.join(dir, 'manifest.json'))
  } catch {
    continue
  }

  const rows = []
  for (const c of manifest.cases) {
    const r = await readJson(path.join(dir, c.json))
    rows.push({ c, r, s: r.tree.style })
  }

  const card = ({ c, r, s }) => `
    <figure class="card">
      <div class="shot">
        <img src="${esc(c.screenshot)}" alt="${esc(c.id)}" loading="lazy">
        ${c.portalScreenshot ? `<img src="${esc(c.portalScreenshot)}" alt="${esc(c.id)} portal" loading="lazy">` : ''}
      </div>
      <figcaption>
        <b>${esc(c.id)}</b>
        <span class="tag">${esc(c.state)}${c.pseudoForced.length ? ' · ' + c.pseudoForced.join('+') : ''}${
          c.portal ? ' · portal' : ''
        }</span>
        <code>${esc(
          [
            s['background-color'],
            s['color'],
            s['border-top-color'],
            s['border-top-left-radius'],
            s['outline-style'] === 'none' ? '' : `${s['outline-width']} ${s['outline-color']}`,
            `${Math.round(r.tree.rect.w)}×${Math.round(r.tree.rect.h)}`,
          ]
            .filter(Boolean)
            .join(' · '),
        )}</code>
      </figcaption>
    </figure>`

  const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>${esc(manifest.component)} 证据 · antd ${esc(manifest.source.version)}</title>
<style>${STYLE}</style></head><body>
<p><a href="../index.html">← 全部组件</a></p>
<h1>${esc(manifest.component)} · 证据快照</h1>
<div class="meta">antd ${esc(manifest.source.version)} · react ${esc(manifest.source.react)} · ${esc(
    manifest.source.browser,
  )} · ${manifest.source.viewport.width}×${manifest.source.viewport.height} @${manifest.source.dpr}x · ${esc(
    manifest.capturedAt,
  )}</div>

<h2>静态度（无强制伪类）</h2>
<div class="grid">${rows.filter((x) => !x.c.pseudoForced.length && !x.c.actions?.length).map(card).join('')}</div>

<h2>交互 / 行为态</h2>
<div class="grid">${rows.filter((x) => x.c.pseudoForced.length || x.c.actions?.length).map(card).join('')}</div>
</body></html>`

  await fsp.writeFile(path.join(dir, 'index.html'), html, 'utf8')
  hub.push({ component: manifest.component, dir: d.name, count: manifest.cases.length, version: manifest.source.version })
  console.log(`wrote ${path.join(dir, 'index.html')}  (${rows.length} cases)`)
}

const hubHtml = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>ActView 证据</title>
<style>${STYLE}</style></head><body>
<h1>ActView · 证据索引</h1>
<div class="grid">${hub
  .map(
    (h) => `<figure class="card"><div class="shot" style="min-height:60px"><b style="font-size:16px">${esc(
      h.component,
    )}</b></div><figcaption><b><a href="${esc(h.dir)}/index.html">${esc(h.component)}</a></b><span class="tag">${
      h.count
    } 个状态</span><code>antd ${esc(h.version)}</code></figcaption></figure>`,
  )
  .join('')}</div>
</body></html>`

await fsp.writeFile(path.join(ARTIFACTS, 'index.html'), hubHtml, 'utf8')
console.log(`wrote ${path.join(ARTIFACTS, 'index.html')}`)
