# Delivery Checklist

## Before Editing

- Read **`references/arco-first.md`** and apply Arco-first → token-second → business-pattern-third → page-local-css-last.
- Read `references/design-principles.md`.
- For any shared class or `global.css` change: confirm Arco props/tokens cannot solve it; state `why_arco_not_enough`.
- Grep `src/styles/global.css` only for tokens/patterns already justified — do not start from the stylesheet as the design catalog.
- Apply the four-layer model before designing: Product Positioning -> Design Philosophy -> Visual Language -> Implementation Rules.
- Convert vague UI feedback into AI-executable design language before editing: define scope, structure/class, token/density, state behavior, business semantics, forbidden fallback, and verification where possible.
- Read `references/module-patterns.md` for new pages or module refactors.
- Read `references/domain-language.md`.
- Classify the page with `references/page-archetypes.md`.
- Read the relevant skill reference.

## Arco-First Gate

- Arco props, slots, and layout primitives were tried before shared custom classes.
- `global.css` is used only for tokens, freight semantics, VXE bridge, or documented archetype slots — not as a second UI framework.
- Every shared class used on the page has a one-line `why_arco_not_enough` if challenged in review.
- Page-local scoped CSS is minimal shell only.

## Theme Ownership Gate

- `@arco-themes/vue-gi-demo/css/arco.css` is the only Arco baseline stylesheet; the default Arco CSS is not imported beside it.
- GI owns all official Arco palette variables. This project has no `src/styles/theme.css` adapter or second palette.
- `global.css` consumes official variables through `--dense-*` aliases; it does not redefine the official palette or act as another component skin.
- Remaining broad `.arco-*` rules have a documented token/prop gap.
- Computed `--primary-6`, `--color-text-1`, `--color-fill-2`, and `--color-border-1` are checked on a real route against the effective GI baseline.

## Existing Project Modernization Gate

- When no screenshot/prototype exists, the no-reference intake from `existing-project-modernization.md` is used instead of artifact intake.
- Existing code is treated as evidence, not design authority; business behavior is preserved while theme/layout debt may be removed.
- The modernization mode is explicit: `theme-realignment`, `surface-regrouping`, or `skeleton-rewrite`.
- Before/after evidence records theme ownership, removed visual debt, first-viewport allocation, and product-grade score.
- The skill remains portable: current route names, field lists, and page-local classes are not promoted to universal rules.

## PESDP Gate

- Professional: uses freight/logistics terms and industry structure.
- Efficient: reduces lookup, clicks, thinking, or error risk.
- Structured: separates primary identity, business operation, and auxiliary data.
- Dense: high useful information density with visible information rhythm; compact does not mean visually merged controls.
- Premium: quality comes from order, consistency, hierarchy, and restraint.

## PESDP+ Gate

- Consistency: uses shared tokens, classes, component patterns, icon style, and interaction behavior; no page-local design language.
- Readability: primary identity, key state, critical amount/date, owner/counterparty, and next action are scannable within seconds.
- Action-first: operations are close to the data they affect; high-frequency reversible actions are visible, while destructive/low-frequency actions are separated and confirmed.
- Focus: each local scope has one primary focus and at most one primary action; emphasis does not compete inside the same scope.
- Trust: layouts are stable, interactions predictable, colors restrained, and risk/permission/error states explicit.
- Business Before UI: layout and visual choices serve the current freight workflow and user job, not decorative cleanliness.
- Information First: data relationships are clearer after the design change; visual chrome does not compete with identifiers, amounts, dates, statuses, and actions.
- Brand-Neutral: the page does not read as gray ERP. It has a visible but restrained freight SaaS rhythm through active navigation, primary action, selected/focused states, status pills, links, and brand-neutral hairlines.

## Operational Workbench Gate

- The page is judged as a production workbench when sales/operators/coordinators use it for repeated daily office work.
- Production workbench priority is business efficiency first, long-session visual comfort second, visual beauty third.
- Table-dominant list pages pass the first-viewport gate owned by `redesign-calibration.md`; the checklist does not redefine that threshold.
- Daily status tabs remain visible when users process records by state.
- Daily reversible workflow actions remain directly reachable as neutral grouped actions; rare, risky, or destructive actions move to dropdown/confirm flows.
- Modernization preserves operational affordances while removing old ERP noise: all-blue buttons, warning workflow buttons, red normal data, heavy vertical grids, gray form walls, and equal-weight bordered zones.

## Product-Grade Gate

