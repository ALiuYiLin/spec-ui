<template>
<SmRadio label="可选" name="demo-disabled" />
<SmRadio :disabled="true" label="禁用" name="demo-disabled" />
</template>

<script setup lang="ts">
import { Radio as SmRadio } from '@specmark/vue'
</script>
