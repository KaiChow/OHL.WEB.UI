# Visual System

## Goal

Build a modern dense freight operations workbench under PESDP: clear hierarchy, compact operations, Arco-native theme color, low visual noise, and long-term comfort for high-frequency office work.

The system must not look like a gray traditional ERP, and it must not look like an over-tinted blue domestic admin template. It also must not look like a decorative marketing SaaS.

Premium quality must come from order, consistency, hierarchy, and restraint. Do not use visual decoration to compensate for weak information architecture.

## Professional ERP Positioning

This project targets a professional freight ERP/SaaS interface for sales, operators, and coordinators who work in the system for 8+ hours per day. The priority order is:

1. Business efficiency.
2. Long-session visual comfort.
3. Visual beauty.

For table-dominant workbench pages, use the rendered layout gate owned by `existing-project-modernization.md`. This file defines visual roles, not competing layout thresholds.

The correct direction is not "old ERP" and not "minimal SaaS dashboard." The target is **Modern Freight Operations Workbench**: dense data, low visual noise, visible high-frequency workflows, semantic status, and stable Arco/VXE interaction.

## Old vs New Calibration

Old ERP-style pages often have real operational value:

- more daily filters are visible;
- status tabs support repeated handoff work;
- high-frequency actions are one click away;
- table density is high and familiar to operators.

Their failure is visual execution, not the existence of those controls:

- too many saturated blue buttons;
- warning/orange used as a workflow button instead of a risk state;
- red row/text overuse for normal data;
- visible vertical grid lines and heavy borders;
- search, toolbar, tabs, and table all have similar visual weight.

Over-minimal SaaS pages create the opposite failure:

- daily filters are hidden behind extra clicks;
- status tabs disappear even when users work by status all day;
- toolbar actions become too few or too quiet;
- the page looks premium but slows production work.

Therefore, modernizing this system means **keeping the operational affordances and correcting color, hierarchy, grouping, and density**.

## 2026 Enterprise SaaS Calibration

When comparing against modern enterprise SaaS products, the valid critique is not "add more color" or "make everything larger." The valid critique is that the main work surface must avoid three old ERP signals:

- overuse of blue tint on containers, headers, borders, and buttons;
- visible vertical grid lines and repeated framed boxes;
- flat same-weight zones where search, toolbar, table, and child table all feel equally bordered.

The target standard is **Brand-Neutral Premium Dense**:

1. Brand-neutral page base: calm, cool, and professional, but not flat gray.
2. White working surfaces.
3. Subtle shadow plus very light brand-neutral hairlines.
4. Weak horizontal table separators.
5. Primary color only for active, selected, focused, linked, and one main action.
6. Semantic colors only for status, validation, risk, and destructive actions.
7. Freight density preserved through compact controls and information rhythm, not through Excel-like borders.

Do not copy consumer SaaS defaults into freight operations. Large 12px card radii, spacious 44-46px rows, and multicolor workflow buttons may look modern in a light dashboard, but they reduce first-screen throughput in high-frequency freight finance and operation workbenches. Use those only for low-frequency review or analytics pages with a documented archetype reason.

## Arco Theme Color Contract

The product palette is the effective `@arco-themes/vue-gi-demo` palette. Do not replace it with a project-specific "freight blue", "deep-sea neutral", fixed hex palette, or copied token table.

| Role | Token/value | Rule |
|------|-------------|------|
| Page workbench base | `--dense-page-bg` → `var(--color-fill-1)` | Use the GI neutral surface; no page-local replacement. |
| Primary work surface | `var(--color-bg-1)` / `var(--color-bg-card)` | Search, toolbar, table card and drawer body follow GI. |
| Structural boundary | `--dense-card-border` → `var(--color-border-1)` | Use the GI boundary hierarchy without custom color values. |
| Primary anchor | `--dense-primary-6/7` | Query, create, active segment, links, focus, one main action. |
| Semantic states | direct aliases of GI `warning`, `success`, `danger` and supported status scales | Status, validation, risk, and destructive intent only. |

Do not solve "too gray" with random accent colors. First check whether the page has the required anchors: active page segment, one primary action, scan-critical links, semantic status pills, selected/hover states, and neutral freight hairlines.

Do not solve "too blue" by removing all primary anchors. The page needs enough primary rhythm to feel like a product, but blue must remain an interaction/status signal, not wallpaper.

## Color Rhythm