- Consistency: all touched pages still feel like one product, not isolated page optimizations.
- Professionalism: industry language and page structure match freight business habits.
- Efficiency Feel: users can quickly search, update, and batch-handle work; no cosmetic cleanup hides workflow.
- Order: grouping, hierarchy, and business reading order are clear without rereading.
- Completeness: loading, empty, error, validation, permission, and destructive-action states feel designed, not omitted.
- Credibility: the page feels stable, rigorous, and unlikely to invite misoperation.
- Demo Value: a team can explain business flow and product value from this page during a customer/leader/investor demo.
- Expandability: the page feels like part of a platform-ready product system, not a one-off delivered screen.
- If the page passes internal-system quality but fails product-grade quality, do not call the redesign finished when the task goal is productization or sellable SaaS quality.

## Module Generalization Gate

- Business object is explicitly identified (see `module-patterns.md` slot mapping).
- User job is clear: scan, create, audit, reconcile, operate, configure, or analyze.
- Labels and object field examples come from `domain-language.md`, not copied from another module's columns.
- New or changed rules are written for a reusable surface/class of problem, not for one screenshot, one backend field list, or one module name.
- Business field names in a rule are marked as examples of slots; they are not treated as mandatory content for every page using the same class.
- Repeated modules are present only when the object owns that data.
- Steps/milestones appear only when the object has a real business process.
- Shared classes are used as structural slots, not as fixed business content.
- Global CSS class names describe structure or role, such as identity band, key fact, line module, document checklist, or action menu; they do not encode one page's business field unless that field is a real reusable domain object.

## Functional Delivery Gate

- Any feature with click, submit, request, or state change is classified by `feature_type` and `entry_point`.
- `actor_roles`, `visible_when`, `enabled_when`, and `readonly_when` are explicit when role/state matters.
- `preconditions` and `confirm_when` are defined separately; destructive and irreversible actions do not rely on implied caution.
- Input fields define `required_when`, validation, derived/writeback behavior, and failure preservation when applicable.
- Request-backed features define `api_request`, `api_response`, loading lock, duplicate-submit handling, and `refresh_scope`.
- Success and failure flows are distinct: close/stay-open/refresh/message/retry behavior is explicit.
- State-changing features define `from_state`, `action`, `to_state`, and blocked/failure paths.
- Batch features define selected scope, empty-selection behavior, partial-failure handling, and post-success refresh behavior.
- Verification includes success, business rejection, permission rejection or hidden/disabled state, network failure, duplicate click, and refresh result.

## Layout

- Operational page root is a stable flex/grid shell; any shared root class is used only when grep proves its definition exists.
- No page-level marketing header.
- Search, actions/status, and data have clear ownership; logical rows do not automatically become separate cards.
- Layout follows the project 8px rhythm through shared gap/padding tokens; spacing changes use tokens or shared classes, not page-local guesswork.
- Table remains the largest area.
- No double scrollbars.
- No duplicated summary areas unless each has a distinct interaction purpose.
- Table cap does not repeat pagination totals or status-tab counts.
- Dense list pages keep a small viewport-bottom breathing space through the page shell; table cards do not visually touch the browser/app bottom edge.
- Search/filter UI matches query field count tier: 0-3, 4-8, 9-16, 17-50, or 50+.
- Page-mode segments and scope/status filters use distinct Arco roles and are not visually conflated.
- Filter drawer fields are grouped by business meaning, not rendered as a flat form wall, and do not add redundant instruction copy above the groups.
- Query field count, scenario, and two-row relationship follow `filter-layout.md`; exact example class names are not required unless implemented.
- 50+ query workspaces use group anchors over all condition modules; they do not hide groups behind exclusive tabs when operators need to combine identifiers, time, route, parties, and flags.

## Components

