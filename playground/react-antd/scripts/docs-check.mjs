/**
 * 文档站自检。
 *
 * 起因：theme 里手写组件注册时漏了 21 个组件，`docs:build` 依然成功，
 * 页面只是渲染成空白。只看构建通过是不够的，这里补三项检查：
 *
 *  1. 每个协议 spec 都有对应的构建产物页面
 *  2. 每个协议的组件名都能从 @specmark/vue 导出（注册表由导出推导，导出缺失即注册缺失）
 *  3. 页面里如果用了实时演示（<SmXxx>），渲染结果里必须出现 class="sm-xxx"
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'docs/.vitepress/dist/components'
const SPEC_DIR = 'spec/components'
const DOCS_DIR = 'docs/components'
const VUE_INDEX = 'packages/vue/src/index.ts'

if (!fs.existsSync(DIST)) {
  console.error(`缺少构建产物：${DIST}，先跑 pnpm docs:build`)
  process.exit(1)
}

const pascal = (slug) =>
  slug
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')

const vueIndex = fs.readFileSync(VUE_INDEX, 'utf8')
const specs = fs.readdirSync(SPEC_DIR).filter((f) => f.endsWith('.spec.json'))
const failures = []
let demoPages = 0

for (const file of specs) {
  const slug = file.replace('.spec.json', '')
  const spec = JSON.parse(fs.readFileSync(path.join(SPEC_DIR, file), 'utf8'))
  const name = spec.component
  const rootClass = spec.anatomy.root.class

  const page = path.join(DIST, `${slug}.html`)
  if (!fs.existsSync(page)) {
    failures.push(`${slug}: 缺少构建产物 ${page}`)
    continue
  }

  if (!vueIndex.includes(`export { ${name} }`)) {
    failures.push(`${slug}: @specmark/vue 没有导出 ${name}，theme 也就注册不到`)
    continue
  }

  const mdPath = path.join(DOCS_DIR, `${slug}.md`)
  const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : ''
  if (new RegExp(`<Sm${name}\\b`).test(md)) {
    demoPages += 1
    const html = fs.readFileSync(page, 'utf8')
    if (!html.includes(`class="${rootClass}`)) {
      failures.push(`${slug}: 页面有实时演示，但渲染结果里没有 class="${rootClass}"`)
    }
  }
}

if (failures.length) {
  console.error(`文档站自检失败 ${failures.length} 项：`)
  for (const f of failures) console.error(`  · ${f}`)
  process.exit(1)
}

console.log(`文档站自检通过：${specs.length} 个组件页，其中 ${demoPages} 个带实时演示并已确认渲染`)
void pascal
