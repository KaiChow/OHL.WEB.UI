# VXE Table

## Table Types

Choose the table type before designing columns.

| Type | Use for | Density | Notes |
|------|---------|---------|-------|
| Workbench table | Main list page records | High | Largest area on page; supports filters, status tabs, pagination |
| Detail line table | Lines inside a detail module | Compact | Belongs to the nearest module/child entity |
| Editable line table | Detail rows with inputs | Compact but readable | Input controls must not clip vertically |
| File table | Attachments/documents | Compact | File status and actions are mandatory |
| Summary table | Read-only small totals | Very compact | No heavy borders, no action column unless needed |

## Unified Table Surface

List workbench tables and detail nested tables must read as **one VXE design system**, not two different grids.

| Layer | Token / class | List (`workbench-table`) | Detail (`detail-mini-vxe`) |
|-------|----------------|--------------------------|----------------------------|
| Header background | `--dense-table-header-bg` | 32px near-white brand-neutral header | 32px near-white brand-neutral header |
| Header column border | `--dense-table-col-border` | off or near-invisible by default | off or near-invisible by default |
| Body column/row border | `--dense-table-col-border` / `--dense-table-row-border` | vertical weak/off, horizontal weak | vertical weak/off, horizontal weak |
| Row hover | `--dense-vxe-surface-hover-bg` | `--dense-row-h` / 36px row | role-based row token |
| Row checked | `--dense-vxe-surface-checked-bg` | yes | yes |
| Left accent on hover | `inset 2px 0 0 --dense-primary-4` | yes | yes |
| Overflow tooltip | `show-overflow="title"` | required | **forbidden** |

Shared rules:

- Every operational VXE table must use either `class="compact workbench-table"` (main list) or `class="detail-mini-vxe"` (detail module child table). Do not leave tables on bare `.vxe-table` global defaults for production pages.
- Header uses brand-neutral `--dense-table-header-bg` on both list and detail. Do not use gray sheet fill or blue gradients for normal table headers.
- Hover/selection always use `--dense-vxe-surface-hover-bg` / `--dense-vxe-surface-checked-bg`, never the same value as the header background.
- Data rows are the main working surface and should read white by default. Zebra stripes are optional and should normally be `#FFFFFF` or visually indistinguishable from white on dense freight workbenches.
- Do not add `border-bottom` on `vxe-table--header-wrapper`; structure vs data is separated by brand-neutral header contrast and weak row separators.
- Do not let column borders dominate. Workbench tables default to horizontal scan rhythm; vertical separators are disabled or near-invisible unless the page documents a finance comparison exception.
- Detail-only differences: role-based row height, ghost Arco controls for editable rows, padding on `.vxe-cell` not on `td`, no `show-overflow`, no checkbox without batch toolbar.
- Sequence columns are structural rhythm, not page-specific layout. Use the same project width for list and detail sequence columns: `width="52"` unless there is a documented module exception.

## Required Setup

```vue
<vxe-table
  border="none"
  size="small"
  class="compact workbench-table"
  height="100%"
  show-overflow="title"
  :row-config="{ isHover: true, keyField: 'Id', height: 36 }"
>
</vxe-table>
```

Use VXE for data grids. A native table is allowed only for a very small static layout table with no sorting, selection, fixed column, virtualization, or resizing needs.

Use `workbench-table` only for the primary list table of an operational page. Do not use it for nested detail tables, mini tables, summary tables, or file tables.

## Row Height Standard

Main workbench tables must be compact enough for all-day operation, but not compressed.

| Table type | Header | Body row | Rule |
|------------|--------|----------|------|
| Workbench compact list | 32px | 36px | Default for order, customer, finance, warehouse, and operation lists |
| Workbench standard list | 36px | 48px | Only for low-frequency review pages or rows with two-line cells |
| Detail editable line table | 32px | 38px | Use when row cells render `a-input`, `a-select`, `a-input-number`, date picker, or inline row editing |
| Detail readonly line table | 32px | 34px | Use for documents, file status, timeline-like records, read-only child rows |
| Summary/read-only mini table | 28-32px | 32px | Use for compact totals, short read-only facts, no operation column unless necessary |

