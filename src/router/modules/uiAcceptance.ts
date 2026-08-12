import type { RouteRecordRaw } from 'vue-router';

export const uiAcceptanceRoutes: RouteRecordRaw[] = [
  {
    path: 'ui-acceptance/export-order-list',
    name: 'UiAcceptanceExportOrderList',
    component: () => import('@/views/uiAcceptance/exportOrderList/index.vue'),
    meta: {
      menuKey: 'ui-acceptance-export-order-list',
      title: '海运出口订单列表',
      titleKey: 'routes.exportOrderListAcceptance',
    },
  },
];
