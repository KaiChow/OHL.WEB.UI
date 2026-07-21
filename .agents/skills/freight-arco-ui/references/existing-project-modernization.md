# Existing Project Modernization

## Purpose

Use this reference when improving an existing Vue 3 + TypeScript + Arco Design Vue + VXE Table product without a screenshot, Figma file, or target mockup.

The existing page is evidence, not the design authority. Preserve correct business behavior and domain structure, but do not preserve weak layout, inherited theme debt, or accidental page-local patterns.

## Source-Of-Truth Order

1. Business object, user job, permissions, and working behavior.
2. `theme-contract.md` and official Arco token roles.
3. Page archetype and task-specific skill references.
4. Shared freight/VXE patterns that pass `arco-first.md`.
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
first_viewport_evidence:
known_visual_debt:
target_product_grade:
```

Do not use `artifact-intake-template.md` when no artifact exists. Use it only when the user actually provides a screenshot, prototype, or visual reference.

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
- responsive rules that wrap the primary workflow at the minimum desktop width.

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

## Contamination Controls

A clean reusable skill must not learn the wrong lesson from one project.

- Page fields remain examples of object slots, never mandatory global content.
- Local class names do not become shared patterns until a second module proves reuse.
- A workaround is not documented as a rule when an Arco prop or official token exists.
- Screenshot-only styling does not enter the core skill.
- Current implementation quirks are removed from references instead of being normalized.
- External or unavailable skills are not dependencies; this skill must be executable on its own.

## Implementation Order

1. Lock behavior and object mapping.
2. Repair theme ownership.
3. Remove duplicate or inert shared rules.
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
removed_visual_debt:
first_viewport_before:
first_viewport_after:
product_grade_before:
product_grade_after:
remaining_overrides:
verification:
```

Do not claim `sellable-saas-grade` without a passing build, real-route visual inspection, computed token evidence, and every product-grade dimension at 4 or above.
