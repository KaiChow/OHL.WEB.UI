<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconCopy,
  IconDown,
  IconDownload,
  IconEdit,
  IconExclamationCircle,
  IconEye,
  IconFilter,
  IconHistory,
  IconNotification,
  IconPlusCircle,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconStop,
  IconUndo,
  IconUpload,
  IconUserAdd,
} from '@arco-design/web-vue/es/icon';
import { downloadCsvFile } from '@/utils/mock-actions';
import { formatLocalMinute } from '@/utils/date-time';
import { compactVerticalFormLabelStyle, denseFormGridGutter } from '@/design-system/formLayout';
import { normalizeQueryFieldPlacement, queryFieldFitsWithinRows, queryFieldUnitUsage } from '@/design-system/queryFieldPreferences';
import type { QueryFieldPlacement } from '@/design-system/queryFieldPreferences';
import { stableTableRowConfig } from '@/design-system/tableConfig';
import { ROW_ACTION_COLUMN_WIDTH } from '@/design-system/rowActions';
import type { WorkbenchRowAction } from '@/design-system/rowActions';
import QueryFieldCol from '@/components/workbench/QueryFieldCol.vue';
import QueryFieldGrid from '@/components/workbench/QueryFieldGrid.vue';
import QueryFieldSettingsDrawer from '@/components/workbench/QueryFieldSettingsDrawer.vue';
import SavedQueryMenu from '@/components/workbench/SavedQueryMenu.vue';
import StandardListFrame from '@/components/workbench/StandardListFrame.vue';
import WorkbenchColumnSettings from '@/components/workbench/WorkbenchColumnSettings.vue';
import WorkbenchEmptyState from '@/components/workbench/WorkbenchEmptyState.vue';
import WorkbenchRowActions from '@/components/workbench/WorkbenchRowActions.vue';
import WorkbenchTableToolbar from '@/components/workbench/WorkbenchTableToolbar.vue';
import WorkflowStateSelector from '@/components/workbench/WorkflowStateSelector.vue';
import {
  canVoidRow,
  deriveQueueKeys,
  EXPORT_STATUS_TONES,
  getCancelBlockers,
  getExportStatusTransitions,
  isLegalTransition,
  isReadOnlyRow,
  isRowOverdue,
} from '@/views/uiAcceptance/exportOrderList/orderFlow';
import {
  EXPORT_ORDER_CUSTOMERS,
  EXPORT_ORDER_CARRIERS,
  EXPORT_ORDER_OPERATORS,
  EXPORT_ORDER_PORTS,
  EXPORT_ORDER_TODAY,
  exportOrderRows,
} from '@/views/uiAcceptance/exportOrderList/mockData';
import { resolveExportUiScenario, UA_EXPORT_ORDER_FEATURE_CONTRACTS } from '@/views/uiAcceptance/exportOrderList/featureContracts';
import {
  clearQueryFields,
  DEFAULT_QUERY_FIELD_PLACEMENT,
  EXPORT_QUERY_FIELDS,
  isQueryFieldActive,
  QUERY_FIELD_GROUPS,
  queryFieldSnapshot,
} from '@/views/uiAcceptance/exportOrderList/queryFields';
import type { ExportQueryField, ExportQueryFieldGroup } from '@/views/uiAcceptance/exportOrderList/queryFields';
import type {
  ExportOrderLogAction,
  ExportOrderQuery,
  ExportOrderRow,
  ExportOrderStatusKey,
  ExportQueryScheme,
  ExportQueueKey,
  ExportQueueStat,
} from '@/views/uiAcceptance/exportOrderList/types';
import OrderQueryFieldControl from '@/views/uiAcceptance/exportOrderList/components/OrderQueryFieldControl.vue';
import QuickViewDrawer from '@/views/uiAcceptance/exportOrderList/components/QuickViewDrawer.vue';
import StatusTransitionModal from '@/views/uiAcceptance/exportOrderList/components/StatusTransitionModal.vue';
import AssignModal from '@/views/uiAcceptance/exportOrderList/components/AssignModal.vue';
import ExceptionModal from '@/views/uiAcceptance/exportOrderList/components/ExceptionModal.vue';
import ImportModal from '@/views/uiAcceptance/exportOrderList/components/ImportModal.vue';
import type { ImportParsedRow, ImportResult } from '@/views/uiAcceptance/exportOrderList/components/ImportModal.vue';
import SchemeManagerDrawer from '@/views/uiAcceptance/exportOrderList/components/SchemeManagerDrawer.vue';
import type { ExceptionFormPayload } from '@/views/uiAcceptance/exportOrderList/components/ExceptionModal.vue';

// 页面动作全部对应 featureContracts 中的契约条目，模板不另建交互状态。
void UA_EXPORT_ORDER_FEATURE_CONTRACTS;

const route = useRoute();
const { t } = useI18n();

const CURRENT_OPERATOR = '张操作';
const COLUMN_SETTING_STORAGE_KEY = 'ohl.ua-export-order.visible-columns.v1';
const QUERY_FIELD_SETTING_STORAGE_KEY = 'ohl.ua-export-order.query-fields.v1';
const SCHEME_STORAGE_KEY = 'ohl.ua-export-order.schemes.v1';
const QUERY_FIELD_SETTING_VERSION = 1;
const SCHEME_STORAGE_VERSION = 1;
const QUERY_PAGE_CAPACITY_UNITS = 10;

type WorkScope = 'all' | 'mine';

type ColumnSettingField = keyof Pick<ExportOrderRow,
  | 'orderNo' | 'customerName' | 'businessType' | 'orderStatus' | 'vesselVoyage' | 'pol' | 'pod'
  | 'etd' | 'eta' | 'closingTime' | 'blNo' | 'bookingNo' | 'containerSummary' | 'operator'
  | 'fileStatus' | 'feeStatus' | 'exceptionStatus' | 'riskFlags' | 'createdAt' | 'updatedAt'>;

interface ColumnSettingGroup {
  labelKey: string;
  options: Array<{ field: ColumnSettingField; required?: boolean }>;
}

const COLUMN_SETTING_GROUPS: ColumnSettingGroup[] = [
  {
    labelKey: 'exportOrderList.columnGroups.core',
    options: [
      { field: 'orderNo', required: true },
      { field: 'orderStatus', required: true },
      { field: 'customerName' },
      { field: 'businessType' },
      { field: 'operator' },
      { field: 'riskFlags' },
    ],
  },
  {
    labelKey: 'exportOrderList.columnGroups.route',
    options: [
      { field: 'vesselVoyage' },
      { field: 'pol' },
      { field: 'pod' },
      { field: 'etd' },
      { field: 'eta' },
      { field: 'closingTime' },
    ],
  },
  {
    labelKey: 'exportOrderList.columnGroups.documents',
    options: [
      { field: 'blNo' },
      { field: 'bookingNo' },
      { field: 'containerSummary' },
      { field: 'fileStatus' },
      { field: 'feeStatus' },
      { field: 'exceptionStatus' },
    ],
  },
  {
    labelKey: 'exportOrderList.columnGroups.tracking',
    options: [
      { field: 'createdAt' },
      { field: 'updatedAt' },
    ],
  },
];

const COLUMN_SETTING_OPTIONS = COLUMN_SETTING_GROUPS.flatMap((group) => group.options);
const localizedColumnSettingOptions = computed(() => COLUMN_SETTING_OPTIONS.map((option) => ({
  field: option.field,
  label: t(`exportOrderList.columns.${option.field}`),
  required: option.required,
  orderLocked: option.field === 'orderNo' || option.field === 'orderStatus',
})));
const REQUIRED_COLUMN_FIELDS = COLUMN_SETTING_OPTIONS.filter((option) => option.required).map((option) => option.field);
const DEFAULT_COLUMN_ORDER_FIELDS = COLUMN_SETTING_OPTIONS.map((option) => option.field);
// PRD 一级信息优先：订单号 / 客户 / 状态 / 风险 / 船名航次 / ETD / 截关直接可见，其余经列设置开启。
const DEFAULT_VISIBLE_COLUMN_FIELDS: ColumnSettingField[] = [
  'orderNo',
  'orderStatus',
  'customerName',
  'riskFlags',
  'vesselVoyage',
  'etd',
  'closingTime',
  'operator',
  'fileStatus',
  'feeStatus',
  'exceptionStatus',
];

interface ColumnPreferences {
  visibleFields: ColumnSettingField[];
  orderedFields: ColumnSettingField[];
}

const normalizeColumnOrder = (fields: string[]): ColumnSettingField[] => {
  const availableFields = new Set(DEFAULT_COLUMN_ORDER_FIELDS);
  const normalized = Array.from(new Set(fields.filter((field): field is ColumnSettingField => availableFields.has(field as ColumnSettingField))));
  DEFAULT_COLUMN_ORDER_FIELDS.forEach((field) => {
    if (!normalized.includes(field)) normalized.push(field);
  });
  return normalized;
};

const loadColumnPreferences = (): ColumnPreferences => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(COLUMN_SETTING_STORAGE_KEY) ?? '[]') as string[] | Partial<ColumnPreferences>;
    const storedVisible = Array.isArray(stored) ? stored : stored.visibleFields ?? [];
    const storedOrder = Array.isArray(stored) ? DEFAULT_COLUMN_ORDER_FIELDS : stored.orderedFields ?? DEFAULT_COLUMN_ORDER_FIELDS;
    const availableFields = new Set(COLUMN_SETTING_OPTIONS.map((option) => option.field));
    const validFields = storedVisible.filter((field): field is ColumnSettingField => availableFields.has(field as ColumnSettingField));
    const normalized = Array.from(new Set([...REQUIRED_COLUMN_FIELDS, ...validFields]));
    return {
      visibleFields: normalized.length >= 8 ? normalized : [...DEFAULT_VISIBLE_COLUMN_FIELDS],
      orderedFields: normalizeColumnOrder(storedOrder),
    };
  } catch {
    return { visibleFields: [...DEFAULT_VISIBLE_COLUMN_FIELDS], orderedFields: [...DEFAULT_COLUMN_ORDER_FIELDS] };
  }
};

const initialColumnPreferences = loadColumnPreferences();

const WORKFLOW_STATE_OPTIONS: { key: ExportQueueKey; tone?: 'danger' | 'warn' }[] = [
  { key: 'all' },
  { key: 'waitBooking' },
  { key: 'waitRelease' },
  { key: 'waitTruck' },
  { key: 'waitCustoms' },
  { key: 'waitLoading' },
  { key: 'sailed' },
  { key: 'waitSi' },
  { key: 'waitBlConfirm' },
  { key: 'feeUnconfirmed', tone: 'warn' },
  { key: 'fileMissing', tone: 'warn' },
  { key: 'exception', tone: 'danger' },
];

