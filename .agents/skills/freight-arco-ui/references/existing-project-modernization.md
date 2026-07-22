# Existing Project Modernization

## Purpose

Use this reference when improving an existing Vue 3 + TypeScript + Arco Design Vue + VXE Table product **without** a screenshot, Figma file, or target mockup.

**This is the default delivery path for FE.OHL.WEB.UI.** Absence of UI design is normal, not an excuse to invent page-local skins or grow skill markdown.

The existing page is evidence, not the design authority. Preserve correct business behavior and domain structure, but do not preserve weak layout, inherited theme debt, or accidental page-local patterns.

## Source-Of-Truth Order

1. Business object, user job, permissions, and working behavior.
2. `theme-contract.md` and official Arco token roles.
3. Page archetype and **one** task-specific skill reference.
4. Shared freight/VXE patterns that pass `arco-first.md` and exist in `global.css` (grep-proven).
5. Existing implementation only where it satisfies the first four layers.

Do not treat current CSS, current DOM, or the most polished existing page as the standard by default.

## No-Reference Intake

Before editing, capture this block:

```text
project_stack:
route_or_surface:
business_object:
primary_users:
user_job:
behavior_to_preserve:
theme_baseline:
existing_shared_layers:
modernization_mode:
first_viewport_evidence:
known_visual_debt:
page_local_css_budget:
target_product_grade:
```

Do not use `artifact-intake-template.md` when no artifact exists. Use it only when the user actually provides a screenshot, prototype, or visual reference.

## Shared Capability Before New Rules

Without design artifacts, quality comes from **reused capability**, not from longer prose.

Allowed work product, in order:

1. Arco props / slots / layout primitives
2. Existing grep-proven shared classes in `src/styles/global.css`
3. A new shared pattern in `global.css` (or a shared Vue shell) only when a second page will need it in the same change set, or reuse is already proven
4. Minimal page-local **layout** CSS for shell/flex/overflow only

Forbidden as the primary fix:

- adding a new skill reference to describe a one-page look
- copying example class names from markdown that `global.css` does not define
- building a private mini design system inside `<style scoped>` (filter/toolbar/table chrome clones)
- claiming sellable quality because `pageSpec.ts` acceptance sentences exist

### Page-Local CSS Budget

For a list/workbench rewrite without design:

- Prefer ≤ ~80 lines of page-scoped CSS, almost all shell/flex/overflow
- If scoped CSS exceeds ~120 lines or defines ≥15 local visual selectors, stop and extract shared structure first, or justify why Arco + shared bridge cannot express the layout
- Do not re-skin Arco Card / Form / Input / Drawer / Button / Dropdown chrome in page scope

## Audit Lanes

### 1. Behavior Freeze

Identify what must not regress:

- visible high-frequency actions;
- filter semantics and Enter/query behavior;
- selection, batch scope, row actions, pagination, and column settings;
- loading, empty, error, permission, and destructive confirmation states;
- route and object-detail entry points.

Visual modernization does not authorize invented API behavior or changed permissions.

### 2. Theme Ownership

Inspect imports, computed variables, `global.css`, and page-scoped `.arco-*` selectors.

Reject the current setup when:

- two Arco baseline styles are imported;
- official variables are redeclared outside the GI stylesheet;
- `global.css` acts as a second component library;
- pages contain independent palettes or shadows/radii;
- VXE colors do not follow the Arco/project theme.

### 3. Skeleton And Work Surface

Measure the rendered page, not only source code.

For table workbenches record:

- viewport and usable content dimensions;
- filter, action/status, table-cap, and table-body heights;
- table work-surface ratio;
- number of visible rows and core columns;
- any breakpoint that activates at the minimum supported desktop width.

Judge the measurement against the single layout threshold in `redesign-calibration.md`; do not restate or alter it here.

### Layout Quality Gate

Evaluate the rendered page against `redesign-calibration.md` and record pass/fail evidence for its surface relationship, first-viewport, shell-budget, and command-surface gates. Do not copy their numeric thresholds into this audit file.

