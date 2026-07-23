---
name: freight-arco-ui
description: Project UI and feature-delivery skill for FE.OHL.WEB.UI. Use when designing, reviewing, redesigning, rewriting, or implementing any Vue 3 + TypeScript + Arco Design Vue + VXE Table freight SaaS page or frontend business feature under PESDP. Covers list workbenches, detail drawers, forms, overlays, tables, actions, status pills, permissions, API/error behavior, real-route verification, UI taste/质感/不好看 feedback, and skill/spec cleanup.
---

# Freight Arco UI Skill

Use this as the executable UI delivery contract for `FE.OHL.WEB.UI`.

Source: `.agents/skills/freight-arco-ui/`. After edits run `npm run sync-freight-skill` to refresh `.cursor/skills/freight-arco-ui/`.

## Core Contract

Build a modern freight operations workbench: dense business data, restrained Arco/GI visual language, clear hierarchy, visible daily workflow actions, and predictable failure/permission states.

Implementation order is mandatory:

1. Arco-first — props, slots, layout primitives, native interaction.
2. Token-second — GI palette and existing `--dense-*` aliases.
3. Business-pattern-third — freight semantics, workbench slots, VXE bridge.
4. Page-local-css-last — only local shell/flex/overflow gaps.

Do not fix weak UI by adding more skill text. Ship or reuse shared capability first, then document only portable rules.

## Mandatory PESDP Execution Gate

For a new page, page rewrite, or material UI/interaction redesign:

1. Read `references/page-spec-contract.md`.
2. Create/update typed `pageSpec.ts` before editing Vue template.
3. Record concrete Professional / Efficient / Structured / Dense / Premium decisions and measurable acceptance conditions.
4. Read the single-authority references named by the spec.
5. Implement, inspect the real route, and reconcile evidence back to the spec.

Target grade is intent, not proof. `pageSpec.ts`, checklist prose, or a green script do not replace rendered evidence.

## Default Path (No UI Design)

Most tasks have no Figma/screenshot/mock. Use this lean path; do not preload all references.

Read in order:

1. `references/arco-first.md`
2. `references/theme-contract.md`
3. `references/existing-project-modernization.md`
4. `references/redesign-calibration.md`
5. For a new menu or uncertain archetype, read `domain-routing.md`; then read one archetype authority only:
   - list/workbench: `list-page.md`
   - detail/drawer/object workspace: `detail-form.md`
   - full-page form: `full-page-form.md`
   - master/config: `master-data.md`
   - dashboard: `dashboard.md`
6. Surface helpers only when in scope: `filter-layout.md`, `table.md`, `actions.md`, `icons.md`, `overlay-dimensions.md`, `feedback.md`, `component-size.md`.
7. For behavior changes, read `feature-delivery-contract.md` plus the matching surface authority.
8. Grep `src/styles/global.css` only for justified shared APIs; never use it as a design catalog.

Skip `prototype-to-ui-contract.md` unless the user provides a screenshot, Figma, prototype, or visual artifact.

## Artifact Path

When the user provides a visual artifact:

1. Read `prototype-to-ui-contract.md`.
2. Complete its artifact translation block and delivery level.
3. Then continue with the Default Path.

Never code directly from visual similarity.

## Skill Growth Freeze

Do not add a new reference, duplicate gate, or longer checklist to fix weak UI.

Preferred fix order:

1. Create or extend a shared Arco composition, Vue shell, or `global.css` API used by at least two pages.
2. Make pages consume it and delete page-local skins.
3. Add one portable rule to the single authority only after reuse exists.

A larger skill with the same page-local CSS budget is a process failure.

## Non-Negotiables

- GI theme is the only Arco stylesheet/palette; no `theme.css` adapter and no second component skin.
- `global.css` owns direct `--dense-*` aliases, freight status, VXE bridge, and proven shared slots only.
- Use Arco business controls with explicit `size="small"`; never `medium`/`large` in `src/views`.
- Use `vxe-table`, never `a-table`.
- Main list table: `workbench-table`; detail child table: `detail-mini-vxe` with density modifier.
- `detail-mini-vxe` forbids `show-overflow`, checkbox without batch toolbar, and `row-config.height`.
- Status uses `.s-pill[data-s]`; never whole-row status coloring.
- One `type="primary"` per scope.
- Row actions are icon + tooltip inside `row-actions`; list danger actions go into More + confirm.
- Business object and user job decide fields; never copy shipment/order fields into unrelated modules.
- Any click/submit/request/state change needs feature contract keys before behavior code.
- Existing shared class names must be grep-proven before use; markdown example class names are not APIs.

## Working Protocol

1. Classify the task: no-design, artifact, feature behavior, product-grade, or cleanup.
2. Read only the lean required references.
3. Complete `pageSpec.ts` for new pages/material rewrites.
4. Complete feature contracts for behavior changes.
5. Implement Arco-first → tokens → grep-proven shared patterns → minimal local CSS.
6. Prefer extracting shared capability before adding page-local chrome.
7. Run `node scripts/check-spec.js`.
8. Run `npm run build` or `npx vite build` when relevant.
9. Inspect real route at required viewports when UI/layout quality is in scope.

## Delivery Report

Report the path and authorities used, files/shared APIs changed, verification results, real-route evidence when UI quality is in scope, and remaining risks. Never report unproduced evidence.