const shiftFromToday = (days: number) => {
  const base = new Date(`${EXPORT_ORDER_TODAY}T00:00:00`);
  base.setDate(base.getDate() + days);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
};

// PRD 10：默认查询最近 30 天创建的数据，按更新时间倒序。
const defaultQuery = (): ExportOrderQuery => ({
  keyword: [],
  customerName: '',
  pol: undefined,
  pod: undefined,
  orderStatus: [],
  exceptionStatus: [],
  fileStatus: [],
  feeStatus: [],
  businessType: [],
  operator: [],
  carrier: [],
  vesselVoyage: '',
  etdRange: [],
  closingRange: [],
  createdRange: [shiftFromToday(-29), EXPORT_ORDER_TODAY],
  updatedRange: [],
  hasException: '',
  isOverdue: '',
});

const cloneQuery = (source: ExportOrderQuery): ExportOrderQuery => JSON.parse(JSON.stringify(source)) as ExportOrderQuery;

const queryFieldPreferenceOptions = EXPORT_QUERY_FIELDS.map((definition) => ({
  field: definition.field,
  label: definition.labelKey,
  width: definition.width,
  requiredPage: definition.requiredPage,
  orderLocked: definition.orderLocked,
}));

const loadQueryFieldPlacement = (): QueryFieldPlacement => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(QUERY_FIELD_SETTING_STORAGE_KEY) ?? '{}') as {
      version?: number;
      pageFields?: string[];
      drawerFields?: string[];
    };
    if (stored.version !== QUERY_FIELD_SETTING_VERSION) return normalizeQueryFieldPlacement(
      DEFAULT_QUERY_FIELD_PLACEMENT,
      queryFieldPreferenceOptions,
      DEFAULT_QUERY_FIELD_PLACEMENT,
    );
    const normalized = normalizeQueryFieldPlacement(stored, queryFieldPreferenceOptions, DEFAULT_QUERY_FIELD_PLACEMENT);
    return queryFieldFitsWithinRows(normalized.pageFields, queryFieldPreferenceOptions, 6, 2, 2)
      ? normalized
      : normalizeQueryFieldPlacement(DEFAULT_QUERY_FIELD_PLACEMENT, queryFieldPreferenceOptions, DEFAULT_QUERY_FIELD_PLACEMENT);
  } catch {
    return normalizeQueryFieldPlacement(DEFAULT_QUERY_FIELD_PLACEMENT, queryFieldPreferenceOptions, DEFAULT_QUERY_FIELD_PLACEMENT);
  }
};

const createOrderRows = () => exportOrderRows.map((row) => ({
  ...row,
  containerNos: [...row.containerNos],
  riskFlags: [...row.riskFlags],
  queueKeys: [...row.queueKeys],
  recentNodes: [...row.recentNodes],
  recentLogs: [...row.recentLogs],
}));

const loadSchemes = (): ExportQueryScheme[] => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(SCHEME_STORAGE_KEY) ?? 'null') as {
      version?: number;
      schemes?: ExportQueryScheme[];
    } | null;
    if (!stored || stored.version !== SCHEME_STORAGE_VERSION || !Array.isArray(stored.schemes)) return [];
    return stored.schemes.filter((scheme) => scheme
      && typeof scheme.id === 'string'
      && typeof scheme.name === 'string'
      && scheme.conditions
      && typeof scheme.conditions === 'object');
  } catch {
    return [];
  }
};

const query = reactive<ExportOrderQuery>(defaultQuery());
const advancedQuery = reactive<ExportOrderQuery>(defaultQuery());
const uiScenario = computed(() => resolveExportUiScenario(route.query.uiState));
const appliedQuery = ref<ExportOrderQuery>(cloneQuery(defaultQuery()));
const activeQueue = ref<ExportQueueKey>('all');
const activeWorkScope = ref<WorkScope>('all');
const advancedFilterVisible = ref(false);
const queryFieldSettingsVisible = ref(false);
const queryFieldPlacement = ref<QueryFieldPlacement>(loadQueryFieldPlacement());
const advancedApplying = ref(false);
const advancedDatePopupVisible = reactive({ etd: false, closing: false, created: false, updated: false });
const loading = ref(false);
const querying = ref(false);
const loadError = ref('');
const hasSimulatedError = ref(false);
const exporting = ref(false);
const batchSubmitting = ref(false);
const batchFeedback = ref<{
  label: string;
  success: number;
  failures: { orderNo: string; reason: string }[];
} | null>(null);
const pendingRowIds = ref<string[]>([]);
const tableRef = ref<VxeTableInstance>();
const visibleColumnFields = ref<ColumnSettingField[]>(initialColumnPreferences.visibleFields);
const orderedColumnFields = ref<ColumnSettingField[]>(initialColumnPreferences.orderedFields);
const selectedRows = ref<ExportOrderRow[]>([]);
const allRows = ref<ExportOrderRow[]>(createOrderRows());
const sortState = ref<{ field: string; order: 'asc' | 'desc' | null }>({ field: 'updatedAt', order: 'desc' });

const quickViewVisible = ref(false);
const quickViewRow = ref<ExportOrderRow | null>(null);
const statusModalVisible = ref(false);
const statusTargetRows = ref<ExportOrderRow[]>([]);
const statusSubmitting = ref(false);
const statusSubmitError = ref('');
const statusCapturedRevision = ref(0);
const assignModalVisible = ref(false);
const assignTargetRows = ref<ExportOrderRow[]>([]);
const assignSubmitting = ref(false);
const assignSubmitError = ref('');
const exceptionModalVisible = ref(false);
const exceptionTargetRows = ref<ExportOrderRow[]>([]);
const exceptionSubmitting = ref(false);
const exceptionSubmitError = ref('');
const voidModalVisible = ref(false);
const voidTargetRow = ref<ExportOrderRow | null>(null);
const voidSubmitting = ref(false);
const voidError = ref('');
const voidCapturedRevision = ref(0);
const uploadModalVisible = ref(false);
const uploadTargetRow = ref<ExportOrderRow | null>(null);
const uploadFileName = ref('');
const uploadInputRef = ref<HTMLInputElement | null>(null);
const uploadSubmitting = ref(false);
const uploadError = ref('');
const importVisible = ref(false);
const importing = ref(false);
const schemes = ref<ExportQueryScheme[]>(loadSchemes());
const activeSchemeId = ref('');
const schemeSaveVisible = ref(false);
const schemeSaveForm = reactive({ name: '' });
const schemeSaveError = ref('');
const schemeManagerVisible = ref(false);
const schemeSwitchVisible = ref(false);
const pendingSchemeId = ref('');
const schemeSaveSource = ref<'applied' | 'draft'>('applied');
const copySeq = ref(1);

const page = reactive({ current: 1, size: 20 });

const operatorOptions = EXPORT_ORDER_OPERATORS;
const carrierOptions = EXPORT_ORDER_CARRIERS;
const portOptions = EXPORT_ORDER_PORTS;
const queryFieldDefinitionByKey = new Map(EXPORT_QUERY_FIELDS.map((definition) => [definition.field, definition]));
const localizedQueryFieldOptions = computed(() => EXPORT_QUERY_FIELDS.map((definition) => ({
  field: definition.field,
  label: t(definition.labelKey),
  width: definition.width,
  requiredPage: definition.requiredPage,
  orderLocked: definition.orderLocked,
})));
const pageQueryFieldDefinitions = computed(() => queryFieldPlacement.value.pageFields
  .map((field) => queryFieldDefinitionByKey.get(field as ExportQueryField))
  .filter((definition): definition is (typeof EXPORT_QUERY_FIELDS)[number] => Boolean(definition)));
const drawerQueryFields = computed(() => queryFieldPlacement.value.drawerFields
  .map((field) => queryFieldDefinitionByKey.get(field as ExportQueryField)?.field)
  .filter((field): field is ExportQueryField => Boolean(field)));
const drawerFieldGroups = computed(() => QUERY_FIELD_GROUPS.map((group) => ({
  group,
  fields: drawerQueryFields.value
    .map((field) => queryFieldDefinitionByKey.get(field))
    .filter((definition): definition is (typeof EXPORT_QUERY_FIELDS)[number] => definition?.group === group),
})).filter((item) => item.fields.length));
const drawerFieldsForGroup = (group: ExportQueryFieldGroup) => drawerFieldGroups.value
  .find((item) => item.group === group)?.fields ?? [];
const canOperate = computed(() => uiScenario.value !== 'permission');
const forcedLoading = computed(() => uiScenario.value === 'loading');
const tableError = computed(() => loadError.value);
const isColumnVisible = (field: ColumnSettingField) => visibleColumnFields.value.includes(field);

const matchText = (value: string, keyword: string) =>
  !keyword.trim() || value.toLowerCase().includes(keyword.trim().toLowerCase());

const matchKeyword = (row: ExportOrderRow, q: ExportOrderQuery) => {
  if (!q.keyword.length) return true;
  // 关键词统一入口：订单号 / 提单号 / 订舱号 / 箱号任一命中即可。
  return q.keyword.some((keyword) => (
    matchText(row.orderNo, keyword)
    || matchText(row.blNo, keyword)
    || matchText(row.bookingNo, keyword)
    || row.containerNos.some((containerNo) => matchText(containerNo, keyword))
  ));
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
      vesselVoyage: `${row.vesselVoyage || 'COSCO SHIPPING UNIVERSE'} / 超长船名与多段中转航次识别验证航次`,
    };
  }
  return {
    ...row,
    containerSummary: '999×40HQ + 999×20GP',
    etd: '2099-12-31',
    eta: '2100-01-31',
    closingTime: '2099-12-30 23:59',
  };
}));

const rowMatchesQuery = (row: ExportOrderRow, q: ExportOrderQuery, workScope: WorkScope) => {
  if (workScope === 'mine' && row.operator !== CURRENT_OPERATOR) return false;
  if (!matchKeyword(row, q)) return false;
  if (!matchText(row.customerName, q.customerName)) return false;
  if (q.pol && row.pol !== q.pol) return false;
  if (q.pod && row.pod !== q.pod) return false;
  if (q.orderStatus.length && !q.orderStatus.includes(row.orderStatus)) return false;
  if (q.exceptionStatus.length && !q.exceptionStatus.includes(row.exceptionStatus)) return false;
  if (q.fileStatus.length && !q.fileStatus.includes(row.fileStatus)) return false;
  if (q.feeStatus.length && !q.feeStatus.includes(row.feeStatus)) return false;
  if (q.businessType.length && !q.businessType.includes(row.businessType)) return false;
  if (q.operator.length && !q.operator.includes(row.operator)) return false;
  if (q.carrier.length && !q.carrier.includes(row.carrier)) return false;
  if (!matchText(row.vesselVoyage, q.vesselVoyage)) return false;
  if (q.hasException === 'yes' && row.exceptionStatus !== 'open') return false;
  if (q.hasException === 'no' && row.exceptionStatus === 'open') return false;
  if (q.isOverdue === 'yes' && !row.isOverdue) return false;
  if (q.isOverdue === 'no' && row.isOverdue) return false;
  if (!matchRange(row.etd, q.etdRange, true)) return false;
  if (!matchRange(row.closingTime, q.closingRange, true)) return false;
  if (!matchRange(row.createdAt, q.createdRange, true)) return false;
  if (!matchRange(row.updatedAt, q.updatedRange, true)) return false;
  return true;
};

