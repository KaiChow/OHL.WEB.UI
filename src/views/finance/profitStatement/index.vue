<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconRefresh,
  IconSettings,
  IconDownload,
  IconDown,
  IconEye,
  IconCopy,
  IconUp,
} from '@arco-design/web-vue/es/icon';
import ProfitDetailDrawer from './ProfitDetailDrawer.vue';
import { mockProfitRows } from './mockData';
import type { ProfitQuery, ProfitRecord } from './types';
import { buildTimestampSuffix, copyTextToClipboard, downloadCsvFile, downloadTextFile } from '../../../utils/mock-actions';

const defaultQuery = (): ProfitQuery => ({
  noType: 'orderNo',
  keyword: '',
  customer: '',
  company: '',
  etdRange: [],
  etaRange: [],
  orderStatus: undefined,
  businessType: undefined,
  containerNo: '',
  fobCs: undefined,
  docCs: undefined,
  placeOfReceipt: undefined,
});

const COLLAPSED_FIELD_COUNT = 4;
const FILTER_EXPAND_STORAGE_KEY = 'ohl-filter-expanded:finance-profit-statement';

const readFilterExpanded = () => {
  try {
    return localStorage.getItem(FILTER_EXPAND_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const query = reactive<ProfitQuery>(defaultQuery());
const appliedQuery = ref<ProfitQuery>(defaultQuery());
const filterExpanded = ref(readFilterExpanded());
const loading = ref(false);
const allRows = ref<ProfitRecord[]>([...mockProfitRows]);
const tableRef = ref<VxeTableInstance>();
const selectedIds = ref<string[]>([]);
const detailVisible = ref(false);
const currentRow = ref<ProfitRecord | null>(null);

const page = reactive({ current: 1, size: 100, total: 0 });

const formatAmount = (n: number) =>
  n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inDateRange = (value: string, range: string[]) => {
  if (range.length !== 2) return true;
  return value >= range[0] && value <= range[1];
};

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (q.keyword) {
      const field =
        q.noType === 'orderNo' ? row.orderNo : q.noType === 'mbl' ? row.mbl : row.containerSummary;
      if (!field.includes(q.keyword)) return false;
    }
    if (q.customer && !row.customer.includes(q.customer)) return false;
    if (q.company && row.company !== q.company) return false;
    if (q.orderStatus && row.orderStatusKey !== q.orderStatus) return false;
    if (q.businessType && row.businessScope !== q.businessType) return false;
    if (q.containerNo && !row.containerSummary.includes(q.containerNo)) return false;
    if (q.fobCs && row.fobCs !== q.fobCs) return false;
    if (q.docCs && row.docCs !== q.docCs) return false;
    if (q.placeOfReceipt && !row.placeOfReceipt.includes(q.placeOfReceipt)) return false;
    if (!inDateRange(row.etd, q.etdRange)) return false;
    if (!inDateRange(row.eta, q.etaRange)) return false;
    return true;
  });
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const selectedCount = computed(() => selectedIds.value.length);

const collapsedActiveCount = computed(() => {
  let n = 0;
  if (query.containerNo.trim()) n += 1;
  if (query.fobCs) n += 1;
  if (query.docCs) n += 1;
  if (query.placeOfReceipt?.trim()) n += 1;
  return n;
});

const toggleFilterExpanded = () => {
  filterExpanded.value = !filterExpanded.value;
  try {
    localStorage.setItem(FILTER_EXPAND_STORAGE_KEY, filterExpanded.value ? '1' : '0');
  } catch {
    /* ignore */
  }
};

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
  appliedQuery.value = {
    ...query,
    etdRange: [...query.etdRange],
    etaRange: [...query.etaRange],
  };
  page.current = 1;
  fetchList();
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = defaultQuery();
  page.current = 1;
  fetchList();
};

const onCheckboxChange = ({ records }: { records: ProfitRecord[] }) => {
  selectedIds.value = records.map((r) => r.Id);
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedIds.value = [];
};

const getSelectedRows = () => allRows.value.filter((row) => selectedIds.value.includes(row.Id));

const handleCopySelected = async () => {
  if (!selectedIds.value.length) {
    Message.warning('请先勾选记录');
    return;
  }
  const selectedOrderNos = getSelectedRows().map((row) => row.orderNo).join('\n');
  await copyTextToClipboard(selectedOrderNos);
  Message.success(`已复制 ${selectedIds.value.length} 个订单号`);
};

const handleExport = () => {
  downloadCsvFile(
    `利润台账-${buildTimestampSuffix()}.csv`,
    ['订单编号', '客户', '所属公司', '业务范围', 'MBL', '运输方式', '真实利润', '真实预估', '销售额', '币种', '订单状态', '开票状态'],
    filteredRows.value.map((row) => [
      row.orderNo,
      row.customer,
      row.company,
      row.businessScope,
      row.mbl,
      row.transportMode,
      row.realProfit,
      row.realEstimate,
      row.salesAmount,
      row.currency,
      row.orderStatus,
      row.invoiceMarked ? '已开票' : '未开票',
    ]),
  );
  Message.success(`已导出 ${filteredRows.value.length} 条利润记录`);
};

