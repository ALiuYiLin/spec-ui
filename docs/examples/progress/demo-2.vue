<template>
<div style="display: grid; gap: 12px; width: 200px">
  <SmProgress :percent="40" />
  <SmProgress :percent="100" status="success" />
  <SmProgress :percent="70" status="exception" />
</div>
</template>
