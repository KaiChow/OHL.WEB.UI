<script setup lang="ts">
import { ref, watch } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconDownload,
  IconEdit,
  IconExclamationCircle,
  IconEye,
  IconMore,
  IconPrinter,
  IconCopy
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
const compactRowConfig = { isHover: true, keyField: 'Id', height: 36 };

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

const handleDownloadFiles = (row: SaleOrderRecord) => {
  if (!row.HasFiles) {
    Message.warning('该业务单暂无可下载附件');
    return;
  }
  Message.success(`已开始下载 ${row.OrderNo} 附件`);
};

const handlePrint = (row: SaleOrderRecord) => {
  Message.success(`已发送 ${row.OrderNo} 打印任务`);
};

const handleCopy = (row: SaleOrderRecord) => {
  Message.success(`已复制业务单 ${row.OrderNo}`);
};

const handleAbandon = (row: SaleOrderRecord) => {
  Modal.warning({
    title: '确认废弃业务单？',
    content: `废弃后，${row.OrderNo} 将不可继续操作。`,
    hideCancel: false,
    okText: '确认废弃',
    cancelText: '取消',
    onOk: () => {
      Message.success(`已废弃业务单 ${row.OrderNo}`);
    }
  });
};
</script>

<template>
  <div class="table-wrap">
    <vxe-table
      ref="tableRef"
      class="compact workbench-table"
      border="none"
      size="small"
      height="100%"
      show-overflow="title"
      :loading="loading"
      :data="rows"
      :stripe="true"
      :row-config="compactRowConfig"
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

      <vxe-column field="Status" title="业务单状态" width="120">
        <template #default="{ row }">
          <span class="s-pill" :data-s="getStatusPill(row.Status)">{{ getStatusLabel(row.Status) }}</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('CargoType')" field="CargoType" title="货物类型" width="96" align="center">
        <template #default="{ row }">
          <span
            class="cargo-type-token"
            :class="{ 'cargo-type-token--risk': isDangerCargo(row.CargoType) }"
            :title="row.CargoType"
          >
            {{ row.CargoType }}
          </span>
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

      <vxe-column v-if="isColumnVisible('Shipper')" field="Shipper" title="发货人" min-width="180">
        <template #default="{ row }">
          <span v-if="row.Shipper" class="clip-text">{{ row.Shipper }}</span>
          <span v-else class="date-none">—</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('Consignee')" field="Consignee" title="收货人" min-width="180">
        <template #default="{ row }">
          <span v-if="row.Consignee" class="clip-text">{{ row.Consignee }}</span>
          <span v-else class="date-none">—</span>
        </template>
      </vxe-column>

      <vxe-column v-if="isColumnVisible('ContainerInfo')" field="ContainerInfo" title="柜型柜量" width="96">
        <template #default="{ row }">
          <span class="mono">{{ row.ContainerInfo }}</span>
        </template>
      </vxe-column>

      <!-- 操作列：查看 + 编辑两个高频 icon，其余收进 ⋯ 下拉 -->
      <vxe-column title="操作" width="120" fixed="right" align="center">
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
            <a-dropdown trigger="click" popup-container="body" class="row-action-dropdown">
              <a-button type="text" class="row-action-btn">
                <icon-more />
              </a-button>
              <template #content>
                <div class="row-action-menu">
                  <a-doption :disabled="!row.HasFiles" @click="handleDownloadFiles(row)">
                    <template #icon><icon-download /></template>
                    下载附件{{ row.HasFiles ? '' : '（暂无）' }}
                  </a-doption>
                  <a-doption @click="handlePrint(row)">
                    <template #icon><icon-printer /></template>
                    打印
                  </a-doption>
                  <a-doption @click="handleCopy(row)">
                    <template #icon><icon-copy /></template>
                    复制业务单
                  </a-doption>
                </div>
                <a-divider class="row-action-menu__divider" margin="4px" />
                <div class="row-action-menu row-action-menu--danger">
                  <a-doption class="danger-opt" @click="handleAbandon(row)">废弃</a-doption>
                </div>
              </template>
            </a-dropdown>
          </div>
        </template>
      </vxe-column>

      <template #empty>
        <div class="state-center state-center--in-table">
          <icon-exclamation-circle class="state-empty-icon" />
          <span>暂无数据，换个条件试试</span>
        </div>
      </template>
    </vxe-table>
  </div>
</template>
