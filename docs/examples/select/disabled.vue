<template>
  <SmSelect :options="options" placeholder="禁用" :disabled="true" style="width: 160px" />
  <SmSelect :options="options" model-value="a" :disabled="true" style="width: 160px" />
  <SmSelect :options="options" placeholder="filled 禁用" variant="filled" :disabled="true" style="width: 160px" />
</template>

<script setup lang="ts">
import { Select as SmSelect } from '@specmark/vue'
const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
]
</script>
