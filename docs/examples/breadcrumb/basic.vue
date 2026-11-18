<template>
  <SmBreadcrumb :items="[{ title: '首页' }, { title: '列表' }]" />
</template>

<script setup lang="ts">
import { Breadcrumb as SmBreadcrumb } from '@specmark/vue'
</script>
