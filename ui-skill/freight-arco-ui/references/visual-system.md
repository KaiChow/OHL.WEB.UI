# Visual System

## Goal

Build a modern dense freight SaaS interface under PESDP: clear hierarchy, compact operations, Arco-native theme color, low visual noise, and long-term comfort.

The system must not look like a gray traditional ERP. It also must not look like a decorative marketing SaaS.

Premium quality must come from order, consistency, hierarchy, and restraint. Do not use visual decoration to compensate for weak information architecture.

## Color Rhythm

| Layer | Rule |
|------|------|
| Page background | Use `--dense-page-bg`: light primary tint at the top, then `color-bg-body`. |
| Cards | Use white `color-bg-card`, subtle border, and `--dense-shadow-card`. |
| Active navigation | Use `primary-1/2/6/7`, not custom blue. |
| Table header | Use light primary tint or `color-bg-card` with a clear primary bottom line. |
| Status | Use semantic tokens only: `warning`, `primary`, `success`, `danger`, `cyan`, `purple`, neutral. |
| Disabled/empty | Use `color-text-4` and `color-fill-1/2`, only for low-priority information. |

Use Arco Design Vue and `@arco-themes/vue-gi-demo` as the color source. Do not build an independent palette.

## Gray Budget

- Do not let gray occupy the page without a primary anchor.
- `color-text-4` is only for empty value, disabled state, timestamps, or helper text.
- `color-fill-1/2` is only for secondary containers or disabled controls.
- Main business values use `color-text-1`.
- Interactive values use `primary-6`.
- Page-level gray is allowed only as a quiet base. Key active navigation, primary operation, selected state, and core links must create a visible Arco-primary rhythm.

## Information Hierarchy

Order of visual strength:

1. Page active nav / primary action / core link: `primary-6`.
2. Business key data: `color-text-1`, `--dense-font-data`.
3. Normal fields: `color-text-2`.
4. Helper/meta: `color-text-3`.
5. Empty/disabled: `color-text-4`.

Hierarchy must be created through layout, typography, semantic color, and action priority together.

- Primary identifier must be visually easier to find than passive metadata.
- Module title, module summary, child title, table header, and row data must use different roles, not random font sizes.
- Tables must show a primary identifier and next-decision fields before passive fields.
- Empty states use weak typography and clear action, not large gray blank areas.
- Do not use bigger font size as the first solution for weak hierarchy.

## Dense Table Color Hierarchy

Workbench tables need a visible but restrained primary rhythm. A table that is technically compact but visually all gray fails PESDP.

Required:

- Table header may use a subtle Arco primary tint or primary border to anchor the grid.
- Primary identifiers and business codes use `primary-6/7` links and medium/title weight.
- Core business values such as customer, shipper, consignee, port, and container quantity use `color-text-1`.
- Dates and passive metadata may use `color-text-2`; empty values use `color-text-4`.
- Status pills must be readable at scan distance; use semantic token level 7 for text when level 6 is too weak.
- Row actions should be visible as actions but not compete with data: text/icon buttons with primary hover, no always-heavy button frames.
- Zebra stripes must be very low contrast. They should support scanning, not create a gray page.

Avoid:

- Header, body, stripe, fixed column, and toolbar all using similar gray fills.
- Status labels that look like disabled text.
- Action icons that look disabled before hover.
- Making every code/link the same strength when one identifier is the primary object.

## Text Color Roles

Use text color by information role, not by visual decoration.

| Role | Color | Examples |
|------|-------|----------|
| Core business value | `color-text-1` | order no, customer name, staff name, route ports, HBL/MBL, dates that drive work |
| Normal readable value | `color-text-2` | company/context, selected form value, table secondary value |
| Label/meta | `color-text-3` | fact labels, helper labels, secondary timestamps, summary labels |
| Empty/disabled only | `color-text-4` | `—`, `暂无`, disabled option, placeholder-like empty state |

Rules:

- Do not use `color-text-4` for customer, company, staff, carrier, vessel/voyage, route, or any value users must scan.
- Fact labels in detail headers use `color-text-3`, not `color-text-4`; the corresponding values use `color-text-1`.
- Staff/person display must show at least role + person name; company/department can be auxiliary but must remain readable.
- If text is hard to read, first check whether a business value was incorrectly styled as helper/disabled text.
- Helper text must never compete with key values, but it must still meet readable contrast.

## Status System

Use `.s-pill[data-s]`.

| data-s | Meaning |
|--------|---------|
| `wait` | waiting, pending, attention |
| `op` | processing, operating, in progress |
| `partial` | partial completion |
| `acc` | accepted, received, completed-like info |
| `rel` | released, settled, done |
| `draft` | draft, inactive |
| `rej` | rejected, exception, overdue, reversal |

Never color an entire table row by status.

### Status Dot Rule

A status must be visually recognizable, but a leading dot is not the default requirement.

Default:

- Use `.s-pill[data-s]` with semantic background, border, and readable text.
- Do not add a leading dot to normal table status, detail header status, or attachment status.
- Do not combine dot + icon + colored background in the same small label.

Optional dot:

- Use `.s-pill.s-pill--dot` or `.dds-status-badge.dds-status-badge--dot` only for timeline legends, compact activity feeds, or a plain text status that has no pill background.
- A dot must carry semantic color. It must not appear as a black bullet.

Risk labels:

- Risk or attribute labels such as `危险货`, `超大件`, `带电池` are not workflow statuses.
- Use semantic label color and, when needed, one icon. Do not add a status dot when an icon is already present.
- Risk labels should support scanning without making the whole row look abnormal.

## Premium Dense Rules

- Prefer subtle border + surface hierarchy over strong shadows.
- Prefer Arco default radius unless a global dense token already defines otherwise.
- Keep long-term reading comfortable: no heavy contrast blocks, no saturated full-width backgrounds.
- Use whitespace as grouping rhythm, not as decorative emptiness.
- If a page feels "plain", first improve hierarchy and business grouping, then adjust token-based color accents.

## Hard Bans

- No standalone hex colors in new UI CSS.
- No large gray panels that do not carry hierarchy.
- No decorative gradients except the approved subtle page/surface tint based on Arco primary tokens.
- No `font-weight: 700/800` in business UI.
- No negative letter spacing.
- No large-radius consumer SaaS styling unless Arco default component radius produces it.
