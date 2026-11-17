<template>
  <SmDropdown :items="items"><SmButton label="更多" /></SmDropdown>
</template>

<script setup lang="ts">
const items = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制（禁用）', disabled: true },
  { key: 'delete', label: '删除' },
]
</script>