const queryBaseRows = computed(() => scenarioRows.value
  .filter((row) => rowMatchesQuery(row, appliedQuery.value, activeWorkScope.value)));

const filteredRows = computed(() =>
  queryBaseRows.value.filter((row) => activeQueue.value === 'all' || row.queueKeys.includes(activeQueue.value)),
);

const sortedRows = computed(() => {
  const rows = [...filteredRows.value];
  const { field, order } = sortState.value;
  if (!field || !order) return rows;
  rows.sort((a, b) => {
    const aValue = String((a as Record<string, unknown>)[field] ?? '');
    const bValue = String((b as Record<string, unknown>)[field] ?? '');
    return order === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
  });
  return rows;
});

const advancedPreviewCount = computed(() => {
  if (['empty', 'permission'].includes(uiScenario.value)) return 0;
  return scenarioRows.value.filter((row) => (
    rowMatchesQuery(row, advancedQuery, activeWorkScope.value)
    && (activeQueue.value === 'all' || row.queueKeys.includes(activeQueue.value))
  )).length;
});

const pagedRows = computed(() => {
  if (['empty', 'permission'].includes(uiScenario.value) || tableError.value) return [];
  const start = (page.current - 1) * page.size;
  return sortedRows.value.slice(start, start + page.size);
});

const workflowStateOptions = computed<ExportQueueStat[]>(() =>
  WORKFLOW_STATE_OPTIONS.map((state) => {
    const rows = state.key === 'all'
      ? queryBaseRows.value
      : queryBaseRows.value.filter((row) => row.queueKeys.includes(state.key));
    const name = t(`exportOrderList.queues.${state.key}`);
    return {
      key: state.key,
      label: name,
      count: rows.length,
      tone: state.tone,
    };
  }),
);

const selectedCount = computed(() => selectedRows.value.length);

const hasActiveFilter = computed(() => {
  const isDefaultConditions = JSON.stringify(appliedQuery.value) === JSON.stringify(defaultQuery());
  return !isDefaultConditions || activeWorkScope.value !== 'all' || activeQueue.value !== 'all';
});

const queryDraftDirty = computed(() => JSON.stringify(query) !== JSON.stringify(appliedQuery.value));

const tableTotal = computed(() => ['empty', 'permission'].includes(uiScenario.value) || tableError.value ? 0 : filteredRows.value.length);

const advancedConditionSnapshot = (source: ExportOrderQuery) => queryFieldSnapshot(source, drawerQueryFields.value);

const advancedDraftGroupCounts = computed(() => Object.fromEntries(QUERY_FIELD_GROUPS.map((group) => [
  group,
  drawerQueryFields.value.filter((field) => (
    queryFieldDefinitionByKey.get(field)?.group === group && isQueryFieldActive(advancedQuery, field)
  )).length,
])) as Record<ExportQueryFieldGroup, number>);

const advancedDraftCount = computed(() => Object.values(advancedDraftGroupCounts.value)
  .reduce((total, count) => total + count, 0));
const advancedDraftDirty = computed(() => (
  JSON.stringify(advancedConditionSnapshot(advancedQuery))
  !== JSON.stringify(advancedConditionSnapshot(query))
));

const advancedActiveCount = computed(() => drawerQueryFields.value
  .filter((field) => isQueryFieldActive(query, field)).length);

const isRowPending = (row: ExportOrderRow) => pendingRowIds.value.includes(row.id);

const waitForInteraction = (normalDelay = 280, slowDelay = 1400) => new Promise((resolve) => {
  window.setTimeout(resolve, uiScenario.value === 'slow' ? slowDelay : normalDelay);
});

const addLog = (row: ExportOrderRow, action: ExportOrderLogAction, detailKey?: string) => {
  row.recentLogs = [{
    id: `${row.id}-log-${row.revision + 1}-${action}`,
    time: formatLocalMinute(),
    operator: CURRENT_OPERATOR,
    action,
    detailKey,
  }, ...row.recentLogs].slice(0, 3);
};

const touchRow = (row: ExportOrderRow) => {
  row.revision += 1;
  row.updatedAt = formatLocalMinute();
  row.queueKeys = deriveQueueKeys(row);
  row.isOverdue = isRowOverdue(row, EXPORT_ORDER_TODAY);
};

const runRowMutation = async (
  row: ExportOrderRow,
  mutate: () => void,
  successMessage: string,
  failureMessage: string,
  expectedRevision?: number,
) => {
  if (isRowPending(row)) return false;
  if (expectedRevision !== undefined && row.revision !== expectedRevision) {
    Message.error(t('exportOrderList.messages.staleRevision', { orderNo: row.orderNo }));
    return false;
  }
  pendingRowIds.value = [...pendingRowIds.value, row.id];
  try {
    await waitForInteraction(260, 1200);
    if (uiScenario.value === 'error') throw new Error(failureMessage);
    mutate();
    touchRow(row);
    Message.success(successMessage);
    return true;
  } catch {
    Message.error(failureMessage);
    return false;
  } finally {
    pendingRowIds.value = pendingRowIds.value.filter((id) => id !== row.id);
  }
};

const executeBatch = async (
  label: string,
  rows: ExportOrderRow[],
  mutate: (row: ExportOrderRow) => void,
) => {
  if (!rows.length || batchSubmitting.value) return false;
  batchSubmitting.value = true;
  await waitForInteraction(320, 1400);
  const failedRows = uiScenario.value === 'error'
    ? rows
    : uiScenario.value === 'partial'
      ? rows.filter((_, index) => index % 3 === 0)
      : [];
  const failedIds = new Set(failedRows.map((row) => row.id));
  const succeededRows = rows.filter((row) => !failedIds.has(row.id));
  succeededRows.forEach((row) => {
    mutate(row);
    touchRow(row);
  });

  if (failedRows.length) {
    batchFeedback.value = {
      label,
      success: succeededRows.length,
      failures: failedRows.map((row) => ({ orderNo: row.orderNo, reason: t('exportOrderList.messages.batchFail', { action: label, failed: 1 }) })),
    };
    tableRef.value?.clearCheckboxRow();
    tableRef.value?.setCheckboxRow(failedRows, true);
    selectedRows.value = failedRows;
    batchSubmitting.value = false;
    if (succeededRows.length) Message.warning(t('exportOrderList.messages.batchPartial', { action: label, success: succeededRows.length, failed: failedRows.length }));
    else Message.error(t('exportOrderList.messages.batchFail', { action: label, failed: failedRows.length }));
    return succeededRows.length > 0;
  }

  batchFeedback.value = null;
  clearSelection();
  batchSubmitting.value = false;
  Message.success(t('exportOrderList.messages.batchSuccess', { action: label, count: rows.length }));
  return true;
};

const downloadBatchFailures = () => {
  const failures = batchFeedback.value?.failures ?? [];
  if (!failures.length) return;
  downloadCsvFile(
    `batch-failures-${failures.length}.csv`,
    [t('exportOrderList.columns.orderNo'), t('exportOrderList.importTask.errorInfo')],
    failures.map((failure) => [failure.orderNo, failure.reason]),
  );
};

const handleSearch = async () => {
  if (querying.value) return;
  querying.value = true;
  await waitForInteraction(220, 900);
  appliedQuery.value = cloneQuery(query);
  activeSchemeId.value = '';
  page.current = 1;
  clearSelection();
  querying.value = false;
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = cloneQuery(defaultQuery());
  activeQueue.value = 'all';
  activeWorkScope.value = 'all';
  activeSchemeId.value = '';
  sortState.value = { field: 'updatedAt', order: 'desc' };
  advancedFilterVisible.value = false;
  queryFieldSettingsVisible.value = false;
  page.current = 1;
  clearSelection();
};

const applyScheme = (schemeId: string) => {
  const scheme = schemes.value.find((item) => item.id === schemeId);
  if (!scheme) return;
  activeSchemeId.value = scheme.id;
  Object.assign(query, cloneQuery(scheme.conditions));
  void handleSearch().then(() => {
    activeSchemeId.value = scheme.id;
    Message.success(t('exportOrderList.schemes.applied', { name: scheme.name }));
  });
};

const closeAdvancedDatePopups = () => {
  advancedDatePopupVisible.etd = false;
  advancedDatePopupVisible.closing = false;
  advancedDatePopupVisible.created = false;
  advancedDatePopupVisible.updated = false;
};

const handleAdvancedPopupEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !advancedFilterVisible.value) return;
  if (!Object.values(advancedDatePopupVisible).some(Boolean)) return;
  event.preventDefault();
  event.stopPropagation();
  closeAdvancedDatePopups();
};

onMounted(() => window.addEventListener('keydown', handleAdvancedPopupEscape, true));
onBeforeUnmount(() => window.removeEventListener('keydown', handleAdvancedPopupEscape, true));

const openAdvancedFilters = () => {
  closeAdvancedDatePopups();
  Object.assign(advancedQuery, cloneQuery(query));
  queryFieldSettingsVisible.value = false;
  advancedFilterVisible.value = true;
};

const openQueryFieldSettings = () => {
  advancedFilterVisible.value = false;
  queryFieldSettingsVisible.value = true;
};

const applyQueryFieldPlacement = (placement: QueryFieldPlacement) => {
  const normalized = normalizeQueryFieldPlacement(
    placement,
    localizedQueryFieldOptions.value,
    DEFAULT_QUERY_FIELD_PLACEMENT,
  );
  if (!queryFieldFitsWithinRows(normalized.pageFields, localizedQueryFieldOptions.value, 6, 2, 2)) {
    Message.error(t('shipment.querySettings.capacityError', { used: queryFieldUnitUsage(normalized.pageFields, localizedQueryFieldOptions.value), capacity: QUERY_PAGE_CAPACITY_UNITS, rows: 2 }));
    return false;
  }
  try {
    window.localStorage.setItem(QUERY_FIELD_SETTING_STORAGE_KEY, JSON.stringify({
      version: QUERY_FIELD_SETTING_VERSION,
      ...normalized,
    }));
    queryFieldPlacement.value = normalized;
    Message.success(t('shipment.querySettings.saved'));
    return true;
  } catch {
    Message.error(t('shipment.querySettings.saveError'));
    return false;
  }
};

