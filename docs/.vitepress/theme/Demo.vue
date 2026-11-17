<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  /** 演示标题，来自 ::: demo 后的文字 */
  title?: string
  /** 构建期高亮好的 HTML（encodeURIComponent） */
  code?: string
  /** 原始源码（encodeURIComponent），用于复制 */
  raw?: string
}>()

const sourceVisible = ref(false)
const copied = ref(false)

const highlighted = computed(() => (props.code ? decodeURIComponent(props.code) : ''))
const rawSource = computed(() => (props.raw ? decodeURIComponent(props.raw) : ''))

async function copyCode() {
  if (!rawSource.value) return
  try {
    await navigator.clipboard.writeText(rawSource.value)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="sm-demo">
    <div v-if="title" class="sm-demo__title">{{ title }}</div>

    <div class="sm-demo__stage">
      <slot />
    </div>

    <div class="sm-demo__toolbar">
      <button type="button" class="sm-demo__btn" :aria-label="copied ? '已复制' : '复制代码'" @click="copyCode">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            d="M9 9h9v11H9zM6 15H5V4h9v1"
          />
        </svg>
        <span>{{ copied ? '已复制' : '复制' }}</span>
      </button>
      <button
        type="button"
        class="sm-demo__btn"
        :aria-label="sourceVisible ? '隐藏源代码' : '查看源代码'"
        @click="sourceVisible = !sourceVisible"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="1.8" d="m9 8-4 4 4 4M15 8l4 4-4 4" />
        </svg>
        <span>{{ sourceVisible ? '隐藏源代码' : '查看源代码' }}</span>
      </button>
    </div>

    <div v-show="sourceVisible" class="sm-demo__source" v-html="highlighted" />

    <button v-show="sourceVisible" type="button" class="sm-demo__collapse" @click="sourceVisible = false">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="1.8" d="m6 15 6-6 6 6" />
      </svg>
      <span>隐藏源代码</span>
    </button>
  </div>
</template>
