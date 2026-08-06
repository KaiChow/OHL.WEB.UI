<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import { IconDown, IconFilter, IconMore, IconRefresh, IconSearch } from '@arco-design/web-vue/es/icon';
import { compactVerticalFormLabelStyle, denseFormGridGutter } from '../../../design-system/formLayout';
import { stableTableRowConfig } from '../../../design-system/tableConfig';
import QueryFieldCol from '../../../components/workbench/QueryFieldCol.vue';
import QueryFieldGrid from '../../../components/workbench/QueryFieldGrid.vue';
import StandardListFrame from '../../../components/workbench/StandardListFrame.vue';
import WorkbenchColumnSettings from '../../../components/workbench/WorkbenchColumnSettings.vue';
import WorkbenchEmptyState from '../../../components/workbench/WorkbenchEmptyState.vue';
import WorkbenchTableToolbar from '../../../components/workbench/WorkbenchTableToolbar.vue';
import ScenarioFieldControl from './components/ScenarioFieldControl.vue';
import { QUERY_SCENARIOS, SCENARIO_FIELDS } from './scenarioFields';
import type { QueryScenarioKey, ScenarioField } from './scenarioFields';
import { QUERY_GRID_ITEM_SPANS } from '../../../design-system/queryLayout';
import type { QueryGridItemRole } from '../../../design-system/queryLayout';
import { QUERY_SCENARIO_FEATURE_CONTRACTS } from '../featureContracts';

void QUERY_SCENARIO_FEATURE_CONTRACTS;

const props = defineProps<{
  initialScenario: QueryScenarioKey;
}>();

interface ScenarioRow {
  id: string;
  orderNo: string;
  orderStatus: string;
  statusKey: string;
  statusTone: string;
  customerName: string;
  businessType: string;
  owner: string;
  updatedAt: string;
}

const router = useRouter();
const { t } = useI18n();
const CURRENT_ACCEPTANCE_OPERATOR = '张操作';
const COLUMN_SETTING_STORAGE_KEY = 'ohl.ui-acceptance.query.visible-columns.v1';
const OPERATION_COLUMN_WIDTH = 168;
const STATUS_COLUMN_MIN_WIDTH = 148;

type ScenarioColumnField = 'orderNo' | 'orderStatus' | 'customerName' | 'businessType' | 'owner' | 'updatedAt';

const COLUMN_SETTING_OPTIONS: Array<{ field: ScenarioColumnField; required?: boolean }> = [
  { field: 'orderNo', required: true },
  { field: 'orderStatus', required: true },
  { field: 'customerName' },
  { field: 'businessType' },
  { field: 'owner' },
  { field: 'updatedAt' },
];
const COLUMN_LABEL_KEYS: Record<ScenarioColumnField, string> = {
  orderNo: 'orderNo',
  orderStatus: 'status',
  customerName: 'customer',
  businessType: 'businessType',
  owner: 'owner',
  updatedAt: 'updatedAt',
};
const DEFAULT_VISIBLE_COLUMN_FIELDS: ScenarioColumnField[] = COLUMN_SETTING_OPTIONS.map((option) => option.field);
const DEFAULT_COLUMN_ORDER_FIELDS: ScenarioColumnField[] = COLUMN_SETTING_OPTIONS.map((option) => option.field);
const REQUIRED_COLUMN_FIELDS = COLUMN_SETTING_OPTIONS.filter((option) => option.required).map((option) => option.field);

interface ColumnPreferences {
  visibleFields: ScenarioColumnField[];
  orderedFields: ScenarioColumnField[];
}

const normalizeColumnOrder = (fields: string[]): ScenarioColumnField[] => {
  const available = new Set(DEFAULT_COLUMN_ORDER_FIELDS);
  const normalized = Array.from(new Set(fields.filter((field): field is ScenarioColumnField => available.has(field as ScenarioColumnField))));
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
    const available = new Set(DEFAULT_VISIBLE_COLUMN_FIELDS);
    const normalized = Array.from(new Set([
      ...REQUIRED_COLUMN_FIELDS,
      ...storedVisible.filter((field): field is ScenarioColumnField => available.has(field as ScenarioColumnField)),
    ]));
    return {
      visibleFields: normalized.length >= 4 ? normalized : [...DEFAULT_VISIBLE_COLUMN_FIELDS],
      orderedFields: normalizeColumnOrder(storedOrder),
    };
  } catch {
    return { visibleFields: [...DEFAULT_VISIBLE_COLUMN_FIELDS], orderedFields: [...DEFAULT_COLUMN_ORDER_FIELDS] };
  }
};

