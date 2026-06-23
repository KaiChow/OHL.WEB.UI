export interface CustomerContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
}

export interface CustomerFollowUp {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export type CoopStatus = 'cooperated' | 'not_cooperated';

export interface CustomerRecord {
  Id: number;
  Name: string;
  CustomerType: string;
  Level: string;
  Country: string;
  Tags: string[];
  Contacts: CustomerContact[];
  LatestFollowUp: string;
  LastUpdated: string;
  ProductName: string;
  CoopStatus: CoopStatus;
  Department: string;
  SalesContact: string;
  OperationContact: string;
  TradeTerms: string;
  TransportMode: string;
  Pol: string;
  Pod: string;
  CreatedAt: string;
  Remark: string;
  FollowUps: CustomerFollowUp[];
  IsStarred: boolean;
}

export interface CustomerQuery {
  coopStatus: '' | 'cooperated' | 'not_cooperated';
  name: string;
  customerType: string;
  level: string;
  country: string;
  email: string;
  department: string;
  sales: string;
  operation: string;
  includeTags: string[];
  excludeTags: string[];
  contactTitle: string;
  contactName: string;
  contactPhone: string;
  transportMode: string;
  tradeTerms: string;
  productName: string;
  pol: string;
  pod: string;
  hasAbnormalEmail: string;
  lastUpdatedStart: string;
  lastUpdatedEnd: string;
  createdStart: string;
  createdEnd: string;
  lastSentStart: string;
  lastSentEnd: string;
  keyword: string;
}
