<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
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
  IconInfoCircle,
  IconEmpty,
  IconHistory,
  IconSave,
  IconDelete,
  IconLayout,
  IconCheck,
} from '@arco-design/web-vue/es/icon';
import { downloadCsvFile } from '../../../utils/mock-actions';
import ShipmentOrderDetailDrawer from '../orderDetail/ShipmentOrderDetailDrawer.vue';
import { shipmentWorkbenchRows } from './mockData';
import type {
  ShipmentKeywordType,
  ShipmentOrderQuery,
  ShipmentStatusKey,
  ShipmentWorkbenchRow,
  StatusTabStat,
} from './types';
import type { ShipmentOrderDetailRecord } from '../orderDetail/types';
import { getShipmentOrderMock } from '../orderDetail/mockData';

const router = useRouter();

const CURRENT_OPERATOR = '张操作';
const QUERY_SCHEME_STORAGE_KEY = 'ohl.shipment.export-order.query-schemes.v1';

type TableDensity = 'compact' | 'standard';

interface SavedQueryScheme {
  id: string;
  name: string;
  query: ShipmentOrderQuery;
  statusTab: ShipmentStatusKey;
  isSystem?: boolean;
}

const KEYWORD_OPTIONS: { label: string; value: ShipmentKeywordType }[] = [
  { label: '业务单号', value: 'orderNo' },
  { label: '提单号', value: 'blNo' },
  { label: '订舱号', value: 'bookingNo' },
];

const STATUS_TABS: { key: ShipmentStatusKey; label: string; tone?: 'danger' | 'warn' }[] = [
  { key: 'all', label: '全部' },
  { key: 'waitBooking', label: '待订舱' },
  { key: 'waitRelease', label: '待放舱' },
  { key: 'waitTruck', label: '待拖车' },
  { key: 'waitCustoms', label: '待报关' },
  { key: 'sailed', label: '已开船' },
  { key: 'fileMissing', label: '缺文件', tone: 'warn' },
  { key: 'feeUnconfirmed', label: '待费用', tone: 'warn' },
  { key: 'exception', label: '异常', tone: 'danger' },
];

const defaultQuery = (): ShipmentOrderQuery => ({
  keywordType: 'orderNo',
  keyword: '',
  customerName: '',
  pol: '',
  pod: '',
  carrier: undefined,
  vesselVoyage: '',
  blNo: '',
  bookingNo: '',
  orderStatus: undefined,
  operator: undefined,
  businessType: undefined,
  etdRange: [],
  closingRange: [],
  hasException: undefined,
  fileStatus: undefined,
  feeStatus: undefined,
  updatedRange: [],
  isOverdue: undefined,
});

const cloneQuery = (source: ShipmentOrderQuery): ShipmentOrderQuery => ({
  ...source,
  etdRange: [...source.etdRange],
  closingRange: [...source.closingRange],
  updatedRange: [...source.updatedRange],
});

const getSystemQuerySchemes = (): SavedQueryScheme[] => [
  {
    id: 'system-my-orders',
    name: '我的在手订单',
    query: { ...defaultQuery(), operator: CURRENT_OPERATOR },
    statusTab: 'all',
    isSystem: true,
  },
  {
    id: 'system-risk-orders',
    name: '风险与异常',
    query: defaultQuery(),
    statusTab: 'exception',
    isSystem: true,
  },
];

const loadCustomQuerySchemes = (): SavedQueryScheme[] => {
  try {
    const raw = window.localStorage.getItem(QUERY_SCHEME_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedQueryScheme[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.id && item?.name && item?.query && !item.isSystem)
      : [];
  } catch {
    return [];
  }
};

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const appliedQuery = ref<ShipmentOrderQuery>(cloneQuery(defaultQuery()));
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
const statusErrors = reactive({ targetStatus: '', reason: '' });
const statusTargetRow = ref<ShipmentWorkbenchRow | null>(null);
const voidTargetRow = ref<ShipmentWorkbenchRow | null>(null);
const voidModalVisible = ref(false);
const tableDensity = ref<TableDensity>('compact');
const customQuerySchemes = ref<SavedQueryScheme[]>(loadCustomQuerySchemes());
const activeQuerySchemeId = ref<string>();
const schemeModalVisible = ref(false);
const deleteSchemeModalVisible = ref(false);
const schemeName = ref('');
const schemeNameError = ref('');

const page = reactive({ current: 1, size: 50 });

const operatorOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.operator)));
const carrierOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.carrier)));
const querySchemes = computed(() => [...getSystemQuerySchemes(), ...customQuerySchemes.value]);
const activeQueryScheme = computed(() => querySchemes.value.find((item) => item.id === activeQuerySchemeId.value));
const canDeleteActiveScheme = computed(() => Boolean(activeQueryScheme.value && !activeQueryScheme.value.isSystem));
const tableRowConfig = computed(() => ({
  isHover: true,
  keyField: 'id',
  height: tableDensity.value === 'compact' ? 36 : 44,
}));

const matchText = (value: string, keyword: string) =>
  !keyword.trim() || value.toLowerCase().includes(keyword.trim().toLowerCase());

const matchKeyword = (row: ShipmentWorkbenchRow, q: ShipmentOrderQuery) => {
  if (!q.keyword.trim()) return true;
  const keyword = q.keyword.trim();

  switch (q.keywordType) {
    case 'blNo':
      return matchText(row.blNo, keyword);
    case 'bookingNo':
      return matchText(row.bookingNo, keyword);
    case 'orderNo':
    default:
      return [row.orderNo, row.blNo, row.bookingNo].some((value) => matchText(value, keyword));
  }
};

