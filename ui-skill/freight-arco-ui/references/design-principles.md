# PESDP Design System 2.0

## Positioning

Build **Cargo SaaS Premium Dense** interfaces for international freight forwarding operations.

The product is a high-frequency enterprise production tool, not a marketing site, OA system, CMS backend, or traditional ERP skin.

Core user reality:

- Users operate the system for 8-12 hours per day.
- The product must improve handling speed, information retrieval, collaboration, and error prevention.
- Visual expression serves business efficiency.

Priority order:

1. Efficiency
2. Information
3. Interaction
4. Visual expression

## PESDP Principles

### Professional

Use freight/logistics business language and industry mental models.

Must use domain terms for:

- Order status
- Logistics milestones
- B/L, HBL, MBL
- Container/cargo structure
- Customs, trucking, warehouse, finance workflows

Avoid generic internet expressions when a logistics term exists:

- Do not use `步骤1`, `步骤2`.
- Do not use vague states such as `处理中`, `进行中` when a freight status is available.
- Do not rename industry fields into marketing/OA language.

### Efficient

Every design must reduce at least one user cost:

- Fewer clicks.
- Faster lookup.
- Less thinking.
- Lower error risk.
- Faster repeated operation.

Default to visible high-frequency operations and grouped low-frequency operations.

### Structured

Complex freight pages must expose structure before decoration.

Separate:

- Primary business identity: order no, customer, route, status, ETD/ETA.
- Business operation: forms, tables, task actions, exception handling.
- Auxiliary information: remarks, helper text, logs, secondary metadata.

Do not duplicate the same summary in multiple areas unless it has a separate interaction purpose.

### Dense

High density means more useful information, not smaller everything.

Use:

- Compact rows and controls.
- Predictable 8-12px section rhythm.
- Stable grids and columns.
- Clear truncation/tooltip strategy.

Avoid:

- Large decorative cards.
- Large blank header areas.
- Zero-spacing compression.
- Hiding key business data to look clean.

### Premium

Premium quality comes from:

- Order.
- Consistency.
- Hierarchy.
- Restraint.
- Long-term eye comfort.

Do not create quality by:

- Heavy gradients.
- Decorative animation.
- Large rounded corners.
- Random accent colors.
- Excessive shadows.

Use Arco Design Vue and `@arco-themes/vue-gi-demo` tokens as the color source. Custom color should be exceptional and justified.

## Style Boundaries

Avoid these directions:

| Direction | Why it fails |
|-----------|--------------|
| Traditional ERP | Heavy borders, Excel-like grids, no hierarchy |
| OA system | Weak business thread, loose information organization |
| CMS backend | Content-management structure, weak workflow state |
| Internet operation backend | Marketing visual language, not suitable for high-frequency operations |
| Display SaaS | Low density, large whitespace, poor first-screen efficiency |

## Page Acceptance Questions

Before delivery, answer yes to all:

1. Does the page match freight/logistics industry cognition?
2. Does it improve business efficiency?
3. Is information hierarchy clear?
4. Is density high without crowding?
5. Does it feel premium through order and restraint?

If any answer is no, revise structure before tuning colors.
