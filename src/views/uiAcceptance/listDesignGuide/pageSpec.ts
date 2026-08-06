import { definePesdpPageSpec } from '@/design-system/pesdpPageSpec';

export const LIST_DESIGN_GUIDE_PAGE_SPEC = definePesdpPageSpec({
  id: 'ui-acceptance-list-design-guide',
  target: 'strong-internal-product',
  archetype: 'object-detail',
  input: {
    path: 'requirement',
    artifacts: ['product requirement to expose the shared list-page design standard inside UI acceptance'],
    unresolvedBusinessDecisions: [],
    recommendations: ['keep implementation examples on real routed pages and update this guide when the executable UI contract changes'],
  },
  business: {
    object: 'list-page-design-standard',
    primaryUser: 'product-designer-frontend-engineer-and-ui-acceptance-reviewer',
    userJob: 'understand-apply-and-verify-the-shared-list-page-design-standard',
    primaryIdentity: ['standardName', 'applicableScope'],
    keyState: ['listArchetype', 'evidenceRequirement'],
    mainWorkingData: ['designPrinciples', 'pageAnatomy', 'queryStrategy', 'actionHierarchy', 'tableContract', 'internationalization', 'acceptanceChecklist'],
    supportingData: ['realRouteExample', 'authorityReferences'],
  },
  pesdp: {
    professional: {
      decisions: ['Explain the standard as business decisions and ownership rules instead of a component gallery or page-specific screenshot annotation.'],
      acceptance: ['A reviewer can explain why a list is query, management, or workbench and identify the owner of every visible zone.'],
    },
    efficient: {
      decisions: ['Order the guide by the decisions made during implementation and provide one direct route to a representative production-style list.'],
      acceptance: ['The page answers archetype, query, toolbar, table, localization, and state questions without opening multiple documents.'],
    },
    structured: {
      decisions: ['Use one reference-workspace identity band followed by continuous unframed sections in implementation order.'],
      acceptance: ['Sections remain distinct through heading, spacing, Arco structure, and dividers without nested cards or decorative rails.'],
    },
    dense: {
      decisions: ['Keep the first viewport focused on principles and archetypes, show the section index only when the canvas is at least 1440px wide, and preserve one page scroll owner.'],
      acceptance: ['At 1024, 1366, and 1920 widths the guide remains readable without browser-level horizontal overflow or oversized empty regions.'],
    },
    premium: {
      decisions: ['Use GI-native Arco components, shared typography tokens, restrained semantic color, and no page-local component skin.'],
      acceptance: ['Chinese and English copy, 200% zoom, keyboard navigation, and the real-route action remain coherent and reachable.'],
    },
  },
  surfaces: [
    { id: 'guide-identity', role: 'identity', owns: ['standard-name', 'scope', 'design-priority', 'real-route-entry'], primaryAction: 'list-design-guide-open-example', implementation: 'arco' },
    { id: 'guide-section-index', role: 'supporting', owns: ['wide-screen-section-navigation'], implementation: 'arco' },
    { id: 'guide-content', role: 'detail', owns: ['principles', 'archetypes', 'page-anatomy', 'query-and-actions', 'table-contract', 'localization-and-responsive', 'acceptance-checklist'], implementation: 'page-local', whyArcoNotEnough: 'Arco supplies the content components, while this route still needs a local continuous-section reading layout and wide-screen index placement.' },
  ],
  query: { totalFields: 0, strategy: 'none', layout: 'none', visibleFields: [], visibleFieldLayout: [], advancedFields: [] },
  table: {
    kind: 'none',
    rowBanding: 'plain',
    identityColumns: [],
    decisionColumns: [],
    supportingColumns: [],
    densityReason: 'The page explains table rules but does not present a data grid; examples remain on real VXE routes.',
  },
  detail: {
    mode: 'display-first',
    focus: ['designPriority', 'listArchetypes', 'pageAnatomy', 'acceptanceChecklist'],
    milestones: [],
    workspace: {
      archetype: 'reference-workspace',
      identityBand: {
        identity: ['standardName', 'applicableScope'],
        keyFacts: ['threeListArchetypes', 'supportedViewports', 'longestLocaleVerification'],
        decision: ['chooseArchetypeBeforeLayout'],
        actionOwner: 'header',
      },
      navigation: { mode: 'conditional-section-index', itemState: 'active-only' },
      usability: {
        identify: ['Identify the design goal, applicable list scope, and priority order from the first viewport.'],
        locateIssue: ['Locate the section that owns a query, action, table, localization, responsive, or state-quality question.'],
        completeFrequentAction: ['Open the export-order workbench and compare its rendered behavior with the stated standard.'],
      },
    },
    scroll: { verticalOwner: 'page', horizontalOverflow: 'table-only', stickyActionOwner: 'none' },
    modules: [
      { id: 'design-principles', kind: 'field-group', priority: 'core', mode: 'read-only', owns: ['priorityOrder', 'designIntent'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'list-archetypes', kind: 'field-group', priority: 'core', mode: 'read-only', owns: ['listQuery', 'listManagement', 'listWorkbench'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'page-anatomy', kind: 'field-group', priority: 'core', mode: 'read-only', owns: ['pageMode', 'query', 'workflow', 'toolbar', 'table', 'feedback'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'query-and-actions', kind: 'field-group', priority: 'core', mode: 'read-only', owns: ['queryScenario', 'semanticWidth', 'actionHierarchy', 'rowActions'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'table-contract', kind: 'field-group', priority: 'core', mode: 'read-only', owns: ['vxeBaseline', 'columnOrder', 'columnWidth', 'columnSettings'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'localization-responsive', kind: 'field-group', priority: 'supporting', mode: 'read-only', owns: ['textExpansion', 'operationWidth', 'horizontalOverflow', 'supportedViewports'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
      { id: 'acceptance-checklist', kind: 'field-group', priority: 'supporting', mode: 'read-only', owns: ['states', 'interaction', 'accessibility', 'realRouteEvidence'], metrics: [], actions: { module: [], table: [], row: [] }, collapse: 'always-open', children: { kind: 'none' } },
    ],
  },
  actions: [
    { id: 'list-design-guide-open-example', scope: 'guide-identity', frequency: 'regular', risk: 'low', presentation: 'outline', contract: 'list-design-guide-open-example', successOwner: 'guide-identity', failureOwner: 'guide-identity' },
  ],
  states: ['loading', 'empty', 'no-permission', 'network-error', 'success', 'navigation-error', 'long-localized-copy'],
  responsive: { release: ['1366x768', '1280x720'], split: '1024x768', wide: '1920x1080' },
  accessibility: {
    keyboard: ['Reach the real-route action and wide-screen section navigation in document order, then read every section in semantic heading order.'],
    naming: ['Every navigation and route action names the section or example it opens.'],
    zoom: '200%',
  },
  authorities: ['arco-first.md', 'list-page.md', 'filter-layout.md', 'table.md', 'actions.md', 'feedback.md', 'responsive.md', 'typography.md', 'detail-form.md', 'module-patterns.md'],
  verification: ['node scripts/check-spec.js', 'npm run build', 'real route in zh-CN and en-US at 1024x768, 1366x768, 1920x1080, and 200% zoom'],
});
