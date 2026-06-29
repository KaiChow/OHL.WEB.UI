<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconSettings,
  IconDownload,
  IconEye,
  IconExclamationCircleFill,
  IconInfoCircle,
} from '@arco-design/web-vue/es/icon';
import { mockStatementRows } from './mockData';
import type { StatementQuery, StatementRecord } from './types';

const defaultQuery = (): StatementQuery => ({
  salesCompany: undefined,
  billCompany: undefined,
  paymentType: undefined,
  businessType: undefined,
  customerMode: 'include',
  customer: undefined,
  receivableFee: 'unsettled',
  writeOffStatus: undefined,
  etdRange: [],
  etaRange: [],
  salesperson: undefined,
  cs: undefined,
  includeCollectionFee: 'yes',
  operator: undefined,
  companyType: undefined,
  dueDateRange: [],
  atdRange: [],
  ataRange: [],
  sysDueDateRange: [],
  excludeBranch: true,
});

const query = reactive<StatementQuery>(defaultQuery());
const appliedQuery = ref<StatementQuery>(defaultQuery());
const advancedFilterVisible = ref(false);
const loading = ref(false);
const allRows = ref<StatementRecord[]>([...mockStatementRows]);

const page = reactive({ current: 1, size: 100, total: 0 });

const formatAmount = (n: number) =>
  n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inDateRange = (value: string, range: string[]) => {
  if (range.length !== 2 || !value) return true;
  return value >= range[0] && value <= range[1];
};

const hasMissingAtd = computed(() => allRows.value.some((r) => r.missingAtd));

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (q.receivableFee === 'unsettled' && row.unwrittenOffAmount <= 0) return false;
    if (q.receivableFee === 'settled' && row.unwrittenOffAmount > 0) return false;
    if (q.writeOffStatus === 'partial' && (row.unwrittenOffAmount <= 0 || row.unwrittenOffAmount >= row.totalBillAmount)) {
      return false;
    }
    if (q.writeOffStatus === 'full' && row.unwrittenOffAmount > 0) return false;
    if (q.writeOffStatus === 'none' && row.unwrittenOffAmount < row.totalBillAmount) return false;
    if (q.salesperson && row.salesperson !== q.salesperson) return false;
    if (q.customer && !row.contractUnit.includes(q.customer)) return false;
    if (q.excludeBranch && row.department.includes('分公司')) return false;
    if (!inDateRange(row.estimatedPaymentDate, q.dueDateRange)) return false;
    return true;
  });
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

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
    dueDateRange: [...query.dueDateRange],
    atdRange: [...query.atdRange],
    ataRange: [...query.ataRange],
    sysDueDateRange: [...query.sysDueDateRange],
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

const clearAdvancedFilters = () => {
  query.cs = undefined;
  query.operator = undefined;
  query.companyType = undefined;
  query.dueDateRange = [];
  query.atdRange = [];
  query.ataRange = [];
  query.sysDueDateRange = [];
  query.excludeBranch = true;
};

const applyAdvancedFilters = () => {
  advancedFilterVisible.value = false;
  handleSearch();
};

const handleExport = () => Message.info('导出任务已提交');

