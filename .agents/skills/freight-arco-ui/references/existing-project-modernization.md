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

Target 70-80% first-viewport data ownership when the table is the main job. Below 65% is a blocking issue unless the page is an exception/review archetype.

### Layout Quality Gate

For a table-dominant list workbench, enforce these relationships before visual polish:

- the application shell stays subordinate to the work surface; desktop sider width normally remains 192-216px and header height 44-52px unless a product constraint proves otherwise;
- the page normally has two physical surfaces: one command surface for query/actions/status and one dominant data surface; logical rows may share a surface but cards must not nest;
- default query + action + status height stays near the `filter-layout.md` target and must not become a form wall;
- at 1280px, the primary command path remains compact and does not stack at the breakpoint itself;
- the table host owns 70-80% of usable first-viewport height; below 65% blocks acceptance;
- duplicate totals, risk counts, queue labels, titles, instructions, and table context each have one visible owner;
- utility controls stay near the data they affect; primary workflow controls stay visible and do not move into More merely to make the page sparse;
- wide desktop adds data visibility or breathing room, not larger fonts, decorative whitespace, or stretched control chrome.

Count physical surfaces and measure rendered heights. A source tree that looks tidy but renders three equal-weight horizontal bands still fails this gate.

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
