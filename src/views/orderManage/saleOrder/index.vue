<script setup lang="ts">
import SaleOrderSearch from './components/SaleOrderSearch.vue';
import SaleOrderActionBar from './components/SaleOrderActionBar.vue';
import SaleOrderTable from './components/SaleOrderTable.vue';
import SaleOrderTableCap from './components/SaleOrderTableCap.vue';
import SaleOrderDetailDrawer from './components/SaleOrderDetailDrawer.vue';
import { useSaleOrderList } from './composables/useSaleOrderList';
import { useSaleOrderTableColumns } from './composables/useSaleOrderTableColumns';

const {
  query,
  loading,
  selectedIds,
  filterExpanded,
  page,
  drawerVisible,
  drawerMode,
  currentRecord,
  detailModel,
  statusCounts,
  pagedRows,
  hiddenAdvancedActive,
  fetchList,
  handleSearch,
  handleReset,
  handleTransportChange,
  handleScopeChange,
  handleStatusChange,
  handleClearStatus,
  handleTimeQuickChange,
  handlePageChange,
  handleExport,
  handleBatch,
  openDetail,
  openCreate,
  openFullDetail,
  saveRecord,
  submitRecord,
  abandonRecord
} = useSaleOrderList();

const { columnOptions, visibleColumns, isVisible, toggleColumn } = useSaleOrderTableColumns();

const enterEditMode = () => {
  drawerMode.value = 'edit';
};
</script>

<template>
  <div class="page-root page-root--dense">

    <sale-order-search
      :query="query"
      :filter-expanded="filterExpanded"
      :hidden-advanced-active="hiddenAdvancedActive"
      @search="handleSearch"
      @reset="handleReset"
      @transport-change="handleTransportChange"
      @update:filter-expanded="filterExpanded = $event"
      @time-quick-change="handleTimeQuickChange"
    />

    <sale-order-action-bar
      :query="query"
      :status-counts="statusCounts"
      :selected-count="selectedIds.length"
      @refresh="fetchList"
      @create="openCreate"
      @scope-change="handleScopeChange"
      @status-change="handleStatusChange"
      @clear-status="handleClearStatus"
      @export="handleExport"
      @batch="handleBatch"
    />

    <div class="zone-l4-table-card zone-card">
      <sale-order-table-cap
        :total="page.total"
        :current="page.current"
        :page-size="page.size"
        :column-options="columnOptions"
        :visible-columns="visibleColumns"
        @update:current="page.current = $event"
        @update:page-size="page.size = $event"
        @page-change="handlePageChange"
        @page-size-change="handlePageChange"
        @toggle-column="toggleColumn"
      />
      <sale-order-table
        :rows="pagedRows"
        :loading="loading"
        :selected-ids="selectedIds"
        :is-column-visible="isVisible"
        @update:selected-ids="selectedIds = $event"
        @view="openDetail($event, 'view')"
        @edit="openDetail($event, 'edit')"
      />
    </div>

    <sale-order-detail-drawer
      v-model:visible="drawerVisible"
      :mode="drawerMode"
      :record="currentRecord"
      :detail="detailModel"
      @save="saveRecord"
      @submit="submitRecord"
      @abandon="abandonRecord"
      @edit="enterEditMode"
      @view-full="currentRecord && openFullDetail(currentRecord)"
    />
  </div>
</template>
