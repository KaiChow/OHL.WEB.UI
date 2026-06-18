<script setup lang="ts">
import { scopeTabs, statusTabs } from '../config';
import type { SaleOrderQuery } from '../types';

defineProps<{
  query: SaleOrderQuery;
  statusCounts: Record<string, number>;
}>();

const emit = defineEmits<{
  'scope-change': [scope: SaleOrderQuery['scope']];
  'status-change': [status: string];
}>();
</script>

<template>
  <div class="status-bar status-bar--scope">
    <button
      v-for="tab in scopeTabs"
      :key="tab.value"
      type="button"
      class="stab"
      :class="{ 'stab--active': query.scope === tab.value }"
      @click="emit('scope-change', tab.value)"
    >
      {{ tab.label }}
    </button>
    <span class="tool-divider" style="height: 20px; margin: 0 8px" />
    <button
      v-for="tab in statusTabs"
      :key="tab.value || 'all'"
      type="button"
      class="stab"
      :class="{ 'stab--active': query.status === tab.value }"
      @click="emit('status-change', tab.value)"
    >
      {{ tab.label }}
      <span
        v-if="statusCounts[tab.value] !== undefined"
        class="stab-badge"
        :class="{
          'stab-badge--danger': tab.danger && statusCounts[tab.value] > 0 && query.status !== tab.value,
          'stab-badge--warn': tab.danger && query.status === tab.value
        }"
      >
        {{ statusCounts[tab.value] }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.status-bar--scope {
  border-bottom: none;
  height: 38px;
}
</style>
