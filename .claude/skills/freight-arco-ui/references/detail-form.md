# Detail And Form

## Detail Drawer Structure

Use `class="detail-drawer"` and `:footer="false"` for complex drawers.

Complex order/detail drawers must pass an explicit wide width such as
`width="calc(100vw - 32px)"` or a validated `min(1200px, 90vw)` equivalent.
Do not rely only on the global `.detail-drawer` selector for width because
Arco Drawer may apply component/inline width after CSS. A complex detail that
renders as a narrow right rail fails the detail-form contract.

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

### Detail Key-Facts Typography

- Values in the same `dds-hero` fact row must use one value size. Do not render route as 17px while ETD, carrier, and vessel/voyage are 13px.
- Route can be the lead fact through placement, grouping, and 600 weight, but not through an oversized font inside the same compact fact row.
- Fact labels use F5/meta color; fact values use F1 13px/core text color.
- Use a larger hero token only when the route/object identity is in a separate hero title area, not mixed with ordinary facts.

## Detail Sections

- Use `detail-section`.
- Header left: section title only.
- Header right: actions only.
- Put counts/stats/helper text inside section body or summary area.
- Do not nest cards inside cards.
- Section order should follow the user's operation order, not the order copied from another module.

## Long Forms

- Use vertical labels for dense enterprise forms.
- Detail form labels, input values, select values, textarea values, placeholders, and read-only field values use the shared F4 Control 12px layer.
- Use color and weight for hierarchy: labels use `color-text-2`/500, real values use `color-text-1`/500, placeholders use `color-text-3`/400.
- Do not allow Arco default 14px labels or 13px table-data typography inside editable/detail form fields.
- Use 4-column grid on wide screens, reduce at 1280px.
- Long labels should not truncate important meaning:
  - Prefer label width/vertical label.
  - For terms like `大船船名/航次`, keep full label visible.
  - If a label is too long, split by business grouping rather than abbreviation.
- Required mark stays close to label, not inside placeholder.
- Use the smallest grid that preserves meaning. Dense does not mean every form must use 6 columns.

## Internal Form Groups

Use internal groups only when one detail section has multiple business concepts that users scan separately.

Good examples:

- port/route vs time nodes vs terms;
- billing party vs amount lines vs invoice info;
- address info vs appointment info vs vehicle info.

Rules:

- Keep the outer module title as the primary section title.
- Internal group title is a low-weight scan label, not another module title.
- Use compact group labels with subtle tint or left accent; avoid full-width heavy divider lines.
- Group labels must not create large vertical gaps.
- Group by operation meaning, not by backend field order.
- If a group has only one or two fields and no scanning value, merge it with the previous group.
- Do not create a new `detail-section` for every internal group.
- Do not use card-in-card styling for internal groups.

Default layout:

```text
detail-section title
└── detail-form
    ├── form-subgroup-label
    ├── detail-form-grid
    ├── form-subgroup-label
    └── detail-form-grid
```

Anti-patterns:

- A long form sliced by heavy horizontal lines.
- Group titles competing with module titles.
- Large blank areas after each group.
- Groups named with generic labels such as `基础信息1` or backend categories.

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

Attachment UI must first classify the business model. Do not use one generic upload table for every file scenario.

### Attachment Patterns

| Pattern | Use when | Required UI |
|---------|----------|-------------|
| Document type checklist | Business requires specific documents, such as booking instruction, customs documents, HBL draft | Left side shows document type and requirement; body shows files under that type; action is upload/replace/continue upload |
| Ungrouped file list | Files belong to the object but do not have document type requirements | One compact file table/list with file name, category if any, status, uploader, time, actions |
| Single file field | A form field owns exactly one file, such as license, report, seal image | One compact current-file row plus upload/replace action |
| Multi-file field | One field accepts many files, such as photos, supporting documents | File list under the field plus add-more action and count |

### Document Type Checklist

