# Existing Project Modernization

Use for an existing page with no screenshot, Figma file, or target mockup. The current page proves behavior and data relationships; it is not automatically the visual authority.

## Intake

Before editing, record only facts that change the implementation:

```text
route_or_surface:
business_object:
primary_user_and_job:
behavior_to_preserve:
measured_layout_or_interaction_debt:
modernization_mode:
target_product_grade:
```

Choose one mode:

| Mode | Use when | Allowed change |
| --- | --- | --- |
| `theme-realignment` | Structure works; ownership/palette is broken | Remove duplicate skins and restore GI/Arco/shared ownership |
| `surface-regrouping` | Behavior works; zones compete or waste space | Reorder and merge surfaces without changing business behavior |
| `skeleton-rewrite` | Archetype or primary job path is weak | Rebuild composition while preserving contracts and permissions |

Spacing-only polish is not a modernization mode when the defect is structural.

## Source Order

1. Business object, user job, permissions, API behavior, and working state.
2. Typed `pageSpec.ts` and feature contracts.
3. Arco/GI ownership.
4. One primary page authority plus affected surface authorities.
5. Grep-proven shared patterns.
6. Existing DOM/CSS only where it satisfies the layers above.

Never preserve a weak skeleton merely because it already works. Never change business behavior merely to improve composition.

## Rendered Layout Gate

Measure the real page root and primary work surface; do not infer quality from source.

For a normal table workbench at `1366x768`:

- one command surface and one dominant data surface are the normal maximum;
- the data surface should own at least 70% of usable page height; below 65% blocks release;
- the normal query/workflow area stays near 112px and should not exceed about 128px without recorded workflow need;
- the primary command path does not wrap into a second workflow band;
- the page shell and command surface do not create browser-level horizontal overflow.

At `1024x768`, verify split-window containment and internal overflow ownership. At wide desktop, expose more data or breathing room; do not scale type, controls, or decorative whitespace.

The percentage threshold is for table-dominant workbenches only. Detail, approval, form, dashboard, and overlay routes still need one unmistakable primary work surface and one scroll owner per region.

Record viewport, usable height, command height, primary-surface height, ratio, visible rows or fields, and overflow owner.

## Business And Interaction Gate

Before restructuring, freeze what must not regress:

- visible high-frequency actions and current route/detail entry;
- query/reset/Enter semantics and applied-filter feedback;
- selection, batch scope, row actions, pagination, and column settings;
- permissions and action legality;
- loading, empty, failure, retry, destructive confirmation, and input preservation.

The first viewport must answer: what object or queue is this, what needs attention, what can be done now, what comes next, and who owns it? A field inventory with buttons is not a product workflow.

## Visual Direction

Target a modern freight operations workbench, not a landing page, decorative dashboard, flat gray ERP, or generic admin template.

- Physical surfaces express different ownership; logical rows may share one Arco surface.
- Daily filters and workflow controls remain visible; rare and risky actions may move to controlled secondary surfaces.
- Identity and decision fields precede passive metadata.
- GI neutral surfaces carry the layout; primary color marks focus/action and semantic colors mark state/risk.
- Cards, summaries, counts, titles, and instructions are not duplicated.
- Density comes from shared typography/control/table tokens, not tiny text or collapsed targets.

When a compliant page still feels weak, first change surface relationships, ownership, or workflow emphasis. More color, borders, shadows, and page-local CSS do not repair a weak skeleton.

## CSS And Shared Capability Gate

Preferred implementation:

1. Arco props/slots/primitives.
2. Existing shared classes.
3. Shared Vue/CSS capability when reuse already exists or a second consumer ships in the same change.
4. Page-local CSS for shell/flex/overflow only.

For a list/workbench rewrite, prefer about 80 or fewer scoped CSS lines. Above about 120 lines or 15 local visual selectors, stop and extract shared structure or record why Arco/shared APIs cannot express it. Never re-skin Arco Card, Form, Input, Drawer, Button, or Dropdown in page scope.

## Workflow

1. Complete the intake and preserve behavior contracts.
2. Update `pageSpec.ts` before material template work.
3. Capture before evidence on the real route.
4. Repair theme ownership, then skeleton/workflow, then local visual rhythm.
5. Prefer shared capability before local chrome.
6. Exercise relevant normal and adverse states.
7. Capture after evidence at required viewports.
8. For commercial goals, run `product-grade-evaluation.md` as pass/fail.

## Delivery Evidence

```text
modernization_mode:
behavior_preserved:
shared_capability_reused_or_added:
page_local_css_before_after:
rendered_before_after:
interaction_and_state_evidence:
remaining_blockers:
```

No real-route before/after evidence means the modernization result is unverified.
