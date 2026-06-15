# Acceptance Checklist

Run through this before final delivery. Every item must pass.

---

## Visual Quality (质感)

- [ ] Content area uses Arco theme fill (`var(--color-fill-2)`), not custom hard-coded color.
- [ ] Search panel uses Arco bg/border and compact spacing; no decorative custom skin.
- [ ] Table wrap (`.table-wrap`) uses Arco bg/border with at most subtle shadow.
- [ ] Operation bar uses Arco background/fill, not custom gradient skin.
- [ ] Status tags use `.status-dot` + `a-tag` with correct Arco color name.
- [ ] Table header is styled (theme fill bg, bold `var(--color-text-1)`) — not browser-default.
- [ ] Links and primary identifiers are visually distinct (bold, `rgb(var(--primary-6))`).
- [ ] Row hover is visible using Arco fill background, not invisible.
- [ ] Selected row has left blue marker (`inset 3px 0 0 rgb(var(--primary-6))`).
- [ ] No raw null/undefined shown in cells — always display `-`.

## Compactness (紧凑)

- [ ] All query controls use `size="small"`, not medium or large.
- [ ] Table uses `size="mini"` with `class="freight-table"`.
- [ ] Table row height is 31px (via CSS variable, not overridden to something larger).
- [ ] Operation bar height ≤ 42px.
- [ ] Search panel height ≤ 120px in normal state.
- [ ] Status filter row height ≤ 40px.
- [ ] Pagination is top-right inside operation bar, not below table.
- [ ] No large KPI dashboard cards on list pages unless explicitly requested.
- [ ] No oversized margins or paddings between zones.
- [ ] Custom CSS is limited to layout, density, vxe-table alignment, and missing interaction states.

## Professional Interaction (交互专业)

- [ ] Transport mode shows as segmented tab group (`.transport-tabs`), not a select.
- [ ] Status filter shows as chip group (`.segmented-filter` + `.filter-chip`), not tabs component.
- [ ] Advanced query pattern matches field count: ≤15 fields → inline panel; 50+ fields → right-side drawer (`adv-filter-drawer`) with scroll+anchor nav, NOT tab-switching. Never a modal.
- [ ] Advanced filter groups are categorized (单号/客户角色/运输节点/时间/业务标记).
- [ ] Active filter count badge shows on "更多" button.
- [ ] Row actions: max 2 visible buttons, rest in dropdown.
- [ ] Success/error feedback uses `Message.success()` / `Message.error()`, not alert.
- [ ] Drawer uses `unmount-on-close` to reset state.

## Display Logic (显示合理)

- [ ] Status column is leftmost (after seq and order no), not buried on the right.
- [ ] Primary identifiers (order no, business no) come before secondary fields.
- [ ] Route shown as `POL → POD` with `.route-arrow`, not in a single concatenated string.
- [ ] Container numbers use `.table-container-text` (badge style), not plain text.
- [ ] Service items use `.table-service-text` (badge style), not plain text.
- [ ] Amounts use `.amount-text` with `font-variant-numeric: tabular-nums`.
- [ ] HBL / MBL use `.table-secondary-link`, visually distinct from plain text.
- [ ] Simple detail (≤20 fields, read-only): uses `.detail-header` + `.detail-grid` 2-column layout.
- [ ] Full-screen editable detail (50+ fields): uses `ds-*` class system (`ds-topbar` / `ds-body` / `ds-scroll` / `ds-anchor` / `ds-footer`). Width is `calc(100vw - 248px)`, not `100%`.
- [ ] Anchor nav (`ds-anchor-track`) present for full-screen forms with 5+ sections; active item updates on scroll.
- [ ] Full-screen detail footer (`ds-footer`) is fixed at bottom, not inline.
- [ ] Freight status terms are industry-standard (待订舱/已放行/运输中), not generic.

## Architecture

- [ ] Page `index.vue` only orchestrates — no large inline template logic.
- [ ] Columns config is in `config/` file, not hardcoded in the template.
- [ ] Status maps (`statusColorMap`, `statusTextMap`) are in `config/`, imported where needed.
- [ ] Mock data is in `mock/` file, not inline in component.
- [ ] List state, filter state, and pagination state are in a composable.
- [ ] Route registered in `src/router/modules/`.
- [ ] Menu config matches actual route.

## Verification

- [ ] Build passes (`npm run build` or `vite build` with no errors).
- [ ] Page renders without console errors.
- [ ] Table renders with data and correct column widths.
- [ ] Advanced filter panel opens/closes correctly.
- [ ] Detail drawer opens on row click and shows correct data.
