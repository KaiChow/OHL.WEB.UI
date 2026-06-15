import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { orderManageRoutes } from './modules/orderManage';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/order-manage/sale-order'
  },
  ...orderManageRoutes
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
