import { defineFeatureContracts } from '../../design-system/featureContract';

export type ProfitReviewUiScenario =
  | 'normal'
  | 'loading'
  | 'slow'
  | 'empty'
  | 'error'
  | 'permission'
  | 'partial';

const SUPPORTED_UI_SCENARIOS = new Set<ProfitReviewUiScenario>([
  'normal',
  'loading',
  'slow',
  'empty',
  'error',
  'permission',
  'partial',
]);

export const resolveProfitReviewUiScenario = (value: unknown): ProfitReviewUiScenario => {
  if (typeof value !== 'string') return 'normal';
  return SUPPORTED_UI_SCENARIOS.has(value as ProfitReviewUiScenario)
    ? value as ProfitReviewUiScenario
    : 'normal';
};

export const PROFIT_REVIEW_FEATURE_CONTRACTS = defineFeatureContracts([
  {
    id: 'profit-review-query', actorRoles: ['analysis.viewer', 'analysis.reviewer'], visibleWhen: '利润核查列表可见', enabledWhen: '当前查询未处于加载中', request: '前端 mock 按已应用条件、状态队列和分页过滤订单利润核查数据', successResult: '更新表格、状态数量和分页', errorResult: '保留已应用条件并在表格位置显示重试入口', refreshScope: '列表、状态计数、分页与选择状态',
  },
  {
    id: 'profit-review-edit', actorRoles: ['analysis.reviewer'], visibleWhen: '当前行可核查', enabledWhen: '说明已填写且提交未进行中', request: '前端 mock 更新核查说明与负责人', successResult: '更新行数据、详情时间线并关闭编辑抽屉', errorResult: '保留编辑抽屉和输入内容', refreshScope: '当前行、详情抽屉与列表',
  },
  {
    id: 'profit-review-batch-submit', actorRoles: ['analysis.reviewer'], visibleWhen: '至少选中一条待核查订单', enabledWhen: '选择非空且没有批量请求进行中', request: '前端 mock 将选择订单提交至复核中', successResult: '更新状态、清空成功选择并显示结果', errorResult: '保留选择并在表格上下文显示失败反馈', refreshScope: '选择行、状态计数、列表与选择上下文',
  },
  {
    id: 'profit-review-reject', actorRoles: ['analysis.reviewer'], visibleWhen: '当前行处于待核查或复核中', enabledWhen: '确认框未在提交中', request: '前端 mock 驳回当前订单核查', successResult: '更新当前行状态与时间线', errorResult: '保持确认框与当前行上下文', refreshScope: '当前行、状态计数和详情',
  },
  {
    id: 'profit-review-delete', actorRoles: ['analysis.manager'], visibleWhen: '当前行处于待核查或已驳回', enabledWhen: '确认框未在提交中', request: '前端 mock 删除当前核查记录', successResult: '从列表移除记录并更新总数', errorResult: '保持确认框与当前列表上下文', refreshScope: '列表、状态计数、分页和选择状态',
  },
  {
    id: 'profit-review-export', actorRoles: ['analysis.viewer', 'analysis.reviewer'], visibleWhen: '列表结果可见', enabledWhen: '当前没有导出任务进行中', request: '前端生成当前筛选结果 CSV', successResult: '下载 CSV 并显示导出条数', errorResult: '保持当前条件与列表结果', refreshScope: '下载产物，不刷新列表',
  },
] as const);
