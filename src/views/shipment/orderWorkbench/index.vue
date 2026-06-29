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
} from '@arco-design/web-vue/es/icon';
import ShipmentOrderDetailDrawer from '../orderDetail/ShipmentOrderDetailDrawer.vue';
import { shipmentWorkbenchRows } from './mockData';
import type {
  ShipmentCargoScopeKey,
  ShipmentOrderQuery,
  ShipmentScopeKey,
  ShipmentStatusKey,
  ShipmentWorkbenchRow,
} from './types';
import type { ShipmentOrderDetailRecord } from '../orderDetail/types';
import { getShipmentOrderMock } from '../orderDetail/mockData';

const defaultQuery = (): ShipmentOrderQuery => ({
  businessType: undefined,
  quickTag: undefined,
  identifierType: 'orderNo',
  keyword: '',
  salesperson: '',
  operator: '',
  packageMode: undefined,
  customer: '',
  departurePort: '',
  hblNo: '',
  mblNo: '',
  pushBeforeVessel: undefined,
});

const query = reactive<ShipmentOrderQuery>(defaultQuery());
const appliedQuery = ref<ShipmentOrderQuery>(defaultQuery());
const activeScope = ref<ShipmentScopeKey>('all');
const activeCargoScope = ref<ShipmentCargoScopeKey>('all');
const activeStatus = ref<ShipmentStatusKey>('all');
const advancedFilterVisible = ref(false);
const loading = ref(false);
const tableRef = ref<VxeTableInstance>();
const selectedIds = ref<string[]>([]);
const allRows = ref<ShipmentWorkbenchRow[]>([...shipmentWorkbenchRows]);
const detailVisible = ref(false);
const currentDetail = ref<ShipmentOrderDetailRecord | null>(null);

const page = reactive({ current: 1, size: 50, total: 0 });

const scopeTabs: Array<{ key: ShipmentScopeKey; label: string }> = [
  { key: 'all', label: '全部单' },
  { key: 'personal', label: '个人单' },
  { key: 'permission', label: '权限单' },
];

const cargoTabs: Array<{ key: ShipmentCargoScopeKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'fcl', label: '整柜' },
  { key: 'lcl', label: '散货' },
];

const statusTabs: Array<{ key: ShipmentStatusKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '操作中' },
  { key: 'operating', label: '已完成' },
  { key: 'completed', label: '已废弃' },
  { key: 'abandoned', label: '已废弃' },
];

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (q.businessType && row.businessType !== q.businessType) return false;
    if (q.quickTag && row.quickTag !== q.quickTag) return false;
    if (q.keyword) {
      const source =
        q.identifierType === 'orderNo'
          ? row.orderNo
          : q.identifierType === 'suborderNo'
            ? row.suborderNo || row.businessNo
            : q.identifierType === 'hblNo'
              ? row.hblNo
              : row.mblNo;
      if (!source.includes(q.keyword)) return false;
    }
    if (q.salesperson && !row.salesperson.includes(q.salesperson)) return false;
    if (q.operator && !row.operator.includes(q.operator)) return false;
    if (q.packageMode && row.packageMode !== q.packageMode) return false;
    if (q.customer && !row.customer.includes(q.customer)) return false;
    if (q.departurePort && !row.departurePort.includes(q.departurePort)) return false;
    if (q.hblNo && !row.hblNo.includes(q.hblNo)) return false;
    if (q.mblNo && !row.mblNo.includes(q.mblNo)) return false;
    if (q.pushBeforeVessel === 'yes' && !row.pushBeforeVessel) return false;
    if (q.pushBeforeVessel === 'no' && row.pushBeforeVessel) return false;
    if (activeCargoScope.value !== 'all' && row.cargoScope !== activeCargoScope.value) return false;

    if (activeStatus.value === 'pending' && row.orderStatus !== '放舱') return false;
    if (activeStatus.value === 'operating' && row.orderStatus !== '已装单') return false;
    if (activeStatus.value === 'completed' && row.orderStatus !== '归档') return false;
    if (activeStatus.value === 'abandoned' && !row.deleted) return false;
    if (activeScope.value === 'personal' && row.salesperson !== '李四') return false;
    if (activeScope.value === 'permission' && row.operator !== '张三') return false;

    return true;
  });
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const selectedCount = computed(() => selectedIds.value.length);
const statusCounts = computed(() => ({
  all: allRows.value.length,
  pending: allRows.value.filter((row) => row.orderStatus === '放舱').length,
  operating: allRows.value.filter((row) => row.orderStatus === '已装单').length,
  completed: allRows.value.filter((row) => row.orderStatus === '归档').length,
  abandoned: allRows.value.filter((row) => row.deleted).length,
}));

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

