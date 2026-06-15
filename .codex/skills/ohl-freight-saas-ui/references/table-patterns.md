# Table Patterns

Rules for vxe-table usage, column design, and visual quality.

---

## Always Use `.freight-table` Class

Every vxe-table in this project must carry the `freight-table` class.
This class applies the full set of CSS variable overrides and style rules from `global.css`.
Never create a bare `<vxe-table>` without it.

```vue
<vxe-table
  class="freight-table"
  stripe
  show-overflow
  show-header-overflow
  size="mini"
  :column-config="{ resizable: true }"
  :scroll-x="{ enabled: true, gt: 12 }"
  :row-config="{ isHover: true }"
  :data="rows"
  highlight-current-row
>
```

Key CSS variables already set by `.freight-table`:
- Row height: 31px
- Cell padding: 4px 8px
- Header bg: `linear-gradient(180deg, #f7fbff 0%, #eaf2fb 100%)`
- Header text: `#2f4058`, font-weight 700
- Body text: `#1e293b`
- Column border: `#e3ebf4`
- Row hover: `#f2f7ff`
- Selected row: `#edf5ff` + `inset 3px 0 0 rgb(var(--primary-6))` on first column
- Zebra stripe: `#fbfdff`

---

## Column Text Styles — Use CSS Classes, Not Inline Styles

| Field type                    | CSS class                    | Appearance                          |
|-------------------------------|------------------------------|-------------------------------------|
| Order number (primary link)   | `.order-no-button`           | Bold blue #126dff, underline on hover |
| Business no / secondary link  | `.table-link-button`         | Semi-bold blue #126dff              |
| HBL / MBL number              | `.table-secondary-link`      | Semi-bold #256bd6                   |
| Route (POL / POD)             | `.table-route-text`          | Medium weight #334155               |
| Container number              | `.table-container-text`      | Mono font, badge style #f1f5f9 bg   |
| Service scope / mode          | `.table-service-text`        | Badge style #eef6ff bg              |
| Empty / null value            | `.table-muted-text`          | Muted `var(--color-text-4)` → show "-" |
| Amount / numeric              | `.amount-text`               | Bold, tabular-nums                  |
| Code / ID (mono)              | `.muted-code`                | Mono font, muted color              |

---

## Row Actions — Use the Established Button Classes

Row operation cells should use `.table-row-actions` wrapper with specific button classes:

```vue
<div class="table-row-actions">
  <a-button class="table-action-btn" size="mini" type="text"
    @click="$emit('openDetail', row)">查看</a-button>
  <a-dropdown trigger="click">
    <a-button class="table-more-btn" size="mini" type="text">
      <template #icon><icon-more /></template>
    </a-button>
    <template #content>
      <a-doption>查看详情</a-doption>
      <a-doption>下载文件</a-doption>
      <a-doption>编辑</a-doption>
      <a-doption>操作日志</a-doption>
    </template>
  </a-dropdown>
</div>
```

Button classes:
- `.table-action-btn` — 22px height, blue tinted bg, hover fills blue
- `.table-more-btn` — 24px square, same style, icon only
- `.table-file-btn` — 22px height, min-width 50px, for file/attachment buttons

Max 2 visible action buttons per row. Everything else in dropdown.

---

## Status Column

Always use `a-tag` with `status-dot`, never plain text:

```vue
<a-tag size="small" :color="statusColorMap[row.status]">
  <span class="status-dot" />
  {{ statusTextMap[row.status] }}
</a-tag>
```

---

## File Column

```vue
<a-button class="table-file-btn" size="mini" type="text">
  <template #icon><icon-file /></template>
  文件
</a-button>
```

---

## Order Group Rows (Merged Cells for Container List)

When one order expands to multiple container rows, use `span-method` (merge-cells config) and apply row class names:

| Row position  | Class                        | Effect                                  |
|---------------|------------------------------|-----------------------------------------|
| First row     | `order-group-row--start`     | Top border highlighted                  |
| Middle rows   | `order-group-row--middle`    | Light dashed bottom border              |
| Last row      | `order-group-row--end`       | Bottom border highlighted               |
| Single row    | `order-group-row--single`    | Top + bottom border                     |
| Hovered group | `order-group-row--hovered`   | All rows in group turn `#f2f7ff`        |
| Selected group| `order-group-row--current`   | All rows `#edf5ff` + left blue marker   |

The merged master cell (rowspan cell) must use class `.merged-master-cell`.

---

## Default Column Order for 业务单 List

```
seq (#)   → width 44,  fixed left
Status    → width 90,  fixed left, use a-tag
DcgNo     → width 160, fixed left, use .order-no-button
OrderNo   → width 150, use .table-link-button
Customer  → width 140
Salesman  → width 80
POL       → width 100, use .table-route-text
POD       → width 100, use .table-route-text
ETD       → width 90
ETA       → width 90
HBL       → width 140, use .table-secondary-link
MBL       → width 140, use .table-secondary-link
Container → width 130, use .table-container-text
Service   → width 100, use .table-service-text
Files     → width 70,  use .table-file-btn
Operation → width 90,  fixed right, use .table-row-actions
```

Use hidden columns or column settings for lower-frequency fields (vessel, voyage, warehouse no, etc).

---

## Column Width Guide

| Content type         | Min width | Typical width |
|----------------------|-----------|---------------|
| Sequence #           | 44px      | 44px          |
| Status tag           | 80px      | 90px          |
| Order / business no  | 140px     | 160px         |
| Customer name        | 120px     | 140px         |
| Person name          | 70px      | 80px          |
| Port (POL/POD)       | 80px      | 100px         |
| Date (ETD/ETA)       | 80px      | 90px          |
| HBL / MBL            | 120px     | 140px         |
| Container no/type    | 110px     | 130px         |
| Amount               | 90px      | 110px         |
| File button          | 60px      | 70px          |
| Operation            | 70px      | 90px          |

---

## Route Arrow in Cell

```vue
<span class="route-text">{{ row.LoaddingPortEn }}</span>
<span class="route-arrow">→</span>
<span class="route-text">{{ row.DeliveryPortEn }}</span>
```

---

## Forbidden Table Patterns

- Never use `size="small"` or `size="medium"` on vxe-table — always `size="mini"`.
- Never apply inline `style` to table cells — use CSS classes.
- Never use thick cell borders — the column border is 1px `#e3ebf4`.
- Never make every cell the same font-weight — primary fields are bold, rest are normal.
- Never put more than 2 visible buttons in an operation column.
- Never use a colored left bar decoration on rows by default.
- Never render amounts without `tabular-nums`.
- Never show raw null/undefined — always display `-` for empty values.