const initialColumnPreferences = loadColumnPreferences();

const activeScenarioKey = ref<QueryScenarioKey>(props.initialScenario);
const expanded = ref(false);
const drawerVisible = ref(false);
const querying = ref(false);
const refreshing = ref(false);
const primaryGridTrackCount = ref(24);
const page = reactive({ current: 1, size: 10 });
const keywordType = ref('orderNo');
const wideFilterEditor = ref<HTMLElement>();
const tableRef = ref<VxeTableInstance>();
const visibleColumnFields = ref<ScenarioColumnField[]>(initialColumnPreferences.visibleFields);
const orderedColumnFields = ref<ScenarioColumnField[]>(initialColumnPreferences.orderedFields);
const queryValues = reactive<Record<string, string | string[]>>({});
const draftValues = reactive<Record<string, string | string[]>>({});
const appliedValues = ref<Record<string, string | string[]>>({});
let searchTimer: number | undefined;
let refreshTimer: number | undefined;

for (const field of SCENARIO_FIELDS) {
  queryValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
  draftValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
}

const columnSettingOptions = computed(() => COLUMN_SETTING_OPTIONS.map((option) => ({
  field: option.field,
  label: t(`queryScenario.columns.${COLUMN_LABEL_KEYS[option.field]}`),
  required: option.required,
  orderLocked: option.field === 'orderNo',
})));
const isColumnVisible = (field: ScenarioColumnField) => visibleColumnFields.value.includes(field);

const BASE_ROWS: ScenarioRow[] = [
  { id: '1', orderNo: 'SEO2026080001', orderStatus: '订舱中', statusKey: 'booking', statusTone: 'op', customerName: '深圳华贸进出口有限公司', businessType: 'FCL', owner: '张操作', updatedAt: '2026-08-03 09:30' },
  { id: '2', orderNo: 'SEO2026080002', orderStatus: '已放舱', statusKey: 'released', statusTone: 'rel', customerName: '宁波远洋贸易集团', businessType: 'FCL', owner: '李操作', updatedAt: '2026-08-03 09:12' },
  { id: '3', orderNo: 'SEO2026080003', orderStatus: '报关中', statusKey: 'customs', statusTone: 'op', customerName: '广州宏达电子科技', businessType: 'LCL', owner: '王操作', updatedAt: '2026-08-03 08:48' },
  { id: '4', orderNo: 'SEO2026080004', orderStatus: '已开船', statusKey: 'sailed', statusTone: 'rel', customerName: '上海瑞联物流', businessType: 'FCL', owner: '赵操作', updatedAt: '2026-08-02 17:26' },
  { id: '5', orderNo: 'SEO2026080005', orderStatus: '待报关', statusKey: 'pendingCustoms', statusTone: 'wait', customerName: '青岛海盛实业', businessType: 'FCL', owner: '张操作', updatedAt: '2026-08-02 16:40' },
  { id: '6', orderNo: 'SEO2026080006', orderStatus: '拖车中', statusKey: 'trucking', statusTone: 'op', customerName: '厦门建发供应链', businessType: 'FCL', owner: '李操作', updatedAt: '2026-08-02 15:18' },
  { id: '7', orderNo: 'SEO2026080007', orderStatus: '异常', statusKey: 'exception', statusTone: 'risk', customerName: '天津港联国际', businessType: 'LCL', owner: '王操作', updatedAt: '2026-08-02 14:05' },
  { id: '8', orderNo: 'SEO2026080008', orderStatus: '已完成', statusKey: 'completed', statusTone: 'rel', customerName: '东莞精密制造', businessType: 'FCL', owner: '赵操作', updatedAt: '2026-08-02 11:32' },
];

