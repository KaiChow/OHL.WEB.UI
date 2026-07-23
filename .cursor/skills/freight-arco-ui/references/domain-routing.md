# Domain Routing

Use this only for a new menu or uncertain page type. Choose from business object + user job; domains never get separate CSS themes.

## Route To One Primary Page Authority

| User job / object shape | Primary authority | Add when needed |
| --- | --- | --- |
| Scan or operate many records | `list-page.md` | `filter-layout.md`, `table.md`, `detail-form.md` |
| Inspect one record without losing list context | `detail-form.md` | `table.md`, `upload.md`, `feedback.md` |
| Create/edit a full object as the route task | `full-page-form.md` | `form-rules.md`, `upload.md` |
| Configure dictionaries, organizations, routes, carriers, warehouses | `master-data.md` | `permissions.md`, `detail-form.md` |
| Configure roles, menus, or data scope | `permissions.md` | `master-data.md` |
| Analyze KPI/trends with drill-down | `dashboard.md` | `table.md`, `feedback.md` |
| Complete one narrow decision or small form | `modal.md` | `overlay-dimensions.md`, `feature-delivery-contract.md` |

## Domain Mapping

| Business area | Object/job emphasis | Route |
| --- | --- | --- |
| Export/order operations | order identity, queue, state, next action | workbench + detail |
| Client ordering | draft, required core fields, repeated owned entities | full-page form |
| CRM | customer/contact identity, follow-up job | workbench + detail |
| Rates | rate line, validity, comparison/configuration | workbench + master data |
| Warehouse | warehouse/location scope, scan, quantity, exception | workbench + detail |
| Finance/reconciliation | date/scope, currency, amounts, batch, audit trail | workbench + detail |
| Base information/system settings | effective state, configuration, last update | master data |
| Users/organization/permissions | hierarchy, role, menu, data scope | master data or permissions |
| Documents/notifications | document/notification identity, status, focused action | workbench + upload or modal |
| BI/reporting | time/scope, limited KPI, question-led chart, drill-down | dashboard |
| Administration/HR | current object and approve/create job | workbench + full-page form or detail |

Finance amounts must show currency, use right alignment/tabular numbers, and confirm irreversible batch work. Warehouse quantity/location are primary data; shortage/difference uses semantic status, never row coloring.

## Selection Rules

1. Fill `module-patterns.md` slots and `domain-language.md` object terms first.
2. Select one primary page authority from the first table; add only surfaces present in the task.
3. Preserve list context with detail/overlay when the task is focused; use a route only for genuinely full-page work.
4. Never copy shipment columns, milestones, or hero structures into another domain.
5. Do not use `a-table` or invent a layout class when a proven shared role already fits.
6. Finish with `checklist.md` and `node scripts/check-spec.js`.
