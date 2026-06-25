import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { domesticFinanceRoutes } from './modules/domesticFinance';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/domestic-finance/payment-manage',
    children: [...domesticFinanceRoutes]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
