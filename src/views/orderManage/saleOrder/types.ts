export type TransportMode = 'sea' | 'air' | 'rail';

export type ScopeFilter = 'all' | 'personal' | 'permission';

export type SaleOrderStatus =
  | 'pending_audit'
  | 'op_pending'
  | 'unsubmitted'
  | 'submitted'
  | 'accepted'
  | 'released'
  | 'rejected'
  | 'abandoned'
  | 'sailed'
  | 'draft';

export interface SaleOrderRecord {
  Id: number;
  OrderNo: string;
  SubmitTime: string;
  Status: SaleOrderStatus;
  CargoType: string;
  BizType: string;
  DcgNo: string;
  WarehouseNo: string;
  Salesman: string;
  Shipper: string;
  Consignee: string;
  ContainerInfo: string;
  TransportMode: TransportMode;
  ImportExport: string;
  Operator: string;
  CustomerService: string;
  CsDocument: string;
  PackingMethod: string;
  QuickTag: string;
  HasRemark: boolean;
  HasFiles: boolean;
  Scope: ScopeFilter;
}

export interface SaleOrderQuery {
  transportMode: TransportMode;
  bizType: string;
  dcgNo: string;
  importExport: string;
  salesman: string;
  operator: string;
  customerService: string;
  csDocument: string;
  packingMethod: string;
  shipper: string;
  consignee: string;
  quickTag: string;
  scope: ScopeFilter;
  status: string;
  keyword: string;
  /** 快捷时间：空 | today | last7 */
  timeQuick: '' | 'today' | 'last7';
}

export interface SaleOrderFormModel {
  DcgNo: string;
  OrderNo: string;
  BizType: string;
  CargoType: string;
  ImportExport: string;
  Salesman: string;
  Operator: string;
  CustomerService: string;
  Shipper: string;
  Consignee: string;
  ContainerInfo: string;
  PackingMethod: string;
  Status: SaleOrderStatus;
  TransportMode: TransportMode;
}
