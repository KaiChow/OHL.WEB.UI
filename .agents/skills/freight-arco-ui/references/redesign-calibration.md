# Redesign Calibration

## Purpose

Use this reference when the user is not asking for a small compliance fix, but for **layout redesign, visual polish, stronger UI taste, page rewrite, ordinary-admin cleanup, or "make it feel like a real product"**.

This file defines **how far AI is allowed to change the page skeleton** while still staying inside FE.OHL.WEB.UI and PESDP.

It is also the single authority for cross-page layout quality. Topic references may describe their local structure, but must not redefine the surface-count, first-viewport, or shell-budget rules below.

## Layout Authority

### Surface Relationship

- Use physical surfaces only when they express different ownership. Logical rows may share one Arco surface.
- A table-dominant workbench normally has two physical surfaces: one command surface for query/actions/status and one dominant data surface.
- Do not nest cards, turn every logical row into a floating card, or create three equal-weight horizontal bands.
- Duplicate page title, total, risk count, queue label, instruction, and table context each have one visible owner.
- Utilities stay beside the data they affect; high-frequency workflow actions remain visible.

### First-Viewport Evidence

At the supported 1280px desktop baseline, a normal table workbench should give at least 70% of usable page height to the data surface; about 75% is a calibration target. Below 65% is a blocking layout defect. Taller viewports may exceed 80% naturally and must not gain artificial whitespace to stay inside a range.

Measure the rendered page root and table host. Do not estimate from source code. Record viewport, usable height, command-surface height, data-surface height, ratio, visible rows, and overflow.

The threshold does not apply to detail forms, approval/review pages, exception investigation, dashboards, or overlays; those archetypes still require a clear primary work surface.

### Shell Budget

- The shell stays subordinate to work. At the project desktop baseline, sider width normally remains 192-216px and header height 44-52px unless a product constraint is recorded.
- Page-level title/description bands are not added to high-frequency list workbenches when the app shell already identifies the route.
- Wide screens expose more data or breathing room; they do not scale fonts, controls, or decorative whitespace with viewport width.
- The project supports 1280px and wider desktop layouts. Smaller-width behavior exists only when a project explicitly declares and implements a different baseline in `responsive.md`.

### Command Surface Budget

- Query, actions, and status may be separate logical rows inside one surface.
- The normal query + workflow area stays near 112px; up to about 128px is acceptable when visible daily filters retain clear labels.
- At 1280px the primary command path does not stack. Status groups may scroll inside their own region before another full-width band is added.
- The table may scroll horizontally; the page shell, query area, and workflow bar may not create browser-level horizontal overflow.

## Direction

The project redesign direction is self-contained:

- **method** from `existing-project-modernization.md`
- **visual restraint** from `theme-contract.md` and `visual-system.md`
- **business structure** from the page archetype and freight domain references

Target result:

**Modern Freight Operations Workbench**

Not:

- landing page
- marketing SaaS
- decorative dashboard
- flat gray ERP
- generic domestic admin template

## When To Read

Read this file when the user says or implies:

- `重写这个页面`
- `按新的 skill 改`
- `没设计感`
- `太像后台`
- `普通 admin 味`
- `纯 UI 布局不行`
- `质感不够`
- `重新做版式`
- `不要只改按钮/边框`

Also read it when the page technically follows the existing rules but still feels weak in hierarchy, rhythm, or product identity.

## Core Rule

When the task is redesign, **do not default to structure-preserving polish**.

First decide whether the page needs:

1. **polish only** — same skeleton, better hierarchy
2. **surface regrouping** — same data, different zone relationships
3. **skeleton rewrite** — different top-area model, stronger workflow path

If the problem is really layout weakness, choose `2` or `3`.

## What AI Is Allowed To Change

For redesign tasks, AI may change these without waiting for an extra user confirmation unless the business flow itself would change:

### 1. Query surface model

Allowed moves:

- flat visible filters -> keyword combo + core filters + drawer
- weak equal-width fields -> weighted fields (`span2` for primary identifier)
- separate search strips -> one coherent query surface

Keep:

- high-frequency daily filters visible
- `filter-layout.md` scenario selection

Do not:

- hide daily filters only to look minimal
- create a 3-4 row visible filter wall

### 2. Action / scope / status structure

Allowed moves:

- toolbar + scope row + status row -> one coherent Arco command surface
- weak scattered actions -> grouped workflow actions
- plain tabs -> explicit workflow/status controls

Use this when users work by state all day.

Do not:

- leave actions and status as unrelated strips when they are one workflow
- move status workflow into a `More` menu

