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

## Office Table Gate

A main freight workbench table is accepted only when all of these are demonstrated:

- at `1366x768` the primary identity, key status/decision data, and operation entry remain reachable without browser-level overflow;
- structural columns use fixed widths, business columns use rational `min-width`, and the table owns horizontal scrolling;
- the primary identity may be fixed left and the compact operation column fixed right; fixed surfaces retain hover/selection state;
- long text has title/tooltip or an approved two-line relationship; no business meaning disappears through silent clipping;
- multi-select appears only with a real batch toolbar and complete partial-failure contract;
- more than 12 columns defines 8-12 useful defaults plus column settings; density changes use supported row configurations rather than CSS-only scaling;
- long data, extreme values, empty values, loading, no-match, and slow refresh are verified;
- keyboard focus, row actions, virtual scrolling, and horizontal scrolling do not shift row height or lose state.

## Unified Table Surface

List workbench tables and detail nested tables use one **public VXE configuration contract**, not a global CSS skin.

| Contract | List (`workbench-table`) | Detail (`detail-mini-vxe`) |
|----------|--------------------------|----------------------------|
| Framework size | `size="small"` | `size="small"` |
| Border | `border="none"` | `border="none"` |
| Hover | `row-config.isHover` | `row-config.isHover` |
| Stable identity | `row-config.keyField` | `row-config.keyField` |
| Density | `row-config.height` when virtualization/density switching requires it | Native small row; controls must be verified unclipped |
| Overflow tooltip | `show-overflow="title"` | Omit for editable child rows |

Shared rules:

- Every operational VXE table uses `workbench-table` or `detail-mini-vxe` as a semantic/checker hook. The hook must not depend on global selectors targeting VXE internals.
- Configure header, border, hover, selection, fixed columns, loading, overflow, density, and row identity through VXE props/config only.
- Do not declare `--vxe-*` / `--vxe-ui-*` variables or target `.vxe-*` internals in global CSS.
- Detail-only differences: omit overflow clipping for editable rows, omit checkbox without a batch toolbar, and verify native small rows contain small Arco controls.
- **Borders:** `border="none"` + no vertical lines + weak horizontal row separators — see **Border Policy**.
- **Sequence:** see **Sequence Column (序号)** — width `52`, detail editable tables require it; list tables usually omit.

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

| Table type | Body row | Rule |
|------------|--------|----------|------|
| Workbench compact list | 36px via `row-config.height` | Default for order, customer, finance, warehouse, and operation lists |
| Workbench standard list | 44px via `row-config.height` | Only for review pages or rows with two-line cells |
| Detail editable line table | Native VXE small | Must contain `size="small"` controls without clipping |
| Detail readonly line table | Native VXE small | Use for documents, file status, logs, and status rows |
| Summary/read-only mini table | Native VXE small | Use for short totals, no action column unless necessary |

Rules:

- Project default tokens are `--dense-header-h: 32px` and `--dense-row-h: 36px`.
- Main list VXE tables use `class="compact"` unless the page has a documented reason to use `standard`.
- Do not use 40px as the default workbench row height; it reduces first-screen data density.
- Main-list density switching sets `row-config.height` (`36` compact / `44` standard); CSS-only row height is forbidden because VXE scroll calculations use configuration.
- Detail variants remain semantic job markers and use native `size="small"` unless a tested shared Vue wrapper exposes a public density prop.
- Do not apply editable density to read-only documents, attachments, logs, or status-only rows. Density is chosen by the row job, not by the surrounding drawer.
- Do not push main list rows below 34px; checkbox, status pill, icon actions, and text line-height begin to clip.
- If row content requires more than 36px, first reduce column complexity or move secondary information to detail, then consider `standard`.
- Row height must be paired with readable typography: body F1 12px, header F3 12px / 600.

## Border Policy

### Decision (PESDP)

Freight workbench tables are **scan surfaces**, not Excel grids. The project default is:

| Line type | Show? | Token | Why |
|-----------|-------|-------|-----|
| **Vertical column borders** | **No** | `--dense-table-col-border: transparent` | Multi-column horizontal scan; vertical lines create spreadsheet noise and steal density |
| **Horizontal row borders** | **Yes (weak)** | `--dense-table-row-border` | Helps the eye track a row across 10–20 columns without boxing every cell |
| **Header / body separation** | **Yes (subtle)** | `--dense-table-header-bg` + `--dense-table-header-border` on header cells | Structure comes from header contrast, not a heavy blue/primary line |
| **Outer table frame** | **No** | `border="none"` on `<vxe-table>` | Card / `table-wrap` already defines the module boundary |
| **Zebra stripe** | **Off by default** | `--dense-row-stripe` ≈ white | Row separators + hover are enough; zebra + borders = muddy |

**Do not** switch to full grid (`border="full"` / visible column lines) on operational list or detail mini tables. Full grids are allowed only for rare finance side-by-side comparison modules — document the exception in the module spec.

### Implementation (mandatory)

```vue
<vxe-table border="none" class="compact workbench-table" ... />
<vxe-table border="none" class="detail-mini-vxe detail-mini-vxe--editable" ... />
```

| Surface | `border` attr | Vertical lines | Horizontal lines |
|---------|---------------|----------------|------------------|
| List `workbench-table` | `none` | off | weak row separator on body cells |
| Detail `detail-mini-vxe` | `none` | off | same weak row separator |
| Summary `detail-mini-vxe--summary` | `none` | off | same or lighter |

Rules:

- Never use VXE default bordered skin on production pages.
- Never add page-scoped `border-right` / `border-bottom` on `.vxe-body--column`.
- Hover/selection tint replaces strong borders for row state — primary row background, not black outlines.
- `detail-mini-vxe` header wrapper: `border-bottom: none`; header/body split uses header background only.
- Editable cell validation may use Arco field border; that is control chrome, not table grid lines.

### Visual hierarchy (what users should see)

```
┌─ table card ─────────────────────────────────────┐
│  HEADER ROW  (near-white bg, no vertical lines) │
│  data row    ─────────────────── weak 1px line   │
│  data row    ─────────────────── weak 1px line   │
│  hover row   ███ primary tint, no extra border │
└──────────────────────────────────────────────────┘
```

## Sequence Column (序号)

Structural rhythm column — **not** business data. Width `52`, centered through VXE column props; typography remains VXE-native.

### Markup

```vue
<!-- List: after checkbox when both exist -->
<vxe-column type="checkbox" width="40" fixed="left" />
<vxe-column type="seq" title="序号" width="52" fixed="left" align="center" />

<!-- Detail mini table -->
<vxe-column type="seq" title="序号" width="52" align="center" />
```

| Attribute | Value | Rule |
|-----------|-------|------|
| `type` | `seq` | VXE built-in index; do not hand-roll `<span>{{ index + 1 }}</span>` |
| `width` | **`52`** | Project default; `check-spec` enforces |
| `title` | `序号` | Chinese label; not `#` / `No.` |
| `align` | `center` | Required |
| `fixed` | `left` on list when checkbox or identity is fixed | Keeps index visible while scrolling |

### When to include

| Table | Seq column | Rule |
|-------|------------|------|
| **Detail editable mini-vxe** (品名/装柜/费用行) | **Required** when ≥2 rows | Users refer to “第 N 行” while editing |
| **Detail readonly mini-vxe** | **Recommended** when ≥3 rows | Optional for 1–2 rows |
| **Main workbench list** | **Optional** | Default **omit** when a strong identity column (单号/编号) is already `fixed="left"` |
| **Main list + batch checkbox** | **Usually omit** | Checkbox + identity is enough; do not add seq just for decoration |
| **Main list without fixed identity** | Consider seq | Rare; fix identity column first instead |
| **File / attachment table** | **Omit** | File name is the row identity |
| **Summary mini table** | **Omit** | Too few rows |

### When seq is misleading

- Do not use seq as row **identity** for save/delete/API — always use stable `keyField` / row id.
- Pagination seq is **page-local** (1…pageSize), not global record index — that is acceptable for visual reference only.
- Do not use seq instead of a business line number field when the backend assigns line numbers.

### Column order (left fixed block)

