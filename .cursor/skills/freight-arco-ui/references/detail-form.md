# Detail And Form

## Detail Drawer Structure

Use `class="detail-drawer"` and `:footer="false"` for complex drawers.

Drawer width tiers (D3 standard / D4 complex / fullscreen): **`overlay-dimensions.md`**.

| Detail type | Class | Width |
|-------------|-------|-------|
| Read-only, few sections | `detail-drawer detail-drawer--standard` | `min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))` via `width` prop |
| Multi-tab, mini tables, footer workflow | `detail-drawer` | `min(var(--dense-drawer-w-complex-max), calc(100vw - var(--dense-drawer-viewport-pad)))` via `width` prop |
| Object console fullscreen | `detail-drawer detail-drawer--fullscreen` | explicit `100vw` mode via `width` prop |

The Drawer `width` prop is authoritative. Classes select documented shared detail structure only; they do not replace the prop with hidden `!important` width rules.

Recommended complex detail order:

1. `dds-head`: status, primary number/name, company/context, view tools.
2. `dds-hero`: object-specific core facts.
3. `dds-milestone-bar`: lightweight process milestone when useful.
4. `dds-body`: scrollable business content.
5. `detail-drawer-footer`: sticky global actions.

For process-bearing operational details, use a lightweight milestone strip (`dds-milestone-bar` + `dds-milestone`) instead of `a-steps type="arrow"`. Arrow steps create large colored blocks and make the page feel like an approval or low-code flow. Dense business details need process awareness, not a dominant workflow banner.

`dds-hero` is a structural key-facts area. Its content depends on the business object:

- Shipment/order: route, customer, ETD/ETA, carrier, vessel/voyage.
- Customer: customer type, owner, credit/risk, last follow-up.
- Bill/reconciliation: counterparty, currency, amount, due date, confirmation state.
- Warehouse: warehouse, location, quantity, weight/CBM, inbound/outbound time.
- Trucking/delivery: pickup/delivery address, appointment time, vehicle/team, container.
- Configuration: effective state, owner organization, last update, usage count.

Do not force any object-specific key fact into a page that does not own that fact. Shared structure does not imply shared business content.

Do not add a right summary sidebar when `dds-head` and `dds-hero` already show the same status, identity, and key facts. Repeated summaries reduce form width and violate PESDP efficiency.

Only use a right side panel when it has a distinct purpose such as anchors, exception checklist, audit trail, or collaboration, and it does not duplicate header content.

### Detail Key-Facts Typography

- Values in the same `dds-hero` fact row must use one value size. Do not render the lead fact larger than neighboring facts inside the same compact row.
- The lead fact can be stronger through placement, grouping, and 600 weight, but not through an oversized font inside the same compact fact row.
- Fact labels use F5/meta color; fact values use F1 12px / core text color.
- Use a larger hero token only when the lead fact or object identity is in a separate hero title area, not mixed with ordinary facts.

### Detail Head Business Emphasis

`dds-head` and `dds-hero` are the working identity band for business users. They must make the object immediately recognizable during daily operation.

- `dds-head` fills object-level slots: `key_state`, `primary_identity`, `business_context`, `owner`, and `view_tools`. The primary identity uses the project primary text role; context and owner use readable business-value roles, not helper/disabled color.
- `dds-hero` fills 3-6 `key_facts` owned by the object. A key fact is any value users need before choosing the next operation, such as lane, schedule, counterparty, amount, risk, stock, location, or due date depending on object type.
- The lead fact is selected from the object's user job. Example: shipment/order users often scan by lane first, while reconciliation users may scan by counterparty + amount, and warehouse users may scan by location + stock state.
- Lead facts gain emphasis through grouping, left accent, primary-tint surface, 600 weight, and placement. Do not make the whole header blue, do not add decorative gradients, and do not increase random font sizes.
- `color-text-4` is forbidden for `primary_identity`, `business_context`, `owner`, or any `key_fact` used to decide the next operation.
- Long business values must remain readable with ellipsis plus `title`/tooltip. Do not weaken them to gray text to hide overflow.

## Object Workspace Mode Contract

A full business-detail route defaults to an **object workspace**, not an always-editable form. Its first viewport must answer: which object, current state, workflow position, blocking risk, next action, owner, and latest relevant change.

