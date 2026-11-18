<template>
  <SmCard title="卡片标题" style="width: 260px">
    <template #extra><SmButton variant="link" label="更多" /></template>
    正文内容，标题与操作分列两端。
  </SmCard>
</template>

<script setup lang="ts">
import { Card as SmCard, Button as SmButton } from '@specmark/vue'
</script>
