import type { RouteRecordRaw } from 'vue-router';

export const analysisRoutes: RouteRecordRaw[] = [
  {
    path: 'analysis/profit-reviews',
    name: 'ProfitReviewWorkbench',
    component: () => import('../../views/analysis/profitReview/index.vue'),
    meta: { menuKey: 'profit-review-workbench', title: '订单利润核查', titleKey: 'routes.profitReview' },
  },
];