```
checkbox (40, if batch) → seq (52, if used) → primary identity (min-width, fixed left) → … → 操作 (fixed right)
```

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
- Two-line cell: one local container with explicit main and auxiliary roles. Exact child class names are page-local unless grep proves a shared implementation. Use it only for a primary value plus its own metadata, not for merging two independent fields such as two parties, locations, dates, or identifiers.
- Empty value: `—` with weak color.
- Numeric values: tabular numbers and right alignment.
- Units: micro typography after value, not a separate dominant column unless users sort/filter by unit.
- Booleans: use clear text or compact Tag; do not use only color.
- File availability: use file action state; disabled download when no file.
- Primary identifiers, parties, locations, operators, quantities, amounts, dates, and other next-decision values are core business values. Do not style them as helper/disabled text.
- Passive metadata such as submit time, uploader time, and audit time can be one level weaker than object identifiers.

### Composite Cell Decision Contract

The default is **one independently understood business dimension per column**. Density, viewport pressure, or a desire to reduce the visible column count is not sufficient justification for combining fields.

A two-line/composite cell is allowed only for one of these dependency roles:

| Role | Main line | Auxiliary line | Requirement |
|------|-----------|----------------|-------------|
| `identity-metadata` | one primary object identity | metadata owned exclusively by that same identity | auxiliary value cannot reasonably stand as an independent scan/sort/filter dimension |
| `decision-context` | one next action / decision | its reason, deadline, or blocking context | auxiliary value directly explains or qualifies the decision |
| `value-unit` | one numeric/business value | its unit or display qualifier | unit is not independently operated on in this list |

Before implementing a composite cell, record:

```text
cell_role: identity-metadata | decision-context | value-unit
main_value:
auxiliary_value:
dependency:
sort_filter_export_semantics:
why_separate_columns_are_worse:
```

If any field has its own filter, sort, export meaning, permission, status semantics, or frequent scan task, it remains a separate column. When evidence is missing, separate the columns.

Implementation rules:

- Use a role-specific local container such as `decision-cell`; annotate it with `data-cell-role="decision-context"` (or the other accepted role).
- Do not use a generic `cell-two-line` class in a workbench table. Generic naming hides whether the relationship is legal.
- Composite display does not change the source schema: sorting, filtering, export, permissions, and API fields still target stable source fields.
- A column header names the one displayed business dimension. Slash-joined headers are not a shortcut for unrelated fields.
- Horizontal scrolling, column settings, and default/hidden columns are the correct response to many independent dimensions.

Forbidden combinations include:

| Main value | Incorrect auxiliary values | Correct treatment |
|------------|----------------------------|-------------------|
| Primary object number | other document/booking numbers | separate restorable columns |
| Party/customer | owner, business type, department | separate columns |
| Route/location | carrier, schedule, vessel/voyage | separate columns |
| Operator/owner | update or audit time | separate columns |
| One workflow status | file, fee, exception, or approval statuses | separate semantic status columns |

The examples above describe classes of independent dimensions, not mandatory fields for every domain.

## Row Interaction

- Hover and selected states must cover fixed columns consistently.
- Hover uses primary tint, not gray.
- Selection uses a stronger primary tint.
- Zebra stripes are optional and must remain low contrast. Prefer no visible stripe for dense workbench pages when row separators already provide scan rhythm.
- Do not merge cells for the main list unless the business explicitly requires grouped display.
- Editable row hover must not hide validation borders.
- Fixed left/right shadows must remain subtle and consistent with Arco theme.

## Grid Lines

See **Border Policy** above for the full contract. Short form:

- `border="none"` on every operational `vxe-table`.
- No vertical column lines; weak horizontal row separators only.
- Header/body split via `--dense-table-header-bg`, not heavy borders.
- Selection/hover use primary tint — not stronger grid lines.

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
- Count only business/data columns for the 8–12 default; checkbox, sequence, and operation columns are structural and do not count.
- Extra columns: `field`-only columns with `:visible="false"`, or a deterministic `isColumnVisible(field)` binding backed by an explicit default-visible list. They appear in the picker and remain hidden by default.
- When a workbench defines more than 12 business columns, at least one secondary column must be hidden by default and a functional column-configuration surface must be enabled.
- Do not default to showing every backend field. Use next-decision fields first.
- Column picker button goes in `table-card-cap__right`, `type="text" class="table-card-cap__tool"`.
- The picker must preserve required identity/status columns, keep at least 8 business columns selected, support restoring defaults, and persist the applied selection.
- A column-settings trigger must open a visible surface and update real VXE column state. A no-op optional call such as `xTable?.openCustom?.()` is forbidden.
- Use either a connected `<vxe-toolbar custom>` or an owned Arco Modal/Drawer that calls VXE `showColumn` / `hideColumn` and `refreshColumn`.

