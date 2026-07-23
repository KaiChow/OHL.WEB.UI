# Product-Grade Evaluation

Use this for financing, sales, customer, leader, or investor demos and requests such as `高级感`, `质感`, `产品化`, `不像能卖的软件`, or `像项目不像平台`.

The target is a sellable freight operations product: professional, restrained, dense, workflow-driven, credible, and reusable. Decoration cannot compensate for weak shell, hierarchy, workflow, state handling, or shared capability.

Sections: [14 gates](#14-maturity-gates) · [scoring](#eight-scored-dimensions) · [evidence](#required-evidence) · [page questions](#page-questions) · [output](#output).

## 14 Maturity Gates

Score only after inspecting real routes. Each gate routes component details to its single authority.

| # | Gate | Pass evidence | Authority |
| --- | --- | --- | --- |
| 1 | One product | Shell, query, data, detail, overlay, actions, status, spacing, and feedback use one ownership stack | `theme-contract.md`, `arco-first.md` |
| 2 | Dense, not crowded | Data dominates; readable rhythm does not rely on tiny text or collapsed targets | `redesign-calibration.md`, `typography.md`, `component-size.md` |
| 3 | Stable archetype | Identity, command context, primary work surface, and pagination have one clear owner | `domain-routing.md`, `list-page.md`, `detail-form.md` |
| 4 | Action priority | One primary per scope; daily actions visible; rare/risky/destructive actions grouped and confirmed | `actions.md`, `feature-delivery-contract.md` |
| 5 | Professional query | Daily conditions visible; advanced conditions use the selected tier; repeated schemes persist when required | `filter-layout.md` |
| 6 | Office table | VXE columns, fixed areas, density, overflow, selection/batch, settings, and long data remain usable | `table.md` |
| 7 | Recognizable status | `.s-pill[data-s]` plus explicit state text; color is never the sole signal | `visual-system.md` |
| 8 | Complete feedback | Loading, empty, disabled, permission, success/failure, duplicate submit, and refresh outcomes are explicit | `feedback.md`, `feature-delivery-contract.md` |
| 9 | Local exceptions | Field/row/table errors stay with the surface that can fix them; summaries may navigate but not replace locality | `feedback.md`, `form-rules.md` |
| 10 | Context preservation | Drawer/modal/inline is used for focused work; navigation is reserved for true full-page tasks | `modal.md`, `full-page-form.md` |
| 11 | Staged complex flow | Sections/steps/status nodes match dependency and commit boundaries; draft/resume behavior is explicit | `full-page-form.md`, `form-rules.md` |
| 12 | Office conditions | 1366 release, 1024 split window, wide desktop, long data, slow interaction, and local overflow are verified | `responsive.md`, `table.md` |
| 13 | Reusable detail system | Size, type, spacing, overlay, table, and visual roles come from shared contracts, not page tuning | `detail-form.md`, `overlay-dimensions.md`, `typography.md` |
| 14 | Product completion | Skeleton/loading, empty, error, no permission, long text, extremes, retry, and partial failure are reproducible | `feedback.md`, `checklist.md` |

Failure of any gate blocks `sellable-saas-grade`, even when the page is visually polished.

## Eight Scored Dimensions

Score each dimension from 1 to 5 using route evidence.

| Dimension | A score of 4-5 requires |
| --- | --- |
| consistency | Same ownership stack and interaction language across representative routes; no page-local skin |
| professionalism | Freight object, terminology, state, workflow, and user job are credible |
| efficiency_feel | Search, scan, update, batch, and next action remain short-path under office conditions |
| order | Identity, working data, risks, actions, and auxiliary information have stable hierarchy |
| completeness | Happy path and applicable edge/error/permission states are designed and recoverable |
| credibility | Calm hierarchy, predictable actions, explicit risk, and low misoperation potential |
| demo_value | The route tells a real workflow and product-value story, not only a field inventory |
| expandability | The shell, archetype, shared APIs, and contracts can support another module without reinvention |

Scale:

- `1`: poor, inconsistent, project-like
- `2`: usable but rough
- `3`: internal-system quality
- `4`: customer-facing product quality
- `5`: sellable SaaS demo quality

Totals:

| Score | Level |
| --- | --- |
| 8-16 | ordinary-project |
| 17-24 | internal-system |
| 25-32 | strong-internal-product |
| 33-37 | customer-facing-product |
| 38-40 | sellable-saas-grade |

Hard limits:

- `sellable-saas-grade` requires every dimension >=4 and `demo_value` >=4.
- `customer-facing-product` requires `consistency` and `credibility` >=4.
- A normal table workbench below 65% first-viewport data ownership cannot score 4-5 for `efficiency_feel` or `order`.
- A second palette/component skin prevents scores of 4-5 for `consistency` and `credibility`.
- A score without real-route evidence is provisional and must not be reported as customer-facing or sellable.

## Required Evidence

A sellable claim requires:

- representative list workbench, object detail, and overlay routes;
- `1366x768`, `1024x768`, `1280x720`, and one wide desktop viewport;
- normal plus applicable loading, empty, permission, validation, business rejection, slow/network failure, retry, long text, extreme values, duplicate submit, and partial batch failure states;
- keyboard focus, local error ownership, state meaning without color, table overflow/fixed columns, and destructive confirmation;
- computed theme/token evidence, first-viewport measurements, visible workflow controls, `check-spec`, build/type check, and remaining risks.

Edge states must be reproducible through fixtures, component/story tests, automated interception, or a QA-only route/query contract. A transient global message does not count when the failure belongs to a field, row, table, or page.

## Page Questions

- List: which queue, what is urgent, what is next, what can be batched?
- Detail: what object, current state, workflow position, risk, next action, and recent change?
- Overlay/form: is the task focused, context-preserving, validated, failure-safe, and cancel-safe?
- Shell: is product identity and module hierarchy stable enough for another domain?

## Output

Report:

```text
product_grade_goal:
consistency:
professionalism:
efficiency_feel:
order:
completeness:
credibility:
demo_value:
expandability:
total_score:
current_level:
demo_ready: yes | partial | no
blocking_issues:
what_to_keep:
what_to_redesign:
next_upgrade_priority:
```

Do not call a page finished when it is only a strong internal system but the requested goal is a sellable product.
