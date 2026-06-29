<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconSettings,
  IconPlus,
  IconUpload,
  IconDownload,
  IconDown,
  IconEye,
  IconMore,
  IconCustomerService,
} from '@arco-design/web-vue/es/icon';
import CustomerDetailDrawer from './CustomerDetailDrawer.vue';
import CustomerFormModal from './CustomerFormModal.vue';
import { mockCustomers } from './mockData';
import type { CooperateSegment, CustomerQuery, CustomerRecord, ListScope } from './types';

const defaultQuery = (): CustomerQuery => ({
  name: '',
  customerType: undefined,
  country: undefined,
  tagInclude: '',
  tagExclude: '',
  contactKeyword: '',
  contactEmail: '',
  contactPhone: '',
  createdRange: [],
  lastFollowRange: [],
  lastShipRange: [],
  csName: undefined,
  opsStaff: undefined,
  creator: undefined,
});

const query = reactive<CustomerQuery>(defaultQuery());
const appliedQuery = ref<CustomerQuery>(defaultQuery());
const cooperateSegment = ref<CooperateSegment>('uncooperated');
const listScope = ref<ListScope>('all');
const advancedFilterVisible = ref(false);
const loading = ref(false);
const allRows = ref<CustomerRecord[]>([...mockCustomers]);
const tableRef = ref<VxeTableInstance>();
const selectedIds = ref<string[]>([]);

const detailVisible = ref(false);
const formModalVisible = ref(false);
const formModalMode = ref<'create' | 'edit'>('create');
const currentRow = ref<CustomerRecord | null>(null);

const page = reactive({ current: 1, size: 100, total: 0 });

const inDateRange = (value: string, range: string[]) => {
  if (!value || range.length !== 2) return range.length !== 2;
  return value >= range[0] && value <= range[1];
};

const tagMatch = (tags: CustomerRecord['tags'], keyword: string, mode: 'include' | 'exclude') => {
  if (!keyword.trim()) return true;
  const hit = tags.some((t) => t.label.includes(keyword.trim()));
  return mode === 'include' ? hit : !hit;
};

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (row.cooperateStatus !== cooperateSegment.value) return false;
    if (listScope.value === 'deleted' && !row.deleted) return false;
    if (listScope.value === 'all' && row.deleted) return false;
    if (q.name && !row.name.includes(q.name)) return false;
    if (q.customerType && row.customerType !== q.customerType) return false;
    if (q.country && row.country !== q.country) return false;
    if (!tagMatch(row.tags, q.tagInclude, 'include')) return false;
    if (!tagMatch(row.tags, q.tagExclude, 'exclude')) return false;
    if (q.contactKeyword && !row.contactName.includes(q.contactKeyword)) return false;
    if (q.contactEmail && !row.contactEmail.includes(q.contactEmail)) return false;
    if (q.contactPhone && !row.contactPhone.includes(q.contactPhone)) return false;
    if (q.csName && row.csName !== q.csName) return false;
    if (q.opsStaff && row.opsStaff !== q.opsStaff) return false;
    if (q.creator && row.creator !== q.creator) return false;
    if (!inDateRange(row.createdAt, q.createdRange)) return false;
    if (!inDateRange(row.lastFollowAt, q.lastFollowRange)) return false;
    if (!inDateRange(row.lastShipAt, q.lastShipRange)) return false;
    return true;
  });
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const selectedCount = computed(() => selectedIds.value.length);

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
    createdRange: [...query.createdRange],
    lastFollowRange: [...query.lastFollowRange],
    lastShipRange: [...query.lastShipRange],
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
  query.tagInclude = '';
  query.tagExclude = '';
  query.contactKeyword = '';
  query.contactEmail = '';
  query.contactPhone = '';
  query.createdRange = [];
  query.lastFollowRange = [];
  query.lastShipRange = [];
  query.csName = undefined;
  query.opsStaff = undefined;
  query.creator = undefined;
};

const applyAdvancedFilters = () => {
  advancedFilterVisible.value = false;
  handleSearch();
};

const onCooperateChange = (seg: CooperateSegment) => {
  cooperateSegment.value = seg;
  page.current = 1;
  fetchList();
};

const onListScopeChange = (scope: ListScope) => {
  listScope.value = scope;
  page.current = 1;
  fetchList();
};

const onCheckboxChange = ({ records }: { records: CustomerRecord[] }) => {
  selectedIds.value = records.map((r) => r.Id);
};

const clearSelection = () => {
  tableRef.value?.clearCheckboxRow();
  selectedIds.value = [];
};

const requireSelection = (action: string) => {
  if (!selectedIds.value.length) {
    Message.warning(`请先勾选客户再${action}`);
    return false;
  }
  return true;
};