Rules:

- Project default tokens are `--dense-header-h: 32px` and `--dense-row-h: 36px`.
- Detail editable row token is `--dense-row-h-detail-edit: 38px`; this is intentionally 2px taller than the main list because it hosts 28px Arco controls.
- Detail readonly row token is `--dense-row-h-detail-read: 34px`; this keeps document/status child rows compact and prevents detail drawers from becoming loose.
- Summary mini row token is `--dense-row-h-summary: 32px`; use it only for short totals or read-only facts, not editable child rows.
- Main list VXE tables use `class="compact"` unless the page has a documented reason to use `standard`.
- Do not use 40px as the default workbench row height; it reduces first-screen data density.
- VXE `size="small"` defaults to a 40px row variable. A compact table must override `--vxe-ui-table-row-height-small` and set `row-config.height = 36`; changing only `.vxe-body--row` is not enough.
- `detail-mini-vxe--editable` must set `row-config.height = 38`.
- `detail-mini-vxe--readonly` must set `row-config.height = 34`.
- `detail-mini-vxe--summary` must set `row-config.height = 32`.
- CSS-only row height is not enough because VXE virtualization, fixed columns, and scroll calculations use the table config.
- Do not apply editable density to read-only documents, attachments, logs, or status-only rows. Density is chosen by the row job, not by the surrounding drawer.
- Do not push main list rows below 34px; checkbox, status pill, icon actions, and text line-height begin to clip.
- If row content requires more than 36px, first reduce column complexity or move secondary information to detail, then consider `standard`.
- Row height must be paired with readable typography: body F1 13px, header F3 12px.

## Column Rules

### Width policy (mandatory)

Business columns use **`min-width`**, not fixed `width`. Fixed `width` is allowed **only** for structural columns that must not grow:

| Allowed `width` | Examples |
|-----------------|----------|
| `type="checkbox"` | `width="40"` |
| `type="seq"` | `width="52"` project default |
| Operation column | `title="操作"` + `fixed="right"`, `width="56"`–`88` |

Everything else — codes, names, dates, numbers, ports, status pills, file actions, editable inputs — uses **`min-width`** with a starting value from the width table below. VXE distributes extra horizontal space across `min-width` columns so cells are not crushed on wide tables and can scroll on narrow ones.

Rules:

- Do **not** set `width` on business/data columns; use `min-width` instead.
- Do **not** set `width` on every column (structural columns only).
- `min-width` values are **floors**, not caps — columns may grow with available space.
- Fixed left: checkbox, sequence, main identifier when needed (`min-width` + `fixed="left"` is OK).
- Fixed right: operation only (structural `width`).
- Numeric columns align right.
- Status/action columns align center.
- Long text uses ellipsis/title or a two-line cell pattern (`show-overflow="title"` on workbench tables only).
- Do not combine multiple independent business fields into one list column unless the business explicitly requires grouped display.
- Use object identity columns early: code/no/name/status before secondary metadata.
- Put next-decision fields before passive audit fields.
- Do not default to showing every backend field.
- Header labels must be business terms, not database field names.

## Width Rules

Starting **`min-width`** floors (not fixed `width`):

| Column kind | min-width floor |
|-------------|-----------------|
| Sequence | `width="52"` project default (structural only) |
| Checkbox | `width` 40–48 (structural only) |
| Status pill | 84–110 |
| Date | 92–120 |
| DateTime / date-picker | 140–170 |
| Order/document code | 140–180 |
| Customer/company/name text | 160–220 |
| Port/city | 100–140 |
| Numeric amount/qty | 72–110 |
| Enum/select (柜型/单位) | 72–88 |
| Operation | `width` 56–88 (structural only) |

These are starting floors; adjust per module but keep the `min-width` vs `width` policy.

## Cell Patterns

