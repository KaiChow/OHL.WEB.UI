import type { AppTabItem } from '../types/navigation';

export const initialTabs: AppTabItem[] = [
  { key: 'dashboard', title: '工作台', routeName: 'Dashboard' },
  { key: 'sale-order', title: '业务单', routeName: 'SaleOrder', closable: true },
];
