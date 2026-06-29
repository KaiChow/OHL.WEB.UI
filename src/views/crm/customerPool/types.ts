export type CooperateSegment = 'uncooperated' | 'cooperated';

export type ListScope = 'all' | 'deleted';

export type CustomerTagTone = 'acc' | 'wait' | 'op' | 'partial' | 'rel' | 'draft';

export interface CustomerTag {
  label: string;
  tone: CustomerTagTone;
}

export interface CustomerRecord {
  Id: string;
  name: string;
  customerType: string;
  country: string;
  tags: CustomerTag[];
  csName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  lastFollowUp: string;
  cooperateStatus: CooperateSegment;
  deleted: boolean;
  createdAt: string;
  lastFollowAt: string;
  lastShipAt: string;
  opsStaff: string;
  creator: string;
  remark: string;
}

export interface CustomerQuery {
  name: string;
  customerType: string | undefined;
  country: string | undefined;
  tagInclude: string;
  tagExclude: string;
  contactKeyword: string;
  contactEmail: string;
  contactPhone: string;
  createdRange: string[];
  lastFollowRange: string[];
  lastShipRange: string[];
  csName: string | undefined;
  opsStaff: string | undefined;
  creator: string | undefined;
}
