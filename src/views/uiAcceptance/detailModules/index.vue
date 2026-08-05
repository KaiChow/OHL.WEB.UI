<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { Box, Delivery, FileText, History, Order } from '@icon-park/vue-next';
import {
  IconCheck,
  IconCopy,
  IconDelete,
  IconExclamationCircle,
  IconPlus,
  IconSave,
} from '@arco-design/web-vue/es/icon';
import { useI18n } from 'vue-i18n';
import BusinessActivityList, { type BusinessActivityItem } from '../../../components/workbench/BusinessActivityList.vue';
import BusinessDetailChild from '../../../components/workbench/BusinessDetailChild.vue';
import BusinessDetailModule from '../../../components/workbench/BusinessDetailModule.vue';
import BusinessFieldGroup from '../../../components/workbench/BusinessFieldGroup.vue';
import BusinessMetricStrip, { type BusinessMetricItem } from '../../../components/workbench/BusinessMetricStrip.vue';
import { compactVerticalFormLabelStyle, denseFormGridGutter, denseFormItemStyle } from '../../../design-system/formLayout';
import { stableTableRowConfig } from '../../../design-system/tableConfig';
import { DETAIL_MODULES_SPEC } from './pageSpec';
import { DETAIL_MODULE_FEATURE_CONTRACTS } from './featureContracts';

void DETAIL_MODULE_FEATURE_CONTRACTS;
void DETAIL_MODULES_SPEC;

interface CargoLine {
  id: number;
  name: string;
  hsCode: string;
  packageCount: number;
  packageType: string;
  grossWeight: number;
  volume: number;
}

interface CargoParty {
  id: number;
  roleKey: 'shipper' | 'supplier';
  name: string;
  address: string;
  contact: string;
  phone: string;
  expanded: boolean;
  lines: CargoLine[];
}

interface ContainerLine {
  id: number;
  containerNo: string;
  containerType: string;
  sealNo: string;
  packageCount: number;
  grossWeight: number;
  volume: number;
}

const { t } = useI18n();
const isSaving = ref(false);
const scrollContainerRef = ref<HTMLElement | null>(null);
const activeModuleId = ref('shipment-overview');
let navigationUnlockTimer: number | undefined;
const moduleExpanded = ref<Record<string, boolean>>({
  overview: true,
  cargo: true,
  containers: true,
  documents: false,
  activity: false,
});

const overview = ref({
  serviceType: 'FCL · CY-CY',
  customer: 'Ningbo Horizon Trading Co., Ltd.',
  route: 'CNNGB → DEHAM',
  vesselVoyage: 'EVER ART / 026W',
  etd: '2026-08-12 18:00',
  eta: '2026-09-16 09:00',
  owner: 'Zhang Ya',
  reference: 'REF-2026-0831-A',
});

const cargoParties = ref<CargoParty[]>([
  {
    id: 1,
    roleKey: 'shipper',
    name: 'WILHELM GTTE GMBH01',
    address: 'Hafenstrasse 18, Hamburg, Germany',
    contact: 'Mia Hoffmann',
    phone: '+49 40 8821 610',
    expanded: true,
    lines: [
      { id: 11, name: 'Industrial control cabinet', hsCode: '8537109090', packageCount: 80, packageType: 'CTNS', grossWeight: 7600, volume: 22.4 },
      { id: 12, name: 'Electrical accessories', hsCode: '8536909000', packageCount: 24, packageType: 'CTNS', grossWeight: 1680, volume: 5.6 },
    ],
  },
  {
    id: 2,
    roleKey: 'supplier',
    name: 'SUZHOU NOVA EQUIPMENT CO., LTD.',
    address: 'No. 88 Xinghu Street, Suzhou Industrial Park, China',
    contact: 'Liu Wen',
    phone: '+86 512 6688 2090',
    expanded: false,
    lines: [
      { id: 21, name: 'Mounting frame', hsCode: '7326909000', packageCount: 16, packageType: 'PLTS', grossWeight: 2120, volume: 8.2 },
    ],
  },
]);

const containers = ref<ContainerLine[]>([
  { id: 1, containerNo: 'TGBU6123801', containerType: '40HQ', sealNo: 'OHL908812', packageCount: 120, grossWeight: 11400, volume: 36.2 },
  { id: 2, containerNo: 'CAIU7469210', containerType: '40HQ', sealNo: 'OHL908813', packageCount: 0, grossWeight: 0, volume: 0 },
]);

