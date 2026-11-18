<template>
  <!-- 同名 radio 由浏览器原生互斥，不需要额外的 Group 组件 -->
  <SmRadio name="demo" label="选项 A" :model-value="true" />
  <SmRadio name="demo" label="选项 B" />
  <SmRadio name="demo" label="选项 C（禁用）" :disabled="true" />
</template>

<script setup lang="ts">
import { Radio as SmRadio } from '@specmark/vue'
</script>
