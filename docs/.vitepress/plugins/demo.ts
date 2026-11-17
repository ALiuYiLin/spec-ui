import fs from 'node:fs'
import path from 'node:path'
import container from 'markdown-it-container'
import type { MarkdownRenderer } from 'vitepress'

/**
 * `::: demo 描述` 容器，用法与 element-plus 一致：
 *
 *   :::demo 用 `tone` 与 `variant` 组合出颜色与形态。
 *
 *   button/demo-1
 *
 *   :::
 *
 * 容器体是一行**示例路径**（`docs/examples/button/demo-1.vue`），插件在构建期：
 *   1. 读文件内容
 *   2. 用同一个 md 渲染成 shiki 高亮 HTML，交给 Demo 组件展示
 *   3. 插槽里放同名示例组件（由 theme 里的 import.meta.glob 全局注册）
 *
 * 这样示例是真正的 .vue 文件，编辑器里有语法高亮与类型提示，也方便单独复用。
 */
const DOCS_ROOT = path.resolve(import.meta.dirname, '../..')

const pascal = (s: string) =>
  s
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

export default function demoPlugin(md: MarkdownRenderer) {
  md.core.ruler.push('sm_demo_source', (state) => {
    const lines = state.src.split(/\r?\n/)
    const bodies: string[] = []

    for (let i = 0; i < lines.length; i += 1) {
      if (!/^:::\s*demo\b/.test(lines[i])) continue

      let j = i + 1
      while (j < lines.length && !/^:::\s*$/.test(lines[j])) j += 1
      bodies.push(lines.slice(i + 1, j).join('\n').trim())
      i = j
    }

    let cursor = 0
    for (const token of state.tokens) {
      if (token.type !== 'container_demo_open') continue
      token.meta = { ...(token.meta ?? {}), body: bodies[cursor++] ?? '' }
    }

    // 容器体那行「路径」只是给插件读的，不该在页面上渲染成 <p>button/basic</p>。
    // 把 open 与 close 之间的 token 全部摘掉，插槽里就只剩示例组件本身。
    for (let i = state.tokens.length - 1; i >= 0; i -= 1) {
      if (state.tokens[i].type !== 'container_demo_open') continue

      let depth = 1
      let j = i + 1
      for (; j < state.tokens.length; j += 1) {
        if (state.tokens[j].type === 'container_demo_open') depth += 1
        if (state.tokens[j].type === 'container_demo_close') {
          depth -= 1
          if (depth === 0) break
        }
      }

      if (j < state.tokens.length) state.tokens.splice(i + 1, j - i - 1)
    }
  })

  md.use(container as never, 'demo', {
    validate: (params: string) => /^demo\b/.test(params.trim()),

    render(tokens: { nesting: number; info: string; meta?: { body?: string } }[], idx: number) {
      const token = tokens[idx]

      if (token.nesting !== 1) return '</Demo>\n'

      const description = token.info.trim().replace(/^demo\b/, '').trim()
      const body: string = token.meta?.body ?? ''

      // 容器体是一行路径，例如 button/demo-1
      const relative = body.replace(/^\.\//, '').trim()
      const file = path.join(DOCS_ROOT, 'examples', `${relative}.vue`)
      if (!fs.existsSync(file)) throw new Error(`demo 路径不存在：${relative}（找的是 ${file}）`)

      const source = fs.readFileSync(file, 'utf8')
      const highlighted = md.render(`\`\`\`vue\n${source}\n\`\`\``)
      const cleaned = highlighted.replace(/<button[^>]*class="copy"[^>]*>[\s\S]*?<\/button>/g, '')

      const descHtml = description ? `<p class="sm-demo__desc">${md.renderInline(description)}</p>\n` : ''
      const component = `Example${pascal(relative)}`

      // 开标签保持未闭合，由 close token 输出 </Demo>（与 element-plus 一致）
      return `${descHtml}<Demo code="${encodeURIComponent(cleaned)}" raw="${encodeURIComponent(source)}"><${component} />\n`
    },
  })
}
