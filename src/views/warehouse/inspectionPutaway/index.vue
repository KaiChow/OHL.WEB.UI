<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconRefresh,
  IconSettings,
  IconPlus,
  IconDownload,
  IconEye,
  IconUp,
  IconDown,
} from '@arco-design/web-vue/es/icon';
import { mockPutawayRows } from './mockData';
import type { PutawayQuery, PutawayRecord, PutawayStatusKey } from './types';

const STATUS_TABS: {
  key: PutawayStatusKey;
  label: string;
  tone?: 'danger' | 'warn' | 'ok';
}[] = [
  { key: 'all', label: '全部' },
  { key: 'normal', label: '正常上架', tone: 'ok' },
  { key: 'problem', label: '问题单待解决', tone: 'danger' },
  { key: 'labelPending', label: '待贴快递标' },
  { key: 'claim', label: '问题理赔中', tone: 'warn' },
  { key: 'partialInbound', label: '部分入仓' },
  { key: 'expressToTruck', label: '快递转卡派' },
  { key: 'truckToExpress', label: '卡派转快递' },
  { key: 'externalProcess', label: '货物外仓处理' },
  { key: 'wechatCs', label: '微信客服' },
  { key: 'photoMissing', label: '未上传照片', tone: 'danger' },
  { key: 'unboxInspect', label: '开箱查验' },
];

const defaultQuery = (): PutawayQuery => ({
  putawayStatus: undefined,
  storageOrderNo: '',
  storageMethod: undefined,
  orderNo: '',
  transportMode: undefined,
  deliveryMethod: undefined,
  putawayStartDate: undefined,
  putawayEndDate: undefined,
  independentStatus: undefined,
  certComplete: undefined,
  photoUploaded: undefined,
  stockoutStatus: undefined,
  packingMethod: undefined,
  stockoutFeeNotSubmitted: undefined,
  inventoryMatch: undefined,
  expressCompany: undefined,
  expressSubNo: '',
  expressMainNo: '',
  unboxInspect: undefined,
});

const COLLAPSED_FIELD_COUNT = 7;
const FILTER_EXPAND_STORAGE_KEY = 'ohl-filter-expanded:warehouse-inspection-putaway';

