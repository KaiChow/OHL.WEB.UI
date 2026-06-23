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

## Reusable Sub-Entity Modules

| Module type | Use for | Body pattern |
|-------------|---------|--------------|
| Attachment module | 单证, 报关资料, 提单, 图片 | Upload slot or compact file table; status with Tag or `.s-pill`. |
| Line table module | 费用明细, 货物明细, 库存明细 | VXE mini table; numeric right aligned; operation column compact. |
| Party/contact module | 发货人, 收货人, 客户联系人, 责任人 | Inline chips in view mode; editable table/form rows in edit mode. |
| Timeline/log module | 操作日志, 审核记录, 节点轨迹 | Time ordered list; no decorative cards per item unless repeated dense rows need separation. |
| Exception module | 异常, 差异, 风险项 | Semantic status; action/owner/deadline visible; no full-row color blocks. |

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
