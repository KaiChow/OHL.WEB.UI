<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
  IconLock,
  IconEmpty,
  IconHistory,
  IconLayout,
  IconCheck,
} from '@arco-design/web-vue/es/icon';
import { downloadCsvFile } from '../../../utils/mock-actions';
import { formatLocalMinute } from '../../../utils/date-time';
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
import { getOrderStatusTransitions, resolveShipmentUiScenario } from '../featureContracts';

const route = useRoute();
const router = useRouter();

const CURRENT_OPERATOR = '张操作';
const QUERY_SCHEME_STORAGE_KEY = 'ohl.shipment.export-order.query-schemes.v2';
const LEGACY_QUERY_SCHEME_STORAGE_KEY = 'ohl.shipment.export-order.query-schemes.v1';
const COLUMN_SETTING_STORAGE_KEY = 'ohl.shipment.export-order.visible-columns.v3';

type TableDensity = 'compact' | 'standard';
type WorkScope = 'all' | 'mine';

interface SavedQueryScheme {
  id: string;
  name: string;
  query: ShipmentOrderQuery;
  statusTab: ShipmentStatusKey;
  version: 2;
  revision: number;
  owner: 'system' | 'personal' | 'shared';
  isDefault: boolean;
  updatedAt: string;
  isSystem?: boolean;
}

type SchemeModalMode = 'create' | 'rename' | 'duplicate';

type ColumnSettingField = keyof ShipmentWorkbenchRow | 'nextAction';

interface ColumnSettingGroup {
  label: string;
  options: Array<{ field: ColumnSettingField; label: string; required?: boolean }>;
}

const COLUMN_SETTING_GROUPS: ColumnSettingGroup[] = [
  {
    label: '核心信息',
    options: [
      { field: 'orderNo', label: '订单号', required: true },
      { field: 'orderStatus', label: '订单状态', required: true },
      { field: 'customerName', label: '客户名称' },
      { field: 'businessType', label: '业务类型' },
      { field: 'operator', label: '操作人员' },
    ],
  },
  {
    label: '运输节点',
    options: [
      { field: 'pol', label: '起运港' },
      { field: 'pod', label: '目的港' },
      { field: 'carrier', label: '船公司' },
      { field: 'vesselVoyage', label: '船名航次' },
      { field: 'etd', label: 'ETD' },
      { field: 'eta', label: 'ETA' },
      { field: 'closingTime', label: '截关时间' },
      { field: 'containerSummary', label: '柜型柜量' },
    ],
  },
  {
    label: '单证信息',
    options: [
      { field: 'bookingNo', label: '订舱号' },
      { field: 'blNo', label: '提单号' },
      { field: 'fileStatus', label: '文件状态' },
    ],
  },
  {
    label: '执行跟进',
    options: [
      { field: 'nextAction', label: '当前待办' },
      { field: 'feeStatus', label: '费用状态' },
      { field: 'exceptionStatus', label: '异常状态' },
      { field: 'isOverdue', label: '是否超期' },
      { field: 'updatedAt', label: '更新时间' },
    ],
  },
];

const COLUMN_SETTING_OPTIONS = COLUMN_SETTING_GROUPS.flatMap((group) => group.options);
const REQUIRED_COLUMN_FIELDS = COLUMN_SETTING_OPTIONS.filter((option) => option.required).map((option) => option.field);
const DEFAULT_VISIBLE_COLUMN_FIELDS: ColumnSettingField[] = [
  'orderNo',
  'orderStatus',
  'customerName',
  'operator',
  'pol',
  'pod',
  'etd',
  'nextAction',
  'fileStatus',
  'feeStatus',
  'exceptionStatus',
  'updatedAt',
];

const loadVisibleColumnFields = (): ColumnSettingField[] => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(COLUMN_SETTING_STORAGE_KEY) ?? '[]') as string[];
    const availableFields = new Set(COLUMN_SETTING_OPTIONS.map((option) => option.field));
    const validFields = stored.filter((field): field is ColumnSettingField => availableFields.has(field as ColumnSettingField));
    const normalized = Array.from(new Set([...REQUIRED_COLUMN_FIELDS, ...validFields]));
    return normalized.length >= 8 ? normalized : [...DEFAULT_VISIBLE_COLUMN_FIELDS];
  } catch {
    return [...DEFAULT_VISIBLE_COLUMN_FIELDS];
  }
};

const KEYWORD_OPTIONS: { label: string; value: ShipmentKeywordType }[] = [
  { label: '业务单号', value: 'orderNo' },
  { label: '提单号', value: 'blNo' },
  { label: '订舱号', value: 'bookingNo' },
];

