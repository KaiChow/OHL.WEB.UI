import type { ProfitReviewRow } from './types';

const rows: Array<Omit<ProfitReviewRow, 'id' | 'timeline'>> = [
  { orderNo: 'PR2026070001', customer: '深圳华贸进出口有限公司', region: '华南', businessLine: '海运出口', owner: '张操作', orderAmount: 286000, grossMarginRate: 3.2, riskLevel: 'high', reviewStatus: 'pending', updatedAt: '2026-07-16 09:30', reviewNote: '', riskItems: ['预计毛利率低于预警线', '成本单据未齐'] },
  { orderNo: 'PR2026070002', customer: '宁波远洋贸易集团', region: '华东', businessLine: '海运出口', owner: '李操作', orderAmount: 418000, grossMarginRate: 8.6, riskLevel: 'medium', reviewStatus: 'reviewing', updatedAt: '2026-07-16 08:42', reviewNote: '等待目的港费用确认', riskItems: ['目的港费用待确认'] },
  { orderNo: 'PR2026070003', customer: '广州宏达电子科技', region: '华南', businessLine: '海运出口', owner: '王操作', orderAmount: 126000, grossMarginRate: -1.4, riskLevel: 'high', reviewStatus: 'pending', updatedAt: '2026-07-15 18:10', reviewNote: '', riskItems: ['价格倒挂'] },
  { orderNo: 'PR2026070004', customer: '上海瑞联物流', region: '华东', businessLine: '跨境物流', owner: '赵操作', orderAmount: 362000, grossMarginRate: 12.1, riskLevel: 'low', reviewStatus: 'approved', updatedAt: '2026-07-15 16:25', reviewNote: '核查通过，利润合理', riskItems: [] },
  { orderNo: 'PR2026070005', customer: '青岛海盛实业', region: '华北', businessLine: '海运出口', owner: '张操作', orderAmount: 198000, grossMarginRate: 4.5, riskLevel: 'medium', reviewStatus: 'reviewing', updatedAt: '2026-07-15 14:40', reviewNote: '补充报价依据中', riskItems: ['报价依据待补充'] },
  { orderNo: 'PR2026070006', customer: '厦门建发供应链', region: '华南', businessLine: '跨境物流', owner: '李操作', orderAmount: 520000, grossMarginRate: 9.8, riskLevel: 'low', reviewStatus: 'approved', updatedAt: '2026-07-15 11:20', reviewNote: '核查通过', riskItems: [] },
  { orderNo: 'PR2026070007', customer: '天津港联国际', region: '华北', businessLine: '海运出口', owner: '王操作', orderAmount: 244000, grossMarginRate: 2.7, riskLevel: 'high', reviewStatus: 'rejected', updatedAt: '2026-07-14 17:05', reviewNote: '成本录入缺失，退回补充', riskItems: ['成本缺失', '审批超时'] },
  { orderNo: 'PR2026070008', customer: '东莞精密制造', region: '华南', businessLine: '海运出口', owner: '赵操作', orderAmount: 335000, grossMarginRate: 6.4, riskLevel: 'medium', reviewStatus: 'pending', updatedAt: '2026-07-14 10:18', reviewNote: '', riskItems: ['毛利低于目标'] },
];

export const profitReviewRows: ProfitReviewRow[] = rows.map((row, index) => ({
  ...row,
  id: `profit-review-${index + 1}`,
  timeline: [
    { time: row.updatedAt, label: '利润数据已更新' },
    { time: '2026-07-12 09:00', label: '进入订单利润核查队列' },
  ],
}));
