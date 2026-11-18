<template>
  <SmSteps :items="items" :current="1" direction="vertical" style="height: 180px" />
</template>

<script setup lang="ts">
import { Steps as SmSteps } from '@specmark/vue'
const items = [{ title: '填写信息' }, { title: '确认' }, { title: '完成' }]
</script>
