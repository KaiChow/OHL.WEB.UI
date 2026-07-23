# Artifact To UI Contract

Use this when a screenshot, wireframe, annotated mockup, Figma frame, crop, or visual reference drives implementation.

A visual artifact is evidence of visible structure, not a complete business or feature specification. Complete the intake and translation below before writing template code.

Sections: [delivery boundary](#delivery-boundary) · [translation block](#artifact-translation-block) · [visual limits](#what-the-artifact-can-decide) · [slot mapping](#slot-mapping) · [uncertainty](#uncertainty-and-reuse) · [review](#review-gate).

## Delivery Boundary

Classify the requested result:

| Level | Evidence available | Allowed promise |
| --- | --- | --- |
| L1 visual | Artifact plus basic object/scope | Stable layout and visual consistency |
| L2 mock interaction | L1 plus explicit local interactions | Visual and local interaction consistency |
| L3 full feature | L2 plus permissions, states, API/result, failure, and refresh contracts | Stable business behavior |

Do not promise L3 from visual evidence alone.

If the user says “same as an existing page,” record the source and reuse level: `visual_only`, `layout_and_interaction`, or `full_behavior`. Never infer `full_behavior` from appearance.

## Artifact Translation Block

Complete or explicitly mark unknown fields:

```text
artifact_type:
artifact_scope:
target_route_or_menu:
delivery_level: L1 | L2 | L3
business_object:
user_job:
layout_priority:
reuse_source:
reuse_level:
page_archetype:
primary_identity:
key_state:
main_working_data:
supporting_data:
repeated_modules:
visible_actions:
explicit_behavior:
uncertain_actions:
permission_constraints:
state_constraints:
data_source_expectation:
feature_contracts_required:
forbidden_assumptions:
```

Minimum to start L1: artifact scope, business object, user job, target route/menu, layout priority, and visible actions. L2 also requires explicit behavior. L3 requires all applicable permission/state/data/API/failure/refresh details through `feature-delivery-contract.md`.

## What The Artifact Can Decide

The artifact may decide:

- visible zones, grouping hierarchy, and approximate density;
- apparent surface type such as list, detail, drawer, modal, form, table, tabs, or empty state;
- visible action placement and visual emphasis.

It cannot decide by itself:

- action visibility, enablement, readonly, permission, state legality, or frequency;
- drawer/modal/route/inline behavior, request payload, success refresh, or failure preservation;
- whether similar fields, columns, milestones, or repeated modules belong to the current object;
- whether an existing module should be reused visually or behaviorally.

Resolve unknowns through `module-patterns.md`, `domain-routing.md`, `feature-delivery-contract.md`, and the selected surface authority.

## Translation Order

1. Fill artifact scope, delivery level, business object, and user job.
2. Select the page authority through `domain-routing.md`.
3. Map visible regions to reusable slots before copying labels or fields.
4. Classify every visible action and separate explicit from uncertain behavior.
5. Complete required feature contracts; downgrade the promise when behavior remains unknown.
6. Continue with the default Arco/theme/page-authority path, then implement.

## Slot Mapping

| Visible region | Translate to |
| --- | --- |
| Number/name/state header | `primary_identity` + `key_state` |
| Summary facts | `key_facts` |
| Search/filter | `filter` |
| Status chips/tabs | `status` or `segment` |
| Toolbar/footer | `action_scope`, `primary_action`, `grouped_actions` |
| Main grid/form | `main_working_data` |
| Repeated block | `repeated_modules` or `sub_entity` |
| Side/helper information | `supporting_data` |

Surface similarity never implies the same business content. Reuse structure only after the page authority, user job, object slots, and action scope are compatible.

## Uncertainty And Reuse

- Mark missing behavior in `uncertain_actions`; do not invent hidden business rules.
- Each visible action becomes a row, toolbar, batch, query, status-flow, or modal/drawer submit feature.
- Define its full contract or state that only visual consistency is delivered.
- Permission, status transition, refresh scope, and failure handling require explicit evidence.
- Reuse another page’s behavior only when `reuse_level: full_behavior` is justified and its object/state/permission contracts are compatible.

Allowed visual inference: visible primary emphasis, grouped overflow actions, and repeated visual regions as candidate slots. Forbidden inference: business ownership, state transition, permissions, API behavior, and refresh scope.

## Review Gate

Before delivery, verify:

1. The page came from object/job/authority selection, not screenshot imitation.
2. Every visual region maps to a slot and every visible action maps to a feature type.
3. No unrelated page leaked fields, columns, milestones, or actions.
4. The delivered level matches the available evidence; unresolved semantics are reported.
5. Repeating the implementation from this contract would produce the same structure and behavior boundaries.

If any answer fails, the artifact translation is incomplete.
