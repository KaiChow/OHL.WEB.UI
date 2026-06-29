import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { financeRoutes } from './modules/finance';
import { systemRoutes } from './modules/system';
import { crmRoutes } from './modules/crm';
import { warehouseRoutes } from './modules/warehouse';
import { shipmentRoutes } from './modules/shipment';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    redirect: { name: 'ProfitStatement' },
    children: [...financeRoutes, ...warehouseRoutes, ...systemRoutes, ...crmRoutes, ...shipmentRoutes],
  },
  {
    path: '/__preview/shipment-order-detail',
    name: 'ShipmentOrderDetailPreview',
    component: () => import('../views/shipment/orderDetail/index.vue'),
    meta: { title: '业务单详情预览' },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
