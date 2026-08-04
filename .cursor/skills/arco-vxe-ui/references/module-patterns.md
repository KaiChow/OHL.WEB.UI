# Module Patterns

Structural slots for freight SaaS pages. **No business module names or field names are prescribed here** — use [`domain-language.md`](domain-language.md) for labels and `pageSpec.ts` for the actual business composition.

## Purpose
Define **where** information and actions live, not **which** business fields every page copies.

Do not hard-code one page (e.g. shipment order) and paste it into every menu.

This reference is a component-usage, layout, UI, and UX grammar. It does not define a fixed inventory such as cargo, container, fee, or document modules. Those are page-owned instances selected from requirements; the shared grammar only determines how any chosen module expresses hierarchy, statistics, actions, editing, disclosure, feedback, density, and responsive behavior.

## Specification Granularity Rule
Project UI rules must describe a **reusable class of business surface**, not a single screen, module name, or backend field set.

Write rules at this level:

- business object slot: identity, state, key facts, working data, supporting data, sub-entity, action scope;
- reusable surface: list workbench, detail identity band, query drawer, repeated line module, document checklist, milestone, activity log, causal timeline, exception panel;
- component contract: class name, DOM relationship, Arco/VXE component, token, density, state, forbidden fallback;
- object examples: shown only to explain how slots are filled for a domain object.

Do not write rules at this level:

- a specific record page's field list as a universal detail rule;
- one repeated module's fields as the base pattern for every repeated module;
- one document type's file behavior as the base pattern for every attachment module;
- a page screenshot's field list as a project-wide standard.

When a rule needs a concrete freight term, label it as an example and keep the reusable slot first:

```text
Good: `key_facts` contains 3-6 next-decision facts owned by the object. Example: a shipment object may use lane, schedule, carrier, vehicle/vessel, and customer facts.
Bad: every `dds-hero` must show the same field list copied from one shipment screen.
```

If a proposed rule cannot be expressed as slot + surface + token/state + forbidden fallback, it is too page-specific and must be rewritten before coding.

## Design Order
Fill these slots **before** choosing layout or components:

| # | Slot | Question |
|---|------|----------|
| 1 | `business_object` | What record is this page about? |
| 2 | `user_job` | scan · create · audit · reconcile · operate · configure · analyze? |
| 3 | `primary_identity` | Which 1–2 fields identify the record? |
| 4 | `key_state` | Which status/milestone changes the next action? |
| 5 | `main_working_data` | What do users edit or scan most? |
| 6 | `supporting_data` | Metadata, remarks, attachments, logs (secondary) |
| 7 | `high_frequency_actions` | Must be one click |
| 8 | `low_frequency_actions` | Group in dropdown; dangerous → confirm |

Then select the page authority through [`domain-routing.md`](domain-routing.md).

