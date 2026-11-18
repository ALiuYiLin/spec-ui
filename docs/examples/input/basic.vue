<template>
  <SmInput placeholder="请输入" style="width: 200px" />
  <SmInput placeholder="带前缀" style="width: 200px">
    <template #prefix>￥</template>
  </SmInput>
  <SmInput model-value="内容" :allow-clear="true" style="width: 200px" />
</template>

<script setup lang="ts">
import { Input as SmInput } from '@specmark/vue'
</script>
