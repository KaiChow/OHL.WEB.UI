# Feature Delivery Contract

## Purpose

Translate every frontend feature into an **AI-executable functional contract** before coding behavior.

This file is the companion to the UI references:

- UI references define structure, classes, density, and interaction surfaces.
- This file defines action legality, field behavior, permission boundaries, request/response handling, and verification.

Sections: [routing](#feature-routing) · [contract](#functional-contract-block) · [legality](#action-legality) · [requests](#request--response-contract) · [verification](#verification-cases).

## Feature Routing

Read this contract plus only the surface authorities involved:

| Feature | Add |
| --- | --- |
| Query/reset/apply | `filter-layout.md`, `form-field.md`, `feedback.md` |
| Create/edit/save | `form-rules.md` and `detail-form.md` or `full-page-form.md` |
| Row/toolbar/batch action | `actions.md`, `table.md`, `feedback.md` |
| Status or permission flow | `actions.md`, `permissions.md`, `feedback.md` |
| Modal/drawer workflow | `modal.md`, `overlay-dimensions.md` |
| Upload/import/export | `upload.md`, `feedback.md` |
| Dashboard drill-down | `dashboard.md`, `permissions.md` |

Define query payload/reset/empty behavior when visible records change. Define role/state visibility separately from enablement. Define business, permission, validation, and network failure separately. Define loading lock/idempotency for repeatable actions and transition/refresh scope for multi-state work.

## Non-Negotiable

Any feature that changes data, changes visible result sets, opens a business workflow, or depends on role/state must define the contract below before implementation.

Do not hide business rules only inside click handlers, watchers, or submit functions.

## Contract Order

1. `business_object` and `user_job`
2. `feature_type` and `entry_point`
3. `actor_roles`
4. `visible_when` / `enabled_when` / `readonly_when`
5. `preconditions` and `confirm_when`
6. `input_fields` and `derived_fields`
7. `api_request` and `api_response`
8. `success_result` and `error_result`
9. `state_transition`
10. `refresh_scope`
11. `verification_cases`

## Functional Contract Block

Use English keys. Keep labels, statuses, and business nouns object-specific.

```text
business_object:
user_job:
feature_name:
feature_type:
entry_point:
actor_roles:
visible_when:
enabled_when:
readonly_when:
preconditions:
confirm_when:
input_fields:
derived_fields:
api_request:
api_response:
success_result:
error_result:
state_transition:
refresh_scope:
audit_trace:
verification_cases:
```

## Action Legality

For every clickable action, define these separately:

| Key | Meaning |
|-----|---------|
| `visible_when` | When the user should see the action |
| `enabled_when` | When the action is clickable |
| `readonly_when` | When fields stay visible but cannot change |
| `preconditions` | What must already be true before the action can start |
| `confirm_when` | When confirmation is required |
| `audit_trace` | What record/log/toast/history should exist after success |

Do not collapse hidden, disabled, readonly, and denied into one vague rule.

## Field Contract

For every feature field group, define:

| Key | Meaning |
|-----|---------|
| `source` | manual input, select, derived, backend readonly, or computed |
| `required_when` | the exact condition that makes it required |
| `validation` | format, length, range, dependency, or uniqueness checks |
| `writeback` | whether local state, table row, drawer form, or route query updates |
| `empty_behavior` | placeholder, empty display, or blocked submit behavior |

Do not leave required logic implicit in submit code only.

## Request / Response Contract

Every request-backed feature must define:

| Key | Meaning |
|-----|---------|
| `api_request` | payload shape, query params, identifiers, and omitted fields |
| `api_response` | success data, state fields, counts, or returned identifiers |
| `loading_lock` | button lock, row lock, form lock, or optimistic update rule |
| `idempotency` | whether repeated clicks are ignored, merged, or blocked |
| `failure_shape` | business reject, permission reject, validation reject, or network failure |

UI code must not guess the refresh strategy after the fact. Define it in `refresh_scope`.

## State Transition Contract

When the feature changes a business state, define:

```text
from_state:
action:
to_state:
intermediate_state:
blocked_state:
failure_state:
```

Use object-owned state names. Do not invent generic placeholders.

## Result Handling

Define success and failure separately:

| Contract | Questions to answer |
|----------|---------------------|
| `success_result` | What closes, what stays open, what refreshes, what message appears, what state becomes visible immediately |
| `error_result` | What stays editable, what error surface appears, whether user input is preserved, and whether retry is available |
| `refresh_scope` | row only, current table page, current drawer, whole route, or background polling target |

## Verification Cases

Every non-trivial feature must verify at least:

1. Happy path success
2. Business rejection
3. Permission rejection or hidden/disabled case
4. Network failure or timeout
5. Duplicate click / repeated submit
6. Refresh scope after success
7. Data preservation after failure

Add route leave, drawer close, batch partial failure, or polling stop when applicable.

## Forbidden Fallbacks

- Clicking an action with no explicit `visible_when` / `enabled_when`
- Irreversible action with no `confirm_when`
- Submit logic that only says "invalid" without field ownership
- Success flow that does not define what refreshes
- Error flow that loses user input without saying so
- Batch action with no selected-scope summary or partial-failure rule
- Async job with no loading/lock/retry contract
- Feature code that relies on page-local memory of business rules instead of the contract
