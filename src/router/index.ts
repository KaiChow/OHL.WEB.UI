import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { financeRoutes } from './modules/finance';
import { systemRoutes } from './modules/system';
import { crmRoutes } from './modules/crm';
import { warehouseRoutes } from './modules/warehouse';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    redirect: { name: 'ProfitStatement' },
    children: [...financeRoutes, ...warehouseRoutes, ...systemRoutes, ...crmRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