- Use for logistics documents with compliance or workflow meaning: `订舱委托书`, `报关资料`, `提单文件`, `MSDS`, `电池报告`.
- Each document type is one row/card. The document type row carries business rules: required/optional, single/multiple, current status, file count.
- A single-file document type must show `上传文件` when empty and `替换文件` when uploaded.
- A multi-file document type must show `上传文件` when empty and `继续上传` when files exist.
- Do not display multi-file data as one fake zip name unless the actual uploaded object is a zip file.
- Required state must be visible as a business marker near the document type, not only in placeholder text.
- Upload state must use Tag or `.s-pill`: `待上传`, `待复核`, `已上传`, `上传失败`.
- File rows under a document type should show: file name, size, status, uploader, upload time, actions.
- File actions: preview and download are direct actions; delete requires confirmation; low-frequency actions go into a dropdown.
- Module title remains only `附件` or the business module name. File counts, missing counts, and upload progress belong in the module body/summary row.

### Ungrouped File List

- Use when the page needs attachments but does not have required document categories.
- Header left is the module title only. Header right can show `上传附件` and optional `批量下载`.
- The body uses a compact file table/list:
  - file name with file icon;
  - file category only when users filter or recognize files by category;
  - status;
  - size;
  - uploader;
  - upload time;
  - operation column.
- If there is only one file total, keep the same file-row structure instead of a large upload card.
- Empty state should be concise: `暂无附件` plus upload action when editable.

### Single vs Multiple File Behavior

- Single file means replacement, not accumulation. Action text after upload is `替换文件`.
- Multiple files means accumulation. Action text after upload is `继续上传`.
- Delete for single file clears the field and returns status to `待上传` when required.
- Delete for multiple files removes only that file; the document type status is recalculated from remaining files.
- If multiple files have mixed states, the document type status priority is: failed > review > missing required > uploaded.

Do not add attachment modules to pages that do not manage files.

## Repeated Modules

Choose repeated modules from the object model:

- Cargo/containers for shipment/order pages.
- Fee lines for finance pages.
- Contact/person rows for customer and permission pages.
- Warehouse stock lines for warehouse pages.
- Delivery rows for trucking/delivery pages.
- Declaration rows for customs pages.

Use `detail-module` and mini VXE/table patterns when the module has repeated rows. Use a simple `detail-section` when the module has only one compact form group.

### Parent-Child Nested Modules

Use a parent-child nested module when a repeated entity owns another repeated line set.

The required levels are:

| Level | Purpose | Allowed content |
|-------|---------|-----------------|
| Module head | Section identity | Title on left, module actions on right |
| Module summary | Whole-module situation | Total count, total amount/weight/volume, upload progress, validation progress |
| Child head | Child identity | Sequence, child name/code, compact child stats, collapse, child actions |
| Child body | Child fields | Core form fields for this child |
| Line table | Child-owned rows | Editable/detail rows and row actions |

Rules:

- Use one parent module surface only. Do not render each child as a separate card with its own shadow.
- Module head must not contain totals, helper text, status, or progress.
- Module summary appears once after the module head. It must not repeat the module title.
- Child head should be a compact row, not a second module title bar.
- Child head may show child-level stats only when they help distinguish or validate the child.
- Child body should not repeat child identity fields already visible in the child head unless the field is editable.
- Line table toolbar should sit directly above the line table and only contain line-level actions.
- The user must be able to tell whether an action affects the whole module, one child, or one row without reading surrounding text.
- Child body should use lightweight internal panes when it contains both core fields and child-owned lines. Example: `收发货方` pane + `品名明细` pane.
- Child metrics should appear as compact data chips in the child head, not as weak gray text detached from the child identity.
- Use a subtle left accent or sequence marker for expanded child items so users can follow nested ownership while scrolling.
- The parent summary, child identity band, pane header, and line table header must each have a distinct role. If they all look like plain white rows, the module fails PESDP even when spacing is compact.
- Use Arco primary token accents sparingly for nested ownership: summary left anchor, expanded child rail, pane title marker, or mini table header. Do not use custom colors or decorative gradients.
- Child line data with editable rows should use the shared VXE mini table pattern, not a one-off native table, so hover, empty, fixed action, and row height stay consistent.
- A child line empty state must explain what is missing and where the user acts, such as `暂无品名明细，点击添加品名录入该发货人名下货物`.
- Long international party names must remain readable through truncation plus tooltip/title; do not weaken customer/shipper/consignee names to helper color.

