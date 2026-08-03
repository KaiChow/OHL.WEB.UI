<script setup lang="ts">
import { computed } from 'vue';
import { QUERY_GRID_COLUMN_PROPS } from '../../design-system/queryLayout';
import type { QueryGridItemRole } from '../../design-system/queryLayout';

const props = defineProps<{
  role: QueryGridItemRole;
}>();

const columnProps = computed(() => QUERY_GRID_COLUMN_PROPS[props.role]);
</script>

<template>
  <a-col v-bind="columnProps" :data-query-width="role">
    <slot />
  </a-col>
</template>