const handleGenerateBill = () => {
  if (!selectedIds.value.length) {
    Message.warning('请先勾选记录再生成账单');
    return;
  }
  const lines = getSelectedRows().map(
    (row) =>
      `${row.orderNo} | ${row.customer} | ${row.currency} ${formatAmount(row.salesAmount)} | 状态：${row.orderStatus}`,
  );
  downloadTextFile(
    `代理业务账单草案-${buildTimestampSuffix()}.txt`,
    lines.join('\r\n'),
  );
  Message.success(`已生成 ${selectedIds.value.length} 条账单草案`);
};

const handleInvoiceMark = (invoiceMarked: boolean) => {
  if (!selectedIds.value.length) {
    Message.warning(`请先勾选记录再${invoiceMarked ? '标记已开发票' : '取消标记开票'}`);
    return;
  }
  allRows.value = allRows.value.map((row) =>
    selectedIds.value.includes(row.Id) ? { ...row, invoiceMarked } : row,
  );
  Message.success(invoiceMarked ? '已标记为已开发票' : '已取消开票标记');
  fetchList();
};

const openDetail = (row: ProfitRecord) => {
  currentRow.value = row;
  detailVisible.value = true;
};

const onPageChange = (p: number) => {
  page.current = p;
};

const onPageSizeChange = (s: number) => {
  page.size = s;
  page.current = 1;
  syncPageTotal();
};

fetchList();
</script>