const handleBatchDelete = () => {
  if (!requireSelection('删除')) return;
  Modal.confirm({
    title: '批量删除',
    content: `确认删除已选 ${selectedIds.value.length} 个客户？删除后可在「已删除客户」中查看。`,
    okButtonProps: { status: 'danger' },
    onOk: () => {
      allRows.value = allRows.value.map((r) =>
        selectedIds.value.includes(r.Id) ? { ...r, deleted: true } : r,
      );
      clearSelection();
      Message.success('已移入删除列表');
      fetchList();
    },
  });
};

const handleBatchAction = (label: string) => {
  if (!requireSelection(label)) return;
  Message.info(`${label}：已选 ${selectedIds.value.length} 条`);
};

const handleExport = () => Message.info('导出任务已提交');
const handleImport = () => Message.info('导入功能开发中');

const openCreate = () => {
  currentRow.value = null;
  formModalMode.value = 'create';
  formModalVisible.value = true;
};

const openView = (row: CustomerRecord) => {
  currentRow.value = row;
  detailVisible.value = true;
};

const openEdit = (row: CustomerRecord) => {
  currentRow.value = row;
  formModalMode.value = 'edit';
  formModalVisible.value = true;
};

const handleTransfer = (row: CustomerRecord) => {
  Message.info(`权限转移：${row.name}`);
};