const clearAdvancedFilters = () => {
  query.customer = '';
  query.departurePort = '';
  query.hblNo = '';
  query.mblNo = '';
  query.pushBeforeVessel = undefined;
};

const applyAdvancedFilters = () => {
  advancedFilterVisible.value = false;
  handleSearch();
};

const openDetail = (row: ShipmentWorkbenchRow) => {
  currentDetail.value = getShipmentOrderMock(row.orderNo);
  detailVisible.value = true;
  tableRef.value?.setCurrentRow?.(row);
};

const onCheckboxChange = ({ records }: { records: ShipmentWorkbenchRow[] }) => {
  selectedIds.value = records.map((row) => row.id);
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedIds.value = [];
};

const handleToolbarAction = (label: string) => {
  if (!selectedIds.value.length && ['批量操作', '一键下载'].includes(label)) {
    Message.warning(`请先勾选业务单再${label}`);
    return;
  }
  Message.success(`${label}已加入预览流程`);
};

const onPageChange = (p: number) => {
  page.current = p;
};

const onPageSizeChange = (size: number) => {
  page.size = size;
  page.current = 1;
  syncPageTotal();
};

fetchList();
</script>

<template>
  <div class="page-root page-root--dense">
    <div class="zone-l2-filter-card zone-card filter-card filter-card--two-row shipment-workbench__filter">
      <div class="filter-card__matrix">
        <div class="filter-grid">
          <div class="filter-field">
            <label class="filter-field__label">业务类型</label>
            <a-select v-model="query.businessType" size="small" allow-clear placeholder="请选择业务类型">
              <a-option value="FBA">FBA</a-option>
              <a-option value="海运拼箱">海运拼箱</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">快捷标签</label>
            <a-select v-model="query.quickTag" size="small" allow-clear placeholder="请选择快捷标签">
              <a-option value="全部">全部</a-option>
              <a-option value="整柜">整柜</a-option>
              <a-option value="散货">散货</a-option>
            </a-select>
          </div>
          <div class="filter-field filter-field--span2">
            <label class="filter-field__label">订单编号</label>
            <div class="filter-combo arco-input-group">
              <a-select v-model="query.identifierType" size="small" class="filter-combo__select filter-combo--keyword">
                <a-option value="orderNo">订单编号</a-option>
                <a-option value="suborderNo">境外单号</a-option>
                <a-option value="hblNo">HBL单号</a-option>
                <a-option value="mblNo">MBL主单号</a-option>
              </a-select>
              <a-input v-model="query.keyword" size="small" allow-clear placeholder="请输入" @press-enter="handleSearch" />
            </div>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">业务员</label>
            <a-input v-model="query.salesperson" size="small" allow-clear placeholder="请输入业务员" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">操作员</label>
            <a-input v-model="query.operator" size="small" allow-clear placeholder="请输入操作员" />
          </div>
          <div class="filter-field shipment-workbench__package-field">
            <label class="filter-field__label">装箱方式</label>
            <a-select v-model="query.packageMode" size="small" allow-clear placeholder="请选择装箱方式">
              <a-option value="LCL GROUP（自拼）">LCL GROUP（自拼）</a-option>
              <a-option value="LCL">LCL</a-option>
            </a-select>
          </div>
        </div>
        <div class="filter-card__inline-actions filter-card__inline-actions--matrix">
          <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          <a-button size="small" type="text" class="reset-btn" @click="advancedFilterVisible = true">更多</a-button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack shipment-workbench__toolbar">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" type="outline" @click="handleToolbarAction('打印业务单')">打印业务单</a-button>
          <a-button size="small" type="outline" @click="handleToolbarAction('推送舱位通知')">推送舱位通知</a-button>
          <div class="toolbar-divider" />
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">导出<icon-down /></a-button>
            <template #content>
              <a-doption @click="handleToolbarAction('导出当前结果')">导出当前结果</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">批量操作<icon-down /></a-button>
            <template #content>
              <a-doption @click="handleToolbarAction('批量操作')">批量放舱</a-doption>
              <a-doption @click="handleToolbarAction('批量操作')">批量发送提审</a-doption>
            </template>
          </a-dropdown>
          <div class="toolbar-divider" />
          <a-button size="small" type="outline" @click="handleToolbarAction('一键下载')">一键下载</a-button>
          <a-button size="small" type="outline" @click="handleToolbarAction('关单导入')">关单导入</a-button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack shipment-workbench__status">
      <div class="scope-status-bar">
        <div class="scope-status-bar__scope">
          <button
            v-for="tab in scopeTabs"
            :key="tab.key"
            type="button"
            class="stab"
            :class="{ 'stab--active': activeScope === tab.key }"
            @click="activeScope = tab.key; fetchList()"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="scope-status-bar__divider" />
        <div class="scope-status-bar__scope">
          <button
            v-for="tab in cargoTabs"
            :key="tab.key"
            type="button"
            class="stab"
            :class="{ 'stab--active': activeCargoScope === tab.key }"
            @click="activeCargoScope = tab.key; fetchList()"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="scope-status-bar__divider" />
        <div class="scope-status-bar__status">
          <div class="stat-tab-group">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            type="button"
            class="stat-tab"
            :class="{ 'stat-tab--active': activeStatus === tab.key }"
            @click="activeStatus = tab.key; fetchList()"
          >
            <span class="stat-tab__name">{{ tab.label }}</span>
            <span class="stat-tab__count">{{ statusCounts[tab.key] ?? 0 }}</span>
          </button>
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
          <div v-if="selectedCount > 0" class="toolbar-selection-context">
            <span class="toolbar-selected-tip">已选 <b>{{ selectedCount }}</b> 项</span>
            <a-button size="small" type="text" class="reset-btn" @click="clearSelection">清空</a-button>
          </div>
        </div>
        <div class="table-card-cap__right">
          <a-pagination
            class="table-card-cap__pager"
            :current="page.current"
            :page-size="page.size"
            :total="page.total"
            :page-size-options="[50, 100, 200]"
            size="small"
            show-total
            show-page-size
            show-jumper
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
          <a-tooltip content="列设置">
            <a-button size="small" type="text" class="table-card-cap__tool">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
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
          :row-config="{ isHover: true, isCurrent: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onCheckboxChange"
          @checkbox-all="onCheckboxChange"
        >
          <vxe-column type="checkbox" width="40" fixed="left" />
          <vxe-column type="seq" title="序号" width="52" align="center" />
          <vxe-column field="orderNo" title="订单编号" min-width="150" fixed="left">
            <template #default="{ row }">
              <span class="link-text link-text--strong mono" @click="openDetail(row)">{{ row.orderNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="orderStatus" title="订单状态" min-width="90" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.orderStatus === '放舱' ? 'op' : row.orderStatus === '已装单' ? 'rel' : 'draft'">
                {{ row.orderStatus }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="suborderStatus" title="订单新状态" min-width="90" align="center">
            <template #default="{ row }">
              <span class="link-text" @click="openDetail(row)">{{ row.suborderStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="cargoType" title="货物类型" min-width="84" align="center" />
          <vxe-column field="financePod" title="财务POD" min-width="84" align="center" />
          <vxe-column field="feeLink" title="费用" min-width="72" align="center">
            <template #default="{ row }">
              <span class="link-text" @click="handleToolbarAction(`查看 ${row.orderNo} 费用`)">{{ row.feeLink }}</span>
            </template>
          </vxe-column>
          <vxe-column field="qty" title="件数" min-width="72" align="right">
            <template #default="{ row }"><span class="num-val">{{ row.qty }}</span></template>
          </vxe-column>
          <vxe-column field="grossWeight" title="毛重" min-width="72" align="right">
            <template #default="{ row }"><span class="num-val">{{ row.grossWeight }}</span></template>
          </vxe-column>
          <vxe-column field="volume" title="体积" min-width="72" align="right">
            <template #default="{ row }"><span class="num-val">{{ row.volume }}</span></template>
          </vxe-column>
          <vxe-column field="containerType" title="柜子类型" min-width="100" />
          <vxe-column field="businessNo" title="业务单号" min-width="120" />
          <vxe-column field="externalOrderNo" title="境外单号" min-width="140" />
          <vxe-column field="pushBeforeVessel" title="是否发送船前" min-width="110" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.pushBeforeVessel ? 'rel' : 'wait'">{{ row.pushBeforeVessel ? '已发' : '未发' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="customer" title="客户" min-width="100" />
          <vxe-column field="contractNo" title="合约号" min-width="140" />
          <vxe-column field="destinationInfo" title="目的港信息" min-width="100" align="center">
            <template #default="{ row }">
              <span class="link-text" @click="openDetail(row)">{{ row.destinationInfo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="cabinetNo" title="柜型柜号" min-width="100" />
          <vxe-column field="departurePort" title="起运港" min-width="100" />
          <vxe-column field="hblNo" title="HBL单号" min-width="120" />
          <vxe-column field="soNo" title="SO" min-width="120" />
          <vxe-column field="mblNo" title="MBL主单号" min-width="120" />
          <vxe-column field="documentDownload" title="文件下载" min-width="84" align="center">
            <template #default>
              <a-tooltip content="下载文件">
                <a-button size="small" type="text" class="row-action-btn">
                  <template #icon><icon-download /></template>
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="56" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看详情">
                  <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="openDetail(row)">
                    <template #icon><icon-eye /></template>
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <shipment-order-detail-drawer
      v-model:visible="detailVisible"
      :record="currentDetail"
    />

    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="业务单筛选"
      :width="640"
      :footer="true"
      class="query-filter-drawer"
      :mask-closable="false"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="query">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">客户与单号</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="客户">
                  <a-input v-model="query.customer" size="small" allow-clear placeholder="请输入客户" />
                </a-form-item>
                <a-form-item label="起运港">
                  <a-input v-model="query.departurePort" size="small" allow-clear placeholder="请输入起运港" />
                </a-form-item>
                <a-form-item label="HBL单号">
                  <a-input v-model="query.hblNo" size="small" allow-clear placeholder="请输入HBL单号" />
                </a-form-item>
                <a-form-item label="MBL主单号">
                  <a-input v-model="query.mblNo" size="small" allow-clear placeholder="请输入MBL主单号" />
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">流程条件</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="是否发送船前">
                  <a-select v-model="query.pushBeforeVessel" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">已发</a-option>
                    <a-option value="no">未发</a-option>
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
  </div>
</template>

<style scoped>
.shipment-workbench__filter :deep(.filter-field) {
  min-width: 0;
}

.shipment-workbench__filter :deep(.filter-grid) {
  grid-template-columns: 1fr 1fr 2.6fr 1fr 1fr 1fr;
}

.shipment-workbench__package-field {
  grid-column: 1 / span 1;
  grid-row: 2;
}
</style>
