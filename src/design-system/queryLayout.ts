import type { PesdpQueryFieldWidthRole } from './pesdpPageSpec';

export type QueryGridItemRole = PesdpQueryFieldWidthRole | 'actions' | 'actions-wide';

export const QUERY_GRID_ITEM_SPANS: Record<QueryGridItemRole, number> = {
  compact: 3,
  standard: 4,
  wide: 6,
  composite: 6,
  range: 6,
  actions: 5,
  'actions-wide': 8,
};

export const getQueryGridTrackCount = (containerWidth: number) => {
  if (containerWidth >= 1840) return 36;
  if (containerWidth >= 1600) return 32;
  return 24;
};
