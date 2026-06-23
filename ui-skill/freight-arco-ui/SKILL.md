---
name: freight-arco-ui
description: Project UI skill for FE.OHL.WEB.UI. Use when designing, reviewing, or implementing any Vue 3 + TypeScript + Arco Design Vue + @arco-themes/vue-gi-demo + VXE Table freight SaaS page under the PESDP Design System 2.0: Professional, Efficient, Structured, Dense, Premium. Covers list pages, detail drawers, long forms, tabs, toolbars, status pills, table styling, dense layout, color hierarchy, visual quality, and UI规范/不好看/质感/高密度 feedback.
---

# Freight Arco UI Skill

This is the project-level UI delivery contract for `E:\Gitlab.Work.Code\FE.OHL.WEB.UI`.

Highest principle: **PESDP Design System 2.0**.

- Professional: use freight/logistics business language and industry structure.
- Efficient: reduce lookup, thinking, clicks, and error rate.
- Structured: separate primary information, business operation, and auxiliary data.
- Dense: maximize useful information without compression or crowding.
- Premium: create quality through order, hierarchy, consistency, and restraint.

UI priority is always: efficiency > information > interaction > visual decoration.

## First Load

Always read these before changing UI:

1. `src/styles/global.css` - source of truth for tokens and reusable classes.
2. `CLAUDE.md` - concise coding contract and page skeletons.
3. `references/design-principles.md` - PESDP highest-level rules.
4. `references/module-patterns.md` - reusable module slots and anti-hard-coding rules.
5. The relevant reference file below.

Do not copy old page-specific CSS or page-specific field choices. Reuse global classes first, then add only scoped layout glue when a page needs its own grid/flex shell.

The skill must guide many modules, not one fixed page. Always map the business object and user job before choosing layout, fields, actions, or columns.

## Reference Map

Read only the files needed for the task:

| Task | Read |
|------|------|
| Any UI/page/component task | `references/design-principles.md` |
| Any new page or module refactor | `references/module-patterns.md` |
| Freight wording, status, milestone, field naming | `references/domain-language.md` |
| New page/module design, route/menu scale, page type choice | `references/page-archetypes.md` |
| AI-generated page implementation or review | `references/ai-generation-contract.md` |
| Any list/workbench page | `references/list-page.md` |
| Detail drawer, long business form, attachments | `references/detail-form.md` |
| Font, size, numeric/code text, internationalization | `references/typography.md` |
| Color, visual hierarchy, status colors, “too gray / no quality” | `references/visual-system.md` |
| Buttons, toolbar, row actions, permissions | `references/actions.md` |
| VXE Table columns, hover, selection, fixed columns | `references/table.md` |
| Final QA before delivery | `references/checklist.md` |
| Need old long-form design manual | `references/legacy-design-manual.md` |

## Non-Negotiables

- Use Arco components and theme tokens. Do not invent a new color system.
- Use `vxe-table` for all data grids. Do not use `a-table`.
- Use freight terms for freight concepts. Do not use generic internet labels such as `步骤1`, `处理中`, `进行中` when a logistics term exists.
- Classify the page archetype before designing layout. Do not force every page into the same list/detail pattern.
- Do not hard-code `业务单`, route, ETD/ETA, milestones, cargo, or attachment patterns into modules that do not own those concepts.
- Treat classes such as `dds-head`, `dds-hero`, `detail-section`, and `table-card-cap` as structural slots. Their content must be chosen from the current business object.
- Use `src/styles/global.css` classes: `page-root`, `zone-card`, `filter-card`, `toolbar`, `table-wrap`, `detail-section`, `detail-form-grid`, `s-pill`, `row-action-btn`.
- Keep dense layout readable: compact rows and controls, but no zero-spacing compression.
- Do not add page-level `h1 + description` header bands for operational list pages.
- Do not use whole-row status backgrounds. Status color belongs in `.s-pill`, Tag, or status tabs.
- Do not place module counts, stats, helper text, or status text in a module title. Module header left is title only; header right is actions only.
- Use `type="primary"` only for the single main action in a scope.
- Use icon-only row actions with tooltip. More than two direct row actions go into a dropdown.
- Use `apply_patch` for manual file edits.

## Working Protocol

1. Identify business object and user job.
2. Map primary identity, key state, main working data, repeated modules, primary action, and grouped actions.
3. Identify page type: list, detail drawer, full detail, create/edit form, dashboard, modal.
4. Read `references/design-principles.md`, `references/module-patterns.md`, `references/domain-language.md`, then the matching reference file.
5. Inspect existing implementation and `global.css`; prefer existing classes and patterns.
6. Implement with a stable information hierarchy before changing colors.
7. Validate:
   - `npx vite build`
   - visual check at `http://127.0.0.1:9527/#/...` when a dev server is available.
8. Report any unrelated build failures separately.

## Output Standard

For UI work, deliver:

- Business object mapping and page archetype when the task is design/generation.
- Files changed.
- What design rule changed.
- What verification ran.
- Any remaining visual or technical risk.
