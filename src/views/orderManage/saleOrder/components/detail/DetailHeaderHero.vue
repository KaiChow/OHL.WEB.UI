<script setup lang="ts">
import { IconUser } from '@arco-design/web-vue/es/icon';
import type { DrawerMode } from '../../../../../types/drawer';
import { getStatusLabel, getStatusPill } from '../../config';
import type { SaleOrderDetailModel, SaleOrderRecord } from '../../types';

defineProps<{
  detail: SaleOrderDetailModel;
  mode: DrawerMode;
  record: SaleOrderRecord | null;
  currentStep: number;
}>();

const emit = defineEmits<{
  edit: [];
  'view-full': [];
}>();
</script>

<template>
  <div class="dds-head">
    <div class="dds-head__left">
      <span
        v-if="record || mode !== 'create'"
        class="dds-status-badge"
        :data-s="getStatusPill(detail.Status)"
      >{{ getStatusLabel(detail.Status) }}</span>
      <span class="dds-order-no mono">{{ detail.DcgNo || '待生成单号' }}</span>
      <span v-if="detail.OwnerCompany" class="dds-company">{{ detail.OwnerCompany }}</span>
    </div>
    <div class="dds-head__actions">
      <a-button v-if="mode === 'view'" size="small" type="outline" @click="emit('edit')">编辑</a-button>
      <a-button v-if="mode === 'view'" size="small" type="text" @click="emit('view-full')">完整详情</a-button>
    </div>
  </div>

  <div class="dds-hero">
    <div class="dds-hero__route">
      <div class="dds-hero__label">航线</div>
      <div class="dds-hero__route-main">
        <span class="dds-hero__port">{{ detail.Pol || '—' }}</span>
        <span class="dds-hero__arrow">→</span>
        <span class="dds-hero__port">{{ detail.Pod || '—' }}</span>
      </div>
      <div v-if="detail.Pot" class="dds-hero__sub">经 {{ detail.Pot }}</div>
    </div>
    <div class="dds-hero__facts">
      <div class="dds-hero-fact">
        <span class="dds-hero-fact__label">ETD</span>
        <strong class="dds-hero-fact__value mono">{{ detail.Etd || '—' }}</strong>
      </div>
      <div class="dds-hero-fact">
        <span class="dds-hero-fact__label">ETA</span>
        <strong class="dds-hero-fact__value mono">{{ detail.Eta || '—' }}</strong>
      </div>
      <div v-if="detail.Carrier" class="dds-hero-fact">
        <span class="dds-hero-fact__label">船公司</span>
        <strong class="dds-hero-fact__value">{{ detail.Carrier }}</strong>
      </div>
      <div v-if="detail.VesselVoyage" class="dds-hero-fact">
        <span class="dds-hero-fact__label">大船船名/航次</span>
        <strong class="dds-hero-fact__value mono">{{ detail.VesselVoyage }}</strong>
      </div>
      <div v-if="detail.Customer" class="dds-hero-fact dds-hero-fact--customer">
        <span class="dds-hero-fact__label"><icon-user style="font-size:11px" /> 客户</span>
        <strong class="dds-hero-fact__value">{{ detail.Customer }}</strong>
      </div>
    </div>
  </div>

  <div class="dds-steps-bar">
    <a-steps :current="currentStep" size="small" class="dds-steps">
      <a-step title="接单" />
      <a-step title="订舱" />
      <a-step title="进仓" />
      <a-step title="报关" />
      <a-step title="开船" />
      <a-step title="到港" />
    </a-steps>
  </div>
</template>
