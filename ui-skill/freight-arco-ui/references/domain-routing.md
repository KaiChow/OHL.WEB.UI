# Domain Routing (Large System)

## Purpose

This file maps **business areas** in the OHL freight platform to **page archetypes** and **reference docs**. Use it after `module-patterns.md` slot filling.

One design system serves all domains. Domains differ by **object + job + archetype**, not by separate CSS themes.

## Routing Table

| Business area | Typical objects | User job | Archetype | Primary references |
|---------------|-----------------|----------|-----------|-------------------|
| 出口/业务单、操作台 | 业务单、订舱、报关 | scan · operate | A + B | `list-page` · `detail-form` · `table` |
| 客户端下单 | 委托单草稿 | create | C | `full-page-form` · `upload` |
| CRM | 客户、联系人、跟进 | scan · create | A + B | `list-page` · `detail-form` · `domain-language` |
| 运价 | 价卡、运价行、有效期 | scan · configure | A (+ E compare) | `list-page` · `table` · `master-data` |
| 仓储 | 入仓单、库存、库位 | scan · operate | A + F | `list-page` · `detail-form` · `table` |
| 财务/对账 | 账单、核销、利润 | scan · reconcile | A + E | `list-page` · `table` · `detail-form` |
| 基础信息 | 港口、船司、字典 | configure | D | **`master-data.md`** |
| 用户/组织 | 用户、部门 | configure | D or A | **`master-data.md`** · `list-page` |
| 权限 | 角色、菜单、数据范围 | configure | D | **`permissions.md`** |
| 系统设置 | 参数、开关、集成 | configure | D | `master-data` · `detail-form` |
| 文件/单证中心 | 附件、单证包 | scan | A | `list-page` · `upload` · `table` |
| 通知管理 | 通知、公告 | scan · create | A + H | `list-page` · `modal` |
| BI / 报表 | 指标、维度 | analyze | G | **`dashboard.md`** |
| 行政 / HR | 申请、档案、考勤 | scan · approve | A + C/B | `list-page` · `full-page-form` · `domain-language` |

## Decision Rules

1. **Scan many records daily** → Archetype **A** (workbench list).
2. **Inspect one record without losing list** → **B** (detail drawer).
3. **Create/edit a full object as the page task** → **C** (`full-page-form`).
4. **Tree/category + table or form** → **D** (`master-data` or `permissions`).
5. **Money columns + batch** → **E** rules in `page-archetypes` + `table` numeric columns.
6. **Physical qty/location scanning** → **F** + warehouse language in `domain-language`.
7. **KPI + chart + drill-down** → **G** (`dashboard`).
8. **≤8 fields single action** → **H** (`modal`).

## Cross-Domain Forbidden

- Do not copy shipment-order columns into CRM, HR, or settings pages.
- Do not use `dds-hero` / `dds-milestone-bar` on master-data or permission pages.
- Do not use operational workbench density on BI dashboards without adjusting row height and chart spacing.
- Do not use `a-table` in any domain.
- Do not invent a new layout class when `md-layout`, `perm-layout`, `db-wrap`, or `xf-wrap` already fits.

## Read Order For New Menu

1. This file → pick archetype + references.
2. `module-patterns.md` → fill slots.
3. `domain-language.md` → labels/status for the object.
4. Topic references from the routing table.
5. `checklist.md` + `node scripts/check-spec.js`.