- Tables use VXE Table.
- Forms use Arco controls.
- Arco components are used whenever possible; existing Arco interactions are not redesigned locally.
- Custom controls are avoided unless the business interaction cannot be expressed with shared Arco/VXE patterns.
- Buttons follow Arco 5 types × 4 statuses per `references/actions.md` (primary/secondary/dashed/outline/text; normal/success/warning/danger).
- Button content form follows `actions.md`: row actions and toolbar utilities are icon-only with tooltip; creation/add actions use icon + text when the icon metaphor is exact; workflow/footer/head actions are text-only; dropdown options are text-only by default.
- Row actions are icon-only `text` + tooltip.
- Dropdown actions use `action-menu`: toolbar menus use `action-menu--toolbar` with content-adaptive width, compact minimum width, `--dense-action-menu-max-w` upper bound, and 32px option rhythm; row `···` menus use `action-menu--row` with at least 32px options; options are text-first and must not force icons for every operation; danger groups are separated with `action-menu__divider`; menus must not create horizontal scrollbars.
- Dangerous actions use `text`/`danger-opt` + `a-popconfirm` or `Modal.confirm`; avoid `status="warning"` on toolbar/footer buttons.
- Toolbar visibility follows frequency × risk classification, not a hard button count: daily reversible actions remain in the business command group; rare or destructive actions move to a separated More menu. A dropdown trigger is one operation group, not multiple visible commands.
- Uploads and file lists have clear single/multiple behavior.
- Page/module implementation is split into route/page/components/types/mock/composables when scope is large.
- Module header left is title only; module header right is actions only.
- Counts, totals, helper text, upload state, and progress are inside module body/summary.
- Parent-child nested modules use one parent surface, one summary row, compact child heads, child body forms, and child-owned line tables.
- Parent-child nested modules expose the full executable structure gate: module summary, child identity/meta, child metrics, child body, compact child pane, and child-owned line table.
- Parent, child, and row actions are visually separated by level and use object-specific labels.
- Repeated child items are separated by subtle dividers or child heads, not independent nested cards.
- Empty nested line tables show an explicit empty/add state and must not collapse into a blank compressed strip.
- Duplicate totals across module summary, child head, and table cap are removed.
- List total count is owned by pagination when pagination is present.
- Main tables, detail line tables, editable line tables, and file tables follow their own table type rules.
- Main workbench VXE tables use compact density: header 32px, body row 36px, unless a documented two-line/standard-row reason exists.
- Detail VXE tables choose density by row job: editable rows use `detail-mini-vxe--editable` + `row-config.height = 38`; readonly rows use `detail-mini-vxe--readonly` + `row-config.height = 34`; summary rows use `detail-mini-vxe--summary` + `row-config.height = 32`.
- Table columns expose object identity, key state, main working data, and next-decision fields before passive metadata.
- Table empty states are explicit and object-specific, not blank table bodies.
- Editable tables keep inputs readable and aligned without clipping.
- VXE business columns use `min-width`; fixed `width` only on checkbox, seq, and operation columns (`table.md`).
- VXE tables use `border="none"`; no vertical grid lines; weak horizontal row separators only (`table.md` Border Policy).
- VXE sequence columns: `width="52"`, `align="center"`, title `序号`; required on detail editable mini tables with ≥2 rows; optional on workbench lists (default omit when identity column is fixed left).
- Overlay typography: popconfirm/modal/select dropdown options use F4 12px; overlay footer buttons use F2 13px (`typography.md`).
- Arco `size`: business modules use `size="small"` only; forbid `medium`/`large`/template `mini` (`component-size.md`).
- Detail embedded VXE tables use `detail-mini-vxe` + one density modifier + `detail-section__body--table`; no `show-overflow` on those tables.
- Detail form grids use `min-width: 0` children and full-width controls; date pickers follow 28px detail control height.
- Detail combo fields (port code/name, vessel/voyage, field+copy) use `detail-combo` modifiers from `global.css`, not page-scoped borders.
- Detail sections with multiple business sub-concepts use `form-subgroup` blocks (`form-subgroup__head` + `form-subgroup__title` + `detail-form-grid`); do not stack bare subgroup labels with repeated blue left rails.
- Process-bearing operational detail drawers use `dds-milestone-bar` for process awareness; they must not use `a-steps type="arrow"` or a full-width `detail-overview-kpi` report strip under the hero.
- Cargo/fee totals are placed inside their owning `detail-module-summary--inline`; top-level KPI bars do not duplicate section summaries.
- Detail drawer footer uses `detail-drawer-footer__start` (danger text + confirm) and `__end` (secondary workflow + one primary save); low-frequency outputs grouped in dropdown.
- Detail head/footer workflow buttons use `secondary` (default); module/child main actions use `outline`; auxiliary uses `text`.
- Row delete in detail mini tables uses `a-popconfirm` + `status="danger"`; `global.css` must render danger red on row-action-btn.
- List workbench operation columns follow [`table.md`](table.md) Row Actions matrix: max 2 affordances, width ≤ 88, no flat danger icon, no 3+ flat icons.
- Detail drawer footer forbids `btn-muted-warn` and duplicate global danger actions in header + footer.
- Large editable tables default to display mode; inputs appear only for active row, new row, or explicit batch edit.
- Table editing state is keyed by stable row id, not row index or sequence number.
- Inline edit has explicit save/cancel scope and visible dirty state.
- Pagination, filtering, refresh, route leave, and drawer close handle unsaved table edits.

