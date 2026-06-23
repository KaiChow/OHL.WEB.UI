# Delivery Checklist

## Before Editing

- Read `src/styles/global.css`.
- Confirm whether existing global class already solves the need.
- Read `references/design-principles.md`.
- Read `references/domain-language.md`.
- Classify the page with `references/page-archetypes.md`.
- Read the relevant skill reference.

## PESDP Gate

- Professional: uses freight/logistics terms and industry structure.
- Efficient: reduces lookup, clicks, thinking, or error risk.
- Structured: separates primary identity, business operation, and auxiliary data.
- Dense: high useful information density without compression.
- Premium: quality comes from order, consistency, hierarchy, and restraint.

## Layout

- Uses `page-root page-root--dense` for operational pages.
- No page-level marketing header.
- Search/tool/status/table layers have clear separation.
- Table remains the largest area.
- No double scrollbars.
- No duplicated summary areas unless each has a distinct interaction purpose.

## Components

- Tables use VXE Table.
- Forms use Arco controls.
- Row actions are icon-only with tooltip.
- Dangerous actions are confirmed.
- Uploads and file lists have clear single/multiple behavior.
- Page/module implementation is split into route/page/components/types/mock/composables when scope is large.

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
