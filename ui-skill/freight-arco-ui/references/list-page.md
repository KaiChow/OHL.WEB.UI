# List Page

## Required Structure

Use this order:

1. Optional transport/page segment: `zone-l1-transport`
2. Search/filter: `zone-l2-filter-card zone-card filter-card`
3. Scope/status/actions: `zone-l3-action zone-card zone-card--stack`
4. Table card: `zone-l4-table-card`
5. Table cap inside table card: right-side pagination/settings; total count is owned by pagination
6. Table body: `table-wrap`

Do not add a page-level title/description band for operational list pages.

The list page must feel like a freight operation workbench: search, scope/status, actions, table, and pagination should support quick repeated handling.

This structure is fixed; the fields are not. Each list must map columns and filters from the current business object.

## Search Area

- Use `filter-card`, `filter-grid`, `filter-field`, `filter-field__label`.
- Query button is primary.
- Reset is text, no icon.
- More filters are inline expansion, not modal.
- Advanced filters are grouped by business meaning, not random field order.
- Do not show a separate “selected filters” strip. Current values are visible in controls/tabs.
- Basic filters should be the 3-6 highest-frequency query fields for the object.
- Advanced filters can be numerous, but must be grouped by business meaning and hidden behind inline expansion.
- Do not copy order search fields into finance, warehouse, or customer pages.

## Filter Count Tiers

Choose the search UI by field count and user job. Do not use one query layout for every page.

| Query field count | Pattern | Use when | Interaction |
|-------------------|---------|----------|-------------|
| 0-3 | Tier 0 keyword/search bar | Users mainly locate by one identifier or keyword | Single dominant input, optional one select, primary query |
| 4-8 | Tier 1 standard filter row | All fields are high-frequency and fit without wrapping | Always visible, one row or compact two-row grid |
| 9-16 | Tier 2 expandable filter card | Few high-frequency fields plus secondary filters | 3-6 fields visible; secondary fields inline expand/collapse |
| 17-50 | Tier 3 grouped advanced filter panel/drawer | Many fields across business groups | Keep top query visible; advanced area grouped by business meaning with local clear/apply |
| 50+ | Tier 4 saved query workspace | Power users need reusable query schemes | Quick search + saved filters + grouped advanced editor; never show all fields at once |

Rules:

- The first viewport must show the table after the default search area on common desktop sizes.
- Do not use a modal dialog for frequent advanced search; it interrupts scan-and-adjust work.
- Do not show 50 fields as a flat form wall.
- Put active query state in the controls, transport/status tabs, and selected values; do not add a separate selected-filter strip.
- Text inputs trigger by Enter or Query button; selects and chips may auto-search when safe.
- Query and reset actions stay in a stable location when advanced filters open or close.
- For international freight pages, field examples should use domain identifiers such as order no, business no, HBL, MBL, container no, customer, port, and warehouse no.

## Filter Typography

- Filter label: F4 12px/500, `color-text-2`.
- Entered/selected value: F1/F2 13px/500, `color-text-1`.
- Placeholder: F5 11px/400, `color-text-3`.
- This visual difference is required; it separates field name, real query value, and guidance.
- Placeholder copy must explain accepted input, not replace the label.

## Toolbar

Order operations by business priority:

1. Main action: create/new/submit, `primary`.
2. Secondary direct actions: export/print/batch, `outline`.
3. Low-frequency actions: `More` dropdown.
4. Utility actions: refresh/settings/density, right side icon-only `text` + tooltip.

Refresh is a utility, not the first business operation.

Do not split equivalent operations to far left and far right. Use one coherent toolbar: business actions first, utilities grouped to the right only when they are truly utilities.

Toolbar actions are chosen by workflow:

- Create/submit/confirm when the page creates or moves business state.
- Export/print/import when the page has reporting or document output.
- Batch action only when multi-selection exists and the operation is safe or confirmed.
- Refresh/settings/density/columns are utilities, not business actions.

## Table Cap And Pagination

- Pagination belongs in `table-card-cap` at the top-right of the table card.
- Total count is shown by the pagination component (`show-total`) when needed.
- Do not repeat the same total as a separate left-side `共 N 条` summary when pagination already shows it.
- Column settings, density, and other table-only utilities live beside pagination, not in the business action group.
- The left side of `table-card-cap` should stay empty unless it adds non-duplicated context such as selected-row feedback or a real grouped-table title.
- Do not use table cap for page titles, instructions, KPI summaries, or duplicated status counts.

## Status Tabs

- Scope tabs and status tabs may share a row, but must have visual separation.
- Active state uses Arco primary tokens and no native black focus border.
- Count badges use semantic tokens only when they carry risk/attention.
- Use status tabs only when users actually filter by that state many times per day.
- Do not create fake status tabs just to fill the layout.

## Table Column Selection

Use this order:

1. Selection/sequence if needed.
2. Primary identity column.
3. Key status column.
4. Decision fields users scan first.
5. Operational fields users act on.
6. Secondary metadata.
7. File/action columns.

Object examples:

- Shipment/order: 业务单号, 状态, 客户, 业务员, 起运港, 目的港, ETD, ETA, 柜量, HBL, MBL.
- Customer: 客户名称, 客户状态, 类型, 负责人, 等级/信用, 最近跟进, 联系人, 来源.
- Finance bill: 账单号, 确认状态, 往来单位, 币种, 金额, 已开票/已核销, 到期日, 业务单号.
- Warehouse: 入仓单号, 状态, 仓库, 客户, SKU/品名, 件数, 重量, 体积, 入仓时间.

These examples are not templates. Use them to choose equivalent identity/status/decision fields for the current module.

## Dense Layout

- Keep row/card gaps predictable: 8-12px.
- Do not compress search labels into controls.
- Keep table as the dominant screen area.

## Common Mistakes

- All buttons exposed at once.
- Pagination at bottom or mixed with unrelated toolbar actions.
- Duplicating total count in both table cap and pagination.
- Gray search/tool/table bands with no primary anchor.
- Tabs squeezed into the same visual weight as action buttons.
- Repeating the same scope/status filter in multiple rows.
- Combining unrelated business fields into one table column just to reduce columns.
- Reusing another module's table columns because the layout looks similar.
