export type ExportOrderStatusKey =
  | 'draft'
  | 'waitBooking'
  | 'booking'
  | 'released'
  | 'waitTruck'
  | 'trucking'
  | 'waitCustoms'
  | 'customs'
  | 'cleared'
  | 'waitSail'
  | 'sailed'
  | 'inTransit'
  | 'arrived'
  | 'clearing'
  | 'delivering'
  | 'signed'
  | 'completed'
  | 'cancelled';

export type ExportQueueKey =
  | 'all'
  | 'waitBooking'
  | 'waitRelease'
  | 'waitTruck'
  | 'waitCustoms'
  | 'waitLoading'
  | 'sailed'
  | 'waitSi'
  | 'waitBlConfirm'
  | 'feeUnconfirmed'
  | 'fileMissing'
  | 'exception';

export type ExportUiScenario =
  | 'normal'
  | 'loading'
  | 'slow'
  | 'empty'
  | 'error'
  | 'permission'
  | 'partial'
  | 'long'
  | 'extreme';

export type ExportRiskFlag =
  | 'closingDocs'
  | 'siMissing'
  | 'etdPassed'
  | 'etaPassed'
  | 'sealMissing'
  | 'blUnconfirmed'
  | 'costOverRevenue'
  | 'exceptionStale'
  | 'noUpdate'
  | 'fileRequired';

export type ExportFileStatus = 'complete' | 'missing' | 'pending';
export type ExportFeeStatus = 'none' | 'pending' | 'confirmed';
export type ExportExceptionStatus = 'normal' | 'open' | 'resolved';
export type ExportExceptionLevel = 'low' | 'medium' | 'high' | 'critical';
export type ExportBusinessType = 'FCL' | 'LCL' | 'AIR' | 'RAIL';
export type TriStateFilter = '' | 'yes' | 'no';

export interface ExportOrderQuery {
  keyword: string[];
  customerName: string;
  pol: string | undefined;
  pod: string | undefined;
  orderStatus: string[];
  exceptionStatus: string[];
  fileStatus: string[];
  feeStatus: string[];
  businessType: string[];
  operator: string[];
  carrier: string[];
  vesselVoyage: string;
  etdRange: string[];
  closingRange: string[];
  createdRange: string[];
  updatedRange: string[];
  hasException: TriStateFilter;
  isOverdue: TriStateFilter;
}

export interface ExportOrderNode {
  node: 'booked' | 'spaceReleased' | 'trucked' | 'customsCleared' | 'departed' | 'arrived' | 'delivered';
  time: string;
  operator: string;
}

export type ExportOrderLogAction = 'create' | 'assign' | 'status' | 'exception' | 'file' | 'fee' | 'notify';

export interface ExportOrderLog {
  id: string;
  time: string;
  operator: string;
  action: ExportOrderLogAction;
  detailKey?: string;
}

export interface ExportOrderRow {
  id: string;
  orderNo: string;
  customerName: string;
  businessType: ExportBusinessType;
  orderStatus: ExportOrderStatusKey;
  carrier: string;
  vesselVoyage: string;
  pol: string;
  pod: string;
  etd: string;
  eta: string;
  closingTime: string;
  blNo: string;
  bookingNo: string;
  containerSummary: string;
  containerNos: string[];
  operator: string;
  fileStatus: ExportFileStatus;
  feeStatus: ExportFeeStatus;
  exceptionStatus: ExportExceptionStatus;
  exceptionLevel: ExportExceptionLevel;
  blConfirmed: boolean;
  hasTruckingService: boolean;
  hasConfirmedUnwrittenReceivable: boolean;
  riskFlags: ExportRiskFlag[];
  queueKeys: ExportQueueKey[];
  isOverdue: boolean;
  todayNew: boolean;
  createdAt: string;
  updatedAt: string;
  revision: number;
  recentNodes: ExportOrderNode[];
  recentLogs: ExportOrderLog[];
}

export interface ExportQueueStat {
  key: ExportQueueKey;
  label: string;
  count: number;
  tone?: 'warn' | 'danger';
}

export interface ExportQueryScheme {
  id: string;
  name: string;
  isDefault: boolean;
  conditions: ExportOrderQuery;
}
