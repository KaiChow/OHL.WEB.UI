# PESDP Page Specification Contract

## Purpose

This is the mandatory intermediate representation between a UI request and Vue code. It makes PESDP executable instead of leaving it as a visual aspiration.

For a new page, page rewrite, or material layout/interaction redesign, the AI must create or update a typed `pageSpec.ts` beside the page **before editing the Vue template**. A review-only task may produce the same structure in the review response without adding a file.

The specification is not a design document for stakeholders. It is a compact engineering contract that records why the generated structure, actions, density, states, and evidence satisfy the product standard.

## Required Source Shape

Use `definePesdpPageSpec` from `src/design-system/pesdpPageSpec.ts`.

```ts
export const PAGE_SPEC = definePesdpPageSpec({
  id: 'domain-object-surface',
  goal: 'sellable-saas-grade',
  archetype: 'list-workbench',
  business: {
    object: 'shipment-order',
    primaryUser: 'operator',
    userJob: 'locate-prioritize-act',
    primaryIdentity: ['orderNo'],
    keyState: ['status', 'nextAction'],
    mainWorkingData: ['route', 'etd', 'owner'],
    supportingData: ['updatedAt'],
  },
  pesdp: {
    professional: { decisions: ['Use object-owned freight language and status.'], evidence: ['Domain label audit on the rendered route.'] },
    efficient: { decisions: ['Keep the repeated query and next action directly reachable.'], evidence: ['Measured interaction path for the primary user job.'] },
    structured: { decisions: ['Command and data surfaces have separate ownership.'], evidence: ['Duplicate-owner audit for totals, actions, and feedback.'] },
    dense: { decisions: ['Use the authority-selected query and table density.'], evidence: ['1366x768 first-viewport measurement.'] },
    premium: { decisions: ['Use GI/Arco ownership and complete edge states.'], evidence: ['Computed-token and state-matrix inspection.'] },
  },
  surfaces: [
    { id: 'command', role: 'command', owns: ['query', 'create', 'queues'], primaryAction: 'object-create', implementation: 'arco' },
    { id: 'data', role: 'data', owns: ['table', 'selection', 'pagination', 'feedback'], implementation: 'shared-pattern', whyArcoNotEnough: 'The VXE workbench bridge owns dense data-grid behavior.' },
  ],
  query: { totalFields: 5, strategy: 's1-inline', visibleFields: ['keyword', 'customer', 'pol', 'pod', 'carrier'], advancedFields: [] },
  table: { kind: 'workbench', identityColumns: ['orderNo', 'status'], decisionColumns: ['nextAction', 'owner'], supportingColumns: ['updatedAt'] },
  detail: { mode: 'none', focus: [], milestones: [] },
  actions: [
    { id: 'object-create', scope: 'command', frequency: 'daily', risk: 'low', presentation: 'primary', contract: 'object-create', successOwner: 'data', failureOwner: 'command' },
  ],
  states: ['loading', 'empty', 'no-permission', 'network-error', 'success'],
  responsive: { release: ['1366x768'], split: '1024x768', wide: '1920x1080' },
  authorities: ['list-page.md', 'filter-layout.md', 'table.md', 'actions.md', 'feedback.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'real-route viewport/state matrix'],
})
```

Use actual business slots, not presentation prose. `surfaces`, `actions`, every PESDP trace, `states`, `authorities`, and `verification` are non-empty. Empty query/table/detail sub-arrays are allowed only when the chosen archetype does not own that capability.

## PESDP Traceability Gate

Every dimension must contain at least one implementation decision and one verification item.

| Dimension | The specification must answer | Minimum code/evidence binding |
|-----------|-------------------------------|-------------------------------|
| `professional` | Is the business object, role, status vocabulary, and next decision correct for this freight workflow? | Domain terms plus object-owned fields/actions; reject generic admin labels or borrowed module fields. |
| `efficient` | What repeated job is shortened, what remains directly reachable, and what context is preserved? | Query/action/row/detail path with frequency and risk; success/failure behavior for mutations. |
| `structured` | What owns identity, command, working data, supporting data, pagination, and feedback? | Ordered surface list with one owner per fact/count/action and one primary per scope. |
| `dense` | What density is used and why is it readable at office widths? | Query tier, table/detail density, overflow owner, first-viewport or field-scan evidence. |
| `premium` | Why does the page feel controlled, credible, and reusable instead of decorated or default-admin? | Arco/GI ownership, shared roles/tokens, edge-state completeness, cross-page/archetype consistency evidence. |

