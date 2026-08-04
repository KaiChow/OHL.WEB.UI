<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconRefresh,
  IconDownload,
  IconMore,
  IconInfoCircle,
  IconLock,
  IconEmpty,
} from '@arco-design/web-vue/es/icon';
import { downloadCsvFile, buildTimestampSuffix } from '../../../utils/mock-actions';
import { formatLocalMinute } from '../../../utils/date-time';
import { compactVerticalFormLabelStyle } from '../../../design-system/formLayout';
import QueryFieldCol from '../../../components/workbench/QueryFieldCol.vue';
import QueryFieldGrid from '../../../components/workbench/QueryFieldGrid.vue';
import WorkbenchTableToolbar from '../../../components/workbench/WorkbenchTableToolbar.vue';
import WorkflowStateSelector from '../../../components/workbench/WorkflowStateSelector.vue';
import DetailDrawer from './components/DetailDrawer.vue';
import FormDrawer from './components/FormDrawer.vue';
import { profitReviewRows } from './mockData';
import { REVIEW_STATUS_META, RISK_LEVEL_META, formatOrderAmount, formatMarginRate } from './displayMeta';
import type { ProfitReviewQuery, ProfitReviewRow, ProfitReviewStatus } from './types';
import { resolveProfitReviewUiScenario } from '../featureContracts';

const route = useRoute();
const { t } = useI18n();

const WORKFLOW_STATE_OPTIONS: { key: ProfitReviewStatus; tone?: 'warn' | 'danger' }[] = [
  { key: 'all' },
  { key: 'pending', tone: 'warn' },
  { key: 'reviewing' },
  { key: 'approved' },
  { key: 'rejected', tone: 'danger' },
];

const defaultQuery = (): ProfitReviewQuery => ({
  keyword: '',
  riskLevel: undefined,
  region: undefined,
  owner: undefined,
  updatedRange: [],
});

const cloneQuery = (source: ProfitReviewQuery): ProfitReviewQuery => ({
  ...source,
  updatedRange: [...source.updatedRange],
});

const createRows = () => profitReviewRows
  .map((row) => ({
    ...row,
    riskItems: [...row.riskItems],
    timeline: row.timeline.map((item) => ({ ...item })),
  }))
  .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

const query = reactive<ProfitReviewQuery>(defaultQuery());
const appliedQuery = ref<ProfitReviewQuery>(cloneQuery(defaultQuery()));
const activeWorkflowState = ref<ProfitReviewStatus>('all');
const uiScenario = computed(() => resolveProfitReviewUiScenario(route.query.uiState));
const loading = ref(false);
const querying = ref(false);
const exporting = ref(false);
const loadError = ref('');
const hasSimulatedError = ref(false);
const batchSubmitting = ref(false);
const batchFeedback = ref<{ success: number; failedOrderNos: string[] } | null>(null);
const batchConfirmVisible = ref(false);
const batchError = ref('');
const selectedRows = ref<ProfitReviewRow[]>([]);
const allRows = ref<ProfitReviewRow[]>(createRows());
const tableRef = ref<VxeTableInstance>();
const detailVisible = ref(false);
const detailRow = ref<ProfitReviewRow | null>(null);
const editVisible = ref(false);
const editRow = ref<ProfitReviewRow | null>(null);
const editSubmitting = ref(false);
const editError = ref('');
const rejectTargetRow = ref<ProfitReviewRow | null>(null);
const rejectModalVisible = ref(false);
const rejectSubmitting = ref(false);
const rejectError = ref('');
const deleteTargetRow = ref<ProfitReviewRow | null>(null);
const deleteModalVisible = ref(false);
const deleteSubmitting = ref(false);
const deleteError = ref('');

const page = reactive({ current: 1, size: 50 });

const regionOptions = Array.from(new Set(profitReviewRows.map((row) => row.region)));
const ownerOptions = Array.from(new Set(profitReviewRows.map((row) => row.owner)));

