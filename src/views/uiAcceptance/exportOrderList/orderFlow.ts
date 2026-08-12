import type {
  ExportOrderRow,
  ExportOrderStatusKey,
  ExportQueueKey,
} from '@/views/uiAcceptance/exportOrderList/types';

export const EXPORT_ORDER_STATUSES: ExportOrderStatusKey[] = [
  'draft',
  'waitBooking',
  'booking',
  'released',
  'waitTruck',
  'trucking',
  'waitCustoms',
  'customs',
  'cleared',
  'waitSail',
  'sailed',
  'inTransit',
  'arrived',
  'clearing',
  'delivering',
  'signed',
  'completed',
  'cancelled',
];

export type ExportStatusTone = 'draft' | 'wait' | 'op' | 'acc' | 'rel' | 'rej';

export const EXPORT_STATUS_TONES: Record<ExportOrderStatusKey, ExportStatusTone> = {
  draft: 'draft',
  waitBooking: 'wait',
  booking: 'op',
  released: 'acc',
  waitTruck: 'wait',
  trucking: 'op',
  waitCustoms: 'wait',
  customs: 'op',
  cleared: 'acc',
  waitSail: 'wait',
  sailed: 'rel',
  inTransit: 'op',
  arrived: 'acc',
  clearing: 'op',
  delivering: 'op',
  signed: 'acc',
  completed: 'rel',
  cancelled: 'rej',
};

const statusRank = (status: ExportOrderStatusKey) => EXPORT_ORDER_STATUSES.indexOf(status);

// PRD 第 5 章合法流转矩阵：只允许沿主流程推进（含服务项目决定的分支），禁止跨级与逆向。
const FORWARD_TRANSITIONS: Partial<Record<ExportOrderStatusKey, ExportOrderStatusKey[]>> = {
  draft: ['waitBooking'],
  waitBooking: ['booking'],
  booking: ['released'],
  released: ['waitTruck', 'waitCustoms'],
  waitTruck: ['trucking'],
  trucking: ['waitCustoms'],
  waitCustoms: ['customs'],
  customs: ['cleared'],
  cleared: ['waitSail'],
  waitSail: ['sailed'],
  sailed: ['inTransit'],
  inTransit: ['arrived'],
  arrived: ['clearing', 'completed'],
  clearing: ['delivering'],
  delivering: ['signed'],
  signed: ['completed'],
};

export interface ExportStatusTransition {
  value: ExportOrderStatusKey;
  tone: ExportStatusTone;
  kind: 'forward' | 'cancel';
}

export const isTerminalStatus = (status: ExportOrderStatusKey) => status === 'completed' || status === 'cancelled';

export const isReadOnlyRow = (row: ExportOrderRow) => isTerminalStatus(row.orderStatus);

// 取消前置条件（PRD 5）：无已确认应收未冲销、无未关闭的高等级异常。
export type CancelBlocker = 'receivable' | 'highException';

export const getCancelBlockers = (row: ExportOrderRow): CancelBlocker[] => {
  const blockers: CancelBlocker[] = [];
  if (row.hasConfirmedUnwrittenReceivable) blockers.push('receivable');
  if (row.exceptionStatus === 'open' && (row.exceptionLevel === 'high' || row.exceptionLevel === 'critical')) {
    blockers.push('highException');
  }
  return blockers;
};

export const getExportStatusTransitions = (row: ExportOrderRow): ExportStatusTransition[] => {
  if (isTerminalStatus(row.orderStatus)) return [];
  const forward = (FORWARD_TRANSITIONS[row.orderStatus] ?? [])
    // 已到港且无派送服务时才允许直达已完成；有派送服务必须经清关/派送。
    .filter((target) => !(row.orderStatus === 'arrived' && target === 'completed' && row.hasTruckingService))
    .map((value) => ({ value, tone: EXPORT_STATUS_TONES[value], kind: 'forward' as const }));
  return [...forward, { value: 'cancelled', tone: 'rej', kind: 'cancel' }];
};

export const isLegalTransition = (row: ExportOrderRow, target: ExportOrderStatusKey) =>
  getExportStatusTransitions(row).some((transition) => transition.value === target);

// 作废（PRD 16.6）：已开船及之后的在途状态、已完成、已取消不可作废。
const NON_VOIDABLE_STATUSES: ExportOrderStatusKey[] = [
  'sailed',
  'inTransit',
  'arrived',
  'clearing',
  'delivering',
  'signed',
  'completed',
  'cancelled',
];

export const canVoidRow = (row: ExportOrderRow) => !NON_VOIDABLE_STATUSES.includes(row.orderStatus);

// 12 工作队列归属（PRD 8.7）：队列只是快捷筛选维度，全部由行事实派生。
export const deriveQueueKeys = (row: ExportOrderRow): ExportQueueKey[] => {
  const rank = statusRank(row.orderStatus);
  const keys = new Set<ExportQueueKey>(['all']);
  if (isTerminalStatus(row.orderStatus)) return Array.from(keys);

  if (['draft', 'waitBooking'].includes(row.orderStatus)) keys.add('waitBooking');
  if (row.orderStatus === 'booking') keys.add('waitRelease');
  if (row.orderStatus === 'released') keys.add(row.hasTruckingService ? 'waitTruck' : 'waitCustoms');
  if (['waitTruck', 'trucking'].includes(row.orderStatus)) keys.add('waitTruck');
  if (['waitCustoms', 'customs'].includes(row.orderStatus)) keys.add('waitCustoms');
  if (['cleared', 'waitSail'].includes(row.orderStatus)) keys.add('waitLoading');
  if (['sailed', 'inTransit'].includes(row.orderStatus)) keys.add('sailed');
  if (rank >= statusRank('sailed') && row.fileStatus !== 'complete') keys.add('waitSi');
  if (rank >= statusRank('sailed') && !row.blConfirmed) keys.add('waitBlConfirm');
  if (row.feeStatus !== 'confirmed') keys.add('feeUnconfirmed');
  if (row.fileStatus === 'missing') keys.add('fileMissing');
  if (row.exceptionStatus === 'open') keys.add('exception');
  return Array.from(keys);
};

// 超期判定（PRD 6.1）：截关已过但未放行，或 ETD 已过但未开船。
export const isRowOverdue = (row: ExportOrderRow, today: string) => {
  const rank = statusRank(row.orderStatus);
  if (isTerminalStatus(row.orderStatus)) return false;
  if (row.closingTime && row.closingTime.slice(0, 10) < today && rank < statusRank('cleared')) return true;
  return Boolean(row.etd && row.etd < today && rank < statusRank('sailed'));
};
