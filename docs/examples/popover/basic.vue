<template>
  <SmPopover title="标题" content="这是一段说明文字" side="top">
    <SmButton label="悬停我" />
  </SmPopover>
  <SmPopover content="没有标题的版本" side="bottom">
    <SmButton variant="text" label="也可以是文字" />
  </SmPopover>
</template>

<script setup lang="ts">
import { Popover as SmPopover, Button as SmButton } from '@specmark/vue'
</script>
