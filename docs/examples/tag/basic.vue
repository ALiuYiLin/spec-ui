<template>
  <SmTag>默认</SmTag>
  <SmTag tone="primary">主要</SmTag>
  <SmTag tone="success">成功</SmTag>
  <SmTag tone="warning">警告</SmTag>
  <SmTag tone="danger" :closable="true">可关闭</SmTag>
</template>

<script setup lang="ts">
import { Tag as SmTag } from '@specmark/vue'
</script>
