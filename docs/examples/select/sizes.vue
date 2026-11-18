<template>
  <SmSelect :options="options" placeholder="小" size="sm" style="width: 140px" />
  <SmSelect :options="options" placeholder="中" style="width: 140px" />
  <SmSelect :options="options" placeholder="大" size="lg" style="width: 140px" />
</template>

<script setup lang="ts">
import { Select as SmSelect } from '@specmark/vue'
const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
]
</script>
