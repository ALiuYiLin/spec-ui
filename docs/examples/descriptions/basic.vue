<template>
  <SmDescriptions :items="[{ label: '姓名', content: '张三' }, { label: '部门', content: '设计' }]" />
</template>

<script setup lang="ts">
import { Descriptions as SmDescriptions } from '@specmark/vue'
</script>
