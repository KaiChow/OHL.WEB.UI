# Acceptance Checklist

Run through this before final delivery. Every item must pass.

---

## Visual Quality (质感)

- [ ] Content area uses gradient background, not flat white or flat gray.
- [ ] Search panel has layered box-shadow (not flat border only).
- [ ] Table wrap (`.table-wrap`) has elevated shadow, not just a border.
- [ ] Operation bar uses gradient background (`linear-gradient(180deg, #fff 0%, #f5f9fe 100%)`).
- [ ] Status tags use `.status-dot` + `a-tag` with correct Arco color name.
- [ ] Table header is styled (gradient bg, bold text `#2f4058`) — not browser-default.
- [ ] Links and primary identifiers are visually distinct (bold, `#126dff`).
- [ ] Row hover is visible (`#f2f7ff`), not invisible.
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

## Professional Interaction (交互专业)

- [ ] Transport mode shows as segmented tab group (`.transport-tabs`), not a select.
- [ ] Status filter shows as chip group (`.segmented-filter` + `.filter-chip`), not tabs component.
- [ ] Advanced query is inline panel below search, not a modal.
- [ ] Advanced filter groups are categorized (单号/客户角色/运输节点/时间/业务标记).
- [ ] Active filter count badge shows on "更多" button.
- [ ] Row actions: max 2 visible buttons, rest in dropdown.
- [ ] Success/error feedback uses `Message.success()` / `Message.error()`, not alert.
- [ ] Merge toggle (switch) is available when table has rowspan groups.
- [ ] Drawer uses `unmount-on-close` to reset state.

## Display Logic (显示合理)

- [ ] Status column is leftmost (after seq and order no), not buried on the right.
- [ ] Primary identifiers (order no, business no) come before secondary fields.
- [ ] Route shown as `POL → POD` with `.route-arrow`, not in a single concatenated string.
- [ ] Container numbers use `.table-container-text` (badge style), not plain text.
- [ ] Service items use `.table-service-text` (badge style), not plain text.
- [ ] Amounts use `.amount-text` with `font-variant-numeric: tabular-nums`.
- [ ] HBL / MBL use `.table-secondary-link`, visually distinct from plain text.
- [ ] Detail drawer has `.detail-header` (order no + status) before the field grid.
- [ ] Detail fields use `.detail-grid` 2-column layout, not a flat list.
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
