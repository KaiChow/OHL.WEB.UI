import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'shipment',
    title: '海运业务', titleKey: 'menu.shipment',
    children: [
      { key: 'shipment-order-workbench', title: '出口订单', titleKey: 'menu.exportOrders', routeName: 'ShipmentOrderWorkbench' },
    ],
  },
  {
    key: 'warehouse',
    title: '仓库', titleKey: 'menu.warehouse',
    children: [
      { key: 'inspection-putaway', title: '验收上架', titleKey: 'menu.inspectionPutaway', routeName: 'InspectionPutaway' },
    ],
  },
  {
    key: 'domestic-finance',
    title: '国内财务', titleKey: 'menu.domesticFinance',
    children: [
      { key: 'profit-statement', title: '利润表', titleKey: 'menu.profitStatement', routeName: 'ProfitStatement' },
      { key: 'statement-of-account', title: '对账单', titleKey: 'menu.statementOfAccount', routeName: 'StatementOfAccount' },
    ],
  },
  {
    key: 'crm',
    title: 'CRM', titleKey: 'menu.crm',
    children: [
      { key: 'customer-pool', title: '客户池', titleKey: 'menu.customerPool', routeName: 'CustomerPool' },
    ],
  },
  {
    key: 'system-manage',
    title: '系统管理', titleKey: 'menu.systemManage',
    children: [
      { key: 'notification-list', title: '通知列表', titleKey: 'menu.notificationList', routeName: 'NotificationList' },
    ],
  },
  {
    key: 'ui-acceptance',
    title: 'UI 验收', titleKey: 'menu.uiAcceptance',
    children: [
      { key: 'ui-acceptance-export-order-list', title: '海运出口订单列表', titleKey: 'menu.exportOrderListAcceptance', routeName: 'UiAcceptanceExportOrderList' },
    ],
  },
];
