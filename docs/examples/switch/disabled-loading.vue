<template>
<SmSwitch :disabled="true" aria-label="禁用" />
<SmSwitch :model-value="true" :disabled="true" aria-label="禁用且开启" />
<SmSwitch :loading="true" aria-label="加载中" />
</template>

<script setup lang="ts">
import { Switch as SmSwitch } from '@specmark/vue'
</script>
