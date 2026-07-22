# AI Generation Contract

## Purpose

Use this contract when AI creates, refactors, or reviews pages in `FE.OHL.WEB.UI`.

The goal is to prevent one-off pages and ensure every generated page follows PESDP, Arco, VXE Table, routing/module structure, and project-level reuse.

## Four-Layer Prompt Contract

AI must reason through these layers in order:

1. **Product Positioning** — next-generation international freight forwarding SaaS, not traditional ERP.
2. **Design Philosophy** — business workflows, readability, consistency, trust, and operational efficiency before decoration.
3. **Visual Language** — restrained Arco-based enterprise SaaS: neutral surfaces, white work areas, clear hierarchy, high density, low visual complexity.
4. **Implementation Rules** — Arco-first → token-second → business-pattern-third → page-local-css-last; then skill references and `check-spec`.

Do not implement a visual idea only because it resembles a modern SaaS reference. It must preserve freight workflow efficiency and pass the implementation rules.

## Required Read Order

Before generating UI:

1. **`references/arco-first.md`**
2. **`references/theme-contract.md`**
3. **`references/page-spec-contract.md`**
4. `references/design-principles.md`
5. `references/domain-language.md`
6. `references/page-archetypes.md`
6. For an existing-project redesign without a visual artifact: `references/existing-project-modernization.md`
7. For any redesign / rewrite / layout-polish task: `references/redesign-calibration.md`
8. For any productization / financing-demo / sellable-SaaS goal: `references/product-grade-evaluation.md`
9. For any screenshot/prototype input only: `references/artifact-intake-template.md` + `references/prototype-to-ui-contract.md`
10. For any interactive feature: `references/feature-routing.md` + `references/feature-delivery-contract.md`
11. The task-specific reference: list/detail/table/actions/visual/checklist.
12. `src/main.ts`, then `src/styles/global.css` — verify GI is the sole stylesheet/palette owner; do not treat global CSS as a design catalog.

## Generation Workflow

1. Complete artifact/no-reference intake and identify business object, user, job, and archetype.
2. Create or update the typed `pageSpec.ts` from `page-spec-contract.md`. Template edits are forbidden until all applicable PESDP, surface, query/table/detail, action, state, authority, and verification fields are complete.
3. Resolve contradictions using the single authorities recorded in the page spec; fix the conflicting supporting text before coding.
4. Complete functional contracts for every click, request, permission, state transition, and mutation.
5. Choose Arco built-ins first; then tokens; then proven shared patterns with a stated Arco gap; then minimal page-local CSS.
6. When the old skeleton fails the page spec, regroup or rewrite it before tuning component chrome.
7. Implement in module files, compile, run `check-spec`, and inspect the real route.
8. Compare real evidence with the spec's acceptance conditions. A target with no rendered evidence is unverified, not provisional success.

## Executable Design Language Contract

All UI requirements, reviews, and reference updates must be written as **AI-executable design language**. A rule is not acceptable if it only describes taste.

### Specification Granularity

AI-generated UI must follow **class-of-surface rules**, not page-by-page copied rules.

When writing or applying a rule:

1. Start from the reusable slot: `primary_identity`, `key_state`, `key_facts`, `main_working_data`, `supporting_data`, `sub_entity`, or `action_scope`.
2. Bind the slot to a reusable surface: filter card, toolbar, table, detail identity band, form subgroup, repeated line module, attachment module, timeline, footer, dropdown menu.
3. Pick existing structural classes and tokens only after Arco + token options are ruled out; every shared class needs a one-line `why_arco_not_enough`.
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
Dropdowns keep the GI/Arco popup skin. Toolbar/footer triggers use text plus trailing chevron; row overflow uses an icon-only `···` trigger. Options are text-first and irreversible actions form the final `danger-opt` group after an Arco Divider. Do not use invalid `popup-class`, inert `content-class` values, fixed page-scoped popup widths, horizontal scrollbars, or page-scoped dropdown shadows/padding/colors.
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
- Keep page-specific scoped CSS small. Promote to `src/styles/global.css` only when a second module needs the same pattern and `arco-first.md` justification exists.

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
- Keep one Arco component and palette baseline from GI. Normal page work does not change official theme values; page CSS must not reskin the component library.
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
- Select list/detail table density and VXE configuration only from `table.md`; do not duplicate row-height mechanics in this workflow contract.
- Add a sequence column only when `table.md` requires it for that table job; do not add one mechanically to every workbench.
- Use icon-only row actions with tooltip; apply the 1–N display matrix in [`table.md`](table.md) Row Actions (max 2 affordances, width 56/88, list danger in `···`).
- Group low-frequency actions in dropdowns.
- For process-bearing operational detail drawers, use `dds-milestone-bar` for compact process awareness. Do not generate `a-steps type="arrow"` or a full-width KPI/report strip under the hero. Repeated data totals belong in the owning module summary, not in the hero.
- For detail sections with internal groups, generate `form-subgroup` blocks with `form-subgroup__head`, `form-subgroup__title`, and a following `detail-form-grid`. Do not generate consecutive bare `form-subgroup-label` elements or repeated blue left rails.
- Generate list workbenches from the viewport matrix in `responsive.md`; `1366x768` is release-blocking and `1024x768` is the supported split-window audit.
- Select query UI only through the scenario and field-count decision table in `filter-layout.md`. Record the selected strategy in `pageSpec.ts`; do not restate or approximate the thresholds here.
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

## PESDP Trace Gate

Before template code and again before final delivery, reconcile the page against `pageSpec.ts`:

| Dimension | Required trace |
|-----------|----------------|
| Professional | Freight object/role/status/decision → rendered labels, fields, and actions → domain evidence |
| Efficient | Repeated user job → direct path and preserved context → interaction evidence |
| Structured | Surface ownership → DOM/component boundaries → duplicate-owner audit |
| Dense | Query/table/detail density decision → office viewport behavior → measured evidence |
| Premium | Arco/GI ownership, shared roles, complete states → real-route consistency/credibility evidence |

Each dimension needs at least one concrete decision and one measurable acceptance condition. If any acceptance condition is untested or contradicted by the rendered route, revise structure before styling and do not call the page PESDP-compliant.

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
- Page-spec path and PESDP trace evidence.
- Files changed.
- Verification command and result.
- Remaining risk or known limitation.
