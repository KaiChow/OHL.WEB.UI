# Page Archetypes

## Purpose

Choose the correct page structure before writing UI. A large freight SaaS system with hundreds of menus cannot rely on one generic layout.

Every page must be classified by archetype, then implemented with its matching structure.

Archetypes are reusable structures, not fixed field templates. After choosing an archetype, fill it with the current business object's identity, state, working fields, and actions from `module-patterns.md`.

## Archetype A: Operational List / Workbench

Use for high-frequency lists such as business orders, customer pool, bills, warehouse receipts, trucking tasks.

Required structure:

1. Optional segment slot: transport mode, order type, settlement type, warehouse, bill type, customer scope, or another real business scope.
2. Dense search/filter slot.
3. Scope/status/action slot.
4. VXE Table dominant work area.
5. Table cap with right-side pagination, column config, and table-only utilities.

Rules:

- Table is the primary work area.
- Pagination belongs in the table cap/right area, not bottom.
- Total count belongs to pagination when pagination is visible; do not duplicate it as an extra table summary.
- Create/submit is primary; refresh/settings are utilities.
- Do not add page title bands.
- Table columns must be selected from the object identity and user job. Do not reuse another module's columns.

Read also: `list-page.md`, `table.md`, `actions.md`.

## Archetype B: Detail Drawer / Business Detail

Use for opening a record from a list without losing list context.

Required structure:

1. Header identity slot: status, primary number/name, company/context.
2. Key facts slot: 3-6 facts that explain the object.
3. Optional milestone bar using domain terms.
4. Scrollable business sections.
5. Sticky footer actions.

Rules:

- Do not repeat header summary in a right sidebar.
- Use sections for business groups, not decorative cards.
- Module header left is title only; header right is actions only.
- `dds-hero` is a key-facts area. It does not always mean route, ETD, ETA, or carrier.

Read also: `detail-form.md`, `actions.md`.

## Archetype C: Create / Edit Form

Use for full creation flows when data entry is the main task.

Required structure:

1. Compact header with object type and current draft state.
2. Required-core fields needed to create the object.
3. Business grouped form sections.
4. Repeating sub-entity modules chosen by object type: cargo, documents, fees, contacts, locations, declarations, lines, or logs.
5. Sticky footer actions.

Rules:

- Keep users oriented with business group labels, not oversized page titles.
- Place counts and totals inside module body/summary, not module title.
- Use validation states that point to the missing business field.
- Do not hide required core fields behind collapsed panels.
- Do not show any repeated-entity, file, location/path, finance, timeline, or other domain module unless the object owns that data.

Read also: `full-page-form.md`, `form-rules.md`, `upload.md`.

## Archetype D: Master Data / Configuration

Use for master-data and configuration objects. Examples: customer files, routes, carriers, warehouses, dictionaries, permissions.

Required structure:

1. Search/filter layer.
2. List table or left tree + right detail form.
3. Stable editing panel or drawer.

Rules:

- Configuration pages may use lower density than operational workbenches, but still avoid marketing spacing.
- Delete/disable actions require confirmation.
- Show effective state and last update metadata when useful.

Read also: `master-data.md`, `permissions.md` (roles), `feedback.md`.

## Archetype E: Finance / Reconciliation

Use for receivable/payable bills, reconciliation, write-off, settlement.

Required structure:

1. Business scope and date filter.
2. Amount summary row only when it supports decisions.
3. VXE Table with fixed amount columns and batch operations.
4. Detail drawer for bill lines and audit trail.

Rules:

- Amounts use right alignment and tabular numbers.
- Currency must be visible.
- Risk/overdue states use semantic status, not full-row color.
- Batch actions must show selected count and require confirmation when irreversible.

## Archetype F: Warehouse / Inventory

Use for inbound, outbound, stock query, shelf management.

Required structure:

1. Warehouse/location scope.
2. Quick scan/search input when barcode or SKU is central.
3. VXE Table with quantity, location, status, exception columns.
4. Operation drawer for inbound/outbound adjustments.

Rules:

- Quantity and location are primary business data.
- Highlight shortage/difference with semantic status only.
- Preserve high density for repeated scanning and checking.

## Archetype G: Dashboard / Analysis

Use for management overview, operation analytics, finance analysis.

Required structure:

1. Time/scope controls.
2. KPI row with limited high-value metrics.
3. Charts only when they answer a management question.
4. Drill-down table for details.

Rules:

- Dashboards may have more visual spacing than operational pages, but still use Arco tokens and restrained color.
- Do not overuse decorative charts.
- Every metric must have a business owner and time range.

Read also: `dashboard.md`, `table.md` (drill-down), `feedback.md`.

## Archetype H: Modal / Confirmation

Use only for focused decisions or small forms.

Rules:

- Do not put 50-field advanced search in a modal.
- Do not use modal for large business detail forms.
- Use drawer or inline expansion for complex, repeated work.

## Archetype Selection Checklist

Before designing:

1. Define the business object.
2. Define the user's job on this page.
3. Is the user primarily scanning many records? Use A.
4. Is the user inspecting one record while preserving list context? Use B.
5. Is the user entering or correcting a full business object? Use C.
6. Is the data mostly dictionary/configuration? Use D.
7. Is money/reconciliation central? Use E.
8. Is stock/location/physical goods central? Use F.
9. Is management trend/summary central? Use G.
10. Is the task a narrow confirmation? Use H.
