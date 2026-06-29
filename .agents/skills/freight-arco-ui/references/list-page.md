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

## Operational Workbench Priority

Freight list pages are production tools for sales, operators, and coordinators. They are not marketing dashboards and not read-only analytics pages.

Priority:

1. Keep daily business data visible.
2. Keep high-frequency search/status/action paths short.
3. Keep long-session visual comfort through neutral surfaces and low noise.
4. Add visual beauty only when it improves scanning, confidence, or error prevention.

For data-dominant workbench pages, the first viewport should normally allocate 70-80% of usable page space to the data area. The practical target is 75% data space after the default search/action/status area. This number is not a rigid rule for drawers, editing pages, or exception review flows.

Daily status tabs and daily reversible actions should stay visible when operators use them repeatedly. Hiding them behind "More" only to look cleaner is a PESDP failure.

## Zone Boundary

List zones use one neutral module boundary rhythm. `zone-l1-transport`, `zone-l2-filter-card`, `zone-l3-action`, and `zone-l4-table-card` all use `border-top: 1px solid var(--dense-zone-top-border)`.

Do not use primary-colored top borders to decorate normal modules. Arco primary belongs to active page segments, primary actions, links, focus/selection, status pills, and table header anchors. If a module needs more hierarchy, improve structure, spacing, or local title/action grouping before adding colored container lines.

## Page Segment

Use `zone-l1-transport` only when the segment changes the page mode, such as transport mode, order class, warehouse mode, or bill type.

This is not a status filter. It is a compact segmented control:

- Container: `zone-l1-transport zone-card`.
- Item: `seg-btn`; active item: `seg-btn--active`.
- Active state uses a white input-like surface, Arco-primary border/inset rhythm, and a thin bottom anchor.
- Do not use `.stab` for L1 page segments. `.stab` is for scope/status filters inside the action row.
- Do not use a naked underline tab here; the app route/nav may already use underline active state, and a second underline makes the current page state ambiguous.

## Search Area

- Use `filter-card`, `filter-grid`, `filter-field`, `filter-field__label`.
- Query button is primary.
- Reset is text, no icon.
- Low-frequency filters use the right-side `query-filter-drawer` by default. Inline expansion is an exception only when allowed by `filter-layout.md`.

### Filter Actions Recipe

The visible query row uses `filter-card__inline-actions`: one primary query button, one text reset button, and one text filter-entry button when a drawer exists. The controls must feel like a single command surface, not loose floating elements.

```vue
<div class="filter-card__inline-actions">
  <a-button
    size="small"
    type="primary"
    class="filter-card__query-btn"
    title="查询"
    @click="handleSearch"
  >
    <template #icon><icon-search /></template>
    查询
  </a-button>
  <a-button
    size="small"
    type="text"
    class="reset-btn"
    title="重置"
    @click="handleReset"
  >重置</a-button>
  <a-button
    size="small"
    type="text"
    class="reset-btn"
    title="更多筛选"
    @click="advancedFilterVisible = true"
  >
    <template #icon><icon-filter /></template>筛选
  </a-button>
</div>
```

Rules:

- All three controls: `height: var(--dense-control-h-filter)` (32px), `font-size: 12px`. Do not use `height: auto` or `min-height: 24px` on reset or expand — they must match query button height.
- Query: `type="primary"` + icon + `class="filter-card__query-btn"`.
- Reset: `type="text"` + `class="reset-btn"` (transparent bg, `color-text-2`, hover tints primary-1).
- More filters: `type="text"` + `class="reset-btn"` + filter icon, opens `query-filter-drawer`.
- Advanced filters are grouped by business meaning inside the drawer, not random field order.
- Do not show a separate “selected filters” strip. Current values are visible in controls/tabs.
- Basic filters should be the 3-6 highest-frequency query fields for the object.
- Advanced filters can be numerous, but must be grouped by business meaning and hidden behind the drawer.
- Main list query fields should stay in a flat grid by default. Do not add visible group titles or grouped panels inside the query card unless the query count reaches Tier 3 and the user explicitly needs grouped advanced editing.
- Do not copy order search fields into finance, warehouse, or customer pages.

## Filter Count Tiers

