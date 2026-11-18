<template>
<SmButton variant="solid" :loading="true" label="提交" />
<SmButton :loading="true" label="提交" />
<SmButton variant="solid" :disabled="true" label="提交" />
<SmButton :disabled="true" label="提交" />
</template>

<script setup lang="ts">
import { Button as SmButton } from '@specmark/vue'
</script>
