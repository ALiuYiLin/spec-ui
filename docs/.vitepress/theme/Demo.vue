<script setup lang="ts">
defineProps<{ note?: string }>()
</script>

<template>
  <div class="sm-demo">
    <div class="sm-demo__stage">
      <slot />
    </div>
    <div v-if="note" class="sm-demo__note">{{ note }}</div>
  </div>
</template>
