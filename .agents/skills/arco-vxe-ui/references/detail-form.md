# Detail And Form

> Class names and --dense-* tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

## Detail Drawer Structure

Use Arco Drawer as the interaction owner. Keep its native header/body/footer when they fit; use a footer slot only when the object workflow needs persistent actions. A page-local class may identify layout ownership but is not a shared skin or hidden width API.

Drawer width tiers (D3 standard / D4 complex / fullscreen): **`overlay-dimensions.md`**.

| Detail type | Width owner |
|-------------|-------------|
| Read-only, few sections | D3 responsive expression on Drawer `width` prop |
| Multi-tab, mini tables, footer workflow | D4 responsive expression on Drawer `width` prop |
| Object console fullscreen | Explicit fullscreen product mode; do not simulate it with CSS |

The Drawer `width` prop is authoritative. CSS classes must not replace it with hidden width rules.

Complex detail ownership order (names are semantic roles, not required class APIs):

1. `dds-head`: status, primary number/name, company/context, view tools.
2. `dds-hero`: object-specific core facts.
3. `dds-milestone-bar`: lightweight process milestone when useful.
4. `dds-body`: scrollable business content.
5. `detail-drawer-footer`: sticky global actions.

For process-bearing operational details, use a lightweight milestone strip (`dds-milestone-bar` + `dds-milestone`) instead of `a-steps type="arrow"`. Arrow steps create large colored blocks and make the page feel like an approval or low-code flow. Dense business details need process awareness, not a dominant workflow banner.

`dds-hero` is a structural key-facts area. Its content depends on the business object:

- Contract: contract type, customer, amount, sign/expiry date, owner.
- Customer: customer type, owner, level/risk, last follow-up.
- Invoice: counterparty, currency, amount, due date, confirmation state.
- Work order: category, priority, assignee, due time, current state.
- Master data: effective state, owner organization, last update, usage count.

Do not force any object-specific key fact into a page that does not own that fact. Shared structure does not imply shared business content.

Do not add a right summary sidebar when `dds-head` and `dds-hero` already show the same status, identity, and key facts. Repeated summaries reduce form width and waste scanning efficiency.

Only use a right side panel when it has a distinct purpose such as anchors, exception checklist, audit trail, or collaboration, and it does not duplicate header content.

### Detail Key-Facts Typography

- Values in the same `dds-hero` fact row must use one value size. Do not render the lead fact larger than neighboring facts inside the same compact row.
- The lead fact can be stronger through placement, grouping, and 600 weight, but not through an oversized font inside the same compact fact row.
- Fact labels use F5/meta color; fact values use F1 12px / core text color.
- Use a larger hero token only when the lead fact or object identity is in a separate hero title area, not mixed with ordinary facts.

### Detail Head Business Emphasis

`dds-head` and `dds-hero` are the working identity band for business users. They must make the object immediately recognizable during daily operation.

- `dds-head` is an identity cluster: `primary_identity` is first, with `key_state` and object type adjacent; `business_context` sits directly below or beside it. Object identity must be easier to find than every fact label.
- `dds-hero` fills 3-6 `key_facts` owned by the next decision, such as lane, ETD/ETA, counterparty, amount, owner, risk, stock, location, or due date. Passive update metadata does not displace a decision fact.
- The lead fact is selected from the object's user job. Example: work-order users often scan by state + priority first, while invoice users may scan by counterparty + amount, and customer users may scan by owner + last follow-up.
- Lead facts gain emphasis through grouping, order, and 600 weight. Primary tint is reserved for an interactive/current state, not a passive fact background.
- `color-text-4` is forbidden for `primary_identity`, `business_context`, `owner`, or any `key_fact` used to decide the next operation.
- Long business values must remain readable with ellipsis plus `title`/tooltip. Do not weaken them to gray text to hide overflow.

## Business Object Workspace Contract

`Business Object Workspace` is the shared design system for business-object routes and drawers; it is not one rigid page template. Select the archetype from the user's repeated job:

| Archetype | Use when | Default module mode | Typical action owner |
|---|---|---|---|
| `operational-workspace` | continuously create, maintain, correct, or advance an object | core modules `edit`; support/audit stay `read-only` | sticky page/drawer footer |
| `reference-workspace` | inspect stable customer/master/reference data with occasional maintenance | `display` or explicitly editable modules | header or module scope |
| `review-workspace` | audit, compare, approve, or decide from evidence | `read-only` plus explicit row/module decision controls | owning review surface |

