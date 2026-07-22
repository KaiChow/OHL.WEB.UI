export type PesdpPageGoal =
  | 'internal-system'
  | 'strong-internal-product'
  | 'customer-facing-product'
  | 'sellable-saas-grade';

export type PesdpPageArchetype =
  | 'list-workbench'
  | 'object-detail'
  | 'focused-overlay'
  | 'full-page-form'
  | 'master-detail'
  | 'dashboard';

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

export interface PesdpPageSpec {
  id: string;
  target: PesdpPageGoal;
  archetype: PesdpPageArchetype;
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
    strategy: 'none' | 's1-inline' | 's2-expand' | 's3-drawer' | 's4-workspace';
    visibleFields: readonly string[];
    advancedFields: readonly string[];
    savedSchemes?: boolean;
  };
  table: {
    kind: 'none' | 'workbench' | 'detail-editable' | 'detail-readonly' | 'summary';
    identityColumns: readonly string[];
    decisionColumns: readonly string[];
    supportingColumns: readonly string[];
    compositeColumns?: readonly string[];
    fixed?: readonly string[];
    densityReason?: string;
  };
  detail: {
    mode: 'none' | 'display-first' | 'edit-first' | 'staged-form';
    focus: readonly string[];
    milestones: readonly string[];
  };
  actions: readonly [PesdpActionSpec, ...PesdpActionSpec[]];
  states: NonEmptyStrings;
  responsive: {
    release: readonly ['1366x768', ...string[]];
    split: '1024x768';
    wide: string;
  };
  authorities: NonEmptyStrings;
  verification: NonEmptyStrings;
}

export function definePesdpPageSpec<const T extends PesdpPageSpec>(spec: T): T {
  return spec;
}
