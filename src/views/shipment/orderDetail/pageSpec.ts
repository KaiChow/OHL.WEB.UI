import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const EXPORT_ORDER_DETAIL_SPEC = definePesdpPageSpec({
  id: 'shipment-export-order-detail',
  target: 'sellable-saas-grade',
  archetype: 'object-detail',
  business: {
    object: 'sea-export-order',
    primaryUser: 'freight-operator',
    userJob: 'understand-risk-and-progress-the-next-node',
    primaryIdentity: ['orderNo', 'customerName'],
    keyState: ['status', 'currentMilestone', 'nextAction', 'blockingRisk'],
    mainWorkingData: ['route', 'carrier', 'vesselVoyage', 'etd', 'eta', 'owner'],
    supportingData: ['collaborators', 'updatedAt'],
  },
  pesdp: {
    professional: {
      decisions: ['Use a sea-export object workspace with real milestones, ownership, documents, fees, and exception semantics.'],
      acceptance: ['Identity, current node, next action, and freight terminology must remain consistent across header, milestone, tabs, and actions.'],
    },
    efficient: {
      decisions: ['Default to scan mode, expose the next action and blocking work, and enter editing explicitly without losing context.'],
      acceptance: ['Overview must open read-only; edit/save/cancel must retain route and error state; row edits must stay local to their table.'],
    },
    structured: {
      decisions: ['Identity owns object facts, execution focus owns next work, milestone owns progress, and tabs own detailed modules.'],
      acceptance: ['File, fee, and risk counts must have one visible owner each and must not repeat in the identity band.'],
    },
    dense: {
      decisions: ['Use compact read grids and detail-specific VXE densities while keeping controls visible only in active edit scope; the active tab pane owns vertical scrolling.'],
      acceptance: ['At 1366 and 1024, all detail sections must remain reachable through one active-pane scrollbar, with stable scrollHeight and no clipped content.'],
    },
    premium: {
      decisions: ['Use GI surfaces and restrained role hierarchy; credibility comes from traceable state, local feedback, and predictable edit sessions.'],
      acceptance: ['Loading, missing, permission, network error, long text, invalid data, dirty-leave, and retry paths must be reproducible on route.'],
    },
  },
  surfaces: [
    { id: 'identity', role: 'identity', owns: ['orderNo', 'customer', 'status', 'route', 'owner', 'global-utilities'], implementation: 'arco' },
    { id: 'execution-focus', role: 'workflow', owns: ['blocking-risk', 'next-action', 'next-owner', 'due-time'], primaryAction: 'export-order-progress-status', implementation: 'page-local', whyArcoNotEnough: 'Arco supplies layout primitives but has no freight execution-focus semantic surface.' },
    { id: 'milestone', role: 'workflow', owns: ['current-node', 'completed-nodes', 'remaining-nodes'], implementation: 'page-local', whyArcoNotEnough: 'The compact object milestone is not a wizard and requires freight-specific state semantics.' },
    { id: 'detail-tabs', role: 'detail', owns: ['overview', 'execution', 'files', 'fees', 'exceptions', 'collaboration', 'module-feedback'], implementation: 'arco' },
    { id: 'edit-session', role: 'feedback', owns: ['edit-mode', 'dirty-state', 'save', 'cancel', 'submit-error'], primaryAction: 'export-order-detail-edit-session', implementation: 'arco' },
  ],
  query: { totalFields: 0, strategy: 'none', visibleFields: [], advancedFields: [] },
  table: {
    kind: 'detail-readonly',
    identityColumns: [],
    decisionColumns: ['line-status', 'line-error'],
    supportingColumns: ['line-metadata'],
    fixed: ['sequence', 'operations'],
    densityReason: 'Each detail table selects editable or readonly density by row job; controls appear only for the active row.',
  },
  detail: {
    mode: 'display-first',
    focus: ['blockingRisk', 'nextAction', 'owner', 'dueTime', 'recentChange'],
    milestones: ['接单', '订舱', '进仓', '报关', '开船', '到港'],
  },
  actions: [
    { id: 'export-order-detail-edit-session', scope: 'detail', frequency: 'regular', risk: 'low', presentation: 'secondary', contract: 'export-order-detail-edit-session', successOwner: 'detail-workspace', failureOwner: 'active-field-or-section' },
    { id: 'export-order-progress-status', scope: 'execution-focus', frequency: 'daily', risk: 'medium', presentation: 'primary', contract: 'export-order-status-transition', successOwner: 'execution-focus', failureOwner: 'status-modal' },
  ],
  states: ['loading', 'empty', 'no-permission', 'validation-error', 'business-error', 'network-error', 'long-text', 'extreme-value', 'success'],
  responsive: { release: ['1366x768', '1280x720'], split: '1024x768', wide: '1920x1080' },
  accessibility: {
    keyboard: ['Reach the back command, object actions, execution focus, tabs, editable rows, modal workflow, and sticky footer without a focus trap.'],
    naming: ['Every icon-only command, tab state, editable row action, and validation owner exposes an accessible name.'],
    zoom: '200%',
  },
  authorities: ['detail-form.md', 'table.md', 'actions.md', 'feedback.md', 'responsive.md', 'product-grade-evaluation.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'real-route detail mode and edge-state matrix'],
});
