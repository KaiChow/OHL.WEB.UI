import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { orderManageRoutes } from './modules/orderManage';
import { logisticsWarehouseRoutes } from './modules/logisticsWarehouse';
import { financeRoutes } from './modules/finance';
import { dashboardRoutes } from './modules/dashboard';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/order-manage/sale-order',
    children: [...dashboardRoutes, ...orderManageRoutes, ...logisticsWarehouseRoutes, ...financeRoutes]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
