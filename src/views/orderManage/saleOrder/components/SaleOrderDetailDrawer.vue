<script setup lang="ts">
import { statusColorMap, statusTextMap } from '../config';
import type { SaleOrderRow } from '../types';

defineProps<{
  selectedOrder: SaleOrderRow | null;
}>();

const visible = defineModel<boolean>('visible', { required: true });
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    class="order-detail-drawer"
    title="业务单详情"
    :width="720"
    :footer="false"
    unmount-on-close
  >
    <template v-if="selectedOrder">
      <div class="detail-header">
        <div>
          <div class="detail-title">{{ selectedOrder.DcgNo || selectedOrder.OrderNo }}</div>
          <div class="detail-subtitle">{{ selectedOrder.LoaddingPortEn }} → {{ selectedOrder.DeliveryPortEn }}</div>
        </div>
        <a-tag size="small" :color="statusColorMap[selectedOrder.FollowState]">
          <span class="status-dot" />
          {{ statusTextMap[selectedOrder.FollowState] }}
        </a-tag>
      </div>

      <div class="detail-grid">
        <div class="detail-item"><span>业务单号</span><strong>{{ selectedOrder.OrderNo }}</strong></div>
        <div class="detail-item"><span>入仓单号</span><strong>{{ selectedOrder.WarehouseNo || '-' }}</strong></div>
        <div class="detail-item"><span>客户名称</span><strong>{{ selectedOrder.CustomerName }}</strong></div>
        <div class="detail-item"><span>业务员</span><strong>{{ selectedOrder.Salesman }}</strong></div>
        <div class="detail-item"><span>发货人</span><strong>{{ selectedOrder.Shipper }}</strong></div>
        <div class="detail-item"><span>收货人</span><strong>{{ selectedOrder.Consignees }}</strong></div>
        <div class="detail-item"><span>船公司</span><strong>{{ selectedOrder.ShipCompany || '-' }}</strong></div>
        <div class="detail-item"><span>船名航次</span><strong>{{ selectedOrder.ShipCompanyAndVoyno || '-' }}</strong></div>
        <div class="detail-item"><span>服务项</span><strong>{{ selectedOrder.ServiceItemStr }}</strong></div>
        <div class="detail-item"><span>装柜方式</span><strong>{{ selectedOrder.LoaddingTypeStr }}</strong></div>
        <div class="detail-item"><span>件数</span><strong>{{ selectedOrder.ProductMass }}</strong></div>
        <div class="detail-item">
          <span>毛重 / 体积</span>
          <strong>{{ selectedOrder.ProductGrossWeight }} / {{ selectedOrder.ProductVolume }}</strong>
        </div>
      </div>
    </template>
  </a-drawer>
</template>
