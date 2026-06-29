<script setup lang="ts">
import type { ProfitRecord } from './types';

defineProps<{
  visible: boolean;
  record: ProfitRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const formatAmount = (n: number) =>
  n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const close = () => emit('update:visible', false);
</script>

<template>
  <a-drawer
    :visible="visible"
    class="detail-drawer detail-drawer--standard"
    :width="720"
    :footer="false"
    :mask-closable="false"
    title="利润详情"
    @cancel="close"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="record" class="detail-drawer-body">
      <div class="detail-drawer-status">
        <div class="detail-drawer-status__no">
          <span class="link-text link-text--strong mono">{{ record.orderNo }}</span>
        </div>
        <div class="detail-drawer-status__sub">
          <span class="s-pill" :data-s="record.orderStatusKey">{{ record.orderStatus }}</span>
        </div>
      </div>

      <div class="detail-drawer-scroll">
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">利润概览</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--2">
              <div class="detail-field">
                <span class="detail-field__label">真实利润</span>
                <span class="detail-field__val num-val">{{ formatAmount(record.realProfit) }} {{ record.currency }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">真实预估</span>
                <span class="detail-field__val num-val">{{ formatAmount(record.realEstimate) }} {{ record.currency }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">销售额</span>
                <span class="detail-field__val num-val">{{ formatAmount(record.salesAmount) }} {{ record.currency }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">币种</span>
                <span class="detail-field__val">{{ record.currency }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">订单信息</h4>
          </div>
          <div class="detail-section__body">
            <div class="detail-form-grid detail-form-grid--2">
              <div class="detail-field">
                <span class="detail-field__label">所属公司</span>
                <span class="detail-field__val">{{ record.company }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">业务范围</span>
                <span class="detail-field__val">{{ record.businessScope }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">MBL</span>
                <span class="detail-field__val mono">{{ record.mbl }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">客户</span>
                <span class="detail-field__val">{{ record.customer }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">柜型柜量</span>
                <span class="detail-field__val">{{ record.containerSummary }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">运输方式</span>
                <span class="detail-field__val">{{ record.transportMode }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">起运港</span>
                <span class="detail-field__val">{{ record.pol }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">目的地</span>
                <span class="detail-field__val">{{ record.pod }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">毛重 (KG)</span>
                <span class="detail-field__val">{{ record.grossWeight.toLocaleString('zh-CN') }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field__label">体积 (CBM)</span>
                <span class="detail-field__val">{{ record.volume.toLocaleString('zh-CN') }}</span>
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
