import type { RouteRecordRaw } from 'vue-router';

export const shipmentRoutes: RouteRecordRaw[] = [
  {
    path: 'shipment/export-orders',
    name: 'ShipmentOrderWorkbench',
    component: () => import('@/views/shipment/orderWorkbench/index.vue'),
    meta: { menuKey: 'shipment-order-workbench', title: '海运出口订单', titleKey: 'routes.exportOrders' },
  },
  {
    path: 'shipment/bl-template-management',
    name: 'ShipmentTemplateManagement',
    component: () => import('@/views/shipment/templateManagement/index.vue'),
    meta: { menuKey: 'shipment-template-management', title: '提单模板管理', titleKey: 'routes.templateManagement' },
  },
];
