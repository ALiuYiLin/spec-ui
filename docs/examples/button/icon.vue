<template>
  <SmButton :icon="search" label="搜索" />
  <SmButton :icon="search" variant="solid" label="搜索" />
  <SmButton :icon="search" tone="danger" label="搜索" />
  <SmButton :icon="search" shape="circle" aria-label="搜索" />
</template>

<script setup lang="ts">
import { Button as SmButton } from '@specmark/vue'
import { h } from 'vue'
import { Search } from 'lucide-vue-next'

// 图标用 lucide：与 React 侧同一份几何，演示与视觉校验共用同一套图标
const search = h(Search, { size: 16 })
</script>
