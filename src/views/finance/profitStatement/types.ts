export type NoSearchType = 'orderNo' | 'mbl' | 'containerNo';

export interface ProfitQuery {
  noType: NoSearchType;
  keyword: string;
  customer: string;
  company: string;
  etdRange: string[];
  etaRange: string[];
  orderStatus: string | undefined;
  businessType: string | undefined;
  containerNo: string;
  fobCs: string | undefined;
  docCs: string | undefined;
  placeOfReceipt: string | undefined;
}

export interface ProfitRecord {
  Id: string;
  orderNo: string;
  company: string;
  businessScope: string;
  mbl: string;
  customer: string;
  containerSummary: string;
  grossWeight: number;
  volume: number;
  transportMode: string;
  pol: string;
  pod: string;
  realProfit: number;
  realEstimate: number;
  salesAmount: number;
  currency: string;
  orderStatus: string;
  orderStatusKey: string;
  etd: string;
  eta: string;
  fobCs: string;
  docCs: string;
  placeOfReceipt: string;
  invoiceMarked: boolean;
}
