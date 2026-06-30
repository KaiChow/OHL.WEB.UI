<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconRefresh,
  IconSettings,
  IconDownload,
  IconDown,
  IconEye,
  IconFilter,
  IconImport,
  IconPrinter,
  IconSend,
} from '@arco-design/web-vue/es/icon';
import ShipmentOrderDetailDrawer from '../orderDetail/ShipmentOrderDetailDrawer.vue';
import { shipmentWorkbenchRows } from './mockData';
import { buildTimestampSuffix, downloadCsvFile, downloadTextFile } from '../../../utils/mock-actions';
import type {
  ShipmentCargoScopeKey,
  ShipmentOrderQuery,
  ShipmentScopeKey,
  ShipmentStatusKey,
  ShipmentWorkbenchRow,
} from './types';
import type { ShipmentOrderDetailRecord } from '../orderDetail/types';
import { getShipmentOrderMock } from '../orderDetail/mockData';

const defaultQuery = (): ShipmentOrderQuery => ({
  businessType: undefined,
  quickTag: undefined,
  identifierType: 'orderNo',
  keyword: '',
  salesperson: '',
  operator: '',
  packageMode: undefined,
  customer: '',
  departurePort: '',
  hblNo: '',
  mblNo: '',
  pushBeforeVessel: undefined,
});

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const appliedQuery = ref<ShipmentOrderQuery>(defaultQuery());
const activeScope = ref<ShipmentScopeKey>('all');
const activeCargoScope = ref<ShipmentCargoScopeKey>('all');
const activeStatus = ref<ShipmentStatusKey>('all');
const advancedFilterVisible = ref(false);
const loading = ref(false);
const actionLoading = ref('');
const tableRef = ref<VxeTableInstance>();
const selectedIds = ref<string[]>([]);
const allRows = ref<ShipmentWorkbenchRow[]>([...shipmentWorkbenchRows]);
const detailVisible = ref(false);
const currentDetail = ref<ShipmentOrderDetailRecord | null>(null);

const page = reactive({ current: 1, size: 50, total: 0 });

const scopeTabs: Array<{ key: ShipmentScopeKey; label: string }> = [
  { key: 'all', label: '全部单' },
  { key: 'personal', label: '个人单' },
  { key: 'permission', label: '权限单' },
];

const cargoTabs: Array<{ key: ShipmentCargoScopeKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'fcl', label: '整柜' },
  { key: 'lcl', label: '散货' },
];

const statusTabs: Array<{ key: ShipmentStatusKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'released', label: '已放舱' },
  { key: 'received', label: '已进仓' },
  { key: 'departed', label: '已开船' },
  { key: 'abandoned', label: '已废弃' },
];

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (q.businessType && row.businessType !== q.businessType) return false;
    if (q.quickTag && row.quickTag !== q.quickTag) return false;
    if (q.keyword) {
      const source =
        q.identifierType === 'orderNo'
          ? row.orderNo
          : q.identifierType === 'suborderNo'
            ? row.suborderNo || row.businessNo
            : q.identifierType === 'hblNo'
              ? row.hblNo
              : row.mblNo;
      if (!source.includes(q.keyword)) return false;
    }
    if (q.salesperson && !row.salesperson.includes(q.salesperson)) return false;
    if (q.operator && !row.operator.includes(q.operator)) return false;
    if (q.packageMode && row.packageMode !== q.packageMode) return false;
    if (q.customer && !row.customer.includes(q.customer)) return false;
    if (q.departurePort && !row.departurePort.includes(q.departurePort)) return false;
    if (q.hblNo && !row.hblNo.includes(q.hblNo)) return false;
    if (q.mblNo && !row.mblNo.includes(q.mblNo)) return false;
    if (q.pushBeforeVessel === 'yes' && !row.pushBeforeVessel) return false;
    if (q.pushBeforeVessel === 'no' && row.pushBeforeVessel) return false;
    if (activeCargoScope.value !== 'all' && row.cargoScope !== activeCargoScope.value) return false;

    if (activeStatus.value === 'released' && row.orderStatus !== '已放舱') return false;
    if (activeStatus.value === 'received' && row.orderStatus !== '已进仓') return false;
    if (activeStatus.value === 'departed' && row.orderStatus !== '已开船') return false;
    if (activeStatus.value === 'abandoned' && !row.deleted) return false;
    if (activeScope.value === 'personal' && row.salesperson !== '李四') return false;
    if (activeScope.value === 'permission' && row.operator !== '张三') return false;

    return true;
  });
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const selectedCount = computed(() => selectedIds.value.length);
const statusCounts = computed(() => ({
  all: allRows.value.length,
  released: allRows.value.filter((row) => row.orderStatus === '已放舱').length,
  received: allRows.value.filter((row) => row.orderStatus === '已进仓').length,
  departed: allRows.value.filter((row) => row.orderStatus === '已开船').length,
  abandoned: allRows.value.filter((row) => row.deleted).length,
}));

