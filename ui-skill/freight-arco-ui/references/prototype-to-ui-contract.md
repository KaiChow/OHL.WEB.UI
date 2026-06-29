# Prototype To UI Contract

## Purpose

Use this file when the input is a **design prototype, screenshot, annotated mockup, Figma frame, or visual reference** and Codex needs to turn it into a stable FE.OHL.WEB.UI page with consistent layout and interaction.

This file prevents a common failure mode:

- the screenshot is visually reproduced,
- but the wrong business object, wrong archetype, wrong action semantics, or wrong interaction scope is inferred.

## Core Rule

A screenshot is **not** a complete specification.

Before writing code from a prototype or screenshot, translate the visual artifact into:

1. `business_object`
2. `user_job`
3. `page_archetype`
4. `module_slots`
5. `feature_contracts`

Do not code directly from visual similarity alone.

## What A Screenshot Can And Cannot Decide

### A screenshot can decide

- visible layout zones
- visible grouping hierarchy
- component surface type: list / drawer / modal / long form / table / tabs / empty state
- approximate density target
- whether an action is visually primary or secondary

### A screenshot cannot decide by itself

- whether an action is visible, enabled, readonly, or denied by role/state
- whether an interaction opens modal, drawer, route, or inline edit
- what refreshes after success
- what happens on failure
- whether similar-looking fields belong to the current business object
- whether a visible action is high-frequency or low-frequency
- whether a repeated module is parent-owned or merely adjacent data

If these are not explicit, resolve them through `module-patterns.md`, `page-archetypes.md`, `feature-delivery-contract.md`, and the relevant domain reference before coding.

## Translation Order

1. Identify the **business object** shown by the prototype.
2. Identify the **user job**: scan / create / audit / reconcile / operate / configure / analyze.
3. Classify the **page archetype**.
4. Map visual regions to **slots**, not field names.
5. Extract every visible action and classify it by `feature_type`.
6. Decide which parts are visual facts and which parts still require functional contracts.
7. Only then implement the page.

## Prototype Translation Block

Write this block before coding from a prototype or screenshot:

```text
input_artifact:
business_object:
user_job:
page_archetype:
primary_identity:
key_state:
main_working_data:
supporting_data:
repeated_modules:
visible_actions:
uncertain_actions:
feature_contracts_required:
forbidden_assumptions:
```

## Slot Mapping Rules

Translate screenshot regions into reusable slots first:

| Visual region | Required slot interpretation |
|---------------|------------------------------|
| Header number/name/state band | `primary_identity` + `key_state` |
| Summary fact row | `key_facts` |
| Search/filter area | `filter` |
| Status chips/tabs | `status` or `segment` |
| Main toolbar | `action_scope` |
| Main data grid | `main_working_data` |
| Repeated card/table block | `repeated_modules` or `sub_entity` |
| Auxiliary side/info block | `supporting_data` |
| Footer save/submit area | `primary_action` + `grouped_actions` |

Do not start from screenshot field names as if they were the rule.

## Similar UI, Different Semantics

Two screenshots may look nearly identical and still be different features.

Examples:

- customer pool list vs reconciliation list
- warehouse putaway table vs outbound exception table
- order detail drawer vs customer detail drawer

Therefore:

- same surface does **not** imply same columns
- same toolbar shape does **not** imply same actions
- same drawer width does **not** imply same section structure
- same button label position does **not** imply same feature contract

Use the current `business_object` and `user_job` to decide semantics, not the screenshot alone.

## Visual Similarity Reuse Rule

You may reuse an existing page pattern only after all of these are true:

1. same or equivalent `page_archetype`
2. same `user_job`
3. compatible `business_object` slot structure
4. compatible action scope
5. no conflict with current domain reference

If any of these differ, reuse only the surface structure, not the business content or feature behavior.

## Uncertainty Handling

When a prototype does not show enough behavior detail:

- mark the action as `uncertain_actions`
- create the required `feature_contracts_required`
- do not invent hidden business rules silently

Allowed inference:

- a visible primary button is likely the local primary action
- a visible `···` menu is likely low-frequency grouped actions
- a repeated data block likely belongs to `repeated_modules`

Forbidden inference:

- assuming submit/save success refresh scope without defining it
- assuming status transitions from pill color only
- assuming permission visibility from visual presence alone
- assuming fields belong to the current object because another page used them

## Screenshot To Feature Contract

Every visible action in the prototype must become one of:

- `row action`
- `toolbar action`
- `batch action`
- `modal/drawer submit`
- `status flow action`
- `query action`

For each action, either:

1. define the full functional contract now, or
2. mark it as unresolved and do not claim fully consistent implementation yet

## Consistency Promise Rule

If the user expects "same function + similar UI = same implementation result", you may only make that promise after:

1. the prototype translation block is complete
2. the page archetype is fixed
3. the feature contracts for visible actions are complete
4. no unresolved semantic conflict remains

Without those four conditions, promise only **visual consistency**, not full functional consistency.

## Review Questions

Before delivery from a prototype-driven task, answer:

1. Did the page come from archetype selection or from screenshot imitation?
2. Did each visual region map to slots first?
3. Did each visible action get a feature type and contract?
4. Did any business field or action leak from an unrelated page?
5. If the same screenshot were implemented again next week, would the same contracts lead to the same result?

If the answer to 5 is no, the prototype translation is incomplete.
