# Visual System

> Class names and --dense-* tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

## Goal

Build a modern dense operations workbench: clear hierarchy, compact operations, Arco-native theme color, low visual noise, and long-term comfort for high-frequency office work.

The system must not look like a gray traditional ERP, and it must not look like an over-tinted blue domestic admin template. It also must not look like a decorative marketing SaaS.

Premium quality must come from order, consistency, hierarchy, and restraint. Do not use visual decoration to compensate for weak information architecture.

## Professional ERP Positioning

This system targets a professional ERP/SaaS back-office interface for sales, operators, and coordinators who work in the system for 8+ hours per day. The priority order is:

1. Business efficiency.
2. Long-session visual comfort.
3. Visual beauty.

For table-dominant workbench pages, use the rendered layout gate owned by `existing-project-modernization.md`. This file defines visual roles, not competing layout thresholds.

The correct direction is not "old ERP" and not "minimal SaaS dashboard." The target is **Modern Dense Operations Workbench**: dense data, low visual noise, visible high-frequency workflows, semantic status, and stable Arco/VXE interaction.

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

Over-minimal SaaS pages create the opposite failure: daily filters hidden behind extra clicks, status tabs removed even when users work by status all day, toolbar actions too few or too quiet. The page looks premium but slows production work.

Therefore, modernization means **keeping the operational affordances and correcting color, hierarchy, grouping, and density**.

## 2026 Enterprise SaaS Calibration

When comparing against modern enterprise SaaS products, the valid critique is not "add more color" or "make everything larger." The main work surface must avoid three old ERP signals:

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
7. Dense operations preserved through compact controls and information rhythm, not through Excel-like borders.

Do not copy consumer SaaS defaults into dense operations. Large 12px card radii, spacious 44-46px rows, and multicolor workflow buttons may look modern in a light dashboard, but they reduce first-screen throughput in high-frequency workbenches. Use those only for low-frequency review or analytics pages with a documented archetype reason.

## Arco Theme Color Contract

The palette is owned by the GI theme; the ownership stack and token boundary are defined in `theme-contract.md`. Do not replace it with a project-specific brand palette, fixed hex values, or a copied token table. Page surfaces consume the effective tokens through semantic aliases:

| Role | Token/value | Rule |
|------|-------------|------|
| Page workbench base | `--dense-page-bg` → `var(--color-fill-1)` | Use the GI neutral surface; no page-local replacement. |
| Primary work surface | `var(--color-bg-1)` / `var(--color-bg-card)` | Search, toolbar, table card and drawer body follow GI. |
| Structural boundary | `--dense-card-border` → `var(--color-border-1)` | Use the GI boundary hierarchy without custom color values. |
| Primary anchor | `--dense-primary-6/7` | Query, create, active segment, links, focus, one main action. |
| Semantic states | direct aliases of GI `warning`, `success`, `danger` and supported status scales | Status, validation, risk, and destructive intent only. |

Do not solve "too gray" with random accent colors. First check whether the page has the required anchors: active page segment, one primary action, scan-critical links, semantic status pills, selected/hover states, and neutral hairlines.

Do not solve "too blue" by removing all primary anchors. The page needs enough primary rhythm to feel like a product, but blue must remain an interaction/status signal, not wallpaper.

## Color Rhythm

| Layer | Rule |
|------|------|
| Page background | Use a brand-neutral cool surface via `--dense-page-bg`. Do not use flat gray or blue gradients as the page base. |
| Cards | Use Arco Card only for a genuinely framed owner or repeated item. Keep its GI surface, border, radius, and shadow; do not create a second project skin. |
| Active navigation | Use project primary aliases such as `--dense-primary-*`, not custom blue. |
| Table header | Use VXE public props and its GI-compatible native appearance. Do not repaint headers through global selectors or theme-variable overrides. |
| Status | Use semantic tokens only: `warning`, `primary`, `success`, `danger`, `cyan`, `purple`, neutral. |

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

For custom selection patterns only:

- Default: neutral text (`color-text-2/3`), neutral or transparent background, no strong border.
- Hover: subtle primary tint and primary text.
- Selected: `--dense-primary-1` background, `--dense-primary-4` border, `--dense-primary-7` text, optional inset focus line using `--dense-primary-2`.
- Selected count badges use `--dense-primary-2` background and `--dense-primary-7` text.
- Do not use raw black border, `color-text-1` text, or browser default button styling to represent selected state.
- Do not use filled primary blue for every selected filter chip in dense rows. Filled primary is reserved for primary actions or very small active nav anchors.

Arco Tabs, Radio Group, Checkbox, Segmented, Select, and Tree keep GI native selected/hover/focus states. Do not reproduce the rules above by overriding their internal selectors.

## Token Usage

The RGB-channel pitfall, alias scope, and global CSS boundary are owned by `theme-contract.md`. In page, component, and skill CSS, consume `var(--dense-*)` semantic aliases or official neutral surface tokens; never compose colors from raw `rgb(var(--primary-6))` channel values.

## Main Surface Standard

