# Visual Tokens

Use Arco Design and `@arco-themes/vue-gi-demo` as the source of truth for color.
Do not create a separate OHL color palette with fixed hex values.

---

## Color Rule

Prefer these in order:

1. Arco component semantics: `type="primary"`, `status="danger"`, `a-tag color="orange|blue|green|red|gray|cyan|gold|arcoblue"`.
2. Arco CSS variables from the active theme.
3. Minimal project classes in `src/styles/global.css` for layout, density, and vxe-table alignment.
4. Hard-coded color only when Arco has no token for the visual effect. This should be rare.

When a color is needed, use theme variables:

```css
/* Text */
var(--color-text-1)
var(--color-text-2)
var(--color-text-3)
var(--color-text-4)

/* Background / fill */
var(--color-bg-1)
var(--color-bg-2)
var(--color-fill-1)
var(--color-fill-2)
var(--color-fill-3)
var(--color-fill-4)

/* Border */
var(--color-border-1)
var(--color-border-2)
var(--color-border-3)
var(--color-neutral-3)

/* Brand */
rgb(var(--primary-1))
rgb(var(--primary-2))
rgb(var(--primary-3))
rgb(var(--primary-6))
rgb(var(--primary-7))

/* Semantic colors */
rgb(var(--orange-6))
rgb(var(--blue-6))
rgb(var(--green-6))
rgb(var(--red-6))
rgb(var(--cyan-6))
rgb(var(--gold-6))
rgb(var(--gray-6))
```

---

## Backgrounds

Prefer Arco component backgrounds directly. Use these only when a custom wrapper has no Arco equivalent:

```css
/* Page content */
background: var(--color-fill-2);

/* Panel / toolbar / table card */
background: var(--color-bg-2);

/* Table header */
background: var(--color-fill-1);

/* Active or selected row */
background: rgb(var(--primary-1));

/* Hover row */
background: var(--color-fill-1);
```

Avoid custom background gradients by default. A calm Arco fill is preferred over a decorative surface.

---

## Table Colors

For vxe-table styling, match Arco `a-table` visual language:

```css
--table-text: var(--color-text-1);
--table-sub-text: var(--color-text-2);
--table-muted-text: var(--color-text-3);
--table-border: var(--color-border-2);
--table-header-bg: var(--color-fill-1);
--table-row-hover-bg: var(--color-fill-1);
--table-row-current-bg: rgb(var(--primary-1));
--table-link: rgb(var(--primary-6));
```

Do not use arbitrary blue-gray hex values for table text, borders, links, or row states.

---

## Status Colors

Use Arco tag color names, not custom status CSS palettes:

```typescript
const statusColorMap = {
  pending: 'orange',
  processing: 'arcoblue',
  success: 'green',
  exception: 'red',
  closed: 'gray',
}
```

Status tags must be:

```vue
<a-tag size="small" :color="statusColorMap[value]">
  <span class="status-dot" />
  {{ text }}
</a-tag>
```

---

## Shadows

Prefer Arco's native card/panel feel. Custom shadows are optional and must be subtle.
Use them only when a wrapper needs separation from a dense data area:

```css
/* Panel */
box-shadow:
  0 1px 2px rgba(15, 23, 42, 0.04);

/* Table wrap */
box-shadow:
  0 2px 8px rgba(15, 23, 42, 0.06);
```

---

## Typography

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
```

Use this size scale:

```text
12px — table cells, labels, filter chips, tags, auxiliary text
13px — query labels, advanced filter labels, section titles
14px — body text and normal controls
16px — page or drawer titles
```

Use this weight scale:

```text
400 — normal text
500 — route text, secondary links, file buttons
600 — section titles, important values, table links
700 — order numbers and table headers
```

Use `font-variant-numeric: tabular-nums` for numbers, amounts, counts, and dates.

---

## Spacing

```text
Page content padding:    8px 10px 10px
Search panel padding:    8px 10px 9px
Operation bar padding:   6px 10px
Filter row padding:      6px 10px
Table cell padding:      4px 8px
Drawer body padding:     14px

System tabnav height:    42px
Operation bar min-h:     40px
Filter row min-h:        38px
Table row height:        31px
Status tag height:       18px
Action button height:    22px
Transport tab height:    26px
```

---

## Border Rules (弱边框原则)

This system uses **weak borders** — thin, low-contrast lines for structure without visual weight.

```css
/* Standard container border — always 1px, never 2px+ */
border: 1px solid var(--color-border-2);

/* Inner card divider */
border-top: 1px solid var(--color-border-1);

/* Dashed for soft inner separation */
border-top: 1px dashed #e8edf5;
```

Rules:
- All structural borders: `1px solid var(--color-border-2)`. Never `2px+`.
- Inner separation within a card: `1px dashed` near-white.
- Table cell lines: `1px solid #edf1f8` (lighter than container border).
- Never use borders to create visual weight — use background fills and box-shadow for hierarchy.
- Forbidden: `border: 2px`, hard-coded dark border colors, box-shadow used as a border substitute.

---

## Border Radius (小圆角标准)

Use small, consistent radius. Never use large decorative radius.

```text
Container / card / section:    6px
Modal / large drawer:          6px
Button / input / select:       Arco theme default (≈ 4px) — do not override
Tag / badge:                   Arco default
Table cell:                    0px (square)
Table outer wrapper:           6px
Anchor nav track:              8px
```

Rules:
- Custom wrappers (`.ds-card`, `.ds-section`, `.adv-group`): `border-radius: 6px`.
- Never use `border-radius: 12px` or larger on any business element.
- Do not add large decorative radius to list pages.
- Do not override Arco component radius globally.
- Table cells stay square; only the outer wrapper uses 6px.
