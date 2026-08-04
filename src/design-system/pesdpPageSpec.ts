export type PesdpPageGoal =
  | 'internal-system'
  | 'strong-internal-product'
  | 'customer-facing-product'
  | 'sellable-saas-grade';

export type PesdpListArchetype =
  | 'list-query'
  | 'list-management'
  | 'list-workbench';

export type PesdpPageArchetype =
  | PesdpListArchetype
  | 'object-detail'
  | 'focused-overlay'
  | 'full-page-form'
  | 'master-detail'
  | 'dashboard';

export type PesdpListProfile =
  | 'simple-query'
  | 'management'
  | 'operations-workbench';

export type PesdpQueryFieldWidthRole =
  | 'compact'
  | 'standard'
  | 'wide'
  | 'composite'
  | 'range'
  | 'batch';

export interface PesdpQueryFieldLayout {
  field: string;
  width: PesdpQueryFieldWidthRole;
}

export interface PesdpListSpec {
  frame: 'standard-list-v1';
  profile: PesdpListProfile;
  commandSurface: 'none' | 'compact' | 'workbench';
  tableTop: 'none' | 'utility-cap' | 'workbench-toolbar';
  selection: 'none' | 'conditional' | 'batch';
  workScope: 'none' | 'conditional' | 'required';
  statusQueues: 'none' | 'conditional' | 'required';
  views: {
    pageMode: 'none' | 'segmented' | 'tabs' | 'select';
    pageModeCount: number;
    workflowState: 'none' | 'line-tabs' | 'select';
    workflowStateCount: number;
    workflowStatePlacement: 'none' | 'query-row' | 'workflow-row' | 'dedicated-row';
    workflowStateOverflow: 'none' | 'local-scroll';
  };
}

export type NonEmptyStrings = readonly [string, ...string[]];

export interface PesdpTrace {
  decisions: NonEmptyStrings;
  acceptance: NonEmptyStrings;
}

export interface PesdpSurfaceSpec {
  id: string;
  role: 'identity' | 'command' | 'workflow' | 'data' | 'detail' | 'supporting' | 'feedback';
  owns: NonEmptyStrings;
  primaryAction?: string;
  implementation: 'arco' | 'token' | 'shared-pattern' | 'page-local';
  whyArcoNotEnough?: string;
}

export interface PesdpActionSpec {
  id: string;
  scope: string;
  frequency: 'daily' | 'regular' | 'rare';
  risk: 'low' | 'medium' | 'high';
  presentation: 'primary' | 'secondary' | 'outline' | 'text' | 'dropdown' | 'row-action';
  contract: string;
  successOwner: string;
  failureOwner: string;
}

export type PesdpMetricKind = 'count' | 'quantity' | 'amount' | 'progress' | 'exception' | 'status-breakdown';

export interface PesdpMetricSpec {
  id: string;
  kind: PesdpMetricKind;
  source: 'api' | 'derived' | 'local-state';
  aggregation: 'none' | 'count' | 'sum' | 'ratio' | 'breakdown';
  format: 'number' | 'unit' | 'currency' | 'percent' | 'status';
  placement: 'page-facts' | 'module-summary' | 'child-head' | 'table-cap';
}

export type PesdpModuleChildrenSpec =
  | { kind: 'none' }
  | {
    kind: 'repeated';
    identity: NonEmptyStrings;
    body: NonEmptyStrings;
    metrics: readonly PesdpMetricSpec[];
    actions: {
      child: readonly string[];
      table: readonly string[];
      row: readonly string[];
    };
    defaultOpen: 'first' | 'first-and-error' | 'current-and-error' | 'none';
    table: 'none' | 'detail-editable' | 'detail-readonly';
  };

export interface PesdpModuleSpec {
  id: string;
  kind: 'field-group' | 'line-table' | 'parent-child' | 'document-checklist' | 'activity-log' | 'timeline' | 'exception';
  priority: 'core' | 'supporting' | 'audit';
  mode: 'display' | 'edit' | 'mixed' | 'row-edit' | 'read-only';
  owns: NonEmptyStrings;
  metrics: readonly PesdpMetricSpec[];
  actions: {
    module: readonly string[];
    table: readonly string[];
    row: readonly string[];
  };
  collapse: 'always-open' | 'open-first' | 'open-current-and-errors' | 'collapsed-by-default';
  children: PesdpModuleChildrenSpec;
}

