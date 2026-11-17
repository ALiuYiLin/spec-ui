<template>
  <SmCheckbox label="未选" />
  <SmCheckbox :model-value="true" label="已选" />
  <SmCheckbox :indeterminate="true" label="半选" />
  <SmCheckbox :disabled="true" label="禁用" />
</template>
