import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { shipmentRoutes } from './modules/shipment';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: { name: 'ShipmentOrderWorkbench' },
    children: [...shipmentRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
