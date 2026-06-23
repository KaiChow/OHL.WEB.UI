<script setup lang="ts">
import { ref, watch } from 'vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconDownload,
  IconEdit,
  IconExclamationCircle,
  IconEye,
  IconMore
} from '@arco-design/web-vue/es/icon';
import { getStatusLabel, getStatusPill, isDangerCargo } from '../config';
import type { SaleOrderRecord } from '../types';

const props = defineProps<{
  rows: SaleOrderRecord[];
  loading: boolean;
  selectedIds: number[];
  isColumnVisible: (key: string) => boolean;
}>();

const emit = defineEmits<{
  'update:selectedIds': [ids: number[]];
  view: [row: SaleOrderRecord];
  edit: [row: SaleOrderRecord];
}>();

const tableRef = ref<VxeTableInstance>();

watch(
  () => props.rows,
  () => {
    tableRef.value?.recalculate();
  }
);

const onCheckboxChange = () => {
  const records = tableRef.value?.getCheckboxRecords() as SaleOrderRecord[] | undefined;
  emit('update:selectedIds', records?.map((r) => r.Id) ?? []);
};
</script>

<template>
  <div class="table-wrap">
    <vxe-table
      ref="tableRef"
      class="compact"
      border="none"
      size="small"
      height="100%"
      :loading="loading"
      :data="rows"
      :row-config="{ isHover: true, keyField: 'Id' }"
      :checkbox-config="{ highlight: true, range: true }"
      :sort-config="{ trigger: 'cell', remote: false }"
      @checkbox-change="onCheckboxChange"
      @checkbox-all="onCheckboxChange"
    >
      <vxe-column type="checkbox" width="44" fixed="left" />
      <vxe-column type="seq" title="序号" width="56" fixed="left" />

      <vxe-column field="OrderNo" title="订单编号" width="148" fixed="left" sortable>
        <template #default="{ row }">
          <span class="link-text link-text--strong mono" @click="emit('view', row)">
            {{ row.OrderNo }}
          </span>
          <icon-exclamation-circle
            v-if="row.HasRemark"
            style="margin-left: 4px; color: var(--warning-6); font-size: var(--dense-font-data)"
          />
        </template>
      </vxe-column>

      <vxe-column field="SubmitTime" title="提交时间" width="148" sortable>
        <template #default="{ row }">
          <span class="date-val">{{ row.SubmitTime }}</span>
        </template>
      </vxe-column>

      <vxe-column field="Status" title="订单状态" width="120">
        <template #default="{ row }">
          <span class="s-pill" :data-s="getStatusPill(row.Status)">{{ getStatusLabel(row.Status) }}</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('CargoType')" field="CargoType" title="货物类型" width="96">
        <template #default="{ row }">
          <span v-if="isDangerCargo(row.CargoType)" class="s-pill" data-s="wait">
            <icon-exclamation-circle />
            {{ row.CargoType }}
          </span>
          <span v-else>{{ row.CargoType }}</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('BizType')" field="BizType" title="业务类型" width="80" />

      <vxe-column v-if="isColumnVisible('DcgNo')" field="DcgNo" title="业务单号" width="140" sortable>
        <template #default="{ row }">
          <span class="link-text mono" @click="emit('view', row)">{{ row.DcgNo }}</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('WarehouseNo')" field="WarehouseNo" title="入仓单号" width="130">
        <template #default="{ row }">
          <span v-if="row.WarehouseNo" class="link-text mono">{{ row.WarehouseNo }}</span>
          <span v-else class="date-none">—</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('Salesman')" field="Salesman" title="业务员" width="72" />

      <vxe-column field="Shipper" title="发货人" min-width="180" show-overflow="title">
        <template #default="{ row }">
          <a-tooltip :content="row.Shipper" position="top">
            <span class="ellipsis">{{ row.Shipper }}</span>
          </a-tooltip>
        </template>
      </vxe-column>

      <vxe-column field="Consignee" title="收货人" min-width="160" show-overflow="title">
        <template #default="{ row }">
          <a-tooltip :content="row.Consignee" position="top">
            <span class="ellipsis">{{ row.Consignee }}</span>
          </a-tooltip>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('ContainerInfo')" field="ContainerInfo" title="柜型柜量" width="96">
        <template #default="{ row }">
          <span class="mono">{{ row.ContainerInfo }}</span>
        </template>
      </vxe-column>

      <vxe-column title="文件下载" width="80" align="center">
        <template #default="{ row }">
          <a-tooltip v-if="row.HasFiles" content="下载附件">
            <a-button type="text" class="row-action-btn row-action-btn--primary" @click.stop>
              <icon-download />
            </a-button>
          </a-tooltip>
          <a-tooltip v-else content="暂无附件">
            <a-button type="text" disabled class="row-action-btn btn-download-disabled">
              <icon-download />
            </a-button>
          </a-tooltip>
        </template>
      </vxe-column>

      <vxe-column title="操作" width="114" fixed="right" align="center">
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
              <a-button type="text" class="row-action-btn">
                <icon-more />
              </a-button>
              <template #content>
                <a-doption>复制</a-doption>
                <a-doption>打印</a-doption>
                <a-doption class="danger-opt">废弃</a-doption>
              </template>
            </a-dropdown>
          </div>
        </template>
      </vxe-column>

      <template #loading>
        <div class="table-skeleton">
          <div v-for="i in 8" :key="i" class="table-skeleton__row" />
        </div>
      </template>

      <template #empty>
        <div class="state-center state-center--in-table">
          <div class="state-empty-icon">📋</div>
          <span>暂无数据，换个条件试试</span>
        </div>
      </template>
    </vxe-table>
  </div>
</template>

