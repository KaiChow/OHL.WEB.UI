import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const PROFIT_REVIEW_SPEC = definePesdpPageSpec({
  id: 'order-profit-review-workbench',
  target: 'strong-internal-product',
  archetype: 'list-workbench',
  list: {
    frame: 'standard-list-v1', profile: 'operations-workbench', commandSurface: 'workbench', tableTop: 'context-cap', selection: 'batch', workScope: 'none', statusQueues: 'required',
    views: { pageMode: 'none', pageModeCount: 0, status: 'tabs', statusCount: 5, statusOverflow: 'none' },
  },
  business: {
    object: 'order-profit-review', primaryUser: 'profit-reviewer', userJob: 'prioritize-review-and-submit-profit-risks', primaryIdentity: ['orderNo'], keyState: ['reviewStatus', 'riskLevel'], mainWorkingData: ['customer', 'owner', 'amount', 'grossMarginRate', 'riskItems'], supportingData: ['updatedAt'],
  },
  pesdp: {
    professional: { decisions: ['Use order-profit vocabulary, review status, risk level, margin, and owned risk items.'], acceptance: ['The table makes order identity, risk, review status, amount, margin, owner, and update time scannable.'] },
    efficient: { decisions: ['Keep five daily locate conditions and five review queues directly reachable.'], acceptance: ['Query and status changes reset pagination and refresh the current result set without duplicate status filters.'] },
    structured: { decisions: ['The command surface owns query, export, and conditional batch submit; the table cap owns refresh, selection context, and pagination.'], acceptance: ['Business actions never appear in the table cap and every count has one owner.'] },
    dense: { decisions: ['Use S1 inline query with five conditions and VXE global mini density.'], acceptance: ['At 1366x768 and 1024x768 the table remains dominant and no command band wraps.'] },
    premium: { decisions: ['Use GI/Arco native surfaces, VXE global appearance, and local mock states rather than a second page skin.'], acceptance: ['Detail/edit drawers, confirm flows, loading, empty, error, and partial-result feedback are reachable without blank demo controls.'] },
  },
  surfaces: [
    { id: 'command', role: 'command', owns: ['query', 'export', 'batch-submit', 'review-queues'], primaryAction: 'profit-review-query', implementation: 'arco' },
    { id: 'reviews', role: 'data', owns: ['table-data', 'selection', 'pagination', 'table-feedback', 'detail', 'edit'], implementation: 'shared-pattern', whyArcoNotEnough: 'The list uses VXE fixed columns, selection, and local table context.' },
  ],
  query: { totalFields: 5, strategy: 's1-inline', visibleFields: ['keyword', 'riskLevel', 'region', 'owner', 'updatedRange'], advancedFields: [] },
  table: { kind: 'workbench', identityColumns: ['orderNo', 'reviewStatus'], decisionColumns: ['riskLevel', 'grossMarginRate', 'owner'], supportingColumns: ['updatedAt'], fixed: ['checkbox', 'orderNo', 'operations'], densityReason: 'Profit review is a repeated operator queue with scan-first rows.' },
  detail: { mode: 'display-first', focus: ['riskItems', 'reviewNote', 'timeline'], milestones: ['entered-review', 'review-submitted', 'review-outcome'] },
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
  verification: ['node scripts/check-spec.js', 'npm run build', 'real-route viewport and state matrix'],
});
