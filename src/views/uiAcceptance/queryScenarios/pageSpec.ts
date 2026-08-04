import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const QUERY_SCENARIO_SPEC = definePesdpPageSpec({
  id: 'ui-acceptance-query-scenarios',
  target: 'internal-system',
  archetype: 'list-management',
  input: {
    path: 'artifact',
    artifacts: ['user-provided query-layout screenshots and iterative acceptance feedback'],
    unresolvedBusinessDecisions: ['saved-query persistence, sharing, permissions, and backend batch-value limits'],
    recommendations: ['keep saved-query behavior outside L2 acceptance until its persistence and permission contracts are proven'],
  },
  list: {
    frame: 'standard-list-v1',
    profile: 'management',
    commandSurface: 'compact',
    tableTop: 'utility-cap',
    selection: 'none',
    workScope: 'none',
    statusQueues: 'none',
    views: {
      pageMode: 'select',
      pageModeCount: 7,
      workflowState: 'none',
      workflowStateCount: 0,
      workflowStatePlacement: 'none',
      workflowStateOverflow: 'none',
    },
  },
  business: {
    object: 'sea-export-order-query-scenario',
    primaryUser: 'ui-acceptance-reviewer',
    userJob: 'compare-query-layout-boundaries-on-the-same-order-result',
    primaryIdentity: ['orderNo'],
    keyState: ['queryScenario', 'orderStatus'],
    mainWorkingData: ['customerName', 'businessType', 'owner', 'updatedAt'],
    supportingData: ['queryFieldCount'],
  },
  pesdp: {
    professional: {
      decisions: ['Use one sea-export-order result model across seven routed query-count scenarios so layout differences come only from query complexity.'],
      acceptance: ['The menu exposes S0, S1 compact, S1 inline, S2 expand, S3 drawer, S3 wide, and the S4 grouped-drawer fallback as separately addressable routes.'],
    },
    efficient: {
      decisions: ['Keep scenario query, reset, expand, and advanced apply locally executable without inventing saved-view persistence.'],
      acceptance: ['Scenario switching preserves the route and every query action updates the local result context without dead controls.'],
    },
    structured: {
      decisions: ['The route owns one query surface when applicable and one result-owned table surface; S0 removes the query surface and S4 uses a grouped wide drawer until saved-query persistence, sharing, and permissions exist.'],
      acceptance: ['No scenario combines a flat query wall with a drawer, and query actions keep one stable owner.'],
    },
    dense: {
      decisions: ['Use one container-owned semantic-grid-v1 track model: bounded field roles, query actions adjacent to the permanent field cluster, and no left-pinned page-wide cap; reserve localized action width before promoting fields, moving the lowest-priority S2/S3 Narrow field into its existing expand/drawer surface at compact width.', 'Use the shared dense vertical-form rhythm in grouped drawers: 4px label gap, 12px column gap, 8px row gap, and zero form-item margin because the grid owns inter-row spacing.'],
      acceptance: ['At 1024, 1366, 1440, and 1920 widths, role order remains stable; search/reset/expand/filter labels remain visible without clipping in zh-CN and en-US, pagination uses mini density, and the field-to-action gap stays at one shared gutter when S2 expands.', 'In S3 and S4 drawers, a normal single-line field measures 60px internally and adjacent rows have an 8px net gap; Arco default form-item margin never adds a second spacing layer.'],
    },
    premium: {
      decisions: ['Use GI-native Arco controls, grouped native drawers, and the global VXE mini table without page-local skins.'],
      acceptance: ['Every scenario remains readable, contained, and visually comparable without duplicated summaries or decorative cards.'],
    },
  },
  surfaces: [
    { id: 'query-scenario', role: 'command', owns: ['query-mode', 'visible-query', 'expand-query'], primaryAction: 'query-scenario-apply', implementation: 'shared-pattern', whyArcoNotEnough: "Arco's fixed 24-column model cannot preserve bounded semantic field widths while adding wide-desktop capacity." },
    { id: 'advanced-query', role: 'supporting', owns: ['grouped-drawer', 'wide-drawer', 'draft-query'], implementation: 'arco' },
    { id: 'scenario-results', role: 'data', owns: ['table-data', 'pagination', 'total-count'], implementation: 'shared-pattern', whyArcoNotEnough: 'The result comparison uses the project VXE table baseline.' },
  ],
  query: {
    totalFields: 52,
    strategy: 's4-drawer-fallback',
    layout: 'semantic-grid-v1',
    visibleFields: ['keyword', 'customerName', 'businessType'],
    visibleFieldLayout: [
      { field: 'keyword', width: 'composite' },
      { field: 'customerName', width: 'standard' },
      { field: 'businessType', width: 'compact' },
    ],
    advancedFields: [
      'owner', 'orderStatus', 'updatedRange', 'batchValues', 'hblNo', 'mblNo', 'bookingNo', 'containerNo', 'customerReference',
      'pol', 'pod', 'transitPort', 'carrier', 'vesselName', 'voyageNo', 'serviceRoute', 'etdRange', 'etaRange', 'closingRange',
      'customsDeadlineRange', 'truckingDateRange', 'warehouseDateRange', 'createdRange', 'documentOwner', 'customerService', 'salesperson',
      'operationDepartment', 'branch', 'bookingStatus', 'customsStatus', 'truckingStatus', 'documentStatus', 'feeStatus', 'settlementStatus',
      'invoiceStatus', 'exceptionState', 'overdueState', 'currency', 'amountRange', 'grossProfitRange', 'receivableStatus', 'payableStatus',
      'creator', 'updater', 'source', 'tradeTerm', 'transportClause', 'cargoName', 'remarkKeyword',
    ],
  },
  table: {
    kind: 'management-list',
    identityColumns: ['sequence', 'orderNo', 'orderStatus'],
    decisionColumns: ['customerName', 'owner'],
    supportingColumns: ['businessType', 'updatedAt'],
    fixed: ['orderNo'],
    densityReason: 'The same dense result table makes query-surface height and wrap differences directly comparable.',
  },
  detail: { mode: 'none', focus: [], milestones: [] },
  actions: [
    { id: 'query-scenario-apply', scope: 'query', frequency: 'daily', risk: 'low', presentation: 'primary', contract: 'query-scenario-apply', successOwner: 'scenario-results', failureOwner: 'scenario-results' },
  ],
  states: ['loading', 'empty', 'no-permission', 'network-error', 'success'],
  responsive: { release: ['1366x768'], split: '1024x768', wide: '1920x1080' },
  accessibility: {
    keyboard: ['Type or paste one batch value directly; paste multiple non-empty values without confirmation; read normalized values and count; clear committed values directly without opening the editor; then reach the optional editor, scenario controls, query actions, overlays, and pagination in order.'],
    naming: ['Every advanced-filter and saved-query control exposes its scenario-specific accessible name.'],
    zoom: '200%',
  },
  authorities: ['list-page.md', 'filter-layout.md', 'table.md', 'actions.md', 'overlay-dimensions.md', 'feedback.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'zh-CN and en-US scenario routes at 1024x768, 1366x768, 1440x900, and 1920x1080 with query/grid/action rectangles recorded'],
});
