import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'domestic-finance',
    title: '国内财务',
    children: [
      { key: 'profit-statement', title: '利润表', routeName: 'ProfitStatement' },
    ],
  },
  {
    key: 'system-manage',
    title: '系统管理',
    children: [
      { key: 'notification-list', title: '通知列表', routeName: 'NotificationList' },
    ],
  },
];