const documents = [
  { id: 'booking', nameKey: 'detailModules.documents.booking', owner: 'Zhang Ya', statusKey: 'complete', tone: 'acc', updatedAt: '2026-08-04 10:16' },
  { id: 'customs', nameKey: 'detailModules.documents.customs', owner: 'Liu Wen', statusKey: 'pending', tone: 'wait', updatedAt: '2026-08-04 09:42' },
  { id: 'packing', nameKey: 'detailModules.documents.packing', owner: 'Mia Hoffmann', statusKey: 'pending', tone: 'wait', updatedAt: '2026-08-03 17:25' },
  { id: 'invoice', nameKey: 'detailModules.documents.invoice', owner: 'Mia Hoffmann', statusKey: 'complete', tone: 'acc', updatedAt: '2026-08-03 16:50' },
] as const;

const pendingDocumentCount = computed(() => documents.filter((document) => document.statusKey === 'pending').length);

const activities = [
  { id: 1, eventKey: 'detailModules.activityItems.bookingUpdated', actor: 'Zhang Ya', time: '2026-08-04 10:16' },
  { id: 2, eventKey: 'detailModules.activityItems.customsRequested', actor: 'Liu Wen', time: '2026-08-04 09:42' },
  { id: 3, eventKey: 'detailModules.activityItems.partyUpdated', actor: 'Mia Hoffmann', time: '2026-08-03 17:25' },
] as const;

const activityItems = computed<BusinessActivityItem[]>(() => activities.map((item) => ({
  id: item.id,
  title: t(item.eventKey),
  actor: item.actor,
  time: item.time,
})));

const moduleNavItems = computed(() => [
  {
    id: 'shipment-overview', label: t('detailModules.modules.overview'),
    meta: overview.value.customer.trim()
      ? { kind: 'complete', text: '', label: t('detailModules.nav.complete') }
      : { kind: 'warning', text: '1', label: t('detailModules.nav.issues', { count: 1 }) },
  },
  { id: 'cargo-parties', label: t('detailModules.modules.cargo'), meta: { kind: 'count', text: String(cargoParties.value.length), label: t('detailModules.nav.items', { count: cargoParties.value.length }) } },
  { id: 'containers', label: t('detailModules.modules.containers'), meta: { kind: 'count', text: String(containers.value.length), label: t('detailModules.nav.items', { count: containers.value.length }) } },
  {
    id: 'documents', label: t('detailModules.modules.documents'),
    meta: pendingDocumentCount.value
      ? { kind: 'warning', text: String(pendingDocumentCount.value), label: t('detailModules.nav.issues', { count: pendingDocumentCount.value }) }
      : { kind: 'complete', text: '', label: t('detailModules.nav.complete') },
  },
  { id: 'activity', label: t('detailModules.modules.activity'), meta: null },
]);

const updateActiveModule = () => {
  if (navigationUnlockTimer !== undefined) return;
  const container = scrollContainerRef.value;
  if (!container) return;
  if (container.scrollTop > 0 && container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
    activeModuleId.value = moduleNavItems.value[moduleNavItems.value.length - 1]?.id || activeModuleId.value;
    return;
  }
  const containerTop = container.getBoundingClientRect().top;
  let currentId = moduleNavItems.value[0]?.id || '';
  moduleNavItems.value.forEach((item) => {
    const section = document.getElementById(item.id);
    if (section && section.getBoundingClientRect().top - containerTop <= 44) currentId = item.id;
  });
  activeModuleId.value = currentId;
};