Default behavior:

- Open the first child entity.
- Open children with required-field errors.
- Collapse completed secondary children when there are more than two, but keep identity visible.
- Show one empty row or empty state when a child has no line rows; do not show a blank 1px-height table.

Anti-patterns:

- Parent summary, child head, and table cap all showing the same totals.
- `添加` buttons repeated in multiple levels without object-specific labels.
- Child delete placed in the module header.
- A long form followed by a table with no visual connection to the child it belongs to.
- Nested borders and shadows that make a child look like a full independent page section.
- Child title shown as plain body text with no visual hierarchy.
- Add/delete actions placed at the wrong level, such as line add in parent head or child delete in line table.

### Inline Editable Table Visual Rules (`detail-mini-vxe`)

When a detail section contains a VXE table with editable cells (`a-input`, `a-select`, `a-date-picker` inside columns), use class `detail-mini-vxe` on the table. `global.css` handles ghost-border treatment automatically.

Container:

```vue
<div class="detail-section__body detail-section__body--table">
  <vxe-table
    class="detail-mini-vxe"
    border="none"
    size="small"
    height="auto"
    :data="rows"
    :row-config="{ isHover: true, keyField: 'id', height: 38 }"
  >
    <!-- columns -->
  </vxe-table>
</div>
```

Required:

- Always add `class="detail-mini-vxe"` to VXE tables embedded in `detail-section__body` that contain editable controls.
- Use `detail-section__body--table` on the section body (or `detail-child-pane__table` for nested child panes).
- Match `row-config.height` to `38` when controls are 28px (`--dense-control-h-detail`).
- Only one `min-width` column per mini table.

Forbidden:

- `show-overflow` / `show-header-overflow` on `detail-mini-vxe` (causes clipping and header/body misalignment).
- Page-scoped wrappers with `overflow: hidden` around wide detail tables.
- Padding on `td` (`.vxe-body--column`) instead of `.vxe-cell`.
- Forgetting `class="detail-mini-vxe"` — inputs show full Arco borders in every cell, creating Excel-like box grid.

Form grid in detail drawers:

- `detail-form-grid` children need `min-width: 0`; controls in `.detail-form` must be `width: 100%`.
- `detail-drawer` must include `a-picker` / `a-date-picker` in the 28px control height rules, not only input/select.

### Combined Field Inputs (`detail-combo`)

Use when one label owns multiple related controls (port code + name, vessel/voyage, field + copy action).

```vue
<!-- 港码 + 港名 -->
<a-form-item label="起运港">
  <div class="detail-combo detail-combo--code-name">
    <a-input v-model="form.polCode" size="small" placeholder="代码" />
    <a-input v-model="form.pol" size="small" placeholder="港口名称" />
  </div>
</a-form-item>

<!-- 船名 / 航次 -->
<a-form-item label="大船船名/航次">
  <div class="detail-combo">
    <a-input v-model="form.vessel" size="small" placeholder="船名" />
    <a-input v-model="form.voyage" size="small" placeholder="航次" />
  </div>
</a-form-item>

<!-- 字段 + 复制 -->
<a-form-item label="客户">
  <div class="detail-combo detail-combo--action">
    <a-select v-model="form.customer" size="small" allow-search />
    <a-button size="small" type="outline" @click="copyCustomer">
      <template #icon><icon-copy /></template>
    </a-button>
  </div>
</a-form-item>
```

Rules:

- Modifiers: `--code-name` (fixed narrow first input), `--action` (trailing outline button).
- Trailing action buttons in combos must be `type="outline"`, never `primary`.
- Do not put `primary` copy/upload buttons inside form fields.
- Combo groups share 28px height and primary-tint focus via `global.css`; do not reimplement borders in page scoped CSS.

## Footer

- Submit/confirm is primary.
- Save draft is default/outline.
- Abandon/delete is danger and confirmed.
- Footer is sticky and always visible.
- Use `detail-drawer-footer__start` / `__end` for danger-left + actions-right hierarchy (see `actions.md`).