const matchRange = (value: string, range: string[], dateOnly = false) => {
  if (range.length !== 2) return true;
  const [start, end] = range;
  const compared = dateOnly ? value.slice(0, 10) : value;
  if (start && compared < start) return false;
  if (end && compared > end) return false;
  return true;
};

const queryBaseRows = computed(() => {
  const q = appliedQuery.value;

  return allRows.value.filter((row) => {
    if (!matchKeyword(row, q)) return false;
    if (!matchText(row.customerName, q.customerName)) return false;
    if (!matchText(row.pol, q.pol)) return false;
    if (!matchText(row.pod, q.pod)) return false;
    if (q.carrier && row.carrier !== q.carrier) return false;
    if (!matchText(row.vesselVoyage, q.vesselVoyage)) return false;
    if (!matchText(row.blNo, q.blNo)) return false;
    if (!matchText(row.bookingNo, q.bookingNo)) return false;
    if (q.orderStatus && row.orderStatus !== q.orderStatus) return false;
    if (q.operator && row.operator !== q.operator) return false;
    if (q.businessType && row.businessType !== q.businessType) return false;
    if (q.hasException === 'yes' && row.exceptionStatus !== 'open') return false;
    if (q.hasException === 'no' && row.exceptionStatus === 'open') return false;
    if (!matchRange(row.etd, q.etdRange, true)) return false;
    if (!matchRange(row.closingTime, q.closingRange, true)) return false;
    if (q.fileStatus && row.fileStatus !== q.fileStatus) return false;
    if (q.feeStatus && row.feeStatus !== q.feeStatus) return false;
    if (!matchRange(row.updatedAt, q.updatedRange, true)) return false;
    if (q.isOverdue === 'yes' && !row.isOverdue) return false;
    if (q.isOverdue === 'no' && row.isOverdue) return false;
    return true;
  });
});

const filteredRows = computed(() =>
  queryBaseRows.value.filter((row) => activeStatusTab.value === 'all' || row.quickStatus.includes(activeStatusTab.value)),
);

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const statusTabStats = computed<StatusTabStat[]>(() =>
  STATUS_TABS.map((tab) => {
    const rows = tab.key === 'all'
      ? queryBaseRows.value
      : queryBaseRows.value.filter((row) => row.quickStatus.includes(tab.key));

    return {
      key: tab.key,
      label: tab.label,
      count: rows.length,
      tone: tab.tone,
    };
  }),
);

const selectedCount = computed(() => selectedRows.value.length);

const activeQueue = computed(() => statusTabStats.value.find((tab) => tab.key === activeStatusTab.value));

const activeQueueLabel = computed(() => activeQueue.value?.label ?? '全部');

const riskRows = computed(() =>
  queryBaseRows.value.filter((row) => row.exceptionStatus === 'open' || row.fileStatus === 'missing' || row.isOverdue),
);

const hasActiveFilter = computed(() => {
  const q = appliedQuery.value;
  return Boolean(
    q.keyword.trim()
    || q.customerName.trim()
    || q.pol.trim()
    || q.pod.trim()
    || q.carrier
    || q.vesselVoyage.trim()
    || q.blNo.trim()
    || q.bookingNo.trim()
    || q.orderStatus
    || q.operator
    || q.businessType
    || q.hasException
    || q.etdRange.length
    || q.closingRange.length
    || q.fileStatus
    || q.feeStatus
    || q.updatedRange.length
    || q.isOverdue
    || activeStatusTab.value !== 'all',
  );
});

const tableContextText = computed(() => {
  const scope = activeQueueLabel.value === '全部' ? '全部在手订单' : `${activeQueueLabel.value}队列`;
  return `${scope} · ${filteredRows.value.length} 票 · 风险 ${riskRows.value.length} 票`;
});

const advancedActiveCount = computed(() => {
  let count = 0;

  if (query.vesselVoyage.trim()) count += 1;
  if (query.blNo.trim()) count += 1;
  if (query.bookingNo.trim()) count += 1;
  if (query.orderStatus) count += 1;
  if (query.operator) count += 1;
  if (query.businessType) count += 1;
  if (query.hasException) count += 1;
  if (query.etdRange.length === 2) count += 1;
  if (query.closingRange.length === 2) count += 1;
  if (query.fileStatus) count += 1;
  if (query.feeStatus) count += 1;
  if (query.updatedRange.length === 2) count += 1;
  if (query.isOverdue) count += 1;

  return count;
});

const getOrderAuxText = (row: ShipmentWorkbenchRow) => {
  const parts: string[] = [];

  if (row.bookingNo) parts.push(`订舱 ${row.bookingNo}`);
  if (row.blNo) parts.push(`提单 ${row.blNo}`);

  return parts.length ? parts.join(' / ') : '待回传订舱号 / 提单号';
};

const getOwnerMeta = (row: ShipmentWorkbenchRow) => `业务类型 ${row.businessType} / 操作 ${row.operator}`;

const getRouteMeta = (row: ShipmentWorkbenchRow) => `ETD ${row.etd} / 截关 ${row.closingTime}`;

const getNextActionLabel = (row: ShipmentWorkbenchRow) => {
  if (row.exceptionStatus === 'open') return '处理异常';
  if (row.fileStatus === 'missing') return '补齐文件';
  if (row.orderStatus === 'waitBooking' || row.orderStatus === 'booking') return '推进订舱';
  if (row.orderStatus === 'released' || row.orderStatus === 'waitTruck' || row.orderStatus === 'trucking') return '安排拖车';
  if (row.orderStatus === 'waitCustoms' || row.orderStatus === 'customs') return '推进报关';
  if (row.orderStatus === 'sailed') return '提单确认';
  if (row.feeStatus === 'none' || row.feeStatus === 'pending') return '维护费用';
  return '跟踪节点';
};

