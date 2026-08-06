import type { PesdpQueryFieldWidthRole } from '@/design-system/pesdpPageSpec';
import type { QueryFieldPlacement } from '@/design-system/queryFieldPreferences';
import type { ShipmentOrderQuery } from '@/views/shipment/orderWorkbench/types';

export type ShipmentQueryField = Exclude<keyof ShipmentOrderQuery, 'keywordType'>;
export type ShipmentQueryFieldGroup = 'routeDocuments' | 'schedule' | 'risk';

export interface ShipmentQueryFieldDefinition {
  field: ShipmentQueryField;
  labelKey: string;
  width: PesdpQueryFieldWidthRole;
  group: ShipmentQueryFieldGroup;
  requiredPage?: boolean;
  orderLocked?: boolean;
}

export const SHIPMENT_QUERY_FIELDS: ShipmentQueryFieldDefinition[] = [
  { field: 'keyword', labelKey: 'shipment.queryFields.keyword', width: 'batch', group: 'routeDocuments', requiredPage: true, orderLocked: true },
  { field: 'businessType', labelKey: 'shipment.queryFields.businessType', width: 'compact', group: 'routeDocuments' },
  { field: 'customerName', labelKey: 'shipment.queryFields.customerName', width: 'standard', group: 'routeDocuments' },
  { field: 'operator', labelKey: 'shipment.queryFields.operator', width: 'compact', group: 'routeDocuments' },
  { field: 'pol', labelKey: 'shipment.queryFields.pol', width: 'standard', group: 'routeDocuments' },
  { field: 'pod', labelKey: 'shipment.queryFields.pod', width: 'standard', group: 'routeDocuments' },
  { field: 'carrier', labelKey: 'shipment.queryFields.carrier', width: 'standard', group: 'routeDocuments' },
  { field: 'vesselVoyage', labelKey: 'shipment.queryFields.vesselVoyage', width: 'wide', group: 'routeDocuments' },
  { field: 'blNo', labelKey: 'shipment.queryFields.blNo', width: 'standard', group: 'routeDocuments' },
  { field: 'bookingNo', labelKey: 'shipment.queryFields.bookingNo', width: 'standard', group: 'routeDocuments' },
  { field: 'etdRange', labelKey: 'shipment.queryFields.etdRange', width: 'range', group: 'schedule' },
  { field: 'closingRange', labelKey: 'shipment.queryFields.closingRange', width: 'range', group: 'schedule' },
  { field: 'updatedRange', labelKey: 'shipment.queryFields.updatedRange', width: 'range', group: 'schedule' },
  { field: 'orderStatus', labelKey: 'shipment.queryFields.orderStatus', width: 'standard', group: 'risk' },
  { field: 'hasException', labelKey: 'shipment.queryFields.hasException', width: 'wide', group: 'risk' },
  { field: 'isOverdue', labelKey: 'shipment.queryFields.isOverdue', width: 'wide', group: 'risk' },
  { field: 'fileStatus', labelKey: 'shipment.queryFields.fileStatus', width: 'standard', group: 'risk' },
  { field: 'feeStatus', labelKey: 'shipment.queryFields.feeStatus', width: 'standard', group: 'risk' },
];

export const DEFAULT_QUERY_FIELD_PLACEMENT: QueryFieldPlacement = {
  pageFields: ['keyword', 'businessType', 'customerName'],
  drawerFields: SHIPMENT_QUERY_FIELDS
    .map((definition) => definition.field)
    .filter((field) => !['keyword', 'businessType', 'customerName'].includes(field)),
};

export const QUERY_FIELD_GROUPS: ShipmentQueryFieldGroup[] = ['routeDocuments', 'schedule', 'risk'];

export const isQueryFieldActive = (query: ShipmentOrderQuery, field: ShipmentQueryField) => {
  const value = query[field];
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
};

export const clearQueryFields = (
  target: ShipmentOrderQuery,
  fields: ShipmentQueryField[],
  defaults: ShipmentOrderQuery,
) => {
  fields.forEach((field) => {
    const value = defaults[field];
    if (Array.isArray(value)) {
      (target[field] as string[]) = [...value];
      return;
    }
    (target[field] as string | undefined) = value as string | undefined;
  });
};

export const queryFieldSnapshot = (query: ShipmentOrderQuery, fields: ShipmentQueryField[]) => fields.map((field) => {
  const value = query[field];
  return [field, Array.isArray(value) ? [...value] : typeof value === 'string' ? value.trim() : value];
});
