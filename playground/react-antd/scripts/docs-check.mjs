/**
 * 文档站自检。
 *
 * 起因：theme 里手写组件注册时漏了 21 个组件，`docs:build` 依然成功，
 * 页面只是渲染成空白。只看构建通过是不够的，这里补三类检查：
 *
 *  1. 每个协议 spec 都有对应的构建产物页面
 *  2. 每个协议的组件名都能从 @specmark/vue 导出（注册表由导出推导，导出缺失即注册缺失）
 *  3. 页面真的渲染出了东西：
 *     - 示例里直接用了组件（<SmXxx>）：HTML 里必须出现 class="sm-<根类名>"
 *     - 示例是交互演示（<XxxDemo>，点击才展开）：HTML 里必须出现演示组件自己的按钮
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'docs/.vitepress/dist/components'
const SPEC_DIR = 'spec/components'
const DOCS_DIR = 'docs/components'
const EXAMPLES = 'docs/examples'
const VUE_INDEX = 'packages/vue/src/index.ts'

if (!fs.existsSync(DIST)) {
  console.error(`缺少构建产物：${DIST}，先跑 pnpm docs:build`)
  process.exit(1)
}

const vueIndex = fs.readFileSync(VUE_INDEX, 'utf8')
const specs = fs.readdirSync(SPEC_DIR).filter((f) => f.endsWith('.spec.json'))
const failures = []
let covered = 0
let interactive = 0

/** 从 markdown 里取出每个 demo 容器的示例路径 */
function demoPaths(md) {
  const paths = []
  const lines = md.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    if (!/^:::\s*demo\b/.test(lines[i])) continue
    let j = i + 1
    while (j < lines.length && !/^:::\s*$/.test(lines[j])) {
      const line = lines[j].trim()
      if (/^[\w-]+\/[\w-]+$/.test(line)) paths.push(line)
      j += 1
    }
    i = j
  }
  return paths
}

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
  const html = fs.readFileSync(page, 'utf8')
  const paths = demoPaths(md)

  if (paths.length === 0) {
    failures.push(`${slug}: 页面没有任何 :::demo 容器`)
    continue
  }

  covered += 1

  // 示例文件里是否直接用了组件；否则认为它是交互演示（点击才展开浮层）
  const sources = paths
    .map((p) => path.join(EXAMPLES, `${p}.vue`))
    .filter((p) => fs.existsSync(p))
    .map((p) => fs.readFileSync(p, 'utf8'))

  if (sources.length !== paths.length) {
    failures.push(`${slug}: 示例文件缺失（期望 ${paths.length} 个，找到 ${sources.length} 个）`)
    continue
  }

  const usesComponent = sources.some((s) => new RegExp(`<Sm${name}\\b`).test(s))
  if (usesComponent) {
    if (!html.includes(`class="${rootClass}`)) {
      failures.push(`${slug}: 示例用了组件，但渲染结果里没有 class="${rootClass}"`)
    }
  } else {
    interactive += 1
    if (!html.includes('class="sm-btn')) {
      failures.push(`${slug}: 交互演示没有渲染出来（缺少触发按钮）`)
    }
  }
}

if (failures.length) {
  console.error(`文档站自检失败 ${failures.length} 项：`)
  for (const f of failures) console.error(`  · ${f}`)
  process.exit(1)
}

console.log(
  `文档站自检通过：${specs.length} 个组件页全部覆盖（交互演示 ${interactive} 个，其余为直接渲染）`,
)
