export type CustomerMatchMode = 'include' | 'exclude';

export interface StatementQuery {
  salesCompany: string | undefined;
  billCompany: string | undefined;
  paymentType: string | undefined;
  businessType: string | undefined;
  customerMode: CustomerMatchMode;
  customer: string | undefined;
  receivableFee: string | undefined;
  writeOffStatus: string | undefined;
  etdRange: string[];
  etaRange: string[];
  salesperson: string | undefined;
  cs: string | undefined;
  includeCollectionFee: string | undefined;
  operator: string | undefined;
  companyType: string | undefined;
  dueDateRange: string[];
  atdRange: string[];
  ataRange: string[];
  sysDueDateRange: string[];
  excludeBranch: boolean;
}

export interface StatementRecord {
  Id: string;
  type: string;
  contractUnit: string;
  salesperson: string;
  department: string;
  totalBillAmount: number;
  unwrittenOffAmount: number;
  overdueAmount: number;
  estimatedPaymentDate: string;
  estimatedPaymentAmount: number;
  estimatedPaymentCurrency: string;
  remark: string;
  missingAtd?: boolean;
}
