<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import CustomerSearch from './components/CustomerSearch.vue';
import CustomerActionBar from './components/CustomerActionBar.vue';
import CustomerTable from './components/CustomerTable.vue';
import CustomerTableCap from './components/CustomerTableCap.vue';
import CustomerDetailDrawer from './components/CustomerDetailDrawer.vue';
import { useCustomerList } from './composables/useCustomerList';
import { useCustomerTableColumns } from './composables/useCustomerTableColumns';
import type { CustomerRecord } from './types';
import { useRouter } from 'vue-router';

const router = useRouter();

const {
  query,
  loading,
  selectedIds,
  filterExpanded,
  page,
  drawerVisible,
  currentRecord,
  pagedRows,
  fetchList,
  handleSearch,
  handleReset,
  handlePageChange,
  openDetail,
  toggleStar,
  deleteRecord
} = useCustomerList();

const { columnOptions, visibleColumns, toggleColumn } = useCustomerTableColumns();

const handleCreate = () => {
  router.push({ name: 'CustomerCreate' });
};

const handleEdit = (row: CustomerRecord) => {
  router.push({ name: 'CustomerDetail', query: { id: row.Id } });
};

const handleDelete = (row: CustomerRecord) => {
  deleteRecord(row);
  Message.success('已删除');
};

const handleBatch = (action: string) => {
  Message.info(`批量操作：${action}（开发中）`);
};

const handleImport = () => {
  Message.info('导入功能开发中');
};

const handleExport = () => {
  Message.info('导出功能开发中');
};
</script>

<template>
  <div class="page-root page-root--dense">
    <customer-search
      :query="query"
      :filter-expanded="filterExpanded"
      @search="handleSearch"
      @reset="handleReset"
      @update:filter-expanded="filterExpanded = $event"
    />

    <customer-action-bar
      :query="query"
      :selected-count="selectedIds.length"
      @refresh="fetchList"
      @create="handleCreate"
      @import="handleImport"
      @export="handleExport"
      @batch="handleBatch"
      @coop-status-change="query.coopStatus = $event"
    />

    <div class="zone-l4-table-card zone-card">
      <customer-table-cap
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
      <customer-table
        :rows="pagedRows"
        :loading="loading"
        :selected-ids="selectedIds"
        @update:selected-ids="selectedIds = $event"
        @view="openDetail"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-star="toggleStar"
      />
    </div>

    <customer-detail-drawer
      v-model:visible="drawerVisible"
      :record="currentRecord"
      @edit="handleEdit"
    />
  </div>
</template>
