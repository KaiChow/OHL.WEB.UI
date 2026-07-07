# Product-Grade Evaluation

## Purpose

Use this reference when the goal is not only to make a page usable, but to make the system feel like a **sellable industry SaaS product**.

This file defines the product-grade evaluation standard for:

- financing demos
- sales demos
- customer-facing product packaging
- "高级感 / 质感 / 卖软件 / 演示给老板或投资人"
- deciding whether a page looks like a reusable platform product or a one-off project

## Core Position

The target is not "prettier admin UI".

The target is:

**an industry-grade backend product with a unified design language**

For freight SaaS, the right direction is:

- professional
- restrained
- dense
- ordered
- workflow-driven
- delivery-ready

Do not chase decoration, large empty space, or marketing-SaaS styling. The product should feel expensive because it is controlled, coherent, and operationally strong.

## Eight Product-Grade Dimensions

Every important page and every redesign pass should be judged across these eight dimensions.

### 1. Consistency

Question:

- Does every page feel like the same product?

Pass condition:

- shell, workbench, detail, drawer, and modal all use one visual language
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

## Product-Grade Direction Rules

When the goal is product-grade quality:

- do not solve the problem with decoration first
- do not over-focus on one page while the shell stays generic
- do not accept a page that is compliant but still feels like ordinary admin UI
- do not optimize only for internal users if the page must also support sales/demo value

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

## Delivery Judgment

A page may be operationally acceptable but still not product-grade.

Use this rough interpretation:

- **Internal-system pass**: business works, data is present, actions are usable
- **Product-grade pass**: the page also looks coherent, trustworthy, demo-ready, and platform-expandable

Do not confuse those two levels.

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
current_level:
next_upgrade_priority:
```

`current_level` should be one of:

- `internal-system`
- `strong-internal-product`
- `customer-facing-product`
- `sellable-saas-grade`

## Hard Rule

If the page still reads as "能打的内部业务系统" but not "成熟行业 SaaS 产品", do not call the redesign finished.