**Domain examples** (identity / facts / status per object type): [`domain-language.md` → Object examples](domain-language.md#object-identity-examples).

## Page Slot Contract
### List Archetype Selection
Choose the list surface from the user's job before assigning slots. A query-field count alone must not turn a simple lookup page into a workbench.

| Archetype | User job | Required / forbidden structure |
|---|---|---|
| `list-query` | Locate, inspect, and occasionally export a known record | One stable query surface and dominant table. No work scope, status queues, batch selection, or table context cap unless a real table utility needs a compact cap. |
| `list-management` | Maintain master data: create, edit, enable/disable, import/export | Compact command area when actual mutations exist; optional selection only with real batch behavior; table utility cap is allowed. Do not add operational queues or ownership scope. |
| `list-workbench` | Repeatedly prioritize, assign, progress, and recover operational records | Business command group, real work scope/status queues when the workflow uses them, selection/batch feedback when available, and a table context cap. |

### List / Workbench Slots
| Slot | Role |
|------|------|
| `segment` | Optional scope (mode, warehouse, bill type) |
| `filter` | High-frequency filters first; advanced by business group |
| `toolbar` | 1× primary · secondary · grouped low-freq · utilities |
| `status` | Workbench only: tabs when operators repeatedly process the queue by state |
| `table` | Identity · state · working columns · next-decision · actions |
| `pagination` | Table top only when it owns real context, pagination, or utilities; otherwise stay in the compact list command path |

Implementation: [`list-page.md`](list-page.md) · [`table.md`](table.md) · [`actions.md`](actions.md).

### Business Object Workspace / Drawer

| Slot | Role |
|------|------|
| `identity_band` | Object identity/state · 3–6 key facts · risk/next decision · object tools |
| `section_index` | Conditional navigation for long workspaces; active plus contract-derived state only |
| `milestone` | Optional; only if the object has a real process |
| `modules` | Full-width section surfaces in operation order; not universal cards |
| `sub_entities` | Repeated child entities owned by the current business object |
| `action_owner` | Header/module/row/footer by scope; one primary per scope and no duplicated commit |

Implementation: [`detail-form.md`](detail-form.md) · [`actions.md`](actions.md).

### Create / Edit Form

| Slot | Role |
|------|------|
| `draft_identity` | Type · draft/no · state |
| `required_core` | Minimum valid create set |
| `business_groups` | Stable groups by meaning |
| `repeated_modules` | Sub-entities with add/delete |
| `validation` | Blur + submit; scroll to first error |
| `footer` | Cancel · draft · submit |

### Dashboard

| Slot | Role |
|------|------|
| `scope_time` | Range / org filter |
| `kpi` | Few decision metrics |
| `analysis` | Charts only when they answer a question |
| `drill_down` | VXE table behind metrics |

## Module Surface
| Level | Height / type | Body rhythm | Action rule |
|---|---|---|---|
| Top-level module | 36px head · F2 13/600 | 8px start · 12px inline/end | title left; at most one outline add action right |
| Repeated child | 36px head · F3 12/600 | 10px block · 12px inline | child metrics beside identity; auxiliary icon tools right |
| Child table cap | 32px · F3 12/600 | directly precedes the table | one outline add action; no duplicate module totals |
| Body data | F1/F4 12px; F5 11px metadata | field rows 8px; columns 12px | controls/actions follow component-size/actions authorities |
Always-open module titles and bodies share the 12px inline origin and never reserve a phantom disclosure slot; only genuinely collapsible modules own a visible disclosure control. Collapsed supporting/audit modules consume only their 36px head and never retain phantom body spacing. That 36px is the rendered border-box height including padding/dividers; verify the bounding box, not only the token declaration.
Modules are sections inside one owning detail canvas, not repeated cards. Module kinds use distinct internal compositions; core editing modules stay open without redundant collapse controls, while supporting/audit modules may collapse.
Top-level modules use one neutral header fill, one subtle divider, and a 4-8px neutral inter-module gap; they stay full-width and never receive card shadows or repeated decorative color bars. Place compact statistics between title and actions, never in a detached row, and wrap the group as one unit when narrow.
Repeated child business objects may use one neutral 1px boundary and the shared small radius because each child is a genuine repeated unit. Keep its head on `color-fill-1`, its body white, and never add a shadow.
A table cap exists only for a real subordinate table title. Additive/workflow actions live in the header of the module or child they mutate; never repeat the parent module title merely to carry an action.
For at least five modules or more than two viewport heights of content, a scroll-aware section index is allowed only with at least 1440px available canvas width. Use a compact 144-192px track, hide it below the threshold without creating a second navigation pattern, and keep the existing scroll owner. Items may show active location plus completion/exception only when module contracts provide real state; never infer a check mark from non-empty UI or invent a count. The active item uses one centered 16px indicator, never a full-height/full-row rail. Detail canvases use all remaining width without arbitrary page/form `max-width` gutters.
**Action labels:** object-specific (`Add shipper`, not bare `Add`). Wording: [`domain-language.md`](domain-language.md).

## Typed Module Manifest
Complex pages are assembled from reusable module roles, not an exhaustive catalog of business scenarios. Before template work, every non-list detail surface declares this manifest in `pageSpec.ts`:

- Page: default mode, vertical scroll owner, sticky action owner, and table row-banding role.
- Workspace: operational/reference/review archetype, identity/key-fact/decision slots, one action owner, conditional navigation policy, and named identify/locate/act checks.
- Module: stable id, semantic kind, priority, display/edit mode, owned facts, and collapse rule; priority controls disclosure, not decorative color. Core editing/decision modules are `always-open`; supporting/audit modules may collapse; any module owning a blocking validation error opens automatically.
- Statistics: metric id, semantic kind, source, aggregation, format, and single placement; use `metrics: []` when none.
- Actions: feature-contract ids split into explicit module/child/table/row arrays; keep each array empty when that scope has none.
- Children: `none`, or repeated identity/body/default-open rule and optional child-owned table role.

The manifest is a decision record and validation boundary, not a universal JSON renderer. Vue still composes Arco, VXE, and proven shared primitives according to the declared roles.
### Configuration Boundary

- `pageSpec.ts` owns every business module id/name, field set, metric, action, editability rule, and data source.
- Shared module components own only structural slots and interaction behavior. They accept content through typed props/slots and must not contain business labels, default fields, assumed statistics, or object-specific action names.
- A module omits unneeded summary/actions/children/table/disclosure slots. New scenarios create manifest compositions; add a shared primitive only for reusable interaction structure. Acceptance examples prove the grammar, never mandatory templates or default module sets.

### Metric Ownership

Metrics exist only when they help a decision and have a provable source. `count`, `quantity`, `amount`, `progress`, `exception`, and `status-breakdown` are semantic kinds; source is `api`, `derived`, or `local-state`; aggregation is `none`, `count`, `sum`, `ratio`, or `breakdown`; format is `number`, `unit`, `currency`, `percent`, or `status`.

- Page facts answer object-level decisions; module summaries answer module-level decisions; child heads distinguish repeated children; table caps describe the table dataset.
- One fact has one visible owner; module titles contain names only, statistics use the summary slot, and status uses `.s-pill[data-s]` beside its object.
- Never invent a metric because a surface looks empty; declare `metrics: []` when none helps a decision.

### Action Ownership

Page actions own object workflow/edit/save/output; module actions own whole-module add/import/refresh; child actions own duplicate/delete; table actions own lines and utilities; row actions own one row. Place each at its owning head/cap/footer. Every business action references a complete feature contract; presentation toggles do not. One primary is allowed per scope and destructive actions stay separated and confirmed.

## Module Type Picker

| Situation | Pattern |
|-----------|---------|
| Single field group | `detail-section` |
| Repeated rows, flat | `detail-module` + line table |
| Parent owns child lines | parent-child module — see below |
| Files / compliance docs | attachment module — [`detail-form.md`](detail-form.md) |
| Audit / history | `activity-log` by default; causal `timeline` only when chronology itself is the reading task |
| Exceptions | exception module; state in `s-pill` only |

## Parent–Child Module

When one parent entity owns repeated line rows (`parent entity -> owned lines`):

```text
detail-module
├── head + module actions
├── module summary (once)
└── child-item × N
    ├── child head   identity · metrics · collapse/delete
    ├── child body   core fields
    └── line table   rows + row actions
```

Rules:

- One parent surface; children separated by dividers/tinted heads, not nested cards.
- Actions scoped by level: module / child / row — never duplicate the same total in summary, child head, and table cap.
- Default: expand first child + children with errors.
- Nesting stops at `page -> module -> child -> child-owned pane/table`. A second recursive child-module level requires a new page/workspace boundary; never solve depth with cards inside cards.

Detail UI rules: [`detail-form.md` → Parent-Child](detail-form.md#parent-child-nested-modules).

## Sequence, Progress, And Activity

| User question | Surface | Required behavior |
|---|---|---|
| Where is the object in a real business flow? | Compact milestone strip | Completed/current/upcoming states, current owner or blocker, and next legal action agree with object status. |
| How much is complete? | Arco Progress or compact owned metric | Show exact percent or completed/total, source and owning module; never invent progress from unrelated statuses. |
| What changed recently? | `activity-log` | Newest first, content-height 32-40px rows, event first and actor/time in one bounded reading cluster. |
| Why did this outcome occur over time? | Arco Timeline | Use only when temporal causality, duration, or cross-stage handoff is the primary reading task. |

- Activity/history does not become Timeline merely because records have timestamps. Timeline is exceptional, not the audit default.
- Milestone, Progress, and Activity must never stretch rows or connector lines to fill spare module/page height.
- Do not place event text at the far left and actor/time at the far right of a wide surface; bound the row reading width and keep metadata adjacent.
- Long histories use pagination, “load more”, or an independently justified bounded region; never make the whole detail module an unbounded timeline.
- Workflow state, milestone current node, progress value, blocker, and next action must not contradict one another.

## Pre-Implementation Mapping
Record in `pageSpec.ts`: `input_path`, unresolved business decisions, archetype, business object/job/identity/state, main fields, repeated modules, action groups, each module's `id | kind | owns | metrics | actions | children | collapse`, and the page scroll owner. Labels come from `domain-language.md`.

Then implement in this order: Arco built-ins -> tokens -> documented business patterns -> minimal page-local CSS.

Use global classes only for framework-neutral tokens or freight semantics. Repeated surface behavior belongs in a shared Vue component after `arco-first.md` explains why Arco structure is insufficient.
