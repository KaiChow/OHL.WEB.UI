<script setup lang="ts">
export interface BusinessMetricItem {
  id: string;
  label: string;
  value: string;
  tone?: 'normal' | 'warning' | 'danger';
  mono?: boolean;
}

defineProps<{ items: readonly BusinessMetricItem[] }>();
</script>

<template>
  <div class="business-metric-strip">
    <div v-for="item in items" :key="item.id" class="business-metric-strip__item" :data-tone="item.tone || 'normal'">
      <span class="business-metric-strip__label">{{ item.label }}</span>
      <span class="business-metric-strip__value" :class="{ mono: item.mono }">{{ item.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.business-metric-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 0;
  min-width: 0;
}

.business-metric-strip__item { display: inline-flex; align-items: baseline; gap: 5px; min-width: 0; }
.business-metric-strip__item + .business-metric-strip__item {
  padding-left: 18px;
  border-left: 1px solid var(--dense-border-subtle);
}
.business-metric-strip__label { color: var(--color-text-3); font-size: var(--dense-font-aux); line-height: 18px; }
.business-metric-strip__value { color: var(--color-text-1); font-size: var(--dense-font-data); font-weight: var(--dense-weight-title); line-height: 18px; }
.business-metric-strip__item[data-tone='warning'] .business-metric-strip__value { color: var(--dense-warning-7); }
.business-metric-strip__item[data-tone='danger'] .business-metric-strip__value { color: var(--dense-danger-7); }
</style>