Forbidden PESDP entries:

- `professional: use professional style`
- `efficient: make it convenient`
- `structured: use cards`
- `dense: reduce spacing`
- `premium: make it beautiful`

These are taste claims, not code decisions. Replace them with object, surface, component, state, and verification facts.

## Surface And Ownership Contract

`surfaces` is ordered exactly as the user encounters the page. Each item declares:

- `id`: stable semantic role, not a color or page-local visual name;
- `role`: `identity`, `command`, `workflow`, `data`, `detail`, `supporting`, or `feedback`;
- `owns`: facts, counts, actions, errors, or pagination owned by that surface;
- `primaryAction`: zero or one action id;
- `implementation`: `arco`, `token`, `shared-pattern`, or `page-local`;
- `whyArcoNotEnough`: required only for `shared-pattern` or `page-local`.

The same total, status group, risk count, or action cannot have two visible owners without a documented interaction reason.

## Query Contract

Record the total available query fields, not only the currently visible fields. Select `strategy` from `filter-layout.md`, the single authority:

- `none`
- `s1-inline`
- `s2-expand`
- `s3-drawer`
- `s4-workspace`

The specification must separate daily visible fields from advanced fields and state whether saved schemes are a real repeated workflow. Do not infer layout from another page's field count.

## Table Contract

For a workbench table, classify columns before writing `<vxe-column>`:

- `identityColumns`: object identifiers and key state;
- `decisionColumns`: fields required to decide the next action;
- `supportingColumns`: passive metadata;
- `compositeColumns`: only dimensions that form one recognized business scan unit, with the reason recorded;
- `fixed`: fixed identity and operation columns;
- `densityReason`: why compact or standard is correct for the actual cell rhythm.

Independent fields stay independent. A composite cell is legal only when `table.md`'s Composite Cell Decision Contract passes.

## Detail Workspace Contract

An object detail route declares:

- default mode: normally `display`, never an unexplained always-editable form wall;
- `focus`: current state, blocking risk, owner, next action, and recent change where relevant;
- `milestones`: only real object-owned freight nodes;
- edit scope and save/cancel ownership;
- tab/section ownership so counts and summaries are not duplicated;
- local error owner and input-preservation behavior.

Use a full-page form only when creation or a staged transaction is the primary job. Do not treat every detail page as a form archetype.

## Action And State Contract

Every visible action references a feature contract and declares:

- scope;
- frequency;
- risk;
- presentation;
- permission/enablement source;
- success owner;
- failure owner.

Every owned surface lists applicable states from: `loading`, `slow`, `empty`, `no-permission`, `validation-error`, `business-error`, `network-error`, `long-text`, `extreme-value`, `partial-failure`, and `success`.

Do not claim product completion when a relevant state has no deterministic trigger or recovery evidence.

## Authority Resolution

The page spec records only decisions. Numeric values and component mechanics remain in their single authorities:

- query strategy: `filter-layout.md`
- list structure: `list-page.md`
- table mechanics: `table.md`
- detail workspace: `detail-form.md`
- actions: `actions.md`
- feedback: `feedback.md`
- responsive behavior: `responsive.md`
- visual roles: `visual-system.md`
- product maturity: `product-grade-evaluation.md`

When a supporting reference conflicts with an authority, fix or delete the supporting rule before coding. Do not choose the easier version silently.

## Generation Sequence

1. Gather business context and artifact/no-reference intake.
2. Create/update `pageSpec.ts` and complete all applicable fields.
3. Read the authority files named by the spec.
4. Create/update feature contracts for every interactive action.
5. Implement Arco-first, then tokens, then justified patterns, then minimal page-local CSS.
6. Run type/build and `check-spec`.
7. Inspect the real route and attach evidence to the spec or delivery report.
8. Re-open the spec and mark unsupported claims as failures; revise structure before styling.

Skipping step 2 is a blocking process violation for page generation or rewrite work.
