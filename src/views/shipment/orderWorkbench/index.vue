<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconPlus,
  IconDownload,
  IconDown,
  IconEye,
  IconMore,
  IconSettings,
} from '@arco-design/web-vue/es/icon';
import { downloadCsvFile } from '../../../utils/mock-actions';
import ShipmentOrderDetailDrawer from '../orderDetail/ShipmentOrderDetailDrawer.vue';
import { shipmentWorkbenchRows } from './mockData';
import type {
  ShipmentOrderQuery,
  ShipmentStatusKey,
  ShipmentWorkbenchRow,
  StatusTabStat,
} from './types';
import type { ShipmentOrderDetailRecord } from '../orderDetail/types';
import { getShipmentOrderMock } from '../orderDetail/mockData';

const router = useRouter();

const STATUS_TABS: { key: ShipmentStatusKey; label: string; tone?: 'danger' | 'warn' }[] = [
  { key: 'all', label: '全部' },
  { key: 'waitBooking', label: '待订舱' },
  { key: 'waitRelease', label: '待放舱' },
  { key: 'waitCustoms', label: '待报关' },
  { key: 'sailed', label: '已开船' },
  { key: 'exception', label: '异常', tone: 'danger' },
];

const defaultQuery = (): ShipmentOrderQuery => ({
  orderNo: '',
  customerName: '',
  vesselVoyage: '',
  blNo: '',
  pol: '',
  pod: '',
  orderStatus: undefined,
  operator: undefined,
  businessType: undefined,
  etdRange: [],
  closingRange: [],
  hasException: undefined,
  bookingNo: '',
  containerNo: '',
  containerType: undefined,
  carrier: undefined,
  overseasAgent: undefined,
  customsMode: undefined,
  truckSupplier: undefined,
  warehouse: undefined,
  tradeTerm: undefined,
  paymentMethod: undefined,
  fileStatus: undefined,
  feeStatus: undefined,
  createdRange: [],
  updatedRange: [],
  isOverdue: undefined,
  hasUnreadMsg: undefined,
  hasPendingApproval: undefined,
});

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const appliedQuery = ref<ShipmentOrderQuery>(defaultQuery());
const activeStatusTab = ref<ShipmentStatusKey>('all');
const advancedFilterVisible = ref(false);
const loading = ref(false);
const tableRef = ref<VxeTableInstance>();
const selectedRows = ref<ShipmentWorkbenchRow[]>([]);
const allRows = ref<ShipmentWorkbenchRow[]>([...shipmentWorkbenchRows]);
const drawerVisible = ref(false);
const currentDetail = ref<ShipmentOrderDetailRecord | null>(null);
const statusModalVisible = ref(false);
const statusForm = reactive({ targetStatus: undefined as string | undefined, reason: '', notify: true, createNode: true });
const statusTargetRow = ref<ShipmentWorkbenchRow | null>(null);

const page = reactive({ current: 1, size: 100, total: 0 });

