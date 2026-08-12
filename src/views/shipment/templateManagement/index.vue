<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue';
import {
  IconCopy,
  IconDelete,
  IconEdit,
  IconExport,
  IconFilter,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
} from '@arco-design/web-vue/es/icon';
import StandardListFrame from '@/components/workbench/StandardListFrame.vue';
import QueryFieldGrid from '@/components/workbench/QueryFieldGrid.vue';
import QueryFieldCol from '@/components/workbench/QueryFieldCol.vue';
import WorkbenchTableToolbar from '@/components/workbench/WorkbenchTableToolbar.vue';
import WorkbenchEmptyState from '@/components/workbench/WorkbenchEmptyState.vue';
import WorkbenchRowActions from '@/components/workbench/WorkbenchRowActions.vue';
import { compactVerticalFormLabelStyle, denseFormGridGutter, denseFormItemStyle } from '@/design-system/formLayout';
import { ROW_ACTION_COLUMN_WIDTH } from '@/design-system/rowActions';
import type { WorkbenchRowAction } from '@/design-system/rowActions';
import { stableTableRowConfig } from '@/design-system/tableConfig';
import { buildDateTimeStamp, buildTimestampSuffix, downloadCsvFile } from '@/utils/mock-actions';
import { createTemplateMockRows } from './mockData';
import { TEMPLATE_MANAGEMENT_FEATURE_CONTRACTS } from './featureContracts';
import type { TemplateDraft, TemplateQuery, TemplateRecord, TemplateType } from './types';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
void TEMPLATE_MANAGEMENT_FEATURE_CONTRACTS;

const blankQuery = (): TemplateQuery => ({
  templateName: '',
  creator: '',
  pol: '',
  pod: '',
  carrier: '',
  contractNo: '',
  peer: '',
  createdRange: [],
  updatedRange: [],
});

const blankDraft = (templateType: TemplateType): TemplateDraft => ({
  templateType,
  templateName: '',
  carrier: '',
  contractNo: '',
  pol: '',
  pod: '',
  peer: '',
  creator: 'admin',
  viewers: [],
  isPublic: false,
  isSwitchBill: false,
});

const rows = ref(createTemplateMockRows());
const query = reactive(blankQuery());
const appliedQuery = ref(blankQuery());
const advancedFilterVisible = ref(false);
const advancedApplying = ref(false);
const advancedDraft = reactive(blankQuery());
const querying = ref(false);
const activeType = ref<TemplateType>('master');
const page = reactive({ current: 1, size: 50 });

const editorVisible = ref(false);
const editorForm = ref<FormInstance>();
const editorMode = ref<'create' | 'edit'>('create');
const editingId = ref('');
const saving = ref(false);
const draft = reactive<TemplateDraft>(blankDraft('master'));

const deleteVisible = ref(false);
const deleteTarget = ref<TemplateRecord>();
const deleting = ref(false);

const columnSettingsVisible = ref(false);
const defaultColumns = ['carrier', 'contractNo', 'pol', 'pod', 'peer', 'creator', 'createdAt', 'updatedAt', 'viewers', 'isPublic', 'isSwitchBill'];
const visibleColumns = ref([...defaultColumns]);
const columnSettingDraft = ref([...defaultColumns]);

const normalize = (value: string) => value.trim().toLowerCase();
const contains = (source: string, expected: string) => !expected || source.toLowerCase().includes(expected);
const inRange = (source: string, range: string[]) => {
  if (!range?.length) return true;
  const date = source.slice(0, 10);
  return (!range[0] || date >= range[0]) && (!range[1] || date <= range[1]);
};

const filteredRows = computed(() => {
  const filter = appliedQuery.value;
  return rows.value.filter((row) => row.templateType === activeType.value
    && contains(row.templateName, normalize(filter.templateName))
    && contains(row.creator, normalize(filter.creator))
    && contains(row.pol, normalize(filter.pol))
    && contains(row.pod, normalize(filter.pod))
    && contains(row.carrier, normalize(filter.carrier))
    && contains(row.contractNo, normalize(filter.contractNo))
    && contains(row.peer, normalize(filter.peer))
    && inRange(row.createdAt, filter.createdRange)
    && inRange(row.updatedAt, filter.updatedRange));
});