**Authoritative:** field count → Tier → DOM structure is defined in **`filter-layout.md`** (Query Count Decision Matrix + Visible layout structure). Do not duplicate that matrix here.

List-page rules that stay in this file:

- The first viewport must show the table after the default search area on common desktop sizes.
- Do not use a modal dialog for frequent advanced search; it interrupts scan-and-adjust work.
- Do not show 50 fields as a flat form wall.
- Put active query state in the controls, transport/status tabs, and selected values; do not add a separate selected-filter strip.
- Text inputs trigger by Enter or Query button; selects and chips may auto-search when safe.
- Query and reset actions stay in a stable location in the visible query row or `inline-actions--matrix`.
- **S2** pages use `filter-card__advanced` + `filter-expand-link` (see `filter-layout.md` § Three Query UI Scenarios). **S3** pages use `query-filter-drawer` — do not use both expand and drawer on the same page.
- Two visible rows (6–10 daily fields, S1): `filter-card--two-row` + `filter-card__matrix` + `filter-grid` + `inline-actions--matrix` — see `filter-layout.md`.
- 30+/40+ filters use grouped/wide drawer patterns. 50+ filters use a saved query workspace, not a larger drawer.
- Query actions must be internationalization-safe. Do not size them by Chinese labels; use min/max or `clamp()`, allow 1.3-2x text expansion, and give secondary actions tooltip/title/aria labels when text may ellipsize.
- If secondary query actions cannot fit translated text, use icon + accessible label or move the actions to a horizontal command row. Do not silently clip action meaning.
- For international freight pages, field examples should use domain identifiers such as order no, business no, HBL, MBL, container no, customer, port, and warehouse no.
- Combined keyword filters such as `field type + keyword` are allowed only when they reduce repeated identifier inputs. Use the shared `filter-combo` structure: one fixed-width selector, one flexible input, same 32px height, continuous border, and one clear label such as `单号检索`. Do not place multiple independent query fields into one visual field.
- A combined keyword filter must list related identifiers only, such as 业务单号 / 业务编号 / HBL / MBL / 柜号. Do not mix unrelated filters such as customer, staff, port, date, and status into the same combo.

## Filter Typography

- Filter label: F4 12px/500, `color-text-2`.
- Entered/selected value: F4 Control 12px/500, `color-text-1`.
- Placeholder: F4 Control 12px/400, `color-text-3`.
- Size must stay consistent across label, value, and placeholder. Use color and weight, not mixed font sizes, to separate field name, real query value, and guidance.
- Do not let Arco default 14px form text or a 13px table-data token leak into the search form.
- Placeholder copy must explain accepted input, not replace the label.

## Toolbar

Order operations by business priority:

1. Main action: create/new/submit, `primary`.
2. Daily reversible workflow actions: direct `secondary` or `outline` buttons, grouped with dividers/dropdowns when needed.
3. Output/batch groups: visible dropdown triggers when used daily.
4. Low-frequency, risky, or maintenance actions: `More` dropdown.
5. Utility actions: refresh/settings/density, right side icon-only `text` + tooltip. Table-only tools may move into `table-card-cap` only when that cap already carries pagination or non-repeated table context.

Refresh is a utility, not the first business operation.

Do not split equivalent operations to far left and far right. Use one coherent toolbar: business actions first, utilities grouped to the right only when they are truly utilities.

Toolbar actions are chosen by workflow:

- Create/submit/confirm when the page creates or moves business state.
- Export/print/import when the page has reporting or document output.
- Batch action only when multi-selection exists and the operation is safe or confirmed.
- Refresh/settings/density/columns are utilities, not business actions.
- Batch business actions belong with the left `toolbar-group` workflow buttons, usually as `批量操作↓`; do not isolate them in the right utility area.
- Column settings, density, pagination, refresh, and other table-only utilities can sit in `toolbar-aside` for compact pages. When a meaningful `table-card-cap` exists, put refresh at `table-card-cap__start` before selection feedback, and keep pagination/settings/density in `table-card-cap__right`; do not create an otherwise empty cap just for a tool icon or pagination.
- When row selection is active and a meaningful `table-card-cap` exists, put selected-row feedback in `table-card-cap__start`: `toolbar-selection-context` (`已选 N 条` + `清空`). Keep total count in pagination `show-total`; do not repeat `共 N 条` on the cap left.
- For high-frequency production pages, 5-7 visible toolbar commands are acceptable when they are grouped, neutral, and do not wrap. The rule is not "few buttons"; the rule is "one primary, clear grouping, no color noise, no line wrap."