Required modes:

| Mode | Default | Surface | Footer |
|------|---------|---------|--------|
| `display` | yes | readable identity, execution focus, read-only facts, contextual row/module actions | hidden unless a real object-level workflow action must remain sticky |
| `editing` | explicit user action only | Arco form controls for the fields owned by the edit session | cancel/discard + one primary save |
| `row-editing` | explicit row action | only the active detail-table row renders controls | row-local save/cancel; object footer does not replace it |

Rules:

- Annotate the root work area with a stable role such as `data-detail-workspace="shipment-order"`; keep an explicit reactive edit state such as `isDetailEditing`.
- The overview tab must provide a compact execution-focus block before passive field groups. It owns one current decision, its blocking context, owner/deadline, and links to the owning risk/file/fee surface.
- The default overview must render business values as read-only fields/text. Rendering the full overview as visible inputs before the user selects Edit is forbidden.
- Display sections use Arco `a-descriptions class="detail-display"` before custom read-grid markup. Editable controls replace the same business fields only inside the explicit edit session.
- Entering edit mode preserves the same section order and field ownership; controls replace values without moving the user to an unrelated page.
- Save success returns to display mode and refreshes only the object surfaces named by the feature contract. Save failure keeps editing mode and user input.
- Cancel/discard restores the last saved snapshot and returns to display mode. Route leave during an edit session requires an unsaved-change confirmation.
- Header actions do not duplicate footer save/cancel actions. Object-level edit is a neutral detail-head action; the editing footer owns the single primary Save.
- A process-bearing freight object uses a lightweight, domain-named milestone bar. Normal detail pages must not use a large vertical-label step banner or generic numbered steps.
- File/fee/risk counts have one visible owner in navigation or the execution-focus block. Do not repeat the same counts as a KPI strip in the identity band.

Forbidden fallbacks:

- default detail route with a wall of editable inputs;
- `保存` footer visible while the page is not in an edit session;
- business status, next action, and milestone pointing to different workflow stages;
- a decorative KPI strip between identity and the work surface;
- hiding risk/next-action context inside a later tab with no first-viewport signal.

## Detail Sections

- Use `detail-section`.
- Header left: section title + optional aggregate stats chips (`detail-data-stats`). Wrap title and stats in a shared `flex:1` container so they stay left-aligned together against the right-side actions.
- Header right: actions only (`detail-section__actions`). Maximum one `outline` button per module head; consolidate multiple add actions into one `outline` dropdown.
- Do **not** put stats in a separate row between the section head and the table — this creates two equal-weight rows with no hierarchy. Use `detail-data-stats__item` chips inline in the head instead.
- Do **not** combine `.detail-module-summary` (card) with `.detail-module-summary--inline` (embedded row) — they conflict. Use only the variant class without the base card class.
- Do **not** use `--stat--qty / --stat--weight / --stat--volume` color modifiers together on the same stats bar — multiple accent colors (blue+orange+green) violate PESDP single-anchor rule. Keep all stat values `color-text-1`.
- Do not nest cards inside cards.
- Section order should follow the user's operation order, not the order copied from another module.
- Do not place a full-width KPI/report bar directly under the hero in complex operational drawers. Quantities, amounts, progress, and validation totals belong in the owning module summary. The top area should stay focused on `primary_identity`, `key_state`, `business_context`, `owner`, and the object's `key_facts`.
- `detail-section` is a primary operational surface. It uses white/near-white body, blue-tinted border, restrained shadow, `--dense-surface-head` header, and a small title marker. It must not look like a flat gray row stack.
- Module body backgrounds should stay white or blue-white. Gray fill is only for disabled/empty/secondary states, not normal editable form areas.

### Left Anchor Hierarchy

Detail pages may use primary-color anchors, but only as a controlled hierarchy. Too many left-side markers make the page look broken.

