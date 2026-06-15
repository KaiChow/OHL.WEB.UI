import type { SaleOrderRecord } from '../../../mock/saleOrders';

export type TransportType = 'sea' | 'air' | 'rail';
export type ScopeFilter = 'all' | 'mine' | 'permission';
export type PhaseFilter = 'all' | 'pending' | 'processing' | 'done' | 'exception';
export type QuickSearchField =
  | 'DcgNo'
  | 'OrderNo'
  | 'WarehouseNo'
  | 'SoNo'
  | 'ContainerNoStr'
  | 'MblNo'
  | 'HblNo'
  | 'FbaNo'
  | 'Po'
  | 'ExtraNo'
  | 'ExtraOrderNo';

export type SaleOrderListColumnKey =
  | 'SubmitTime'
  | 'DcgNo'
  | 'FollowState'
  | 'CargoTypes'
  | 'BusinessTypeStr'
  | 'OrderNo'
  | 'WarehouseNo'
  | 'CustomerName'
  | 'Salesman'
  | 'Shipper'
  | 'Consignees'
  | 'LoaddingPortEn'
  | 'DeliveryPortEn'
  | 'Etd'
  | 'Eta'
  | 'BargeEtd'
  | 'ShipCompany'
  | 'ShipCompanyAndVoyno'
  | 'RouteName'
  | 'OrderTypeStr'
  | 'ServiceItemStr'
  | 'ServiceScopeStr'
  | 'SourceStr'
  | 'LoaddingTypeStr'
  | 'ContainerDataJson'
  | 'ContainerNoStr'
  | 'HblNo'
  | 'MblNo'
  | 'DownFile'
  | 'Operation';

export interface SaleOrderListColumn {
  title: string;
  field: SaleOrderListColumnKey;
  width: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export type SaleOrderRow = SaleOrderRecord;

export interface AdvancedFieldConfig {
  label: string;
  key: string;
  type?: 'input' | 'select' | 'dateRange' | 'checkbox' | 'textarea';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  span?: 1 | 2;
}

export interface AdvancedFieldGroup {
  title: string;
  columns?: 1 | 2 | 3 | 4;
  fields: AdvancedFieldConfig[];
}
