export interface OrderInfoSectionField {
  label: string;
  value: string;
  required?: boolean;
  code?: string;
  secondaryValue?: string;
  actionText?: string;
}

export interface CargoLine {
  id: string;
  zhName: string;
  enName: string;
  cartons: string;
  hsCode: string;
  containerNo: string;
  qty: number;
  packageUnit: string;
  grossWeight: number;
  volume: number;
}

export interface CargoPartyBlock {
  id: string;
  title: string;
  senderName: string;
  senderAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  notifyName: string;
  notifyAddress: string;
  overseasAgent: string;
  overseasAgentAddress: string;
  vat: string;
  eori: string;
  remark: string;
  totalQty: number;
  totalWeight: number;
  totalVolume: number;
  lines: CargoLine[];
}

export interface CabinetRow {
  id: string;
  containerType: string;
  containerNo: string;
  sealNo: string;
  soNo: string;
  qty: number;
  packageUnit: string;
  grossWeight: number;
  volume: number;
  planDeliveryTime: string;
  actualDeliveryTime: string;
  pickupTime: string;
  returnTime: string;
  loadingTime: string;
  releaseStatus: string;
  weightVolumeRatio: string;
}

export interface CustomsRow {
  id: string;
  company: string;
  sender: string;
  customsFile: string;
  customsNo: string;
  qty: string;
  packageUnit: string;
  grossWeight: string;
  volume: string;
  customsMethod: string;
  customsStatus: string;
  releaseStatus: string;
  uploadTime: string;
  releaseBookingTime: string;
  customsSheet: string;
  finalConfirmTime: string;
}

export interface WarehouseRow {
  id: string;
  storageNo: string;
  checkSheet: string;
  sender: string;
  destination: string;
  actualInboundDate: string;
  fbaNo: string;
  pickupLabel: string;
  qty: number;
  packageUnit: string;
  grossWeight: number;
  volume: number;
  driverPhone: string;
  storageImage: string;
  actionLabel: string;
}

export interface ShipmentOrderDetailRecord {
  orderNo: string;
  hblNo: string;
  mblNo: string;
  inStorageNo: string;
  externalOrderNo: string;
  customerOrderNo: string;
  customerName: string;
  businessType: string;
  serviceScope: string;
  orderDate: string;
  operationOrderDate: string;
  loadingMethod: string;
  vesselTime: string;
  billModifyTime: string;
  packageMode: string;
  orderStats: Array<{ label: string; value: boolean }>;
  enabledServices: string[];
  flowTabs: Array<{ label: string; state: 'done' | 'current' | 'future' }>;
  basicInfo: {
    firstRow: OrderInfoSectionField[];
    secondRow: OrderInfoSectionField[];
    thirdRow: OrderInfoSectionField[];
    fourthRow: OrderInfoSectionField[];
    fifthRow: OrderInfoSectionField[];
    sixthRow: OrderInfoSectionField[];
    goodsTypes: Array<{ label: string; active: boolean; risk?: boolean }>;
    bottomRemarks: Array<{ label: string; value: string }>;
    orderTypeTags: Array<{ label: string; active: boolean }>;
  };
  cargoBlocks: CargoPartyBlock[];
  cabinetRows: CabinetRow[];
  customsRows: CustomsRow[];
  warehouseRows: WarehouseRow[];
}
