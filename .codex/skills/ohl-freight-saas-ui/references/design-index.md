# Design Index

Use this file to decide which references to load for a given task.
All references are local to `.codex/skills/ohl-freight-saas-ui/references/`.

---

## Always Load First

For any page or component task, load these two first:

- `visual-tokens.md` — Arco theme color tokens, **weak border rules**, **small radius standard**, shadows, spacing, typography
- `component-patterns.md` — Arco Design component sizes and usage rules

---

## List Page Layout

Load when building any business list page (业务单, 财务列表, 客户列表, etc.):

- `page-patterns.md` — zone order, CSS class reuse, drawer pattern, forbidden patterns
- `table-patterns.md` — vxe-table setup, column styles, row actions
- `query-patterns.md` — search panel layout, advanced filter panel

---

## Table and vxe-table

Load when working on table styling, column design, or row interaction:

- `table-patterns.md`
- `visual-tokens.md` (for Arco theme tokens)

---

## Query / Filter

Load when working on search panels or advanced filter:

- `query-patterns.md`
- `component-patterns.md` (for control sizes)

---

## Status Display

Load when rendering status tags, status filter chips, or status color mapping:

- `status-system.md` — freight status vocabulary, color map, statusColorMap/statusTextMap

---

## Detail Drawer / Modal Form

Load when building a detail drawer, edit form, or modal:

- `page-patterns.md` — drawer width rules, `ds-*` class system, anchor nav pattern
- `form-patterns.md` — column grids, field layout, repeatable rows, required field strategy
- `component-patterns.md` — drawer, modal, form, tabs sections
- `visual-tokens.md` — spacing and theme surface rules

---

## Long-Session / Fatigue-Sensitive Design

Load when reviewing overall page quality or designing for sustained daily use:

- `density-fatigue.md` — background neutrality, color frequency limits, spacing rhythm, animation rules

---

## New Business Module

Load all references when starting a new module from scratch:

- `visual-tokens.md`
- `component-patterns.md`
- `page-patterns.md`
- `table-patterns.md`
- `query-patterns.md`
- `status-system.md`
- `form-patterns.md`
- `density-fatigue.md`
- `project-architecture.md`
- `acceptance-checklist.md`

---

## Design Spec (设计规范)

The `设计规范/` directory contains background design principles.
Load only when validating overall direction or product positioning:

- `设计规范/1.设计总纲/1.1-设计目标.md`
- `设计规范/1.设计总纲/1.2-设计定位.md`
- `设计规范/1.设计总纲/1.3-设计DNA.md`

Do NOT load the `0.md` files in chapters 2–9 — they are outline skeletons, not spec content.
