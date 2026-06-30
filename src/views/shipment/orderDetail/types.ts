export interface ShipmentRiskItem {
  id: string;
  type: string;
  level: 'warn' | 'danger';
  message: string;
  owner: string;
  dueAt: string;
  status: string;
}

export interface ShipmentTodoItem {
  id: string;
  type: string;
  owner: string;
  dueAt: string;
  status: string;
}

export interface ShipmentNodeItem {
  id: string;
  name: string;
  planTime: string;
  actualTime: string;
  status: string;
  statusKey: string;
  owner: string;
  source: string;
  overdue: boolean;
}

export interface ShipmentFeeSummary {
  receivableTotal: number;
  payableTotal: number;
  grossProfit: number;
  grossMargin: number;
  unconfirmedReceivable: number;
  unconfirmedPayable: number;
  invoicedAmount: number;
  paidAmount: number;
  unpaidReceivable: number;
  unpaidPayable: number;
}

export interface ShipmentFeeLine {
  id: string;
  name: string;
  currency: string;
  unitPrice: number;
  qty: number;
  unit: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  party: string;
  status: string;
  statusKey: string;
  invoiceStatus?: string;
  paymentStatus?: string;
}

export interface ShipmentFileItem {
  id: string;
  name: string;
  category: string;
  uploader: string;
  uploadedAt: string;
  status: string;
  statusKey: string;
  required: boolean;
  confirmed: boolean;
}

export interface ShipmentExceptionItem {
  id: string;
  no: string;
  type: string;
  level: string;
  levelKey: string;
  description: string;
  department: string;
  owner: string;
  occurredAt: string;
  expectedResolveAt: string;
  status: string;
  statusKey: string;
}

export interface ShipmentLogItem {
  id: string;
  time: string;
  operator: string;
  module: string;
  action: string;
  before: string;
  after: string;
  source: string;
}

export interface ShipmentOrderDetailRecord {
  orderNo: string;
  orderStatus: string;
  orderStatusLabel: string;
  statusPill: string;
  customerName: string;
  businessType: string;
  vesselVoyage: string;
  pol: string;
  pod: string;
  etd: string;
  eta: string;
  operator: string;
  exceptionStatus: string;
  profitStatus: string;
  profitStatusKey: string;
  customerContact: string;
  customerPhone: string;
  customerEmail: string;
  salesPerson: string;
  csPerson: string;
  tradeTerm: string;
  transportTerm: string;
  paymentMethod: string;
  createdAt: string;
  orderSource: string;
  transitPort: string;
  carrier: string;
  vessel: string;
  voyage: string;
  closingTime: string;
  siCutoff: string;
  bookingNo: string;
  bookingAgent: string;
  contractNo: string;
  rateNo: string;
  spaceStatus: string;
  releaseTime: string;
  vgmCutoff: string;
  bookingRemark: string;
  containerSummary: string;
  risks: ShipmentRiskItem[];
  todos: ShipmentTodoItem[];
  nodes: ShipmentNodeItem[];
  feeSummary: ShipmentFeeSummary;
  receivableFees: ShipmentFeeLine[];
  payableFees: ShipmentFeeLine[];
  files: ShipmentFileItem[];
  exceptions: ShipmentExceptionItem[];
  logs: ShipmentLogItem[];
}
