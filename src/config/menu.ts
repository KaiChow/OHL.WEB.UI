import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'system-manage',
    title: '系统管理',
    children: [
      { key: 'notification-list', title: '通知列表', routeName: 'NotificationList' },
    ],
  },
];
