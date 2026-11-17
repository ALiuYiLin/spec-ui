<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  /** demo 标题，对应 antd 文档里每个演示卡的标题 */
  title?: string
  /** 标题下的一句话说明 */
  desc?: string
  /** 渲染区下方的小字备注 */
  note?: string
  /** 手写代码片段；不传则抓取渲染出的协议 DOM */
  code?: string
}>()

const stage = ref<HTMLElement | null>(null)
const captured = ref('')
const copied = ref(false)

/**
 * 没有手写片段时，把渲染后的协议 DOM 抓下来当示例。
 *
 * 对协议驱动的库来说，DOM 才是对外契约——比「某个框架怎么写」更接近文档该展示的东西。
 * 手写 code 仍然优先，用于需要展示框架写法的场景。
 */
onMounted(() => {
  if (props.code || !stage.value) return
  captured.value = prettyHtml(stage.value.innerHTML)
})

/** 极简格式化：按标签切分，维护缩进深度 */
function prettyHtml(html: string): string {
  const tokens = html.match(/<[^>]+>|[^<]+/g) ?? []
  const voidTags = /^<(img|input|br|hr|meta|link|source|textarea)\b/
  const lines: string[] = []
  let depth = 0

  for (const token of tokens) {
    // Vue 会在列表/插槽位置插入 <!--[--> <!----> 之类的占位注释，
    // 既不是内容也不该影响缩进，直接丢掉
    if (token.startsWith('<!--')) continue

    if (token.startsWith('</')) {
      depth = Math.max(0, depth - 1)
      lines.push('  '.repeat(depth) + token)
    } else if (token.startsWith('<')) {
      lines.push('  '.repeat(depth) + token)
      const selfClosing = token.endsWith('/>') || voidTags.test(token)
      if (!selfClosing) depth += 1
    } else {
      const text = token.trim()
      if (text) lines.push('  '.repeat(depth) + text)
    }
  }

  return lines.join('\n')
}

const source = computed(() => props.code ?? captured.value)

async function copy() {
  if (!source.value) return
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="sm-demo">
    <div v-if="title || desc" class="sm-demo__head">
      <h4 v-if="title" class="sm-demo__title">{{ title }}</h4>
      <p v-if="desc" class="sm-demo__desc">{{ desc }}</p>
    </div>

    <div ref="stage" class="sm-demo__stage">
      <slot />
    </div>

    <div v-if="note" class="sm-demo__note">{{ note }}</div>

    <details v-if="source" class="sm-demo__code">
      <summary>
        <span>查看代码</span>
        <code class="sm-demo__lang">{{ code ? '片段' : '协议 DOM' }}</code>
      </summary>
      <div class="sm-demo__code-body">
        <button type="button" class="sm-demo__copy" @click="copy">
          {{ copied ? '已复制' : '复制' }}
        </button>
        <pre><code>{{ source }}</code></pre>
      </div>
    </details>
  </div>
</template>