- Top-level module: `detail-section__title::before` is the only default section anchor. Do not add a full-height `detail-section::before` rail on every section.
- Internal concept: `form-subgroup__title::before` or legacy `form-subgroup-label::before` uses a small dot. Do not use another left border for subgroup labels.
- Repeated child item: child-head rail appears only for expanded/current child items. Collapsed child rows must not show a permanent primary rail.
- Module summary: `detail-module-summary--inline::before` is allowed only for repeated data summaries. It must not replace the section title anchor.
- In one vertical column, anchors must step down by strength: section short bar > summary rail > child current rail > subgroup dot. Do not stack full-height rail + title bar + dot at the same left edge.

### Process-Bearing Operational Detail Drawers

Process-bearing detail drawers are production workbenches, not dashboard pages. Use this pattern for business objects where users must understand current state, edit/verify grouped data, and commit the next workflow action.

Required structure:

1. Header: `dds-head` with `key_state`, `primary_identity`, `business_context`, `owner`, and compact view tools.
2. Key facts: `dds-hero` with 3-6 object-owned `key_facts` selected from the user's next decision.
3. Milestone: `dds-milestone-bar` with compact text/dot milestones when the object has a real process. Do not use `a-steps type="arrow"`.
4. Sections in the user's working order: required core group → main working data → repeated sub-entities → documents/files → finance/validation when owned by the object → activity/audit.
5. Footer: left danger, right grouped secondary workflow, one primary commit.

Rules:

- The drawer must not start with an independent KPI strip. Put totals in the owning module summary using `detail-module-summary--inline`.
- Repeated data module summaries own their own counts, quantities, amounts, validation progress, and exception totals. Do not duplicate those totals in the hero or section title.
- Footer high-frequency actions are the current user's save/submit/confirm action. Downstream workflow actions should be secondary and grouped when they are not the current primary task.
- Header actions must not duplicate footer commit actions.
- Section heads remain title-left/actions-right; do not put totals in section titles.

## Form Grid Structure

### Canonical Layer Hierarchy

```
a-form.detail-form               ← Arco form root; sets font, control size token
└── div.detail-form-grid.detail-form-grid--{n}   ← CSS grid; one per business group
    ├── a-form-item               ← Arco form item (label + validation)
    │   └── a-input / a-select / a-date-picker …  ← control; must be size="small"
    ├── a-form-item.detail-form-grid__span2        ← spans 2 columns
    │   └── a-textarea …
    └── div.detail-field          ← read-only field; same grid slot
        ├── div.detail-field__label
        └── div.detail-field__val
```

Rules:

- `a-form` wraps the **whole section's editable area**. One `<a-form>` per `detail-section`. Do not open a new `<a-form>` for every subgroup.
- `detail-form-grid` is the **column grid**. Place it directly inside `<a-form>` or after a `form-subgroup-label`. All `a-form-item` and `detail-field` elements are **direct children** of the grid — no extra wrapper div per item.
- `a-form-item` carries the label, required marker, and validation message. Never write a custom label `<div>` above an input — use `a-form-item`.
- Controls inside `a-form-item` must be `size="small"` and `width: 100%` (inherited from `.detail-form` in `global.css`).

### Column Count Rules

| Grid class | Columns | Use when |
|------------|---------|----------|
| `detail-form-grid--3` | 3 | Narrow section or few fields; labels are long (≥ 6 chars) |
| `detail-form-grid--4` | 4 | Standard detail section on ≥ 1280px drawer |
| `detail-form-grid--6` | 6 | Dense sections with many short fields (amounts, dates, codes) |

Do not use 4-column for sections where most labels exceed 8 characters — labels will be truncated. Prefer 3-column.

Do not use 6-column as a default for all forms — it compresses label width to the point where long freight labels clip.

### Span Usage

```vue
<!-- Normal 1-column item -->
<a-form-item label="起运港">
  <div class="detail-combo detail-combo--code-name">…</div>
</a-form-item>

<!-- 2-column span: textarea, long address, remark -->
<a-form-item label="备注" class="detail-form-grid__span2">
  <a-textarea v-model="form.remark" size="small" :auto-size="{ minRows: 2 }" />
</a-form-item>

<!-- Full-width span in a 4-col grid -->
<a-form-item label="特殊说明" class="detail-form-grid__span4">
  <a-textarea v-model="form.note" size="small" :auto-size="{ minRows: 2 }" />
</a-form-item>
```

Span rules:

- Use `__span2` for textarea, multi-line text, or address fields that need more width.
- Use `__span3` / `__span4` only for full-width fields like long remarks, declaration content, or file upload areas.
- Do not span a single-line input just to make it look prominent.

### Form Subgroups

When one `detail-section` contains multiple business sub-concepts, use `form-subgroup` blocks to divide them without creating new top-level sections. A subgroup is a compact operational panel with a head and one field grid. It is not a card, not a new module, and not a decorative left rail.

```vue
<a-form class="detail-form" layout="vertical" :model="form">
  <div class="form-subgroup">
    <div class="form-subgroup__head">
      <span class="form-subgroup__title">路线</span>
    </div>
    <div class="detail-form-grid detail-form-grid--4">
      <a-form-item label="起运港">…</a-form-item>
      <a-form-item label="目的港">…</a-form-item>
      <a-form-item label="目的地">…</a-form-item>
      <a-form-item label="运输条款">…</a-form-item>
    </div>
  </div>

  <div class="form-subgroup">
    <div class="form-subgroup__head">
      <span class="form-subgroup__title">船期</span>
    </div>
    <div class="detail-form-grid detail-form-grid--4">
      <a-form-item label="大船船名/航次">…</a-form-item>
      <a-form-item label="船公司">…</a-form-item>
    </div>
  </div>
</a-form>
```

Rules:

- `form-subgroup` is used only inside a `detail-section__body` form when the section has 2+ distinct business concepts such as `路线 / 船期`.
- `form-subgroup__title` is a scan title. Keep it short (2–6 Chinese characters or equivalent i18n copy). Do not add descriptions under it unless the business meaning would be unclear.
- Each `form-subgroup` contains exactly one `form-subgroup__head` followed by one `detail-form-grid`.
- Do not use repeated blue left rails for subgroups. The parent `detail-section__title` owns the vertical primary anchor; subgroups use a small dot + subtle divider to avoid visual noise.
- Do not add a subgroup for every field — only when there are 2+ distinct business concepts in one section.
- Never create a new `detail-section` for a subgroup that has fewer than 3 fields.
- `form-subgroup-label` is legacy-compatible only. New detail forms should use `form-subgroup`; do not generate consecutive bare subgroup labels in one section.

### Mixed Editable + Read-Only Fields

Read-only fields use `detail-field` (not `a-form-item`) but live in **the same grid**:

```vue
<div class="detail-form-grid detail-form-grid--4">
  <!-- Editable -->
  <a-form-item label="业务员">
    <a-select v-model="form.staffId" size="small" allow-search />
  </a-form-item>
  <!-- Read-only (no edit needed) -->
  <div class="detail-field">
    <div class="detail-field__label">创建时间</div>
    <div class="detail-field__val">{{ order.createdAt }}</div>
  </div>
</div>
```

Do not put read-only fields in a separate grid below the editable grid unless they belong to a different business concept.

### Complete Section Template

```vue
<div class="detail-section">
  <div class="detail-section__head">
    <div class="detail-section__title">基本信息</div>
    <div class="detail-section__actions">
      <!-- section-level actions only -->
    </div>
  </div>
  <div class="detail-section__body">
    <a-form
      ref="formRef"
      class="detail-form"
      layout="vertical"
      size="small"
      :model="form"
    >
      <div class="form-subgroup-label">单号信息</div>
      <div class="detail-form-grid detail-form-grid--4">
        <a-form-item label="业务单号">
          <a-input v-model="form.businessNo" size="small" disabled />
        </a-form-item>
        <a-form-item label="HBL 单号">
          <a-input v-model="form.hblNo" size="small" />
        </a-form-item>
        <a-form-item label="MBL 单号">
          <a-input v-model="form.mblNo" size="small" />
        </a-form-item>
        <a-form-item label="客户" :rules="[{ required: true }]">
          <div class="detail-combo detail-combo--action">
            <a-select v-model="form.customerId" size="small" allow-search />
            <a-button size="small" type="outline" @click="copyCustomer">
              <template #icon><icon-copy /></template>
            </a-button>
          </div>
        </a-form-item>
      </div>

      <div class="form-subgroup-label">航线信息</div>
      <div class="detail-form-grid detail-form-grid--4">
        <a-form-item label="起运港" :rules="[{ required: true }]">
          <div class="detail-combo detail-combo--code-name">
            <a-input v-model="form.polCode" size="small" placeholder="代码" />
            <a-input v-model="form.pol" size="small" placeholder="港口名称" />
          </div>
        </a-form-item>
        <a-form-item label="目的港" :rules="[{ required: true }]">
          <div class="detail-combo detail-combo--code-name">
            <a-input v-model="form.podCode" size="small" placeholder="代码" />
            <a-input v-model="form.pod" size="small" placeholder="港口名称" />
          </div>
        </a-form-item>
        <a-form-item label="ETD">
          <a-date-picker v-model="form.etd" size="small" style="width:100%" />
        </a-form-item>
        <a-form-item label="ETA">
          <a-date-picker v-model="form.eta" size="small" style="width:100%" />
        </a-form-item>
        <a-form-item label="备注" class="detail-form-grid__span4">
          <a-textarea v-model="form.remark" size="small" :auto-size="{ minRows: 2 }" />
        </a-form-item>
      </div>
    </a-form>
  </div>
</div>
```