const cancelAdvancedFilters = () => {
  if (advancedApplying.value) return;
  closeAdvancedDatePopups();
  Object.assign(advancedQuery, cloneQuery(query));
  advancedFilterVisible.value = false;
};

const clearAdvancedFilters = () => {
  clearQueryFields(advancedQuery, drawerQueryFields.value, defaultQuery());
};

const clearAdvancedGroup = (group: ExportQueryFieldGroup) => clearQueryFields(
  advancedQuery,
  drawerQueryFields.value.filter((field) => queryFieldDefinitionByKey.get(field)?.group === group),
  defaultQuery(),
);

const updateAdvancedDatePopup = (field: 'etd' | 'closing' | 'created' | 'updated', value: boolean) => {
  advancedDatePopupVisible[field] = value;
};

const applyAdvancedFilters = async () => {
  if (advancedApplying.value) return;
  advancedApplying.value = true;
  Object.assign(query, cloneQuery(advancedQuery));
  try {
    await handleSearch();
    closeAdvancedDatePopups();
    advancedFilterVisible.value = false;
  } finally {
    advancedApplying.value = false;
  }
};

const onQueueChange = (key: string | number) => {
  activeQueue.value = key as ExportQueueKey;
  page.current = 1;
  clearSelection();
};

const onWorkScopeChange = (value: string | number | boolean) => {
  activeWorkScope.value = value as WorkScope;
  page.current = 1;
  clearSelection();
};

const persistSchemes = () => {
  window.localStorage.setItem(SCHEME_STORAGE_KEY, JSON.stringify({
    version: SCHEME_STORAGE_VERSION,
    schemes: schemes.value,
  }));
};

const onSchemeChange = (schemeId: string) => {
  if (!schemeId || schemeId === activeSchemeId.value) return;
  if (queryDraftDirty.value) {
    pendingSchemeId.value = schemeId;
    schemeSwitchVisible.value = true;
    return;
  }
  applyScheme(schemeId);
};

const cancelSchemeSwitch = () => {
  pendingSchemeId.value = '';
  schemeSwitchVisible.value = false;
};

const discardDraftAndApplyScheme = () => {
  const schemeId = pendingSchemeId.value;
  cancelSchemeSwitch();
  if (schemeId) applyScheme(schemeId);
};

const saveDraftAndApplyScheme = () => {
  schemeSwitchVisible.value = false;
  openSchemeSave('draft');
};

const openSchemeSave = (source: 'applied' | 'draft' = 'applied') => {
  schemeSaveSource.value = source;
  schemeSaveForm.name = '';
  schemeSaveError.value = '';
  schemeSaveVisible.value = true;
};

const confirmSchemeSave = () => {
  const name = schemeSaveForm.name.trim();
  schemeSaveError.value = name ? '' : t('exportOrderList.schemes.nameRequired');
  if (!schemeSaveError.value && schemes.value.some((scheme) => scheme.name === name)) {
    schemeSaveError.value = t('exportOrderList.schemes.duplicate');
  }
  if (schemeSaveError.value) return false;
  schemes.value = [...schemes.value, {
    id: `scheme-${Date.now()}`,
    name,
    isDefault: schemes.value.length === 0,
    conditions: cloneQuery(schemeSaveSource.value === 'draft' ? query : appliedQuery.value),
  }];
  persistSchemes();
  Message.success(t('exportOrderList.schemes.saved', { name }));
  if (schemeSaveSource.value === 'draft' && pendingSchemeId.value) {
    const targetId = pendingSchemeId.value;
    pendingSchemeId.value = '';
    applyScheme(targetId);
  }
  return true;
};

const onSchemeRename = (id: string, name: string) => {
  if (schemes.value.some((scheme) => scheme.id !== id && scheme.name === name)) {
    Message.error(t('exportOrderList.schemes.duplicate'));
    return;
  }
  schemes.value = schemes.value.map((scheme) => (scheme.id === id ? { ...scheme, name } : scheme));
  persistSchemes();
  Message.success(t('exportOrderList.schemes.renamed', { name }));
};

const onSchemeRemove = (id: string) => {
  const scheme = schemes.value.find((item) => item.id === id);
  schemes.value = schemes.value.filter((item) => item.id !== id);
  if (activeSchemeId.value === id) activeSchemeId.value = '';
  persistSchemes();
  Message.success(t('exportOrderList.schemes.removed', { name: scheme?.name ?? '' }));
};

const onSchemeSetDefault = (id: string) => {
  schemes.value = schemes.value.map((scheme) => ({ ...scheme, isDefault: scheme.id === id }));
  persistSchemes();
  Message.success(t('exportOrderList.schemes.defaultSet', { name: schemes.value.find((scheme) => scheme.id === id)?.name ?? '' }));
};

const onSchemeReorder = (orderedIds: string[]) => {
  const schemeById = new Map(schemes.value.map((scheme) => [scheme.id, scheme]));
  const next = orderedIds.map((id) => schemeById.get(id)).filter((scheme): scheme is ExportQueryScheme => Boolean(scheme));
  schemes.value.forEach((scheme) => {
    if (!next.includes(scheme)) next.push(scheme);
  });
  schemes.value = next;
  persistSchemes();
  Message.success(t('exportOrderList.schemes.reordered'));
};

