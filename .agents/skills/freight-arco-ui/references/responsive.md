# Responsive Operational Layout

## Supported Baseline

FE.OHL.WEB.UI is a desktop freight operations product with a supported minimum viewport width of **1024px**. The application enforces that baseline in `src/styles/global.css` and switches the shell to its compact desktop mode below `1200px`.

This is split-window desktop support, not tablet or mobile support. Product-grade review must verify the compact shell and work surfaces at 1024px instead of inferring support from CSS alone.

| Viewport | Project contract | Primary goal |
|----------|------------------|--------------|
| `1920x1080` | wide desktop evidence | expose more columns/rows without stretched chrome |
| `1440x900` | standard desktop evidence | stable default composition |
| `1366x768` | primary laptop release gate | daily commands and core data remain usable |
| `1280x720` | compact desktop evidence | protect commands, table width, and no page overflow |
| `1024x768` | supported split-window lower bound | compact shell, local toolbar overflow, and usable fixed table columns |

## Compact Desktop Workbench Rules (1024-1280px)

- The visible filter row and primary workflow row remain compact. At 1024px, low-frequency commands may move into an existing More menu; do not create repeated full-width bands.
- Filter fields keep a readable minimum width. The primary identifier/keyword field receives the largest allocation; lower-frequency filters move to the advanced drawer.
- Query, reset, and advanced-filter entry stay together.
- Status controls use `min-width: 0` and internal horizontal scrolling before the page gains another full-width band.
- Utility icons stay icon-only with tooltips when width is constrained.
- Collapse order is fixed: keep the primary action and active state visible; convert familiar utilities to named icon-only tools; move low-frequency commands into an existing More menu; only then reduce optional visible fields.
- A compact action group must be measured against the adjacent field boundary. Children may not overflow a narrower Grid column or visually cover a control even when the page itself reports no horizontal overflow.
- The VXE table may scroll horizontally. The shell, command surface, and card structure may not create browser-level horizontal overflow at 1024px or 1280px.
- Do not shrink font tokens, labels, or hit targets to make the layout fit.

## Wide Desktop Rules

- Wider viewports expose more columns, status items, and table rows.
- Do not scale fonts or controls with viewport width.
- Do not stretch field widths until labels and controls lose grouping; use weighted columns and bounded widths where needed.
- Do not add decorative whitespace, KPI bands, or extra cards merely because space is available.

## Multi-Window Target

Multi-window work is a real freight scenario: users compare documents, email, tracking, and finance data beside the application.

- A sellable product must record the usable behavior at approximately 1024px content width.
- Below 1200px, the implemented compact shell uses the reduced sider width, keeps route identity and primary actions visible, moves low-frequency filters/actions into existing drawers/menus, lets status controls scroll locally, and preserves VXE horizontal scrolling.
- A page fails split-window support when it depends on a wide-shell-only layout, produces browser-level horizontal scroll, clips the primary command, or hides active conditions without feedback.
- Compact mode does not shrink typography, control hit areas, or status text, and does not turn the data table into cards.
- Mobile is not implied by split-window support.

## Smaller-Viewport Implementation Contract

This project or another consumer may claim support below 1024px only after all of these are explicit and implemented:

```text
supported_min_width:
shell_behavior:
filter_behavior:
workflow_behavior:
table_behavior:
overlay_behavior:
verification_viewports:
```

That extension belongs to the consuming project. Widths below 1024px must not be inferred from FE.OHL.WEB.UI class names or added as unverified core behavior.

## Forbidden Fallbacks

- No `transform: scale(...)` to fit modules.
- No arbitrary font-size reduction below typography tokens.
- No page-scoped hard width for the entire status group.
- No hiding active state or daily workflow controls only because compact desktop is tighter.
- No claim of mobile/tablet support without implementation and real-viewport verification.

## Release Gate

- [ ] At 1024x768, primary identity/query, active scope/state, and the next useful action remain visible.
- [ ] No command wraps, overlaps a neighboring field, or overflows its Grid/Flex owner.
- [ ] Status/navigation overflow is local; table overflow belongs to VXE; browser-level horizontal overflow is absent.
- [ ] Icon-only compact tools retain Tooltip, business-specific `aria-label`, and at least 28x28px target.
- [ ] At wide desktop, fields remain bounded and controls do not stretch merely to consume space.
