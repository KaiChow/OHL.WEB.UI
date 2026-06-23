import type { RouteRecordRaw } from 'vue-router';

export const orderManageRoutes: RouteRecordRaw[] = [
  {
    path: 'order-manage/sale-order',
    name: 'SaleOrder',
    component: () => import('../../views/orderManage/saleOrder/index.vue'),
    meta: { menuKey: 'sale-order', title: '业务单' }
  },
  {
    path: 'order-manage/sale-order/detail',
    name: 'SaleOrderDetail',
    component: () => import('../../views/orderManage/saleOrder/OrderDetail.vue'),
    meta: { menuKey: 'sale-order', title: '订单详情' }
  },
  {
    path: 'order-manage/sale-order/create',
    name: 'SaleOrderCreate',
    component: () => import('../../views/orderManage/saleOrder/OrderCreate.vue'),
    meta: { menuKey: 'sale-order', title: '新建订单' }
  },
];