## Table Cap And Pagination

- Pagination belongs in `table-card-cap` at the top-right of the table card when the cap is already part of the table structure. For compact pages without a meaningful cap, use `toolbar-pager` in `toolbar-aside` so pagination remains visible without adding an empty horizontal band.
- Total count is shown by the pagination component (`show-total`) when needed.
- Do not repeat the same total as a separate left-side `共 N 条` summary when pagination already shows it.
- Refresh lives at the left edge of `table-card-cap` when a meaningful cap exists, because it is a high-frequency table action that should stay close to the table header. Column settings, density, and pagination live on the cap right; otherwise keep table tools as right-side toolbar utilities.
- Do not render an empty `table-card-cap` between the toolbar and table header. If it only contains one or two utility icons and no pagination/context, it creates a dead horizontal band and should be removed.
- The left side of `table-card-cap` should stay empty unless it adds non-duplicated context such as selected-row feedback or a real grouped-table title.
- Do not use table cap for page titles, instructions, KPI summaries, or duplicated status counts.

## Status Tabs

- Scope tabs and status tabs may share a row, but must have visual separation.
- Active state uses Arco primary tokens and no native black focus border.
- Count badges use semantic tokens only when they carry risk/attention.
- Use status tabs only when users actually filter by that state many times per day.
- If sales/operators process the list by state every day, status tabs are required visible workflow controls, not optional decoration.
- Do not create fake status tabs just to fill the layout.
- Small-screen behavior follows `responsive.md`: below `1280px`, status groups may move to a second row and must scroll inside `stat-tab-group` rather than forcing page-level horizontal overflow.

## Table Column Selection

Use this order:

1. Selection/sequence if needed.
2. Primary identity column.
3. Key status column.
4. Decision fields users scan first.
5. Operational fields users act on.
6. Secondary metadata.
7. File/action columns.

Object examples. These examples are slot-filling references, not table templates:

- Shipment/order: 业务单号, 状态, 客户, 业务员, 起运港, 目的港, ETD, ETA, 柜量, HBL, MBL.
- Customer: 客户名称, 客户状态, 类型, 负责人, 等级/信用, 最近跟进, 联系人, 来源.
- Finance bill: 账单号, 确认状态, 往来单位, 币种, 金额, 已开票/已核销, 到期日, 业务单号.
- Warehouse: 入仓单号, 状态, 仓库, 客户, SKU/品名, 件数, 重量, 体积, 入仓时间.

Use them to choose equivalent identity, status, next-decision, and supporting fields for the current module. Do not copy a row from this list as a universal column standard.

## Dense Layout

- Keep row/card gaps predictable: 8-12px.
- Do not compress search labels into controls.
- Keep table as the dominant screen area.
- On table-dominant production workbenches, the default search + toolbar + status area should not become a form wall. It should leave the table visible in the first viewport and target 70-80% data ownership.
- Operational list pages must keep a small viewport bottom breathing space, usually 8-10px from `page-root--dense` bottom padding.
- The bottom breathing space is a global list-page contract: `page-root--dense` uses `padding-bottom: var(--dense-page-bottom-space)`. Do not solve it per page with table padding, fake rows, footer margins, or page-scoped overrides.
- The table card should flex to fill available space, but it must not visually touch the browser or app viewport bottom when scrolled to the last row.
- Do not create this bottom breathing space by adding fake blank table rows or unexplained inner table gaps. It belongs to the page/layout container.

## Common Mistakes

- Hiding daily workflow buttons or status tabs only to look minimal.
- All buttons exposed with the same blue/outline weight.
- Pagination at bottom or mixed with unrelated toolbar actions.
- Duplicating total count in both table cap and pagination.
- Gray search/tool/table bands with no primary anchor.
- Tabs squeezed into the same visual weight as action buttons.
- Repeating the same scope/status filter in multiple rows.
- Combining unrelated business fields into one table column just to reduce columns.
- Reusing another module's table columns because the layout looks similar.
