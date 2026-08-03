# List Page

> Class names and `--dense-*` tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

## Select The List Archetype First

Do not copy a workbench frame onto every table. Query complexity and operation complexity are separate decisions: a page can have several query fields but still be a simple lookup page, while a workbench can have a compact daily query row and many operational actions.

Every list `pageSpec.ts` declares exactly one matching pair:

| Archetype / profile | User job | Query and command surface | Table top | Forbidden cargo |
|---|---|---|---|---|
| `list-query` / `simple-query` | Find, inspect, print, or occasionally export a record | `S1` inline query by default. No command row unless an actual non-row action exists. | None by default. Use a utility cap only for real pagination, column preference, or refresh ownership. | Work scope, status queues, batch selection, synthetic primary action, and an empty cap. |
| `list-management` / `management` | Maintain master data: create, edit, activate, import/export | Compact query plus a compact command group only when mutations/output actually exist. One primary create action at most. | Optional utility cap; it owns pagination and table preferences, never business create/import actions. | Operational ownership scope, workflow queues, or batch selection without a real batch action. |
| `list-workbench` / `operations-workbench` | Repeatedly prioritize, assign, progress, and recover operational records | Query, real daily business commands, and only the scope/queues the operator uses to process work. | Context cap required when it owns refresh, selection context, pagination, density, or columns. | A dashboard title band, decorative KPI strip, duplicated totals, or hidden daily queues/actions. |

## Standard List Frame V1

Every list page declares `frame: 'standard-list-v1'`. This is the shared UI/UX frame, not a CSS class and not a visual theme to be copied by hand. Arco/GI owns the controls and surfaces; VXE owns the main grid; profile-specific business content fills the fixed roles below.

| Zone | Shared UI rule | UX rule |
|---|---|---|
| Query | One top query surface using Arco Form/Grid at `small` density. One primary `查询`; reset and advanced entry are text tools. | Query, Enter, reset, and advanced apply have stable placement and reset page to 1. No empty filter bar. |
| Command | Zero or one compact business-command group below query. One primary action at most in this scope. | Only real create/output/batch contracts appear. Low-frequency or risky work enters `More` and confirmation. |
| Scope / queue | Optional, but when present it follows the command group after a separator. Scope and queue use different native controls. | A switch changes one query dimension, clears selection when results can change, and updates counts/table together. |
| Table context | Optional utility cap for query/management; required context cap for workbench. It is neutral and table-owned. | Refresh, selection feedback, pagination, density, and column preferences preserve query context. Never put business commands here. |
| Data | One dominant VXE grid with the global `mini`, bordered, striped baseline. | Identity, state, decision data, and row actions stay in the same column order and behavior across lists. |
| Feedback | Empty, loading, permission, error, and partial batch feedback live with the owning query/table surface. | Conditions and current result context survive a recoverable failure. |

Non-negotiable visual invariants:

- GI is the only palette; no page-local control, card, tab, or table skin. Use one primary action per scope, neutral structural surfaces, and semantic status pills.
- The zone order never changes: query -> business commands -> scope/queue -> table context -> data. An absent zone disappears; it is never replaced by blank decoration.
- Spacing, control density, typography, table header, row behavior, icon-only utility rules, focus treatment, and overflow ownership come from the shared Arco/VXE contracts. A page may not create a different list "style" to appear distinctive.
- Differences between pages are limited to business fields, available actions, statuses, columns, and the declared query scenario. They do not justify another toolbar hierarchy, colored header, bespoke table wrapper, or a second filter layout language.

No page-level title/description band is added to operational lists. Search, command, scope, and status are logical zones, not mandatory cards. They may share one Arco command surface only when ownership stays clear, neutral separators distinguish different jobs, the combined height passes `existing-project-modernization.md`, and the table remains dominant.

## Operations Workbench Required Structure

For `list-workbench`, use this logical order:

1. Optional page-mode segment using an Arco segmented or tab control.
2. Query row using Arco Form, Grid, Input/Select and Button.
3. Business actions and only the real ownership/status queue controls.
4. Dominant data surface containing table context, pagination/settings, and the main-list `vxe-table`.

Each list maps its columns and filters from the current business object. Never add a queue, scope, tool, or cap merely because another list has one.

## Operational Workbench Priority

Freight list pages are production tools for sales, operators, and coordinators. They are not marketing dashboards and not read-only analytics pages.

Priority:

1. Keep daily business data visible.
2. Keep high-frequency search/status/action paths short.
3. Keep long-session visual comfort through neutral surfaces and low noise.
4. Add visual beauty only when it improves scanning, confidence, or error prevention.

The first-viewport threshold, surface count, command budget, and measurement method are owned by `existing-project-modernization.md`.

Daily status tabs and daily reversible actions should stay visible when operators use them repeatedly. Hiding them behind "More" only to look cleaner is a PESDP failure.

## Page Segment

Add a page segment only when it changes the page mode, such as transport mode, order class, warehouse mode, or bill type.

This is not a status filter. It is a compact segmented control:

- Prefer the matching Arco control and its native active state.
- Do not create custom segment classes until an Arco gap is documented and reuse is proven.
- Do not confuse page mode with row status filtering.

## Search Area

- Use an Arco Form/Grid composition. Exact class names in examples are local implementation details unless grep proves a shared definition exists.
- `list-query` starts with `S1` and a stable one-row query path. A control or advanced drawer requires a demonstrated repeated query need; it is not visual furniture.
- `list-management` follows the field-count scenario in `filter-layout.md`; use S2/S3 only when the maintenance job really needs those conditions.
- `list-workbench` follows the same field-count scenario, then keeps its daily scope/queue controls outside the query form because they answer a different question.
- Query button is primary.
- Reset is text at normal release widths; compact desktop may use a refresh/reset icon-only tool with Tooltip and business-specific `aria-label`.
- Select S1/S2/S3 from `filter-layout.md`. Regular Narrow fields may expand in-page; occasional Investigate fields use an advanced-filter drawer. Do not choose a surface from visual preference alone.

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
- Reset uses `type="text"`; compact desktop may replace its visible label with a familiar reset icon when the accessible name and Tooltip remain.
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

- Arco Form labels and controls keep GI native `size="small"` typography and interaction states.
- Hand-written business labels/helpers use the project field/aux typography tokens; they must not override Arco internals.
- Placeholder copy explains accepted input and never replaces the visible field label.
- Do not vary font size per filter to solve width pressure; rebalance columns or move lower-frequency fields instead.

## Toolbar

### Presence Decision

Before rendering a toolbar, classify each candidate action by user job and real contract:

| List profile | Direct actions | Selection / batch | Utility ownership |
|---|---|---|---|
| `simple-query` | None by default. A real export/print may sit beside query actions or in a compact command group. | Never. | Table cap only when it gives a concrete table capability. |
| `management` | Create plus daily low-risk maintenance/output actions. Low-frequency or risky actions go to `More`. | Only when a declared batch feature contract changes selected records. | Pagination, refresh, density, and columns stay table-owned. |
| `operations-workbench` | One primary next action plus daily reversible workflow commands. | Use only with selection feedback, clear, pending state, result/error recovery, and an actual batch contract. | Always table-owned; keep separate from business commands. |

No action is rendered simply to make a toolbar look complete. If the page has no creation, export, mutation, or table utility contract, render query plus table and preserve the vertical space for data.

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

### Table-Top Decision

The strip directly above a VXE table is a data-context surface, not a second toolbar.

| Situation | Table top |
|---|---|
| Simple query, no pagination/table preferences beyond defaults | Omit it. The table begins directly below the query surface. |
| Simple query or management list needs pagination, refresh, column preference, or density | Use one compact utility cap. Keep business actions outside it. |
| Workbench needs selection context, current sort/context, pagination, refresh, density, or columns | Use the context cap. Left is refresh plus non-duplicated selection/context; right is pagination and utility tools. |
| Only one icon would occupy the strip | Omit the cap and place the utility beside the relevant query/command owner. |

Never place `新建`, `导入`, `导出`, `批量处理`, or row workflow verbs in a table cap. They act on business workflow, not the table frame.

- Pagination belongs in `table-card-cap` at the top-right of the table card when the cap is already part of the table structure. For compact pages without a meaningful cap, use `toolbar-pager` in `toolbar-aside` so pagination remains visible without adding an empty horizontal band.
- Total count is shown by the pagination component (`show-total`) when needed.
- Do not repeat the same total as a separate left-side `共 N 条` summary when pagination already shows it.
- Refresh lives at the left edge of `table-card-cap` when a meaningful cap exists, because it is a high-frequency table action that should stay close to the table header. Column settings, density, and pagination live on the cap right; otherwise keep table tools as right-side toolbar utilities.
- Do not render an empty `table-card-cap` between the toolbar and table header. If it only contains one or two utility icons and no pagination/context, it creates a dead horizontal band and should be removed.
- The left side of `table-card-cap` should stay empty unless it adds non-duplicated context such as selected-row feedback or a real grouped-table title.
- Do not use table cap for page titles, instructions, KPI summaries, or duplicated status counts.

