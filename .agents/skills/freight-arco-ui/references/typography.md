# Typography And Internationalization

## Goal

Typography must support a dense international freight SaaS system used for long daily sessions.

The type system must be readable for Chinese, English, codes, dates, amounts, ports, vessel/voyage, HBL/MBL, container numbers, and multilingual customer names.

## Design Principles

Professional dense B2B UI uses a **fixed typographic ladder**, not ad-hoc sizes per page.

1. **Monotonic scale** — custom business text follows the project token ladder. Framework component text follows GI's native `small` scale and must not be globally rewritten to match a page token.
2. **Chrome above content** — overlay titles (Modal / Popover) and page-form heads must be **visually above** the form body they contain. Never make chrome title smaller than body text.
3. **Role before size** — custom table data, section titles, field labels, and helper text use stable role tokens; hierarchy comes from weight, color, placement, and spacing together.
4. **Content unity** — custom business data and labels use F1/F3/F4 consistently across list, filter, form, and detail surfaces.
5. **Framework ownership** — buttons, tabs, inputs, selects, pickers, modal titles, and form-item labels keep GI native typography. Do not force internal selectors to F0-F6.
6. **Token boundary** — page-authored text uses `var(--dense-font-*)`; tokens never authorize global `.arco-*` or `.vxe-*` overrides.