const onSelectionChange = () => {
  selectedRows.value = (tableRef.value?.getCheckboxRecords() ?? []) as ExportOrderRow[];
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

const onSortChange = ({ field, order }: { field?: string; order?: 'asc' | 'desc' | null | '' }) => {
  const normalizedOrder = order || null;
  sortState.value = field && normalizedOrder ? { field, order: normalizedOrder } : { field: 'updatedAt', order: 'desc' };
};

const syncTableColumnPreferences = async (visibleFields: ColumnSettingField[], orderedFields: ColumnSettingField[]) => {
  const table = tableRef.value;
  if (!table) return false;

  const tableColumns = table.getTableColumn().fullColumn;
  const structuralLeft = tableColumns.filter((column) => !column.field && column.fixed === 'left');
  const structuralRight = tableColumns.filter((column) => !column.field && column.fixed === 'right');
  const structuralCenter = tableColumns.filter((column) => !column.field && !column.fixed);
  const orderedBusinessColumns = orderedFields
    .map((field) => table.getColumnByField(field))
    .filter((column): column is NonNullable<typeof column> => Boolean(column));
  await table.reloadColumn([...structuralLeft, ...orderedBusinessColumns, ...structuralCenter, ...structuralRight]);
  await Promise.all(COLUMN_SETTING_OPTIONS.map((option) => (
    visibleFields.includes(option.field)
      ? table.showColumn(option.field)
      : table.hideColumn(option.field)
  )));
  await table.refreshColumn();
  return true;
};

const applyColumnSettings = async ({ visibleFields, orderedFields }: { visibleFields: string[]; orderedFields: string[] }) => {
  const availableFields = new Set(COLUMN_SETTING_OPTIONS.map((option) => option.field));
  const requestedFields = visibleFields.filter((field): field is ColumnSettingField => availableFields.has(field as ColumnSettingField));
  const nextFields = Array.from(new Set([...REQUIRED_COLUMN_FIELDS, ...requestedFields]));
  const nextOrder = normalizeColumnOrder(orderedFields);
  if (nextFields.length < 8) {
    Message.warning(t('exportOrderList.messages.minColumns'));
    return false;
  }
  if (!tableRef.value) {
    Message.error(t('exportOrderList.messages.tableNotReady'));
    return false;
  }

  visibleColumnFields.value = nextFields;
  orderedColumnFields.value = nextOrder;
  window.localStorage.setItem(COLUMN_SETTING_STORAGE_KEY, JSON.stringify({ visibleFields: nextFields, orderedFields: nextOrder }));
  await nextTick();
  await syncTableColumnPreferences(nextFields, nextOrder);
  Message.success(t('exportOrderList.messages.columnsApplied'));
  return true;
};

onMounted(async () => {
  const defaultScheme = schemes.value.find((scheme) => scheme.isDefault);
  if (defaultScheme) {
    Object.assign(query, cloneQuery(defaultScheme.conditions));
    appliedQuery.value = cloneQuery(defaultScheme.conditions);
    activeSchemeId.value = defaultScheme.id;
  }
  await nextTick();
  await syncTableColumnPreferences(visibleColumnFields.value, orderedColumnFields.value);
});

const precheckAndRun = (
  label: string,
  rows: ExportOrderRow[],
  eligible: ExportOrderRow[],
  reasonFor: (row: ExportOrderRow) => string,
  execute: () => Promise<boolean>,
) => {
  if (!eligible.length) {
    Message.warning(t('exportOrderList.messages.selectOrders'));
    return;
  }
  const skipped = rows.filter((row) => !eligible.includes(row));
  if (!skipped.length) {
    void execute();
    return;
  }
  Modal.confirm({
    title: t('exportOrderList.batch.precheckTitle'),
    content: `${t('exportOrderList.batch.precheckCopy', { total: rows.length, eligible: eligible.length, skipped: skipped.length, action: label })}`
      + `\n${t('exportOrderList.batch.skippedList')}：${skipped.map((row) => `${row.orderNo}（${reasonFor(row)}）`).join('、')}`,
    okText: t('exportOrderList.batch.confirmContinue', { count: eligible.length }),
    cancelText: t('common.cancel'),
    onOk: execute,
  });
};

const openQuickView = (row: ExportOrderRow) => {
  quickViewRow.value = row;
  quickViewVisible.value = true;
};

const openStatusModal = (rows: ExportOrderRow[]) => {
  const eligible = rows.filter((row) => getExportStatusTransitions(row).length > 0);
  if (!eligible.length) {
    Message.warning(t('exportOrderList.batch.reasons.noTransition'));
    return;
  }
  statusTargetRows.value = eligible;
  statusCapturedRevision.value = eligible.length === 1 ? eligible[0].revision : 0;
  statusSubmitError.value = '';
  statusModalVisible.value = true;
};

const applyStatusTransition = async (rows: ExportOrderRow[], targetStatus: ExportOrderStatusKey, reason: string) => {
  if (rows.length === 1) {
    const row = rows[0];
    return runRowMutation(
      row,
      () => {
        row.orderStatus = targetStatus;
        addLog(row, 'status', targetStatus);
      },
      t(targetStatus === 'cancelled' ? 'exportOrderList.messages.cancelSuccess' : 'exportOrderList.messages.statusSuccess', { orderNo: row.orderNo, status: t(`exportOrderList.statuses.${targetStatus}`) }),
      t(targetStatus === 'cancelled' ? 'exportOrderList.messages.cancelFail' : 'exportOrderList.messages.statusFail', { orderNo: row.orderNo }),
      statusCapturedRevision.value,
    );
  }
  return executeBatch(t('exportOrderList.actions.batchStatus'), rows, (row) => {
    row.orderStatus = targetStatus;
    addLog(row, 'status', targetStatus);
  });
};

const submitStatusTransition = async ({ targetStatus, reason }: { targetStatus: ExportOrderStatusKey; reason: string }) => {
  const rows = [...statusTargetRows.value];
  if (!rows.length) return false;

  if (rows.length === 1) {
    const row = rows[0];
    if (!isLegalTransition(row, targetStatus)) {
      const allowed = getExportStatusTransitions(row).map((transition) => t(`exportOrderList.statuses.${transition.value}`)).join(' / ');
      statusSubmitError.value = `${t('exportOrderList.messages.transitionInvalid')}。${t('exportOrderList.modal.allowedNext', { targets: allowed || '—' })}`;
      return false;
    }
    if (targetStatus === 'cancelled') {
      const blockers = getCancelBlockers(row);
      if (blockers.length) {
        const reasons = blockers.map((blocker) => t(blocker === 'receivable' ? 'exportOrderList.modal.cancelBlockedReceivable' : 'exportOrderList.modal.cancelBlockedHighException')).join('；');
        statusSubmitError.value = `${t('exportOrderList.modal.cancelBlockedTitle')}：${reasons}`;
        return false;
      }
      Modal.confirm({
        title: t('exportOrderList.modal.cancelConfirmTitle'),
        content: t('exportOrderList.modal.cancelConfirmCopy', { orderNo: row.orderNo }),
        okText: t('exportOrderList.modal.cancelConfirmTitle'),
        okButtonProps: { status: 'danger', size: 'small' },
        cancelText: t('common.cancel'),
        onOk: () => applyStatusTransition([row], targetStatus, reason),
      });
      return true;
    }
    statusSubmitting.value = true;
    try {
      return await applyStatusTransition([row], targetStatus, reason);
    } finally {
      statusSubmitting.value = false;
    }
  }

  const eligible = rows.filter((row) => isLegalTransition(row, targetStatus)
    && (targetStatus !== 'cancelled' || getCancelBlockers(row).length === 0));
  const label = t('exportOrderList.actions.batchStatus');
  statusSubmitting.value = true;
  try {
    if (eligible.length < rows.length) {
      precheckAndRun(label, rows, eligible, () => t('exportOrderList.batch.reasons.noTransition'), () => applyStatusTransition(eligible, targetStatus, reason));
      return true;
    }
    return await applyStatusTransition(eligible, targetStatus, reason);
  } finally {
    statusSubmitting.value = false;
  }
};

const openAssignModal = (rows: ExportOrderRow[]) => {
  if (!rows.length) {
    Message.warning(t('exportOrderList.messages.selectOrders'));
    return;
  }
  assignTargetRows.value = rows;
  assignSubmitError.value = '';
  assignModalVisible.value = true;
};

const submitAssign = async ({ operator }: { operator: string }) => {
  const rows = [...assignTargetRows.value];
  if (!rows.length) return false;
  assignSubmitting.value = true;
  try {
    if (rows.length === 1) {
      const row = rows[0];
      return await runRowMutation(
        row,
        () => {
          row.operator = operator;
          addLog(row, 'assign');
        },
        t('exportOrderList.messages.assignSuccess', { count: 1, operator }),
        t('exportOrderList.messages.assignFail'),
      );
    }
    const eligible = rows.filter((row) => !isReadOnlyRow(row));
    const label = t('exportOrderList.actions.batchAssign');
    const execute = () => executeBatch(label, eligible, (row) => {
      row.operator = operator;
      addLog(row, 'assign');
    });
    if (eligible.length < rows.length) {
      precheckAndRun(label, rows, eligible, () => t('exportOrderList.batch.reasons.readonly'), execute);
      return true;
    }
    return await execute();
  } finally {
    assignSubmitting.value = false;
  }
};

const openExceptionModal = (rows: ExportOrderRow[]) => {
  const eligible = rows.filter((row) => row.orderStatus !== 'cancelled');
  if (!eligible.length) {
    Message.warning(t('exportOrderList.batch.reasons.voided'));
    return;
  }
  exceptionTargetRows.value = eligible;
  exceptionSubmitError.value = '';
  exceptionModalVisible.value = true;
};

const submitException = async (payload: ExceptionFormPayload) => {
  const rows = [...exceptionTargetRows.value];
  if (!rows.length) return false;
  exceptionSubmitting.value = true;
  try {
    const mutate = (row: ExportOrderRow) => {
      row.exceptionStatus = 'open';
      row.exceptionLevel = payload.level;
      addLog(row, 'exception');
    };
    if (rows.length === 1) {
      const row = rows[0];
      return await runRowMutation(
        row,
        () => mutate(row),
        t('exportOrderList.messages.exceptionSuccess', { orderNo: row.orderNo, level: t(`exportOrderList.exceptionLevels.${payload.level}`) }),
        t('exportOrderList.messages.exceptionFail', { orderNo: row.orderNo }),
      );
    }
    return await executeBatch(t('exportOrderList.actions.batchException'), rows, mutate);
  } finally {
    exceptionSubmitting.value = false;
  }
};

const handleGenerateRowFee = (row: ExportOrderRow) => runRowMutation(
  row,
  () => {
    row.feeStatus = 'pending';
    addLog(row, 'fee');
  },
  t('exportOrderList.messages.feeSuccess', { orderNo: row.orderNo }),
  t('exportOrderList.messages.feeFail', { orderNo: row.orderNo }),
);

const handleBatchFee = () => {
  const rows = [...selectedRows.value];
  if (!rows.length) {
    Message.warning(t('exportOrderList.messages.selectOrders'));
    return;
  }
  const label = t('exportOrderList.actions.batchFee');
  const eligible = rows.filter((row) => !isReadOnlyRow(row) && row.feeStatus === 'none');
  precheckAndRun(
    label,
    rows,
    eligible,
    (row) => (isReadOnlyRow(row) ? t('exportOrderList.batch.reasons.readonly') : t('exportOrderList.batch.reasons.feeExists')),
    () => executeBatch(label, eligible, (row) => {
      row.feeStatus = 'pending';
      addLog(row, 'fee');
    }),
  );
};

const handleRowNotify = (row: ExportOrderRow) => runRowMutation(
  row,
  () => addLog(row, 'notify'),
  t('exportOrderList.messages.notifySuccess', { orderNo: row.orderNo }),
  t('exportOrderList.messages.notifyFail', { orderNo: row.orderNo }),
);

const handleBatchNotify = () => {
  const rows = [...selectedRows.value];
  if (!rows.length) {
    Message.warning(t('exportOrderList.messages.selectOrders'));
    return;
  }
  void executeBatch(t('exportOrderList.actions.batchNotify'), rows, (row) => addLog(row, 'notify'));
};

const openUploadModal = (row: ExportOrderRow) => {
  uploadTargetRow.value = row;
  uploadFileName.value = '';
  uploadError.value = '';
  uploadModalVisible.value = true;
};

const onUploadFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  uploadFileName.value = input.files?.[0]?.name ?? '';
  uploadError.value = '';
};

const confirmUpload = async () => {
  const row = uploadTargetRow.value;
  if (!row) return false;
  uploadError.value = uploadFileName.value ? '' : t('exportOrderList.modal.uploadEmpty');
  if (uploadError.value) return false;
  uploadSubmitting.value = true;
  const changed = await runRowMutation(
    row,
    () => {
      if (row.fileStatus === 'missing') row.fileStatus = 'pending';
      addLog(row, 'file');
    },
    t('exportOrderList.messages.uploadSuccess', { orderNo: row.orderNo }),
    t('exportOrderList.messages.uploadFail', { orderNo: row.orderNo }),
  );
  uploadSubmitting.value = false;
  if (!changed) uploadError.value = t('exportOrderList.messages.uploadFail', { orderNo: row.orderNo });
  return changed;
};

const handleCopyOrder = (row: ExportOrderRow) => runRowMutation(
  row,
  () => {
    const seq = copySeq.value;
    copySeq.value += 1;
    const copy: ExportOrderRow = {
      ...row,
      id: `copy-${row.id}-${seq}`,
      orderNo: `${row.orderNo}-CP${seq}`,
      orderStatus: 'draft',
      blNo: '',
      bookingNo: '',
      vesselVoyage: '',
      etd: '',
      eta: '',
      closingTime: '',
      fileStatus: 'missing',
      feeStatus: 'none',
      exceptionStatus: 'normal',
      blConfirmed: false,
      hasConfirmedUnwrittenReceivable: false,
      riskFlags: ['fileRequired'],
      queueKeys: [],
      isOverdue: false,
      todayNew: true,
      createdAt: formatLocalMinute(),
      updatedAt: formatLocalMinute(),
      revision: 1,
      recentNodes: [],
      recentLogs: [],
      containerNos: [],
    };
    copy.queueKeys = deriveQueueKeys(copy);
    addLog(copy, 'create');
    const index = allRows.value.findIndex((item) => item.id === row.id);
    allRows.value.splice(index + 1, 0, copy);
  },
  t('exportOrderList.messages.copySuccess', { orderNo: `${row.orderNo}-CP${copySeq.value - 1}` }),
  t('exportOrderList.messages.copyFail', { orderNo: row.orderNo }),
);

const openVoidModal = (row: ExportOrderRow) => {
  voidTargetRow.value = row;
  voidCapturedRevision.value = row.revision;
  voidError.value = '';
  voidModalVisible.value = true;
};

const confirmVoid = async () => {
  const row = voidTargetRow.value;
  if (!row) return false;
  voidSubmitting.value = true;
  voidError.value = '';
  const changed = await runRowMutation(
    row,
    () => {
      row.orderStatus = 'cancelled';
      addLog(row, 'status', 'cancelled');
    },
    t('exportOrderList.messages.voidSuccess', { orderNo: row.orderNo }),
    t('exportOrderList.messages.voidFail', { orderNo: row.orderNo }),
    voidCapturedRevision.value,
  );
  voidSubmitting.value = false;
  if (!changed) voidError.value = t('exportOrderList.messages.voidError');
  return changed;
};

