<template>
  <SmTooltip title="上方提示" side="top">
    <SmButton label="悬停我" />
  </SmTooltip>
  <SmTooltip title="下方提示" side="bottom">
    <SmButton variant="text" label="也可以是文字" />
  </SmTooltip>
</template>

<script setup lang="ts">
import { Tooltip as SmTooltip, Button as SmButton } from '@specmark/vue'
</script>
