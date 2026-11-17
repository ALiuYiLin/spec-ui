<template>
  <SmInputNumber :model-value="4" :min="0" :max="10" :step="2" style="width: 120px" aria-label="步长 2" />
  <SmInputNumber :model-value="10" :min="0" :max="10" style="width: 120px" aria-label="上限" />
  <SmInputNumber :model-value="5" :read-only="true" style="width: 120px" aria-label="只读" />
</template>