## Status Tabs

### View Switch Decision

Do not make every switch a Tab. Page mode, ownership scope, workflow queue, and saved query answer different questions and need different controls.

| Switch type | Direct-item boundary | Control | State and request behavior |
|---|---|---|---|
| Page mode, `2-5` mutually exclusive modes | `2-5` | Arco segmented for compact modes; line Tabs when the mode also changes the data schema or table columns | Mode change resets page and selection. Preserve only filters documented as compatible with both modes; otherwise clear incompatible values with visible feedback. |
| Page mode, `6+` modes | `6+` | Arco Select; do not create a second wrapping tab row | Selected mode stays visible in the trigger. Changing it follows the same page/selection/filter compatibility rule. |
| Ownership scope, `2-3` choices | `2-3` | Button-style Radio Group or Select when labels are long | Changes the working set, resets page and selection, updates queue counts and table together. It is not a status Tab. |
| Daily workflow status, `2-8` short queues | `2-8` | Arco line Tabs with optional semantic count | Active queue is visible, keyboard reachable, and changes only the queue dimension while preserving ordinary query conditions. |
| Daily workflow status, `9-12` short queues | `9-12` | Same line Tabs in one horizontal local-scroll owner | Never wrap into a second row or create browser-level horizontal overflow. Preserve the active Tab in view after switch. |
| Statuses that are long, rare, or `13+` | `13+` | Arco Select, grouped saved query, or a documented secondary filter | Do not turn a long status catalogue into a scrollable tab strip. |

- Page mode changes the data model or table meaning. Status changes the workflow queue inside the current model. Ownership scope changes whose records are shown. Do not combine them into one visually identical control group.
- One list has at most one visible page-mode control and one visible workflow queue control. If both are justified, separate them with stable spacing/divider and keep the query row independent.
- Counts belong on status queues only when they help prioritization. A count is not a KPI and must update with the same request/result as the table.
- A tab is a query control, never a mutation trigger. It must have an explicit selected default, visible focus, keyboard traversal, loading/stale-response protection, and an empty state specific to the selected view.

- Scope tabs and status tabs may share a row, but must have visual separation.
- Active state and focus use the native Arco control behavior; do not override internal tab/radio selectors.
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
- Do not add a scope control when the data has no ownership split. Do not duplicate the same mine/all choice in visible filters and the workflow row unless each surface has a distinct purpose.

## Interaction Closure By List Type

- Query: Enter and the primary query action submit the same current condition set. Query, reset, and advanced apply reset pagination to the first page; reset clears every visible and hidden condition. A failed query preserves conditions and the current result context.
- Table utilities: refresh reloads only the table data; density and columns preserve current query, page, and selection unless the business contract states otherwise. Pagination changes the displayed page without silently changing filters or status scope.
- Selection: render checkbox selection only when an available batch operation consumes it. While rows are selected, expose selected count and clear in the table context; after a batch attempt, keep failed rows selected and return local recovery feedback.
- Management and workbench mutations: every action has visibility, enablement, pending lock, success feedback, failure preservation, refresh ownership, and risk confirmation where applicable. A disabled placeholder is not an implemented action.
- Queues and ownership: use them only when they change the working set. A change resets pagination and selection, updates the table and counts together, and preserves unrelated query values.

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
- On table-dominant production workbenches, the default search + toolbar + status area must pass the command-surface and first-viewport gates in `existing-project-modernization.md`.
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

## Release Gate

- [ ] First viewport exposes object identity, key state/queue, next decision data, and one clear primary action per scope.
- [ ] Query, reset, scope/status, selection, pagination, total count, table utilities, and feedback each have one visible owner.
- [ ] The command surface passes the rendered height budget and the table remains dominant at 1366x768 and 1024x768.
- [ ] Compact controls do not wrap or overlap; status and table overflow stay local rather than creating browser-level overflow.
- [ ] Loading, no rows, no match, permission, network/slow, long text, extreme value, and partial batch failure are reproducible and recoverable.
- [ ] Keyboard order reaches query, workflow controls, table utilities, row actions, pagination, and opened overlays with named controls and visible focus.