Business users spend long sessions in list and detail pages. The interface must not become a gray ERP sheet or a blue-tinted grid. Use this main surface model:

- Page background is the quiet base: `--dense-page-bg`, normally a cool brand-neutral surface, not plain gray.
- Primary working surfaces use GI container backgrounds; use `--dense-surface-section` only for a framework-neutral business surface that genuinely owns content.
- Surface separation is created first by spacing, ownership, alignment, and typography. Use a boundary only when it clarifies containment; do not add a shadow or colored line to every zone.
- Each action scope needs one clear attention owner: active segment, primary action, primary identifier, selected state, or status. A passive section does not need a decorative brand anchor.
- Do not use gray fill as the main way to separate modules. Use whitespace, headings, object-owned key facts, and clear action grouping.
- Repeated detail modules must have distinguishable levels: module head, module summary, child head, child body, and line table header. If all levels look like flat white/gray rows, the module fails the hierarchy requirement.
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

Table borders, vertical grid lines, zebra stripes, density, and skin ownership are owned by `table.md`; do not restate or extend them here. The remaining visual rules for table content:

- Primary identifiers and business codes use `primary-6/7` links and medium/title weight.
- Core business values such as primary identity, party/context, location, quantity, amount, and due date use `color-text-1`; dates and passive metadata may use `color-text-2`; empty values use `color-text-4`.
- Status pills must be readable at scan distance; use semantic token level 7 for text when level 6 is too weak.
- Row actions should be visible as actions but not compete with data: text/icon buttons with primary hover, no always-heavy button frames.
- Table header stays calm and neutral. Primary belongs to sortable/focused/selected states, links, and row hover accents, not normal header fill.
- Do not make every code/link the same strength when one identifier is the primary object.

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
- If text is hard to read, first check whether a business value was incorrectly styled as helper/disabled text. Helper text must never compete with key values, but it must still meet readable contrast.

## Detail Surface Hierarchy

Detail pages must expose hierarchy across the whole vertical stack:

- `dds-head` owns identity and object-level actions. Emphasize it through placement, typography, and action grouping; do not require a decorative colored edge.
- `dds-hero` owns 3-6 key facts. Facts in one compact row share one visual system; priority comes from order and weight, not a colored tile or rail.
- Detail field groups remain unframed inside one owning Arco surface. Boundary, shadow, radius, and component chrome stay GI-owned; primary tint is reserved for active/focused/selected state.
- `form-subgroup` owns an internal concept. It is an unframed heading plus related fields, not another card or decorative sub-surface.
- `detail-module-summary--inline` owns module-level totals. Keep totals adjacent to the owning identity and distinguish them through labels, alignment, and numeric typography.
- Detail tables use VXE native small density and public configuration; they do not inherit a custom list-table skin.
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

- Default: use `.s-pill[data-s]` with semantic background, border, and readable text; no leading dot on normal table status, detail header status, or attachment status.
- Do not combine dot + icon + colored background in the same small label.
- Optional dot: use `.s-pill.s-pill--dot` or `.dds-status-badge.dds-status-badge--dot` only for timeline legends, compact activity feeds, or a plain text status that has no pill background. A dot must carry semantic color; it must not appear as a black bullet.
- Risk or attribute labels such as `高优先级`, `加急`, `需复核` are not workflow statuses. Use semantic label color and, when needed, one icon. Do not add a status dot when an icon is already present.
- Risk labels should support scanning without making the whole row look abnormal.

## Premium Dense Rules

- Prefer spacing, alignment, typography, and ownership over extra borders or shadows. Keep Arco component boundaries and elevation GI-native.
- Prefer project dense radius (`--dense-radius`) unless a component has a documented exception. Do not use large consumer SaaS radius for dense operations pages.
- Keep long-term reading comfortable: no heavy contrast blocks, no saturated full-width backgrounds.
- Use whitespace as grouping rhythm, not as decorative emptiness.
- If a page feels "plain", first improve hierarchy and business grouping, then adjust token-based color accents.

## Spacing Rhythm Standard

Grouping quality comes from a fixed relationship-to-band mapping, not from page-authored margins. The ladder lives in the reference token layer (`--dense-gap-*`, `--dense-pad-*`); this table is the usage contract.

| Relationship | Band | Reference token |
|--------------|------|-----------------|
| Label to its control | 4px | `--dense-gap-label` |
| Items inside one inline control group | 8px | `--dense-gap-inline` |
| Field rows inside one group | 8px | `--dense-gap-field-row` |
| Field columns inside one row | 12px | `--dense-gap-field-col` |
| Zones inside one workbench surface | 8px | `--dense-gap-zone` |
| Sibling modules/surfaces on one page | 12px | `--dense-gap-module` |

Rules:

- Tighter ownership always uses the smaller band. Never invert the ladder: two fields of one group must sit closer than two separate groups. If rendered gaps read equal or inverted, grouping is illegible and Design Sense item 2 scores 0.
- Do not mix ad-hoc pixel margins with ladder bands on one surface. A layout need outside the ladder is a token-layer change, not a page-local value.
- Do not compress below a band to fit more content on one screen; use scroll ownership, advanced-field ownership, or pagination instead.
- `presentationTarget: 'demo'` may scale identity/hero surfaces up one band; workbench list/form density never scales down, and daily work paths keep the ladder.

