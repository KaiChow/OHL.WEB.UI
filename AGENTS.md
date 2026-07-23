# OHL Freight UI Agent Contract

Vue 3 + TypeScript + Arco Design Vue/GI + VXE Table + Vite.

The executable UI contract is `.agents/skills/freight-arco-ui/SKILL.md`. Keep this file as an entry point, not a second specification. After changing the skill, run `npm run sync-freight-skill`.

## Required flow

1. Use `$freight-arco-ui` for UI, interaction, page, table, form, overlay, visual-quality, or skill cleanup work.
2. Before code, follow `.cursor/rules/spec-first-coding.mdc`; for material page work, create/update typed `pageSpec.ts`.
3. Implement Arco props/structure -> GI/semantic tokens -> proven shared pattern -> minimal page-local layout CSS.
4. Before delivery, follow `.cursor/rules/adversarial-review.mdc`, run `node scripts/check-spec.js` and `npm run build`, then inspect the real route when UI quality is in scope.

## Hard constraints

- GI owns the Arco baseline/palette; do not add a theme adapter or page-local skin.
- Use `vxe-table`, never `a-table`; use `workbench-table` for list grids and `detail-mini-vxe` for child grids.
- Use `.s-pill[data-s]` for status; never color the whole row by status.
- Use explicit `size="small"` for business controls and one `type="primary"` per action scope.
- Use Arco icons for common actions; use IconPark only for business/menu/empty/module semantics.
- Complete feature contracts before implementing clicks, requests, permissions, mutations, or state transitions.
- For screenshot/prototype input, complete artifact intake and prototype translation before coding.
- Do not add documentation to compensate for missing shared UI capability or rendered verification.

All detailed routing and numeric rules live in the skill references.
