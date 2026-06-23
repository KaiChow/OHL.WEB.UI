import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'dashboard',
    title: '工作台',
    children: [
      { key: 'dashboard', title: '数据概览', routeName: 'Dashboard' }
    ]
  },
  {
    key: 'order-manage',
    title: '下单模块',
    children: [
      { key: 'sale-order', title: '业务单', routeName: 'SaleOrder' }
    ]
  },
  {
    key: 'logistics-warehouse',
    title: '物流仓储',
    children: [
      { key: 'warehouse-inbound', title: '入仓管理', routeName: 'WarehouseInbound' },
      { key: 'shipment-tracking', title: '运输跟踪', routeName: 'ShipmentTracking' },
      { key: 'inventory', title: '库存管理', routeName: 'Inventory' }
    ]
  },
  {
    key: 'finance',
    title: '财务模块',
    children: [
      { key: 'receivable-bill', title: '应收账单', routeName: 'ReceivableBill' },
      { key: 'payable-bill', title: '应付账单', routeName: 'PayableBill' },
      { key: 'reconciliation', title: '对账单', routeName: 'Reconciliation' }
    ]
  }
];
