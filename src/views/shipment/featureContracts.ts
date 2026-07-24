import type { OrderStatusKey } from './orderWorkbench/types';
import { defineFeatureContracts } from '../../design-system/featureContract';

export type ShipmentUiScenario =
  | 'normal'
  | 'loading'
  | 'slow'
  | 'empty'
  | 'error'
  | 'permission'
  | 'partial'
  | 'long'
  | 'extreme';

export interface ShipmentStatusTransition {
  value: OrderStatusKey;
  label: string;
  tone: 'acc' | 'op' | 'wait' | 'rel';
}

const SUPPORTED_UI_SCENARIOS = new Set<ShipmentUiScenario>([
  'normal',
  'loading',
  'slow',
  'empty',
  'error',
  'permission',
  'partial',
  'long',
  'extreme',
]);

const TRANSITIONS: Partial<Record<OrderStatusKey, ShipmentStatusTransition[]>> = {
  draft: [{ value: 'waitBooking', label: '待订舱', tone: 'wait' }],
  waitBooking: [{ value: 'booking', label: '订舱中', tone: 'op' }],
  booking: [{ value: 'released', label: '已放舱', tone: 'acc' }],
  released: [
    { value: 'waitTruck', label: '待拖车', tone: 'wait' },
    { value: 'waitCustoms', label: '待报关', tone: 'wait' },
  ],
  waitTruck: [{ value: 'trucking', label: '拖车中', tone: 'op' }],
  trucking: [{ value: 'waitCustoms', label: '待报关', tone: 'wait' }],
  waitCustoms: [{ value: 'customs', label: '报关中', tone: 'op' }],
  customs: [{ value: 'cleared', label: '已放行', tone: 'acc' }],
  cleared: [{ value: 'waitSail', label: '待开船', tone: 'wait' }],
  waitSail: [{ value: 'sailed', label: '已开船', tone: 'rel' }],
  sailed: [{ value: 'inTransit', label: '运输中', tone: 'op' }],
  inTransit: [{ value: 'arrived', label: '已到港', tone: 'acc' }],
  arrived: [{ value: 'completed', label: '已完成', tone: 'rel' }],
  clearing: [{ value: 'delivering', label: '派送中', tone: 'op' }],
  delivering: [{ value: 'signed', label: '已签收', tone: 'acc' }],
  signed: [{ value: 'completed', label: '已完成', tone: 'rel' }],
};

export const SHIPMENT_FEATURE_CONTRACTS = defineFeatureContracts([
  {
    id: 'export-order-create',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'actor has export-order create permission',
    enabledWhen: 'no create navigation or draft initialization is in flight',
    request: 'initialize a new sea-export order draft, then open the full-page create workspace with its stable draft id',
    successResult: 'show the create workspace in draft mode and preserve the originating list context for return',
    errorResult: 'stay on the workbench, keep filters and selection, and show the draft-initialization failure beside the create command',
    refreshScope: 'no list refresh until the draft is saved; refresh queues and the first page after successful creation',
  },
  {
    id: 'export-order-open-detail',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'actor can read the row and the order has a stable id',
    enabledWhen: 'the row is not being removed and no conflicting navigation is active',
    request: 'load summary data into the context-preserving detail drawer; full detail navigation reuses the same order id and active tab',
    successResult: 'retain workbench query, queue, page, scroll, and selection context while showing the selected order',
    errorResult: 'keep the workbench context and localize the load/retry state to the drawer or detail surface',
    refreshScope: 'selected order detail only; refresh the workbench row after a successful mutation',
  },
  {
    id: 'export-order-query',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'actor has export-order read permission',
    enabledWhen: 'page is not loading and query values are valid',
    request: 'GET /shipment/export-orders with visible and advanced conditions plus queue key',
    successResult: 'replace the workbench result set and preserve applied-condition feedback',
    errorResult: 'keep conditions, render a table-local error state, and expose retry',
    refreshScope: 'result table, queue counts, pagination, and selected rows',
  },
  {
    id: 'export-order-scheme',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'query workbench is visible',
    enabledWhen: 'scheme name is unique; shared owner additionally requires shared-store service and permission',
    request: 'persist a versioned personal snapshot; keep shared owner hidden until the shared-store service is available',
    successResult: 'activate the saved scheme and update default/reset semantics',
    errorResult: 'keep the modal open and preserve the entered name and owner',
    refreshScope: 'scheme menu and active condition snapshot only',
  },
  {
    id: 'export-order-column-preferences',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'export-order workbench table is visible',
    enabledWhen: 'table instance is ready and at least eight business columns remain selected',
    request: 'persist a versioned visible-field list in local workspace storage; no backend request',
    successResult: 'close the modal, show success feedback, and apply the selected VXE columns immediately',
    errorResult: 'keep the modal open, preserve the draft selection, and show a specific readiness or selection error',
    refreshScope: 'workbench table column visibility and horizontal layout only',
  },
  {
    id: 'export-order-detail-edit-session',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'actor can edit the shipment order and the detail workspace is in display mode',
    enabledWhen: 'no detail row is being edited and no object save request is in flight',
    request: 'PUT the changed shipment-owned fields with stable order id and current revision',
    successResult: 'return to display mode, retain the active tab, and show the saved business values immediately',
    errorResult: 'keep editing mode and all entered values; localize field errors and expose retry on the save action',
    refreshScope: 'detail identity, active business sections, affected list row, queue counts, and audit log',
  },
  {
    id: 'export-order-status-transition',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'order is active and actor has transition permission',
    enabledWhen: 'target is a legal next state and reason is present',
    request: 'POST status transition with order id, current revision, target, reason, and side-effect flags',
    successResult: 'update status text/tone, append audit node, and refresh affected queues',
    errorResult: 'keep modal or row edit open and localize business rejection to the target/reason field',
    refreshScope: 'current record, affected queue counts, workbench row, and audit log',
  },
  {
    id: 'export-order-batch-action',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'at least one selected row supports the action',
    enabledWhen: 'selection is non-empty and no request for the same action is in flight',
    request: 'POST selected stable ids and action payload with an idempotency key',
    successResult: 'show success count, clear successful selection, and refresh affected rows',
    errorResult: 'show failed count and stable row identifiers beside the table; keep failed rows selected',
    refreshScope: 'affected rows, selection context, queue counts, and partial-failure summary',
  },
] as const);

export const resolveShipmentUiScenario = (value: unknown): ShipmentUiScenario => {
  if (typeof value !== 'string') return 'normal';
  return SUPPORTED_UI_SCENARIOS.has(value as ShipmentUiScenario)
    ? value as ShipmentUiScenario
    : 'normal';
};

export const getOrderStatusTransitions = (status: string): ShipmentStatusTransition[] =>
  TRANSITIONS[status as OrderStatusKey] ?? [];
