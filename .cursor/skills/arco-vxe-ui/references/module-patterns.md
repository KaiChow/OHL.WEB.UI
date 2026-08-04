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
- reusable surface: list workbench, detail identity band, query drawer, repeated line module, document checklist, timeline, exception panel;
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

### Detail / Drawer

| Slot | Role |
|------|------|
| `identity` | Status · primary no/name · company/context |
| `facts` | 3–6 key facts by object type (`dds-hero`) |
| `milestone` | Optional; only if the object has a real process |
| `sections` | Business groups in operation order |
| `sub_entities` | Repeated child entities owned by the current business object |
| `footer` | Danger left · workflow secondary · 1× primary save |

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

```text
module
├── head        title (left) · actions (right) only
├── summary?    counts/totals/progress — not in title
├── body        form and/or table
└── empty?      explicit state + next action
```

**Header rule:** left = module name only; right = module actions only. No counts, status, or helper text in the title row.
Modules are sections inside one owning detail canvas, not repeated cards. `field-group`, `parent-child`, `line-table`, `document-checklist`, and `timeline` must use different internal compositions; sharing a head/body primitive does not authorize rendering every kind as the same framed box. Core editing modules stay open without redundant collapse controls. Supporting and audit modules may collapse; a local anchor rail appears only when proven page length or module count makes direct scrolling materially inefficient.
**Action labels:** object-specific (`Add shipper`, not bare `Add`). Wording: [`domain-language.md`](domain-language.md).

## Typed Module Manifest
Complex pages are assembled from reusable module roles, not an exhaustive catalog of business scenarios. Before template work, every non-list detail surface declares this manifest in `pageSpec.ts`:

- Page: default mode, vertical scroll owner, and sticky action owner.
- Module: stable id, semantic kind, priority, display/edit mode, owned facts, and collapse rule; priority controls disclosure, not decorative color.
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
| Audit / history | timeline module |
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

## Sub-Entity Module Types

| Type | Use for | Implementation |
|------|---------|----------------|
| Attachment | B/L, customs docs, images | `detail-form.md` → Attachments |
| Line table | Any flat repeated records | Detail-table VXE configuration — [`table.md`](table.md) |
| Party / contact | Any named organization or person | Chips or compact rows; name = `color-text-1` |
| Timeline | Ops log, audit | Dense list, no per-item cards |
| Exception | Risk, variance | `s-pill`; no row background fill |

## Pre-Implementation Mapping
Record in `pageSpec.ts`: `input_path`, unresolved business decisions, archetype, business object/job/identity/state, main fields, repeated modules, action groups, each module's `id | kind | owns | metrics | actions | children | collapse`, and the page scroll owner. Labels come from `domain-language.md`.

Then implement in this order: Arco built-ins -> tokens -> documented business patterns -> minimal page-local CSS.

Use global classes only for framework-neutral tokens or freight semantics. Repeated surface behavior belongs in a shared Vue component after `arco-first.md` explains why Arco structure is insufficient.
