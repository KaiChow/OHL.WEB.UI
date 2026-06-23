<script setup lang="ts">
import {
  IconPlus,
  IconDownload,
  IconUpload,
  IconCopy,
  IconRefresh,
  IconUser,
  IconTag,
  IconNotification,
  IconEdit
} from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import type { CustomerQuery } from '../types';

const props = defineProps<{
  query: CustomerQuery;
  selectedCount: number;
  totalCount: number;
}>();

const emit = defineEmits<{
  refresh: [];
  create: [];
  import: [];
  export: [];
  batch: [action: string];
  'coop-status-change': [status: CustomerQuery['coopStatus']];
}>();

const requireSelected = (action: string) => {
  if (props.selectedCount === 0) {
    Message.warning('请先勾选客户');
    return;
  }
  emit('batch', action);
};

const scopeTabs = [
  { label: '全部', value: '' },
  { label: '未合作', value: 'not_cooperated' },
  { label: '已合作', value: 'cooperated' },
];
</script>

<template>
  <div class="toolbar toolbar--dense">
    <!-- 合作状态 stab — 直接嵌入工具栏左侧（tab 数量 ≤ 4 时用此方式，无需单独一行） -->
    <div class="toolbar-group">
      <button
        v-for="tab in scopeTabs"
        :key="tab.value"
        type="button"
        class="stab"
        :class="{ 'stab--active': query.coopStatus === tab.value }"
        @click="emit('coop-status-change', tab.value as CustomerQuery['coopStatus'])"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="toolbar-divider" />

    <!-- 主操作组 -->
    <div class="toolbar-group">
      <a-button size="small" type="primary" @click="emit('create')">
        <template #icon><icon-plus /></template>新增
      </a-button>
      <a-button size="small" type="outline" @click="emit('import')">
        <template #icon><icon-upload /></template>导入
      </a-button>
      <a-button size="small" type="outline" @click="emit('export')">
        <template #icon><icon-download /></template>导出
      </a-button>
    </div>

    <div class="toolbar-divider" />

    <!-- 批量操作组（flex:1 撑开） -->
    <div class="toolbar-group toolbar-group--grow">
      <a-button size="small" type="outline" @click="requireSelected('copy')">
        <template #icon><icon-copy /></template>复制
      </a-button>
      <a-button size="small" type="outline" @click="requireSelected('assign-sales')">
        <template #icon><icon-user /></template>分配销售
      </a-button>
      <a-button size="small" type="outline" @click="requireSelected('batch-track')">
        批量跟踪
      </a-button>
      <a-button size="small" type="outline" @click="requireSelected('batch-edit')">
        <template #icon><icon-edit /></template>批量编辑
      </a-button>
      <a-button size="small" type="outline" @click="requireSelected('add-tags')">
        <template #icon><icon-tag /></template>加批量标签
      </a-button>
      <a-button size="small" type="outline" @click="requireSelected('follow-remind')">
        <template #icon><icon-notification /></template>跟进提醒
      </a-button>
      <a-dropdown trigger="click" @select="(v: unknown) => requireSelected(v as string)">
        <a-button size="small" type="outline">更多操作</a-button>
        <template #content>
          <a-doption value="unbind">解绑客服销售</a-doption>
          <a-doption class="danger-opt" value="mark-abnormal">标记异常</a-doption>
        </template>
      </a-dropdown>
    </div>

    <!-- 右侧：已选提示 + 刷新 -->
    <div class="toolbar-aside">
      <span v-if="selectedCount > 0" class="bulk-hint">已选 {{ selectedCount }} 条</span>
      <a-button size="small" type="text" @click="emit('refresh')">
        <template #icon><icon-refresh /></template>
      </a-button>
    </div>
  </div>
</template>
