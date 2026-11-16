/**
 * 文档站自检。
 *
 * 起因：theme 里手写组件注册时漏了 21 个组件，`docs:build` 依然成功，
 * 页面只是渲染成空白。只看构建通过是不够的，这里补三类检查：
 *
 *  1. 每个协议 spec 都有对应的构建产物页面
 *  2. 每个协议的组件名都能从 @specmark/vue 导出（注册表由导出推导，导出缺失即注册缺失）
 *  3. 页面真的渲染出了东西：
 *     - 内联演示页（<SmXxx>）：HTML 里必须出现 class="sm-<根类名>"
 *     - 交互演示页（<XxxDemo>，点击才展开）：HTML 里必须出现演示组件自己的按钮
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

const vueIndex = fs.readFileSync(VUE_INDEX, 'utf8')
const specs = fs.readdirSync(SPEC_DIR).filter((f) => f.endsWith('.spec.json'))
const failures = []
let inline = 0
let interactive = 0
let covered = 0

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

  if (new RegExp(`<Sm${name}\\b`).test(md)) {
    inline += 1
    covered += 1
    if (!html.includes(`class="${rootClass}`)) {
      failures.push(`${slug}: 页面有内联演示，但渲染结果里没有 class="${rootClass}"`)
    }
  } else if (new RegExp(`<${name}Demo\\b`).test(md)) {
    interactive += 1
    covered += 1
    // 交互演示组件以库里的 Button 作为触发器：它渲染出来，说明演示组件本身已注册
    if (!html.includes('class="sm-btn')) {
      failures.push(`${slug}: 页面用了 ${name}Demo，但演示组件没有渲染出来`)
    }
  } else {
    failures.push(`${slug}: 页面既没有内联演示也没有交互演示，无法验证渲染`)
  }
}

if (failures.length) {
  console.error(`文档站自检失败 ${failures.length} 项：`)
  for (const f of failures) console.error(`  · ${f}`)
  process.exit(1)
}

console.log(
  `文档站自检通过：${specs.length} 个组件页全部覆盖（内联演示 ${inline} 个，交互演示 ${interactive} 个，合计 ${covered}）`,
)
