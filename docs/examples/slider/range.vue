<template>
  <SmSlider :default-value="30" :min="0" :max="100" :step="10" style="width: 200px" aria-label="步长 10" />
  <SmSlider :default-value="50" :min="-50" :max="50" style="width: 200px" aria-label="负区间" />
</template>

<script setup lang="ts">
import { Slider as SmSlider } from '@specmark/vue'
</script>
