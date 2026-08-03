import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { analysisRoutes } from './modules/analysis';
import { shipmentRoutes } from './modules/shipment';
import { uiAcceptanceRoutes } from './modules/uiAcceptance';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: { name: 'ShipmentOrderWorkbench' },
    children: [...shipmentRoutes, ...analysisRoutes, ...uiAcceptanceRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
