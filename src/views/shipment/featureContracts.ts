import type { OrderStatusKey } from './orderWorkbench/types';
import { defineFeatureContracts } from '@/design-system/featureContract';

export type ShipmentUiScenario =
  | 'normal'
  | 'loading'
  | 'slow'
  | 'empty'
  | 'error'
  | 'permission'
  | 'partial'
  | 'long'
  | 'extreme'
  | 'validation'
  | 'locked';

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
  'validation',
  'locked',
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
    id: 'export-order-query-preferences',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'export-order query surface is visible',
    enabledWhen: 'the query field catalog is available and no preference save is in flight',
    request: 'persist a versioned ordered partition of stable query-field ids into page and drawer locations in local workspace storage; no query request',
    successResult: 'close the settings drawer and apply the page and drawer order immediately without changing query values, pagination, or selection',
    errorResult: 'keep the settings drawer open, retain the draft placement, and show a specific save failure',
    refreshScope: 'query field placement and order only',
  },
  {
    id: 'export-order-column-preferences',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'export-order workbench table is visible',
    enabledWhen: 'table instance is ready and at least eight business columns remain selected',
    request: 'persist a versioned visible-field list plus movable business-column order in local workspace storage; no backend request',
    successResult: 'close the anchored column panel, show success feedback, and apply the selected VXE column visibility and order immediately',
    errorResult: 'keep the column panel open, preserve the draft selection, and show a specific readiness or selection error',
    refreshScope: 'workbench table column visibility, order, and horizontal layout only',
  },
  {
    id: 'export-order-assign-self',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'order is readable and actor has assignment permission',
    enabledWhen: 'the row is not carrying another mutation',
    request: 'assign the current order to the signed-in operator using its stable id and revision',
    successResult: 'update the row owner and keep the current query, queue, page, and horizontal position',
    errorResult: 'keep the previous owner and expose a row-owned retryable assignment error',
    refreshScope: 'current workbench row only',
  },
  {
    id: 'export-order-generate-fee',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'order is readable and actor has fee-maintenance permission',
    enabledWhen: 'the row is not carrying another mutation',
    request: 'create pending fee lines for the current order using its stable id and revision',
    successResult: 'update the row fee state and retain the current list context',
    errorResult: 'keep the previous fee state and expose a row-owned retryable fee error',
    refreshScope: 'current workbench row fee state only',
  },
  {
    id: 'export-order-notify',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'order is readable and actor has notification permission',
    enabledWhen: 'the row is not carrying another mutation',
    request: 'send the configured order progress notification for the current stable order id',
    successResult: 'confirm the notification result without changing list position or selection',
    errorResult: 'keep the row unchanged and expose a retryable notification error',
    refreshScope: 'no list refresh; notification result only',
  },
  {
    id: 'export-order-void',
    actorRoles: ['shipment.manager'],
    visibleWhen: 'order is active and actor has void permission',
    enabledWhen: 'the current revision still permits voiding and no row mutation is pending',
    request: 'void the current order after explicit confirmation using its stable id, revision, and audit reason',
    successResult: 'mark the row voided, update affected queues, and retain the current list context',
    errorResult: 'keep the confirmation open, preserve the row, and expose a retryable business error',
    refreshScope: 'current row and affected queue counts',
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
    enabledWhen: 'selection is non-empty and no request carrying the same idempotency key is in flight; repeated clicks while pending are intercepted',
    request: 'POST selected stable ids and action payload with a generated idempotency key cached for the in-flight window; before execution, ineligible rows are listed with reasons and only continue after the actor confirms skipping them',
    successResult: 'show success count, clear successful selection, and refresh affected rows',
    errorResult: 'show failed count and stable row identifiers beside the table with a session-downloadable CSV failure detail (order no + reason); keep failed rows selected',
    refreshScope: 'affected rows, selection context, queue counts, and partial-failure summary',
  },
  {
    id: 'export-order-exception-create',
    actorRoles: ['shipment.operator', 'shipment.cs', 'shipment.document', 'shipment.manager'],
    visibleWhen: 'actor has exception-report permission and the order is not cancelled',
    enabledWhen: 'exception description is present and no exception-create request for the same order is in flight; duplicate submits are intercepted while pending',
    request: 'POST exception payload (type, level, description, owner, expected resolve time, notify-supervisor flag) with order id and current revision',
    successResult: 'close the modal, mark the order exception as open, surface the risk flag on the row, and add the order to the exception queue',
    errorResult: 'keep the modal open with every entered value preserved; localize field errors to their fields and expose retry on the confirm action',
    refreshScope: 'current row exception status and risk flags, exception queue count, and audit log',
  },
  {
    id: 'export-order-duplicate',
    actorRoles: ['shipment.operator', 'shipment.manager'],
    visibleWhen: 'actor has export-order create permission and the source order is readable',
    enabledWhen: 'no duplicate request for the same source order is in flight',
    request: 'create a local draft copy with a newly generated order number derived from the source order',
    successResult: 'insert the copied row next to the source in the workbench and show the new order number',
    errorResult: 'keep the workbench unchanged and show the copy failure beside the row action',
    refreshScope: 'workbench rows and queue counts only',
  },
  {
    id: 'export-order-export',
    actorRoles: ['shipment.viewer', 'shipment.operator', 'shipment.manager'],
    visibleWhen: 'actor has export-order read permission and the result set is not in an error state',
    enabledWhen: 'no export download is being prepared',
    request: 'when both a selection and active filters exist, ask the actor to choose exporting the N selected rows or the full filtered set, then generate the CSV client-side',
    successResult: 'download the CSV with the PRD main columns and show the exported row count',
    errorResult: 'keep the scope modal open and show the failure beside the export command',
    refreshScope: 'no data refresh; download artifact only',
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
