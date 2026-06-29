import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { systemRoutes } from './modules/system';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue'),
    redirect: { name: 'NotificationList' },
    children: [...systemRoutes],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
