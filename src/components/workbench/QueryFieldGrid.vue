<template>
  <a-row
    :gutter="[12, 10]"
    align="end"
    class="query-field-grid"
    data-query-layout="semantic-grid-v1"
  >
    <slot />
  </a-row>
</template>

<style scoped>
.query-field-grid {
  width: 100%;
  max-width: 1240px;
}
</style>
