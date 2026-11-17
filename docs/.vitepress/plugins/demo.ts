import container from 'markdown-it-container'
import type { MarkdownRenderer } from 'vitepress'

/**
 * `::: demo 描述` 容器，用法对齐 element-plus：
 *
 *   :::demo 通过 `tone` 与 `variant` 组合出不同颜色与形态。
 *   <SmButton tone="success" variant="solid" label="实心" />
 *   :::
 *
 * - info 部分是**描述**，按行内 markdown 渲染在演示卡上方
 * - 容器体是示例源码，构建期用 markdown-it 渲染成高亮 HTML 交给 Demo 组件
 *
 * 与 element-plus 的差别只有一处：它把示例写在独立文件里、容器体只放路径，
 * 我们的示例直接内联在 markdown 中，所以容器体本身就是源码。
 */
export default function demoPlugin(md: MarkdownRenderer) {
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

      const description = token.info.trim().replace(/^demo\b/, '').trim()
      const body: string = token.meta?.body ?? ''

      const highlighted = md.render(`\`\`\`vue\n${body}\n\`\`\``)
      const cleaned = highlighted.replace(/<button[^>]*class="copy"[^>]*>[\s\S]*?<\/button>/g, '')

      const descHtml = description
        ? `<p class="sm-demo__desc">${md.renderInline(description)}</p>\n`
        : ''

      return `${descHtml}<Demo code="${encodeURIComponent(cleaned)}" raw="${encodeURIComponent(body)}">\n`
    },
  })
}
