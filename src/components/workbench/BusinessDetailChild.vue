<script setup lang="ts">
import { IconDown, IconRight } from '@arco-design/web-vue/es/icon';

defineProps<{
  id: string;
  title: string;
  subtitle?: string;
  expanded: boolean;
  collapseLabel: string;
}>();

const emit = defineEmits<{
  'update:expanded': [value: boolean];
}>();
</script>

<template>
  <section class="business-detail-child" :data-expanded="expanded" :aria-labelledby="`${id}-title`">
    <header class="business-detail-child__head">
      <div class="business-detail-child__identity">
        <a-tooltip :content="collapseLabel">
          <a-button type="text" size="small" :aria-label="collapseLabel" :aria-expanded="expanded" @click="emit('update:expanded', !expanded)">
            <template #icon><icon-down v-if="expanded" /><icon-right v-else /></template>
          </a-button>
        </a-tooltip>
        <div class="business-detail-child__text">
          <h3 :id="`${id}-title`" class="business-detail-child__title" :title="title">{{ title }}</h3>
          <span v-if="subtitle" class="business-detail-child__subtitle">{{ subtitle }}</span>
        </div>
      </div>
      <div class="business-detail-child__aside">
        <div v-if="$slots.metrics" class="business-detail-child__metrics"><slot name="metrics" /></div>
        <div v-if="$slots.actions" class="business-detail-child__actions"><slot name="actions" /></div>
      </div>
    </header>
    <div v-show="expanded" class="business-detail-child__body"><slot /></div>
  </section>
</template>

<style scoped>
.business-detail-child {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--dense-border-subtle);
  border-radius: var(--dense-radius);
  background: var(--color-bg-1);
}

.business-detail-child + .business-detail-child { margin-top: var(--dense-gap-zone); }

.business-detail-child__head {
  box-sizing: border-box;
  min-height: var(--dense-bar-h);
  padding: 4px var(--dense-pad-section-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--color-fill-1);
}

.business-detail-child__identity,
.business-detail-child__aside,
.business-detail-child__metrics,
.business-detail-child__actions {
  display: flex;
  align-items: center;
  min-width: 0;
}

.business-detail-child__identity { gap: 2px; }
.business-detail-child__aside { gap: 16px; }
.business-detail-child__metrics { gap: 12px; }
.business-detail-child__actions { gap: 4px; flex: 0 0 auto; }
.business-detail-child__text { display: flex; align-items: baseline; gap: 8px; min-width: 0; }

.business-detail-child__title {
  margin: 0;
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
  letter-spacing: 0;
}

.business-detail-child__subtitle {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-detail-child__body {
  padding: var(--dense-pad-section-y) var(--dense-pad-section-x);
  border-top: 1px solid var(--dense-border-subtle);
  min-width: 0;
}

@media (max-width: 1180px) {
  .business-detail-child__head { align-items: flex-start; }
  .business-detail-child__aside { flex-wrap: wrap; justify-content: flex-end; gap: 4px 10px; }
}
</style>