```
F0 Overlay chrome   14px / 600   Modal title, Popover title, page form head
F1 Data             12px / 400-500   Table body, key links, identifiers
F2 Nav              13px / 500-600   Custom navigation labels and compact chips
F3 Structure title  12px / 600   Section title, VXE column header
F4 Form label       12px / 500   Filter label, form label
F4 Control          12px / 400-500   Input/select value, placeholder, detail val
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
| Hero | `--dense-font-hero` | 16px | 600 max | One object/route identity in a full detail context or standard detail drawer |
| F0 | `--dense-font-overlay` | 14px | 600 | Page-authored overlay heading or full-page form head (`xf-head`) |
| F1 | `--dense-font-data` | 12px | 400/500 | Table cells, core links, business identifiers |
| F2 | `--dense-font-nav` | 13px | 500/600 active | Custom navigation labels and compact business chips |
| F3 | `--dense-font-title` | 12px | 600 | Section titles, VXE column headers, subgroup headings |
| F4 | `--dense-font-field` | 12px | 500 | Page-authored field/filter labels |
| F4 Control | `--dense-font-control` | 12px | 400/500 | Page-authored read-only values such as `.detail-field__val` |
| F5 | `--dense-font-aux` | 11px | 400/500 | Helper text, metadata, pagination summary |
| F6 | `--dense-font-micro` | 10px | 400/500 | Units, sequence micro text, compact counters; never normal status text |

Aliases:

- `--dense-font-page-head` → `--dense-font-overlay` (F0)
- `--dense-font-label` → `--dense-font-title` (F3)

Exceptions:

- A true page/detail hero may use the shared `--dense-font-hero` token, max **16px/600**, only when visually separated from normal fact rows. Do not create page-local hero size values.
- In a dense `dds-hero` key-facts row, all fact values use F1 12px. Stronger lead facts use weight/placement, not a larger size inside the same row.
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
- Hero fact values: F1 12px / `color-text-1`.
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
| | Input / select / placeholder | GI native small | framework-owned | framework-owned | framework-owned |
| | Query / reset buttons | GI native small | framework-owned | framework-owned | framework-owned |
| **Toolbar / status (zone-l3)** | Tab, action button | GI native small | framework-owned | framework-owned | framework-owned |
| | Badge (`.stab-badge`) | F6 Micro | 10px | 600 | semantic |
| **Table (zone-l4)** | Cell data | F1 Data | 12px | 400 | `color-text-2` |
| | Primary identifiers | F1 Data | 12px | 500 | `color-text-1` |
| | Column header | F3 Title | 12px | 600 | `color-text-2` |
| | Status pill | F5 Aux | 11px | 600 | semantic |
| **Pagination** | Summary, page info | F5 Aux | 11px | 400 | `color-text-3` |
| **Detail read-only** | Field label (`.detail-field__label`) | F4 Field | 12px | 500 | `color-text-3` |
| | Field value (`.detail-field__val`) | F4 Control | 12px | 400/500 | `color-text-1` |
| | Section title | F3 Title | 12px | 600 | `color-text-1` |
| **Detail editable form** | Arco label + control + placeholder | GI native small | framework-owned | framework-owned | framework-owned |
| **Overlay** | Modal / Popover / body / footer / Tooltip | GI native | framework-owned | framework-owned | framework-owned |
| **Page form head** | Title (`xf-head`) | F0 Overlay | 14px | 600 | `color-text-1` |

### Same Component Rule

The same component type must not change text size because it appears in a different business module.

- `a-input` / `a-select` / `a-date-picker` / `a-input-number` / `a-textarea` keep GI native small typography in filter rows, modal forms, drawer forms, and advanced query drawers.
- `a-form-item` labels keep GI native typography; page-authored `.filter-field__label` uses F4.
- Read-only `.detail-field__val` stays F4 Control 12px everywhere (same as editable controls).
- Buttons, tabs, segmented controls, pager triggers, and drawer footer buttons keep GI native small typography everywhere.
- Pager total/helper/meta stays F5 Aux 11px everywhere.

Do not justify a second size system by saying a component is in a drawer, a detail panel, a table cap, or a specific page.

### Allowed Exceptions

These are limited exceptions and should stay rare:

- shell/brand typography outside business modules, such as app logo or brand mark
- icon graphics that use `--dense-icon-action` or F6 micro sizing as shapes, not as text
- micro counters and units that intentionally use F6 10px; normal status pills stay F5 11px

Outside these cases, prefer tokens over hard-coded `10px/11px/12px/13px`.

## Component Typography Map

Use this table as the fast lookup for implementation and review.

| Component / surface | Text role | Token | Size |
|---------------------|-----------|-------|------|
| Arco form controls and placeholders | editable value | GI native small | framework-owned |
| Arco dropdown/options | overlay option | GI native small | framework-owned |
| `a-form-item` label | field label | GI native | framework-owned |
| `.filter-field__label` | field label | `--dense-font-field` | 12px |
| `.detail-field__label` | readonly field label | `--dense-font-field` | 12px |
| `.detail-field__val` | detail field value (read-only) | `--dense-font-control` | 12px |
| Arco buttons / tabs / segmented / pager | navigation/action | GI native small | framework-owned |
| `detail-section__title` | structure title | `--dense-font-title` | 12px |
| Advanced-filter section heading | structure title | `--dense-font-title` | 12px |
| `form-subgroup__title` | structure title | `--dense-font-title` | 12px |
| Table header | structure title | `--dense-font-title` | 12px |
| Table body text | data | `--dense-font-data` | 12px |
| Modal / drawer / Tooltip | overlay chrome/content | GI native | framework-owned |
| `s-pill` | auxiliary status | `--dense-font-aux` | 11px |
| badge / seq micro text | micro | `--dense-font-micro` | 10px |
| Icon-only action icon | icon graphic | `--dense-icon-action` | 14px graphic |

Decision shortcut:

- If users **read or edit business content** (form, detail, table cell, link), default to **12px**.
- If it is a **custom navigation label**, default to **13px**; Arco actions stay GI-native.
- If it is **helper/meta**, default to 11px.
- If it is **micro state/count**, default to 10px.

**Zone rules:**

- Filter + detail/form + **table data**: **all 12px**; hierarchy via weight/color only.
- Custom toolbar navigation labels: **13px**; Arco actions stay native.
- Overlay chrome stays GI-native and must remain visibly distinct from body content.
- Do not mix 12px and 13px within the same table row or form row.

## Form And Filter Typography

| Role | Token | Color | Weight |
|------|-------|-------|--------|
| Field label | F4 12px | `color-text-2` | 500 |
| Entered/selected value | F4 Control 12px | `color-text-1` | 500 |
| Placeholder | F4 Control 12px | `color-text-3` | 400 |

Page-authored filter labels and read-only detail fields share F4 roles. Editable Arco form controls keep GI native small typography.

## Overlay And Popup Typography

Arco portals keep GI-owned typography. The hierarchy below is a review expectation, not an instruction to override portal internals:

| Surface | Typography |
|---------|------------|
| Modal / Popover title | GI native overlay title |
| Modal / Popconfirm body | GI native overlay content |
| Select / dropdown / cascader options | GI native popup content |
| Modal / popconfirm footer buttons | GI native small action text |
| Tooltip | GI native tooltip text |

Rules:

- Modal title must remain visually distinguishable from modal body through GI's native hierarchy.
- Select trigger and dropdown option must remain compatible and readable without page/global internal overrides.
- Do not override `.arco-modal-*`, `.arco-select-*`, dropdown, tooltip, or popconfirm internals globally.
- F6 10px is for units, sequence text, and compact counters only — not status pills, buttons, or dropdown options.

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

- `class="detail-form"` on `<a-form>` — identifies the business form and may own layout only.
- `size="small"` on every Arco control — prevents Arco medium 14px leak.
- Do not use raw `<label class="xf-label">` in new modals; use `a-form-item`.

## Hard Bans

- No hardcoded `14px` / `15px` / `16px` in custom page text — use tokens; framework-native typography remains untouched.
- No `font-weight: 700/800` in business UI.
- No implicit medium controls in business forms — always declare `size="small"`.
- No form/filter label-value-placeholder drift (12/13/11 in one row).
- No page-authored overlay title weaker than its body; GI-native titles remain untouched.
- No table header smaller than table body (both 12px; header is 600).
- No placeholder with same weight/color as entered value.
- No all-caps UI labels unless the data itself is a code.
