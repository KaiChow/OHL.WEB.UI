import type { RouteRecordRaw } from 'vue-router';

export const orderManageRoutes: RouteRecordRaw[] = [
  {
    path: 'order-manage/business-order-list',
    name: 'BusinessOrderList',
    component: () => import('../../views/orderManage/businessOrderList/index.vue'),
    meta: { menuKey: 'business-order-list', title: '业务单列表' },
  },
];
