<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { IconDown, IconFilter, IconSearch } from '@arco-design/web-vue/es/icon';
import { compactVerticalFormLabelStyle, denseFormGridGutter } from '../../../design-system/formLayout';
import QueryFieldCol from '../../../components/workbench/QueryFieldCol.vue';
import QueryFieldGrid from '../../../components/workbench/QueryFieldGrid.vue';
import ScenarioFieldControl from './components/ScenarioFieldControl.vue';
import { QUERY_SCENARIOS, SCENARIO_FIELDS } from './scenarioFields';
import type { QueryScenarioKey, ScenarioField } from './scenarioFields';
import { QUERY_GRID_ITEM_SPANS } from '../../../design-system/queryLayout';
import type { QueryGridItemRole } from '../../../design-system/queryLayout';
import { QUERY_SCENARIO_FEATURE_CONTRACTS } from '../featureContracts';

void QUERY_SCENARIO_FEATURE_CONTRACTS;

const props = defineProps<{
  initialScenario: QueryScenarioKey;
}>();

interface ScenarioRow {
  id: string;
  orderNo: string;
  orderStatus: string;
  statusKey: string;
  statusTone: string;
  customerName: string;
  businessType: string;
  owner: string;
  updatedAt: string;
}

const router = useRouter();
const { t } = useI18n();
const activeScenarioKey = ref<QueryScenarioKey>(props.initialScenario);
const expanded = ref(false);
const drawerVisible = ref(false);
const querying = ref(false);
const primaryGridTrackCount = ref(24);
const page = reactive({ current: 1, size: 20 });
const keywordType = ref('orderNo');
const wideFilterEditor = ref<HTMLElement>();
const queryValues = reactive<Record<string, string | string[]>>({});
const draftValues = reactive<Record<string, string | string[]>>({});
const appliedValues = ref<Record<string, string | string[]>>({});

for (const field of SCENARIO_FIELDS) {
  queryValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
  draftValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
}

const rows: ScenarioRow[] = [
  { id: '1', orderNo: 'SEO2026080001', orderStatus: '订舱中', statusKey: 'booking', statusTone: 'op', customerName: '深圳华贸进出口有限公司', businessType: 'FCL', owner: '张操作', updatedAt: '2026-08-03 09:30' },
  { id: '2', orderNo: 'SEO2026080002', orderStatus: '已放舱', statusKey: 'released', statusTone: 'rel', customerName: '宁波远洋贸易集团', businessType: 'FCL', owner: '李操作', updatedAt: '2026-08-03 09:12' },
  { id: '3', orderNo: 'SEO2026080003', orderStatus: '报关中', statusKey: 'customs', statusTone: 'op', customerName: '广州宏达电子科技', businessType: 'LCL', owner: '王操作', updatedAt: '2026-08-03 08:48' },
  { id: '4', orderNo: 'SEO2026080004', orderStatus: '已开船', statusKey: 'sailed', statusTone: 'rel', customerName: '上海瑞联物流', businessType: 'FCL', owner: '赵操作', updatedAt: '2026-08-02 17:26' },
  { id: '5', orderNo: 'SEO2026080005', orderStatus: '待报关', statusKey: 'pendingCustoms', statusTone: 'wait', customerName: '青岛海盛实业', businessType: 'FCL', owner: '张操作', updatedAt: '2026-08-02 16:40' },
  { id: '6', orderNo: 'SEO2026080006', orderStatus: '拖车中', statusKey: 'trucking', statusTone: 'op', customerName: '厦门建发供应链', businessType: 'FCL', owner: '李操作', updatedAt: '2026-08-02 15:18' },
  { id: '7', orderNo: 'SEO2026080007', orderStatus: '异常', statusKey: 'exception', statusTone: 'risk', customerName: '天津港联国际', businessType: 'LCL', owner: '王操作', updatedAt: '2026-08-02 14:05' },
  { id: '8', orderNo: 'SEO2026080008', orderStatus: '已完成', statusKey: 'completed', statusTone: 'rel', customerName: '东莞精密制造', businessType: 'FCL', owner: '赵操作', updatedAt: '2026-08-02 11:32' },
];

