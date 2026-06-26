import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'order-manage',
    title: '订单管理',
    children: [
      { key: 'business-order-list', title: '业务单列表', routeName: 'BusinessOrderList' },
    ],
  },
  {
    key: 'domestic-finance',
    title: '国内财务',
    children: [
      { key: 'payment-manage', title: '收付款管理', routeName: 'PaymentManage' },
    ],
  },
];
