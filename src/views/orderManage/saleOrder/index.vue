<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import AdvancedFilterPanel from './components/AdvancedFilterPanel.vue';
import SaleOrderDetailDrawer from './components/SaleOrderDetailDrawer.vue';
import SaleOrderSearchPanel from './components/SaleOrderSearchPanel.vue';
import SaleOrderStatusFilters from './components/SaleOrderStatusFilters.vue';
import SaleOrderTable from './components/SaleOrderTable.vue';
import SaleOrderToolbar from './components/SaleOrderToolbar.vue';
import { useSaleOrderList } from './composables/useSaleOrderList';

const saleOrder = useSaleOrderList();

const resetAllFilters = () => {
  saleOrder.resetFilters();
  Message.success('已重置查询条件');
};

const resetAdvancedFilters = () => {
  saleOrder.resetAdvancedFilters();
  Message.success('已清空高级查询条件');
};

const applyAdvancedFilters = () => {
  saleOrder.currentPage.value = 1;
  saleOrder.advancedOpen.value = false;
  Message.success('已应用高级查询');
};
</script>

<template>
  <sale-order-search-panel
    v-model:keyword="saleOrder.keyword.value"
    v-model:quick-search-field="saleOrder.quickSearchField.value"
    v-model:business-type="saleOrder.businessType.value"
    v-model:import-export-type="saleOrder.importExportType.value"
    v-model:salesman-keyword="saleOrder.salesmanKeyword.value"
    v-model:operator-keyword="saleOrder.operatorKeyword.value"
    v-model:customer-service-keyword="saleOrder.customerServiceKeyword.value"
    v-model:service-order-no="saleOrder.serviceOrderNo.value"
    v-model:loading-type="saleOrder.loadingType.value"
    v-model:shipper-keyword="saleOrder.shipperKeyword.value"
    v-model:consignee-keyword="saleOrder.consigneeKeyword.value"
    v-model:quick-tag="saleOrder.quickTag.value"
    v-model:merge-cells="saleOrder.mergeCells.value"
    v-model:active-transport="saleOrder.activeTransport.value"
    :active-advanced-count="saleOrder.activeAdvancedCount.value"
    @search="saleOrder.currentPage.value = 1"
    @reset="resetAllFilters"
    @open-advanced="saleOrder.advancedOpen.value = !saleOrder.advancedOpen.value"
  />

  <advanced-filter-panel
    :visible="saleOrder.advancedOpen.value"
    v-model:advanced-filters="saleOrder.advancedFilters.value"
    :active-advanced-count="saleOrder.activeAdvancedCount.value"
    @reset="resetAdvancedFilters"
    @close="saleOrder.advancedOpen.value = false"
    @apply="applyAdvancedFilters"
  />

  <section class="table-wrap data-section">
    <sale-order-toolbar
      :current-page="saleOrder.currentPage.value"
      :page-size="saleOrder.pageSize.value"
      :total="saleOrder.filteredOrders.value.length"
      @refresh="resetAllFilters"
      @update:current-page="saleOrder.currentPage.value = $event"
      @update:page-size="saleOrder.pageSize.value = $event"
    />

    <sale-order-status-filters
      v-model:scope-filter="saleOrder.scopeFilter.value"
      v-model:phase-filter="saleOrder.phaseFilter.value"
      :phase-tabs="saleOrder.phaseTabs.value"
    />

    <sale-order-table
      :rows="saleOrder.pagedOrders.value"
      :order-count="saleOrder.orderCount.value"
      :total="saleOrder.filteredOrders.value.length"
      :merge-cell-config="saleOrder.mergeCellConfig.value"
      :get-cell-class-name="saleOrder.getCellClassName"
      :get-row-class-name="saleOrder.getRowClassName"
      :set-hovered-order-group="saleOrder.setHoveredOrderGroup"
      :set-current-order-group="saleOrder.setCurrentOrderGroup"
      @open-detail="saleOrder.openOrderDetail"
    />
  </section>

  <sale-order-detail-drawer
    v-model:visible="saleOrder.detailOpen.value"
    :selected-order="saleOrder.selectedOrder.value"
  />
</template>
