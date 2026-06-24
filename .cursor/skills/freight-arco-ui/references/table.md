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
| Detail line table | 28-32px | 32-36px | Must align with detail form controls and avoid input clipping |
| Editable line table | 32px | 36-40px | Use the smallest height that keeps inputs and validation readable |
| Summary/read-only mini table | 28px | 30-34px | No row actions unless necessary |

Rules:

- Project default tokens are `--dense-header-h: 32px` and `--dense-row-h: 36px`.
- Main list VXE tables use `class="compact"` unless the page has a documented reason to use `standard`.
- Do not use 40px as the default workbench row height; it reduces first-screen data density.
- VXE `size="small"` defaults to a 40px row variable. A compact table must override `--vxe-ui-table-row-height-small` and set `row-config.height = 36`; changing only `.vxe-body--row` is not enough.
- Do not push main list rows below 34px; checkbox, status pill, icon actions, and text line-height begin to clip.
- If row content requires more than 36px, first reduce column complexity or move secondary information to detail, then consider `standard`.
- Row height must be paired with readable typography: body F1 13px, header F3 12px.

## Column Rules

- At least one content column must use `min-width`.
- Do not set `width` on every column.
- Fixed left: checkbox, sequence, main identifier if needed.
- Fixed right: file/action only.
- Numeric columns align right.
- Status/action columns align center.
- Long text uses ellipsis/title or a two-line cell pattern.
- Do not combine multiple independent business fields into one list column unless the business explicitly requires grouped display.
- Use object identity columns early: code/no/name/status before secondary metadata.
- Put next-decision fields before passive audit fields.
- Do not default to showing every backend field.
- Use `show-overflow="title"` or explicit tooltip for truncated business values.
- Header labels must be business terms, not database field names.

## Width Rules

| Column kind | Rule |
|-------------|------|
| Sequence | 44-56px |
| Checkbox | 40-48px |
| Status | 84-110px |
| Date | 92-120px |
| DateTime | 150-170px |
| Order/document code | 140-180px, mono |
| Customer/company | min-width 160-220px |
| Port/city | 100-140px |
| Numeric amount/qty | 90-130px, right aligned |
| Operation | 72-120px, fixed right only when useful |

These are starting ranges, not hard-coded widths for every table.

## Cell Patterns

- Main links: `link-text link-text--strong mono`; the primary object identifier should be stronger than secondary links.
- Normal links: `link-text mono`.
- Status: `.s-pill[data-s]`.
- Status pills do not use a leading dot by default. Use `.s-pill--dot` only for timeline/legend-like contexts, not normal table cells.
- Risk attributes such as dangerous cargo may use an icon inside `.s-pill`, but must not combine icon and leading dot.
- Cargo type/risk columns should use a consistent cargo token pattern, not workflow status pills. All values keep the same baseline and size; risk values may use warning token color/border without an icon-heavy label.
- Table status/attribute tokens in the same visual family must share one size: 20px height, F5 11px text, same padding/radius/line-height. Semantic color may differ; component size must not.
- Two-line cell: `cell-two-line`, `c2-main`, `c2-sub`. Use it only for primary value + its own auxiliary metadata, not for merging two independent fields such as shipper/consignee, POL/POD, ETD/ETA, HBL/MBL.
- Empty value: `—` with weak color.
- Numeric values: tabular numbers and right alignment.
- Units: micro typography after value, not a separate dominant column unless users sort/filter by unit.
- Booleans: use clear text or compact Tag; do not use only color.
- File availability: use file action state; disabled download when no file.
- Customer, shipper, consignee, carrier, route, port, and container values are core business values. Do not style them as helper/disabled text.
- Passive metadata such as submit time, uploader time, and audit time can be one level weaker than object identifiers.

## Row Interaction

- Hover and selected states must cover fixed columns consistently.
- Hover uses primary tint, not gray.
- Selection uses a stronger primary tint.
- Zebra stripes are optional and must remain low contrast.
- Do not merge cells for the main list unless the business explicitly requires grouped display.
- Editable row hover must not hide validation borders.
- Fixed left/right shadows must remain subtle and consistent with Arco theme.

## Grid Lines