const openDetail = (row: StatementRecord) => {
  Message.info(`查看对账明细：${row.contractUnit}`);
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
    <!-- S3：12 常驻 + 8 项抽屉（财务重型工作台） -->
    <div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
      <div class="filter-card__matrix">
        <div class="filter-grid">
          <div class="filter-field">
            <label class="filter-field__label">销售公司</label>
            <a-select v-model="query.salesCompany" size="small" allow-clear placeholder="请选择">
              <a-option value="深圳点达">深圳点达</a-option>
              <a-option value="上海分公司">上海分公司</a-option>
              <a-option value="宁波办事处">宁波办事处</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">账单公司</label>
            <a-select v-model="query.billCompany" size="small" allow-clear placeholder="请选择">
              <a-option value="深圳点达">深圳点达</a-option>
              <a-option value="上海分公司">上海分公司</a-option>
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
            <label class="filter-field__label">收付款类型</label>
            <a-select v-model="query.paymentType" size="small" allow-clear placeholder="请选择">
              <a-option value="receivable">应收</a-option>
              <a-option value="payable">应付</a-option>
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
          <div class="filter-field filter-field--span2">
            <label class="filter-field__label">客户</label>
            <div class="filter-combo arco-input-group">
              <a-select v-model="query.customerMode" size="small" class="filter-combo__select filter-combo--keyword">
                <a-option value="include">包含</a-option>
                <a-option value="exclude">排除</a-option>
              </a-select>
              <a-select
                v-model="query.customer"
                size="small"
                class="filter-combo__fill"
                allow-search
                allow-clear
                placeholder="请选择客户"
              >
                <a-option value="深圳某某贸易">深圳某某贸易有限公司</a-option>
                <a-option value="广州华南物流">广州华南物流有限公司</a-option>
                <a-option value="宁波港务">宁波港务进出口</a-option>
              </a-select>
            </div>
          </div>

          <div class="filter-field">
            <label class="filter-field__label">应收账费</label>
            <a-select v-model="query.receivableFee" size="small" allow-clear placeholder="请选择">
              <a-option value="unsettled">未结清</a-option>
              <a-option value="settled">已结清</a-option>
              <a-option value="all">全部</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">核销状态</label>
            <a-select v-model="query.writeOffStatus" size="small" allow-clear placeholder="请选择">
              <a-option value="none">未核销</a-option>
              <a-option value="partial">部分核销</a-option>
              <a-option value="full">已核销</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">业务员</label>
            <a-select v-model="query.salesperson" size="small" allow-search allow-clear placeholder="请选择">
              <a-option value="张三">张三</a-option>
              <a-option value="李四">李四</a-option>
              <a-option value="王五">王五</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">是否含代收费用</label>
            <a-select v-model="query.includeCollectionFee" size="small" allow-clear placeholder="请选择">
              <a-option value="yes">是</a-option>
              <a-option value="no">否</a-option>
            </a-select>
          </div>
        </div>
        <div class="filter-card__inline-actions filter-card__inline-actions--matrix">
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
          <a-button
            size="small"
            type="text"
            class="reset-btn"
            title="更多筛选"
            @click="advancedFilterVisible = true"
          >
            <template #icon><icon-filter /></template>
            筛选
          </a-button>
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
        </div>
        <template v-if="hasMissingAtd">
          <div class="bar-sep" />
          <div class="workbench-notice-group">
            <div
              class="workbench-notice workbench-notice--warn"
              title="存在订单无 ATD 时间，无法计算折合本位币或人民币金额，请先维护数据"
            >
              <icon-exclamation-circle-fill class="workbench-notice__icon" />
              <span class="workbench-notice__text">
                存在订单无 ATD 时间，无法计算折合金额，请先维护数据
              </span>
            </div>
          </div>
        </template>
        <div class="toolbar-aside">
          <div class="workbench-notice workbench-notice--info" title="双击 ★ 可置顶">
            <icon-info-circle class="workbench-notice__icon" />
            <span class="workbench-notice__text">双击 ★ 可置顶</span>
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
          border="none"
          size="small"
          class="compact workbench-table"
          height="100%"
          show-overflow="title"
          :loading="loading"
          :data="pagedRows"
          :row-config="{ isHover: true, keyField: 'Id', height: 36 }"
        >
          <vxe-column type="seq" title="序号" width="52" align="center" />
          <vxe-column field="type" title="类型" min-width="72" align="center" />
          <vxe-column field="contractUnit" title="签约单位" min-width="180">
            <template #default="{ row }">
              <span class="link-text link-text--strong" @click="openDetail(row)">{{ row.contractUnit }}</span>
            </template>
          </vxe-column>
          <vxe-column field="salesperson" title="业务员" min-width="88" />
          <vxe-column field="department" title="所在部门/组" min-width="120" />
          <vxe-column field="totalBillAmount" title="账单总金额(CNY)" min-width="130" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatAmount(row.totalBillAmount) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="unwrittenOffAmount" title="未核销总金额(CNY)" min-width="140" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatAmount(row.unwrittenOffAmount) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="overdueAmount" title="逾期金额(CNY)" min-width="120" align="right">
            <template #default="{ row }">
              <span
                class="num-val"
                :style="row.overdueAmount > 0 ? { color: 'var(--danger-6)' } : undefined"
              >
                {{ formatAmount(row.overdueAmount) }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="estimatedPaymentDate" title="预计付款日期" min-width="120" />
          <vxe-column field="estimatedPaymentAmount" title="预计付款金额" min-width="120" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatAmount(row.estimatedPaymentAmount) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="estimatedPaymentCurrency" title="预计付款币种" min-width="110" align="center" />
          <vxe-column field="remark" title="备注" min-width="120" />
          <vxe-column title="操作" width="72" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看">
                  <a-button
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

    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="对账单筛选"
      :width="640"
      :footer="true"
      class="query-filter-drawer"
      :mask-closable="false"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="query">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">组织 / 人员</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="客服">
                  <a-select v-model="query.cs" size="small" allow-clear placeholder="请选择">
                    <a-option value="zhangsan">zhangsan</a-option>
                    <a-option value="lisi">lisi</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="运营">
                  <a-select v-model="query.operator" size="small" allow-clear placeholder="请选择">
                    <a-option value="ops1">运营一组</a-option>
                    <a-option value="ops2">运营二组</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="公司类型">
                  <a-select v-model="query.companyType" size="small" allow-clear placeholder="请选择">
                    <a-option value="direct">直客</a-option>
                    <a-option value="agent">代理</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="分公司">
                  <a-checkbox v-model="query.excludeBranch">排除分公司</a-checkbox>
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">时间范围</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="Due Date">
                  <a-range-picker
                    v-model="query.dueDateRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
                <a-form-item label="Sys Due Date">
                  <a-range-picker
                    v-model="query.sysDueDateRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
                <a-form-item label="ATD">
                  <a-range-picker
                    v-model="query.atdRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
                <a-form-item label="ATA">
                  <a-range-picker
                    v-model="query.ataRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <template #footer>
        <div class="detail-drawer-footer">
          <div class="detail-drawer-footer__start">
            <a-button size="small" type="text" class="reset-btn" @click="clearAdvancedFilters">
              清空更多筛选
            </a-button>
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

<style scoped>
</style>
