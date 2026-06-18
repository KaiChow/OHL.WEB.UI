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
import { Message } from '@arco-design/web-vue';
import { saleOrderPermissions, scopeTabs, statusTabs } from '../config';
import type { SaleOrderQuery } from '../types';

const props = defineProps<{
  query: SaleOrderQuery;
  statusCounts: Record<string, number>;
  selectedCount: number;
}>();

const emit = defineEmits<{
  refresh: [];
  create: [];
  'scope-change': [scope: SaleOrderQuery['scope']];
  'status-change': [status: string];
  'clear-status': [];
  export: [scope: 'page' | 'all' | 'selected'];
  batch: [action: string];
}>();

const perm = saleOrderPermissions;

const handleExport = (scope: 'page' | 'all' | 'selected') => {
  if (scope === 'selected' && props.selectedCount === 0) {
    Message.warning('请先勾选要导出的业务单');
    return;
  }
  emit('export', scope);
};

const handleBatch = (action: string) => {
  if (props.selectedCount === 0) {
    Message.warning('请先勾选业务单');
    return;
  }
  emit('batch', action);
};
</script>

<template>
  <div class="zone-l3-action zone-card zone-card--stack">
    <div class="scope-status-bar">
      <div class="scope-status-bar__scope">
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
      </div>
      <span class="scope-status-bar__divider" aria-hidden="true" />
      <div class="scope-status-bar__status">
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
        <button
          v-if="query.status"
          type="button"
          class="stab stab--clear"
          @click="emit('clear-status')"
        >
          清除状态
        </button>
      </div>
    </div>

    <div class="toolbar toolbar--dense">
      <div class="toolbar-zone">
        <span class="toolbar-zone__label">操作</span>
        <div class="toolbar-zone__btns">
          <a-button size="small" type="outline" @click="emit('refresh')">
            <template #icon><icon-refresh /></template>
            刷新
          </a-button>
          <a-button v-if="perm.canCreate" size="small" type="primary" @click="emit('create')">
            <template #icon><icon-plus /></template>
            创建业务单
          </a-button>
        </div>
      </div>

      <div v-if="perm.canSpecialTrack" class="toolbar-divider" />

      <div v-if="perm.canSpecialTrack" class="toolbar-zone">
        <span class="toolbar-zone__label">跟踪</span>
        <div class="toolbar-segment">
          <a-button size="small" type="outline" class="toolbar-segment__btn">
            <template #icon><icon-star /></template>
            特殊跟踪
          </a-button>
          <a-button size="small" type="outline" class="toolbar-segment__btn btn-muted-warn">
            关闭特殊跟踪
          </a-button>
        </div>
      </div>

      <div class="toolbar-divider" />

      <div class="toolbar-zone toolbar-zone--grow">
        <span class="toolbar-zone__label">单据</span>
        <div class="toolbar-zone__btns">
          <a-button size="small" type="outline">
            <template #icon><icon-copy /></template>
            复制
          </a-button>
          <a-button v-if="perm.canPrint" size="small" type="outline">
            <template #icon><icon-printer /></template>
            打印
          </a-button>
          <a-dropdown v-if="perm.canExport" trigger="click" @select="handleExport($event as 'page' | 'all' | 'selected')">
            <a-button size="small" type="outline">
              <template #icon><icon-download /></template>
              导出
              <icon-down class="toolbar-caret" />
            </a-button>
            <template #content>
              <a-doption value="page">导出当前页</a-doption>
              <a-doption value="all">导出全部筛选结果</a-doption>
              <a-doption value="selected">导出已选</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown v-if="perm.canBatch" trigger="click" @select="handleBatch($event as string)">
            <a-button size="small" type="outline">
              批量操作
              <icon-down class="toolbar-caret" />
            </a-button>
            <template #content>
              <a-doption value="submit">批量提交</a-doption>
              <a-doption value="export">批量导出</a-doption>
              <a-doption class="danger-opt" value="abandon">批量废弃</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>

      <div class="toolbar-aside">
        <span v-if="selectedCount > 0" class="bulk-hint">已选 {{ selectedCount }} 条</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stab--clear {
  margin-left: 4px;
  color: #8a94a6 !important;
  font-weight: 400 !important;
}
.stab--clear:hover {
  color: var(--dense-primary) !important;
  background: #eef1f8 !important;
}
.toolbar-caret {
  margin-left: 2px;
  font-size: 10px;
}
</style>
