<template>
  <SmPopover title="标题" content="对齐起点" align="start"><SmButton label="start" /></SmPopover>
  <SmPopover title="标题" content="对齐居中" align="center"><SmButton label="center" /></SmPopover>
  <SmPopover title="标题" content="对齐终点" align="end"><SmButton label="end" /></SmPopover>
</template>

<script setup lang="ts">
import { Popover as SmPopover, Button as SmButton } from '@specmark/vue'
</script>
