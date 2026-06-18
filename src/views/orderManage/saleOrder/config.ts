import type { SaleOrderStatus, TransportMode } from './types';

export const transportTabs: { value: TransportMode; label: string }[] = [
  { value: 'sea', label: '海运' },
  { value: 'air', label: '空运' },
  { value: 'rail', label: '铁路' }
];

export const scopeTabs = [
  { value: 'all', label: '全部单' },
  { value: 'personal', label: '个人单' },
  { value: 'permission', label: '权限单' }
] as const;

export const statusTabs: { value: string; label: string; danger?: boolean }[] = [
  { value: '', label: '全部' },
  { value: 'pending_audit', label: '待审单' },
  { value: 'op_pending', label: '操作待接单' },
  { value: 'unsubmitted', label: '未提交' },
  { value: 'submitted', label: '已提交' },
  { value: 'accepted', label: '已接单' },
  { value: 'released', label: '已放舱' },
  { value: 'rejected', label: '已拒绝', danger: true },
  { value: 'abandoned', label: '已废弃', danger: true }
];

export const statusMeta: Record<SaleOrderStatus, { label: string; pill: string }> = {
  pending_audit: { label: '待审单', pill: 'wait' },
  op_pending: { label: '操作待接单', pill: 'op' },
  unsubmitted: { label: '未提交', pill: 'draft' },
  submitted: { label: '已提交', pill: 'partial' },
  accepted: { label: '已接单', pill: 'acc' },
  released: { label: '已放舱', pill: 'rel' },
  rejected: { label: '已拒绝', pill: 'rej' },
  abandoned: { label: '已废弃', pill: 'draft' },
  sailed: { label: '实际开船', pill: 'rel' },
  draft: { label: '草稿', pill: 'draft' }
};

export const bizTypeOptions = ['全部', 'FBA', 'FOB', 'CIF', 'DDP', 'EXW'];
export const importExportOptions = ['全部', '进口', '出口'];
export const packingOptions = ['全部', 'LCL', 'FCL', '散货'];
export const quickTagOptions = ['全部', '加急', 'VIP', '特殊跟踪', '待补资料'];

export const timeQuickOptions: { value: '' | 'today' | 'last7'; label: string }[] = [
  { value: '', label: '全部时间' },
  { value: 'today', label: '今日' },
  { value: 'last7', label: '近7天' }
];

export const shipperOptions = [
  'SHENZHEN OHL LOGISTICS CO.,LTD',
  'NINGBO FREIGHT INT\'L CO., LTD',
  'GUANGZHOU STAR TRADING LTD',
  'SHANGHAI OCEAN SUPPLY CHAIN'
].map((v) => ({ label: v, value: v }));

export const consigneeOptions = [
  'AMAZON FBA WAREHOUSE',
  'HAMBURG TRADING GMBH',
  'LOS ANGELES IMPORT INC.',
  'ROTTERDAM LOGISTICS BV'
].map((v) => ({ label: v, value: v }));

export const staffOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '陈七', value: '陈七' },
  { label: '操作A', value: '操作A' },
  { label: '操作B', value: '操作B' },
  { label: '操作C', value: '操作C' },
  { label: '操作D', value: '操作D' }
];

export const ADVANCED_FILTER_COUNT = 7;

/** 页面级权限 Mock（操作员视角） */
export const saleOrderPermissions = {
  canCreate: true,
  canExport: true,
  canPrint: true,
  canBatch: true,
  canSpecialTrack: true,
  canViewFinance: false
};

export const defaultPageSizeOptions = [20, 50, 100, 200];

export function getStatusLabel(status: SaleOrderStatus) {
  return statusMeta[status]?.label ?? status;
}

export function getStatusPill(status: SaleOrderStatus) {
  return statusMeta[status]?.pill ?? 'draft';
}

export function isDangerCargo(cargoType: string) {
  return cargoType.includes('危险');
}
