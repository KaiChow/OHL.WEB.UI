import type { ProfitReviewRow, ProfitRiskLevel } from './types';

type PillTone = 'wait' | 'op' | 'acc' | 'rej';

export const REVIEW_STATUS_META: Record<ProfitReviewRow['reviewStatus'], { label: string; tone: PillTone }> = {
  pending: { label: '待核查', tone: 'wait' },
  reviewing: { label: '复核中', tone: 'op' },
  approved: { label: '已通过', tone: 'acc' },
  rejected: { label: '已驳回', tone: 'rej' },
};

export const RISK_LEVEL_META: Record<ProfitRiskLevel, { label: string; tone: PillTone }> = {
  high: { label: '高', tone: 'rej' },
  medium: { label: '中', tone: 'wait' },
  low: { label: '低', tone: 'acc' },
};

export const formatOrderAmount = (value: number) => `¥${value.toLocaleString('zh-CN')}`;

export const formatMarginRate = (value: number) => `${value.toFixed(1)}%`;