- Main links: `link-text link-text--strong mono`; the primary object identifier should be stronger than secondary links.
- Normal links: `link-text mono`.
- Status: `.s-pill[data-s]`.
- Status pills do not use a leading dot by default. Use `.s-pill--dot` only for timeline/legend-like contexts, not normal table cells.
- Risk attributes may use an icon inside `.s-pill` when the icon has an unambiguous meaning, but must not combine icon and leading dot.
- Attribute/risk columns should use a consistent attribute token pattern, not workflow status pills. All values keep the same baseline and size; risk values may use warning token color/border without an icon-heavy label.
- Table status/attribute tokens in the same visual family must share one size: 20px height, F5 11px text, same padding/radius/line-height. Semantic color may differ; component size must not.
- Two-line cell: `cell-two-line`, `c2-main`, `c2-sub`. Use it only for primary value + its own auxiliary metadata, not for merging two independent fields. Examples of independent pairs: two parties, two locations, two dates, two identifiers.
- Empty value: `—` with weak color.
- Numeric values: tabular numbers and right alignment.
- Units: micro typography after value, not a separate dominant column unless users sort/filter by unit.
- Booleans: use clear text or compact Tag; do not use only color.
- File availability: use file action state; disabled download when no file.
- Primary identifiers, parties, locations, operators, quantities, amounts, dates, and other next-decision values are core business values. Do not style them as helper/disabled text.
- Passive metadata such as submit time, uploader time, and audit time can be one level weaker than object identifiers.

## Row Interaction

- Hover and selected states must cover fixed columns consistently.
- Hover uses primary tint, not gray.
- Selection uses a stronger primary tint.
- Zebra stripes are optional and must remain low contrast. Prefer no visible stripe for dense workbench pages when row separators already provide scan rhythm.
- Do not merge cells for the main list unless the business explicitly requires grouped display.
- Editable row hover must not hide validation borders.
- Fixed left/right shadows must remain subtle and consistent with Arco theme.

## Grid Lines

Table lines are functional separators, not decoration.

- Header must be brand-neutral and calm: `--dense-table-header-bg` on `workbench-table` (no extra `vxe-table--header-wrapper` bottom border).
- Main workbench tables should use `workbench-table` to create the table surface: brand-neutral header, white data rows, `--dense-workbench-hover-bg` on hover, weak horizontal row separators, and primary accent on selection/actions.
- Primary table borders must use project aliases such as `--dense-primary-2/3`; page and skill CSS must not use raw `rgb(var(--primary-*)))` or `border-color: var(--primary-*)` because gi-demo theme values may be RGB channels.
- Keep a subtle 1px header/body separator when it helps scan the table.
- Keep low-contrast row separators for dense data rows.
- Avoid strong primary-colored horizontal lines in the table body or below the header; users read them as focus, current row, or selected state.
- Avoid visible vertical lines. Use column spacing, alignment, numeric right alignment, and header labels first.
- Detail/nested tables should use even lighter separators than workbench tables.
- Selection and hover are the only places where primary tint should visibly span a row.
- When the data count is small and the table has remaining height, the empty area must still read as the same table surface. Use the shared workbench table background treatment, not fake rows, large blank white blocks, or decorative color bands.

## Table Bottom Boundary

The bottom of a workbench table must look intentionally finished.

- The table body and the table wrapper use `color-bg-card` as the base background.
- If horizontal scrolling is present, the scroll area must read as a scrollbar/rail, not as a clipped data row.
- Workbench tables need a subtle bottom boundary so the last visible row does not look cut off.
- Do not leave an unexplained white/gray strip below the last row.
- Do not use a strong colored line at the bottom; it will be read as selection or focus.
- Empty remaining height is acceptable only when it is visually part of the table surface.
- Page-to-viewport bottom spacing is not a table concern. Keep 8-10px page bottom padding on dense list pages so the table card does not stick to the browser edge.
- Do not solve page bottom spacing with table padding or fake rows; that makes the last row look clipped or the data area look broken.

## Column Visibility — Default Columns + Settings

Workbench tables with more than 12 columns **must** define default visible columns and offer a column picker.

