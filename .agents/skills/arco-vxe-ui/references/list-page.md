# List Page

> Class names and `--dense-*` tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

## Select The List Archetype First

Do not copy a workbench frame onto every table. Query complexity and operation complexity are separate decisions: a page can have several query fields but still be a simple lookup page, while a workbench can have a compact daily query row and many operational actions.

Every list `pageSpec.ts` declares exactly one matching pair:

| Archetype / profile | User job | Query and command surface | Table top | Forbidden cargo |
|---|---|---|---|---|
| `list-query` / `simple-query` | Find, inspect, print, or occasionally export a record | `S1` inline query by default. No command row unless an actual non-row action exists. | None by default. Use a utility cap only for real pagination, column preference, or refresh ownership. | Work scope, status queues, batch selection, synthetic primary action, and an empty cap. |
| `list-management` / `management` | Maintain master data: create, edit, activate, import/export | Compact query plus a compact command group only when mutations/output actually exist. One primary create action at most. | Optional utility cap; it owns pagination and table preferences, never business create/import actions. | Operational ownership scope, workflow queues, or batch selection without a real batch action. |
| `list-workbench` / `operations-workbench` | Repeatedly prioritize, assign, progress, and recover operational records | Query plus only the scope/queues the operator uses to process work; business commands belong to the result-owned table toolbar. | Workbench toolbar required for applicable business commands, refresh, selection context, pagination, density, or columns. | A dashboard title band, decorative KPI strip, duplicated totals, hidden daily queues/actions, or mutation commands mixed into the state selector. |

## Standard List Frame V1

Every list page declares `frame: 'standard-list-v1'`. This is the shared UI/UX frame, not a CSS class and not a visual theme to be copied by hand. Arco/GI owns the controls and surfaces; VXE owns the main grid; profile-specific business content fills the fixed roles below.

| Zone | Shared UI rule | UX rule |
|---|---|---|
| Query | One top query surface using Arco Form/Grid at `small` density. One primary `查询`; reset and advanced entry are text tools. | Query, Enter, reset, and advanced apply have stable placement and reset page to 1. No empty filter bar. |
| Scope / queue | Optional mutation-free result selector below query. Scope and queue use different native controls and may share this state row. | A switch changes one query dimension, clears selection when results can change, and updates counts/table together. |
| Table toolbar | Optional utility cap for query/management; required workbench toolbar for operational pages. One primary action at most in this scope. | Left owns real create/output/batch contracts and selection context; right owns refresh, pagination, density, and column preferences. Low-frequency or risky work enters `More` and confirmation. |
| Data | One dominant VXE grid with the global `mini`, bordered, striped baseline. | Identity, state, decision data, and row actions stay in the same column order and behavior across lists. |
| Feedback | Empty, loading, permission, error, and partial batch feedback live with the owning query/table surface. | Conditions and current result context survive a recoverable failure. |

Non-negotiable visual invariants:

- GI is the only palette; no page-local control, card, tab, or table skin. Use one primary action per scope, neutral structural surfaces, and semantic status pills.
- The zone order never changes: query -> scope/queue -> table toolbar -> data. An absent zone disappears; it is never replaced by blank decoration.
- Spacing, control density, typography, table header, row behavior, icon-only utility rules, focus treatment, and overflow ownership come from the shared Arco/VXE contracts. A page may not create a different list "style" to appear distinctive.
- Differences between pages are limited to business fields, available actions, statuses, columns, and the declared query scenario. They do not justify another toolbar hierarchy, colored header, bespoke table wrapper, or a second filter layout language.

No page-level title/description band is added to operational lists. Query, scope/state, and table toolbar are logical zones, not mandatory cards. Scope and workflow state may share one mutation-free row; business commands stay in the result-owned table toolbar so selection and side effects cannot be mistaken for filters.

## Operations Workbench Required Structure

For `list-workbench`, use this logical order:

1. Optional page-mode segment using an Arco segmented or tab control.
2. Query row using Arco Form, Grid, Input/Select and Button.
3. Only the real ownership/status queue controls in a mutation-free state row.
4. Dominant data surface containing the table toolbar, business commands, selection context, pagination/settings, and the main-list `vxe-table`.

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

