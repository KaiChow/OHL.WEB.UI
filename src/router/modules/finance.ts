import type { RouteRecordRaw } from 'vue-router';

export const financeRoutes: RouteRecordRaw[] = [
  {
    path: 'finance/profit-statement',
    name: 'ProfitStatement',
    component: () => import('../../views/finance/profitStatement/index.vue'),
    meta: { menuKey: 'profit-statement', title: '利润表' },
  },
  {
    path: 'finance/statement-of-account',
    name: 'StatementOfAccount',
    component: () => import('../../views/finance/statementOfAccount/index.vue'),
    meta: { menuKey: 'statement-of-account', title: '对账单' },
  },
];
