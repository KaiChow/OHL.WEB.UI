# Typography And Internationalization

## Goal

Typography must support a dense international freight SaaS system used for long daily sessions.

The type system must be readable for Chinese, English, codes, dates, amounts, ports, vessel/voyage, HBL/MBL, container numbers, and multilingual customer names.

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

## Size Scale

Use the global F1-F6 tokens. Do not hard-code page-specific font sizes.

| Level | Token | Size | Weight | Use |
|-------|-------|------|--------|-----|
| F1 | `--dense-font-data` | 13px | 400/500 | Table cells, core links, business identifiers |
| F2 | `--dense-font-nav` | 13px | 500/600 active | Buttons, tabs, chips, segmented controls |
| F3 | `--dense-font-title` | 12px | 600 | Section titles, VXE headers, drawer titles, compact group headings |
| F4 | `--dense-font-field` | 12px | 500 | Form labels, filter labels, field names |
| F4 Control | `--dense-font-control` | 12px | 400/500 | Form/filter input values, select values, textarea values, placeholders |
| F5 | `--dense-font-aux` | 11px | 400/500 | Helper text, metadata, summary labels |
| F6 | `--dense-font-micro` | 10px | 400/500 | Badges, units, sequence micro text |

Exceptions:

- A true page/detail hero may use one local hero token, max 18px/600, only when it is visually separated from normal fact rows.
- In a dense `dds-hero` key-facts row, all fact values use F1 13px. The primary route may be stronger by weight and placement, but should not jump to a larger size inside the same fact group.
- Brand/logo shell may use larger or heavier text, but never copy shell typography into business modules.
- Icons use icon size tokens, not text size tokens.

## Weight Rules

- Business UI maximum weight is 600.
- Dense table body values default to 400.
- Use 500 only for primary identifiers, links, numeric totals, selected options, and next-decision values.
- Labels default to 500.
- Helper text defaults to 400.
- Do not use `font-weight: 700/800` inside business modules, tables, forms, drawers, filters, or toolbars.
- Do not use font weight alone to indicate status, risk, or exception. Use semantic status components.
- In main workbench tables, avoid making every cell `color-text-1 + 500`; it creates a black sheet. Default cells use `color-text-2 + 400`, while primary object codes, customer/party names, route, and key quantities can use stronger roles.
- If a page feels like colors are "disabled" or "black only", first check selected-state styling and table body default weight before adding more primary color.

## International Text Expansion

Design for 1.3-2x text expansion compared with Chinese.

- Do not fixed-width buttons by Chinese label length.
- Do not truncate business-critical labels such as vessel/voyage, customer, destination, or document type.
- Use vertical form labels for dense multilingual forms.
- Use `min-width` plus ellipsis/title for table columns.
- Do not use negative letter spacing.
- Do not scale font size by viewport width.
- Do not rely on icon-only meaning unless tooltip or accessible label exists.
- Dense action areas such as filter command panels must survive translated action text. Use flexible widths, ellipsis with `title`/tooltip, or icon + accessible label; never depend on two-character Chinese labels fitting a fixed button.

## Codes, Numbers, Dates

Use mono or tabular numeric behavior for values users compare.

| Value | Rule |
|-------|------|
| Order no, HBL, MBL, SO, PO, container no | Use `.mono` or mono stack; keep full value available with tooltip/title |
| Amount, qty, weight, volume | Use `font-variant-numeric: tabular-nums`; right align in tables |
| Dates/times | Use tabular numbers; keep one display format per page |
| Port/country codes | Uppercase is allowed when it matches business data |
| Long customer/company names | Normal sans font; ellipsis with title; do not mono |

## Detail Header Typography

Detail header facts must not all look like code.

- Use mono only for order numbers, HBL/MBL, SO/PO, container numbers, and similar identifiers.
- Route ports are business values, not technical codes by default. In dense key-facts rows, use normal sans F1 13px with stronger weight/placement instead of larger font size.
- Dates in hero facts use tabular numeric behavior, not necessarily mono.
- Carrier, vessel/voyage, customer, and company names use normal sans font.
- Hero fact labels use F5/meta color; hero fact values use F1/core value color.
- Within the same `dds-hero` fact row, route, ETD/ETA, carrier, vessel/voyage, and customer values must share the same value size.
- Only the primary route or primary object identity may be stronger than normal F1, and the difference should come from position, weight, or grouping.

