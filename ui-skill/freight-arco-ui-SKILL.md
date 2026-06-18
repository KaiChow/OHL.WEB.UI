---
name: freight-arco-ui
description: 国际货代/物流中后台系统 UI 设计系统规范（PESDP设计体系）。基于 Vue 3 + TypeScript + Arco Design Vue（gi-demo 主题）+ VXE Table。任何涉及页面、组件、布局、样式、交互、设计质量的任务都应加载本规范。关键词触发：订单/财务/仓储/舱位/拖车/权限模块、列表页、详情页、表单页、弹窗、UI 规范、不好看、质感、高密度、设计感、Arco、排版、查询区、状态筛选、工具栏、行操作、分页、色彩、字体、间距、高级感、AI生成页面。
---

# 货代中后台 UI 设计系统规范

> **本规范的核心价值**：不是代码片段库，而是设计思维的编码。
> 任何 AI 读完本规范后，面对任意新页面需求，都能独立推导出符合本系统规范的实现。

---

## 一、设计定位（所有决策的根基）

### 1.1 设计目标

货代管理系统属于典型的**企业级生产工具（Production System）**。

系统服务对象：销售人员、客服人员、操作人员、单证人员、财务人员、管理人员。  
用户每天平均使用时长通常超过 **8 小时**，属于高频、高强度业务系统。

**设计使命**：通过统一的设计体系，将复杂的国际物流业务进行结构化表达，使用户能够：更快找到信息、更快理解业务状态、更快完成操作、更少出现业务错误。

**最终目标：让复杂业务变得清晰，让高频操作变得高效。**

---

#### 设计目标优先级（从高到低）

| 优先级 | 目标 | 含义 |
|--------|------|------|
| ① | **业务效率** | 减少操作步骤、页面跳转、重复录入、处理时间 |
| ② | **信息效率** | 快速找到订单、识别状态、发现异常、定位问题 |
| ③ | **操作效率** | 快速查询/筛选/批量处理/审批/导出 |
| ④ | **学习成本** | 新员工容易上手，老员工无需重新学习，模块逻辑统一 |
| ⑤ | **视觉品质** | 专业、稳定、现代、高级、可信（视觉服务于业务）|

> **核心判断**：当业务效率与视觉效果发生冲突时，**优先保证业务效率**。

---

#### 用户体验三原则

| 原则 | 目标 |
|------|------|
| **3 秒原则** | 进入页面 3 秒内，用户知道：当前页面是什么、重点信息是什么、当前状态是什么 |
| **10 秒原则** | 进入页面 10 秒内，能完成主要业务动作（查询/查看状态/打开详情/发起操作）|
| **30 秒原则** | 进入模块 30 秒内，能理解当前业务场景，无需反复学习或咨询他人 |

---

### 1.2 系统定位

**Cargo SaaS Premium Dense** — 面向国际物流行业的高密度企业级 SaaS 管理平台。

设计语言特点：

| 维度 | 定位 |
|------|------|
| 信息密度 | **Dense（高密度）**：每屏尽量多展示数据行，不是展示型 |
| 信息层级 | **Hierarchy（强层级）**：主/副/辅助信息三层分明 |
| 业务效率 | **Efficiency（高效率）**：减少操作步骤，不依赖弹窗确认 |
| 一致性 | **Consistency（高一致）**：同类场景统一规则 |
| 视觉噪音 | **Low Noise（低噪音）**：无多余边框、装饰、动效 |
| 长时可用 | **Long-term Usability**：连续使用 8 小时不视觉疲劳 |

---

### 1.3 四个反模式（必须规避）

| 反模式 | 典型症状 | 为什么错 |
|--------|---------|---------|
| **传统 ERP** | 每列竖线边框、背景灰白交替、字段堆砌、无信息层级 | 边框噪音过多，视线无法快速扫描 |
| **OA 系统** | 行政导向、信息松散、搜索区占 1/3 高度的大卡片 | 业务主线不清晰，操作步骤多 |
| **展示型 SaaS** | 大面积留白、超大卡片、每屏仅 5 条数据 | 货代业务员需同时看 20+ 条订单 |
| **互联网运营后台** | 强营销视觉、大面积图表、到处 Banner | 分散业务注意力，不适合高频操作 |

---

### 1.4 设计价值观

```
业务 > 视觉        页面核心是数据/状态/业务信息，不是图标/装饰/视觉特效
信息 > 装饰        信息展示服务业务，不是为了好看
一致性 > 创新      同类场景同一规则，比局部创新更重要
长期使用 > 短期惊艳  避免过度设计造成 8 小时以上的视觉疲劳
```

---

### 1.5 页面上线验证清单

任何页面、模块上线前，必须通过以下验证：

```
□ 是否符合物流行业业务认知？
□ 是否提升用户工作效率？
□ 是否具备清晰的信息层级？
□ 是否保持高信息密度而不拥挤？
□ 是否体现现代企业级产品的高级感？
□ 是否避免了传统 ERP / OA / 展示型 SaaS 风格？
```

只有同时满足以上要求，才符合本系统设计定位
---

## 二、设计推导原则（六条核心规则）

> **读懂这六条规则，你就能推导出本系统任意页面的正确实现。**

### 原则 1：信息层级三段式

每个数据单元按重要性分三层：

```
主信息（Primary）  — font-size: 13px, font-weight: 500, color: var(--color-text-1)
副信息（Secondary）— font-size: 11px, font-weight: 400, color: var(--color-text-3)
占位（Empty）      — "—"，color: var(--color-text-4)
```

**推导应用**：

- 表格单元格里有两类信息 → 双行布局：上行主信息、下行副信息
- 搜索字段标签 → 副信息字号，不抢主输入框的注意力
- 空值 → 统一用"—"而不是空格、"-"、"无"

### 原则 2：区域优先级决定视觉重量

页面从上到下，区域的"视觉重量"（高度、背景、边框）应与其业务重要性正相关：

```
表格主体（最重要）→ 最大面积，占满剩余高度
工具栏（次要）    → 紧凑单行，40px 高度
搜索区（辅助）    → 扁平单行，不单独成卡
状态 Tab（导航）  → 下划线式，不用凸起式 Tab
```

**推导应用**：

- 新页面来了 → 先画垂直区域划分，把最多高度给表格
- 搜索条件出现 → 扁平横排行，绝不做成搜索卡片
- 统计数字出现 → KPI 条（紧凑横排），不做大图表

### 原则 3：操作按钮层级

```
主操作（新建/提交）  → type="primary"，1个，放在工具栏左侧第一位
次要操作（导出/批量）→ type="outline"，放在主按钮右侧
工具操作（密度/列）  → type="text"，放在工具栏右侧
行内操作（查看/编辑）→ 纯图标 + tooltip，不写文字，size="mini"
```

**推导应用**：

- 任何工具栏 → 左主操作、右工具，中间弹性分隔
- 表格行操作 → 最多 3 个图标按钮（eye/edit/more），超出放进 more 下拉
- 危险操作 → 必须在下拉菜单里，加 status="danger"，不能直接暴露

### 原则 4：颜色用于传递语义，不是装饰

```
蓝（primary-6）   → 交互元素（可点击、选中、主按钮）
橙（warning-6）   → 需要注意（待审核、警告）
红（danger-6）    → 需要立即处理（异常、拒绝、错误）
绿（success-6）   → 完成/正常（已完成、成功）
紫（purple-6）    → 待操作流程中间态（待接单）
青（cyan-6）      → 进行中偏好状态（已放舱）
灰（color-text-4）→ 禁用/不重要
```

**推导应用**：

- 状态 badge → 从上面选颜色，背景用对应 -1 变量，文字用 -7 变量
- 状态语义**仅体现在状态列**（`.s-pill` / Tag），**禁止整行铺底色**
- 行 hover → 统一浅蓝灰（`#eef3ff`），不按状态分色

### 原则 5：边框只用于分区，不用于区分列/格

```
水平分隔线  → 各区域之间（搜索行/工具栏/表格），border-bottom: 1px solid var(--color-border-1)
表格行分隔  → border-bottom: 1px solid #f0f3f8（比 border-1 更浅）
禁止        → 表格列竖线、单元格四周边框、搜索字段外框
```

**VXE Table 特殊处理**（必须）：
VXE 用 `background-image: linear-gradient()` 模拟边框，CSS border 属性无效。
消除方式：

```css
.freight-table .vxe-header--column,
.freight-table .vxe-body--column {
  background-image: none !important;
  border-right: 0 !important;
  border-bottom: 1px solid #f0f3f8 !important;
}
```

### 原则 6：组件 size 统一使用 small，行内用 mini

```
搜索区输入框/下拉    → size="small"
工具栏按钮          → size="small"
表格内按钮          → size="mini"
弹窗表单字段        → size="small"
```

**禁止**：搜索区用默认 size（太大），弹窗里用 large（太占空间）。

---

## 三、页面布局架构

### 3.1 列表页标准布局（5 层结构）

```
┌──────────────────────────────────────────────────────┐
│ [运输方式 Tab]  海运 · 空运 · 铁路                    │ ← 顶部，可选
│──────────────────────────────────────────────────────│
│ [搜索行]  单号: [___]  客户: [___]  状态: [▼]  [查询] │ ← 扁平单行，白底
│──────────────────────────────────────────────────────│
│ [状态 Tab] 全部18  待审3  待接单3  异常3⚠            │ ← 下划线式
│──────────────────────────────────────────────────────│
│ [工具栏]  ＋新建  ↓导出  批量▼  ‥‥‥  列设置 密度 ↺ ← 左操作+右工具
│──────────────────────────────────────────────────────│
│                                                      │
│  [VXE 表格]  flex:1，填满剩余高度                     │
│                                                      │
│──────────────────────────────────────────────────────│
│ [底部状态条]  已选N行 · 共M条                   标准视图│ ← 可选
└──────────────────────────────────────────────────────┘
```

**实现骨架（index.vue）**：

```vue
<template>
  <div class="list-page">
    <TransportTabBar v-model="activeTransport" />  <!-- 可选 -->
    <SearchBar ... />
    <StatusTabBar ... />
    <Toolbar ... />
    <TableArea ... />          <!-- flex: 1 -->
    <FooterBar ... />          <!-- 可选 -->
  </div>
</template>

<style scoped>
.list-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-card);  /* 白色，无外边距 */
}
</style>
```

**关键约束**：

- 页面根元素 `height: 100%`，不加 `padding`，不加外层卡片
- 表格组件 `.table-wrap { flex: 1; min-height: 0; overflow: hidden; }`
- 页面内所有区域背景为白色（`--color-bg-card`），不是灰色底

### 3.2 详情页标准布局（左右分栏 + 时间线）

```
┌──────────────────────────────────────────────────────┐
│ [页头]  ← 返回  业务单 DCG2024010001  [状态badge]  操作按钮 │
│──────────────────────────────────────────────────────│
│                                    │                 │
│  [左侧主内容区 - 70%]              │ [右侧辅助 - 30%] │
│  ┌──────────────────────────┐      │  时间线/进度     │
│  │ 基本信息卡片              │      │  关联单证        │
│  ├──────────────────────────┤      │  备注            │
│  │ 运输信息卡片              │      │                 │
│  ├──────────────────────────┤      │                 │
│  │ 费用明细卡片              │      │                 │
│  └──────────────────────────┘      │                 │
└──────────────────────────────────────────────────────┘
```

### 3.3 表单弹窗标准布局

```
┌─────────────────────────────────────────┐
│ 标题                                  ✕ │
├─────────────────────────────────────────┤
│  [Section 标题]  ─────────────────────  │
│  字段标签:  [_______________]           │
│  字段标签:  [______]  字段标签: [_____]  │
│                                         │
│  [Section 标题]  ─────────────────────  │
│  ...                                    │
├─────────────────────────────────────────┤
│                        取消  [确 认]    │
└─────────────────────────────────────────┘
```

---

## 四、组件使用决策树

> 面对一个 UI 需求，按下面的决策树选择实现方式。

### 4.1 状态展示

```
需要展示状态？
│
├─ 在表格单元格内
│   ├─ 需要圆点 + 文字 → 自定义 .status-pill（见下方规范）
│   └─ 只需文字标签    → <a-tag size="small" :color="...">
│
├─ 在表格行左侧竖条  → .status-rail（3px 宽彩条，见规范）
├─ 在详情页头部      → <a-tag size="medium">
└─ 在状态 Tab 行     → 自定义 .stab 按钮 + .stab-count 数字徽章
```

**状态 Pill 实现（自定义，不用 arco-tag 底层）**：

```html
<span class="status-pill" :data-status="row.FollowState">
  {{ statusTextMap[row.FollowState] }}
</span>
```

```css
.status-pill {
  display: inline-flex; align-items: center;
  height: 20px; padding: 0 8px; border-radius: 10px;
  font-size: 11.5px; font-weight: 600; white-space: nowrap;
}
.status-pill[data-status="待审核"]    { background: #fff7e6; color: #d46b08; }
.status-pill[data-status="操作待接单"]{ background: #f4f0ff; color: #7c3aed; }
.status-pill[data-status="未提交"]    { background: #f4f4f4; color: #8c8c8c; }
.status-pill[data-status="已接单"]    { background: #e6f7ff; color: #0958d9; }
.status-pill[data-status="已放舱"]    { background: #e6fffb; color: #087170; }
.status-pill[data-status="已拒绝"]    { background: #fff1f0; color: #cf1322; }
/* 扩展新状态：背景用对应色 -1（极浅），文字用 -7（深） */
```

### 4.2 数据展示：单行 vs 双行单元格

```
单元格内只有一类信息？
├─ 是 → 单行：直接 <span class="c-main">{{ value }}</span>
└─ 否 → 双行：
    主信息（必须显示，是判断依据的）   → 上行，font-size: 13px, weight: 500
    副信息（辅助理解的，可以小些）    → 下行，font-size: 11px, color: text-3
```

**双行通用结构**：

```html
<div class="cell-two-line">
  <span class="c2-main clip">{{ primary }}</span>
  <span class="c2-sub">{{ secondary }}</span>
</div>
```

```css
.cell-two-line { display: flex; flex-direction: column; gap: 1px; justify-content: center; }
.c2-main { font-size: 13px; font-weight: 500; color: var(--color-text-1); line-height: 1.4; }
.c2-sub  { font-size: 11px; color: var(--color-text-3); line-height: 1.3; }
.clip    { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

**适用双行的典型列**：

- 客户：简称（上）+ 全称（下）
- 港口路线：代码（上）+ 中文名（下）（两端各一个 port-side）
- ETD/ETA：日期（上）+ 星期几（下）
- 节点状态：状态名（上）+ 发生时间（下）

### 4.3 搜索区字段

```
多少个搜索字段？
├─ ≤ 5 个 → 单行横排（page-search-bar，使用 .sf + .sf-label 模式）
├─ 6–10 个 → 单行横排 + "高级筛选" 展开按钮
└─ > 10 个 → 主搜 + 折叠面板，默认收起
```

**扁平搜索行实现**：

```html
<div class="search-bar">
  <div class="search-fields">
    <div class="sf">
      <span class="sf-label">单号</span>
      <a-input size="small" placeholder="..." style="width:176px" />
    </div>
    <div class="sf">
      <span class="sf-label">客户</span>
      <a-input size="small" placeholder="..." style="width:152px" />
    </div>
    <div class="sf">
      <span class="sf-label">状态</span>
      <a-select size="small" placeholder="全部" :options="..." style="width:120px" />
    </div>
  </div>
  <div class="search-actions">
    <a-button size="small" type="primary" @click="...">
      <template #icon><icon-search /></template>查询
    </a-button>
    <a-button size="small" type="outline" @click="...">
      <template #icon><icon-refresh /></template>重置
    </a-button>
  </div>
</div>
```

```css
.search-bar { display:flex; align-items:center; justify-content:space-between;
  padding:9px 16px; background:var(--color-bg-card); border-bottom:1px solid var(--color-border-1); }
