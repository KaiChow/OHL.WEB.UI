# Artifact Intake Template

## Purpose

Use this file when a user, PM, designer, or reviewer provides a **screenshot, prototype, annotated image, or Figma frame** and expects Codex to build a page with stable layout, behavior, and consistency.

This file standardizes the **minimum required input** that should accompany the artifact.

Without this intake template, prototype-driven tasks are much more likely to drift in function semantics even when the UI looks similar.

## Core Rule

Do not treat the visual artifact alone as sufficient input for a full implementation promise.

For stable delivery, the artifact should be accompanied by the minimum business context below.

## Minimum Required Input

Collect or infer these fields before promising a fully consistent implementation:

```text
artifact_type:
artifact_scope:
business_object:
user_job:
target_route_or_menu:
same_as_existing_module:
layout_priority:
visible_actions:
explicit_behavior:
uncertain_behavior:
permission_constraints:
state_constraints:
data_source_expectation:
delivery_expectation:
```

## Field Definitions

| Field | Meaning |
|-------|---------|
| `artifact_type` | screenshot / wireframe / annotated mockup / Figma frame / partial crop |
| `artifact_scope` | full page / drawer / modal / one module / one table / one toolbar |
| `business_object` | what record/entity the page is about |
| `user_job` | scan / create / audit / reconcile / operate / configure / analyze |
| `target_route_or_menu` | where this page lives in the product |
| `same_as_existing_module` | whether it should follow an existing module's behavior exactly or only visually resemble it |
| `layout_priority` | data-dominant / form-dominant / process-dominant / analysis-dominant |
| `visible_actions` | actions visible in the artifact |
| `explicit_behavior` | actions whose behavior is known and confirmed |
| `uncertain_behavior` | actions visible but not yet behavior-specified |
| `permission_constraints` | known visibility/enablement restrictions |
| `state_constraints` | known status/flow rules |
| `data_source_expectation` | mock only / existing frontend state / real backend integration |
| `delivery_expectation` | visual reproduction only / visual + mock interaction / full functional implementation |

## Delivery Expectation Levels

Map the request to one of these levels:

| Level | Meaning | Promise allowed |
|-------|---------|-----------------|
| L1 | visual reproduction only | stable layout/visual consistency only |
| L2 | visual + mock interaction | stable layout + local interaction consistency |
| L3 | full feature implementation | stable layout + stable interaction + stable business behavior |

Do not promise L3 when the intake is only sufficient for L1 or L2.

## Fast Intake Questionnaire

When the artifact arrives with little context, ask or infer these in this order:

1. What **business object** is this page for?
2. Is this page mainly for **scan / create / operate / configure / analyze**?
3. Which visible actions must behave exactly like an existing page?
4. Which actions are still visually shown but behavior-uncertain?
5. Is this expected to be **UI only**, **mock interaction**, or **real feature implementation**?

## Existing Module Reuse Decision

If the user says "same as existing page" or "参考某页面", confirm or record:

```text
reuse_source:
reuse_level:
```

Where `reuse_level` is one of:

- `visual_only`
- `layout_and_interaction`
- `full_behavior`

Do not assume `full_behavior` unless explicitly stated or clearly derivable.

## Intake To Translation Handoff

Once the intake template is complete:

1. pass it into `prototype-to-ui-contract.md`
2. produce the prototype translation block
3. fill `feature_contracts_required`
4. start coding only after unresolved semantics are isolated

## Forbidden Shortcuts

- building from screenshot alone while claiming full functional consistency
- assuming a familiar layout means familiar business behavior
- inheriting another module's actions because the toolbar looks similar
- treating missing permission/state details as harmless
- skipping intake because the screenshot "looks obvious"
