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

/** 详情抽屉 — 权限人员行 */
export interface DetailStaffRow {
  id: string;
  company: string;
  role: string;
  userName: string;
}

/** 详情 — 货物品名行 */
export interface DetailCargoItemRow {
  id: string;
  cnName: string;
  enName: string;
  mark: string;
  hsCode: string;
  qty: number;
  unit: string;
  grossWeight: number;
  volume: number;
}

/** 详情 — 货物信息块（发货人/收货人 + 品名表） */
export interface DetailCargoBlock {
  id: string;
  shipper: string;
  consignee: string;
  notifyParty: string;
  overseasAgent: string;
  vatNo: string;
  eoriNo: string;
  remark: string;
  items: DetailCargoItemRow[];
}

export interface DetailCustomsRow {
  id: string;
  shipper: string;
  declareMethod: string;
  uploadTime: string;
}

export interface DetailDeliveryRow {
  id: string;
  hblNo: string;
  destination: string;
  deliveryMethod: string;
  expressCo: string;
  expressNo: string;
  privateWhNo: string;
}

export interface DetailClearanceRow {
  id: string;
  importer: string;
  eoriInfo: string;
  vatNo: string;
  invoiceNo: string;
  address: string;
}

export type DetailAttachmentStatus = 'uploaded' | 'missing' | 'review';

export interface DetailAttachmentRow {
  id: string;
  docType: string;
  fileName: string;
  required: boolean;
  multiple: boolean;
  status: DetailAttachmentStatus;
  uploader: string;
  uploadTime: string;
}

/** 业务单完整详情（抽屉 / 表单页） */
export interface SaleOrderDetailModel {
  DcgNo: string;
  OrderNo: string;
  BizType: string;
  PackingMethod: string;
  Customer: string;
  Po: string;
  ServiceScope: string;
  ServiceItems: string[];
  OwnerCompany: string;
  ImportExport: string;
  CargoTypes: string[];
  Pol: string;
  Pod: string;
  Pot: string;
  FinalDestination: string;
  Carrier: string;
  Route: string;
  VesselVoyage: string;
  Etd: string;
  Eta: string;
  TransportTerms: string;
  TransportModeLabel: string;
  TradeTerms: string;
  BlFormat: string;
  MblFormat: string;
  NeedHandoverHeader: boolean;
  EstWarehouse: string;
  EstInboundTime: string;
  EstOutboundTime: string;
  NeedInboundPhoto: boolean;
  CustomerRemark: string;
  OverseasRemark: string;
  AttachmentRemark: string;
  AttachmentRows: DetailAttachmentRow[];
  OrderTypeFlags: string[];
  StaffRows: DetailStaffRow[];
  CargoBlocks: DetailCargoBlock[];
  CustomsRows: DetailCustomsRow[];
  DeliveryRows: DetailDeliveryRow[];
  ClearanceRows: DetailClearanceRow[];
  ClearanceTerms: string;
  PrepaidTax: string;
  PvaDefer: string;
  OverseasAgentFee: string;
  CustomerPaysCustoms: string;
  Status: SaleOrderStatus;
  TransportMode: TransportMode;
  Salesman: string;
  Operator: string;
  CustomerService: string;
  Shipper: string;
  Consignee: string;
  ContainerInfo: string;
  CargoType: string;
}
