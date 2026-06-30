import type { RouteRecordRaw } from 'vue-router';

export const shipmentRoutes: RouteRecordRaw[] = [
  {
    path: 'shipment/order-workbench',
    name: 'ShipmentOrderWorkbench',
    component: () => import('../../views/shipment/orderWorkbench/index.vue'),
    meta: { menuKey: 'shipment-order-workbench', title: '业务单工作台' },
  },
  {
    path: '__preview/shipment-order-workbench',
    redirect: { name: 'ShipmentOrderWorkbench' },
  },
];