const navigateToModule = (moduleId: string) => {
  if (navigationUnlockTimer !== undefined) window.clearTimeout(navigationUnlockTimer);
  activeModuleId.value = moduleId;
  document.getElementById(moduleId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  navigationUnlockTimer = window.setTimeout(() => { navigationUnlockTimer = undefined; }, 700);
};

onMounted(() => scrollContainerRef.value?.addEventListener('scroll', updateActiveModule, { passive: true }));
onBeforeUnmount(() => {
  scrollContainerRef.value?.removeEventListener('scroll', updateActiveModule);
  if (navigationUnlockTimer !== undefined) window.clearTimeout(navigationUnlockTimer);
});

type DraftSnapshot = {
  overview: typeof overview.value;
  cargoParties: CargoParty[];
  containers: ContainerLine[];
};
const snapshot = ref<DraftSnapshot | null>(null);

const cargoTotals = computed(() => cargoParties.value.reduce(
  (totals, party) => party.lines.reduce((lineTotals, line) => ({
    weight: lineTotals.weight + Number(line.grossWeight || 0),
    volume: lineTotals.volume + Number(line.volume || 0),
  }), totals),
  { weight: 0, volume: 0 },
));

const cargoMetrics = computed<BusinessMetricItem[]>(() => [
  { id: 'parties', label: t('detailModules.metrics.parties'), value: String(cargoParties.value.length) },
  { id: 'weight', label: t('detailModules.metrics.totalWeight'), value: `${cargoTotals.value.weight.toLocaleString()} KG` },
  { id: 'volume', label: t('detailModules.metrics.totalVolume'), value: `${cargoTotals.value.volume.toFixed(1)} CBM` },
]);

const containerMetrics = computed<BusinessMetricItem[]>(() => [
  { id: 'containers', label: t('detailModules.metrics.containers'), value: String(containers.value.length) },
]);

const childMetrics = (party: CargoParty): BusinessMetricItem[] => [
  { id: `lines-${party.id}`, label: t('detailModules.metrics.cargoLines'), value: String(party.lines.length) },
  { id: `weight-${party.id}`, label: t('detailModules.metrics.weight'), value: `${party.lines.reduce((total, line) => total + Number(line.grossWeight || 0), 0).toLocaleString()} KG` },
  { id: `volume-${party.id}`, label: t('detailModules.metrics.volume'), value: `${party.lines.reduce((total, line) => total + Number(line.volume || 0), 0).toFixed(1)} CBM` },
];

const cloneDraft = (): DraftSnapshot => JSON.parse(JSON.stringify({
  overview: overview.value,
  cargoParties: cargoParties.value,
  containers: containers.value,
})) as DraftSnapshot;

const countDraftChanges = (current: unknown, saved: unknown): number => {
  if (Object.is(current, saved)) return 0;
  if (Array.isArray(current) && Array.isArray(saved)) {
    const shared = Math.min(current.length, saved.length);
    let changed = Math.abs(current.length - saved.length);
    for (let index = 0; index < shared; index += 1) changed += countDraftChanges(current[index], saved[index]);
    return changed;
  }
  if (current && saved && typeof current === 'object' && typeof saved === 'object') {
    const keys = new Set([...Object.keys(current), ...Object.keys(saved)]);
    let changed = 0;
    keys.forEach((key) => {
      if (key === 'expanded' || key.startsWith('_X_')) return;
      changed += countDraftChanges((current as Record<string, unknown>)[key], (saved as Record<string, unknown>)[key]);
    });
    return changed;
  }
  return 1;
};

snapshot.value = cloneDraft();
const dirtyCount = computed(() => (snapshot.value ? countDraftChanges(cloneDraft(), snapshot.value) : 0));

const cancelEdit = () => {
  if (snapshot.value) {
    overview.value = snapshot.value.overview;
    cargoParties.value = snapshot.value.cargoParties;
    containers.value = snapshot.value.containers;
  }
  snapshot.value = cloneDraft();
};

const saveDraft = async () => {
  if (!overview.value.customer.trim()) {
    Message.error(t('detailModules.messages.customerRequired'));
    document.getElementById('shipment-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  isSaving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 360));
  isSaving.value = false;
  snapshot.value = cloneDraft();
  Message.success(t('detailModules.messages.saved'));
};

const addParty = () => {
  cargoParties.value.forEach((party) => { party.expanded = false; });
  cargoParties.value.push({
    id: Date.now(), roleKey: 'supplier', name: t('detailModules.defaults.newParty'), address: '', contact: '', phone: '', expanded: true, lines: [],
  });
};

const duplicateParty = (party: CargoParty) => {
  cargoParties.value.forEach((item) => { item.expanded = false; });
  const copy = JSON.parse(JSON.stringify(party)) as CargoParty;
  copy.id = Date.now();
  copy.name = `${party.name} ${t('detailModules.defaults.copySuffix')}`;
  copy.expanded = true;
  copy.lines = copy.lines.map((line, index) => ({ ...line, id: copy.id + index + 1 }));
  cargoParties.value.push(copy);
};

const removeParty = (partyId: number) => {
  if (cargoParties.value.length <= 1) return;
  cargoParties.value = cargoParties.value.filter((party) => party.id !== partyId);
};

const addCargoLine = (party: CargoParty) => {
  party.lines.push({ id: Date.now(), name: '', hsCode: '', packageCount: 0, packageType: 'CTNS', grossWeight: 0, volume: 0 });
};

const removeCargoLine = (party: CargoParty, lineId: number) => {
  party.lines = party.lines.filter((line) => line.id !== lineId);
};

const addContainer = () => {
  containers.value.push({ id: Date.now(), containerNo: '', containerType: '40HQ', sealNo: '', packageCount: 0, grossWeight: 0, volume: 0 });
};

const removeContainer = (containerId: number) => {
  containers.value = containers.value.filter((item) => item.id !== containerId);
};

</script>

<template>
  <main class="detail-acceptance" data-pesdp-page="ui-acceptance-complex-detail-modules" data-detail-workspace="sea-export-shipment-working-draft">
    <header class="object-band">
      <div class="object-band__primary">
        <div class="object-band__identity">
          <div class="object-band__identity-line">
            <h1 class="object-band__number mono">SEO2026080001</h1>
            <span class="s-pill" data-s="op">{{ t('detailModules.status.booking') }}</span>
            <span class="object-band__type">{{ t('detailModules.identity.serviceType') }}</span>
          </div>
          <strong class="object-band__context" :title="overview.customer">{{ overview.customer }}</strong>
          <div class="object-band__owner">
            <span>{{ t('detailModules.fields.owner') }}</span>
            <strong>{{ overview.owner }}</strong>
          </div>
        </div>
        <div class="object-band__route">
          <span class="object-band__route-label">{{ t('detailModules.fields.route') }}</span>
          <strong :title="overview.route">{{ overview.route }}</strong>
          <div class="object-band__schedule">
            <span>ETD <b class="tabular">{{ overview.etd }}</b></span>
            <span>ETA <b class="tabular">{{ overview.eta }}</b></span>
          </div>
        </div>
        <div class="object-band__decision">
          <div class="object-decision object-decision--risk">
            <span class="object-decision__label">{{ t('detailModules.identity.currentRisk') }}</span>
            <span class="s-pill" data-s="wait">{{ t('detailModules.identity.riskValue', { count: pendingDocumentCount }) }}</span>
          </div>
          <div class="object-decision object-decision--next">
            <span class="object-decision__label">{{ t('detailModules.identity.nextAction') }}</span>
            <strong :title="t('detailModules.identity.nextValue')">{{ t('detailModules.identity.nextValue') }}</strong>
          </div>
        </div>
      </div>
    </header>

    <div class="detail-acceptance__workspace">
      <nav class="detail-outline" :aria-label="t('detailModules.nav.label')">
        <span class="detail-outline__label">{{ t('detailModules.nav.label') }}</span>
        <a
          v-for="item in moduleNavItems"
          :key="item.id"
          class="detail-outline__link"
          :class="{ 'detail-outline__link--active': activeModuleId === item.id }"
          :href="`#${item.id}`"
          :aria-current="activeModuleId === item.id ? 'location' : undefined"
          :aria-label="item.meta ? `${item.label}, ${item.meta.label}` : item.label"
          @click.prevent="navigateToModule(item.id)"
        >
          <span class="detail-outline__text">{{ item.label }}</span>
          <span v-if="item.meta" class="detail-outline__meta" :data-kind="item.meta.kind" :title="item.meta.label" aria-hidden="true">
            <icon-check v-if="item.meta.kind === 'complete'" />
            <icon-exclamation-circle v-else-if="item.meta.kind === 'warning'" />
            <span v-if="item.meta.text">{{ item.meta.text }}</span>
          </span>
        </a>
      </nav>

      <div ref="scrollContainerRef" class="detail-acceptance__scroll">
      <BusinessDetailModule
        id="shipment-overview"
        priority="core"
        :collapsible="false"
        v-model:expanded="moduleExpanded.overview"
        :title="t('detailModules.modules.overview')"
        :collapse-label="t('detailModules.aria.toggleModule', { module: t('detailModules.modules.overview') })"
      >
        <template #icon><Order theme="outline" size="14" :stroke-width="2.5" /></template>
        <a-form class="detail-form detail-form--overview" :model="overview" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
          <div class="overview-field-groups">
            <BusinessFieldGroup :title="t('detailModules.groups.businessContext')">
              <a-row :gutter="denseFormGridGutter">
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.serviceType')" :style="denseFormItemStyle"><a-input v-model="overview.serviceType" /></a-form-item></a-col>
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.owner')" :style="denseFormItemStyle"><a-input v-model="overview.owner" /></a-form-item></a-col>
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.customer')" required :style="denseFormItemStyle"><a-input v-model="overview.customer" /></a-form-item></a-col>
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.customerReference')" :style="denseFormItemStyle"><a-input v-model="overview.reference" class="mono" /></a-form-item></a-col>
              </a-row>
            </BusinessFieldGroup>
            <BusinessFieldGroup :title="t('detailModules.groups.transportPlan')">
              <a-row :gutter="denseFormGridGutter">
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.route')" :style="denseFormItemStyle"><a-input v-model="overview.route" /></a-form-item></a-col>
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.vesselVoyage')" :style="denseFormItemStyle"><a-input v-model="overview.vesselVoyage" /></a-form-item></a-col>
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.etd')" :style="denseFormItemStyle"><a-input v-model="overview.etd" class="tabular" /></a-form-item></a-col>
                <a-col :xs="24" :sm="12"><a-form-item :label="t('detailModules.fields.eta')" :style="denseFormItemStyle"><a-input v-model="overview.eta" class="tabular" /></a-form-item></a-col>
              </a-row>
            </BusinessFieldGroup>
          </div>
        </a-form>
      </BusinessDetailModule>

      <BusinessDetailModule
        id="cargo-parties"
        priority="core"
        :collapsible="false"
        v-model:expanded="moduleExpanded.cargo"
        :title="t('detailModules.modules.cargo')"
        :collapse-label="t('detailModules.aria.toggleModule', { module: t('detailModules.modules.cargo') })"
      >
        <template #icon><Delivery theme="outline" size="14" :stroke-width="2.5" /></template>
        <template #actions>
          <a-button size="small" type="outline" @click="addParty"><template #icon><icon-plus /></template>{{ t('detailModules.actions.addParty') }}</a-button>
        </template>
        <template #summary><BusinessMetricStrip :items="cargoMetrics" /></template>

        <BusinessDetailChild
          v-for="party in cargoParties"
          :id="`cargo-party-${party.id}`"
          :key="party.id"
          v-model:expanded="party.expanded"
          :title="party.name"
          :subtitle="t(`detailModules.partyRoles.${party.roleKey}`)"
          :collapse-label="t('detailModules.aria.toggleChild', { child: party.name })"
        >
          <template #metrics><BusinessMetricStrip :items="childMetrics(party)" /></template>
          <template #actions>
            <a-tooltip :content="t('detailModules.actions.duplicateParty')">
              <a-button size="small" type="text" :aria-label="t('detailModules.actions.duplicateParty')" @click="duplicateParty(party)"><template #icon><icon-copy /></template></a-button>
            </a-tooltip>
            <a-popconfirm :content="t('detailModules.confirm.removeParty')" @ok="removeParty(party.id)">
              <a-tooltip :content="t('detailModules.actions.removeParty')">
                <a-button size="small" type="text" status="danger" :aria-label="t('detailModules.actions.removeParty')" :disabled="cargoParties.length <= 1"><template #icon><icon-delete /></template></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>

          <a-form class="detail-form detail-form--party" :model="party" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
            <a-row :gutter="denseFormGridGutter">
              <a-col :xs="24" :sm="12" :md="8" :xl="6"><a-form-item :label="t('detailModules.fields.partyRole')" :style="denseFormItemStyle"><a-select v-model="party.roleKey"><a-option value="shipper">{{ t('detailModules.partyRoles.shipper') }}</a-option><a-option value="supplier">{{ t('detailModules.partyRoles.supplier') }}</a-option></a-select></a-form-item></a-col>
              <a-col :xs="24" :sm="12" :md="16" :xl="12"><a-form-item :label="t('detailModules.fields.partyName')" :style="denseFormItemStyle"><a-input v-model="party.name" /></a-form-item></a-col>
              <a-col :xs="24" :sm="12" :md="8" :xl="6"><a-form-item :label="t('detailModules.fields.contact')" :style="denseFormItemStyle"><a-input v-model="party.contact" /></a-form-item></a-col>
              <a-col :xs="24" :sm="12" :md="8" :xl="6"><a-form-item :label="t('detailModules.fields.phone')" :style="denseFormItemStyle"><a-input v-model="party.phone" class="tabular" /></a-form-item></a-col>
              <a-col :xs="24" :sm="12" :md="16" :xl="18"><a-form-item :label="t('detailModules.fields.address')" :style="denseFormItemStyle"><a-input v-model="party.address" /></a-form-item></a-col>
            </a-row>
          </a-form>

          <div class="child-table-cap">
            <strong>{{ t('detailModules.tables.cargoLines') }}</strong>
            <a-button size="small" type="outline" @click="addCargoLine(party)"><template #icon><icon-plus /></template>{{ t('detailModules.actions.addCargoLine') }}</a-button>
          </div>
          <vxe-table :data="party.lines" size="small" :stripe="false" :row-config="stableTableRowConfig" :empty-text="t('detailModules.empty.cargoLines')">
            <vxe-column type="seq" :title="t('common.sequence')" width="52" align="center" />
            <vxe-column field="name" :title="t('detailModules.columns.cargoName')" min-width="190">
              <template #default="{ row }"><a-input v-model="row.name" size="mini" /></template>
            </vxe-column>
            <vxe-column field="hsCode" :title="t('detailModules.columns.hsCode')" min-width="118">
              <template #default="{ row }"><a-input v-model="row.hsCode" size="mini" class="mono" /></template>
            </vxe-column>
            <vxe-column field="packageCount" :title="t('detailModules.columns.packageCount')" min-width="96" align="right">
              <template #default="{ row }"><a-input-number v-model="row.packageCount" size="mini" :min="0" /></template>
            </vxe-column>
            <vxe-column field="packageType" :title="t('detailModules.columns.packageType')" min-width="96">
              <template #default="{ row }"><a-select v-model="row.packageType" size="mini"><a-option value="CTNS">CTNS</a-option><a-option value="PLTS">PLTS</a-option><a-option value="PKGS">PKGS</a-option></a-select></template>
            </vxe-column>
            <vxe-column field="grossWeight" :title="t('detailModules.columns.grossWeight')" min-width="116" align="right">
              <template #default="{ row }"><a-input-number v-model="row.grossWeight" size="mini" :min="0" /></template>
            </vxe-column>
            <vxe-column field="volume" :title="t('detailModules.columns.volume')" min-width="104" align="right">
              <template #default="{ row }"><a-input-number v-model="row.volume" size="mini" :min="0" :precision="1" /></template>
            </vxe-column>
            <vxe-column :title="t('common.operations')" width="64" fixed="right" align="center">
              <template #default="{ row }"><a-space class="row-actions" :size="2"><a-popconfirm :content="t('detailModules.confirm.removeLine')" @ok="removeCargoLine(party, row.id)"><a-tooltip :content="t('detailModules.actions.removeLine')"><a-button class="row-action-btn" type="text" status="danger" size="mini" :aria-label="t('detailModules.actions.removeLine')"><template #icon><icon-delete /></template></a-button></a-tooltip></a-popconfirm></a-space></template>
            </vxe-column>
          </vxe-table>
        </BusinessDetailChild>
      </BusinessDetailModule>

      <BusinessDetailModule
        id="containers"
        priority="core"
        :collapsible="false"
        v-model:expanded="moduleExpanded.containers"
        :title="t('detailModules.modules.containers')"
        :collapse-label="t('detailModules.aria.toggleModule', { module: t('detailModules.modules.containers') })"
      >
        <template #icon><Box theme="outline" size="14" :stroke-width="2.5" /></template>
        <template #summary><BusinessMetricStrip :items="containerMetrics" /></template>
        <template #actions>
          <a-button size="small" type="outline" @click="addContainer"><template #icon><icon-plus /></template>{{ t('detailModules.actions.addContainer') }}</a-button>
        </template>
        <vxe-table :data="containers" size="small" :stripe="false" :row-config="stableTableRowConfig" :empty-text="t('detailModules.empty.containers')">
          <vxe-column type="seq" :title="t('common.sequence')" width="52" align="center" />
          <vxe-column field="containerNo" :title="t('detailModules.columns.containerNo')" min-width="150">
            <template #default="{ row }"><a-input v-model="row.containerNo" size="mini" class="mono" /></template>
          </vxe-column>
          <vxe-column field="containerType" :title="t('detailModules.columns.containerType')" min-width="100">
            <template #default="{ row }"><a-select v-model="row.containerType" size="mini"><a-option value="20GP">20GP</a-option><a-option value="40GP">40GP</a-option><a-option value="40HQ">40HQ</a-option></a-select></template>
          </vxe-column>
          <vxe-column field="sealNo" :title="t('detailModules.columns.sealNo')" min-width="132">
            <template #default="{ row }"><a-input v-model="row.sealNo" size="mini" class="mono" /></template>
          </vxe-column>
          <vxe-column field="packageCount" :title="t('detailModules.columns.packageCount')" min-width="96" align="right"><template #default="{ row }"><a-input-number v-model="row.packageCount" size="mini" :min="0" /></template></vxe-column>
          <vxe-column field="grossWeight" :title="t('detailModules.columns.grossWeight')" min-width="116" align="right"><template #default="{ row }"><a-input-number v-model="row.grossWeight" size="mini" :min="0" /></template></vxe-column>
          <vxe-column field="volume" :title="t('detailModules.columns.volume')" min-width="104" align="right"><template #default="{ row }"><a-input-number v-model="row.volume" size="mini" :min="0" :precision="1" /></template></vxe-column>
          <vxe-column :title="t('common.operations')" width="64" fixed="right" align="center"><template #default="{ row }"><a-space class="row-actions" :size="2"><a-popconfirm :content="t('detailModules.confirm.removeContainer')" @ok="removeContainer(row.id)"><a-tooltip :content="t('detailModules.actions.removeLine')"><a-button class="row-action-btn" type="text" status="danger" size="mini" :aria-label="t('detailModules.actions.removeLine')"><template #icon><icon-delete /></template></a-button></a-tooltip></a-popconfirm></a-space></template></vxe-column>
        </vxe-table>
      </BusinessDetailModule>

      <BusinessDetailModule
        id="documents"
        priority="supporting"
        v-model:expanded="moduleExpanded.documents"
        :title="t('detailModules.modules.documents')"
        :collapse-label="t('detailModules.aria.toggleModule', { module: t('detailModules.modules.documents') })"
      >
        <template #icon><FileText theme="outline" size="14" :stroke-width="2.5" /></template>
        <template #state><span class="s-pill" data-s="wait">{{ t('detailModules.nav.issues', { count: pendingDocumentCount }) }}</span></template>
        <div class="document-list" role="list">
          <div class="document-list__head" aria-hidden="true">
            <span>{{ t('detailModules.fields.documentName') }}</span>
            <span>{{ t('detailModules.fields.documentStatus') }}</span>
            <span>{{ t('detailModules.fields.owner') }}</span>
            <span>{{ t('detailModules.fields.updatedAt') }}</span>
          </div>
          <div v-for="document in documents" :key="document.id" class="document-row" role="listitem">
            <strong>{{ t(document.nameKey) }}</strong>
            <span class="s-pill" :data-s="document.tone">{{ t(`detailModules.documentStatus.${document.statusKey}`) }}</span>
            <span>{{ document.owner }}</span>
            <span class="tabular">{{ document.updatedAt }}</span>
          </div>
        </div>
      </BusinessDetailModule>

      <BusinessDetailModule
        id="activity"
        priority="audit"
        v-model:expanded="moduleExpanded.activity"
        :title="t('detailModules.modules.activity')"
        :collapse-label="t('detailModules.aria.toggleModule', { module: t('detailModules.modules.activity') })"
      >
        <template #icon><History theme="outline" size="14" :stroke-width="2.5" /></template>
        <BusinessActivityList :items="activityItems" :empty-text="t('detailModules.empty.activity')" />
      </BusinessDetailModule>
      </div>
    </div>

    <footer class="detail-footer">
      <div class="detail-footer__status" aria-live="polite">
        <span v-if="dirtyCount" class="s-pill" data-s="wait">{{ t('detailModules.footer.dirty', { count: dirtyCount }) }}</span>
        <span v-else class="detail-footer__hint">{{ t('detailModules.footer.saved') }}</span>
      </div>
      <a-space :size="8">
        <a-button size="small" :disabled="isSaving || !dirtyCount" @click="cancelEdit">{{ t('detailModules.actions.resetDraft') }}</a-button>
        <a-button size="small" type="primary" :disabled="!dirtyCount" :loading="isSaving" @click="saveDraft"><template #icon><icon-save /></template>{{ t('common.save') }}</a-button>
      </a-space>
    </footer>
  </main>
</template>

<style scoped>
.detail-acceptance {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dense-card-border);
  border-radius: var(--dense-radius);
  background: var(--color-bg-1);
  box-shadow: var(--dense-shadow-card);
  margin-inline: auto;
  container-type: inline-size;
}

.object-band {
  flex: 0 0 auto;
  padding: 10px 14px;
  border-bottom: 1px solid var(--dense-card-border);
}

.object-band__identity,
.object-band__identity-line,
.child-table-cap,
.child-table-cap__identity {
  display: flex;
  align-items: center;
  min-width: 0;
}

.object-band__primary {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(260px, .72fr) minmax(300px, .9fr);
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.object-band__identity { flex-direction: column; align-items: flex-start; gap: 3px; }
.object-band__identity-line { gap: 8px; }

.object-band__number {
  margin: 0;
  color: var(--dense-primary-7);
  font-size: var(--dense-font-hero);
  font-weight: var(--dense-weight-title);
  line-height: 22px;
  letter-spacing: 0;
}

.object-band__type { color: var(--color-text-2); font-size: var(--dense-font-data); }

.object-band__context {
  max-width: 100%;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.object-band__owner {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 16px;
}

.object-band__owner strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-control);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.object-band__route {
  min-width: 0;
  padding-inline: 20px;
  border-inline: 1px solid var(--dense-border-subtle);
}

.object-band__route-label,
.object-decision__label { color: var(--color-text-3); font-size: var(--dense-font-aux); line-height: 16px; }

.object-band__route > strong {
  display: block;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-hero);
  font-weight: var(--dense-weight-title);
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.object-band__schedule {
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 16px;
}

.object-band__schedule span { min-width: 0; white-space: nowrap; }
.object-band__schedule b { margin-left: 4px; color: var(--color-text-1); font-weight: var(--dense-weight-control); }

.object-band__decision {
  display: grid;
  grid-template-rows: repeat(2, auto);
  align-content: center;
  gap: 6px;
  min-width: 0;
}

.object-decision {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.object-decision strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.object-decision .s-pill { justify-self: start; }

.detail-acceptance__workspace {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: grid;
  grid-template-columns: 144px minmax(0, 1fr);
  overflow: hidden;
  background: var(--color-fill-2);
}

.detail-outline {
  min-width: 0;
  padding: 10px 8px;
  border-right: 1px solid var(--dense-border-subtle);
  background: var(--color-bg-1);
}

.detail-outline__label {
  display: block;
  padding: 0 10px 7px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 18px;
}

.detail-outline__link {
  position: relative;
  box-sizing: border-box;
  height: 32px;
  padding: 6px 10px 6px 12px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  color: var(--color-text-2);
  font-size: var(--dense-font-data);
  line-height: 20px;
  text-decoration: none;
}

.detail-outline__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-outline__meta {
  box-sizing: border-box;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 9px;
  background: var(--color-fill-2);
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.detail-outline__meta[data-kind='complete'] { padding: 0; background: transparent; color: var(--dense-success-7); }
.detail-outline__meta[data-kind='warning'] { background: var(--dense-warning-1); color: var(--dense-warning-7); }

.detail-outline__link:hover {
  background: var(--color-fill-1);
  color: var(--color-text-1);
}

.detail-outline__link--active {
  background: var(--color-fill-1);
  color: var(--dense-primary-7);
  font-weight: var(--dense-weight-title);
}

.detail-outline__link--active::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: var(--dense-primary-6);
  content: '';
  transform: translateY(-50%);
}

.detail-acceptance__scroll {
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  background: var(--color-fill-2);
}

.detail-acceptance__scroll > section { scroll-margin-top: 0; }
.overview-field-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}
.child-table-cap { justify-content: space-between; gap: var(--dense-gap-inline); min-height: 32px; margin-top: var(--dense-gap-zone); }
.child-table-cap:first-child { margin-top: 0; }
.child-table-cap strong { font-size: var(--dense-font-title); font-weight: var(--dense-weight-title); }

.document-list { border: 1px solid var(--dense-border-subtle); }
.document-list__head,
.document-row {
  display: grid;
  grid-template-columns: minmax(180px, 1.4fr) 96px minmax(110px, .7fr) 156px;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
  border-bottom: 1px solid var(--dense-border-subtle);
}
.document-list__head {
  min-height: 28px;
  background: var(--color-fill-1);
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}
.document-row { min-height: 36px; }
.document-row:last-child { border-bottom: 0; }
.document-row strong { font-size: var(--dense-font-data); font-weight: var(--dense-weight-control); }
.document-row > span:not(.s-pill) { color: var(--color-text-2); }

.detail-footer {
  flex: 0 0 auto;
  min-height: 42px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--dense-card-border);
  background: var(--color-fill-1);
}

.detail-footer__hint { color: var(--color-text-3); font-size: var(--dense-font-aux); }
.detail-footer__status { display: flex; align-items: center; min-width: 0; }

@media (max-width: 1180px) {
  .object-band__primary { gap: 12px; }
  .object-band__route { padding-inline: 12px; }
  .overview-field-groups { gap: 14px; }
  .document-list__head,
  .document-row { grid-template-columns: minmax(160px, 1fr) 88px 110px 138px; gap: 8px; }
}

@container (max-width: 760px) {
  .object-band__primary { grid-template-columns: minmax(0, 1fr) minmax(230px, .8fr); }
  .object-band__route {
    grid-column: 1 / -1;
    grid-row: 2;
    padding: 6px 0 0;
    display: grid;
    grid-template-columns: 80px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    border: 0;
    border-top: 1px solid var(--dense-border-subtle);
  }
  .object-band__route > strong { font-size: var(--dense-font-data); line-height: 18px; }
  .object-band__schedule { margin-top: 0; }
}

@container (max-width: 680px) {
  .overview-field-groups { grid-template-columns: minmax(0, 1fr); gap: var(--dense-gap-zone); }
}

@container (max-width: 1439px) {
  .detail-acceptance__workspace { grid-template-columns: minmax(0, 1fr); }
  .detail-outline { display: none; }
}
</style>
