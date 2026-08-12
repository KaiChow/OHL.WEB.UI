<script setup lang="ts">
import { computed } from 'vue';
import { IconMore } from '@arco-design/web-vue/es/icon';
import { partitionWorkbenchRowActions } from '@/design-system/rowActions';
import type { WorkbenchRowAction } from '@/design-system/rowActions';

const props = defineProps<{
  actions: WorkbenchRowAction[];
  moreLabel: string;
}>();

const partition = computed(() => partitionWorkbenchRowActions(props.actions));
const directActions = computed(() => partition.value.direct);
const overflowActions = computed(() => partition.value.overflow);
const firstDangerIndex = computed(() => overflowActions.value.findIndex((action) => action.danger));
const overflowDisabled = computed(() => overflowActions.value.every((action) => action.disabled || action.loading));

const runAction = (action: WorkbenchRowAction) => {
  if (action.disabled || action.loading) return;
  action.onClick();
};
</script>

<template>
  <a-space class="row-actions" :size="2">
    <a-tooltip v-for="(action, index) in directActions" :key="action.key" :content="action.label">
      <a-button
        size="mini"
        type="text"
        class="row-action-btn"
        :class="{ 'row-action-btn--secondary': index > 0 }"
        :aria-label="action.label"
        :disabled="action.disabled"
        :loading="action.loading"
        @click="runAction(action)"
      >
        <template #icon><component :is="action.icon" /></template>
      </a-button>
    </a-tooltip>

    <a-dropdown v-if="overflowActions.length" trigger="click" position="br">
      <a-tooltip :content="moreLabel">
        <a-button
          size="mini"
          type="text"
          class="row-action-btn row-action-btn--more"
          :aria-label="moreLabel"
          :disabled="overflowDisabled"
        >
          <template #icon><icon-more /></template>
        </a-button>
      </a-tooltip>
      <template #content>
        <template v-for="(action, index) in overflowActions" :key="action.key">
          <a-divider v-if="action.danger && index === firstDangerIndex && index > 0" :margin="4" />
          <a-doption
            :class="{ 'danger-opt': action.danger }"
            :disabled="action.disabled || action.loading"
            @click="runAction(action)"
          >
            {{ action.label }}
          </a-doption>
        </template>
      </template>
    </a-dropdown>
  </a-space>
</template>
