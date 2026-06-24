import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'workbench',
    title: '工作台',
    children: [{ key: 'dashboard', title: '工作台', routeName: 'Dashboard' }],
  },
  {
    key: 'order-manage',
    title: '进出口订单管理',
    children: [
      { key: 'sale-order', title: '业务单', routeName: 'SaleOrder' },
    ],
  },
  {
    key: 'logistics-warehouse',
    title: '物流仓储',
    children: [
      { key: 'warehouse-inbound', title: '入仓管理', routeName: 'WarehouseInbound' },
      { key: 'shipment-tracking', title: '运输跟踪', routeName: 'ShipmentTracking' },
      { key: 'inventory', title: '库存管理', routeName: 'Inventory' },
    ],
  },
  {
    key: 'customer',
    title: 'CRM客户管理',
    children: [
      { key: 'customer-pool', title: '客户池', routeName: 'CustomerPool' },
    ],
  },
  {
    key: 'finance',
    title: '财务管理',
    children: [
      { key: 'receivable-bill', title: '应收账单', routeName: 'ReceivableBill' },
      { key: 'payable-bill', title: '应付账单', routeName: 'PayableBill' },
      { key: 'reconciliation', title: '对账单', routeName: 'Reconciliation' },
    ],
  },
];
