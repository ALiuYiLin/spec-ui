import container from 'markdown-it-container'
import type { MarkdownRenderer } from 'vitepress'

/**
 * `::: demo 标题` 容器。
 *
 * 与 element-plus 的做法一致：源码在**构建期**用 markdown-it 渲染成高亮 HTML，
 * 再作为参数交给 Demo 组件；组件只负责展示与折叠，不做任何解析。
 *
 * 好处是：高亮主题跟随 VitePress（明暗两套）、不引入运行时高亮库、源码就是作者写的那段。
 */
export default function demoPlugin(md: MarkdownRenderer) {
  // 容器体是原始文本，render 回调里拿不到。
  // 注意：container 的 close token 不一定带 map，所以不能靠 map 切片，
  // 直接从原文按行扫出每个 `::: demo` 块，再按出现顺序分配给 open token。
  md.core.ruler.push('sm_demo_source', (state) => {
    const lines = state.src.split(/\r?\n/)
    const blocks: string[] = []

    for (let i = 0; i < lines.length; i += 1) {
      if (!/^:::\s*demo\b/.test(lines[i])) continue

      let j = i + 1
      while (j < lines.length && !/^:::\s*$/.test(lines[j])) j += 1
      blocks.push(lines.slice(i + 1, j).join('\n').trimEnd())
      i = j
    }

    let cursor = 0
    for (const token of state.tokens) {
      if (token.type !== 'container_demo_open') continue
      token.meta = { ...(token.meta ?? {}), body: blocks[cursor++] ?? '' }
    }
  })

  md.use(container as never, 'demo', {
    validate: (params: string) => /^demo\b/.test(params.trim()),

    render(tokens: { nesting: number; info: string; meta?: { body?: string } }[], idx: number) {
      const token = tokens[idx]

      if (token.nesting !== 1) return '</Demo>\n'

      const title = token.info.trim().replace(/^demo\b/, '').trim()
      const body: string = token.meta?.body ?? ''

      // 用同一个 md 渲染一段 vue 代码围栏：拿到 VitePress 的 shiki 高亮结果
      const highlighted = md.render(`\`\`\`vue\n${body}\n\`\`\``)

      // VitePress 会在代码块里塞一个自己的复制按钮，这里去掉，避免和演示卡工具栏重复
      const cleaned = highlighted.replace(/<button[^>]*class="copy"[^>]*>[\s\S]*?<\/button>/g, '')

      const attrs = [
        `title="${escapeAttr(title)}"`,
        `code="${encodeURIComponent(cleaned)}"`,
        `raw="${encodeURIComponent(body)}"`,
      ].join(' ')

      return `<Demo ${attrs}>\n`
    },
  })
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}