## Typography

- Uses the global system font stack and F1-F6 typography tokens.
- No arbitrary business text sizes such as 14px/15px/16px.
- Business UI does not use font-weight 700/800.
- Filter/detail labels, input/select/textarea values, and placeholders use the F4 Control 12px layer.
- Filter/detail fields preserve the name/value rhythm: label as metadata, control as input surface, with a visible grouping interval between them.
- Placeholder text is guidance only and differs from entered values by `color-text-3` and weight 400, not by a smaller font size.
- No list/detail form uses mixed label/value/placeholder sizes such as 12/13/11 or leaked Arco 14px labels.
- The same Arco control keeps the same text tier across list filter, modal form, drawer form, and advanced query drawer; no per-surface font-size fork for the same control.
- The same information role keeps the same text tier across the app: business content=12 (label, field value, table cell, link), nav/button/pager trigger=13, helper/meta=11.
- Hard-coded 10/11/12/13 values are either tokenized or explicitly justified as shell/brand/icon/micro exceptions; business modules do not accumulate silent hardcoded sizes.
- Typography review can be traced back to the `Component Typography Map`; if a reviewer cannot map a component to a token tier, the rule is incomplete.
- Codes and identifiers use mono or tabular numeric styling where comparison matters.
- Numeric, amount, weight, volume, and date values use tabular numbers where possible.
- International text expansion is considered: labels and buttons do not depend on short Chinese text.
- Long business labels remain understandable and are not truncated by default.

## Language

- Uses freight business terms, not generic internet/OA terms.
- Status and milestone names match transport mode.
- Long business labels preserve meaning.
- Empty/error copy mentions the business object.

## Visual

- Uses Arco tokens, no new hex palette.
- Main surface follows the Premium Dense usage rules from `visual-system.md`: GI page/container/fill/border tokens, restrained elevation, no page-local repaint or decorative gradients.
- Main palette is the effective GI palette: primary only for anchors/interactions, semantic colors only for state/risk, and neutral GI roles for surfaces, headers and separators.
- Page is not dominated by gray, blue, or repeated bordered boxes.
- One primary anchor is visible in the first viewport, but primary tint does not cover whole search/tool/table surfaces.
- Search card, toolbar, table cap, and default table rows use GI neutral surfaces; primary appears in active nav, links, focus, hover, selection, status, and thin anchors only.
- Workbench table header uses the shared GI alias (`--dense-table-header-bg`); table body uses weak horizontal separators and no dominant vertical grid lines.
- Card hierarchy comes from grouping, gap, the effective GI surface, restrained elevation, and the shared boundary token.
- Toolbar workflow buttons are separated by type/group/icon, not by arbitrary success/warning/purple colors. Semantic colors remain reserved for status, validation, risk, and destructive actions.
- List modules follow `responsive.md`: at the supported 1280px baseline, no filter/toolbar/status module creates page-level horizontal scroll; status groups scroll internally before another full-width row is added.
- Raw theme channel tokens are not used as complete CSS colors; use `--dense-*` aliases or `rgb()/rgba(var(...))`.
- Status colors are consistent and only used for semantic state.
- Primary identity, key state, owner/person, business context, and object-owned key facts do not use disabled/empty `color-text-4`.
- Detail header fact labels are readable metadata and values are stronger than labels.
- Drawer/modal width matches `overlay-dimensions.md` tier (no arbitrary 900/1080).
- Complex detail drawers use `class="detail-drawer"` (D4); read-only simple detail uses `detail-drawer--standard` (720px).
- Filter drawers use `query-filter-drawer` (640px) or `--wide` (1120px).
- Master-data pages use `md-layout`; permission pages use `perm-layout`; BI uses `db-wrap`; full-page create uses `xf-wrap` + `detail-form`.
- Empty/loading/success/error follow `feedback.md`.
- Staff/party display shows role + name clearly; company/context is auxiliary but readable.
- Typography follows `typography.md` roles. Do not hard-code smaller text for density or larger text merely to create hierarchy.
- No decorative large gradients, large-radius consumer SaaS styling, or attention-heavy panels.

## Verification

- Run `npx vite build`.
- If possible, inspect `http://127.0.0.1:9527/#/<route>`.
- Check at 1280px and 1920px widths for overflow and button crowding.
- Check PESDP score before final response.
- Mention unrelated build failures separately.
