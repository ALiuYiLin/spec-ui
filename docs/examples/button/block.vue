<template>
<div style="width: 100%">
  <SmButton variant="solid" :block="true" label="提交" />
  <div style="height: 8px"></div>
  <SmButton :block="true" label="取消" />
</div>
</template>

<script setup lang="ts">
import { Button as SmButton } from '@specmark/vue'
</script>
