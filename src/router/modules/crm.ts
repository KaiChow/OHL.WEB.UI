import type { RouteRecordRaw } from 'vue-router';

export const crmRoutes: RouteRecordRaw[] = [
  {
    path: 'crm/customer-pool',
    name: 'CustomerPool',
    component: () => import('../../views/crm/customerPool/index.vue'),
    meta: { menuKey: 'customer-pool', title: '客户池' },
  },
];
