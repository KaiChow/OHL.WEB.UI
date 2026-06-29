# Typography And Internationalization

## Goal

Typography must support a dense international freight SaaS system used for long daily sessions.

The type system must be readable for Chinese, English, codes, dates, amounts, ports, vessel/voyage, HBL/MBL, container numbers, and multilingual customer names.

## Design Principles

Professional dense B2B UI uses a **fixed typographic ladder**, not ad-hoc sizes per page.

1. **Monotonic scale** — only these steps: 10 → 11 → 12 → 13 → 14. No 12/13/14 mixing inside one control row.
2. **Chrome above content** — overlay titles (Modal / Popover) and page-form heads must be **visually above** the form body they contain. Never make chrome title smaller than body text.
3. **Same size, different role** — section titles and table headers share **13px** with table data; distinguish with weight (600) and color (`color-text-2`), not a smaller font.
4. **Form zone unity** — filter + editable form: label, value, and placeholder are all **12px**; hierarchy uses color and weight only.
5. **Data zone readability** — table cells and read-only detail values use **13px**; one step above form labels.
6. **Token only** — pages use `var(--dense-font-*)`; `global.css` is the implementation source.

```
F0 Overlay chrome   14px / 600   Modal title, Popover title, page form head
F1 Data             13px / 400-500   Table body, read-only detail values, key links
F2 Nav              13px / 500-600   Buttons, tabs, chips
F3 Structure title  13px / 600   Section title, VXE column header
F4 Form label       12px / 500   Filter label, form label
F4 Control          12px / 400-500   Input/select/textarea value + placeholder
F5 Aux              11px / 400   Pagination, meta, helper
F6 Micro            10px / 500   Badge, pill, seq
```

## Font Family

Use a system-first font stack. Do not introduce web fonts unless the product explicitly ships them.

Recommended stack:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Inter",
  "Noto Sans",
  "Noto Sans CJK SC",
  "PingFang SC",
  "Microsoft YaHei",
  Arial,
  sans-serif;
```

Use a mono stack only for identifiers, codes, and aligned technical values:

```css
font-family:
  "SF Mono",
  "Cascadia Mono",
  "JetBrains Mono",
  Consolas,
  "Liberation Mono",
  monospace;