Also record duplicate visible owners, hidden daily controls, unexpected browser-level overflow, and the number of physical surfaces. A tidy source tree does not override rendered evidence.

### 4. Visual Debt

Find and classify:

- repeated floating cards;
- equal-weight page bands;
- duplicate counts or summaries;
- all-blue actions or gray form walls;
- page-local Arco reskins;
- hard-coded color/radius/shadow values;
- wide sidebars or headers that reduce the work surface without adding product value;
- responsive rules that wrap the primary workflow at the minimum desktop width;
- undeclared private class systems that duplicate skill examples.

### 5. Product Narrative

Confirm the first viewport answers:

- What object or queue is this?
- Which records need attention?
- What can the user do now?
- What is the next action?
- Who owns the work?

If the page only presents fields and buttons, it is not product-grade.

## Modernization Modes

Choose one mode and state why:

| Mode | Use when | Allowed change |
|------|----------|----------------|
| `theme-realignment` | skeleton is sound; theme ownership is broken | restore GI as sole baseline/palette, direct aliases, shared bridge, removal of duplicate skins |
| `surface-regrouping` | behavior is sound; zones compete or waste first viewport | merge/split logical bands, move duplicate context, rebalance work surface |
| `skeleton-rewrite` | page archetype or workflow path is fundamentally weak | rebuild page composition while preserving behavior contracts |

Polish-only spacing changes are not a modernization mode when the measured problem is structural.

## No-Design Visual Recipe

Without a mock, use this recipe instead of taste improvisation:

1. **Two surfaces max** on table workbenches: one command surface + one data surface (`redesign-calibration.md`).
2. **Table owns the viewport** — measure; do not estimate from source.
3. **One primary per scope** — query primary in the query group; create primary in the workflow group; never all-blue toolbars (`actions.md`).
4. **Neutral chrome** — GI surfaces, weak hairlines, `s-pill` for state only; no decorative cards or gradients (`visual-system.md`).
5. **Density from tokens** — F4 controls, compact VXE workbench rows, no invented font sizes (`typography.md`, `table.md`).
6. **States are product** — loading / empty / permission / error / long text must be intentional (`feedback.md`).

If the page still feels like gray ERP after this recipe, the defect is usually surface competition or primary/state misuse — regroup surfaces before writing more CSS.

## Contamination Controls

A clean reusable skill must not learn the wrong lesson from one project.

- Page fields remain examples of object slots, never mandatory global content.
- Local class names do not become shared patterns until a second module proves reuse.
- A workaround is not documented as a rule when an Arco prop or official token exists.
- Screenshot-only styling does not enter the core skill.
- Current implementation quirks are removed from references instead of being normalized.
- External or unavailable skills are not dependencies; this skill must be executable on its own.
- Growing skill text is not an allowed substitute for shared UI capability.

## Implementation Order

1. Lock behavior and object mapping.
2. Repair theme ownership.
3. Prefer shared APIs; extract before inventing page-local chrome.
4. Fix page skeleton and first-viewport allocation.
5. Restore required visible workflows.
6. Tune typography, borders, shadows, and states through tokens.
7. Verify at the minimum desktop width and a wide desktop width.
8. Score with `product-grade-evaluation.md` using evidence.

## Acceptance Evidence

```text
modernization_mode:
behavior_preserved:
theme_owner_before:
theme_owner_after:
shared_apis_reused:
page_local_css_lines_before:
page_local_css_lines_after:
removed_visual_debt:
first_viewport_before:
first_viewport_after:
product_grade_before:
product_grade_after:
remaining_overrides:
verification:
```

Blocking rules for no-design delivery:

- Do not claim pass when only `check-spec.js` is green.
- Do not claim `sellable-saas-grade` without a passing build, real-route visual inspection, computed token evidence, and every product-grade dimension at 4 or above.
- Adversarial review without recorded first-viewport / surface evidence is incomplete.
