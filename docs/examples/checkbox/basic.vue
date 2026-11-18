<template>
  <SmCheckbox label="未选" />
  <SmCheckbox :model-value="true" label="已选" />
  <SmCheckbox :indeterminate="true" label="半选" />
  <SmCheckbox :disabled="true" label="禁用" />
</template>

<script setup lang="ts">
import { Checkbox as SmCheckbox } from '@specmark/vue'
</script>
