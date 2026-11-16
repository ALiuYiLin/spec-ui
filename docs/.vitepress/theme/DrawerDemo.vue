<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer } from '@specmark/vue'

const open = ref(false)
</script>

<template>
  <Button variant="primary" label="打开抽屉" @click="open = true" />
  <Drawer :open="open" title="标题" @close="open = false">
    <p style="margin: 0">这是抽屉里的内容。</p>
    <p style="margin: 8px 0 0">
      <Button label="关闭" @click="open = false" />
    </p>
  </Drawer>
</template>
