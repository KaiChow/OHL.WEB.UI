import type { PesdpQueryFieldWidthRole } from '../../../design-system/pesdpPageSpec';

export type QueryScenarioKey =
  | 's0'
  | 's1-compact'
  | 's1-inline'
  | 's2-expand'
  | 's3-drawer'
  | 's3-wide'
  | 's4-drawer';

export interface ScenarioField {
  key: string;
  label: string;
  group: string;
  kind: 'input' | 'select' | 'range' | 'composite';
  width: PesdpQueryFieldWidthRole;
}

export const SCENARIO_FIELDS: ScenarioField[] = [
  { key: 'keyword', label: '单号检索', group: '识别条件', kind: 'composite', width: 'composite' },
  { key: 'customerName', label: '客户名称', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'businessType', label: '业务类型', group: '识别条件', kind: 'select', width: 'compact' },
  { key: 'owner', label: '责任操作', group: '执行与归属', kind: 'select', width: 'compact' },
  { key: 'orderStatus', label: '订单状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'updatedRange', label: '更新时间', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'hblNo', label: 'HBL', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'mblNo', label: 'MBL', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'bookingNo', label: '订舱号', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'containerNo', label: '柜号', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'customerReference', label: '客户参考号', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'externalReference', label: '外部参考号', group: '识别条件', kind: 'input', width: 'standard' },
  { key: 'pol', label: '起运港', group: '航线与运输', kind: 'select', width: 'compact' },
  { key: 'pod', label: '目的港', group: '航线与运输', kind: 'select', width: 'compact' },
  { key: 'transitPort', label: '中转港', group: '航线与运输', kind: 'select', width: 'compact' },
  { key: 'carrier', label: '船公司', group: '航线与运输', kind: 'select', width: 'compact' },
  { key: 'vesselName', label: '船名', group: '航线与运输', kind: 'input', width: 'standard' },
  { key: 'voyageNo', label: '航次', group: '航线与运输', kind: 'input', width: 'compact' },
  { key: 'serviceRoute', label: '航线服务', group: '航线与运输', kind: 'select', width: 'standard' },
  { key: 'etdRange', label: 'ETD', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'etaRange', label: 'ETA', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'closingRange', label: '截关时间', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'customsDeadlineRange', label: '报关截止', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'truckingDateRange', label: '拖车日期', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'warehouseDateRange', label: '入仓日期', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'createdRange', label: '创建时间', group: '时间计划', kind: 'range', width: 'range' },
  { key: 'documentOwner', label: '单证负责人', group: '执行与归属', kind: 'select', width: 'compact' },
  { key: 'customerService', label: '客服负责人', group: '执行与归属', kind: 'select', width: 'compact' },
  { key: 'salesperson', label: '业务员', group: '执行与归属', kind: 'select', width: 'compact' },
  { key: 'operationDepartment', label: '操作部门', group: '执行与归属', kind: 'select', width: 'compact' },
  { key: 'branch', label: '所属分公司', group: '执行与归属', kind: 'select', width: 'compact' },
  { key: 'bookingStatus', label: '订舱状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'customsStatus', label: '报关状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'truckingStatus', label: '拖车状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'documentStatus', label: '单证状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'feeStatus', label: '费用状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'settlementStatus', label: '结算状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'invoiceStatus', label: '开票状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'exceptionState', label: '异常状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'overdueState', label: '逾期状态', group: '状态与风险', kind: 'select', width: 'compact' },
  { key: 'currency', label: '币种', group: '财务条件', kind: 'select', width: 'compact' },
  { key: 'amountRange', label: '订单金额', group: '财务条件', kind: 'range', width: 'range' },
  { key: 'grossProfitRange', label: '毛利率', group: '财务条件', kind: 'range', width: 'range' },
  { key: 'receivableStatus', label: '应收状态', group: '财务条件', kind: 'select', width: 'compact' },
  { key: 'payableStatus', label: '应付状态', group: '财务条件', kind: 'select', width: 'compact' },
  { key: 'creator', label: '创建人', group: '审计与来源', kind: 'select', width: 'compact' },
  { key: 'updater', label: '更新人', group: '审计与来源', kind: 'select', width: 'compact' },
  { key: 'source', label: '订单来源', group: '审计与来源', kind: 'select', width: 'compact' },
  { key: 'tradeTerm', label: '贸易条款', group: '货物与条款', kind: 'select', width: 'compact' },
  { key: 'transportClause', label: '运输条款', group: '货物与条款', kind: 'select', width: 'compact' },
  { key: 'cargoName', label: '品名', group: '货物与条款', kind: 'input', width: 'standard' },
  { key: 'remarkKeyword', label: '备注关键词', group: '货物与条款', kind: 'input', width: 'standard' },
];

const compactVisible = ['keyword', 'businessType'];
const inlineVisible = ['customerName', 'businessType', 'owner', 'orderStatus', 'branch', 'source'];
const expandVisible = ['customerName', 'businessType', 'owner', 'orderStatus', 'branch'];
const coreVisible = ['keyword', 'customerName', 'businessType', 'owner'];
const expandSecondary = ['hblNo', 'mblNo', 'bookingNo', 'source', 'pol', 'pod', 'carrier'];

export const QUERY_SCENARIOS = [
  { key: 's0', routeName: 'QueryScenarioS0', labelKey: 'queryScenario.scenarios.s0', total: 0, visible: [] },
  { key: 's1-compact', routeName: 'QueryScenarioS1Compact', labelKey: 'queryScenario.scenarios.s1Compact', total: 2, visible: compactVisible },
  { key: 's1-inline', routeName: 'QueryScenarioS1Inline', labelKey: 'queryScenario.scenarios.s1Inline', total: 6, visible: inlineVisible },
  { key: 's2-expand', routeName: 'QueryScenarioS2Expand', labelKey: 'queryScenario.scenarios.s2Expand', total: 12, visible: expandVisible, secondary: expandSecondary },
  { key: 's3-drawer', routeName: 'QueryScenarioS3Drawer', labelKey: 'queryScenario.scenarios.s3Drawer', total: 24, visible: coreVisible },
  { key: 's3-wide', routeName: 'QueryScenarioS3Wide', labelKey: 'queryScenario.scenarios.s3Wide', total: 40, visible: coreVisible },
  { key: 's4-drawer', routeName: 'QueryScenarioS4Drawer', labelKey: 'queryScenario.scenarios.s4Drawer', total: 52, visible: ['keyword', 'customerName', 'businessType'] },
] as const;
