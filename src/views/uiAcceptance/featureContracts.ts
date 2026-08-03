import { defineFeatureContracts } from '../../design-system/featureContract';

export const QUERY_SCENARIO_FEATURE_CONTRACTS = defineFeatureContracts([
  {
    id: 'query-scenario-apply',
    actorRoles: ['ui.acceptance.viewer'],
    visibleWhen: '当前查询场景包含可应用的查询条件',
    enabledWhen: '查询场景未在应用中',
    request: '在本地验收数据中应用当前场景的可见与高级查询条件',
    successResult: '重置到第一页并更新场景结果表与已应用条件计数',
    errorResult: '保留全部查询条件并在结果表位置显示可恢复错误',
    refreshScope: '当前查询场景、结果表和分页',
  },
] as const);
