<template>
  <SmSelect
    :options="[
      { value: 'a', label: '选项 A' },
      { value: 'b', label: '选项 B' },
      { value: 'c', label: '选项 C' },
    ]"
    placeholder="请选择"
  />
  <SmSelect
    :options="[
      { value: 'a', label: '选项 A' },
      { value: 'b', label: '选项 B' },
    ]"
    model-value="b"
  />
  <SmSelect
    :options="[{ value: 'a', label: '选项 A' }]"
    :disabled="true"
    placeholder="禁用"
  />
</template>

<script setup lang="ts">
import { Select as SmSelect } from '@specmark/vue'
</script>