```vue
<!-- table-card-cap: column settings button -->
<a-tooltip content="列设置">
  <a-button size="small" type="text" class="table-card-cap__tool" @click="columnSettingsVisible = true">
    <template #icon><icon-settings /></template>
  </a-button>
</a-tooltip>

<a-modal
  v-model:visible="columnSettingsVisible"
  title="列设置"
  :on-before-ok="applyColumnSettings"
>
  <a-checkbox-group v-model="columnSettingDraft" />
</a-modal>

<!-- vxe-table setup -->
<vxe-table
  ref="xTable"
  id="module-name"
  :custom-config="{ storage: true }"
  ...
>
  <!-- default visible -->
  <vxe-column field="orderNo" title="订单编号" min-width="148" />
  <!-- hidden by default, user-restorable -->
  <vxe-column field="weight" title="毛重(kg)" min-width="88" :visible="isColumnVisible('weight')" />
</vxe-table>
```

```ts
import type { VxeTableInstance } from 'vxe-table'
const xTable = ref<VxeTableInstance>()

const applyColumnSettings = async () => {
  await Promise.all(columns.map(({ field }) => (
    selectedFields.value.includes(field)
      ? xTable.value?.showColumn(field)
      : xTable.value?.hideColumn(field)
  )))
  await xTable.value?.refreshColumn()
  return true
}
```

## Row Actions

Applies to **`workbench-table` list operation columns** unless noted. Menu order / danger styling → [`actions.md`](actions.md) §6.

### Action classes (classify before layout)

| Class | Examples | Direct exposure on list |
|-------|----------|-------------------------|
| **A · Primary** | 查看、编辑（按行状态互斥时占 **同一槽位**） | 最多 1 个直出 |
| **B · Secondary** | 第二高频可逆动作（如「复制单行」「下载附件」） | 仅当整行 **恰好 2 个非危险** 动作时与 A 并列直出 |
| **C · Workflow** | 转移、推送、分配、打印 | 收入 `···` |
| **D · Danger** | 删除、废弃、作废 | **列表主表永远进 `···`**，禁止直出 danger icon |

Counting rules:

- Mutually exclusive actions (e.g. 草稿→编辑 / 已发布→查看) count as **one** slot before applying the matrix.
- If the primary identifier column already opens detail (link-text), the operation column may show edit or `···` only — matrix unchanged.
- Low-frequency actions must not steal a direct slot just because only two verbs exist; if one verb is **D**, pattern is `[A] + ···`, not two flat icons.

### Display matrix (1–N)

| Effective actions* | Contains D? | Visible pattern | Column `width` |
|--------------------|-------------|-----------------|----------------|
| 0 | — | Remove operation column | — |
| 1 | No | `[A]` | `56` |
| 1 | Yes | `[A]` + `···(D)` | `88` |
| 2 | No (both A/B daily) | `[A][B]` — two tooltips, **no** `···` | `88` |
| 2 | Yes | `[A]` + `···(B and/or D)` | `88` |
| ≥3 | Any | `[A]` + `···(B+C+D)` | `88` |

\*After merging mutually exclusive verbs. **Hard limits:** operation column shows **at most 2 affordances** (icon buttons including `···` trigger); **never** `width` > `88`; **never** three flat icons.

Decision flow:

```
count effective actions (merge exclusive A verbs)
├─ 0 → no column
├─ 1 & no D → [A] width 56
├─ 1 & has D → [A] + ··· width 88
├─ 2 & no D → [A][B] width 88
└─ else → [A] + ··· width 88
```

### Implementation contract

- Use `a-tooltip` + `a-button type="text" class="row-action-btn"`.
- Wrap in `row-actions` (alignment only — no border/background/capsule chrome).
- Primary direct action: `row-action-btn row-action-btn--primary` (eye / edit).
- More trigger: icon-only `row-action-btn row-action-btn--more` with the native Arco Dropdown popup.
- Row action icons stay visible in default state; no permanent borders on buttons.
- Danger in `···`: Arco Divider then `a-doption.danger-opt`; its click stores the target and opens a separate business Modal or `Modal.confirm` after the dropdown closes. Never nest `a-popconfirm` in Dropdown and never expose flat `status="danger"` on list rows.
- Keep VXE native focus/selection behavior; do not suppress it with global or page-local internal selectors.

