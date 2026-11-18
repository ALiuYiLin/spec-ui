/**
 * 从 spec 的 requires.inside 推导结构树，输出可直接粘进文档的 markdown 表格。
 * 层级由脚本计算，避免手写时数错（card 的 title 是第 4 层，手工写曾写成第 3 层）。
 *
 * 用法：node spec-tree.mjs --component=Card
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..')
const SPEC_DIR = path.join(ROOT, 'spec', 'components')

const argv = process.argv.slice(2)
const component = (argv.find((a) => a.startsWith('--component=')) ?? '').slice('--component='.length)
if (!component) {
  console.error('用法：node spec-tree.mjs --component=Card')
  process.exit(1)
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const spec = JSON.parse(fs.readFileSync(path.join(SPEC_DIR, `${kebab(component)}.spec.json`), 'utf8'))
const parts = spec.anatomy.parts ?? {}
const rootClass = spec.anatomy.root.class

/** 每个部件的父级：requires.inside，缺省是 root */
const parentOf = (name) => parts[name]?.requires?.inside ?? 'root'

/** 声明顺序作为同级排序（parts 对象的键顺序） */
const order = new Map(Object.keys(parts).map((name, i) => [name, i]))

const children = new Map()
for (const name of Object.keys(parts)) {
  const parent = parentOf(name)
  if (!children.has(parent)) children.set(parent, [])
  children.get(parent).push(name)
}
for (const list of children.values()) list.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))

/** 深度优先展开成 [name, level] 列表，root 记为第 0 层 */
const rows = []
const walk = (name, level) => {
  rows.push([name, level])
  for (const child of children.get(name) ?? []) walk(child, level + 1)
}
walk('root', 0)

const maxLevel = Math.max(...rows.map(([, level]) => level))
const label = (name) => (name === 'root' ? rootClass : (parts[name]?.class ?? name))

// 说明列
const note = (name) => {
  if (name === 'root') return '根'
  const part = parts[name] ?? {}
  const req = part.required ? '必填' : '可选'
  const cond = part.condition ? `：${part.condition}` : ''
  return `${req}${cond}`
}

// 生成 markdown 表格
// 列数 = 最深层级 + 1（root 占第 1 列）
const columns = maxLevel + 1
const header = [...Array.from({ length: columns }, (_, i) => `第 ${i + 1} 层`), '说明']
const lines = [`| ${header.join(' | ')} |`, `|${header.map(() => '---').join('|')}|`]
for (const [name, level] of rows) {
  const cells = Array.from({ length: columns }, (_, i) => (i === level ? `\`${label(name)}\`` : ' '))
  lines.push(`| ${cells.join(' | ')} | ${note(name)} |`)
}

console.log(lines.join('\n'))
console.log(`\n深度：${columns} 层（root 记作第 1 层）`)
