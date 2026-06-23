# Detail And Form

## Detail Drawer Structure

Use `class="detail-drawer"` and `:footer="false"` for complex drawers.

Recommended complex detail order:

1. `dds-head`: status, primary number/name, company/context, view tools.
2. `dds-hero`: object-specific core facts.
3. `dds-steps-bar`: process steps when useful.
4. `dds-body`: scrollable business content.
5. `detail-drawer-footer`: sticky global actions.

`dds-hero` is a structural key-facts area. Its content depends on the business object:

- Shipment/order: route, customer, ETD/ETA, carrier, vessel/voyage.
- Customer: customer type, owner, credit/risk, last follow-up.
- Bill/reconciliation: counterparty, currency, amount, due date, confirmation state.
- Warehouse: warehouse, location, quantity, weight/CBM, inbound/outbound time.
- Trucking/delivery: pickup/delivery address, appointment time, vehicle/team, container.
- Configuration: effective state, owner organization, last update, usage count.

Do not force route, ETD/ETA, carrier, or customer into pages that do not own those facts.

Do not add a right summary sidebar when `dds-head` and `dds-hero` already show the same status, identity, and key facts. Repeated summaries reduce form width and violate PESDP efficiency.

Only use a right side panel when it has a distinct purpose such as anchors, exception checklist, audit trail, or collaboration, and it does not duplicate header content.

## Detail Sections

- Use `detail-section`.
- Header left: section title only.
- Header right: actions only.
- Put counts/stats/helper text inside section body or summary area.
- Do not nest cards inside cards.
- Section order should follow the user's operation order, not the order copied from another module.

## Long Forms

- Use vertical labels for dense enterprise forms.
- Use 4-column grid on wide screens, reduce at 1280px.
- Long labels should not truncate important meaning:
  - Prefer label width/vertical label.
  - For terms like `大船船名/航次`, keep full label visible.
  - If a label is too long, split by business grouping rather than abbreviation.
- Required mark stays close to label, not inside placeholder.
- Use the smallest grid that preserves meaning. Dense does not mean every form must use 6 columns.

## Business Option Groups

Use structured option groups for service items, cargo types, order flags, and similar multi-select business markers.

- Use `.svc-tags` and `.svc-tag` for compact checkbox chips.
- Service items and cargo types are user selection actions, not status badges.
- Do not render checkbox chips with native `<button>` elements. Use Arco checkbox or a custom element with `role="checkbox"`, `aria-checked`, and keyboard support.
- Each option must show checkbox affordance: empty square when unselected, checked square when selected.
- Selected items use subtle primary or semantic tint, not strong filled badges.
- Unselected items must remain readable and visibly selectable.
- Disabled/read-only mode must remain readable and should not look interactive.
- Risk-sensitive options such as dangerous cargo use warning semantic tokens.
- Do not use raw `<button>` browser styling, disconnected outline chips, black-border selected state, or status-pill styling for business option groups.

## Module Header Rule

Module header left can only show the module name.
Module header right can only show module-level actions.

Do not show total count, weight, CBM, status, helper text, or upload state in the module title line. Put that information inside a module summary row/body.

## Attachments

- Single required file: show one upload slot plus current file row.
- Multiple files: show compact file table with name, type, status, uploader, time, actions.
- Upload action uses `type="dashed"` or outline/add style.
- File delete requires confirmation.
- File status uses Tag or `.s-pill`, not plain text.
- Required attachment types must be visible as business labels, not hidden only in placeholder text.
- Multiple files must show count and upload state inside the module body or summary row, not in the module title.
- File actions should be compact: preview/download/delete, with low-frequency operations in a dropdown.
- Do not add attachment modules to pages that do not manage files.

## Repeated Modules

Choose repeated modules from the object model:

- Cargo/containers for shipment/order pages.
- Fee lines for finance pages.
- Contact/person rows for customer and permission pages.
- Warehouse stock lines for warehouse pages.
- Delivery rows for trucking/delivery pages.
- Declaration rows for customs pages.

Use `detail-module` and mini VXE/table patterns when the module has repeated rows. Use a simple `detail-section` when the module has only one compact form group.

## Footer

- Submit/confirm is primary.
- Save draft is default/outline.
- Abandon/delete is danger and confirmed.
- Footer is sticky and always visible.
