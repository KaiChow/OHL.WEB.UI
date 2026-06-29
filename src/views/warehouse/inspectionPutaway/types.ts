export type PutawayStatusKey =
  | 'all'
  | 'normal'
  | 'problem'
  | 'labelPending'
  | 'claim'
  | 'partialInbound'
  | 'expressToTruck'
  | 'truckToExpress'
  | 'externalProcess'
  | 'wechatCs'
  | 'photoMissing'
  | 'unboxInspect';

export interface PutawayQuery {
  putawayStatus: string | undefined;
  storageOrderNo: string;
  storageMethod: string | undefined;
  orderNo: string;
  transportMode: string | undefined;
  deliveryMethod: string | undefined;
  putawayStartDate: string | undefined;
  putawayEndDate: string | undefined;
  independentStatus: string | undefined;
  certComplete: string | undefined;
  photoUploaded: string | undefined;
  stockoutStatus: string | undefined;
  packingMethod: string | undefined;
  stockoutFeeNotSubmitted: string | undefined;
  inventoryMatch: string | undefined;
  expressCompany: string | undefined;
  expressSubNo: string;
  expressMainNo: string;
  unboxInspect: string | undefined;
}

export interface PutawayRecord {
  Id: string;
  instructionNo: string;
  storageOrderNo: string;
  putawayStatus: string;
  putawayStatusKey: string;
  transportMode: string;
  expressNo: string;
  binLocation: string;
  putawayDate: string;
  volume: number;
  chargeableWeight: number;
  chargeableVolume: number;
  warehouse: string;
  inspector: string;
  outboundStatus: string;
  outboundStatusKey: string;
  photoUploaded: boolean;
  statusTag: PutawayStatusKey;
}
