import type { RouteRecordRaw } from 'vue-router';

export const warehouseRoutes: RouteRecordRaw[] = [
  {
    path: 'warehouse/inspection-putaway',
    name: 'InspectionPutaway',
    component: () => import('../../views/warehouse/inspectionPutaway/index.vue'),
    meta: { menuKey: 'inspection-putaway', title: '验收上架' },
  },
];
