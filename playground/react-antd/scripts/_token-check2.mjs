import fs from 'node:fs'

const p = 'playground/react-antd/scripts/conformance.mjs'
let c = fs.readFileSync(p, 'utf8')

const anchor = '    for (const [prop, ref] of Object.entries(decl.box ?? {})) {'
if (!c.includes(anchor)) throw new Error('token 循环锚点没找到')
if (!c.includes('引用了不存在的尺寸令牌')) {
  c = c.replace(
    anchor,
    `    for (const [prop, ref] of Object.entries(decl.box ?? {})) {
      if (ref && ref.$token && !SIZE_TOKENS[ref.$token]) {
        fails.push(\`\${name} 的 \${prop} 引用了不存在的尺寸令牌 \${ref.$token}\`)
        continue
      }`,
  )
}
fs.writeFileSync(p, c, 'utf8')
console.log('令牌存在性校验已加入')