const runExport = async (scope: 'filtered' | 'selected') => {
  if (exporting.value) return;
  const rows = scope === 'selected' ? [...selectedRows.value] : [...sortedRows.value];
  if (!rows.length) {
    Message.warning(t('exportOrderList.messages.selectOrders'));
    return;
  }
  exporting.value = true;
  Message.info(t('exportOrderList.exportTask.running'));
  await waitForInteraction(600, 1600);
  if (uiScenario.value === 'error') {
    exporting.value = false;
    Message.error(t('exportOrderList.exportTask.fail'));
    return;
  }
  const exportFields = orderedColumnFields.value.filter((field) => visibleColumnFields.value.includes(field));
  const valueOf = (row: ExportOrderRow, field: ColumnSettingField): string => {
    if (field === 'orderStatus') return t(`exportOrderList.statuses.${row.orderStatus}`);
    if (field === 'fileStatus') return t(`exportOrderList.fileStatus.${row.fileStatus}`);
    if (field === 'feeStatus') return t(`exportOrderList.feeStatus.${row.feeStatus}`);
    if (field === 'exceptionStatus') return t(`exportOrderList.exceptionStatus.${row.exceptionStatus}`);
    if (field === 'riskFlags') return row.riskFlags.map((flag) => t(`exportOrderList.riskFlags.${flag}`)).join(' / ');
    return String(row[field] ?? '');
  };
  // 导出内容与列表一致：仅当前可见列；敏感字段（利润 / 应收应付明细）不在本列表数据模型中，权限场景整表已拦截。
  downloadCsvFile(
    t('exportOrderList.exportTask.file', { count: rows.length }),
    exportFields.map((field) => t(`exportOrderList.columns.${field}`)),
    rows.map((row) => exportFields.map((field) => valueOf(row, field))),
  );
  exporting.value = false;
  Message.success(t('exportOrderList.exportTask.success', { count: rows.length }));
};

const handleImportRows = async (rows: ImportParsedRow[]): Promise<ImportResult> => {
  importing.value = true;
  await waitForInteraction(420, 1500);
  const failures: { orderNo: string; reason: string }[] = [];
  const isFailure = (index: number) => uiScenario.value === 'error' || (uiScenario.value === 'partial' && index % 3 === 0);
  const importedRows: ExportOrderRow[] = [];
  rows.forEach((row, index) => {
    if (isFailure(index)) {
      failures.push({ orderNo: row.orderNo, reason: t('exportOrderList.importTask.reasons.permission', { value: row.customerName }) });
      return;
    }
    const created: ExportOrderRow = {
      id: `imp-${row.orderNo}`,
      orderNo: row.orderNo,
      customerName: row.customerName,
      businessType: (['FCL', 'LCL', 'AIR', 'RAIL'].includes(row.businessType) ? row.businessType : 'FCL') as ExportOrderRow['businessType'],
      orderStatus: 'draft',
      carrier: '',
      vesselVoyage: '',
      pol: row.pol,
      pod: row.pod,
      etd: row.etd,
      eta: '',
      closingTime: '',
      blNo: '',
      bookingNo: '',
      containerSummary: '',
      containerNos: [],
      operator: CURRENT_OPERATOR,
      fileStatus: 'pending',
      feeStatus: 'none',
      exceptionStatus: 'normal',
      exceptionLevel: 'low',
      blConfirmed: false,
      hasTruckingService: true,
      hasConfirmedUnwrittenReceivable: false,
      riskFlags: [],
      queueKeys: [],
      isOverdue: false,
      todayNew: true,
      createdAt: formatLocalMinute(),
      updatedAt: formatLocalMinute(),
      revision: 1,
      recentNodes: [],
      recentLogs: [],
    };
    created.queueKeys = deriveQueueKeys(created);
    addLog(created, 'create');
    importedRows.push(created);
  });
  allRows.value = [...importedRows.reverse(), ...allRows.value];
  importing.value = false;
  return { success: importedRows.length, failures };
};

const getRowActions = (row: ExportOrderRow): WorkbenchRowAction[] => {
  const pending = isRowPending(row);
  const readOnly = isReadOnlyRow(row);
  const actions: WorkbenchRowAction[] = [
    {
      key: 'quick-view',
      label: t('exportOrderList.actions.quickView'),
      icon: IconEye,
      disabled: pending,
      onClick: () => openQuickView(row),
    },
  ];
  if (getExportStatusTransitions(row).length > 0) {
    actions.push({
      key: 'update-status',
      label: t('exportOrderList.actions.updateStatus'),
      icon: IconEdit,
      disabled: pending,
      onClick: () => openStatusModal([row]),
    });
  }
  if (!readOnly) {
    actions.push({
      key: 'assign',
      label: t('exportOrderList.actions.assign'),
      icon: IconUserAdd,
      disabled: pending,
      onClick: () => openAssignModal([row]),
    });
  }
  if (row.orderStatus !== 'cancelled') {
    actions.push({
      key: 'mark-exception',
      label: t('exportOrderList.actions.markException'),
      icon: IconExclamationCircle,
      disabled: pending,
      onClick: () => openExceptionModal([row]),
    });
  }
  if (!readOnly && row.feeStatus === 'none') {
    actions.push({
      key: 'generate-fee',
      label: t('exportOrderList.actions.generateFee'),
      icon: IconPlusCircle,
      disabled: pending,
      onClick: () => handleGenerateRowFee(row),
    });
  }
  if (row.orderStatus !== 'cancelled') {
    actions.push({
      key: 'notify',
      label: t('exportOrderList.actions.notify'),
      icon: IconNotification,
      disabled: pending,
      onClick: () => handleRowNotify(row),
    });
  }
  if (!readOnly) {
    actions.push({
      key: 'upload-file',
      label: t('exportOrderList.actions.uploadFile'),
      icon: IconUpload,
      disabled: pending,
      onClick: () => openUploadModal(row),
    });
  }
  actions.push({
    key: 'copy',
    label: t('exportOrderList.actions.copy'),
    icon: IconCopy,
    disabled: pending,
    onClick: () => handleCopyOrder(row),
  });
  actions.push({
    key: 'view-log',
    label: t('exportOrderList.actions.viewLog'),
    icon: IconHistory,
    disabled: pending,
    onClick: () => openQuickView(row),
  });
  if (canVoidRow(row)) {
    actions.push({
      key: 'void-order',
      label: t('exportOrderList.actions.voidOrder'),
      icon: IconStop,
      disabled: pending,
      danger: true,
      onClick: () => openVoidModal(row),
    });
  }
  return actions;
};

const fetchList = async () => {
  if (uiScenario.value === 'permission') return;
  loadError.value = '';
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, uiScenario.value === 'slow' ? 1600 : 300));
  if (uiScenario.value === 'error' && !hasSimulatedError.value) {
    loadError.value = t('exportOrderList.messages.loadError');
    hasSimulatedError.value = true;
  }
  loading.value = false;
};

watch(uiScenario, () => {
  allRows.value = createOrderRows();
  batchFeedback.value = null;
  statusModalVisible.value = false;
  assignModalVisible.value = false;
  exceptionModalVisible.value = false;
  voidModalVisible.value = false;
  uploadModalVisible.value = false;
  importVisible.value = false;
  quickViewVisible.value = false;
  advancedFilterVisible.value = false;
  queryFieldSettingsVisible.value = false;
  schemeSaveVisible.value = false;
  schemeManagerVisible.value = false;
  pendingRowIds.value = [];
  querying.value = false;
  advancedApplying.value = false;
  exporting.value = false;
  batchSubmitting.value = false;
  statusSubmitting.value = false;
  assignSubmitting.value = false;
  exceptionSubmitting.value = false;
  voidSubmitting.value = false;
  uploadSubmitting.value = false;
  importing.value = false;
  hasSimulatedError.value = false;
  clearSelection();
  fetchList();
}, { immediate: true });

const labelStyle = compactVerticalFormLabelStyle;
const formGridGutter = denseFormGridGutter;
</script>