const matchText = (value: string, keyword: string) =>
  !keyword.trim() || value.toLowerCase().includes(keyword.trim().toLowerCase());

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (activeStatusTab.value !== 'all' && !row.quickStatus.includes(activeStatusTab.value)) return false;
    if (q.orderNo.trim() && ![row.orderNo, row.blNo, row.bookingNo].some((value) => matchText(value, q.orderNo))) return false;
    if (!matchText(row.customerName, q.customerName)) return false;
    if (!matchText(row.pol, q.pol)) return false;
    if (!matchText(row.pod, q.pod)) return false;
    if (!matchText(row.vesselVoyage, q.vesselVoyage)) return false;
    if (!matchText(row.blNo, q.blNo)) return false;
    if (q.bookingNo && !matchText(row.bookingNo, q.bookingNo)) return false;
    if (q.orderStatus && row.orderStatus !== q.orderStatus) return false;
    if (q.operator && row.operator !== q.operator) return false;
    if (q.businessType && row.businessType !== q.businessType) return false;
    if (q.hasException === 'yes' && row.exceptionStatus !== 'open') return false;
    if (q.hasException === 'no' && row.exceptionStatus === 'open') return false;
    if (q.etdRange.length === 2) {
      const [start, end] = q.etdRange;
      if ((start && row.etd < start) || (end && row.etd > end)) return false;
    }
    if (q.closingRange.length === 2) {
      const [start, end] = q.closingRange;
      const closingDate = row.closingTime.slice(0, 10);
      if ((start && closingDate < start) || (end && closingDate > end)) return false;
    }
    if (q.fileStatus === 'missing' && row.fileStatus !== 'missing') return false;
    if (q.fileStatus === 'complete' && row.fileStatus !== 'complete') return false;
    if (q.feeStatus === 'pending' && row.feeStatus !== 'pending') return false;
    if (q.feeStatus === 'none' && row.feeStatus !== 'none') return false;
    if (q.feeStatus === 'confirmed' && row.feeStatus !== 'confirmed') return false;
    if (q.updatedRange.length === 2) {
      const [start, end] = q.updatedRange;
      const updatedDate = row.updatedAt.slice(0, 10);
      if ((start && updatedDate < start) || (end && updatedDate > end)) return false;
    }
    if (q.isOverdue === 'yes' && !row.isOverdue) return false;
    if (q.isOverdue === 'no' && row.isOverdue) return false;
    return true;
  });
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const statusTabStats = computed<StatusTabStat[]>(() =>
  STATUS_TABS.map((tab) => {
    const rows = tab.key === 'all' ? allRows.value : allRows.value.filter((r) => r.quickStatus.includes(tab.key));
    return {
      key: tab.key,
      label: tab.label,
      count: rows.length,
      todayNew: rows.filter((r) => r.todayNew).length,
      overdue: rows.filter((r) => r.isOverdue).length,
      tone: tab.tone,
    };
  }),
);

const selectedCount = computed(() => selectedRows.value.length);

const handleSearch = () => {
  appliedQuery.value = { ...query, etdRange: [...query.etdRange], closingRange: [...query.closingRange], createdRange: [...query.createdRange], updatedRange: [...query.updatedRange] };
  page.current = 1;
  page.total = filteredRows.value.length;
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = defaultQuery();
  activeStatusTab.value = 'all';
  page.current = 1;
  page.total = filteredRows.value.length;
};

const clearAdvancedFilters = () => {
  query.vesselVoyage = '';
  query.blNo = '';
  query.bookingNo = '';
  query.orderStatus = undefined;
  query.operator = undefined;
  query.businessType = undefined;
  query.etdRange = [];
  query.closingRange = [];
  query.hasException = undefined;
  query.fileStatus = undefined;
  query.feeStatus = undefined;
  query.updatedRange = [];
  query.isOverdue = undefined;
};

const applyAdvancedFilters = () => {
  advancedFilterVisible.value = false;
  handleSearch();
};

const onStatusTabClick = (key: ShipmentStatusKey) => {
  activeStatusTab.value = key;
  page.current = 1;
  page.total = filteredRows.value.length;
};

const onSelectionChange = () => {
  selectedRows.value = (tableRef.value?.getCheckboxRecords() ?? []) as ShipmentWorkbenchRow[];
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedRows.value = [];
};

const openDetailDrawer = (row: ShipmentWorkbenchRow) => {
  currentDetail.value = getShipmentOrderMock(row.orderNo);
  drawerVisible.value = true;
};

const openFullDetail = (orderNo: string) => {
  drawerVisible.value = false;
  router.push({ name: 'ShipmentOrderDetail', query: { orderNo } });
};

const openStatusModal = (row: ShipmentWorkbenchRow) => {
  statusTargetRow.value = row;
  statusForm.targetStatus = undefined;
  statusForm.reason = '';
  statusModalVisible.value = true;
};

const confirmStatusChange = () => {
  if (!statusForm.targetStatus || !statusForm.reason.trim()) {
    Message.warning('请选择目标状态并填写修改原因');
    return;
  }
  Message.success('状态已更新');
  statusModalVisible.value = false;
};

const handleCancelOrder = (row: ShipmentWorkbenchRow) => {
  Modal.confirm({
    title: '作废订单',
    content: `确认作废订单 ${row.orderNo}？此操作不可撤销。`,
    okButtonProps: { status: 'danger' },
    onOk: () => Message.success('订单已作废'),
  });
};

const handleExport = () => {
  const rows = selectedRows.value.length ? selectedRows.value : filteredRows.value;
  downloadCsvFile(
    `海运出口订单-${rows.length}条.csv`,
    ['订单号', '客户', '业务类型', '状态', 'ETD', '目的港', '操作人员'],
    rows.map((r) => [r.orderNo, r.customerName, r.businessType, r.orderStatusLabel, r.etd, r.pod, r.operator]),
  );
  Message.success(`已导出 ${rows.length} 条`);
};

