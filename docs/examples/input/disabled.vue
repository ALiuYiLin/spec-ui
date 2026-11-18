<template>
  <SmInput placeholder="禁用" :disabled="true" model-value="禁用内容" style="width: 180px" />
  <SmInput placeholder="只读" :read-only="true" model-value="只读内容" style="width: 180px" />
  <SmInput placeholder="filled 禁用" variant="filled" :disabled="true" model-value="内容" style="width: 180px" />
</template>

<script setup lang="ts">
import { Input as SmInput } from '@specmark/vue'
</script>
