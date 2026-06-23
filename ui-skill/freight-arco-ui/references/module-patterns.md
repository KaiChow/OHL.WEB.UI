# Module Patterns

## Purpose

Use this file to design reusable module behavior for a large freight SaaS system.

The skill must define patterns, slots, and decision rules. It must not hard-code one page such as `业务单` and then copy it to every menu.

## Abstraction Rule

Design every page by filling these slots:

1. Business object: what record is the page about?
2. User job: scan, create, audit, reconcile, operate, configure, or analyze?
3. Primary identity: which fields identify the object?
4. Key state: which status or milestone changes user decisions?
5. Main working data: which table/form fields users operate most?
6. Supporting data: which metadata, remarks, attachments, logs, or audit fields are secondary?
7. High-frequency actions: which actions must be one click?
8. Low-frequency or dangerous actions: which actions must be grouped or confirmed?

Do not start from a visual template. Start from these slots, then choose the archetype.

## Object Identity Slots

Every business object needs a compact identity model.

| Object type | Primary identity | Key facts | Typical status |
|-------------|------------------|-----------|----------------|
| Business order / shipment | 业务单号 / 订单编号 | 客户, 航线, ETD/ETA, 船公司/航司 | 待审核, 已接单, 已订舱, 已放舱 |
| Customer | 客户名称 / 客户编码 | 负责人, 类型, 信用, 最近跟进 | 未合作, 已合作, 冻结, 风险 |
| Receivable / payable bill | 账单号 | 客户/供应商, 币种, 金额, 到期日 | 未确认, 已确认, 已开票, 已核销 |
| Reconciliation | 对账单号 | 往来单位, 期间, 差异金额 | 待对账, 已确认, 有差异 |
| Warehouse receipt | 入仓单号 / 出仓单号 | 仓库, 件数, 重量, 体积, 入仓时间 | 待入仓, 已入仓, 异常 |
| Trucking / delivery task | 委托单号 / 派送单号 | 车队, 地址, 预约时间, 柜号 | 待派车, 已派车, 已完成, 异常 |
| Customs declaration | 报关单号 | 客户, 口岸, 报关方式, 截关时间 | 待报关, 报关中, 已报关, 退单 |
| Master data / configuration | 编码 / 名称 | 启用状态, 归属组织, 更新时间 | 启用, 停用 |

These are examples for choosing fields. Do not force all objects to show route, ETD/ETA, or milestones.

## Page Slot Contract

### List / Workbench

Required slots:

- Segment slot: optional business scope such as transport mode, settlement type, warehouse, bill type.
- Filter slot: high-frequency fields first; advanced filters are grouped by business meaning.
- Toolbar slot: one primary action, direct secondary actions, grouped low-frequency actions, utility actions.
- Status slot: scope/status tabs only when they change the table result.
- Table slot: object identity, key status, main working fields, next-decision fields, actions.
- Pagination/settings slot: table cap right side.

### Detail / Drawer

Required slots:

- Identity slot: status, primary no/name, owner/company/context.
- Fact slot: 3-6 key facts that explain the record. Pick facts by object type.
- Milestone slot: optional. Use only when the object has a real business process.
- Section slot: business groups in operation order.
- Sub-entity slot: repeated cargo, attachment, fee, contact, delivery, or declaration modules.
- Footer slot: save/submit/cancel/danger actions.

### Create / Edit Form

Required slots:

- Draft identity slot: object type, draft/generated number, current state.
- Required-core slot: fields needed to create a valid object.
- Business-group slots: stable groups by business meaning.
- Repeated-module slots: sub-entities with add/copy/delete.
- Validation slot: field-level errors and submit-time scroll target.
- Footer slot: cancel, save draft, submit.

### Dashboard / Analysis

Required slots:

- Scope/time slot.
- KPI slot with a limited number of decision metrics.
- Analysis slot: charts only when they answer a business question.
- Drill-down slot: VXE table for the records behind metrics.

## Module Header Contract

Module header is structural, not a data summary.

- Left: module name only.
- Right: module-level actions only.
- Body top: counts, totals, upload state, helper text, or progress summary.

This applies to every module type: cargo, files, fees, contacts, customs, delivery, warehouse, finance lines, logs.

## Module Display Contract

Every business module must have a predictable visual structure.

```text
module surface
├── module head
│   ├── title
│   └── actions
├── optional summary row
├── optional form/body content
├── optional table/list content
└── optional empty/validation state
```

### Surface

- Use one visible surface per business module.
- Use Arco token background, border, and radius from global classes.
- Do not nest decorative cards inside a module.
- Do not create floating panels for small subgroups.
- Separate adjacent modules with the global module gap, not heavy shadows.

### Header

- Left: one module title only.
- Right: module-level actions only.
- Actions must use object-specific labels: `添加发货人`, `添加明细`, `上传附件`, `导入费用`.
- Do not use a bare `添加` when multiple entity levels exist.
- Do not show totals, count, status, helper text, upload state, or selected state in the header.

### Summary Row

Use a summary row when the user needs whole-module situation before editing details.

Allowed:

- counts
- totals
- validation progress
- upload status
- missing required count

Rules:

- Summary labels use auxiliary typography.
- Summary values use data typography.
- Use neutral color by default; semantic color only for warning, exception, or completion.
- Do not repeat the same summary in child heads or table captions.

### Body

