# AI Generation Contract

## Purpose

Use this contract when AI creates, refactors, or reviews pages in `FE.OHL.WEB.UI`.

The goal is to prevent one-off pages and ensure every generated page follows PESDP, Arco, VXE Table, routing/module structure, and project-level reuse.

## Four-Layer Prompt Contract

AI must reason through these layers in order:

1. **Product Positioning** — next-generation international freight forwarding SaaS, not traditional ERP.
2. **Design Philosophy** — business workflows, readability, consistency, trust, and operational efficiency before decoration.
3. **Visual Language** — restrained Arco-based enterprise SaaS: neutral surfaces, white work areas, clear hierarchy, high density, low visual complexity.
4. **Implementation Rules** — `global.css` tokens, Arco/VXE components, page archetypes, action rules, table rules, and `check-spec`.

Do not implement a visual idea only because it resembles a modern SaaS reference. It must preserve freight workflow efficiency and pass the implementation rules.

## Required Read Order

Before generating UI:

1. `src/styles/global.css`
2. `CLAUDE.md`
3. `references/design-principles.md`
4. `references/domain-language.md`
5. `references/page-archetypes.md`
6. For any redesign / rewrite / layout-polish task: `references/redesign-calibration.md`
7. For any framework-first / low-customization task: `references/arco-first.md`
8. For any productization / financing-demo / sellable-SaaS goal: `references/product-grade-evaluation.md`
9. For any screenshot/prototype input: `references/artifact-intake-template.md` + `references/prototype-to-ui-contract.md`
10. For any interactive feature: `references/feature-routing.md` + `references/feature-delivery-contract.md`
11. The task-specific reference: list/detail/table/actions/visual/checklist.

## Generation Workflow

1. If the task starts from a screenshot/prototype, complete the intake template from `artifact-intake-template.md`.
2. If the task starts from a screenshot/prototype, complete the prototype translation block from `prototype-to-ui-contract.md`.
3. If the task is redesign/rewrite/polish, classify it as `polish-only`, `surface-regrouping`, or `skeleton-rewrite` using `redesign-calibration.md`.
4. If the task targets product-grade quality, define the desired level using `product-grade-evaluation.md`: `internal-system`, `strong-internal-product`, `customer-facing-product`, or `sellable-saas-grade`.
5. Decide whether the page can stay `arco-only`, needs `arco-plus-shared-enhancement`, or truly needs a custom pattern using `arco-first.md`.
6. Classify page archetype.
7. Identify primary business object and user role.
8. If the task has behavior, complete the functional contract from `feature-delivery-contract.md`.
9. Complete the module mapping from `module-patterns.md`:
   - Business object.
   - User job.
   - Primary identity.
   - Key state.
   - Main working data.
   - Repeated modules.
   - Primary action.
   - Grouped actions.
10. Define information hierarchy:
   - Primary identity.
   - Key status/node.
   - Main working data.
   - Auxiliary metadata.
11. Choose Arco built-ins first; only then choose existing shared enhancement classes from `global.css`.
12. When the task is redesign and the old skeleton is weak, regroup surfaces or rewrite the page skeleton before tuning component chrome.
13. Implement components in module files, not one huge page file.
14. Use mock data only when backend integration is not requested.
15. Verify with `npx vite build`.
16. Visually inspect the route when a dev server is available.

## Executable Design Language Contract

All UI requirements, reviews, and reference updates must be written as **AI-executable design language**. A rule is not acceptable if it only describes taste.

### Specification Granularity

AI-generated UI must follow **class-of-surface rules**, not page-by-page copied rules.

When writing or applying a rule:

1. Start from the reusable slot: `primary_identity`, `key_state`, `key_facts`, `main_working_data`, `supporting_data`, `sub_entity`, or `action_scope`.
2. Bind the slot to a reusable surface: filter card, toolbar, table, detail identity band, form subgroup, repeated line module, attachment module, timeline, footer, dropdown menu.
3. Pick existing structural classes and tokens from `global.css`.
4. Fill labels and field examples from the current business object.

Business terms such as route, ETD, cargo, HBL, invoice amount, warehouse stock, or customer credit are examples of slot content. They are not reusable structure by themselves.

Forbidden:

- creating one global rule per screenshot, such as a separate standard for `货物信息`, another for `提单信息`, and another for `客户委托`;
- copying shipment/order fields into finance, customer, warehouse, configuration, or document pages because the component class is shared;
- naming global classes after a single backend field when the need is really identity, key fact, repeated line, document type, or action scope.

When turning feedback into a rule, translate subjective judgement into implementation structure:

| Vague feedback | Required design-language form |
|----------------|-------------------------------|
| `不好看`, `太丑`, `没质感` | Define the surface, hierarchy, token, component class, state, spacing rhythm, and forbidden fallback. |
| `高密度` | Define row/control height, gap tier, visible information rhythm, truncation/tooltip behavior, and minimum readable separation. |
| `专业`, `高级`, `SaaS感` | Define business object ownership, primary/secondary/auxiliary hierarchy, Arco token usage, and visual restraint. |
| `操作不规范` | Define action scope, trigger type, button type/status, dropdown variant, danger confirmation, and maximum visible actions. |

Every new or changed UI rule must include at least four of these executable anchors:

1. **Object / scope** — page zone, component, table type, drawer, toolbar, field group, or action scope.
2. **Required structure** — class name, component pattern, slot, DOM relationship, or file/reference location.
3. **Token / density** — global CSS variable, Arco size, row height, gap, typography tier, or color alias.
4. **State behavior** — default, hover, active, selected, disabled, loading, empty, error, or danger handling.
5. **Business semantics** — freight object, status, action verb, ownership, or user job.
6. **Forbidden fallback** — the specific old/simple pattern that must not be generated.
7. **Verification** — checklist item, `check-spec` rule, or static search pattern when automation is feasible.