Every non-list detail `pageSpec.ts` declares `workspace.archetype`, the identity-band slots, navigation policy, and three task checks. The root exposes a stable role such as `data-detail-workspace="<business-object>"`; the manifest, not a generic visual toggle, decides each module's mode.

### Required Composition

1. **Object identity band**: identity + state, 3-6 decision-relevant facts, real risk/blocker when applicable, next legal action, and object-level tools.
2. **Workspace body**: optional section index plus one content canvas whose modules follow the user's operation order.
3. **Action owner**: header, module/row, or sticky footer according to scope; the same Save/Submit action never appears in two regions.

The identity band targets 72-112px and must stay at or below 120px in the normal state. Height follows owned content, not blank filler. It uses the available canvas width and may wrap into a compact second row; do not impose an arbitrary page `max-width` or stretch facts into report-like KPI tiles.

The first viewport must answer which object, current state, owner, blocking risk, next action, and current workflow position. A compact execution-focus block may link risk or missing data to its owning module. Counts and facts keep one visible owner.

### Editing And Decision Rules

- Operational maintenance defaults to `edit-first`; review/audit defaults to `display-first`. Every module still declares `edit`, `row-edit`, or `read-only` from business truth.
- Edit-first means editable core controls are immediately available. It does not turn computed, permission-locked, support, or audit values into disabled inputs.
- Decision-critical fields gain priority through grouping, order, required/validation state, and help text, not a custom border or second control skin.
- Repeated or structurally complex data uses VXE row editing. Row-local save/cancel/error does not silently commit through the object footer.
- A page-level view/edit switch is forbidden unless preview/comparison is a real business mode.
- Save success refreshes the snapshot and remains editable; failure preserves input. Discard restores the snapshot; dirty route leave requires confirmation.

### Task-Time Acceptance

Treat `3s / 10s / 30s` as scenario targets, not unsupported promises: identify object/state/risk/next work in about 3 seconds; locate the module owning a known issue in about 10 seconds; complete one named high-frequency edit or workflow action in about 30 seconds when backend behavior allows it. `workspace.usability` names the three tasks; real-route testing records evidence.

Forbidden: a wall of inputs, duplicated header/footer commits, decorative KPI strips, invented completion marks, hidden risk context, contradictory state/milestone/next action, or a universal layout copied into unrelated object types.

## Detail Sections

- Use unframed semantic `<section>` blocks inside one owning Arco surface; do not create a card for each field group.
- Header left owns section title plus optional aggregate facts; header right owns actions. Use Arco Space/Flex/Grid first.
- Maximum one direct module add action; consolidate additional low-frequency actions into a dropdown.
- Do not put aggregate facts in a second full row between the section head and its data. Keep them inline or move them to the owning data surface.
- Aggregate facts use one text hierarchy, not per-metric accent colors.
- Do not nest cards inside cards.
- Section order should follow the user's operation order, not the order copied from another module.
- Do not place a full-width KPI/report bar directly under the hero in complex operational drawers. Quantities, amounts, progress, and validation totals belong in the owning module summary. The top area should stay focused on `primary_identity`, `key_state`, `business_context`, `owner`, and the object's `key_facts`.
- Normal sections inherit the owning Arco surface. Do not add blue-tinted borders, section shadows, colored title rails, or a second card skin.
- Neutral fill is reserved for disabled, empty, selected, or secondary states, not normal editable form areas.

### Hierarchy Without Decorative Rails

- Use section order, whitespace, a quiet divider, and title weight for normal hierarchy.
- Use a primary accent only for current/selected/interactive state, never on every section.
- Nested groups must be visually weaker than the owning section and must not introduce another card, shadow, or permanent rail.

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
- Controls inside `a-form-item` must be `size="small"`; set `style="width: 100%"` on pickers or component props where Arco does not naturally fill the form-item.

### Adaptive Field Matrix

“Four-column dense layout” means at most four **field tracks** per row, where one field owns its label, control, help, and validation. It never means eight rigid label/value columns. Select tracks from the measured content canvas and the widest localized field, not viewport width alone.

