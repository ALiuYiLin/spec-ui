<template>
  <SmSelect :options="options" placeholder="默认" style="width: 160px" />
  <SmSelect :options="options" placeholder="错误" status="error" style="width: 160px" />
  <SmSelect :options="options" placeholder="警告" status="warning" style="width: 160px" />
</template>

<script setup lang="ts">
const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
]
</script>
