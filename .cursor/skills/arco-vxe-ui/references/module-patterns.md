# Module Patterns

Structural slots for freight SaaS pages. **No field names here** — use [`domain-language.md`](domain-language.md) for Chinese labels, statuses, and module naming.

## Purpose

Define **where** information and actions live, not **which** business fields every page copies.

Do not hard-code one page (e.g. shipment order) and paste it into every menu.

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

### List / Workbench

| Slot | Role |
|------|------|
| `segment` | Optional scope (mode, warehouse, bill type) |
| `filter` | High-frequency filters first; advanced by business group |
| `toolbar` | 1× primary · secondary · grouped low-freq · utilities |
| `status` | Tabs only when they change the query result |
| `table` | Identity · state · working columns · next-decision · actions |
| `pagination` | `table-card-cap` on the right |

Implementation: [`list-page.md`](list-page.md) · [`table.md`](table.md) · [`actions.md`](actions.md).

### Detail / Drawer

| Slot | Role |
|------|------|
| `identity` | Status · primary no/name · company/context |
| `facts` | 3–6 key facts by object type (`dds-hero`) |
| `milestone` | Optional; only if the object has a real process |
| `sections` | Business groups in operation order |
| `sub_entities` | Repeated cargo, fees, files, parties, declarations |
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

**Action labels:** object-specific (`Add shipper`, not bare `Add`). Wording: [`domain-language.md`](domain-language.md).

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

When one parent entity owns repeated line rows (party → cargo lines, fee group → lines):

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

Detail UI rules: [`detail-form.md` → Parent-Child](detail-form.md#parent-child-nested-modules).

## Sub-Entity Module Types

| Type | Use for | Implementation |
|------|---------|----------------|
| Attachment | B/L, customs docs, images | `detail-form.md` → Attachments |
| Line table | Fees, cargo, stock | `detail-mini-vxe` — [`table.md`](table.md) |
| Party / contact | Shipper, consignee, owner | Chips or compact rows; name = `color-text-1` |
| Timeline | Ops log, audit | Dense list, no per-item cards |
| Exception | Risk, variance | `s-pill`; no row background fill |

## Hard-Coding Checks

Reject before ship:

- Finance page showing route/ETD because order detail does.
- Customer page with shipment milestones because the drawer has steps.
- Same columns/actions on every module.
- Structural class treated as business requirement (`dds-hero` ≠ must show route).
- Spec text that uses one business module name as the rule itself instead of an example of a reusable slot.
- New global CSS class whose name encodes a single backend field or page-specific module when a slot class already exists.

## Pre-Implementation Mapping

Write this block (English keys; labels from `domain-language.md`):

```text
archetype:
business_object:
user_job:
primary_identity:
key_state:
main_fields:
repeated_modules:
primary_action:
grouped_actions:
```

Then implement in this order: Arco built-ins -> tokens -> documented business patterns -> minimal page-local CSS.

Use global classes only for framework-neutral tokens or freight semantics. Repeated surface behavior belongs in a shared Vue component after `arco-first.md` explains why Arco structure is insufficient.
