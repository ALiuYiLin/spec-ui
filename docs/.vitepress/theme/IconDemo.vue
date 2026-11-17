<script setup lang="ts">
import { h } from 'vue'
import { Button, CloseIcon, DownIcon } from '@specmark/vue'

const down = h(DownIcon)
const close = h(CloseIcon)
</script>

<template>
  <Button :icon="down" label="下拉" />
  <Button :icon="close" tone="danger" label="删除" />
  <Button :icon="down" variant="solid" label="下一步" />
  <Button :icon="close" shape="circle" aria-label="关闭" />
</template>
