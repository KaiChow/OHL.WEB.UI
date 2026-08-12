import { QUERY_GRID_UNIT_SPANS } from '@/design-system/queryLayout';
import type { PesdpQueryFieldWidthRole } from '@/design-system/pesdpPageSpec';

export interface QueryFieldPreferenceOption {
  field: string;
  label: string;
  width: PesdpQueryFieldWidthRole;
  requiredPage?: boolean;
  orderLocked?: boolean;
}

export interface QueryFieldPlacement {
  pageFields: string[];
  drawerFields: string[];
}

export const normalizeQueryFieldPlacement = (
  value: Partial<QueryFieldPlacement>,
  options: QueryFieldPreferenceOption[],
  defaults: QueryFieldPlacement,
): QueryFieldPlacement => {
  const available = new Set(options.map((option) => option.field));
  const required = options.filter((option) => option.requiredPage).map((option) => option.field);
  const pageFields = Array.from(new Set([...required, ...(value.pageFields ?? [])]))
    .filter((field) => available.has(field));
  const pageSet = new Set(pageFields);
  const drawerFields = Array.from(new Set(value.drawerFields ?? []))
    .filter((field) => available.has(field) && !pageSet.has(field));

  options.forEach((option) => {
    if (!pageSet.has(option.field) && !drawerFields.includes(option.field)) drawerFields.push(option.field);
  });

  const usedUnits = queryFieldUnitUsage(pageFields, options);
  const defaultUnits = queryFieldUnitUsage(defaults.pageFields, options);
  if (!pageFields.length || usedUnits <= 0 || defaultUnits <= 0) {
    return {
      pageFields: [...defaults.pageFields],
      drawerFields: [...defaults.drawerFields],
    };
  }

  return { pageFields, drawerFields };
};

export const queryFieldUnitUsage = (fields: string[], options: QueryFieldPreferenceOption[]) => {
  const optionByField = new Map(options.map((option) => [option.field, option]));
  return fields.reduce((total, field) => {
    const option = optionByField.get(field);
    return total + (option ? QUERY_GRID_UNIT_SPANS[option.width] : 0);
  }, 0);
};

export const queryFieldRows = (
  fields: string[],
  options: QueryFieldPreferenceOption[],
  gridUnits: number,
  actionUnits: number,
) => {
  const optionByField = new Map(options.map((option) => [option.field, option]));
  const spans = fields.map((field) => optionByField.get(field)).filter(Boolean)
    .map((option) => QUERY_GRID_UNIT_SPANS[option!.width]);
  let rows = 1;
  let used = 0;
  spans.concat(actionUnits).forEach((span) => {
    if (used > 0 && used + span > gridUnits) {
      rows += 1;
      used = 0;
    }
    used += span;
  });
  return rows;
};

export const queryFieldFitsWithinRows = (
  fields: string[],
  options: QueryFieldPreferenceOption[],
  gridUnits: number,
  actionUnits: number,
  maxRows: number,
) => queryFieldRows(fields, options, gridUnits, actionUnits) <= maxRows;
