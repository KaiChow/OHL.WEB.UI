import { QUERY_GRID_ITEM_SPANS } from '@/design-system/queryLayout';
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

  const usedTracks = queryFieldTrackUsage(pageFields, options);
  const defaultTracks = queryFieldTrackUsage(defaults.pageFields, options);
  if (!pageFields.length || usedTracks <= 0 || defaultTracks <= 0) {
    return {
      pageFields: [...defaults.pageFields],
      drawerFields: [...defaults.drawerFields],
    };
  }

  return { pageFields, drawerFields };
};

export const queryFieldTrackUsage = (fields: string[], options: QueryFieldPreferenceOption[]) => {
  const optionByField = new Map(options.map((option) => [option.field, option]));
  return fields.reduce((total, field) => {
    const option = optionByField.get(field);
    return total + (option ? QUERY_GRID_ITEM_SPANS[option.width] : 0);
  }, 0);
};