| Profile | Typical capacity | Use when |
|---|---|---|
| compact | 1-2 tracks | narrow drawer/split window, long translated labels, or complex controls |
| standard | 3 tracks | normal 1024-1439px work canvas with standard fields |
| wide | up to 4 tracks | wide canvas and fields preserve their tested minimum width |
| code-dense | up to 6 tracks | exceptional short code/amount/date sets only; never the page default |

Use container-responsive Arco Grid or a shared grid primitive. Every track needs `min-width: 0`; controls fill the track. At 1.3-2x translated copy and 200% zoom, reduce tracks before truncating labels, shrinking typography, or creating browser-level overflow.

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

- Standard input/select/code is one track; a range picker, batch input, code+name composite, long party name, or address is normally two tracks.
- Textarea, declaration content, file field, and structurally complex editor may span the whole row.
- Span is based on interaction/content width, not visual prominence. Reflow spans at compact widths instead of squeezing child controls.

### Form Subgroups

When one `detail-section` contains multiple business sub-concepts, use `form-subgroup` blocks to divide them without creating new top-level sections. In this repository, `BusinessFieldGroup.vue` is the shared unframed head/body primitive for that role; it is not a card, new module, or decorative rail.

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
- Do not use repeated colored rails, dots, or decorative markers for subgroups. Use heading, spacing, alignment, and a divider only when it clarifies grouping.
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
      <div class="form-subgroup">
        <div class="form-subgroup__head">
          <span class="form-subgroup__title">单号信息</span>
        </div>
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
      </div>

      <div class="form-subgroup">
        <div class="form-subgroup__head">
          <span class="form-subgroup__title">航线信息</span>
        </div>
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
      </div>
    </a-form>
  </div>
</div>
```

## Long Forms

- Use vertical labels for variable freight vocabulary and multilingual forms; they preserve scanning and avoid unstable label columns. Use horizontal label/value pairs only for a proven short-label, repetitive task and test every locale.
- Labels and editable/read-only values follow the shared F4 Control layer. Labels use `color-text-2`/500, values `color-text-1`/500, placeholders `color-text-3`/400.
- Keep full business meaning visible. Reduce the adaptive field matrix or span the field before abbreviating or truncating a label.
- Required marks stay with labels; help and validation remain under their owning control and may increase only that row.
- Group by user decision and operation order, never backend field order. Dense means less unowned space, not more columns than content can support.

## Internal Form Groups

Use internal groups only when one detail section has multiple business concepts that users scan separately.

Good examples:

- port/route vs time nodes vs terms;
- billing party vs amount lines vs invoice info;
- address info vs appointment info vs vehicle info.

Rules:

- Keep the outer module title as the primary section title.
- Internal group title is a low-weight scan label, not another module title.
- Use compact group labels, spacing, and alignment; avoid decorative tint, rails, or full-width heavy divider lines.
- Group labels must not create large vertical gaps.
- Group by operation meaning, not by backend field order.
- If a group has only one or two fields and no scanning value, merge it with the previous group.
- Do not create a new `detail-section` for every internal group.
- Do not use card-in-card styling for internal groups.

Legacy layout to migrate away from:

```text
detail-section title
└── detail-form
    ├── form-subgroup
    │   ├── form-subgroup__head
    │   └── detail-form-grid
    └── form-subgroup
        ├── form-subgroup__head
        └── detail-form-grid
