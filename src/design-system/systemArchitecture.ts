export type ArchitectureLayerId = 'runtime' | 'interaction' | 'business' | 'governance';

export type ArchitectureLayerStatus = 'current' | 'target';

export interface ArchitectureDirectoryContract {
  path: string;
  status: ArchitectureLayerStatus;
  owner: string;
  allowed: string;
  prohibited: string;
}

export interface ArchitectureBoundaryContract {
  id: string;
  from: string;
  to: string;
  rule: string;
}

export interface ArchitectureMigrationStage {
  id: string;
  outcome: string;
  evidence: string;
  rollback: string;
}

export interface SystemArchitectureSpec {
  id: string;
  baseline: {
    project: string;
    runtime: string;
    ui: string;
    state: string;
    data: string;
    localization: string;
  };
  layers: Record<ArchitectureLayerId, string>;
  directories: readonly ArchitectureDirectoryContract[];
  boundaries: readonly ArchitectureBoundaryContract[];
  reuse: readonly string[];
  styles: {
    themeOwner: string;
    tokenOwner: string;
    tableOwner: string;
    pageRule: string;
  };
  migrationStages: readonly ArchitectureMigrationStage[];
}

export function defineSystemArchitectureSpec<const T extends SystemArchitectureSpec>(spec: T): T {
  return spec;
}

/**
 * Architecture baseline for the existing OHL.Web repository.
 * It records ownership and migration boundaries; it does not replace business APIs or route contracts.
 * A directory declared `current` must exist in the repository; `target` entries document the approved
 * direction and must never appear in import paths or verification claims (see project-architecture.md).
 */
