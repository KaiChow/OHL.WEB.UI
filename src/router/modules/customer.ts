import type { RouteRecordRaw } from 'vue-router';

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: 'customer/pool',
    name: 'CustomerPool',
    component: () => import('../../views/customer/customerPool/index.vue'),
    meta: { menuKey: 'customer-pool', title: '客户池' }
  },
  {
    path: 'customer/pool/create',
    name: 'CustomerCreate',
    component: () => import('../../views/customer/customerPool/CustomerCreate.vue'),
    meta: { menuKey: 'customer-pool', title: '新建客户' }
  },
  {
    path: 'customer/pool/detail',
    name: 'CustomerDetail',
    component: () => import('../../views/customer/customerPool/CustomerDetail.vue'),
    meta: { menuKey: 'customer-pool', title: '客户详情' }
  }
];
