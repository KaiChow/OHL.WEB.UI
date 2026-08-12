<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconPlus,
  IconDownload,
  IconDown,
  IconEdit,
  IconNotification,
  IconPlusCircle,
  IconStop,
  IconUserAdd,
  IconFullscreen,
  IconFullscreenExit,
  IconSettings,
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
import StandardListFrame from '@/components/workbench/StandardListFrame.vue';
import WorkbenchColumnSettings from '@/components/workbench/WorkbenchColumnSettings.vue';
import WorkbenchEmptyState from '@/components/workbench/WorkbenchEmptyState.vue';
import WorkbenchRowActions from '@/components/workbench/WorkbenchRowActions.vue';
import WorkbenchTableToolbar from '@/components/workbench/WorkbenchTableToolbar.vue';
import WorkflowStateSelector from '@/components/workbench/WorkflowStateSelector.vue';
import { shipmentWorkbenchRows } from '@/views/shipment/orderWorkbench/mockData';
import ShipmentQueryFieldControl from '@/views/shipment/orderWorkbench/ShipmentQueryFieldControl.vue';
import {
  clearQueryFields,
  DEFAULT_QUERY_FIELD_PLACEMENT,
  isQueryFieldActive,
  QUERY_FIELD_GROUPS,
  queryFieldSnapshot,
  SHIPMENT_QUERY_FIELDS,
} from '@/views/shipment/orderWorkbench/queryFields';
import type {
  ShipmentQueryField,
  ShipmentQueryFieldGroup,
} from '@/views/shipment/orderWorkbench/queryFields';
import type {
  ShipmentOrderQuery,
  ShipmentStatusKey,
  ShipmentWorkbenchRow,
  WorkflowStateStat,
} from '@/views/shipment/orderWorkbench/types';
import type { ShipmentStatusTransition } from '@/views/shipment/featureContracts';
import { getOrderStatusTransitions, resolveShipmentUiScenario } from '@/views/shipment/featureContracts';

const route = useRoute();
const { t } = useI18n();

const CURRENT_OPERATOR = '张操作';
const COLUMN_SETTING_STORAGE_KEY = 'ohl.shipment.export-order.visible-columns.v3';
const QUERY_FIELD_SETTING_STORAGE_KEY = 'ohl.shipment.export-order.query-fields.v1';
const QUERY_FIELD_SETTING_VERSION = 1;
const QUERY_PAGE_CAPACITY_UNITS = 10;
const ORDER_STATUS_COLUMN_MIN_WIDTH = 148;

type WorkScope = 'all' | 'mine' | 'others';

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
const localizedColumnSettingOptions = computed(() => COLUMN_SETTING_OPTIONS.map((option) => ({
  field: option.field,
  label: t(`shipment.columns.${option.field}`),
  required: option.required,
  orderLocked: option.field === 'orderNo' || option.field === 'orderStatus',
})));
const REQUIRED_COLUMN_FIELDS = COLUMN_SETTING_OPTIONS.filter((option) => option.required).map((option) => option.field);
const DEFAULT_COLUMN_ORDER_FIELDS = COLUMN_SETTING_OPTIONS.map((option) => option.field);
// PRD 4.7 默认 18 列全集受 check-spec「默认可见业务列 8-12」上限约束（风险标记列固定可见占 1 席），
// 因此默认集取 PRD 点名的 7 个字段 + 订单号/订单状态/客户/操作人员，其余字段经列设置开启。
const DEFAULT_VISIBLE_COLUMN_FIELDS: ColumnSettingField[] = [
  'orderNo',
  'orderStatus',
  'customerName',
  'businessType',
  'operator',
  'vesselVoyage',
  'eta',
  'closingTime',
  'bookingNo',
  'blNo',
  'containerSummary',
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

const WORKFLOW_STATE_OPTIONS: { key: ShipmentStatusKey; tone?: 'danger' | 'warn' }[] = [
  { key: 'all' },
  { key: 'waitBooking' },
  { key: 'waitRelease' },
  { key: 'waitTruck' },
  { key: 'waitCustoms' },
  { key: 'waitLoading' },
  { key: 'sailed' },
  { key: 'waitSi' },
  { key: 'waitBlConfirm' },
  { key: 'fileMissing', tone: 'warn' },
  { key: 'feeUnconfirmed', tone: 'warn' },
  { key: 'exception', tone: 'danger' },
];

const defaultQuery = (): ShipmentOrderQuery => ({
  keywordType: 'orderNo',
  keyword: [],
  customerName: '',
  pol: '',
  pod: '',
  carrier: undefined,
  vesselVoyage: '',
  blNo: '',
  bookingNo: '',
  orderStatus: undefined,
  operator: undefined,
  businessType: '',
  etdRange: [],
  closingRange: [],
  hasException: '',
  fileStatus: undefined,
  feeStatus: undefined,
  updatedRange: [],
  isOverdue: '',
});

const cloneQuery = (source: ShipmentOrderQuery): ShipmentOrderQuery => ({
  ...source,
  keyword: [...source.keyword],
  etdRange: [...source.etdRange],
  closingRange: [...source.closingRange],
  updatedRange: [...source.updatedRange],
});

const queryFieldPreferenceOptions = SHIPMENT_QUERY_FIELDS.map((definition) => ({
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

const createWorkbenchRows = () => shipmentWorkbenchRows.map((row) => ({
  ...row,
  riskFlags: [...row.riskFlags],
  quickStatus: [...row.quickStatus],
}));

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const advancedQuery = reactive<ShipmentOrderQuery>(defaultQuery());
const uiScenario = computed(() => resolveShipmentUiScenario(route.query.uiState));
const appliedQuery = ref<ShipmentOrderQuery>(cloneQuery(defaultQuery()));
const activeWorkflowState = ref<ShipmentStatusKey>('all');
const activeWorkScope = ref<WorkScope>('all');
const advancedFilterVisible = ref(false);
const queryFieldSettingsVisible = ref(false);
const queryFieldPlacement = ref<QueryFieldPlacement>(loadQueryFieldPlacement());
const advancedApplying = ref(false);
const advancedDatePopupVisible = reactive({ etd: false, closing: false, updated: false });
const loading = ref(false);
const querying = ref(false);
const creating = ref(false);
const loadError = ref('');
const hasSimulatedError = ref(false);
const batchSubmitting = ref(false);
const activeBatchKeys = new Set<string>();
const batchFeedback = ref<{
  label: string;
  success: number;
  failedOrderNos: string[];
} | null>(null);
const batchAssignVisible = ref(false);
const batchAssignForm = reactive({ operator: CURRENT_OPERATOR });
const batchAssignError = ref('');
const pendingRowIds = ref<string[]>([]);
const tableRef = ref<VxeTableInstance>();
const visibleColumnFields = ref<ColumnSettingField[]>(initialColumnPreferences.visibleFields);
const orderedColumnFields = ref<ColumnSettingField[]>(initialColumnPreferences.orderedFields);
const selectedRows = ref<ShipmentWorkbenchRow[]>([]);
const allRows = ref<ShipmentWorkbenchRow[]>(createWorkbenchRows());
const statusModalVisible = ref(false);
const statusForm = reactive({ targetStatus: undefined as string | undefined, reason: '', notify: true, createNode: true });
const statusErrors = reactive({ targetStatus: '', reason: '' });
const statusTargetRows = ref<ShipmentWorkbenchRow[]>([]);
const statusSubmitting = ref(false);
const exportScopeModalVisible = ref(false);
const exportScope = ref<'selected' | 'filtered'>('selected');
const tableFullscreen = ref(false);
const voidTargetRow = ref<ShipmentWorkbenchRow | null>(null);
const voidModalVisible = ref(false);
const voidSubmitting = ref(false);
const voidError = ref('');

const page = reactive({ current: 1, size: 50 });

const operatorOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.operator)));
const carrierOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.carrier)));
const queryFieldDefinitionByKey = new Map(SHIPMENT_QUERY_FIELDS.map((definition) => [definition.field, definition]));
const localizedQueryFieldOptions = computed(() => SHIPMENT_QUERY_FIELDS.map((definition) => ({
  field: definition.field,
  label: t(definition.labelKey),
  width: definition.width,
  requiredPage: definition.requiredPage,
  orderLocked: definition.orderLocked,
})));
const pageQueryFieldDefinitions = computed(() => queryFieldPlacement.value.pageFields
  .map((field) => queryFieldDefinitionByKey.get(field as ShipmentQueryField))
  .filter((definition): definition is (typeof SHIPMENT_QUERY_FIELDS)[number] => Boolean(definition)));
