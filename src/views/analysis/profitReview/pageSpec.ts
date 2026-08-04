import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const PROFIT_REVIEW_SPEC = definePesdpPageSpec({
  id: 'order-profit-review-workbench',
  target: 'strong-internal-product',
  archetype: 'list-workbench',
  input: { path: 'requirement', artifacts: [], unresolvedBusinessDecisions: ['production permission and review-transition sources'], recommendations: ['retain repository-backed local contracts until production sources are supplied'] },
  list: {
    frame: 'standard-list-v1', profile: 'operations-workbench', commandSurface: 'workbench', tableTop: 'workbench-toolbar', selection: 'batch', workScope: 'none', statusQueues: 'required',
    views: { pageMode: 'none', pageModeCount: 0, workflowState: 'line-tabs', workflowStateCount: 5, workflowStatePlacement: 'workflow-row', workflowStateOverflow: 'none' },
  },
  business: {
    object: 'order-profit-review', primaryUser: 'profit-reviewer', userJob: 'prioritize-review-and-submit-profit-risks', primaryIdentity: ['orderNo'], keyState: ['reviewStatus', 'riskLevel'], mainWorkingData: ['customer', 'owner', 'amount', 'grossMarginRate', 'riskItems'], supportingData: ['updatedAt'],
  },
  pesdp: {
    professional: { decisions: ['Use order-profit vocabulary, review status, risk level, margin, and owned risk items.'], acceptance: ['The table makes order identity, risk, review status, amount, margin, owner, and update time scannable.'] },
    efficient: { decisions: ['Keep five daily locate conditions and five review queues directly reachable.'], acceptance: ['Query and status changes reset pagination and refresh the current result set without duplicate status filters.'] },
    structured: { decisions: ['The query surface owns query and a mutation-free review-state row; the table toolbar owns export, conditional batch submit, selection context, one table-utility group, and rightmost pagination.'], acceptance: ['Review-state selection is visually above commands; refresh is separated from the rightmost mini pagination, and every count has one owner.'] },
    dense: { decisions: ['Use S1 inline query, shared vertical-form rhythm, VXE global mini density, and container-responsive mini pagination.'], acceptance: ['At 1366x768 and 1024x768 no command band wraps; compact pagination keeps total/navigation and hides jumper then page-size before business commands compress.'] },
    premium: { decisions: ['Use GI/Arco native surfaces, VXE global appearance, and local mock states rather than a second page skin.'], acceptance: ['Detail/edit drawers, confirm flows, loading, empty, error, and partial-result feedback are reachable without blank demo controls.'] },
  },
  surfaces: [
    { id: 'command', role: 'command', owns: ['query', 'review-queues'], primaryAction: 'profit-review-query', implementation: 'arco' },
    { id: 'reviews', role: 'data', owns: ['export', 'batch-submit', 'table-data', 'selection', 'pagination', 'table-feedback', 'detail', 'edit'], implementation: 'shared-pattern', whyArcoNotEnough: 'The list uses VXE fixed columns, selection, and local table context.' },
  ],
  query: {
    totalFields: 5,
    strategy: 's1-inline',
    layout: 'semantic-grid-v1',
    visibleFields: ['keyword', 'riskLevel', 'region', 'owner', 'updatedRange'],
    visibleFieldLayout: [
      { field: 'keyword', width: 'standard' },
      { field: 'riskLevel', width: 'compact' },
      { field: 'region', width: 'compact' },
      { field: 'owner', width: 'compact' },
      { field: 'updatedRange', width: 'range' },
    ],
    advancedFields: [],
  },
  table: { kind: 'workbench', rowBanding: 'striped', identityColumns: ['sequence', 'orderNo', 'reviewStatus'], decisionColumns: ['riskLevel', 'grossMarginRate', 'owner'], supportingColumns: ['updatedAt'], fixed: ['checkbox', 'sequence', 'orderNo', 'operations'], densityReason: 'Profit review is a repeated operator queue with scan-first rows and continuous row references.' },
  detail: {
    mode: 'display-first',
    focus: ['riskItems', 'reviewNote', 'timeline'],
    milestones: ['entered-review', 'review-submitted', 'review-outcome'],
    workspace: {
      archetype: 'review-workspace',
      identityBand: {
        identity: ['orderNo', 'reviewStatus'],
        keyFacts: ['amount', 'grossMarginRate', 'owner'],
        decision: ['riskLevel', 'riskItems'],
        actionOwner: 'none',
      },
      navigation: { mode: 'none', itemState: 'active-only' },
      usability: {
        identify: ['Identify the reviewed order, state, risk, margin, and owner before opening a module.'],
        locateIssue: ['Reach the owning risk item directly from the review focus without scanning passive history.'],
        completeFrequentAction: ['Review the risk facts and return to the work queue without losing list context.'],
      },
    },
    scroll: { verticalOwner: 'drawer-body', horizontalOverflow: 'table-only', stickyActionOwner: 'none' },
    modules: [
      { id: 'profit-facts', kind: 'field-group', priority: 'core', mode: 'read-only', owns: ['amount', 'grossMarginRate', 'owner'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'risk-items', kind: 'exception', priority: 'core', mode: 'read-only', owns: ['riskItems'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'review-timeline', kind: 'activity-log', priority: 'audit', mode: 'read-only', owns: ['reviewTimeline'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
    ],
  },
  actions: [
    { id: 'profit-review-query', scope: 'query', frequency: 'daily', risk: 'low', presentation: 'primary', contract: 'profit-review-query', successOwner: 'reviews', failureOwner: 'reviews' },
    { id: 'profit-review-batch-submit', scope: 'command', frequency: 'regular', risk: 'medium', presentation: 'primary', contract: 'profit-review-batch-submit', successOwner: 'reviews', failureOwner: 'reviews' },
    { id: 'profit-review-edit', scope: 'row', frequency: 'regular', risk: 'low', presentation: 'row-action', contract: 'profit-review-edit', successOwner: 'reviews', failureOwner: 'reviews' },
    { id: 'profit-review-export', scope: 'command', frequency: 'regular', risk: 'low', presentation: 'secondary', contract: 'profit-review-export', successOwner: 'command', failureOwner: 'command' },
  ],
  states: ['loading', 'empty', 'no-permission', 'network-error', 'partial-failure', 'success'],
  responsive: { release: ['1366x768', '1280x720'], split: '1024x768', wide: '1920x1080' },
  accessibility: { keyboard: ['Reach query, queues, command actions, table utilities, row actions, and drawers in workflow order.'], naming: ['Every icon-only utility and overflow action has a business-specific accessible name.'], zoom: '200%' },
  authorities: ['list-page.md', 'filter-layout.md', 'table.md', 'actions.md', 'feedback.md', 'responsive.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'zh-CN and en-US real-route viewport and state matrix'],
});
