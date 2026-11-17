import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.')
const map = JSON.parse(fs.readFileSync('antd-map.json', 'utf8'))

// ---------- A. 诊断 clear ----------
console.log('=== Input 的映射 ===')
for (const [part, entry] of Object.entries(map.Input ?? {})) console.log(' ', part, '→', entry.antd)

const rec = JSON.parse(fs.readFileSync('artifacts/input/input-clear.json', 'utf8'))
const flat = (n, out = []) => {
  out.push(n)
  for (const c of n.children ?? []) flat(c, out)
  return out
}
const nodes = flat(rec.tree)
const clear = nodes.find((n) => (n.classes ?? []).includes('ant-input-clear-icon'))
console.log('\n=== 证据里的 clear 节点 ===')
console.log(clear ? `${clear.tag} ${clear.classes.join(' ')}` : '没找到 ant-input-clear-icon')
console.log(
  '同文件里含 clear 的类名：',
  [...new Set(nodes.flatMap((n) => (n.classes ?? []).filter((c) => c.includes('clear'))))].join(', ') || '(无)',
)

// ---------- B. 列出 spec 里缺映射的部件 ----------
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const specDir = 'spec/components'
const gaps = []

for (const file of fs.readdirSync(specDir).filter((f) => f.endsWith('.spec.json'))) {
  const spec = JSON.parse(fs.readFileSync(path.join(specDir, file), 'utf8'))
  const component = spec.component
  const mapped = map[component] ?? {}
  const parts = Object.keys(spec.anatomy.parts ?? {})
  const missing = parts.filter((p) => !mapped[p])
  if (missing.length) gaps.push({ component, missing })
}

console.log('\n=== 缺映射的部件 ===')
for (const g of gaps) console.log(` ${g.component}: ${g.missing.join(', ')}`)
console.log(`\n合计 ${gaps.reduce((n, g) => n + g.missing.length, 0)} 个部件缺映射`)