const getNextActionMeta = (row: ShipmentWorkbenchRow) => {
  if (row.exceptionStatus === 'open') return row.riskFlags.join(' / ') || '存在阻塞项待关闭';
  if (row.fileStatus === 'missing') return '缺少 SO / 报关 / 提单资料';
  if (row.orderStatus === 'waitBooking' || row.orderStatus === 'booking') return '关注放舱与舱位回传';
  if (row.orderStatus === 'released' || row.orderStatus === 'waitTruck' || row.orderStatus === 'trucking') return '同步装柜与进港安排';
  if (row.orderStatus === 'waitCustoms' || row.orderStatus === 'customs') return '核对申报与放行节点';
  if (row.orderStatus === 'sailed') return '补料 / 提单 / 到港跟踪';
  if (row.feeStatus === 'none' || row.feeStatus === 'pending') return '应收应付待核算';
  return '继续跟踪节点变化';
};

const getExecutionSignals = (row: ShipmentWorkbenchRow) => {
  const signals: Array<{ label: string; tone: 'acc' | 'wait' | 'rej' | 'rel' }> = [];

  if (row.fileStatus === 'missing') signals.push({ label: '缺文件', tone: 'rej' });
  else if (row.fileStatus === 'pending') signals.push({ label: '文件待确认', tone: 'wait' });

  if (row.feeStatus === 'none') signals.push({ label: '未生成费用', tone: 'wait' });
  else if (row.feeStatus === 'pending') signals.push({ label: '费用待确认', tone: 'wait' });

  if (row.exceptionStatus === 'open') signals.push({ label: '异常处理中', tone: 'rej' });
  else if (row.isOverdue) signals.push({ label: '节点超期', tone: 'wait' });

  if (!signals.length) signals.push({ label: '执行就绪', tone: 'acc' });

  return signals;
};

const getVisibleExecutionSignals = (row: ShipmentWorkbenchRow) => {
  const signals = getExecutionSignals(row);
  return {
    items: signals.slice(0, 2),
    overflow: signals.length > 2 ? signals.length - 2 : 0,
  };
};

const handleSearch = () => {
  appliedQuery.value = cloneQuery(query);
  activeQuerySchemeId.value = undefined;
  page.current = 1;
  clearSelection();
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = cloneQuery(defaultQuery());
  activeStatusTab.value = 'all';
  activeQuerySchemeId.value = undefined;
  advancedFilterVisible.value = false;
  page.current = 1;
  clearSelection();
};

const persistCustomQuerySchemes = () => {
  try {
    window.localStorage.setItem(QUERY_SCHEME_STORAGE_KEY, JSON.stringify(customQuerySchemes.value));
    return true;
  } catch {
    return false;
  }
};

const applyQueryScheme = (scheme: SavedQueryScheme) => {
  Object.assign(query, cloneQuery(scheme.query));
  appliedQuery.value = cloneQuery(scheme.query);
  activeStatusTab.value = scheme.statusTab;
  activeQuerySchemeId.value = scheme.id;
  advancedFilterVisible.value = false;
  page.current = 1;
  clearSelection();
};

const openSchemeModal = () => {
  schemeName.value = '';
  schemeNameError.value = '';
  schemeModalVisible.value = true;
};

const saveCurrentQueryScheme = () => {
  const name = schemeName.value.trim();
  if (!name) {
    schemeNameError.value = '请填写方案名称';
    return false;
  }
  if (name.length > 20) {
    schemeNameError.value = '方案名称不能超过 20 个字符';
    return false;
  }
  if (querySchemes.value.some((item) => item.name === name)) {
    schemeNameError.value = '已存在同名查询方案';
    return false;
  }

  const next: SavedQueryScheme = {
    id: `custom-${Date.now()}`,
    name,
    query: cloneQuery(query),
    statusTab: activeStatusTab.value,
  };
  customQuerySchemes.value.push(next);
  const persisted = persistCustomQuerySchemes();
  activeQuerySchemeId.value = next.id;
  schemeModalVisible.value = false;
  if (persisted) Message.success(`查询方案“${name}”已保存`);
  else Message.warning('浏览器存储不可用，查询方案仅在本次会话保留');
  return true;
};

const deleteActiveQueryScheme = () => {
  if (!activeQueryScheme.value || activeQueryScheme.value.isSystem) return;
  const deletedName = activeQueryScheme.value.name;
  customQuerySchemes.value = customQuerySchemes.value.filter((item) => item.id !== activeQuerySchemeId.value);
  persistCustomQuerySchemes();
  activeQuerySchemeId.value = undefined;
  deleteSchemeModalVisible.value = false;
  Message.success(`查询方案“${deletedName}”已删除`);
};

const setTableDensity = (density: TableDensity) => {
  tableDensity.value = density;
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
  clearSelection();
};

const onStatusTabChange = (key: string | number) => {
  onStatusTabClick(key as ShipmentStatusKey);
};

const onSelectionChange = () => {
  selectedRows.value = (tableRef.value?.getCheckboxRecords() ?? []) as ShipmentWorkbenchRow[];
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedRows.value = [];
};

const onPageChange = (nextPage: number) => {
  page.current = nextPage;
  clearSelection();
};

const onPageSizeChange = (nextSize: number) => {
  page.size = nextSize;
  page.current = 1;
  clearSelection();
};

const openColumnSettings = () => {
  (tableRef.value as (VxeTableInstance & { openCustom?: () => void }) | undefined)?.openCustom?.();
};

