<script setup lang="ts">
import { computed } from 'vue';
import { QUERY_GRID_ITEM_SPANS } from '@/design-system/queryLayout';
import type { QueryGridItemRole } from '@/design-system/queryLayout';

const props = defineProps<{
  role: QueryGridItemRole;
}>();

const span = computed(() => QUERY_GRID_ITEM_SPANS[props.role]);
</script>

<template>
  <div
    class="query-field-col"
    :data-query-width="role"
    :style="{ '--query-field-span': span }"
  >
    <slot />
  </div>
</template>

<style scoped>
.query-field-col {
  grid-column: span var(--query-field-span);
  min-width: 0;
}
</style>