<template>
  <StandardListFrame page-id="ui-acceptance-export-order-list" data-pesdp-page="ui-acceptance-export-order-list">
    <template #query>
      <a-form :model="query" layout="vertical" size="small" :label-col-style="labelStyle">
        <QueryFieldGrid>
          <QueryFieldCol
            v-for="definition in pageQueryFieldDefinitions"
            :key="definition.field"
            :role="definition.width"
          >
            <OrderQueryFieldControl
              :field="definition.field"
              :model="query"
              :operator-options="operatorOptions"
              :carrier-options="carrierOptions"
              :port-options="portOptions"
              @submit="handleSearch"
            />
          </QueryFieldCol>
          <QueryFieldCol role="actions">
            <div class="query-actions">
              <a-tooltip :content="t('common.search')">
                <a-button size="small" type="primary" :loading="querying" :aria-label="t('common.search')" @click="handleSearch">
                  <template #icon><icon-search /></template>
                  <span class="query-actions__label">{{ t('common.search') }}</span>
                </a-button>
              </a-tooltip>
              <a-tooltip :content="t('common.reset')">
                <a-button size="small" type="text" :disabled="querying" :aria-label="t('common.reset')" @click="handleReset">
                  <template #icon><icon-undo /></template>
                  <span class="query-actions__label">{{ t('common.reset') }}</span>
                </a-button>
              </a-tooltip>
              <a-badge :count="advancedActiveCount" :offset="[-4, 4]">
                <a-tooltip :content="t('exportOrderList.actions.advanced')">
                  <a-button size="small" type="text" :aria-label="t('exportOrderList.actions.advanced')" @click="openAdvancedFilters">
                    <template #icon><icon-filter /></template>
                    <span class="query-actions__label">{{ t('common.filter') }}</span>
                  </a-button>
                </a-tooltip>
              </a-badge>
              <SavedQueryMenu
                :items="schemes"
                :label="t('exportOrderList.schemes.label')"
                :save-label="t('exportOrderList.actions.saveScheme')"
                :manage-label="t('exportOrderList.actions.manageSchemes')"
                :empty-label="t('exportOrderList.schemes.emptyShort')"
                :default-label="t('exportOrderList.schemes.defaultTag')"
                :disabled="querying"
                @select="onSchemeChange"
                @save="openSchemeSave(queryDraftDirty ? 'draft' : 'applied')"
                @manage="schemeManagerVisible = true"
              />
              <a-tooltip :content="t('shipment.querySettings.title')">
                <a-button
                  size="small"
                  type="text"
                  :aria-label="t('shipment.querySettings.title')"
                  @click="openQueryFieldSettings"
                >
                  <template #icon><icon-settings /></template>
                </a-button>
              </a-tooltip>
            </div>
          </QueryFieldCol>
        </QueryFieldGrid>
      </a-form>
    </template>

    <template #workflow>
      <div class="workflow-filter-bar__scope" data-workbench-scope="ownership">
        <a-radio-group
          v-model="activeWorkScope"
          :aria-label="t('exportOrderList.scope.label')"
          type="button"
          size="small"
          @change="onWorkScopeChange"
        >
          <a-radio value="mine">{{ t('exportOrderList.scope.mine') }}</a-radio>
          <a-radio value="all">{{ t('exportOrderList.scope.all') }}</a-radio>
        </a-radio-group>
      </div>

      <WorkflowStateSelector
        class="workflow-filter-bar__state"
        :model-value="activeQueue"
        :label="t('exportOrderList.queueLabel')"
        :show-label="false"
        :options="workflowStateOptions"
        @change="onQueueChange"
      />
    </template>

    <template #toolbar>
      <WorkbenchTableToolbar
        :current="page.current"
        :page-size="page.size"
        :total="tableTotal"
        :page-size-options="[20, 50, 100, 200]"
        @change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #commands>
          <div class="table-cap-start">
            <div v-if="canOperate" class="table-command-group">
              <a-button size="small" :disabled="importing" @click="importVisible = true">
                <template #icon><icon-upload /></template>
                {{ t('exportOrderList.actions.importOrders') }}
              </a-button>
              <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
                <a-button size="small" :loading="exporting">
                  <template #icon><icon-download /></template>
                  {{ t('exportOrderList.actions.exportOrders') }}<icon-down />
                </a-button>
                <template #content>
                  <a-doption @click="runExport('filtered')">{{ t('exportOrderList.actions.exportFiltered') }}</a-doption>
                  <a-doption :disabled="!selectedCount" @click="runExport('selected')">{{ t('exportOrderList.actions.exportSelected') }}</a-doption>
                </template>
              </a-dropdown>
              <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
                <a-button size="small" :disabled="!selectedCount" :loading="batchSubmitting">
                  {{ t('exportOrderList.actions.batch') }}<icon-down />
                </a-button>
                <template #content>
                  <a-doption @click="openAssignModal(selectedRows)">{{ t('exportOrderList.actions.batchAssign') }}</a-doption>
                  <a-doption @click="openStatusModal(selectedRows)">{{ t('exportOrderList.actions.batchStatus') }}</a-doption>
                  <a-doption :disabled="!selectedCount" @click="runExport('selected')">{{ t('exportOrderList.actions.batchExport') }}</a-doption>
                  <a-doption @click="handleBatchFee">{{ t('exportOrderList.actions.batchFee') }}</a-doption>
                  <a-doption @click="handleBatchNotify">{{ t('exportOrderList.actions.batchNotify') }}</a-doption>
                  <a-doption @click="openExceptionModal(selectedRows)">{{ t('exportOrderList.actions.batchException') }}</a-doption>
                  <a-doption @click="clearSelection">{{ t('common.clear') }}</a-doption>
                </template>
              </a-dropdown>
            </div>
            <div v-if="selectedCount > 0" class="selection-context">
              <span class="selection-tip">{{ t('common.selected', { count: selectedCount }) }}</span>
              <a-button size="small" type="text" @click="clearSelection">{{ t('common.clear') }}</a-button>
            </div>
          </div>
        </template>
        <template #utilities>
          <a-tooltip :content="t('common.refresh')">
            <a-button size="small" type="text" class="table-cap-tool" :aria-label="t('common.refresh')" :loading="loading || forcedLoading" @click="fetchList">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <WorkbenchColumnSettings
            :model-value="visibleColumnFields"
            :order-value="orderedColumnFields"
            :default-value="DEFAULT_VISIBLE_COLUMN_FIELDS"
            :options="localizedColumnSettingOptions"
            :minimum="8"
            :on-before-apply="applyColumnSettings"
          />
        </template>
      </WorkbenchTableToolbar>
    </template>

    <template #feedback>
      <a-alert
        v-if="batchFeedback"
        type="warning"
        closable
        class="batch-result-alert"
        @close="batchFeedback = null"
      >
        {{ t('exportOrderList.messages.batchAlert', { action: batchFeedback.label, success: batchFeedback.success, failed: batchFeedback.failures.length }) }}
        <a-button size="mini" type="text" class="batch-result-alert__download" @click="downloadBatchFailures">
          {{ t('exportOrderList.batch.downloadFailures') }}
        </a-button>
      </a-alert>
    </template>

    <template #table>
      <vxe-table
        ref="tableRef"
        id="ua-export-order-list"
        height="100%"
        auto-resize
        fit
        show-overflow="title"
        :loading="loading || querying || forcedLoading"
        :data="pagedRows"
        :seq-config="{ startIndex: (page.current - 1) * page.size }"
        :column-config="{ resizable: true }"
        :custom-config="{ storage: true }"
        :row-config="stableTableRowConfig"
        :checkbox-config="{ highlight: true }"
        @checkbox-change="onSelectionChange"
        @checkbox-all="onSelectionChange"
        @sort-change="onSortChange"
      >
        <vxe-column type="checkbox" width="44" fixed="left" />
        <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />

        <vxe-column field="orderNo" :title="t('exportOrderList.columns.orderNo')" min-width="168" fixed="left" :visible="isColumnVisible('orderNo')">
          <template #default="{ row }">
            <span class="tabular">{{ row.orderNo }}</span>
          </template>
        </vxe-column>

        <vxe-column field="orderStatus" :title="t('exportOrderList.columns.orderStatus')" min-width="132" :visible="isColumnVisible('orderStatus')">
          <template #default="{ row }: { row: ExportOrderRow }">
            <span class="s-pill" :data-s="EXPORT_STATUS_TONES[row.orderStatus]">{{ t(`exportOrderList.statuses.${row.orderStatus}`) }}</span>
          </template>
        </vxe-column>

        <vxe-column field="customerName" :title="t('exportOrderList.columns.customerName')" min-width="200" :visible="isColumnVisible('customerName')" />
        <vxe-column field="businessType" :title="t('exportOrderList.columns.businessType')" min-width="96" :visible="isColumnVisible('businessType')" />

        <vxe-column field="riskFlags" :title="t('exportOrderList.columns.riskFlags')" min-width="210" :visible="isColumnVisible('riskFlags')">
          <template #default="{ row }: { row: ExportOrderRow }">
            <template v-if="row.riskFlags.length">
              <span v-for="flag in row.riskFlags.slice(0, 2)" :key="flag" class="s-pill risk-pill" data-s="partial">{{ t(`exportOrderList.riskFlags.${flag}`) }}</span>
              <a-tooltip v-if="row.riskFlags.length > 2" :content="row.riskFlags.map((flag) => t(`exportOrderList.riskFlags.${flag}`)).join(' / ')">
                <span class="risk-pill-more">+{{ row.riskFlags.length - 2 }}</span>
              </a-tooltip>
            </template>
            <span v-else>—</span>
          </template>
        </vxe-column>

        <vxe-column field="vesselVoyage" :title="t('exportOrderList.columns.vesselVoyage')" min-width="210" :visible="isColumnVisible('vesselVoyage')" />
        <vxe-column field="pol" :title="t('exportOrderList.columns.pol')" min-width="96" class-name="tabular" :visible="isColumnVisible('pol')" />
        <vxe-column field="pod" :title="t('exportOrderList.columns.pod')" min-width="96" class-name="tabular" :visible="isColumnVisible('pod')" />
        <vxe-column field="etd" :title="t('exportOrderList.columns.etd')" min-width="104" class-name="tabular" sortable :visible="isColumnVisible('etd')" />
        <vxe-column field="eta" :title="t('exportOrderList.columns.eta')" min-width="104" class-name="tabular" sortable :visible="isColumnVisible('eta')" />
        <vxe-column field="closingTime" :title="t('exportOrderList.columns.closingTime')" min-width="140" class-name="tabular" sortable :visible="isColumnVisible('closingTime')" />
        <vxe-column field="blNo" :title="t('exportOrderList.columns.blNo')" min-width="160" class-name="tabular" :visible="isColumnVisible('blNo')" />
        <vxe-column field="bookingNo" :title="t('exportOrderList.columns.bookingNo')" min-width="150" class-name="tabular" :visible="isColumnVisible('bookingNo')" />
        <vxe-column field="containerSummary" :title="t('exportOrderList.columns.containerSummary')" min-width="130" :visible="isColumnVisible('containerSummary')" />
        <vxe-column field="operator" :title="t('exportOrderList.columns.operator')" min-width="104" :visible="isColumnVisible('operator')" />

        <vxe-column field="fileStatus" :title="t('exportOrderList.columns.fileStatus')" min-width="104" :visible="isColumnVisible('fileStatus')">
          <template #default="{ row }">
            <span class="s-pill" :data-s="row.fileStatus === 'missing' ? 'rej' : row.fileStatus === 'pending' ? 'wait' : 'acc'">{{ t(`exportOrderList.fileStatus.${row.fileStatus}`) }}</span>
          </template>
        </vxe-column>

        <vxe-column field="feeStatus" :title="t('exportOrderList.columns.feeStatus')" min-width="100" :visible="isColumnVisible('feeStatus')">
          <template #default="{ row }">
            <span class="s-pill" :data-s="row.feeStatus === 'confirmed' ? 'rel' : row.feeStatus === 'pending' ? 'wait' : 'draft'">{{ t(`exportOrderList.feeStatus.${row.feeStatus}`) }}</span>
          </template>
        </vxe-column>

        <vxe-column field="exceptionStatus" :title="t('exportOrderList.columns.exceptionStatus')" min-width="108" :visible="isColumnVisible('exceptionStatus')">
          <template #default="{ row }">
            <span class="s-pill" :data-s="row.exceptionStatus === 'open' ? 'rej' : row.exceptionStatus === 'resolved' ? 'rel' : 'acc'">{{ t(`exportOrderList.exceptionStatus.${row.exceptionStatus}`) }}</span>
          </template>
        </vxe-column>

        <vxe-column field="createdAt" :title="t('exportOrderList.columns.createdAt')" min-width="140" class-name="tabular" sortable :visible="isColumnVisible('createdAt')" />
        <vxe-column field="updatedAt" :title="t('exportOrderList.columns.updatedAt')" min-width="140" class-name="tabular" sortable :visible="isColumnVisible('updatedAt')" />

        <vxe-column :title="t('common.operations')" :width="ROW_ACTION_COLUMN_WIDTH" fixed="right" align="left" header-align="center">
          <template #default="{ row }">
            <WorkbenchRowActions :actions="getRowActions(row)" :more-label="t('common.moreActions')" />
          </template>
        </vxe-column>

        <template #empty>
          <WorkbenchEmptyState
            :kind="uiScenario === 'permission' ? 'permission' : tableError ? 'error' : 'empty'"
            :title="uiScenario === 'permission'
              ? t('exportOrderList.empty.permissionTitle')
              : tableError
                ? t('exportOrderList.empty.errorTitle')
                : hasActiveFilter ? t('exportOrderList.empty.filteredTitle') : t('exportOrderList.empty.defaultTitle')"
            :description="uiScenario === 'permission'
              ? t('exportOrderList.empty.permissionDesc')
              : tableError
                ? tableError
                : hasActiveFilter ? t('exportOrderList.empty.filteredDesc') : t('exportOrderList.empty.defaultDesc')"
          >
            <template #actions>
              <a-button v-if="tableError" size="small" type="primary" @click="fetchList">{{ t('exportOrderList.actions.reload') }}</a-button>
              <a-button v-else-if="hasActiveFilter && uiScenario !== 'permission'" size="small" type="text" @click="handleReset">{{ t('exportOrderList.actions.resetFilter') }}</a-button>
              <a-button v-else-if="uiScenario !== 'permission'" size="small" @click="importVisible = true">
                <template #icon><icon-upload /></template>
                {{ t('exportOrderList.actions.importOrders') }}
              </a-button>
            </template>
          </WorkbenchEmptyState>
        </template>
      </vxe-table>
    </template>
  </StandardListFrame>

  <a-drawer
    v-model:visible="advancedFilterVisible"
    data-ui-surface="advanced-filter"
    width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
    :mask-closable="false"
    :closable="!advancedApplying"
    :esc-to-close="false"
    @cancel="cancelAdvancedFilters"
  >
    <template #title>
      <div class="advanced-filter-title">
        <span>{{ t('exportOrderList.advanced.title') }}</span>
        <span class="advanced-filter-title__hint">{{ t('exportOrderList.advanced.allFields') }}</span>
        <span v-if="advancedDraftCount" class="advanced-filter-title__count">{{ t('exportOrderList.advanced.selected', { count: advancedDraftCount }) }}</span>
        <a-badge v-if="advancedDraftDirty" class="advanced-filter-title__dirty" status="processing" :text="t('exportOrderList.advanced.pending')" />
      </div>
    </template>
    <a-form class="advanced-filter-form" layout="vertical" size="small" :label-col-style="labelStyle" :model="advancedQuery">
      <section v-for="groupEntry in drawerFieldGroups" :key="groupEntry.group" class="advanced-filter-section" :aria-labelledby="`ua-filter-group-${groupEntry.group}`">
        <div class="advanced-filter-section__head">
          <a-space :size="6">
            <h3 :id="`ua-filter-group-${groupEntry.group}`" class="advanced-filter-section__title">{{ t(`exportOrderList.advanced.groups.${groupEntry.group}`) }}</h3>
            <span v-if="advancedDraftGroupCounts[groupEntry.group]" class="advanced-filter-section__count">
              {{ t('exportOrderList.advanced.selected', { count: advancedDraftGroupCounts[groupEntry.group] }) }}
            </span>
          </a-space>
          <a-button
            v-if="advancedDraftGroupCounts[groupEntry.group]"
            size="small"
            type="text"
            :title="t('exportOrderList.advanced.clearGroup')"
            @click="clearAdvancedGroup(groupEntry.group)"
          >{{ t('exportOrderList.advanced.clearGroup') }}</a-button>
        </div>
        <a-row :gutter="formGridGutter">
          <a-col v-for="definition in groupEntry.fields" :key="definition.field" :span="12" :xs="24" :sm="12">
            <OrderQueryFieldControl
              :field="definition.field"
              :model="advancedQuery"
              :operator-options="operatorOptions"
              :carrier-options="carrierOptions"
              :port-options="portOptions"
              dense
              @submit="applyAdvancedFilters"
              @date-popup-change="updateAdvancedDatePopup"
            />
          </a-col>
        </a-row>
      </section>
    </a-form>
    <template #footer>
      <div class="advanced-filter-footer">
        <a-space :size="8">
          <span class="advanced-filter-preview">
            {{ t('exportOrderList.advanced.matchCount', { count: advancedPreviewCount }) }}
          </span>
          <a-button size="small" type="text" :disabled="!advancedDraftCount || advancedApplying" @click="clearAdvancedFilters">{{ t('common.clearAdvanced') }}</a-button>
        </a-space>
        <a-space class="advanced-filter-footer__actions" :size="8">
          <a-button size="small" :disabled="advancedApplying" @click="cancelAdvancedFilters">{{ t('common.cancel') }}</a-button>
          <a-button size="small" type="primary" :loading="advancedApplying" @click="applyAdvancedFilters">
            {{ t('common.apply') }}
          </a-button>
        </a-space>
      </div>
    </template>
  </a-drawer>

  <QueryFieldSettingsDrawer
    v-model:visible="queryFieldSettingsVisible"
    :options="localizedQueryFieldOptions"
    :model-value="queryFieldPlacement"
    :default-value="DEFAULT_QUERY_FIELD_PLACEMENT"
    :capacity-units="QUERY_PAGE_CAPACITY_UNITS"
    :minimum-units="6"
    :action-units="2"
    :max-rows="2"
    :on-before-apply="applyQueryFieldPlacement"
  />

  <QuickViewDrawer v-model:visible="quickViewVisible" :row="quickViewRow" />

  <StatusTransitionModal
    v-model:visible="statusModalVisible"
    :rows="statusTargetRows"
    :submitting="statusSubmitting || batchSubmitting"
    :submit-error="statusSubmitError"
    :on-submit="submitStatusTransition"
  />

  <AssignModal
    v-model:visible="assignModalVisible"
    :count="assignTargetRows.length"
    :operator-options="operatorOptions"
    :submitting="assignSubmitting || batchSubmitting"
    :submit-error="assignSubmitError"
    :on-submit="submitAssign"
  />

  <ExceptionModal
    v-model:visible="exceptionModalVisible"
    :count="exceptionTargetRows.length"
    :operator-options="operatorOptions"
    :submitting="exceptionSubmitting || batchSubmitting"
    :submit-error="exceptionSubmitError"
    :on-submit="submitException"
  />

  <ImportModal
    v-model:visible="importVisible"
    :existing-order-nos="allRows.map((row) => row.orderNo)"
    :known-customers="EXPORT_ORDER_CUSTOMERS"
    :known-ports="EXPORT_ORDER_PORTS.map((port) => port.code)"
    :restricted-customers="[EXPORT_ORDER_CUSTOMERS[6]]"
    :importing="importing"
    :on-import="handleImportRows"
  />

  <SchemeManagerDrawer
    v-model:visible="schemeManagerVisible"
    :schemes="schemes"
    @rename="onSchemeRename"
    @remove="onSchemeRemove"
    @set-default="onSchemeSetDefault"
    @reorder="onSchemeReorder"
  />

  <a-modal
    v-model:visible="schemeSwitchVisible"
    :title="t('exportOrderList.schemes.switchTitle')"
    :width="440"
    :mask-closable="false"
    :footer="false"
  >
    <p class="modal-confirm-copy">{{ t('exportOrderList.schemes.switchCopy') }}</p>
    <div class="scheme-switch-actions">
      <a-button size="small" @click="cancelSchemeSwitch">{{ t('common.cancel') }}</a-button>
      <a-button size="small" @click="discardDraftAndApplyScheme">{{ t('exportOrderList.schemes.discardAndApply') }}</a-button>
      <a-button size="small" type="primary" @click="saveDraftAndApplyScheme">{{ t('exportOrderList.schemes.saveAndApply') }}</a-button>
    </div>
  </a-modal>

  <a-modal
    v-model:visible="schemeSaveVisible"
    :title="t('exportOrderList.schemes.saveTitle')"
    :width="420"
    :mask-closable="false"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="confirmSchemeSave"
  >
    <a-form :model="schemeSaveForm" layout="vertical" size="small" :label-col-style="labelStyle" class="detail-form">
      <a-form-item
        :label="t('exportOrderList.schemes.nameLabel')"
        required
        :validate-status="schemeSaveError ? 'error' : undefined"
        :help="schemeSaveError"
      >
        <a-input
          v-model="schemeSaveForm.name"
          size="small"
          allow-clear
          :placeholder="t('exportOrderList.schemes.namePlaceholder')"
          @input="schemeSaveError = ''"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="uploadModalVisible"
    :title="t('exportOrderList.modal.uploadTitle')"
    :width="480"
    :mask-closable="false"
    :ok-loading="uploadSubmitting"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="confirmUpload"
  >
    <a-alert type="info" class="modal-context-alert">
      {{ t('exportOrderList.modal.uploadCopy', { orderNo: uploadTargetRow?.orderNo ?? '' }) }}
    </a-alert>
    <div class="upload-field">
      <a-button size="small" type="outline" @click="uploadInputRef?.click()">
        <template #icon><icon-upload /></template>
        {{ t('exportOrderList.modal.uploadPick') }}
      </a-button>
      <input
        ref="uploadInputRef"
        type="file"
        class="upload-field__picker"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        @change="onUploadFileChange"
      />
      <span v-if="uploadFileName" class="upload-field__name">{{ uploadFileName }}</span>
      <div class="upload-field__hint">{{ t('exportOrderList.modal.uploadHint') }}</div>
      <div v-if="uploadError" class="upload-field__error">{{ uploadError }}</div>
    </div>
  </a-modal>

  <a-modal
    v-model:visible="voidModalVisible"
    :title="t('exportOrderList.modal.voidTitle')"
    :width="420"
    :mask-closable="false"
    :ok-text="t('exportOrderList.modal.voidOk')"
    :ok-loading="voidSubmitting"
    :ok-button-props="{ status: 'danger', size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="confirmVoid"
  >
    <p class="modal-confirm-copy">{{ t('exportOrderList.modal.voidCopy', { orderNo: voidTargetRow?.orderNo }) }}</p>
    <a-alert v-if="voidError" type="error">{{ voidError }}</a-alert>
  </a-modal>