## Surface Elevation Model

Three levels, each with exactly one boundary signal:

| Level | Surface | Boundary signal |
|-------|---------|-----------------|
| L0 Page base | `--dense-page-bg` | none — no border, no shadow |
| L1 Working surface | GI card / `--color-bg-1` owned content | GI-native border or shadow, exactly as shipped |
| L2 Overlay | Arco Modal/Drawer/Dropdown portals | Arco-native elevation only |

Rules:

- Elevation means "temporarily above the workbench", never "important". A page section earns attention through placement, typography, and action priority, not through shadow.
- Nested elevation is a release defect: no shadowed or framed surface inside another shadowed or framed surface. A module that needs separation inside an L1 surface uses spacing rhythm and F3 titles, not a second box.
- Page CSS never paints custom shadows or elevation tints. An L1 surface keeps the GI card chrome as shipped; pages do not add or remove its shadow or border.
- Overlay stacking beyond a menu/tooltip inside one overlay needs a workflow reason recorded in the page spec.

## Design Sense Gate (`设计感`)

`设计感` means readable hierarchy and interaction rhythm under Brand-Neutral Premium Dense. It is not decoration, illustration, gradient marketing chrome, multi-layer shadow, or a second palette.

A surface passes Design Sense only when all of the following are true on the real route:

1. **Ownership is visible** — command, workflow, data, and overlays do not share equal border weight or equal visual loudness.
2. **Grouping rhythm** — related fields read as sections through spacing, quiet hairlines, and F3 titles before the first control; consecutive sections do not fuse into one uninterrupted form wall.
3. **One focus per scope** — one primary action owns the scope; secondary actions stay quieter and do not compete.
4. **Location is obvious** — when anchors, tabs, or segments exist, the current location is marked without shifting text start lines or overpowering content.
5. **Dense operations preserved** — compact controls and short paths remain; consumer SaaS padding or oversized chrome must not fake premium.
6. **Color stays semantic** — GI primary marks interaction/selection; semantic colors mark state/risk; neutrals carry structure.

Score each of the six items on the real route: 0 = absent or broken, 1 = partially verifiable, 2 = fully verifiable with screenshot evidence.

- `sellable-saas-grade` requires a total of at least 10 with no zero item.
- `presentationTarget: 'demo'` requires 12 of 12.
- A score without viewport screenshots (recorded per `product-grade-evaluation.md`) is self-certification and counts as 0.

Fail Design Sense when any of these appear:

- equal-weight zones, field walls, or nested cards used only to look structured;
- decorative color, shadow, radius, icon rows, or rails compensating for weak grouping;
- "looks modern" while daily locate/narrow/apply work becomes longer.

Advanced-filter grouping rhythm is owned by `filter-layout.md`. Commercial release still requires every applicable gate in `product-grade-evaluation.md`.

## Motion Contract

- Arco owns Drawer, Modal, Dropdown, Tooltip, Message, collapse, and focus transitions. Do not replace native motion with page-local keyframes.
- Hover, focus, selection, loading, sorting, filtering, and row updates must not shift layout, resize controls, change row height, or block the next legal action.
- Use immediate feedback for button pending and validation. Longer local work keeps its owner visible with loading state and stable labels; never hide the whole page for a table refresh.
- Custom motion is allowed only for a real spatial/state relationship; keep it short, interruptible, layout-stable, and never use continuous, bouncing, pulsing, parallax, card-lift, gradient, or attention-seeking status animation.
- Smooth scrolling is allowed for an explicit section-navigation action; focus moves to or is restored within the destination workflow when needed.
- Respect `prefers-reduced-motion` and verify rapid repeat, interrupted close/open, keyboard focus, loading completion, reduced motion, and no cumulative layout shift on the real route.

## Presentation Target Exceptions

`pageSpec.ts` declares `presentationTarget: 'daily-ops' | 'demo'`; the default is `daily-ops`. A `demo` target exists for financing, sales, and customer-facing review surfaces and unlocks exactly these exceptions:

- Display typography tier (`--dense-font-display`, see `typography.md`) for one object identity, hero, or first-run empty state per route.
- Spacing scaled up one band on identity/hero surfaces only (see Spacing Rhythm Standard).
- A narrow motion whitelist: numeric or key-fact value change transitions up to 200ms and skeleton-to-content fades up to 150ms. Every whitelisted effect stays interruptible, layout-stable, and respects `prefers-reduced-motion`.

A demo target never waives:

- GI palette and token ownership, semantic color rules, or the dark-color boundaries.
- Density of daily work surfaces: list workbenches, filters, forms, and tables keep the compact ladder even in a demo. The exceptions apply to identity, hero, and onboarding surfaces, not the working grid.
- State completeness, interaction closure, or any `product-grade-evaluation.md` gate; a demo that hides failure states fails gate 4 like any other page.

An exception not declared in `pageSpec.ts` is a contract violation, not a style choice.
