<script setup lang="ts">
import { IconSettings } from '@arco-design/web-vue/es/icon';
import { defaultPageSizeOptions } from '../config';
import type { TableColumnOption } from '../composables/useSaleOrderTableColumns';

defineProps<{
  total: number;
  current: number;
  pageSize: number;
  columnOptions: TableColumnOption[];
  visibleColumns: Record<string, boolean>;
}>();

const emit = defineEmits<{
  'page-change': [];
  'page-size-change': [];
  'update:current': [value: number];
  'update:pageSize': [value: number];
  'toggle-column': [key: string, checked: boolean];
}>();
</script>

<template>
  <div class="table-card-cap">
    <div class="table-card-cap__left">
      <span class="table-card-cap__summary">
        共 <b>{{ total }}</b> 条
      </span>
    </div>
    <div class="table-card-cap__right">
      <a-popover trigger="click" position="bl">
        <a-button type="text" class="table-card-cap__tool" title="列显示">
          <template #icon><icon-settings /></template>
        </a-button>
        <template #content>
          <div class="column-settings">
            <div class="column-settings__title">列显示</div>
            <a-checkbox
              v-for="col in columnOptions"
              :key="col.key"
              :model-value="visibleColumns[col.key] !== false"
              @change="(v) => emit('toggle-column', col.key, v === true)"
            >
              {{ col.title }}
            </a-checkbox>
          </div>
        </template>
      </a-popover>
      <a-pagination
        class="table-card-cap__pager"
        :current="current"
        :page-size="pageSize"
        :total="total"
        :page-size-options="defaultPageSizeOptions"
        size="small"
        show-page-size
        show-jumper
        @change="(p: number) => { emit('update:current', p); emit('page-change'); }"
        @page-size-change="(s: number) => { emit('update:pageSize', s); emit('page-size-change'); }"
      />
    </div>
  </div>
</template>

<style scoped>
.column-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;
  padding: 4px 0;
}
.column-settings__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-2);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border-1);
}
</style>
