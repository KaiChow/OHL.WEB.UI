<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconSearch,
  IconRefresh,
  IconSettings,
  IconPlus,
  IconEye,
  IconEdit,
  IconMore,
} from '@arco-design/web-vue/es/icon';
import NotificationFormModal from './NotificationFormModal.vue';
import NotificationDetailDrawer from './NotificationDetailDrawer.vue';
import { mockNotifications } from './mockData';
import type { NotificationQuery, NotificationRecord, NotificationStatus, NotificationStatusKey } from './types';

const STATUS_TABS: { key: NotificationStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'pending', label: '待发布' },
  { key: 'published', label: '已发布' },
  { key: 'expired', label: '已过期' },
  { key: 'cancelled', label: '已取消' },
];

const STATUS_PILL: Record<NotificationStatusKey, { s: string; label: string }> = {
  draft: { s: 'draft', label: '草稿' },
  pending: { s: 'wait', label: '待发布' },
  published: { s: 'rel', label: '已发布' },
  expired: { s: 'partial', label: '已过期' },
  cancelled: { s: 'rej', label: '已取消' },
};

const statusPill = (status: NotificationStatusKey) => STATUS_PILL[status];

const defaultQuery = (): NotificationQuery => ({
  subject: '',
  content: '',
  publishTimeRange: [],
  effectivePeriod: undefined,
  targetType: undefined,
  deptGroup: undefined,
  creator: undefined,
});

const query = reactive<NotificationQuery>(defaultQuery());
const appliedQuery = ref<NotificationQuery>(defaultQuery());
const activeStatus = ref<NotificationStatus>('all');
const loading = ref(false);
const allRows = ref<NotificationRecord[]>([...mockNotifications]);

const formModalVisible = ref(false);
const formModalMode = ref<'create' | 'edit'>('create');
const detailDrawerVisible = ref(false);
const currentRow = ref<NotificationRecord | null>(null);

const page = reactive({ current: 1, size: 50, total: 0 });

