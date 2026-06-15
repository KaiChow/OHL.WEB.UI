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
- `src/styles/global.css` — minimal shared layout/density/vxe-table bridge styles. Keep it small and theme-driven.
- `src/layouts/BasicLayout.vue` — shell structure (sider + tabnav + content).
- `src/views/orderManage/saleOrder/` — reference implementation for list pages.

## Workflow

### Step 1 — Always load these two references first

Before any implementation or design task, load:

- `references/visual-tokens.md` — Arco theme color tokens, shadows, spacing, typography
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
- Which Arco components to use directly and which minimal CSS hooks are needed
- Status color mapping using Arco `a-tag` color names
- Loading, empty, and error state handling

Do not write code until this is clear.

### Step 4 — Implement conservatively

- Prefer Arco component defaults and theme variables. Add CSS only for layout, density, vxe-table bridge styles, or missing interaction states.
- Keep `index.vue` as an orchestration layer only.
- Separate: components / composables / config / mock / types.
- Use `size="small"` on all Arco controls in list pages.
- Use `class="freight-table"` on every vxe-table.

### Step 5 — Verify against quality checklist

Run through `references/acceptance-checklist.md` before answering.
If any item fails, fix it before delivery.

## Design Positioning

**Style: Enterprise SaaS Premium Dense (Cargo SaaS Premium Dense)**

Keywords: Dense · Professional · Premium · Efficient · Structured

Design references (quality anchors): **Flexport · Project44 · Atlassian Jira · SAP Fiori**

DNA — PESDP (must satisfy all five):
- **P**rofessional — industry freight terminology, not generic SaaS labels.
- **E**fficient — 3 seconds to find info, 10 seconds to complete an action.
- **S**tructured — unified 3-level information hierarchy on every page.
- **D**ense — density between traditional ERP and modern SaaS. Maximize first-screen information value.
- **P**remium — quality comes from hierarchy, rhythm, spacing system, and status system. NOT from large whitespace, gradients, or decorative effects.

Premium quality sources (in order): information hierarchy → layout rhythm → spacing system → status system.

Forbidden styles: traditional ERP · Excel grid · flat field list · heavy borders · large whitespace · card stacking · decorative gradients · glow effects · frosted glass.

## Hard Rules

**Visual quality:**
- Color system follows Arco Design + `@arco-themes/vue-gi-demo` theme variables. Do not introduce an independent hard-coded palette.
- Do not create decorative custom skins when Arco components already provide the visual state.
- Custom gradients, heavy shadows, decorative borders, and one-off color fills are forbidden unless the user explicitly asks for a visual exploration.
- Status always uses `a-tag` + `.status-dot`, never plain text.
- Empty values always display as `-`, never raw null or blank.

**Button hierarchy:**
- Each toolbar or action group has exactly ONE primary button.
- Business list toolbar order is: primary create action → batch actions → import/export/print → refresh/settings utility icons.
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
- Advanced query — choose by field count:
  - ≤15 fields → inline expandable panel below search bar (`.advanced-filter-panel`).
  - 16–50 fields → right-side drawer, 700px, grouped tabs.
  - 50+ fields → right-side drawer (`adv-filter-drawer`, 700px) with **continuous scroll + left anchor nav** (`adv-nav` / `adv-form-scroll`). Never a modal. Never tab-switching that hides groups.
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
