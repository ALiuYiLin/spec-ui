import fs from 'node:fs'

const p = 'playground/react-antd/scripts/conformance.mjs'
let c = fs.readFileSync(p, 'utf8')

const from = `    for (const [prop, ref] of Object.entries(decl.box ?? {})) {
      const want = ref?.$token ? tokenValue(ref.$token, size) : ref
      if (!want) continue`

if (!c.includes(from)) throw new Error('令牌校验片段没找到')

const to = `    for (const [prop, ref] of Object.entries(decl.box ?? {})) {
      if (ref?.$token && !SIZE_TOKENS[ref.$token]) {
        fails.push(\`\${name} 的 \${prop} 引用了不存在的尺寸令牌 \${ref.$token}\`)
        continue
      }
      const want = ref?.$token ? tokenValue(ref.$token, size) : ref
      if (!want) continue`

c = c.replace(from, to)
fs.writeFileSync(p, c, 'utf8')
console.log('未知令牌会报错')
