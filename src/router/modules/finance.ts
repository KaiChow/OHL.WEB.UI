import type { RouteRecordRaw } from 'vue-router';

export const financeRoutes: RouteRecordRaw[] = [
  {
    path: 'finance/receivable-bill',
    name: 'ReceivableBill',
    component: () => import('../../views/finance/receivableBill/index.vue'),
    meta: { menuKey: 'receivable-bill', title: '应收账单' }
  },
  {
    path: 'finance/payable-bill',
    name: 'PayableBill',
    component: () => import('../../views/finance/payableBill/index.vue'),
    meta: { menuKey: 'payable-bill', title: '应付账单' }
  },
  {
    path: 'finance/reconciliation',
    name: 'Reconciliation',
    component: () => import('../../views/finance/reconciliation/index.vue'),
    meta: { menuKey: 'reconciliation', title: '对账单' }
  }
];