const openDetailDrawer = (row: ShipmentWorkbenchRow) => {
  currentDetail.value = getShipmentOrderMock(row.orderNo);
  drawerVisible.value = true;
};

const openFullDetail = (orderNo: string, tab = 'overview') => {
  drawerVisible.value = false;
  router.push({ name: 'ShipmentOrderDetail', query: { orderNo, tab } });
};

const handleCreateOrder = () => {
  openFullDetail(`NEW${Date.now()}`, 'overview');
};

const handleAssignOperator = (row: ShipmentWorkbenchRow) => {
  row.operator = CURRENT_OPERATOR;
  row.updatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  Message.success(`订单 ${row.orderNo} 已分配给${CURRENT_OPERATOR}`);
};

const handleGenerateRowFee = (row: ShipmentWorkbenchRow) => {
  row.feeStatus = 'pending';
  row.feeStatusLabel = '待确认';
  if (!row.quickStatus.includes('feeUnconfirmed')) row.quickStatus.push('feeUnconfirmed');
  Message.success(`订单 ${row.orderNo} 已生成待确认费用`);
};

const openStatusModal = (row: ShipmentWorkbenchRow) => {
  statusTargetRow.value = row;
  statusForm.targetStatus = undefined;
  statusForm.reason = '';
  statusForm.notify = true;
  statusForm.createNode = true;
  statusErrors.targetStatus = '';
  statusErrors.reason = '';
  statusModalVisible.value = true;
};

const confirmStatusChange = () => {
  statusErrors.targetStatus = statusForm.targetStatus ? '' : '请选择目标状态';
  statusErrors.reason = statusForm.reason.trim() ? '' : '请填写修改原因';
  if (statusErrors.targetStatus || statusErrors.reason || !statusTargetRow.value) return false;

  const statusMap: Record<string, { label: string; pill: string }> = {
    released: { label: '已放舱', pill: 'acc' },
    customs: { label: '报关中', pill: 'op' },
    sailed: { label: '已开船', pill: 'rel' },
    completed: { label: '已完成', pill: 'rel' },
  };
  const nextStatus = statusMap[statusForm.targetStatus!];
  statusTargetRow.value.orderStatus = statusForm.targetStatus as ShipmentWorkbenchRow['orderStatus'];
  statusTargetRow.value.orderStatusLabel = nextStatus.label;
  statusTargetRow.value.statusPill = nextStatus.pill;
  Message.success(`订单 ${statusTargetRow.value.orderNo} 状态已更新为${nextStatus.label}`);
  statusModalVisible.value = false;
  return true;
};

const openVoidModal = (row: ShipmentWorkbenchRow) => {
  voidTargetRow.value = row;
  voidModalVisible.value = true;
};

const voidOrder = () => {
  if (!voidTargetRow.value) return;
  voidTargetRow.value.orderStatus = 'cancelled';
  voidTargetRow.value.orderStatusLabel = '已作废';
  voidTargetRow.value.statusPill = 'rej';
  Message.success(`订单 ${voidTargetRow.value.orderNo} 已作废`);
  voidModalVisible.value = false;
};