const STATUS_TABS: { key: ShipmentStatusKey; label: string; tone?: 'danger' | 'warn' }[] = [
  { key: 'all', label: '全部' },
  { key: 'waitBooking', label: '订舱处理' },
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

const getSystemQuerySchemes = (): SavedQueryScheme[] => [];

const loadCustomQuerySchemes = (): SavedQueryScheme[] => {
  try {
    const raw = window.localStorage.getItem(QUERY_SCHEME_STORAGE_KEY)
      ?? window.localStorage.getItem(LEGACY_QUERY_SCHEME_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<SavedQueryScheme>>;
    if (!Array.isArray(parsed)) return [];

    const seenIds = new Set<string>();
    const normalized = parsed.flatMap((item) => {
      if (!item?.id || !item?.name || !item?.query || item.isSystem || seenIds.has(item.id)) return [];
      seenIds.add(item.id);
      return [{
        id: item.id,
        name: item.name.slice(0, 20),
        query: cloneQuery({ ...defaultQuery(), ...item.query }),
        statusTab: item.statusTab ?? 'all',
        version: 2 as const,
        revision: Math.max(1, Number(item.revision) || 1),
        owner: item.owner === 'shared' ? 'shared' as const : 'personal' as const,
        isDefault: Boolean(item.isDefault),
        updatedAt: item.updatedAt ?? new Date().toISOString(),
      }];
    });
    let hasDefault = false;
    normalized.forEach((item) => {
      if (!item.isDefault) return;
      if (hasDefault) item.isDefault = false;
      hasDefault = true;
    });
    return normalized;
  } catch {
    return [];
  }
};

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const advancedQuery = reactive<ShipmentOrderQuery>(defaultQuery());
const uiScenario = computed(() => resolveShipmentUiScenario(route.query.uiState));
const appliedQuery = ref<ShipmentOrderQuery>(cloneQuery(defaultQuery()));
const activeStatusTab = ref<ShipmentStatusKey>('all');
const activeWorkScope = ref<WorkScope>('all');
const advancedFilterVisible = ref(false);
const loading = ref(false);
const loadError = ref('');
const hasSimulatedError = ref(false);
const batchFeedback = ref<{ success: number; failedOrderNos: string[] } | null>(null);
const tableRef = ref<VxeTableInstance>();
const columnSettingsVisible = ref(false);
const visibleColumnFields = ref<ColumnSettingField[]>(loadVisibleColumnFields());
const columnSettingDraft = ref<ColumnSettingField[]>([...visibleColumnFields.value]);
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
const tableDensity = ref<TableDensity>('standard');
const customQuerySchemes = ref<SavedQueryScheme[]>(loadCustomQuerySchemes());
const activeQuerySchemeId = ref<string>();
const schemeModalVisible = ref(false);
const deleteSchemeModalVisible = ref(false);
const schemeModalMode = ref<SchemeModalMode>('create');
const schemeForm = reactive({ name: '', owner: 'personal' as 'personal' | 'shared' });
const schemeNameError = ref('');

const page = reactive({ current: 1, size: 50 });

const operatorOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.operator)));
const carrierOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.carrier)));
const querySchemes = computed(() => [...getSystemQuerySchemes(), ...customQuerySchemes.value]);
const activeQueryScheme = computed(() => querySchemes.value.find((item) => item.id === activeQuerySchemeId.value));
const canDeleteActiveScheme = computed(() => Boolean(activeQueryScheme.value && !activeQueryScheme.value.isSystem));
const activeSchemeDirty = computed(() => Boolean(
  activeQueryScheme.value
  && (JSON.stringify(activeQueryScheme.value.query) !== JSON.stringify(cloneQuery(query))
    || activeQueryScheme.value.statusTab !== activeStatusTab.value),
));
const canOperate = computed(() => uiScenario.value !== 'permission');
const forcedLoading = computed(() => uiScenario.value === 'loading');
const tableError = computed(() => loadError.value);
const schemeModalTitle = computed(() => ({
  create: '保存查询方案',
  rename: '重命名查询方案',
  duplicate: '复制查询方案',
})[schemeModalMode.value]);
const statusTransitionOptions = computed(() => getOrderStatusTransitions(statusTargetRow.value?.orderStatus ?? ''));
const tableRowConfig = computed(() => ({
  isHover: true,
  keyField: 'id',
  height: tableDensity.value === 'compact' ? 36 : 44,
}));

const isColumnVisible = (field: ColumnSettingField) => visibleColumnFields.value.includes(field);

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

const scenarioRows = computed(() => allRows.value.map((row, index) => {
  if (index !== 0 || (uiScenario.value !== 'long' && uiScenario.value !== 'extreme')) return row;
  if (uiScenario.value === 'long') {
    return {
      ...row,
      customerName: `${row.customerName}（华南区跨境电商事业部长期战略合作客户与多法人结算主体）`,
      vesselVoyage: `${row.vesselVoyage} / 超长船名与多段中转航次识别验证`,
      riskFlags: [...row.riskFlags, '超长异常描述用于验证文本溢出与固定列稳定性'],
    };
  }
  return {
    ...row,
    containerSummary: '999x40HQ + 999x20GP',
    etd: '2099-12-31',
    eta: '2100-01-31',
    closingTime: '2099-12-30 23:59',
  };
}));

