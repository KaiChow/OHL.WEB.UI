<script setup lang="ts">
type WorkflowStateKey = string | number;

interface WorkflowStateOption {
  key: WorkflowStateKey;
  label: string;
  count?: number;
  tone?: 'warn' | 'danger';
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  modelValue: WorkflowStateKey;
  label: string;
  options: readonly WorkflowStateOption[];
  showLabel?: boolean;
}>(), {
  showLabel: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: WorkflowStateKey];
  change: [value: WorkflowStateKey];
}>();

const handleChange = (value: WorkflowStateKey) => {
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<template>
  <div
    v-if="props.options.length > 1"
    class="workflow-state-selector"
    data-workbench-status-selector="workflow-state"
  >
    <span v-if="props.showLabel" class="workflow-state-selector__label">{{ props.label }}</span>
    <a-tabs
      :active-key="props.modelValue"
      :aria-label="props.label"
      type="line"
      size="small"
      hide-content
      :header-padding="false"
      scroll-position="auto"
      class="workflow-state-selector__control"
      @change="handleChange"
    >
      <a-tab-pane
        v-for="option in props.options"
        :key="option.key"
        :disabled="option.disabled"
      >
        <template #title>
          <span class="workflow-state-selector__option">
            {{ option.label }}
            <a-badge
              v-if="option.count !== undefined"
              class="workflow-state-selector__count"
              :class="{
                'workflow-state-selector__count--warn': option.tone === 'warn',
                'workflow-state-selector__count--danger': option.tone === 'danger',
                'workflow-state-selector__count--active': option.key === props.modelValue,
              }"
              :count="option.count"
              :max-count="9999"
            >
            </a-badge>
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
.workflow-state-selector {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.workflow-state-selector__label {
  flex: 0 0 auto;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  white-space: nowrap;
}

.workflow-state-selector__control {
  flex: 1;
  min-width: 0;
}

/* The standard workbench frame owns the workflow row boundary. Keep Arco's
   active ink, but remove its full-width navigation baseline so the head does
   not render two competing bottom borders. */
.workflow-state-selector__control :deep(.arco-tabs-nav::before) {
  display: none;
}

.workflow-state-selector__option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.workflow-state-selector__count {
  display: inline-flex;
  vertical-align: middle;
}

.workflow-state-selector__count :deep(.arco-badge-number) {
  position: static;
  display: inline-block;
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  border: 0;
  border-radius: 10px;
  background: var(--color-fill-3);
  box-shadow: none;
  color: var(--color-text-2);
  font-size: var(--dense-font-micro);
  font-weight: var(--dense-weight-nav-active);
  line-height: 16px;
  text-align: center;
  transform: none;
}

.workflow-state-selector__count--warn :deep(.arco-badge-number) {
  background: var(--dense-warning-1);
  color: var(--dense-warning-7);
}

.workflow-state-selector__count--danger :deep(.arco-badge-number) {
  background: var(--dense-danger-1);
  color: var(--dense-danger-7);
}

.workflow-state-selector__count--active :deep(.arco-badge-number) {
  background: var(--dense-primary-1);
  color: var(--dense-primary-7);
}

@media (max-width: 1279px) {
  .workflow-state-selector__label {
    display: none;
  }
}
</style>
