# Product-Grade Evaluation

## Purpose

Use this reference when the goal is not only to make a page usable, but to make the system feel like a **sellable industry SaaS product**.

This file defines the product-grade evaluation standard for:

- financing demos
- sales demos
- customer-facing product packaging
- boss / investor demos
- `高级感 / 质感 / 卖软件 / 产品化 / 商业包装感`
- deciding whether a page looks like a reusable platform product or a one-off delivery project

## Core Position

The target is not:

> prettier admin UI

The target is:

> an industry-grade backend product with a unified design language

For freight SaaS, the right direction is:

- professional
- restrained
- dense
- ordered
- workflow-driven
- delivery-ready
- credible
- platform-expandable

Do not chase decoration, large empty space, or marketing-SaaS styling. The product should feel expensive because it is controlled, coherent, rigorous, operationally strong, and reusable across modules.

A page may be operationally acceptable but still not product-grade.

## Sellable Freight Product Maturity Gates

These gates translate product maturity into executable UI and interaction evidence. They route to existing authorities instead of creating a second component specification.

| # | Gate | Project pass condition | Authority / required evidence |
|---|------|------------------------|-------------------------------|
| 1 | One product | Shell, query, table, detail, overlay, action, status, spacing, and feedback use one ownership stack; no page-local skin or team-specific pattern | `theme-contract.md`, `arco-first.md`; cross-route screenshots and computed tokens |
| 2 | Dense, not crowded | Data dominates operational pages; labels, controls, and rows keep readable rhythm; density never comes from tiny text or collapsed hit targets | `redesign-calibration.md`, `typography.md`, `component-size.md`; measured first viewport |
| 3 | Stable archetypes | The route identity appears once in the shell or page, followed by command context and the primary work surface; pagination belongs to the data surface | `page-archetypes.md`, `list-page.md`, `detail-form.md`; same-archetype comparison |
| 4 | Clear action priority | One visual primary per scope; daily reversible actions visible; rare actions grouped; destructive actions separated and confirmed | `actions.md`, `feature-delivery-contract.md`; action inventory by frequency and risk |
| 5 | Professional query | Daily conditions visible; occasional conditions expand or move to a grouped drawer; reset and condition feedback are stable; saved schemes exist when repeated query sets are a real workflow | `filter-layout.md`, `feature-delivery-contract.md`; query scenario and persistence contract |
| 6 | Office-grade table | VXE table has rational min-widths, key/fixed columns, horizontal scroll, selection/batch contract, column settings, density behavior, and readable overflow handling | `table.md`; 1366 and long-data evidence |
| 7 | Recognizable status | One `.s-pill[data-s]` semantic system; text always names the state; color is secondary and never the only discriminator | `visual-system.md`, `table.md`; status inventory and grayscale/contrast review |
| 8 | Complete feedback | Loading, success, failure, disabled, empty, permission, duplicate-submit, and refresh outcomes are explicit | `feedback.md`, `feature-delivery-contract.md`; success/failure/network/permission cases |
| 9 | Exception locality | Field errors stay at the field; row conflicts stay at the row/cell; a summary may navigate to errors but never replace their local markers | `feedback.md`, `form-rules.md`; focus/scroll-to-error evidence |
| 10 | Context preservation | Detail, simple edit, supplemental data, and row workflow prefer drawer/modal/inline handling when legal; full navigation is reserved for genuinely full-page work | `page-archetypes.md`, `modal.md`, `feature-delivery-contract.md`; navigation rationale |
| 11 | Staged complex flow | Complex order/review/fee work uses sections, steps, or status nodes according to dependency and commit boundaries; progress and draft preservation are explicit | `full-page-form.md`, `form-rules.md`; stage decision and resume behavior |
| 12 | Real office conditions | 1366 laptop is release-blocking; 1024 split-window is the supported lower desktop bound; long tables, multiple windows, slow interaction, and wide desktop are evaluated explicitly | `responsive.md`, `table.md`; viewport matrix and overflow record |
| 13 | Reusable detail system | Heights, spacing, radii, shadows, overlay widths, table rows, and typography come from shared variables/roles; pages do not tune their own visual scale | `theme-contract.md`, `component-size.md`, `overlay-dimensions.md`, `typography.md`; token audit |
| 14 | Product completion | Skeleton/loading, empty, error, no-permission, long text, extreme values, slow network, partial failure, and retry paths are designed | `feedback.md`, `feature-delivery-contract.md`, `checklist.md`; edge-state matrix |

Core acceptance language: **unified, compact, clear, efficient, predictable, and traceable**.

### Release Evidence Matrix

A `sellable-saas-grade` claim requires all of the following:

- at least one representative list workbench, object detail, and drawer/modal inspected on real routes;
- `1366x768` and `1280x720` desktop evidence, plus one wide desktop such as `1920x1080`;
- a `1024x768` split-window audit proving compact-shell behavior, local overflow ownership, and access to primary commands;
- normal, loading/skeleton, empty, permission, validation, business rejection, network failure, slow request, long text, extreme numeric/date, and partial batch failure states;
- keyboard focus, error localization, state text without color, horizontal table scroll, fixed-column behavior, and action confirmation evidence;
- successful `check-spec`, type check/build, and a remaining-risk list.

Failure of any gate may still allow an internal release, but it blocks `sellable-saas-grade`.

### Deterministic Edge-State Evidence

Product completion states must be reproducible through a fixture, component/story test, automated interception, or a documented QA-only route/query contract. Reviewers must not need to edit production handlers or wait for a real outage to inspect them.

- The harness covers loading, slow request, empty, permission, request error with retry, long text, extreme values, and partial batch failure where the archetype owns those states.
- A state rendered only as a transient global Message does not count when the failure belongs to a field, row, table, or page surface.
- QA controls must not appear as explanatory text or developer switches in the normal product UI.
- Evidence records the state trigger, viewport, expected local owner, recovery action, and whether user input/selection is preserved.

## Eight Product-Grade Dimensions

Judge every important page and every redesign pass across these eight dimensions.

### 1. Consistency

Question:

- Does every page feel like the same product?

Pass condition:

- shell, workbench, detail, drawer, and modal use one visual language
- button hierarchy, table chrome, status semantics, spacing, and interaction states are consistent
- no page introduces its own local design language

Failure signals:

- one page looks premium, another looks like default admin
- shell and page surfaces feel unrelated
- repeated actions look different in different modules

### 2. Professionalism

Question:

- Does the page match industry business language and operating habits?

Pass condition:

- uses freight terms, object logic, and workflow vocabulary
- structure matches how freight users actually operate
- data and actions reflect real job flow, not generic backend conventions

Failure signals:

- labels sound generic, OA-like, or internet-style
- the page shape hides the real business thread

### 3. Efficiency Feel

Question:

- Can users quickly search, update, and batch-handle work?

Pass condition:

- high-frequency search, state filters, and next actions are short-path
- batch and row actions are obvious and legal
- the page supports repeated daily work without extra clicks

Failure signals:

- workflow controls are hidden for cleanliness
- users must navigate too much to finish daily work

### 4. Order

Question:

- Are information groups clear and is the hierarchy obvious?

Pass condition:

- identity, working data, risk, finance, files, and auxiliary info are clearly separated
- strong primary/secondary/auxiliary order exists in both layout and typography
- the page reads from top to bottom in a stable business sequence

Failure signals:

- everything looks equally important
- repeated summary blocks and parallel tool strips compete
- data is present but hard to parse

### 5. Completeness

Question:

- Are loading, empty, error, permission, validation, and edge states fully considered?

Pass condition:

- loading/empty/error/disabled/permission states are explicit
- destructive actions are confirmed
- forms and tables preserve user intent on failure
- the page feels finished, not only happy-path complete

Failure signals:

- only the happy path is designed
- invalid/permission/empty states look like afterthoughts

### 6. Credibility

Question:

- Does it look stable, rigorous, and unlikely to cause mistakes?

Pass condition:

- visual hierarchy is calm and controlled
- interactions are predictable
- dangerous actions are separated
- state meaning is never ambiguous

Failure signals:

- too many equal-weight actions
- unstable emphasis
- unclear state colors
- the page feels like users might misclick

### 7. Demo Value

Question:

- Can the team tell a complete business story and product value story from this page?

Pass condition:

- the page can explain a real workflow
- queues, actions, risks, and progress are visible enough for demos
- the page communicates value, not just field completeness

Failure signals:

- can only explain fields, not business progress
- good for operators but weak for customer/leader/investor narrative

### 8. Expandability

Question:

- Does this feel like part of a platform that can keep growing?

Pass condition:

- layout logic is reusable
- shell and page archetypes feel platform-ready
- new modules could fit the system without visual reinvention

Failure signals:

- each page feels one-off
- the system looks like a project delivery, not a product platform

## Scoring Rule

Score each dimension from `1` to `5`.

- `1` = poor / project-like / inconsistent
- `2` = usable but rough
- `3` = internal-system pass
- `4` = customer-facing product quality
- `5` = sellable SaaS demo quality

Total score interpretation:

- `8-16` = ordinary-project
- `17-24` = internal-system
- `25-32` = strong-internal-product
- `33-37` = customer-facing-product
- `38-40` = sellable-saas-grade

Hard scoring rules:

- A page cannot be marked `sellable-saas-grade` if any dimension is below `4`.
- A page cannot be marked `customer-facing-product` if `consistency` or `credibility` is below `4`.
- A page cannot be marked `sellable-saas-grade` if `demo_value` is below `4`.
- A page may pass internal operation but still fail product-grade quality.
- Product-grade claims require evidence from a real route. For table workbenches record viewport, usable content height, table host height, data ownership ratio, computed theme tokens, and visible workflow controls.
- A normal table workbench below 65% first-viewport data ownership cannot score `4` or `5` for efficiency feel or order.
- A page that does not leave GI as the sole palette owner, contains duplicate component skins, or redeclares official theme values cannot score `4` or `5` for consistency or credibility.
- A score without evidence is provisional and must not be reported as `customer-facing-product` or `sellable-saas-grade`.

## Current Level Definitions

### `internal-system`

- Business works, data is present, and operators can complete tasks.
- Still looks generic, inconsistent, or project-like.
- Acceptable for internal delivery, not enough for sales or financing demos.

### `strong-internal-product`

- Structure is clear and workflow is visible.
- Has operational strength and some product consistency.
- Still lacks polished shell, strong demo value, or platform-level finish.

### `customer-facing-product`

- Looks coherent and trustworthy.
- Business story, workflow, and risks are understandable.
- Suitable for customer demos and sales communication.

### `sellable-saas-grade`

- Feels like a mature SaaS product that can be sold.
- Has unified product identity, strong professionalism, high credibility, strong demo value, and platform-expandable structure.

## Page-Type Expectations

Product-grade evaluation must consider page type. Different page types have different pass conditions.

### Global Shell

Must communicate:

- product identity
- stable module hierarchy
- consistent navigation and page context
- long-term platform expandability

Failure signal:

- still reads like a default admin template with unrelated content pages

### List Workbench

Must answer:

- What queue am I looking at?
- Which records are urgent?
- What needs to be handled first?
- What can I batch process?
- What is the next action?

Failure signal:

- looks like a raw table with buttons instead of a workbench

### Object Detail Workspace

Must answer:

- What object is this?
- What is its current status?
- Where is it in the workflow?
- What risks exist?
- What needs to be done next?
- What changed recently?

Failure signal:

- still reads like a field-complete form page rather than a business object workspace

### Drawer / Modal / Focused Flow

Must feel:

- task-focused
- context-aware
- validated
- safe for submit / confirm / cancel

Failure signal:

- becomes a dumping ground for fields or low-context actions

## Freight SaaS Product Signals

A freight SaaS page is not product-grade unless it makes these signals visible where relevant:

- shipment identity
- workflow progress
- risk visibility
- next action
- auditability

Common freight identity signals:

- business order number
- customer
- route
- carrier
- vessel / voyage
- ETD / ETA
- owner / operator

Common product-grade freight questions:

- Which shipment is this?
- Where is it now?
- What is blocked?
- What is next?
- Who owns the next move?

## Product-Grade Direction Rules

When the goal is product-grade quality:

- do not solve the problem with decoration first
- do not over-focus on one page while the shell stays generic
- do not accept a page that is compliant but still feels like ordinary admin UI
- do not optimize only for internal users if the page must also support sales/demo value
- do not hide operational controls only for visual cleanliness
- do not let each module invent its own structure

The upgrade path should usually be:

1. shell quality
2. workbench archetype quality
3. object detail workspace quality
4. edge-state completeness
5. platform consistency

## Translation Of Common Feedback

Translate these business-facing criticisms into product-grade actions:

| Feedback | Required action |
|----------|-----------------|
| `不像产品` | Improve shell, hierarchy, and reusable surface language |
| `不像能卖的软件` | Improve product identity, page storytelling, and finish level |
| `没高级感` | Improve restraint, hierarchy, and surface system; do not add decoration blindly |
| `像项目，不像平台` | Improve consistency, shell, archetypes, and reusable patterns |
| `能用但不贵` | Improve credibility, coherence, and demo value |

## Output Standard

When the user asks for product quality, financing/demo quality, or sellable SaaS quality, report:

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
demo_ready:
blocking_issues:
what_to_keep:
what_to_redesign:
next_upgrade_priority:
```

`current_level` must be one of:

- `internal-system`
- `strong-internal-product`
- `customer-facing-product`
- `sellable-saas-grade`

`demo_ready` must be one of:

- `yes`
- `partial`
- `no`

## Hard Rules

- If the page still reads as `能打的内部业务系统` but not `成熟行业 SaaS 产品`, do not call the redesign finished.
- Do not add decoration before fixing shell, hierarchy, business structure, status semantics, action priority, and edge-state completeness.
- If every page needs a new layout idea, the system is not platform-grade.
