export interface ShipmentOrderQuery {
  businessType: string | undefined;
  quickTag: string | undefined;
  identifierType: 'orderNo' | 'suborderNo' | 'hblNo' | 'mblNo';
  keyword: string;
  salesperson: string;
  operator: string;
  packageMode: string | undefined;
  customer: string;
  departurePort: string;
  hblNo: string;
  mblNo: string;
  pushBeforeVessel: string | undefined;
}

export type ShipmentScopeKey = 'all' | 'personal' | 'permission';
export type ShipmentCargoScopeKey = 'all' | 'fcl' | 'lcl';
export type ShipmentStatusKey = 'all' | 'pending' | 'operating' | 'completed' | 'abandoned';

export interface ShipmentWorkbenchRow {
  id: string;
  orderNo: string;
  orderStatus: string;
  orderStatusKey: string;
  suborderStatus: string;
  suborderNo: string;
  cargoType: string;
  financePod: string;
  feeLink: string;
  qty: number;
  grossWeight: number;
  volume: number;
  containerType: string;
  businessNo: string;
  externalOrderNo: string;
  pushBeforeVessel: boolean;
  customer: string;
  contractNo: string;
  destinationInfo: string;
  cabinetNo: string;
  departurePort: string;
  hblNo: string;
  soNo: string;
  mblNo: string;
  documentDownload: boolean;
  quickTag: string;
  cargoScope: ShipmentCargoScopeKey;
  salesperson: string;
  operator: string;
  businessType: string;
  packageMode: string;
  deleted?: boolean;
}
