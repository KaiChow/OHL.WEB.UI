import type { RouteRecordRaw } from 'vue-router';

export const shipmentRoutes: RouteRecordRaw[] = [
  {
    path: '__preview/shipment-order-workbench',
    name: 'ShipmentOrderWorkbenchPreview',
    component: () => import('../../views/shipment/orderWorkbench/index.vue'),
    meta: { menuKey: 'shipment-order-workbench', title: '业务单工作台' },
  },
];
