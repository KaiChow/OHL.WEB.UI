# Feature Delivery Contract

Use before implementing business clicks, requests, permissions, mutations, or state transitions. The contract is code-adjacent and typed where the module already has a contract type; it is not a prose design document.

## Smallest Complete Contract

Every business action needs these fields before behavior code:

```text
id:
actorRoles:
visibleWhen:
enabledWhen:
request:
successResult:
errorResult:
refreshScope:
```

Use object-owned terms and concrete conditions. `request` includes the real local operation or API method, identifiers, payload source, and pending owner. `errorResult` says what remains open/editable, what input/context survives, where the error appears, and how retry works.

Presentation-only toggles such as opening a static help popover do not need a feature contract. Any action that changes data, visible results, route/workflow context, permission exposure, or business state does.

## Add Only When Risk Requires It

| Condition | Required additions |
| --- | --- |
| Mutation or async job | loading lock, duplicate/idempotency behavior, business vs network rejection, audit/result trace |
| Destructive or irreversible action | preconditions, confirmation copy/data scope, permission denial, cancel behavior |
| Form or editable table | field source, conditional required/readonly rules, validation owner, dirty/cancel policy, failure preservation |
| State transition | allowed from/to states, intermediate state, stale-revision behavior, illegal transition feedback |
| Batch action | selection scope, mixed eligibility, success/failure counts, failed-row preservation, retry scope |
| Query/reset | applied vs draft values, Enter behavior, reset target, pagination reset, empty/error behavior |
| Polling/background work | start/stop owner, route-leave cleanup, retry/backoff, stale-result protection |

Do not copy every optional field into every contract. Missing an applicable risk field is a blocker; irrelevant boilerplate is noise.

## Interaction Rules

- Visibility, enabled, readonly, and denied are separate states.
- One request has one pending owner; repeated submission is blocked, merged, or idempotent by contract.
- Success defines what closes, what stays open, what becomes visible immediately, and exactly what refreshes.
- Failure stays local to the surface that can recover and preserves valid input/context by default.
- Permission rejection is not a generic network error.
- A batch result identifies failed records and leaves recoverable work selected.
- Optimistic behavior must define rollback and stale-response handling.

## Surface Routing

Read only the affected authorities:

| Feature | Add |
| --- | --- |
| Query/reset/apply | `filter-layout.md`, `form-field.md`, `feedback.md` |
| Create/edit/save | `form-rules.md` plus `detail-form.md` or `full-page-form.md` |
| Row/toolbar/batch action | `actions.md`, `table.md`, `feedback.md` |
| Status or permission flow | `actions.md`, `permissions.md`, `feedback.md` |
| Modal/drawer workflow | `modal.md`, `overlay-dimensions.md` |
| Upload/import/export | `upload.md`, `feedback.md` |
| Dashboard drill-down | `dashboard.md`, `permissions.md` |

## Verification

For each non-trivial feature, exercise the applicable cases instead of writing a universal checklist:

- happy path and immediately visible result;
- business rejection and permission denial/hidden state;
- network failure/timeout and retry;
- duplicate click or repeated submission;
- exact refresh scope and preserved data/context;
- validation, stale revision, partial batch failure, cancel/close, or route leave when applicable.

If a case cannot be triggered deterministically, report it as unverified. A mocked success click is not a completed feature.