| Layer | Rule |
|------|------|
| Page background | Use a brand-neutral cool surface via `--dense-page-bg`. Do not use flat gray or blue gradients as the page base. |
| Cards | Use Arco Card only for a genuinely framed owner or repeated item. Keep its GI surface, border, radius, and shadow; do not create a second project skin. |
| Active navigation | Use project primary aliases such as `--dense-primary-*`, not custom blue. |
| Table header | Use VXE public props and its GI-compatible native appearance. Do not repaint headers through global selectors or theme-variable overrides. |
| Status | Use semantic tokens only: `warning`, `primary`, `success`, `danger`, `cyan`, `purple`, neutral. |
| Disabled/empty | Use `color-text-4` and `--dense-control-disabled-bg`, only for true disabled or low-priority empty. |
| Interactive control surface | GI component styles and official surface tokens | Do not globally repaint inputs/selects/pickers. |

Use the ownership stack in `theme-contract.md`: `@arco-themes/vue-gi-demo` is the single component CSS and palette baseline. Do not also import the default Arco stylesheet, add a project theme adapter, or build a page-local palette.

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
- Do not solve "too gray" by tinting every container. Improve hierarchy through brand-neutral hairlines, surface layering, primary identifiers, status pills, table columns, and action priority first.
- Do not solve "too blue" by assigning arbitrary colors to workflow buttons. Buttons use type hierarchy; colors use semantic meaning.
- Module boundaries use the effective GI border hierarchy. Do not add colored top borders as generic decoration.
- `--dense-primary-*` aliases map directly to the effective GI scale. Do not retune their values in a page or shared pattern.

## Selected State Standard

Selected state must look selected, not like a default black bordered button.

For custom freight selection patterns only:

- Default: neutral text (`color-text-2/3`), neutral or transparent background, no strong border.
- Hover: subtle primary tint and primary text.
- Selected: `--dense-primary-1` background, `--dense-primary-4` border, `--dense-primary-7` text, optional inset focus line using `--dense-primary-2`.
- Selected count badges use `--dense-primary-2` background and `--dense-primary-7` text.
- Do not use raw black border, `color-text-1` text, or browser default button styling to represent selected state.
- Do not use filled primary blue for every selected filter chip in dense rows. Filled primary is reserved for primary actions or very small active nav anchors.

Arco Tabs, Radio Group, Checkbox, Segmented, Select, and Tree keep GI native selected/hover/focus states. Do not reproduce the rules above by overriding their internal selectors.

## Token Usage

Arco Design Vue exposes `--primary-*`, `--warning-*`, `--success-*`, `--color-*`, and similar CSS variables. Some are RGB channel values. Page code must not depend on that raw representation.

Correct only while declaring framework-neutral semantic aliases in `global.css`:

- `rgb(var(--primary-6))`
- `rgba(var(--primary-6), 0.12)`

Correct in page, component, and skill CSS:

- project aliases such as `var(--dense-primary-6)` from `src/styles/global.css`
- semantic project aliases such as `var(--dense-warning-6)`, `var(--dense-success-6)`, and `var(--dense-danger-6)`

Incorrect:

- `color: var(--primary-6)`
- `border-color: var(--primary-2)`
- `background: var(--primary-1)`
- `color: var(--warning-6)`
- `background: var(--danger-1)`

The incorrect form creates invalid CSS color values such as `190, 218, 255`; browsers may fall back to current text color, which can make dividers appear black. New UI CSS should use `--dense-*` aliases.

### Project Token Boundary

The GI theme owns official Arco variable values. `src/styles/global.css` owns only direct project semantic aliases that consume those values. Page, component, and skill CSS must consume official tokens or aliases instead of rebuilding colors from raw theme channels.

Allowed in page/component CSS:

- `var(--dense-primary-1/2/3/4/6/7)`
- `var(--dense-warning-*)`, `var(--dense-success-*)`, `var(--dense-danger-*)`
- Arco neutral surface tokens such as `var(--color-bg-card)`, `var(--color-fill-1)`, `var(--color-border-1)`

Not allowed in page/component CSS:

- `rgba(var(--primary-6), 0.x)`
- `rgb(var(--primary-6))`
- `rgb(var(--warning-6))`
- `rgb(var(--success-6))`
- `rgb(var(--danger-6))`

Reason: depending on the import path, gi-demo theme values may be available as RGB channels or as precomputed full colors. Raw channel composition can silently become invalid and fall back to black/currentColor. Global semantic aliases absorb that risk once.

## Gray Budget

