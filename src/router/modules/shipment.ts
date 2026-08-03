import type { RouteRecordRaw } from 'vue-router';

export const shipmentRoutes: RouteRecordRaw[] = [
  {
    path: 'shipment/export-orders',
    name: 'ShipmentOrderWorkbench',
    component: () => import('../../views/shipment/orderWorkbench/index.vue'),
    meta: { menuKey: 'shipment-order-workbench', title: '海运出口订单', titleKey: 'routes.exportOrders' },
  },
];