const canOperate = computed(() => uiScenario.value !== 'permission');
const forcedLoading = computed(() => uiScenario.value === 'loading');
const tableError = computed(() => loadError.value);
const tableRowConfig = computed(() => ({ isHover: true, keyField: 'id' }));

const matchText = (value: string, keyword: string) =>
  !keyword.trim() || value.toLowerCase().includes(keyword.trim().toLowerCase());

const matchRange = (value: string, range: string[]) => {
  if (range.length !== 2) return true;
  const [start, end] = range;
  const compared = value.slice(0, 10);
  if (start && compared < start) return false;
  if (end && compared > end) return false;
  return true;
};

const rowMatchesQuery = (row: ProfitReviewRow, q: ProfitReviewQuery) => {
  if (q.keyword.trim() && ![row.orderNo, row.customer].some((value) => matchText(value, q.keyword))) return false;
  if (q.riskLevel && row.riskLevel !== q.riskLevel) return false;
  if (q.region && row.region !== q.region) return false;
  if (q.owner && row.owner !== q.owner) return false;
  if (!matchRange(row.updatedAt, q.updatedRange)) return false;
  return true;
};

const queryBaseRows = computed(() => {
  if (uiScenario.value === 'empty') return [];
  return allRows.value.filter((row) => rowMatchesQuery(row, appliedQuery.value));
});

const filteredRows = computed(() =>
  queryBaseRows.value.filter((row) => activeWorkflowState.value === 'all' || row.reviewStatus === activeWorkflowState.value),
);