Rules that only say `不要贴在一起`, `要有设计感`, `更高级`, `更美观`, `更专业`, or `统一一下` must be rewritten before implementation. The rewrite must explain what an AI should code: which class to use, what spacing/token/state applies, where danger or hierarchy sits, and what old pattern is rejected.

Good rule example:

```text
Toolbar dropdowns use `content-class="action-menu action-menu--toolbar"`; row operation dropdowns use `content-class="action-menu action-menu--row"`. Toolbar menus use content-adaptive width (`width: max-content`) with compact min width and `--dense-action-menu-max-w` upper bound for i18n labels; row menus keep at least 32px option hit area. Options use F4 control typography and are text-first: do not add icons by default, and never force icons just to make every option look decorated. Put irreversible actions in the final `danger-opt` group separated by `action-menu__divider`. Do not use invalid `popup-class`, fixed page-scoped menu widths, `row-action-menu` for toolbar menus, horizontal scrollbars, or page-scoped dropdown shadows/padding/colors.
```

Bad rule example:

```text
Dropdown should look more premium and not ugly.
```

For functional behavior, equally vague rules are forbidden:

```text
Bad: Save button should work correctly.
Good: Define visible_when, enabled_when, required_when, api_request, success_result, error_result, and refresh_scope.
```

For screenshot-driven work, these are also forbidden:

```text
Bad: The screenshot has a button, so I guessed it should submit and refresh the whole page.
Good: Translate the screenshot into business_object, page_archetype, visible_actions, uncertain_actions, and feature_contracts_required before coding.
```

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
- Always use Arco Design components whenever possible.
- Prefer Arco props, slots, layout primitives, and existing interaction behavior before introducing shared custom wrappers.
- Do not redesign existing Arco interaction behaviors.
- Avoid custom controls unless a shared Arco/VXE pattern cannot satisfy the business interaction.
- Treat `global.css` as a thin enhancement layer for shell rhythm, freight semantics, and VXE integration — not as a replacement UI framework.
- Maintain spacing on the project 8px rhythm through existing `--dense-gap-*`, padding, and component-size tokens.
- Prefer responsive desktop layouts; do not create page-level horizontal overflow at common desktop widths.
- Do not create an independent color palette.
- Do not add large decorative gradients, oversized cards, marketing hero areas, or consumer SaaS styling.
- Do not sacrifice information density for aesthetics.
- For redesign tasks, default to hierarchy and skeleton changes before local color or border tuning.
- For redesign tasks, AI may replace weak flat toolbars/status strips/filter walls with stronger workbench structures from `redesign-calibration.md` when workflow efficiency improves.
- For product-grade tasks, do not stop after the page becomes usable and compliant; also evaluate consistency, credibility, demo value, and expandability using `product-grade-evaluation.md`.
- Prioritize usability over visual novelty.
- Every design decision should improve reading speed, reduce errors, minimize clicks, or improve workflow efficiency.
- Use VXE Table for data grids.
- Generate main list tables as `class="compact workbench-table"` with `row-config.height = 36`.
- Generate editable detail/nested tables as `class="detail-mini-vxe detail-mini-vxe--editable"` with `row-config.height = 38`; do not rely on CSS-only row height.
- Generate readonly detail/nested tables, such as documents, files, and status records, as `class="detail-mini-vxe detail-mini-vxe--readonly"` with `row-config.height = 34`.
- Generate compact summary tables as `class="detail-mini-vxe detail-mini-vxe--summary"` with `row-config.height = 32`; do not use this variant for rows with visible form controls.
- Generate VXE sequence columns with `width="52"` in both workbench and detail tables unless a documented module exception exists.
- Use icon-only row actions with tooltip; apply the 1–N display matrix in [`table.md`](table.md) Row Actions (max 2 affordances, width 56/88, list danger in `···`).
- Group low-frequency actions in dropdowns.
- For process-bearing operational detail drawers, use `dds-milestone-bar` for compact process awareness. Do not generate `a-steps type="arrow"` or a full-width KPI/report strip under the hero. Repeated data totals belong in the owning module summary, not in the hero.
- For detail sections with internal groups, generate `form-subgroup` blocks with `form-subgroup__head`, `form-subgroup__title`, and a following `detail-form-grid`. Do not generate consecutive bare `form-subgroup-label` elements or repeated blue left rails.
- Generate list workbenches with the responsive contract from `responsive.md`: filter rows may wrap below `1280px`, merged toolbar/status may become two rows, and `stat-tab-group` must scroll internally instead of creating page-level horizontal overflow.
- Select query UI by field count from `filter-layout.md`: 1-8 visible core filters, 9-16 core row + drawer, 17-32 grouped drawer, 33-50 wide drawer with group navigation, and 50+ saved query workspace. Do not generate a flat 30/40/50-field query wall.
- Keep table/list area dominant on operational pages.

## Business Generation Rules

- Use freight domain labels from `domain-language.md`.
- Do not use generic states such as `处理中` or generic steps such as `步骤1`.
- Do not combine unrelated business fields into one table column.
- Do not duplicate the same summary in header and right side panel.
- Use object-specific milestone names only when the object owns a real process.
- For long labels, preserve meaning and adjust layout.
- Do not copy fields, milestones, attachments, repeated entities, key facts, or actions from one business object into unrelated modules.
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
- Mutation features that have no explicit visibility, enablement, refresh, or failure-preservation contract.

## Final Response Requirements

When delivering generated UI work, report:

- Module mapping used.
- Page archetype selected.
- PESDP rules applied.
- Files changed.
- Verification command and result.
- Remaining risk or known limitation.
