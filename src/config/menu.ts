import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'orderManage',
    title: '订单管理',
    children: [
      {
        key: 'saleOrder',
        title: '业务单',
        routeName: 'SaleOrder'
      }
    ]
  }
];