const handleExport = () => {
  const rows = selectedRows.value.length ? selectedRows.value : filteredRows.value;

  downloadCsvFile(
    `海运出口订单-${rows.length}条.csv`,
    ['订单号', '客户', '业务类型', '状态', 'ETD', '目的港', '操作人员'],
    rows.map((row) => [row.orderNo, row.customerName, row.businessType, row.orderStatusLabel, row.etd, row.pod, row.operator]),
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

const handleRowNotify = (row: ShipmentWorkbenchRow) => {
  Message.success(`已向订单 ${row.orderNo} 发送通知（模拟）`);
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  loading.value = false;
};
</script>

<template>
  <div class="workbench-page">
    <div class="workbench-stack">
      <a-card size="small" :bordered="true" class="workbench-page__command">
        <div class="filter-panel">
          <div class="filter-panel__fields">
            <a-form :model="query" layout="vertical" size="small" class="filter-panel__form">
              <a-row :gutter="[12, 8]" align="end">
                <a-col :xs="24" :sm="24" :md="12" :lg="8">
                  <a-form-item label="单号检索">
                    <a-input-group>
                      <a-select
                        v-model="query.keywordType"
                        size="small"
                        :style="{ width: '112px' }"
                      >
                        <a-option v-for="option in KEYWORD_OPTIONS" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </a-option>
                      </a-select>
                      <a-input
                        v-model="query.keyword"
                        size="small"
                        allow-clear
                        placeholder="请输入业务单号 / 提单号 / 订舱号"
                        @press-enter="handleSearch"
                      />
                    </a-input-group>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="4">
                  <a-form-item label="客户名称">
                    <a-input
                      v-model="query.customerName"
                      size="small"
                      allow-clear
                      placeholder="请输入客户名称"
                      @press-enter="handleSearch"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="4">
                  <a-form-item label="起运港">
                    <a-input
                      v-model="query.pol"
                      size="small"
                      allow-clear
                      placeholder="请输入起运港"
                      @press-enter="handleSearch"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="4">
                  <a-form-item label="目的港">
                    <a-input
                      v-model="query.pod"
                      size="small"
                      allow-clear
                      placeholder="请输入目的港"
                      @press-enter="handleSearch"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6" :lg="4">
                  <a-form-item label="船公司">
                    <a-select v-model="query.carrier" size="small" allow-clear placeholder="请选择船公司">
                      <a-option v-for="carrier in carrierOptions" :key="carrier" :value="carrier">
                        {{ carrier }}
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="filter-panel__actions">
            <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
              <a-button size="small" type="text" class="query-scheme-trigger">
                <template #icon><icon-history /></template>
                <span>{{ activeQueryScheme?.name ?? '查询方案' }}</span>
                <icon-down />
              </a-button>
              <template #content>
                <a-doption
                  v-for="scheme in querySchemes"
                  :key="scheme.id"
                  @click="applyQueryScheme(scheme)"
                >
                  <span class="query-scheme-option">
                    <icon-check v-if="activeQuerySchemeId === scheme.id" />
                    <span v-else class="query-scheme-option__placeholder" />
                    {{ scheme.name }}
                  </span>
                </a-doption>
                <a-divider class="action-menu__divider" />
                <a-doption @click="openSchemeModal">
                  <icon-save /> 保存当前条件
                </a-doption>
                <a-doption
                  v-if="canDeleteActiveScheme"
                  class="danger-opt"
                  @click="deleteSchemeModalVisible = true"
                >
                  <icon-delete /> 删除当前方案
                </a-doption>
              </template>
            </a-dropdown>
            <a-button size="small" type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              查询
            </a-button>
            <a-button size="small" type="text" @click="handleReset">重置</a-button>
            <a-badge :count="advancedActiveCount" :offset="[-4, 4]">
              <a-button size="small" type="text" @click="advancedFilterVisible = true">
                <template #icon><icon-filter /></template>
                筛选
              </a-button>
            </a-badge>
          </div>
        </div>
        <div class="flow-bar">
          <div class="flow-bar__actions">
            <a-button size="small" type="primary" @click="handleCreateOrder">
              <template #icon><icon-plus /></template>
              新增订单
            </a-button>
            <a-tooltip content="导入服务尚未配置">
              <span><a-button size="small" type="outline" disabled>批量导入</a-button></span>
            </a-tooltip>
            <a-button size="small" type="outline" @click="handleExport">
              <template #icon><icon-download /></template>
              导出
            </a-button>
            <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
              <a-button size="small" type="outline" :disabled="!selectedCount">
                批量操作<icon-down />
              </a-button>
              <template #content>
                <a-doption @click="handleBatchAction('批量分配')">批量分配</a-doption>
                <a-doption @click="handleBatchAction('批量改状态')">批量改状态</a-doption>
                <a-doption @click="handleBatchNotify">批量通知</a-doption>
              </template>
            </a-dropdown>
          </div>

          <a-tabs
            v-model:active-key="activeStatusTab"
            type="line"
            size="small"
            class="workbench-status-tabs"
            @change="onStatusTabChange"
          >
            <a-tab-pane v-for="tab in statusTabStats" :key="tab.key">
              <template #title>
                <span class="workbench-tab-title">
                  {{ tab.label }}
                  <span
                    class="workbench-tab-count"
                    :class="{
                      'workbench-tab-count--warn': tab.tone === 'warn',
                      'workbench-tab-count--danger': tab.tone === 'danger',
                    }"
                  >{{ tab.count }}</span>
                </span>
              </template>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>

      <a-card class="workbench-page__table-host" size="small" :bordered="true">
        <template #title>
          <div class="table-cap-start">
            <a-tooltip content="刷新">
              <a-button size="small" type="text" class="table-cap-tool" title="刷新" aria-label="刷新" @click="fetchList">
                <template #icon><icon-refresh /></template>
              </a-button>
            </a-tooltip>
            <div class="table-context">
              <span class="table-context__title">{{ tableContextText }}</span>
            </div>
            <template v-if="selectedCount > 0">
              <span class="selection-tip">已选 <b>{{ selectedCount }}</b> 条</span>
              <a-button size="small" type="text" @click="clearSelection">清空</a-button>
            </template>
          </div>
        </template>
        <template #extra>
          <a-space :size="8">
            <a-pagination
              :current="page.current"
              :page-size="page.size"
              :total="filteredRows.length"
              :page-size-options="[20, 50, 100, 200]"
              size="small"
              show-total
              show-page-size
              show-jumper
              @change="onPageChange"
              @page-size-change="onPageSizeChange"
            />
            <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--toolbar">
              <a-tooltip content="表格密度">
                <a-button size="small" type="text" class="table-cap-tool" title="表格密度" aria-label="表格密度">
                  <template #icon><icon-layout /></template>
                </a-button>
              </a-tooltip>
              <template #content>
                <a-doption @click="setTableDensity('compact')">
                  <span class="density-option">
                    <icon-check v-if="tableDensity === 'compact'" />
                    <span v-else class="density-option__placeholder" />
                    紧凑
                  </span>
                </a-doption>
                <a-doption @click="setTableDensity('standard')">
                  <span class="density-option">
                    <icon-check v-if="tableDensity === 'standard'" />
                    <span v-else class="density-option__placeholder" />
                    舒适
                  </span>
                </a-doption>
              </template>
            </a-dropdown>
            <a-tooltip content="列设置">
              <a-button size="small" type="text" class="table-cap-tool" title="列设置" aria-label="列设置" @click="openColumnSettings">
                <template #icon><icon-settings /></template>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>

        <div class="workbench-table-frame">
          <vxe-table
            ref="tableRef"
            id="shipment-export-orders"
            :class="[tableDensity, 'workbench-table']"
            size="small"
            style="width: 100%"
            height="100%"
            auto-resize
            fit
            border="none"
            show-overflow="title"
            :loading="loading"
            :data="pagedRows"
            :column-config="{ resizable: true }"
            :custom-config="{ storage: true }"
            :row-config="tableRowConfig"
            :checkbox-config="{ highlight: true }"
            @checkbox-change="onSelectionChange"
            @checkbox-all="onSelectionChange"
          >
            <vxe-column type="checkbox" width="44" fixed="left" />

            <vxe-column field="orderNo" title="业务对象" min-width="260" fixed="left">
              <template #default="{ row }">
                <div class="cell-two-line">
                  <div class="cell-two-line__main">
                    <span class="s-pill" :data-s="row.statusPill">{{ row.orderStatusLabel }}</span>
                    <span class="link-text link-text--strong mono" @click="openDetailDrawer(row)">{{ row.orderNo }}</span>
                  </div>
                  <span class="cell-two-line__sub mono">{{ getOrderAuxText(row) }}</span>
                </div>
              </template>
            </vxe-column>

            <vxe-column field="customerName" title="客户 / 归属" min-width="260">
              <template #default="{ row }">
                <div class="cell-two-line">
                  <span class="cell-two-line__main">{{ row.customerName }}</span>
                  <span class="cell-two-line__sub">{{ getOwnerMeta(row) }}</span>
                </div>
              </template>
            </vxe-column>

            <vxe-column title="航程 / 节点" min-width="310">
              <template #default="{ row }">
                <div class="cell-two-line">
                  <span class="cell-two-line__main mono">{{ row.pol }} -> {{ row.pod }}</span>
                  <span class="cell-two-line__sub">{{ row.carrier }} / {{ row.vesselVoyage }} · {{ getRouteMeta(row) }}</span>
                </div>
              </template>
            </vxe-column>

            <vxe-column field="containerSummary" title="柜型柜量" min-width="110" align="center" />

            <vxe-column title="当前待办" min-width="230">
              <template #default="{ row }">
                <div class="cell-two-line">
                  <span class="cell-two-line__main">{{ getNextActionLabel(row) }}</span>
                  <span class="cell-two-line__sub">{{ getNextActionMeta(row) }}</span>
                </div>
              </template>
            </vxe-column>

            <vxe-column title="跟进信息" min-width="190">
              <template #default="{ row }">
                <div class="cell-two-line">
                  <span class="cell-two-line__main">{{ row.operator }}</span>
                  <span class="cell-two-line__sub mono">{{ row.updatedAt }}</span>
                </div>
              </template>
            </vxe-column>

            <vxe-column title="执行缺口" min-width="220">
              <template #default="{ row }">
                <a-space wrap :size="4">
                  <span
                    v-for="signal in getVisibleExecutionSignals(row).items"
                    :key="signal.label"
                    class="s-pill"
                    :data-s="signal.tone"
                  >
                    {{ signal.label }}
                  </span>
                  <span
                    v-if="getVisibleExecutionSignals(row).overflow"
                    class="workbench-signal-more"
                  >+{{ getVisibleExecutionSignals(row).overflow }}</span>
                </a-space>
              </template>
            </vxe-column>

            <vxe-column title="操作" width="88" fixed="right" align="center">
              <template #default="{ row }">
                <div class="row-actions">
                  <a-tooltip content="详情">
                    <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="openDetailDrawer(row)">
                      <icon-eye />
                    </a-button>
                  </a-tooltip>
                  <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
                    <a-button size="small" type="text" class="row-action-btn row-action-btn--more" title="更多操作">
                      <icon-more />
                    </a-button>
                    <template #content>
                      <a-doption @click="openFullDetail(row.orderNo, 'overview')">编辑</a-doption>
                      <a-doption @click="openStatusModal(row)">修改状态</a-doption>
                      <a-doption @click="handleAssignOperator(row)">分配给我</a-doption>
                      <a-doption @click="handleGenerateRowFee(row)">生成费用</a-doption>
                      <a-doption @click="openFullDetail(row.orderNo, 'files')">上传文件</a-doption>
                      <a-doption @click="handleRowNotify(row)">发送通知</a-doption>
                      <a-doption @click="openFullDetail(row.orderNo, 'collaboration')">查看日志</a-doption>
                      <a-divider class="action-menu__divider" />
                      <a-doption class="danger-opt" @click="openVoidModal(row)">作废订单</a-doption>
                    </template>
                  </a-dropdown>
                </div>
              </template>
            </vxe-column>
            <template #empty>
              <div class="workbench-empty">
                <icon-empty class="workbench-empty__icon" />
                <div class="workbench-empty__title">
                  {{ hasActiveFilter ? '未找到匹配的海运出口订单' : '暂无海运出口订单' }}
                </div>
                <div class="workbench-empty__desc">
                  {{ hasActiveFilter ? '请调整查询条件或切换状态队列后重试。' : '可以先新建订单，或通过批量导入创建业务单。' }}
                </div>
                <div class="workbench-empty__actions">
                  <a-button v-if="hasActiveFilter" size="small" type="text" @click="handleReset">重置筛选</a-button>
                  <a-button v-else size="small" type="primary" @click="handleCreateOrder">
                    <template #icon><icon-plus /></template>
                    新增订单
                  </a-button>
                </div>
              </div>
            </template>
          </vxe-table>
        </div>
      </a-card>
    </div>

    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="订单高级筛选"
      :width="640"
      :mask-closable="false"
      class="query-filter-drawer"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form layout="vertical" size="small" :model="query">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">单证识别</div>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="船名航次">
                    <a-input v-model="query.vesselVoyage" size="small" allow-clear placeholder="请输入船名 / 航次" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="提单号">
                    <a-input v-model="query.blNo" size="small" allow-clear placeholder="请输入提单号" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="订舱号">
                    <a-input v-model="query.bookingNo" size="small" allow-clear placeholder="请输入订舱号" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">业务归属</div>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="订单状态">
                    <a-select v-model="query.orderStatus" size="small" allow-clear placeholder="请选择">
                      <a-option value="waitBooking">待订舱</a-option>
                      <a-option value="booking">订舱中</a-option>
                      <a-option value="released">已放舱</a-option>
                      <a-option value="waitTruck">待拖车</a-option>
                      <a-option value="trucking">拖车中</a-option>
                      <a-option value="waitCustoms">待报关</a-option>
                      <a-option value="customs">报关中</a-option>
                      <a-option value="sailed">已开船</a-option>
                      <a-option value="completed">已完成</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="操作人员">
                    <a-select v-model="query.operator" size="small" allow-clear placeholder="请选择">
                      <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">
                        {{ operator }}
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="业务类型">
                    <a-select v-model="query.businessType" size="small" allow-clear placeholder="请选择">
                      <a-option value="FCL">FCL</a-option>
                      <a-option value="LCL">LCL</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="是否异常">
                    <a-select v-model="query.hasException" size="small" allow-clear placeholder="请选择">
                      <a-option value="yes">是</a-option>
                      <a-option value="no">否</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">航程时间</div>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="开船日期">
                    <a-range-picker v-model="query.etdRange" size="small" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="截关日期">
                    <a-range-picker v-model="query.closingRange" size="small" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="更新时间">
                    <a-range-picker v-model="query.updatedRange" size="small" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">风险与结算</div>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="文件状态">
                    <a-select v-model="query.fileStatus" size="small" allow-clear placeholder="请选择">
                      <a-option value="missing">缺失</a-option>
                      <a-option value="pending">待确认</a-option>
                      <a-option value="complete">完整</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="费用状态">
                    <a-select v-model="query.feeStatus" size="small" allow-clear placeholder="请选择">
                      <a-option value="none">未生成</a-option>
                      <a-option value="pending">待确认</a-option>
                      <a-option value="confirmed">已确认</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="是否超期">
                    <a-select v-model="query.isOverdue" size="small" allow-clear placeholder="请选择">
                      <a-option value="yes">是</a-option>
                      <a-option value="no">否</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer-line">
          <a-button size="small" type="text" @click="clearAdvancedFilters">清空更多筛选</a-button>
          <a-space>
            <a-button size="small" @click="advancedFilterVisible = false">取消</a-button>
            <a-button size="small" type="primary" @click="applyAdvancedFilters">应用筛选</a-button>
          </a-space>
        </div>
      </template>
    </a-drawer>

    <a-modal
      v-model:visible="statusModalVisible"
      title="修改订单状态"
      :width="560"
      :mask-closable="false"
      :on-before-ok="confirmStatusChange"
    >
      <a-form :model="statusForm" layout="vertical" size="small">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="当前状态">
              <span>{{ statusTargetRow?.orderStatusLabel }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="目标状态"
              required
              :validate-status="statusErrors.targetStatus ? 'error' : undefined"
              :help="statusErrors.targetStatus"
            >
              <a-select
                v-model="statusForm.targetStatus"
                size="small"
                allow-clear
                placeholder="请选择"
                @change="statusErrors.targetStatus = ''"
              >
                <a-option value="released">已放舱</a-option>
                <a-option value="customs">报关中</a-option>
                <a-option value="sailed">已开船</a-option>
                <a-option value="completed">已完成</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="修改原因"
              required
              :validate-status="statusErrors.reason ? 'error' : undefined"
              :help="statusErrors.reason"
            >
              <a-textarea
                v-model="statusForm.reason"
                size="small"
                :auto-size="{ minRows: 2, maxRows: 4 }"
                placeholder="请填写修改原因"
                @input="statusErrors.reason = ''"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <a-checkbox v-model="statusForm.notify">同步通知相关人员</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <a-checkbox v-model="statusForm.createNode">生成节点记录</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="schemeModalVisible"
      title="保存查询方案"
      :width="460"
      :mask-closable="false"
      :on-before-ok="saveCurrentQueryScheme"
    >
      <a-form :model="{ schemeName }" layout="vertical" size="small">
        <a-form-item
          label="方案名称"
          required
          :validate-status="schemeNameError ? 'error' : undefined"
          :help="schemeNameError"
        >
          <a-input
            v-model="schemeName"
            allow-clear
            :max-length="20"
            show-word-limit
            placeholder="例如：华南区本周待放舱"
            @input="schemeNameError = ''"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="deleteSchemeModalVisible"
      title="删除查询方案"
      :width="420"
      :mask-closable="false"
      :ok-button-props="{ status: 'danger' }"
      @ok="deleteActiveQueryScheme"
    >
      确认删除查询方案“{{ activeQueryScheme?.name }}”？删除后不可恢复。
    </a-modal>

    <a-modal
      v-model:visible="voidModalVisible"
      title="作废订单"
      :width="440"
      :mask-closable="false"
      :ok-button-props="{ status: 'danger' }"
      @ok="voidOrder"
    >
      确认作废订单 {{ voidTargetRow?.orderNo }}？此操作不可撤销，并会保留操作日志。
    </a-modal>

    <shipment-order-detail-drawer
      v-model:visible="drawerVisible"
      :record="currentDetail"
      @open-full="openFullDetail"
    />
  </div>
</template>

<style scoped>
.workbench-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0;
  box-sizing: border-box;
}

.workbench-page :deep(.arco-card) {
  border-color: var(--dense-card-border);
  border-radius: var(--dense-radius);
  box-shadow: none;
}

.workbench-stack {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.workbench-page__command :deep(.arco-card-body) {
  padding: 0;
}

.filter-panel {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 8px 12px;
}

.filter-panel__fields {
  flex: 1;
  min-width: 0;
}

.filter-panel__form :deep(.arco-form-item) {
  margin-bottom: 0;
}

.filter-panel__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  padding-bottom: 1px;
  white-space: nowrap;
}

.query-scheme-trigger {
  max-width: 142px;
}

.query-scheme-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.query-scheme-option,
.density-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 112px;
}

