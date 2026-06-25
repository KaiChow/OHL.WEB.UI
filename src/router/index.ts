import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import { orderManageRoutes } from './modules/orderManage';
import { logisticsWarehouseRoutes } from './modules/logisticsWarehouse';
import { financeRoutes } from './modules/finance';
import { customerRoutes } from './modules/customer';
import { domesticFinanceRoutes } from './modules/domesticFinance';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/order-manage/sale-order',
    children: [...orderManageRoutes, ...logisticsWarehouseRoutes, ...financeRoutes, ...customerRoutes, ...domesticFinanceRoutes]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
