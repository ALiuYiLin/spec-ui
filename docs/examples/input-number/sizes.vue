<template>
  <SmInputNumber :model-value="5" size="sm" style="width: 110px" aria-label="小" />
  <SmInputNumber :model-value="5" style="width: 110px" aria-label="中" />
  <SmInputNumber :model-value="5" size="lg" style="width: 110px" aria-label="大" />
</template>

<script setup lang="ts">
import { InputNumber as SmInputNumber } from '@specmark/vue'
</script>
