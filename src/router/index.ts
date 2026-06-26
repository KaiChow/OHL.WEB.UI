import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { orderManageRoutes } from './modules/orderManage';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/order-manage/business-order-list',
    children: [...orderManageRoutes]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
