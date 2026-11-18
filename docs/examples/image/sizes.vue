<template>
  <SmImage :src="src" alt="示例图" :width="80" :height="80" />
  <SmImage :src="src" alt="示例图" :width="120" :height="60" />
</template>

<script setup lang="ts">
import { Image as SmImage } from '@specmark/vue'
const src =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23e6f4ff"/><circle cx="60" cy="60" r="32" fill="%231677ff"/></svg>')
</script>
