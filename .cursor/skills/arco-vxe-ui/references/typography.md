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
F0 Major structure  14px / 600   Modal/Popover title, page/full-form head
F1 Data             12px / 400-500   Table body, key links, identifiers
F2 Nav/module       13px / 500-600   Top-level detail module, custom navigation, compact chips
F3 Structure title  12px / 600   Section title, VXE column header
F4 Form label       12px / 500   Filter label, form label
F4 Control          12px / 400-500   Input/select value, placeholder, detail val
F5 Aux              11px / 400   Pagination, meta, helper
F6 Micro            10px / 500   Badge, pill, seq
```

## Font Family
Use the product's single global font stack. Do not introduce web fonts, page-local font families, or per-component font overrides.

Declaration owners and stack:

The UI stack has exactly two declaration owners: the base rule in `global.css` and the mirrored `@vxe-font-family` token in `src/styles/vxe-theme/`. Pages, shared components, and scoped CSS never declare `font-family`. Identifiers use the same product stack; numeric alignment uses `font-variant-numeric` only.

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Noto Sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, "Open Sans", "Segoe UI", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
```

Ordering rules:

- Latin/UI families come first so digits, codes, and Latin words inside Chinese sentences keep one consistent rhythm; the first CJK-capable family then renders the Chinese glyphs.
- CJK candidates are ordered by small-size clarity at 11-13px: PingFang/Hiragino on macOS, HarmonyOS Sans SC / Source Han Sans / Noto CJK where installed, then Microsoft YaHei as the guaranteed Windows family.
- A CJK family must always precede the generic `sans-serif`; without one, Chinese text can fall back to legacy bitmap-class rendering (for example SimSun), which fails the clarity requirement at dense sizes.
- Do not reorder to prefer a Latin family over CJK rendering, do not append project families, and do not set per-module fonts to fix look; report readability problems against this stack instead.

Do not create a separate identifier stack. Preserve the global stack and use `.tabular` only when numeric columns need aligned glyph widths.

## Size Scale (F0–F6)

Use the global tokens. Do not hard-code page-specific font sizes.

| Level | Token | Size | Weight | Use |
|-------|-------|------|--------|-----|
| Hero | `--dense-font-hero` | 16px | 600 max | One object/route identity in a full detail context or standard detail drawer |
| Display | `--dense-font-display` | 20px | 600 max | One hero identity or first-run empty state, only on a route declaring `presentationTarget: 'demo'` |
| F0 | `--dense-font-overlay` | 14px | 600 | Page-authored overlay heading or full-page form head (`xf-head`) |
| F1 | `--dense-font-data` | 12px | 400/500 | Table cells, core links, business identifiers |
| F2 | `--dense-font-nav` | 13px | 500/600 active | Top-level detail module, custom navigation labels, compact business chips |
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
- The Display tier (`--dense-font-display`, max **20px/600**) exists only on routes declaring `presentationTarget: 'demo'`: one hero identity or first-run empty state per route, never inside table, form, filter, or list rows, and never to rescue weak hierarchy on a `daily-ops` page.
- In a dense `dds-hero` key-facts row, all fact values use F1 12px. Stronger lead facts use weight/placement, not a larger size inside the same row.
- Brand/logo shell may use larger text; never copy shell typography into business modules.
- Icons use `--dense-icon-action` (16px graphic), not text tokens.

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

- Route all user-visible business copy, validation, empty/error states, Tooltip text, and accessible names through the project's existing internationalization mechanism; do not replace established keys with hardcoded Chinese.
- Install one app-level locale owner and pass the same locale to the component provider so pagination, dates, validation, and page copy do not switch independently. Persist only a supported locale code and update the document language.
- Translate complete messages instead of concatenating sentence fragments. Variables, plural forms, and grammar belong to the locale message.
- Format dates, times, numbers, percentages, and currencies with the active Locale; declare the business timezone whenever the value is not unambiguously local.
- Do not fixed-width buttons by Chinese label length.
- Do not truncate business-critical labels.
- Use vertical form labels for dense multilingual forms.
- The same business page uses one semantic field/column layout in every locale. Never create locale-specific grid spans or a second route; verify 1.3–2× expansion and change a semantic width role only when the longest legal label/value proves the role was wrong in every locale.
- Use `min-width` plus ellipsis/title for table columns.
- Prefer logical layout properties for new direction-sensitive page CSS; do not claim RTL support until the rendered workflow has been verified.
- Do not use negative letter spacing or viewport-based font scaling.
- Release verification covers the default and longest supported locale at `1024`, `1366`, and wide desktop widths, including query actions, table operations, overlays, empty/error copy, and accessible names.

## Codes, Numbers, Dates

| Value | Rule |
|-------|------|
| Order/document/container/tracking/reference IDs, hashes, API keys, checksums, IP/MAC, raw logs/code | Global product stack; preserve original case, zero letter spacing, full value in Tooltip/title, copy affordance when frequent |
| Amount, percentage, qty, weight, volume, phone | Global stack + `font-variant-numeric: tabular-nums`; right align numeric table values |
| Dates/times | Global stack + tabular numbers; one display format per page |
| Long customer/company names | Normal sans; ellipsis with title |

## Detail Header Typography

- Technical identifiers and document numbers inherit the global product stack.
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
| **Pagination** | Entire Arco pagination | GI native mini | framework-owned | framework-owned | framework-owned |
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
- Buttons, tabs, segmented controls, and drawer footer buttons keep GI native small typography everywhere; table-owned pagination uses GI native `mini`.
- Page-authored selection summaries and toolbar metadata stay F5 Aux; all text inside `a-pagination` remains framework-owned and is never forced to F5 through internal selectors.

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
| Arco buttons / tabs / segmented | navigation/action | GI native small | framework-owned |
| Table-owned `a-pagination` | result navigation | GI native mini | framework-owned |
| `BusinessDetailModule` top-level title | module structure | `--dense-font-nav` | 13px |
| `BusinessDetailChild` repeated-child title | nested identity | `--dense-font-title` | 12px |
| `detail-section__title` | structure title | `--dense-font-title` | 12px |
| Advanced-filter section heading | structure title | `--dense-font-title` | 12px |
| `form-subgroup__title` | structure title | `--dense-font-title` | 12px |
| Table header | structure title | `--dense-font-title` | 12px |
| Table body text | data | `--dense-font-data` | 12px |
| Modal / drawer / Tooltip | overlay chrome/content | GI native | framework-owned |
| `s-pill` | auxiliary status | `--dense-font-aux` | 11px |
| badge / seq micro text | micro | `--dense-font-micro` | 10px |
| Icon-only action icon | icon graphic | `--dense-icon-action` | 16px graphic |

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
- No display-tier (`--dense-font-display`) text outside a route declaring `presentationTarget: 'demo'`.
- No `font-weight: 700/800` in business UI.
- No implicit medium controls in business forms — always declare `size="small"`.
- No form/filter label-value-placeholder drift (12/13/11 in one row).
- No page-authored overlay title weaker than its body; GI-native titles remain untouched.
- No table header smaller than table body (both 12px; header is 600).
- No placeholder with same weight/color as entered value.
- No all-caps UI labels unless the data itself is a code.