export interface PesdpDetailWorkspaceSpec {
  archetype: 'operational-workspace' | 'reference-workspace' | 'review-workspace';
  identityBand: {
    identity: NonEmptyStrings;
    keyFacts: NonEmptyStrings;
    decision: readonly string[];
    actionOwner: 'header' | 'page-footer' | 'drawer-footer' | 'none';
  };
  navigation: {
    mode: 'none' | 'conditional-section-index';
    itemState: 'active-only' | 'contract-derived';
  };
  usability: {
    identify: NonEmptyStrings;
    locateIssue: NonEmptyStrings;
    completeFrequentAction: NonEmptyStrings;
  };
}

export type PesdpDetailSpec =
  | { mode: 'none'; focus: readonly string[]; milestones: readonly string[] }
  | {
    mode: 'display-first' | 'edit-first' | 'staged-form';
    focus: readonly string[];
    milestones: readonly string[];
    workspace: PesdpDetailWorkspaceSpec;
    scroll: {
      verticalOwner: 'page' | 'drawer-body' | 'overlay-body';
      horizontalOverflow: 'table-only';
      stickyActionOwner: 'none' | 'page-footer' | 'drawer-footer';
    };
    modules: readonly [PesdpModuleSpec, ...PesdpModuleSpec[]];
  };

interface PesdpPageSpecBase {
  id: string;
  target: PesdpPageGoal;
  input: {
    path: 'artifact' | 'requirement';
    artifacts: readonly string[];
    unresolvedBusinessDecisions: readonly string[];
    recommendations: readonly string[];
  };
  business: {
    object: string;
    primaryUser: string;
    userJob: string;
    primaryIdentity: NonEmptyStrings;
    keyState: NonEmptyStrings;
    mainWorkingData: NonEmptyStrings;
    supportingData: readonly string[];
  };
  pesdp: {
    professional: PesdpTrace;
    efficient: PesdpTrace;
    structured: PesdpTrace;
    dense: PesdpTrace;
    premium: PesdpTrace;
  };
  surfaces: readonly [PesdpSurfaceSpec, ...PesdpSurfaceSpec[]];
  query: {
    totalFields: number;
    strategy: 'none' | 's1-inline' | 's2-expand' | 's3-drawer' | 's4-drawer-fallback' | 's4-workspace';
    layout: 'none' | 'semantic-grid-v1';
    visibleFields: readonly string[];
    visibleFieldLayout: readonly PesdpQueryFieldLayout[];
    advancedFields: readonly string[];
  };
  table: {
    kind: 'none' | 'query-list' | 'management-list' | 'workbench' | 'detail-editable' | 'detail-readonly' | 'summary';
    rowBanding: 'striped' | 'plain';
    identityColumns: readonly string[];
    decisionColumns: readonly string[];
    supportingColumns: readonly string[];
    compositeColumns?: readonly string[];
    fixed?: readonly string[];
    densityReason?: string;
  };
  detail: PesdpDetailSpec;
  actions: readonly [PesdpActionSpec, ...PesdpActionSpec[]];
  states: NonEmptyStrings;
  responsive: {
    release: readonly ['1366x768', ...string[]];
    split: '1024x768';
    wide: string;
  };
  accessibility: {
    keyboard: NonEmptyStrings;
    naming: NonEmptyStrings;
    zoom: '200%';
  };
  authorities: NonEmptyStrings;
  verification: NonEmptyStrings;
}

export type PesdpPageSpec = PesdpPageSpecBase & (
  {
    archetype: PesdpListArchetype;
    list: PesdpListSpec;
  }
  | {
    archetype: Exclude<PesdpPageArchetype, PesdpListArchetype>;
    list?: never;
  }
);

export function definePesdpPageSpec<const T extends PesdpPageSpec>(spec: T): T {
  return spec;
}
