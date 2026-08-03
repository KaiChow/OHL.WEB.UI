export type ProfitReviewStatus = 'all' | 'pending' | 'reviewing' | 'approved' | 'rejected';
export type ProfitRiskLevel = 'high' | 'medium' | 'low';

export interface ProfitReviewQuery {
  keyword: string;
  riskLevel: ProfitRiskLevel | undefined;
  region: string | undefined;
  owner: string | undefined;
  updatedRange: string[];
}

export interface ProfitReviewTimelineItem {
  time: string;
  label: string;
}

export interface ProfitReviewRow {
  id: string;
  orderNo: string;
  customer: string;
  region: string;
  businessLine: string;
  owner: string;
  orderAmount: number;
  grossMarginRate: number;
  riskLevel: ProfitRiskLevel;
  reviewStatus: Exclude<ProfitReviewStatus, 'all'>;
  updatedAt: string;
  reviewNote: string;
  riskItems: string[];
  timeline: ProfitReviewTimelineItem[];
}