const rows = reactive<ScenarioRow[]>(Array.from({ length: 24 }, (_, index) => {
  const base = BASE_ROWS[index % BASE_ROWS.length];
  return {
    ...base,
    id: String(index + 1),
    orderNo: `SEO202608${String(index + 1).padStart(4, '0')}`,
  };
}));

const NEXT_STATUS: Record<string, { key: string; tone: string }> = {
  booking: { key: 'released', tone: 'rel' },
  released: { key: 'customs', tone: 'op' },
  pendingCustoms: { key: 'customs', tone: 'op' },
  trucking: { key: 'customs', tone: 'op' },
  customs: { key: 'sailed', tone: 'rel' },
  exception: { key: 'customs', tone: 'op' },
  sailed: { key: 'completed', tone: 'rel' },
  completed: { key: 'booking', tone: 'op' },
};

const groupMessageKeys: Record<string, string> = {
  '识别条件': 'identity', '航线与运输': 'route', '时间计划': 'schedule', '执行与归属': 'ownership',
  '状态与风险': 'status', '财务条件': 'finance', '审计与来源': 'audit', '货物与条款': 'cargo',
};

const fieldByKey = new Map(SCENARIO_FIELDS.map((field) => [field.key, field]));
const currentScenario = computed(() => QUERY_SCENARIOS.find((item) => item.key === activeScenarioKey.value) ?? QUERY_SCENARIOS[0]);
const visibleFields = computed(() => currentScenario.value.visible.map((key) => fieldByKey.get(key)).filter((field): field is ScenarioField => Boolean(field)));
const remainingFields = computed(() => SCENARIO_FIELDS.filter((field) => !currentScenario.value.visible.includes(field.key as never)));
const secondaryFields = computed(() => {
  const configuredKeys = 'secondary' in currentScenario.value ? currentScenario.value.secondary : undefined;
  if (configuredKeys) {
    return configuredKeys.map((key) => fieldByKey.get(key)).filter((field): field is ScenarioField => Boolean(field));
  }
  return remainingFields.value.slice(0, Math.max(0, currentScenario.value.total - visibleFields.value.length));
});
const isExpandScenario = computed(() => activeScenarioKey.value === 's2-expand');
const isDrawerScenario = computed(() => ['s3-drawer', 's3-wide', 's4-drawer'].includes(activeScenarioKey.value));
const isWideDrawer = computed(() => activeScenarioKey.value === 's3-wide' || activeScenarioKey.value === 's4-drawer');
const actionColumnRole = computed<QueryGridItemRole>(() => {
  if (isExpandScenario.value) return 'actions-expanded';
  return isDrawerScenario.value ? 'actions-wide' : 'actions';
});
const permanentVisibleFields = computed(() => {
  if (!isExpandScenario.value && !isDrawerScenario.value) return visibleFields.value;
  let availableTracks = primaryGridTrackCount.value - QUERY_GRID_ITEM_SPANS[actionColumnRole.value];
  const fields: ScenarioField[] = [];
  for (const field of visibleFields.value) {
    const span = QUERY_GRID_ITEM_SPANS[field.width];
    if (span > availableTracks) break;
    fields.push(field);
    availableTracks -= span;
  }
  return fields;
});
const responsiveSecondaryFields = computed(() => [
  ...visibleFields.value.slice(permanentVisibleFields.value.length),
  ...secondaryFields.value,
]);
const promotedSecondaryFields = computed(() => {
  if (!isExpandScenario.value) return [];
  let availableTracks = primaryGridTrackCount.value
    - QUERY_GRID_ITEM_SPANS[actionColumnRole.value]
    - permanentVisibleFields.value.reduce((total, field) => total + QUERY_GRID_ITEM_SPANS[field.width], 0);
  const promoted: ScenarioField[] = [];
  for (const field of responsiveSecondaryFields.value) {
    const span = QUERY_GRID_ITEM_SPANS[field.width];
    if (span > availableTracks) break;
    promoted.push(field);
    availableTracks -= span;
  }
  return promoted;
});
const collapsibleSecondaryFields = computed(() => responsiveSecondaryFields.value.slice(promotedSecondaryFields.value.length));
const hiddenActiveCount = computed(() => collapsibleSecondaryFields.value.filter((field) => {
  const value = queryValues[field.key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}).length);

const groupFields = (fields: ScenarioField[]) => {
  const groups = new Map<string, ScenarioField[]>();
  for (const field of fields) groups.set(field.group, [...(groups.get(field.group) ?? []), field]);
  return [...groups].map(([name, items], index) => ({ id: `advanced-group-${index}`, name: t(`queryScenario.groups.${groupMessageKeys[name]}`), fields: items }));
};

const advancedGroups = computed(() => groupFields(responsiveSecondaryFields.value));
const activeAdvancedCount = computed(() => responsiveSecondaryFields.value.filter((field) => {
  const value = appliedValues.value[field.key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}).length);

const filteredRows = computed(() => {
  const keyword = String(appliedValues.value.keyword ?? '').trim().toLowerCase();
  const customer = String(appliedValues.value.customerName ?? '').trim().toLowerCase();
  const batchValues = Array.isArray(appliedValues.value.batchValues) ? appliedValues.value.batchValues : [];
  return rows.filter((row) => (!keyword || row.orderNo.toLowerCase().includes(keyword))
    && (!customer || row.customerName.toLowerCase().includes(customer))
    && (!batchValues.length || batchValues.includes(row.orderNo)));
});
const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const onPageChange = (current: number) => {
  page.current = current;
};

const onPageSizeChange = (size: number) => {
  page.size = size;
  page.current = 1;
};

const syncTableColumnPreferences = async (visibleFields: ScenarioColumnField[], orderedFields: ScenarioColumnField[]) => {
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
  const available = new Set(DEFAULT_VISIBLE_COLUMN_FIELDS);
  const requested = visibleFields.filter((field): field is ScenarioColumnField => available.has(field as ScenarioColumnField));
  const nextFields = Array.from(new Set([...REQUIRED_COLUMN_FIELDS, ...requested]));
  const nextOrder = normalizeColumnOrder(orderedFields);
  if (nextFields.length < 4 || !tableRef.value) return false;

  visibleColumnFields.value = nextFields;
  orderedColumnFields.value = nextOrder;
  window.localStorage.setItem(COLUMN_SETTING_STORAGE_KEY, JSON.stringify({ visibleFields: nextFields, orderedFields: nextOrder }));
  await nextTick();
  await syncTableColumnPreferences(nextFields, nextOrder);
  Message.success(t('queryScenario.messages.columnsApplied'));
  return true;
};

onMounted(async () => {
  await nextTick();
  await syncTableColumnPreferences(visibleColumnFields.value, orderedColumnFields.value);
});

const handleRefresh = () => {
  if (refreshing.value || querying.value) return;
  refreshing.value = true;
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshing.value = false;
    Message.success(t('queryScenario.messages.refreshed'));
  }, 320);
};

