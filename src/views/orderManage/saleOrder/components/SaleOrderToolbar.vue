<script setup lang="ts">
import {
  IconCopy,
  IconDownload,
  IconDown,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconStar
} from '@arco-design/web-vue/es/icon';
import { defaultPageSizeOptions } from '../config';

defineProps<{
  total: number;
  selectedCount: number;
  current: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  refresh: [];
  create: [];
  'page-change': [];
  'page-size-change': [];
  'update:current': [value: number];
  'update:pageSize': [value: number];
}>();
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <a-button size="small" type="outline" @click="emit('refresh')">
        <template #icon><icon-refresh /></template>
        刷新
      </a-button>
      <a-button size="small" type="primary" @click="emit('create')">
        <template #icon><icon-plus /></template>
        创建业务单
      </a-button>
      <a-button size="small" type="outline">
        <template #icon><icon-star /></template>
        特殊跟踪
      </a-button>
      <a-button size="small" type="outline" status="warning">关闭特殊跟踪</a-button>
      <a-button size="small" type="outline">
        <template #icon><icon-copy /></template>
        复制业务单
      </a-button>
      <a-button size="small" type="outline">
        <template #icon><icon-printer /></template>
        打印业务单
      </a-button>
      <a-button size="small" type="outline">
        <template #icon><icon-download /></template>
        导出
      </a-button>
      <a-dropdown trigger="click">
        <a-button size="small" type="outline">
          批量操作 <icon-down />
        </a-button>
        <template #content>
          <a-doption>批量提交</a-doption>
          <a-doption>批量导出</a-doption>
          <a-doption class="danger-opt">批量废弃</a-doption>
        </template>
      </a-dropdown>
      <span v-if="selectedCount > 0" class="bulk-hint">已选 {{ selectedCount }} 条</span>
    </div>

    <div class="toolbar-right toolbar-pager">
      <a-pagination
        :current="current"
        :page-size="pageSize"
        :total="total"
        :page-size-options="defaultPageSizeOptions"
        size="small"
        show-total
        show-page-size
        show-jumper
        @change="(p: number) => { emit('update:current', p); emit('page-change'); }"
        @page-size-change="(s: number) => { emit('update:pageSize', s); emit('page-size-change'); }"
      />
    </div>
  </div>
</template>
