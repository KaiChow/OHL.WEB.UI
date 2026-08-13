# OHL UI Agent Contract

Vue 3 + TypeScript + Arco Design Vue/GI + VXE Table + Vite.

The executable UI contract is `.agents/skills/arco-vxe-ui/SKILL.md`. Keep this file as an entry point, not a second specification. After changing the skill, run `npm run sync-ui-skill`.

## Required flow

1. Use `$arco-vxe-ui` for UI, interaction, page, table, form, overlay, visual-quality, or skill cleanup work.
2. Before code, follow `.cursor/rules/spec-first-coding.mdc`; for material page work, create/update typed `pageSpec.ts`.
3. Implement Arco props/structure -> GI/semantic tokens -> proven shared pattern -> minimal page-local layout CSS.
4. Before delivery, follow `.cursor/rules/adversarial-review.mdc`, run `npm run verify`, then inspect the real route when UI quality is in scope.

## Hard constraints

- GI owns the Arco baseline/palette; do not add a theme adapter or page-local skin.
- vxe-table look is owned by `src/styles/vxe-theme/` tokens (official `--vxe-*` variables) plus global workbench defaults in `main.ts` (`border`, `stripe`, `size: 'mini'` — high-density system); pages never write custom table styles. Density uses `size`; typed detail roles may set the public `stripe` prop according to `pageSpec.table.rowBanding`.
- Use `vxe-table`, never `a-table`; classify each table by its business role (main list, detail child, editable line, file, or summary), not by a prescribed CSS class name.
- Use `.s-pill[data-s]` for status; never color the whole row by status.
- Arco form and business controls inherit the app-wide `small` default; Arco controls inside `vxe-table` rows must explicitly use `size="mini"`; one `type="primary"` per action scope.
- Use Arco icons for common actions; use IconPark only for business/menu/empty/module semantics.
- Button labels follow the `actions.md` Label Lexicon (no ad-hoc 关闭/取消/确认/提交 mixing); query text inputs submit on Enter (enforced by check-spec); business text inputs declare contract-backed `max-length`.
- Complete feature contracts before implementing clicks, requests, permissions, mutations, or state transitions.
- For screenshot/prototype input, complete artifact intake and prototype translation before coding.
- Store UI acceptance screenshots under `docs/ui-acceptance/<route-or-feature>/`; every routed page must keep real-route evidence in `docs/ui-acceptance/<route basename>/` (statically enforced by `scripts/check-spec.js`); use `output/playwright/` for temporary local captures. Never write acceptance artifacts to the repository root. Route directories keep one canonical baseline set (stable filenames, overwritten each acceptance); dated/before-after iteration evidence is deleted at delivery — git history is the archive, not the directory.
- Do not add documentation to compensate for missing shared UI capability or rendered verification.

All detailed routing and numeric rules live in the skill references.
