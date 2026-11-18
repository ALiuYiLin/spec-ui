<template>
  <SmCheckbox label="纯文本标签" :model-value="true" />
  <SmCheckbox :content="content" />
</template>

<script setup lang="ts">
import { Checkbox as SmCheckbox } from '@specmark/vue'
import { h } from 'vue'

// content 用来放富文本节点：文字仍然是 label 槽的一部分，可访问名称取它的文本
const content = h('span', [
  '我已阅读并同意 ',
  h('a', { href: '#', style: 'color: var(--color-sm-primary)' }, '服务条款'),
])
</script>
