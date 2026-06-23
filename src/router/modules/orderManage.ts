import type { RouteRecordRaw } from 'vue-router';

export const orderManageRoutes: RouteRecordRaw[] = [
  {
    path: 'order-manage/sale-order',
    name: 'SaleOrder',
    component: () => import('../../views/orderManage/saleOrder/index.vue'),
    meta: { menuKey: 'sale-order', title: '业务单' }
  },
];
