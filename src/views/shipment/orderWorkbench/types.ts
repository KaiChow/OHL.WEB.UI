export type ShipmentStatusKey =
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

export type OrderStatusKey =
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

export interface ShipmentOrderQuery {
  orderNo: string;
  customerName: string;
  vesselVoyage: string;
  blNo: string;
  pol: string;
  pod: string;
  orderStatus: string | undefined;
  operator: string | undefined;
  businessType: string | undefined;
  etdRange: string[];
  closingRange: string[];
  hasException: string | undefined;
  bookingNo: string;
  containerNo: string;
  containerType: string | undefined;
  carrier: string | undefined;
  overseasAgent: string | undefined;
  customsMode: string | undefined;
  truckSupplier: string | undefined;
  warehouse: string | undefined;
  tradeTerm: string | undefined;
  paymentMethod: string | undefined;
  fileStatus: string | undefined;
  feeStatus: string | undefined;
  createdRange: string[];
  updatedRange: string[];
  isOverdue: string | undefined;
  hasUnreadMsg: string | undefined;
  hasPendingApproval: string | undefined;
}

export interface ShipmentWorkbenchRow {
  id: string;
  orderNo: string;
  customerName: string;
  businessType: string;
  orderStatus: OrderStatusKey;
  orderStatusLabel: string;
  statusPill: string;
  vesselVoyage: string;
  pol: string;
  pod: string;
  etd: string;
  eta: string;
  closingTime: string;
  blNo: string;
  bookingNo: string;
  containerSummary: string;
  operator: string;
  fileStatus: 'complete' | 'missing' | 'pending';
  fileStatusLabel: string;
  feeStatus: 'none' | 'pending' | 'confirmed';
  feeStatusLabel: string;
  exceptionStatus: 'normal' | 'open' | 'resolved';
  exceptionStatusLabel: string;
  updatedAt: string;
  riskFlags: string[];
  quickStatus: ShipmentStatusKey[];
  isOverdue: boolean;
  todayNew: boolean;
}

export interface StatusTabStat {
  key: ShipmentStatusKey;
  label: string;
  count: number;
  todayNew: number;
  overdue: number;
  tone?: 'danger' | 'warn';
}
