import type { PesdpQueryFieldWidthRole } from '@/design-system/pesdpPageSpec';
import type { QueryFieldPlacement } from '@/design-system/queryFieldPreferences';
import type { ExportOrderQuery } from '@/views/uiAcceptance/exportOrderList/types';

export type ExportQueryField = keyof ExportOrderQuery;
export type ExportQueryFieldGroup = 'statusOwnership' | 'routeSchedule' | 'timeRisk';

export interface ExportQueryFieldDefinition {
  field: ExportQueryField;
  labelKey: string;
  width: PesdpQueryFieldWidthRole;
  group: ExportQueryFieldGroup;
  requiredPage?: boolean;
  orderLocked?: boolean;
}

export const EXPORT_QUERY_FIELDS: ExportQueryFieldDefinition[] = [
  { field: 'keyword', labelKey: 'exportOrderList.queryFields.keyword', width: 'batch', group: 'statusOwnership', requiredPage: true, orderLocked: true },
  { field: 'customerName', labelKey: 'exportOrderList.queryFields.customerName', width: 'standard', group: 'statusOwnership' },
  { field: 'pol', labelKey: 'exportOrderList.queryFields.pol', width: 'standard', group: 'routeSchedule' },
  { field: 'pod', labelKey: 'exportOrderList.queryFields.pod', width: 'standard', group: 'routeSchedule' },
  { field: 'orderStatus', labelKey: 'exportOrderList.queryFields.orderStatus', width: 'standard', group: 'statusOwnership' },
  { field: 'exceptionStatus', labelKey: 'exportOrderList.queryFields.exceptionStatus', width: 'standard', group: 'statusOwnership' },
  { field: 'fileStatus', labelKey: 'exportOrderList.queryFields.fileStatus', width: 'compact', group: 'statusOwnership' },
  { field: 'feeStatus', labelKey: 'exportOrderList.queryFields.feeStatus', width: 'compact', group: 'statusOwnership' },
  { field: 'businessType', labelKey: 'exportOrderList.queryFields.businessType', width: 'compact', group: 'statusOwnership' },
  { field: 'operator', labelKey: 'exportOrderList.queryFields.operator', width: 'standard', group: 'statusOwnership' },
  { field: 'carrier', labelKey: 'exportOrderList.queryFields.carrier', width: 'standard', group: 'routeSchedule' },
  { field: 'vesselVoyage', labelKey: 'exportOrderList.queryFields.vesselVoyage', width: 'wide', group: 'routeSchedule' },
  { field: 'etdRange', labelKey: 'exportOrderList.queryFields.etdRange', width: 'range', group: 'routeSchedule' },
  { field: 'closingRange', labelKey: 'exportOrderList.queryFields.closingRange', width: 'range', group: 'routeSchedule' },
  { field: 'createdRange', labelKey: 'exportOrderList.queryFields.createdRange', width: 'range', group: 'timeRisk' },
  { field: 'updatedRange', labelKey: 'exportOrderList.queryFields.updatedRange', width: 'range', group: 'timeRisk' },
  { field: 'hasException', labelKey: 'exportOrderList.queryFields.hasException', width: 'wide', group: 'timeRisk' },
  { field: 'isOverdue', labelKey: 'exportOrderList.queryFields.isOverdue', width: 'wide', group: 'timeRisk' },
];

const PAGE_FIELD_KEYS: ExportQueryField[] = ['keyword', 'customerName', 'pol', 'pod'];

export const DEFAULT_QUERY_FIELD_PLACEMENT: QueryFieldPlacement = {
  pageFields: [...PAGE_FIELD_KEYS],
  drawerFields: EXPORT_QUERY_FIELDS
    .map((definition) => definition.field)
    .filter((field) => !PAGE_FIELD_KEYS.includes(field)),
};

export const QUERY_FIELD_GROUPS: ExportQueryFieldGroup[] = ['statusOwnership', 'routeSchedule', 'timeRisk'];

export const isQueryFieldActive = (query: ExportOrderQuery, field: ExportQueryField) => {
  const value = query[field];
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
};

export const clearQueryFields = (
  target: ExportOrderQuery,
  fields: ExportQueryField[],
  defaults: ExportOrderQuery,
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

export const queryFieldSnapshot = (query: ExportOrderQuery, fields: ExportQueryField[]) => fields.map((field) => {
  const value = query[field];
  return [field, Array.isArray(value) ? [...value] : typeof value === 'string' ? value.trim() : value];
});
