export type TemplateType = 'master' | 'supplement';

export interface TemplateRecord {
  id: string;
  templateType: TemplateType;
  templateName: string;
  carrier: string;
  contractNo: string;
  pol: string;
  pod: string;
  peer: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  viewers: string[];
  isPublic: boolean;
  isSwitchBill: boolean;
}

export interface TemplateQuery {
  templateName: string;
  creator: string;
  pol: string;
  pod: string;
  carrier: string;
  contractNo: string;
  peer: string;
  createdRange: string[];
  updatedRange: string[];
}

export type TemplateDraft = Omit<TemplateRecord, 'id' | 'createdAt' | 'updatedAt'>;
