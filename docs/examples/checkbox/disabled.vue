<template>
  <SmCheckbox label="未选禁用" :disabled="true" />
  <SmCheckbox label="已选禁用" :disabled="true" :model-value="true" />
  <SmCheckbox label="半选禁用" :disabled="true" :indeterminate="true" />
</template>

<script setup lang="ts">
import { Checkbox as SmCheckbox } from '@specmark/vue'
</script>
