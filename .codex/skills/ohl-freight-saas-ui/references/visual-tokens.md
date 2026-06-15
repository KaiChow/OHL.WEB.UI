# Visual Tokens

These are the actual color, spacing, shadow, and typography values used in this project.
Read from `global.css` and Arco Design's `@arco-themes/vue-gi-demo` theme.

## Arco Design CSS Variables (from theme)

Use these token names — they resolve correctly under the gi-demo theme:

```css
/* Text */
var(--color-text-1)   /* primary text #1d2738 */
var(--color-text-2)   /* secondary text #4b5870 */
var(--color-text-3)   /* muted/placeholder #8a9ab0 */
var(--color-text-4)   /* disabled */

/* Background */
var(--color-bg-1)     /* deepest bg */
var(--color-bg-2)     /* card/panel bg = #fff */
var(--color-fill-1)   /* lightest fill */
var(--color-fill-2)   /* subtle fill */
var(--color-fill-4)   /* scrollbar thumb */

/* Border */
var(--color-border-2) /* standard border */
var(--color-neutral-3) /* table border = #e3ebf4 */

/* Brand */
rgb(var(--primary-1)) /* lightest primary tint */
rgb(var(--primary-2)) /* light primary tint */
rgb(var(--primary-3)) /* medium primary tint */
rgb(var(--primary-6)) /* brand primary blue #126dff */
rgb(var(--primary-7)) /* dark primary hover */

/* Gray scale */
rgb(var(--gray-10))   /* near-black text */
```

## Hardcoded Color Constants

When CSS variables are not sufficient, these specific values are used in the project:

```
Page content background:
  linear-gradient(180deg, #f4f7fb 0%, #eef3f8 46%, #edf2f7 100%)

Table header background:
  linear-gradient(180deg, #f7fbff 0%, #eaf2fb 100%)

Operation bar background:
  linear-gradient(180deg, #fff 0%, #f5f9fe 100%)

List filter row background:
  linear-gradient(180deg, #fbfdff 0%, #f6f9fd 100%)

Section bar background:
  linear-gradient(180deg, #f9fcff 0%, #edf4fb 100%)

Search panel background:
  linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,254,0.99) 100%)

Advanced filter side panel:
  linear-gradient(180deg, #f7faff 0%, #f1f5fa 100%)

Table body primary text:   #1e293b
Table header text:         #2f4058
Table header font-weight:  700
Table link primary:        #126dff
Table link secondary:      #256bd6
Table route text:          #334155
Container tag bg:          #f1f5f9   border: #dfe7f0   text: #44546a
Service tag bg:            #eef6ff   border: #d8e9ff   text: #35506b
Action button bg:          #edf5ff   border: #d7e8ff

Table border (column):     #e3ebf4
Table border (header):     #c8d7e8
Table-wrap border:         #cad7e6
Search panel border:       #cfdae8

Row hover background:      #f2f7ff
Row selected background:   #edf5ff
Row selected left marker:  inset 3px 0 0 rgb(var(--primary-6))
Row selected border:       #cfe3ff
Zebra stripe:              #fbfdff
```

## Shadows

```css
/* Table wrap — elevated card */
box-shadow:
  0 16px 34px rgba(15, 23, 42, 0.09),
  0 1px 2px rgba(15, 23, 42, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.88);

/* Search panel */
box-shadow:
  0 10px 24px rgba(15, 23, 42, 0.07),
  0 1px 2px rgba(15, 23, 42, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.92);

/* Advanced filter panel */
box-shadow:
  0 14px 28px rgba(15, 23, 42, 0.08),
  0 1px 2px rgba(15, 23, 42, 0.04),
  inset 0 1px 0 rgba(255, 255, 255, 0.92);

/* Status tag */
box-shadow:
  inset 0 0 0 1px rgba(255, 255, 255, 0.58),
  0 1px 2px rgba(29, 33, 41, 0.04);

/* Active filter chip */
box-shadow:
  0 1px 2px rgba(29, 33, 41, 0.05),
  inset 0 0 0 1px rgba(var(--primary-6), 0.12);

/* Active advanced filter side tab */
box-shadow:
  0 3px 8px rgba(15, 23, 42, 0.06),
  inset 3px 0 0 rgb(var(--primary-6));
```

## Typography

```css
/* Font stack */
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;

/* Monospace (container no, codes) */
font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;

/* Size scale */
12px — table cells, labels, filter chips, tags, auxiliary text
13px — query field labels, advanced filter labels, section bar titles
14px — normal body, query grid
16px — page title, detail drawer title

/* Weight scale */
400 — normal text
500 — route text, HBL/MBL links, file buttons
600 — section bar title, detail field values, table link button
700 — order number button, table header, detail drawer title

/* Number rendering */
font-variant-numeric: tabular-nums  /* for amounts and counts */
```

## Spacing Scale

```
Page content padding:    8px 10px 10px
Search panel padding:    8px 10px 9px
Operation bar padding:   6px 10px
Filter row padding:      6px 10px
Table cell padding:      4px 8px (via --vxe-ui-table-cell-padding-mini)
Detail grid gap:         8px
Detail item padding:     10px
Drawer body padding:     14px
Brand height:            58px
System tabnav height:    42px
Operation bar min-h:     40px
Filter row min-h:        38px
Section bar height:      34px
Table row height:        31px (--vxe-ui-table-row-height-mini)
Status tag height:       18px
Action button height:    22px
Filter chip height:      24px
Transport tab height:    26px
Tabnav tab height:       30px
Advanced filter tab h:   30px
Side menu link height:   36px
Side menu item height:   38px
```

## Border Radius

```
2px  — tabnav tabs (top corners only: 3px 3px 0 0)
4px  — menu items, container text badge
5px  — filter chips, action buttons, transport tabs, advanced filter tabs
6px  — search panel, table-wrap, advanced filter panel, detail items, section bar
50%  — brand mark avatar
```
