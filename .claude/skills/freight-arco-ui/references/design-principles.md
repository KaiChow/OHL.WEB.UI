# PESDP Design System 2.0

## Positioning

Build **Cargo SaaS Premium Dense** interfaces for international freight forwarding operations.

This is a next-generation international freight forwarding SaaS platform, not a traditional ERP. The product should feel modern, premium, trustworthy, and globally oriented while preserving the operational efficiency required by freight forwarding professionals.

Reference products such as Linear, Stripe Dashboard, Flexport, Ramp, Notion Enterprise, and Vercel Dashboard are useful for studying information hierarchy, visual rhythm, restraint, and component organization. Do not copy their visual style, density, radius, whitespace, or consumer-dashboard patterns directly.

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

## Four-Layer Design Model

All UI decisions must flow through four layers:

1. Product Positioning: international freight forwarding SaaS, not ERP.
2. Design Philosophy: business before UI, information first, trust, readability, consistency, operational efficiency.
3. Visual Language: restrained Arco enterprise SaaS, neutral surfaces, white work areas, clear hierarchy, high density with low visual complexity.
4. Implementation Rules: Arco-first → token-second → business-pattern-third → page-local-css-last; then page archetypes, action rules, table rules, and `check-spec`.

If a proposal sounds visually attractive but weakens the implementation rules or business philosophy, reject it.

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

- Primary business identity: object number/name, owner/counterparty, key state, and the 3-6 facts that define the current business object.
- Business operation: forms, tables, task actions, exception handling.
- Auxiliary information: remarks, helper text, logs, secondary metadata.

Do not duplicate the same summary in multiple areas unless it has a separate interaction purpose.

### Dense

High density means more useful information, not smaller everything.

Dense freight UI keeps a visible information rhythm. Labels, controls, buttons, sections, and table rows should be close enough for speed, but still separated enough that users can recognize each unit without rereading.

Use:

- Compact rows and controls.
- Predictable 8-12px section rhythm.
- Visible field rhythm: labels name the business dimension, controls provide the input surface, and spacing preserves that name/value relationship.
- Stable grids and columns.
- Clear truncation/tooltip strategy.

Avoid:

- Large decorative cards.
- Large blank header areas.
- Zero-rhythm compression where labels, controls, buttons, or sections visually merge into one strip.
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

Use Arco Design Vue default theme tokens (`@arco-design/web-vue`) as the color source. Custom color should be exceptional and justified.

## PESDP+ Operating Principles

PESDP is the core design model. PESDP+ adds execution principles for judging whether a page can survive real freight operations.

### Consistency

Maintain one design language across components, spacing, colors, icons, interactions, and behaviors.

- Prefer Arco props, slots, and theme tokens before shared structural classes.
- Use `src/styles/global.css` tokens and documented archetype slots only where Arco + tokens are insufficient (`arco-first.md`).
- Reuse Arco/VXE patterns from the skill references instead of inventing local equivalents.
- Do not let one module introduce a new button style, table chrome, spacing rhythm, status color, or drawer behavior unless it becomes a documented shared pattern.

### Readability

Information should be scannable within seconds.

- The primary object identity, key state, critical amount/date, owner/counterparty, and next available action must be easy to find without reading every field.
- Important values attract attention through position, typography, column order, status semantics, and link/action hierarchy; color is only one supporting signal.
- Dense pages must reduce visual complexity while preserving useful information.

### Action-first

Operations should stay close to the data they affect.

- Prefer inline row actions, table-local toolbars, drawers, and contextual workflows over unnecessary page transitions.
- High-frequency reversible actions stay visible near their working data.
- Destructive, irreversible, or low-frequency batch actions are physically separated and confirmed.

### Focus

Every screen and every local scope needs a clear focus.

- A page may have multiple scopes, such as filter, main table, and child table; each scope can have one primary action.
- Do not create multiple competing emphasis points inside the same scope.
- If everything looks equally important, revise structure before adding more color or weight.

### Trust

Enterprise-grade UI must feel calm, stable, and predictable.

- Use restrained colors, stable layouts, predictable hover/focus/selected states, and explicit confirmation for risk.
- Avoid sudden layout shifts, decorative motion, saturated panels, and ambiguous status colors.
- Error, empty, loading, disabled, and permission states must be clear and business-specific.

### Business Before UI

Visual decisions must serve freight workflows and business efficiency before decoration.

- Map the business object and user job before choosing layout.
- Do not copy another module's fields or action order because the screen shape looks similar.
- If a visual choice hides a key operational fact or adds repeated clicks, it fails even if it looks cleaner.

### Information First

Data is the product. Visual design exists to improve understanding, not compete with information.

- Tables, forms, statuses, amounts, dates, and identifiers are the main content.
- Decoration, color, icons, and empty space must support scanability and decision-making.
- The interface should make business relationships obvious: identity, object-owned facts, workflow/financial/operation data by page archetype, then auxiliary information.

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

## Documentation Layers (skill)

| Layer | File | Language |
|-------|------|----------|
| Framework | Arco Design Vue (`@arco-design/web-vue`) | props / CSS variables |
| Arco-first contract | `arco-first.md` | EN |
| Enhancement tokens / patterns | `src/styles/global.css` | CSS (thin layer) |
| Principles | `design-principles.md` | EN |
| Structure slots | `module-patterns.md` | EN |
| Domain wording | `domain-language.md` | ZH examples |
| Component rules | `table.md`, `actions.md`, … | EN + code |
| Acceptance | `checklist.md`, `check-spec.js` | EN |

Do not duplicate long rule lists in `AGENTS.md` / `CLAUDE.md` — they link to this skill.
