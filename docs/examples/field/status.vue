<template>
  <div style="display: grid; gap: 8px; width: 240px">
    <SmField label="默认"><SmInput placeholder="请输入" /></SmField>
    <SmField label="错误" status="error" error="必填项"><SmInput status="error" placeholder="请输入" /></SmField>
    <SmField label="警告" status="warning" error="建议填写"><SmInput status="warning" placeholder="请输入" /></SmField>
  </div>
</template>

<script setup lang="ts">
import { Field as SmField, Input as SmInput } from '@specmark/vue'
</script>