const selectedRows = computed(() => allRows.value.filter((row) => selectedIds.value.includes(row.id)));

const syncPageTotal = () => {
  page.total = filteredRows.value.length;
  const maxPage = Math.max(1, Math.ceil(page.total / page.size) || 1);
  if (page.current > maxPage) page.current = maxPage;
};

const fetchList = () => {
  loading.value = true;
  window.setTimeout(() => {
    syncPageTotal();
    loading.value = false;
  }, 200);
};

const handleSearch = () => {
  appliedQuery.value = { ...query };
  page.current = 1;
  fetchList();
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = defaultQuery();
  page.current = 1;
  fetchList();
};

const clearAdvancedFilters = () => {
  query.quickTag = undefined;
  query.hblNo = '';
  query.mblNo = '';
  query.pushBeforeVessel = undefined;
};

const applyAdvancedFilters = () => {
  advancedFilterVisible.value = false;
  handleSearch();
};

const openDetail = (row: ShipmentWorkbenchRow) => {
  currentDetail.value = getShipmentOrderMock(row.orderNo);
  detailVisible.value = true;
  tableRef.value?.setCurrentRow?.(row);
};

const onCheckboxChange = ({ records }: { records: ShipmentWorkbenchRow[] }) => {
  selectedIds.value = records.map((row) => row.id);
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedIds.value = [];
};

const requireSelection = (actionLabel: string) => {
  if (selectedIds.value.length) return true;
  Message.warning(`请先勾选业务单再${actionLabel}`);
  return false;
};

const finishPreviewAction = (label: string, refresh = false) => {
  actionLoading.value = label;
  window.setTimeout(() => {
    Message.success(`${label}已加入预览流程`);
    actionLoading.value = '';
    if (refresh) fetchList();
  }, 200);
};

const handleSelectionAction = (label: string) => {
  if (!requireSelection(label)) return;
  finishPreviewAction(label, true);
};

const confirmBatchAction = (label: string, content: string) => {
  if (!requireSelection(label)) return;
  Modal.confirm({
    title: `确认${label} ${selectedCount.value} 票业务单？`,
    content,
    okText: `确认${label}`,
    cancelText: '取消',
    onOk: () => finishPreviewAction(label, true),
  });
};

const handleExportCurrent = () => {
  downloadCsvFile(
    `业务单工作台-${buildTimestampSuffix()}.csv`,
    ['订单编号', '订单状态', '客户', '起运港', '业务单号', 'HBL 单号', 'MBL 单号', '件数', '毛重', '体积'],
    filteredRows.value.map((row) => [
      row.orderNo,
      row.orderStatus,
      row.customer,
      row.departurePort,
      row.businessNo,
      row.hblNo,
      row.mblNo,
      row.qty,
      row.grossWeight,
      row.volume,
    ]),
  );
  Message.success(`已导出 ${filteredRows.value.length} 票业务单`);
};

const handleImportClosing = () => {
  finishPreviewAction('关单导入', true);
};