```

## Size Scale (F0–F6)

Use the global tokens. Do not hard-code page-specific font sizes.

| Level | Token | Size | Weight | Use |
|-------|-------|------|--------|-----|
| F0 | `--dense-font-overlay` | 14px | 600 | Modal title, Popover title, full-page form head (`xf-head`) |
| F1 | `--dense-font-data` | 13px | 400/500 | Table cells, read-only `.detail-field__val`, core links, business identifiers |
| F2 | `--dense-font-nav` | 13px | 500/600 active | Buttons, tabs, chips, segmented controls |
| F3 | `--dense-font-title` | 13px | 600 | Section titles (`detail-section__title`), VXE column headers, subgroup headings |
| F4 | `--dense-font-field` | 12px | 500 | Form labels, filter labels (`filter-field__label`) |
| F4 Control | `--dense-font-control` | 12px | 400/500 | Editable input/select/textarea values and placeholders |
| F5 | `--dense-font-aux` | 11px | 400/500 | Helper text, metadata, pagination summary |
| F6 | `--dense-font-micro` | 10px | 400/500 | Badges, units, sequence micro text, `.s-pill` |

Aliases:

- `--dense-font-page-head` → `--dense-font-overlay` (F0)
- `--dense-font-label` → `--dense-font-title` (F3)

Exceptions:

- A true page/detail hero may use one local hero token, max **16px/600**, only when visually separated from normal fact rows.
- In a dense `dds-hero` key-facts row, all fact values use F1 13px. Stronger lead facts use weight/placement, not a larger size inside the same row.
- Brand/logo shell may use larger text; never copy shell typography into business modules.
- Icons use `--dense-icon-action` (14px graphic), not text tokens.

## Weight Rules

- Business UI maximum weight is 600.
- Dense table body values default to 400.
- Use 500 for primary identifiers, links, numeric totals, selected options, and next-decision values.
- Labels default to 500.
- Helper text defaults to 400.
- Do not use `font-weight: 700/800` inside business modules.
- Do not use font weight alone to indicate status; use semantic status components.
- In main workbench tables, default cells use `color-text-2 + 400`; primary object codes and key quantities may use 500.

## International Text Expansion

Design for 1.3–2× text expansion compared with Chinese.

- Do not fixed-width buttons by Chinese label length.
- Do not truncate business-critical labels.
- Use vertical form labels for dense multilingual forms.
- Use `min-width` plus ellipsis/title for table columns.
- Do not use negative letter spacing or viewport-based font scaling.

## Codes, Numbers, Dates

| Value | Rule |
|-------|------|
| Order no, HBL, MBL, SO, PO, container no | `.mono` or mono stack; full value in tooltip/title |
| Amount, qty, weight, volume | `font-variant-numeric: tabular-nums`; right align in tables |
| Dates/times | Tabular numbers; one display format per page |
| Long customer/company names | Normal sans; ellipsis with title |

## Detail Header Typography

- Mono only for technical identifiers and document numbers.
- Hero fact labels: F5 / `color-text-3`.
- Hero fact values: F1 13px / `color-text-1`.
- All key-fact values in one `dds-hero` row share the same size.

## Line Height

- Dense table cell: 1.35–1.45.
- Form input value: match control height.
- Textarea: 1.45.
- Overlay title (F0): 1.4.
- Section title (F3): 1.4.

## Zone Typography Map

Every zone has a fixed font tier. Do not deviate.

| Zone | Element | Token | Size | Weight | Color |
|------|---------|-------|------|--------|-------|
| **Filter (zone-l2)** | Field label | F4 `--dense-font-field` | 12px | 500 | `color-text-2` |
| | Input / select value | F4 Control | 12px | 500 | `color-text-1` |
| | Placeholder | F4 Control | 12px | 400 | `color-text-3` |
| | Query / reset buttons | F2 Nav | 13px | 500 | — |
| **Toolbar / status (zone-l3)** | Tab, action button | F2 Nav | 13px | 500/600 | — |
| | Badge (`.stab-badge`) | F6 Micro | 10px | 600 | semantic |
| **Table (zone-l4)** | Cell data | F1 Data | 13px | 400 | `color-text-2` |
| | Primary identifiers | F1 Data | 13px | 500 | `color-text-1` |
| | Column header | F3 Title | 13px | 600 | `color-text-2` |
| | Status pill | F6 Micro | 10px | 500 | semantic |
| **Pagination** | Summary, page info | F5 Aux | 11px | 400 | `color-text-3` |
| **Detail read-only** | Field label (`.detail-field__label`) | F4 Field | 12px | 500 | `color-text-3` |
| | Field value (`.detail-field__val`) | F1 Data | 13px | 400/500 | `color-text-1` |
| | Section title | F3 Title | 13px | 600 | `color-text-1` |
| **Detail editable form** | Label + control + placeholder | F4 / F4 Control | 12px | 500 / 400 | per role |
| **Overlay** | Modal / Popover title | F0 Overlay | **14px** | 600 | `color-text-1` |
| | Modal / Popconfirm body | F4 Control | 12px | 500 | `color-text-1` |
| | Dropdown options | F4 Control | 12px | 500 | `color-text-1` |
| | Footer buttons | F2 Nav | 13px | 500 | — |
| | Tooltip | F5 Aux | 11px | 400 | — |
| **Page form head** | Title (`xf-head`) | F0 Overlay | 14px | 600 | `color-text-1` |

**Zone rules:**

- Filter + editable form: **all 12px** in one row (label / value / placeholder).
- Toolbar + table data + nav: **13px**.
- Overlay chrome title: **14px** — always ≥ body inside the same surface.
- Do not mix 12px and 13px within the same form control row.

## Form And Filter Typography

| Role | Token | Color | Weight |
|------|-------|-------|--------|
| Field label | F4 12px | `color-text-2` | 500 |
| Entered/selected value | F4 Control 12px | `color-text-1` | 500 |
| Placeholder | F4 Control 12px | `color-text-3` | 400 |

Editable forms and filters share F4. Read-only detail grids use F4 label + **F1 value** (label one step below value — standard professional pattern).

## Overlay And Popup Typography

Arco portals do not inherit page-scoped CSS. Normalize in `global.css`:

| Surface | Typography |
|---------|------------|
| `.arco-modal-title`, `.arco-popover-title` | F0 Overlay 14px / 600 |
| `.arco-modal-body`, popconfirm content | F4 Control 12px |
| Select / dropdown / cascader options | F4 Control 12px (same as trigger) |
| Modal / popconfirm footer buttons | F2 Nav 13px |
| Tooltip | F5 Aux 11px |

Rules:

- Modal title must be **larger than** modal form body (14px vs 12px).
- Select trigger and dropdown option must match size and weight.
- `global.css` overrides `.arco-modal-title`, `.arco-modal-body`, `.arco-select-dropdown`, `.arco-modal-footer`. Do not fix per page in scoped CSS.
- F6 10px is for badges only — not buttons or dropdown options.

Arco `size` prop: see `component-size.md`. Business UI uses `size="small"` only.

## Implementation Checklist

Modal / drawer form:

```vue
<a-modal title="新建通知">
  <a-form class="detail-form" layout="vertical" size="small">
    <a-form-item label="主题">
      <a-input size="small" />
    </a-form-item>
  </a-form>
</a-modal>
```

- `class="detail-form"` on `<a-form>` — binds F4 label + control tokens.
- `size="small"` on every Arco control — prevents Arco medium 14px leak.
- Do not use raw `<label class="xf-label">` in new modals; use `a-form-item`.

## Hard Bans

- No hardcoded `14px` / `15px` / `16px` in `src/views/**` — use tokens. **14px is allowed only via `--dense-font-overlay` (F0) in `global.css`.**
- No `font-weight: 700/800` in business UI.
- No Arco default medium (14px) leaking into forms — always `size="small"` + `detail-form`.
- No form/filter label-value-placeholder drift (12/13/11 in one row).
- No overlay title smaller than overlay body (title F0 14px, body F4 12px).
- No table header smaller than table body (both F3/F1 at 13px; header is 600).
- No placeholder with same weight/color as entered value.
- No all-caps UI labels unless the data itself is a code.
