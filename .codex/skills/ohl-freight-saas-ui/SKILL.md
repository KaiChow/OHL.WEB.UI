---
name: ohl-freight-saas-ui
description: Use when designing, reviewing, or implementing FE.OHL.WEB.UI freight forwarding SaaS pages, Vue3 route/menu modules, Arco Design layouts, vxe-table lists, dense list pages, search panels, advanced filters, tab navigation, mock data, or UI architecture that must follow the OHL project design specs.
---

# OHL Freight SaaS UI

Use this skill to work on `FE.OHL.WEB.UI` as a professional freight forwarding SaaS prototype.
Every page must be: **compact · professional · visually refined · easy to use**.

## Project Source

Primary project root: `E:\Gitlab.Work.Code\FE.OHL.WEB.UI`

Design spec path: `<project-root>\设计规范`

Key source files:
- `src/styles/global.css` — all shared CSS classes and visual tokens. Read it when in doubt about a class name.
- `src/layouts/BasicLayout.vue` — shell structure (sider + tabnav + content).
- `src/views/orderManage/saleOrder/` — reference implementation for list pages.

## Workflow

### Step 1 — Always load these two references first

Before any implementation or design task, load:

- `references/visual-tokens.md` — exact color values, shadows, spacing, typography
- `references/component-patterns.md` — Arco Design component sizes and usage rules

These two apply to every task without exception.

### Step 2 — Load task-specific references

Use `references/design-index.md` to find which additional references apply to the task:

- List page → `page-patterns.md` + `table-patterns.md` + `query-patterns.md`
- Status display → `status-system.md`
- Loading / empty / error → `states-patterns.md`
- New module → load all references
- Architecture / routing → `project-architecture.md`

### Step 3 — Design before implementation

Decide:
- Page zone order and component structure
- Table columns, widths, and fixed columns
- Which CSS classes from `global.css` to reuse
- Status color mapping
- Loading, empty, and error state handling

Do not write code until this is clear.

### Step 4 — Implement conservatively

- Reuse existing CSS classes from `global.css`. Do not duplicate them with scoped styles.
- Keep `index.vue` as an orchestration layer only.
- Separate: components / composables / config / mock / types.
- Use `size="small"` on all Arco controls in list pages.
- Use `class="freight-table"` on every vxe-table.

### Step 5 — Verify against quality checklist

Run through `references/acceptance-checklist.md` before answering.
If any item fails, fix it before delivery.

## Hard Rules

**Visual quality:**
- Every page content area uses the gradient background, not flat white.
- Search panel and table wrap always have layered box-shadow.
- Status always uses `a-tag` + `.status-dot`, never plain text.
- Empty values always display as `-`, never raw null or blank.

**Button hierarchy:**
- Each toolbar or action group has exactly ONE primary button.
- Refresh / icon-only actions use default type, never primary.
- Destructive actions use `status="danger"`, placed away from the primary button.

**Compactness:**
- `size="small"` on all list page controls without exception.
- `size="mini"` on vxe-table.
- Pagination top-right inside operation bar, never below the table.
- No large KPI dashboard cards on list pages unless explicitly requested.

**Interaction:**
- Transport mode: segmented tab group (`.transport-tabs`), not a select.
- Status filter: chip group (`.segmented-filter`), not an Arco tabs component.
- Advanced query: inline expandable panel, never a modal.
- Every async operation: button loading state + success/error Message feedback.
- Destructive operations: always `a-popconfirm`, never `window.confirm()`.

**Freight terminology:**
- Use industry terms: 待订舱 / 已放行 / 运输中 / 已到港, not generic 进行中 / 处理中.
- Keep business fields independent: OrderNo, DcgNo, HblNo, MblNo, ContainerNo are separate columns.

**Architecture:**
- Do not put a full business page into one large Vue file.
- Do not invent menus or routes that don't correspond to real pages.
- Do not use modal for advanced query.
- Do not add decorative left-side color bars on table rows by default.

## Delivery Style

When implementing: make the changes, verify build passes, check the acceptance checklist.
When designing only: provide zone structure, component list, column spec, and interaction model — no code modification.
