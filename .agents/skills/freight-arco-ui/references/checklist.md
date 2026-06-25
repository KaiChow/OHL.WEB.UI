# Delivery Checklist

## Before Editing

- Read `src/styles/global.css`.
- Confirm whether existing global class already solves the need.
- Read `references/design-principles.md`.
- Convert vague UI feedback into AI-executable design language before editing: define scope, structure/class, token/density, state behavior, business semantics, forbidden fallback, and verification where possible.
- Read `references/module-patterns.md` for new pages or module refactors.
- Read `references/domain-language.md`.
- Classify the page with `references/page-archetypes.md`.
- Read the relevant skill reference.

## PESDP Gate

- Professional: uses freight/logistics terms and industry structure.
- Efficient: reduces lookup, clicks, thinking, or error risk.
- Structured: separates primary identity, business operation, and auxiliary data.
- Dense: high useful information density with visible information rhythm; compact does not mean visually merged controls.
- Premium: quality comes from order, consistency, hierarchy, and restraint.

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

## Layout

- Uses `page-root page-root--dense` for operational pages.
- No page-level marketing header.
- Search/tool/status/table layers have clear separation.
- Table remains the largest area.
- No double scrollbars.
- No duplicated summary areas unless each has a distinct interaction purpose.
- Table cap does not repeat pagination totals or status-tab counts.
- Search/filter UI matches query field count tier: 0-3, 4-8, 9-16, 17-50, or 50+.
- L1 page segments use `zone-l1-transport` + `seg-btn`; scope/status filters use `.stab` or `.stat-tab`, not the other way around.
- List zones use one neutral top-boundary token: `--dense-zone-top-border` on L1/L2/L3/L4 modules; primary-colored top borders are not used as generic module decoration.
- Filter drawers use `query-filter-drawer__shell/body/group/group-head`; fields are grouped by business meaning, not rendered as a flat white form wall, and must not include descriptive summary/instruction copy above the groups.
- Query field count follows `filter-layout.md`: two visible rows are allowed only for 6-10 high-frequency fields; 17-32 use grouped drawers; 33-50 use wide drawer with group navigation; 50+ use saved query workspace.

## Components

- Tables use VXE Table.
- Forms use Arco controls.
- Buttons follow Arco 5 types × 4 statuses per `references/actions.md` (primary/secondary/dashed/outline/text; normal/success/warning/danger).
- Row actions are icon-only `text` + tooltip.
- Dropdown actions use `action-menu`: toolbar menus use `action-menu--toolbar` with content-adaptive width, compact minimum width, `--dense-action-menu-max-w` upper bound, and 32px option rhythm; row `···` menus use `action-menu--row` with at least 32px options; options are text-first and must not force icons for every operation; danger groups are separated with `action-menu__divider`; menus must not create horizontal scrollbars.
- Dangerous actions use `text`/`danger-opt` + `a-popconfirm` or `Modal.confirm`; avoid `status="warning"` on toolbar/footer buttons.
- Uploads and file lists have clear single/multiple behavior.
- Page/module implementation is split into route/page/components/types/mock/composables when scope is large.
- Module header left is title only; module header right is actions only.
- Counts, totals, helper text, upload state, and progress are inside module body/summary.
- Parent-child nested modules use one parent surface, one summary row, compact child heads, child body forms, and child-owned line tables.
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
- VXE sequence columns use the project default `width="52"` in both workbench and detail tables unless a module exception is documented.
- Overlay typography: popconfirm/modal/select dropdown options use F4 12px; overlay footer buttons use F2 13px (`typography.md`).
- Arco `size`: business modules use `size="small"` only; forbid `medium`/`large`/template `mini` (`component-size.md`).
- Detail embedded VXE tables use `detail-mini-vxe` + one density modifier + `detail-section__body--table`; no `show-overflow` on those tables.
- Detail form grids use `min-width: 0` children and full-width controls; date pickers follow 28px detail control height.
- Detail combo fields (port code/name, vessel/voyage, field+copy) use `detail-combo` modifiers from `global.css`, not page-scoped borders.
- Detail sections with multiple business sub-concepts use `form-subgroup` blocks (`form-subgroup__head` + `form-subgroup__title` + `detail-form-grid`); do not stack bare subgroup labels with repeated blue left rails.
- Order-entry/detail drawers use `dds-milestone-bar` for process awareness; they must not use `a-steps type="arrow"` or a full-width `detail-overview-kpi` report strip under the hero.
- Cargo/fee totals are placed inside their owning `detail-module-summary--inline`; top-level KPI bars do not duplicate section summaries.
- Detail drawer footer uses `detail-drawer-footer__start` (danger text + confirm) and `__end` (secondary workflow + one primary save); low-frequency outputs grouped in dropdown.
- Detail head/footer workflow buttons use `secondary` (default); module/child main actions use `outline`; auxiliary uses `text`.
- Row delete in detail mini tables uses `a-popconfirm` + `status="danger"`; `global.css` must render danger red on row-action-btn.
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
- Page is not dominated by gray.
- One primary anchor is visible in the first viewport, but primary tint does not cover whole search/tool/table surfaces.
- Search card, toolbar, table cap, and default table rows use neutral surfaces; primary appears in active nav, links, focus, hover, selection, status, and thin anchors only.
- List modules follow `responsive.md`: no filter/toolbar/status module creates page-level horizontal scroll; below `1280px`, status groups may wrap to a second row and scroll internally.
- Raw theme channel tokens are not used as complete CSS colors; use `--dense-*` aliases or `rgb()/rgba(var(...))`.
- Status colors are consistent and only used for semantic state.
- Customer, company, staff, route, carrier, vessel/voyage, and primary identifiers do not use disabled/empty `color-text-4`.
- Detail header fact labels are readable metadata and values are stronger than labels.
- Complex detail drawers explicitly set a wide drawer width; they do not rely on global CSS alone and must not collapse into a narrow right rail.
- Staff/party display shows role + name clearly; company/context is auxiliary but readable.
- No `font-weight: 700/800`; no business text over 13px unless true page/detail hero.
- No decorative large gradients, large-radius consumer SaaS styling, or attention-heavy panels.

## Verification

- Run `npx vite build`.
- If possible, inspect `http://127.0.0.1:9527/#/<route>`.
- Check at 1280px and 1920px widths for overflow and button crowding.
- Check PESDP score before final response.
- Mention unrelated build failures separately.
