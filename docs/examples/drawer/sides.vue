<template>
  <SmButton label="左侧抽屉" @click="left = true" />
  <SmDrawer :open="left" side="left" title="左侧抽屉" body="内容" @close="left = false" />

  <SmButton label="顶部抽屉" @click="top = true" />
  <SmDrawer :open="top" side="top" title="顶部抽屉" body="内容" @close="top = false" />
</template>

<script setup lang="ts">
import { Button as SmButton, Drawer as SmDrawer } from '@specmark/vue'
import { ref } from 'vue'

const left = ref(false)
const top = ref(false)
</script>
