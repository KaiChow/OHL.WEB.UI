import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { shipmentRoutes } from './modules/shipment';
import { uiAcceptanceRoutes } from './modules/uiAcceptance';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: { name: 'ShipmentOrderWorkbench' },
    children: [...shipmentRoutes, ...uiAcceptanceRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
