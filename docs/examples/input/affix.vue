<template>
  <SmInput placeholder="带前缀" style="width: 200px">
    <template #prefix>￥</template>
  </SmInput>
  <SmInput placeholder="带后缀" style="width: 200px">
    <template #suffix>元</template>
  </SmInput>
  <SmInput placeholder="前后都有" style="width: 200px">
    <template #prefix>@</template>
    <template #suffix>.com</template>
  </SmInput>
</template>
