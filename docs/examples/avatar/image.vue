<template>
  <SmAvatar :content="img" label="用户头像" />
  <SmAvatar shape="square" :content="img" label="方形头像" />
  <SmAvatar size="lg" :content="img" label="大头像" />
</template>

<script setup lang="ts">
import { Avatar as SmAvatar } from '@specmark/vue'
import { h } from 'vue'

const img = h('img', {
  src: 'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%231677ff"/></svg>'),
  alt: '',
  style: 'width: 100%; height: 100%; display: block; object-fit: cover',
})
</script>
