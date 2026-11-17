<template>
  <SmButton label="无页脚" @click="noFooter = true" />
  <SmModal
    :open="noFooter"
    title="无页脚"
    :show-footer="false"
    body="只展示内容，不提供操作。"
    @close="noFooter = false"
  />

  <SmButton label="自定义页脚" @click="custom = true" />
  <SmModal :open="custom" title="自定义页脚" body="页脚由调用方决定。" @close="custom = false">
    <template #footer>
      <SmButton label="取消" @click="custom = false" />
      <SmButton variant="solid" label="确定" @click="custom = false" />
    </template>
  </SmModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const noFooter = ref(false)
const custom = ref(false)
</script>
