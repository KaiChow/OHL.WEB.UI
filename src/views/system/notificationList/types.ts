export type NotificationStatus = 'all' | 'draft' | 'pending' | 'published' | 'expired' | 'cancelled';

export type NotificationStatusKey = Exclude<NotificationStatus, 'all'>;

export interface NotificationFile {
  uid: string;
  name: string;
  url: string;
}

export interface NotificationRecord {
  Id: string;
  type: string;
  subject: string;
  content: string;
  files: NotificationFile[];
  status: NotificationStatusKey;
  lastPublishTime: string;
  targetType: 'all' | 'custom';
  targetLabel: string;
  effectivePeriod: string;
  creator: string;
  lastEditTime: string;
}

export interface NotificationQuery {
  subject: string;
  content: string;
  publishTimeRange: string[];
  effectivePeriod: string | undefined;
  targetType: string | undefined;
  deptGroup: string | undefined;
  creator: string | undefined;
}
