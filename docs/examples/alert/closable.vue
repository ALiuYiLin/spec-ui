<template>
  <SmAlert type="info" message="可关闭的提示" description="补充说明文字。" :closable="true" />
  <SmAlert type="warning" message="可关闭的警告" :closable="true" />
</template>

<script setup lang="ts">
import { Alert as SmAlert } from '@specmark/vue'
</script>
