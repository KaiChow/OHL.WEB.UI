import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('../../views/dashboard/index.vue'),
    meta: { menuKey: 'dashboard', title: '工作台' }
  }
];