Do not split equivalent operations to far left and far right. Use one result-owned toolbar: business actions first on the left, utilities grouped to the right only when they are truly utilities.

Toolbar actions are chosen by workflow:

- Create/submit/confirm when the page creates or moves business state.
- Export/print/import when the page has reporting or document output.
- Batch action only when multi-selection exists and the operation is safe or confirmed.
- A frequent batch command remains discoverable in a stable toolbar position and uses disabled plus a reason until the selection is eligible. Only rare selection-only commands may appear contextually, and then they belong to a dedicated selection context that does not move stable commands.
- Refresh/settings/density/columns are utilities, not business actions.
- Create, output, and batch business actions stay in the left table-command group, usually with batch work as `批量操作↓`; do not isolate them in the utility area or mix them into the state row.
- Column settings, density, pagination, refresh, and other table-only utilities belong on the right of the same table surface. Use the Arco Card title/extra slots when a meaningful toolbar exists; do not create an empty band for one icon.
- When row selection is active, place `已选 N 条` and `清空` once in the table context area beside the batch commands. Batch trigger labels stay action-only (`批量处理` / `批量操作`) and never append the selected count. Keep result total count in pagination `show-total`; do not repeat either count elsewhere.
- For high-frequency production pages, 5-7 visible toolbar commands are acceptable when they are grouped, neutral, and do not wrap. The rule is not "few buttons"; the rule is "one primary, clear grouping, no color noise, no line wrap."

## Table Toolbar And Pagination

### Table-Top Decision

The strip directly above a VXE table is a data-context surface, not a second toolbar.

| Situation | Table top |
|---|---|
| Simple query, no pagination/table preferences beyond defaults | Omit it. The table begins directly below the query surface. |
| Simple query or management list needs pagination, refresh, column preference, or density | Use one compact utility cap. Keep page-global actions outside it; table-owned create/export may enter only when they act on this result surface. |
| Workbench needs business commands, selection context, pagination, refresh, density, or columns | Use the workbench toolbar. Left is business commands plus non-duplicated selection context; right is pagination and utility tools. |
| Only one icon would occupy the strip | Omit the cap and place the utility beside the relevant query/command owner. |

Never place row-specific workflow verbs in the table toolbar; they belong in the row operation column or detail. Table-owned `新建`, `导入`, `导出`, and `批量处理` belong in the left command group when they act on the listed object, filtered result, or current selection.

- Pagination belongs in `table-card-cap` at the top-right of the table card when the cap is already part of the table structure. For compact pages without a meaningful cap, use `toolbar-pager` in `toolbar-aside` so pagination remains visible without adding an empty horizontal band.
- Total count is shown by the pagination component (`show-total`) when needed.
- Do not repeat the same total as a separate left-side `共 N 条` summary when pagination already shows it.
- Refresh, column settings, density, and pagination live on the right utility group; business commands and selected-row context live on the left. Preserve this ownership as labels collapse or commands enter overflow.
- Do not render an empty `table-card-cap` between the toolbar and table header. If it only contains one or two utility icons and no pagination/context, it creates a dead horizontal band and should be removed.
- The left side of a query/management utility cap stays empty unless it adds non-duplicated context. The left side of a workbench toolbar owns applicable business commands and selected-row feedback.
- Do not use table cap for page titles, instructions, KPI summaries, or duplicated status counts.

## Workflow State Selection

### Name The Decision Before Choosing The Control

Do not call every single-choice switch a Tab. First classify what changes, then select the control and its layer.

