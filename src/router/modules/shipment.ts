import type { RouteRecordRaw } from 'vue-router';

export const shipmentRoutes: RouteRecordRaw[] = [
  {
    path: 'shipment/export-orders',
    name: 'ShipmentOrderWorkbench',
    component: () => import('../../views/shipment/orderWorkbench/index.vue'),
    meta: { menuKey: 'shipment-order-workbench', title: '海运出口订单' },
  },
  {
    path: 'shipment/export-orders/detail',
    name: 'ShipmentOrderDetail',
    component: () => import('../../views/shipment/orderDetail/index.vue'),
    meta: { menuKey: 'shipment-order-workbench', title: '订单详情' },
  },
];
