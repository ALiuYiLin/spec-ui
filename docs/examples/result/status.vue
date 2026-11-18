<template>
  <SmResult status="success" title="操作成功" subtitle="结果页的主色由 status 决定。" />
  <SmResult status="error" title="操作失败" subtitle="请检查后重试。" />
</template>

<script setup lang="ts">
import { Result as SmResult } from '@specmark/vue'
</script>
