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
  IconExclamationCircle,
  IconInfoCircle,
  IconMore,
  IconSettings,
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

type QueueKey = 'all' | 'mine' | 'todayNew' | 'overdue' | 'exception';

interface QueueStat {
  key: QueueKey;
  label: string;
  hint: string;
  count: number;
  tone?: 'warn' | 'danger' | 'primary' | 'success';
}

const router = useRouter();

const CURRENT_OPERATOR = '张操作';

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

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const appliedQuery = ref<ShipmentOrderQuery>(cloneQuery(defaultQuery()));
const activeQueue = ref<QueueKey>('all');
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

const page = reactive({ current: 1, size: 50 });

const operatorOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.operator)));
const carrierOptions = Array.from(new Set(shipmentWorkbenchRows.map((row) => row.carrier)));

const matchText = (value: string, keyword: string) =>
  !keyword.trim() || value.toLowerCase().includes(keyword.trim().toLowerCase());

const getRowsByQueue = (rows: ShipmentWorkbenchRow[], queue: QueueKey) => {
  switch (queue) {
    case 'mine':
      return rows.filter((row) => row.operator === CURRENT_OPERATOR);
    case 'todayNew':
      return rows.filter((row) => row.todayNew);
    case 'overdue':
      return rows.filter((row) => row.isOverdue);
    case 'exception':
      return rows.filter((row) => row.exceptionStatus === 'open');
    case 'all':
    default:
      return rows;
  }
};

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

const queueStats = computed<QueueStat[]>(() => [
  { key: 'all', label: '全部在手', hint: '当前工作集', count: queryBaseRows.value.length, tone: 'primary' },
  { key: 'todayNew', label: '今日新单', hint: '待接续处理', count: getRowsByQueue(queryBaseRows.value, 'todayNew').length },
  { key: 'mine', label: '我的跟进', hint: '个人作业盘', count: getRowsByQueue(queryBaseRows.value, 'mine').length, tone: 'success' },
  { key: 'overdue', label: '超期关注', hint: '节点已超时', count: getRowsByQueue(queryBaseRows.value, 'overdue').length, tone: 'warn' },
  { key: 'exception', label: '异常优先', hint: '阻塞待清理', count: getRowsByQueue(queryBaseRows.value, 'exception').length, tone: 'danger' },
]);

const queueRows = computed(() => getRowsByQueue(queryBaseRows.value, activeQueue.value));

const filteredRows = computed(() =>
  queueRows.value.filter((row) => activeStatusTab.value === 'all' || row.quickStatus.includes(activeStatusTab.value)),
);

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const statusTabStats = computed<StatusTabStat[]>(() =>
  STATUS_TABS.map((tab) => {
    const rows = tab.key === 'all'
      ? queueRows.value
      : queueRows.value.filter((row) => row.quickStatus.includes(tab.key));

    return {
      key: tab.key,
      label: tab.label,
      count: rows.length,
      tone: tab.tone,
    };
  }),
);

const selectedCount = computed(() => selectedRows.value.length);

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

const workbenchNotice = computed(() => {
  const overdue = getRowsByQueue(queryBaseRows.value, 'overdue').length;
  const fileMissing = getRowsByQueue(queryBaseRows.value, 'fileMissing').length;
  const exception = getRowsByQueue(queryBaseRows.value, 'exception').length;

  if (activeQueue.value === 'exception') {
    return {
      tone: 'warn' as const,
      text: `当前聚焦异常优先队列 ${queueRows.value.length} 票，建议先处理状态阻塞与节点异常。`,
    };
  }

  if (activeQueue.value === 'overdue') {
    return {
      tone: 'warn' as const,
      text: `当前聚焦超期关注 ${queueRows.value.length} 票，优先核对截关、报关与文件回传。`,
    };
  }

  if (activeStatusTab.value === 'exception') {
    return {
      tone: 'warn' as const,
      text: `当前状态筛选为异常队列 ${filteredRows.value.length} 票，请优先处理阻塞单。`,
    };
  }

  return {
    tone: 'info' as const,
    text: `当前在手 ${queryBaseRows.value.length} 票，异常 ${exception} 票，超期 ${overdue} 票，缺文件 ${fileMissing} 票。`,
  };
});

const getQueueValueClass = (tone?: QueueStat['tone']) => ({
  'lkb-val--primary': tone === 'primary',
  'lkb-val--success': tone === 'success',
  'lkb-val--warn': tone === 'warn',
  'lkb-val--danger': tone === 'danger',
});

