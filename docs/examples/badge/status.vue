<template>
  <SmBadge status="success" :content="text('成功')" />
  <SmBadge status="warning" :content="text('警告')" />
  <SmBadge status="error" :content="text('错误')" />
  <SmBadge status="default" :content="text('默认')" />
</template>

<script setup lang="ts">
import { Badge as SmBadge } from '@specmark/vue'
import { h } from 'vue'

const text = (v: string) => h('span', { style: 'margin-inline-start: 8px' }, v)
</script>