const handleBatchNotify = () => {
  if (!selectedCount.value) {
    Message.warning('请先选择订单');
    return;
  }
  Message.success(`已向 ${selectedCount.value} 票订单发送通知（模拟）`);
};

const handleBatchAction = (label: string) => {
  if (!selectedCount.value) {
    Message.warning('请先选择订单');
    return;
  }
  Message.success(`${label}已提交（模拟）`);
};

const fetchList = async () => {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 300));
  page.total = filteredRows.value.length;
  loading.value = false;
};

page.total = filteredRows.value.length;
</script>

<template>
  <div class="page-root page-root--dense">
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">单号检索</label>
          <a-input
            v-model="query.orderNo"
            size="small"
            allow-clear
            placeholder="请输入订单号 / 提单号 / 订舱号"
            @press-enter="handleSearch"
          />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">客户名称</label>
          <a-input v-model="query.customerName" size="small" allow-clear placeholder="请输入客户名称" @press-enter="handleSearch" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">起运港</label>
          <a-input v-model="query.pol" size="small" allow-clear placeholder="请输入起运港" @press-enter="handleSearch" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">目的港</label>
          <a-input v-model="query.pod" size="small" allow-clear placeholder="请输入目的港" @press-enter="handleSearch" />
        </div>
        <div class="filter-card__inline-actions">
          <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          <a-button size="small" type="text" class="reset-btn" @click="advancedFilterVisible = true">
            <template #icon><icon-filter /></template>
            筛选
          </a-button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="toolbar toolbar--dense">
        <div class="toolbar-group">
          <a-button size="small" type="primary">
            <template #icon><icon-plus /></template>
            新增订单
          </a-button>
          <div class="toolbar-divider" />
          <a-button size="small" type="outline">
            <template #icon><icon-download /></template>
            批量导入
          </a-button>
          <div class="toolbar-divider" />
          <a-button size="small" @click="handleExport">
            <template #icon><icon-download /></template>
            导出
          </a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" :disabled="!selectedCount">
              批量操作<icon-down />
            </a-button>
            <template #content>
              <a-doption @click="handleBatchAction('批量分配')">批量分配</a-doption>
              <a-doption @click="handleBatchAction('批量改状态')">批量改状态</a-doption>
              <a-doption @click="handleBatchNotify">批量通知</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="scope-status-bar">
        <div class="scope-status-bar__status">
          <div class="stat-tab-group">
            <button
              v-for="tab in statusTabStats"
              :key="tab.key"
              type="button"
              class="stat-tab"
              :class="{ 'stat-tab--active': activeStatusTab === tab.key }"
              @click="onStatusTabClick(tab.key)"
            >
              <span class="stat-tab__name">{{ tab.label }}</span>
              <span
                class="stat-tab__count"
                :class="{
                  'stat-tab__count--danger': tab.tone === 'danger',
                  'stat-tab__count--warn': tab.tone === 'warn',
                }"
              >{{ tab.count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格区 -->
    <div class="zone-l4-table-card zone-card">
      <div class="table-card-cap table-card-cap--primary">
        <div class="table-card-cap__start">
          <a-tooltip content="刷新">
            <a-button size="small" type="text" class="table-card-cap__tool" @click="fetchList">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <div v-if="selectedCount > 0" class="toolbar-selection-context">
            <span class="toolbar-selected-tip">已选 <b>{{ selectedCount }}</b> 条</span>
            <a-button size="small" type="text" class="toolbar-selection-clear" @click="clearSelection">清空</a-button>
          </div>
        </div>
        <div class="table-card-cap__right">
          <a-pagination
            class="table-card-cap__pager"
            :current="page.current"
            :page-size="page.size"
            :total="filteredRows.length"
            :page-size-options="[50, 100, 200, 500]"
            size="small"
            show-total
            show-page-size
            show-jumper
            @change="(p: number) => { page.current = p; }"
            @page-size-change="(s: number) => { page.size = s; page.current = 1; }"
          />
          <a-tooltip content="列配置">
            <a-button size="small" type="text" class="table-card-cap__tool">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="table-wrap">
        <vxe-table
          ref="tableRef"
          class="compact workbench-table"
          size="small"
          height="100%"
          border="full"
          show-overflow="title"
          :loading="loading"
          :data="pagedRows"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onSelectionChange"
          @checkbox-all="onSelectionChange"
        >
          <vxe-column type="checkbox" width="44" fixed="left" />
          <vxe-column field="orderNo" title="订单号" min-width="160" fixed="left">
            <template #default="{ row }">
              <span class="link-text link-text--strong mono" @click="openDetailDrawer(row)">{{ row.orderNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="orderStatusLabel" title="订单状态" min-width="88" fixed="left">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.statusPill">{{ row.orderStatusLabel }}</span>
            </template>
          </vxe-column>
          <vxe-column field="customerName" title="客户名称" min-width="160" />
          <vxe-column field="businessType" title="业务类型" min-width="72" align="center" />
          <vxe-column field="vesselVoyage" title="船名航次" min-width="140" />
          <vxe-column field="pol" title="起运港" min-width="72" />
          <vxe-column field="pod" title="目的港" min-width="72" />
          <vxe-column field="etd" title="开船日期" min-width="96" />
          <vxe-column field="eta" title="到港日期" min-width="96" />
          <vxe-column field="closingTime" title="截关时间" min-width="130" />
          <vxe-column field="blNo" title="提单号" min-width="130">
            <template #default="{ row }">{{ row.blNo || '—' }}</template>
          </vxe-column>
          <vxe-column field="bookingNo" title="订舱号" min-width="120">
            <template #default="{ row }">{{ row.bookingNo || '—' }}</template>
          </vxe-column>
          <vxe-column field="containerSummary" title="柜型柜量" min-width="96" />
          <vxe-column field="operator" title="操作人员" min-width="80" />
          <vxe-column field="fileStatusLabel" title="文件状态" min-width="80" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.fileStatus === 'complete' ? 'acc' : row.fileStatus === 'missing' ? 'rej' : 'wait'">
                {{ row.fileStatusLabel }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="feeStatusLabel" title="费用状态" min-width="80" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.feeStatus === 'confirmed' ? 'acc' : row.feeStatus === 'pending' ? 'wait' : 'draft'">
                {{ row.feeStatusLabel }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="exceptionStatusLabel" title="异常状态" min-width="80" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.exceptionStatus === 'open' ? 'rej' : row.exceptionStatus === 'resolved' ? 'acc' : 'rel'">
                {{ row.exceptionStatusLabel }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="updatedAt" title="更新时间" min-width="130" />
          <vxe-column title="风险" min-width="72" fixed="right" align="center">
            <template #default="{ row }">
              <a-tooltip v-if="row.riskFlags.length" :content="row.riskFlags.join(' / ')">
                <span class="s-pill" data-s="wait">!</span>
              </a-tooltip>
              <span v-else>—</span>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="88" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="详情">
                  <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="openDetailDrawer(row)"><icon-eye /></a-button>
                </a-tooltip>
                <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
                  <a-button size="small" type="text" class="row-action-btn row-action-btn--more" title="更多操作"><icon-more /></a-button>
                  <template #content>
                    <a-doption @click="openFullDetail(row.orderNo)">编辑</a-doption>
                    <a-doption @click="openStatusModal(row)">修改状态</a-doption>
                    <a-doption>分配操作员</a-doption>
                    <a-doption>生成费用</a-doption>
                    <a-doption>上传文件</a-doption>
                    <a-doption @click="handleBatchNotify">发送通知</a-doption>
                    <a-doption>标记异常</a-doption>
                    <a-doption>查看日志</a-doption>
                    <a-doption>复制订单</a-doption>
                    <a-doption class="danger-opt" @click="handleCancelOrder(row)">作废订单</a-doption>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <!-- 更多筛选抽屉 -->
    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="更多筛选"
      :width="640"
      :mask-closable="false"
      class="query-filter-drawer"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="query">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">业务识别</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="船名航次">
                  <a-input v-model="query.vesselVoyage" size="small" allow-clear placeholder="请输入船名 / 航次" />
                </a-form-item>
                <a-form-item label="提单号">
                  <a-input v-model="query.blNo" size="small" allow-clear placeholder="请输入 MBL / HBL" />
                </a-form-item>
                <a-form-item label="订舱号">
                  <a-input v-model="query.bookingNo" size="small" allow-clear placeholder="请输入订舱号" />
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">业务归属</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="订单状态">
                  <a-select v-model="query.orderStatus" size="small" allow-clear placeholder="请选择">
                    <a-option value="waitBooking">待订舱</a-option>
                    <a-option value="released">已放舱</a-option>
                    <a-option value="waitCustoms">待报关</a-option>
                    <a-option value="customs">报关中</a-option>
                    <a-option value="sailed">已开船</a-option>
                    <a-option value="completed">已完成</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="操作人员">
                  <a-select v-model="query.operator" size="small" allow-clear placeholder="请选择">
                    <a-option value="张操作">张操作</a-option>
                    <a-option value="李操作">李操作</a-option>
                    <a-option value="王操作">王操作</a-option>
                    <a-option value="赵操作">赵操作</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="业务类型">
                  <a-select v-model="query.businessType" size="small" allow-clear placeholder="请选择">
                    <a-option value="FCL">FCL</a-option>
                    <a-option value="LCL">LCL</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="是否异常">
                  <a-select v-model="query.hasException" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">业务时间</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="开船日期">
                  <a-range-picker v-model="query.etdRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="截关日期">
                  <a-range-picker v-model="query.closingRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="更新时间">
                  <a-range-picker v-model="query.updatedRange" size="small" style="width:100%" />
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">风险与文件</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="文件状态">
                  <a-select v-model="query.fileStatus" size="small" allow-clear placeholder="请选择">
                    <a-option value="missing">缺失</a-option>
                    <a-option value="complete">完整</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="费用状态">
                  <a-select v-model="query.feeStatus" size="small" allow-clear placeholder="请选择">
                    <a-option value="none">未生成</a-option>
                    <a-option value="pending">待确认</a-option>
                    <a-option value="confirmed">已确认</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="是否超期">
                  <a-select v-model="query.isOverdue" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <template #footer>
        <div class="detail-drawer-footer">
          <div class="detail-drawer-footer__start">
            <a-button size="small" type="text" class="reset-btn" @click="clearAdvancedFilters">清空更多筛选</a-button>
          </div>
          <div class="detail-drawer-footer__end">
            <a-button size="small" @click="advancedFilterVisible = false">取消</a-button>
            <a-button size="small" type="primary" @click="applyAdvancedFilters">应用筛选</a-button>
          </div>
        </div>
      </template>
    </a-drawer>

    <!-- 修改状态弹窗 -->
    <a-modal
      v-model:visible="statusModalVisible"
      title="修改订单状态"
      :width="560"
      :mask-closable="false"
      @ok="confirmStatusChange"
    >
      <div class="xf-grid xf-grid--modal">
        <div class="xf-field">
          <label class="xf-label">当前状态</label>
          <span class="detail-field__val">{{ statusTargetRow?.orderStatusLabel }}</span>
        </div>
        <div class="xf-field">
          <label class="xf-label">目标状态 <span class="xf-req">*</span></label>
          <a-select v-model="statusForm.targetStatus" size="small" allow-clear placeholder="请选择">
            <a-option value="released">已放舱</a-option>
            <a-option value="customs">报关中</a-option>
            <a-option value="sailed">已开船</a-option>
            <a-option value="completed">已完成</a-option>
          </a-select>
        </div>
        <div class="xf-field xf-field--wide">
          <label class="xf-label">修改原因 <span class="xf-req">*</span></label>
          <a-textarea v-model="statusForm.reason" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请填写修改原因" />
        </div>
        <div class="xf-field">
          <a-checkbox v-model="statusForm.notify">同步通知相关人员</a-checkbox>
        </div>
        <div class="xf-field">
          <a-checkbox v-model="statusForm.createNode">生成节点记录</a-checkbox>
        </div>
      </div>
    </a-modal>

    <shipment-order-detail-drawer
      v-model:visible="drawerVisible"
      :record="currentDetail"
      @open-full="openFullDetail"
    />
  </div>
</template>

<style scoped>
.xf-grid--modal {
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
}
.xf-grid {
  display: grid;
}
.xf-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.xf-field--wide {
  grid-column: span 2;
}
.xf-label {
  font-size: var(--dense-font-field);
  color: var(--color-text-2);
  font-weight: 500;
}
.xf-req {
  color: var(--danger-6);
}
</style>
