<template>
  <SmInput placeholder="可清空" :allow-clear="true" model-value="内容" style="width: 200px" />
  <SmInput placeholder="空值时不显示清除按钮" :allow-clear="true" style="width: 220px" />
  <SmInput placeholder="禁用时不显示" :allow-clear="true" :disabled="true" model-value="内容" style="width: 200px" />
</template>

<script setup lang="ts">
import { Input as SmInput } from '@specmark/vue'
</script>
