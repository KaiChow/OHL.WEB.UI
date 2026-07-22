# Domain Language

Freight **wording** only. For page structure and slots, see [`module-patterns.md`](module-patterns.md).

## Purpose

Use freight-forwarding language as the UI language. Generic SaaS wording reduces trust and makes the system feel like an ordinary admin backend.

This file controls labels, statuses, workflow milestones, table columns, action wording, and empty-state copy.

Referenced by [`module-patterns.md`](module-patterns.md) for per-object field and label choices.

## Object Identity Examples

Examples for filling `primary_identity`, key facts, and status slots. **Do not copy every column to every page.**

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
Status visualization means semantic text, background, and border. A leading status dot is optional and must not be treated as the default freight status style.

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

Workflow status and risk attributes must not be mixed:

- Workflow status: `待审核`, `已接单`, `已放舱`, `已拒绝`, `已废弃`.
- Risk/attribute label: `危险货`, `超大件`, `带电池`, `化工品`.
- Risk labels may use a warning icon or semantic pill, but should not use the same dot convention as workflow status.
- In dense list tables, cargo type and risk attributes should not use workflow status pill styling. Keep the column baseline consistent and use a lightweight cargo/risk token when emphasis is needed.
- Do not show normal cargo values as plain text and risk values as icon-heavy status pills in the same column; this breaks scan rhythm and makes risk look like workflow status.

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

## Platform & Corporate Modules

Use these module names and labels outside shipment operations. Do not reuse 业务单/ETD/MBL columns on these pages.

| Area | Module names | Primary identity | Typical status |
|------|--------------|------------------|----------------|
| 用户管理 | 用户管理、账号管理 | 登录账号 / 工号 | 启用、停用、锁定 |
| 组织 | 组织架构、部门管理 | 部门名称 / 组织编码 | 启用、停用 |
| 权限 | 角色管理、权限配置 | 角色名称 | 系统角色、自定义 |
| 系统设置 | 系统设置、参数配置 | 参数组 / 配置项名称 | 已启用、已停用 |
| 通知 | 通知列表、公告管理 | 主题 | 草稿、待发布、已发布、已过期 |
| 文件中心 | 文件管理、单证中心 | 文件名 / 单证类型 | 已上传、待审核、已归档 |
| 运价 | 运价维护、价卡管理 | 价卡名称 / 航线 | 生效、失效、待审核 |
| BI | 经营看板、业务分析 | 指标名称 / 报表名称 | — |
| 行政 | 行政申请、用印申请 | 申请单号 | 待审批、已通过、已驳回 |
| HR | 人事档案、请假申请 | 员工姓名 / 申请单号 | 待审批、已通过、已驳回 |
| 客户端 | 在线下单、委托录入 | 委托编号 / 草稿号 | 草稿、已提交、已受理 |

### Platform status mapping

| Label | data-s |
|-------|--------|
| 启用 / 已启用 / 已发布 / 已通过 | acc / rel |
| 停用 / 已停用 / 已过期 | draft |
| 待审核 / 待审批 / 待发布 | wait |
| 锁定 / 已驳回 / 失败 | rej |
| 处理中 | op |

### Platform copy examples

| Avoid | Prefer |
|-------|--------|
| 用户详情信息 | 账号信息 / 基本信息 |
| 配置项 | 参数名称（写清业务含义）|
| 提交申请 | 提交请假申请 / 提交用印申请 |
| 暂无内容 | 暂无角色，点击新建角色 |
