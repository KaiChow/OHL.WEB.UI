import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const EXPORT_ORDER_WORKBENCH_SPEC = definePesdpPageSpec({
  id: 'shipment-export-order-workbench',
  target: 'sellable-saas-grade',
  archetype: 'list-workbench',
  business: {
    object: 'sea-export-order',
    primaryUser: 'freight-operator',
    userJob: 'locate-prioritize-and-progress-orders',
    primaryIdentity: ['orderNo'],
    keyState: ['status', 'nextAction', 'exceptionState'],
    mainWorkingData: ['owner', 'customer', 'route', 'etd', 'documentState', 'feeState'],
    supportingData: ['updatedAt'],
  },
  pesdp: {
    professional: {
      decisions: ['Use sea-export order vocabulary, ownership scope, operational queues, and the next freight action; every row-changing action must expose a complete result.'],
      acceptance: [
        'Rendered columns must expose order identity, owner, route, status, and next action without generic task wording.',
        'No context sentence may repeat work-scope or queue labels that are already selected in controls.',
      ],
    },
    efficient: {
      decisions: ['Keep daily query fields, ownership scope, status queues, assignment, notification, batch entry, and row detail directly reachable.'],
      acceptance: [
        'At 1366x768 the command path must remain one compact surface and the table must own at least 70% of usable height.',
        'Batch assignment and notification must update the selected orders instead of only showing a toast.',
        'Query and every mutation must expose a stable pending state and preserve user context on failure.',
        'Advanced boolean conditions use direct three-state controls and every business group can clear only its own draft values.',
      ],
    },
    structured: {
      decisions: ['Command surface owns query/actions/queues; data surface owns table context, selection, utilities, and pagination.'],
      acceptance: [
        'Totals must appear in pagination and queue counts only; table context must not repeat the total, active scope, active queue, or risk count.',
        'Advanced query, quick detail, status change, batch assignment, and column settings each have one explicit overlay owner.',
      ],
    },
    dense: {
      decisions: ['Keep four daily locate fields on one stable row; edit fourteen compact advanced conditions in a right-side D1 drawer using two readable columns and one native scroll owner.'],
      acceptance: [
        'At 1366, 1024 split, and wide viewports, the query row does not create a separate action band and the table remains the dominant work surface.',
        'The advanced filter opens from the right at the shared D1 width, renders two field columns, and keeps the native Drawer body as its only vertical scroll owner.',
        'Drawer content and footer remain horizontally contained at 1024, 1366, and wide desktop viewports.',
      ],
    },
    premium: {
      decisions: ['Keep GI as palette owner and derive product quality from a context-preserving right drawer, freight-specific grouping, live result confidence, visible draft state, and complete states.'],
      acceptance: [
        'The advanced drawer exposes route/document, execution/ownership, schedule, and risk groups with local active counts, local reset, and a live matching-order count without a page-local component skin.',
        'The default advanced-filter interaction preserves the list beside a stable right-side drawer and never changes to a top overlay.',
        'Computed theme tokens, normal/error/empty/permission states, long text, column settings, and density behavior must be inspected on the real route.',
      ],
    },
  },
  surfaces: [
    { id: 'command', role: 'command', owns: ['query', 'query-schemes', 'create', 'export', 'ownership-scope', 'status-queues'], primaryAction: 'export-order-create', implementation: 'arco' },
    { id: 'advanced-query', role: 'supporting', owns: ['right-drawer-grid', 'advanced-query-draft', 'freight-business-grouping', 'group-active-counts', 'group-reset', 'live-result-preview', 'draft-dirty-state', 'cancel-apply-state'], primaryAction: 'export-order-query', implementation: 'arco' },
    { id: 'orders', role: 'data', owns: ['table-data', 'selection', 'batch-result', 'column-settings', 'density', 'pagination', 'total-count', 'table-feedback'], implementation: 'shared-pattern', whyArcoNotEnough: 'VXE integration and freight workbench density require the documented workbench-table bridge.' },
    { id: 'quick-detail', role: 'detail', owns: ['order-context', 'risk-summary', 'milestones', 'fee-summary', 'recent-activity', 'overlay-scroll'], implementation: 'arco' },
  ],
  query: {
    totalFields: 18,
    strategy: 's3-drawer',
    visibleFields: ['keyword', 'customerName', 'pol', 'pod'],
    advancedFields: [
      'carrier',
      'vesselVoyage',
      'blNo',
      'bookingNo',
      'orderStatus',
      'operator',
      'businessType',
      'hasException',
      'etdRange',
      'closingRange',
      'updatedRange',
      'fileStatus',
      'feeStatus',
      'isOverdue',
    ],
    savedSchemes: true,
  },
  table: {
    kind: 'workbench',
    identityColumns: ['orderNo', 'status'],
    decisionColumns: ['nextAction', 'operator', 'customerName', 'route', 'documentState', 'feeState', 'exceptionState'],
    supportingColumns: ['updatedAt'],
    compositeColumns: ['next-action-decision-context'],
    fixed: ['checkbox', 'orderNo', 'operations'],
    densityReason: 'Standard rows retain the auxiliary decision line; compact mode intentionally renders one line.',
  },
  detail: { mode: 'display-first', focus: ['status', 'nextAction', 'route', 'owner', 'documentContext'], milestones: ['booking', 'customs', 'departure'] },
  actions: [
    { id: 'export-order-query', scope: 'query', frequency: 'daily', risk: 'low', presentation: 'primary', contract: 'export-order-query', successOwner: 'orders', failureOwner: 'orders' },
    { id: 'export-order-create', scope: 'command', frequency: 'daily', risk: 'low', presentation: 'primary', contract: 'export-order-create', successOwner: 'command', failureOwner: 'command' },
    { id: 'export-order-open-detail', scope: 'row', frequency: 'daily', risk: 'low', presentation: 'row-action', contract: 'export-order-open-detail', successOwner: 'quick-detail', failureOwner: 'quick-detail' },
    { id: 'export-order-scheme', scope: 'query', frequency: 'regular', risk: 'low', presentation: 'dropdown', contract: 'export-order-scheme', successOwner: 'command', failureOwner: 'command' },
    { id: 'export-order-batch-action', scope: 'selection', frequency: 'regular', risk: 'medium', presentation: 'dropdown', contract: 'export-order-batch-action', successOwner: 'orders', failureOwner: 'orders' },
    { id: 'export-order-status-transition', scope: 'row', frequency: 'regular', risk: 'medium', presentation: 'dropdown', contract: 'export-order-status-transition', successOwner: 'orders', failureOwner: 'orders' },
    { id: 'export-order-column-preferences', scope: 'data-utilities', frequency: 'regular', risk: 'low', presentation: 'text', contract: 'export-order-column-preferences', successOwner: 'orders', failureOwner: 'orders' },
  ],
  states: ['loading', 'slow', 'empty', 'no-permission', 'network-error', 'long-text', 'extreme-value', 'partial-failure', 'success'],
  responsive: { release: ['1366x768', '1280x720'], split: '1024x768', wide: '1920x1080' },
  accessibility: {
    keyboard: ['Reach and operate query, queues, table utilities, row actions, pagination, and every opened overlay in a logical order.'],
    naming: ['Every icon-only command and state-changing control exposes a business-specific accessible name.'],
    zoom: '200%',
  },
  authorities: ['list-page.md', 'filter-layout.md', 'table.md', 'actions.md', 'detail-form.md', 'modal.md', 'overlay-dimensions.md', 'feedback.md', 'responsive.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'real-route viewport and state matrix'],
});
