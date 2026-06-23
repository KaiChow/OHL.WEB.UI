import type { RouteRecordRaw } from 'vue-router';

export const logisticsWarehouseRoutes: RouteRecordRaw[] = [
  {
    path: 'logistics-warehouse/warehouse-inbound',
    name: 'WarehouseInbound',
    component: () => import('../../views/logisticsWarehouse/warehouseInbound/index.vue'),
    meta: { menuKey: 'warehouse-inbound', title: '入仓管理' }
  },
  {
    path: 'logistics-warehouse/shipment-tracking',
    name: 'ShipmentTracking',
    component: () => import('../../views/logisticsWarehouse/shipmentTracking/index.vue'),
    meta: { menuKey: 'shipment-tracking', title: '运输跟踪' }
  },
  {
    path: 'logistics-warehouse/inventory',
    name: 'Inventory',
    component: () => import('../../views/logisticsWarehouse/inventory/index.vue'),
    meta: { menuKey: 'inventory', title: '库存管理' }
  }
];
