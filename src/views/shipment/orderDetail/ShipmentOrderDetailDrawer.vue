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
    class="detail-drawer detail-drawer--standard"
    :width="720"
    :footer="false"
    :mask-closable="true"
    unmount-on-close
  >
    <div v-if="record" class="detail-drawer-body">
      <div class="detail-drawer-status">
        <div class="detail-drawer-status__no">
          <span class="link-text link-text--strong mono">{{ record.orderNo }}</span>
        </div>
        <div class="detail-drawer-status__sub">
          <span class="s-pill" :data-s="record.statusPill">{{ record.orderStatusLabel }}</span>
          <span>{{ record.customerName }}</span>
          <span>{{ record.vesselVoyage }}</span>
        </div>
      </div>

      <div class="detail-drawer-scroll">
        <div v-if="record.risks.length" class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">风险提醒</h4>
          </div>
          <div class="detail-section__body">
            <div v-for="risk in record.risks" :key="risk.id" class="workbench-notice workbench-notice--warn" style="margin-bottom:6px;width:100%">
              <span>{{ risk.message }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">订单摘要</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--4">
              <div class="detail-field">
                <span class="detail-field__label">业务类型</span>
                <span class="detail-field__val">{{ record.businessType }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">起运港</span>
                <span class="detail-field__val">{{ record.pol }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">目的港</span>
                <span class="detail-field__val">{{ record.pod }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">ETD / ETA</span>
                <span class="detail-field__val">{{ record.etd }} / {{ record.eta }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">操作人员</span>
                <span class="detail-field__val">{{ record.operator }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">柜型柜量</span>
                <span class="detail-field__val">{{ record.containerSummary }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">利润状态</span>
                <span class="detail-field__val">
                  <span class="s-pill" :data-s="record.profitStatusKey">{{ record.profitStatus }}</span>
                </span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">异常状态</span>
                <span class="detail-field__val">{{ record.exceptionStatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">最近节点</h4>
          </div>
          <div class="detail-section__body">
            <a-timeline size="small">
              <a-timeline-item v-for="node in record.nodes.slice(0, 4)" :key="node.id">
                <div style="display:flex;align-items:center;gap:8px">
                  <span>{{ node.name }}</span>
                  <span class="s-pill" :data-s="node.statusKey">{{ node.status }}</span>
                </div>
                <div style="font-size:var(--dense-font-aux);color:var(--color-text-3)">
                  计划 {{ node.planTime }} · {{ node.owner }}
                </div>
              </a-timeline-item>
            </a-timeline>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">费用概览</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--4">
              <div class="detail-field">
                <span class="detail-field__label">应收合计</span>
                <span class="detail-field__val">{{ record.feeSummary.receivableTotal.toLocaleString() }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">应付合计</span>
                <span class="detail-field__val">{{ record.feeSummary.payableTotal.toLocaleString() }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">毛利</span>
                <span class="detail-field__val">{{ record.feeSummary.grossProfit.toLocaleString() }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">毛利率</span>
                <span class="detail-field__val">{{ record.feeSummary.grossMargin }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">最近日志</h4>
          </div>
          <div class="detail-section__body detail-section__body--table">
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
          </div>
        </div>
      </div>

      <div class="detail-drawer-footer">
        <div class="detail-drawer-footer__start" />
        <div class="detail-drawer-footer__end">
          <a-button size="small" type="outline">上传文件</a-button>
          <a-button size="small" type="primary" @click="goFull">
            进入完整详情
            <template #icon><icon-right /></template>
          </a-button>
          <a-button size="small" @click="close">关闭</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
</style>
