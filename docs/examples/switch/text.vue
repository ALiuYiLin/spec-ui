<template>
  <!-- children 渲染在滑块内部：开/关两侧各放一个字的做法与 antd 的 checkedChildren 等价 -->
  <SmSwitch :model-value="true">开</SmSwitch>
  <SmSwitch>关</SmSwitch>
  <SmSwitch :model-value="true" :disabled="true">开</SmSwitch>
</template>

<script setup lang="ts">
import { Switch as SmSwitch } from '@specmark/vue'
</script>