const handleDownloadSelected = () => {
  if (!requireSelection('一键下载')) return;
  downloadTextFile(
    `业务单批量文件清单-${buildTimestampSuffix()}.txt`,
    selectedRows.value
      .map((row) => `${row.orderNo} | HBL：${row.hblNo || '-'} | MBL：${row.mblNo || '-'}`)
      .join('\r\n'),
  );
  Message.success(`已下载 ${selectedCount.value} 票业务单文件清单`);
};

const handleFeePreview = (row: ShipmentWorkbenchRow) => {
  Message.success(`已打开 ${row.orderNo} 费用预览`);
};

const handleDocumentDownload = (row: ShipmentWorkbenchRow) => {
  if (!row.documentDownload) {
    Message.warning(`${row.orderNo} 暂无可下载文件`);
    return;
  }
  downloadTextFile(
    `${row.orderNo}-单证文件清单-${buildTimestampSuffix()}.txt`,
    [`订单编号：${row.orderNo}`, `HBL 单号：${row.hblNo || '-'}`, `MBL 单号：${row.mblNo || '-'}`].join('\r\n'),
  );
  Message.success(`${row.orderNo} 文件已下载`);
};

const openColumnSettings = () => {
  const table = tableRef.value as unknown as { openCustom?: () => void };
  table.openCustom?.();
};

const onPageChange = (p: number) => {
  page.current = p;
};

const onPageSizeChange = (size: number) => {
  page.size = size;
  page.current = 1;
  syncPageTotal();
};

fetchList();
</script>

