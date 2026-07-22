import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const EXPORT_ORDER_DETAIL_SPEC = definePesdpPageSpec({
  id: 'shipment-export-order-detail',
  goal: 'sellable-saas-grade',
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
      evidence: ['Identity, current node, next action, and freight terminology remain consistent across header, milestone, tabs, and actions.'],
    },
    efficient: {
      decisions: ['Default to scan mode, expose the next action and blocking work, and enter editing explicitly without losing context.'],
      evidence: ['Overview opens read-only; edit/save/cancel retain the route and error state; row edits stay local to their table.'],
    },
    structured: {
      decisions: ['Identity owns object facts, execution focus owns next work, milestone owns progress, and tabs own detailed modules.'],
      evidence: ['File, fee, and risk counts have one visible owner each and are not repeated in the identity band.'],
    },
    dense: {
      decisions: ['Use compact read grids and detail-specific VXE densities while keeping controls visible only in active edit scope.'],
      evidence: ['1366 and 1024 checks confirm readable facts, accessible footer actions, and local table overflow without a form wall.'],
    },
    premium: {
      decisions: ['Use GI surfaces and restrained role hierarchy; credibility comes from traceable state, local feedback, and predictable edit sessions.'],
      evidence: ['Loading, missing, permission, network error, long text, invalid data, dirty-leave, and retry paths are reproducible on route.'],
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
  authorities: ['detail-form.md', 'table.md', 'actions.md', 'feedback.md', 'responsive.md', 'product-grade-evaluation.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'real-route detail mode and edge-state matrix'],
});
