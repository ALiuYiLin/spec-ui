<template>
  <SmTooltip title="上方" side="top"><SmButton label="上" /></SmTooltip>
  <SmTooltip title="右侧" side="right"><SmButton label="右" /></SmTooltip>
  <SmTooltip title="下方" side="bottom"><SmButton label="下" /></SmTooltip>
  <SmTooltip title="左侧" side="left"><SmButton label="左" /></SmTooltip>
</template>

<script setup lang="ts">
import { Tooltip as SmTooltip, Button as SmButton } from '@specmark/vue'
</script>
