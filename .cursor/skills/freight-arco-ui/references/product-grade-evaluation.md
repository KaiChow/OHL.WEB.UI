# Commercial Product Release Gate

Use for financing, sales, customer, leader, or investor demos and requests such as `高级感`, `质感`, `设计感`, `产品化`, or `像能卖的软件`.

`设计感` is defined by the Design Sense Gate in `visual-system.md`. This file remains the commercial pass/fail release gate; visual hierarchy failures route to that Design Sense Gate and the affected surface authority.

## Six Blocking Gates

| Gate | Pass evidence | Release blocker |
| --- | --- | --- |
| 1. Workflow credibility | The route shows a real freight object, actor, key state/risk, owner, next decision, and believable domain language | Generic admin layout, borrowed fields, fake metrics, or no clear user job |
| 2. Interaction closure | Every shipped action proves visibility, enablement, pending lock, permission, success, failure preservation, refresh, and confirmation when risky | Dead button, guessed API, duplicate submit, lost input, silent failure, or ambiguous mutation result |
| 3. Operational efficiency | Daily query/scan/update/batch paths are short; action hierarchy and data ownership remain clear at office widths | Hidden daily work, competing primaries, repeated context, oversized command chrome, or broken table/overlay overflow |
| 4. State resilience | Applicable loading, slow, empty, no-permission, validation, business/network error, retry, long/extreme data, and partial failure are deterministic and recoverable | Happy-path-only demo, global toast replacing local error, color-only state, or unreproducible edge states |
| 5. Product-system consistency | Arco/GI/shared patterns own shell, controls, status, feedback, VXE, spacing, and interaction language across representative routes | Page-local skin, second palette, one-off component language, or a new module requiring reinvention |
| 6. Rendered and accessible proof | Real routes pass viewport, focus, keyboard, naming, 200% zoom, overflow, state, console, build, and spec checks with evidence and declared residual risk | Source-only review, mouse-only flow, unnamed icon action, clipped zoom state, screenshot-only polish, green scripts without route inspection, or unsupported quality claims |

Any failed applicable gate blocks `sellable-saas-grade`.

## Evidence Scope

For a single-page claim, inspect the changed route and every overlay/detail surface it opens. For a product-level claim, inspect a representative list workbench, object detail, focused overlay/form, and shared shell.

Required viewports:

- `1366x768` release viewport;
- `1024x768` split-window viewport;
- `1280x720` compact demo viewport;
- one wide desktop viewport.

Required scenario set is page-specific, but every applicable state must have a deterministic trigger through fixtures, request interception, component tests, or a QA-only route/query. A sentence in `pageSpec.ts` and a transient message are not evidence.

## Review Sequence

1. Run the primary user job from entry to visible result.
2. Repeat with denied, invalid, slow, failed, and duplicate input/request conditions that apply.
3. Verify input/context preservation, retry, refresh scope, and destructive confirmation.
4. Inspect focus order, keyboard reachability, state meaning without color, long data, local scroll owners, fixed table regions, and console errors.
5. At 200% browser zoom, verify that identity, current state, primary action, validation, overlay commands, and recovery paths remain reachable; table-local horizontal scrolling is allowed, clipped or lost commands are not.
6. Verify every icon-only control has a business-specific accessible name, every custom control has a visible `:focus-visible` state, and text/state contrast remains readable without color alone.
7. Compare representative routes for shared ownership and interaction language.
8. Run `node scripts/check-spec.js` and `npm run build`.

Route a failed gate to the relevant existing authority; do not add another product-quality checklist.

## Release Record

```text
commercial_target:
route_scope:
workflow_credibility: pass | fail
interaction_closure: pass | fail
operational_efficiency: pass | fail
state_resilience: pass | fail
product_system_consistency: pass | fail
rendered_proof: pass | fail
demo_ready: yes | partial | no
blocking_evidence:
remaining_risk:
```

`demo_ready: yes` requires all six gates to pass. `partial` means usable for internal review only and must not be reported as sellable.
