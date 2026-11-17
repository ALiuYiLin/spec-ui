<template>
  <SmDescriptions :items="items" style="width: 100%" />
</template>

<script setup lang="ts">
const items = [
  { label: '用户名', content: 'zhang' },
  { label: '状态', content: '启用' },
  { label: '创建时间', content: '2026-11-17' },
]
</script>
