import type { AppMenuItem } from '../types/navigation';

export const appMenus: AppMenuItem[] = [
  {
    key: 'analysis',
    title: '经营分析', titleKey: 'menu.analysis',
    children: [
      { key: 'profit-review-workbench', title: '订单利润核查', titleKey: 'menu.profitReview', routeName: 'ProfitReviewWorkbench' },
    ],
  },
  {
    key: 'shipment',
    title: '海运业务', titleKey: 'menu.shipment',
    children: [
      { key: 'shipment-order-workbench', title: '出口订单', titleKey: 'menu.exportOrders', routeName: 'ShipmentOrderWorkbench' },
      { key: 'shipment-template-management', title: '提单模板管理', titleKey: 'menu.templateManagement', routeName: 'ShipmentTemplateManagement' },
    ],
  },
  {
    key: 'ui-acceptance',
    title: 'UI验收', titleKey: 'menu.uiAcceptance',
    children: [
      { key: 'ui-acceptance-list-design-guide', title: '设计说明', titleKey: 'menu.uiAcceptanceDesignGuide', routeName: 'UiAcceptanceListDesignGuide' },
      { key: 'query-scenario-s1-compact', title: '固定单行 · 紧凑', titleKey: 'menu.queryS1Compact', routeName: 'QueryScenarioS1Compact' },
      { key: 'query-scenario-s1-inline', title: '固定单行 · 完整', titleKey: 'menu.queryS1Inline', routeName: 'QueryScenarioS1Inline' },
      { key: 'query-scenario-s2-expand', title: '页面/抽屉配置 · 12项', titleKey: 'menu.queryS2Expand', routeName: 'QueryScenarioS2Expand' },
      { key: 'query-scenario-s3-drawer', title: '页面/抽屉配置 · 24项', titleKey: 'menu.queryS3Drawer', routeName: 'QueryScenarioS3Drawer' },
      { key: 'query-scenario-s3-wide', title: '宽抽屉配置 · 40项', titleKey: 'menu.queryS3Wide', routeName: 'QueryScenarioS3Wide' },
      { key: 'query-scenario-s4-drawer', title: '保存查询降级 · 52项', titleKey: 'menu.queryS4Drawer', routeName: 'QueryScenarioS4Drawer' },
      { key: 'detail-module-complex', title: '复杂详情模块', titleKey: 'menu.detailModuleComplex', routeName: 'DetailModuleComplex' },
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
];
