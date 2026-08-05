<script setup lang="ts">
import { computed } from 'vue';
import { IconEmpty, IconInfoCircle, IconLock } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
  kind: 'empty' | 'error' | 'permission';
  title: string;
  description: string;
}>();

const icon = computed(() => {
  if (props.kind === 'permission') return IconLock;
  if (props.kind === 'error') return IconInfoCircle;
  return IconEmpty;
});
</script>

<template>
  <div class="workbench-empty-state" role="status" aria-live="polite">
    <component :is="icon" class="workbench-empty-state__icon" />
    <div class="workbench-empty-state__title">{{ title }}</div>
    <div class="workbench-empty-state__description">{{ description }}</div>
    <div v-if="$slots.actions" class="workbench-empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.workbench-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  padding: 28px 16px;
  color: var(--color-text-3);
  text-align: center;
}

.workbench-empty-state__icon {
  margin-bottom: 8px;
  color: var(--color-text-4);
  font-size: 32px;
}

.workbench-empty-state__title {
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
}

.workbench-empty-state__description {
  max-width: 360px;
  margin-top: 4px;
  font-size: var(--dense-font-aux);
  line-height: 18px;
}

.workbench-empty-state__actions {
  margin-top: 12px;
}
</style>
