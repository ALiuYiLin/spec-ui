<template>
  <SmSlider :model-value="40" style="width: 200px" aria-label="音量" />
  <SmSlider :model-value="70" :disabled="true" style="width: 200px" aria-label="禁用" />
</template>

<script setup lang="ts">
import { Slider as SmSlider } from '@specmark/vue'
</script>
