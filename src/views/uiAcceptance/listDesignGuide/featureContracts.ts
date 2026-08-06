import { defineFeatureContracts } from '@/design-system/featureContract';

export const LIST_DESIGN_GUIDE_FEATURE_CONTRACTS = defineFeatureContracts([
  {
    id: 'list-design-guide-open-example',
    actorRoles: ['ui.acceptance.viewer'],
    visibleWhen: '列表设计说明页可见且出口订单示例路由已注册',
    enabledWhen: '当前没有正在执行的示例路由跳转',
    request: '通过已注册路由名称打开海运出口订单工作台，不改变业务数据或当前语言',
    successResult: '进入真实出口订单列表，由该路由展示查询、队列、工具栏、VXE 表格、列设置、行操作和分页',
    errorResult: '保留设计说明页与当前阅读位置，并在页面动作归属区提示示例路由无法打开',
    refreshScope: '仅切换当前应用路由',
  },
] as const);
