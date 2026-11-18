<template>
<div style="display: grid; gap: 24px; width: 100%">
  <SmSteps :current="0" :items="[{ title: '第一步' }, { title: '第二步' }]" />
  <SmSteps :current="1" :items="[{ title: '第一步' }, { title: '第二步' }]" />
</div>
</template>

<script setup lang="ts">
import { Steps as SmSteps } from '@specmark/vue'
</script>