**Rules:**
- Default visible: 8–12 columns covering identity, status, key business values, and operation.
- Extra columns: `field`-only columns with `:visible="false"` — appear in picker, hidden by default.
- Do not default to showing every backend field. Use next-decision fields first.
- Column picker button goes in `table-card-cap__right`, `type="text" class="table-card-cap__tool"`.

```vue
<!-- table-card-cap: column settings button -->
<a-tooltip content="列设置">
  <a-button size="small" type="text" class="table-card-cap__tool" @click="xTable?.openCustom()">
    <template #icon><icon-settings /></template>
  </a-button>
</a-tooltip>

<!-- vxe-table setup -->
<vxe-table
  ref="xTable"
  :custom-config="{ storage: true, storageKey: 'module-name-cols' }"
  ...
>
  <!-- default visible -->
  <vxe-column field="orderNo" title="订单编号" min-width="148" />
  <!-- hidden by default, user-restorable -->
  <vxe-column field="weight" title="毛重(kg)" min-width="88" :visible="false" />
</vxe-table>
```

```ts
import type { VxeTableInstance } from 'vxe-table'
const xTable = ref<VxeTableInstance>()
```

## Row Actions

- Use `a-tooltip` + `a-button type="text" class="row-action-btn"`.
- Default visible actions: view/edit/more at most.
- Row action icons must be visible in the default state; they should not look disabled.
- Row action buttons must not use permanent borders unless the action itself needs emphasis.
- `row-actions` is an alignment wrapper only. It must not look like a framed action box, outlined pill, capsule, or toolbar dock; no persistent border, background, shadow, or hover/selection wrapper chrome.
- VXE current cell, selected cell, active cell, and area-selection overlays must not use black/currentColor borders on workbench tables. The project-level `global.css` overrides these to `--dense-primary-*`; do not reintroduce page-scoped VXE cell focus styles.
- Destructive actions go in dropdown with confirmation.
- Direct row actions must be object-specific where text is shown.
- If more than two row actions exist, show primary row action (eye/edit) + `···` dropdown for the rest.

```vue
<!-- 操作列：主操作 icon + ··· dropdown -->
<vxe-column title="操作" width="88" fixed="right" align="center">
  <template #default="{ row }">
    <div class="row-actions">
      <a-tooltip content="查看详情">
        <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="handleView(row)">
          <template #icon><icon-eye /></template>
        </a-button>
      </a-tooltip>
      <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
        <a-button size="small" type="text" class="row-action-btn row-action-btn--more" title="更多操作">
          <template #icon><icon-more /></template>
        </a-button>
        <template #content>
          <a-doption @click="handleEdit(row)">编辑</a-doption>
          <a-doption @click="handlePrint(row)">打印</a-doption>
          <a-divider class="action-menu__divider" />
          <a-popconfirm content="确认废弃？此操作不可恢复。" @ok="handleVoid(row)">
            <a-doption class="danger-opt">废弃</a-doption>
          </a-popconfirm>
        </template>
      </a-dropdown>
    </div>
  </template>
</vxe-column>
```

- 操作列宽度：1 个 icon = `width="56"`；2 个 icon = `width="88"`。
- Operation column content must be wrapped by `row-actions` for alignment only; the wrapper must not draw a persistent border, background, shadow, capsule, or boxed dock.
- Primary direct row action uses `row-action-btn row-action-btn--primary`; more menu uses `row-action-btn row-action-btn--more`.
- danger 操作始终在 dropdown 内，且用 `a-popconfirm` 二次确认，不能直接触发。
- Do not repeat identical text buttons in every row if icon action with tooltip is enough.
- Fixed operation columns keep the table fixed-column boundary only; row operation affordance belongs to each icon button hover/focus state, not to a framed container.
- Avoid loose icon buttons without a `row-actions` alignment wrapper, but keep that wrapper visually transparent.
- Avoid permanent black/dark action borders. In a dense list they create a repeated black column and break the page's Arco theme rhythm.
- Avoid native browser focus outlines in row action buttons. `row-action-btn` is the only allowed operation-column action surface; page CSS must not add custom borders or focus rings to `row-actions`.
- Row action dropdowns should have grouped normal actions and a separated danger group. Do not let default dropdown styling make irreversible actions look like ordinary menu items.