.query-scheme-option__placeholder,
.density-option__placeholder {
  width: 12px;
  flex: 0 0 12px;
}

.flow-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
  min-height: 40px;
  padding: 0 12px;
  border-top: 1px solid var(--color-border-1);
}

.flow-bar__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
  border-right: 1px solid var(--color-border-1);
}

.workbench-status-tabs :deep(.arco-tabs-content) {
  display: none;
}

.workbench-status-tabs {
  flex: 1;
  min-width: 0;
}

.workbench-status-tabs :deep(.arco-tabs-nav) {
  margin-bottom: 0;
}

.workbench-status-tabs :deep(.arco-tabs-nav-tab) {
  overflow-x: auto;
  scrollbar-width: none;
}

.workbench-status-tabs :deep(.arco-tabs-nav-tab::-webkit-scrollbar) {
  display: none;
}

.workbench-status-tabs :deep(.arco-tabs-nav::before) {
  display: none;
}

.workbench-tab-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.workbench-tab-count {
  min-width: 18px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--color-fill-3);
  color: var(--color-text-2);
  font-size: var(--dense-font-micro);
  font-weight: var(--dense-weight-nav-active);
  line-height: 16px;
  text-align: center;
}

.workbench-tab-count--warn {
  background: var(--dense-warning-1);
  color: var(--dense-warning-7);
}

