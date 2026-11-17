<template>
  <SmInput placeholder="小" size="sm" style="width: 140px" />
  <SmInput placeholder="大" size="lg" style="width: 160px" />
  <SmInput status="error" model-value="错误" style="width: 140px" />
  <SmInput :disabled="true" model-value="禁用" style="width: 140px" />
</template>