const updateRowStatus = (row: ScenarioRow) => {
  const next = NEXT_STATUS[row.statusKey] ?? NEXT_STATUS.booking;
  row.statusKey = next.key;
  row.statusTone = next.tone;
  row.orderStatus = t(`queryScenario.statuses.${next.key}`);
  Message.success(t('queryScenario.messages.statusUpdated', { orderNo: row.orderNo, status: row.orderStatus }));
};

const assignRowToMe = (row: ScenarioRow) => {
  row.owner = CURRENT_ACCEPTANCE_OPERATOR;
  Message.success(t('queryScenario.messages.assigned', { orderNo: row.orderNo, owner: row.owner }));
};

const cloneValue = (value: string | string[]) => Array.isArray(value) ? [...value] : value;

const resetValues = () => {
  for (const field of SCENARIO_FIELDS) queryValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
  appliedValues.value = {};
  expanded.value = false;
  page.current = 1;
};

const handleSearch = () => {
  querying.value = true;
  appliedValues.value = Object.fromEntries(Object.entries(queryValues).map(([key, value]) => [key, cloneValue(value)]));
  page.current = 1;
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => { querying.value = false; }, 160);
};

const openAdvanced = () => {
  for (const field of responsiveSecondaryFields.value) draftValues[field.key] = cloneValue(queryValues[field.key]);
  drawerVisible.value = true;
};

