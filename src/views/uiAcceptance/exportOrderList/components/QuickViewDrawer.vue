<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BusinessActivityList from '@/components/workbench/BusinessActivityList.vue';
import type { BusinessActivityItem } from '@/components/workbench/BusinessActivityList.vue';
import { EXPORT_STATUS_TONES } from '@/views/uiAcceptance/exportOrderList/orderFlow';
import type { ExportOrderRow } from '@/views/uiAcceptance/exportOrderList/types';

const props = defineProps<{
  visible: boolean;
  row: ExportOrderRow | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const { t } = useI18n();

const drawerVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const statusTone = computed(() => (props.row ? EXPORT_STATUS_TONES[props.row.orderStatus] : 'wait'));

const summaryFacts = computed(() => {
  const row = props.row;
  if (!row) return [];
  const blank = '—';
  return [
    { label: t('exportOrderList.columns.orderNo'), value: row.orderNo },
    { label: t('exportOrderList.columns.customerName'), value: row.customerName },
    { label: t('exportOrderList.columns.businessType'), value: row.businessType },
    { label: t('exportOrderList.columns.operator'), value: row.operator },
    { label: t('exportOrderList.columns.pol'), value: row.pol },
    { label: t('exportOrderList.columns.pod'), value: row.pod },
    { label: t('exportOrderList.columns.vesselVoyage'), value: row.vesselVoyage || blank },
    { label: t('exportOrderList.columns.etd'), value: row.etd || blank },
    { label: t('exportOrderList.columns.eta'), value: row.eta || blank },
    { label: t('exportOrderList.columns.closingTime'), value: row.closingTime },
    { label: t('exportOrderList.columns.blNo'), value: row.blNo || blank },
    { label: t('exportOrderList.columns.bookingNo'), value: row.bookingNo || blank },
    { label: t('exportOrderList.columns.containerSummary'), value: row.containerSummary || blank },
    { label: t('exportOrderList.quickView.revision'), value: String(row.revision) },
  ];
});

const nodeItems = computed<BusinessActivityItem[]>(() => (props.row?.recentNodes ?? []).map((node, index) => ({
  id: `${node.node}-${index}`,
  title: t(`exportOrderList.nodes.${node.node}`),
  actor: node.operator,
  time: node.time,
})));

const logItems = computed<BusinessActivityItem[]>(() => (props.row?.recentLogs ?? []).map((log) => ({
  id: log.id,
  title: t(`exportOrderList.logs.${log.action}`, {
    detail: log.detailKey ? t(`exportOrderList.statuses.${log.detailKey}`) : '',
  }),
  actor: log.operator,
  time: log.time,
})));
</script>

<template>
  <a-drawer
    v-model:visible="drawerVisible"
    class="detail-drawer detail-drawer--standard"
    width="min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))"
    :footer="false"
    unmount-on-close
  >
    <template #title>{{ t('exportOrderList.quickView.title') }}</template>
    <div v-if="row" class="detail-body" data-detail-object="sea-export-order">
      <div class="detail-head">
        <span class="detail-head__identity tabular">{{ row.orderNo }}</span>
        <span class="s-pill" :data-s="statusTone">{{ t(`exportOrderList.statuses.${row.orderStatus}`) }}</span>
        <span class="s-pill" :data-s="row.exceptionStatus === 'open' ? 'rej' : row.exceptionStatus === 'resolved' ? 'rel' : 'acc'">
          {{ t(`exportOrderList.exceptionStatus.${row.exceptionStatus}`) }}
        </span>
        <span v-if="row.isOverdue" class="s-pill" data-s="rej">{{ t('exportOrderList.queryFields.isOverdue') }}</span>
      </div>
      <div class="detail-head__context">{{ row.customerName }} · {{ row.businessType }} · {{ row.operator }}</div>

      <section class="detail-section" aria-labelledby="ua-order-summary-title">
        <h3 id="ua-order-summary-title" class="detail-section__title">{{ t('exportOrderList.quickView.summary') }}</h3>
        <a-descriptions :column="2" size="small" :data="summaryFacts" />
      </section>

      <section class="detail-section" aria-labelledby="ua-order-risk-title">
        <h3 id="ua-order-risk-title" class="detail-section__title">{{ t('exportOrderList.quickView.risk') }}</h3>
        <div class="detail-state-line">
          <span class="s-pill" :data-s="row.fileStatus === 'missing' ? 'rej' : row.fileStatus === 'pending' ? 'wait' : 'acc'">
            {{ t('exportOrderList.columns.fileStatus') }} · {{ t(`exportOrderList.fileStatus.${row.fileStatus}`) }}
          </span>
          <span class="s-pill" :data-s="row.feeStatus === 'confirmed' ? 'rel' : 'wait'">
            {{ t('exportOrderList.columns.feeStatus') }} · {{ t(`exportOrderList.feeStatus.${row.feeStatus}`) }}
          </span>
          <span class="s-pill" :data-s="row.blConfirmed ? 'acc' : 'wait'">
            {{ row.blConfirmed ? t('exportOrderList.quickView.blConfirmed') : t('exportOrderList.quickView.blUnconfirmed') }}
          </span>
          <span v-if="row.exceptionStatus === 'open'" class="s-pill" data-s="rej">
            {{ t(`exportOrderList.exceptionLevels.${row.exceptionLevel}`) }}
          </span>
        </div>
        <div v-if="row.riskFlags.length" class="risk-list">
          <span v-for="flag in row.riskFlags" :key="flag" class="s-pill" data-s="partial">{{ t(`exportOrderList.riskFlags.${flag}`) }}</span>
        </div>
        <div v-else class="detail-empty">{{ t('exportOrderList.quickView.noRisk') }}</div>
        <div class="detail-empty">{{ t('exportOrderList.quickView.sensitiveHidden') }}</div>
      </section>

      <section class="detail-section" aria-labelledby="ua-order-nodes-title">
        <h3 id="ua-order-nodes-title" class="detail-section__title">{{ t('exportOrderList.quickView.nodes') }}</h3>
        <BusinessActivityList :items="nodeItems" :empty-text="t('exportOrderList.quickView.noNodes')" />
      </section>

      <section class="detail-section" aria-labelledby="ua-order-logs-title">
        <h3 id="ua-order-logs-title" class="detail-section__title">{{ t('exportOrderList.quickView.logs') }}</h3>
        <BusinessActivityList :items="logItems" :empty-text="t('exportOrderList.quickView.noLogs')" />
      </section>
    </div>
  </a-drawer>
</template>

<style scoped>
.detail-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.detail-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.detail-head__identity {
  color: var(--color-text-1);
  font-size: var(--dense-font-hero);
  font-weight: var(--dense-weight-title);
  line-height: 22px;
}

.detail-head__context {
  margin-top: 4px;
  color: var(--color-text-2);
  font-size: var(--dense-font-data);
  line-height: 18px;
}

.detail-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.detail-section__title {
  margin: 0 0 8px;
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.detail-state-line,
.risk-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.risk-list {
  margin-top: 8px;
}

.detail-empty {
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 18px;
}
</style>
