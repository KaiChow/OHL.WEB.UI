<script setup lang="ts">
import { ref, watch } from 'vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconEye,
  IconEdit,
  IconDelete,
  IconStar,
  IconStarFill,
  IconMore
} from '@arco-design/web-vue/es/icon';
import type { CustomerRecord } from '../types';

// 标签语义颜色映射；未命中的 fallback 为 draft（灰）
const TAG_PILL_MAP: Record<string, string> = {
  VIP: 'rel',
  '长期合作': 'rel',
  '已合作': 'rel',
  REPLIED: 'acc',
  '已返佣': 'acc',
  '部件已买': 'acc',
  INQUIRIED: 'op',
  '报价中': 'op',
  '询盘客户': 'op',
  '重点跟进': 'wait',
  'keep follow up': 'wait',
  '跟进中': 'wait',
  BAU: 'partial',
  '半合作': 'partial',
  '异常邮箱': 'rej',
  '已流失': 'rej',
};

function tagPill(tag: string): string {
  return TAG_PILL_MAP[tag] ?? 'draft';
}

const props = defineProps<{
  rows: CustomerRecord[];
  loading: boolean;
  selectedIds: number[];
}>();

const emit = defineEmits<{
  'update:selectedIds': [ids: number[]];
  view: [row: CustomerRecord];
  edit: [row: CustomerRecord];
  delete: [row: CustomerRecord];
  'toggle-star': [row: CustomerRecord];
}>();

const tableRef = ref<VxeTableInstance>();

watch(
  () => props.rows,
  () => {
    tableRef.value?.recalculate();
  }
);

const onCheckboxChange = () => {
  const records = tableRef.value?.getCheckboxRecords() as CustomerRecord[] | undefined;
  emit('update:selectedIds', records?.map((r) => r.Id) ?? []);
};

const coopStatusMap: Record<string, { label: string; pill: string }> = {
  cooperated: { label: '已合作', pill: 'rel' },
  not_cooperated: { label: '未合作', pill: 'wait' }
};
</script>