const clearAdvancedDraft = () => {
  for (const field of responsiveSecondaryFields.value) draftValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
};

const applyAdvanced = () => {
  for (const field of responsiveSecondaryFields.value) queryValues[field.key] = cloneValue(draftValues[field.key]);
  drawerVisible.value = false;
  handleSearch();
};

const scrollToAdvancedGroup = (id: string) => {
  wideFilterEditor.value?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const onScenarioChange = (value: string | number | boolean) => {
  const next = QUERY_SCENARIOS.find((item) => item.key === value);
  if (next) router.push({ name: next.routeName });
};

watch(() => props.initialScenario, (value) => {
  activeScenarioKey.value = value;
  drawerVisible.value = false;
  expanded.value = false;
  resetValues();
});

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer);
  window.clearTimeout(refreshTimer);
});

</script>

<template>
  <StandardListFrame
    page-id="ui-acceptance-query-scenarios"
    data-pesdp-page="ui-acceptance-query-scenarios"
    :command-visible="currentScenario.total > 0"
  >
    <template #pageMode>
      <div class="scenario-switcher">
        <a-select :model-value="activeScenarioKey" size="small" :aria-label="t('queryScenario.aria')" @change="onScenarioChange">
          <a-option v-for="scenario in QUERY_SCENARIOS" :key="scenario.key" :value="scenario.key">
            {{ t(scenario.labelKey) }}
          </a-option>
        </a-select>
        <span class="scenario-count">{{ t('common.totalFields', { count: currentScenario.total }) }}</span>
      </div>
    </template>

    <template #query>
        <a-form :model="queryValues" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
          <QueryFieldGrid @track-count-change="primaryGridTrackCount = $event">
            <QueryFieldCol v-for="field in permanentVisibleFields" :key="field.key" :role="field.width">
              <ScenarioFieldControl v-model="queryValues[field.key]" v-model:keyword-type="keywordType" :field="field" @submit="handleSearch" />
            </QueryFieldCol>
            <QueryFieldCol v-for="field in promotedSecondaryFields" :key="field.key" :role="field.width">
              <ScenarioFieldControl v-model="queryValues[field.key]" :field="field" @submit="handleSearch" />
            </QueryFieldCol>
            <QueryFieldCol :role="actionColumnRole">
              <div class="query-actions">
                <a-button size="small" type="primary" :loading="querying" @click="handleSearch">
                  <template #icon><icon-search /></template>{{ t('common.search') }}
                </a-button>
                <a-button size="small" type="text" @click="resetValues">{{ t('common.reset') }}</a-button>
                <a-tooltip v-if="isExpandScenario" :content="expanded ? t('common.collapse') : t('common.expand', { count: collapsibleSecondaryFields.length })">
                  <a-badge :count="hiddenActiveCount" :offset="[-2, 2]">
                    <a-button size="small" type="text" class="filter-expand-action" :aria-label="expanded ? t('common.collapse') : t('common.expand', { count: collapsibleSecondaryFields.length })" @click="expanded = !expanded">
                      <span class="expand-action-label">{{ expanded ? t('common.collapse') : t('common.expand', { count: collapsibleSecondaryFields.length }) }}</span><icon-down />
                    </a-button>
                  </a-badge>
                </a-tooltip>
                <a-badge v-if="isDrawerScenario" :count="activeAdvancedCount" :offset="[-3, 3]">
                  <a-button size="small" type="text" :aria-label="t('common.moreFilters')" @click="openAdvanced">
                    <template #icon><icon-filter /></template>{{ t('common.filter') }}
                  </a-button>
                </a-badge>
              </div>
            </QueryFieldCol>
          </QueryFieldGrid>

          <QueryFieldGrid v-if="isExpandScenario && expanded" class="expanded-query-grid">
            <QueryFieldCol v-for="field in collapsibleSecondaryFields" :key="field.key" :role="field.width">
              <ScenarioFieldControl v-model="queryValues[field.key]" :field="field" @submit="handleSearch" />
            </QueryFieldCol>
          </QueryFieldGrid>
        </a-form>
    </template>

    <template #toolbar>
      <WorkbenchTableToolbar
        :current="page.current"
        :page-size="page.size"
        :total="filteredRows.length"
        :page-size-options="[10, 20, 50]"
        @change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #utilities>
          <a-tooltip :content="t('common.refresh')">
            <a-button
              size="small"
              type="text"
              class="table-cap-tool"
              :title="t('common.refresh')"
              :aria-label="t('common.refresh')"
              :loading="refreshing"
              :disabled="querying"
              @click="handleRefresh"
            >
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <WorkbenchColumnSettings
            :model-value="visibleColumnFields"
            :order-value="orderedColumnFields"
            :default-value="DEFAULT_VISIBLE_COLUMN_FIELDS"
            :options="columnSettingOptions"
            :minimum="4"
            :disabled="querying || refreshing"
            :on-before-apply="applyColumnSettings"
          />
        </template>
      </WorkbenchTableToolbar>
    </template>

    <template #table>
        <vxe-table
          ref="tableRef"
          id="ui-acceptance-query-results"
          :data="pagedRows"
          :loading="querying || refreshing"
          height="100%"
          auto-resize
          fit
          show-overflow="title"
          :column-config="{ resizable: true }"
          :custom-config="{ storage: true }"
          :row-config="stableTableRowConfig"
          :seq-config="{ startIndex: (page.current - 1) * page.size }"
        >
          <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />
          <vxe-column field="orderNo" :title="t('queryScenario.columns.orderNo')" min-width="160" fixed="left" class-name="mono" :visible="isColumnVisible('orderNo')" />
          <vxe-column field="orderStatus" :title="t('queryScenario.columns.status')" :min-width="STATUS_COLUMN_MIN_WIDTH" :visible="isColumnVisible('orderStatus')">
            <template #default="{ row }"><span class="s-pill" :data-s="row.statusTone">{{ t(`queryScenario.statuses.${row.statusKey}`) }}</span></template>
          </vxe-column>
          <vxe-column field="customerName" :title="t('queryScenario.columns.customer')" min-width="200" :visible="isColumnVisible('customerName')" />
          <vxe-column field="businessType" :title="t('queryScenario.columns.businessType')" min-width="96" :visible="isColumnVisible('businessType')" />
          <vxe-column field="owner" :title="t('queryScenario.columns.owner')" min-width="104" :visible="isColumnVisible('owner')" />
          <vxe-column field="updatedAt" :title="t('queryScenario.columns.updatedAt')" min-width="148" class-name="mono" :visible="isColumnVisible('updatedAt')" />
          <vxe-column :title="t('common.operations')" :width="OPERATION_COLUMN_WIDTH" fixed="right" align="left" header-align="center">
            <template #default="{ row }">
              <a-space class="row-actions" :size="2">
                <a-button size="mini" type="text" class="row-action-btn" @click="updateRowStatus(row)">
                  {{ t('queryScenario.actions.updateStatus') }}
                </a-button>
                <a-dropdown trigger="click" position="br">
                  <a-tooltip :content="t('common.moreActions')">
                    <a-button size="mini" type="text" class="row-action-btn row-action-btn--more" :aria-label="t('common.moreActions')">
                      <template #icon><icon-more /></template>
                    </a-button>
                  </a-tooltip>
                  <template #content>
                    <a-doption @click="assignRowToMe(row)">{{ t('queryScenario.actions.assignMe') }}</a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </vxe-column>
          <template #empty>
            <WorkbenchEmptyState
              kind="empty"
              :title="t('queryScenario.empty.title')"
              :description="t('queryScenario.empty.description')"
            >
              <template #actions>
                <a-button size="small" type="text" @click="resetValues">{{ t('common.reset') }}</a-button>
              </template>
            </WorkbenchEmptyState>
          </template>
        </vxe-table>
    </template>
  </StandardListFrame>

    <a-drawer
      v-if="!isWideDrawer"
      v-model:visible="drawerVisible"
      :title="t('common.moreFilters')"
      data-ui-surface="advanced-filter"
      width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
      :mask-closable="false"
      :esc-to-close="false"
    >
      <a-form :model="draftValues" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
        <section v-for="group in advancedGroups" :key="group.name" class="advanced-section">
          <h3>{{ group.name }}</h3>
          <a-row :gutter="denseFormGridGutter">
            <a-col v-for="field in group.fields" :key="field.key" :span="12" :xs="24" :sm="12">
              <ScenarioFieldControl v-model="draftValues[field.key]" :field="field" />
            </a-col>
          </a-row>
        </section>
      </a-form>
      <template #footer>
        <div class="drawer-footer">
          <a-button size="small" type="text" @click="clearAdvancedDraft">{{ t('common.clearAdvanced') }}</a-button>
          <a-space :size="8"><a-button size="small" @click="drawerVisible = false">{{ t('common.cancel') }}</a-button><a-button size="small" type="primary" @click="applyAdvanced">{{ t('common.apply') }}</a-button></a-space>
        </div>
      </template>
    </a-drawer>

    <a-drawer
      v-else
      v-model:visible="drawerVisible"
      :title="t('common.moreFilters')"
      data-ui-surface="advanced-filter-wide"
      width="min(var(--dense-drawer-w-filter-wide), calc(100vw - var(--dense-drawer-filter-pad)))"
      :mask-closable="false"
      :esc-to-close="false"
    >
      <div class="wide-filter-layout">
        <nav class="wide-filter-nav" :aria-label="t('queryScenario.groupNav')">
          <a-button v-for="group in advancedGroups" :key="group.id" size="small" type="text" @click="scrollToAdvancedGroup(group.id)">
            <span>{{ group.name }}</span><span class="wide-filter-nav__count">{{ group.fields.length }}</span>
          </a-button>
        </nav>
        <div ref="wideFilterEditor" class="wide-filter-editor">
          <a-form :model="draftValues" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
            <section v-for="group in advancedGroups" :id="group.id" :key="group.name" class="advanced-section">
              <h3>{{ group.name }}（{{ group.fields.length }}）</h3>
              <a-row :gutter="denseFormGridGutter">
                <a-col v-for="field in group.fields" :key="field.key" :span="8" :xs="24" :sm="12" :lg="8">
                  <ScenarioFieldControl v-model="draftValues[field.key]" :field="field" />
                </a-col>
              </a-row>
            </section>
          </a-form>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <a-button size="small" type="text" @click="clearAdvancedDraft">{{ t('common.clearAdvanced') }}</a-button>
          <a-space :size="8"><a-button size="small" @click="drawerVisible = false">{{ t('common.cancel') }}</a-button><a-button size="small" type="primary" @click="applyAdvanced">{{ t('common.apply') }}</a-button></a-space>
        </div>
      </template>
    </a-drawer>
</template>

<style scoped>
.scenario-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scenario-switcher > :first-child {
  width: 220px;
}

.scenario-count {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.expanded-query-grid {
  margin-top: var(--dense-gap-field-row);
}

.advanced-section + .advanced-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-1);
}

.advanced-section h3 {
  margin: 0 0 8px;
  color: var(--color-text-2);
  font-size: var(--dense-font-field);
  font-weight: var(--dense-weight-title);
}

.wide-filter-layout {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  height: calc(100vh - 142px);
  min-height: 360px;
}

.wide-filter-nav {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: 12px 8px;
  overflow: auto;
  background: var(--color-fill-1);
  border-right: 1px solid var(--color-border-1);
}

.wide-filter-nav :deep(.arco-btn) {
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  color: var(--color-text-2);
}

.wide-filter-nav__count {
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
}

.wide-filter-editor {
  min-width: 0;
  padding: 16px 20px 24px;
  overflow: auto;
  scroll-behavior: smooth;
}

@media (max-width: 767px) {
  .wide-filter-layout {
    grid-template-columns: 148px minmax(0, 1fr);
  }

  .wide-filter-nav :deep(.arco-btn) {
    height: auto;
    min-height: 28px;
    white-space: normal;
  }
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}
</style>
