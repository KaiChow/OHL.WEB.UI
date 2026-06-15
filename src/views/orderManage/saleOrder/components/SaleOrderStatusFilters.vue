<script setup lang="ts">
import { scopeTabs } from '../config';
import type { PhaseFilter, ScopeFilter } from '../types';

defineProps<{
  phaseTabs: Array<{ label: string; value: PhaseFilter; count: number }>;
}>();

const scopeFilter = defineModel<ScopeFilter>('scopeFilter', { required: true });
const phaseFilter = defineModel<PhaseFilter>('phaseFilter', { required: true });
</script>

<template>
  <div class="list-filter-row">
    <span class="list-filter-label">视图</span>
    <div class="list-filter-groups">
      <div class="segmented-filter">
        <button
          v-for="tab in scopeTabs"
          :key="tab.value"
          class="filter-chip"
          :class="{ 'filter-chip--active': scopeFilter === tab.value }"
          type="button"
          @click="scopeFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <span class="list-filter-divider" />

      <div class="segmented-filter segmented-filter--status">
        <button
          v-for="tab in phaseTabs"
          :key="tab.value"
          class="filter-chip"
          :class="{ 'filter-chip--active': phaseFilter === tab.value }"
          type="button"
          @click="phaseFilter = tab.value"
        >
          {{ tab.label }}
          <span>{{ tab.count }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
