<template>
  <SmSelect :options="options" :open="true" placeholder="展开状态" style="width: 160px" />
  <SmSelect :options="options" :open="true" model-value="b" style="width: 160px" />
</template>

<script setup lang="ts">
// open 由 props 决定：受控展开时组件不自己改状态，方便截图与对拍
const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
]
</script>