| Selection role | What it changes | Preferred control | Default placement |
|---|---|---|---|
| Page mode | Business object, information architecture, form vocabulary, table schema, or columns | Arco Segmented for `2-5` compact modes; line Tabs when each mode owns a real panel/schema; Select for `6+` | Above the query surface or directly below page identity. It may own different compatible filters. |
| Ownership scope | Whose/which working set is shown, such as all active records vs my records | Button-style Radio Group for `2-3` short choices; Select for long labels or more choices | In the workflow row, before workflow state. It is neither page navigation nor a status Tab. |
| Workflow state or processing queue | Which high-frequency state slice of the same business object and same table schema is shown | Arco line Tabs for `2-8` short choices; the same native line Tabs with local overflow for `9-12`; Select or grouped saved query for long, rare, or `13+` choices | After query and before the table, normally in the workflow row or a dedicated state row closest to the table. |
| Ordinary status condition | One of many low-frequency query conditions | Select, Cascader, Tree Select, or documented filter control | Inside the query surface. Do not create a second navigation-looking band. |
| Saved view | A named reusable bundle of query, sort, columns, and possibly scope | Select or a documented saved-view control | Near query ownership; do not visually merge it with a single status dimension. |

`Tabs` in `pageSpec.ts` describes presentation only. The business contract remains **workflow state selection**: it filters a result set and never mutates records.

### Single And Multiple Choice Rules

- Zero applicable choices: render no control and reclaim the space.
- One effective choice: do not render an interactive selector. If the fixed state is necessary context, show it once as non-interactive context near the result owner.
- `2-8` short, daily choices: line Tabs keep all frequent states directly reachable.
- `9-12` short, daily choices: line Tabs may remain when direct switching is materially faster; Arco owns the native local overflow and keeps the active choice visible. Never wrap the choices into another row.
- Long, rare, or `13+` choices: use Select, grouped saved views, or a secondary filter. Search/group the catalogue when recognition is insufficient.
- Counts are optional prioritization metadata, not decoration. Show them only when users use the value to choose work; update counts and table from the same result contract.

### Relationship To Query And Actions

The stable vertical order is `page mode -> query -> ownership/workflow state -> table toolbar -> table`. A workflow-state selector stays below query because it is an applied result dimension; moving it above query incorrectly promotes it to page navigation. Put it above query only when the switch really changes page mode, object/schema, or available query vocabulary.

In an operations workbench, the workflow-state row is mutation-free. It may contain ownership scope, workflow state, and saved-view selection, but never `新增`, `提交`, `导入`, `导出`, `批量处理`, or row workflow verbs. Those commands belong to the result-owned table toolbar directly below the state row, with business commands on the left and table utilities on the right. This keeps the user's mental model explicit: first choose the working set, then act on it.

A workflow state and command may share a physical row only as a documented lightweight exception: there are no create/batch/mutation commands, at most two neutral non-mutating utilities, the selector keeps a clearly separate flexible region, and the layout passes `1024x768` plus `200%` without clipping or wrapping. Passing the width check does not justify merging the visual groups when their roles remain ambiguous.

Use a dedicated state row when queue comparison is a daily job, counts help prioritization, labels are numerous/long, or any combined row would compress the active choice. A dedicated row is a hierarchy decision, not permission to add a decorative card, title, or duplicate total.

For a simple query/management list, keep a low-frequency status inside the query form. Do not add a workflow row merely to imitate an operations workbench.

### Interaction Contract

- State change resets pagination and incompatible selection, preserves ordinary query conditions and ownership scope, and refreshes state counts and rows together.
- Requests expose loading without hiding the selected state. Ignore stale responses when users switch rapidly; failures preserve the previous usable result and identify retry ownership.
- Every state has an explicit selected default and a state-specific empty result. Reset restores the documented default, not an implicit first option.
- Active state, focus, keyboard traversal, and overflow use native Arco behavior. Pages do not override internal Tab/Radio selectors or implement scrolling through DOM-class hacks.
- Count badges use neutral tokens by default. Warning/danger tokens are reserved for attention or risk semantics; selection remains the dominant state when active.
- A visible group label is conditional, not mandatory. Omit it when option text and row/divider structure already make the group self-explanatory; keep the control's business-specific accessible name. Show it when labels are ambiguous, adjacent selectors could be confused, or the group question is necessary context. A Divider never replaces an accessible name.
- One list has at most one visible page-mode control, one ownership-scope control, and one workflow-state control. Do not duplicate the same dimension in visible query fields and the workflow row.
- At the `1366x768` release gate, the workflow path stays compact and unwrapped. At `1024x768`, labels may reduce and state choices overflow only inside their native region before the layout adds a dedicated row; see `responsive.md`.

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