const handleDelete = (row: CustomerRecord) => {
  const target = allRows.value.find((r) => r.Id === row.Id);
  if (target) target.deleted = true;
  Message.success('已移入删除列表');
  fetchList();
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
    <!-- L1 合作状态分段 -->
    <div class="zone-l1-transport zone-card">
      <button
        type="button"
        class="seg-btn"
        :class="{ 'seg-btn--active': cooperateSegment === 'uncooperated' }"
        @click="onCooperateChange('uncooperated')"
      >
        未合作
      </button>
      <button
        type="button"
        class="seg-btn"
        :class="{ 'seg-btn--active': cooperateSegment === 'cooperated' }"
        @click="onCooperateChange('cooperated')"
      >
        已合作
      </button>
    </div>

    <!-- L2 Tier 2 筛选：核心行 + 更多筛选抽屉 -->
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">客户名称</label>
          <a-input
            v-model="query.name"
            size="small"
            allow-clear
            placeholder="请输入客户名称"
            @press-enter="handleSearch"
          />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">客户类型</label>
          <a-select v-model="query.customerType" size="small" allow-clear placeholder="请选择">
            <a-option value="直客">直客</a-option>
            <a-option value="同行">同行</a-option>
            <a-option value="海外代理">海外代理</a-option>
          </a-select>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">国家</label>
          <a-select v-model="query.country" size="small" allow-clear placeholder="请选择">
            <a-option value="中国">中国</a-option>
            <a-option value="德国">德国</a-option>
            <a-option value="美国">美国</a-option>
            <a-option value="泰国">泰国</a-option>
            <a-option value="荷兰">荷兰</a-option>
          </a-select>
        </div>
        <div class="filter-card__inline-actions">
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

    <!-- L3 操作栏 + 列表范围 Tab -->
    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" type="primary" @click="openCreate">
            <template #icon><icon-plus /></template>
            新增
          </a-button>
          <a-button size="small" type="outline" @click="handleImport">
            <template #icon><icon-upload /></template>
            导入
          </a-button>
          <a-button size="small" type="outline" @click="handleExport">
            <template #icon><icon-download /></template>
            导出
          </a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              批量操作
              <icon-down />
            </a-button>
            <template #content>
              <a-doption @click="handleBatchAction('批量编辑')">批量编辑</a-doption>
              <a-doption class="danger-opt" @click="handleBatchDelete">批量删除</a-doption>
              <a-doption @click="handleBatchAction('权限转移')">权限转移</a-doption>
              <a-doption @click="handleBatchAction('解除合伙')">解除合伙</a-doption>
              <a-doption @click="handleBatchAction('添加线索')">添加线索</a-doption>
              <a-doption @click="handleBatchAction('添加运维人员')">添加运维人员</a-doption>
              <a-doption @click="handleBatchAction('刷新最新报价')">刷新最新报价</a-doption>
            </template>
          </a-dropdown>
        </div>
        <div class="bar-sep" />
        <div class="stat-tab-group">
          <button
            type="button"
            class="stab"
            :class="{ 'stab--active': listScope === 'all' }"
            @click="onListScopeChange('all')"
          >
            全部客户
          </button>
          <button
            type="button"
            class="stab"
            :class="{ 'stab--active': listScope === 'deleted' }"
            @click="onListScopeChange('deleted')"
          >
            已删除客户
          </button>
        </div>
      </div>
    </div>

    <!-- L4 表格 -->
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
          <vxe-column field="csName" title="客服" min-width="56" align="center">
            <template #default="{ row }">
              <a-tooltip :content="row.csName">
                <a-button size="small" type="text" class="row-action-btn" tabindex="-1">
                  <template #icon><icon-customer-service /></template>
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
          <vxe-column field="name" title="客户名称" min-width="180" fixed="left">
            <template #default="{ row }">
              <span class="link-text link-text--strong" @click="openView(row)">{{ row.name }}</span>
            </template>
          </vxe-column>
          <vxe-column field="tags" title="标签" min-width="140">
            <template #default="{ row }">
              <template v-if="row.tags?.length">
                <span
                  v-for="tag in row.tags"
                  :key="tag.label"
                  class="s-pill"
                  :data-s="tag.tone"
                  style="margin-right: 4px"
                >
                  {{ tag.label }}
                </span>
              </template>
              <span v-else>—</span>
            </template>
          </vxe-column>
          <vxe-column field="customerType" title="客户类型" min-width="100" />
          <vxe-column field="country" title="国家" min-width="90" />
          <vxe-column field="contactName" title="联系人" min-width="120" />
          <vxe-column field="contactEmail" title="联系人邮箱" min-width="160" />
          <vxe-column field="contactPhone" title="联系人电话" min-width="120" />
          <vxe-column field="contactTitle" title="联系人职务" min-width="100" />
          <vxe-column field="lastFollowUp" title="最新跟进记录" min-width="200" />
          <vxe-column title="操作" width="88" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看">
                  <a-button
                    size="small"
                    type="text"
                    class="row-action-btn row-action-btn--primary"
                    @click="openView(row)"
                  >
                    <template #icon><icon-eye /></template>
                  </a-button>
                </a-tooltip>
                <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
                  <a-button
                    size="small"
                    type="text"
                    class="row-action-btn row-action-btn--more"
                    title="更多操作"
                  >
                    <template #icon><icon-more /></template>
                  </a-button>
                  <template #content>
                    <a-doption @click="openEdit(row)">编辑</a-doption>
                    <a-doption @click="handleTransfer(row)">权限转移</a-doption>
                    <a-divider class="action-menu__divider" />
                    <a-popconfirm content="确认删除该客户？删除后可在「已删除客户」中查看。" @ok="handleDelete(row)">
                      <a-doption class="danger-opt">删除</a-doption>
                    </a-popconfirm>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <!-- 更多筛选抽屉 -->
    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="更多筛选"
      :width="640"
      :footer="true"
      class="query-filter-drawer"
      :mask-closable="false"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="query">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">标签 / 联系人</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="含有部分标签">
                  <a-input v-model="query.tagInclude" size="small" allow-clear placeholder="标签关键词" />
                </a-form-item>
                <a-form-item label="排除含有部分标签">
                  <a-input v-model="query.tagExclude" size="small" allow-clear placeholder="排除标签关键词" />
                </a-form-item>
                <a-form-item label="联系人">
                  <a-input v-model="query.contactKeyword" size="small" allow-clear placeholder="联系人姓名" />
                </a-form-item>
                <a-form-item label="联系人邮箱">
                  <a-input v-model="query.contactEmail" size="small" allow-clear placeholder="邮箱关键词" />
                </a-form-item>
                <a-form-item label="联系人电话">
                  <a-input v-model="query.contactPhone" size="small" allow-clear placeholder="电话关键词" />
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">时间范围</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="创建时间">
                  <a-range-picker
                    v-model="query.createdRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
                <a-form-item label="最后跟进时间">
                  <a-range-picker
                    v-model="query.lastFollowRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
                <a-form-item label="最后发货时间">
                  <a-range-picker
                    v-model="query.lastShipRange"
                    size="small"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">归属人员</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="负责客服">
                  <a-select v-model="query.csName" size="small" allow-clear placeholder="请选择">
                    <a-option value="张三">张三</a-option>
                    <a-option value="李四">李四</a-option>
                    <a-option value="王五">王五</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="运维人员">
                  <a-select v-model="query.opsStaff" size="small" allow-clear placeholder="请选择">
                    <a-option value="李四">李四</a-option>
                    <a-option value="王五">王五</a-option>
                    <a-option value="赵六">赵六</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="创建人">
                  <a-select v-model="query.creator" size="small" allow-clear placeholder="请选择">
                    <a-option value="admin">admin</a-option>
                    <a-option value="zhangsan">zhangsan</a-option>
                    <a-option value="lisi">lisi</a-option>
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

    <customer-detail-drawer v-model:visible="detailVisible" :record="currentRow" />
    <customer-form-modal
      v-model:visible="formModalVisible"
      :mode="formModalMode"
      :record="currentRow"
      @saved="fetchList"
    />
  </div>
</template>

<style scoped>
</style>
