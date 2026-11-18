<template>
  <SmInputNumber :model-value="5" style="width: 120px" aria-label="数量" />
  <SmInputNumber :model-value="5" :disabled="true" style="width: 120px" aria-label="禁用" />
  <SmInputNumber :model-value="5" status="error" style="width: 120px" aria-label="错误" />
</template>

<script setup lang="ts">
import { InputNumber as SmInputNumber } from '@specmark/vue'
</script>