.workbench-tab-count--danger {
  background: var(--dense-danger-1);
  color: var(--dense-danger-7);
}

.workbench-status-tabs :deep(.arco-tabs-tab-active .workbench-tab-count) {
  background: var(--dense-primary-1);
  color: var(--dense-primary-7);
}

.workbench-signal-more {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
}

.workbench-page__table-host {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-shadow: var(--dense-shadow-card) !important;
}

.workbench-page__table-host :deep(.arco-card-header) {
  height: 40px;
  min-height: 40px;
  padding: 0 12px;
  border-bottom-color: var(--color-border-1);
}

.workbench-page__table-host :deep(.arco-card-body) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.workbench-table-frame {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 260px;
  overflow: hidden;
  background: var(--color-bg-card);
}

.workbench-table-frame :deep(.vxe-table) {
  flex: 1;
  width: 100%;
  min-width: 0;
}

.workbench-table-frame :deep(.vxe-table--render-wrapper),
.workbench-table-frame :deep(.vxe-table--main-wrapper),
.workbench-table-frame :deep(.vxe-table--header-wrapper),
.workbench-table-frame :deep(.vxe-table--body-wrapper) {
  width: 100%;
}

.table-cap-start {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.table-cap-tool {
  color: var(--color-text-3);
}

.table-context {
  display: flex;
  align-items: center;
  min-width: 0;
}

.table-context__title {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 17px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workbench-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  padding: 28px 16px;
  color: var(--color-text-3);
  text-align: center;
}

.workbench-empty__icon {
  margin-bottom: 8px;
  color: var(--color-text-4);
  font-size: 32px;
}

.workbench-empty__title {
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
}

.workbench-empty__desc {
  max-width: 360px;
  margin-top: 4px;
  font-size: var(--dense-font-aux);
  line-height: 18px;
}

.workbench-empty__actions {
  margin-top: 12px;
}

.drawer-footer-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
}

