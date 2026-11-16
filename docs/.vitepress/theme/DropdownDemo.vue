<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dropdown } from '@specmark/vue'

const items = [
  { key: '1', label: '选项一' },
  { key: '2', label: '选项二' },
  { key: '3', label: '禁用项', disabled: true },
]
const open = ref(false)
const last = ref('')
</script>

<template>
  <Dropdown :items="items" :open="open" @select="last = $event" @update:open="open = $event">
    <Button :label="last ? '已选：' + last : '打开菜单'" />
  </Dropdown>
</template>