## Detail And Nested Tables

Detail tables must look like part of the module, not a full page table pasted inside a card.

- Place the table directly under its module/child toolbar.
- Use compact header height and low-contrast borders.
- Keep editable input height aligned with row height.
- Provide an explicit empty state when no rows exist.
- Use add-row action near the table it affects.
- Keep operation column compact and rightmost.
- Do not use pagination inside nested detail tables unless the row count is genuinely large.
- Do not use large table captions for child tables; use the parent module/child head for identity.
- For nested editable line rows, use `detail-mini-vxe detail-mini-vxe--editable`: **same header/hover/border tokens as `workbench-table`**, with 32px header, 38px editable row, 28px Arco controls, and fixed right operation when needed.
- For nested read-only line rows, use `detail-mini-vxe detail-mini-vxe--readonly`: 32px header, 34px body row, no visible input controls by default.
- For short summary tables, use `detail-mini-vxe detail-mini-vxe--summary`: 28-32px header rhythm, 32px body row, no row actions unless the summary itself is editable.
- `detail-mini-vxe` shares `--dense-table-header-bg` and `--dense-vxe-surface-hover-bg` with list tables. Data rows stay white; hover is primary wash on white. **Do not** use a separate flat-gray header in detail.
- Detail mini tables without batch toolbar must **not** include a `type="checkbox"` column (VXE default checkbox reads as a solid blue square and has no batch action in detail sub-tables).
- `detail-mini-vxe` CSS row height, `--vxe-ui-table-row-height-small`, and `row-config.height` must match the chosen density variant. Do not set readonly height 34px while rendering 28px input/select/date controls, because VXE cell clipping will cut input text and displayed values.
- `detail-mini-vxe` is isolated from list-page `.vxe-table` global rules in `global.css` for **cell padding and row height only**. Header/hover/border tokens must match `workbench-table`.
- Wrap detail-section embedded tables with `detail-section__body detail-section__body--table` (padding 0, horizontal scroll). Do not use page-scoped `overflow: hidden` wrappers around wide child tables.
- Do **not** set `show-overflow` on `detail-mini-vxe` tables. It adds `col--ellipsis`, clips numbers/inputs, and can desync header/body columns (especially with `fixed="right"`). List/workbench tables still use `show-overflow="title"`.
- Put padding on `.vxe-cell` inside `detail-mini-vxe`, not on `.vxe-body--column` / `.vxe-header--column`, so VXE colgroup width stays aligned.
- Native `<table>` is not allowed for editable detail line rows with hover, fixed operations, empty state, or repeated inputs. Use VXE so table behavior and density remain project-wide.
- Detail mini table hover must use `--dense-vxe-surface-hover-bg` (alias `--dense-workbench-hover-bg`), not the header gradient.

## Editable Table Rules

Editable tables must be designed as a stateful work surface, not as a table where every cell is always an input.

### Display vs Edit Mode

Default state is read/display mode.

| Mode | Use when | UI |
|------|----------|----|
| Display mode | Normal browsing, large lists, saved data | Text, links, status pills, formatted numbers; no input controls visible |
| Row edit mode | User edits one record/line at a time | Only the active row renders controls; row actions become save/cancel |
| Batch edit mode | User edits the same field group across many rows | Explicit toolbar action enters batch edit; editable columns are visually marked |
| New row mode | User adds unsaved line data | Append or insert one editable row; focus first required field |

Rules:

- Do not render hundreds or thousands of visible inputs by default.
- Do not mix permanent input controls with read-only rows in the same visual state.
- Do not use hover alone to reveal editability for required business work; hover may reveal edit icon only.
- A row can be in exactly one of these states: `view`, `editing`, `new`, `saving`, `error`, `locked`.
- Use display formatting first: code mono, amount right aligned, date compact, status as `.s-pill`, empty as `—`.
- Editable cells must keep the same column width and row height as display cells as much as possible; entering edit mode must not shift the table.