.query-filter-drawer__shell {
  height: 100%;
  background: var(--color-bg-card);
}

.query-filter-drawer__body {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  padding: 10px 0 0;
  overflow-y: auto;
}

.query-filter-drawer__group {
  padding: 0 16px 4px;
  background: transparent;
}

.query-filter-drawer__group + .query-filter-drawer__group {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-1);
}

.query-filter-drawer__group-head {
  position: relative;
  margin-bottom: 10px;
  padding-left: 8px;
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.query-filter-drawer__group-head::before {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  width: 2px;
  border-radius: 2px;
  background: var(--dense-primary-5);
  content: '';
}

.query-filter-drawer__body :deep(.arco-form-item) {
  margin-bottom: 12px;
}

.query-filter-drawer__body :deep(.arco-form-item-label-col) {
  padding-bottom: 4px;
}

.query-filter-drawer__body :deep(.arco-input-wrapper),
.query-filter-drawer__body :deep(.arco-select-view),
.query-filter-drawer__body :deep(.arco-range-picker) {
  background: var(--color-bg-card);
}

.query-filter-drawer :deep(.arco-drawer-header) {
  height: 46px;
  min-height: 46px;
  padding: 0 16px;
  border-bottom-color: var(--dense-card-border);
}

.query-filter-drawer :deep(.arco-drawer-title) {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
}

.query-filter-drawer :deep(.arco-drawer-body) {
  padding: 0;
}

.query-filter-drawer :deep(.arco-drawer-footer) {
  padding: 0;
  border-top-color: var(--dense-card-border);
  background: var(--color-bg-card);
}

.selection-tip {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
}

.cell-two-line {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cell-two-line__main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-two-line__sub {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1199px) {
  .filter-panel {
    flex-wrap: wrap;
  }

  .filter-panel__fields,
  .filter-panel__actions {
    width: 100%;
  }

  .filter-panel__actions {
    justify-content: flex-end;
    padding-bottom: 0;
  }

  .flow-bar {
    gap: 10px;
  }

  .flow-bar__actions {
    gap: 6px;
    padding-right: 8px;
  }
}

</style>
