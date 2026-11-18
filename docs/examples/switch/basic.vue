<template>
  <SmSwitch aria-label="关" />
  <SmSwitch :model-value="true" aria-label="开" />
  <SmSwitch :disabled="true" aria-label="禁用" />
  <SmSwitch size="sm" aria-label="小号" />
</template>

<script setup lang="ts">
import { Switch as SmSwitch } from '@specmark/vue'
</script>
