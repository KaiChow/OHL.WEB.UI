<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ProfitReviewRow } from '../types';
import { REVIEW_STATUS_META, RISK_LEVEL_META, formatOrderAmount, formatMarginRate } from '../displayMeta';

const props = defineProps<{
  visible: boolean;
  row: ProfitReviewRow | null;
}>();
const { t } = useI18n();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const drawerVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const statusMeta = computed(() => (props.row ? REVIEW_STATUS_META[props.row.reviewStatus] : null));
const riskMeta = computed(() => (props.row ? RISK_LEVEL_META[props.row.riskLevel] : null));

const profitFacts = computed(() => {
  const row = props.row;
  if (!row) return [];
  return [
    { label: t('profit.columns.orderNo'), value: row.orderNo },
    { label: t('profit.columns.customer'), value: row.customer },
    { label: t('profit.columns.region'), value: row.region },
    { label: t('profit.columns.businessLine'), value: row.businessLine },
    { label: t('profit.columns.owner'), value: row.owner },
    { label: t('profit.columns.amount'), value: formatOrderAmount(row.orderAmount) },
    { label: t('profit.columns.margin'), value: formatMarginRate(row.grossMarginRate) },
    { label: t('profit.columns.updatedAt'), value: row.updatedAt },
    { label: t('profit.detail.note'), value: row.reviewNote || '—', span: 2 },
  ];
});
</script>

<template>
  <a-drawer
    v-model:visible="drawerVisible"
    class="detail-drawer detail-drawer--standard"
    width="min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))"
    :footer="false"
    unmount-on-close
  >
    <template #title>{{ t('profit.detail.title') }}</template>
    <div v-if="row && statusMeta && riskMeta" class="detail-body" data-detail-object="order-profit-review">
      <div class="detail-head">
        <span class="detail-head__identity mono">{{ row.orderNo }}</span>
        <span class="s-pill" :data-s="statusMeta.tone">{{ t(`profit.status.${row.reviewStatus}`) }}</span>
        <span class="s-pill" :data-s="riskMeta.tone">{{ t('profit.detail.riskPrefix') }} {{ t(`profit.risk.${row.riskLevel}`) }}</span>
      </div>
      <div class="detail-head__context">{{ row.customer }} · {{ row.region }} · {{ row.businessLine }}</div>

      <section class="detail-section" aria-labelledby="profit-facts-title">
        <h3 id="profit-facts-title" class="detail-section__title">{{ t('profit.detail.profitFacts') }}</h3>
        <a-descriptions :column="2" size="small" :data="profitFacts" />
      </section>

      <section class="detail-section" aria-labelledby="risk-items-title">
        <h3 id="risk-items-title" class="detail-section__title">{{ t('profit.detail.riskItems') }}</h3>
        <div v-if="row.riskItems.length" class="risk-list">
          <span v-for="item in row.riskItems" :key="item" class="s-pill" data-s="wait">{{ item }}</span>
        </div>
        <div v-else class="detail-empty">{{ t('profit.detail.noRisk') }}</div>
      </section>

      <section class="detail-section" aria-labelledby="review-timeline-title">
        <h3 id="review-timeline-title" class="detail-section__title">{{ t('profit.detail.timeline') }}</h3>
        <a-timeline>
          <a-timeline-item v-for="item in row.timeline" :key="`${item.time}-${item.label}`">
            <div class="timeline-item">
              <span class="timeline-item__label">{{ item.label }}</span>
              <span class="timeline-item__time mono">{{ item.time }}</span>
            </div>
          </a-timeline-item>
        </a-timeline>
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

.risk-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-empty {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 18px;
}

.timeline-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.timeline-item__label {
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  line-height: 18px;
}

.timeline-item__time {
  flex-shrink: 0;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}
</style>
