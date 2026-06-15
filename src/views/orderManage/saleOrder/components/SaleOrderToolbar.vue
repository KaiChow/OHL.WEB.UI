<script setup lang="ts">
import { IconDown, IconDownload, IconPlus, IconPrinter, IconRefresh } from '@arco-design/web-vue/es/icon';

defineProps<{
  currentPage: number;
  pageSize: number;
  total: number;
}>();

defineEmits<{
  refresh: [];
  'update:currentPage': [value: number];
  'update:pageSize': [value: number];
}>();
</script>

<template>
  <div class="operation-bar">
    <a-space :size="6" class="operation-bar__actions">
      <a-button size="small" type="primary">
        <template #icon>
          <icon-plus />
        </template>
        创建业务单
      </a-button>
      <a-dropdown trigger="click">
        <a-button size="small">
          批量操作
          <icon-down class="toolbar-button__suffix" />
        </a-button>
        <template #content>
          <a-doption>批量下载文件</a-doption>
          <a-doption>批量分配操作</a-doption>
          <a-doption>批量关闭特殊跟踪</a-doption>
        </template>
      </a-dropdown>
      <a-button size="small">
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>
      <a-button size="small">
        <template #icon>
          <icon-printer />
        </template>
        打印
      </a-button>
      <a-button size="small" title="刷新" @click="$emit('refresh')">
        <template #icon>
          <icon-refresh />
        </template>
      </a-button>
    </a-space>

    <div class="top-pagination">
      <span class="top-pagination__total">共 {{ total }} 行</span>
      <a-pagination
        :current="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-size-options="[20, 50, 100, 200]"
        show-total
        show-page-size
        size="small"
        @update:current="$emit('update:currentPage', $event)"
        @update:page-size="$emit('update:pageSize', $event)"
      />
    </div>
  </div>
</template>
