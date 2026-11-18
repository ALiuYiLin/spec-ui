<template>
  <div style="display: grid; gap: 8px; width: 240px">
    <SmField label="用户名">
      <SmInput placeholder="请输入" />
    </SmField>
    <SmField label="邮箱" required status="error" error="邮箱格式不正确">
      <SmInput status="error" model-value="not-an-email" />
    </SmField>
  </div>
</template>

<script setup lang="ts">
import { Field as SmField, Input as SmInput } from '@specmark/vue'
</script>
