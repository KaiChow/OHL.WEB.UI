---
name: arco-vxe-ui
description: Executable UI and interaction delivery skill for Vue 3 + TypeScript + Arco Design Vue + VXE Table enterprise back-office applications. Use when designing, reviewing, rewriting, or implementing SaaS pages and business features — product quality, workflow, state, permission, error, and real-route verification work.
---

# Arco VXE UI Skill

Executable UI and interaction contract for Vue 3 + TypeScript + Arco Design Vue + VXE Table enterprise back-office applications.

Source: `.agents/skills/arco-vxe-ui/`. After edits run `npm run sync-ui-skill`.

## Product Outcome

Build enterprise back-office software that is credible in a customer or financing demo and dependable in daily office work. Quality comes from business truth, short workflow paths, complete interaction states, restrained hierarchy, and reproducible evidence. Decoration cannot compensate for a fake action, missing failure path, wrong domain model, or weak work surface.

When requirements compete, decide in this order: business efficiency, information clarity, operational safety, system consistency, visual quality, then decoration. Never trade a higher priority for a lower one.

No evidence means no sellable claim.

## Before Code

Use the smallest path that covers the task:

1. Any UI: read `references/arco-first.md` and `references/theme-contract.md`.
2. New page, page rewrite, or material layout/interaction change: create/update typed `pageSpec.ts` from `references/page-spec-contract.md` before Vue template work.
3. Requirement-only input: inspect the repository and business request, confirm only unresolved business semantics that would materially change the result, then design the UI/UX through the selected page authority. Do not ask the user to choose spacing, component, or layout decisions already owned by this skill.
4. New menu or uncertain archetype: use `references/domain-routing.md`, then select one primary authority: `list-page.md`, `detail-form.md`, `full-page-form.md`, `master-data.md`, or `dashboard.md`.
5. Click, request, permission, mutation, or state transition: read `references/feature-delivery-contract.md` plus only the affected surface authority.
6. Screenshot, Figma, or prototype: complete `references/prototype-to-ui-contract.md` before steps 2-5; translate it into a professional proposal instead of copying it, and surface unresolved business decisions with a recommended default.
7. Financing, sales, demo, productization, `高级感`, `质感`, or `设计感`: read `references/visual-system.md` Design Sense Gate; for commercial release claims also apply `references/product-grade-evaluation.md` as a blocking gate.
8. Any detail, create/edit, master-detail, or complex business workspace: read `references/module-patterns.md`; its typed module manifest is required even when the page has no visual artifact.
9. Read helpers such as `filter-layout.md`, `table.md`, `actions.md`, `feedback.md`, `icons.md`, `typography.md`, and `overlay-dimensions.md` only when that surface is present.

If business object, user job, legal action, API behavior, or permission source cannot be proven from the repository or user input, do not invent it. Preserve the boundary visibly and report the missing contract.

## Implementation Order

1. Arco props, slots, layout, and native behavior.
2. GI and existing `--dense-*` semantic tokens.
3. Grep-proven business semantics and shared Vue components that do not reskin framework internals.
4. A shared capability when reuse is proven.
5. Minimal page-local shell/flex/overflow CSS only.

Do not use markdown example classes as APIs. Shared behavior belongs in a real Vue component or composable. `global.css` is limited to the base reset, layout/dimension tokens, and framework-neutral business semantics.

## Commercial Definition Of Done

A material UI/interaction task is complete only when all applicable statements are true:

- The first viewport identifies the business object, key state, current risk or queue, and next useful action.
- High-frequency work is directly reachable; risky or destructive work is separated, permission-aware, and confirmed.
- Every implemented business action has visibility, enablement, request/pending, success, failure-preservation, and refresh behavior.
- Applicable loading, empty, no-permission, validation, business-error, network/slow, long-data, duplicate-submit, and partial-failure states are reproducible and recoverable.
- The rendered route has one clear owner for identity, command, data, feedback, totals, and primary action; no nested cards or duplicate summaries fake structure.
- Real-route inspection proves layout, overflow, focus, feedback locality, and state behavior at required viewports.
- Keyboard order, accessible names, visible focus, and 200% zoom preserve the primary job and recovery paths.

