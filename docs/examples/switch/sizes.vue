<template>
  <SmSwitch size="sm" :model-value="true" />
  <SmSwitch size="sm" />
  <SmSwitch :model-value="true" />
  <SmSwitch />
</template>

<script setup lang="ts">
import { Switch as SmSwitch } from '@specmark/vue'
</script>