### Large Data Editing

Large data means any table where users may see many rows or where virtualization/pagination is needed.

Required behavior:

- Default to display mode for performance and scanability.
- Enter edit by row action (`编辑`) or double-click only when the page clearly supports inline editing.
- Save scope must be explicit: row save, selected rows save, or whole table save.
- Unsaved changes must be visible through a dirty marker on the row or cell.
- Pagination, filtering, route leave, or drawer close must warn when unsaved edits exist.
- Editing many rows must use pagination/virtual-safe state keyed by stable row id, not row index.
- Do not store editing state only in rendered DOM; it must survive horizontal scroll and row re-render.
- When virtual scroll is enabled, `row-config.height` must match actual row height.

Avoid:

- Every row showing input/select controls all the time.
- One global save button with no indication of which rows changed.
- Validation error shown only after page submit when the table has hundreds of rows.
- Editing state tied to current page index, sorted index, or sequence number.

### Row Edit UI

Row edit mode:

- Direct row actions: `保存`, `取消`; destructive row action stays in dropdown or requires confirmation.
- If there are more than two actions, show primary action plus more menu.
- Required fields show validation at cell level.
- Invalid cells use Arco validation border/text or a compact inline error; do not color the whole row red.
- Saving row uses row-level loading or disabled save action, not a full-table spinner unless the whole table is saving.
- Cancel with dirty data requires confirmation only when changes would be lost.

### Batch Edit UI

Batch edit mode:

- Enter from toolbar: `批量编辑` or a domain-specific action such as `批量维护费用`.
- Toolbar changes to edit context: `保存更改`, `取消编辑`, `已修改 N 行`.
- Editable columns should be visually marked in header or with a subtle cell affordance.
- Non-editable columns remain text-only.
- Batch operations must not hide row selection, sorting, or validation state.
- If batch edit applies one value to selected rows, use a toolbar form/popover, not inline inputs in every selected row.

### Validation And Errors

- Required and format validation belongs to the cell/field.
- Cross-row validation belongs to the table summary or module summary row.
- Duplicate or conflict errors must identify the row and field.
- Save failure must keep the row in edit/error state and preserve user input.
- Error copy uses business language and names the failing object/value. Examples: `柜号不能为空`, `费用金额必须大于 0`, `HBL 单号重复`.

### Add/Delete Rows

- Add row should append a valid editable row and focus the first required field when feasible.
- Unsaved new rows can be removed without confirmation.
- Delete saved rows requires confirmation when data would be removed.
- When a row has dependent child rows, delete copy must name the impact.

### Cell Control Rules

- Inputs/selects must be full width in editable cells.
- Numeric fields use `a-input-number` and right alignment where possible.
- Code, date, amount, and status fields must keep their display typography in view mode.
- Use select only for finite options; do not use select for open text.
- Long text should edit in popover/drawer or multiline cell only when the table is not the main dense workbench.
- Do not show a compressed empty grid with only headers.

## Empty State

Empty state must tell the user what is missing and what to do next.

| Context | Empty copy | Action |
|---------|------------|--------|
| Main list after search | `暂无符合条件的数据` | adjust filters/reset |
| Module line table | `暂无明细` or object-specific copy | add line action |
| File table | `暂无附件` | upload action |
| Required module missing | object-specific missing copy | add/create action |

Rules:

- Empty text uses F5 auxiliary typography.
- Empty state should not consume excessive height in dense detail pages.
- Empty state must not be a blank row or a collapsed strip.

## Visual Quality Gate

Reject a table design when:

- all columns have equal visual weight;
- there is no obvious primary identifier;
- action buttons compete with data;
- table borders dominate the page;
- strong colored lines look like row selection or focus;
- row height clips input text;
- truncated data has no title/tooltip;
- nested tables look like independent page sections;
- empty tables appear as blank space.
- operation column shows black outlined pills or browser focus borders;
- VXE current/active cell creates a dark border that competes with selected/hover state.
