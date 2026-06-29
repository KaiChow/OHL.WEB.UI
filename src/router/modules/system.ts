import type { RouteRecordRaw } from 'vue-router';

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: 'system/notification-list',
    name: 'NotificationList',
    component: () => import('../../views/system/notificationList/index.vue'),
    meta: { menuKey: 'notification-list', title: '通知列表' },
  },
];