const readFilterExpanded = () => {
  try {
    return localStorage.getItem(FILTER_EXPAND_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const query = reactive<PutawayQuery>(defaultQuery());
const appliedQuery = ref<PutawayQuery>(defaultQuery());
const activeStatus = ref<PutawayStatusKey>('all');
const filterExpanded = ref(readFilterExpanded());
const loading = ref(false);
const allRows = ref<PutawayRecord[]>([...mockPutawayRows]);
const tableRef = ref<VxeTableInstance>();
const selectedIds = ref<string[]>([]);

const page = reactive({ current: 1, size: 50, total: 0 });

const statusCounts = computed(() => {
  const counts = Object.fromEntries(STATUS_TABS.map((t) => [t.key, 0])) as Record<PutawayStatusKey, number>;
  counts.all = allRows.value.length;
  for (const row of allRows.value) {
    counts[row.statusTag] = (counts[row.statusTag] ?? 0) + 1;
  }
  return counts;
});

const formatNum = (n: number) => n.toLocaleString('zh-CN', { maximumFractionDigits: 2 });

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (activeStatus.value !== 'all' && row.statusTag !== activeStatus.value) return false;
    if (q.putawayStatus && row.putawayStatusKey !== q.putawayStatus) return false;
    if (q.storageOrderNo && !row.storageOrderNo.includes(q.storageOrderNo)) return false;
    if (q.orderNo && !row.instructionNo.includes(q.orderNo)) return false;
    if (q.transportMode && row.transportMode !== q.transportMode) return false;
    if (q.photoUploaded === 'yes' && !row.photoUploaded) return false;
    if (q.photoUploaded === 'no' && row.photoUploaded) return false;
    if (q.putawayStartDate && row.putawayDate < q.putawayStartDate) return false;
    if (q.putawayEndDate && row.putawayDate > `${q.putawayEndDate} 23:59:59`) return false;
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
  if (query.packingMethod) n += 1;
  if (query.stockoutFeeNotSubmitted) n += 1;
  if (query.inventoryMatch) n += 1;
  if (query.expressCompany) n += 1;
  if (query.expressSubNo.trim()) n += 1;
  if (query.expressMainNo.trim()) n += 1;
  if (query.unboxInspect) n += 1;
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
  appliedQuery.value = { ...query };
  page.current = 1;
  fetchList();
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = defaultQuery();
  page.current = 1;
  fetchList();
};

const onStatusChange = (key: PutawayStatusKey) => {
  activeStatus.value = key;
  page.current = 1;
  fetchList();
};

const onCheckboxChange = ({ records }: { records: PutawayRecord[] }) => {
  selectedIds.value = records.map((r) => r.Id);
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedIds.value = [];
};

const handleAdd = () => Message.info('添加入仓单');
const handleAddAb = () => Message.info('新增 AB 单');
const handleExport = () => Message.info('导出入仓单任务已提交');
const handleExportSingle = () => Message.info('单个导出入仓单');
const handleMigrate = () => Message.info('迁移入仓单货物');

const openDetail = (row: PutawayRecord) => {
  Message.info(`查看指令 ${row.instructionNo}`);
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
    <!-- 状态统计 Tab（仓储高频扫描入口） -->
    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="scope-status-bar">
        <div class="scope-status-bar__status">
          <div class="stat-tab-group">
            <button
              v-for="tab in STATUS_TABS"
              :key="tab.key"
              type="button"
              class="stat-tab"
              :class="{ 'stat-tab--active': activeStatus === tab.key }"
              @click="onStatusChange(tab.key)"
            >
              <span class="stat-tab__name">{{ tab.label }}</span>
              <span
                class="stat-tab__count"
                :class="{
                  'stat-tab__count--danger': tab.tone === 'danger',
                  'stat-tab__count--warn': tab.tone === 'warn',
                  'stat-tab__count--ok': tab.tone === 'ok',
                }"
              >
                {{ statusCounts[tab.key] ?? 0 }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- S2：12 常驻 + 7 字段页内展开收起（filter-layout.md § Three Query UI Scenarios） -->
    <div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
      <div class="filter-card__matrix">
        <div class="filter-grid filter-grid--6col">
          <div class="filter-field">
            <label class="filter-field__label">上架状态</label>
            <a-select v-model="query.putawayStatus" size="small" allow-clear placeholder="请选择">
              <a-option value="wait">待上架</a-option>
              <a-option value="rel">上架完成</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">入仓单号</label>
            <a-input
              v-model="query.storageOrderNo"
              size="small"
              allow-clear
              placeholder="请输入"
              @press-enter="handleSearch"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">入仓方式</label>
            <a-select v-model="query.storageMethod" size="small" allow-clear placeholder="请选择">
              <a-option value="self">自送入仓</a-option>
              <a-option value="pickup">上门提货</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">订单号</label>
            <a-input
              v-model="query.orderNo"
              size="small"
              allow-clear
              placeholder="请输入"
              @press-enter="handleSearch"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">运输方式</label>
            <a-select v-model="query.transportMode" size="small" allow-clear placeholder="请选择">
              <a-option value="海运">海运</a-option>
              <a-option value="空运">空运</a-option>
              <a-option value="卡派">卡派</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">派送方式</label>
            <a-select v-model="query.deliveryMethod" size="small" allow-clear placeholder="请选择">
              <a-option value="express">快递</a-option>
              <a-option value="truck">卡派</a-option>
            </a-select>
          </div>

          <div class="filter-field">
            <label class="filter-field__label">上架开始日期</label>
            <a-date-picker
              v-model="query.putawayStartDate"
              size="small"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              placeholder="请选择"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">上架结束日期</label>
            <a-date-picker
              v-model="query.putawayEndDate"
              size="small"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              placeholder="请选择"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">独立单状态</label>
            <a-select v-model="query.independentStatus" size="small" allow-clear placeholder="请选择">
              <a-option value="normal">正常</a-option>
              <a-option value="ab">AB 单</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">证件是否齐全</label>
            <a-select v-model="query.certComplete" size="small" allow-clear placeholder="请选择">
              <a-option value="yes">是</a-option>
              <a-option value="no">否</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">照片是否上传</label>
            <a-select v-model="query.photoUploaded" size="small" allow-clear placeholder="请选择">
              <a-option value="yes">已上传</a-option>
              <a-option value="no">未上传</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">缺货状态</label>
            <a-select v-model="query.stockoutStatus" size="small" allow-clear placeholder="请选择">
              <a-option value="none">无缺货</a-option>
              <a-option value="partial">部分缺货</a-option>
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
      <div class="filter-card__advanced" :class="{ 'filter-card__advanced--open': filterExpanded }">
        <div class="filter-card__advanced-inner">
          <div class="filter-grid filter-grid--6col filter-grid--advanced">
          <div class="filter-field">
            <label class="filter-field__label">包装方式</label>
            <a-select v-model="query.packingMethod" size="small" allow-clear placeholder="请选择">
              <a-option value="carton">纸箱</a-option>
              <a-option value="pallet">托盘</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">缺货但未提交费用</label>
            <a-select v-model="query.stockoutFeeNotSubmitted" size="small" allow-clear placeholder="请选择">
              <a-option value="yes">是</a-option>
              <a-option value="no">否</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">库存数据是否一致</label>
            <a-select v-model="query.inventoryMatch" size="small" allow-clear placeholder="请选择">
              <a-option value="yes">是</a-option>
              <a-option value="no">否</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">快递公司</label>
            <a-select v-model="query.expressCompany" size="small" allow-clear placeholder="请选择">
              <a-option value="SF">顺丰</a-option>
              <a-option value="YT">圆通</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">快递子单号</label>
            <a-input
              v-model="query.expressSubNo"
              size="small"
              allow-clear
              placeholder="请输入"
              @press-enter="handleSearch"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">快递主单号</label>
            <a-input
              v-model="query.expressMainNo"
              size="small"
              allow-clear
              placeholder="请输入"
              @press-enter="handleSearch"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">开箱查验</label>
            <a-select v-model="query.unboxInspect" size="small" allow-clear placeholder="请选择">
              <a-option value="yes">是</a-option>
              <a-option value="no">否</a-option>
            </a-select>
          </div>
          </div>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" @click="handleExport">
            <template #icon><icon-download /></template>
            导出入仓单
          </a-button>
          <a-button size="small" type="primary" @click="handleAdd">
            <template #icon><icon-plus /></template>
            添加
          </a-button>
          <a-button size="small" type="outline" @click="handleAddAb">
            <template #icon><icon-plus /></template>
            新增 AB 单
          </a-button>
          <a-button size="small" type="outline" @click="handleExportSingle">单个导出入仓单</a-button>
          <a-button size="small" type="outline" @click="handleMigrate">迁移入仓单货物</a-button>
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
          <vxe-column type="seq" title="编号" width="52" align="center" />
          <vxe-column field="instructionNo" title="指令号" min-width="140" fixed="left">
            <template #default="{ row }">
              <span class="link-text link-text--strong mono" @click="openDetail(row)">
                {{ row.instructionNo }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="storageOrderNo" title="入仓单号" min-width="140">
            <template #default="{ row }">
              <span class="mono">{{ row.storageOrderNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="putawayStatus" title="上架状态" min-width="88" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.putawayStatusKey">{{ row.putawayStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="transportMode" title="运输方式" min-width="80" align="center" />
          <vxe-column field="expressNo" title="快递单号" min-width="120">
            <template #default="{ row }">
              <span v-if="row.expressNo" class="mono">{{ row.expressNo }}</span>
              <span v-else>—</span>
            </template>
          </vxe-column>
          <vxe-column field="binLocation" title="仓位" min-width="96" />
          <vxe-column field="putawayDate" title="上架日期" min-width="160" />
          <vxe-column field="volume" title="体积" min-width="72" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatNum(row.volume) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="chargeableWeight" title="计费重量" min-width="88" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatNum(row.chargeableWeight) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="chargeableVolume" title="计费方数" min-width="88" align="right">
            <template #default="{ row }">
              <span class="num-val">{{ formatNum(row.chargeableVolume) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="warehouse" title="仓库" min-width="120" />
          <vxe-column field="inspector" title="验收人" min-width="80" />
          <vxe-column field="outboundStatus" title="出库状态" min-width="88" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.outboundStatusKey">{{ row.outboundStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="photoUploaded" title="照片是否上传" min-width="110" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.photoUploaded ? 'rel' : 'rej'">
                {{ row.photoUploaded ? '已上传' : '未上传' }}
              </span>
            </template>
          </vxe-column>
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
  </div>
</template>

<style scoped>
</style>
