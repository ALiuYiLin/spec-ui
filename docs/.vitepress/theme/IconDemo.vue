<script setup lang="ts">
import { h } from 'vue'
import { ChevronDown, Search, X } from 'lucide-vue-next'
import { Button } from '@specmark/vue'

// 与 playground 的证据台使用同一套 lucide 图标
const search = h(Search, { size: 16 })
const close = h(X, { size: 16 })
const down = h(ChevronDown, { size: 16 })
</script>

<template>
  <Button :icon="down" label="下拉" />
  <Button :icon="close" tone="danger" label="删除" />
  <Button :icon="search" variant="solid" label="搜索" />
  <Button :icon="search" shape="circle" aria-label="搜索" />
</template>