const pagedRows = computed(() => {
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});
const uiScenario = computed(() => route.query.scenario === 'permission' ? 'permission' : route.query.scenario === 'error' ? 'error' : 'normal');
const renderedRows = computed(() => uiScenario.value === 'normal' ? pagedRows.value : []);

const hasActiveQuery = computed(() => Object.entries(appliedQuery.value).some(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value)));
const advancedActiveCount = computed(() => Object.values(appliedQuery.value)
  .filter((value) => Array.isArray(value) ? value.length > 0 : Boolean(value)).length);

const isColumnVisible = (field: string) => visibleColumns.value.includes(field);
const assignQuery = (target: TemplateQuery, source: TemplateQuery) => Object.assign(target, {
  ...source,
  createdRange: [...source.createdRange],
  updatedRange: [...source.updatedRange],
});

const handleSearch = async () => {
  if (querying.value) return;
  querying.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 220));
  appliedQuery.value = { ...query, createdRange: [...query.createdRange], updatedRange: [...query.updatedRange] };
  page.current = 1;
  querying.value = false;
};

const handleReset = () => {
  const empty = blankQuery();
  assignQuery(query, empty);
  appliedQuery.value = empty;
  advancedFilterVisible.value = false;
  page.current = 1;
};

const openAdvancedFilters = () => {
  assignQuery(advancedDraft, query);
  advancedFilterVisible.value = true;
};

const clearAdvancedFilters = () => {
  assignQuery(advancedDraft, blankQuery());
};

const applyAdvancedFilters = async () => {
  if (advancedApplying.value) return;
  advancedApplying.value = true;
  try {
    assignQuery(query, advancedDraft);
    advancedFilterVisible.value = false;
    await handleSearch();
  } finally {
    advancedApplying.value = false;
  }
};

const handleRefresh = async () => {
  querying.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  querying.value = false;
  Message.success(t('templateManagement.messages.refreshed'));
};

const recoverList = () => router.replace({ query: { ...route.query, scenario: undefined } });

const onTypeChange = (value: string | number | boolean) => {
  if (value !== 'master' && value !== 'supplement') return;
  activeType.value = value;
  page.current = 1;
};

const onPageChange = (current: number) => { page.current = current; };
const onPageSizeChange = (size: number) => {
  page.size = size;
  page.current = 1;
};

const assignDraft = (source: TemplateDraft) => Object.assign(draft, { ...source, viewers: [...source.viewers] });

const openCreate = () => {
  editorMode.value = 'create';
  editingId.value = '';
  assignDraft(blankDraft(activeType.value));
  editorVisible.value = true;
  nextTick(() => editorForm.value?.clearValidate());
};

const openEdit = (row: TemplateRecord) => {
  editorMode.value = 'edit';
  editingId.value = row.id;
  assignDraft({
    templateType: row.templateType,
    templateName: row.templateName,
    carrier: row.carrier,
    contractNo: row.contractNo,
    pol: row.pol,
    pod: row.pod,
    peer: row.peer,
    creator: row.creator,
    viewers: row.viewers,
    isPublic: row.isPublic,
    isSwitchBill: row.isSwitchBill,
  });
  editorVisible.value = true;
  nextTick(() => editorForm.value?.clearValidate());
};

