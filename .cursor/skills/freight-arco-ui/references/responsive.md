# Responsive Operational Layout

## Supported Baseline

FE.OHL.WEB.UI is a desktop freight operations product with a supported minimum viewport width of 1280px. The application currently enforces that baseline in `src/styles/global.css`.

Do not document 1024px, tablet, or mobile layouts as supported while the application still has `min-width: 1280px`. A portable project using this skill must declare its own supported baseline before it adopts smaller breakpoints.

| Viewport | Project contract | Primary goal |
|----------|------------------|--------------|
| `>= 1440px` | one-line visible filters and one-line workflow/status region | expose more business data |
| `1280-1439px` | compact stable gaps; status groups may scroll inside their own region | protect commands and table width |
| `< 1280px` | unsupported by the current project | do not claim responsive coverage |

## 1280px Workbench Rules

- The visible filter row and primary workflow row remain compact. Do not use `@media (max-width: 1280px)` to stack the workflow at the exact supported baseline.
- Filter fields keep a readable minimum width. The primary identifier/keyword field receives the largest allocation; lower-frequency filters move to the advanced drawer.
- Query, reset, and advanced-filter entry stay together.
- Status controls use `min-width: 0` and internal horizontal scrolling before the page gains another full-width band.
- Utility icons stay icon-only with tooltips when width is constrained.
- The VXE table may scroll horizontally. The shell, command surface, and card structure may not create browser-level horizontal overflow at 1280px.
- Do not shrink font tokens, labels, or hit targets to make the layout fit.

## Wide Desktop Rules

- Wider viewports expose more columns, status items, and table rows.
- Do not scale fonts or controls with viewport width.
- Do not stretch field widths until labels and controls lose grouping; use weighted columns and bounded widths where needed.
- Do not add decorative whitespace, KPI bands, or extra cards merely because space is available.

## Portable Smaller-Viewport Extension

Another project may support smaller widths only after all of these are explicit:

```text
supported_min_width:
shell_behavior:
filter_behavior:
workflow_behavior:
table_behavior:
overlay_behavior:
verification_viewports:
```

That extension belongs to the consuming project. It must not be inferred from FE.OHL.WEB.UI class names or added as unverified core behavior.

## Forbidden Fallbacks

- No `transform: scale(...)` to fit modules.
- No arbitrary font-size reduction below typography tokens.
- No page-scoped hard width for the entire status group.
- No hiding active state or daily workflow controls only because 1280px is tighter.
- No claim of mobile/tablet support without implementation and real-viewport verification.
