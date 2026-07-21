# Responsive Operational Layout

## Supported Baseline

FE.OHL.WEB.UI is a desktop freight operations product with a supported minimum viewport width of 1280px. The application currently enforces that baseline in `src/styles/global.css`.

Do not document tablet or mobile layouts as supported while the application still has `min-width: 1280px`. Product-grade review must still audit narrower split-window use and record the current limitation instead of hiding it.

| Viewport | Project contract | Primary goal |
|----------|------------------|--------------|
| `1920x1080` | wide desktop evidence | expose more columns/rows without stretched chrome |
| `1440x900` | standard desktop evidence | stable default composition |
| `1366x768` | primary laptop release gate | daily commands and core data remain usable |
| `1280x720` | current lower desktop bound | protect commands, table width, and no page overflow |
| `1024px split-window audit` | current product-grade gap until compact shell is implemented | evaluate multi-window workflow honestly |

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

## Multi-Window Target

Multi-window work is a real freight scenario: users compare documents, email, tracking, and finance data beside the application.

- A sellable product must record the usable behavior at approximately 1024px content width.
- Until FE.OHL.WEB.UI implements a compact/collapsible shell below 1280px, mark split-window support as an open gap; do not claim it passes.
- The target compact mode collapses the sider to a rail/drawer, keeps route identity and primary actions visible, moves low-frequency filters/actions into existing drawers/menus, lets status controls scroll locally, and preserves VXE horizontal scrolling.
- Compact mode does not shrink typography, control hit areas, or status text, and does not turn the data table into cards.
- Mobile is not implied by split-window support.

## Smaller-Viewport Implementation Contract

This project or another consumer may claim smaller-width support only after all of these are explicit and implemented:

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
