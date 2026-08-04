<script setup lang="ts">
import { IconDown, IconRight } from '@arco-design/web-vue/es/icon';

withDefaults(defineProps<{
  id: string;
  title: string;
  expanded: boolean;
  collapseLabel: string;
  priority?: 'core' | 'supporting' | 'audit';
  collapsible?: boolean;
}>(), { priority: 'core', collapsible: true });

const emit = defineEmits<{
  'update:expanded': [value: boolean];
}>();
</script>

<template>
  <section :id="id" class="business-detail-module" :data-priority="priority" :aria-labelledby="`${id}-title`">
    <header class="business-detail-module__head">
      <div class="business-detail-module__identity">
        <a-tooltip v-if="collapsible" :content="collapseLabel">
          <a-button
            class="business-detail-module__collapse"
            type="text"
            size="mini"
            :aria-label="collapseLabel"
            :aria-expanded="expanded"
            @click="emit('update:expanded', !expanded)"
          >
            <template #icon><icon-down v-if="expanded" /><icon-right v-else /></template>
          </a-button>
        </a-tooltip>
        <h2 :id="`${id}-title`" class="business-detail-module__title">{{ title }}</h2>
      </div>
      <div v-if="$slots.actions" class="business-detail-module__actions"><slot name="actions" /></div>
    </header>
    <div v-if="$slots.summary" class="business-detail-module__summary"><slot name="summary" /></div>
    <div v-show="expanded" class="business-detail-module__body"><slot /></div>
  </section>
</template>

<style scoped>
.business-detail-module {
  min-width: 0;
}

.business-detail-module + .business-detail-module {
  border-top: 1px solid var(--dense-card-border);
}

.business-detail-module__head {
  min-height: 44px;
  padding: 6px var(--dense-pad-section-x) 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dense-gap-inline);
  background: var(--color-bg-1);
}

.business-detail-module__identity,
.business-detail-module__actions {
  display: flex;
  align-items: center;
  min-width: 0;
}

.business-detail-module__identity { gap: 2px; }
.business-detail-module__actions { flex: 0 0 auto; gap: 6px; }

.business-detail-module__collapse {
  flex: 0 0 auto;
  color: var(--color-text-2);
}

.business-detail-module__title {
  margin: 0;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-overlay);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0;
}

.business-detail-module[data-priority='supporting'] .business-detail-module__title,
.business-detail-module[data-priority='audit'] .business-detail-module__title {
  color: var(--color-text-2);
}

.business-detail-module__summary {
  padding: 0 var(--dense-pad-section-x) 10px;
}

.business-detail-module__body {
  padding: 6px var(--dense-pad-section-x) 18px;
  min-width: 0;
}

@media (max-width: 1180px) {
  .business-detail-module__head { align-items: flex-start; }
  .business-detail-module__actions { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
