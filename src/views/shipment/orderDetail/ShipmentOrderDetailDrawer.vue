<script setup lang="ts">
import { computed } from 'vue';
import { IconArrowRight, IconClockCircle, IconExclamationCircle } from '@arco-design/web-vue/es/icon';
import type { ShipmentOrderDetailRecord } from './types';

const props = defineProps<{
  visible: boolean;
  record: ShipmentOrderDetailRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  openFull: [orderNo: string];
}>();

const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const pendingNodes = computed(() => props.record?.nodes.filter((item) => item.statusKey !== 'rel').length ?? 0);
const pendingRisks = computed(() => props.record?.risks.filter((item) => item.status !== '已关闭').length ?? 0);

const close = () => {
  drawerVisible.value = false;
};

const goFull = () => {
  if (props.record?.orderNo) emit('openFull', props.record.orderNo);
};
</script>

<template>
  <a-drawer
    v-model:visible="drawerVisible"
    width="min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))"
    :mask-closable="true"
    unmount-on-close
    class="detail-drawer detail-drawer--standard"
    data-ui-surface="quick-detail"
  >
    <template v-if="record" #title>
      <div class="quickview-title">
        <span class="mono quickview-title__id">{{ record.orderNo }}</span>
        <span class="s-pill" :data-s="record.statusPill">{{ record.orderStatusLabel }}</span>
      </div>
    </template>

    <div v-if="record" class="order-quickview" data-overlay-content="quick-detail">
      <header class="quickview-identity">
        <div class="quickview-identity__main">
          <div class="quickview-route">
            <strong>{{ record.pol }}</strong>
            <icon-arrow-right />
            <strong>{{ record.pod }}</strong>
          </div>
          <div class="quickview-context">{{ record.customerName }} · {{ record.businessType }}</div>
          <div class="quickview-context">{{ record.carrier }} / {{ record.vesselVoyage }}</div>
        </div>
        <div class="quickview-attention" :data-active="pendingRisks > 0">
          <icon-exclamation-circle />
          <span>{{ pendingRisks ? `${pendingRisks} 项风险待处理` : '当前无阻塞风险' }}</span>
        </div>
      </header>

      <div class="quickview-facts">
        <div class="quickview-fact">
          <span>ETD / ETA</span>
          <strong class="mono">{{ record.etd }} / {{ record.eta }}</strong>
        </div>
        <div class="quickview-fact">
          <span>截关时间</span>
          <strong class="mono">{{ record.closingTime }}</strong>
        </div>
        <div class="quickview-fact">
          <span>柜型柜量</span>
          <strong>{{ record.containerSummary }}</strong>
        </div>
        <div class="quickview-fact">
          <span>当前操作</span>
          <strong>{{ record.operator }}</strong>
        </div>
      </div>

      <section v-if="record.risks.length" class="quickview-section">
        <div class="quickview-section__head">
          <strong>待处理风险</strong>
          <span class="quickview-section__count">{{ pendingRisks }}</span>
        </div>
        <div class="quickview-risk-list">
          <div v-for="risk in record.risks" :key="risk.id" class="quickview-risk">
            <span class="s-pill" :data-s="risk.level === 'danger' ? 'rej' : 'wait'">{{ risk.status }}</span>
            <div class="quickview-risk__body">
              <strong>{{ risk.type }}</strong>
              <span>{{ risk.message }}</span>
            </div>
            <div class="quickview-risk__meta">
              <span>{{ risk.owner }}</span>
              <span class="mono">{{ risk.dueAt }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="quickview-section">
        <div class="quickview-section__head">
          <div>
            <strong>执行进度</strong>
            <span>{{ pendingNodes }} 个节点待推进</span>
          </div>
          <icon-clock-circle class="quickview-section__icon" />
        </div>
        <a-timeline size="small" class="quickview-timeline">
          <a-timeline-item
            v-for="node in record.nodes.slice(0, 5)"
            :key="node.id"
            :line-type="node.statusKey === 'rel' ? 'solid' : 'dashed'"
          >
            <div class="quickview-node">
              <div class="quickview-node__main">
                <strong>{{ node.name }}</strong>
                <span class="s-pill" :data-s="node.statusKey">{{ node.status }}</span>
              </div>
              <span>{{ node.owner }} · 计划 <span class="mono">{{ node.planTime }}</span></span>
            </div>
          </a-timeline-item>
        </a-timeline>
      </section>

      <section class="quickview-section">
        <div class="quickview-section__head">
          <div>
            <strong>费用概览</strong>
            <span>{{ record.profitStatus }}</span>
          </div>
          <span class="s-pill" :data-s="record.profitStatusKey">{{ record.profitStatus }}</span>
        </div>
        <div class="quickview-money">
          <div><span>应收</span><strong>{{ record.feeSummary.receivableTotal.toLocaleString() }}</strong></div>
          <div><span>应付</span><strong>{{ record.feeSummary.payableTotal.toLocaleString() }}</strong></div>
          <div><span>毛利</span><strong>{{ record.feeSummary.grossProfit.toLocaleString() }}</strong></div>
          <div><span>毛利率</span><strong>{{ record.feeSummary.grossMargin }}%</strong></div>
        </div>
      </section>

      <section class="quickview-section quickview-section--table">
        <div class="quickview-section__head">
          <strong>最近操作</strong>
        </div>
        <vxe-table
          class="detail-mini-vxe detail-mini-vxe--readonly"
          border="none"
          size="small"
          :data="record.logs.slice(0, 4)"
          :row-config="{ isHover: true, keyField: 'id' }"
        >
          <vxe-column field="time" title="时间" min-width="130" />
          <vxe-column field="operator" title="操作人" min-width="80" />
          <vxe-column field="action" title="操作" min-width="100" />
          <vxe-column field="after" title="结果" min-width="90" />
        </vxe-table>
      </section>
    </div>

    <template #footer>
      <div class="quickview-footer">
        <a-button size="small" @click="close">关闭</a-button>
        <a-button size="small" type="primary" @click="goFull">
          打开完整详情
          <template #icon><icon-arrow-right /></template>
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped>
.quickview-title,
.quickview-footer,
.quickview-section__head,
.quickview-node__main {
  display: flex;
  align-items: center;
}

.quickview-title {
  gap: 8px;
}

.quickview-title__id {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
}

.order-quickview {
  display: flex;
  flex-direction: column;
  gap: var(--dense-gap-module);
  min-width: 0;
}

.quickview-identity {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: var(--dense-gap-module);
  border-bottom: 1px solid var(--color-border-1);
}

.quickview-identity__main {
  min-width: 0;
}

.quickview-route {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-1);
  font-size: var(--dense-font-hero);
  line-height: 22px;
}

