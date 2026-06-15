<script setup lang="ts">
import { IconFile, IconMore } from '@arco-design/web-vue/es/icon';
import { saleOrderColumns, statusColorMap, statusTextMap } from '../config';
import type { SaleOrderListColumnKey, SaleOrderRow } from '../types';

defineProps<{
  rows: SaleOrderRow[];
  orderCount: number;
  total: number;
  getCellClassName: (params: { column: { field?: SaleOrderListColumnKey } }) => string;
  getRowClassName: (params: { row: SaleOrderRow }) => string;
  setHoveredOrderGroup: (row: SaleOrderRow | null) => void;
  setCurrentOrderGroup: (row: SaleOrderRow) => void;
}>();

defineEmits<{
  openDetail: [row: SaleOrderRow];
}>();
</script>

<template>
  <div class="section-bar">
    <div class="section-bar__title">
      <strong>业务单列表</strong>
      <span>共 {{ orderCount }} 单 / {{ total }} 行 / 本页 {{ rows.length }} 行</span>
    </div>
    <div class="section-bar__meta">
      <span>默认按提交时间倒序</span>
    </div>
  </div>

  <div class="freight-table-viewport">
    <vxe-table
      class="freight-table"
      stripe
      show-overflow="title"
      show-header-overflow="title"
      size="mini"
      max-height="640"
      :column-config="{ resizable: true, minWidth: 80 }"
      :scroll-x="{ enabled: true, gt: 0 }"
      :cell-class-name="getCellClassName"
      :row-class-name="getRowClassName"
      :row-config="{ isHover: true }"
      :data="rows"
      highlight-current-row
      @cell-mouseenter="setHoveredOrderGroup($event.row)"
      @cell-mouseleave="setHoveredOrderGroup(null)"
      @cell-click="setCurrentOrderGroup($event.row)"
    >
      <vxe-column type="seq" title="#" width="44" />
      <vxe-column
        v-for="column in saleOrderColumns"
        :key="column.field"
        :field="column.field"
        :title="column.title"
        :width="column.width"
        :align="column.align"
        :fixed="column.fixed"
      >
        <template #default="{ row }">
          <a-tag v-if="column.field === 'FollowState'" size="small" :color="statusColorMap[row.FollowState]">
            <span class="status-dot" />
            {{ statusTextMap[row.FollowState] }}
          </a-tag>

          <button
            v-else-if="column.field === 'DcgNo'"
            class="order-no-button"
            type="button"
            @click="$emit('openDetail', row)"
          >
            {{ row.DcgNo || '-' }}
          </button>

          <button
            v-else-if="column.field === 'OrderNo'"
            class="table-link-button"
            type="button"
            @click="$emit('openDetail', row)"
          >
            {{ row.OrderNo || '-' }}
          </button>

          <a-button v-else-if="column.field === 'DownFile'" class="table-file-btn" size="mini" type="text">
            <template #icon>
              <icon-file />
            </template>
            文件
          </a-button>

          <div v-else-if="column.field === 'Operation'" class="table-row-actions">
            <a-button class="table-action-btn" size="mini" type="text" @click="$emit('openDetail', row)">查看</a-button>
            <a-dropdown trigger="click">
              <a-button class="table-more-btn" size="mini" type="text">
                <template #icon>
                  <icon-more />
                </template>
              </a-button>
              <template #content>
                <a-doption @click="$emit('openDetail', row)">查看详情</a-doption>
                <a-doption>下载文件</a-doption>
                <a-doption>编辑订单</a-doption>
                <a-doption>操作日志</a-doption>
              </template>
            </a-dropdown>
          </div>

          <span
            v-else
            :class="{
              'table-secondary-link': ['HblNo', 'MblNo'].includes(column.field),
              'table-route-text': ['LoaddingPortEn', 'DeliveryPortEn'].includes(column.field),
              'table-container-text': column.field === 'ContainerDataJson',
              'table-service-text': ['ServiceItemStr', 'ServiceScopeStr', 'LoaddingTypeStr'].includes(column.field),
              'table-muted-text': !row[column.field]
            }"
          >
            {{ row[column.field] || '-' }}
          </span>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>