Table lines are functional separators, not decoration.

- Header must have a visible but restrained anchor: subtle primary tint or primary bottom border.
- Main workbench tables should use `workbench-table` to create the table surface: neutral header anchor, low-contrast row/column separators, fixed-operation column surface, and primary tint only for hover/selection/actions.
- Primary table borders must use complete CSS colors such as `--dense-primary-2/3` or `rgb(var(--primary-2))`; do not write `border-color: var(--primary-2)` because gi-demo stores primary tokens as RGB channels.
- Keep a subtle 1px header/body separator when it helps scan the table.
- Keep low-contrast row separators for dense data rows.
- Avoid strong primary-colored horizontal lines in the table body or below the header; users read them as focus, current row, or selected state.
- Avoid heavy vertical lines. Use column spacing, alignment, and header labels first.
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

## Row Actions

- Use `a-tooltip` + `a-button type="text" class="row-action-btn"`.
- Default visible actions: view/edit/more at most.
- Row action icons must be visible in the default state; they should not look disabled.
- Row action buttons should not use heavy permanent borders unless the action needs emphasis.
- Operation-column action docks must not look like black outlined pills. Use subtle Arco primary tint or transparent surface by default; show border only on row hover/selection.
- VXE current cell, selected cell, active cell, and area-selection overlays must not use black/currentColor borders on workbench tables. The project-level `global.css` overrides these to `--dense-primary-*`; do not reintroduce page-scoped VXE cell focus styles.
- Destructive actions go in dropdown with confirmation.
- Direct row actions must be object-specific where text is shown.
- If more than two row actions exist, show primary row action plus `more`.
- Do not repeat identical text buttons in every row if icon action with tooltip is enough.
- Fixed operation columns need an intentional action surface: subtle left boundary, compact `row-actions` dock, and consistent icon button size.
- Avoid loose icon buttons floating directly on the grid background. In dense workbench tables this looks unfinished and makes actions hard to scan.
- Avoid permanent black/dark action borders. In a dense list they create a repeated black column and break the page's Arco theme rhythm.
- Avoid native browser focus outlines in row action buttons. `row-action-btn` and `row-actions` are the only allowed operation-column action surface; page CSS must not add custom borders or focus rings to them.
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
- For nested editable line rows, prefer the shared `detail-mini-vxe` VXE pattern: 30px header, 38px row for editable rows, 28px Arco controls, structural header tint, subtle row separators, and fixed right operation when needed.
- `detail-mini-vxe` header and row hover must **not** share the same background. Header uses `--dense-mini-vxe-header-bg` (primary-2 gradient + primary-3 border); hover uses `--dense-mini-vxe-hover-bg` (5% primary wash on white). Checkbox selected rows use `--dense-mini-vxe-checked-bg`.
- `detail-mini-vxe` CSS row height, `--vxe-ui-table-row-height-small`, and `row-config.height` must match. Do not set row height to 34px while rendering 28px input/select/date controls, because VXE cell clipping will cut input text and displayed values.
- `detail-mini-vxe` is isolated from list-page `.vxe-table` global rules in `global.css`. Do not re-apply list-table header height, column `border-right`, or cell padding on `td` directly.
- Wrap detail-section embedded tables with `detail-section__body detail-section__body--table` (padding 0, horizontal scroll). Do not use page-scoped `overflow: hidden` wrappers around wide child tables.
- Do **not** set `show-overflow` on `detail-mini-vxe` tables. It adds `col--ellipsis`, clips numbers/inputs, and can desync header/body columns (especially with `fixed="right"`). List/workbench tables still use `show-overflow="title"`.
- Put padding on `.vxe-cell` inside `detail-mini-vxe`, not on `.vxe-body--column` / `.vxe-header--column`, so VXE colgroup width stays aligned.
- Native `<table>` is not allowed for editable detail line rows with hover, fixed operations, empty state, or repeated inputs. Use VXE so table behavior and density remain project-wide.
- Detail mini table hover must use a restrained primary tint, not gray, so nested editing still has a visible interaction state.

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
- Error copy uses business language: `柜号不能为空`, `费用金额必须大于 0`, `HBL 单号重复`.

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
