# List Page

## Required Structure

Use this order:

1. Optional transport/page segment: `zone-l1-transport`
2. Search/filter: `zone-l2-filter-card zone-card filter-card`
3. Scope/status/actions: `zone-l3-action zone-card zone-card--stack`
4. Table card: `zone-l4-table-card`
5. Table cap inside table card: left summary, right pagination/settings
6. Table body: `table-wrap`

Do not add a page-level title/description band for operational list pages.

The list page must feel like a freight operation workbench: search, scope/status, actions, table, and pagination should support quick repeated handling.

## Search Area

- Use `filter-card`, `filter-grid`, `filter-field`, `filter-field__label`.
- Query button is primary.
- Reset is text, no icon.
- More filters are inline expansion, not modal.
- Advanced filters are grouped by business meaning, not random field order.
- Do not show a separate “selected filters” strip. Current values are visible in controls/tabs.

## Toolbar

Order operations by business priority:

1. Main action: create/new/submit, `primary`.
2. Secondary direct actions: export/print/batch, `outline`.
3. Low-frequency actions: `More` dropdown.
4. Utility actions: refresh/settings/density, right side icon-only `text` + tooltip.

Refresh is a utility, not the first business operation.

Do not split equivalent operations to far left and far right. Use one coherent toolbar: business actions first, utilities grouped to the right only when they are truly utilities.

## Status Tabs

- Scope tabs and status tabs may share a row, but must have visual separation.
- Active state uses Arco primary tokens and no native black focus border.
- Count badges use semantic tokens only when they carry risk/attention.

## Dense Layout

- Keep row/card gaps predictable: 8-12px.
- Do not compress search labels into controls.
- Keep table as the dominant screen area.

## Common Mistakes

- All buttons exposed at once.
- Pagination at bottom or mixed with unrelated toolbar actions.
- Gray search/tool/table bands with no primary anchor.
- Tabs squeezed into the same visual weight as action buttons.
- Repeating the same scope/status filter in multiple rows.
- Combining unrelated business fields into one table column just to reduce columns.
