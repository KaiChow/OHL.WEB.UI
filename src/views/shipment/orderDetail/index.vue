<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ShipmentOrderDetailDrawer from './ShipmentOrderDetailDrawer.vue';
import { getShipmentOrderMock } from './mockData';

const route = useRoute();
const router = useRouter();
const shipmentOrderRecord = computed(() => getShipmentOrderMock(typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined));

const goBackToList = () => {
  router.push({ name: 'ShipmentOrderWorkbenchPreview' });
};
</script>

<template>
  <shipment-order-detail-drawer
    :visible="true"
    :record="shipmentOrderRecord"
    @update:visible="(visible) => { if (!visible) goBackToList(); }"
  />
</template>

<style scoped>
</style>