<template>
  <div class="page-root page-root--dense">
    <div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
      <div class="filter-card__matrix">
        <div class="filter-grid">
          <div class="filter-field filter-field--span2">
            <label class="filter-field__label">单号检索</label>
            <div class="filter-combo arco-input-group">
              <a-select v-model="query.identifierType" size="small" class="filter-combo__select filter-combo--keyword">
                <a-option value="orderNo">订单编号</a-option>
                <a-option value="suborderNo">境外单号</a-option>
                <a-option value="hblNo">HBL 单号</a-option>
                <a-option value="mblNo">MBL 主单号</a-option>
              </a-select>
              <a-input v-model="query.keyword" size="small" allow-clear placeholder="请输入" @press-enter="handleSearch" />
            </div>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">客户</label>
            <a-input v-model="query.customer" size="small" allow-clear placeholder="请输入客户" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">起运港</label>
            <a-input v-model="query.departurePort" size="small" allow-clear placeholder="请输入起运港" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">业务类型</label>
            <a-select v-model="query.businessType" size="small" allow-clear placeholder="请选择业务类型">
              <a-option value="FBA">FBA</a-option>
              <a-option value="海运拼箱">海运拼箱</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">业务员</label>
            <a-input v-model="query.salesperson" size="small" allow-clear placeholder="请输入业务员" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">操作员</label>
            <a-input v-model="query.operator" size="small" allow-clear placeholder="请输入操作员" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">装箱方式</label>
            <a-select v-model="query.packageMode" size="small" allow-clear placeholder="请选择装箱方式">
              <a-option value="LCL GROUP（自拼）">LCL GROUP（自拼）</a-option>
              <a-option value="LCL">LCL</a-option>
            </a-select>
          </div>
        </div>
        <div class="filter-card__inline-actions filter-card__inline-actions--matrix">
          <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          <a-button size="small" type="text" class="reset-btn" title="更多筛选" @click="advancedFilterVisible = true">
            <template #icon><icon-filter /></template>
            筛选
          </a-button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack shipment-workbench__toolbar">
      <div class="toolbar toolbar--dense">
        <div class="toolbar-group">
          <a-button
            size="small"
            type="outline"
            :disabled="!selectedCount"
            :loading="actionLoading === '打印业务单'"
            @click="handleSelectionAction('打印业务单')"
          >
            <template #icon><icon-printer /></template>
            打印业务单
          </a-button>
          <a-button
            size="small"
            type="outline"
            :disabled="!selectedCount"
            :loading="actionLoading === '推送舱位通知'"
            @click="handleSelectionAction('推送舱位通知')"
          >
            <template #icon><icon-send /></template>
            推送舱位通知
          </a-button>
          <div class="toolbar-divider" />
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              <template #icon><icon-download /></template>
              输出<icon-down />
            </a-button>
            <template #content>
              <a-doption @click="handleExportCurrent">导出当前结果</a-doption>
              <a-doption @click="handleDownloadSelected">下载所选文件</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline" :disabled="!selectedCount">批量操作<icon-down /></a-button>
            <template #content>
              <a-doption @click="confirmBatchAction('批量放舱', '放舱后将刷新当前业务单列表，请确认已核对所选业务单。')">
                批量放舱
              </a-doption>
              <a-doption @click="confirmBatchAction('批量发送提审', '发送提审后将进入审核流程，请确认所选业务单资料完整。')">
                批量发送提审
              </a-doption>
            </template>
          </a-dropdown>
          <div class="toolbar-divider" />
          <a-button
            size="small"
            :loading="actionLoading === '关单导入'"
            @click="handleImportClosing"
          >
            <template #icon><icon-import /></template>
            关单导入
          </a-button>
        </div>
      </div>
      <div class="scope-status-bar">
        <div class="scope-status-bar__scope">
          <button
            v-for="tab in scopeTabs"
            :key="tab.key"
            type="button"
            class="stab stab--scope"
            :class="{ 'stab--active': activeScope === tab.key }"
            @click="activeScope = tab.key; fetchList()"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="scope-status-bar__divider" />
        <div class="scope-status-bar__scope">
          <button
            v-for="tab in cargoTabs"
            :key="tab.key"
            type="button"
            class="stab stab--cargo"
            :class="{ 'stab--active': activeCargoScope === tab.key }"
            @click="activeCargoScope = tab.key; fetchList()"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="scope-status-bar__divider" />
        <div class="scope-status-bar__status">
          <div class="stat-tab-group">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            type="button"
            class="stat-tab"
            :class="{ 'stat-tab--active': activeStatus === tab.key }"
            @click="activeStatus = tab.key; fetchList()"
          >
            <span class="stat-tab__name">{{ tab.label }}</span>
            <span class="stat-tab__count">{{ statusCounts[tab.key] ?? 0 }}</span>
          </button>
          </div>
        </div>
      </div>
    </div>

    <div class="zone-l4-table-card zone-card">
      <div class="table-card-cap">
        <div class="table-card-cap__start">
          <a-tooltip content="刷新">
            <a-button size="small" type="text" class="table-card-cap__tool" @click="fetchList">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <div v-if="selectedCount > 0" class="toolbar-selection-context">
            <span class="toolbar-selected-tip">已选 <b>{{ selectedCount }}</b> 条</span>
            <a-button size="small" type="text" class="reset-btn" @click="clearSelection">清空</a-button>
          </div>
        </div>
        <div class="table-card-cap__right">
          <a-pagination
            class="table-card-cap__pager"
            :current="page.current"
            :page-size="page.size"
            :total="page.total"
            :page-size-options="[50, 100, 200]"
            size="small"
            show-total
            show-page-size
            show-jumper
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
          <a-tooltip content="列设置">
            <a-button size="small" type="text" class="table-card-cap__tool" @click="openColumnSettings">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <div class="table-wrap">
        <vxe-table
          ref="tableRef"
          id="shipment-order-workbench-table"
          border="none"
          size="small"
          class="compact workbench-table"
          height="100%"
          show-overflow="title"
          :loading="loading"
          :data="pagedRows"
          :custom-config="{ storage: true }"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onCheckboxChange"
          @checkbox-all="onCheckboxChange"
          @cell-dblclick="({ row }) => openDetail(row)"
        >
          <vxe-column type="checkbox" width="40" fixed="left" />
          <vxe-column type="seq" title="序号" width="52" align="center" />
          <vxe-column field="orderNo" title="订单编号" min-width="150" fixed="left">
            <template #default="{ row }">
              <span class="link-text link-text--strong mono" @click="openDetail(row)">{{ row.orderNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="orderStatus" title="订单状态" min-width="90" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.orderStatusKey">{{ row.orderStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="suborderStatus" title="订单新状态" min-width="90" align="center" :visible="false">
            <template #default="{ row }">
              <span class="link-text" @click="openDetail(row)">{{ row.suborderStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="cargoType" title="货物类型" min-width="84" align="center" />
          <vxe-column field="financePod" title="财务 POD" min-width="84" align="center" :visible="false" />
          <vxe-column field="feeLink" title="费用" min-width="72" align="center" :visible="false">
            <template #default="{ row }">
              <span class="link-text" @click="handleFeePreview(row)">{{ row.feeLink }}</span>
            </template>
          </vxe-column>
          <vxe-column field="qty" title="件数" min-width="72" align="right">
            <template #default="{ row }"><span class="num-val">{{ row.qty }}</span></template>
          </vxe-column>
          <vxe-column field="grossWeight" title="毛重" min-width="72" align="right">
            <template #default="{ row }"><span class="num-val">{{ row.grossWeight }}</span></template>
          </vxe-column>
          <vxe-column field="volume" title="体积" min-width="72" align="right">
            <template #default="{ row }"><span class="num-val">{{ row.volume }}</span></template>
          </vxe-column>
          <vxe-column field="containerType" title="柜子类型" min-width="100" :visible="false" />
          <vxe-column field="businessNo" title="业务单号" min-width="120" />
          <vxe-column field="externalOrderNo" title="境外单号" min-width="140" :visible="false" />
          <vxe-column field="pushBeforeVessel" title="是否发送船前" min-width="110" align="center" :visible="false">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.pushBeforeVessel ? 'rel' : 'wait'">{{ row.pushBeforeVessel ? '已发' : '未发' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="customer" title="客户" min-width="100" />
          <vxe-column field="contractNo" title="合约号" min-width="140" :visible="false" />
          <vxe-column field="destinationInfo" title="目的港信息" min-width="100" align="center" :visible="false">
            <template #default="{ row }">
              <span class="link-text" @click="openDetail(row)">{{ row.destinationInfo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="cabinetNo" title="柜型柜号" min-width="100" :visible="false" />
          <vxe-column field="departurePort" title="起运港" min-width="100" />
          <vxe-column field="hblNo" title="HBL 单号" min-width="120" />
          <vxe-column field="soNo" title="SO" min-width="120" :visible="false" />
          <vxe-column field="mblNo" title="MBL 主单号" min-width="120" />
          <vxe-column field="documentDownload" title="文件下载" min-width="84" align="center">
            <template #default="{ row }">
              <a-tooltip :content="row.documentDownload ? '下载文件' : '暂无文件'">
                <a-button
                  size="small"
                  type="text"
                  class="row-action-btn"
                  :disabled="!row.documentDownload"
                  @click="handleDocumentDownload(row)"
                >
                  <template #icon><icon-download /></template>
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="56" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看详情">
                  <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="openDetail(row)">
                    <template #icon><icon-eye /></template>
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <shipment-order-detail-drawer
      v-model:visible="detailVisible"
      :record="currentDetail"
    />

    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="业务单筛选"
      :width="640"
      :footer="true"
      class="query-filter-drawer"
      :mask-closable="false"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="query">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">单号与标签</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="快捷标签">
                  <a-select v-model="query.quickTag" size="small" allow-clear placeholder="请选择快捷标签">
                    <a-option value="全部">全部</a-option>
                    <a-option value="整柜">整柜</a-option>
                    <a-option value="散货">散货</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="HBL 单号">
                  <a-input v-model="query.hblNo" size="small" allow-clear placeholder="请输入 HBL 单号" />
                </a-form-item>
                <a-form-item label="MBL 主单号">
                  <a-input v-model="query.mblNo" size="small" allow-clear placeholder="请输入 MBL 主单号" />
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">流程条件</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="是否发送船前">
                  <a-select v-model="query.pushBeforeVessel" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">已发</a-option>
                    <a-option value="no">未发</a-option>
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
  </div>
</template>
