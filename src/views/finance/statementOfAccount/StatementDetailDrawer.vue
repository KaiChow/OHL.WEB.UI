<script setup lang="ts">
import type { StatementRecord } from './types';

const props = defineProps<{
  visible: boolean;
  record: StatementRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const formatAmount = (value: number) =>
  value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const writeOffPill = (record: StatementRecord) => {
  if (record.unwrittenOffAmount <= 0) return { s: 'rel', label: '已核销' };
  if (record.unwrittenOffAmount >= record.totalBillAmount) return { s: 'wait', label: '未核销' };
  return { s: 'partial', label: '部分核销' };
};

const close = () => emit('update:visible', false);
</script>

<template>
  <a-drawer
    :visible="visible"
    class="detail-drawer detail-drawer--standard"
    :width="720"
    :footer="false"
    :mask-closable="false"
    title="对账单详情"
    @cancel="close"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="props.record" class="detail-drawer-body">
      <div class="detail-drawer-status">
        <div class="detail-drawer-status__no">
          <span class="link-text link-text--strong">{{ props.record.contractUnit }}</span>
        </div>
        <div class="detail-drawer-status__sub">
          <span class="s-pill" :data-s="writeOffPill(props.record).s">
            {{ writeOffPill(props.record).label }}
          </span>
        </div>
      </div>

      <div class="detail-drawer-scroll">
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">基本信息</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--2">
              <div class="detail-field">
                <span class="detail-field__label">类型</span>
                <span class="detail-field__val">{{ props.record.type }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">业务员</span>
                <span class="detail-field__val">{{ props.record.salesperson }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">所在部门/组</span>
                <span class="detail-field__val">{{ props.record.department }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">预计付款日期</span>
                <span class="detail-field__val">{{ props.record.estimatedPaymentDate }}</span>
              </div>
              <div class="detail-field detail-field--wide">
                <span class="detail-field__label">备注</span>
                <span class="detail-field__val">{{ props.record.remark || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">金额信息</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--2">
              <div class="detail-field">
                <span class="detail-field__label">账单总金额</span>
                <span class="detail-field__val num-val">{{ formatAmount(props.record.totalBillAmount) }} CNY</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">未核销总金额</span>
                <span class="detail-field__val num-val">{{ formatAmount(props.record.unwrittenOffAmount) }} CNY</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">逾期金额</span>
                <span class="detail-field__val num-val">{{ formatAmount(props.record.overdueAmount) }} CNY</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">预计付款金额</span>
                <span class="detail-field__val num-val">
                  {{ formatAmount(props.record.estimatedPaymentAmount) }} {{ props.record.estimatedPaymentCurrency }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-drawer-footer">
        <div class="detail-drawer-footer__start" />
        <div class="detail-drawer-footer__end">
          <a-button size="small" @click="close">关闭</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
</style>
