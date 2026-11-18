<template>
  <SmSelect :options="options" model-value="a" :allow-clear="true" style="width: 160px" />
  <SmSelect :options="options" placeholder="无值时不显示清除" :allow-clear="true" style="width: 200px" />
  <SmSelect :options="options" :show-arrow="false" model-value="a" style="width: 160px" />
</template>

<script setup lang="ts">
import { Select as SmSelect } from '@specmark/vue'
const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
]
</script>
