# Page Specification Contract

Typed `pageSpec.ts` is the compact decision record between a UI request and Vue code. It binds business facts, surface ownership, actions, states, and verification. It is not a design essay and cannot certify its own quality.

Every new page, rewrite, or material layout/interaction change declares a typed page spec through the project's shared `definePesdpPageSpec` helper before the Vue template is edited.

## Required Shape

```ts
export const PAGE_SPEC = definePageSpec({
  id: 'domain-object-surface',
  target: 'sellable-saas-grade',
  presentationTarget: 'daily-ops',
  archetype: 'list-management',
  list: {
    frame: 'standard-list-v1',
    profile: 'management',
    commandSurface: 'compact',
    tableTop: 'utility-cap',
    selection: 'conditional',
    workScope: 'none',
    statusQueues: 'none',
    views: {
      pageMode: 'none',
      pageModeCount: 0,
      workflowState: 'none',
      workflowStateCount: 0,
      workflowStatePlacement: 'none',
      workflowStateOverflow: 'none',
    },
  },
  business: {
    object: 'contract',
    primaryUser: 'account-manager',
    userJob: 'locate-prioritize-act',
    primaryIdentity: ['contractNo'],
    keyState: ['status', 'nextAction'],
    mainWorkingData: ['customer', 'amount', 'owner'],
    supportingData: ['updatedAt'],
  },
  pesdp: {
    professional: { decisions: ['Use object-owned business terms and state.'], acceptance: ['Rendered labels/actions match the object contract.'] },
    efficient: { decisions: ['Keep repeated query and next action directly reachable.'], acceptance: ['Primary job path and preserved context are exercised.'] },
    structured: { decisions: ['Command and data facts have one visible owner.'], acceptance: ['No total, action, feedback, or state has duplicate ownership.'] },
    dense: { decisions: ['Use the authority-selected query and table density.'], acceptance: ['First viewport and every scroll owner are measured.'] },
    premium: { decisions: ['Use shared Arco/token ownership and complete adverse states.'], acceptance: ['Computed tokens and the applicable state matrix are inspected.'] },
  },
  surfaces: [
    { id: 'command', role: 'command', owns: ['query', 'create'], primaryAction: 'object-create', implementation: 'arco' },
    { id: 'data', role: 'data', owns: ['table', 'pagination', 'feedback'], implementation: 'shared-pattern', whyArcoNotEnough: 'VXE workbench behavior needs the shared bridge.' },
  ],
  query: { totalFields: 2, strategy: 's1-inline', visibleFields: ['keyword', 'customer'], advancedFields: [] },
  table: { kind: 'management-list', rowBanding: 'striped', identityColumns: ['contractNo', 'status'], decisionColumns: ['nextAction'], supportingColumns: ['updatedAt'] },
  detail: { mode: 'none', focus: [], milestones: [] }, // non-none detail must also declare scroll ownership and typed modules
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
Each quality dimension normally gets one implementation decision and one observable acceptance condition. Add a second only when it controls a materially different surface. Never use entries such as `professional style`, `make it convenient`, `use cards`, `reduce spacing`, or `make it beautiful`.

- `professional`: object, actor, vocabulary, state, next decision.
- `efficient`: repeated job, direct reachability, context preservation.
- `structured`: ordered surfaces and one visible owner per fact/action/feedback.
- `dense`: query/table/detail density, first viewport, scroll/overflow ownership.
- `premium`: shared Arco/token language, risk control, adverse-state completeness.

If an entry cannot point to code or a rendered check, delete or rewrite it.

## Surface And Action Binding

Order `surfaces` as the user encounters them. IDs describe stable roles, not colors or local styling. `owns` lists only facts/actions/states actually rendered there. The same count, status, summary, action, or error cannot have two owners without an interaction reason.

Every business action references an existing feature contract and declares frequency, risk, presentation, success owner, and failure owner. Owners must identify a declared surface or a concrete child surface within it. Do not create action entries for static presentation toggles.

## Page-Specific Contracts

- List: every list page declares `frame: 'standard-list-v1'`, one `archetype`, and matching `list.profile`. The frame fixes shared UI/UX language; the profile controls only business complexity. `list-query` is for locating/inspecting, `list-management` is for master-data maintenance, and `list-workbench` is for repeated operational processing. Record whether the page owns a command surface, table cap, selection, work scope, status queues, page-mode switch, and the workflow-state control/count/placement/overflow; do not infer these from a copied template or call every selector a Tab.
- Query: record all fields, visible vs advanced ownership, and selected strategy. The query strategy describes field complexity; the list archetype describes the user's job. They are independent decisions.
- Table: `query-list`, `management-list`, and `workbench` must match `list.profile`. Classify identity, decision, supporting, composite, fixed, density, and stable `rowBanding` roles before columns are coded; never derive banding from the current result count.
- Object detail: declare `workspace.archetype` (`operational-workspace`, `reference-workspace`, or `review-workspace`), identity-band identity/key-fact/decision slots, the single object action owner, navigation policy, named identify/locate/act usability tasks, default edit mode, real milestones, one scroll owner, and a typed module manifest. Every module declares semantic kind, owned facts, sourced statistics with one placement, scoped actions, collapse rule, and `children: { kind: 'none' }` or one bounded repeated-child contract. Empty metrics/actions are explicit; arbitrary recursion, invented nav completion, and duplicated action/fact ownership are forbidden.
- Presentation target: `presentationTarget` defaults to `daily-ops`. `demo` is for financing, sales, and customer-review surfaces and unlocks only the exceptions in `visual-system.md` Presentation Target Exceptions; every daily-work gate still applies.
- States: include only applicable states, but every listed state needs a deterministic trigger and recovery check. Omitting an applicable state to shorten the spec is a release defect.
- Accessibility: record the page-specific keyboard path and accessible-name scope; `zoom` is fixed at `200%`. Arco ownership does not waive checks for VXE, custom shared patterns, or icon-only actions.
- Authorities: name one primary page authority plus only surfaces actually touched. Numeric mechanics stay in those authorities.

## Reference Implementation

The five quality dimensions, state coverage, surface ownership, and accessibility rules in this file are the contract; the helper name and file paths are replaceable. A project adopting this skill must provide equivalent typed pageSpec infrastructure — a `definePageSpec`-style helper with full type checking, a colocated `pageSpec.ts` convention for routed pages, and a static checker that discovers specs and gates them in CI.

## Generation Sequence

1. Prove business object, user job, behavior to preserve, and artifact/requirement path; record unresolved business decisions and recommended defaults without delegating professional layout choices to the user.
2. Create/update `pageSpec.ts`.
3. Read only its primary and affected surface authorities.
4. Create/update smallest complete feature contracts for business actions.
5. Implement Arco-first, tokens, shared patterns, then minimal local layout CSS.
6. Run spec/build checks and inspect the real route with deterministic state scenarios.
7. Compare produced evidence to every acceptance condition; unsupported quality remains a blocker.

Skipping the spec before material template work is a process violation. Completing the spec without rendered evidence is also incomplete.
