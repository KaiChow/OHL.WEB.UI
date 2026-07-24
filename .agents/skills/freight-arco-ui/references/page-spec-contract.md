# PESDP Page Specification Contract

Typed `pageSpec.ts` is the compact decision record between a UI request and Vue code. It binds business facts, surface ownership, actions, states, and verification. It is not a design essay and cannot certify its own quality.

Use `definePesdpPageSpec` from `src/design-system/pesdpPageSpec.ts` for a new page, rewrite, or material layout/interaction change before editing the Vue template.

## Required Shape

```ts
export const PAGE_SPEC = definePesdpPageSpec({
  id: 'domain-object-surface',
  target: 'sellable-saas-grade',
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
    professional: { decisions: ['Use object-owned freight terms and state.'], acceptance: ['Rendered labels/actions match the object contract.'] },
    efficient: { decisions: ['Keep repeated query and next action directly reachable.'], acceptance: ['Primary job path and preserved context are exercised.'] },
    structured: { decisions: ['Command and data facts have one visible owner.'], acceptance: ['No total, action, feedback, or state has duplicate ownership.'] },
    dense: { decisions: ['Use the authority-selected query and table density.'], acceptance: ['First viewport and every scroll owner are measured.'] },
    premium: { decisions: ['Use GI/Arco ownership and complete adverse states.'], acceptance: ['Computed tokens and the applicable state matrix are inspected.'] },
  },
  surfaces: [
    { id: 'command', role: 'command', owns: ['query', 'create'], primaryAction: 'object-create', implementation: 'arco' },
    { id: 'data', role: 'data', owns: ['table', 'pagination', 'feedback'], implementation: 'shared-pattern', whyArcoNotEnough: 'VXE workbench behavior needs the shared bridge.' },
  ],
  query: { totalFields: 2, strategy: 's1-inline', visibleFields: ['keyword', 'customer'], advancedFields: [] },
  table: { kind: 'workbench', identityColumns: ['orderNo', 'status'], decisionColumns: ['nextAction'], supportingColumns: ['updatedAt'] },
  detail: { mode: 'none', focus: [], milestones: [] },
  actions: [
    { id: 'object-create', scope: 'command', frequency: 'daily', risk: 'low', presentation: 'primary', contract: 'object-create', successOwner: 'data', failureOwner: 'command' },
  ],
  states: ['loading', 'empty', 'no-permission', 'network-error', 'success'],
  responsive: { release: ['1366x768'], split: '1024x768', wide: '1920x1080' },
  accessibility: {
    keyboard: ['Reach every command, row action, and opened overlay in workflow order.'],
    naming: ['Every icon-only command has a business-specific accessible name.'],
    zoom: '200%',
  },
  authorities: ['list-page.md', 'table.md', 'actions.md', 'feedback.md'],
  verification: ['check-spec', 'build', 'real-route viewport/state evidence'],
})
```

Use actual business slots, not presentation prose. `target` is intent only. Browser measurements, screenshots, scenario results, and command output belong in the delivery record or automated artifacts, never in the spec.

## Decision Discipline

Each PESDP dimension normally gets one implementation decision and one observable acceptance condition. Add a second only when it controls a materially different surface. Never use entries such as `professional style`, `make it convenient`, `use cards`, `reduce spacing`, or `make it beautiful`.

- `professional`: object, actor, vocabulary, state, next decision.
- `efficient`: repeated job, direct reachability, context preservation.
- `structured`: ordered surfaces and one visible owner per fact/action/feedback.
- `dense`: query/table/detail density, first viewport, scroll/overflow ownership.
- `premium`: shared Arco/GI language, risk control, adverse-state completeness.

If an entry cannot point to code or a rendered check, delete or rewrite it.

## Surface And Action Binding

Order `surfaces` as the user encounters them. IDs describe stable roles, not colors or local styling. `owns` lists only facts/actions/states actually rendered there. The same count, status, summary, action, or error cannot have two owners without an interaction reason.

Every business action references an existing feature contract and declares frequency, risk, presentation, success owner, and failure owner. Owners must identify a declared surface or a concrete child surface within it. Do not create action entries for static presentation toggles.

## Page-Specific Contracts

- Query: record all fields, visible vs advanced ownership, selected strategy, and saved schemes only when real.
- Workbench table: classify identity, decision, supporting, composite, fixed, and density roles before columns are coded.
- Object detail: default mode, current risk/next work, real milestones, edit scope, save/cancel owner, and local failure owner.
- States: include only applicable states, but every listed state needs a deterministic trigger and recovery check. Omitting an applicable state to shorten the spec is a release defect.
- Accessibility: record the page-specific keyboard path and accessible-name scope; `zoom` is fixed at `200%`. Arco ownership does not waive checks for VXE, custom freight patterns, or icon-only actions.
- Authorities: name one primary page authority plus only surfaces actually touched. Numeric mechanics stay in those authorities.

## Generation Sequence

1. Prove business object, user job, behavior to preserve, and artifact/no-artifact path.
2. Create/update `pageSpec.ts`.
3. Read only its primary and affected surface authorities.
4. Create/update smallest complete feature contracts for business actions.
5. Implement Arco-first, tokens, shared patterns, then minimal local layout CSS.
6. Run spec/build checks and inspect the real route with deterministic state scenarios.
7. Compare produced evidence to every acceptance condition; unsupported quality remains a blocker.

Skipping the spec before material template work is a process violation. Completing the spec without rendered evidence is also incomplete.