<template>
  <div class="page-root page-root--dense">
    <!-- S2：7 常驻 + 4 项页内展开（共 11 个查询维度） -->
    <div class="zone-l2-filter-card zone-card filter-card filter-card--s2-expand">
      <div class="filter-card__main">
        <div class="filter-card__fields">
          <div class="filter-grid">
            <div class="filter-field filter-field--span2">
              <label class="filter-field__label">单号检索</label>
              <div class="filter-combo arco-input-group">
                <a-select v-model="query.noType" size="small" class="filter-combo__select filter-combo--keyword">
                  <a-option value="orderNo">订单编号</a-option>
                  <a-option value="mbl">MBL 主单号</a-option>
                  <a-option value="containerNo">柜号</a-option>
                </a-select>
                <a-input
                  v-model="query.keyword"
                  size="small"
                  allow-clear
                  placeholder="请输入单号"
                  @press-enter="handleSearch"
                />
              </div>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">客户</label>
              <a-input
                v-model="query.customer"
                size="small"
                allow-clear
                placeholder="请输入客户"
                @press-enter="handleSearch"
              />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">所属公司</label>
              <a-select v-model="query.company" size="small" allow-clear placeholder="请选择">
                <a-option value="深圳点达">深圳点达</a-option>
                <a-option value="上海分公司">上海分公司</a-option>
                <a-option value="宁波办事处">宁波办事处</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">ETD</label>
              <a-range-picker
                v-model="query.etdRange"
                size="small"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">ETA</label>
              <a-range-picker
                v-model="query.etaRange"
                size="small"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">订单状态</label>
              <a-select v-model="query.orderStatus" size="small" allow-clear placeholder="请选择">
                <a-option value="wait">待确认</a-option>
                <a-option value="op">操作中</a-option>
                <a-option value="rel">已放舱</a-option>
                <a-option value="acc">已完成</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">业务类型</label>
              <a-select v-model="query.businessType" size="small" allow-clear placeholder="请选择">
                <a-option value="海运出口">海运出口</a-option>
                <a-option value="海运进口">海运进口</a-option>
                <a-option value="空运出口">空运出口</a-option>
              </a-select>
            </div>
          </div>
          <div class="filter-card__advanced" :class="{ 'filter-card__advanced--open': filterExpanded }">
            <div class="filter-card__advanced-inner">
              <div class="filter-grid filter-grid--advanced">
                <div class="filter-field">
                  <label class="filter-field__label">柜号</label>
                  <a-input
                    v-model="query.containerNo"
                    size="small"
                    allow-clear
                    placeholder="请输入柜号"
                    @press-enter="handleSearch"
                  />
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">FOB 客服</label>
                  <a-select v-model="query.fobCs" size="small" allow-clear placeholder="请选择">
                    <a-option value="zhangsan">zhangsan</a-option>
                    <a-option value="lisi">lisi</a-option>
                  </a-select>
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">单证客服</label>
                  <a-select v-model="query.docCs" size="small" allow-clear placeholder="请选择">
                    <a-option value="wangwu">wangwu</a-option>
                    <a-option value="admin">admin</a-option>
                  </a-select>
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">收货地</label>
                  <a-input
                    v-model="query.placeOfReceipt"
                    size="small"
                    allow-clear
                    placeholder="请输入"
                    @press-enter="handleSearch"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-card__actions-panel">
          <a-button
            size="small"
            type="primary"
            class="filter-card__query-btn"
            title="查询"
            @click="handleSearch"
          >
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" title="重置" @click="handleReset">
            重置
          </a-button>
          <button
            type="button"
            class="filter-expand-link filter-expand-link--panel"
            :class="{ 'is-open': filterExpanded }"
            :title="filterExpanded ? '收起筛选' : `展开筛选(+${COLLAPSED_FIELD_COUNT})`"
            @click="toggleFilterExpanded"
          >
            <icon-down v-if="!filterExpanded" />
            <icon-up v-else />
            <span class="filter-expand-link__text">
              {{ filterExpanded ? '收起' : `展开(+${COLLAPSED_FIELD_COUNT})` }}
            </span>
            <a-badge v-if="!filterExpanded && collapsedActiveCount > 0" :count="collapsedActiveCount" />
          </button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" @click="handleExport">
            <template #icon><icon-download /></template>
            导出
          </a-button>
          <a-button size="small" type="outline" @click="handleGenerateBill">
            生成代理业务账单
          </a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              批量操作
              <icon-down />
            </a-button>
            <template #content>
              <a-doption @click="handleInvoiceMark(true)">标记已开发票</a-doption>
              <a-doption @click="handleInvoiceMark(false)">取消标记开票</a-doption>
            </template>
          </a-dropdown>
          <a-button size="small" type="outline" @click="handleCopySelected">
            <template #icon><icon-copy /></template>
            勾选复制
          </a-button>
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
            <span>已选 {{ selectedCount }} 条</span>
            <a-button size="small" type="text" class="reset-btn" @click="clearSelection">清空</a-button>
          </div>
        </div>
        <div class="table-card-cap__right">
          <a-tooltip content="列设置">
            <a-button size="small" type="text" class="table-card-cap__tool">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
          <a-pagination
            class="table-card-cap__pager"
            :current="page.current"
            :page-size="page.size"
            :total="page.total"
            :page-size-options="[50, 100, 200, 500]"
            size="small"
            show-total
            show-page-size
            show-jumper
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
        </div>
      </div>

      <div class="table-wrap">
        <vxe-table
          ref="tableRef"
          border="none"
          size="small"
          class="compact workbench-table"
          height="100%"
          show-overflow="title"
          :loading="loading"
          :data="pagedRows"
          :row-config="{ isHover: true, keyField: 'Id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onCheckboxChange"
          @checkbox-all="onCheckboxChange"
        >
          <vxe-column type="checkbox" width="40" fixed="left" />
          <vxe-column field="orderNo" title="订单编号" min-width="160" fixed="left">
            <template #default="{ row }">
              <span class="link-text link-text--strong mono" @click="openDetail(row)">
                {{ row.orderNo }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="company" title="所属公司" min-width="120" />
          <vxe-column field="businessScope" title="业务范围" min-width="100" />
          <vxe-column field="mbl" title="MBL" min-width="140">
            <template #default="{ row }">
              <span class="link-text mono">{{ row.mbl }}</span>
            </template>
          </vxe-column>
          <vxe-column field="customer" title="客户" min-width="160" />
          <vxe-column field="containerSummary" title="柜型柜量" min-width="90" align="center" />
          <vxe-column field="grossWeight" title="毛重" min-width="90" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ row.grossWeight.toLocaleString('zh-CN') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="volume" title="体积" min-width="72" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ row.volume.toLocaleString('zh-CN') }}</span>
            </template>
          </vxe-column>
          <vxe-column field="transportMode" title="运输方式" min-width="80" align="center" />
          <vxe-column field="pol" title="起运港" min-width="100" />
          <vxe-column field="pod" title="目的地" min-width="100" />
          <vxe-column field="realProfit" title="真实利润" min-width="100" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatAmount(row.realProfit) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="realEstimate" title="真实预估" min-width="100" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatAmount(row.realEstimate) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="salesAmount" title="销售额" min-width="110" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatAmount(row.salesAmount) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="currency" title="币种" min-width="72" align="center" />
          <vxe-column field="invoiceMarked" title="开票状态" min-width="84" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.invoiceMarked ? 'rel' : 'draft'">
                {{ row.invoiceMarked ? '已开票' : '未开票' }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="orderStatus" title="状态" min-width="84" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.orderStatusKey">{{ row.orderStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="72" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="详情">
                  <a-button
                    size="small"
                    type="text"
                    class="row-action-btn row-action-btn--primary"
                    @click="openDetail(row)"
                  >
                    <icon-eye />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <profit-detail-drawer v-model:visible="detailVisible" :record="currentRow" />
  </div>
</template>

<style scoped>
</style>