## Long Forms

- Use vertical labels for dense enterprise forms.
- Detail form labels, input values, select values, textarea values, placeholders, and read-only field values use the shared F4 Control 12px layer.
- Use color and weight for hierarchy: labels use `color-text-2`/500, real values use `color-text-1`/500, placeholders use `color-text-3`/400.
- Do not allow Arco default 14px labels or a second business-content size inside editable/detail form fields.
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

Use structured option groups for service items, attribute types, object flags, and similar multi-select business markers.

- Use `.svc-tags` and `.svc-tag` for compact checkbox chips.
- Service items and object attributes are user selection actions, not status badges.
- Do not render checkbox chips with native `<button>` elements. Use Arco checkbox or a custom element with `role="checkbox"`, `aria-checked`, and keyboard support.
- Each option must show checkbox affordance: empty square when unselected, checked square when selected.
- Selected items use subtle primary or semantic tint, not strong filled badges.
- Unselected items must remain readable and visibly selectable.
- Disabled/read-only mode must remain readable and should not look interactive.
- Risk-sensitive options use warning semantic tokens.
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
- Executable structure gate: repeated parent-child modules must expose `module summary -> child identity/meta -> child metrics -> child body -> child pane -> child-owned line table`. If any layer is missing, the block can pass component checks but still fails PESDP structure.
- On wide drawers, summary and child metrics must stay compact chips near the owning identity. Do not distribute three totals across the full drawer width like a report bar.

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
    class="detail-mini-vxe detail-mini-vxe--editable"
    border="none"
    size="small"
    height="auto"
    :data="rows"
    :row-config="{ isHover: true, keyField: 'id' }"
  >
    <!-- columns -->
  </vxe-table>
</div>
```

Required:

- Always add `class="detail-mini-vxe"` to VXE tables embedded in `detail-section__body` that contain editable controls.
- Use `detail-section__body--table` on the section body (or `detail-child-pane__table` for nested child panes).
- Use `detail-mini-vxe--editable`; the global CSS bridge resolves the row to 38px for 28px controls (`--dense-control-h-detail`). Do not set `row-config.height` on pinned VXE 4.5.
- Business columns use `min-width`; only checkbox / seq / operation use fixed `width` (see `table.md` width policy).

Forbidden:

- `show-overflow` / `show-header-overflow` on `detail-mini-vxe` (causes clipping and header/body misalignment).
- `detail-child-pane__desc` when the child title and field labels already explain the block (no redundant module copy).
- Page-scoped wrappers with `overflow: hidden` around wide detail tables.
- Padding on `td` (`.vxe-body--column`) instead of `.vxe-cell`.
- Forgetting `class="detail-mini-vxe"` — inputs show full Arco borders in every cell, creating Excel-like box grid.

Form grid in detail drawers:

- `detail-form-grid` children need `min-width: 0`; controls in `.detail-form` must be `width: 100%`.
- `detail-drawer` must include `a-picker` / `a-date-picker` in the 28px control height rules, not only input/select.

### Combined Field Inputs (`detail-combo`)

Use when one label owns multiple related controls, such as code + name, paired identity fields, or a field + copy/action button.

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
