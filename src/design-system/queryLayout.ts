import type { PesdpQueryFieldWidthRole } from './pesdpPageSpec';

export type QueryGridItemRole = PesdpQueryFieldWidthRole | 'actions' | 'actions-wide' | 'actions-expanded';

export const QUERY_GRID_ITEM_SPANS: Record<QueryGridItemRole, number> = {
  compact: 3,
  standard: 4,
  wide: 6,
  composite: 6,
  range: 6,
  batch: 8,
  actions: 5,
  'actions-wide': 9,
  'actions-expanded': 10,
};

export const getQueryGridTrackCount = (containerWidth: number) => {
  if (containerWidth >= 1600) return 32;
  if (containerWidth >= 1040) return 28;
  return 24;
};
