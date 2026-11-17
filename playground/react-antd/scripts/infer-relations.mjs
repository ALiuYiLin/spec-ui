/**
 * 关系推断器：从 antd 证据（artifacts）反推协议的 requires 草稿。
 *
 * 部件映射来自 visual-diff.mjs 里的 RESOLVE 表（那是「我们的部件 ↔ antd 类名」的唯一真相）。
 * 只做「跨用例一致」的推断：同一部件在不同用例里祖先不同，就标为待裁决，不猜。
 *
 * 用法：node infer-relations.mjs --component=Tag [--write]
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.')
const ARTIFACTS = path.join(ROOT, 'artifacts')
const SPEC_DIR = path.join(ROOT, 'spec', 'components')
const DIFF_PATH = path.join(ROOT, 'playground', 'react-antd', 'scripts', 'visual-diff.mjs')

const argv = process.argv.slice(2)
const component = (argv.find((a) => a.startsWith('--component=')) ?? '').slice('--component='.length)
const write = argv.includes('--write')
if (!component) {
  console.error('用法：node infer-relations.mjs --component=Tag [--write]')
  process.exit(1)
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const slug = kebab(component)

const spec = JSON.parse(fs.readFileSync(path.join(SPEC_DIR, `${slug}.spec.json`), 'utf8'))

// ---------- 从 RESOLVE 里取「部件 → antd 类名」 ----------
function readResolve(component) {
  const src = fs.readFileSync(DIFF_PATH, 'utf8')
  const start = src.indexOf(`  ${component}: {`)
  if (start < 0) return null

  // 先按 4 空格缩进的 key 切块（root / 各部件），再只从 antd 那一行取类名
  let depth = 0
  let end = start
  for (let i = src.indexOf('{', start); i < src.length; i += 1) {
    if (src[i] === '{') depth += 1
    else if (src[i] === '}') {
      depth -= 1
      if (depth === 0) {
        end = i
        break
      }
    }
  }

  const body = src.slice(start, end)
  const chunks = body.split(/\n    (\w+): \{/)
  const map = {}
  for (let i = 1; i < chunks.length; i += 2) {
    const name = chunks[i]
    const chunk = chunks[i + 1] ?? ''
    const antdIdx = chunk.indexOf('antd:')
    if (antdIdx < 0) continue
    const antdPart = chunk.slice(antdIdx)
    const byClass = antdPart.match(/classes\.includes\('([^']+)'\)/)
    const byDesc = antdPart.match(/hasDescendantClass\([^,]+,\s*'([^']+)'\)/)
    const cls = byClass?.[1] ?? byDesc?.[1]
    if (cls) map[name] = cls
  }
  return map
}

const antdMap = readResolve(component) ?? {}
const rootAntdClass = antdMap.root
const antdToPart = new Map()
for (const [name, cls] of Object.entries(antdMap)) {
  if (name === 'root' || !cls) continue
  antdToPart.set(cls, name)
}

if (!rootAntdClass) {
  console.error(`${component}: visual-diff 的 RESOLVE 里没有 root 映射`)
  process.exit(1)
}

// ---------- 读证据 ----------
const artifactDir = path.join(ARTIFACTS, slug)
const files = fs
  .readdirSync(artifactDir)
  .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
if (!files.length) {
  console.error(`${slug} 没有证据`)
  process.exit(1)
}

const flat = (n, out = [], parent = null) => {
  out.push({ node: n, parent })
  for (const c of n.children ?? []) flat(c, out, n)
  return out
}

const observations = new Map()
const note = (name, caseId, key, value) => {
  if (!observations.has(name)) observations.set(name, {})
  const row = observations.get(name)
  row[key] = row[key] ?? new Map()
  row[key].set(caseId, value)
}

let caseCount = 0
for (const file of files) {
  const record = JSON.parse(fs.readFileSync(path.join(artifactDir, file), 'utf8'))
  const caseId = file.replace(/\.json$/, '')
  caseCount += 1

  const tree = [...flat(record.tree), ...(record.portals ?? []).flatMap((p) => flat(p.tree))]
  const counts = new Map()
  for (const { node } of tree) {
    for (const cls of node.classes ?? []) {
      if (antdToPart.has(cls)) counts.set(cls, (counts.get(cls) ?? 0) + 1)
    }
  }

  for (const { node, parent } of tree) {
    const cls = (node.classes ?? []).find((c) => antdToPart.has(c))
    if (!cls) continue
    const name = antdToPart.get(cls)
    if (!spec.anatomy.parts?.[name] && name !== 'root') continue

    const isPortalRoot = (record.portals ?? []).some((p) => p.tree === node)
    if (isPortalRoot) {
      note(name, caseId, 'attach', 'body')
      continue
    }

    // inside：最近的「已映射部件」祖先，否则 root
    let cur = parent
    let inside = 'root'
    while (cur) {
      if ((cur.classes ?? []).includes(rootAntdClass)) {
        inside = 'root'
        break
      }
      const found = (cur.classes ?? []).find((c) => antdToPart.has(c))
      if (found) {
        inside = antdToPart.get(found)
        break
      }
      cur = cur.parent
    }
    note(name, caseId, 'inside', inside)

    if (parent) {
      const s = parent.style ?? {}
      const display = s.display
      const layout =
        display === 'flex' || display === 'inline-flex'
          ? s['flex-direction'] === 'column'
            ? 'flex-column'
            : 'flex-row'
          : display === 'block'
            ? 'block'
            : display
      note(name, caseId, 'parent', layout)

      const siblings = (parent.children ?? []).filter((child) =>
        (child.classes ?? []).some((c) => antdToPart.has(c)),
      )
      if (siblings.length > 1) {
        const idx = siblings.indexOf(node)
        note(name, caseId, 'lane', `${inside}-row@${idx}`)
      }
    }

    if ((counts.get(cls) ?? 0) > 1) note(name, caseId, 'many', true)
  }
}

const collapse = (map = new Map()) => {
  const values = [...new Set([...map.values()].map(String))]
  return values.length === 1 ? { value: values[0] } : { value: null, conflict: values }
}

const draft = {}
const issues = []
for (const [name, row] of observations) {
  const attach = collapse(row.attach)
  if (attach.value === 'body') {
    draft[name] = { attach: 'body' }
    continue
  }

  const inside = collapse(row.inside)
  const parent = collapse(row.parent)
  const lane = collapse(row.lane)
  const many = collapse(row.many)

  const requires = {}
  if (inside.value) requires.inside = inside.value
  else issues.push(`${name}: inside 不一致（${inside.conflict?.join(' / ')}）`)

  if (lane.value) {
    const [laneName, idx] = lane.value.split('@')
    requires.lane = { name: laneName, order: Number(idx) + 1 }
  }
  if (parent.value && ['flex-row', 'flex-column', 'block'].includes(parent.value)) {
    requires.parent = { layout: parent.value }
  } else if (parent.value) {
    issues.push(`${name}: 父级布局 ${parent.value} 不在已知布局里`)
  }

  const entry = {}
  if (Object.keys(requires).length) entry.requires = requires
  if (many.value === 'true') entry.many = true
  if (Object.keys(entry).length) draft[name] = entry
}

// ---------- 与手写 spec 对比 ----------
const hand = spec.anatomy.parts ?? {}
const diff = []
for (const [name, entry] of Object.entries(draft)) {
  const h = hand[name]?.requires
  const inferredInside = entry.requires?.inside
  const lane = entry.requires?.lane
  if (h) {
    if (inferredInside && h.inside !== inferredInside) {
      diff.push(`${name}: inside 手写=${h.inside} 推断=${inferredInside}`)
    }
  } else if (!hand[name]?.attach) {
    diff.push(`${name}: 手写 spec 里没有 requires（推断有）`)
  }
}
for (const name of Object.keys(hand)) {
  if (!draft[name] && !hand[name].attach) diff.push(`${name}: 推断里没有（手写有）`)
}

for (const name of Object.keys(spec.anatomy.parts ?? {})) {
  if (!draft[name] && !observations.has(name)) {
    issues.push(`${name}: RESOLVE 里没有 antd 映射，无法推断`)
  }
}

const report = { component, cases: caseCount, inferred: Object.keys(draft).length, draft, issues, diff }

if (write) {
  const outPath = path.join(ROOT, 'spec', 'drafts', `${slug}.json`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.log(`写入 ${path.relative(ROOT, outPath)}（${Object.keys(draft).length} 个部件）`)
} else {
  console.log(JSON.stringify(report, null, 2))
}
