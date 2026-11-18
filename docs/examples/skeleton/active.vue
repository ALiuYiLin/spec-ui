<template>
  <SmSkeleton :rows="3" style="width: 240px" />
  <SmSkeleton :rows="3" :title="false" active style="width: 240px" />
</template>

<script setup lang="ts">
import { Skeleton as SmSkeleton } from '@specmark/vue'
</script>