.quickview-context {
  margin-top: 3px;
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-control);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quickview-attention {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--color-border-1);
  border-radius: var(--dense-radius);
  color: var(--color-text-2);
  background: var(--color-fill-1);
  font-size: var(--dense-font-control);
}

.quickview-attention[data-active='true'] {
  border-color: var(--dense-warning-3);
  color: var(--dense-warning-7);
  background: var(--dense-warning-1);
}

.quickview-facts,
.quickview-money {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.quickview-fact,
.quickview-money > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.quickview-fact > span,
.quickview-money span {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.quickview-fact > strong,
.quickview-money strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-variant-numeric: tabular-nums;
  font-weight: var(--dense-weight-title);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quickview-section {
  border-top: 1px solid var(--color-border-1);
  padding-top: var(--dense-gap-module);
}

.quickview-section__head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.quickview-section__head > div {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.quickview-section__head strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
}

.quickview-section__head span:not(.s-pill):not(.quickview-section__count) {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.quickview-section__count {
  min-width: 22px;
  color: var(--dense-danger-7);
  font-size: var(--dense-font-control);
  font-weight: var(--dense-weight-title);
  text-align: right;
}

.quickview-section__icon {
  color: var(--color-text-3);
}

.quickview-risk-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border-1);
}

.quickview-risk {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 132px;
  align-items: start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-1);
}

.quickview-risk__body,
.quickview-risk__meta,
.quickview-node {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.quickview-risk__body strong,
.quickview-node strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
}

.quickview-risk__body span,
.quickview-risk__meta,
.quickview-node > span {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 17px;
}

.quickview-risk__meta {
  align-items: flex-end;
  text-align: right;
}

.quickview-timeline {
  padding: 2px 4px 0;
}

.quickview-node__main {
  gap: 8px;
}

.quickview-section--table {
  min-width: 0;
  padding-bottom: 4px;
}

.quickview-section--table .detail-mini-vxe {
  width: 100%;
}

.quickview-footer {
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

@media (max-width: 760px) {
  .quickview-identity {
    flex-direction: column;
  }

  .quickview-facts,
  .quickview-money {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quickview-risk {
    grid-template-columns: 54px minmax(0, 1fr);
  }

  .quickview-risk__meta {
    grid-column: 2;
    align-items: flex-start;
    text-align: left;
  }
}
</style>
