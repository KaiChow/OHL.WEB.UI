# Detail And Form

## Detail Drawer Structure

Use `class="detail-drawer"` and `:footer="false"` for complex drawers.

Recommended complex detail order:

1. `dds-head`: status, order number, company/context, view tools.
2. `dds-hero`: route and core facts.
3. `dds-steps-bar`: process steps when useful.
4. `dds-body`: scrollable business content.
5. `detail-drawer-footer`: sticky global actions.

Do not add a right summary sidebar when `dds-head` and `dds-hero` already show the same order status, customer, route, ETD/ETA, and owner information. Repeated summaries reduce form width and violate PESDP efficiency.

Only use a right side panel when it has a distinct purpose such as anchors, exception checklist, audit trail, or collaboration, and it does not duplicate header content.

## Detail Sections

- Use `detail-section`.
- Header left: section title only.
- Header right: actions only.
- Put counts/stats/helper text inside section body or summary area.
- Do not nest cards inside cards.

## Long Forms

- Use vertical labels for dense enterprise forms.
- Use 4-column grid on wide screens, reduce at 1280px.
- Long labels should not truncate important meaning:
  - Prefer label width/vertical label.
  - For terms like `大船船名/航次`, keep full label visible.
  - If a label is too long, split by business grouping rather than abbreviation.
- Required mark stays close to label, not inside placeholder.

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

## Footer

- Submit/confirm is primary.
- Save draft is default/outline.
- Abandon/delete is danger and confirmed.
- Footer is sticky and always visible.
