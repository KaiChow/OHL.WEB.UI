import {
  deriveQueueKeys,
  EXPORT_ORDER_STATUSES,
  isRowOverdue,
} from '@/views/uiAcceptance/exportOrderList/orderFlow';
import type {
  ExportBusinessType,
  ExportOrderLog,
  ExportOrderNode,
  ExportOrderRow,
  ExportOrderStatusKey,
  ExportRiskFlag,
} from '@/views/uiAcceptance/exportOrderList/types';

// 黑盒演示固定“今天”，保证队列计数、今日新增与超期判定完全确定。
export const EXPORT_ORDER_TODAY = '2026-08-12';

const BASE = new Date(2026, 7, 12, 9, 30);

const pad = (value: number) => String(value).padStart(2, '0');

const stamp = (input: Date | number) => {
  const date = new Date(input);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const shiftDays = (days: number, hour = 9, minute = 30) => {
  const next = new Date(BASE);
  next.setDate(next.getDate() + days);
  next.setHours(hour, minute, 0, 0);
  return stamp(next);
};

const dayOnly = (days: number) => shiftDays(days).slice(0, 10);

export const EXPORT_ORDER_PORTS: { code: string; name: string }[] = [
  { code: 'CNSHA', name: 'Shanghai' },
  { code: 'CNNGB', name: 'Ningbo' },
  { code: 'CNSZX', name: 'Shenzhen' },
  { code: 'CNTAO', name: 'Qingdao' },
  { code: 'CNXMN', name: 'Xiamen' },
  { code: 'USLAX', name: 'Los Angeles' },
  { code: 'USNYC', name: 'New York' },
  { code: 'DEHAM', name: 'Hamburg' },
  { code: 'NLRTM', name: 'Rotterdam' },
  { code: 'SGSIN', name: 'Singapore' },
  { code: 'JPYOK', name: 'Yokohama' },
  { code: 'KRPUS', name: 'Busan' },
];

export const EXPORT_ORDER_CUSTOMERS: string[] = [
  '深圳华贸进出口有限公司',
  '宁波远洋贸易集团',
  '广州宏达电子科技有限公司',
  '上海瑞联国际物流股份有限公司',
  '青岛海盛实业集团',
  '厦门建发供应链管理有限公司',
  'Shanghai International Logistics Technology Development Co., Ltd.',
  '杭州跨境电商产业园运营有限公司',
  '天津港联国际货运代理有限公司',
  '东莞精密制造出口有限公司',
  '苏州工业园联合贸易有限公司',
  '重庆两江新区外贸综合服务有限公司',
];

const CARRIERS = ['COSCO', 'MSC', 'EVERGREEN', 'CMA CGM', 'OOCL', 'YANG MING', 'HMM', 'ONE'];
const OPERATORS = ['张操作', '李操作', '王操作', '赵操作', '陈操作'];
const VESSELS = [
  'COSCO SHIPPING UNIVERSE / 028W',
  'MSC ANNA / 012W',
  'EVER GOLDEN / 115E',
  'CMA CGM MARCO POLO / 088W',
  'OOCL HONG KONG / 201E',
  'YANG MING WITNESS / 332W',
  'HMM ALGECIRAS / 009E',
  'ONE INNOVATION / 077W',
];
const BUSINESS_TYPES: ExportBusinessType[] = ['FCL', 'LCL', 'AIR', 'RAIL'];
const CONTAINER_PATTERNS = ['2×40HQ', '1×40HQ + 1×20GP', '3×40HQ', '2×40GP', '4×40HQ', '1×20GP'];
const NODE_SEQUENCE: ExportOrderNode['node'][] = [
  'booked',
  'spaceReleased',
  'trucked',
  'customsCleared',
  'departed',
  'arrived',
  'delivered',
];

const rankOf = (status: ExportOrderStatusKey) => EXPORT_ORDER_STATUSES.indexOf(status);

const buildNodes = (status: ExportOrderStatusKey, index: number, operator: string): ExportOrderNode[] => {
  const rank = rankOf(status);
  const reached = rank >= 16 ? 7 : rank >= 13 ? 6 : rank >= 11 ? 5 : rank >= 9 ? 4 : rank >= 7 ? 3 : rank >= 3 ? 2 : rank >= 1 ? 1 : 0;
  return NODE_SEQUENCE.slice(Math.max(0, reached - 3), reached).map((node, offset) => ({
    node,
    time: shiftDays(-(reached - offset), 8 + ((index + offset) % 9), (index * 7 + offset * 11) % 60),
    operator,
  }));
};

const buildLogs = (
  row: Pick<ExportOrderRow, 'id' | 'orderStatus' | 'operator' | 'createdAt' | 'updatedAt' | 'exceptionStatus' | 'feeStatus'>,
): ExportOrderLog[] => {
  const logs: ExportOrderLog[] = [
    { id: `${row.id}-log-1`, time: row.createdAt, operator: row.operator, action: 'create' },
    { id: `${row.id}-log-2`, time: row.updatedAt, operator: row.operator, action: 'status', detailKey: row.orderStatus },
  ];
  if (row.exceptionStatus === 'open') {
    logs.splice(1, 0, { id: `${row.id}-log-3`, time: row.updatedAt, operator: '王操作', action: 'exception' });
  } else if (row.feeStatus !== 'none') {
    logs.splice(1, 0, { id: `${row.id}-log-4`, time: row.updatedAt, operator: '李操作', action: 'fee' });
  }
  return logs;
};

const buildRiskFlags = (row: Omit<ExportOrderRow, 'riskFlags' | 'queueKeys' | 'isOverdue' | 'recentNodes' | 'recentLogs'>, index: number): ExportRiskFlag[] => {
  const rank = rankOf(row.orderStatus);
  const flags = new Set<ExportRiskFlag>();
  if (row.fileStatus === 'missing') flags.add('fileRequired');
  if (row.closingTime && Math.abs(new Date(row.closingTime).getTime() - BASE.getTime()) <= 24 * 3600_000
    && row.fileStatus === 'missing' && rank >= rankOf('waitCustoms') && rank <= rankOf('customs')) {
    flags.add('closingDocs');
  }
  if (rank >= rankOf('sailed') && row.fileStatus !== 'complete' && index % 2 === 0) flags.add('siMissing');
  if (row.etd && row.etd < EXPORT_ORDER_TODAY && rank < rankOf('sailed')) flags.add('etdPassed');
  if (row.eta && row.eta < EXPORT_ORDER_TODAY && rank < rankOf('arrived')) flags.add('etaPassed');
  if (rank >= rankOf('cleared') && row.containerNos.length > 0 && index % 3 === 0) flags.add('sealMissing');
  if (rank >= rankOf('sailed') && !row.blConfirmed) flags.add('blUnconfirmed');
  if (row.feeStatus !== 'none' && index % 6 === 0) flags.add('costOverRevenue');
  if (row.exceptionStatus === 'open' && index % 14 === 0) flags.add('exceptionStale');
  if (row.updatedAt.slice(0, 10) < dayOnly(-7)) flags.add('noUpdate');
  return Array.from(flags);
};

const buildRow = (index: number): ExportOrderRow => {
  const seq = index + 1;
  const orderStatus = EXPORT_ORDER_STATUSES[index % EXPORT_ORDER_STATUSES.length];
  const rank = rankOf(orderStatus);
  const operator = OPERATORS[index % OPERATORS.length];
  const isPreSail = rank < rankOf('sailed');
  const etd = isPreSail ? dayOnly(2 + (index % 7)) : dayOnly(-(1 + (index % 9)));
  const eta = rank < rankOf('cleared') && index % 6 === 0
    ? ''
    : stamp(new Date(`${etd}T09:00:00`).getTime() + (12 + (index % 9)) * 24 * 3600_000).slice(0, 10);
  const closingOffset = isPreSail && index % 8 === 0 ? 0 : -2;
  const closingTime = stamp(new Date(`${etd}T12:00:00`).getTime() + closingOffset * 24 * 3600_000);
  const createdAt = index % 9 === 0
    ? shiftDays(0, 8 + (index % 3), (index * 13) % 60)
    : shiftDays(-(1 + (index % 27)), 8 + (index % 10), (index * 17) % 60);
  const updatedAt = index % 10 === 5
    ? shiftDays(-(8 + (index % 3)), 10, (index * 19) % 60)
    : stamp(new Date(Math.min(new Date(createdAt).getTime() + (index % 4 + 1) * 24 * 3600_000, BASE.getTime())));
  const fileStatus = rank >= rankOf('released') && index % 5 === 0
    ? 'missing' as const
    : (['complete', 'pending', 'missing'] as const)[index % 3];
  const feeStatus = (['none', 'pending', 'confirmed'] as const)[index % 3];
  const exceptionStatus = index % 7 === 0 ? 'open' as const : index % 11 === 0 ? 'resolved' as const : 'normal' as const;
  const containerNos = rank >= rankOf('waitCustoms') && index % 4 !== 1
    ? [`MSCU${460000 + index * 7}`]
    : [];

  const core = {
    id: String(seq),
    orderNo: `SO20260812${String(1000 + seq).slice(1)}`,
    customerName: EXPORT_ORDER_CUSTOMERS[index % EXPORT_ORDER_CUSTOMERS.length],
    businessType: BUSINESS_TYPES[index % BUSINESS_TYPES.length],
    orderStatus,
    carrier: CARRIERS[index % CARRIERS.length],
    vesselVoyage: rank >= rankOf('released') && index % 8 !== 3 ? VESSELS[index % VESSELS.length] : '',
    pol: EXPORT_ORDER_PORTS[index % 6].code,
    pod: EXPORT_ORDER_PORTS[6 + (index % 6)].code,
    etd,
    eta,
    closingTime,
    blNo: rank >= rankOf('customs') && index % 4 !== 0 ? `MSCUA${123456 + index * 31}` : '',
    bookingNo: rank >= rankOf('booking') ? `BK202608${String(100000 + seq).slice(1)}` : '',
    containerSummary: rank >= rankOf('waitBooking') && index % 7 !== 2 ? CONTAINER_PATTERNS[index % CONTAINER_PATTERNS.length] : '',
    containerNos,
    operator,
    fileStatus,
    feeStatus,
    exceptionStatus,
    exceptionLevel: exceptionStatus === 'open'
      ? (['low', 'medium', 'high', 'critical'] as const)[index % 4]
      : 'low' as const,
    blConfirmed: rank >= rankOf('sailed') && index % 2 === 0,
    hasTruckingService: index % 2 === 0,
    hasConfirmedUnwrittenReceivable: feeStatus === 'confirmed' && index % 13 === 0,
    todayNew: index % 9 === 0,
    createdAt,
    updatedAt,
    revision: 1 + (index % 3),
  };

  const riskFlags = buildRiskFlags(core, index);
  const row: ExportOrderRow = {
    ...core,
    riskFlags,
    queueKeys: [],
    isOverdue: false,
    recentNodes: buildNodes(orderStatus, index, operator),
    recentLogs: [],
  };
  row.queueKeys = deriveQueueKeys(row);
  row.isOverdue = isRowOverdue(row, EXPORT_ORDER_TODAY);
  row.recentLogs = buildLogs(row);
  return row;
};

export const exportOrderRows: ExportOrderRow[] = Array.from({ length: 72 }, (_, index) => buildRow(index));

export const EXPORT_ORDER_OPERATORS = OPERATORS;
export const EXPORT_ORDER_CARRIERS = CARRIERS;
