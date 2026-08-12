import type { Component } from 'vue';

export const ROW_ACTION_MAX_VISIBLE_ENTRIES = 3;
export const ROW_ACTION_DIRECT_ENTRIES_WITH_OVERFLOW = 2;
export const ROW_ACTION_COLUMN_WIDTH = 104;

export interface WorkbenchRowAction {
  key: string;
  label: string;
  icon: Component;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  overflow?: boolean;
}

export interface WorkbenchRowActionPartition {
  direct: WorkbenchRowAction[];
  overflow: WorkbenchRowAction[];
}

export function partitionWorkbenchRowActions(actions: WorkbenchRowAction[]): WorkbenchRowActionPartition {
  const needsOverflow = actions.length > ROW_ACTION_MAX_VISIBLE_ENTRIES
    || actions.some((action) => action.danger || action.overflow);

  if (!needsOverflow) return { direct: actions, overflow: [] };

  const direct: WorkbenchRowAction[] = [];
  const overflow: WorkbenchRowAction[] = [];
  actions.forEach((action) => {
    if (
      !action.danger
      && !action.overflow
      && direct.length < ROW_ACTION_DIRECT_ENTRIES_WITH_OVERFLOW
    ) {
      direct.push(action);
      return;
    }
    overflow.push(action);
  });

  return { direct, overflow };
}