const filteredRows = computed(() => {
  const q = appliedQuery.value;
  return allRows.value.filter((row) => {
    if (activeStatus.value !== 'all' && row.status !== activeStatus.value) return false;
    if (q.subject && !row.subject.includes(q.subject)) return false;
    if (q.content && !row.content.includes(q.content)) return false;
    if (q.effectivePeriod && row.effectivePeriod !== q.effectivePeriod) return false;
    if (q.targetType && row.targetType !== q.targetType) return false;
    if (q.creator && row.creator !== q.creator) return false;
    if (q.publishTimeRange.length === 2 && row.lastPublishTime) {
      const [start, end] = q.publishTimeRange;
      if (row.lastPublishTime < start || row.lastPublishTime > `${end} 23:59:59`) return false;
    }
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
  appliedQuery.value = { ...query, publishTimeRange: [...query.publishTimeRange] };
  page.current = 1;
  fetchList();
};

const handleReset = () => {
  Object.assign(query, defaultQuery());
  appliedQuery.value = defaultQuery();
  page.current = 1;
  fetchList();
};

const onStatusChange = (status: NotificationStatus) => {
  activeStatus.value = status;
  page.current = 1;
  fetchList();
};

const openCreate = () => {
  currentRow.value = null;
  formModalMode.value = 'create';
  formModalVisible.value = true;
};

const openView = (row: NotificationRecord) => {
  currentRow.value = row;
  detailDrawerVisible.value = true;
};

const openEdit = (row: NotificationRecord) => {
  currentRow.value = row;
  formModalMode.value = 'edit';
  formModalVisible.value = true;
};

const handleDelete = (row: NotificationRecord) => {
  allRows.value = allRows.value.filter((r) => r.Id !== row.Id);
  Message.success('已删除');
  fetchList();
};

const handleStrategyManage = () => {
  Message.info('自定义策略管理');
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
    <!-- S1：7 字段全平铺，无展开/抽屉 -->
    <div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
      <div class="filter-card__matrix">
        <div class="filter-grid">
          <div class="filter-field">
            <label class="filter-field__label">主题</label>
            <a-input
              v-model="query.subject"
              size="small"
              allow-clear
              placeholder="请输入主题关键词"
              @press-enter="handleSearch"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">内容</label>
            <a-input
              v-model="query.content"
              size="small"
              allow-clear
              placeholder="请输入内容关键词"
              @press-enter="handleSearch"
            />
          </div>
          <div class="filter-field filter-field--span2">
            <label class="filter-field__label">最后发布时间</label>
            <a-range-picker
              v-model="query.publishTimeRange"
              size="small"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">生效周期</label>
            <a-select v-model="query.effectivePeriod" size="small" allow-clear placeholder="请选择">
              <a-option value="是">是</a-option>
              <a-option value="否">否</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">通知对象</label>
            <a-select v-model="query.targetType" size="small" allow-clear placeholder="请选择">
              <a-option value="all">全员通知</a-option>
              <a-option value="custom">自定义通知</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">所在部门/组</label>
            <a-select v-model="query.deptGroup" size="small" allow-clear placeholder="请选择">
              <a-option value="ops">操作部</a-option>
              <a-option value="sales">销售部</a-option>
              <a-option value="finance">财务部</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">创建人</label>
            <a-select v-model="query.creator" size="small" allow-clear placeholder="请选择">
              <a-option value="admin">admin</a-option>
              <a-option value="zhangsan">zhangsan</a-option>
              <a-option value="lisi">lisi</a-option>
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
        </div>
      </div>
    </div>

    <!-- L3 操作 + 状态 Tab -->
    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" type="primary" @click="openCreate">
            <template #icon><icon-plus /></template>
            新建通知
          </a-button>
          <a-button size="small" type="outline" @click="handleStrategyManage">
            自定义策略管理
          </a-button>
        </div>
        <div class="bar-sep" />
        <div class="stat-tab-group">
          <button
            v-for="tab in STATUS_TABS"
            :key="tab.key"
            type="button"
            class="stab"
            :class="{ 'stab--active': activeStatus === tab.key }"
            @click="onStatusChange(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- L4 表格区 -->
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
          <vxe-column field="type" title="通知类型" min-width="100" />
          <vxe-column field="subject" title="主题" min-width="180">
            <template #default="{ row }">
              <span class="link-text link-text--strong" @click="openView(row)">{{ row.subject }}</span>
            </template>
          </vxe-column>
          <vxe-column field="content" title="内容" min-width="200" />
          <vxe-column field="files" title="文件" min-width="140">
            <template #default="{ row }">
              <template v-if="row.files?.length">
                <span
                  v-for="(file, idx) in row.files"
                  :key="file.uid"
                  class="link-text"
                >
                  {{ file.name }}<template v-if="idx < row.files.length - 1">、</template>
                </span>
              </template>
              <span v-else>—</span>
            </template>
          </vxe-column>
          <vxe-column field="status" title="发布状态" min-width="90" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="statusPill(row.status).s">
                {{ statusPill(row.status).label }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="lastPublishTime" title="最后发布时间" min-width="160" />
          <vxe-column field="targetLabel" title="通知对象" min-width="110" align="center">
            <template #default="{ row }">
              <span class="link-text">{{ row.targetLabel }}</span>
            </template>
          </vxe-column>
          <vxe-column field="effectivePeriod" title="生效周期" min-width="80" align="center" />
          <vxe-column field="creator" title="创建人" min-width="80" />
          <vxe-column field="lastEditTime" title="最后编辑时间" min-width="160" />
          <vxe-column title="操作" width="88" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip v-if="row.status === 'draft' || row.status === 'pending'" content="编辑">
                  <a-button
                    size="small"
                    type="text"
                    class="row-action-btn row-action-btn--primary"
                    @click="openEdit(row)"
                  >
                    <icon-edit />
                  </a-button>
                </a-tooltip>
                <a-tooltip v-else-if="row.status === 'published' || row.status === 'expired'" content="查看">
                  <a-button
                    size="small"
                    type="text"
                    class="row-action-btn row-action-btn--primary"
                    @click="openView(row)"
                  >
                    <icon-eye />
                  </a-button>
                </a-tooltip>
                <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
                  <a-button
                    size="small"
                    type="text"
                    class="row-action-btn row-action-btn--more"
                    title="更多操作"
                  >
                    <icon-more />
                  </a-button>
                  <template #content>
                    <a-popconfirm content="确认删除该通知？" @ok="handleDelete(row)">
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

    <notification-form-modal
      v-model:visible="formModalVisible"
      :mode="formModalMode"
      :record="currentRow"
      @saved="fetchList"
    />
    <notification-detail-drawer
      v-model:visible="detailDrawerVisible"
      :record="currentRow"
    />
  </div>
</template>

<style scoped>
</style>
