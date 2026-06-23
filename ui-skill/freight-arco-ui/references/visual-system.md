# Visual System

## Goal

Build a modern dense freight SaaS interface under PESDP: clear hierarchy, compact operations, Arco-native theme color, low visual noise, and long-term comfort.

The system must not look like a gray traditional ERP. It also must not look like a decorative marketing SaaS.

Premium quality must come from order, consistency, hierarchy, and restraint. Do not use visual decoration to compensate for weak information architecture.

## Color Rhythm

| Layer | Rule |
|------|------|
| Page background | Use neutral Arco surfaces: `color-bg-body` / `color-fill-1`. Do not tint the whole page with primary. |
| Cards | Use white `color-bg-card`, subtle border, and `--dense-shadow-card`. |
| Active navigation | Use project primary aliases such as `--dense-primary-*`, not custom blue. |
| Table header | Prefer `color-bg-card` / `color-fill-1`; use primary only as a thin anchor line or hover/selection tint. |
| Status | Use semantic tokens only: `warning`, `primary`, `success`, `danger`, `cyan`, `purple`, neutral. |
| Disabled/empty | Use `color-text-4` and `color-fill-1/2`, only for low-priority information. |

Use Arco Design Vue and `@arco-themes/vue-gi-demo` as the color source. Do not build an independent palette.

## Primary Usage Boundary

Arco primary is the interaction anchor, not the page background.

| Token role | Allowed usage | Not allowed |
|------------|---------------|-------------|
| `--dense-primary-6/7` | main links, active nav, primary button, focused control, selected step | normal body text, table values that are not links |
| `--dense-primary-1/2` | small hover surfaces, selected tab count, focus ring, subtle action dock | full toolbar/filter/table body background |
| `--dense-primary-3/4` | hover/selected border, focus boundary, thin table header anchor | dense repeated row borders or large colored blocks |
| semantic colors | status pills, risk labels, validation and danger actions | decoration, row background, unrelated emphasis |
| neutral tokens | page background, card surface, toolbar surface, default table rows | key state or active interaction |

Rules:

- A viewport should have a small number of primary anchors: active nav, primary action, key links, and focused/selected state.
- Search cards, toolbar rows, table caps, and table body default surfaces stay neutral unless they are in active/hover/selected state.
- Do not solve “too gray” by tinting every container. Improve hierarchy through primary identifiers, status pills, table columns, and action priority first.
- If a raw theme token fix makes the page visibly bluer, reduce the semantic alias intensity or move that surface back to neutral.
- `--dense-primary-1/2/3/4` are project semantic aliases. They may be weaker than the original theme scale to preserve long-term comfort.

## Selected State Standard

Selected state must look selected, not like a default black bordered button.

For tabs, status filters, quick chips, checkbox chips, segmented controls, and local option groups:

- Default: neutral text (`color-text-2/3`), neutral or transparent background, no strong border.
- Hover: subtle primary tint and primary text.
- Selected: `--dense-primary-1` background, `--dense-primary-4` border, `--dense-primary-7` text, optional inset focus line using `--dense-primary-2`.
- Selected count badges use `--dense-primary-2` background and `--dense-primary-7` text.
- Do not use raw black border, `color-text-1` text, or browser default button styling to represent selected state.
- Do not use filled primary blue for every selected filter chip in dense rows. Filled primary is reserved for primary actions or very small active nav anchors.

## Token Usage

`@arco-themes/vue-gi-demo` exposes `--primary-*`, `--warning-*`, `--success-*`, and similar variables as RGB channel values, not complete CSS colors.

Correct:

- `rgb(var(--primary-6))`
- `rgba(var(--primary-6), 0.12)`
- project aliases such as `var(--dense-primary-6)` from `src/styles/global.css`
- semantic project aliases such as `var(--dense-warning-6)`, `var(--dense-success-6)`, and `var(--dense-danger-6)`

Incorrect:

- `color: var(--primary-6)`
- `border-color: var(--primary-2)`
- `background: var(--primary-1)`
- `color: var(--warning-6)`
- `background: var(--danger-1)`

The incorrect form creates invalid CSS color values such as `190, 218, 255`; browsers may fall back to current text color, which can make dividers appear black. New UI CSS should use `--dense-primary-*` aliases or explicit `rgb(var(...))`.

## Gray Budget

- Do not let gray occupy the page without a primary anchor.
- `color-text-4` is only for empty value, disabled state, timestamps, or helper text.
- `color-fill-1/2` is only for secondary containers or disabled controls.
- Main business values use `color-text-1`.
- Interactive values use `--dense-primary-6` or `rgb(var(--primary-6))`.
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

## Dark Color Boundaries

The system uses Arco text tokens, not raw black.

- `color-text-1` is for core readable business values only: order number, customer, route, amount, and other scan-critical data.
- UI chrome such as borders, dividers, operation docks, icon button frames, card edges, and table separators must not use raw black, currentColor black, or strong dark outlines.
- Default action icons use `color-text-3` or Arco primary-muted; hover/focus uses `--dense-primary-*`.
- Repeated controls inside table rows must avoid permanent dark borders because they form a black visual column and reduce all-day comfort.
- If an area looks "too black", first check whether border/icon styles are using `color-text-1`, browser default `currentColor`, raw black, or invalid RGB token fallback.

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
