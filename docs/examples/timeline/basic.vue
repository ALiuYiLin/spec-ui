<template>
  <SmTimeline :items="[{ content: '创建于 09:00' }, { content: '更新于 10:30' }]" />
</template>

<script setup lang="ts">
import { Timeline as SmTimeline } from '@specmark/vue'
</script>