const handleSearch = () => {
  appliedQuery.value = cloneQuery(query);
  page.current = 1;
  clearSelection();
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = cloneQuery(defaultQuery());
  activeQueue.value = 'all';
  activeStatusTab.value = 'all';
  advancedFilterVisible.value = false;
  page.current = 1;
  clearSelection();
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

const onQueueChange = (key: QueueKey) => {
  activeQueue.value = key;
  activeStatusTab.value = 'all';
  page.current = 1;
  clearSelection();
};

const onStatusTabClick = (key: ShipmentStatusKey) => {
  activeStatusTab.value = key;
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
  (tableRef.value as (VxeTableInstance & { openCustom?: () => void }) | undefined)?.openCustom?.();
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
  statusForm.notify = true;
  statusForm.createNode = true;
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

const voidOrder = (row: ShipmentWorkbenchRow) => {
  Message.success(`订单 ${row.orderNo} 已作废`);
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
  <div class="page-root page-root--dense">
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">单号检索</label>
          <div class="filter-combo arco-input-group">
            <a-select
              v-model="query.keywordType"
              size="small"
              class="filter-combo__select filter-combo--keyword"
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
          </div>
        </div>

        <div class="filter-field">
          <label class="filter-field__label">客户名称</label>
          <a-input
            v-model="query.customerName"
            size="small"
            allow-clear
            placeholder="请输入客户名称"
            @press-enter="handleSearch"
          />
        </div>

        <div class="filter-field">
          <label class="filter-field__label">起运港</label>
          <a-input
            v-model="query.pol"
            size="small"
            allow-clear
            placeholder="请输入起运港"
            @press-enter="handleSearch"
          />
        </div>

        <div class="filter-field">
          <label class="filter-field__label">目的港</label>
          <a-input
            v-model="query.pod"
            size="small"
            allow-clear
            placeholder="请输入目的港"
            @press-enter="handleSearch"
          />
        </div>

        <div class="filter-field">
          <label class="filter-field__label">船公司</label>
          <a-select v-model="query.carrier" size="small" allow-clear placeholder="请选择船公司">
            <a-option v-for="carrier in carrierOptions" :key="carrier" :value="carrier">
              {{ carrier }}
            </a-option>
          </a-select>
        </div>

        <div class="filter-card__inline-actions">
          <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          <a-badge :count="advancedActiveCount" :offset="[-4, 4]">
            <a-button size="small" type="text" class="reset-btn" @click="advancedFilterVisible = true">
              <template #icon><icon-filter /></template>
              筛选
            </a-button>
          </a-badge>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="shipment-queue-strip">
        <button
          v-for="queue in queueStats"
          :key="queue.key"
          type="button"
          class="shipment-queue-card"
          :class="{ 'shipment-queue-card--active': activeQueue === queue.key }"
          @click="onQueueChange(queue.key)"
        >
          <span class="shipment-queue-card__label">{{ queue.label }}</span>
          <span class="shipment-queue-card__value" :class="getQueueValueClass(queue.tone)">{{ queue.count }}</span>
          <span class="shipment-queue-card__hint">{{ queue.hint }}</span>
        </button>
      </div>

      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" type="primary">
            <template #icon><icon-plus /></template>
            新增订单
          </a-button>

          <div class="toolbar-divider" />

          <a-button size="small" type="outline">批量导入</a-button>
          <a-button size="small" type="outline" @click="handleExport">
            <template #icon><icon-download /></template>
            导出
          </a-button>

          <div class="toolbar-divider" />

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

        <div class="bar-sep" />

        <div class="workbench-notice-group">
          <div
            class="workbench-notice"
            :class="workbenchNotice.tone === 'warn' ? 'workbench-notice--warn' : 'workbench-notice--info'"
          >
            <span class="workbench-notice__icon">
              <icon-exclamation-circle v-if="workbenchNotice.tone === 'warn'" />
              <icon-info-circle v-else />
            </span>
            <span class="workbench-notice__text">{{ workbenchNotice.text }}</span>
          </div>
        </div>

        <div class="bar-sep" />

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
            :page-size-options="[20, 50, 100, 200]"
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
          class="compact workbench-table"
          size="small"
          height="100%"
          border="none"
          show-overflow="title"
          :loading="loading"
          :data="pagedRows"
          :custom-config="{ storage: true, storageKey: 'shipment-export-orders-columns' }"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onSelectionChange"
          @checkbox-all="onSelectionChange"
        >
          <vxe-column type="checkbox" width="44" fixed="left" />

          <vxe-column field="orderNo" title="业务单号" min-width="220" fixed="left">
            <template #default="{ row }">
              <div class="cell-two-line">
                <span class="c2-main">
                  <span class="link-text link-text--strong mono" @click="openDetailDrawer(row)">{{ row.orderNo }}</span>
                </span>
                <span class="c2-sub mono">{{ getOrderAuxText(row) }}</span>
              </div>
            </template>
          </vxe-column>

          <vxe-column field="orderStatusLabel" title="订单状态" min-width="92" fixed="left" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.statusPill">{{ row.orderStatusLabel }}</span>
            </template>
          </vxe-column>

          <vxe-column field="customerName" title="客户信息" min-width="190">
            <template #default="{ row }">
              <div class="cell-two-line">
                <span class="c2-main">{{ row.customerName }}</span>
                <span class="c2-sub">业务类型 {{ row.businessType }}</span>
              </div>
            </template>
          </vxe-column>

          <vxe-column title="航程信息" min-width="220">
            <template #default="{ row }">
              <div class="cell-two-line">
                <span class="c2-main mono">{{ row.pol }} -> {{ row.pod }}</span>
                <span class="c2-sub">{{ row.carrier }} / {{ row.vesselVoyage }}</span>
              </div>
            </template>
          </vxe-column>

          <vxe-column title="节点时间" min-width="170">
            <template #default="{ row }">
              <div class="cell-two-line">
                <span class="c2-main mono">ETD {{ row.etd }}</span>
                <span class="c2-sub mono">截关 {{ row.closingTime }}</span>
              </div>
            </template>
          </vxe-column>

          <vxe-column field="containerSummary" title="柜型柜量" min-width="100" align="center" />

          <vxe-column title="当前待办" min-width="170">
            <template #default="{ row }">
              <div class="cell-two-line">
                <span class="c2-main">{{ getNextActionLabel(row) }}</span>
                <span class="c2-sub">{{ getNextActionMeta(row) }}</span>
              </div>
            </template>
          </vxe-column>

          <vxe-column title="跟进信息" min-width="150">
            <template #default="{ row }">
              <div class="cell-two-line">
                <span class="c2-main">{{ row.operator }}</span>
                <span class="c2-sub mono">{{ row.updatedAt }}</span>
              </div>
            </template>
          </vxe-column>

          <vxe-column title="执行缺口" min-width="164">
            <template #default="{ row }">
              <div class="cell-pill-row">
                <span
                  v-for="signal in getExecutionSignals(row)"
                  :key="signal.label"
                  class="s-pill"
                  :data-s="signal.tone"
                >
                  {{ signal.label }}
                </span>
              </div>
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
                    <a-doption @click="openFullDetail(row.orderNo)">编辑</a-doption>
                    <a-doption @click="openStatusModal(row)">修改状态</a-doption>
                    <a-doption>分配操作员</a-doption>
                    <a-doption>生成费用</a-doption>
                    <a-doption>上传文件</a-doption>
                    <a-doption @click="handleRowNotify(row)">发送通知</a-doption>
                    <a-doption>查看日志</a-doption>
                    <a-divider class="action-menu__divider" />
                    <a-popconfirm content="确认作废该订单？此操作不可撤销。" @ok="voidOrder(row)">
                      <a-doption class="danger-opt">作废订单</a-doption>
                    </a-popconfirm>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

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
              <div class="query-filter-drawer__group-head">单证识别</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="船名航次">
                  <a-input v-model="query.vesselVoyage" size="small" allow-clear placeholder="请输入船名 / 航次" />
                </a-form-item>
                <a-form-item label="提单号">
                  <a-input v-model="query.blNo" size="small" allow-clear placeholder="请输入提单号" />
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
                <a-form-item label="操作人员">
                  <a-select v-model="query.operator" size="small" allow-clear placeholder="请选择">
                    <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">
                      {{ operator }}
                    </a-option>
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
              <div class="query-filter-drawer__group-head">航程时间</div>
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
              <div class="query-filter-drawer__group-head">风险与结算</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="文件状态">
                  <a-select v-model="query.fileStatus" size="small" allow-clear placeholder="请选择">
                    <a-option value="missing">缺失</a-option>
                    <a-option value="pending">待确认</a-option>
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
          <a-textarea
            v-model="statusForm.reason"
            size="small"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="请填写修改原因"
          />
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
.shipment-queue-card {
  appearance: none;
  border: none;
  background: transparent;
  text-align: left;
  font: inherit;
}

.shipment-queue-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  background: linear-gradient(180deg, #fbfcfd 0%, #ffffff 100%);
  border-bottom: 1px solid var(--dense-border-subtle);
}

.shipment-queue-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 12px 18px 11px;
  border-right: 1px solid var(--dense-border-subtle);
  cursor: pointer;
  transition: background .16s ease;
}

.shipment-queue-card:last-child {
  border-right: none;
}

.shipment-queue-card:hover {
  background: linear-gradient(180deg, var(--dense-primary-1) 0%, #ffffff 100%);
}

.shipment-queue-card--active {
  background: linear-gradient(180deg, var(--dense-primary-1) 0%, #ffffff 100%);
}

.shipment-queue-card--active::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--dense-primary-6);
}

.shipment-queue-card__label {
  font-size: var(--dense-font-aux);
  font-weight: var(--dense-weight-field);
  color: var(--color-text-3);
  line-height: 1.2;
}

.shipment-queue-card__value {
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-1);
}

.shipment-queue-card__hint {
  font-size: var(--dense-font-micro);
  color: var(--color-text-4);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shipment-queue-card--active .shipment-queue-card__label {
  color: var(--dense-primary-7);
}

.shipment-queue-card--active .shipment-queue-card__hint {
  color: var(--color-text-3);
}

.shipment-queue-card__value.lkb-val--primary {
  color: var(--dense-primary-6);
}

.shipment-queue-card__value.lkb-val--success {
  color: var(--dense-success-7);
}

.shipment-queue-card__value.lkb-val--warn {
  color: var(--dense-warning-7);
}

.shipment-queue-card__value.lkb-val--danger {
  color: var(--dense-danger-7);
}

.xf-grid {
  display: grid;
}

.xf-grid--modal {
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
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