.search-fields { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.sf { display:flex; align-items:center; gap:6px; }
.sf-label { font-size:12.5px; color:var(--color-text-2); white-space:nowrap; }
.search-actions { display:flex; gap:8px; flex-shrink:0; }
```

### 4.4 工具栏模式

**左主操作 + 右工具（每个工具栏必须遵循此模式）**：

```html
<div class="toolbar">
  <!-- 左：业务主操作 -->
  <div class="toolbar-left">
    <a-button size="small" type="primary"><template #icon><icon-plus /></template>新建</a-button>
    <a-button size="small" type="outline"><template #icon><icon-download /></template>导出</a-button>
    <a-dropdown trigger="click">
      <a-button size="small" type="outline">批量操作<template #icon><icon-down /></template></a-button>
      <template #content>
        <a-doption>批量导出</a-doption>
        <a-doption status="danger">批量废弃</a-doption>
      </template>
    </a-dropdown>
  </div>
  <!-- 右：视图工具 -->
  <div class="toolbar-right">
    <a-button size="small" type="text"><template #icon><icon-settings /></template>列设置</a-button>
    <a-button size="small" type="text" @click="toggleDensity">
      <template #icon><icon-align-center /></template>密度
    </a-button>
    <a-button size="small" type="text">保存视图</a-button>
    <a-button size="small" type="text" @click="refresh">
      <template #icon><icon-refresh /></template>
    </a-button>
    <a-divider direction="vertical" style="height:14px;margin:0 4px" />
    <a-pagination :current="..." :total="..." size="small" show-total show-page-size />
  </div>
</div>
```

```css
.toolbar { display:flex; align-items:center; justify-content:space-between;
  padding:7px 16px; background:var(--color-bg-card); border-bottom:1px solid var(--color-border-1); }
.toolbar-left  { display:flex; align-items:center; gap:6px; }
.toolbar-right { display:flex; align-items:center; gap:2px; }
```

### 4.5 状态 Tab 行（带数量徽章）

```html
<div class="status-tab-bar">
  <button
    v-for="tab in tabs" :key="tab.value"
    class="stab"
    :class="{ 'stab--active': phase === tab.value, 'stab--danger': tab.danger }"
    @click="phase = tab.value"
  >
    {{ tab.label }}
    <span class="stab-count"
      :class="{ 'stab-count--danger': tab.danger && counts[tab.value] > 0 }">
      {{ counts[tab.value] ?? 0 }}
    </span>
  </button>
</div>
```

```css
.status-tab-bar { display:flex; align-items:center; padding:0 16px;
  background:var(--color-bg-card); border-bottom:1px solid var(--color-border-1); overflow-x:auto; }
.stab { display:inline-flex; align-items:center; gap:5px; position:relative;
  padding:9px 12px; font-size:13px; color:var(--color-text-2);
  background:none; border:none; cursor:pointer; white-space:nowrap; }
.stab--active { color:var(--primary-6); font-weight:600; }
.stab--active::after { content:''; position:absolute; bottom:0; left:12px; right:12px;
  height:2px; background:var(--primary-6); border-radius:2px 2px 0 0; }
.stab--danger { color:var(--danger-6); }
.stab--danger.stab--active::after { background:var(--danger-6); }
.stab-count { font-size:11px; color:var(--color-text-3); font-variant-numeric:tabular-nums; }
.stab-count--danger { color:var(--danger-6); font-weight:700; }
```

---

## 五、VXE Table 标准实现

### 5.1 表格容器与属性规范

```vue
<template>
  <div class="table-wrap" :class="{ compact: density === 'compact' }">
    <vxe-table
      class="freight-table"
      border="none"           <!-- 必须，禁用内置边框 -->
      show-overflow="title"
      show-header-overflow="title"
      size="small"
      max-height="100%"       <!-- 必须，配合 flex:1 填充高度 -->
      :column-config="{ resizable: true, minWidth: 60 }"
      :scroll-x="{ enabled: true, gt: 0 }"
      :row-config="{ isHover: true, keyField: 'id' }"
      :data="rows"
    >
      <!-- columns -->
    </vxe-table>
  </div>
</template>
<style scoped>
.table-wrap { flex: 1; min-height: 0; overflow: hidden; }
.standard :deep(.vxe-body--row) { height: 56px !important; }  /* 默认 40px，standard 时放高 */
</style>
```

### 5.2 列宽：必须有一列使用 min-width（填充空白）

**问题**：所有列都设 `width` 时，总列宽 < 容器宽度，右侧出现大片空白。
**规则**：每张表必须至少有一个非固定列使用 `min-width` 而不是 `width`，VXE 会自动将该列拉伸填满剩余空间。

```vue
<!-- ❌ 错误：全部固定宽度，右侧空白 -->
<vxe-column field="customer" title="客户" width="160" />

<!-- ✅ 正确：主要内容列用 min-width，自动填充 -->
<vxe-column field="customer" title="客户" min-width="160" />
```

**选哪列用 min-width**：选内容最多、最需要展示完整的列（通常是客户名、商品名、备注等文字类列）。

### 5.3 固定列规范

```
左固定（fixed="left"）： checkbox、序号、订单号
右固定（fixed="right"）：文件下载、操作按钮
```

### 5.4 表头排序规范

时间类、单号类列**默认开启排序**：

```vue
<vxe-column field="SubmitTime" title="提交时间" width="148" sortable />
<vxe-column field="OrderNo" title="订单编号" width="148" sortable />
```

| 项 | 规范 |
|----|------|
| 默认 | 前端 Mock 可本地排序；上线对接 API 时传 `sortField` / `sortOrder` |
| 视觉 | 使用 VXE 内置排序图标，不自定义表头 |
| 禁止 | 不可排序的列不要加 `sortable`（避免误导） |

### 5.5 长文本列：省略 + Tooltip

发货人、收货人、备注等长文本列：

```vue
<vxe-column field="Shipper" title="发货人" min-width="160" show-overflow="title">
  <template #default="{ row }">
    <a-tooltip :content="row.Shipper" :disabled="!row.Shipper">
      <span class="ellipsis">{{ row.Shipper || '—' }}</span>
    </a-tooltip>
  </template>
</vxe-column>
```

- 必须 `show-overflow` 或 `.ellipsis` 截断，**禁止**长文本撑开列导致横向失控
- Tooltip 展示完整内容

### 5.6 列显隐（岗位差异）

工具栏右侧必须有 **列设置** 图标按钮（`icon-settings`）：

| 项 | 规范 |
|----|------|
| 交互 | `a-popover` 或 `a-drawer` 勾选可见列 |
| 持久化 | `localStorage` 键：`{pageKey}-visible-columns` |
| 默认列数 | 12–15 列；超出默认隐藏，用户自行打开 |
| 必选列 | 复选框、序号、主单号、状态、操作列不可隐藏 |

### 5.7 高风险货物警示（危险品 / 化工品等）

| 货物类型 | 展示 |
|---------|------|
| 危险货 / 危险品 | 货物类型列：`s-pill[data-s="rej"]` + `<icon-exclamation-circle-fill />` 红色 14px |
| 化工品 | `s-pill[data-s="wait"]` 橙色警示 |
| 普货 | 普通文字或默认 pill |

- **禁止**仅黑色文字标注危险品
- **禁止**用整行铺红底（见 §31.3）；警示集中在**货物类型列**

### 5.8 行样式（禁止整行状态底色）

- 状态语义只在**状态列** `.s-pill` 体现
- 行 hover 统一 `#eef3ff`，不按状态分色
- **禁止** `row-class-name` 按状态铺行背景色

### 5.9 全局 CSS（global.css）必须包含

```css
/* VXE 边框消除（VXE 用 background-image 模拟边框） */
.freight-table .vxe-header--column,
.freight-table .vxe-body--column {
  background-image: none !important;
  border-right: 0 !important;
  border-bottom: 1px solid #f0f3f8 !important;
}
.freight-table .vxe-header--column {
  background-color: #f8f9fc !important;
  border-bottom: 1px solid #e6eaf2 !important;
  color: #606880 !important;
  font-weight: 600 !important;
  font-size: 12px !important;
}
.freight-table .vxe-body--row { height: 56px; }
.freight-table .vxe-body--row:hover .vxe-body--column { background: #eef3ff !important; }
/* 固定列阴影 */
.freight-table .vxe-table--fixed-left-wrapper  { box-shadow:  3px 0 10px rgba(10,20,50,0.06) !important; }
.freight-table .vxe-table--fixed-right-wrapper { box-shadow: -3px 0 10px rgba(10,20,50,0.06) !important; }
```

---

## 六、间距与尺寸系统

| 用途 | 数值 | 说明 |
|------|------|------|
| 页面区域之间 | `border-bottom: 1px solid var(--color-border-1)` | 取代 margin/gap |
| 区域内水平 padding | `16px` | 搜索行/工具栏/表格列边距 |
| Tab 行高度 | `padding: 9px 12px`（约 38px） | 运输 Tab、状态 Tab |
| 搜索行高度 | `padding: 9px 16px`（约 38px） | 与 Tab 行等高 |
| 工具栏高度 | `padding: 7px 16px`（约 36px） | 比搜索行略矮 |
| 表格行高度 | `40px`（默认紧凑）/ `56px`（标准） | 系统默认紧凑；density 切换时用 standard 覆盖 |
| 表格列边距 | `padding: 0 10px` | 单元格左右内边距 |
| 表单字段间距 | `gap: 16px`（行间）/ `gap: 12px`（同行多字段） | |
| 操作按钮间距 | `gap: 6px`（工具栏）/ `gap: 0`（行内图标） | |
| 搜索字段间距 | `gap: 14px` | sf 之间 |

---

## 七、字体规范

```
主信息文本     13px / weight 500 / color-text-1
正文/标签      13px / weight 400 / color-text-2
副信息/辅助    11px / weight 400 / color-text-3
占位/禁用      任意 / weight 400 / color-text-4

单号/代码      12.5px / mono font / letter-spacing: 0.01em
日期           12.5px / mono font / font-variant-numeric: tabular-nums
表头           12px / weight 600 / color #606880

等宽字体栈：
font-family: "SF Mono", "JetBrains Mono", Consolas, monospace
```

**使用原则**：

- 不要用 `bold`（700），用 `600` 或 `500`
- 日期、单号、端口代码必须用等宽字体（对齐扫描）
- 业务数据不使用斜体

---

## 八、技术实现约定

### 8.1 文件写入（避免 null byte 问题）

在 Windows 挂载路径下，**必须用 Python 写入文件**，禁止用 Write 工具直接写 Vue 文件：

```python
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
```

### 8.2 Unicode 字符

模板中使用 `→`（实际字符），**禁止**用 `\u2192` 转义字符串（会导致渲染为字面量）。

### 8.3 Vue 3 组件规范

```ts
// defineModel（Vue 3.3+）
const keyword = defineModel<string>('keyword', { required: true })

// emits 类型声明
const emit = defineEmits<{
  search: []
  'update:phaseFilter': [value: string]
}>()

// 组件 size
// 搜索区: size="small"，表格内: size="mini"
```

### 8.4 类型检查

```bash
npx vue-tsc --noEmit  # 必须零错误后提交
```

---

## 九、新页面推导流程（AI 执行步骤）

遇到任何新页面需求，按以下步骤推导，**不要凭感觉拼样式**：

```
Step 1: 识别页面类型
  → 列表页 / 详情页 / 表单页 / 弹窗 / 仪表板

Step 2: 确定垂直区域划分（第三节骨架）
  → 本页面需要哪些层：Tab / 搜索 / 状态Tab / 工具栏 / 表格 / 底栏

Step 3: 对每个数据字段，应用原则1（信息层级三段式）
  → 此字段是主信息还是副信息？是否需要双行？

Step 4: 对每个操作，应用原则3（操作层级）
  → 此操作属于主操作/次要操作/工具操作/行内操作？放哪里？

Step 5: 对每个状态/颜色，应用原则4（颜色语义）
  → 此状态对应哪个语义色？

Step 6: 应用第六节间距系统，设置准确的 padding/gap/height

Step 7: 写代码（参考对应章节的代码模板）

Step 8: 自查（第十节检查清单，全部通过后提交）
```

---

## 十、自查清单（提交前必须全部通过）

```
□ 1. 页面根元素是 display:flex + flex-direction:column + height:100%，无外 padding
□ 2. 搜索区是扁平行内布局（无卡片、无阴影、无圆角外框）
□ 3. 表格容器有 flex:1 + min-height:0 + overflow:hidden
□ 4. VXE Table 有 border="none" + size="small" + max-height="100%"
□ 5. global.css 包含 background-image:none !important 消除 VXE 伪边框
□ 6. 所有颜色用 CSS 变量，无硬编码 #hex（状态 pill 背景色除外）
□ 7. 操作按钮：工具栏 size="small"，表格内 size="mini"，行操作纯图标无文字
□ 8. 有双行内容的列（客户/港口/日期/状态），均使用 cell-two-line 结构
□ 9. 模板中箭头用实际 Unicode 字符 →，不用转义序列
□ 10. TypeScript：vue-tsc --noEmit 零错误
□ 11. 状态 Tab 的"异常"类 Tab 在有数据时数字显红色
□ 12. 工具栏左主操作；表格 `table-card-cap` 右上：列设置 + 分页
```

---

## 附录 A：货代业务字段命名约定

| 字段 | 说明 | 展示方式 |
|------|------|---------|
| DcgNo / OrderNo | 业务单号 | mono 等宽，蓝色可点击链接 |
| HblNo / MblNo | 提单号 | mono 等宽 |
| LoaddingPortEn / DeliveryPortEn | 起运/目的港英文代码 | port-code，mono，weight 600 |
| Etd / Eta | 预计离/到港日期 | date + 星期几，双行 |
| FollowState | 跟进状态 | status-pill（自定义样式） |
| CustomerName | 客户全称 | 双行：简称（上）+ 全称（下） |
| Salesman | 业务员 | 单行，13px |
| ContainerDataJson | 柜型柜量 | mono，单行 |
| ShipCompanyAndVoyno | 船名航次 | mono，单行 |
| SubmitTime / CreatedTime | 提交/创建时间 | 副信息，11px，color-text-3 |

---

## 十一、搜索 / 筛选区专项设计规范

> 这是整个系统中最容易做坏的区域。设计原则：**搜索区是工具，不是主角**。
> 它的任务是让用户快速过滤数据，而不是展示自己的存在感。

### 11.1 核心设计思维

**三个问题驱动设计决策：**

1. 这个系统的用户搜索频率高吗？→ 高频 = 搜索行要常驻且紧凑
2. 用户通常用几个字段来定位数据？→ 决定默认展示几个筛选项
3. 是否需要保存搜索条件反复使用？→ 决定是否需要"保存视图"

**主动筛选 vs 被动筛选：**

- **主动筛选**：用户明确知道要找什么 → 关键词输入框优先级最高
- **被动筛选**：用户在浏览时缩小范围 → 下拉/日期筛选器

---

### 11.2 字段数量 → 筛选层级决策树

```
字段总数 ≤ 3？
├─ YES → Tier 0：纯搜索条（单输入框）
└─ NO
   字段总数 4–8？
   ├─ YES → Tier 1：标准筛选行（全部常驻）
   └─ NO
      字段总数 9–16？
      ├─ YES → Tier 2：可展开筛选行（主字段常驻 + 次字段折叠）
      └─ NO
         字段总数 17–50？
         └─ YES → Tier 3：筛选抽屉（Drawer）
```

---

### 11.3 Tier 0：纯搜索条（0-3 个字段）

**适用场景**：用户主要靠关键词定位，筛选维度极少。

**布局**：

```
┌──────────────────────────────────────────────────────┐
│ 🔍 [输入框：支持单号 / 客户 / 提单号...  ] ×  [查询]  │
└──────────────────────────────────────────────────────┘
```

**交互规则**：

- 按 Enter 触发搜索
- 输入框有 × 清除按钮，清除后自动重新查询
- placeholder 列出支持的搜索维度
- 宽度：占满可用宽度，响应式

**代码**：

```vue
<div class="search-bar-slim">
  <a-input-search
    v-model="keyword"
    size="small"
    allow-clear
    placeholder="业务单号 / 客户名称 / HBL / MBL"
    style="max-width: 480px"
    @search="emit('search')"
    @clear="emit('search')"
  />
</div>
```

---

### 11.4 Tier 1：标准筛选行（4-8 个字段）

**适用场景**：本系统大多数列表页。用户有固定的几个筛选维度。

**布局**：

```
┌──────────────────────────────────────────────────────────────────┐
│ 单号 [___________] 客户 [________] 类型 [▼全部] 日期 [__到__]  │
│                                       [查询] 重置 ▼高级筛选(2)  │
└──────────────────────────────────────────────────────────────────┘
```

**交互规则**：

- 文本输入框：Enter 触发 / 点查询按钮触发（**不** auto-search）
- 下拉选择器：选中后 **auto-search**（即时反馈，无需点查询）
- 日期范围：选完结束日期后 auto-search
- "重置"：文字链接样式，不用 outline 按钮（视觉降权）
- "高级筛选"：仅当存在更多隐藏字段时显示；若有激活的高级筛选，显示红色数字徽章

**字段宽度参考**：

```
关键词/单号输入框：180-200px（内容长）
客户名称：140-160px
日期范围：220-240px（两个日期）
下拉单选：100-120px（"全部类型"类）
下拉多选：120-140px
```

**标签样式规范**：

```css
.sf-label {
  font-size: 12px;
  color: var(--color-text-3);  /* 比输入框内文字更浅，区分标签与值 */
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;
}
```

**查询/重置操作区**：

```html
<!-- 查询：primary 按钮 -->
<a-button size="small" type="primary" @click="emit('search')">查询</a-button>
<!-- 重置：文字链接，不是按钮 -->
<a-button size="small" type="text" @click="emit('reset')">重置</a-button>
<!-- 高级筛选：仅在有更多字段时出现 -->
<a-button size="small" type="text">
  高级筛选
  <a-badge v-if="advancedCount > 0" :count="advancedCount" dot />
</a-button>
```

**完整实现**：

```vue
<template>
  <div class="search-bar">
    <div class="search-fields">
      <label class="sf">
        <span class="sf-label">单号</span>
        <a-input v-model="keyword" size="small" allow-clear
          placeholder="业务单号 / HBL / MBL" style="width:188px"
          @press-enter="emit('search')" />
      </label>
      <label class="sf">
        <span class="sf-label">客户</span>
        <a-input v-model="customerFilter" size="small" allow-clear
          placeholder="客户名称" style="width:148px"
          @press-enter="emit('search')" />
      </label>
      <label class="sf">
        <span class="sf-label">类型</span>
        <a-select v-model="businessTypeFilter" size="small" allow-clear
          placeholder="全部" :options="businessTypeOptions" style="width:108px"
          @change="emit('search')" />
      </label>
      <label class="sf">
        <span class="sf-label">状态</span>
        <a-select v-model="statusFilter" size="small" allow-clear
          placeholder="全部" :options="statusOptions" style="width:120px"
          @change="emit('search')" />
      </label>
    </div>
    <div class="search-actions">
      <a-button size="small" type="primary" @click="emit('search')">查询</a-button>
      <a-button size="small" type="text" class="reset-btn" @click="emit('reset')">重置</a-button>
    </div>
  </div>
</template>
<style scoped>
.search-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 16px; background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border-1); gap: 12px;
}
.search-fields { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.sf { display: flex; align-items: center; gap: 5px; }
.sf-label { font-size: 12px; color: var(--color-text-3); white-space: nowrap; }
.search-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.reset-btn { color: var(--color-text-3); }
.reset-btn:hover { color: var(--color-text-1); }
</style>
```

---

### 11.5 Tier 2：可展开筛选行（9-16 个字段）

**适用场景**：订单列表、**业务单**等 9–16 个筛选字段的页面。

**布局（filter-card v2，业务单参考实现）**：

```
┌─ L1 运输 Tab（可选）────────────────────────────────────────┐
├─ L2 filter-card（无「筛选条件」标题栏）──────────────────────┤
│ 字段区（Grid 4 列）                    │ 固定操作列 84px   │
│ 行1: 单号 | 类型 | 进出口 | 业务员      │ [查询]  ← 位置固定 │
│ 行2: 操作员 | 提交时间 chip (span3)    │ [重置]            │
│ ── 高级区（展开，虚线顶分隔）────────── │ ─────────         │
│ 行3+: 折叠字段 4 列栅格                │ 展开(+N)/收起     │
└────────────────────────────────────────┴───────────────────┘
│ FilterActiveStrip（§11.8，仅有 tag 时渲染，禁止空态占位）   │
└──────────────────────────────────────────────────────────────┘
```

**交互（固定优于动态）**：

| 规则 | 说明 |
|------|------|
| 主操作位置 | **查询 / 重置** 始终在右侧操作列顶部，展开/收起**不改变**其位置 |
| 展开入口 | 操作列底部文字链 `展开(+N)` / `收起`，虚线分隔；禁止占栅格整列宽按钮 |
| 无标题栏 | **禁止** `filter-card__head`「筛选条件」区块标题（字段即语义） |
| 空态 Strip | **禁止**「当前无筛选条件」占位行 |

**栅格与标签（Tier 2 强制）**：

| 项 | 规范 |
|----|------|
| 布局 | CSS Grid `repeat(4, 1fr)` + 右侧固定操作列；或 legacy `a-row :span="6"` |
| 标签 | 顶标 `filter-field__label` 12px；禁止左右 label 挤压列宽 |
| 控件 | `size="small"`，高度 **32px**（global.css 覆盖），列内 `width: 100%` |
| 操作列 | 右侧 **84px** 竖线分隔；**查询** primary + **重置** text，**全程固定** |
| CSS 类 | `.filter-card` / `.filter-card__main` / `.filter-card__actions-col` |

**主字段选取原则**（收起态常驻）：

1. 业务核心标识：业务单号 / 订单号
2. 最常用维度：业务类型、进/出口
3. 责任人员：业务员、操作员（§11.9 人员选择器）
4. 时间：提交时间快捷 chip（§11.10）

**展开按钮（强制）**：

| 状态 | 要求 |
|------|------|
| 收起 | 操作列底部 `icon-down` + `展开(+N)`，N = 折叠区字段总数 |
| 展开 | 操作列底部 `icon-up` + `收起`；高级区 `border-top: 1px dashed` |
| 折叠区有值 | 收起时橙色 `a-badge` 显示激活数量 |
| 记忆 | `localStorage` 记忆展开态，不记忆筛选值 |

```html
<a-button size="small" type="text" @click="expanded = !expanded">
  <template #icon><icon-down v-if="!expanded" /><icon-up v-else /></template>
  {{ expanded ? '收起筛选' : `展开筛选(+${hiddenCount})` }}
  <a-badge v-if="!expanded && hiddenActiveCount > 0" :count="hiddenActiveCount" />
</a-button>
```

**交互规则**：

- 折叠区有激活筛选时，badge 提示；用户可通过 FilterActiveStrip 看到具体条件
- 展开/收起用 localStorage 记忆

---

### 11.6 Tier 3：筛选抽屉（17-50 个字段）

**适用场景**：高级搜索、报表筛选、复杂业务模块。

**布局**：

```
筛选行（仅1-2个核心字段 + 筛选入口）：
┌──────────────────────────────────────────────────────────────────┐
│ 🔍 [关键词__________] ×  ▼ 筛选条件 ●3  已选：客户×  ETD×  ×全清│
└──────────────────────────────────────────────────────────────────┘

右侧抽屉（点击"筛选条件"打开）：
┌─────────────────────────────────────────┐
│ 筛选条件                          ×关闭  │
├─────────────────────────────────────────┤
│ ▌基本信息                               │
│   单号  [___________________]           │
│   客户  [___________________]           │
│   业务员 [▼___]  类型 [▼___]            │
│                                         │
│ ▌时间维度                               │
│   ETD   [____] 至 [____]               │
│   ETA   [____] 至 [____]               │
│   创建时间 [____] 至 [____]             │
│                                         │
│ ▌货物信息                               │
│   起运港 [____]  目的港 [____]          │
│   柜型   [▼___]  船名  [____]           │
│   ...                                   │
├─────────────────────────────────────────┤
│              [重置]  [应用筛选]          │
└─────────────────────────────────────────┘
```

**交互规则**：

- 抽屉不触发搜索，只有点"应用筛选"才触发
- 激活的筛选条件以"标签"形式显示在筛选行下方，可逐个删除
- "筛选条件"按钮上显示激活数量徽章（橙色）
- 字段按业务分组（基本信息 / 时间维度 / 货物信息 / 财务状态）
- 宽度：400-480px（右侧抽屉）

**已激活筛选标签**：与 §11.8 `FilterActiveStrip` 使用同一套类名 `.filter-active-strip`（Tier 3 抽屉激活后也走 Strip 回显）。

---

### 11.7 通用交互规则（所有 Tier 共用）

| 行为 | 规则 |
|------|------|
| 文本框触发搜索 | Enter 键 或 点查询按钮；**不** auto-search（防止频繁请求） |
| 下拉/日期触发搜索 | 选中后 auto-search（即时反馈，用户期望立即看到结果） |
| **重置** | **必须有**「重置」按钮（text 类型）；清空表单全部字段 + 执行一次查询；**不**清空状态 Tab（状态用 FilterActiveStrip 单删或「清除状态」） |
| 空值处理 | 字段为空 = 不作为筛选条件（而非筛选"空值"数据） |
| 状态记忆 | 展开/收起状态 localStorage 记忆；筛选值不记忆（刷新清空） |
| 字段 placeholder | 文本字段写出支持的搜索维度；下拉字段写"全部"或"请选择" |
| 筛选无结果 | 表格展示 Empty 状态，提示"换个条件试试"，不显示 loading |

---

### 11.8 FilterActiveStrip（已激活筛选回显，所有列表页必须）

> 解决「筛了半天不知道当前条件是什么」的问题。与状态 Tab、表单筛选**统一回显**。

**何时显示**：`v-if="activeFilterTags.length > 0"` — 有非默认筛选时才渲染；**禁止**空态占位文案。

**位置**：筛选卡片（L2）底部，紧挨 `filter-card__main` 下方。

```html
<div v-if="activeFilterTags.length" class="filter-active-strip">
  <span class="filter-active-strip__label">已筛选</span>
  <a-tag
    v-for="tag in activeFilterTags" :key="tag.key"
    closable size="small"
    @close="removeFilter(tag.key)"
  >{{ tag.label }}：{{ tag.display }}</a-tag>
  <a-button v-if="query.status" size="mini" type="text" @click="clearStatusFilter">
    清除状态
  </a-button>
  <a-button size="mini" type="text" @click="resetAllFilters">清除全部</a-button>
</div>
```

| 标签来源 | 示例 |
|---------|------|
| 表单字段 | `业务员：张三`、`装箱：FCL` |
| 状态 Tab | `状态：待审单` |
| 范围 Tab | `范围：个人单` |
| 时间 | `提交：本周` 或 `提交：2024-01-01 ~ 01-07` |

```css
.filter-active-strip {
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
  padding: 6px 16px;
  background: #fffbf2;
  border-bottom: 1px solid var(--color-border-1);
}
.filter-active-strip__label { font-size: 12px; color: var(--color-text-3); flex-shrink: 0; }
```

---

### 11.9 人员筛选字段规范

业务员、操作员、客服等**内部人员**字段：

| 项 | 规范 |
|----|------|
| 控件 | `a-select` + `allow-search` + `allow-clear`，**禁止**纯 `a-input` 手输姓名 |
| 选项 | 接口 `/api/users` 或 Mock；`label` 姓名，`value` 工号/ID |
| placeholder | `请选择` |
| 触发 | 选中后 auto-search |

```vue
<a-select v-model="query.salesmanId" allow-search allow-clear placeholder="请选择"
  :options="salesmanOptions" @change="emit('search')" />
```

---

### 11.10 时间筛选规范（货代高频）

每个订单类列表**至少提供一种时间维度**（提交时间 / 创建时间 / ETD）。

**快捷 chip（主查询区或 FilterActiveStrip 上方）**：

```
[今日] [本周] [本月] [自定义 ▼]
```

| Chip | 含义 |
|------|------|
| 今日 | 当天 00:00 ~ 23:59 |
| 本周 | 本周一 00:00 ~ 现在 |
| 本月 | 本月 1 日 00:00 ~ 现在 |
| 自定义 | 展示 `a-range-picker`，选完结束日期后 auto-search |

- 互斥单选；再次点击已选 chip 可取消（恢复「不限时间」）
- 选中 chip 在 FilterActiveStrip 回显：`提交时间：本周`

---

### 11.11 业务单（SaleOrder）筛选区实现对照

业务单共 12 个筛选字段 → **Tier 2 栅格表单**（§11.5），**不是** Tier 1 单行。

| 收起态主字段 | 展开态次字段 |
|-------------|-------------|
| 业务单号、业务类型、进/出口、业务员、操作员 | 客服、客服单证、装箱方式、发货人、收货人、快捷标签、关键词 |
| + 提交时间快捷 chip | + 自定义日期范围（展开区或主行末尾） |

必须同时具备：§11.7 重置、§11.8 FilterActiveStrip、§11.9 人员选择器、§11.10 时间快捷。

---

### 11.12 ~~本项目当前页（SaleOrderSearch）应使用 Tier 1~~（已废弃）

> 已升级为 Tier 2，见 §11.11。

---

## 十二、Tab 组件设计规范

> Tab 是系统中使用频率最高的导航组件。激活态必须一眼可辨，非激活态需要保持存在感但不抢主角。

### 12.1 两类 Tab 的职责与视觉方案

| Tab 类型 | 职责 | 视觉方案 |
|----------|------|---------|
| 运输方式 Tab（海运/空运/铁路） | 页面级切换，选择后整页内容变化 | **Segmented Control（分段控件）** |
| 状态过滤 Tab（全部/待审/异常…） | 数据筛选，改变列表内容 | **下划线增强 + 数量胶囊** |

**为什么运输 Tab 用 Segmented Control？**

- 运输方式是互斥选项（只能选一个），Segmented Control 是互斥选择的经典控件
- 白色背景 + 阴影的激活态比下划线更明显，符合"页面级切换"的重要程度
- 与状态过滤 Tab 形成视觉差异，用户一眼区分两个 Tab 的层级

**为什么状态 Tab 用下划线？**

- 状态 Tab 较多（6-8 个），Segmented Control 会过宽
- 下划线 Tab 横向伸展能力更强
- 数量胶囊提供额外的视觉标记，弥补下划线激活感不足

---

### 12.2 Segmented Control 实现规范

```
外容器：background: #f0f2f5; border-radius: 6px; padding: 3px; gap: 2px
激活项：background: #fff; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.12); color: primary-6; font-weight: 600
非激活：color: color-text-2; font-weight: 500
hover：background: rgba(255,255,255,0.6); color: color-text-1
```

```html
<div class="seg-ctrl">
  <button
    v-for="tab in tabs" :key="tab.value"
    class="seg-item"
    :class="{ 'seg-item--active': active === tab.value }"
    @click="active = tab.value"
  >{{ tab.label }}</button>
</div>
```

```css
.seg-ctrl {
  display: inline-flex; align-items: center;
  background: #f0f2f5; border-radius: 6px; padding: 3px; gap: 2px;
}
.seg-item {
  padding: 4px 16px; font-size: 13px; font-weight: 500;
  color: var(--color-text-2); background: transparent;
  border: none; border-radius: 4px; cursor: pointer;
  transition: color 0.15s, background 0.15s, box-shadow 0.15s;
}
.seg-item:hover:not(.seg-item--active) {
  background: rgba(255,255,255,0.6); color: var(--color-text-1);
}
.seg-item--active {
  background: #fff; color: var(--primary-6); font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
}
```

---

### 12.3 状态过滤 Tab 实现规范

**视觉层级（从弱到强）：**

```
非激活          → color-text-3，背景透明，数量：灰色胶囊 (#f0f2f5 bg, #86909c text)
hover           → color-text-1，背景 color-fill-1（极浅灰）
激活（普通）    → primary-6 文字 + weight 600 + 3px 蓝色下划线 + 蓝色数量胶囊
激活（危险/异常）→ #dc2626 文字 + weight 600 + 3px 红色下划线 + 红底白字数量胶囊
未激活危险且有数量 → #d97706 文字 + 红色数量胶囊（提示需关注）
```

**数量胶囊四种状态：**

```css
/* 默认 */
.stab-badge { background: #f0f2f5; color: #86909c; }
/* 普通激活 */
.stab-badge--active { background: #e8f3ff; color: var(--primary-6); font-weight: 600; }
/* 危险未激活但有数量 */
.stab-badge--danger { background: #fff1f0; color: #dc2626; font-weight: 700; }
/* 危险激活 */
.stab-badge--danger-active { background: #dc2626; color: #fff; font-weight: 700; }
```

**关键细节：**

- 下划线高度 **3px**（而非 2px），border-radius: `3px 3px 0 0`
- Tab 行 `align-items: stretch` + item `height: 38px`，下划线贴底
- 行容器隐藏横向滚动条（`scrollbar-width: none`）
- 非激活态字色用 `color-text-3`（而非 color-text-2），激活对比度更高

**交互补充（与 FilterActiveStrip 联动，§11.8）**：

| 行为 | 规范 |
|------|------|
| 点击状态 Tab | 筛选数据 + 在 FilterActiveStrip 回显 `状态：xxx` |
| 清除状态 | Tab 行末尾或 Strip 内提供「清除状态」text 按钮（`query.status = ''` 后 auto-search） |
| 再点「全部」 | 等效清除状态筛选 |
| 数量胶囊 | 仅展示统计，不作为唯一反馈；**必须**配合 Strip 或 Tab 激活态 |

```html
<!-- 状态 Tab 行末尾（仅 status 非空时显示） -->
<a-button v-if="query.status" size="mini" type="text" @click="clearStatusFilter">
  清除状态筛选
</a-button>
```

---

## 十三、常规页面完整设计规范

> 这一节回答所有"该怎么做"的细节问题，让任何 AI 写任何页面都有标准可查。

---

### 13.1 搜索筛选区：标签宽度 & 字段宽度规范

#### 标签宽度：自然宽度，不强制对齐

```
❌ 错误：统一 label-width 强制右对齐
   负责人：[___]
   更新时间：[___]
   ↑ 标签宽度不一致，反而显得混乱

✅ 正确：label 自然宽度 + 固定 gap
   负责人 [___]  更新时间 [___]
   ↑ white-space:nowrap，gap:5px，整体靠 gap:12px 分隔
```

**原因**：搜索区字段是横排 flex-wrap 布局，强制标签等宽在多行换行时无法对齐，
自然宽度 + 固定间距反而更整洁统一。

#### 多行时的对齐方式

```css
.search-fields {
  display: flex;
  align-items: center;
  gap: 12px;          /* 字段间距，固定值 */
  flex-wrap: wrap;    /* 超出宽度自动换行 */
  row-gap: 8px;       /* 行间距比列间距小 */
}
```

多行时字段**自然折行**，不强制网格对齐。每行字段数量由容器宽度决定，不人为分组。

#### 输入框宽度：按字段语义固定

| 字段类型 | 宽度 | 说明 |
|---------|------|------|
| 关键词/单号（宽） | 188–200px | 内容最长，优先级最高 |
| 客户/公司名 | 148–160px | 中文名通常 4–8 字 |
| 日期范围（两个日期） | 220–240px | 含"至"连接符 |
| 下拉（带"全部"选项）| 108–120px | 选项文字通常较短 |
| 下拉（多选/较长选项）| 140–160px | |
| 人员/负责人 | 104–120px | |
| 数字范围 | 各 80px，中间"至" | |

---

### 13.2 表格列规范

#### 列对齐规则

| 内容类型 | 水平对齐 | 原因 |
|---------|---------|------|
| 文字（名称、描述）| 左对齐（默认）| 阅读习惯 |
| 数字（金额、数量、率）| 右对齐 | 方便纵向比较大小 |
| 状态/标签/图标 | 居中 | 视觉平衡 |
| 操作按钮列 | 居中 | 视觉平衡 |
| 序号/复选框 | 居中 | |

```vue
<vxe-column field="amount" title="金额" align="right" />
<vxe-column field="status" title="状态" align="center" />
<vxe-column title="操作"  align="center" fixed="right" />
```

#### 列宽参考

| 列类型 | 宽度 | 说明 |
|--------|------|------|
| 复选框 | 36px | 固定 |
| 序号 | 48–52px | 固定 |
| 状态 badge | 82–96px | 按文字最长状态 |
| 风险/等级 pill | 72–88px | |
| 人名（2–4字）| 72–88px | |
| 日期（YYYY-MM-DD）| 88–96px | 用等宽字体 |
| 日期时间 | 140–160px | |
| 单号/订单号 | 148–168px | 等宽字体 |
| 客户/公司名 | **min-width: 160px**（必须，填充剩余空间）| |
| 金额 | 96–112px，右对齐 | |
| 百分比/率 | 72–88px，右对齐 | |
| 港口代码对 | 180–200px | |
| 船名航次 | 140–160px | 等宽字体 |
| 备注/说明（长文本）| **min-width: 200px** | 优先用这列填充 |
| 文件下载 | 48–52px | 图标列 |
| 操作 | 76–100px | 按图标数量 |

**关键规则**：每张表有且只有 1 列使用 `min-width`（通常是客户/名称/备注列），其余全部 `width`。

#### 数字格式规范

```ts
// 金额：万元缩写（大额）或逗号千分位（小额精确）
const fmtAmount = (n: number) =>
  n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n.toLocaleString()

// 毛利率：保留 1 位小数 + %
const fmtRate = (n: number) => `${n.toFixed(1)}%`

// 数量：整数加千分位
const fmtQty = (n: number) => n.toLocaleString()
```

#### 毛利率/百分比颜色语义

```ts
const rateColor = (v: number) =>
  v < 0  ? '#dc2626' :   // 负值：红
  v < 3  ? '#d97706' :   // 警戒：橙
           '#16a34a'     // 正常：绿
```

#### 空值统一用"—"

```vue
{{ row.value || '—' }}
<!-- 样式：color: var(--color-text-4); 与正常数据形成对比 -->
```

---

### 13.3 表单规范（弹窗 / 抽屉内表单）

#### label 位置：垂直布局（top）为主

```vue
<!-- ✅ 抽屉/弹窗内表单：vertical 布局 -->
<a-form layout="vertical" size="small">
  <a-form-item label="客户名称" field="customer" :rules="[{required:true}]">
    <a-input v-model="form.customer" />
  </a-form-item>
</a-form>
```

```
❌ 水平布局（label 在左）：label 宽度难以在所有字段间统一，窄弹窗尤其混乱
✅ 垂直布局（label 在上）：字段可以用满宽度，更清晰
```

#### 表单字段宽度规则

- 弹窗/抽屉内：字段默认**撑满列宽**（`width: 100%`，不写固定 px）
- 需要并排的两字段：用 `<a-row :gutter="12"><a-col :span="12">` 各占一半
- 数字输入：可以加 `suffix` 或 `addonAfter` 显示单位

```vue
<!-- 两列并排 -->
<a-row :gutter="12">
  <a-col :span="12">
    <a-form-item label="起运港"><a-input v-model="form.loadPort" /></a-form-item>
  </a-col>
  <a-col :span="12">
    <a-form-item label="目的港"><a-input v-model="form.destPort" /></a-form-item>
  </a-col>
</a-row>
```

#### 表单分节（Section）

字段多时按业务分组，组间用分节标题：

```html
<div class="form-section">
  <div class="form-section-title">基本信息</div>
  <!-- 字段 -->
</div>
<div class="form-section" style="margin-top:16px">
  <div class="form-section-title">货物信息</div>
  <!-- 字段 -->
</div>
```

```css
.form-section-title {
  font-size: 12.5px; font-weight: 600; color: var(--color-text-2);
  padding-bottom: 8px; margin-bottom: 12px;
  border-bottom: 1px solid var(--color-border-1);
}
```

---

### 13.4 数据展示详情区规范（抽屉 / 详情卡片）

#### info-grid：两列网格展示字段

```html
<div class="info-grid">
  <div class="info-item">
    <span class="info-label">订单号</span>
    <span class="info-val mono">ORD2026010001</span>
  </div>
  <div class="info-item">
    <span class="info-label">核查状态</span>
    <a-tag size="small" color="orange">待核查</a-tag>
  </div>
</div>
```

```css
.info-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
.info-item  { display: flex; flex-direction: column; gap: 3px; }
.info-label { font-size: 11.5px; color: var(--color-text-3); }
.info-val   { font-size: 13px;   color: var(--color-text-1); font-weight: 500; }
```

**规则**：

- 标签（label）：11.5px，color-text-3（浅灰）
- 值（value）：13px，color-text-1，weight 500
- 单号/代码 value：额外加 `.mono` 等宽字体
- 一行放不下（如长文本备注）：整行 `grid-column: 1 / -1`

---

### 13.5 页面头部（PageHeader）规范

> **重要：列表页不需要独立的 PageHeader 区域。**
> 侧边菜单已标识当前页，重复标题条浪费垂直空间，是传统 OA 系统的反模式。

**正确做法：把主操作按钮放进工具栏右侧**

```html
<!-- ✅ 工具栏右侧放主操作 + 工具图标 -->
<div class="toolbar-right">
  <a-button size="small" type="outline">
    <template #icon><icon-download /></template>导出
  </a-button>
  <a-button size="small" type="primary">
    <template #icon><icon-plus /></template>新建
  </a-button>
  <div class="tool-divider" />
  <a-button size="small" type="text" @click="toggleDensity">
    <template #icon><icon-line-height /></template>
  </a-button>
  <a-button size="small" type="text" @click="refresh">
    <template #icon><icon-refresh /></template>
  </a-button>
</div>
```

```css
.tool-divider { width:1px; height:14px; background:var(--color-border-1); margin:0 2px; }
```

**例外场景（才需要 zone-header）**：

- 详情页（没有列表 + 有复杂面包屑 + 需要"返回"按钮）
- 大屏 Dashboard 页（需要时间范围全局控件 + 标题）

---

### 13.6 空状态 / 错误状态 / 加载状态规范

#### 三种状态可触达方式

| 状态 | 触达方式 | 实现 |
|------|---------|------|
| 空状态 | 筛选条件导致无结果 | `v-if="!loading && rows.length === 0"` |
| 错误状态 | 网络请求失败 | `v-if="hasError"` |
| 加载状态 | 数据加载中 | VXE `:loading="loading"` 内置 skeleton |

**不允许**额外在页面上加"演示按钮"来触达这些状态。

#### 空状态：区分"无数据"和"无结果"

```vue
<!-- 有筛选条件时的空状态 -->
<a-empty v-if="hasFilter" description="没有找到匹配的数据，请调整筛选条件">
  <template #extra>
    <a-button size="small" type="outline" @click="handleReset">清除筛选</a-button>
  </template>
</a-empty>

<!-- 完全没有数据（新系统/新模块） -->
<a-empty v-else description="暂无数据">
  <template #extra>
    <a-button size="small" type="primary" @click="openCreate">立即创建</a-button>
  </template>
</a-empty>
```

#### 错误状态

```vue
<a-result status="error" title="加载失败" subtitle="请检查网络连接后重试">
  <template #extra>
    <a-button type="primary" @click="emit('retry')">重新加载</a-button>
  </template>
</a-result>
```

---

### 13.7 确认对话框规范

#### 危险操作三级防御

```
级别1（低风险，可撤销）：直接操作 + Message 反馈
级别2（中风险，影响较大）：Modal 确认 → 操作
级别3（高风险，不可恢复）：Modal 确认 → 输入"删除"文字 → 操作
```

本系统常用级别 2：

```vue
<!-- 危险操作：ok-button status="danger" -->
<a-modal title="删除确认" simple
  ok-text="确认删除"
  :ok-button-props="{ status: 'danger' }"
  @ok="handleDelete">
  <p>删除后不可恢复，确认删除该记录？</p>
</a-modal>
```

**规则**：

- 删除：`status="danger"`（红色确认按钮）
- 驳回/警告：`status="warning"`（橙色）
- 批量提交等正向操作：`status="normal"`（蓝色）
- 弹窗用 `simple` 模式（无图标，更简洁）

---

### 13.8 消息反馈规范（Message / Notification）

| 场景 | 类型 | 内容 |
|------|------|------|
| 操作成功（保存/提交/导出）| `Message.success` | "保存成功" / "已提交 N 条" |
| 轻度警告（驳回/部分失败）| `Message.warning` | "已驳回" / "N 条成功，M 条失败" |
| 操作失败（网络/权限）| `Message.error` | "操作失败，请重试" |
| 需要用户关注的后台任务 | `Notification` | "导出任务已开始，完成后通知您" |

```ts
import { Message } from '@arco-design/web-vue'
Message.success('保存成功')
Message.warning(`已驳回 ${count} 条`)
Message.error('网络异常，请重试')
```

---

### 13.9 页面层级 zone 架构（所有列表页必须遵循）

```
.page-root
  background: var(--color-bg-body)   /* 灰底 #f2f3f5 */
  display: flex; flex-direction: column; height: 100%; gap: 4px

  .zone-header（❌ 禁用）
    ⚠️ 不要在列表页加 zone-header（页面标题 + 说明）
    原因：侧边栏菜单已清楚标识当前页面，重复的标题条浪费垂直空间
    → 导出/新建等主操作按钮放进工具栏（toolbar）右侧，不单独起一行

  .zone-filter
    background: var(--color-bg-card)
    flex-shrink: 0
    → 搜索行（可展开）+ 激活筛选标签

  .zone-data
    background: var(--color-bg-card)
    flex: 1; min-height: 0
    → 状态 Tab + 工具栏 + 表格 + 底栏
```

**4px gap**：页面背景（灰色）透过 zone 之间的 gap 显现，自然产生层级感。
无需 box-shadow 或 border，视觉更轻。

---

### 13.10 路由与菜单配置规范（新页面必须同步更新）

新增任何页面，必须同步更新以下 4 个文件：

```
src/router/modules/{模块名}.ts    → 定义路由（path / name / meta.menuKey）
src/router/index.ts              → import 并 spread 到 routes
src/config/menu.ts               → 菜单分组 + 菜单项（key / title / routeName）
src/config/tabs.ts               → 顶部 Tab（key / title / routeName）
```

**meta.menuKey** 必须与 `menu.ts` 中 item 的 `key` 完全一致，否则侧边栏高亮失效。

---

### 13.11 常见问题与标准答案（Q&A）

| 问题 | 标准答案 |
|------|---------|
| 搜索框标签是否要固定宽度对齐？| Tier 1：自然宽度 + gap:12px；**Tier 2 栅格表单：固定 76px 右对齐**（§11.5） |
| 表格右侧有空白怎么办？| 找一个核心文字列，改 `width` → `min-width` |
| 下拉选了要立即搜还是等点查询？| 下拉 auto-search；文本框 Enter/点查询 |
| 操作列要写文字还是只用图标？| 纯图标 + `<a-tooltip>` 悬浮提示 |
| 危险操作（删除/驳回）放哪里？| 放进行操作的 `more` 下拉，不直接暴露 |
| 数字金额右对齐还是左对齐？| 右对齐（align="right"），方便纵向比大小 |
| 空值显示什么？| 统一用 "—"，color-text-4 浅灰色 |
| 弹窗表单 label 左对齐还是上对齐？| 上对齐（layout="vertical"），字段可铺满宽度 |
| 新页面路由配了吗？| 必须同时更新路由模块 + index.ts + menu.ts + tabs.ts |

---

## 十四、按钮完整规范

### 14.1 按钮类型层级（重要性从高到低）

```
primary   → 页面/模块最主要的正向操作，每个区域最多 1 个
outline   → 次要操作，重要性仅次于 primary
text      → 轻量操作，不需要边框强调
link      → 仅用于纯导航跳转，不做业务操作
dashed    → 上传/新增空位占位符，仅此场景
```

```vue
<a-button type="primary">新建</a-button>
<a-button type="outline">导出</a-button>
<a-button type="text">查看日志</a-button>
<a-button type="link" @click="goDetail">查看详情</a-button>
```

### 14.2 按钮颜色语义（status 属性）

| type + status | 视觉 | 使用场景 |
|---|---|---|
| `primary` | 蓝色填充 | 主确认、保存、提交 |
| `primary` + `status="danger"` | 红色填充 | 不可逆删除的最终确认 |
| `primary` + `status="warning"` | 橙色填充 | 驳回等警告性确认 |
| `outline` | 蓝色描边 | 次要正向操作（导出、打印） |
| `outline` + `status="danger"` | 红色描边 | 软删除、撤销等可恢复危险操作 |
| `text` + `status="danger"` | 红色文字 | 行内删除操作（表格行）|

### 14.3 按钮尺寸

| size | 高度 | 场景 |
|---|---|---|
| `large` | 36px | 落地页/门户页 CTA，系统内不用 |
| `medium`（默认）| 32px | 弹窗/抽屉 footer，独立表单提交 |
| `small` | 28px | **页面头部、工具栏、筛选区**，系统内主要尺寸 |
| `mini` | 22px | 表格行内操作（图标按钮）、标签内按钮 |

> **系统统一用 `size="small"`**，仅弹窗/抽屉 footer 用 `medium`（默认不写）。

### 14.4 页面头部（PageHeader）按钮规范

```
最多：2–3 个可见按钮
排列：次要操作在左，主操作在最右
```

```html
<!-- ✅ 标准：次要在前，主操作最后 -->
<a-button size="small" type="outline">
  <template #icon><icon-download /></template>导出
</a-button>
<a-button size="small" type="primary">新建订单</a-button>

<!-- ❌ 错误：超过 3 个按钮全部暴露 -->
<a-button>导出</a-button>
<a-button>批量导入</a-button>
<a-button>模板下载</a-button>
<a-button type="primary">新建</a-button>
```

超过 3 个时：**保留最主要的 1–2 个，其余收入「更多」下拉**：

```html
<a-dropdown trigger="click">
  <a-button size="small" type="outline">
    更多 <icon-down />
  </a-button>
  <template #content>
    <a-doption @click="handleImport">批量导入</a-doption>
    <a-doption @click="handleTemplate">下载模板</a-doption>
  </template>
</a-dropdown>
<a-button size="small" type="primary">新建</a-button>
```

### 14.5 表格工具栏（Toolbar）按钮规范

```
工具栏 = 批量操作区 + 右侧辅助操作区
左侧：批量操作（勾选行后出现）
右侧：密度切换、列显隐、刷新（icon-only 按钮）
```

**批量操作最多暴露 2 个**，其余收入下拉。

**批量前置校验（强制）**：未勾选时 `Message.warning('请先选择单据')`；已勾选显示 `已选 N 条`。

**导出范围（强制）**：导出必须为下拉——「当前页 / 全部筛选结果 / 已选」；执行前确认条数。

**文件下载**：`HasFiles === false` 时显示 `—`，禁止可点击按钮。

```html
<!-- 有选中时显示 -->
<template v-if="selectedKeys.length > 0">
  <span class="bulk-tip">已选 {{ selectedKeys.length }} 条</span>
  <a-button size="small" type="primary" @click="bulkSubmit">批量提交复核</a-button>
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">更多操作 <icon-down /></a-button>
    <template #content>
      <a-doption @click="bulkExport">导出选中</a-doption>
      <a-doption status="danger" @click="bulkDelete">批量删除</a-doption>
    </template>
  </a-dropdown>
</template>

<!-- 右侧工具按钮 -->
<a-tooltip content="列设置">
  <a-button size="small" type="text" @click="openColumnSettings"><icon-settings /></a-button>
</a-tooltip>
<a-tooltip content="刷新">
  <a-button size="small" type="text" @click="refresh"><icon-refresh /></a-button>
</a-tooltip>
<a-tooltip content="密度">
  <a-button size="small" type="text" @click="toggleDensity"><icon-line-height /></a-button>
</a-tooltip>
```

### 14.6 表格行操作按钮规范（最重要的规范）

**原则：行内最多显示 2–3 个图标，超出收入「...」下拉**

```
场景A：只有"查看"：1 个 icon-eye
场景B：查看 + 编辑：2 个 icon
场景C：查看 + 编辑 + 删除：删除放进下拉（danger 操作不直接暴露）
场景D：4 个及以上操作：保留 1–2 个最常用，其余放下拉
```

```vue
<!-- ✅ 场景C 标准写法 -->
<template #default="{ row }">
  <div class="row-actions">
    <a-tooltip content="查看详情">
      <a-button type="text" size="mini" @click="openDetail(row)">
        <icon-eye />
      </a-button>
    </a-tooltip>
    <a-tooltip content="编辑">
      <a-button type="text" size="mini" @click="openEdit(row)">
        <icon-edit />
      </a-button>
    </a-tooltip>
    <a-dropdown trigger="click">
      <a-button type="text" size="mini"><icon-more /></a-button>
      <template #content>
        <a-doption @click="submitAudit(row)">提交复核</a-doption>
        <a-doption @click="rejectAudit(row)">驳回</a-doption>
        <a-divider style="margin:4px 0" />
        <a-doption class="opt--danger" @click="deleteRow(row)">删除</a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
```

```css
.row-actions { display: flex; align-items: center; gap: 2px; }
.row-actions .arco-btn-text { color: var(--color-text-3); }
.row-actions .arco-btn-text:hover { color: var(--primary-6); background: var(--primary-1); }
/* 下拉中的危险操作 */
.opt--danger { color: #dc2626 !important; }
```

**操作列必须 fixed="right"**，宽度 = `图标数量 × 28 + 下拉按钮28`：

```vue
<vxe-column title="操作" fixed="right" align="center"
  :width="row操作=3时用 92, 2时用 64" />
```

### 14.7 卡片/详情区操作按钮

详情抽屉、信息卡片内的操作：

```
右上角（header 区域）：outline 编辑按钮
底部 footer：取消 + 确认（主）
内联操作（如标签旁）：text 按钮，icon-only
```

---

## 十五、链接规范

### 链接类型与用法

| 类型 | 代码 | 用途 |
|------|------|------|
| 行内导航链接 | `<router-link>` + `.link-text` | 页面内跳转（如订单号点击跳详情）|
| 操作触发链接 | `<a-button type="link">` | 触发操作但视觉轻量（如"清除全部"）|
| 外部链接 | `<a target="_blank" rel="noopener">` | 跳到外部系统 |
| 下载链接 | `<a :href="url" download>` | 文件下载 |

```css
/* 行内链接统一样式 */
.link-text {
  color: var(--primary-6);
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}
.link-text:hover { text-decoration: underline; color: var(--primary-7); }

/* 危险链接（清除、删除等轻量） */
.link-danger { color: #dc2626; cursor: pointer; font-size: 12px; }
.link-danger:hover { color: #b91c1c; text-decoration: underline; }

/* 禁用链接 */
.link-disabled { color: var(--color-text-4); cursor: not-allowed; pointer-events: none; }
```

**表格单元格内的可点击值**（如订单号 → 跳详情）：

```vue
<span class="link-text" @click="openDetail(row.id)">{{ row.orderNo }}</span>
```

---

## 十六、弹窗（Modal）规范

### 16.1 何时用弹窗 vs 抽屉

| 场景 | 用弹窗 | 用抽屉 |
|------|--------|--------|
| 操作步骤 | 单步确认、2–3 个字段 | 多字段表单（5个以上）|
| 内容展示 | 简短确认信息 | 详情查看、复杂内容 |
| 上下文 | 中断式、需立即决策 | 非中断，可与列表并存 |
| 示例 | 删除确认、简单状态修改 | 编辑表单、订单详情 |

### 16.2 弹窗尺寸

| 名称 | 宽度 | 适用 |
|------|------|------|
| mini | 360px | 纯文字确认（删除/驳回）|
| small | 480px | 1–3 字段表单 |
| medium | 560px（默认）| 标准表单 |
| large | 720px | 复杂表单、含表格 |
| xlarge | 960px | 全屏操作 |

```vue
<a-modal v-model:visible="visible"
  title="删除确认"
  :width="360"
  simple
  ok-text="确认删除"
  :ok-button-props="{ status: 'danger' }"
  @ok="handleDelete">
  <p style="margin:0">删除后不可恢复，确认继续？</p>
</a-modal>
```

### 16.3 弹窗 Footer 按钮规则

```
取消（outline / text）在左，确认（primary）在右
危险操作：ok-button status="danger"
单按钮：仅"知道了"（关闭纯提示）
禁止超过 3 个按钮
```

```vue
<!-- 纯提示型弹窗 -->
<a-modal title="提示" :footer="false">
  ...
  <div style="text-align:right;margin-top:16px">
    <a-button type="primary" @click="visible=false">知道了</a-button>
  </div>
</a-modal>
```

---

## 十七、抽屉（Drawer）规范

### 17.1 宽度规范

| 类型 | 宽度 | 使用场景 |
|------|------|---------|
| 窄型 | 360px | 快速查看、简单表单 |
| 标准 | 480px | 常规详情/编辑 |
| 宽型 | 640px | 含子表格的详情 |
| 全屏 | 100% | 大型编辑器、复杂流程 |

```vue
<a-drawer v-model:visible="visible"
  title="订单详情"
  :width="480"
  :footer="true">
  <!-- 内容 -->
  <template #footer>
    <a-space>
      <a-button @click="visible=false">关闭</a-button>
      <a-button type="primary" @click="handleEdit">编辑</a-button>
    </a-space>
  </template>
</a-drawer>
```

### 17.2 详情抽屉 vs 表单抽屉

**详情抽屉**（只读）：

- Footer：关闭 + 编辑（如需）
- 内容用 `info-grid` 网格展示
- 长文本用分节 `form-section-title`

**表单抽屉**（可编辑）：

- Footer：取消 + 保存（primary）
- `layout="vertical"` 表单
- 必填字段加 `*` 标记
- 保存前做前端 validate

---

## 十八、表单元素完整规范

### 18.1 所有表单元素统一 size="small"

```vue
<a-input size="small" />
<a-select size="small" />
<a-date-picker size="small" />
<a-checkbox />    <!-- checkbox 无 size，通过 css 控制 -->
<a-switch size="small" />
```

### 18.2 各元素宽度规范

| 元素 | 场景 | 宽度 |
|------|------|------|
| a-input（搜索栏）| 关键词/单号 | 188–200px |
| a-input（表单内）| 弹窗/抽屉 | 100%（撑满列） |
| a-select（搜索栏）| 下拉筛选 | 108–140px |
| a-select（表单内）| 编辑 | 100% |
| a-range-picker | 日期区间 | 220–240px |
| a-date-picker | 单日期 | 136–160px |
| a-textarea | 备注/说明 | 100%，min-height:72px |
| a-input-number | 数字输入 | 80–120px |

### 18.3 必填标记

```vue
<!-- Arco 自动处理必填星号，只需设置 required -->
<a-form-item label="客户名称" field="customer"
  :rules="[{ required: true, message: '请输入客户名称' }]">
  <a-input v-model="form.customer" placeholder="请输入" size="small" />
</a-form-item>
```

### 18.4 placeholder 规范

| 类型 | placeholder |
|------|------------|
| 文本输入 | "请输入{字段名}" |
| 下拉选择 | "请选择{字段名}" / "全部" |
| 日期 | "选择日期" / "开始日期 - 结束日期" |
| 搜索 | "输入{字段名}搜索" 或"关键词" |

### 18.5 下拉选项"全部"规范

筛选场景下拉第一项必须是"全部"（value: ''）：

```ts
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待核查', value: 'pending' },
  { label: '复核中', value: 'reviewing' },
]
```

### 18.6 Switch vs Checkbox vs Radio

| 场景 | 组件 |
|------|------|
| 单个开关（即时生效，如启用/禁用）| a-switch |
| 单个勾选（表单内，提交后生效）| a-checkbox |
| 互斥选择（≤4 个，横排）| a-radio-group |
| 互斥选择（>4 个或空间受限）| a-select |
| 多选（≤4 个）| a-checkbox-group |
| 多选（>4 个）| a-select multiple |

---

## 十九、标签/徽标/状态 pill 规范

### 19.1 状态 pill（自定义）vs a-tag

**自定义 status-pill**：用于表格列中状态值，视觉更紧凑：

```css
.status-pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 1px 7px; border-radius: 10px; font-size: 11.5px; font-weight: 500;
  white-space: nowrap;
}
[data-status="pending"]   { background:#fef3c7; color:#92400e; }
[data-status="reviewing"] { background:#dbeafe; color:#1e40af; }
[data-status="passed"]    { background:#dcfce7; color:#166534; }
[data-status="rejected"]  { background:#fee2e2; color:#991b1b; }
```

**a-tag**：详情展示、筛选标签、文件类型等非核心状态：

```vue
<a-tag size="small" color="orange">待核查</a-tag>
<a-tag size="small" color="arcoblue">复核中</a-tag>
```

### 19.2 数字徽标（a-badge）

```vue
<!-- Tab 计数 -->
<a-badge :count="count" :dot="false" :max-count="99">
  <span>全部</span>
</a-badge>

<!-- 告警提示（红点） -->
<a-badge dot status="danger">
  <icon-bell />
</a-badge>
```

### 19.3 风险等级颜色

```ts
const riskColors = {
  high:   { bg: '#fee2e2', text: '#991b1b' },  // 高风险：红
  medium: { bg: '#fef3c7', text: '#92400e' },  // 中风险：橙黄
  low:    { bg: '#dcfce7', text: '#166534' },  // 低风险：绿
}
```

---

## 二十、数据统计 / KPI 卡片规范

### 20.1 KPI 卡片结构

```html
<div class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">本月订单数</span>
      <a-tooltip content="统计截止今日 0 点"><icon-info-circle /></a-tooltip>
    </div>
    <div class="kpi-body">
      <span class="kpi-value">1,248</span>
      <span class="kpi-unit">单</span>
    </div>
    <div class="kpi-footer">
      <span class="kpi-trend up">↑ 12.4% 环比</span>
    </div>
  </div>
</div>
```

```css
.kpi-grid  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.kpi-card  { background: var(--color-bg-card); border-radius: 6px; padding: 14px 16px; }
.kpi-header { display:flex; align-items:center; justify-content:space-between;
  font-size:12px; color:var(--color-text-3); margin-bottom:10px; }
.kpi-body  { display:flex; align-items:baseline; gap:4px; }
.kpi-value { font-size:24px; font-weight:700; color:var(--color-text-1); font-variant-numeric:tabular-nums; }
.kpi-unit  { font-size:12px; color:var(--color-text-3); }
.kpi-footer { margin-top:8px; font-size:11.5px; }
.kpi-trend.up   { color: #16a34a; }
.kpi-trend.down { color: #dc2626; }
.kpi-trend.flat { color: var(--color-text-3); }
```

### 20.2 KPI 卡片列数规则

| 指标数量 | 列数 | gap |
|---------|------|-----|
| 3–4 个 | 4列（最后1格可空）| 8px |
| 5–6 个 | 3列 | 8px |
| 7–8 个 | 4列 | 8px |
| ≥9 个 | 分两行 4列 | 8px |

---

## 二十一、大屏 / 图表规范

### 21.1 图表类型选择

| 数据类型 | 推荐图表 |
|---------|---------|
| 时间趋势（连续）| 折线图 Line |
| 分类对比（≤8类）| 柱状图 Bar |
| 分类占比（≤6类）| 环形图 Donut（非饼图）|
| 分布/排行（≤10）| 横向柱状图 Bar horizontal |
| 多维对比 | 雷达图 Radar |
| 地理分布 | 地图 Map |

### 21.2 ECharts 颜色主题（与 Arco 主色系一致）

```ts
// 主色序列（全局复用，不要每个图自定义颜色）
export const chartColors = [
  '#165DFF',  // primary-6
  '#36CFC9',  // cyan
  '#F7BA1E',  // yellow
  '#F77234',  // orange
  '#9FDB1D',  // lime-green
  '#A871E3',  // purple
  '#EB4F5E',  // red
  '#14C9C9',  // teal
]

// 图表基础配置（所有图表共用）
export const chartBaseOption = {
  color: chartColors,
  backgroundColor: 'transparent',
  grid: { top: 40, right: 16, bottom: 40, left: 60, containLabel: true },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e5e6eb',
    borderWidth: 1,
    textStyle: { color: '#1d2129', fontSize: 12 },
    extraCssText: 'box-shadow:0 4px 12px rgba(0,0,0,.12);border-radius:6px;',
  },
  legend: {
    bottom: 0,
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    textStyle: { color: '#606880', fontSize: 12 },
  },
}
```

### 21.3 大屏布局网格

```css
/* 大屏页面用 grid 布局，不用 flex */
.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 240px;     /* 行高可叠加 */
  gap: 8px;
  padding: 12px;
  height: 100%;
}

/* 各卡片跨列声明 */
.chart-trend   { grid-column: span 8; }
.chart-pie     { grid-column: span 4; }
.chart-bar     { grid-column: span 6; grid-row: span 2; }
```

### 21.4 图表响应式

```ts
// 所有 ECharts 实例必须监听容器尺寸变化
const resizeObs = new ResizeObserver(() => chart.resize())
resizeObs.observe(chartRef.value)
onBeforeUnmount(() => { resizeObs.disconnect(); chart.dispose() })
```

---

## 二十二、说明文字 / 辅助信息规范

### 22.1 文字层级

| 层级 | 字号 | color token | 用途 |
|------|------|------------|------|
| 主内容 | 13px | color-text-1 | 表格数据、输入值 |
| 次要内容 | 13px | color-text-2 | 卡片标题、表单 label |
| 辅助说明 | 12px | color-text-3 | 提示文字、列标题、占位符 |
| 禁用/无效 | 12px | color-text-4 | 空值"—"、disabled 状态 |

### 22.2 字段说明（helper text）

```vue
<a-form-item label="核查说明">
  <a-textarea v-model="form.note" />
  <template #extra>
    <span style="font-size:11.5px;color:var(--color-text-3)">
      填写发现的风险点，300 字以内
    </span>
  </template>
</a-form-item>
```

### 22.3 Tooltip vs 说明文字

| 场景 | 用哪个 |
|------|--------|
| 列标题含义简短（< 20 字）| Tooltip（hover 查看）|
| 字段说明长或带链接 | form-item extra（常显）|
| 列值过长被截断 | Tooltip 显示完整值 |
| 操作按钮（icon-only）| Tooltip 显示操作名 |

```vue
<!-- 超长文本截断 + tooltip -->
<vxe-column field="remark" title="备注" min-width="200">
  <template #default="{ row }">
    <a-tooltip :content="row.remark" :disabled="!row.remark">
      <span class="ellipsis">{{ row.remark || '—' }}</span>
    </a-tooltip>
  </template>
</vxe-column>
```

```css
.ellipsis { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:block; }
```

### 22.4 提示 / 警告 Banner

```vue
<!-- 页面级警告（数据异常、权限受限等）-->
<a-alert type="warning" show-icon banner
  message="当前数据为昨日快照，点击刷新获取最新数据" />

<!-- 字段级错误（表单验证失败，Arco 自动显示，无需手写）-->
```

---

## 二十三、面包屑（Breadcrumb）规范

### 23.1 何时显示

- 三级及以上导航页面必须显示
- 直属一级菜单页面可省略
- 弹窗/抽屉内不显示

### 23.2 面包屑规则

```vue
<a-breadcrumb separator="/">
  <a-breadcrumb-item>经营分析</a-breadcrumb-item>  <!-- 不可点击（无路由）-->
  <a-breadcrumb-item>
    <router-link to="/analysis/profit-audit">订单利润核查</router-link>
  </a-breadcrumb-item>
  <a-breadcrumb-item>详情</a-breadcrumb-item>      <!-- 当前页，不加链接 -->
</a-breadcrumb>
```

- 当前页（最后一项）：不加链接，`color-text-1`
- 父级：加链接，`color-text-3`，hover 变 primary-6
- 最多 4 级，超出折叠中间层为"..."

---

## 二十四、分页（Pagination）规范

```vue
<a-pagination
  v-model:current="page.current"
  v-model:page-size="page.size"
  :total="page.total"
  :page-size-options="[20, 50, 100, 200]"
  show-total
  show-page-size
  size="small"
  @change="fetchList"
  @page-size-change="fetchList"
/>
```

- 默认每页 **20 条**（密集列表）或 **50 条**（数据量大时）
- 必须显示 total（"共 N 条"）
- 必须显示 page-size 切换（20/50/100/200）
- **位置**：表格卡片顶部 `table-card-cap`，分页靠**右上**；左侧已有「共 N 条」时，分页**不再** `show-total`（避免重复）

```vue
<div class="table-card-cap">
  <div class="table-card-cap__left">
    <span class="table-card-cap__summary">共 <b>{{ total }}</b> 条</span>
  </div>
  <div class="table-card-cap__right">
  <!-- 列设置 -->
    <a-pagination class="table-card-cap__pager" size="small" show-page-size show-jumper />
  </div>
</div>
```

---

## 二十五、图标使用规范

### 25.1 图标来源

所有图标用 `@arco-design/web-vue` 内置图标（`<icon-*>`），**不引入额外图标库**。

### 25.2 图标尺寸

| 场景 | 尺寸（font-size）|
|------|---------------|
| 行操作按钮 | **28×28** `.row-action-btn` 方钮 + tooltip；禁止 `size="mini"` 纯文字图标 |
| 工具栏按钮（small btn）| 15px |
| 页面头部按钮 | 15px |
| KPI 卡片装饰 | 20–24px |
| 空状态图 | 48px |

### 25.3 常用图标映射（保持语义统一）

| 操作 | 图标 |
|------|------|
| 查看详情 | `<icon-eye />` |
| 编辑 | `<icon-edit />` |
| 删除 | `<icon-delete />` |
| 更多操作 | `<icon-more />` |
| 搜索 | `<icon-search />` |
| 刷新 | `<icon-refresh />` |
| 下载/导出 | `<icon-download />` |
| 上传/导入 | `<icon-upload />` |
| 新增 | `<icon-plus />` |
| 筛选 | `<icon-filter />` |
| 设置/配置 | `<icon-settings />` |
| 展开 | `<icon-down />` |
| 收起 | `<icon-up />` |
| 警告 | `<icon-exclamation-circle />` |
| 成功 | `<icon-check-circle />` |
| 信息 | `<icon-info-circle />` |

---

## 二十六、颜色语义系统

### 26.1 功能色

| 语义 | 色值 | 用途 |
|------|------|------|
| 主色 | `var(--primary-6)` → #165DFF | 主按钮、激活状态、链接 |
| 成功 | #16a34a | 已通过、正值毛利率、↑趋势 |
| 警告 | #d97706 | 警戒毛利率、中风险、即将超时 |
| 危险 | #dc2626 | 删除按钮、负值、高风险、错误 |
| 信息 | #0284c7 | 复核中、提示 |
| 禁用 | `var(--color-text-4)` | 禁用状态、空值 |

### 26.2 背景色

| Token | 用途 |
|-------|------|
| `var(--color-bg-body)` | 页面背景（灰色 #f2f3f5）|
| `var(--color-bg-card)` | 卡片/面板背景（白色）|
| `var(--color-bg-2)` | 表头背景（#f8f9fc）|
| `var(--primary-1)` | 主色轻背景（选中行、激活徽标背景）|

### 26.3 禁止直接写颜色值的地方

- 所有背景色必须用 token（`var(--color-bg-*)`），不写 `#fff`
- 所有主色必须用 `var(--primary-*)` token，不写 `#165DFF`
- 功能色（成功/警告/危险）可直接写 hex（语义明确）

---

## 二十七、间距系统

### 27.1 间距基准（4px grid）

| 值 | 用途 |
|----|------|
| 4px | zone 间 gap（页面层级分隔）|
| 8px | 模块内元素间距、卡片 grid gap |
| 12px | 搜索字段间距（gap:12px）|
| 16px | 内容区 padding（左右）|
| 20px | 章节/分组间距 |
| 24px | 大模块间距 |

### 27.2 内边距（Padding）规范

| 区域 | Padding |
|------|---------|
| 页面 header | 12px 16px |
| zone-filter 内容区 | 12px 16px |
| zone-data 内容区 | 0（VXE 自带）|
| 弹窗内容区 | Arco 默认（约 20px）|
| 抽屉内容区 | Arco 默认（约 20px）|
| KPI 卡片 | 14px 16px |

---

## 二十八、权限控制 UI 规范

### 28.1 按钮级权限

没有操作权限时：**隐藏按钮，不显示 disabled**（disabled 会让用户困惑）

```vue
<a-button v-if="hasPermission('order:create')" type="primary" size="small">
  新建
</a-button>
```

### 28.2 页面级权限

整页无权限时：展示 403 状态页，不显示任何业务内容：

```vue
<template v-if="!hasPagePermission">
  <a-result status="403" title="暂无权限"
    subtitle="您没有访问此页面的权限，请联系管理员">
    <template #extra>
      <a-button @click="$router.back()">返回上一页</a-button>
    </template>
  </a-result>
</template>
<template v-else>
  <!-- 正常页面内容 -->
</template>
```

### 28.3 字段级权限

敏感字段（如毛利率、成本）对无权限用户显示 `***`：

```vue
<template #default="{ row }">
  <span v-if="canViewCost">{{ row.cost }}</span>
  <span v-else style="color:var(--color-text-4);letter-spacing:2px">***</span>
</template>
```

---

## 二十九、加载 / 骨架屏规范

### 29.1 三级加载策略

| 场景 | 方案 |
|------|------|
| 表格数据加载 | VXE `:loading="loading"` 内置（优先）|
| 页面首次加载 | `<a-skeleton>` 骨架屏 |
| 按钮触发异步 | `<a-button :loading="submitting">` |
| 局部区域刷新 | `<a-spin :loading="loading">` 包裹 |

### 29.2 骨架屏占位规范

骨架屏行数 = 默认每页条数（20 条），宽度比例模拟真实列比：

```vue
<template v-if="isFirstLoad">
  <a-skeleton v-for="i in 10" :key="i" :animation="true" style="margin-bottom:8px">
    <a-skeleton-shape :style="{width:'100%',height:'36px',borderRadius:'2px'}" />
  </a-skeleton>
</template>
```

---

## 三十、设计规范检查清单（新页面必检）

写完任何新页面，过一遍以下清单：

```
Layout
□ 使用了 zone-filter + zone-data 分区布局
□ 页面背景是 var(--color-bg-body)（灰色）
□ 两区之间 gap:4px

Search / Filter
□ 下拉变更即搜索，文本框 Enter/点查询
□ Tier 2 使用 a-form 栅格（span=6）+ 右侧查询/重置
□ 展开筛选：icon 切换 + (+N) + 折叠区 badge
□ 人员字段用 a-select，禁止手输姓名
□ 订单类页面有时间快捷 chip（今日/本周/本月）
□ "全部" 选项 value: '全部' 或 ''
□ 筛选激活时显示 FilterActiveStrip（含状态/范围回显）
□ 状态 Tab 有「清除状态」入口

Table
□ 至少有 1 列用 min-width（无右侧空白）
□ 操作列 fixed="right"
□ 行操作最多 2 个直接暴露 + 1 个 more 下拉
□ 数字列 align="right"
□ 状态列 align="center"
□ 空值显示 "—"
□ 提交时间/单号列 sortable
□ 长文本列 ellipsis + tooltip
□ 列设置 + localStorage 持久化
□ 危险品列有红色警示 icon
□ 禁止整行状态底色（仅状态列 pill）

Toolbar
□ 导出为下拉（当前页/全部筛选/已选）
□ 批量操作未选时 Message.warning
□ 无文件行显示 — 不可点下载
□ 同区域最多 1 个 primary 按钮
□ 危险操作（删除/驳回）有二次确认
□ 行内操作全部有 tooltip
□ 所有按钮统一 size="small"（弹窗 footer 除外）

Forms
□ 表单 layout="vertical"（抽屉/弹窗内）
□ 保存前调用 formRef.validate()
□ 错误提示 Arco 自动显示，不额外写

Routing
□ 新增路由模块文件
□ 更新 router/index.ts
□ 更新 config/menu.ts
□ 更新 config/tabs.ts

Code
□ 无 console.log 遗留
□ 无 TODO 注释
□ 无硬编码颜色（除功能色 hex）
□ VXE 表格 border="none"（+ global.css 中 background-image:none）
```

---

## 三十一、与设计目标直接挂钩的规范补充

> 本章对应 1.1 设计目标五大优先级，补充 SKILL 中此前未覆盖的具体规则。

---

### 31.1 3秒原则 → 首屏必须呈现的信息

页面加载完成后，用户 3 秒内必须能看到：

| 必须立即可见 | 实现方式 |
|------------|---------|
| 当前业务状态总览 | KPI 统计条（zone-kpi）在最顶部，高度 ≤ 60px |
| 异常 / 需处理项数量 | KPI 数字用语义色（红/橙）醒目标示 |
| 筛选后的数据行 | 表格直接渲染首页 20 条，无需额外点击 |
| 当前激活的筛选条件 | FilterActiveStrip 有 tag 时显示在筛选卡片底 |

**反模式**：不允许首屏是 loading spinner + 空白，数据必须 SSR 或 mock 快速呈现。

---

### 31.2 表格列顺序优先级规则

列从左到右按「重要性」排布，用户视线从左扫：

```
固定列（最重要，不随横滚消失）
  ① 复选框
  ② 序号
  ③ 主标识列（订单号）

可滚动列（按信息重要性排）
  ④ 状态（第一时间知道该条记录处于什么阶段）
  ⑤ 客户（知道是谁的单）
  ⑥ 核心业务字段（港口/日期/金额，视模块而定）
  ⑦ 次要业务字段（负责人/业务线/备注）
  ⑧ 时间戳类（更新时间、创建时间，信息量最低）

固定右侧列
  ⑨ 文件（如有）
  ⑩ 操作列
```

**推导规则**：新增列时，先问「用户扫视时最先想确认的信息是什么」，放在越靠左越好。

---

### 31.3 异常行高亮（超越颜色的手段）

颜色语义（红/橙）是基础，但长时间盯着颜色会疲劳。异常行需要多维度提示：

```
① 状态列 pill / Tag 着色 — 必须有
② 行 hover 统一浅蓝灰 — 必须有
③ 异常原因 tooltip（点击 status-pill 或 hover 时展示原因）— 推荐
④ 批量筛选（FilterTabs 中的"异常"Tab 红色胶囊）— 必须有
```

**禁止**：用纯字体加粗表示异常（字体粗细不是好的异常信号）。  
**禁止**：按状态给整行铺不同底色（视觉噪音大、长时间使用易疲劳）。

---

### 31.4 少色原则（防视觉疲劳）

货代系统用户连续使用 8 小时以上，颜色必须克制：

```
规则1：整张页面同时出现的有彩色种类 ≤ 4 种
      （primary蓝 + 成功绿 + 警告橙 + 危险红，最多加 1 个紫/青）

规则2：状态 pill 的背景色用对应色的 10%-15% 淡化版
      ❌ background: #dc2626（高饱和度，刺眼）
      ✅ background: #fee2e2（淡化版，可长时间看）

规则3：图表颜色最多同时出现 5 种（chartColors 前 5 项）

规则4：禁止用渐变色作为状态背景
      渐变 = 装饰，不是信息传递

规则5：黑/灰/白占页面 90% 以上视觉面积，
      有彩色只用于传递语义，不用于填充背景区域
```

---

### 31.5 表单字段默认值规范（减少重复录入）

| 场景 | 默认值规则 |
|------|----------|
| 负责人 | 默认填入当前登录用户 |
| 日期范围 | 默认填入「近 30 天」（业务常用区间）|
| 运输方式 | 默认填入用户上次选择（localStorage 记忆）|
| 区域 | 默认填入当前用户所属区域 |
| 客户 | 有上下文时（从订单发起）自动带入，不需要用户重选 |
| 状态 | 筛选下拉默认"全部"（value: ''），不预选某一状态 |

```ts
// 负责人默认值示例
const form = ref({
  owner: userStore.currentUser.name,  // 从用户状态获取
  dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
})
```

**核心原则**：凡是能推断出来的字段，就不让用户手填。减少录入 = 减少出错。

---

### 31.6 减少不必要跳页规则

货代业务中「查看 + 操作」通常需要同时进行，跳到新页面会丢失列表上下文。

```
列表页内可完成的操作 → 不开新页面
详情查看             → 右侧抽屉（保留列表可见）
简单编辑（≤5字段）   → 右侧抽屉表单
复杂编辑（>5字段）   → 右侧宽抽屉（640px）
纯确认操作           → Modal 弹窗
仅有特殊场景才开新页面：
  · 多步骤向导（3步以上）
  · 需要全屏展示的内容（大屏报表、地图）
  · 用户明确需要"打开新标签"对比查看
```

**检验标准**：操作完成后，用户能立即看到列表刷新结果，不需要按浏览器"返回"。

---

## 三十二、PC 端屏幕适配规范

> 货代系统是纯桌面工具，**不支持移动端**，但需要在不同 PC 分辨率下正常工作。

---

### 32.1 支持的屏幕分辨率

| 分辨率 | 场景 | 支持级别 |
|-------|------|---------|
| ≥ 1920 × 1080 | 办公桌面显示器（主流）| ✅ 完全支持，设计基准之一 |
| 1440 × 900 / 1440 × 960 | MacBook Pro 外接/笔记本 | ✅ **设计基准**，所有页面在此分辨率必须完美 |
| 1366 × 768 | 业务员笔记本（**最小支持**）| ✅ 支持，部分区域可水平滚动 |
| < 1366px | 小屏/移动 | ❌ **不支持**，显示提示引导切换设备 |
| > 2560px（4K/超宽）| 高端显示器 | ✅ 支持，内容区加 max-width 防止过度拉伸 |

```css
/* 全局最小宽度保障（最小支持 1366px） */
body { min-width: 1366px; }

/* 超宽屏（>2560px）内容区防拉伸 */
.main-content { max-width: 2400px; margin: 0 auto; }
```

---

### 32.2 侧边栏适配

| 宽度区间 | 侧边栏状态 | 内容区宽度（约）|
|---------|----------|--------------|
| ≥ 1440px | 展开（220–260px）| ~1200px+ |
| 1366–1439px | **自动折叠**（图标模式 64px）| ~1300px |
| < 1366px | 不支持 | — |

```ts
// 侧边栏自动折叠逻辑
const isCollapsed = ref(window.innerWidth < 1440)
window.addEventListener('resize', () => {
  isCollapsed.value = window.innerWidth < 1440
})
```

---

### 32.3 页面内容区布局适配

#### 内容区有效宽度参考

| 分辨率 | 侧边栏 | 内容区有效宽度 |
|-------|--------|-------------|
| 1366px | 折叠 64px | ~1300px |
| 1440px | 展开 240px | ~1184px |
| 1920px | 展开 240px | ~1664px |
| 2560px | 展开 240px | ~2304px（受 max-width 限制）|

---

### 32.4 KPI 统计条适配

```css
/* 宽屏：等分多列 */
.kpi-grid { display: flex; }
.kpi-card { flex: 1; }

/* ≤1280px 时，超过 4 个 KPI 换行显示 */
@media (max-width: 1380px) {
  .zone-kpi { flex-wrap: wrap; }
  .kpi-card { min-width: 160px; flex: 0 0 calc(50% - 1px); }
  .kpi-divider { display: none; }
}
```

---

### 32.5 搜索筛选区适配

搜索字段使用 `flex-wrap: wrap`，在窄屏自然折行，**无需 media query**：

```css
.search-fields {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;    /* 自动折行，最关键 */
  row-gap: 8px;
}
```

**宽度规范保证折行后不变形**：每个字段都有固定 `style="width:Npx"`，折行后仍保持原宽，不会被拉伸。

---

### 32.6 表格适配（最重要）

#### 表格永远启用横向滚动，不换行

```vue
<vxe-table
  :scroll-x="{ enabled: true, gt: 0 }"  <!-- 始终启用横滚 -->
  show-overflow="title"                   <!-- 单元格超出用 title tooltip，不换行 -->
>
```

#### 不同宽度下的列显示策略

| 内容区宽度 | 可见列数（大约）| 右侧是否有空白 |
|-----------|-------------|-------------|
| ~1200px | 8–10 列 | 靠 min-width 列填充，无空白 |
| ~1440px | 10–13 列 | 靠 min-width 列填充，无空白 |
| ~1700px | 12–16 列 | min-width 列拉伸更宽，无空白 |

**核心规则**：每张表有且只有 1 列用 `min-width`（客户/名称/备注列），让该列自动填满剩余空间，确保任何分辨率下表格右侧无空白。

#### 固定列在窄屏尤其重要

```vue
<!-- 左固定：最重要的标识信息 -->
<vxe-column field="orderNo" fixed="left" width="152" />

<!-- 右固定：操作永远可及 -->
<vxe-column title="操作" fixed="right" width="92" />
```

窄屏（1280px）下列不够显示时，用户水平滚动，但订单号和操作始终可见。

---

### 32.7 弹窗 / 抽屉适配

| 组件 | 窄屏（1280px）| 宽屏（1920px）|
|-----|-------------|-------------|
| Modal | 宽度不变（360–720px），居中 | 宽度不变，居中 |
| Drawer | 宽度不变（400–640px），右侧滑入 | 宽度不变 |
| 禁止 | 用 `width: 100vw - 200px` 这类相对宽度 | 固定 px 宽度更可预测 |

---

### 32.8 表单列数适配

| 表单场景 | 宽屏（≥1440px）| 窄屏（1280px）|
|---------|-------------|-------------|
| 弹窗内表单 | 单列（Modal 宽度固定）| 单列 |
| 抽屉内表单 | 单列（Drawer 宽度固定）| 单列 |
| 独立表单页 | 2列 `<a-col :span="12">` | 1列 `<a-col :span="24">` |

```vue
<!-- 独立表单页：响应式列数 -->
<a-row :gutter="12">
  <a-col :xs="24" :lg="12">
    <a-form-item label="起运港">...</a-form-item>
  </a-col>
  <a-col :xs="24" :lg="12">
    <a-form-item label="目的港">...</a-form-item>
  </a-col>
</a-row>
```

---

### 32.9 大屏（1920px+）特别规范

宽屏是货代公司运营人员常用的场景（大屏显示器看订单）：

```
✅ 表格 min-width 列自动拉宽 → 单元格内容更易读
✅ KPI 数字更大，数值更突出
✅ 搜索字段不折行，一行显示全部
✅ 图表组件 ResizeObserver 自动铺满容器

❌ 禁止：内容区宽度无限拉伸（超过 2400px 加 max-width）
❌ 禁止：字号随屏幕宽度放大（字号固定，不做 vw 单位）
❌ 禁止：在大屏上增加更多列（列数由业务决定，不由屏宽决定）
```

---

### 32.10 小屏（1366px）兼容检查清单

```
□ 侧边栏是否自动折叠为图标模式？
□ KPI 条是否正常折行（≥5个KPI）？
□ 搜索字段是否自动折行而不溢出？
□ 表格是否横向可滚动？
□ 固定左列（订单号）和固定右列（操作）是否始终可见？
□ 弹窗/抽屉是否在可视区域内（不超出屏幕）？
□ 工具栏按钮是否挤压（超过 4 个按钮要收入下拉）？
```

    
---

## 三十三、色彩规范（来自设计规范 5.3）

### 33.1 主色

```
主色：#165DFF
用于：主按钮、当前菜单高亮、当前页签、关键链接、当前筛选项
```

### 33.2 功能色（语义色）

```
成功：#00B42A   → 已完成、已通过、正常状态
警告：#FF7D00   → 待处理、注意状态、风险提示
危险：#F53F3F   → 异常、错误、拒绝、删除操作
信息：#86909C   → 中性提示、辅助说明
```

### 33.3 中性色

```
主文本：  #1D2129   → 列表主字段、表头
正文：    #4E5969   → 正常内容
辅助：    #86909C   → 次要信息、占位文字
弱提示：  #C9CDD4   → 禁用状态文字
边框：    #E5E6EB   → 分割线、边框
背景：    #F5F7FA   → 页面背景、表头背景
```

### 33.4 色彩使用禁止项

```
❌ 禁止使用过多强调色（同一屏幕最多 2 种功能色）
❌ 禁止大面积高饱和背景
❌ 禁止不同页面相同状态使用不同颜色
❌ 禁止用颜色作为唯一信息载体（必须配合文字/图标）
```

---

## 三十四、视觉字体与间距精确规范（来自设计规范 5.4/5.5）

### 34.1 字号体系

| 用途 | 字号 | 字重 |
|-----|------|------|
| 页面标题 | 16–20px | 600 |
| 模块标题 | 14–16px | 600 |
| 正文 | 13–14px | 400 |
| **表格内容** | **12–13px** | 400 |
| 辅助信息 | 12px | 400 |
| KPI 数字 | 20–28px | 600–700 |

> **禁止大量使用粗体**。粗体只用于关键业务信息（订单号、金额、状态）。

### 34.2 间距精确值

| 区域 | 间距值 |
|-----|--------|
| 页面边距（内容区左右） | 8–16px |
| 模块间距（zone 之间） | 8–12px |
| 组件间距（同一 zone 内） | 6–10px |
| 表格单元格左右 padding | 8px |
| **表格行高（紧凑/默认）** | **30–36px** |
| 工具栏高度 | 38–44px |
| 标签宽度（查询区）| 64–88px（右对齐）|
| 查询字段控件高度 | 28–32px（size="small"）|

> **规范行高与实现说明**：设计规范要求 30–36px。我们实现用 `compact=40px / standard=52px`。
> 在 Arco Design `size="small"` 体系下，40px 对应规范"紧凑"档，与设计意图一致。

### 34.3 视觉高级感来源

高级感通过**秩序**实现，而非装饰：

```
✅ 统一栅格对齐
✅ 统一控件高度（同一页面内 size 一致）
✅ 统一边框颜色（#E5E6EB）
✅ 清晰信息层级（主/副/辅三层）
✅ 克制的状态色（不超过 2 种功能色同屏）
✅ 稳定的页面节奏（zone 间距统一）

❌ 禁止大渐变背景
❌ 禁止毛玻璃效果
❌ 禁止发光/霓虹效果
❌ 禁止复杂装饰背景
❌ 禁止过度投影（box-shadow 仅用于卡片 hover）
```

---

## 三十五、状态视觉规范（来自设计规范 5.6）

### 35.1 状态必须可视化

状态字段禁止只用普通文字，必须配合 Tag / Badge / 状态点。

### 35.2 货代常用状态色对照

| 状态 | 颜色语义 | CSS 变量 / 十六进制 |
|-----|---------|-----------------|
| 未提交 / 草稿 | 中性色 | `#86909C` |
| 待审核 / 待处理 | 警告色 | `#FF7D00` |
| 已接单 / 处理中 | 主色 | `#165DFF` |
| 已放舱 / 已完成 | 成功色 | `#00B42A` |
| 已拒绝 / 异常 | 危险色 | `#F53F3F` |

### 35.3 状态标签实现

使用自定义 `.s-pill[data-s]` 而非 `<a-tag>`，保持紧凑：

```html
<span class="s-pill" data-s="pending">待审核</span>
<span class="s-pill" data-s="processing">处理中</span>
<span class="s-pill" data-s="done">已完成</span>
<span class="s-pill" data-s="rejected">已拒绝</span>
```

```scss
.s-pill {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 20px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  &[data-s="pending"]    { background: #fff3e8; color: #ff7d00; }
  &[data-s="processing"] { background: #e8f0ff; color: #165dff; }
  &[data-s="done"]       { background: #e8ffea; color: #00b42a; }
  &[data-s="rejected"]   { background: #ffece8; color: #f53f3f; }
  &[data-s="draft"]      { background: #f0f1f2; color: #86909c; }
}
```

---

## 三十六、交互规范（来自设计规范 6.x）

### 36.1 查询交互

- 主查询区只放**高频条件**（≤3 个字段，最多 8 个）
- 查询按钮必须明显（`type="primary"`），重置按钮紧跟其后（`type="outline"`）
- 输入后按 `Enter` 触发查询
- 查询结果保持在当前页，**不跳转到其他页面**
- 查询条件变化后自动回到第 1 页

**单号类查询最佳实践**：

```html
<!-- 用「类型下拉 + 输入框」合并，避免为每种单号单独铺输入框 -->
<a-input-group>
  <a-select v-model="searchType" style="width:130px">
    <a-option value="bizNo">业务单号</a-option>
    <a-option value="hbl">HBL</a-option>
    <a-option value="mbl">MBL</a-option>
    <a-option value="container">柜号</a-option>
  </a-select>
  <a-input v-model="searchValue" @press-enter="handleSearch" />
</a-input-group>
```

### 36.2 高级查询交互

采用页内展开模式，**不打断列表操作**：

```
主查询区（始终可见）
高级查询区（默认收起，点击展开）
数据表格（不被高级查询遮挡）
```

高级查询要求：

- 按业务逻辑分组（基础信息 / 时间条件 / 状态条件）
- 显示已选条件数量（`"高级筛选(3)"`）
- 支持一键清空所有高级条件
- 展开高度不超过 **120–180px**（防止压缩表格）
- 禁止用弹窗展示几十个查询字段（字段墙）

### 36.3 列表操作规范

三类操作严格分层：

| 层级 | 操作示例 | 放置位置 |
|-----|---------|---------|
| **页面级操作** | 刷新、创建、导出 | 工具栏右侧 |
| **批量操作** | 批量下载、批量分配 | 工具栏左侧（选中行后出现）|
| **行级操作** | 查看、编辑、下载 | 每行操作列 |

**行级操作严格规则**：

- 默认只展示 **1 个主操作**（通常是"查看"图标按钮）
- 其余操作全部收入 `<a-dropdown>` 更多菜单
- 危险操作（删除/作废）**只能在下拉菜单中**，禁止直接暴露

```html
<!-- 行操作：1 个主操作 + 更多下拉 -->
<a-space :size="2">
  <a-button type="text" size="mini" @click="handleView(row)">
    <icon-eye />
  </a-button>
  <a-dropdown trigger="click">
    <a-button type="text" size="mini"><icon-more /></a-button>
    <template #content>
      <a-doption @click="handleEdit(row)">编辑</a-doption>
      <a-doption @click="handleDownload(row)">下载</a-doption>
      <a-doption class="danger-option" @click="handleDelete(row)">删除</a-doption>
    </template>
  </a-dropdown>
</a-space>
```

### 36.4 操作反馈规范

| 操作类型 | 反馈方式 |
|---------|---------|
| 查询/刷新 | 按钮 loading + 表格 loading |
| 成功提交 | `Message.success('操作成功')` |
| 删除/作废/批量修改 | 必须二次确认（`Modal.confirm`）|
| 表单校验失败 | 字段下方红色提示文字 |
| 网络错误 | `Message.error('操作失败，请重试')` |

### 36.5 状态筛选 Tab 交互

- Tab 靠近表格，位于工具栏下方 / 表格上方
- 当前状态高亮，显示数量徽标
- 点击后**立即筛选**，与主查询条件叠加生效
- 状态 Tab 不与主查询区混在一起（分区清晰）

### 36.6 分页交互规范

- 分页位于**表格卡片顶部右侧**（`table-card-cap`），紧贴表头上方，与数据区同卡片
- 显示总数（`show-total`）+ 支持 pageSize 切换（`show-page-size`）+ 跳页（`show-jumper`）
- 查询条件变化后回到第 1 页
- 分页变化**不清空**查询条件
- 禁止上下重复放分页
- 禁止分页放在页面底部独立 L5 条或与批量工具栏混排

### 36.7 详情交互规范

- 快速查看用**右侧 Drawer**（保留列表上下文，可快速关闭）
- 复杂编辑或完整详情才进入独立页面
- Drawer 关闭后保留列表的查询状态（不重置）
- Drawer 标题必须明确（业务单号 / 客户名 / 操作类型）
- 关键状态（订单状态/审核状态）必须在 Drawer 顶部首屏可见

---

## 三十七、页面布局结构规范（来自设计规范 4.x）

### 37.1 首屏空间分配原则

| 区域 | 占首屏高度 |
|-----|-----------|
| 数据表格区 | ≥ **60%** |
| 查询区（含高级查询）| ≤ **18%** |
| KPI 统计条 | ≤ 10%（可选）|
| 工具栏 + 状态筛选 | ≤ 10% |

禁止查询区过高压缩表格空间。禁止大面积无效留白。

### 37.2 标准列表页结构

```
列表页（无 zone-header）
├── zone-kpi          可选，KPI 统计条（4–5 个指标）
├── zone-filter       主查询区（高频条件）
│   └── [高级查询展开区]  默认收起，页内展开（高度 ≤180px）
└── zone-data
    ├── FilterActiveStrip  有激活条件时显示
    ├── StatusTabs         状态快速切换
    ├── Toolbar            工具栏（左:总数/批量, 右:操作按钮+工具图标）
    ├── DataTable          VXE Table（占主要空间）
    └── TableCap           表格顶栏：左总数，右上分页 + 列设置
```

### 37.3 详情页结构

```
详情页
├── 返回按钮 + 页面标题（与 Breadcrumb 组合）
├── 关键状态摘要（顶部首屏必须可见）
├── 基础信息分组
├── 业务节点 / 时间线
├── 费用信息
├── 文件附件
└── 操作记录 / 日志
```

复杂详情使用 Tab 分组或左侧锚点导航，禁止单页无限堆叠。

### 37.4 编辑/表单页结构

```
表单页（新建 / 编辑）
├── 分组 1：基础信息
├── 分组 2：客户信息
├── 分组 3：运输信息
├── 分组 4：货物信息
├── 分组 5：费用信息
└── 底部固定操作栏：取消 | 保存 | 提交
```

- 长表单必须提供分组导航（左侧锚点或顶部 Tabs）
- 主操作按钮固定在底部（`position: sticky; bottom: 0`），滚动时始终可见
- 禁止提交按钮只能滚到最底部才可见

---

## 三十八、AI 生成页面专项规范（来自设计规范 9.x）

> 本章专门约束 AI（包括本 SKILL 本身）在生成页面和代码时的行为规则。

### 38.1 生成前必须分析

在生成任何页面之前，必须先明确：

```
1. 业务场景是什么？（货代哪个业务环节）
2. 用户角色是谁？（操作员 / 销售 / 财务 / 管理）
3. 核心任务是什么？（高频操作是什么）
4. 核心字段有哪些？（默认展示什么，什么进详情/高级查询）
5. 页面层级？（列表页 / 详情页 / 表单页 / 弹窗）
```

禁止在未分析业务目标前直接写代码。

### 38.2 PESDP 生成原则

| 原则 | 要求 |
|-----|------|
| **Professional** | 使用货代行业术语，不用通用后台占位词 |
| **Efficient** | 优先实现高频操作路径（3秒原则）|
| **Structured** | 严格按 zone-kpi/zone-filter/zone-data 结构 |
| **Dense** | 保证首屏数据效率，表格行数 ≥ 15 条 |
| **Premium** | 视觉克制、统一、专业（秩序感而非装饰）|

### 38.3 生成代码结构要求

```
src/
  views/
    [module]/
      [page]/
        components/       # 子组件
        composables/      # use*.ts 业务逻辑
        config.ts         # 列配置、选项配置
        types.ts          # TypeScript 类型
        index.vue         # 页面入口（只负责组合）
```

- 禁止把所有逻辑写在 `index.vue` 一个文件里
- 禁止硬编码菜单到页面组件中
- 组件超过 200 行必须拆分子组件

### 38.4 生成列表页必须包含的元素

```
✅ 主查询区（Tier 1 横排 或 Tier 2 栅格表单，§11.4/§11.5）
✅ 查询 + 重置（重置始终可见）
✅ 展开筛选（Tier 2：icon + (+N) + localStorage）
✅ FilterActiveStrip（表单 + 状态 + 范围 + 时间回显）
✅ 人员字段 a-select（§11.9）
✅ 时间快捷 chip（订单类，§11.10）
✅ 状态筛选 Tabs + 清除状态
✅ 工具栏（左:批量, 右:导出下拉/列设置/刷新）
✅ VXE Table（border="none", sortable 时间/单号列）
✅ 长文本 ellipsis + tooltip
✅ 列显隐 localStorage
✅ 危险品警示 icon
✅ 每表必有 1 个 min-width 列
✅ 分页（table-card-cap 右上）
✅ 空状态 / 错误状态
✅ 批量操作未选提示；导出范围选择
```

### 38.5 生成表格必须遵守

- 默认展示列数 **12–15 列**，超出进列配置或详情
- 状态字段用 `.s-pill[data-s]` 而非纯文字
- 操作列只默认显示 **1 个主操作图标按钮 + 更多下拉**
- 链接字段用主色 `#165DFF`，鼠标 cursor: pointer
- 禁止 Excel 风格重边框（`border="none"`）
- 禁止所有字段同等权重（主字段 font-weight: 500，次字段 color: #86909C）

### 38.6 生成后自查清单

```
□ 是否使用了货代业务语言（非通用占位词）？
□ 是否符合 zone-filter/data 分区？
□ 筛选区 Tier 是否与字段数匹配（§11.2）？
□ FilterActiveStrip 是否覆盖状态 Tab 回显？
□ 是否控制了表格默认列数（≤15，其余列设置）？
□ 是否每表有且只有 1 个 min-width 列？
□ 是否状态字段用了 s-pill 而非纯文字？
□ 是否禁止整行状态底色？
□ 是否时间/单号列可排序？
□ 是否长文本有 tooltip？
□ 是否导出有范围选择？
□ 是否批量操作有未选校验？
□ 是否行操作收敛（1 主操作 + 更多下拉）？
□ 是否代码按 module/page/components/composables 拆分？
□ 是否首屏数据区 ≥60% 视口高度？
□ 查询区是否 ≤18% 视口高度？
```

### 38.7 AI 禁止项（Hard Rules）

```
❌ 禁止虚构不存在的菜单填充页面
❌ 禁止为了好看牺牲数据区空间
❌ 禁止生成营销页/展示型 SaaS 风格
❌ 禁止大面积装饰背景、大渐变、毛玻璃
❌ 禁止把高级查询做成全屏字段墙弹窗
❌ 禁止不经业务分析直接写代码
❌ 禁止把大项目页面写成单文件 Demo
❌ 禁止 App.vue 包含所有页面逻辑
❌ 禁止状态字段只用普通文字
❌ 禁止表格右侧留有空白（必有 min-width 列）
❌ 禁止操作列堆多个直接暴露的危险按钮
❌ 禁止人员筛选用手输 input（必须用 a-select）
❌ 禁止导出无范围选择的单按钮
❌ 禁止按状态给表格整行铺底色
❌ 禁止无文件行渲染可点击下载按钮
❌ 禁止批量操作无勾选校验
❌ 禁止列表页无 FilterActiveStrip（有筛选时）
```

---

## 三十九、列表页体验完整性规范（统一索引）

> 本章将分散条款汇总为**一张交付标准**，新页面 / Code Review / AI 生成均以此为准。
> 业务单（SaleOrder）为 Tier 2 参考实现。

### 39.1 区域结构（不变）

```
page-root
├── zone-filter     运输 Tab + 栅格筛选 + FilterActiveStrip
└── zone-data       状态 Tab → 工具栏 → table-card-cap（右上分页）→ 表格
```

### 39.2 筛选区（§11.5 ~ §11.11）

| # | 必须项 | 章节 |
|---|--------|------|
| 1 | Tier 2：`a-form` + `a-row` span=6，右侧查询/重置 | §11.5 |
| 2 | 展开：`icon-down/up` + `(+N)` + 折叠 badge | §11.5 |
| 3 | 重置清空表单并重新查询 | §11.7 |
| 4 | FilterActiveStrip 回显全部激活条件 | §11.8 |
| 5 | 人员字段 `a-select` | §11.9 |
| 6 | 时间 chip：今日/本周/本月/自定义 | §11.10 |

### 39.3 状态 Tab（§12.3）

| # | 必须项 |
|---|--------|
| 1 | 点击筛选 + Tab 激活态 |
| 2 | Strip 回显 `状态：xxx` |
| 3 | 「清除状态」快捷入口 |

### 39.4 表格（§5.4 ~ §5.8）

| # | 必须项 |
|---|--------|
| 1 | 时间/单号 `sortable` |
| 2 | 长文本 ellipsis + tooltip |
| 3 | 列设置 + localStorage |
| 4 | 危险品红色 icon + pill |
| 5 | 禁止整行状态底色 |

### 39.5 工具栏（§14.5）

| # | 必须项 |
|---|--------|
| 1 | 导出下拉：当前页 / 全部筛选 / 已选 |
| 2 | 批量未选 `Message.warning` |
| 3 | 无文件显示 `—` |
| 4 | 列设置、刷新、密度（右侧 icon） |

### 39.6 业务单当前差距对照（实现追踪）

| 规范项 | 规范要求 | 当前页面 |
|--------|---------|---------|
| 五层分区 | §41.2 | ✅ 已实现 |
| 栅格筛选首行操作 | §41.3 | ✅ 已实现 |
| FilterActiveStrip | §11.8 / §41.3 | ✅ 按需显示（无空态） |
| 人员下拉模糊搜索 | §11.9 / §41.3 | ✅ 已实现 |
| 清除状态 | §12.3 | ✅ 已实现 |
| 运输 Tab 清空筛选 | §41.3 | ✅ 已实现 |
| 表头排序 | §5.4 | ✅ 已实现 |
| 长文本 tooltip | §5.5 | ✅ 已实现 |
| 列设置 | §5.6 | ✅ 已实现 |
| 危险品警示 | §5.7 / §41.4 | ✅ 单元格 pill（无整行底色） |
| 导出范围 | §14.5 | ✅ 已实现 |
| 批量校验 | §14.5 | ✅ 已实现 |
| 分页独立 L5 | §41.2 | ❌ 已废弃 → 表格右上 `table-card-cap` |
| 权限按钮隐藏 | §41.5 | ✅ 已实现 |
| 时间 chip | §11.10 / §41.3 | ✅ 已实现（今日/近7天） |
| 筛选固定操作列 | §41.3 | ✅ 查询/重置位置固定 |
| FilterActiveStrip 常驻 | §41.3 | ❌ 已废弃 → 有 tag 才显示 |
| 人员字段全 Select | §41.3 | ✅ 已实现 |
| 范围 Tab 分层 | §41.5 | ✅ 统一 `.stab` pill |
| 无文件不可点 | §14.5 | ✅ 已实现（disabled 置灰） |
| 表格隔行 stripe | §41.4 | ❌ 已废弃 → 统一白底 + hover |
| 工具栏分区文字 | §41.5 | ❌ 已废弃 → 竖线分组无「操作/跟踪/单据」 |
| 色彩独立 hex | §41.1 | ❌ 已废弃 → 映射 Arco `--primary-*` |

---

## 四十一、高密度五层全链路页面交付标准（PESDP Zone v2）

> 本章为货代 SaaS 列表页**项目级统一规范**，与 §11 / §12 / §5 / §14 互补；业务单 `saleOrder` 为参考实现。

### 41.1 设计 Token（色彩映射 Arco，禁止页面内另起 hex）

| Token | 值 | 用途 |
|-------|-----|------|
| 色彩源 | `ui-skill/arco-ui.css` → `@arco-themes/vue-gi-demo` | **唯一**色彩定义层 |
| 主色别名 | `--dense-primary: var(--primary-6)` | 链接、Tab 激活、自定义控件 |
| 深/浅主色 | `--dense-primary-deep: var(--primary-7)` / `--dense-primary-soft: var(--primary-1)` | hover、选中底 |
| 背景/边框 | `--dense-bg-*` / `--dense-border-*` → `var(--color-bg-body)` / `var(--color-border-*)` | 卡片、分隔 |
| 圆角 | `--dense-radius: 6px` | 卡片、按钮、输入框、Tag |
| 行高 | `--dense-row-h: 40px` / `--dense-header-h: 36px` / `--dense-bar-h: 36px` | 表格行、工具条 |
| 筛选控件 | 高度 **32px**，正文 **13px**，表头 **11px** | filter-grid / vxe-table |
| 阴影 | `--dense-shadow-card` 中性灰 + inset 顶高光 | 卡片质感 |

> **禁止**在列表页写独立主色 hex（如 `#3d6fd9`），避免与 Arco 按钮/分页 `#165DFF` 割裂。

### 41.2 五层固定分区（DOM 顺序不可打乱）

```
page-root--dense（padding + gap 分隔各卡片）
├── L1 zone-l1-transport.zone-card     业务 Tab（海运/空运/铁路）
├── L2 zone-l2-filter-card.zone-card   筛选卡片（无标题栏）+ FilterActiveStrip（按需）
├── L3 zone-l3-action.zone-card        范围下划线 Tab + 状态 Pill + 批量操作栏
└── L4 zone-l4-table-card              table-card-cap（右上分页）+ vxe-table
```

每层独立 `border-radius: 6px` + `box-shadow`，禁止模块平铺在同一张白板上。

> **分页**：固定在 L4 内 `table-card-cap` 右上角，不再使用底部 L5 分页条。

### 41.3 筛选区（L2）

| 规则 | 说明 |
|------|------|
| 结构 | `filter-card__main` = 左侧字段区 + **右侧固定 84px 操作列**（无 `filter-card__head` 标题） |
| 栅格 | CSS Grid `repeat(4, 1fr)`，顶标 `filter-field__label` + 控件 |
| 操作列 | 顶部 **查询** primary + **重置** text（**位置固定**，展开/收起不迁移）；底部 **展开(+N)/收起** |
| 次行 | 操作员 1 列 + 提交时间 chip `filter-field--span3` |
| 高级区 | `filter-card__advanced-inner` 虚线顶分隔 + 4 列栅格；**无**区内「高级筛选」标题 |
| 折叠提示 | 高级条件激活且折叠时操作列 badge + `a-tooltip` |
| 标签条 | `FilterActiveStrip` **`v-if="tags.length"`**；**禁止**空态「当前无筛选条件」 |
| 人员字段 | 业务员/操作员/客服/发货人/收货人 `a-select` + `allow-search` |
| Tab 切换 | 运输 Tab → 清空筛选 + 收起高级区 + Toast |
| 交互 | 回车查询、下拉 auto-search、`allow-clear`、操作 Toast |

### 41.4 表格区（L4）

| 能力 | 实现 |
|------|------|
| 顶栏 | `table-card-cap`：左「共 N 条」，右列设置 + **分页**（分页不设 `show-total`） |
| 行高/字号 | 数据行 **40px**，表头 **36px**，正文 **13px**，表头 **11px** |
| 横向滚动 | `min-width` 列 + fixed 左右列 |
| 排序 | 单号/时间/业务单号 `sortable` |
| 长文本 | `show-overflow` + `a-tooltip` |
| 列设置 | Popover 勾选 + `localStorage` |
| 危险品 | **仅**单元格 `.danger-cargo-pill`；**禁止**整行 `row--danger-cargo` 底色 |
| 隔行 | **禁止** `.stripe` 斑马纹；统一白底 + hover `#primary-1` |
| 操作列 | `.row-action-btn` **28×28** 方钮；hover 仅变色，**禁止** translateY |
| 无附件 | 下载按钮 `disabled` 置灰 |
| 加载/空态 | `#loading` 骨架 + `#empty` 居中文案 |

### 41.5 工具栏与权限（L3）

- **范围 Tab + 状态 Pill** 同一行 `scope-status-bar`，**统一 `.stab` pill**
- **工具栏**：刷新/创建 | 竖线 | 跟踪分段 | 竖线 | 复制/打印/导出/批量；**禁止**「操作/跟踪/单据」文字分区标签
- 列设置已移至 L4 `table-card-cap`，L3 工具栏不含列设置
- 警示类次要按钮用 `.btn-muted-warn` 低饱和描边，禁止 Arco `status="warning"` 高饱和橙
- 导出下拉：当前页 / 全部筛选 / 已选（已选需勾选校验）
- 批量操作：未勾选 `Message.warning`
- `saleOrderPermissions` Mock 控制按钮显隐

### 41.6 微交互清单

- 输入/下拉 `:focus-within` 外发光 `3px`
- 表格行 hover `#e8effd`
- Filter Tag hover 暖色底
- **按钮禁止 hover 位移/浮起阴影**（仅底色/描边变化）
- 所有写操作配套 `Message` 反馈

### 41.8 高密度 × 高质感专项（优先于功能扩展）

**高密度**：表格行 **40px**、表头 **36px**、工具条 **36px**；筛选 grid gap **8×12**；去掉无信息标题栏/空态 Strip。

**高质感**：

- 页面底：`var(--color-bg-body)`，卡片 `zone-card` 独立阴影
- 表头：浅灰渐变 + 列分隔线
- 高级筛选：虚线顶分隔 + `var(--color-fill-1)` 底，与基础白底区分
- 色彩：**全部映射 Arco**（`--primary-6` 等），禁止独立 hex 主色
- 微交互：行 hover `var(--primary-1)`；按钮 **禁止 hover translateY/浮起阴影**

> 列表页迭代时**先过密度与质感自检**，再考虑新增业务能力。

### 41.7 自检清单（生成后必过）

- [ ] 筛选 Grid 四列 + **右侧固定操作列**（查询/重置位置不随展开变化）
- [ ] **无**「筛选条件」标题栏；**无** FilterActiveStrip 空态占位
- [ ] 五层卡片独立圆角阴影，body 使用 `var(--color-bg-body)`
- [ ] 高级区虚线顶分隔 + 0.24s 动画
- [ ] FilterActiveStrip 有 tag 才显示 + 单条删除 + 清空全部
- [ ] 时间 chip + 人员模糊 Select 全覆盖
- [ ] 运输 Tab 切换清空+收起
- [ ] 危险品**仅**单元格 pill；**无** stripe / 整行橙底
- [ ] 表格行 40px、表头 36px；操作列 28px 方钮
- [ ] `--dense-*` 色彩映射 Arco，无独立 hex 主色
- [ ] 工具栏竖线分组，**无**「操作/跟踪/单据」文字标签
- [ ] 分页在 `table-card-cap` 右上；左侧 summary，分页无重复 `show-total`
- [ ] 按钮 hover **无** translateY / 浮起阴影
