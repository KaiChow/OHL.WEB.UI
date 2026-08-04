import { definePesdpPageSpec } from '../../../design-system/pesdpPageSpec';

export const DETAIL_MODULES_SPEC = definePesdpPageSpec({
  id: 'ui-acceptance-complex-detail-modules',
  target: 'sellable-saas-grade',
  archetype: 'object-detail',
  input: {
    path: 'artifact',
    artifacts: ['user-provided legacy freight-detail screenshot and iterative business-layout feedback'],
    unresolvedBusinessDecisions: ['production API, permission source, legal workflow transitions, document upload service, and authoritative metric source'],
    recommendations: ['keep this route at local L2 acceptance and require production contracts before wiring requests or claiming L3 delivery'],
  },
  business: {
    object: 'sea-export-shipment-working-draft',
    primaryUser: 'shipment-operator',
    userJob: 'continuously-maintain-parties-cargo-and-containers-while-referencing-documents-and-audit-context',
    primaryIdentity: ['orderNo', 'serviceType'],
    keyState: ['orderStatus', 'currentRisk', 'nextAction'],
    mainWorkingData: ['route', 'schedule', 'parties', 'cargoLines', 'containers', 'documents'],
    supportingData: ['owner', 'updatedAt', 'activity'],
  },
  pesdp: {
    professional: {
      decisions: ['Translate the legacy screenshot into an object workspace with explicit identity, state, next work, module ownership, and bounded parent-child structure.'],
      acceptance: ['The first viewport identifies the shipment, risk, next action, and module navigation without copying the screenshot field wall.'],
    },
    efficient: {
      decisions: ['Default the maintenance workspace to editing, keep core edit modules open, keep support/audit modules read-only, and place actions at page/module/child/table/row ownership.'],
      acceptance: ['Users land directly in editable core data and can reach module, child, line, reset, and save actions without a page-level mode switch or unrelated overlays.'],
    },
    structured: {
      decisions: ['Use one continuous record-editor canvas with page -> module -> child -> child-owned pane/table as the maximum depth; each module kind owns a distinct internal composition.'],
      acceptance: ['Identity, form sections, parent-child lines, supporting documents, audit, and commit actions read as one hierarchy rather than assembled cards or a secondary navigation workspace.'],
    },
    dense: {
      decisions: ['Use one page-body vertical scroll owner, compact module rhythm, Arco small forms, VXE small detail tables, and table-only horizontal overflow.'],
      acceptance: ['At 1024, 1366, and 1920 widths, module commands remain adjacent to their owners, detail rows remain readable, and the page does not gain a second vertical scrollbar.'],
    },
    premium: {
      decisions: ['Use a strong object decision band, a quiet anchored workspace, restrained semantic status, and stable shared detail primitives without page-local component skins.'],
      acceptance: ['Default-edit and view states, long data, destructive confirmation, save feedback, bilingual labels, and 200% zoom retain a clear primary/secondary hierarchy.'],
    },
  },
  surfaces: [
    { id: 'detail-identity', role: 'identity', owns: ['identity', 'status', 'risk', 'next-action'], implementation: 'arco' },
    { id: 'detail-workspace', role: 'detail', owns: ['business-modules', 'module-feedback'], implementation: 'shared-pattern', whyArcoNotEnough: 'Arco provides controls but not bounded business-module, metric-ownership, and parent-child composition semantics.' },
    { id: 'detail-footer', role: 'command', owns: ['save', 'cancel', 'save-feedback'], primaryAction: 'detail-workspace-save', implementation: 'arco' },
  ],
  query: { totalFields: 0, strategy: 'none', layout: 'none', visibleFields: [], visibleFieldLayout: [], advancedFields: [] },
  table: {
    kind: 'detail-editable',
    identityColumns: ['cargoName', 'containerNo', 'documentName'],
    decisionColumns: ['quantity', 'grossWeight', 'volume', 'documentStatus'],
    supportingColumns: ['packageType', 'sealNo', 'updatedAt'],
    fixed: ['operations'],
    densityReason: 'Child lines contain mini controls and need small detail rows; document and audit modules remain read-only.',
  },
  detail: {
    mode: 'edit-first',
    focus: ['currentRisk', 'nextAction', 'cargo-parties', 'containers', 'documents'],
    milestones: [],
    scroll: { verticalOwner: 'page', horizontalOverflow: 'table-only', stickyActionOwner: 'page-footer' },
    modules: [
    { id: 'shipment-overview', kind: 'field-group', priority: 'core', mode: 'edit', owns: ['serviceType', 'customer', 'route', 'schedule', 'owner'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      {
        id: 'cargo-parties', kind: 'parent-child', priority: 'core', mode: 'edit', owns: ['partyIdentity', 'partyContacts', 'cargoLines'],
        metrics: [
          { id: 'cargo-party-count', kind: 'count', source: 'local-state', aggregation: 'count', format: 'number', placement: 'module-summary' },
          { id: 'cargo-total-weight', kind: 'quantity', source: 'derived', aggregation: 'sum', format: 'unit', placement: 'module-summary' },
          { id: 'cargo-total-volume', kind: 'quantity', source: 'derived', aggregation: 'sum', format: 'unit', placement: 'module-summary' },
        ],
        actions: { module: ['detail-cargo-add-party'], table: [], row: [] }, collapse: 'always-open',
        children: {
          kind: 'repeated', identity: ['partyName', 'partyRole'], body: ['partyAddress', 'contactName', 'contactPhone'],
          metrics: [
            { id: 'cargo-child-line-count', kind: 'count', source: 'derived', aggregation: 'count', format: 'number', placement: 'child-head' },
            { id: 'cargo-child-weight', kind: 'quantity', source: 'derived', aggregation: 'sum', format: 'unit', placement: 'child-head' },
          ],
          actions: { child: ['detail-cargo-duplicate-party', 'detail-cargo-remove-party'], table: ['detail-cargo-add-line'], row: ['detail-cargo-remove-line'] },
          defaultOpen: 'first-and-error', table: 'detail-editable',
        },
      },
      {
        id: 'containers', kind: 'line-table', priority: 'core', mode: 'row-edit', owns: ['containerNo', 'containerType', 'sealNo', 'packageCount', 'weight', 'volume'],
        metrics: [{ id: 'container-count', kind: 'count', source: 'local-state', aggregation: 'count', format: 'number', placement: 'table-cap' }],
        actions: { module: [], table: ['detail-container-add'], row: ['detail-container-remove'] }, collapse: 'always-open', children: { kind: 'none' },
      },
      {
        id: 'documents', kind: 'document-checklist', priority: 'supporting', mode: 'read-only', owns: ['documentName', 'documentStatus', 'owner', 'updatedAt'],
        metrics: [],
        actions: { module: [], table: [], row: [] }, collapse: 'open-current-and-errors', children: { kind: 'none' },
      },
      { id: 'activity', kind: 'timeline', priority: 'audit', mode: 'read-only', owns: ['actor', 'event', 'occurredAt'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'collapsed-by-default', children: { kind: 'none' } },
    ],
  },
  actions: [
    { id: 'detail-workspace-save', scope: 'page-footer', frequency: 'daily', risk: 'medium', presentation: 'primary', contract: 'detail-workspace-save', successOwner: 'detail-footer', failureOwner: 'detail-footer' },
    { id: 'detail-cargo-add-party', scope: 'module:cargo-parties', frequency: 'regular', risk: 'low', presentation: 'secondary', contract: 'detail-cargo-add-party', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
    { id: 'detail-cargo-duplicate-party', scope: 'child:cargo-party', frequency: 'regular', risk: 'low', presentation: 'secondary', contract: 'detail-cargo-duplicate-party', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
    { id: 'detail-cargo-remove-party', scope: 'child:cargo-party', frequency: 'rare', risk: 'high', presentation: 'dropdown', contract: 'detail-cargo-remove-party', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
    { id: 'detail-cargo-add-line', scope: 'table:cargo-lines', frequency: 'regular', risk: 'low', presentation: 'secondary', contract: 'detail-cargo-add-line', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
    { id: 'detail-cargo-remove-line', scope: 'row:cargo-line', frequency: 'rare', risk: 'high', presentation: 'row-action', contract: 'detail-cargo-remove-line', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
    { id: 'detail-container-add', scope: 'table:containers', frequency: 'regular', risk: 'low', presentation: 'secondary', contract: 'detail-container-add', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
    { id: 'detail-container-remove', scope: 'row:container', frequency: 'rare', risk: 'high', presentation: 'row-action', contract: 'detail-container-remove', successOwner: 'detail-workspace', failureOwner: 'detail-workspace' },
  ],
  states: ['loading', 'empty', 'no-permission', 'validation-error', 'network-error', 'success'],
  responsive: { release: ['1366x768', '1280x720'], split: '1024x768', wide: '1920x1080' },
  accessibility: {
    keyboard: ['Reach editable fields, module actions, child actions, editable rows, confirmations, reset, and the sticky save action in hierarchy order.'],
    naming: ['Every collapse, overflow, and icon-only module command names its owned business object.'],
    zoom: '200%',
  },
  authorities: ['detail-form.md', 'module-patterns.md', 'form-field.md', 'table.md', 'actions.md', 'feedback.md', 'responsive.md', 'typography.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'real route in zh-CN and en-US at 1024x768, 1366x768, 1920x1080, and 200% zoom'],
});