### Examples

```vue
<!-- N=1：仅主操作 -->
<vxe-column title="操作" width="56" fixed="right" align="center">
  <template #default="{ row }">
    <div class="row-actions">
      <a-tooltip content="查看详情">
        <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="handleView(row)">
          <template #icon><icon-eye /></template>
        </a-button>
      </a-tooltip>
    </div>
  </template>
</vxe-column>

<!-- N=2：两个日常可逆动作，并列直出 -->
<vxe-column title="操作" width="88" fixed="right" align="center">
  <template #default="{ row }">
    <div class="row-actions">
      <a-tooltip content="查看">
        <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="handleView(row)">
          <template #icon><icon-eye /></template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="编辑">
        <a-button size="small" type="text" class="row-action-btn" @click="handleEdit(row)">
          <template #icon><icon-edit /></template>
        </a-button>
      </a-tooltip>
    </div>
  </template>
</vxe-column>

<!-- N≥3 或含危险：主操作 + ··· -->
<vxe-column title="操作" width="88" fixed="right" align="center">
  <template #default="{ row }">
    <div class="row-actions">
      <a-tooltip content="查看详情">
        <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="handleView(row)">
          <template #icon><icon-eye /></template>
        </a-button>
      </a-tooltip>
      <a-dropdown trigger="click" position="br">
        <a-button size="small" type="text" class="row-action-btn row-action-btn--more" title="更多操作">
          <template #icon><icon-more /></template>
        </a-button>
        <template #content>
          <a-doption @click="handleEdit(row)">编辑</a-doption>
          <a-doption @click="handlePrint(row)">打印</a-doption>
          <a-divider />
          <a-doption class="danger-opt" @click="requestVoid(row)">废弃</a-doption>
        </template>
      </a-dropdown>
    </div>
  </template>
</vxe-column>
```

`requestVoid(row)` stores the row and opens an independent confirmation Modal. The Modal performs the irreversible action only after explicit confirmation.

### `detail-mini-vxe` exception

Editable detail subtables (`detail-mini-vxe--editable`) may expose **one** delete icon directly (`status="danger"` + `a-popconfirm`) when the row job is inline line editing. Same matrix limits apply (max 2 affordances; no third flat icon). Read-only detail subtables follow the list matrix — danger stays in menu if present.

### Anti-patterns

- Three flat icons (e.g. edit + view + delete) or `width="120"`.
- Hiding a daily **B** action inside `···` when the row only has two non-danger verbs.
- Flat danger delete on workbench list rows.
- Loose icons outside `row-actions`.
- Text buttons («查看») in operation columns — icon + tooltip only.

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
- For nested editable line rows, use `detail-mini-vxe detail-mini-vxe--editable`, native small density, small Arco controls, and fixed right operation when needed.
- For nested read-only and summary rows, use the matching semantic modifier, native small density, and no visible controls by default.
- Detail mini tables without batch toolbar must **not** include a `type="checkbox"` column (VXE default checkbox reads as a solid blue square and has no batch action in detail sub-tables).
- Do not fake detail density with global VXE variables or internal selectors. Verify editable rows on the real route for control clipping and horizontal alignment.
- Wrap detail-section embedded tables with `detail-section__body detail-section__body--table` (padding 0, horizontal scroll). Do not use page-scoped `overflow: hidden` wrappers around wide child tables.
- Do **not** set `show-overflow` on `detail-mini-vxe` tables. It adds `col--ellipsis`, clips numbers/inputs, and can desync header/body columns (especially with `fixed="right"`). List/workbench tables still use `show-overflow="title"`.
- Do not patch internal VXE cell padding; choose column widths and public table density instead.
- Native `<table>` is not allowed for editable detail line rows with hover, fixed operations, empty state, or repeated inputs. Use VXE so table behavior and density remain project-wide.
- In `detail-mini-vxe` cells, **do not** use `link-text` for plain read-only values. Keep it only on real actions (`a`, `a-button`).

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
- When virtual scroll is enabled, `row-config.height` must match the configured public row height. Detail mini tables without virtualization keep native small density.

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
- current-cell/highlight modes are enabled without a business need;
- native keyboard focus is suppressed or confused with row selection.