const groupMessageKeys: Record<string, string> = {
  '识别条件': 'identity', '航线与运输': 'route', '时间计划': 'schedule', '执行与归属': 'ownership',
  '状态与风险': 'status', '财务条件': 'finance', '审计与来源': 'audit', '货物与条款': 'cargo',
};

const fieldByKey = new Map(SCENARIO_FIELDS.map((field) => [field.key, field]));
const currentScenario = computed(() => QUERY_SCENARIOS.find((item) => item.key === activeScenarioKey.value) ?? QUERY_SCENARIOS[0]);
const visibleFields = computed(() => currentScenario.value.visible.map((key) => fieldByKey.get(key)).filter((field): field is ScenarioField => Boolean(field)));
const remainingFields = computed(() => SCENARIO_FIELDS.filter((field) => !currentScenario.value.visible.includes(field.key as never)));
const secondaryFields = computed(() => {
  const configuredKeys = 'secondary' in currentScenario.value ? currentScenario.value.secondary : undefined;
  if (configuredKeys) {
    return configuredKeys.map((key) => fieldByKey.get(key)).filter((field): field is ScenarioField => Boolean(field));
  }
  return remainingFields.value.slice(0, Math.max(0, currentScenario.value.total - visibleFields.value.length));
});
const isExpandScenario = computed(() => activeScenarioKey.value === 's2-expand');
const isDrawerScenario = computed(() => ['s3-drawer', 's3-wide', 's4-drawer'].includes(activeScenarioKey.value));
const isWideDrawer = computed(() => activeScenarioKey.value === 's3-wide' || activeScenarioKey.value === 's4-drawer');
const actionColumnRole = computed<QueryGridItemRole>(() => {
  if (isExpandScenario.value) return 'actions-expanded';
  return isDrawerScenario.value ? 'actions-wide' : 'actions';
});
const permanentVisibleFields = computed(() => {
  if (!isExpandScenario.value && !isDrawerScenario.value) return visibleFields.value;
  let availableTracks = primaryGridTrackCount.value - QUERY_GRID_ITEM_SPANS[actionColumnRole.value];
  const fields: ScenarioField[] = [];
  for (const field of visibleFields.value) {
    const span = QUERY_GRID_ITEM_SPANS[field.width];
    if (span > availableTracks) break;
    fields.push(field);
    availableTracks -= span;
  }
  return fields;
});
const responsiveSecondaryFields = computed(() => [
  ...visibleFields.value.slice(permanentVisibleFields.value.length),
  ...secondaryFields.value,
]);
const promotedSecondaryFields = computed(() => {
  if (!isExpandScenario.value) return [];
  let availableTracks = primaryGridTrackCount.value
    - QUERY_GRID_ITEM_SPANS[actionColumnRole.value]
    - permanentVisibleFields.value.reduce((total, field) => total + QUERY_GRID_ITEM_SPANS[field.width], 0);
  const promoted: ScenarioField[] = [];
  for (const field of responsiveSecondaryFields.value) {
    const span = QUERY_GRID_ITEM_SPANS[field.width];
    if (span > availableTracks) break;
    promoted.push(field);
    availableTracks -= span;
  }
  return promoted;
});
const collapsibleSecondaryFields = computed(() => responsiveSecondaryFields.value.slice(promotedSecondaryFields.value.length));
const hiddenActiveCount = computed(() => collapsibleSecondaryFields.value.filter((field) => {
  const value = queryValues[field.key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}).length);

const groupFields = (fields: ScenarioField[]) => {
  const groups = new Map<string, ScenarioField[]>();
  for (const field of fields) groups.set(field.group, [...(groups.get(field.group) ?? []), field]);
  return [...groups].map(([name, items], index) => ({ id: `advanced-group-${index}`, name: t(`queryScenario.groups.${groupMessageKeys[name]}`), fields: items }));
};

const advancedGroups = computed(() => groupFields(responsiveSecondaryFields.value));
const activeAdvancedCount = computed(() => responsiveSecondaryFields.value.filter((field) => {
  const value = appliedValues.value[field.key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}).length);

const filteredRows = computed(() => {
  const keyword = String(appliedValues.value.keyword ?? '').trim().toLowerCase();
  const customer = String(appliedValues.value.customerName ?? '').trim().toLowerCase();
  const batchValues = Array.isArray(appliedValues.value.batchValues) ? appliedValues.value.batchValues : [];
  return rows.filter((row) => (!keyword || row.orderNo.toLowerCase().includes(keyword))
    && (!customer || row.customerName.toLowerCase().includes(customer))
    && (!batchValues.length || batchValues.includes(row.orderNo)));
});

const cloneValue = (value: string | string[]) => Array.isArray(value) ? [...value] : value;

const resetValues = () => {
  for (const field of SCENARIO_FIELDS) queryValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
  appliedValues.value = {};
  expanded.value = false;
  page.current = 1;
};

const handleSearch = () => {
  querying.value = true;
  appliedValues.value = Object.fromEntries(Object.entries(queryValues).map(([key, value]) => [key, cloneValue(value)]));
  page.current = 1;
  window.setTimeout(() => { querying.value = false; }, 160);
};

const openAdvanced = () => {
  for (const field of responsiveSecondaryFields.value) draftValues[field.key] = cloneValue(queryValues[field.key]);
  drawerVisible.value = true;
};

const clearAdvancedDraft = () => {
  for (const field of responsiveSecondaryFields.value) draftValues[field.key] = ['range', 'batch'].includes(field.kind) ? [] : '';
};

const applyAdvanced = () => {
  for (const field of responsiveSecondaryFields.value) queryValues[field.key] = cloneValue(draftValues[field.key]);
  drawerVisible.value = false;
  handleSearch();
};

const scrollToAdvancedGroup = (id: string) => {
  wideFilterEditor.value?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const onScenarioChange = (value: string | number | boolean) => {
  const next = QUERY_SCENARIOS.find((item) => item.key === value);
  if (next) router.push({ name: next.routeName });
};

watch(() => props.initialScenario, (value) => {
  activeScenarioKey.value = value;
  drawerVisible.value = false;
  expanded.value = false;
  resetValues();
});

</script>

<template>
  <div class="scenario-page" data-pesdp-page="ui-acceptance-query-scenarios">
    <div class="scenario-switcher">
      <a-select :model-value="activeScenarioKey" size="small" :aria-label="t('queryScenario.aria')" @change="onScenarioChange">
        <a-option v-for="scenario in QUERY_SCENARIOS" :key="scenario.key" :value="scenario.key">
          {{ t(scenario.labelKey) }}
        </a-option>
      </a-select>
      <span class="scenario-count">{{ t('common.totalFields', { count: currentScenario.total }) }}</span>
    </div>

    <a-card
      v-if="currentScenario.total > 0"
      size="small"
      :bordered="true"
      class="scenario-command"
      :body-style="{ padding: 0 }"
    >
      <div class="filter-panel">
        <a-form :model="queryValues" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle" class="filter-panel__form">
          <QueryFieldGrid @track-count-change="primaryGridTrackCount = $event">
            <QueryFieldCol v-for="field in permanentVisibleFields" :key="field.key" :role="field.width">
              <ScenarioFieldControl v-model="queryValues[field.key]" v-model:keyword-type="keywordType" :field="field" @submit="handleSearch" />
            </QueryFieldCol>
            <QueryFieldCol v-for="field in promotedSecondaryFields" :key="field.key" :role="field.width">
              <ScenarioFieldControl v-model="queryValues[field.key]" :field="field" @submit="handleSearch" />
            </QueryFieldCol>
            <QueryFieldCol :role="actionColumnRole">
              <div class="filter-actions">
                <a-button size="small" type="primary" :loading="querying" @click="handleSearch">
                  <template #icon><icon-search /></template>{{ t('common.search') }}
                </a-button>
                <a-button size="small" type="text" @click="resetValues">{{ t('common.reset') }}</a-button>
                <a-tooltip v-if="isExpandScenario" :content="expanded ? t('common.collapse') : t('common.expand', { count: collapsibleSecondaryFields.length })">
                  <a-badge :count="hiddenActiveCount" :offset="[-2, 2]">
                    <a-button size="small" type="text" class="filter-expand-action" :aria-label="expanded ? t('common.collapse') : t('common.expand', { count: collapsibleSecondaryFields.length })" @click="expanded = !expanded">
                      <span class="expand-action-label">{{ expanded ? t('common.collapse') : t('common.expand', { count: collapsibleSecondaryFields.length }) }}</span><icon-down />
                    </a-button>
                  </a-badge>
                </a-tooltip>
                <a-badge v-if="isDrawerScenario" :count="activeAdvancedCount" :offset="[-3, 3]">
                  <a-button size="small" type="text" :aria-label="t('common.moreFilters')" @click="openAdvanced">
                    <template #icon><icon-filter /></template>{{ t('common.filter') }}
                  </a-button>
                </a-badge>
              </div>
            </QueryFieldCol>
          </QueryFieldGrid>

          <QueryFieldGrid v-if="isExpandScenario && expanded" class="expanded-query-grid">
            <QueryFieldCol v-for="field in collapsibleSecondaryFields" :key="field.key" :role="field.width">
              <ScenarioFieldControl v-model="queryValues[field.key]" :field="field" @submit="handleSearch" />
            </QueryFieldCol>
          </QueryFieldGrid>
        </a-form>
      </div>

    </a-card>

    <a-card
      class="scenario-table-host"
      size="small"
      :bordered="true"
      :header-style="{ minHeight: '40px', padding: '0 12px' }"
      :body-style="{ minHeight: 0, padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }"
    >
      <template #title><span>{{ t('queryScenario.results') }}</span></template>
      <template #extra>
        <a-pagination v-model:current="page.current" v-model:page-size="page.size" :total="filteredRows.length" size="mini" show-total show-page-size />
      </template>
      <div class="scenario-table-frame">
        <vxe-table :data="filteredRows" height="100%" auto-resize show-overflow="title" :seq-config="{ startIndex: (page.current - 1) * page.size }">
          <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />
          <vxe-column field="orderNo" :title="t('queryScenario.columns.orderNo')" min-width="150" fixed="left" />
          <vxe-column field="orderStatus" :title="t('queryScenario.columns.status')">
            <template #default="{ row }"><span class="s-pill" :data-s="row.statusTone">{{ t(`queryScenario.statuses.${row.statusKey}`) }}</span></template>
          </vxe-column>
          <vxe-column field="customerName" :title="t('queryScenario.columns.customer')" />
          <vxe-column field="businessType" :title="t('queryScenario.columns.businessType')" />
          <vxe-column field="owner" :title="t('queryScenario.columns.owner')" />
          <vxe-column field="updatedAt" :title="t('queryScenario.columns.updatedAt')" />
        </vxe-table>
      </div>
    </a-card>

    <a-drawer
      v-if="!isWideDrawer"
      v-model:visible="drawerVisible"
      :title="t('common.moreFilters')"
      data-ui-surface="advanced-filter"
      width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
      :mask-closable="false"
      :esc-to-close="false"
    >
      <a-form :model="draftValues" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
        <section v-for="group in advancedGroups" :key="group.name" class="advanced-section">
          <h3>{{ group.name }}</h3>
          <a-row :gutter="denseFormGridGutter">
            <a-col v-for="field in group.fields" :key="field.key" :span="12" :xs="24" :sm="12">
              <ScenarioFieldControl v-model="draftValues[field.key]" :field="field" />
            </a-col>
          </a-row>
        </section>
      </a-form>
      <template #footer>
        <div class="drawer-footer">
          <a-button size="small" type="text" @click="clearAdvancedDraft">{{ t('common.clearAdvanced') }}</a-button>
          <a-space :size="8"><a-button size="small" @click="drawerVisible = false">{{ t('common.cancel') }}</a-button><a-button size="small" type="primary" @click="applyAdvanced">{{ t('common.apply') }}</a-button></a-space>
        </div>
      </template>
    </a-drawer>

    <a-drawer
      v-else
      v-model:visible="drawerVisible"
      :title="t('common.moreFilters')"
      data-ui-surface="advanced-filter-wide"
      width="min(var(--dense-drawer-w-filter-wide), calc(100vw - var(--dense-drawer-filter-pad)))"
      :mask-closable="false"
      :esc-to-close="false"
    >
      <div class="wide-filter-layout">
        <nav class="wide-filter-nav" :aria-label="t('queryScenario.groupNav')">
          <a-button v-for="group in advancedGroups" :key="group.id" size="small" type="text" @click="scrollToAdvancedGroup(group.id)">
            <span>{{ group.name }}</span><span class="wide-filter-nav__count">{{ group.fields.length }}</span>
          </a-button>
        </nav>
        <div ref="wideFilterEditor" class="wide-filter-editor">
          <a-form :model="draftValues" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
            <section v-for="group in advancedGroups" :id="group.id" :key="group.name" class="advanced-section">
              <h3>{{ group.name }}（{{ group.fields.length }}）</h3>
              <a-row :gutter="denseFormGridGutter">
                <a-col v-for="field in group.fields" :key="field.key" :span="8" :xs="24" :sm="12" :lg="8">
                  <ScenarioFieldControl v-model="draftValues[field.key]" :field="field" />
                </a-col>
              </a-row>
            </section>
          </a-form>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <a-button size="small" type="text" @click="clearAdvancedDraft">{{ t('common.clearAdvanced') }}</a-button>
          <a-space :size="8"><a-button size="small" @click="drawerVisible = false">{{ t('common.cancel') }}</a-button><a-button size="small" type="primary" @click="applyAdvanced">{{ t('common.apply') }}</a-button></a-space>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<style scoped>
.scenario-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
}

.scenario-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scenario-switcher > :first-child {
  width: 220px;
}

.scenario-count {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.filter-panel {
  padding: 10px 12px 8px;
}

.filter-panel__form {
  width: 100%;
}

.filter-panel__form :deep(.arco-form-item) {
  margin-bottom: 0;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-bottom: 1px;
  white-space: nowrap;
}

.expanded-query-grid {
  margin-top: 10px;
}

.scenario-table-host {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 260px;
}

.scenario-table-frame {
  flex: 1;
  min-height: 220px;
}

.advanced-section + .advanced-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-1);
}

.advanced-section h3 {
  margin: 0 0 8px;
  color: var(--color-text-2);
  font-size: var(--dense-font-field);
  font-weight: var(--dense-weight-title);
}

.wide-filter-layout {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  height: calc(100vh - 142px);
  min-height: 360px;
}

.wide-filter-nav {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: 12px 8px;
  overflow: auto;
  background: var(--color-fill-1);
  border-right: 1px solid var(--color-border-1);
}

.wide-filter-nav :deep(.arco-btn) {
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  color: var(--color-text-2);
}

.wide-filter-nav__count {
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
}

.wide-filter-editor {
  min-width: 0;
  padding: 16px 20px 24px;
  overflow: auto;
  scroll-behavior: smooth;
}

@media (max-width: 767px) {
  .wide-filter-layout {
    grid-template-columns: 148px minmax(0, 1fr);
  }

  .wide-filter-nav :deep(.arco-btn) {
    height: auto;
    min-height: 28px;
    white-space: normal;
  }
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}
</style>
