import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'domestic-finance',
    title: '国内财务',
    children: [
      { key: 'payment-manage', title: '收付款管理', routeName: 'PaymentManage' },
    ],
  },
];
