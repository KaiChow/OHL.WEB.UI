# AI Generation Contract

## Purpose

Use this contract when AI creates, refactors, or reviews pages in `FE.OHL.WEB.UI`.

The goal is to prevent one-off pages and ensure every generated page follows PESDP, Arco, VXE Table, routing/module structure, and project-level reuse.

## Required Read Order

Before generating UI:

1. `src/styles/global.css`
2. `CLAUDE.md`
3. `references/design-principles.md`
4. `references/domain-language.md`
5. `references/page-archetypes.md`
6. The task-specific reference: list/detail/table/actions/visual/checklist.

## Generation Workflow

1. Classify page archetype.
2. Identify primary business object and user role.
3. Complete the module mapping from `module-patterns.md`:
   - Business object.
   - User job.
   - Primary identity.
   - Key state.
   - Main working data.
   - Repeated modules.
   - Primary action.
   - Grouped actions.
4. Define information hierarchy:
   - Primary identity.
   - Key status/node.
   - Main working data.
   - Auxiliary metadata.
5. Choose existing layout classes from `global.css`.
6. Implement components in module files, not one huge page file.
7. Use mock data only when backend integration is not requested.
8. Verify with `npx vite build`.
9. Visually inspect the route when a dev server is available.

## Structure Requirements

For large modules:

- Split route, menu metadata, page container, search, toolbar, table, drawer/detail, mock data, types, and composables.
- Do not put all UI, mock data, columns, and styles into one `.vue` file.
- Keep page-specific scoped CSS small. Promote reusable layout/style to `src/styles/global.css` only when it is actually shared.

Recommended module shape:

```text
src/views/<domain>/<module>/
├── index.vue
├── config.ts
├── mock.ts
├── types.ts
├── composables/
└── components/
```

## Visual Generation Rules

- Use Arco components and theme tokens.
- Do not create an independent color palette.
- Do not add large decorative gradients, oversized cards, marketing hero areas, or consumer SaaS styling.
- Use VXE Table for data grids.
- Use icon-only row actions with tooltip.
- Group low-frequency actions in dropdowns.
- Keep table/list area dominant on operational pages.

## Business Generation Rules

- Use freight domain labels from `domain-language.md`.
- Do not use generic states such as `处理中` or generic steps such as `步骤1`.
- Do not combine unrelated business fields into one table column.
- Do not duplicate the same summary in header and right side panel.
- Use transport-specific milestone names.
- For long labels, preserve meaning and adjust layout.
- Do not copy fields, milestones, attachments, cargo, route, ETD/ETA, or actions from `业务单` into unrelated modules.
- Treat every shared class as a UI slot. Fill it with object-specific data.
- If a page's object does not have a process, do not render a steps bar.

## PESDP Score

Before final delivery, score the page:

| Dimension | Pass condition |
|-----------|----------------|
| Professional | Domain terms and freight structure are correct |
| Efficient | High-frequency actions/data are fast to access |
| Structured | Primary/business/auxiliary data are separated |
| Dense | First screen contains enough useful records/fields |
| Premium | Visual quality comes from order, not decoration |

If any dimension is below acceptable level, revise structure before styling.

## Anti-Patterns To Reject

- Single-file page containing all logic and mock data.
- Modal with dozens of search fields.
- Page title/description band on operational list pages.
- Right sidebar repeating header summary.
- Whole-row status coloring.
- Large gray areas with no primary anchor.
- Too many visible toolbar buttons.
- Custom hex palette.
- Big-radius decorative cards.
- Text buttons for row operations without icons/tooltips.
- Generated pages that look consistent visually but show the wrong business concepts.
- Finance/customer/warehouse/config pages that inherit shipment-specific fields without a reason.

## Final Response Requirements

When delivering generated UI work, report:

- Module mapping used.
- Page archetype selected.
- PESDP rules applied.
- Files changed.
- Verification command and result.
- Remaining risk or known limitation.
