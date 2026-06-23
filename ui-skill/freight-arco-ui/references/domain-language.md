# Domain Language

## Purpose

Use freight-forwarding language as the UI language. Generic SaaS wording reduces trust and makes the system feel like an ordinary admin backend.

This file controls labels, statuses, workflow milestones, table columns, action wording, and empty-state copy.

## Naming Principles

- Use business terms users already say at work.
- Preserve standard English abbreviations: FCL, LCL, HBL, MBL, SO, PO, ETD, ETA, POD, POL, CFS, CY, CBM, KG.
- Use Chinese labels for operational clarity, with abbreviations when the abbreviation is the industry term.
- Do not invent simplified marketing names for freight concepts.
- Do not replace business nouns with generic platform nouns such as `任务`, `流程`, `项目`, `内容`.

## Forbidden Generic Wording

Avoid these unless the business itself uses them:

| Avoid | Prefer |
|-------|--------|
| 步骤1 / 步骤2 | 接单 / 订舱 / 进仓 / 报关 / 开船 / 到港 |
| 处理中 / 进行中 | 操作待接单 / 已订舱 / 待报关 / 已放舱 |
| 完成 | 已到港 / 已签收 / 已结算 / 已放舱 |
| 详情信息 | 业务概览 / 基础信息 / 货物信息 / 报关信息 |
| 相关信息 | 运输节点 / 单证信息 / 费用信息 / 操作日志 |
| 文件 | 附件 / 单证 / 报关资料 / 提单文件 |
| 添加项目 | 添加发货人 / 添加货物 / 添加派送信息 |

## Core Module Names

Use stable module names in menu, route titles, tabs, and page headings:

| Area | Preferred names |
|------|-----------------|
| Order | 业务单, 出口海运订单, 出口空运订单, 出口铁路订单, 所有订单 |
| Customer | 客户池, 客户档案, 客户联系人 |
| Shipping | 舱位管理, 船期管理, 航线管理, 船公司 |
| Warehouse | 入仓管理, 出仓管理, 库存查询, 货架管理 |
| Trucking | 拖车委托, 派送信息, 车队管理 |
| Customs | 报关信息, 清关信息, 报关资料 |
| Finance | 应收账单, 应付账单, 核销, 结算, 对账 |
| Documents | 单证, 附件, 提单, HBL, MBL |

## Freight Status Vocabulary

Use `.s-pill[data-s]` or Arco Tag with the same semantic mapping.

| Business status | data-s | Semantics |
|-----------------|--------|-----------|
| 草稿 | draft | Not submitted |
| 未提交 | draft | Created but not submitted |
| 待审核 | wait | Needs attention |
| 待接单 | wait | Waiting for operator acceptance |
| 操作待接单 | op | Operational handoff pending |
| 已接单 | op | Operation accepted |
| 已订舱 | op | Booking completed |
| 已放舱 | rel | Space released |
| 已进仓 | acc | Cargo received |
| 待报关 | wait | Customs pending |
| 报关中 | op | Customs processing |
| 已报关 | acc | Customs completed |
| 已开船 | rel | Vessel departed |
| 已到港 | rel | Arrived at destination port |
| 已签收 | rel | Delivered/signed |
| 已结算 | rel | Financially settled |
| 已拒绝 | rej | Rejected |
| 异常 | rej | Exception |
| 已废弃 | draft | Abandoned/inactive |

Do not expose raw codes unless the page is a developer/configuration page.

## Milestone Names

For sea export order details, use:

1. 接单
2. 订舱
3. 进仓
4. 报关
5. 开船
6. 到港

For air export:

1. 接单
2. 订舱
3. 入仓
4. 报关
5. 起飞
6. 到港

For rail export:

1. 接单
2. 订舱
3. 装箱
4. 报关
5. 发车
6. 到站

Use transport-specific terms. Do not reuse sea terms for air/rail when they are wrong.

## Field Label Rules

- Keep long but meaningful labels visible. `大船船名/航次` is better than truncating to `船名`.
- If a long label causes layout issues, adjust grid/label layout instead of abbreviating business meaning.
- Required mark belongs to the label, not the placeholder.
- Placeholder describes expected input only, not business explanation.

Preferred field labels:

| Concept | Label |
|---------|-------|
| Order no | 订单编号 |
| Business order no | 业务单号 |
| Warehouse receipt no | 入仓单号 |
| Customer service order no | 客服单证 |
| House B/L | HBL 单号 |
| Master B/L | MBL 单号 |
| Container | 柜号 |
| Container type/qty | 柜型柜量 |
| Port of loading | 起运港 |
| Port of discharge | 目的港 |
| Final destination | 目的地 |
| Carrier | 船公司 / 航司 |
| Vessel voyage | 大船船名/航次 |
| Trade terms | 贸易条款 |
| Transport terms | 运输条款 |

## Copy Tone

- Be direct and operational.
- Empty states should tell users the next useful action, not give marketing copy.
- Error messages should mention the failed business object: `业务单提交失败`, `附件上传失败`, `报关资料缺失`.
- Avoid playful tone, emoji, marketing adjectives, and decorative slogans.