const allQueryFields = computed(() => [
  ...SHIPMENT_QUERY_FIELDS.map((definition) => definition.field),
] as ShipmentQueryField[]);
const drawerFieldGroups = computed(() => QUERY_FIELD_GROUPS.map((group) => ({
  group,
  fields: allQueryFields.value
    .map((field) => queryFieldDefinitionByKey.get(field))
    .filter((definition): definition is (typeof SHIPMENT_QUERY_FIELDS)[number] => definition?.group === group),
})).filter((item) => item.fields.length));
const drawerFieldsForGroup = (group: ShipmentQueryFieldGroup) => drawerFieldGroups.value
  .find((item) => item.group === group)?.fields ?? [];
const canOperate = computed(() => uiScenario.value !== 'permission');
const forcedLoading = computed(() => uiScenario.value === 'loading');
const tableError = computed(() => loadError.value);
const statusTransitionOptions = computed(() => {
  const rows = statusTargetRows.value;
  if (rows.length <= 1) return getOrderStatusTransitions(rows[0]?.orderStatus ?? '');
  // 批量修改状态：目标集合取所选行合法流转的并集，提交时逐行校验（不符合项经预检跳过）。
  const merged = new Map<string, ShipmentStatusTransition>();
  rows.forEach((row) => {
    getOrderStatusTransitions(row.orderStatus).forEach((transition) => {
      if (!merged.has(transition.value)) merged.set(transition.value, transition);
    });
  });
  return Array.from(merged.values());
});
const isColumnVisible = (field: ColumnSettingField) => visibleColumnFields.value.includes(field);

const matchText = (value: string, keyword: string) =>
  !keyword.trim() || value.toLowerCase().includes(keyword.trim().toLowerCase());