const queryBaseRows = computed(() => {
  const q = appliedQuery.value;

  return scenarioRows.value.filter((row) => {
    if (activeWorkScope.value === 'mine' && row.operator !== CURRENT_OPERATOR) return false;
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
  if (['empty', 'permission'].includes(uiScenario.value) || tableError.value) return [];
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
const activeWorkScopeLabel = computed(() => activeWorkScope.value === 'mine' ? '我的订单' : '全部在手');

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
    || activeWorkScope.value !== 'all'
    || activeStatusTab.value !== 'all',
  );
});

const tableContextText = computed(() => {
  if (uiScenario.value === 'permission') return '海运出口订单 · 无查看权限';
  if (tableError.value) return '海运出口订单 · 加载失败';
  const queue = activeQueueLabel.value === '全部' ? '全部状态' : `${activeQueueLabel.value}队列`;
  return `${activeWorkScopeLabel.value} · ${queue} · 按更新时间倒序`;
});
const tableTotal = computed(() => ['empty', 'permission'].includes(uiScenario.value) || tableError.value ? 0 : filteredRows.value.length);

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

const fileStatusMeta: Record<ShipmentWorkbenchRow['fileStatus'], { label: string; tone: 'acc' | 'wait' | 'rej' }> = {
  complete: { label: '文件齐全', tone: 'acc' },
  pending: { label: '待确认', tone: 'wait' },
  missing: { label: '缺文件', tone: 'rej' },
};

const feeStatusMeta: Record<ShipmentWorkbenchRow['feeStatus'], { label: string; tone: 'rel' | 'wait' }> = {
  confirmed: { label: '已确认', tone: 'rel' },
  pending: { label: '待确认', tone: 'wait' },
  none: { label: '未生成', tone: 'wait' },
};

const exceptionStatusMeta: Record<ShipmentWorkbenchRow['exceptionStatus'], { label: string; tone: 'acc' | 'rel' | 'rej' }> = {
  normal: { label: '正常', tone: 'acc' },
  resolved: { label: '已关闭', tone: 'rel' },
  open: { label: '处理中', tone: 'rej' },
};

const getFileStatusMeta = (row: ShipmentWorkbenchRow) => fileStatusMeta[row.fileStatus];
const getFeeStatusMeta = (row: ShipmentWorkbenchRow) => feeStatusMeta[row.feeStatus];
const getExceptionStatusMeta = (row: ShipmentWorkbenchRow) => exceptionStatusMeta[row.exceptionStatus];

const canTransitionOrder = (row: ShipmentWorkbenchRow) => getOrderStatusTransitions(row.orderStatus).length > 0;

const handleSearch = () => {
  appliedQuery.value = cloneQuery(query);
  page.current = 1;
  clearSelection();
};

const handleReset = () => {
  const defaultScheme = customQuerySchemes.value.find((item) => item.isDefault);
  if (defaultScheme) {
    applyQueryScheme(defaultScheme);
    return;
  }
  Object.assign(query, defaultQuery());
  appliedQuery.value = cloneQuery(defaultQuery());
  activeStatusTab.value = 'all';
  activeWorkScope.value = 'all';
  activeQuerySchemeId.value = undefined;
  advancedFilterVisible.value = false;
  page.current = 1;
  clearSelection();
};

const persistCustomQuerySchemes = () => {
  try {
    window.localStorage.setItem(QUERY_SCHEME_STORAGE_KEY, JSON.stringify(customQuerySchemes.value));
    window.localStorage.removeItem(LEGACY_QUERY_SCHEME_STORAGE_KEY);
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

const openSchemeModal = (mode: SchemeModalMode = 'create') => {
  schemeModalMode.value = mode;
  if (mode === 'rename') {
    schemeForm.name = activeQueryScheme.value?.name ?? '';
    schemeForm.owner = activeQueryScheme.value?.owner === 'shared' ? 'shared' : 'personal';
  } else if (mode === 'duplicate') {
    schemeForm.name = activeQueryScheme.value ? `${activeQueryScheme.value.name} - 副本` : '';
    schemeForm.owner = activeQueryScheme.value?.owner === 'shared' ? 'shared' : 'personal';
  } else {
    schemeForm.name = '';
    schemeForm.owner = 'personal';
  }
  schemeNameError.value = '';
  schemeModalVisible.value = true;
};

const saveCurrentQueryScheme = () => {
  const name = schemeForm.name.trim();
  if (!name) {
    schemeNameError.value = '请填写方案名称';
    return false;
  }
  if (name.length > 20) {
    schemeNameError.value = '方案名称不能超过 20 个字符';
    return false;
  }
  const ignoredId = schemeModalMode.value === 'rename' ? activeQuerySchemeId.value : undefined;
  if (querySchemes.value.some((item) => item.name === name && item.id !== ignoredId)) {
    schemeNameError.value = '已存在同名查询方案';
    return false;
  }

  if (schemeModalMode.value === 'rename' && activeQueryScheme.value && !activeQueryScheme.value.isSystem) {
    const target = customQuerySchemes.value.find((item) => item.id === activeQuerySchemeId.value);
    if (!target) return false;
    target.name = name;
    target.owner = schemeForm.owner;
    target.revision += 1;
    target.updatedAt = new Date().toISOString();
    const persisted = persistCustomQuerySchemes();
    if (persisted) Message.success(`查询方案已重命名为“${name}”`);
    else Message.warning('浏览器存储不可用，本次修改仅在当前会话生效');
    return true;
  }

  const source = schemeModalMode.value === 'duplicate' && activeQueryScheme.value
    ? activeQueryScheme.value
    : undefined;
  const next: SavedQueryScheme = {
    id: `custom-${Date.now()}`,
    name,
    query: cloneQuery(source?.query ?? query),
    statusTab: source?.statusTab ?? activeStatusTab.value,
    version: 2,
    revision: 1,
    owner: schemeForm.owner,
    isDefault: false,
    updatedAt: new Date().toISOString(),
  };
  customQuerySchemes.value.push(next);
  const persisted = persistCustomQuerySchemes();
  activeQuerySchemeId.value = next.id;
  if (persisted) Message.success(`查询方案“${name}”已${schemeModalMode.value === 'duplicate' ? '复制' : '保存'}`);
  else Message.warning('浏览器存储不可用，查询方案仅在本次会话保留');
  return true;
};

const updateActiveQueryScheme = () => {
  if (!activeQueryScheme.value || activeQueryScheme.value.isSystem) return;
  const target = customQuerySchemes.value.find((item) => item.id === activeQuerySchemeId.value);
  if (!target) return;
  target.query = cloneQuery(query);
  target.statusTab = activeStatusTab.value;
  target.revision += 1;
  target.updatedAt = new Date().toISOString();
  persistCustomQuerySchemes();
  Message.success(`查询方案“${target.name}”已更新`);
};

const toggleDefaultQueryScheme = () => {
  if (!activeQueryScheme.value || activeQueryScheme.value.isSystem) return;
  const nextDefault = !activeQueryScheme.value.isDefault;
  customQuerySchemes.value.forEach((item) => {
    item.isDefault = nextDefault && item.id === activeQuerySchemeId.value;
  });
  persistCustomQuerySchemes();
  Message.success(nextDefault ? `已将“${activeQueryScheme.value.name}”设为默认方案` : '已取消默认查询方案');
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

const openAdvancedFilters = () => {
  Object.assign(advancedQuery, cloneQuery(query));
  advancedFilterVisible.value = true;
};

const cancelAdvancedFilters = () => {
  Object.assign(advancedQuery, cloneQuery(query));
  advancedFilterVisible.value = false;
};

const clearAdvancedFilters = () => {
  advancedQuery.vesselVoyage = '';
  advancedQuery.blNo = '';
  advancedQuery.bookingNo = '';
  advancedQuery.orderStatus = undefined;
  advancedQuery.operator = undefined;
  advancedQuery.businessType = undefined;
  advancedQuery.etdRange = [];
  advancedQuery.closingRange = [];
  advancedQuery.hasException = undefined;
  advancedQuery.fileStatus = undefined;
  advancedQuery.feeStatus = undefined;
  advancedQuery.updatedRange = [];
  advancedQuery.isOverdue = undefined;
};

const applyAdvancedFilters = () => {
  Object.assign(query, cloneQuery(advancedQuery));
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

const onWorkScopeChange = (value: string | number | boolean) => {
  activeWorkScope.value = value as WorkScope;
  page.current = 1;
  clearSelection();
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
  columnSettingDraft.value = [...visibleColumnFields.value];
  columnSettingsVisible.value = true;
};

const resetColumnSettingDraft = () => {
  columnSettingDraft.value = [...DEFAULT_VISIBLE_COLUMN_FIELDS];
};

const applyColumnSettings = async () => {
  const nextFields = Array.from(new Set([...REQUIRED_COLUMN_FIELDS, ...columnSettingDraft.value]));
  if (nextFields.length < 8) {
    Message.warning('至少保留 8 个业务字段');
    return false;
  }
  if (!tableRef.value) {
    Message.error('表格尚未就绪，请稍后重试');
    return false;
  }

  visibleColumnFields.value = nextFields;
  window.localStorage.setItem(COLUMN_SETTING_STORAGE_KEY, JSON.stringify(nextFields));
  await nextTick();
  await Promise.all(COLUMN_SETTING_OPTIONS.map((option) => (
    nextFields.includes(option.field)
      ? tableRef.value?.showColumn(option.field)
      : tableRef.value?.hideColumn(option.field)
  )));
  await tableRef.value.refreshColumn();
  Message.success('列设置已应用');
  return true;
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
  row.updatedAt = formatLocalMinute();
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

  const nextStatus = statusTransitionOptions.value.find((item) => item.value === statusForm.targetStatus);
  if (!nextStatus) {
    statusErrors.targetStatus = '当前状态不允许执行该流转，请刷新后重试';
    return false;
  }
  statusTargetRow.value.orderStatus = statusForm.targetStatus as ShipmentWorkbenchRow['orderStatus'];
  statusTargetRow.value.orderStatusLabel = nextStatus.label;
  statusTargetRow.value.statusPill = nextStatus.tone;
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
  runBatchAction('批量通知');
};

const handleRowNotify = (row: ShipmentWorkbenchRow) => {
  Message.success(`订单 ${row.orderNo} 的通知已发送`);
};

const runBatchAction = async (label: string) => {
  if (!selectedCount.value) {
    Message.warning('请先选择订单');
    return;
  }

  const submittedRows = [...selectedRows.value];
  await new Promise((resolve) => setTimeout(resolve, uiScenario.value === 'slow' ? 1400 : 320));
  if (uiScenario.value === 'partial') {
    const failedRows = submittedRows.filter((_, index) => index % 3 === 0);
    const success = submittedRows.length - failedRows.length;
    batchFeedback.value = { success, failedOrderNos: failedRows.map((row) => row.orderNo) };
    tableRef.value?.clearCheckboxRow();
    if (failedRows.length) tableRef.value?.setCheckboxRow(failedRows, true);
    selectedRows.value = failedRows;
    Message.warning(`${label}完成，${success} 条成功，${failedRows.length} 条失败`);
    return;
  }
  batchFeedback.value = null;
  clearSelection();
  Message.success(`${label}已完成，共处理 ${submittedRows.length} 条`);
};

const handleBatchAction = (label: string) => runBatchAction(label);

const fetchList = async () => {
  if (uiScenario.value === 'permission') return;
  loadError.value = '';
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, uiScenario.value === 'slow' ? 1600 : 300));
  if (uiScenario.value === 'error' && !hasSimulatedError.value) {
    loadError.value = '订单数据加载失败，请检查网络后重试。';
    hasSimulatedError.value = true;
  }
  loading.value = false;
};

watch(uiScenario, () => {
  batchFeedback.value = null;
  hasSimulatedError.value = false;
  fetchList();
}, { immediate: true });
</script>

<template>
  <div class="workbench-page" data-pesdp-page="shipment-export-order-workbench">
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
                <span>{{ activeQueryScheme?.name ?? '查询方案' }}{{ activeSchemeDirty ? ' *' : '' }}</span>
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
                     <small v-if="scheme.isDefault">默认</small>
                     <small v-else-if="scheme.owner === 'shared'">共享</small>
                   </span>
                 </a-doption>
                 <a-divider class="action-menu__divider" />
                 <a-doption @click="openSchemeModal('create')">保存为新方案</a-doption>
                 <a-doption
                   v-if="canDeleteActiveScheme"
                   :disabled="!activeSchemeDirty"
                   @click="updateActiveQueryScheme"
                 >更新当前方案</a-doption>
                 <a-doption v-if="canDeleteActiveScheme" @click="openSchemeModal('rename')">重命名</a-doption>
                 <a-doption v-if="activeQueryScheme" @click="openSchemeModal('duplicate')">复制方案</a-doption>
                 <a-doption v-if="canDeleteActiveScheme" @click="toggleDefaultQueryScheme">
                   {{ activeQueryScheme?.isDefault ? '取消默认方案' : '设为默认方案' }}
                 </a-doption>
                 <a-divider v-if="canDeleteActiveScheme" class="action-menu__divider" />
                 <a-doption
                   v-if="canDeleteActiveScheme"
                   class="danger-opt"
                   @click="deleteSchemeModalVisible = true"
                 >
                   删除当前方案
                 </a-doption>
              </template>
            </a-dropdown>
            <a-button size="small" type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              查询
            </a-button>
            <a-button size="small" type="text" @click="handleReset">重置</a-button>
            <a-badge :count="advancedActiveCount" :offset="[-4, 4]">
              <a-button size="small" type="text" @click="openAdvancedFilters">
                <template #icon><icon-filter /></template>
                筛选
              </a-button>
            </a-badge>
          </div>
        </div>
        <div class="flow-bar">
          <div v-if="canOperate" class="flow-bar__actions">
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

          <div class="flow-bar__scope" data-workbench-scope="ownership">
            <span class="flow-bar__scope-label">工作范围</span>
            <a-radio-group
              v-model="activeWorkScope"
              type="button"
              size="small"
              @change="onWorkScopeChange"
            >
              <a-radio value="all">全部在手</a-radio>
              <a-radio value="mine">我的订单</a-radio>
            </a-radio-group>
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
              :total="tableTotal"
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

        <a-alert
          v-if="batchFeedback"
          type="warning"
          closable
          class="batch-result-alert"
          @close="batchFeedback = null"
        >
          批量处理完成：成功 {{ batchFeedback.success }} 条，失败 {{ batchFeedback.failedOrderNos.length }} 条；失败订单 {{ batchFeedback.failedOrderNos.join('、') }} 已保留选中，可修正后重试。
        </a-alert>

        <div class="workbench-table-frame">
          <vxe-table
            ref="tableRef"
            id="shipment-export-orders-v2"
            :class="[tableDensity, 'workbench-table']"
            size="small"
            style="width: 100%"
            height="100%"
            auto-resize
            fit
            border="none"
            show-overflow="title"
            :loading="loading || forcedLoading"
            :data="pagedRows"
            :column-config="{ resizable: true }"
            :custom-config="{ storage: true }"
            :row-config="tableRowConfig"
            :checkbox-config="{ highlight: true }"
            @checkbox-change="onSelectionChange"
            @checkbox-all="onSelectionChange"
          >
            <vxe-column type="checkbox" width="44" fixed="left" />

            <vxe-column field="orderNo" title="订单号" min-width="168" fixed="left" :visible="isColumnVisible('orderNo')">
              <template #default="{ row }">
                <span class="link-text link-text--strong mono" @click="openDetailDrawer(row)">{{ row.orderNo }}</span>
              </template>
            </vxe-column>

            <vxe-column field="orderStatus" title="订单状态" min-width="96" fixed="left" :visible="isColumnVisible('orderStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="row.statusPill">{{ row.orderStatusLabel }}</span>
              </template>
            </vxe-column>

            <vxe-column field="nextAction" title="当前待办" min-width="230" :visible="isColumnVisible('nextAction')">
              <template #default="{ row }">
                <div class="decision-cell" data-cell-role="decision-context">
                  <span class="decision-cell__main">{{ getNextActionLabel(row) }}</span>
                  <span v-if="tableDensity === 'standard'" class="decision-cell__context">{{ getNextActionMeta(row) }}</span>
                </div>
              </template>
            </vxe-column>

            <vxe-column field="operator" title="责任操作" min-width="90" :visible="isColumnVisible('operator')" />
            <vxe-column field="customerName" title="客户名称" min-width="190" :visible="isColumnVisible('customerName')" />
            <vxe-column field="pol" title="起运港" min-width="96" class-name="mono" :visible="isColumnVisible('pol')" />
            <vxe-column field="pod" title="目的港" min-width="96" class-name="mono" :visible="isColumnVisible('pod')" />
            <vxe-column field="etd" title="ETD" min-width="104" class-name="mono" :visible="isColumnVisible('etd')" />

            <vxe-column field="fileStatus" title="文件状态" min-width="100" :visible="isColumnVisible('fileStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="getFileStatusMeta(row).tone">{{ getFileStatusMeta(row).label }}</span>
              </template>
            </vxe-column>

            <vxe-column field="feeStatus" title="费用状态" min-width="100" :visible="isColumnVisible('feeStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="getFeeStatusMeta(row).tone">{{ getFeeStatusMeta(row).label }}</span>
              </template>
            </vxe-column>

            <vxe-column field="exceptionStatus" title="异常状态" min-width="100" :visible="isColumnVisible('exceptionStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="getExceptionStatusMeta(row).tone">{{ getExceptionStatusMeta(row).label }}</span>
              </template>
            </vxe-column>

            <vxe-column field="updatedAt" title="更新时间" min-width="140" class-name="mono" :visible="isColumnVisible('updatedAt')" />

            <vxe-column field="businessType" title="业务类型" min-width="84" :visible="isColumnVisible('businessType')" />
            <vxe-column field="carrier" title="船公司" min-width="120" :visible="isColumnVisible('carrier')" />
            <vxe-column field="vesselVoyage" title="船名航次" min-width="190" :visible="isColumnVisible('vesselVoyage')" />
            <vxe-column field="eta" title="ETA" min-width="104" class-name="mono" :visible="isColumnVisible('eta')" />
            <vxe-column field="closingTime" title="截关时间" min-width="140" class-name="mono" :visible="isColumnVisible('closingTime')" />
            <vxe-column field="bookingNo" title="订舱号" min-width="150" class-name="mono" :visible="isColumnVisible('bookingNo')" />
            <vxe-column field="blNo" title="提单号" min-width="160" class-name="mono" :visible="isColumnVisible('blNo')" />
            <vxe-column field="containerSummary" title="柜型柜量" min-width="110" :visible="isColumnVisible('containerSummary')" />
            <vxe-column field="isOverdue" title="是否超期" min-width="90" :visible="isColumnVisible('isOverdue')">
              <template #default="{ row }">{{ row.isOverdue ? '已超期' : '未超期' }}</template>
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
                      <a-doption v-if="canTransitionOrder(row)" @click="openStatusModal(row)">修改状态</a-doption>
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
                <icon-lock v-if="uiScenario === 'permission'" class="workbench-empty__icon" />
                <icon-info-circle v-else-if="tableError" class="workbench-empty__icon" />
                <icon-empty v-else class="workbench-empty__icon" />
                <div class="workbench-empty__title">
                  {{ uiScenario === 'permission'
                    ? '暂无海运出口订单查看权限'
                    : tableError
                      ? '海运出口订单加载失败'
                      : hasActiveFilter ? '未找到匹配的海运出口订单' : '暂无海运出口订单' }}
                </div>
                <div class="workbench-empty__desc">
                  {{ uiScenario === 'permission'
                    ? '请联系管理员开通海运出口订单的数据权限。'
                    : tableError
                      ? tableError
                      : hasActiveFilter ? '请调整查询条件或切换状态队列后重试。' : '可以先新建订单，或通过已配置的导入服务创建业务单。' }}
                </div>
                <div class="workbench-empty__actions">
                  <a-button v-if="tableError" size="small" type="primary" @click="fetchList">重新加载</a-button>
                  <a-button v-else-if="hasActiveFilter && uiScenario !== 'permission'" size="small" type="text" @click="handleReset">重置筛选</a-button>
                  <a-button v-else-if="uiScenario !== 'permission'" size="small" type="primary" @click="handleCreateOrder">
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
      data-ui-surface="advanced-filter"
      width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
      :mask-closable="false"
      @cancel="cancelAdvancedFilters"
    >
      <a-form class="advanced-filter-form" layout="vertical" size="small" :model="advancedQuery">
        <section class="advanced-filter-section" aria-labelledby="document-filter-title">
          <h3 id="document-filter-title" class="advanced-filter-section__title">单证识别</h3>
          <a-row :gutter="[16, 0]">
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="vesselVoyage" label="船名航次">
                <a-input v-model="advancedQuery.vesselVoyage" size="small" allow-clear placeholder="请输入船名 / 航次" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="blNo" label="提单号">
                <a-input v-model="advancedQuery.blNo" size="small" allow-clear placeholder="请输入提单号" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="bookingNo" label="订舱号">
                <a-input v-model="advancedQuery.bookingNo" size="small" allow-clear placeholder="请输入订舱号" />
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="advanced-filter-section" aria-labelledby="ownership-filter-title">
          <h3 id="ownership-filter-title" class="advanced-filter-section__title">业务归属</h3>
          <a-row :gutter="[16, 0]">
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="orderStatus" label="订单状态">
                <a-select v-model="advancedQuery.orderStatus" size="small" allow-clear placeholder="请选择">
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
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="operator" label="操作人员">
                <a-select v-model="advancedQuery.operator" size="small" allow-clear placeholder="请选择">
                  <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">
                    {{ operator }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="businessType" label="业务类型">
                <a-select v-model="advancedQuery.businessType" size="small" allow-clear placeholder="请选择">
                  <a-option value="FCL">FCL</a-option>
                  <a-option value="LCL">LCL</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="hasException" label="是否异常">
                <a-select v-model="advancedQuery.hasException" size="small" allow-clear placeholder="请选择">
                  <a-option value="yes">是</a-option>
                  <a-option value="no">否</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="advanced-filter-section" aria-labelledby="schedule-filter-title">
          <h3 id="schedule-filter-title" class="advanced-filter-section__title">航程时间</h3>
          <a-row :gutter="[16, 0]">
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="etdRange" label="开船日期">
                <a-range-picker v-model="advancedQuery.etdRange" size="small" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="closingRange" label="截关日期">
                <a-range-picker v-model="advancedQuery.closingRange" size="small" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="updatedRange" label="更新时间">
                <a-range-picker v-model="advancedQuery.updatedRange" size="small" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </section>

        <section class="advanced-filter-section" aria-labelledby="risk-filter-title">
          <h3 id="risk-filter-title" class="advanced-filter-section__title">风险与结算</h3>
          <a-row :gutter="[16, 0]">
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="fileStatus" label="文件状态">
                <a-select v-model="advancedQuery.fileStatus" size="small" allow-clear placeholder="请选择">
                  <a-option value="missing">缺失</a-option>
                  <a-option value="pending">待确认</a-option>
                  <a-option value="complete">完整</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="feeStatus" label="费用状态">
                <a-select v-model="advancedQuery.feeStatus" size="small" allow-clear placeholder="请选择">
                  <a-option value="none">未生成</a-option>
                  <a-option value="pending">待确认</a-option>
                  <a-option value="confirmed">已确认</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item field="isOverdue" label="是否超期">
                <a-select v-model="advancedQuery.isOverdue" size="small" allow-clear placeholder="请选择">
                  <a-option value="yes">是</a-option>
                  <a-option value="no">否</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </section>
      </a-form>
      <template #footer>
        <div class="advanced-filter-footer">
          <a-button size="small" type="text" @click="clearAdvancedFilters">清空更多筛选</a-button>
          <a-space class="advanced-filter-footer__actions" :size="8">
            <a-button size="small" @click="cancelAdvancedFilters">取消</a-button>
            <a-button size="small" type="primary" @click="applyAdvancedFilters">应用筛选</a-button>
          </a-space>
        </div>
      </template>
    </a-drawer>

    <a-modal
      v-model:visible="columnSettingsVisible"
      title="列设置"
      class="column-settings-modal"
      :width="560"
      :mask-closable="false"
      ok-text="应用"
      :on-before-ok="applyColumnSettings"
    >
      <div class="column-settings-summary">
        <span>已选择 {{ columnSettingDraft.length }} 个字段</span>
        <a-button size="small" type="text" @click="resetColumnSettingDraft">恢复默认</a-button>
      </div>
      <a-checkbox-group v-model="columnSettingDraft" class="column-settings-groups">
        <section v-for="group in COLUMN_SETTING_GROUPS" :key="group.label" class="column-settings-group">
          <div class="column-settings-group__title">{{ group.label }}</div>
          <div class="column-settings-grid">
            <a-checkbox
              v-for="option in group.options"
              :key="option.field"
              :value="option.field"
              :disabled="option.required"
            >
              {{ option.label }}
            </a-checkbox>
          </div>
        </section>
      </a-checkbox-group>
    </a-modal>

    <a-modal
      v-model:visible="statusModalVisible"
      title="修改订单状态"
      :width="560"
      :mask-closable="false"
      :on-before-ok="confirmStatusChange"
    >
      <a-form :model="statusForm" layout="vertical" size="small" class="detail-form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="当前状态">
              <span>{{ statusTargetRow?.orderStatusLabel }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="目标状态"
              field="targetStatus"
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
                <a-option v-for="option in statusTransitionOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="修改原因"
              field="reason"
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
      :title="schemeModalTitle"
      :width="480"
      :mask-closable="false"
      :on-before-ok="saveCurrentQueryScheme"
    >
      <a-form :model="schemeForm" layout="vertical" size="small" class="detail-form">
        <a-form-item
          field="name"
          label="方案名称"
          required
          :validate-status="schemeNameError ? 'error' : undefined"
          :help="schemeNameError"
        >
          <a-input
            v-model="schemeForm.name"
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
      :width="420"
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

.query-scheme-option small {
  margin-left: auto;
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
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

.flow-bar__scope {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  padding-right: 14px;
  border-right: 1px solid var(--color-border-1);
}

.flow-bar__scope-label {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  white-space: nowrap;
}

.flow-bar__scope :deep(.arco-radio-group-button) {
  white-space: nowrap;
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

.batch-result-alert {
  flex-shrink: 0;
  margin: 8px 12px;
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

.column-settings-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  padding-bottom: 8px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  border-bottom: 1px solid var(--color-border-1);
}

.column-settings-groups {
  display: block;
}

.column-settings-group {
  padding: 12px 0;
}

.column-settings-group + .column-settings-group {
  border-top: 1px solid var(--color-border-1);
}

.column-settings-group__title {
  margin-bottom: 8px;
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.column-settings-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 12px;
}

.column-settings-grid :deep(.arco-checkbox) {
  min-width: 0;
  margin-right: 0;
}

.column-settings-grid :deep(.arco-checkbox-label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.advanced-filter-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

.advanced-filter-footer__actions {
  margin-left: auto;
}

.advanced-filter-form {
  min-width: 0;
}

.advanced-filter-section + .advanced-filter-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-1);
}

.advanced-filter-section__title {
  margin: 0 0 12px;
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.advanced-filter-form :deep(.arco-form-item) {
  margin-bottom: 12px;
}

.selection-tip {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
}

.decision-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  min-width: 0;
}

.decision-cell__main,
.decision-cell__context {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.decision-cell__main {
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  line-height: 15px;
}

.decision-cell__context {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 14px;
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

  .flow-bar {
    gap: 8px;
  }

  .flow-bar__scope {
    gap: 4px;
    padding-right: 8px;
  }

  .flow-bar__scope-label {
    display: none;
  }
}

</style>