<template>
  <div class="table-wrap">
    <vxe-table
      ref="tableRef"
      border="none"
      size="small"
      height="100%"
      show-overflow="title"
      :loading="loading"
      :data="rows"
      :row-config="{ isHover: true, keyField: 'Id' }"
      :checkbox-config="{ highlight: true, range: true }"
      @checkbox-change="onCheckboxChange"
      @checkbox-all="onCheckboxChange"
    >
      <vxe-column type="checkbox" width="40" fixed="left" />
      <vxe-column type="seq" title="序号" width="44" fixed="left" />

      <!-- 星标 -->
      <vxe-column title="顶" width="40" fixed="left" align="center">
        <template #default="{ row }">
          <a-tooltip :content="row.IsStarred ? '取消星标' : '星标'">
            <a-button type="text" class="row-action-btn" @click="emit('toggle-star', row)">
              <icon-star-fill v-if="row.IsStarred" style="color:var(--warning-6)" />
              <icon-star v-else style="color:var(--color-text-4)" />
            </a-button>
          </a-tooltip>
        </template>
      </vxe-column>

      <!-- 客户名称 + 合作状态 pill -->
      <vxe-column field="Name" title="客户名称" width="200" fixed="left">
        <template #default="{ row }">
          <div class="cell-two-line">
            <span class="c2-main link-text link-text--strong mono" @click="emit('view', row)">
              {{ row.Name }}
            </span>
            <span class="c2-sub">
              <span class="s-pill" :data-s="coopStatusMap[row.CoopStatus]?.pill">
                {{ coopStatusMap[row.CoopStatus]?.label }}
              </span>
            </span>
          </div>
        </template>
      </vxe-column>

      <!-- 标签（语义颜色，最多3个+badge） -->
      <vxe-column field="Tags" title="标签" min-width="160">
        <template #default="{ row }">
          <div style="display:flex;flex-wrap:wrap;gap:3px;align-items:center">
            <span
              v-for="tag in row.Tags.slice(0, 3)"
              :key="tag"
              class="s-pill"
              :data-s="tagPill(tag)"
              style="font-size:var(--dense-font-micro)"
            >
              {{ tag }}
            </span>
            <span v-if="row.Tags.length > 3" class="stab-badge">+{{ row.Tags.length - 3 }}</span>
          </div>
        </template>
      </vxe-column>

      <!-- 客户类型 -->
      <vxe-column field="CustomerType" title="客户类型" width="80" />

      <!-- 国家 -->
      <vxe-column field="Country" title="国家" width="80" />

      <!-- 联系人（最多2行+badge，保证行高一致） -->
      <vxe-column field="Contacts" title="联系人" width="120">
        <template #default="{ row }">
          <div
            v-for="c in row.Contacts.slice(0, 2)"
            :key="c.id"
            style="font-size:var(--dense-font-data);line-height:1.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
          >
            {{ c.name }}
          </div>
          <span v-if="row.Contacts.length > 2" class="stab-badge">+{{ row.Contacts.length - 2 }}</span>
        </template>
      </vxe-column>

      <!-- 联系人邮箱 -->
      <vxe-column field="Contacts" title="联系人邮箱" width="200">
        <template #default="{ row }">
          <div
            v-for="c in row.Contacts.slice(0, 2)"
            :key="c.id"
            style="font-size:var(--dense-font-aux);line-height:1.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--color-text-2)"
          >
            {{ c.email }}
          </div>
          <span v-if="row.Contacts.length > 2" class="stab-badge">+{{ row.Contacts.length - 2 }}</span>
        </template>
      </vxe-column>

      <!-- 联系人电话 -->
      <vxe-column title="联系人电话" width="140">
        <template #default="{ row }">
          <div
            v-for="c in row.Contacts.slice(0, 2)"
            :key="c.id"
            style="font-size:var(--dense-font-aux);line-height:1.6;color:var(--color-text-2)"
          >
            {{ c.phone }}
          </div>
          <span v-if="row.Contacts.length > 2" class="stab-badge">+{{ row.Contacts.length - 2 }}</span>
        </template>
      </vxe-column>

      <!-- 联系人职务 -->
      <vxe-column title="联系人职务" width="110">
        <template #default="{ row }">
          <div
            v-for="c in row.Contacts.slice(0, 2)"
            :key="c.id"
            style="font-size:var(--dense-font-aux);line-height:1.6;color:var(--color-text-3)"
          >
            {{ c.title }}
          </div>
          <span v-if="row.Contacts.length > 2" class="stab-badge">+{{ row.Contacts.length - 2 }}</span>
        </template>
      </vxe-column>

      <!-- 最新跟进记录 -->
      <vxe-column field="LatestFollowUp" title="最新跟进记录" min-width="200">
        <template #default="{ row }">
          <span
            style="font-size:var(--dense-font-aux);color:var(--color-text-2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden"
          >
            {{ row.LatestFollowUp }}
          </span>
        </template>
      </vxe-column>

      <!-- 最近更新 -->
      <vxe-column field="LastUpdated" title="最近更新" width="100">
        <template #default="{ row }">
          <span style="font-size:var(--dense-font-aux);color:var(--color-text-3)">{{ row.LastUpdated }}</span>
        </template>
      </vxe-column>

      <!-- 品名 -->
      <vxe-column field="ProductName" title="品名" width="120" />

      <!-- 操作 -->
      <vxe-column title="操作" width="88" fixed="right" align="center">
        <template #default="{ row }">
          <div class="row-actions">
            <a-tooltip content="查看">
              <a-button type="text" class="row-action-btn" @click="emit('view', row)">
                <icon-eye />
              </a-button>
            </a-tooltip>
            <a-tooltip content="编辑">
              <a-button type="text" class="row-action-btn" @click="emit('edit', row)">
                <icon-edit />
              </a-button>
            </a-tooltip>
            <a-dropdown trigger="click">
              <a-tooltip content="更多">
                <a-button type="text" class="row-action-btn">
                  <icon-more />
                </a-button>
              </a-tooltip>
              <template #content>
                <a-doption class="danger-opt" @click="emit('delete', row)">
                  <icon-delete />删除
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </template>
      </vxe-column>

      <template #empty>
        <div class="state-center state-center--in-table">
          <span style="font-size:var(--dense-font-aux);color:var(--color-text-3)">暂无客户数据，换个条件试试</span>
        </div>
      </template>
    </vxe-table>
  </div>
</template>