export const OHL_WEB_ARCHITECTURE_SPEC = defineSystemArchitectureSpec({
  id: 'ohl-web-modernization',
  baseline: {
    project: 'OHL.Web',
    runtime: 'Vue 3 + Composition API + TypeScript + Vite',
    ui: 'Arco Design Vue + VXE Table',
    state: 'Route-local and component state; a store library (Pinia) enters only with its first genuine cross-route consumer',
    data: 'Page-local request helpers with endpoint-shaped signatures plus src/utils/mock-actions.ts behind the same boundary; src/api is the target request layer for the first real backend integration',
    localization: 'src/i18n message bundles with zh-CN, en-US, and additional supported locales',
  },
  layers: {
    runtime: 'Vue runtime, router entry, environment configuration, and application bootstrap.',
    interaction: 'Arco controls and overlays, VXE tables, and shared workbench interaction primitives.',
    business: 'Route pages, feature contracts, request helpers, stores, composables, and domain locale bundles.',
    governance: 'Typed page and architecture contracts, semantic tokens, static checks, build checks, and real-route evidence.',
  },
  directories: [
    { path: 'src/views', status: 'current', owner: 'route composition', allowed: 'page templates, page-local state, colocated pageSpec.ts and featureContracts.ts', prohibited: 'cross-page UI primitives, scattered request wrappers, global theme overrides' },
    { path: 'src/components', status: 'current', owner: 'shared UI capability', allowed: 'typed reusable structure, slots, events, and owned interaction states', prohibited: 'business-specific labels, hidden permissions, default API requests' },
    { path: 'src/layouts', status: 'current', owner: 'application shell', allowed: 'layout frames, navigation chrome, and shell-level slot composition', prohibited: 'page business logic, route data fetching, theme overrides' },
    { path: 'src/router', status: 'current', owner: 'route registry', allowed: 'per-domain route modules, route metadata, and permission context declaration', prohibited: 'page business logic, data fetching, visual rendering' },
    { path: 'src/config', status: 'current', owner: 'navigation configuration', allowed: 'menu, tab, and shell configuration consumed by layouts', prohibited: 'business rules, request logic, page-specific copy' },
    { path: 'src/i18n', status: 'current', owner: 'copy and localization', allowed: 'global and domain message bundles with stable keys', prohibited: 'hard-coded page copy where a locale key is required' },
    { path: 'src/types', status: 'current', owner: 'shared type definitions', allowed: 'cross-feature TypeScript contracts and shared enums', prohibited: 'single-route types that belong colocated with their page' },
    { path: 'src/utils', status: 'current', owner: 'stateless helpers and interim mock boundary', allowed: 'pure helpers, formatters, and mock modules behind endpoint-shaped signatures', prohibited: 'unscoped global side effects, visual rendering, business workflow decisions' },
    { path: 'src/design-system', status: 'current', owner: 'semantic UI contracts', allowed: 'tokens, typed layout/action/table contracts, and shared configuration helpers', prohibited: 'single-route business fields or API behavior' },
    { path: 'src/styles', status: 'current', owner: 'theme and visual baseline', allowed: 'GI aliases, dense tokens, VXE theme variables, framework-neutral semantics', prohibited: 'page-specific skins or framework internals outside the owned theme boundary' },
    { path: 'src/api', status: 'target', owner: 'request boundary', allowed: 'endpoint functions, DTO mapping, transport error normalization', prohibited: 'visual rendering, route navigation, page-local UI state' },
    { path: 'src/store', status: 'target', owner: 'cross-route state', allowed: 'session, permission, and genuinely shared domain state', prohibited: 'temporary form drafts or component-only display state' },
    { path: 'src/composables', status: 'target', owner: 'reusable behavior', allowed: 'typed stateful interaction and lifecycle helpers', prohibited: 'unscoped global side effects or object-specific page markup' },
  ],
  boundaries: [
    { id: 'route-to-view', from: 'router', to: 'views', rule: 'A route selects a page and permission context; it does not contain page business logic.' },
    { id: 'view-to-capability', from: 'views', to: 'components/composables', rule: 'Pages compose typed capabilities and provide business data; shared capabilities do not infer business meaning.' },
    { id: 'view-to-request', from: 'views', to: 'api', rule: 'Requests go through named endpoint functions behind one request boundary; views never call fetch/axios directly, and mocks satisfy the same signatures.' },
    { id: 'action-to-contract', from: 'visible action', to: 'featureContracts', rule: 'Every data, workflow, permission, or result-changing action has one complete contract and one pending owner.' },
    { id: 'style-to-surface', from: 'page/component', to: 'design-system/styles', rule: 'Pages consume tokens and public component props; they do not create a second theme or override framework internals.' },
    { id: 'locale-to-domain', from: 'page/component', to: 'i18n', rule: 'Visible product copy uses stable locale keys and supports the longest legal supported translation.' },
  ],
  reuse: [
    'Arco native structure and public props are the first choice.',
    'Existing shared capability is reused only when role, state owner, props/slots, density, permission, responsive behavior, and scroll owner match.',
    'A second real consumer is the normal extraction threshold; visual similarity alone is not a reuse contract.',
    'Legacy controls enter through typed adapters when their value or event contracts differ; adapters do not copy legacy visual defects.',
    'A shared component must declare its job, owned states, accessibility behavior, Arco gap, and at least one real consumer.',
  ],
  styles: {
    themeOwner: 'GI / Arco theme variables',
    tokenOwner: 'src/styles/global.css semantic --dense-* aliases and dimensions',
    tableOwner: 'src/styles/vxe-theme official --vxe-* variables plus VXE public configuration',
    pageRule: 'Page-local CSS is limited to necessary shell, layout, and overflow; repeated visual behavior is promoted to a shared capability.',
  },
  migrationStages: [
    { id: 'inventory', outcome: 'Route, object, user job, API, store, permission, locale, component, and state inventory', evidence: 'A route migration record with known and unresolved boundaries', rollback: 'No runtime change' },
    { id: 'contract', outcome: 'Typed pageSpec, feature contracts, ownership map, and state matrix for one pilot route', evidence: 'node scripts/check-spec.js passes for the pilot', rollback: 'Pilot remains on the original route implementation' },
    { id: 'capability', outcome: 'Shared query, toolbar, table, overlay, feedback, and adapter capability is proven by a real consumer', evidence: 'Shared component has typed API and route evidence', rollback: 'Consumer can switch back without changing API or permission semantics' },
    { id: 'pilot', outcome: 'One high-frequency route is migrated through the complete interaction and visual gate', evidence: 'Chinese/English, adverse states, target viewports, and 200% evidence', rollback: 'Old route remains available until acceptance is signed off' },
    { id: 'rollout', outcome: 'Domain-by-domain route migration with consumer tracking and legacy retirement', evidence: 'Migration ledger, checks, and release record per route', rollback: 'Legacy capability is removed only after all consumers and fallback paths are verified' },
  ],
});
