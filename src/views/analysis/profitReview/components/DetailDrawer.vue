<script setup lang="ts">
import { computed } from 'vue';
import type { ProfitReviewRow } from '../types';
import { REVIEW_STATUS_META, RISK_LEVEL_META, formatOrderAmount, formatMarginRate } from '../displayMeta';

const props = defineProps<{
  visible: boolean;
  row: ProfitReviewRow | null;
}>();

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
    { label: '订单号', value: row.orderNo },
    { label: '客户', value: row.customer },
    { label: '区域', value: row.region },
    { label: '业务线', value: row.businessLine },
    { label: '负责人', value: row.owner },
    { label: '订单金额', value: formatOrderAmount(row.orderAmount) },
    { label: '毛利率', value: formatMarginRate(row.grossMarginRate) },
    { label: '更新时间', value: row.updatedAt },
    { label: '核查说明', value: row.reviewNote || '—', span: 2 },
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
    <template #title>订单利润详情</template>
    <div v-if="row && statusMeta && riskMeta" class="detail-body" data-detail-object="order-profit-review">
      <div class="detail-head">
        <span class="detail-head__identity mono">{{ row.orderNo }}</span>
        <span class="s-pill" :data-s="statusMeta.tone">{{ statusMeta.label }}</span>
        <span class="s-pill" :data-s="riskMeta.tone">风险{{ riskMeta.label }}</span>
      </div>
      <div class="detail-head__context">{{ row.customer }} · {{ row.region }} · {{ row.businessLine }}</div>

      <section class="detail-section" aria-labelledby="profit-facts-title">
        <h3 id="profit-facts-title" class="detail-section__title">利润详情</h3>
        <a-descriptions :column="2" size="small" :data="profitFacts" />
      </section>

      <section class="detail-section" aria-labelledby="risk-items-title">
        <h3 id="risk-items-title" class="detail-section__title">风险项</h3>
        <div v-if="row.riskItems.length" class="risk-list">
          <span v-for="item in row.riskItems" :key="item" class="s-pill" data-s="wait">{{ item }}</span>
        </div>
        <div v-else class="detail-empty">暂无风险项</div>
      </section>

      <section class="detail-section" aria-labelledby="review-timeline-title">
        <h3 id="review-timeline-title" class="detail-section__title">核查时间线</h3>
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
