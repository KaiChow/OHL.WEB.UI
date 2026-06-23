# Delivery Checklist

## Before Editing

- Read `src/styles/global.css`.
- Confirm whether existing global class already solves the need.
- Read `references/design-principles.md`.
- Read `references/module-patterns.md` for new pages or module refactors.
- Read `references/domain-language.md`.
- Classify the page with `references/page-archetypes.md`.
- Read the relevant skill reference.

## PESDP Gate

- Professional: uses freight/logistics terms and industry structure.
- Efficient: reduces lookup, clicks, thinking, or error risk.
- Structured: separates primary identity, business operation, and auxiliary data.
- Dense: high useful information density without compression.
- Premium: quality comes from order, consistency, hierarchy, and restraint.

## Module Generalization Gate

- Business object is explicitly identified.
- User job is clear: scan, create, audit, reconcile, operate, configure, or analyze.
- Primary identity and key state are object-specific.
- Main table/form fields are not copied from another module.
- Repeated modules are present only when the object owns that data.
- Steps/milestones appear only when the object has a real business process.
- Shared classes are used as structural slots, not as fixed business content.

## Layout

- Uses `page-root page-root--dense` for operational pages.
- No page-level marketing header.
- Search/tool/status/table layers have clear separation.
- Table remains the largest area.
- No double scrollbars.
- No duplicated summary areas unless each has a distinct interaction purpose.
- Table cap does not repeat pagination totals or status-tab counts.

## Components

- Tables use VXE Table.
- Forms use Arco controls.
- Row actions are icon-only with tooltip.
- Dangerous actions are confirmed.
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
- Table columns expose object identity, key state, main working data, and next-decision fields before passive metadata.
- Table empty states are explicit and object-specific, not blank table bodies.
- Editable tables keep inputs readable and aligned without clipping.

## Typography

- Uses the global system font stack and F1-F6 typography tokens.
- No arbitrary business text sizes such as 14px/15px/16px.
- Business UI does not use font-weight 700/800.
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
- One primary anchor is visible in the first viewport.
- Status colors are consistent and only used for semantic state.
- No `font-weight: 700/800`; no business text over 13px unless true page/detail hero.
- No decorative large gradients, large-radius consumer SaaS styling, or attention-heavy panels.

## Verification

- Run `npx vite build`.
- If possible, inspect `http://127.0.0.1:9527/#/<route>`.
- Check at 1280px and 1920px widths for overflow and button crowding.
- Check PESDP score before final response.
- Mention unrelated build failures separately.
