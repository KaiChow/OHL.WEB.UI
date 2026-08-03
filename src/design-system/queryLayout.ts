import type { PesdpQueryFieldWidthRole } from './pesdpPageSpec';

export type QueryGridItemRole = PesdpQueryFieldWidthRole | 'actions' | 'actions-wide';

export const QUERY_GRID_COLUMN_PROPS: Record<QueryGridItemRole, {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}> = {
  compact: { xs: 24, sm: 12, md: 3, lg: 3, xl: 3 },
  standard: { xs: 24, sm: 12, md: 4, lg: 4, xl: 4 },
  wide: { xs: 24, sm: 24, md: 6, lg: 6, xl: 6 },
  composite: { xs: 24, sm: 24, md: 6, lg: 6, xl: 6 },
  range: { xs: 24, sm: 24, md: 6, lg: 6, xl: 6 },
  actions: { xs: 24, sm: 24, md: 5, lg: 5, xl: 5 },
  'actions-wide': { xs: 24, sm: 24, md: 6, lg: 6, xl: 6 },
};