const pagedRows = computed(() => {
  if (uiScenario.value === 'permission' || tableError.value) return [];
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const workflowStateOptions = computed(() =>
  WORKFLOW_STATE_OPTIONS.map((state) => ({
    ...state,
    label: t(`profit.status.${state.key}`),
    count: state.key === 'all'
      ? queryBaseRows.value.length
      : queryBaseRows.value.filter((row) => row.reviewStatus === state.key).length,
  })),
);

const selectedCount = computed(() => selectedRows.value.length);
const submittableRows = computed(() => selectedRows.value.filter((row) => row.reviewStatus === 'pending'));

const hasActiveFilter = computed(() => {
  const q = appliedQuery.value;
  return Boolean(
    q.keyword.trim()
    || q.riskLevel
    || q.region
    || q.owner
    || q.updatedRange.length
    || activeWorkflowState.value !== 'all',
  );
});

const tableTotal = computed(() =>
  uiScenario.value === 'permission' || tableError.value ? 0 : filteredRows.value.length,
);

const waitForInteraction = (normalDelay = 280, slowDelay = 1400) => new Promise((resolve) => {
  window.setTimeout(resolve, uiScenario.value === 'slow' ? slowDelay : normalDelay);
});

const touchRow = (row: ProfitReviewRow, timelineLabel: string) => {
  row.updatedAt = formatLocalMinute();
  row.timeline = [{ time: row.updatedAt, label: timelineLabel }, ...row.timeline];
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedRows.value = [];
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
  page.current = 1;
  clearSelection();
};

const onWorkflowStateChange = (key: string | number) => {
  activeWorkflowState.value = key as ProfitReviewStatus;
  page.current = 1;
  clearSelection();
};

const onSelectionChange = () => {
  selectedRows.value = (tableRef.value?.getCheckboxRecords() ?? []) as ProfitReviewRow[];
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

const fetchList = async () => {
  if (uiScenario.value === 'permission') return;
  loadError.value = '';
  loading.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, uiScenario.value === 'slow' ? 1600 : 300));
  if (uiScenario.value === 'error' && !hasSimulatedError.value) {
    loadError.value = t('profit.messages.loadError');
    hasSimulatedError.value = true;
  }
  loading.value = false;
};

const openDetail = (row: ProfitReviewRow) => {
  detailRow.value = row;
  detailVisible.value = true;
};

const openEdit = (row: ProfitReviewRow) => {
  editRow.value = row;
  editError.value = '';
  editVisible.value = true;
};

const handleEditSubmit = async (payload: { reviewNote: string; owner: string }) => {
  const row = editRow.value;
  if (!row || editSubmitting.value) return;
  editSubmitting.value = true;
  editError.value = '';
  await waitForInteraction(260, 1200);
  if (uiScenario.value === 'error') {
    editError.value = t('profit.messages.saveError');
    editSubmitting.value = false;
    Message.error(t('profit.messages.saveFailed', { orderNo: row.orderNo }));
    return;
  }
  row.reviewNote = payload.reviewNote;
  row.owner = payload.owner;
  touchRow(row, t('profit.messages.noteUpdated'));
  editSubmitting.value = false;
  editVisible.value = false;
  Message.success(t('profit.messages.saveSuccess', { orderNo: row.orderNo }));
};

const openBatchConfirm = () => {
  if (!submittableRows.value.length) {
    Message.warning(t('profit.messages.selectPending'));
    return;
  }
  batchError.value = '';
  batchConfirmVisible.value = true;
};

const confirmBatchSubmit = async () => {
  const submittedRows = [...submittableRows.value];
  if (!submittedRows.length || batchSubmitting.value) return false;
  batchSubmitting.value = true;
  batchError.value = '';
  await waitForInteraction(320, 1400);
  const failedRows = uiScenario.value === 'error'
    ? submittedRows
    : uiScenario.value === 'partial'
      ? submittedRows.filter((_, index) => index % 3 === 0)
      : [];
  const failedIds = new Set(failedRows.map((row) => row.id));
  const succeededRows = submittedRows.filter((row) => !failedIds.has(row.id));
  succeededRows.forEach((row) => {
    row.reviewStatus = 'reviewing';
    touchRow(row, t('profit.messages.reviewSubmitted'));
  });

  if (!failedRows.length) {
    batchFeedback.value = null;
    clearSelection();
    batchSubmitting.value = false;
    Message.success(t('profit.messages.batchSuccess', { count: submittedRows.length }));
    return true;
  }

  tableRef.value?.clearCheckboxRow();
  tableRef.value?.setCheckboxRow(failedRows, true);
  selectedRows.value = failedRows;
  batchSubmitting.value = false;
  if (succeededRows.length) {
    batchFeedback.value = { success: succeededRows.length, failedOrderNos: failedRows.map((row) => row.orderNo) };
    Message.warning(t('profit.messages.batchPartial', { success: succeededRows.length, failed: failedRows.length }));
    return true;
  }
  batchError.value = t('profit.messages.batchError');
  Message.error(t('profit.messages.batchErrorCount', { count: failedRows.length }));
  return false;
};

const openRejectConfirm = (row: ProfitReviewRow) => {
  rejectTargetRow.value = row;
  rejectError.value = '';
  rejectModalVisible.value = true;
};

const confirmReject = async () => {
  const row = rejectTargetRow.value;
  if (!row || rejectSubmitting.value) return false;
  rejectSubmitting.value = true;
  rejectError.value = '';
  await waitForInteraction(260, 1200);
  if (uiScenario.value === 'error') {
    rejectError.value = t('profit.messages.rejectError');
    rejectSubmitting.value = false;
    return false;
  }
  row.reviewStatus = 'rejected';
  touchRow(row, t('profit.messages.rejected'));
  rejectSubmitting.value = false;
  Message.success(t('profit.messages.rejectSuccess', { orderNo: row.orderNo }));
  return true;
};

const openDeleteConfirm = (row: ProfitReviewRow) => {
  deleteTargetRow.value = row;
  deleteError.value = '';
  deleteModalVisible.value = true;
};

const confirmDelete = async () => {
  const row = deleteTargetRow.value;
  if (!row || deleteSubmitting.value) return false;
  deleteSubmitting.value = true;
  deleteError.value = '';
  await waitForInteraction(260, 1200);
  if (uiScenario.value === 'error') {
    deleteError.value = t('profit.messages.deleteError');
    deleteSubmitting.value = false;
    return false;
  }
  allRows.value = allRows.value.filter((item) => item.id !== row.id);
  if (detailRow.value?.id === row.id) detailVisible.value = false;
  if (editRow.value?.id === row.id) editVisible.value = false;
  clearSelection();
  deleteSubmitting.value = false;
  Message.success(t('profit.messages.deleteSuccess', { orderNo: row.orderNo }));
  return true;
};

const handleExport = async () => {
  if (exporting.value) return;
  const rows = filteredRows.value;
  if (!rows.length) {
    Message.warning(t('profit.messages.noExport'));
    return;
  }
  exporting.value = true;
  await waitForInteraction(240, 1000);
  downloadCsvFile(
    `${t('profit.messages.exportFile')}-${buildTimestampSuffix()}.csv`,
    [t('profit.columns.orderNo'), t('profit.columns.customer'), t('profit.columns.region'), t('profit.columns.businessLine'), t('profit.columns.owner'), t('profit.columns.amount'), t('profit.columns.margin'), t('profit.columns.risk'), t('profit.columns.reviewStatus'), t('profit.columns.updatedAt')],
    rows.map((row) => [
      row.orderNo,
      row.customer,
      row.region,
      row.businessLine,
      row.owner,
      row.orderAmount,
      formatMarginRate(row.grossMarginRate),
      t(`profit.risk.${row.riskLevel}`),
      t(`profit.status.${row.reviewStatus}`),
      row.updatedAt,
    ]),
  );
  exporting.value = false;
  Message.success(t('profit.messages.exportSuccess', { count: rows.length }));
};

watch(uiScenario, () => {
  allRows.value = createRows();
  batchFeedback.value = null;
  batchConfirmVisible.value = false;
  detailVisible.value = false;
  editVisible.value = false;
  rejectModalVisible.value = false;
  deleteModalVisible.value = false;
  querying.value = false;
  exporting.value = false;
  batchSubmitting.value = false;
  editSubmitting.value = false;
  rejectSubmitting.value = false;
  deleteSubmitting.value = false;
  hasSimulatedError.value = false;
  handleReset();
  fetchList();
}, { immediate: true });
</script>

<template>
  <div class="workbench-page" data-pesdp-page="order-profit-review-workbench">
    <div class="workbench-stack">
      <a-card
        size="small"
        :bordered="true"
        class="workbench-page__command"
        :body-style="{ padding: 0 }"
      >
        <div class="filter-panel">
          <a-form :model="query" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle" class="filter-panel__form">
            <QueryFieldGrid>
              <QueryFieldCol role="standard">
                <a-form-item :label="t('profit.fields.keyword')">
                  <a-input
                    v-model="query.keyword"
                    size="small"
                    allow-clear
                    :placeholder="t('profit.placeholders.keyword')"
                    @press-enter="handleSearch"
                  />
                </a-form-item>
              </QueryFieldCol>
              <QueryFieldCol role="compact">
                <a-form-item :label="t('profit.fields.risk')">
                  <a-select v-model="query.riskLevel" size="small" allow-clear :placeholder="t('profit.placeholders.risk')">
                    <a-option value="high">{{ t('profit.risk.high') }}</a-option>
                    <a-option value="medium">{{ t('profit.risk.medium') }}</a-option>
                    <a-option value="low">{{ t('profit.risk.low') }}</a-option>
                  </a-select>
                </a-form-item>
              </QueryFieldCol>
              <QueryFieldCol role="compact">
                <a-form-item :label="t('profit.fields.region')">
                  <a-select v-model="query.region" size="small" allow-clear :placeholder="t('profit.placeholders.region')">
                    <a-option v-for="region in regionOptions" :key="region" :value="region">{{ region }}</a-option>
                  </a-select>
                </a-form-item>
              </QueryFieldCol>
              <QueryFieldCol role="compact">
                <a-form-item :label="t('profit.fields.owner')">
                  <a-select v-model="query.owner" size="small" allow-clear allow-search :placeholder="t('profit.placeholders.owner')">
                    <a-option v-for="owner in ownerOptions" :key="owner" :value="owner">{{ owner }}</a-option>
                  </a-select>
                </a-form-item>
              </QueryFieldCol>
              <QueryFieldCol role="range">
                <a-form-item :label="t('profit.fields.updatedAt')">
                  <a-range-picker v-model="query.updatedRange" size="small" style="width: 100%" />
                </a-form-item>
              </QueryFieldCol>
              <QueryFieldCol role="actions">
                <div class="filter-panel__actions">
                  <a-button size="small" type="primary" :loading="querying" @click="handleSearch">
                    <template #icon><icon-search /></template>
                    {{ t('common.search') }}
                  </a-button>
                  <a-button size="small" type="text" :title="t('common.reset')" :disabled="querying" @click="handleReset">{{ t('common.reset') }}</a-button>
                </div>
              </QueryFieldCol>
            </QueryFieldGrid>
          </a-form>
        </div>
        <div class="workflow-filter-bar">
          <WorkflowStateSelector
            :model-value="activeWorkflowState"
            :label="t('profit.queueLabel')"
            :show-label="false"
            :options="workflowStateOptions"
            @change="onWorkflowStateChange"
          />
        </div>
      </a-card>

      <a-card
        class="workbench-page__table-host"
        size="small"
        :bordered="true"
        :header-style="{ minHeight: '40px', padding: '0 12px' }"
        :body-style="{ minHeight: 0, padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }"
      >
        <template #title>
          <WorkbenchTableToolbar
            :current="page.current"
            :page-size="page.size"
            :total="tableTotal"
            :page-size-options="[20, 50, 100]"
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #commands>
              <div class="table-cap-start">
                <div v-if="canOperate" class="table-command-group">
                  <a-tooltip :content="submittableRows.length > 0 ? t('profit.actions.submitSelected') : t('profit.actions.selectEligible')">
                    <a-button
                      size="small"
                      type="primary"
                      :disabled="submittableRows.length === 0"
                      :loading="batchSubmitting"
                      @click="openBatchConfirm"
                    >{{ t('profit.actions.batchSubmit') }}</a-button>
                  </a-tooltip>
                  <a-tooltip :content="t('profit.actions.exportCurrent')">
                    <a-button size="small" class="table-command--compact-icon" :aria-label="t('profit.actions.exportCurrent')" :loading="exporting" :disabled="Boolean(tableError)" @click="handleExport">
                      <template #icon><icon-download /></template>
                      <span class="table-command-label--optional">{{ t('common.export') }}</span>
                    </a-button>
                  </a-tooltip>
                </div>
                <template v-if="selectedCount > 0">
                  <span class="selection-tip">{{ t('common.selected', { count: selectedCount }) }}</span>
                  <a-button size="small" type="text" @click="clearSelection">{{ t('common.clear') }}</a-button>
                </template>
              </div>
            </template>
            <template #utilities>
              <a-tooltip :content="t('common.refresh')">
                <a-button size="small" type="text" class="table-cap-tool" :title="t('common.refresh')" :aria-label="t('common.refresh')" :loading="loading || forcedLoading" @click="fetchList">
                  <template #icon><icon-refresh /></template>
                </a-button>
              </a-tooltip>
            </template>
          </WorkbenchTableToolbar>
        </template>

        <a-alert
          v-if="batchFeedback"
          type="warning"
          closable
          class="batch-result-alert"
          @close="batchFeedback = null"
        >
          {{ t('profit.messages.batchAlert', { success: batchFeedback.success, failed: batchFeedback.failedOrderNos.length, orders: batchFeedback.failedOrderNos.join(', ') }) }}
        </a-alert>

        <div class="workbench-table-frame">
          <vxe-table
            ref="tableRef"
            style="width: 100%"
            height="100%"
            auto-resize
            fit
            show-overflow="title"
            :loading="loading || querying || forcedLoading"
            :data="pagedRows"
            :seq-config="{ startIndex: (page.current - 1) * page.size }"
            :column-config="{ resizable: true }"
            :row-config="tableRowConfig"
            :checkbox-config="{ highlight: true }"
            @checkbox-change="onSelectionChange"
            @checkbox-all="onSelectionChange"
          >
            <vxe-column type="checkbox" width="44" fixed="left" />
            <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />

            <vxe-column field="orderNo" :title="t('profit.columns.orderNo')" min-width="150" fixed="left">
              <template #default="{ row }">
                <span class="link-text--strong mono" @click="openDetail(row)">{{ row.orderNo }}</span>
              </template>
            </vxe-column>

            <vxe-column field="reviewStatus" :title="t('profit.columns.reviewStatus')" min-width="112">
              <template #default="{ row }">
                <span class="s-pill" :data-s="REVIEW_STATUS_META[row.reviewStatus as keyof typeof REVIEW_STATUS_META].tone">
                  {{ t(`profit.status.${row.reviewStatus}`) }}
                </span>
              </template>
            </vxe-column>

            <vxe-column field="riskLevel" :title="t('profit.columns.risk')" min-width="96">
              <template #default="{ row }">
                <span class="s-pill" :data-s="RISK_LEVEL_META[row.riskLevel as keyof typeof RISK_LEVEL_META].tone">
                  {{ t(`profit.risk.${row.riskLevel}`) }}
                </span>
              </template>
            </vxe-column>

            <vxe-column field="customer" :title="t('profit.columns.customer')" min-width="160" />
            <vxe-column field="region" :title="t('profit.columns.region')" min-width="82" />
            <vxe-column field="businessLine" :title="t('profit.columns.businessLine')" min-width="96" />
            <vxe-column field="owner" :title="t('profit.columns.owner')" min-width="90" />

            <vxe-column field="orderAmount" :title="t('profit.columns.amount')" min-width="112" align="right">
              <template #default="{ row }">
                <span class="biz-number">{{ formatOrderAmount(row.orderAmount) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="grossMarginRate" :title="t('profit.columns.margin')" min-width="104" align="right">
              <template #default="{ row }">
                <span class="biz-number" :class="{ 'margin-negative': row.grossMarginRate < 0 }">{{ formatMarginRate(row.grossMarginRate) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="updatedAt" :title="t('profit.columns.updatedAt')" min-width="140" class-name="mono" />

            <vxe-column :title="t('common.operations')" width="132" fixed="right" align="left" header-align="center">
              <template #default="{ row }">
                <a-space class="row-actions" :size="2">
                  <a-button
                    v-if="canOperate"
                    size="mini"
                    type="text"
                    class="row-action-btn"
                    @click="openEdit(row)"
                  >{{ t('common.edit') }}</a-button>
                  <a-dropdown
                    v-if="canOperate && ['pending', 'reviewing', 'rejected'].includes(row.reviewStatus)"
                    trigger="click"
                    position="br"
                  >
                    <a-tooltip :content="t('common.moreActions')">
                      <a-button
                        size="mini"
                        type="text"
                        class="row-action-btn row-action-btn--more"
                        :aria-label="t('common.moreActions')"
                      >
                        <icon-more />
                      </a-button>
                    </a-tooltip>
                    <template #content>
                      <a-doption v-if="['pending', 'reviewing'].includes(row.reviewStatus)" @click="openRejectConfirm(row)">{{ t('profit.actions.reject') }}</a-doption>
                      <a-divider
                        v-if="['pending', 'reviewing'].includes(row.reviewStatus) && ['pending', 'rejected'].includes(row.reviewStatus)"
                        :margin="4"
                      />
                      <a-doption v-if="['pending', 'rejected'].includes(row.reviewStatus)" class="danger-opt" @click="openDeleteConfirm(row)">{{ t('profit.actions.deleteRecord') }}</a-doption>
                    </template>
                  </a-dropdown>
                </a-space>
              </template>
            </vxe-column>

            <template #empty>
              <div class="workbench-empty">
                <icon-lock v-if="uiScenario === 'permission'" class="workbench-empty__icon" />
                <icon-info-circle v-else-if="tableError" class="workbench-empty__icon" />
                <icon-empty v-else class="workbench-empty__icon" />
                <div class="workbench-empty__title">
                  {{ uiScenario === 'permission'
                    ? t('profit.empty.permissionTitle')
                    : tableError
                      ? t('profit.empty.errorTitle')
                      : hasActiveFilter ? t('profit.empty.filteredTitle') : t('profit.empty.defaultTitle') }}
                </div>
                <div class="workbench-empty__desc">
                  {{ uiScenario === 'permission'
                    ? t('profit.empty.permissionDesc')
                    : tableError
                      ? tableError
                      : hasActiveFilter ? t('profit.empty.filteredDesc') : t('profit.empty.defaultDesc') }}
                </div>
                <div class="workbench-empty__actions">
                  <a-button v-if="tableError" size="small" type="primary" @click="fetchList">{{ t('profit.actions.retry') }}</a-button>
                  <a-button v-else-if="hasActiveFilter && uiScenario !== 'permission'" size="small" type="text" @click="handleReset">{{ t('profit.actions.resetFilter') }}</a-button>
                </div>
              </div>
            </template>
          </vxe-table>
        </div>
      </a-card>
    </div>

    <DetailDrawer v-model:visible="detailVisible" :row="detailRow" />

    <FormDrawer
      v-model:visible="editVisible"
      :row="editRow"
      :submitting="editSubmitting"
      :server-error="editError"
      :owner-options="ownerOptions"
      @submit="handleEditSubmit"
    />

    <a-modal
      v-model:visible="batchConfirmVisible"
      :title="t('profit.modal.batchTitle')"
      :width="420"
      :mask-closable="false"
      :ok-text="t('profit.modal.batchOk')"
      :ok-loading="batchSubmitting"
      :ok-button-props="{ size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmBatchSubmit"
    >
      <p class="modal-confirm-copy">{{ t('profit.modal.batchCopy', { count: submittableRows.length }) }}</p>
      <p class="modal-order-list mono">{{ submittableRows.map((row) => row.orderNo).join('、') }}</p>
      <a-alert v-if="batchError" type="error">{{ batchError }}</a-alert>
    </a-modal>

    <a-modal
      v-model:visible="rejectModalVisible"
      :title="t('profit.modal.rejectTitle')"
      :width="420"
      :mask-closable="false"
      :ok-text="t('profit.modal.rejectOk')"
      :ok-loading="rejectSubmitting"
      :ok-button-props="{ status: 'danger', size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmReject"
    >
      <p class="modal-confirm-copy">{{ t('profit.modal.rejectCopy', { orderNo: rejectTargetRow?.orderNo }) }}</p>
      <a-alert v-if="rejectError" type="error">{{ rejectError }}</a-alert>
    </a-modal>

    <a-modal
      v-model:visible="deleteModalVisible"
      :title="t('profit.modal.deleteTitle')"
      :width="420"
      :mask-closable="false"
      :ok-text="t('profit.modal.deleteOk')"
      :ok-loading="deleteSubmitting"
      :ok-button-props="{ status: 'danger', size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmDelete"
    >
      <p class="modal-confirm-copy">{{ t('profit.modal.deleteCopy', { orderNo: deleteTargetRow?.orderNo }) }}</p>
      <a-alert v-if="deleteError" type="error">{{ deleteError }}</a-alert>
    </a-modal>
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

.workbench-stack {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.filter-panel {
  padding: 10px 12px 8px;
}

.filter-panel__form {
  width: 100%;
}

.filter-panel__form :deep(.arco-form-item) {
  margin-bottom: 0;
}

.filter-panel__actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding-bottom: 1px;
  white-space: nowrap;
}

.workflow-filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 42px;
  padding: 0 12px;
  border-top: 1px solid var(--color-border-1);
}

.table-command-group {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.workbench-page__table-host {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
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

.table-cap-start {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.table-cap-tool {
  color: var(--color-text-3);
}

.selection-tip {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
}

.margin-negative {
  color: var(--dense-danger-7);
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

.modal-confirm-copy {
  margin: 0 0 12px;
  color: var(--color-text-2);
  line-height: 20px;
}

.modal-order-list {
  margin: 0 0 12px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 18px;
  word-break: break-all;
}

</style>
