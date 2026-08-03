<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
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
import DetailDrawer from './components/DetailDrawer.vue';
import FormDrawer from './components/FormDrawer.vue';
import { profitReviewRows } from './mockData';
import { REVIEW_STATUS_META, RISK_LEVEL_META, formatOrderAmount, formatMarginRate } from './displayMeta';
import type { ProfitReviewQuery, ProfitReviewRow, ProfitReviewStatus } from './types';
import { resolveProfitReviewUiScenario } from '../featureContracts';

const route = useRoute();

const STATUS_TABS: { key: ProfitReviewStatus; label: string; tone?: 'warn' | 'danger' }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待核查', tone: 'warn' },
  { key: 'reviewing', label: '复核中' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已驳回', tone: 'danger' },
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
const activeStatusTab = ref<ProfitReviewStatus>('all');
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
  queryBaseRows.value.filter((row) => activeStatusTab.value === 'all' || row.reviewStatus === activeStatusTab.value),
);

const pagedRows = computed(() => {
  if (uiScenario.value === 'permission' || tableError.value) return [];
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const statusTabStats = computed(() =>
  STATUS_TABS.map((tab) => ({
    ...tab,
    count: tab.key === 'all'
      ? queryBaseRows.value.length
      : queryBaseRows.value.filter((row) => row.reviewStatus === tab.key).length,
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
    || activeStatusTab.value !== 'all',
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
  activeStatusTab.value = 'all';
  page.current = 1;
  clearSelection();
};

const onStatusTabChange = (key: string | number) => {
  activeStatusTab.value = key as ProfitReviewStatus;
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
    loadError.value = '订单利润核查数据加载失败，请检查网络后重试。';
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
    editError.value = '保存失败，输入内容已保留，请重试。';
    editSubmitting.value = false;
    Message.error(`订单 ${row.orderNo} 核查说明保存失败，请重试`);
    return;
  }
  row.reviewNote = payload.reviewNote;
  row.owner = payload.owner;
  touchRow(row, '核查说明已更新');
  editSubmitting.value = false;
  editVisible.value = false;
  Message.success(`订单 ${row.orderNo} 核查信息已保存`);
};

const openBatchConfirm = () => {
  if (!submittableRows.value.length) {
    Message.warning('请先选择待核查订单');
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
    touchRow(row, '复核已提交');
  });

  if (!failedRows.length) {
    batchFeedback.value = null;
    clearSelection();
    batchSubmitting.value = false;
    Message.success(`已提交复核 ${submittedRows.length} 条`);
    return true;
  }

  tableRef.value?.clearCheckboxRow();
  tableRef.value?.setCheckboxRow(failedRows, true);
  selectedRows.value = failedRows;
  batchSubmitting.value = false;
  if (succeededRows.length) {
    batchFeedback.value = { success: succeededRows.length, failedOrderNos: failedRows.map((row) => row.orderNo) };
    Message.warning(`批量提交复核完成，${succeededRows.length} 条成功，${failedRows.length} 条失败`);
    return true;
  }
  batchError.value = '批量提交复核失败，所选订单已保留选中，请重试。';
  Message.error(`批量提交复核失败，${failedRows.length} 条订单已保留选中`);
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
    rejectError.value = '驳回请求未完成，请确认订单状态后重试。';
    rejectSubmitting.value = false;
    return false;
  }
  row.reviewStatus = 'rejected';
  touchRow(row, '核查已驳回');
  rejectSubmitting.value = false;
  Message.success(`订单 ${row.orderNo} 已驳回`);
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
    deleteError.value = '删除请求未完成，当前列表已保留，请重试。';
    deleteSubmitting.value = false;
    return false;
  }
  allRows.value = allRows.value.filter((item) => item.id !== row.id);
  if (detailRow.value?.id === row.id) detailVisible.value = false;
  if (editRow.value?.id === row.id) editVisible.value = false;
  clearSelection();
  deleteSubmitting.value = false;
  Message.success(`订单 ${row.orderNo} 的核查记录已删除`);
  return true;
};

const handleExport = async () => {
  if (exporting.value) return;
  const rows = filteredRows.value;
  if (!rows.length) {
    Message.warning('当前筛选结果为空，无可导出数据');
    return;
  }
  exporting.value = true;
  await waitForInteraction(240, 1000);
  downloadCsvFile(
    `订单利润核查-${buildTimestampSuffix()}.csv`,
    ['订单号', '客户', '区域', '业务线', '负责人', '订单金额', '毛利率', '风险等级', '核查状态', '更新时间'],
    rows.map((row) => [
      row.orderNo,
      row.customer,
      row.region,
      row.businessLine,
      row.owner,
      row.orderAmount,
      formatMarginRate(row.grossMarginRate),
      RISK_LEVEL_META[row.riskLevel].label,
      REVIEW_STATUS_META[row.reviewStatus].label,
      row.updatedAt,
    ]),
  );
  exporting.value = false;
  Message.success(`已导出 ${rows.length} 条`);
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
          <a-form :model="query" layout="vertical" size="small" class="filter-panel__form">
            <a-row :gutter="[12, 10]" align="end">
              <a-col :xs="24" :sm="12" :md="6" :lg="5" :xl="5">
                <a-form-item label="关键词">
                  <a-input
                    v-model="query.keyword"
                    size="small"
                    allow-clear
                    placeholder="请输入订单号 / 客户"
                    @press-enter="handleSearch"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="6" :lg="4" :xl="3">
                <a-form-item label="风险等级">
                  <a-select v-model="query.riskLevel" size="small" allow-clear placeholder="全部等级">
                    <a-option value="high">高</a-option>
                    <a-option value="medium">中</a-option>
                    <a-option value="low">低</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="6" :lg="4" :xl="3">
                <a-form-item label="区域">
                  <a-select v-model="query.region" size="small" allow-clear placeholder="全部区域">
                    <a-option v-for="region in regionOptions" :key="region" :value="region">{{ region }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="6" :lg="4" :xl="3">
                <a-form-item label="负责人">
                  <a-select v-model="query.owner" size="small" allow-clear allow-search placeholder="全部人员">
                    <a-option v-for="owner in ownerOptions" :key="owner" :value="owner">{{ owner }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="7" :xl="6">
                <a-form-item label="更新时间">
                  <a-range-picker v-model="query.updatedRange" size="small" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="4" class="filter-panel__action-col">
                <div class="filter-panel__actions">
                  <a-button size="small" type="primary" :loading="querying" @click="handleSearch">
                    <template #icon><icon-search /></template>
                    查询
                  </a-button>
                  <a-button size="small" type="text" title="重置查询条件" :disabled="querying" @click="handleReset">重置</a-button>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="flow-bar">
          <div v-if="canOperate" class="flow-bar__actions">
            <a-button
              v-if="submittableRows.length > 0"
              size="small"
              type="primary"
              :loading="batchSubmitting"
              @click="openBatchConfirm"
            >批量提交复核</a-button>
            <a-button size="small" :loading="exporting" :disabled="Boolean(tableError)" @click="handleExport">
              <template #icon><icon-download /></template>
              导出
            </a-button>
          </div>

          <a-divider v-if="canOperate" direction="vertical" class="flow-bar__divider" />

          <div class="flow-bar__queues">
            <span class="flow-bar__queue-label">核查队列</span>
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
          <div class="table-cap-start">
            <a-tooltip content="刷新">
              <a-button size="small" type="text" class="table-cap-tool" title="刷新" aria-label="刷新" :loading="loading || forcedLoading" @click="fetchList">
                <template #icon><icon-refresh /></template>
              </a-button>
            </a-tooltip>
            <span v-if="!tableError && uiScenario !== 'permission'" class="table-sort-context">按更新时间倒序</span>
            <template v-if="selectedCount > 0">
              <span class="selection-tip">已选 <b>{{ selectedCount }}</b> 条</span>
              <a-button size="small" type="text" @click="clearSelection">清空</a-button>
            </template>
          </div>
        </template>
        <template #extra>
          <a-pagination
            :current="page.current"
            :page-size="page.size"
            :total="tableTotal"
            :page-size-options="[20, 50, 100]"
            size="small"
            show-total
            show-page-size
            show-jumper
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
        </template>

        <a-alert
          v-if="batchFeedback"
          type="warning"
          closable
          class="batch-result-alert"
          @close="batchFeedback = null"
        >
          批量提交复核：成功 {{ batchFeedback.success }} 条，失败 {{ batchFeedback.failedOrderNos.length }} 条；失败订单 {{ batchFeedback.failedOrderNos.join('、') }} 已保留选中，可修正后重试。
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
            :column-config="{ resizable: true }"
            :row-config="tableRowConfig"
            :checkbox-config="{ highlight: true }"
            @checkbox-change="onSelectionChange"
            @checkbox-all="onSelectionChange"
          >
            <vxe-column type="checkbox" width="44" fixed="left" />

            <vxe-column field="orderNo" title="订单号" min-width="150" fixed="left">
              <template #default="{ row }">
                <span class="link-text--strong mono" @click="openDetail(row)">{{ row.orderNo }}</span>
              </template>
            </vxe-column>

            <vxe-column field="reviewStatus" title="核查状态" min-width="96">
              <template #default="{ row }">
                <span class="s-pill" :data-s="REVIEW_STATUS_META[row.reviewStatus as keyof typeof REVIEW_STATUS_META].tone">
                  {{ REVIEW_STATUS_META[row.reviewStatus as keyof typeof REVIEW_STATUS_META].label }}
                </span>
              </template>
            </vxe-column>

            <vxe-column field="riskLevel" title="风险等级" min-width="88">
              <template #default="{ row }">
                <span class="s-pill" :data-s="RISK_LEVEL_META[row.riskLevel as keyof typeof RISK_LEVEL_META].tone">
                  {{ RISK_LEVEL_META[row.riskLevel as keyof typeof RISK_LEVEL_META].label }}
                </span>
              </template>
            </vxe-column>

            <vxe-column field="customer" title="客户" min-width="160" />
            <vxe-column field="region" title="区域" min-width="72" />
            <vxe-column field="businessLine" title="业务线" min-width="90" />
            <vxe-column field="owner" title="负责人" min-width="80" />

            <vxe-column field="orderAmount" title="订单金额" min-width="108" align="right">
              <template #default="{ row }">
                <span class="mono">{{ formatOrderAmount(row.orderAmount) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="grossMarginRate" title="毛利率" min-width="96" align="right">
              <template #default="{ row }">
                <span class="mono" :class="{ 'margin-negative': row.grossMarginRate < 0 }">{{ formatMarginRate(row.grossMarginRate) }}</span>
              </template>
            </vxe-column>

            <vxe-column field="updatedAt" title="更新时间" min-width="140" class-name="mono" />

            <vxe-column title="操作" width="120" fixed="right" align="left" header-align="center">
              <template #default="{ row }">
                <a-space class="row-actions" :size="2">
                  <a-button
                    v-if="canOperate"
                    size="mini"
                    type="text"
                    class="row-action-btn"
                    @click="openEdit(row)"
                  >编辑</a-button>
                  <a-dropdown
                    v-if="canOperate && ['pending', 'reviewing', 'rejected'].includes(row.reviewStatus)"
                    trigger="click"
                    position="br"
                  >
                    <a-tooltip content="更多操作">
                      <a-button
                        size="mini"
                        type="text"
                        class="row-action-btn row-action-btn--more"
                        aria-label="更多操作"
                      >
                        <icon-more />
                      </a-button>
                    </a-tooltip>
                    <template #content>
                      <a-doption v-if="['pending', 'reviewing'].includes(row.reviewStatus)" @click="openRejectConfirm(row)">驳回</a-doption>
                      <a-divider
                        v-if="['pending', 'reviewing'].includes(row.reviewStatus) && ['pending', 'rejected'].includes(row.reviewStatus)"
                        :margin="4"
                      />
                      <a-doption v-if="['pending', 'rejected'].includes(row.reviewStatus)" class="danger-opt" @click="openDeleteConfirm(row)">删除记录</a-doption>
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
                    ? '暂无订单利润核查查看权限'
                    : tableError
                      ? '订单利润核查加载失败'
                      : hasActiveFilter ? '未找到匹配的核查订单' : '暂无订单利润核查记录' }}
                </div>
                <div class="workbench-empty__desc">
                  {{ uiScenario === 'permission'
                    ? '请联系管理员开通经营分析模块的数据权限。'
                    : tableError
                      ? tableError
                      : hasActiveFilter ? '请调整查询条件或切换核查队列后重试。' : '当前没有需要核查的订单利润记录。' }}
                </div>
                <div class="workbench-empty__actions">
                  <a-button v-if="tableError" size="small" type="primary" @click="fetchList">重新加载</a-button>
                  <a-button v-else-if="hasActiveFilter && uiScenario !== 'permission'" size="small" type="text" @click="handleReset">重置筛选</a-button>
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
      title="批量提交复核"
      :width="420"
      :mask-closable="false"
      ok-text="确认提交"
      :ok-loading="batchSubmitting"
      :ok-button-props="{ size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmBatchSubmit"
    >
      <p class="modal-confirm-copy">确认将选中的 {{ submittableRows.length }} 条待核查订单提交复核？提交后订单进入「复核中」队列。</p>
      <p class="modal-order-list mono">{{ submittableRows.map((row) => row.orderNo).join('、') }}</p>
      <a-alert v-if="batchError" type="error">{{ batchError }}</a-alert>
    </a-modal>

    <a-modal
      v-model:visible="rejectModalVisible"
      title="驳回核查"
      :width="420"
      :mask-closable="false"
      ok-text="确认驳回"
      :ok-loading="rejectSubmitting"
      :ok-button-props="{ status: 'danger', size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmReject"
    >
      <p class="modal-confirm-copy">确认驳回订单 {{ rejectTargetRow?.orderNo }} 的利润核查？驳回后订单进入「已驳回」队列。</p>
      <a-alert v-if="rejectError" type="error">{{ rejectError }}</a-alert>
    </a-modal>

    <a-modal
      v-model:visible="deleteModalVisible"
      title="删除核查记录"
      :width="420"
      :mask-closable="false"
      ok-text="确认删除"
      :ok-loading="deleteSubmitting"
      :ok-button-props="{ status: 'danger', size: 'small' }"
      :cancel-button-props="{ size: 'small' }"
      :on-before-ok="confirmDelete"
    >
      <p class="modal-confirm-copy">确认删除订单 {{ deleteTargetRow?.orderNo }} 的利润核查记录？此操作不可撤销。</p>
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

.flow-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 42px;
  padding: 0 12px;
  border-top: 1px solid var(--color-border-1);
}

.flow-bar__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.flow-bar__divider {
  flex: 0 0 auto;
  height: 24px;
  margin: 0;
}

.flow-bar__queues {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.flow-bar__queue-label {
  flex: 0 0 auto;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  white-space: nowrap;
}

.workbench-status-tabs {
  flex: 1;
  min-width: 0;
}

.workbench-status-tabs :deep(.arco-tabs-content) {
  display: none;
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

.table-sort-context {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  white-space: nowrap;
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

@media (max-width: 1279px) {
  .flow-bar__queue-label {
    display: none;
  }
}
</style>