Any failed applicable item blocks `sellable-saas-grade`; a target in `pageSpec.ts`, prose checklist, build, or green linter cannot waive it.

## Hard Constraints

- GI is the only Arco baseline/palette; no theme adapter or page-local component skin.
- vxe-table appearance is owned by `src/styles/vxe-theme/` (business tokens injected into official `--vxe-*` variables) plus the global `border`/`stripe` defaults in `main.ts`; that directory is the only place allowed to declare `--vxe-*` variables or touch `.vxe-*` selectors. Outside it, Global CSS must not target `.arco-*`, `.vxe-*`, framework data attributes, or declare `--vxe-*` variables. Use public props/slots/configuration and scoped layout CSS.
- Use `vxe-table`, never `a-table`.
- Main-list and child-table roles are declared by the page specification and VXE public configuration, never a prescribed CSS class name. Table look (borders, stripe, row height, colors) comes from the global theme and the `size` prop; the global default size is `mini` (high-density system), so pages omit `size` unless a documented override (`small` detail rows, `medium` standard lists) is needed; pages must not set `border="none"`, row heights, or any table appearance CSS.
- Status: `.s-pill[data-s]`; never color the whole row by status or rely on color alone.
- Arco form and business controls inherit the app-wide `small` default; Arco controls rendered inside `vxe-table` rows must explicitly use `size="mini"` (the mini row content box is 24px — `small` clips); one `type="primary"` per action scope.
- Row actions are text buttons carrying business verbs (no icon-only guessing). Expose only proven frequent, low-risk actions that remain readable on one line without competing with business data; move the rest and all list danger actions to the `···` More menu with danger confirmation. When one clear next action exists it may keep primary emphasis; supporting actions and `···` stay neutral at rest, so the column never becomes an all-blue command strip. The `···` trigger is the only icon-only button in the column. Main-list row actions are start-aligned in a stable order; conditional actions must not recenter the remaining controls.
- Business object and user job decide fields; never transplant fields across unrelated modules.
- Do not implement a business action until its smallest complete feature contract exists.
- Do not claim UI quality from source inspection alone.

## Reference Implementation

`--dense-*` tokens, `.s-pill[data-s]`, typed `pageSpec.ts` and feature-contract infrastructure, and `scripts/check-spec.js` are this repository's reference implementation of the contract. The rules are the contract; the symbols are replaceable. A project adopting this skill must provide equivalent infrastructure: a semantic token layer, VXE public configuration for the applicable table role, typed page-spec and feature-contract helpers, and a static checker that gates routed pages.

## Verification

For skill changes: run `npm run validate-ui-skill`, then `npm run sync-ui-skill`.

For UI code: run `node scripts/check-spec.js` and `npm run build`. The checker discovers routed `src/views` pages, colocated `pageSpec.ts` files, and project feature contracts; a new business route must enter the same gate without script path edits. When visual or interaction quality is in scope, inspect the real route at `1024x768`, `1366x768`, one wide desktop viewport at least 1440px wide, and 200% zoom; add deterministic state scenarios required by the page spec. Commercial claims must pass all gates in `product-grade-evaluation.md` with recorded evidence.

Follow `.cursor/rules/adversarial-review.mdc` before delivery. Report only evidence actually produced and list remaining blockers or unverified states.

## Growth Control

Do not fix a weak result by adding a reference, duplicate checklist, slogan, or page-specific recipe. Fix order:

1. repair the implementation;
2. extract or extend a reused Arco/shared capability;
3. change the single existing authority;
4. delete superseded prose.

The validator freezes reference count and key-document budgets. A new authority requires consolidation or deletion first.