- Do not let gray occupy the page without a primary anchor.
- `color-text-4` is only for empty value, disabled state, timestamps, or helper text.
- `color-fill-1/2` is only for secondary containers or disabled controls.
- Main business values use `color-text-1`.
- Interactive values use `--dense-primary-6` or another project semantic alias.
- Page-level gray is allowed only as a quiet base. If the viewport reads as gray/white after active navigation, primary operation, selected state, core links, and status pills are visible, the surface fails the theme requirement.

## Main Surface Standard

Business users spend long sessions in list and detail pages. The interface must not become a gray ERP sheet or a blue-tinted grid. Use this main surface model:

- Page background is the quiet base: `--dense-page-bg`, normally a cool brand-neutral surface, not plain gray.
- Primary working surfaces are white: `color-bg-card`, `--dense-surface-section`, or `--dense-surface-head`.
- Surface separation is created first by spacing, ownership, alignment, and typography. Use a boundary only when it clarifies containment; do not add a shadow or colored line to every zone.
- Each action scope needs one clear attention owner: active segment, primary action, primary identifier, selected state, or status. A passive section does not need a decorative brand anchor.
- Do not use gray fill as the main way to separate modules. Use whitespace, headings, object-owned key facts, and clear action grouping.
- Repeated detail modules must have distinguishable levels: module head, module summary, child head, child body, and line table header. If all levels look like flat white/gray rows, the module fails PESDP.
- Gray panels are allowed only for disabled, empty, inactive, or secondary background states. They must not contain primary identity, key facts, main form fields, or editable line data as if they were muted.
- Long-session comfort comes from low saturation and consistent hierarchy. Use primary and semantic colors only for interaction, selection, focus, status, risk, and the current scope's main action.

### Main Surface Token Contract

| Surface | Required token behavior |
|---------|-------------------------|
| `--dense-page-bg` | Direct GI neutral page-surface alias. |
| `--dense-card-border` | Direct GI boundary alias; do not replace it per page. |
| `--dense-surface-section` | Framework-neutral business surface alias; use only when the section truly owns a separate surface. |

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
- Detail header identity bands must expose the working object at scan distance: `key_state`, `primary_identity`, `business_context`, `owner`, and 3-6 object-owned `key_facts`. These values are business anchors, not meta notes.

## Data-Driven Focus

Data is the primary content. The visual system must make business data easier to understand, not compete with it.

- A dense operational screen should make the current object, key state, key amount/date, responsible party, and next action visible before decorative chrome.
- The strongest visual emphasis belongs to the current scope's primary business decision, not to every toolbar button, card edge, or table line.
- Use typography, alignment, column order, grouping, and semantic status first; use color as a supporting signal.
- If two or more areas compete for primary attention in the same scope, reduce emphasis before adding another accent.
- Trust comes from stable layout, predictable interaction states, and restrained semantic color. Avoid saturated backgrounds, animated emphasis, and sudden layout shifts in workbench pages.

## Dense Table Color Hierarchy

Workbench tables need a visible but restrained interaction rhythm. A table that is technically compact but visually all gray fails PESDP; a table with blue header gradients and vertical blue-gray grid lines also fails PESDP.

Required:

- Workbench tables use VXE native `size`, `border`, `row-config`, selection, hover, fixed-column, and overflow behavior. Do not target VXE internals or theme variables to force a second table skin.
- Table header must be calm and neutral. Primary belongs to sortable/focused/selected states, links, and row hover accents, not normal header fill.
- Vertical grid lines are off by default through VXE's public `border` configuration. A finance comparison page may enable them only when column tracking materially improves, and the exception must be recorded in `pageSpec`.
- Primary identifiers and business codes use `primary-6/7` links and medium/title weight.
- Core business values such as primary identity, party/context, location, quantity, amount, due date, and other next-decision fields use `color-text-1`.
- Dates and passive metadata may use `color-text-2`; empty values use `color-text-4`.
- Status pills must be readable at scan distance; use semantic token level 7 for text when level 6 is too weak.
- Row actions should be visible as actions but not compete with data: text/icon buttons with primary hover, no always-heavy button frames.
- Zebra stripes must be very low contrast. They should support scanning, not create a gray page.
- In dense workbench lists, default zebra should normally be disabled or use the same GI work-surface token as normal rows. Use row separators, hover, selected state, and primary identifiers for scan rhythm before adding stripe color.

Avoid:

- Header, body, stripe, fixed column, and toolbar all using similar gray fills.
- Blue header gradients on normal workbench tables.
- Repeated visible column borders that make the grid read like Excel.
- Status labels that look like disabled text.
- Action icons that look disabled before hover.
- Making every code/link the same strength when one identifier is the primary object.

## Text Color Roles

Use text color by information role, not by visual decoration.

| Role | Color | Examples |
|------|-------|----------|
| Core business value | `color-text-1` | primary identifier, owner/person, party/context, location, amount, quantity, due date, dates that drive work |
| Normal readable value | `color-text-2` | company/context, selected form value, table secondary value |
| Label/meta | `color-text-3` | fact labels, helper labels, secondary timestamps, summary labels |
| Empty/disabled only | `color-text-4` | `—`, `暂无`, disabled option, placeholder-like empty state |

Rules:

- Do not use `color-text-4` for `primary_identity`, `key_state`, `owner`, `business_context`, or any object-owned `key_fact` users must scan.
- Fact labels in detail headers use `color-text-3`, not `color-text-4`; the corresponding values use `color-text-1`.
- Detail header primary numbers may use the project primary text role to anchor the object. Supporting business facts stay `color-text-1/2` according to importance; only labels and non-decision helper copy may be `color-text-3`.
- Staff/person display must show at least role + person name; company/department can be auxiliary but must remain readable.
- If text is hard to read, first check whether a business value was incorrectly styled as helper/disabled text.
- Helper text must never compete with key values, but it must still meet readable contrast.

## Detail Surface Hierarchy

Detail pages must expose hierarchy across the whole vertical stack:

- `dds-head` owns identity and object-level actions. Emphasize it through placement, typography, and action grouping; do not require a decorative colored edge.
- `dds-hero` owns 3-6 key facts. Facts in one compact row share one visual system; priority comes from order and weight, not a colored tile or rail.
- Detail field groups remain unframed inside one owning Arco surface. Boundary, shadow, radius, and component chrome stay GI-owned; primary tint is reserved for active/focused/selected state.
- `form-subgroup` owns an internal concept. It is an unframed heading plus related fields, not another card or decorative sub-surface.
- `detail-module-summary--inline` owns module-level totals. Keep totals adjacent to the owning identity and distinguish them through labels, alignment, and numeric typography.
- `detail-mini-vxe` uses VXE native small density and public configuration; it does not inherit a custom list-table skin.
- Avoid repeated title markers, dots, and rails. Add an accent only when it communicates current, selected, expanded, risk, or another real state.

## Dark Color Boundaries

The system uses Arco text tokens, not raw black.

- `color-text-1` is for core readable business values only: primary identifier, key fact, amount, quantity, party/context, and other scan-critical data.
- UI chrome such as borders, dividers, operation docks, icon button frames, card edges, and table separators must not use raw black, currentColor black, or strong dark outlines.
- Default action icons use `color-text-3` or Arco primary-muted; hover/focus uses `--dense-primary-*`.
- Repeated controls inside table rows must avoid permanent dark borders because they form a black visual column and reduce all-day comfort.
- If an area looks "too black", first check whether border/icon styles are using `color-text-1`, browser default `currentColor`, raw black, or invalid RGB token fallback.
- Native focus must never be removed without an equal or stronger replacement. Custom button-like controls use a clearly visible tokenized `:focus-visible` state in their scoped component; `outline: none` without that replacement is a release blocker.

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

- Prefer subtle shadow + surface hierarchy over visible borders. Use borders as the last 1px boundary, not as the main design language.
- Prefer project dense radius (`--dense-radius`) unless a component has a documented exception. Do not use large consumer SaaS radius for dense freight pages.
- Keep long-term reading comfortable: no heavy contrast blocks, no saturated full-width backgrounds.
- Use whitespace as grouping rhythm, not as decorative emptiness.
- If a page feels "plain", first improve hierarchy and business grouping, then adjust token-based color accents.
- If a page feels "too gray", first check whether every major surface has a restrained brand anchor: active segment, primary action, selected rows, links/status pills, and `--dense-zone-top-border`. Do not fix it by adding gray fills or coloring every workflow button.

## Hard Bans

- No standalone hex colors in new UI CSS.
- No large gray panels that do not carry hierarchy.
- No decorative blue gradients on page background, normal card heads, table headers, or table caps.
- No `font-weight: 700/800` in business UI.
- No negative letter spacing.
- No large-radius consumer SaaS styling unless Arco default component radius produces it.
