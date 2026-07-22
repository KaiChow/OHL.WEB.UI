# List Page

## Required Structure

Use this logical order:

1. Optional page-mode segment using an Arco segmented or tab control.
2. Query row using Arco Form, Grid, Input/Select and Button.
3. Business actions and scope/status queue controls.
4. Dominant data surface containing table context, pagination/settings, and `vxe-table.workbench-table`.

Search and scope/status/actions are logical zones, not mandatory separate floating cards. They may share one Arco workbench command surface when their ownership remains clear, a neutral divider separates the rows, the combined height passes the command-surface budget in `redesign-calibration.md`, and no card is nested inside another card. The table remains its own dominant surface.

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

The first-viewport threshold, surface count, shell budget, and measurement method are owned by `redesign-calibration.md`.

Daily status tabs and daily reversible actions should stay visible when operators use them repeatedly. Hiding them behind "More" only to look cleaner is a PESDP failure.

## Page Segment

Add a page segment only when it changes the page mode, such as transport mode, order class, warehouse mode, or bill type.

This is not a status filter. It is a compact segmented control:

- Prefer the matching Arco control and its native active state.
- Do not create custom segment classes until an Arco gap is documented and reuse is proven.
- Do not confuse page mode with row status filtering.

## Search Area

- Use an Arco Form/Grid composition. Exact class names in examples are local implementation details unless grep proves a shared definition exists.
- Query button is primary.
- Reset is text, no icon.
- Low-frequency filters use the right-side `query-filter-drawer` by default. Inline expansion is an exception only when allowed by `filter-layout.md`.

### Filter Actions Recipe

The visible query row uses one primary query button, one text reset button, and one text filter-entry button when a drawer exists. Keep them in one stable command group.

```vue
<a-space :size="8">
  <a-button
    size="small"
    type="primary"
    title="查询"
    @click="handleSearch"
  >
    <template #icon><icon-search /></template>
    查询
  </a-button>
  <a-button
    size="small"
    type="text"
    title="重置"
    @click="handleReset"
  >重置</a-button>
  <a-button
    size="small"
    type="text"
    title="更多筛选"
    @click="advancedFilterVisible = true"
  >
    <template #icon><icon-filter /></template>筛选
  </a-button>
</a-space>
```

Rules:

- All three controls use the same Arco `size` and align to the same baseline; do not hand-set a second control skin.
- Query uses `type="primary"` plus search icon.
- Reset uses `type="text"` without an unnecessary icon.
- More filters uses `type="text"` plus filter icon and opens the advanced filter drawer.
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
- Query and reset actions stay in a stable location in the visible query row.
- Follow the S1/S2/S3 interaction selection from `filter-layout.md`; do not combine inline expansion and a drawer on the same page.
- Two visible rows are allowed only for the S1 daily-filter case defined in `filter-layout.md`.
- 30+/40+ filters use grouped/wide drawer patterns. 50+ filters use a saved query workspace, not a larger drawer.
- Query actions must be internationalization-safe. Do not size them by Chinese labels; use min/max or `clamp()`, allow 1.3-2x text expansion, and give secondary actions tooltip/title/aria labels when text may ellipsize.
- If secondary query actions cannot fit translated text, use icon + accessible label or move the actions to a horizontal command row. Do not silently clip action meaning.
- For international freight pages, field examples should use domain identifiers such as order no, business no, HBL, MBL, container no, customer, port, and warehouse no.
- Combined keyword filters such as `field type + keyword` are allowed only when they reduce repeated identifier inputs. Use Arco Input Group with one bounded selector, one flexible input, one control size, and one clear label such as `单号检索`. Do not place unrelated query fields into one visual field.
- A combined keyword filter must list related identifiers only, such as 业务单号 / 业务编号 / HBL / MBL / 柜号. Do not mix unrelated filters such as customer, staff, port, date, and status into the same combo.

## Filter Typography

- Filter label: F4 12px/500, `color-text-2`.
- Entered/selected value: F4 Control 12px/500, `color-text-1`.
- Placeholder: F4 Control 12px/400, `color-text-3`.
- Size must stay consistent across label, value, and placeholder. Use color and weight, not mixed font sizes, to separate field name, real query value, and guidance.
- Do not let Arco default 14px form text leak into the search form.
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
- Batch business actions stay with the left workflow command group, usually as `批量操作↓`; do not isolate them in the utility area.
- Column settings, density, pagination, refresh, and other table-only utilities belong in the table surface. Use the Arco Card title/extra slots when a meaningful cap exists; do not create an empty band for one icon.
- When row selection is active, place `已选 N 条` and `清空` in the table context area. Keep total count in pagination `show-total`; do not repeat it.
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
- At the `1366x768` release gate, status controls remain in the compact command path. At the supported `1024x768` split-window bound they scroll inside their own region before adding another full-width row; see `responsive.md`.

## Operational Work Scope

When records are repeatedly divided by ownership as well as workflow state, expose a compact work-scope control in the same workflow row.

- Scope answers **whose/which working set**: for example all active records vs records owned by the current operator.
- Status answers **which workflow queue** inside that scope. Scope and status are separate query dimensions and must not be styled as one undifferentiated tab strip.
- Use an Arco button-style Radio Group, Select, or another native compact single-choice control. Annotate the role with a stable hook such as `data-workbench-scope` when automated evidence is required.
- Scope change updates status counts, pagination, selection, empty-state copy, and table context together.
- Default scope must be explicit and persistent when the business defines a personal default; do not silently filter to “mine” while the visible control says all.
- The workflow row keeps the order `business actions -> work scope -> status queues`; each role has a visible separator or spacing boundary.
- Do not add a scope control when the data has no ownership split. Do not duplicate the same mine/all choice in saved-query schemes, visible filters, and the workflow row unless each surface has a distinct persistence purpose.

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
- On table-dominant production workbenches, the default search + toolbar + status area must pass the command-surface and first-viewport gates in `redesign-calibration.md`.
- Operational list pages keep a small viewport-bottom breathing space through the page root or app content shell.
- Do not solve bottom breathing space with table padding, fake rows, footer margins, or unexplained inner-table gaps.
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
