<template>
<SmButton :disabled="true" label="描边" />
<SmButton variant="dashed" :disabled="true" label="虚线" />
<SmButton variant="solid" :disabled="true" label="实心" />
<SmButton variant="text" :disabled="true" label="文本" />
<SmButton variant="link" :disabled="true" label="链接" />
</template>

<script setup lang="ts">
import { Button as SmButton } from '@specmark/vue'
</script>
