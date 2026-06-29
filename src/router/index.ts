import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { financeRoutes } from './modules/finance';
import { systemRoutes } from './modules/system';
import { crmRoutes } from './modules/crm';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    redirect: { name: 'ProfitStatement' },
    children: [...financeRoutes, ...systemRoutes, ...crmRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