### 3. Table entry hierarchy

Allowed moves:

- equal-weight flat columns -> identity-first column order
- single-line business cells -> `cell-two-line`
- passive metadata columns early -> move decision fields forward

Use table order:

1. selection/seq if needed
2. primary identity
3. key status
4. next-decision fields
5. supporting metadata
6. actions

Do not:

- preserve old column order just because the page already had it
- make every code/date/person equally strong

### 4. Top-area emphasis

Allowed moves:

- introduce scope tabs
- introduce workbench pressure/attention grouping
- pull utilities closer to table context
- move pagination/settings into `table-card-cap`

Do not:

- add decorative KPI bars to operational list pages
- duplicate counts in multiple places

### 5. Detail identity band

Allowed moves:

- strengthen `dds-head` and `dds-hero`
- reduce repeated summaries
- regroup sections by working order instead of backend order

Do not:

- add a right summary panel that repeats header facts
- stack heavy cards for every section

## What AI Must Preserve

Even during redesign, these stay fixed:

- `vxe-table` for workbench data grids
- `size="small"` for Arco business controls
- one `primary` per scope
- status through `.s-pill[data-s]`
- white working surfaces, restrained primary usage, no new palette
- freight business object first, visuals second
- daily workflow actions stay short-path and visible

## Workbench Workflow Bar Standard

When a list page has **daily actions + range/scope switching + status handling**, prefer a single workflow bar.

### Required roles

```text
[business actions] | [scope controls] | [status queue controls]
```

Prefer Arco `a-space`, `a-button`, `a-dropdown`, `a-tabs`, and neutral dividers. Class names shown in older examples are not a shared API unless grep finds their implementation in the current project.

### Visual hierarchy

- actions define what the user can do now
- scope defines which working set the user is in
- status defines which queue within that set needs handling

The status group is **workflow pressure**, not ordinary navigation.

### Do not

- style all three groups as the same button family
- remove separators so the whole row becomes one blur
- use filled primary blue for every active item
- use this bar when the page is not actually processed by state

## Archetype-Specific Redesign Notes

### Archetype A — Operational List / Workbench

This is where redesign should be strongest.

Expected visible improvements:

- clearer top workflow path
- stronger identity-first table
- less generic admin feel
- more intentional data rhythm

Default redesign authority:

- surface regrouping or skeleton rewrite is allowed

### Archetype B — Detail Drawer / Business Detail

Redesign through:

- stronger identity band
- calmer section hierarchy
- less repeated summary

Default redesign authority:

- regroup sections and strengthen hierarchy
- do not invent decorative sidebars

### Archetype C — Create / Edit Form

Redesign through:

- better business grouping
- better primary/secondary action rhythm
- less form-wall feeling

Default redesign authority:

- regroup form modules
- keep core fields visible

### Archetype D — Master Data / Configuration

Redesign through:

- cleaner left-right structure
- calmer utility chrome
- stronger maintenance/workbench feel

Do not over-style these pages.

### Archetype G — Dashboard / Analysis

Redesign through:

- cleaner KPI rhythm
- more intentional chart-to-table relationship
- restrained aside usage

Do not let dashboard style leak into workbench pages.

## Rewrite Decision Matrix

| Problem seen on page | Correct redesign move |
|----------------------|-----------------------|
| Search, actions, status are three weak strips | Merge into stronger workflow structure |
| Page is compliant but feels like generic admin | Rebuild emphasis and zone relationships |
| Table is dense but hard to scan | Reorder columns and use identity-first/two-line cells |
| Filters dominate the first screen | Reduce visible query surface and move low-frequency filters out |
| Everything has same weight | Rebuild primary/secondary/auxiliary hierarchy |
| Page looks clean but operations got hidden | Restore visible workflow controls |

## Output Standard For Redesign Tasks

When redesigning, report these explicitly:

```text
redesign_mode:
page_archetype:
layout_changes:
workflow_controls_kept_visible:
visual_hierarchy_moves:
old_pattern_removed:
verification:
```

`redesign_mode` must be one of:

- `polish-only`
- `surface-regrouping`
- `skeleton-rewrite`

Do not claim redesign if the work only changes borders, spacing, or button color.

## Forbidden Fallbacks

- "The page already works, so keep the skeleton."
- "The skill only changes styles, not layout."
- "Make it cleaner" without changing hierarchy.
- turning a workbench into a dashboard
- using more color to fake stronger design
- preserving weak old ERP grouping because it is familiar

The point of this file is to authorize **business-safe structural redesign** when layout quality is the real problem.
