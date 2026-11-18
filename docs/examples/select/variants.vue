<template>
  <SmSelect :options="options" placeholder="outlined" style="width: 160px" />
  <SmSelect :options="options" placeholder="filled" variant="filled" style="width: 160px" />
  <SmSelect :options="options" placeholder="borderless" variant="borderless" style="width: 160px" />
</template>

<script setup lang="ts">
import { Select as SmSelect } from '@specmark/vue'
const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
]
</script>
