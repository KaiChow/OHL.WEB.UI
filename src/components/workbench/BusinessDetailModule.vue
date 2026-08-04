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
            size="small"
            :aria-label="collapseLabel"
            :aria-expanded="expanded"
            @click="emit('update:expanded', !expanded)"
          >
            <template #icon><icon-down v-if="expanded" /><icon-right v-else /></template>
          </a-button>
        </a-tooltip>
        <h2 :id="`${id}-title`" class="business-detail-module__title">{{ title }}</h2>
      </div>
      <div v-if="$slots.summary" class="business-detail-module__summary"><slot name="summary" /></div>
      <div v-if="$slots.actions" class="business-detail-module__actions"><slot name="actions" /></div>
    </header>
    <div v-show="expanded" class="business-detail-module__body"><slot /></div>
  </section>
</template>

<style scoped>
.business-detail-module {
  min-width: 0;
  background: var(--color-bg-1);
}

.business-detail-module + .business-detail-module {
  margin-top: var(--dense-gap-inline);
}

.business-detail-module__head {
  box-sizing: border-box;
  min-height: var(--dense-bar-h);
  padding: 3px var(--dense-pad-section-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dense-gap-inline);
  background: var(--color-fill-1);
  border-bottom: 1px solid var(--dense-border-subtle);
}

.business-detail-module__identity,
.business-detail-module__summary,
.business-detail-module__actions {
  display: flex;
  align-items: center;
  min-width: 0;
}

.business-detail-module__identity { gap: 4px; }
.business-detail-module__summary { flex: 1 1 auto; margin-left: var(--dense-gap-inline); }
.business-detail-module__actions { flex: 0 0 auto; gap: var(--dense-gap-inline); }

.business-detail-module__collapse {
  flex: 0 0 auto;
  color: var(--color-text-2);
}

.business-detail-module__title {
  margin: 0;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
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

.business-detail-module__body {
  padding: var(--dense-gap-zone) var(--dense-pad-section-x) var(--dense-gap-module);
  min-width: 0;
}

@media (max-width: 1180px) {
  .business-detail-module__head { align-items: center; }
  .business-detail-module__summary { overflow: hidden; }
  .business-detail-module__actions { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