</template>

<style scoped>
.workflow-filter-bar__scope {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.workflow-filter-bar__divider {
  flex: 0 0 auto;
  height: 24px;
  margin: 0;
}

.workflow-filter-bar__scope :deep(.arco-radio-group-button) {
  white-space: nowrap;
}

.batch-result-alert__download {
  margin-left: 8px;
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

.advanced-filter-preview {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  color: var(--color-text-2);
  font-size: var(--dense-font-control);
  white-space: nowrap;
}

.advanced-filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.advanced-filter-title__count,
.advanced-filter-section__count {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  font-weight: 400;
  white-space: nowrap;
}

.advanced-filter-title__hint {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  font-weight: 400;
  white-space: nowrap;
}

.advanced-filter-title__dirty {
  margin-left: 2px;
}

.advanced-filter-form {
  width: 100%;
  min-width: 0;
}

.advanced-filter-section + .advanced-filter-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.advanced-filter-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 8px;
}

.advanced-filter-section__title {
  margin: 0;
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.risk-pill {
  margin-right: 4px;
}

.risk-pill-more {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.modal-context-alert {
  margin-bottom: 16px;
}

.modal-confirm-copy {
  margin: 0 0 12px;
  color: var(--color-text-2);
  line-height: 20px;
}

.scheme-switch-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.upload-field {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-field__picker {
  display: none;
}

.upload-field__input {
  display: none;
}

.upload-field__name {
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
}

.upload-field__hint {
  width: 100%;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.upload-field__error {
  width: 100%;
  color: var(--dense-danger-6);
  font-size: var(--dense-font-aux);
}

@media (max-width: 1199px) {
  .workflow-filter-bar__scope {
    gap: 4px;
  }

  .selection-context {
    display: none;
  }
}
</style>
