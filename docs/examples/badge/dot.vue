<template>
  <SmBadge dot>
    <span style="display: inline-block; width: 40px; height: 40px; background: #ddd"></span>
  </SmBadge>
  <SmBadge :count="0" dot>
    <span style="display: inline-block; width: 40px; height: 40px; background: #ddd"></span>
  </SmBadge>
</template>

<script setup lang="ts">
import { Badge as SmBadge } from '@specmark/vue'
</script>
