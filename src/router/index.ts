import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { financeRoutes } from './modules/finance';
import { systemRoutes } from './modules/system';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    redirect: { name: 'ProfitStatement' },
    children: [...financeRoutes, ...systemRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
