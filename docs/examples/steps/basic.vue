<template>
  <SmSteps :current="1" :items="[{ title: '第一步' }, { title: '第二步' }]" />
</template>

<script setup lang="ts">
import { Steps as SmSteps } from '@specmark/vue'
</script>