```

Anti-patterns:

- A long form sliced by heavy horizontal lines.
- Group titles competing with module titles.
- Large blank areas after each group.
- Groups named with generic labels such as `基础信息1` or backend categories.

## Business Option Groups

Use structured option groups for service items, attribute types, object flags, and similar multi-select business markers.

- Use Arco `a-checkbox-group` with `a-space` or `a-row`/`a-col`; do not invent tag-like checkbox controls.
- Service items and object attributes are user selection actions, not status badges.
- Do not render checkbox chips with native `<button>` elements. Use Arco checkbox or a custom element with `role="checkbox"`, `aria-checked`, and keyboard support.
- Each option must show checkbox affordance: empty square when unselected, checked square when selected.
- Selected items use subtle primary or semantic tint, not strong filled badges.
- Unselected items must remain readable and visibly selectable.
- Disabled/read-only mode must remain readable and should not look interactive.
- Risk-sensitive options use warning semantic tokens.
- Do not use raw `<button>` browser styling, disconnected outline chips, black-border selected state, or status-pill styling for business option groups.

## Module Header Rule

The top-level header owns `title | state | actions`; its title slot contains only the module name and its action slot only module-owned commands. Sourced metrics use one adjacent 28-32px summary row below the 36px head, omitted when empty. Repeated-child heads keep child identity, a neutral role/attribute marker, child-only metrics, and child actions together. Never repeat a metric in module, child, and table levels.

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

Choose repeated modules from the page's object model, cardinality, and ownership graph. The skill does not prescribe named business modules. A page creates a repeated module only when its requirements contain a real collection, and records that module's name, rows, metrics, actions, editability, and data source in `pageSpec.ts`.

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
- Expanded child items must remain identifiable while scrolling through a visible selected/expanded state, sequence, or sticky identity; do not add a decorative accent when structure already makes ownership clear.
- The parent summary, child identity band, pane header, and line table header must each have a distinct role. If they all look like plain white rows, the module fails PESDP even when spacing is compact.
- Use Arco primary only for real current, selected, expanded, focused, or interactive state. Nested ownership is expressed first through structure, labels, sequence, and alignment; do not decorate every level with primary color.
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

### Inline Editable Table Visual Rules
When a detail section contains a VXE table with editable cells (`a-input`, `a-select`, `a-date-picker` inside columns), record its editable-detail role in `pageSpec.ts` and configure it through VXE public props. Controls keep GI native small styling.

Container:

```vue
<div class="detail-section__body detail-section__body--table">
  <vxe-table
    size="mini"
    :stripe="false"
    :data="rows"
    :row-config="{ isHover: true, keyField: 'id' }"
  >
    <!-- columns -->
  </vxe-table>
</div>
```

Required:

- Use `detail-section__body--table` on the section body (or `detail-child-pane__table` for nested child panes).
- Declare `table.rowBanding: 'plain'` for always-editable line tables and set VXE's public `:stripe="false"`; input, validation, hover, and selection remain the row-state owners.
- Use the project VXE `mini` density and explicit `mini` row controls; verify controls, validation, hover, and fixed actions are not clipped.
- In a Drawer or intrinsic-height pane, omit the VXE `height` prop. `height="auto"` is forbidden because pinned VXE 4.5 can feed the measured parent height back into its own content height and grow indefinitely.
- Business columns use `min-width`; only checkbox / seq / operation use fixed `width` (see `table.md` width policy).

Forbidden:

- `show-overflow` / `show-header-overflow` on editable detail tables (causes clipping and header/body misalignment).
- `detail-child-pane__desc` when the child title and field labels already explain the block (no redundant module copy).
- Page-scoped wrappers with `overflow: hidden` around wide detail tables.
- `height="auto"` on an embedded VXE table whose Drawer body or detail pane already owns vertical scrolling.
- Styling VXE `td` / cell internals to force density.
- Inferring the table role from a CSS class instead of recording it in the page specification and public VXE configuration.

Form grid in detail drawers:

- `detail-form-grid` children need `min-width: 0`; controls in `.detail-form` must be `width: 100%`.
- Date/picker controls must also declare `size="small"` and `width: 100%` where needed.

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
- Combo groups use CSS grid/flex for widths only; every child keeps its native GI border, focus, and small size.

## Footer

- Submit/confirm is primary.
- Save draft is default/outline.
- Abandon/delete is danger and confirmed.
- Footer is sticky and always visible. Its left side owns persistent `saved | dirty count | saving | recoverable failure`; do not use a transient Message as the only dirty/error signal.
- Use Arco Space/Flex: status and optional danger remain left; cancel/discard and one primary commit stay right. Disable no-op discard/save when no changes exist (see `actions.md`).

## Release Gate

- [ ] The default mode matches the declared `user_job`; identity, key state, blocking risk, next action, owner, and current workflow position remain coherent in both modes.
- [ ] Edit mode replaces the same owned fields without reordering sections; cancel restores the saved snapshot and failure preserves input.
- [ ] Each count, summary, error, and action has one owner; no nested cards, duplicate KPI strips, or repeated header/footer actions.
- [ ] The active pane/Drawer body has one vertical scroll owner; embedded VXE tables do not create height feedback or clipped controls.
- [ ] Row editing remains local with save/cancel/error state; object-level save never silently commits an active row edit.
- [ ] At 1366x768 and 1024x768, long values remain readable, actions stay reachable, and keyboard/focus order preserves the workflow.
