import type { RouteRecordRaw } from 'vue-router';

export const domesticFinanceRoutes: RouteRecordRaw[] = [
  {
    path: 'domestic-finance/payment-manage',
    name: 'PaymentManage',
    component: () => import('../../views/domesticFinance/paymentManage/index.vue'),
    meta: { menuKey: 'payment-manage', title: '收付款管理' }
  }
];
