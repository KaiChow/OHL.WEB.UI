---
name: freight-arco-ui
description: Project UI and interaction delivery skill for FE.OHL.WEB.UI. Use when designing, reviewing, rewriting, or implementing Vue 3 + TypeScript + Arco Design Vue + VXE Table freight SaaS pages and business features, especially product-quality, workflow, state, permission, error, and real-route verification work.
---

# Freight Arco UI Skill

Executable UI and interaction contract for `FE.OHL.WEB.UI`.

Source: `.agents/skills/freight-arco-ui/`. After edits run `npm run sync-freight-skill`.

## Product Outcome

Build freight operations software that is credible in a customer or financing demo and dependable in daily office work. Quality comes from business truth, short workflow paths, complete interaction states, restrained hierarchy, and reproducible evidence. Decoration cannot compensate for a fake action, missing failure path, wrong domain model, or weak work surface.

No evidence means no sellable claim.

## Before Code

Use the smallest path that covers the task:

1. Any UI: read `references/arco-first.md` and `references/theme-contract.md`.
2. New page, page rewrite, or material layout/interaction change: create/update typed `pageSpec.ts` from `references/page-spec-contract.md` before Vue template work.
3. Existing page without a visual artifact: read `references/existing-project-modernization.md` and one primary page authority.
4. New menu or uncertain archetype: use `references/domain-routing.md`, then select one primary authority: `list-page.md`, `detail-form.md`, `full-page-form.md`, `master-data.md`, or `dashboard.md`.
5. Click, request, permission, mutation, or state transition: read `references/feature-delivery-contract.md` plus only the affected surface authority.
6. Screenshot, Figma, or prototype: complete `references/prototype-to-ui-contract.md` before steps 2-5.
7. Financing, sales, demo, productization, `高级感`, or `质感`: apply `references/product-grade-evaluation.md` as a blocking release gate.
8. Read helpers such as `filter-layout.md`, `table.md`, `actions.md`, `feedback.md`, `icons.md`, `typography.md`, and `overlay-dimensions.md` only when that surface is present.

If business object, user job, legal action, API behavior, or permission source cannot be proven from the repository or user input, do not invent it. Preserve the boundary visibly and report the missing contract.

## Implementation Order

1. Arco props, slots, layout, and native behavior.
2. GI and existing `--dense-*` semantic tokens.
3. Grep-proven shared freight/VXE patterns.
4. A shared capability when reuse is proven.
5. Minimal page-local shell/flex/overflow CSS only.

Do not use markdown example classes as APIs. Shared classes must exist in `src/styles/global.css` or shared Vue code.

## Commercial Definition Of Done

A material UI/interaction task is complete only when all applicable statements are true:

- The first viewport identifies the business object, key state, current risk or queue, and next useful action.
- High-frequency work is directly reachable; risky or destructive work is separated, permission-aware, and confirmed.
- Every implemented business action has visibility, enablement, request/pending, success, failure-preservation, and refresh behavior.
- Applicable loading, empty, no-permission, validation, business-error, network/slow, long-data, duplicate-submit, and partial-failure states are reproducible and recoverable.
- The rendered route has one clear owner for identity, command, data, feedback, totals, and primary action; no nested cards or duplicate summaries fake structure.
- Real-route inspection proves layout, overflow, focus, feedback locality, and state behavior at required viewports.

Any failed applicable item blocks `sellable-saas-grade`; a target in `pageSpec.ts`, prose checklist, build, or green linter cannot waive it.

## Hard Constraints

- GI is the only Arco baseline/palette; no theme adapter or page-local component skin.
- Use `vxe-table`, never `a-table`.
- Main list grid: `workbench-table`; detail child grid: `detail-mini-vxe` with density modifier.
- Status: `.s-pill[data-s]`; never color the whole row by status or rely on color alone.
- Business controls use explicit `size="small"`; one `type="primary"` per action scope.
- Row actions use icon + tooltip inside `row-actions`; list danger actions live in More + confirm.
- Business object and user job decide fields; never transplant shipment/order fields into unrelated modules.
- Do not implement a business action until its smallest complete feature contract exists.
- Do not claim UI quality from source inspection alone.

## Verification

For skill changes: run `npm run validate-freight-skill`, then `npm run sync-freight-skill`.

For UI code: run `node scripts/check-spec.js` and `npm run build`. When visual or interaction quality is in scope, inspect the real route at `1366x768`, `1024x768`, and one wide desktop viewport; add deterministic state scenarios required by the page spec. Commercial claims must pass all gates in `product-grade-evaluation.md` with recorded evidence.

Follow `.cursor/rules/adversarial-review.mdc` before delivery. Report only evidence actually produced and list remaining blockers or unverified states.

## Growth Control

Do not fix a weak result by adding a reference, duplicate checklist, slogan, or page-specific recipe. Fix order:

1. repair the implementation;
2. extract or extend a reused Arco/shared capability;
3. change the single existing authority;
4. delete superseded prose.

The validator freezes reference count and key-document budgets. A new authority requires consolidation or deletion first.
