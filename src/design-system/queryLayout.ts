import type { PesdpQueryFieldWidthRole } from './pesdpPageSpec';

export type QueryGridItemRole = PesdpQueryFieldWidthRole | 'actions' | 'actions-wide' | 'actions-expanded';

export const QUERY_GRID_TRACKS_PER_UNIT = 4;
export const QUERY_GRID_MIN_TRACKS = 24;
export const QUERY_GRID_MAX_PAGE_ROWS = 2;

// Business names remain stable, but every ordinary field now maps to one equal
// logical unit; composite/range/batch fields use two units.
export const QUERY_GRID_UNIT_SPANS: Record<QueryGridItemRole, number> = {
  compact: 1,
  standard: 1,
  wide: 2,
  composite: 2,
  range: 2,
  batch: 2,
  actions: 2,
  'actions-wide': 3,
  'actions-expanded': 3,
};

export const QUERY_GRID_ITEM_SPANS: Record<QueryGridItemRole, number> = {
  compact: QUERY_GRID_UNIT_SPANS.compact * QUERY_GRID_TRACKS_PER_UNIT,
  standard: QUERY_GRID_UNIT_SPANS.standard * QUERY_GRID_TRACKS_PER_UNIT,
  wide: QUERY_GRID_UNIT_SPANS.wide * QUERY_GRID_TRACKS_PER_UNIT,
  composite: QUERY_GRID_UNIT_SPANS.composite * QUERY_GRID_TRACKS_PER_UNIT,
  range: QUERY_GRID_UNIT_SPANS.range * QUERY_GRID_TRACKS_PER_UNIT,
  batch: QUERY_GRID_UNIT_SPANS.batch * QUERY_GRID_TRACKS_PER_UNIT,
  actions: QUERY_GRID_UNIT_SPANS.actions * QUERY_GRID_TRACKS_PER_UNIT,
  'actions-wide': QUERY_GRID_UNIT_SPANS['actions-wide'] * QUERY_GRID_TRACKS_PER_UNIT,
  'actions-expanded': QUERY_GRID_UNIT_SPANS['actions-expanded'] * QUERY_GRID_TRACKS_PER_UNIT,
};

export const getQueryGridTrackCount = (containerWidth: number) => {
  if (containerWidth >= 1600) return 40;
  // The standard workbench query path is 7 logical units (batch + 3 standard fields + actions).
  // Keep 32 physical tracks until the actual query surface is genuinely narrow; using the
  // viewport threshold here made a roughly 1000px content area wrap its primary action early.
  if (containerWidth >= 960) return 32;
  return QUERY_GRID_MIN_TRACKS;
};

export const getQueryGridUnitCount = (containerWidth: number) => getQueryGridTrackCount(containerWidth) / QUERY_GRID_TRACKS_PER_UNIT;
