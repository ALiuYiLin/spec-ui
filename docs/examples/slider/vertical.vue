<template>
  <div style="display: flex; gap: 24px; height: 120px">
    <SmSlider :model-value="40" orientation="vertical" aria-label="纵向" />
    <SmSlider :model-value="70" orientation="vertical" :disabled="true" aria-label="纵向禁用" />
  </div>
</template>

<script setup lang="ts">
import { Slider as SmSlider } from '@specmark/vue'
</script>