const saveTemplate = async () => {
  const validationErrors = await editorForm.value?.validate();
  if (validationErrors) return false;
  saving.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 220));
  const now = buildDateTimeStamp();
  if (editorMode.value === 'edit') {
    const row = rows.value.find((item) => item.id === editingId.value);
    if (row) Object.assign(row, { ...draft, viewers: [...draft.viewers], updatedAt: now });
    Message.success(t('templateManagement.messages.updated', { name: draft.templateName }));
  } else {
    rows.value.unshift({
      ...draft,
      viewers: [...draft.viewers],
      id: `tpl-local-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    });
    activeType.value = draft.templateType;
    page.current = 1;
    Message.success(t('templateManagement.messages.created', { name: draft.templateName }));
  }
  saving.value = false;
  return true;
};

const copyTemplate = (row: TemplateRecord) => {
  const now = buildDateTimeStamp();
  const copy: TemplateRecord = {
    ...row,
    id: `tpl-copy-${Date.now()}`,
    templateName: `${row.templateName}-${t('templateManagement.copySuffix')}`,
    creator: 'admin',
    createdAt: now,
    updatedAt: now,
    viewers: [...row.viewers],
    isPublic: false,
  };
  rows.value.unshift(copy);
  page.current = 1;
  Message.success(t('templateManagement.messages.copied', { name: copy.templateName }));
};

const exportTemplate = (row: TemplateRecord) => {
  downloadCsvFile(
    `bill-of-lading-template-${buildTimestampSuffix()}.csv`,
    [
      t('templateManagement.columns.templateName'),
      t('templateManagement.columns.carrier'),
      t('templateManagement.columns.contractNo'),
      t('templateManagement.columns.pol'),
      t('templateManagement.columns.pod'),
      t('templateManagement.columns.peer'),
      t('templateManagement.columns.creator'),
      t('templateManagement.columns.createdAt'),
      t('templateManagement.columns.updatedAt'),
      t('templateManagement.columns.viewers'),
      t('templateManagement.columns.isPublic'),
      t('templateManagement.columns.isSwitchBill'),
    ],
    [[row.templateName, row.carrier, row.contractNo, row.pol, row.pod, row.peer, row.creator, row.createdAt, row.updatedAt, row.viewers.join(', '), row.isPublic ? t('templateManagement.yes') : t('templateManagement.no'), row.isSwitchBill ? t('templateManagement.yes') : t('templateManagement.no')]],
  );
  Message.success(t('templateManagement.messages.exported', { name: row.templateName }));
};

const openDelete = (row: TemplateRecord) => {
  deleteTarget.value = row;
  deleteVisible.value = true;
};

const getRowActions = (row: TemplateRecord): WorkbenchRowAction[] => [
  { key: 'edit', label: t('common.edit'), icon: IconEdit, onClick: () => openEdit(row) },
  { key: 'copy', label: t('templateManagement.actions.copy'), icon: IconCopy, onClick: () => copyTemplate(row) },
  { key: 'export', label: t('common.export'), icon: IconExport, onClick: () => exportTemplate(row) },
  { key: 'delete', label: t('templateManagement.actions.delete'), icon: IconDelete, danger: true, onClick: () => openDelete(row) },
];

const confirmDelete = async () => {
  if (!deleteTarget.value) return false;
  deleting.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  const deletedName = deleteTarget.value.templateName;
  rows.value = rows.value.filter((row) => row.id !== deleteTarget.value?.id);
  const maxPage = Math.max(1, Math.ceil(filteredRows.value.length / page.size));
  page.current = Math.min(page.current, maxPage);
  deleting.value = false;
  Message.success(t('templateManagement.messages.deleted', { name: deletedName }));
  return true;
};

const openColumnSettings = () => {
  columnSettingDraft.value = [...visibleColumns.value];
  columnSettingsVisible.value = true;
};

const applyColumnSettings = async () => {
  visibleColumns.value = [...columnSettingDraft.value];
  await nextTick();
  Message.success(t('templateManagement.messages.columnsApplied'));
  return true;
};

const resetColumnSettings = () => { columnSettingDraft.value = [...defaultColumns]; };

watch(activeType, () => {
  const maxPage = Math.max(1, Math.ceil(filteredRows.value.length / page.size));
  page.current = Math.min(page.current, maxPage);
});
</script>

<template>
  <StandardListFrame page-id="shipment-template-management" data-pesdp-page="shipment-template-management">
    <template #pageMode>
      <div class="template-mode">
        <a-radio-group type="button" size="small" :model-value="activeType" @change="onTypeChange">
          <a-radio value="master">{{ t('templateManagement.types.master') }}</a-radio>
          <a-radio value="supplement">{{ t('templateManagement.types.supplement') }}</a-radio>
        </a-radio-group>
      </div>
    </template>

    <template #query>
      <a-form :model="query" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
        <QueryFieldGrid>
          <QueryFieldCol role="standard">
            <a-form-item :label="t('templateManagement.fields.templateName')">
              <a-input v-model="query.templateName" allow-clear :placeholder="t('templateManagement.placeholders.templateName')" @press-enter="handleSearch" />
            </a-form-item>
          </QueryFieldCol>
          <QueryFieldCol role="standard">
            <a-form-item :label="t('templateManagement.fields.pol')">
              <a-input v-model="query.pol" allow-clear :placeholder="t('templateManagement.placeholders.pol')" @press-enter="handleSearch" />
            </a-form-item>
          </QueryFieldCol>
          <QueryFieldCol role="standard">
            <a-form-item :label="t('templateManagement.fields.pod')">
              <a-input v-model="query.pod" allow-clear :placeholder="t('templateManagement.placeholders.pod')" @press-enter="handleSearch" />
            </a-form-item>
          </QueryFieldCol>
          <QueryFieldCol role="standard">
            <a-form-item :label="t('templateManagement.fields.carrier')">
              <a-select v-model="query.carrier" allow-clear allow-search :placeholder="t('templateManagement.placeholders.carrier')">
                <a-option value="MAERSK">MAERSK</a-option>
                <a-option value="COSCO">COSCO</a-option>
                <a-option value="CMA CGM">CMA CGM</a-option>
                <a-option value="ONE">ONE</a-option>
                <a-option value="EVERGREEN">EVERGREEN</a-option>
                <a-option value="HAPAG-LLOYD">HAPAG-LLOYD</a-option>
              </a-select>
            </a-form-item>
          </QueryFieldCol>
          <QueryFieldCol role="standard">
            <a-form-item :label="t('templateManagement.fields.contractNo')">
              <a-input v-model="query.contractNo" allow-clear :placeholder="t('templateManagement.placeholders.contractNo')" @press-enter="handleSearch" />
            </a-form-item>
          </QueryFieldCol>
          <QueryFieldCol role="actions">
            <div class="query-actions">
              <a-button size="small" type="primary" :loading="querying" @click="handleSearch">
                <template #icon><icon-search /></template>{{ t('common.search') }}
              </a-button>
              <a-button size="small" type="text" @click="handleReset">{{ t('common.reset') }}</a-button>
              <a-badge :count="advancedActiveCount" :offset="[-2, 2]">
                <a-button size="small" type="text" :aria-label="t('common.moreFilters')" @click="openAdvancedFilters">
                  <template #icon><icon-filter /></template>{{ t('common.filter') }}
                </a-button>
              </a-badge>
            </div>
          </QueryFieldCol>
        </QueryFieldGrid>
      </a-form>

      <a-drawer
        v-model:visible="advancedFilterVisible"
        data-ui-surface="advanced-filter"
        width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
        :mask-closable="false"
        :closable="!advancedApplying"
      >
        <template #title>
          <span>{{ t('common.moreFilters') }}</span>
          <span class="advanced-filter-title__hint">{{ t('templateManagement.allFields') }}</span>
        </template>
        <a-form layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
          <a-row :gutter="denseFormGridGutter">
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.templateName')" :style="denseFormItemStyle">
                <a-input v-model="advancedDraft.templateName" allow-clear :placeholder="t('templateManagement.placeholders.templateName')" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.pol')" :style="denseFormItemStyle">
                <a-input v-model="advancedDraft.pol" allow-clear :placeholder="t('templateManagement.placeholders.pol')" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.pod')" :style="denseFormItemStyle">
                <a-input v-model="advancedDraft.pod" allow-clear :placeholder="t('templateManagement.placeholders.pod')" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.carrier')" :style="denseFormItemStyle">
                <a-select v-model="advancedDraft.carrier" allow-clear allow-search :placeholder="t('templateManagement.placeholders.carrier')">
                  <a-option value="MAERSK">MAERSK</a-option>
                  <a-option value="COSCO">COSCO</a-option>
                  <a-option value="CMA CGM">CMA CGM</a-option>
                  <a-option value="ONE">ONE</a-option>
                  <a-option value="EVERGREEN">EVERGREEN</a-option>
                  <a-option value="HAPAG-LLOYD">HAPAG-LLOYD</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.contractNo')" :style="denseFormItemStyle">
                <a-input v-model="advancedDraft.contractNo" allow-clear :placeholder="t('templateManagement.placeholders.contractNo')" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.creator')" :style="denseFormItemStyle">
                <a-input v-model="advancedDraft.creator" allow-clear :placeholder="t('templateManagement.placeholders.creator')" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.peer')" :style="denseFormItemStyle">
                <a-input v-model="advancedDraft.peer" allow-clear :placeholder="t('templateManagement.placeholders.peer')" />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.createdRange')" :style="denseFormItemStyle">
                <a-range-picker v-model="advancedDraft.createdRange" value-format="YYYY-MM-DD" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="12" :xs="24" :sm="12">
              <a-form-item :label="t('templateManagement.fields.updatedRange')" :style="denseFormItemStyle">
                <a-range-picker v-model="advancedDraft.updatedRange" value-format="YYYY-MM-DD" allow-clear />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #footer>
          <div class="advanced-filter-footer">
            <a-button size="small" type="text" @click="clearAdvancedFilters">{{ t('common.clear') }}</a-button>
            <a-space :size="8">
              <a-button size="small" :disabled="advancedApplying" @click="advancedFilterVisible = false">{{ t('common.cancel') }}</a-button>
              <a-button size="small" type="primary" :loading="advancedApplying" @click="applyAdvancedFilters">{{ t('common.apply') }}</a-button>
            </a-space>
          </div>
        </template>
      </a-drawer>
    </template>

    <template #toolbar>
      <WorkbenchTableToolbar
        :current="page.current"
        :page-size="page.size"
        :total="filteredRows.length"
        @change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #commands>
          <a-button size="small" type="primary" @click="openCreate">
            <template #icon><icon-plus /></template>{{ t('templateManagement.actions.create') }}
          </a-button>
        </template>
        <template #utilities>
          <a-tooltip :content="t('common.refresh')">
            <a-button size="small" type="text" class="table-cap-tool" :aria-label="t('common.refresh')" :loading="querying" @click="handleRefresh"><icon-refresh /></a-button>
          </a-tooltip>
          <a-tooltip :content="t('templateManagement.actions.columns')">
            <a-button size="small" type="text" class="table-cap-tool" :aria-label="t('templateManagement.actions.columns')" @click="openColumnSettings"><icon-settings /></a-button>
          </a-tooltip>
        </template>
      </WorkbenchTableToolbar>
    </template>

    <template #table>
      <vxe-table
        :data="renderedRows"
        :loading="querying"
        height="100%"
        auto-resize
        fit
        show-overflow="title"
        :row-config="stableTableRowConfig"
        :seq-config="{ startIndex: (page.current - 1) * page.size }"
      >
        <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />
        <vxe-column field="templateName" :title="t('templateManagement.columns.templateName')" min-width="168" fixed="left">
          <template #default="{ row }">
            <a-button size="mini" type="text" class="identity-link" @click="openEdit(row)">{{ row.templateName }}</a-button>
          </template>
        </vxe-column>
        <vxe-column v-if="isColumnVisible('carrier')" field="carrier" :title="t('templateManagement.columns.carrier')" min-width="100" />
        <vxe-column v-if="isColumnVisible('contractNo')" field="contractNo" :title="t('templateManagement.columns.contractNo')" min-width="130" class-name="tabular" />
        <vxe-column v-if="isColumnVisible('pol')" field="pol" :title="t('templateManagement.columns.pol')" min-width="112" />
        <vxe-column v-if="isColumnVisible('pod')" field="pod" :title="t('templateManagement.columns.pod')" min-width="120" />
        <vxe-column v-if="isColumnVisible('peer')" field="peer" :title="t('templateManagement.columns.peer')" min-width="96" />
        <vxe-column v-if="isColumnVisible('creator')" field="creator" :title="t('templateManagement.columns.creator')" min-width="88" />
        <vxe-column v-if="isColumnVisible('createdAt')" field="createdAt" :title="t('templateManagement.columns.createdAt')" min-width="140" class-name="tabular" />
        <vxe-column v-if="isColumnVisible('updatedAt')" field="updatedAt" :title="t('templateManagement.columns.updatedAt')" min-width="140" class-name="tabular" />
        <vxe-column v-if="isColumnVisible('viewers')" field="viewers" :title="t('templateManagement.columns.viewers')" min-width="150">
          <template #default="{ row }">{{ row.viewers.join(', ') || '-' }}</template>
        </vxe-column>
        <vxe-column v-if="isColumnVisible('isPublic')" field="isPublic" :title="t('templateManagement.columns.isPublic')" min-width="100" align="center">
          <template #default="{ row }"><span class="s-pill" :data-s="row.isPublic ? 'acc' : 'draft'">{{ row.isPublic ? t('templateManagement.yes') : t('templateManagement.no') }}</span></template>
        </vxe-column>
        <vxe-column v-if="isColumnVisible('isSwitchBill')" field="isSwitchBill" :title="t('templateManagement.columns.isSwitchBill')" min-width="88" align="center">
          <template #default="{ row }"><span class="s-pill" :data-s="row.isSwitchBill ? 'wait' : 'draft'">{{ row.isSwitchBill ? t('templateManagement.yes') : t('templateManagement.no') }}</span></template>
        </vxe-column>
        <vxe-column :title="t('common.operations')" :width="ROW_ACTION_COLUMN_WIDTH" fixed="right" align="left">
          <template #default="{ row }">
            <WorkbenchRowActions :actions="getRowActions(row)" :more-label="t('common.moreActions')" />
          </template>
        </vxe-column>
        <template #empty>
          <WorkbenchEmptyState
            :kind="uiScenario === 'permission' ? 'permission' : uiScenario === 'error' ? 'error' : 'empty'"
            :title="uiScenario === 'permission'
              ? t('templateManagement.empty.permissionTitle')
              : uiScenario === 'error'
                ? t('templateManagement.empty.errorTitle')
                : hasActiveQuery ? t('templateManagement.empty.filteredTitle') : t('templateManagement.empty.defaultTitle')"
            :description="uiScenario === 'permission'
              ? t('templateManagement.empty.permissionDesc')
              : uiScenario === 'error'
                ? t('templateManagement.empty.errorDesc')
                : hasActiveQuery ? t('templateManagement.empty.filteredDesc') : t('templateManagement.empty.defaultDesc')"
          >
            <template v-if="uiScenario === 'error' || (uiScenario === 'normal' && hasActiveQuery)" #actions>
              <a-button size="small" type="text" @click="uiScenario === 'error' ? recoverList() : handleReset()">
                {{ uiScenario === 'error' ? t('templateManagement.actions.retry') : t('common.reset') }}
              </a-button>
            </template>
          </WorkbenchEmptyState>
        </template>
      </vxe-table>
    </template>
  </StandardListFrame>

  <a-modal
    v-model:visible="editorVisible"
    :title="editorMode === 'create' ? t('templateManagement.editor.createTitle') : t('templateManagement.editor.editTitle')"
    :width="760"
    :mask-closable="false"
    :esc-to-close="false"
    :ok-text="t('common.save')"
    :ok-loading="saving"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="saveTemplate"
  >
    <a-form ref="editorForm" :model="draft" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
      <section class="editor-section">
        <h3>{{ t('templateManagement.editor.basic') }}</h3>
        <a-row :gutter="denseFormGridGutter">
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="templateName" :label="t('templateManagement.fields.templateName')" :rules="[{ required: true, message: t('templateManagement.validation.templateName') }]" :style="denseFormItemStyle">
              <a-input v-model="draft.templateName" :max-length="80" show-word-limit :placeholder="t('templateManagement.placeholders.templateName')" />
            </a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="templateType" :label="t('templateManagement.fields.templateType')" :style="denseFormItemStyle">
              <a-select v-model="draft.templateType">
                <a-option value="master">{{ t('templateManagement.types.master') }}</a-option>
                <a-option value="supplement">{{ t('templateManagement.types.supplement') }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="carrier" :label="t('templateManagement.fields.carrier')" :rules="[{ required: true, message: t('templateManagement.validation.carrier') }]" :style="denseFormItemStyle">
              <a-select v-model="draft.carrier" allow-search :placeholder="t('templateManagement.placeholders.carrier')">
                <a-option value="MAERSK">MAERSK</a-option><a-option value="COSCO">COSCO</a-option><a-option value="CMA CGM">CMA CGM</a-option><a-option value="ONE">ONE</a-option><a-option value="EVERGREEN">EVERGREEN</a-option><a-option value="HAPAG-LLOYD">HAPAG-LLOYD</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="contractNo" :label="t('templateManagement.fields.contractNo')" :style="denseFormItemStyle"><a-input v-model="draft.contractNo" :max-length="40" :placeholder="t('templateManagement.placeholders.contractNo')" /></a-form-item>
          </a-col>
        </a-row>
      </section>

      <section class="editor-section">
        <h3>{{ t('templateManagement.editor.route') }}</h3>
        <a-row :gutter="denseFormGridGutter">
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="pol" :label="t('templateManagement.fields.pol')" :rules="[{ required: true, message: t('templateManagement.validation.pol') }]" :style="denseFormItemStyle"><a-input v-model="draft.pol" :max-length="40" :placeholder="t('templateManagement.placeholders.pol')" /></a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="pod" :label="t('templateManagement.fields.pod')" :rules="[{ required: true, message: t('templateManagement.validation.pod') }]" :style="denseFormItemStyle"><a-input v-model="draft.pod" :max-length="40" :placeholder="t('templateManagement.placeholders.pod')" /></a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="peer" :label="t('templateManagement.fields.peer')" :style="denseFormItemStyle"><a-input v-model="draft.peer" :max-length="40" :placeholder="t('templateManagement.placeholders.peer')" /></a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="creator" :label="t('templateManagement.fields.creator')" :style="denseFormItemStyle"><a-input v-model="draft.creator" :max-length="30" /></a-form-item>
          </a-col>
        </a-row>
      </section>

      <section class="editor-section">
        <h3>{{ t('templateManagement.editor.access') }}</h3>
        <a-row :gutter="denseFormGridGutter">
          <a-col :span="24">
            <a-form-item field="viewers" :label="t('templateManagement.fields.viewers')" :style="denseFormItemStyle">
              <a-select v-model="draft.viewers" multiple allow-create allow-search :placeholder="t('templateManagement.placeholders.viewers')">
                <a-option value="Chris">Chris</a-option><a-option value="Link">Link</a-option><a-option value="GNYW">GNYW</a-option><a-option value="Iris">Iris</a-option><a-option value="Alik">Alik</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="isPublic" :label="t('templateManagement.fields.isPublic')" :style="denseFormItemStyle"><a-switch v-model="draft.isPublic" /></a-form-item>
          </a-col>
          <a-col :span="12" :xs="24" :sm="12">
            <a-form-item field="isSwitchBill" :label="t('templateManagement.fields.isSwitchBill')" :style="denseFormItemStyle"><a-switch v-model="draft.isSwitchBill" /></a-form-item>
          </a-col>
        </a-row>
      </section>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="columnSettingsVisible"
    :title="t('templateManagement.settings.title')"
    :width="560"
    :mask-closable="false"
    :ok-text="t('templateManagement.settings.apply')"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="applyColumnSettings"
  >
    <div class="column-settings-summary">
      <span>{{ t('templateManagement.settings.selected', { count: columnSettingDraft.length }) }}</span>
      <a-button size="small" type="text" @click="resetColumnSettings">{{ t('templateManagement.settings.restore') }}</a-button>
    </div>
    <a-checkbox-group v-model="columnSettingDraft" class="column-settings-grid">
      <a-checkbox v-for="field in defaultColumns" :key="field" :value="field">{{ t(`templateManagement.columns.${field}`) }}</a-checkbox>
    </a-checkbox-group>
  </a-modal>

  <a-modal
    v-model:visible="deleteVisible"
    :title="t('templateManagement.delete.title')"
    :width="420"
    :mask-closable="false"
    :ok-text="t('templateManagement.actions.delete')"
    :ok-loading="deleting"
    :ok-button-props="{ status: 'danger', size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="confirmDelete"
  >
    <p class="modal-confirm-copy">{{ t('templateManagement.delete.copy', { name: deleteTarget?.templateName }) }}</p>
  </a-modal>
</template>

<style scoped>
.template-mode {
  display: flex;
  align-items: center;
  min-height: 28px;
}

.identity-link {
  max-width: 100%;
  padding-inline: 0;
}

.identity-link :deep(.arco-btn-content) {
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-settings-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.advanced-filter-title__hint {
  margin-left: 8px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  font-weight: 400;
}

.column-settings-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.modal-confirm-copy {
  margin: 0;
  color: var(--color-text-2);
  line-height: 20px;
}

.editor-section + .editor-section {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.editor-section h3 {
  margin: 0 0 8px;
  color: var(--color-text-2);
  font-size: var(--dense-font-field);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
}

@media (max-width: 767px) {
  .column-settings-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