## Attachment Typography

Attachment modules need a clear reading order:

1. Document type name: F1/F3 strength, core text color.
2. Required/single/multiple/status markers: F5/F6 auxiliary or semantic tag.
3. File name: primary link color and F1 data weight.
4. Size/uploader/upload time: F5 auxiliary color.
5. Empty file reason: F5 auxiliary; required-missing reason may use warning semantic color.

Do not make document type, file name, upload state, and helper text the same visual weight.

## Line Height

- Dense table cell: 1.35-1.45.
- Form input value: match control height; avoid vertical clipping.
- Textarea: 1.45.
- Helper text: 1.4.
- Section title: 1.4.

## Form And Filter Typography

Form fields have three different text roles. In this project, they use one size and differ by color/weight.

Reason: list filters and detail forms are high-frequency work surfaces. Mixing label 12px, value 13px, and placeholder 11px creates uneven rows, weak internationalization, and visual noise.

| Role | Token | Color | Weight | Rule |
|------|-------|-------|--------|------|
| Field label | F4 `--dense-font-field` 12px | `color-text-2` | 500 | Stable field name, same in list filters and detail forms |
| Entered/selected value | F4 Control `--dense-font-control` 12px | `color-text-1` | 500 | User's actual query/form value, must be easiest to read inside the control |
| Placeholder/hint | F4 Control `--dense-font-control` 12px | `color-text-3` | 400 | Input guidance only, lower priority than real values |

Rules:

- Filter labels, detail form labels, input values, select values, textarea values, and placeholders use 12px.
- Placeholder must never look like entered data; keep the same size but use `color-text-3` and weight 400.
- Real values use `color-text-1` and weight 500 when they are editable or decision-critical.
- Filter labels and detail form labels share F4. Do not make list labels 11px and detail labels 12px.
- Table data remains F1 13px. Do not apply table typography to form controls.
- Placeholder copy must be specific to the field: `请输入业务员`, `请选择装箱方式`, `业务单号 / HBL / MBL`.
- Avoid vague placeholder copy such as `请输入`, `请选择`, `模糊搜索`, unless the label already makes the exact target obvious and space is constrained.
- For internationalization, keep labels visible and let placeholders be short examples, not the only explanation of the field.

## Overlay And Popup Typography

Arco renders many surfaces in a **portal** (popconfirm, modal, select dropdown, dropdown menu, cascader, date panel, message). They do not inherit page-scoped form CSS. They must be normalized in `global.css`.

| Surface | Body / options | Actions |
|---------|----------------|---------|
| Popconfirm / Modal body | F4 Control 12px | Footer buttons F2 Nav 13px |
| Select / Dropdown / Cascader options | F4 Control 12px (same as trigger) | — |
| Tooltip | F5 Aux 11px | — |
| Message / Notification | F4 Control 12px | — |

Rules:

- Select trigger value and dropdown option text must be the **same** size and weight (`--dense-font-control` + `--dense-weight-control`).
- Popconfirm question text and its Cancel/OK buttons must not differ by more than one typography level; buttons use Nav 13px, never `btn-size-mini` 10px.
- `global.css` must override `.arco-popconfirm-footer`, `.arco-select-dropdown .arco-select-option`, and `.arco-modal-footer` centrally. Do not fix per page in scoped CSS.
- F6 10px is for badges/units/seq only — not for buttons or dropdown options.

Arco `size` prop: see `component-size.md`. Business UI uses `size="small"` only; omitting `size` equals forbidden `medium`.

## Hard Bans

- No arbitrary `14px`, `15px`, `16px` business text to create emphasis.
- No `font-weight: 700/800` in business UI.
- No custom page font stack that bypasses the global stack.
- No truncating form labels by default.
- No Arco default 14px form label leaking into detail/list forms.
- No form/filter label-value-placeholder size drift such as 12/13/11.
- No placeholder using the same weight/color as an entered value.
- Overlay surfaces (popconfirm, modal, select/dropdown/cascader panels, message) must use the same tokens as their triggers: body/options F4 Control 12px, action buttons F2 Nav 13px. Do not let Arco default 14px or `btn-size-mini` 10px leak into overlays.
- No all-caps UI labels unless the business data itself is a code.
- No letter spacing below `0`.
