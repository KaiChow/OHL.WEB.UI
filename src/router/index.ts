import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { analysisRoutes } from './modules/analysis';
import { shipmentRoutes } from './modules/shipment';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: { name: 'ShipmentOrderWorkbench' },
    children: [...shipmentRoutes, ...analysisRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
