# Feature Routing

## Purpose

Use this file when the task is not only visual structure, but also includes **behavior**: query, submit, save, approve, batch action, import/export, upload, polling, permission-based visibility, or any other user action that changes data or result sets.

UI references decide **where** things live. This file decides **which functional references must be read before coding behavior**.

## Core Rule

If a user can click, submit, mutate data, trigger a request, or observe different results based on role/state, read:

1. `feature-delivery-contract.md`
2. the matching UI reference for the surface
3. `permissions.md` when visibility, enablement, or data scope varies by role or state

Pure visual polish tasks may skip this file only when there is no behavior change.

## Routing Table

| Feature type | Typical task | Required references |
|--------------|--------------|---------------------|
| Query / search | filter form, advanced search, reset, apply query | `feature-delivery-contract.md` + `filter-layout.md` + `form-field.md` |
| Create / edit / save | page form, drawer form, draft save, submit | `feature-delivery-contract.md` + `form-rules.md` + `detail-form.md` or `full-page-form.md` |
| Row action / toolbar action | single-record action, quick operation, dropdown action | `feature-delivery-contract.md` + `actions.md` + `table.md` |
| Batch action | batch submit, batch confirm, batch export | `feature-delivery-contract.md` + `actions.md` + `table.md` + `feedback.md` |
| Status flow | approve, reject, void, reverse, close, reopen | `feature-delivery-contract.md` + `actions.md` + `feedback.md` + `permissions.md` |
| Permission / visibility | role-based button display, field readonly, data scope | `feature-delivery-contract.md` + `permissions.md` |
| Modal / drawer workflow | confirm dialog, drawer submit, child-table edit | `feature-delivery-contract.md` + `modal.md` + `overlay-dimensions.md` |
| Upload / import / export | attachments, import jobs, export jobs, template download | `feature-delivery-contract.md` + `upload.md` + `feedback.md` |
| Async flow | polling, retry, lock, duplicate-submit prevention | `feature-delivery-contract.md` + `feedback.md` |
| Dashboard drill-down | KPI click-through, scoped analysis, export from report | `feature-delivery-contract.md` + `dashboard.md` + `permissions.md` |

## Decision Rules

1. If the task changes backend data, define the functional contract before writing handlers.
2. If the task changes what records are visible, define query inputs, reset behavior, request payload, and empty-state behavior.
3. If the task can be hidden, disabled, readonly, or denied, define `visible_when`, `enabled_when`, and denied feedback separately.
4. If the task can fail after user confirmation, define success, business rejection, permission rejection, and network failure separately.
5. If the task spans more than one state, define the transition path and refresh scope.
6. If the task can be repeated accidentally, define loading lock, idempotency expectation, and duplicate-click behavior.

## Required Output Before Coding

Write this block in notes or task output for any non-trivial feature:

```text
feature_type:
entry_point:
actor_roles:
visible_when:
enabled_when:
preconditions:
api_request:
api_response:
success_result:
error_result:
refresh_scope:
verification_cases:
```

Then fill the full contract in `feature-delivery-contract.md`.
