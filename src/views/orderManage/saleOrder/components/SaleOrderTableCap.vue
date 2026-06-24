<script setup lang="ts">
import { IconSettings } from '@arco-design/web-vue/es/icon';

interface ColumnOption {
  key: string;
  title: string;
}

defineProps<{
  page: {
    current: number;
    size: number;
    total: number;
  };
  columnOptions: ColumnOption[];
  visibleColumns: Record<string, boolean>;
}>();

defineEmits<{
  'toggle-column': [key: string, checked: boolean];
  'page-change': [current: number];
  'page-size-change': [size: number];
}>();
</script>

<template>
  <div class="table-card-cap">
    <div class="table-card-cap__right">
      <a-popover trigger="click" position="bl">
        <a-tooltip content="列显示">
          <a-button type="text" class="table-card-cap__tool">
            <template #icon><icon-settings /></template>
          </a-button>
        </a-tooltip>
        <template #content>
          <div class="so-column-settings">
            <div class="so-column-settings__title">列显示</div>
            <a-checkbox
              v-for="col in columnOptions"
              :key="col.key"
              :model-value="visibleColumns[col.key] !== false"
              @change="(checked) => $emit('toggle-column', col.key, checked === true)"
            >
              {{ col.title }}
            </a-checkbox>
          </div>
        </template>
      </a-popover>
      <a-pagination
        class="table-card-cap__pager"
        :current="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-size-options="[50, 100, 200, 500]"
        size="small"
        show-total
        show-page-size
        show-jumper
        @change="(current) => $emit('page-change', current)"
        @page-size-change="(size) => $emit('page-size-change', size)"
      />
    </div>
  </div>
</template>

<style scoped>
.so-column-settings {
  display: grid;
  grid-template-columns: repeat(2, minmax(112px, 1fr));
  gap: 8px 12px;
  min-width: 280px;
  max-width: 360px;
}

.so-column-settings__title {
  grid-column: 1 / -1;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--color-border-1);
  color: var(--color-text-2);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
}
</style>
