<template>
<SmSkeleton :rows="3" />
<SmSkeleton :title="false" :rows="2" />
</template>

<script setup lang="ts">
import { Skeleton as SmSkeleton } from '@specmark/vue'
</script>
