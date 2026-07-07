<script setup lang="ts">
import { computed } from 'vue';
import { IconRight } from '@arco-design/web-vue/es/icon';
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
  set: (v) => emit('update:visible', v),
});

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
    :width="720"
    :footer="false"
    :mask-closable="true"
    unmount-on-close
  >
    <template v-if="record" #title>
      <a-space :size="8">
        <span class="link-text link-text--strong mono">{{ record.orderNo }}</span>
        <span class="s-pill" :data-s="record.statusPill">{{ record.orderStatusLabel }}</span>
      </a-space>
    </template>

    <a-space v-if="record" direction="vertical" :size="12" fill class="detail-drawer">
      <a-typography-text type="secondary">
        {{ record.customerName }} · {{ record.vesselVoyage }}
      </a-typography-text>

      <a-alert v-if="record.risks.length" type="warning">
        <template #title>风险提醒</template>
        <div v-for="risk in record.risks" :key="risk.id">{{ risk.message }}</div>
      </a-alert>

      <a-card title="订单摘要" size="small" :bordered="true">
        <a-descriptions :column="2" size="small">
          <a-descriptions-item label="业务类型">{{ record.businessType }}</a-descriptions-item>
          <a-descriptions-item label="起运港">{{ record.pol }}</a-descriptions-item>
          <a-descriptions-item label="目的港">{{ record.pod }}</a-descriptions-item>
          <a-descriptions-item label="ETD / ETA">{{ record.etd }} / {{ record.eta }}</a-descriptions-item>
          <a-descriptions-item label="操作人员">{{ record.operator }}</a-descriptions-item>
          <a-descriptions-item label="柜型柜量">{{ record.containerSummary }}</a-descriptions-item>
          <a-descriptions-item label="利润状态">
            <span class="s-pill" :data-s="record.profitStatusKey">{{ record.profitStatus }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="异常状态">{{ record.exceptionStatus }}</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="最近节点" size="small" :bordered="true">
        <a-timeline size="small">
          <a-timeline-item v-for="node in record.nodes.slice(0, 4)" :key="node.id">
            <a-space :size="8">
              <span>{{ node.name }}</span>
              <span class="s-pill" :data-s="node.statusKey">{{ node.status }}</span>
            </a-space>
            <div class="detail-drawer__meta">
              计划 {{ node.planTime }} · {{ node.owner }}
            </div>
          </a-timeline-item>
        </a-timeline>
      </a-card>

      <a-card title="费用概览" size="small" :bordered="true">
        <a-descriptions :column="2" size="small">
          <a-descriptions-item label="应收合计">{{ record.feeSummary.receivableTotal.toLocaleString() }}</a-descriptions-item>
          <a-descriptions-item label="应付合计">{{ record.feeSummary.payableTotal.toLocaleString() }}</a-descriptions-item>
          <a-descriptions-item label="毛利">{{ record.feeSummary.grossProfit.toLocaleString() }}</a-descriptions-item>
          <a-descriptions-item label="毛利率">{{ record.feeSummary.grossMargin }}%</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="最近日志" size="small" :bordered="true">
        <vxe-table
          class="detail-mini-vxe detail-mini-vxe--readonly"
          border="none"
          size="small"
          height="auto"
          :data="record.logs"
          :row-config="{ isHover: true, keyField: 'id', height: 34 }"
        >
          <vxe-column field="time" title="时间" min-width="130" />
          <vxe-column field="operator" title="操作人" min-width="80" />
          <vxe-column field="action" title="操作" min-width="100" />
          <vxe-column field="after" title="结果" min-width="80" />
        </vxe-table>
      </a-card>

      <a-space class="detail-drawer__footer">
        <a-button size="small" type="outline">上传文件</a-button>
        <a-button size="small" type="primary" @click="goFull">
          进入完整详情
          <template #icon><icon-right /></template>
        </a-button>
        <a-button size="small" @click="close">关闭</a-button>
      </a-space>
    </a-space>
  </a-drawer>
</template>

<style scoped>
.detail-drawer {
  min-height: 0;
}

.detail-drawer__meta {
  margin-top: 4px;
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
}

.detail-drawer__footer {
  justify-content: flex-end;
  width: 100%;
  padding-top: 8px;
  border-top: 1px solid var(--color-border-2);
}
</style>