- Body order must follow operation order.
- Forms should use `detail-form` and `detail-form-grid`.
- Tables should use VXE or shared mini table rules.
- Empty content must show an explicit empty state with the next action when editable.
- Avoid blank strips, collapsed empty tables, and unlabeled rows.

### Module Type Decision

| Situation | Use |
|-----------|-----|
| One stable field group | `detail-section` |
| One editable repeated row set | `detail-module` + line table |
| Repeated parent with child line rows | parent-child detail module |
| File/document management | attachment module |
| Read-only audit/history | timeline/log module |
| Risk or exception queue | exception module |

### Anti-Patterns

- Module header with title + count + action + helper text.
- Independent card for every child row.
- Two tables inside one module without a clear parent-child relationship.
- Add button separated from the table/list it affects.
- Empty table body shown as whitespace without action or reason.
- Using border-heavy Excel style to create hierarchy.

## Reusable Sub-Entity Modules

| Module type | Use for | Body pattern |
|-------------|---------|--------------|
| Attachment module | 单证, 报关资料, 提单, 图片 | Upload slot or compact file table; status with Tag or `.s-pill`. |
| Line table module | 费用明细, 货物明细, 库存明细 | VXE mini table; numeric right aligned; operation column compact. |
| Party/contact module | 发货人, 收货人, 客户联系人, 责任人 | Inline chips in view mode; editable table/form rows in edit mode. |
| Timeline/log module | 操作日志, 审核记录, 节点轨迹 | Time ordered list; no decorative cards per item unless repeated dense rows need separation. |
| Exception module | 异常, 差异, 风险项 | Semantic status; action/owner/deadline visible; no full-row color blocks. |

### Party / Staff Display

Use this for responsibility owners, operators, customer contacts, shipper/consignee contacts, and similar people/party data.

Read-only mode:

- Show role + person/party name as the minimum readable unit.
- Person/party name is the primary value (`color-text-1`, data typography).
- Role is a compact semantic label or left marker, not weak disabled text.
- Company/department/contact context is auxiliary (`color-text-3`) but remains readable.
- Do not render critical party data as a row of pale tags with no hierarchy.
- Do not use `color-text-4` unless the value is missing or disabled.

Edit mode:

- Use compact table/form rows when the user can change company, role, and person.
- Add action label must name the entity, such as `添加责任人` or `添加联系人`.
- Delete is row-level danger action and should stay with the row it affects.

Anti-patterns:

- `业务 赵六 / 操作 张三` as low-contrast tags only.
- Role, name, and company all using the same weak gray.
- Hiding company context when the same person name can appear in multiple companies.

## Parent-Child Detail Modules

Use this pattern when one business section owns repeated parent entities and each parent owns repeated line rows.

Examples include cargo party + cargo lines, fee group + fee lines, delivery party + delivery lines, declaration group + declaration documents, warehouse task + stock lines. These examples are for choosing the pattern only; do not hard-code their fields into other modules.

### Structure

```text
detail-module
├── detail-section__head
│   ├── title only
│   └── module-level actions only
├── detail-module-summary
│   └── whole-module counts/totals/progress
└── detail-child-list
    ├── detail-child-item
    │   ├── child head: child identity + optional child-level stats + collapse/action
    │   ├── child core form: fields that identify this child entity
    │   └── child line table: rows owned by this child
    └── detail-child-item
```

### Hierarchy Rules

- Parent module owns the module title, whole-module totals, and module-level add/copy/import actions.
- Child item owns one child identity, its form fields, its line table, child-level totals, and child-level delete/collapse.
- Line table owns row fields and row-level add/delete/edit.
- Do not show the same total in parent summary, child head, and table header.
- Do not create an independent card, shadow, or border-heavy panel for every child item.
- Do not put module totals or helper copy in the module title line.
- Do not put child-level actions far away from the child they affect.

### Interaction Rules

- Parent add action creates a new child entity.
- Child add action creates a new line row inside that child.
- Child delete is danger and confirmed.
- Line delete is danger and confirmed only when data has been saved or deletion is destructive.
- Collapse applies to the child item only. Collapsed child head must still show enough identity to recognize it.
- Default expansion: expand the first child and any child with validation errors; collapse additional complete children when the list is long.
- Keyboard support is required for custom collapse or checkbox-like controls.

### Visual Rules

- Use one outer module surface. Child items are separated by low-contrast dividers or subtle tinted headers, not nested cards.
- Use one primary vertical rhythm: module summary, child head, child body, line table.
- Child form fields should use the same `detail-form` and `detail-form-grid` rules as normal sections.
- Child line rows should use VXE mini table or the shared mini table class; numeric fields right aligned and operation column compact.
- Empty line tables must show one clear empty/add state, not a blank compressed strip.

## Hard-Coding Checks

Before delivering a page or skill update, reject these:

- A finance page showing route/ETD because the order detail did.
- A customer page showing shipment milestones because the drawer component has steps.
- Every module using the same fields, columns, or actions.
- A class name becoming a business requirement. For example, `dds-hero` means "key facts area", not "must show route".
- A copied page structure that ignores the user's real task.

## Generation Rule

For every new page, write a short internal mapping before implementation:

```text
Archetype:
Business object:
User job:
Primary identity:
Key state:
Main table/form fields:
Repeated modules:
Primary action:
Grouped actions:
```

Then implement using existing global classes.
