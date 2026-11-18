<template>
  <SmTimeline :items="items" />
</template>

<script setup lang="ts">
import { Timeline as SmTimeline } from '@specmark/vue'
const items = [
  { content: '默认节点' },
  { content: '成功节点', tone: 'success' },
  { content: '警告节点', tone: 'warning' },
  { content: '危险节点', tone: 'danger' },
]
</script>
