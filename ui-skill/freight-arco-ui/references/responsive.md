# Responsive Operational Layout

Responsive design in this project protects operational work, not marketing composition. Small screens must preserve task order, clickability, and table dominance. Do not solve limited width by removing spacing, shrinking text, or letting modules overflow.

## Breakpoints

| Viewport | Layout contract | Primary goal |
|----------|-----------------|--------------|
| `>= 1440px` | one-line filter + one-line merged toolbar/status | maximum density |
| `1280-1439px` | compact gaps; status/tab groups may horizontally scroll inside their own area | prevent right-side clipping |
| `1024-1279px` | filter row may wrap; merged toolbar may become two rows; status group owns the second row when needed | keep actions clickable |
| `< 1024px` | low-frequency filters stay in drawer; visible filters are 1-2 columns; toolbar buttons may horizontally scroll or move into More | protect table readability |

## List Workbench Rules

- The visible filter row may wrap below `1280px`; it must not compress label/control spacing until labels touch controls.
- Filter fields keep a minimum readable width. Combined keyword fields get the widest allocation; lower-frequency filters move to the drawer.
- Query/reset/filter actions stay together. On small screens they align to the end of the wrapped row instead of becoming detached buttons.
- `merged-bar` may use two rows below `1280px`: business actions and scope tabs first, status counts on the second row.
- Status count groups must use `flex: 1 1 auto`, `min-width: 0`, and internal horizontal scrolling. They must not force the page or toolbar to create a browser-level horizontal scrollbar.
- Utility icons such as refresh stay at the right edge of the toolbar row when width allows; if not, they remain icon-only and do not push status tabs out of view.
- The table is allowed to scroll horizontally. Toolbar/filter modules should not create unexpected page-level horizontal scrollbars.

## Button And Tab Compression

- Do not reduce font sizes for small screens. Use wrapping, grouping, or horizontal scroll inside the module.
- Do not remove the visible gap between field label and control.
- Do not replace business labels with unclear abbreviations unless the product domain already uses that abbreviation.
- Low-frequency toolbar actions move into `More` before reducing primary action hit areas.
- Active scope/status state remains visible. If a status group scrolls, the active item should still be reachable within the group.

## Required CSS Hooks

- `filter-card__slim-row` controls visible filter wrapping.
- `filter-card__inline-actions` controls query/reset/filter alignment.
- `merged-bar` controls toolbar/status wrapping.
- `toolbar-group` contains business actions.
- `stab-group` contains scope/cargo segmentation.
- `stat-tab-group` contains status counts and must support internal horizontal scroll.
- `toolbar-aside` contains utilities and selected count.

## Forbidden Fallbacks

- No `transform: scale(...)` to fit modules.
- No arbitrary font-size reduction below the typography tokens.
- No page-scoped hard widths for status groups.
- No hiding status counts only because the viewport is narrow.
- No browser-level horizontal scroll caused by filter or toolbar modules.
