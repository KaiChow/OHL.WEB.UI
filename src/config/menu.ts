import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'shipment',
    title: '业务单',
    children: [
      { key: 'shipment-order-workbench', title: '业务单工作台', routeName: 'ShipmentOrderWorkbenchPreview' },
    ],
  },
  {
    key: 'warehouse',
    title: '仓库',
    children: [
      { key: 'inspection-putaway', title: '验收上架', routeName: 'InspectionPutaway' },
    ],
  },
  {
    key: 'domestic-finance',
    title: '国内财务',
    children: [
      { key: 'profit-statement', title: '利润表', routeName: 'ProfitStatement' },
      { key: 'statement-of-account', title: '对账单', routeName: 'StatementOfAccount' },
    ],
  },
  {
    key: 'crm',
    title: 'CRM',
    children: [
      { key: 'customer-pool', title: '客户池', routeName: 'CustomerPool' },
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
