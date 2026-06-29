<script setup lang="ts">
import { ref, watch } from 'vue';
import { IconClose } from '@arco-design/web-vue/es/icon';
import OrderInfoTab from './components/OrderInfoTab.vue';
import type { ShipmentOrderDetailRecord } from './types';

const props = defineProps<{
  visible: boolean;
  record: ShipmentOrderDetailRecord | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const activeTab = ref('order-info');
const tabs = [
  { key: 'order-info', label: '订单信息' },
  { key: 'bill', label: '提单管理' },
  { key: 'destination', label: '目的港信息' },
  { key: 'fee', label: '费用信息' },
  { key: 'log', label: '订单日志' },
  { key: 'exception', label: '异常管理' },
  { key: 'suborder', label: '下单信息' },
];

watch(
  () => props.visible,
  (visible) => {
    if (visible) activeTab.value = 'order-info';
  },
);

const close = () => emit('update:visible', false);
</script>

<template>
  <a-drawer
    :visible="visible"
    class="detail-drawer detail-drawer--fullscreen"
    :width="1200"
    :footer="false"
    :mask-closable="false"
    @cancel="close"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="record" class="detail-drawer-body">
      <div class="dds-head">
        <div class="dds-head__main">
          <div class="dds-head__identity">
            <span class="dds-status-badge dds-status-badge--dot" data-s="op">已放舱</span>
            <span class="dds-order-no">{{ record.orderNo }}</span>
            <span class="dds-company">订单编号：{{ record.hblNo }}</span>
            <span class="dds-head__meta-sep">|</span>
            <span class="dds-head__meta dds-head__meta--emphasis">海外单号：{{ record.externalOrderNo }}</span>
          </div>
        </div>
        <div class="dds-head__actions">
          <a-button size="small">并单</a-button>
          <a-button size="small">归档</a-button>
          <a-button size="small" type="text" @click="close">
            <template #icon><icon-close /></template>
          </a-button>
        </div>
      </div>

      <div class="dds-hero dds-hero--compact">
        <div class="dds-hero__route">
          <div class="dds-hero__label">航线信息</div>
          <div class="dds-hero__route-main">
            <span class="dds-hero__port">CNYTN</span>
            <span class="dds-hero__arrow">→</span>
            <span class="dds-hero__port">GBFXT</span>
          </div>
          <div class="dds-hero__sub">YANTIAN, CHINA → FELIXSTOWE, UNITED KINGDOM</div>
        </div>
        <div class="dds-hero__facts">
          <div class="dds-hero-fact">
            <div class="dds-hero-fact__label">客户</div>
            <div class="dds-hero-fact__value">{{ record.customerName }}</div>
          </div>
          <div class="dds-hero-fact">
            <div class="dds-hero-fact__label">业务类型</div>
            <div class="dds-hero-fact__value">{{ record.businessType }}</div>
          </div>
          <div class="dds-hero-fact">
            <div class="dds-hero-fact__label">HBL</div>
            <div class="dds-hero-fact__value mono">{{ record.hblNo }}</div>
          </div>
          <div class="dds-hero-fact dds-hero-fact--trailing">
            <div class="dds-hero-fact__label">服务范围</div>
            <div class="dds-hero-fact__value">{{ record.serviceScope }}</div>
          </div>
        </div>
      </div>

      <div class="zone-l1-transport zone-card order-detail-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="seg-btn"
          :class="{ 'seg-btn--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <order-info-tab v-if="activeTab === 'order-info'" :record="record" />
      <div v-else class="detail-drawer-scroll">
        <div class="state-center">
          <span>当前预览仅实现「订单信息」模块，其余 Tab 结构待接入</span>
        </div>
      </div>

      <div class="detail-drawer-footer">
        <div class="detail-drawer-footer__start">
          <a-popconfirm content="确认废弃当前业务单？">
            <a-button size="small" type="text" status="danger">废弃</a-button>
          </a-popconfirm>
        </div>
        <div class="detail-drawer-footer__end">
          <div class="detail-drawer-footer__cluster">
            <a-button size="small" type="outline">下载入仓单理货标签</a-button>
            <a-button size="small">订舱</a-button>
            <a-button size="small">放舱</a-button>
            <a-button size="small">打印业务单</a-button>
            <a-button size="small">保存</a-button>
            <a-button size="small" type="primary">提审打印</a-button>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
.order-detail-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 0;
  border-bottom: 1px solid var(--dense-border);
  overflow-x: auto;
  background: var(--color-bg-card);
}

.order-detail-tabs :deep(.seg-btn) {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px 6px 0 0;
  border-bottom-width: 2px;
}
</style>
