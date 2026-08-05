export type InteractionScenario = 'form-overlays' | 'action-hierarchy' | 'feedback-states';
export type FormBehavior = 'normal' | 'slow' | 'failure';
export type ActionBehavior = 'normal' | 'permission' | 'pending' | 'partial';
export type FeedbackBehavior = 'success' | 'loading' | 'slow' | 'empty' | 'permission' | 'network' | 'validation' | 'partial' | 'long';

export interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

export interface CustomerForm {
  customerName: string;
  customerType: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
}

export interface SettlementForm {
  companyName: string;
  taxNo: string;
  currency: string;
  paymentTerm: string;
  bankName: string;
  bankAccount: string;
  invoiceTitle: string;
  invoiceEmail: string;
  billingAddress: string;
  remark: string;
}

export interface AcceptanceTaskRow {
  id: string;
  taskNo: string;
  state: 'pending' | 'processing' | 'completed';
  customer: string;
  owner: string;
  nextAction: string;
  updatedAt: string;
}
