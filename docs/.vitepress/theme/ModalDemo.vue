<script setup lang="ts">
import { ref } from 'vue'
import { Button, Modal } from '@specmark/vue'

const open = ref(false)
</script>

<template>
  <Button variant="primary" label="打开对话框" @click="open = true" />
  <Modal
    :open="open"
    title="标题"
    @close="open = false"
    :footer="null"
  >
    <p style="margin: 0">这是一个模态框的示例内容。</p>
    <p style="margin: 8px 0 0">
      <Button label="关闭" @click="open = false" />
    </p>
  </Modal>
</template>