const matchKeyword = (row: ShipmentWorkbenchRow, q: ShipmentOrderQuery) => {
  if (!q.keyword.length) return true;
  const documentValue = q.keywordType === 'blNo'
    ? row.blNo
    : q.keywordType === 'bookingNo'
      ? row.bookingNo
      : row.orderNo;

  return q.keyword.some((keyword) => matchText(documentValue, keyword));
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
  if (uiScenario.value === 'locked') {
    // locked 场景：mock 注入「财务已锁定」行，费用相关入口禁用并说明原因。
    return index < 3 ? { ...row, financeLocked: true } : row;
  }
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

const rowMatchesQuery = (row: ShipmentWorkbenchRow, q: ShipmentOrderQuery, workScope: WorkScope) => {
  if (workScope === 'mine' && row.operator !== CURRENT_OPERATOR) return false;
  if (workScope === 'others' && row.operator === CURRENT_OPERATOR) return false;
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
};

const queryBaseRows = computed(() => scenarioRows.value
  .filter((row) => rowMatchesQuery(row, appliedQuery.value, activeWorkScope.value)));

const filteredRows = computed(() =>
  queryBaseRows.value.filter((row) => activeWorkflowState.value === 'all' || row.quickStatus.includes(activeWorkflowState.value)),
);

const advancedPreviewCount = computed(() => {
  if (['empty', 'permission'].includes(uiScenario.value)) return 0;
  return scenarioRows.value.filter((row) => (
    rowMatchesQuery(row, advancedQuery, activeWorkScope.value)
    && (activeWorkflowState.value === 'all' || row.quickStatus.includes(activeWorkflowState.value))
  )).length;
});

const pagedRows = computed(() => {
  if (['empty', 'permission'].includes(uiScenario.value) || tableError.value) return [];
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const workflowStateOptions = computed<WorkflowStateStat[]>(() =>
  WORKFLOW_STATE_OPTIONS.map((state) => {
    const rows = state.key === 'all'
      ? queryBaseRows.value
      : queryBaseRows.value.filter((row) => row.quickStatus.includes(state.key));

    return {
      key: state.key,
      label: t(`shipment.queues.${state.key}`),
      count: rows.length,
      todayNew: rows.filter((row) => row.todayNew).length,
      overdue: rows.filter((row) => row.isOverdue).length,
      tone: state.tone,
    };
  }),
);

const selectedCount = computed(() => selectedRows.value.length);

const hasActiveFilter = computed(() => {
  const q = appliedQuery.value;
  return Boolean(
    q.keyword.length
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
    || activeWorkflowState.value !== 'all',
  );
});

const tableTotal = computed(() => ['empty', 'permission'].includes(uiScenario.value) || tableError.value ? 0 : filteredRows.value.length);

const advancedConditionSnapshot = (source: ShipmentOrderQuery) => queryFieldSnapshot(source, allQueryFields.value);

const advancedDraftGroupCounts = computed(() => Object.fromEntries(QUERY_FIELD_GROUPS.map((group) => [
  group,
  allQueryFields.value.filter((field) => (
    queryFieldDefinitionByKey.get(field)?.group === group && isQueryFieldActive(advancedQuery, field)
  )).length,
])) as Record<ShipmentQueryFieldGroup, number>);

const advancedDraftCount = computed(() => Object.values(advancedDraftGroupCounts.value)
  .reduce((total, count) => total + count, 0));
const advancedDraftDirty = computed(() => (
  JSON.stringify(advancedConditionSnapshot(advancedQuery))
  !== JSON.stringify(advancedConditionSnapshot(query))
));

const advancedActiveCount = computed(() => allQueryFields.value
  .filter((field) => isQueryFieldActive(query, field)).length);

const getNextActionLabel = (row: ShipmentWorkbenchRow) => {
  if (row.exceptionStatus === 'open') return t('shipment.nextActions.exception');
  if (row.fileStatus === 'missing') return t('shipment.nextActions.files');
  if (row.orderStatus === 'waitBooking' || row.orderStatus === 'booking') return t('shipment.nextActions.booking');
  if (row.orderStatus === 'released' || row.orderStatus === 'waitTruck' || row.orderStatus === 'trucking') return t('shipment.nextActions.trucking');
  if (row.orderStatus === 'waitCustoms' || row.orderStatus === 'customs') return t('shipment.nextActions.customs');
  if (row.orderStatus === 'sailed') return t('shipment.nextActions.bl');
  if (row.feeStatus === 'none' || row.feeStatus === 'pending') return t('shipment.nextActions.fee');
  return t('shipment.nextActions.track');
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
const isRowPending = (row: ShipmentWorkbenchRow) => pendingRowIds.value.includes(row.id);

const waitForInteraction = (normalDelay = 280, slowDelay = 1400) => new Promise((resolve) => {
  window.setTimeout(resolve, uiScenario.value === 'slow' ? slowDelay : normalDelay);
});

const refreshQuickStatuses = (row: ShipmentWorkbenchRow) => {
  const next = new Set<ShipmentStatusKey>(['all']);
  const workflowQueue: Partial<Record<ShipmentWorkbenchRow['orderStatus'], ShipmentStatusKey[]>> = {
    draft: ['waitBooking'],
    waitBooking: ['waitBooking'],
    booking: ['waitBooking'],
    released: ['waitRelease', 'waitTruck'],
    waitTruck: ['waitTruck'],
    trucking: ['waitTruck'],
    waitCustoms: ['waitCustoms'],
    customs: ['waitCustoms'],
    cleared: ['waitLoading'],
    waitSail: ['waitLoading'],
    sailed: ['sailed'],
    inTransit: ['sailed'],
    arrived: ['sailed'],
  };

  (workflowQueue[row.orderStatus] ?? []).forEach((key) => next.add(key));
  if (row.fileStatus === 'missing') next.add('fileMissing');
  if (row.fileStatus !== 'complete' && ['sailed', 'inTransit', 'arrived'].includes(row.orderStatus)) {
    next.add('waitSi');
    next.add('waitBlConfirm');
  }
  if (row.feeStatus !== 'confirmed') next.add('feeUnconfirmed');
  if (row.exceptionStatus === 'open') next.add('exception');
  row.quickStatus = Array.from(next);
};

const touchRow = (row: ShipmentWorkbenchRow) => {
  row.updatedAt = formatLocalMinute();
  refreshQuickStatuses(row);
};

const runRowMutation = async (
  row: ShipmentWorkbenchRow,
  mutate: () => void,
  successMessage: string,
  failureMessage: string,
) => {
  if (isRowPending(row)) return false;
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

const handleSearch = async () => {
  if (querying.value) return;
  querying.value = true;
  await waitForInteraction(220, 900);
  appliedQuery.value = cloneQuery(query);
  page.current = 1;
  clearSelection();
  querying.value = false;
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = cloneQuery(defaultQuery());
  activeWorkflowState.value = 'all';
  activeWorkScope.value = 'all';
  advancedFilterVisible.value = false;
  queryFieldSettingsVisible.value = false;
  page.current = 1;
  clearSelection();
};

const closeAdvancedDatePopups = () => {
  advancedDatePopupVisible.etd = false;
  advancedDatePopupVisible.closing = false;
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
  clearQueryFields(advancedQuery, allQueryFields.value, defaultQuery());
};

const clearAdvancedGroup = (group: ShipmentQueryFieldGroup) => clearQueryFields(
  advancedQuery,
  allQueryFields.value.filter((field) => queryFieldDefinitionByKey.get(field)?.group === group),
  defaultQuery(),
);

const updateAdvancedDatePopup = (field: 'etd' | 'closing' | 'updated', value: boolean) => {
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

const onWorkflowStateSelect = (key: ShipmentStatusKey) => {
  activeWorkflowState.value = key;
  page.current = 1;
  clearSelection();
};

const onWorkflowStateChange = (key: string | number) => {
  onWorkflowStateSelect(key as ShipmentStatusKey);
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
    Message.warning(t('shipment.messages.minColumns'));
    return false;
  }
  if (!tableRef.value) {
    Message.error(t('shipment.messages.tableNotReady'));
    return false;
  }

  visibleColumnFields.value = nextFields;
  orderedColumnFields.value = nextOrder;
  window.localStorage.setItem(COLUMN_SETTING_STORAGE_KEY, JSON.stringify({ visibleFields: nextFields, orderedFields: nextOrder }));
  await nextTick();
  await syncTableColumnPreferences(nextFields, nextOrder);
  Message.success(t('shipment.messages.columnsApplied'));
  return true;
};

onMounted(async () => {
  await nextTick();
  await syncTableColumnPreferences(visibleColumnFields.value, orderedColumnFields.value);
});

const handleCreateOrder = async () => {
  if (creating.value) return;
  creating.value = true;
  await waitForInteraction(240, 1100);
  if (uiScenario.value === 'error') {
    Message.error(t('shipment.messages.draftError'));
    creating.value = false;
    return;
  }
  // 详情编辑模块已下线，草稿初始化结果暂以消息反馈。
  Message.success(t('shipment.messages.draftSuccess', { orderNo: `NEW${Date.now()}` }));
  creating.value = false;
};

const handleAssignOperator = (row: ShipmentWorkbenchRow) => runRowMutation(
  row,
  () => { row.operator = CURRENT_OPERATOR; },
  t('shipment.messages.assignSuccess', { orderNo: row.orderNo, operator: CURRENT_OPERATOR }),
  t('shipment.messages.assignFail', { orderNo: row.orderNo }),
);

const handleGenerateRowFee = (row: ShipmentWorkbenchRow) => runRowMutation(
  row,
  () => {
    row.feeStatus = 'pending';
    row.feeStatusLabel = '待确认';
  },
  t('shipment.messages.feeSuccess', { orderNo: row.orderNo }),
  t('shipment.messages.feeFail', { orderNo: row.orderNo }),
);

const openStatusModal = (row: ShipmentWorkbenchRow) => {
  statusTargetRows.value = [row];
  statusForm.targetStatus = undefined;
  statusForm.reason = '';
  statusForm.notify = true;
  statusForm.createNode = true;
  statusErrors.targetStatus = '';
  statusErrors.reason = '';
  statusModalVisible.value = true;
};

const confirmStatusChange = async () => {
  statusErrors.targetStatus = statusForm.targetStatus ? '' : t('shipment.messages.targetRequired');
  statusErrors.reason = statusForm.reason.trim() ? '' : t('shipment.messages.reasonRequired');
  if (statusErrors.targetStatus || statusErrors.reason || statusTargetRows.value.length === 0) return false;

  const nextStatus = statusTransitionOptions.value.find((item) => item.value === statusForm.targetStatus);
  if (!nextStatus) {
    statusErrors.targetStatus = t('shipment.messages.transitionInvalid');
    return false;
  }

  const row = statusTargetRows.value[0];
  statusSubmitting.value = true;
  const changed = await runRowMutation(
    row,
    () => {
      row.orderStatus = nextStatus.value;
      row.orderStatusLabel = nextStatus.label;
      row.statusPill = nextStatus.tone;
    },
    t('shipment.messages.statusSuccess', { orderNo: row.orderNo, status: t(`shipment.statuses.${nextStatus.value}`) }),
    t('shipment.messages.statusFail', { orderNo: row.orderNo }),
  );
  statusSubmitting.value = false;
  if (!changed) {
    statusErrors.reason = t('shipment.messages.submitFail');
    return false;
  }
  return true;
};

const openVoidModal = (row: ShipmentWorkbenchRow) => {
  voidTargetRow.value = row;
  voidError.value = '';
  voidModalVisible.value = true;
};

const voidOrder = async () => {
  if (!voidTargetRow.value) return false;
  const row = voidTargetRow.value;
  voidSubmitting.value = true;
  voidError.value = '';
  const changed = await runRowMutation(
    row,
    () => {
      row.orderStatus = 'cancelled';
      row.orderStatusLabel = '已作废';
      row.statusPill = 'rej';
    },
    t('shipment.messages.voidSuccess', { orderNo: row.orderNo }),
    t('shipment.messages.voidFail', { orderNo: row.orderNo }),
  );
  voidSubmitting.value = false;
  if (!changed) voidError.value = t('shipment.messages.voidError');
  return changed;
};

const handleExport = () => {
  const rows = selectedRows.value.length ? selectedRows.value : filteredRows.value;

  downloadCsvFile(
    t('shipment.messages.exportFile', { count: rows.length }),
    [t('shipment.columns.orderNo'), t('shipment.columns.customerName'), t('shipment.columns.businessType'), t('shipment.columns.orderStatus'), 'ETD', t('shipment.columns.pod'), t('shipment.columns.operator')],
    rows.map((row) => [row.orderNo, row.customerName, row.businessType, t(`shipment.statuses.${row.orderStatus}`), row.etd, row.pod, row.operator]),
  );

  Message.success(t('shipment.messages.exportSuccess', { count: rows.length }));
};

const handleRowNotify = (row: ShipmentWorkbenchRow) => runRowMutation(
  row,
  () => undefined,
  t('shipment.messages.notifySuccess', { orderNo: row.orderNo }),
  t('shipment.messages.notifyFail', { orderNo: row.orderNo }),
);

const getRowActions = (row: ShipmentWorkbenchRow): WorkbenchRowAction[] => {
  const pending = isRowPending(row);
  const actions: WorkbenchRowAction[] = [];
  if (canTransitionOrder(row)) {
    actions.push({
      key: 'update-status',
      label: t('shipment.actions.updateStatus'),
      icon: IconEdit,
      disabled: pending,
      loading: pending,
      onClick: () => openStatusModal(row),
    });
  }
  actions.push({
    key: 'assign-me',
    label: t('shipment.actions.assignMe'),
    icon: IconUserAdd,
    disabled: pending,
    loading: pending && !canTransitionOrder(row),
    onClick: () => handleAssignOperator(row),
  });
  actions.push({
    key: 'generate-fee',
    label: t('shipment.actions.generateFee'),
    icon: IconPlusCircle,
    disabled: pending,
    onClick: () => handleGenerateRowFee(row),
  });
  actions.push({
    key: 'notify',
    label: t('shipment.actions.notify'),
    icon: IconNotification,
    disabled: pending,
    onClick: () => handleRowNotify(row),
  });
  actions.push({
    key: 'void-order',
    label: t('shipment.actions.voidOrder'),
    icon: IconStop,
    disabled: pending,
    danger: true,
    onClick: () => openVoidModal(row),
  });
  return actions;
};

const runBatchAction = async (label: string, mutate: (row: ShipmentWorkbenchRow) => void) => {
  if (!selectedCount.value) {
    Message.warning(t('shipment.messages.selectOrders'));
    return false;
  }
  if (batchSubmitting.value) return false;

  const submittedRows = [...selectedRows.value];
  batchSubmitting.value = true;
  await waitForInteraction(320, 1400);
  const failedRows = uiScenario.value === 'error'
    ? submittedRows
    : uiScenario.value === 'partial'
      ? submittedRows.filter((_, index) => index % 3 === 0)
      : [];
  const failedIds = new Set(failedRows.map((row) => row.id));
  const succeededRows = submittedRows.filter((row) => !failedIds.has(row.id));
  succeededRows.forEach((row) => {
    mutate(row);
    touchRow(row);
  });

  if (failedRows.length) {
    batchFeedback.value = {
      label,
      success: succeededRows.length,
      failedOrderNos: failedRows.map((row) => row.orderNo),
    };
    tableRef.value?.clearCheckboxRow();
    tableRef.value?.setCheckboxRow(failedRows, true);
    selectedRows.value = failedRows;
    batchSubmitting.value = false;
    if (succeededRows.length) Message.warning(t('shipment.messages.batchPartial', { action: label, success: succeededRows.length, failed: failedRows.length }));
    else Message.error(t('shipment.messages.batchFail', { action: label, failed: failedRows.length }));
    return false;
  }

  batchFeedback.value = null;
  clearSelection();
  batchSubmitting.value = false;
  Message.success(t('shipment.messages.batchSuccess', { action: label, count: submittedRows.length }));
  return true;
};

const openBatchAssignment = (operator = CURRENT_OPERATOR) => {
  batchAssignForm.operator = operator;
  batchAssignError.value = '';
  batchAssignVisible.value = true;
};

const confirmBatchAssignment = async () => {
  if (!batchAssignForm.operator) {
    batchAssignError.value = t('shipment.messages.operatorRequired');
    return false;
  }
  const operator = batchAssignForm.operator;
  const completed = await runBatchAction(
    t('shipment.messages.batchAssign', { operator }),
    (row) => { row.operator = operator; },
  );
  if (!completed) batchAssignError.value = t('shipment.messages.batchAssignError');
  return completed;
};

const handleBatchNotify = () => runBatchAction(t('shipment.messages.batchNotify'), () => undefined);

const fetchList = async () => {
  if (uiScenario.value === 'permission') return;
  loadError.value = '';
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, uiScenario.value === 'slow' ? 1600 : 300));
  if (uiScenario.value === 'error' && !hasSimulatedError.value) {
    loadError.value = t('shipment.messages.loadError');
    hasSimulatedError.value = true;
  }
  loading.value = false;
};

watch(uiScenario, () => {
  allRows.value = createWorkbenchRows();
  batchFeedback.value = null;
  batchAssignVisible.value = false;
  statusModalVisible.value = false;
  voidModalVisible.value = false;
  advancedFilterVisible.value = false;
  queryFieldSettingsVisible.value = false;
  pendingRowIds.value = [];
  querying.value = false;
  advancedApplying.value = false;
  creating.value = false;
  batchSubmitting.value = false;
  statusSubmitting.value = false;
  voidSubmitting.value = false;
  hasSimulatedError.value = false;
  clearSelection();
  fetchList();
}, { immediate: true });
</script>

<template>
  <StandardListFrame page-id="shipment-export-order-workbench" data-pesdp-page="shipment-export-order-workbench">
    <template #query>
          <a-form :model="query" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
            <QueryFieldGrid>
              <QueryFieldCol
                v-for="definition in pageQueryFieldDefinitions"
                :key="definition.field"
                :role="definition.width"
              >
                <ShipmentQueryFieldControl
                  :field="definition.field"
                  :model="query"
                  :operator-options="operatorOptions"
                  :carrier-options="carrierOptions"
                  @submit="handleSearch"
                />
              </QueryFieldCol>
              <QueryFieldCol role="actions">
                <div class="query-actions">
                  <a-button size="small" type="primary" :loading="querying" @click="handleSearch">
                    <template #icon><icon-search /></template>
                    {{ t('common.search') }}
                  </a-button>
                  <a-button size="small" type="text" :disabled="querying" @click="handleReset">{{ t('common.reset') }}</a-button>
                  <a-badge :count="advancedActiveCount" :offset="[-4, 4]">
                    <a-tooltip :content="t('shipment.actions.advanced')">
                      <a-button size="small" type="text" :title="t('shipment.actions.advanced')" :aria-label="t('shipment.actions.advanced')" @click="openAdvancedFilters">
                        <template #icon><icon-filter /></template>
                        {{ t('common.filter') }}
                      </a-button>
                    </a-tooltip>
                  </a-badge>
                  <a-tooltip :content="t('shipment.querySettings.title')">
                    <a-button
                      size="small"
                      type="text"
                      :title="t('shipment.querySettings.title')"
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
              :aria-label="t('shipment.scope.label')"
              type="button"
              size="small"
              @change="onWorkScopeChange"
            >
              <a-radio value="all">{{ t('shipment.scope.all') }}</a-radio>
              <a-radio value="mine">{{ t('shipment.scope.mine') }}</a-radio>
              <a-radio value="others">{{ t('shipment.scope.others') }}</a-radio>
            </a-radio-group>
          </div>

          <a-divider direction="vertical" class="workflow-filter-bar__divider" />

          <WorkflowStateSelector
            class="workflow-filter-bar__state"
            :model-value="activeWorkflowState"
            :label="t('shipment.queueLabel')"
            :show-label="false"
            :options="workflowStateOptions"
            @change="onWorkflowStateChange"
          />
    </template>

    <template #toolbar>
          <WorkbenchTableToolbar
            :current="page.current"
            :page-size="page.size"
            :total="tableTotal"
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #commands>
              <div class="table-cap-start">
                <div v-if="canOperate" class="table-command-group">
                  <a-button size="small" type="primary" :loading="creating" @click="handleCreateOrder">
                    <template #icon><icon-plus /></template>
                    {{ t('shipment.actions.create') }}
                  </a-button>
                  <a-tooltip :content="t('shipment.actions.exportCurrent')">
                    <a-button size="small" class="table-command--compact-icon" :aria-label="t('shipment.actions.exportCurrent')" @click="handleExport">
                      <template #icon><icon-download /></template>
                      <span class="table-command-label--optional">{{ t('common.export') }}</span>
                    </a-button>
                  </a-tooltip>
                  <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
                    <a-button size="small" :disabled="!selectedCount" :loading="batchSubmitting">
                      {{ t('shipment.actions.batch') }}<icon-down />
                    </a-button>
                    <template #content>
                      <a-doption @click="openBatchAssignment(CURRENT_OPERATOR)">{{ t('shipment.actions.assignMe') }}</a-doption>
                      <a-doption @click="openBatchAssignment('')">{{ t('shipment.actions.assignOperator') }}</a-doption>
                      <a-doption @click="handleBatchNotify">{{ t('shipment.actions.notify') }}</a-doption>
                      <a-doption @click="clearSelection">{{ t('shipment.actions.clearSelection') }}</a-doption>
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
                <a-button size="small" type="text" class="table-cap-tool" :title="t('common.refresh')" :aria-label="t('common.refresh')" :loading="loading || forcedLoading" @click="fetchList">
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
          {{ t('shipment.messages.batchAlert', { action: batchFeedback.label, success: batchFeedback.success, failed: batchFeedback.failedOrderNos.length, orders: batchFeedback.failedOrderNos.join(', ') }) }}
        </a-alert>
    </template>

    <template #table>
          <vxe-table
            ref="tableRef"
            id="shipment-export-orders"
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
          >
            <vxe-column type="checkbox" width="44" fixed="left" />
            <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />

            <vxe-column field="orderNo" :title="t('shipment.columns.orderNo')" min-width="168" fixed="left" :visible="isColumnVisible('orderNo')">
              <template #default="{ row }">
                <span class="tabular">{{ row.orderNo }}</span>
              </template>
            </vxe-column>

            <vxe-column field="orderStatus" :title="t('shipment.columns.orderStatus')" :min-width="ORDER_STATUS_COLUMN_MIN_WIDTH" fixed="left" :visible="isColumnVisible('orderStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="row.statusPill">{{ t(`shipment.statuses.${row.orderStatus}`) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="nextAction" :title="t('shipment.columns.nextAction')" min-width="230" :visible="isColumnVisible('nextAction')">
              <template #default="{ row }">
                <span class="next-action-value">{{ getNextActionLabel(row) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="operator" :title="t('shipment.columns.operator')" min-width="104" :visible="isColumnVisible('operator')" />
            <vxe-column field="customerName" :title="t('shipment.columns.customerName')" min-width="190" :visible="isColumnVisible('customerName')" />
            <vxe-column field="pol" :title="t('shipment.columns.pol')" min-width="96" class-name="tabular" :visible="isColumnVisible('pol')" />
            <vxe-column field="pod" :title="t('shipment.columns.pod')" min-width="96" class-name="tabular" :visible="isColumnVisible('pod')" />
            <vxe-column field="etd" title="ETD" min-width="104" class-name="tabular" :visible="isColumnVisible('etd')" />

            <vxe-column field="fileStatus" :title="t('shipment.columns.fileStatus')" min-width="104" :visible="isColumnVisible('fileStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="getFileStatusMeta(row).tone">{{ t(`shipment.fileStatus.${row.fileStatus}`) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="feeStatus" :title="t('shipment.columns.feeStatus')" min-width="100" :visible="isColumnVisible('feeStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="getFeeStatusMeta(row).tone">{{ t(`shipment.feeStatus.${row.feeStatus}`) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="exceptionStatus" :title="t('shipment.columns.exceptionStatus')" min-width="112" :visible="isColumnVisible('exceptionStatus')">
              <template #default="{ row }">
                <span class="s-pill" :data-s="getExceptionStatusMeta(row).tone">{{ t(`shipment.exceptionStatus.${row.exceptionStatus}`) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="updatedAt" :title="t('shipment.columns.updatedAt')" min-width="140" class-name="tabular" :visible="isColumnVisible('updatedAt')" />

            <vxe-column field="businessType" :title="t('shipment.columns.businessType')" min-width="96" :visible="isColumnVisible('businessType')" />
            <vxe-column field="carrier" :title="t('shipment.columns.carrier')" min-width="120" :visible="isColumnVisible('carrier')" />
            <vxe-column field="vesselVoyage" :title="t('shipment.columns.vesselVoyage')" min-width="190" :visible="isColumnVisible('vesselVoyage')" />
            <vxe-column field="eta" title="ETA" min-width="104" class-name="tabular" :visible="isColumnVisible('eta')" />
            <vxe-column field="closingTime" :title="t('shipment.columns.closingTime')" min-width="140" class-name="tabular" :visible="isColumnVisible('closingTime')" />
            <vxe-column field="bookingNo" :title="t('shipment.columns.bookingNo')" min-width="150" class-name="tabular" :visible="isColumnVisible('bookingNo')" />
            <vxe-column field="blNo" :title="t('shipment.columns.blNo')" min-width="160" class-name="tabular" :visible="isColumnVisible('blNo')" />
            <vxe-column field="containerSummary" :title="t('shipment.columns.containerSummary')" min-width="110" :visible="isColumnVisible('containerSummary')" />
            <vxe-column field="isOverdue" :title="t('shipment.columns.isOverdue')" min-width="90" :visible="isColumnVisible('isOverdue')">
              <template #default="{ row }">{{ row.isOverdue ? t('shipment.overdue.yes') : t('shipment.overdue.no') }}</template>
            </vxe-column>

            <vxe-column :title="t('common.operations')" :width="ROW_ACTION_COLUMN_WIDTH" fixed="right" align="left" header-align="center">
              <template #default="{ row }">
                <WorkbenchRowActions :actions="getRowActions(row)" :more-label="t('common.moreActions')" />
              </template>
            </vxe-column>
            <template #empty>
              <WorkbenchEmptyState
                :kind="uiScenario === 'permission' ? 'permission' : tableError ? 'error' : 'empty'"
                :title="uiScenario === 'permission'
                  ? t('shipment.empty.permissionTitle')
                  : tableError
                    ? t('shipment.empty.errorTitle')
                    : hasActiveFilter ? t('shipment.empty.filteredTitle') : t('shipment.empty.defaultTitle')"
                :description="uiScenario === 'permission'
                  ? t('shipment.empty.permissionDesc')
                  : tableError
                    ? tableError
                    : hasActiveFilter ? t('shipment.empty.filteredDesc') : t('shipment.empty.defaultDesc')"
              >
                <template #actions>
                  <a-button v-if="tableError" size="small" type="primary" @click="fetchList">{{ t('shipment.actions.reload') }}</a-button>
                  <a-button v-else-if="hasActiveFilter && uiScenario !== 'permission'" size="small" type="text" @click="handleReset">{{ t('shipment.actions.resetFilter') }}</a-button>
                  <a-button v-else-if="uiScenario !== 'permission'" size="small" type="primary" @click="handleCreateOrder">
                    <template #icon><icon-plus /></template>
                    {{ t('shipment.actions.create') }}
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
          <span>{{ t('shipment.advanced.title') }}</span>
          <span class="advanced-filter-title__hint">{{ t('shipment.advanced.allFields') }}</span>
          <span v-if="advancedDraftCount" class="advanced-filter-title__count">{{ t('shipment.advanced.selected', { count: advancedDraftCount }) }}</span>
          <a-badge v-if="advancedDraftDirty" class="advanced-filter-title__dirty" status="processing" :text="t('shipment.advanced.pending')" />
        </div>
      </template>
      <a-form class="advanced-filter-form" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle" :model="advancedQuery">
        <section v-if="drawerFieldsForGroup('routeDocuments').length" class="advanced-filter-section" aria-labelledby="route-document-filter-title">
          <div class="advanced-filter-section__head">
            <a-space :size="6">
              <h3 id="route-document-filter-title" class="advanced-filter-section__title">{{ t('shipment.advanced.routeDocsOwnership') }}</h3>
              <span v-if="advancedDraftGroupCounts.routeDocuments" class="advanced-filter-section__count">
                {{ t('shipment.advanced.selected', { count: advancedDraftGroupCounts.routeDocuments }) }}
              </span>
            </a-space>
            <a-button
              v-if="advancedDraftGroupCounts.routeDocuments"
              size="small"
              type="text"
              :title="t('shipment.advanced.clearGroup')"
              @click="clearAdvancedGroup('routeDocuments')"
            >{{ t('shipment.advanced.clearGroup') }}</a-button>
          </div>
          <a-row :gutter="denseFormGridGutter">
            <a-col v-for="definition in drawerFieldsForGroup('routeDocuments')" :key="definition.field" :span="12" :xs="24" :sm="12">
              <ShipmentQueryFieldControl
                :field="definition.field"
                :model="advancedQuery"
                :operator-options="operatorOptions"
                :carrier-options="carrierOptions"
                dense
                @submit="applyAdvancedFilters"
                @date-popup-change="updateAdvancedDatePopup"
              />
            </a-col>
          </a-row>
        </section>

        <section v-if="drawerFieldsForGroup('schedule').length" class="advanced-filter-section" aria-labelledby="schedule-filter-title">
          <div class="advanced-filter-section__head">
            <a-space :size="6">
              <h3 id="schedule-filter-title" class="advanced-filter-section__title">{{ t('shipment.advanced.schedule') }}</h3>
              <span v-if="advancedDraftGroupCounts.schedule" class="advanced-filter-section__count">
                {{ t('shipment.advanced.selected', { count: advancedDraftGroupCounts.schedule }) }}
              </span>
            </a-space>
            <a-button
              v-if="advancedDraftGroupCounts.schedule"
              size="small"
              type="text"
              :title="t('shipment.advanced.clearGroup')"
              @click="clearAdvancedGroup('schedule')"
            >{{ t('shipment.advanced.clearGroup') }}</a-button>
          </div>
          <a-row :gutter="denseFormGridGutter">
            <a-col v-for="definition in drawerFieldsForGroup('schedule')" :key="definition.field" :span="12" :xs="24" :sm="12">
              <ShipmentQueryFieldControl
                :field="definition.field"
                :model="advancedQuery"
                :operator-options="operatorOptions"
                :carrier-options="carrierOptions"
                dense
                @submit="applyAdvancedFilters"
                @date-popup-change="updateAdvancedDatePopup"
              />
            </a-col>
          </a-row>
        </section>

        <section v-if="drawerFieldsForGroup('risk').length" class="advanced-filter-section" aria-labelledby="risk-filter-title">
          <div class="advanced-filter-section__head">
            <a-space :size="6">
              <h3 id="risk-filter-title" class="advanced-filter-section__title">{{ t('shipment.advanced.risk') }}</h3>
              <span v-if="advancedDraftGroupCounts.risk" class="advanced-filter-section__count">
                {{ t('shipment.advanced.selected', { count: advancedDraftGroupCounts.risk }) }}
              </span>
            </a-space>
            <a-button
              v-if="advancedDraftGroupCounts.risk"
              size="small"
              type="text"
              :title="t('shipment.advanced.clearGroup')"
              @click="clearAdvancedGroup('risk')"
            >{{ t('shipment.advanced.clearGroup') }}</a-button>
          </div>
          <a-row :gutter="denseFormGridGutter">
            <a-col v-for="definition in drawerFieldsForGroup('risk')" :key="definition.field" :span="12" :xs="24" :sm="12">
              <ShipmentQueryFieldControl
                :field="definition.field"
                :model="advancedQuery"
                :operator-options="operatorOptions"
                :carrier-options="carrierOptions"
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
              {{ t('shipment.advanced.matchCount', { count: advancedPreviewCount }) }}
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

    <a-modal
      v-model:visible="batchAssignVisible"
      :title="t('shipment.modal.batchAssignTitle')"
      :width="480"
      :mask-closable="false"
      :ok-text="t('shipment.modal.batchAssignOk')"
      :ok-loading="batchSubmitting"
      :ok-button-props="{ size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmBatchAssignment"
    >
      <a-alert type="info" class="modal-context-alert">
        {{ t('shipment.modal.batchAssignCopy', { count: selectedCount }) }}
      </a-alert>
      <a-form :model="batchAssignForm" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle" class="detail-form">
        <a-form-item
          field="operator"
          :label="t('shipment.modal.operator')"
          required
          :validate-status="batchAssignError ? 'error' : undefined"
          :help="batchAssignError"
        >
          <a-select
            v-model="batchAssignForm.operator"
            size="small"
            allow-search
            :placeholder="t('shipment.modal.operatorPlaceholder')"
            @change="batchAssignError = ''"
          >
            <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">
              {{ operator }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="statusModalVisible"
      :title="t('shipment.modal.statusTitle')"
      :width="560"
      :mask-closable="false"
      :ok-loading="statusSubmitting"
      :ok-button-props="{ size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmStatusChange"
    >
      <a-form :model="statusForm" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle" class="detail-form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="t('shipment.modal.currentStatus')">
              <span>{{ statusTargetRows[0] ? t(`shipment.statuses.${statusTargetRows[0].orderStatus}`) : '' }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="t('shipment.modal.targetStatus')"
              field="targetStatus"
              required
              :validate-status="statusErrors.targetStatus ? 'error' : undefined"
              :help="statusErrors.targetStatus"
            >
              <a-select
                v-model="statusForm.targetStatus"
                size="small"
                allow-clear
                :placeholder="t('shipment.advanced.select')"
                @change="statusErrors.targetStatus = ''"
              >
                <a-option v-for="option in statusTransitionOptions" :key="option.value" :value="option.value">
                  {{ t(`shipment.statuses.${option.value}`) }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              :label="t('shipment.modal.reason')"
              field="reason"
              required
              :validate-status="statusErrors.reason ? 'error' : undefined"
              :help="statusErrors.reason"
            >
              <a-textarea
                v-model="statusForm.reason"
                size="small"
                :auto-size="{ minRows: 2, maxRows: 4 }"
                :placeholder="t('shipment.modal.reasonPlaceholder')"
                @input="statusErrors.reason = ''"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <a-checkbox v-model="statusForm.notify">{{ t('shipment.modal.notify') }}</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <a-checkbox v-model="statusForm.createNode">{{ t('shipment.modal.createNode') }}</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="voidModalVisible"
      :title="t('shipment.modal.voidTitle')"
      :width="420"
      :mask-closable="false"
      :ok-text="t('shipment.modal.voidOk')"
      :ok-loading="voidSubmitting"
      :ok-button-props="{ status: 'danger', size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="voidOrder"
    >
      <p class="modal-confirm-copy">{{ t('shipment.modal.voidCopy', { orderNo: voidTargetRow?.orderNo }) }}</p>
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

.advanced-filter-preview strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-variant-numeric: tabular-nums;
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

.next-action-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-control);
  line-height: 15px;
}

.modal-context-alert {
  margin-bottom: 16px;
}

.modal-confirm-copy {
  margin: 0 0 12px;
  color: var(--color-text-2);
  line-height: 20px;
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
