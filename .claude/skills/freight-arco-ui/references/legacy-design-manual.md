---
name: freight-arco-ui
description: 国际货代/物流中后台系统 UI 设计系统规范（PESDP设计体系）。基于 Vue 3 + TypeScript + Arco Design Vue（gi-demo 主题）+ VXE Table。任何涉及页面、组件、布局、样式、交互、设计质量的任务都应加载本规范。关键词触发：订单/财务/仓储/舱位/拖车/权限模块、列表页、详情页、表单页、弹窗、UI 规范、不好看、质感、高密度、设计感、Arco、排版、查询区、状态筛选、工具栏、行操作、分页、色彩、字体、间距、高级感、AI生成页面。
---

> **ARCHIVE — do not extend.** Authoritative rules: `SKILL.md`, `design-principles.md`, `global.css`. Historical lookup only.

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
| 信息密度 | **Dense（高密度）**：每屏多展示数据；**保留** 8–12px 可预期间距，非零间距贴靠 |
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

### 1.6 规范撰写原则（模式 vs 实现对照）

| 类型 | 写什么 | 放在哪 |
|------|--------|--------|
| **UI 模式规范** | 判定条件、层级、类名、组件契约、禁止项；按**一类问题**抽象 | 正文章节（如 §17.3、§20.3）|
| ~~实现对照~~ | ~~某页面字段清单、文件路径~~ | **已废弃** — 不写具体页面路径 |

**正文规范必须遵守**：

- 规范须 **自包含**：AI 只读 skill + `global.css` 的 `--dense-*` / `.detail-*` 即可重建页面，**不依赖**任何现有 `src/views/**` 文件
- 用 `{模块名}`、`{子项实体}`、`{指标A}` 等占位，**不得**把某一业务模块的 HTML 当通用模板写死
- 业务举例仅作括号内**可选示例**，不构成单独规范
- 同一模式只在一处定义

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
- 统计数字出现 → 先区分 **模块总结**（§20.3.1）vs **模块数据**（§20.3.2）；列表页用 §20.1 `.zone-kpi`

### 原则 3：操作按钮层级

```
主操作（新建/提交）  → type="primary"，1个，放在工具栏左侧第一位
次要操作（导出/批量）→ type="outline"，放在主按钮右侧
工具操作（密度/列）  → type="text"，放在工具栏右侧
行内操作（查看/编辑）→ 纯图标 + tooltip，不写文字（§14.8 B2）
```

**按钮 × 图标三种形态**（完整规则见 **§14.8**）：

| 形态 | 代号 | 典型场景 |
|------|------|---------|
| 纯文字 | **B1** | 筛选「查询」、footer「取消/保存」、ghost 文字链 |
| 纯图标 | **B2** | 工具栏右（刷新/列设置）、表格行操作、cap 区 icon 工具 |
| 图标+文字 | **B3** | 工具栏左「+ 新建」、分区「+ 添加」、导出/打印 |

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
.vxe-table .vxe-header--column,
.vxe-table .vxe-body--column {
  background-image: none !important;
  border-right: 0 !important;
  border-bottom: 1px solid var(--color-border-1) !important;
}
/* ⚠️ .freight-table 已废弃；global.css 通过 .vxe-table 统一覆盖，无需在页面重复 */
```

### 原则 6：组件 size 统一使用 small，行内用 mini

```
搜索区输入框/下拉    → size="small"
工具栏按钮          → size="small"（B1/B3）；行内 → `.row-action-btn` small 28×28（B2）
弹窗表单字段        → size="small"
```

**禁止**：搜索区用默认 size（太大）；表格行用 B3 或 `size="mini"` 文字按钮（§14.8）。

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
│   ├─ 需要圆点 + 文字 → 使用 .s-pill[data-s]（见 §19.1，禁止用旧 .status-pill）
│   └─ 只需文字标签    → <a-tag size="small" :color="...">
│
├─ 在表格行左侧竖条  → .status-rail（3px 宽彩条，见规范）
├─ 在详情页头部      → <a-tag size="medium">
└─ 在状态 Tab 行     → 自定义 .stab 按钮 + .stab-count 数字徽章
```

**状态 Pill 实现**：

> ⚠️ **已统一**：禁止使用旧的 `.status-pill[data-status="中文"]` 方案（CSS 不存在，颜色硬编码）。
> 统一使用 `global.css` 中的 `.s-pill[data-s]` 体系，详见 **§19.1**。

```html
<!-- ✅ 正确：使用 s-pill + 英文简码 data-s -->
<span class="s-pill" :data-s="statusCodeMap[row.FollowState]">
  {{ statusTextMap[row.FollowState] }}
</span>
```

**data-s 值映射**：`wait`（待处理） / `op`（操作中） / `partial`（部分完成） / `acc`（已接单）
/ `rel`（已放舱） / `draft`（草稿） / `rej`（已拒绝）

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
.cell-two-line { display: flex; flex-direction: column; gap: 1px; justify-content: center; line-height: 1.35; min-width: 0; }
.c2-main { font-size: var(--dense-font-data); font-weight: 500; color: var(--color-text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.c2-sub  { font-size: var(--dense-font-aux);  font-weight: 400; color: var(--color-text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.clip    { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } /* alias，等同 c2-main 内联 */
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
.stab--active {
  background: var(--dense-primary) !important;
  border-color: transparent !important;
  color: #fff !important;
  font-weight: var(--dense-weight-nav-active);
  box-shadow: 0 2px 6px rgba(22,93,255,0.28);
}
/* ⚠️ 注意：激活态为实心 pill（与 global.css 一致），非下划线 */
.stab--danger { color: var(--danger-6); }
.stab--danger.stab--active { background: var(--danger-6) !important; box-shadow: 0 2px 6px rgba(245,63,63,0.28); }
.stab-count { font-size:11px; color:var(--color-text-3); font-variant-numeric:tabular-nums; }
.stab-count--danger { color:var(--danger-6); font-weight:600; }
```

---

## 五、VXE Table 标准实现

### 5.1 表格容器与属性规范

```vue
<template>
  <div class="table-wrap" :class="{ compact: density === 'compact' }">
    <vxe-table
      class="freight-table"   <!-- ⚠️ 已废弃类名：global.css 通过 .vxe-table 统一覆盖；此类可移除 -->
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
/* VXE 边框消除 — 选择器用 .vxe-table（global.css 实际实现，.freight-table 已废弃）*/
.vxe-table .vxe-header--column,
.vxe-table .vxe-body--column {
  background-image: none !important;
  border-right: 0 !important;
  border-bottom: 1px solid var(--color-border-1) !important;
}
.vxe-table .vxe-header--column {
  background-color: var(--color-fill-1) !important;
  border-bottom: 1px solid var(--color-border-2) !important;
  color: var(--color-text-2) !important;
  font-weight: 600 !important;
  font-size: var(--dense-font-title) !important; /* 12px，F3 — 见 §7 */
}
.vxe-table .vxe-body--row { height: var(--dense-row-h); } /* 36px compact 默认 */
.vxe-table .vxe-body--row:hover .vxe-body--column { background: var(--dense-primary-soft) !important; }
/* 固定列阴影 */
.vxe-table .vxe-table--fixed-left-wrapper  { box-shadow:  3px 0 10px rgba(10,20,50,0.06) !important; }
.vxe-table .vxe-table--fixed-right-wrapper { box-shadow: -3px 0 10px rgba(10,20,50,0.06) !important; }
```

> ⚠️ **以上已包含在 `global.css` 中，无需在页面 `<style>` 中重复书写。**

---

## 六、间距与尺寸系统

> **高密度定位**：相对展示型 SaaS **收紧**间距与行高，让每屏多展示数据；**不是**把元素挤成「无间距贴靠」。
> 设计感来自：**固定间距阶梯 + 卡片分隔 + 对齐**，而非大面积留白。

### 6.1 高密度 ≠ 零间距（必须理解）

| 概念 | 含义 | 错误理解 |
|------|------|---------|
| **高密度** | 主列表行高 36px、字段行 gap 8px、模块 gap 8px（相对 48–56px 行高 / 24px gap 的展示型后台）| 把 margin/padding 设为 0–2px |
| **紧凑** | 去掉无信息装饰、减少无效留白 | 标签贴控件、按钮贴按钮、分区块粘在一起 |
| **有设计感** | 间距**可预期、可复用**（Token 阶梯），层级靠边框/阴影/背景区分 | 靠随机调小每一个 padding |

**判断标准**：

- ✅ 手指/视线能分辨「这是两个字段」→ 行 gap ≥ **8px**
- ✅ 分区标题与首行字段不粘连 → head/body 各有 padding
- ✅ 列表五层卡片之间仍有 **8px** 呼吸缝
- ❌ 表单 item `margin-bottom: 0–4px` 且无 grid row-gap
- ❌ 去掉卡片圆角/阴影只靠「挤」来省空间

### 6.2 间距 Token（`global.css` `--dense-gap-*` / `--dense-pad-*`）

| Token | 值 | 用途 |
|-------|-----|------|
| `--dense-gap-zone` | **8px** | 列表五层 `page-root--dense` 卡片间距 |
| `--dense-gap-module` | **8px** | 详情 `.detail-section` 块间距、抽屉滚动区内边距 |
| `--dense-gap-field-row` | **8px** | 表单行间距、`.detail-form` item、grid `row-gap` |
| `--dense-gap-field-col` | **12px** | 表单列间距、grid `col-gap`、筛选栅格列 |
| `--dense-gap-inline` | **8px** | 按钮组、head 内元素、统计项之间 |
| `--dense-gap-label` | **4px** | 字段 label 底 → 控件顶（**最小**间距，不可为 0）|
| `--dense-pad-section-y/x` | **10px / 12px** | 分区 body 内边距 |
| `--dense-pad-head-y/x` | **8px / 12px** | 分区 head、汇总条、子项 head |

### 6.3 尺寸（行高 / 控件高）

| 用途 | 数值 | 说明 |
|------|------|------|
| 页面区域之间 | `gap: var(--dense-gap-zone)` 或 `border-bottom` | 列表卡片用 gap；旧单层用分隔线 |
| 区域内水平 padding | **12–16px** | 筛选/工具栏/表格 cap |
| Tab / chip / 按钮 | 高度 **28px**（`--dense-control-h-nav`）| 与 F2 字号配套 |
| 筛选输入 | 高度 **32px** | 顶标 label 与输入之间 **4px** |
| 详情输入 | 高度 **28px** | 多列栅格；行 gap **8px**、列 gap **12px** |
| 表格行高度 | **36px** 主工作台紧凑 / **48px** 标准 | 禁止为密度把主列表行高压到 <34px |
| 表格列边距 | `padding: 0 10px` | 单元格左右 |
| 工具栏按钮间距 | **6–8px** | `.toolbar` gap |
| 搜索字段间距 | **12–14px** | filter-grid 列 gap |

### 6.4 列表 vs 详情间距对照

| 场景 | row-gap | col-gap | body padding |
|------|---------|---------|--------------|
| 筛选栅格 Tier 2 | **10px** | 12px | 卡片内 **12×12px** |
| 详情 `detail-form-grid` | **8px** | **12px** | section 10×12px |
| 详情子项 body | — | — | 10×12px |
| mini-table 单元格 | — | — | td 3–5px（表内可更紧，表格外须有 padding）|

**禁止**：

```
❌ 为「紧凑」把 form-item margin 调到 0–4px 且无 grid gap
❌ 去掉 module 间 margin 让分区块视觉粘连
❌ 展示型后台 24px gap 与高密度 8px gap 混用同一页
❌ 可交互行 hover 改变 border-width / padding / margin（引发布局抖动，§17.3.7）
```

---

## 七、字体规范（按页面功能分级 F1–F6）

> **核心原则**：同一**功能角色**在全站（列表 / 详情 / 抽屉）必须使用**相同字号 + 字重**；用**色阶 / 语义色**区分层级，**禁止**靠放大字号或加粗 700 制造层级。
> Token 定义于 `global.css` `:root`；业务区内**禁止**硬编码 `font-size: 14px` 等。

### 7.0 字号阶梯（唯一允许的正文档位）

高密度货代 SaaS **业务区**（列表 / 详情 / 抽屉 / 筛选 / 表格）只允许 **4 档正文字号**：

| 档位 | px | 角色 | 何时用 |
|------|-----|------|--------|
| **L1 阅读基准** | **13px** | F1 数据值、F2 可交互文案 | 表格 cell、输入值、按钮、Tab、chip、链接 |
| **L2 结构层** | **12px** | F3 标题/表头、**F4 字段标签** | 分区 title、VXE th、filter label、form label |
| **L3 标签辅助** | **11px** | F5 副信息 | placeholder、统计 label、状态 pill 文案 |
| **L4 微信息** | **10px** | F6 极弱 | 单位、序号列、badge 数字、分页辅助 |

**层级关系（专业约定）**：

```
结构标题 F3 (12/600)  → 靠字重 600 + text-1 立层级
字段标签 F4 (12/500)  → 与 F3 同大不同重；比数据值小 1px，靠 text-2 弱化
数据/交互 F1/F2 (13/500) → 全站阅读与操作基准（表格 cell = 输入值 = chip = Tab）
```

**同一 px 不同角色（常见疑问）**：

| 同为 13px | 级别 | 区分方式 |
|-----------|------|---------|
| 表格单元格 | F1 | text-1，业务值 |
| 筛选输入值 / 快捷 chip | F2 | 可交互；chip 激活用 primary 色 |
| 工具栏按钮 | F2 | 按钮形态 |

**同为 12px**：

| 元素 | 级别 | 区分方式 |
|------|------|---------|
| 表头 / 分区 title | F3 | **600** + text-1 |
| 筛选顶标 / form label | F4 | **500** + text-2 |

**禁止在业务区出现 14 / 15 / 16px 文字**（Arco 默认 drawer 16px、营销 KPI 28px 等须覆盖）。
**App Shell**（侧栏品牌、系统级导航）可单独放大，见 §7.9。

**图标例外**：icon-only 按钮图形用 `--dense-icon-action: 14px`，**不算**正文字号档位。

### 7.1 功能分级表（唯一标准）

| 级别 | 功能角色 | 字号 | 字重 | color | 典型场景 |
|------|---------|------|------|-------|---------|
| **F1 数据正文** | 用户阅读的业务值 | 13px | **500** | text-1 | 表格单元格、输入框值、单号链接、汇总数值、子项 desc |
| **F2 导航交互** | 可点击的导航/操作文案 | 13px | **500**（激活 600）| text-2 → text-1 | Tab `.stab`、运输 Tab、chip、按钮、筛选输入值 |
| **F3 结构标题** | 分区/列的结构名 | 12px | **600** | text-1 | VXE 表头、`.detail-section__title`、抽屉标题、mini-table th、子项 title |
| **F4 字段标签** | 字段名（列表筛选 + 详情表单 **统一**）| **12px** | **500** | text-2 | `filter-field__label`、`.detail-form` label、`.detail-option-group__label` |
| **F5 辅助说明** | 副信息/统计标签 | 11px | **400** | text-3 | placeholder、`.sub-text`、统计 label、状态 pill |
| **F6 微字** | 单位/分页/极弱 | 10px | **400** | text-4 | 单位、Tab badge、分页 jumper |

### 7.2 CSS Token 对照

| Token | 映射级别 |
|-------|---------|
| `--dense-font-data` / `--dense-weight-data` | F1 |
| `--dense-font-nav` / `--dense-weight-nav` | F2 |
| `--dense-font-title` / `--dense-weight-title` | F3 |
| `--dense-font-field` / `--dense-weight-field` | F4 |
| `--dense-font-aux` / `--dense-weight-aux` | F5 |
| `--dense-font-micro` / `--dense-weight-micro` | F6 |
| `--dense-font-filter-label` | F4（= `--dense-font-field`，**禁止**单独再分 11/12 两档）|
| `--dense-icon-action` | icon-only 按钮图形 14px（非 typography）|

### 7.3 列表页区域映射（防割裂）

| 区域 | 必须使用的级别 | 常见错误 |
|------|---------------|---------|
| 运输 Tab `.seg-btn` | F2 | — |
| 状态 Tab `.stab` | **F2**（与表格同 13px）| ❌ 11px 导致「头小表大」|
| 筛选输入值 | F2 | — |
| 筛选顶标 | **F4 12px/500** | ❌ 与详情 form label 分 11/12 两档 |
| 筛选控件值 / 快捷 chip | **F2 13px** | ❌ chip 误降为 12px（chip = 控件值，非 label）|
| 筛选 placeholder | **F5** 11px text-3 | ❌ placeholder 13px 与输入值抢视觉 |
| 工具栏按钮 | F2 | ❌ 12px 按钮 vs 13px 表格 |
| 表格表头 | **F3** 12px/600 | ❌ 11px/700 与正文差太大 |
| 表格单元格 | **F1** 13px/500 | ❌ 链接 700 粗体 |
| 单号链接 `.link-text` | **F1** + 语义色 | ❌ `--strong` 700 |
| 状态 pill | F5 | ❌ 600 字重 |
| 统计「共 N 条」| F2 文案 + F1 数字 | ❌ 数字 14px/700 |

### 7.4 详情抽屉区域映射

| 区域 | 级别 | 常见错误 |
|------|------|---------|
| 抽屉标题 | F3 | ❌ 16px / 13px 600 |
| 状态主标识 | F1 | ❌ 14px/700 |
| 分区标题 | F3 | — |
| 表单 label | F4 **12px** | ❌ 列表 12 + 详情 11 分裂；❌ label 与输入同 13px |
| 输入/选择值 | F1 | — |
| 模块汇总数值 | **F1** + 语义色 | ❌ 15px/600/700 |
| 子项数据统计 val | F1 | ❌ 与 summary 同粗 |
| mini-table th / td | F3 / F1 | ❌ th 11px td 13px 差过大 |

### 7.5 禁止项

```
❌ 禁止 font-weight: 700（链接、单号、统计数字；**例外：KPI 大数字 `.kpi-value` 允许 800**）
❌ 禁止 Tab 11px + 表格 13px 混用（必须都走 F2/F1 = 13px）
❌ 禁止模块汇总数字比输入框字号更大
❌ 禁止同一页面出现 10/11/12/13/14/15/16 七种字号
❌ 禁止用字号区分链接与普通数据（用 color 区分）
❌ 禁止筛选顶标与详情 form label 使用不同字号（须统一 F4 12px）
❌ 禁止筛选顶标 11px 而表格/输入值 13px（须 F4 12 + F1/F2 13）
```

### 7.6 控件高度（与 F2/F1 配套）

| 场景 | 高度 Token |
|------|-----------|
| 筛选输入 | `--dense-control-h-filter` 32px |
| Tab/chip/按钮 | `--dense-control-h-nav` 28px |
| 详情多列表单 | `--dense-control-h-detail` 28px |
| 表格行 | `--dense-row-h` 36px |

**其他约定**：

- 单号/代码/日期：F1 字号 + `mono` 等宽
- 不要用 `bold`（700），最大 **600** 且仅用于 F3 标题
- 业务数据不使用斜体

### 7.7 列表页典型割裂（对照截图验收）

| 现象 | 根因 | 规范 |
|------|------|------|
| 筛选「业务单号」顶标明显小于表格单号 | `filter-field__label` 误用 11px 或未走 Token | 顶标 **F4 12px/500**（§7.12）|
| 快捷 chip 13、表格 13 是否冲突 | 误以为 chip 应比表格小 | **不冲突**：chip = F2 控件值，表格 = F1 数据，同阅读基准 13px（§7.12）|
| 筛选 label 12、输入 13 是否冲突 | 误以为应同大 | **正确**：label = F4 字段名，输入 = F1/F2 值（§7.12）|
| placeholder「模糊搜索」像主文案 | 无字段语义 + 字号未降 F5 | `请输入{顶标}` / `请选择`；F5 + text-3 |
| 筛选两行纵向贴死 | `filter-grid` row-gap 过小、body padding 不足 | row-gap **10px**、body **12×12px** |
| Tab/chip 小、表格大 | Tab 未走 F2 | 全站导航交互 **13px**（§7.3）|

### 7.12 列表筛选区三级语义（label / 控件 / 表格）

> 解答「查询 label 12px、form/输入 13px、chip/表格也是 13px」是否专业。

**筛选区一行字段的三层角色**（以「提交时间 + 快捷 chip」为例）：

```
提交时间          ← F4 字段名  12px / 500 / text-2  （filter-field__label）
[全部时间][今日]  ← F2 控件值  13px / 500 / 可交互 （time-chip，等同下拉选中项）
```

| 层级 | 功能 | 级别 | px | 与表格关系 |
|------|------|------|-----|-----------|
| **字段名** | 「业务单号」「提交时间」顶标 | F4 | **12** | 比数据小 1px，text-2 弱化 |
| **控件值** | 输入框内容、下拉选中、**快捷 chip** | F1/F2 | **13** | 与表格 cell **同阅读基准** |
| **占位/辅助** | placeholder、「共 N 条」副文案 | F5 | **11** | 低于控件值 |
| **表格数据** | VXE 单元格、单号链接 | F1 | **13** | 与控件值同 px，非 label |

**结论（是否专业）**：

| 组合 | 判定 | 原因 |
|------|------|------|
| label **12** + 输入/chip **13** | ✅ 专业 | 标准「名 / 值」层级；chip 是**值控件**不是 label |
| chip **13** + 表格 **13** | ✅ 专业 | 同属 L1 阅读基准；chip 用 F2（可点），表格用 F1（数据），靠**色/形态**区分 |
| 列表 label **12** + 详情 label **11** | ❌ 不专业 | 同一「字段名」角色不得分两档 → **已统一 F4 12px** |
| label **13** + 表格 **13** | ❌ 不专业 | 字段名与数据同大，顶区无层级 |

**详情 form 与列表筛选对齐**：

| 区域 | 字段名 | 控件值 |
|------|--------|--------|
| 列表 `filter-field` | F4 12px `--dense-font-field` | F1 13px `--dense-font-data` |
| 详情 `.detail-form` | F4 12px `--dense-font-field`（**与列表相同**）| F1 13px `--dense-font-data` |

**禁止**：把「提交时间」label 降到 11px 而 chip 保持 13px 以上（2px 差过大）；禁止 chip 降为 12px「去对齐 label」—— chip 不是 label。

### 7.8 组件字号对照表（完整，实施必查）

> **用法**：新组件 / Code Review 时，先查「组件 → 级别 → Token」，禁止凭感觉写 px。
> 同一组件在全站须同档；**title 12 + 内容 13** 是正确组合，**title 12 + 内容 14** 是错误组合。

#### 7.8.1 列表页五层

| 组件 / 类名 | 元素 | 级别 | Token | px |
|------------|------|------|-------|-----|
| `.seg-btn` | 运输 Tab 文案 | F2 | `--dense-font-nav` | 13 |
| `.filter-field__label` | 筛选顶标 | F4 | `--dense-font-field` | 12 |
| `.filter-field` | 输入/选择**值** | F1/F2 | `--dense-font-data` | 13 |
| `.filter-field` | placeholder | F5 | `--dense-font-aux` | 11 |
| `.filter-expand-link` | 展开/收起筛选 | F2 | `--dense-font-nav` | 13 |
| `.time-chip` | 时间快捷 chip | F2 | `--dense-font-nav` | 13 |
| `.stab` | 状态/权限 Tab | F2 | `--dense-font-nav` | 13 |
| `.stab__badge` | Tab 计数 | F6 | `--dense-font-micro` | 10 |
| `.toolbar` | 工具栏按钮 | F2 | `--dense-font-nav` | 13 |
| `.bulk-hint` | 批量提示 | F2 | `--dense-font-nav` | 13 |
| `.table-card-cap__pager` | 页码按钮 | F2 | `--dense-font-nav` | 13 |
| `.table-card-cap__pager` | total / jumper 文案 | F5 | `--dense-font-aux` | 11 |
| VXE `.vxe-header--column` | 表头 | F3 | `--dense-font-title` | 12 |
| VXE `.vxe-body--column` | 单元格 | F1 | `--dense-font-data` | 13 |
| VXE `.vxe-cell--seq` | 序号列 | F6 | `--dense-font-micro` | 10 |
| `.link-text` | 单号链接 | F1 | `--dense-font-data` + 语义色 | 13 |
| `.s-pill[data-s]` | 状态 pill | F5 | `--dense-font-aux` | 11 |
| `.row-action-btn` | 操作列 icon | icon | `--dense-icon-action` | 14※ |

※ 14px 仅用于 icon 图形，禁止用于文字。

#### 7.8.2 详情抽屉

| 组件 / 类名 | 元素 | 级别 | Token | px |
|------------|------|------|-------|-----|
| `.detail-drawer .arco-drawer-header-title` | 抽屉标题 | F3 | `--dense-font-title` | 12 |
| `.detail-drawer-status__no` | 状态条主单号 | F1 | `--dense-font-data` | 13 |
| `.detail-drawer-status__sub` | 状态条副信息 | F5 | `--dense-font-aux` | 11 |
| `.detail-section__title` | 分区标题 | F3 | `--dense-font-title` | 12 |
| `.detail-form` label | 表单字段名 | F4 | `--dense-font-field` | 12 |
| `.detail-drawer` input/select 值 | 控件内容 | F1 | `--dense-font-data` | 13 |
| `.detail-subitem__title` | 子项标题 | F3 | `--dense-font-title` | 12 |
| `.detail-subitem__desc` | 子项主标识 | F1 | `--dense-font-data` | 13 |
| `.detail-subitem__state` | 「已收起」tag | F6 | `--dense-font-micro` | 10 |
| `.detail-collapse-toggle` | 展开/收起 | F2 | `--dense-font-nav` | 13 |
| `.detail-mini-table th` | 嵌套表头 | F3 | `--dense-font-title` | 12 |
| `.detail-mini-table td` / 内嵌 input | 嵌套表数据 | F1 | `--dense-font-data` | 13 |
| `.detail-module-summary` label | 模块汇总标签 | F5 | `--dense-font-aux` | 11 |
| `.detail-module-summary` val | 模块汇总数值 | F1 | `--dense-font-data` + 语义色 | 13 |
| `.detail-data-stats` label/val | 块内统计 | F5 / F1 | aux / data | 11 / 13 |
| `.detail-option-group__label` | 选项组标题 | F4 | `--dense-font-field` | 12 |
| `.arco-checkbox-label`（detail 内）| checkbox 选项 | F1 | `--dense-font-data` | 13 |

#### 7.8.3 Arco 组件全局覆盖（`size="small"`）

| Arco 组件 | 场景 | 文字级别 | 说明 |
|-----------|------|---------|------|
| `a-button` small | 列表/详情按钮 | F2 13px | `global.css` `.arco-btn-size-small` |
| `a-button` mini | — | **禁止**业务详情内使用 | 10px 发糊 |
| `a-input` small | 筛选区 | 值 F1 13px | 高度 32px |
| `a-input` small | 详情表单 | 值 F1 13px | 高度 28px |
| `a-select` small | 同上 | 值 F1 13px | placeholder → F5 |
| `a-date-picker` small | 同上 | 值 F1 13px | — |
| `a-textarea` small | 详情 | 值 F1 13px | line-height 1.45 |
| `a-pagination` | table-cap | 页码 F2、total F5 | 禁止 12px 硬编码 |
| `a-drawer` header | 复杂详情 | **必须覆盖**为 F3 12px | 禁止 Arco 默认 16px |

#### 7.8.4 常见错误对照

| 错误现象 | 错误写法 | 正确 |
|---------|---------|------|
| 分区 title 12、输入 14 | Arco 默认 + 未覆盖 | 输入统一 `--dense-font-data` 13px |
| 筛选顶标 11、表格 13 | 顶标未统一 F4 | 顶标 **F4 12px**（与 detail label 相同）|
| chip 12、表格 13 | chip 误当 label 缩小 | chip 保持 **F2 13px**（控件值）|
| 表头 11、cell 13 | th 用 aux | th 用 F3 **12/600** |
| 展开链 12、按钮 13 | 各写各的 | 可交互统一 F2 **13px** |
| 模块汇总数字 15/700 | KPI 营销风 | 汇总 val 用 F1 **13/500** + 色 |
| placeholder 与输入同大 | 未降 F5 | placeholder **11px text-3** |

### 7.9 App Shell 隔离区（非业务 dense 区）

| 组件 | 字号 | 说明 |
|------|------|------|
| `html/body/#app` | 13px | 全站基准，= F1 |
| `.side-brand` | 15px/700 | **仅**侧栏 Logo 区，不进列表/详情 |
| `.app-sider .arco-menu-item` | 13px | = F2 |
| `.app-sider .arco-menu-inline-header` | 11px/700 uppercase | = F6 分组 |
| `.tabnav-item` | 13px | 系统 Tab |
| `.tabnav-actions` | 12px | 系统级辅助，可保留 |

业务页面内**不得引用** Shell 15px 作为分区标题或数据字号。

### 7.10 选型决策（3 问）

1. **用户要读的值还是点的控件？** → 读 = **F1 13px**；点 = **F2 13px**（同大，色区分）
2. **是结构名还是字段名？** → 结构（表头/分区/子项 title）= **F3 12/600**；字段 label（列表+详情）= **F4 12/500**
3. **是主信息还是副信息？** → 副（单位/placeholder/统计 label）= **F5 11/400**；极弱（序号/badge）= **F6 10**

**禁止**：用 14px「稍微大一点」做强调；强调用 **语义色 + 500 字重**，不用放大字号。

### 7.11 图标尺寸（与字号分离）

> 按钮内 icon 选型见 **§14.8**（B1/B2/B3）；本节仅定义图形 px。

| 用途 | Token / 尺寸 | px |
|------|-------------|-----|
| B2/B3 按钮内 icon | `--dense-icon-action` | 14 |
| 折叠 chevron / 展开链 | 随父级 F2/F3 | 12–13 |
| Tab badge 数字 | F6 文字 | 10 |
| 空状态 / KPI 装饰 | 独立装饰，非按钮 | 20–48 |

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
□ 7. 操作按钮：工具栏 B3 左 / B2 右；行内仅 B2 + tooltip（§14.8）
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
| FollowState | 跟进状态 | `.s-pill[data-s]`（见 §19.1）|
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

**布局（filter-card v2 标准结构）**：

```
┌─ L1 运输 Tab（可选）────────────────────────────────────────┐
├─ L2 filter-card（无「筛选条件」标题栏）──────────────────────┤
│ 字段区（Grid 4 列）                    │ 固定操作列 84px   │
│ 行1: 单号 | 类型 | 进出口 | 业务员      │ [查询]  ← 位置固定 │
│ 行2: 操作员 | 提交时间 chip (span3)    │ [重置]            │
│ ── 高级区（展开，虚线顶分隔）────────── │ ─────────         │
│ 行3+: 折叠字段 4 列栅格                │ 展开(+N)/收起     │
└────────────────────────────────────────┴───────────────────┘
│ （禁止 FilterActiveStrip / 已筛选横条，§11.8）              │
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
| 标签 | 顶标 `filter-field__label` **F4 12px/500**（`--dense-font-field`）；`margin-bottom: 4px` |
| 控件 | `size="small"`，高度 **32px**（global.css 覆盖），列内 `width: 100%`；**值** F2 13px |
| placeholder | F5 11px text-3；下拉 `请选择` / 可搜 `请输入{顶标}`；**禁止**单独「模糊搜索」 |
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

- 折叠区有激活筛选时，展开按钮 **badge `(+N)`** 提示（§11.5）；**禁止**底部「已筛选」横条（§11.8）
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

**高级查询抽屉**：Tier 3 抽屉内条件在表单控件中回显；关闭抽屉后**禁止**额外「已筛选」横条（§11.8）。

---

### 11.7 通用交互规则（所有 Tier 共用）

| 行为 | 规则 |
|------|------|
| 文本框触发搜索 | Enter 键 或 点查询按钮；**不** auto-search（防止频繁请求） |
| 下拉/日期触发搜索 | 选中后 auto-search（即时反馈，用户期望立即看到结果） |
| **重置** | **必须有**「重置」按钮（text 类型）；清空表单全部字段 + 执行一次查询；**不**清空状态 Tab（状态用 L3「清除状态」或重选 Tab） |
| 空值处理 | 字段为空 = 不作为筛选条件（而非筛选"空值"数据） |
| 状态记忆 | 展开/收起状态 localStorage 记忆；筛选值不记忆（刷新清空） |
| 字段 placeholder | 文本字段写出支持的搜索维度；下拉字段写"全部"或"请选择" |
| 筛选无结果 | 表格展示 Empty 状态，提示"换个条件试试"，不显示 loading |

---

### 11.8 禁止「已筛选」横条（FilterActiveStrip）

> **一类决策**：列表筛选区**禁止**单独渲染「已筛选 / 已选条件」横条（`.filter-active-strip`）。

| 原因 | 说明 |
|------|------|
| 冗余 | 条件已在表单控件、Tab 激活态中直接可见 |
| 占高 | 多占一整行，与高密列表目标冲突 |
| 重复操作 | 与「重置」、字段 `allow-clear` 功能重叠 |

**当前条件如何感知**（不靠横条）：

| 来源 | 感知方式 |
|------|---------|
| 表单字段 | 控件内保留已选值；`allow-clear` 单字段清空 |
| 状态 / 范围 | L3 `.stab--active` 高亮 |
| 提交时间 | `.time-chip--active` |
| 高级区有值且折叠 | 展开按钮旁 **badge `(+N)`** |
| 清空全部 | 筛选区「**重置**」按钮（§11.7）|

**禁止**：

```
❌ 筛选卡片底部「已筛选」「已选条件」标签行
❌ .filter-active-strip / filter-active-strip__label
❌ 空态占位「当前无筛选条件」
❌ 在横条上重复回显状态 Tab / 时间 chip（Tab/chip 已表达）
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

**快捷 chip（主查询区内）**：

```
[今日] [本周] [本月] [自定义 ▼]
```

| Chip | 含义 |
|------|------|
| 今日 | 当天 00:00 ~ 23:59 |
| 本周 | 本周一 00:00 ~ 现在 |
| 本月 | 本月 1 日 00:00 ~ 现在 |
| 自定义 | 展示 `a-range-picker`，选完结束日期后 auto-search |

- 互斥单选；再次点击已选 chip 可取消（恢复「不限时间」）；chip 自身 `.time-chip--active` 即回显，**禁止**再在底部横条重复

---

### 11.11 Tier 2 栅格筛选字段编排（示例）

> **类型**：字段编排**示例**，非绑定具体页面。Tier 2 规则见 §11.5。

典型 12 字段模块 → **Tier 2 栅格**（`a-row` span=6），**不是** Tier 1 单行：

| 收起态主字段（示例） | 展开态次字段（示例） |
|---------------------|---------------------|
| 单号、类型、方向、人员 A、人员 B | 人员 C/D、枚举 E、长文本 F/G、快捷标签、关键词 |
| + 时间快捷 chip | + 自定义日期范围 |

必须同时具备：§11.7 重置、§11.9 人员选择器、§11.10 时间快捷；**禁止** §11.8 已筛选横条。

---

### 11.12 ~~Tier 1 单行筛选~~（已废弃）

> 多字段业务模块应使用 Tier 2，见 §11.5 / §11.11。

---

## 十二、Tab 组件设计规范

> Tab 是系统中使用频率最高的导航组件。激活态必须一眼可辨，非激活态需要保持存在感但不抢主角。

### 12.1 两类 Tab 的职责与视觉方案

| Tab 类型 | 职责 | 视觉方案 |
|----------|------|---------|
| 运输方式 Tab（海运/空运/铁路） | 页面级切换，选择后整页内容变化 | **Segmented Control（分段控件）** |
| 状态过滤 Tab（全部/待审/异常…） | 数据筛选，改变列表内容 | **pill 胶囊式激活 + 数量胶囊** |

**为什么运输 Tab 用 Segmented Control？**

- 运输方式是互斥选项（只能选一个），Segmented Control 是互斥选择的经典控件
- 白色背景 + 阴影的激活态比下划线更明显，符合"页面级切换"的重要程度
- 与状态过滤 Tab 形成视觉差异，用户一眼区分两个 Tab 的层级

**为什么状态 Tab 用 pill 胶囊式？**

- 状态 Tab 较多（6-8 个），Segmented Control 会过宽
- pill 激活态（实心蓝背景）视觉对比度高，远优于下划线的激活感
- 数量胶囊提供额外的视觉标记，形成双重识别（pill 激活 + 数量）
- **注意**：早期规范曾描述下划线式，已废弃；`global.css` 实现为 pill 式，以 CSS 为准

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

### 12.3 状态过滤 Tab 实现规范（pill 胶囊式，非下划线）

**视觉层级（从弱到强）：**

```
非激活          → color-text-3，背景透明，数量：灰色胶囊 (#f0f2f5 bg, #86909c text)
hover           → color-text-1，背景 color-fill-1（极浅灰）
激活（普通）    → 白字 + 实心蓝背景（dense-primary）+ weight-nav-active + 蓝色阴影 + 蓝色数量胶囊
激活（危险/异常）→ 白字 + 实心红背景（danger-6）+ 红色阴影 + 红底白字数量胶囊
未激活危险且有数量 → var(--danger-6) 文字 + 红色数量胶囊（提示需关注）
```

> ⚠️ **激活态为 pill 实心背景**，不是下划线。历史规范中的"3px 蓝色下划线"已废弃，`global.css` 以 pill 方式实现。

**数量胶囊四种状态：**

```css
/* 默认 */
.stab-badge { background: #f0f2f5; color: #86909c; }
/* 普通激活 */
.stab-badge--active { background: #e8f3ff; color: var(--primary-6); font-weight: 600; }
/* 危险未激活但有数量 */
.stab-badge--danger { background: var(--danger-1); color: var(--danger-6); font-weight: 600; }
/* 危险激活 */
.stab-badge--danger-active { background: var(--danger-6); color: #fff; font-weight: 600; }
```

**关键细节：**

- Tab 项 `height: 36px`（对齐 `--dense-bar-h`），`border-radius: var(--dense-radius)`
- 行容器隐藏横向滚动条（`scrollbar-width: none`）
- 非激活态字色用 `color-text-2`，激活态为白字蓝底（高对比）
- 危险状态（异常数量 > 0 时）激活态改为红底（`var(--danger-6)`）

**交互补充（§11.8 禁止已筛选横条）**：

| 行为 | 规范 |
|------|------|
| 点击状态 Tab | 筛选数据 + `.stab--active` 表达当前状态 |
| 清除状态 | Tab 行末尾「清除状态」text 按钮（`query.status = ''` 后 auto-search）|
| 再点「全部」 | 等效清除状态筛选 |
| 数量胶囊 | 仅展示统计；当前状态以 Tab 激活态为准 |

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
// ✅ 使用 CSS Token，禁止 #16a34a / #d97706 / #dc2626
const rateColor = (v: number) =>
  v < 0  ? 'var(--danger-6)'  :   // 负值：红
  v < 3  ? 'var(--warning-6)' :   // 警戒：橙
           'var(--success-6)'      // 正常：绿
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
| `mini` | 22px | 表格行内**纯图标**按钮；**禁止**详情抽屉内带文字 label 的 mini 按钮 |

> **系统统一用 `size="small"`**，仅弹窗/抽屉 footer 用 `medium`（默认不写）。
>
> **详情抽屉（§17.3）**：区块添加、表格删除、KPI 操作全部用 `small`；全局 CSS 将 mini 压至 **10px/20px 高**，在 Windows + `-webkit-font-smoothing:antialiased` 下文字明显发糊，**禁止**在复杂详情内使用 mini 文字按钮。

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

**原则：行内仅 **B2 纯图标**（§14.8），最多 2–3 个，超出收入「...」下拉**

```
场景A：只有"查看"：1 个 icon-eye
场景B：查看 + 编辑：2 个 icon
场景C：查看 + 编辑 + 删除：删除放进下拉（danger 操作不直接暴露）
场景D：4 个及以上操作：保留 1–2 个最常用，其余放下拉
```

```vue
<!-- ✅ 场景C 标准写法（B2 + .row-action-btn 28×28） -->
<template #default="{ row }">
  <div class="row-actions">
    <a-tooltip content="查看详情">
      <a-button size="small" type="outline" class="row-action-btn" @click="openDetail(row)">
        <icon-eye />
      </a-button>
    </a-tooltip>
    <a-tooltip content="编辑">
      <a-button size="small" type="outline" class="row-action-btn" @click="openEdit(row)">
        <icon-edit />
      </a-button>
    </a-tooltip>
    <a-dropdown trigger="click">
      <a-tooltip content="更多操作">
        <a-button size="small" type="outline" class="row-action-btn"><icon-more /></a-button>
      </a-tooltip>
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
/* global.css 已定义 .row-action-btn 28×28 + icon 14px */
.row-actions { display: inline-flex; align-items: center; gap: 4px; }
```

**操作列必须 fixed="right"**，宽度 = `图标数量 × 28 + 下拉按钮28`：

```vue
<vxe-column title="操作" fixed="right" align="center"
  :width="row操作=3时用 92, 2时用 64" />
```

### 14.7 卡片/详情区操作按钮

详情抽屉、信息卡片内的操作：

```
状态栏右侧：outline 编辑（查看模式）
区块标题栏 #actions：primary 添加（+ icon）
KPI 面板标题栏：outline 次要 + primary 添加（同 panel 内，禁止 margin-left:auto 飞到视口边缘）
表格上方 toolbar：添加行 / 导入等（右对齐，紧贴表格）
表格操作列：small + outline danger 删除（sticky 右列）
底部 footer：取消 + 确认（主）
```

**禁止**：KPI 区纯文本平铺统计；表格下方孤立添加按钮；详情内 mini 文字按钮；行删除用 `type="text"`。

### 14.8 按钮与图标组合规范（B1 / B2 / B3）

> **一类问题**：同一页面混用「纯文字 / 纯图标 / 图文按钮」无规则，导致工具栏臃肿、行内过宽、或 icon-only 无 tooltip 不可访问。
> 本节定义 **三种形态**、**分区选型**、**尺寸 Token**，与 §7.11 图标尺寸、§25.3 语义映射配合使用。

#### 14.8.1 三种形态定义

| 代号 | 形态 | 视觉 | 字号/尺寸 |
|------|------|------|-----------|
| **B1 纯文字** | 无 icon，仅文案 | `a-button` 标准 small 28px 高 | 文字 **F2 13px** |
| **B2 纯图标** | 无可见文案，仅图形 | 方钮 **28×28**（行内/工具）或 cap **30×30** | 图形 **`--dense-icon-action` 14px** |
| **B3 图标+文字** | icon 在前 + 文案 | 同 B1 高度，内嵌 leading icon | 文字 F2 13px + icon 14px |

**核心原则**：

```
空间紧 + 动作重复 + 图标语义全球统一  → B2（必须 Tooltip）
需要强调的主/次业务动作 + 文案 ≤4 字   → B3（icon 在左）
Footer / 筛选主按钮 / 明确动词          → B1 或 B3（查询可 B1）
表格行内                               → 仅 B2，禁止 B3
工具栏右侧辅助                         → 仅 B2，禁止 B3
下拉触发「更多 / 批量操作」              → B3 但 icon 在右（trailing ▼）
```

#### 14.8.2 选型决策树

```
需要按钮吗？
├─ 否 → 用文字链 / chip / Tab（§15 / §12）
└─ 是 → 所在区域？
    ├─ 表格行内 → 仅 B2 + a-tooltip（§14.6）
    ├─ 工具栏右侧（列设置/刷新/密度）→ 仅 B2 + tooltip
    ├─ 工具栏左侧（新建/导出/批量）→ B3；批量/更多 ▼ 在右
    ├─ 筛选操作列 → 查询 B1 或 B3；重置用文字链（§11.5，非 button）
    ├─ 详情 footer → 取消 B1；保存/提交 B1 primary（不加 icon）
    ├─ 详情 section #actions → B3「+ 添加」
    ├─ table-card-cap 右上 → B2 `.table-card-cap__tool`
    └─ 详情 mini-table 删除 → B1 outline small「删除」（无 icon，防误点靠文案）
```

#### 14.8.3 分区形态对照表（强制）

| 区域 | B1 纯文字 | B2 纯图标 | B3 图标+文字 | 说明 |
|------|-----------|-----------|--------------|------|
| 筛选「查询」| ✅ 推荐 | ❌ | ✅ 可选 | 重置用 **文字链**，不用 button |
| 工具栏左（新建/导出）| 少见 | ❌ | ✅ **标准** | primary/outline + leading icon |
| 工具栏右（刷新/列设置）| ❌ | ✅ **标准** | ❌ | 必须 `a-tooltip` |
| 批量「更多操作」| ❌ | ❌ | ✅ | 文案 + **trailing** `<icon-down />` |
| VXE 行操作列 | ❌ | ✅ **唯一** | ❌ | `.row-action-btn` 28×28 |
| table-card-cap 工具 | ❌ | ✅ | ❌ | `.table-card-cap__tool` 30×30 |
| 详情 drawer footer | ✅ 取消/保存 | ❌ | ❌ | 主操作不加 icon，减少噪音 |
| 详情 section 添加 | ❌ | ❌ | ✅ `<icon-plus />` + 添加 | type="primary" small |
| 详情折叠切换 | — | — | ghost 链（§17.3.7）| 非 `a-button`，特例 |
| 弹窗 footer | ✅ | ❌ | 可选 | 与 drawer 同 |

#### 14.8.4 形态细则

**B1 纯文字**

| 项 | 规范 |
|----|------|
| size | `small`（28px），footer 可用默认 medium |
| type | 按 §14.1 层级：primary / outline / text |
| 适用 | 动词明确且唯一：「查询」「保存」「取消」「删除」|
| 禁止 | 无 tooltip 的 icon-only 冒充 B1 |

**B2 纯图标**

| 项 | 规范 |
|----|------|
| 尺寸 | 行内 **28×28** `.row-action-btn`；cap **30×30** `.table-card-cap__tool` |
| icon | **`--dense-icon-action: 14px`**，禁止 15/16px |
| type | 行内：`outline` 方钮（global.css）；工具栏右：`text` ghost |
| 可访问性 | **必须** `a-tooltip` = 动作全称（「刷新列表」非「刷新」可接受）|
| padding | `0`，禁止 asymmetric padding 导致 icon 偏位 |
| hover | 仅 color/background/border-color（§17.3.7 防抖动）|

```vue
<!-- B2 标准：工具栏右 -->
<a-tooltip content="列设置">
  <a-button size="small" type="text" class="table-card-cap__tool" @click="openCols">
    <icon-settings />
  </a-button>
</a-tooltip>

<!-- B2 标准：行内 -->
<a-tooltip content="查看详情">
  <a-button size="small" type="outline" class="row-action-btn" @click="view(row)">
    <icon-eye />
  </a-button>
</a-tooltip>
```

**B3 图标+文字**

| 项 | 规范 |
|----|------|
| icon 位置 | **leading（左）**：新建、导出、添加、查询（若带 icon）|
| trailing（右）| **仅**下拉触发：「批量操作 ▼」「更多 ▼」|
| 写法 | Arco `#icon` slot 在文字前；下拉 chevron 在文字后 |
| icon 尺寸 | 14px，与 `--dense-icon-action` 一致 |
| 文案 | **≤4 汉字**；超长改 B1 或收入下拉 |
| 禁止 | 表格行内 B3（撑宽操作列）；同一工具栏连续 3 个以上 B3 |

```vue
<!-- B3 leading：分区添加 -->
<a-button size="small" type="primary">
  <template #icon><icon-plus /></template>
  添加
</a-button>

<!-- B3 trailing：下拉 -->
<a-button size="small" type="outline">
  批量操作
  <template #icon><icon-down /></template>
</a-button>
```

> Arco 默认 `#icon` 在左；trailing 时 icon 放 default slot 文字后面（或 CSS `flex-direction: row-reverse` 不推荐）。

#### 14.8.5 尺寸与 Token 对照

| Token / 类名 | 按钮盒 | icon 图形 | 场景 |
|--------------|--------|-----------|------|
| `--dense-control-h-nav` | 28px 高 | — | B1/B3 small 按钮 |
| `--dense-icon-action` | — | 14px | B2/B3 内 icon |
| `.row-action-btn` | 28×28 | 14px | 表格行 B2 |
| `.table-card-cap__tool` | 30×30 | 14px | 表格 cap B2 |
| `.detail-collapse-toggle` | 28px 高 ghost | 12–13px chevron | 非 button，§17.3.7 |

#### 14.8.6 禁止项

```
❌ 行内操作使用 B3（icon+文字）撑宽操作列
❌ B2 无 tooltip（不可访问）
❌ 工具栏右侧 B3（刷新/设置应 B2）
❌ 同一区域 B1/B2/B3 混用无规则（如左 B3 + 中 B2 + 右 B3 无分组）
❌ footer 主按钮 B3 加 icon（保存/提交保持 B1 纯文字）
❌ 详情抽屉内 size="mini" 带文字按钮（§14.3）
❌ 用 emoji 代替 Arco icon
❌ 行内 mini text 按钮代替 .row-action-btn（与 global.css 28×28 不一致）
```

#### 14.8.7 与 §25 图标规范的关系

| 章节 | 职责 |
|------|------|
| **§14.8** | **何时**用 B1/B2/B3、分区选型、按钮盒尺寸 |
| **§25.3** | **哪个** icon 表示哪种语义 |
| **§7.11** | icon 图形 px 与正文字号分离 |

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
| 宽型 | 640px | 含少量子表格的详情 |
| 超宽型 | `calc(100vw - 32px)` | **复杂详情**（多分区 + 可重复子项 + 嵌套表格）|
| 全屏 | 100% | 大型编辑器、复杂流程 |

```vue
<!-- 复杂详情：近全屏宽抽屉，见 §17.3 -->
<a-drawer
  class="detail-drawer"
  :width="'calc(100vw - 32px)'"
  :footer="false"
  unmount-on-close
>
  <!-- 见 §17.3 -->
</a-drawer>

<!-- 常规详情 -->
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

### 17.3 复杂详情抽屉（超宽型）

> **适用判定**（满足任一即用本节，禁止 480–640px 窄抽屉硬塞）：
>
> - 分区 ≥ 4 且含嵌套 editable 表格
> - 含 **可重复子项模块**（§17.3.6，N≥1）
> - 单屏表单字段 > 20 或需 4–6 列宽栅格

> **规范写法**：本节按 **UI 模式** 抽象；具体业务字段名见各页面实现，**不得**在规范正文写死某一模块名称。

#### 17.3.1 整体结构

```
detail-drawer（calc(100vw - 32px)）
├── detail-drawer-status / dds-head        状态 + 主标识 mono + 上下文 + 工具按钮
├── dds-hero                               航线主视觉 + 船期/船司/客户关键事实
├── dds-steps-bar                          流程步骤
├── dds-body
│   ├── detail-drawer-scroll / dds-main    DetailSection × N + DetailModule × M
│   └── dds-sidebar                        单据状态面板 + 关键资料 + 运输节点 + 负责人 + 完成度
└── detail-drawer-footer        固定底栏（§37.4）
```

- `:footer="false"`，自管 `detail-drawer-footer`
- 滚动区 `flex:1; min-height:0; overflow-y:auto`

#### 17.3.1-A 复杂业务单摘要头（强制）

复杂货代详情页必须在表单之前给出业务判断所需摘要，禁止一进入就是大面积白色表单。

| 区域 | 内容 | 视觉层级 |
|------|------|---------|
| `dds-head` | 状态、单号、所属公司、查看态工具按钮 | 轻量标题条 |
| `dds-hero` 主区 | `{起运港} → {目的港}` | 页面主视觉，最大字号但不超过 18px/600 |
| `dds-hero` 辅助 | ETD、ETA、船公司、船名航次、客户 | 小型事实块，label 用 text-4，值用 text-1/primary |
| `dds-steps-bar` | 接单/订舱/进仓/报关/开船/到港 | 流程识别，不承担主标题 |

规则：

- 航线必须比单号、客户、日期更突出。
- 客户、船司、船期不要和航线同一权重。
- 顶部不放保存/提交/废弃等业务动作；业务动作只在 footer 或右侧状态面板。
- 禁止把顶部做成普通文本横排；必须有主视觉与事实块层级。

#### 17.3.1-B 右侧状态面板（强制）

复杂详情页右侧栏不是装饰信息板，必须服务长表单编辑。

```
dds-sidebar
├── dds-sb-card--status     单据状态 + 单号
├── dds-sb-section          关键资料（客户/业务类型/装箱方式）
├── dds-sb-section          运输节点（航线/ETD/ETA）
├── dds-sb-section          负责人
├── dds-sb-section          完成度/必填缺失
└── dds-sb-actions          提交 + 保存草稿（编辑态）
```

规则：

- 右侧栏宽度 240–260px，背景用 `color-fill-1`，内部白色小卡分组。
- 必须包含「状态」「关键资料」「运输节点」「负责人」「完成度」。
- 编辑态右侧栏可以放快捷 `提交`，但 `提交`仍是唯一 primary；`保存草稿`为默认按钮。
- 完成度用于提示必填缺失，不用大 KPI 卡。
- 禁止右侧栏只是重复左侧表单字段的平铺文本。

#### 17.3.2 分节与表单栅格

| 分区类型 | 组件 | 栅格列数（宽屏） |
|---------|------|----------------|
| 单次性分区 | `DetailSection` | 按字段量 3 / 4 / 6 列 |
| 子项内表单 | `detail-module__subitem` body | 通常 4 列 |
| 跨列字段 | `detail-form-grid__span*` | 按列数 span |

- 表单统一 `layout="vertical"` + `size="small"`

#### 17.3.3 嵌套表格（`.detail-mini-table`）

- 外层 `.detail-mini-table-wrap { overflow-x:auto }`
- 宽表 `.detail-mini-table--wide`，文本列 `min-width:120px`，其余 `88px`
- 操作列 `.detail-mini-table__op`：**sticky right**
- 单元格控件 `width:100%`

#### 17.3.4 操作按钮分层（按作用域，禁止散落）

| 作用域 | 位置 | 典型操作类型 |
|--------|------|-------------|
| **抽屉** | `detail-drawer-footer` | 关闭/取消、保存、提交、废弃 |
| **单次性分区** | `DetailSection` `#actions` | 分区级「添加」 |
| **可重复模块** | `DetailModule` `#actions` | 模块级「添加子项」、批量/复制 |
| **子项内表格** | `.detail-table-toolbar`（表上方右对齐） | 添加行、删除子项 |
| **表格行** | 操作列 | 行内删除 |

**禁止**：模块级操作沉入子项；子项操作放到视口边缘；统计区与操作混排纯文本。

详情页按钮层级补充：

- Footer / 右侧状态面板中，全局 `提交` 是唯一 primary。
- 分区 `添加`、模块 `添加子项`、`复制` 使用 `type="outline"` 或默认按钮，禁止 primary。
- 删除使用 `type="text" status="danger"` 并包 `a-popconfirm`，禁止 outline danger 重复红框。
- 查看态顶部工具按钮只允许 `编辑`、`完整详情` 等工具动作，不放保存/提交。

#### 17.3.5 按钮清晰度（详情抽屉专用）

```css
.detail-drawer .arco-btn {
  -webkit-font-smoothing: auto;
  font-weight: 500;
}
.detail-drawer .arco-btn:hover,
.detail-drawer .arco-btn:focus-visible {
  transform: none !important;
  box-shadow: none !important;
}
```

- 详情内统一 **`size="small"`**；**禁止** mini 文字按钮（全局 10px 发糊）

#### 17.3.6 可重复子项模块（`.detail-module`）

> **一类问题**：同一业务模块下 N 条**同构子记录**（多发货人、多票报关、多费用段…）。**一张模块卡 + 子项列表**，禁止 N 张独立 card。

```
detail-section.detail-module
├── detail-section__head          模块名（一次）+ 模块级 #actions
├── detail-module__summary        模块总结统计（§20.3.1 inline）
└── detail-module__sublist
    └── detail-module__subitem    子项行 × N
        ├── head：子项序号 + 子项实体名 +（展开态）§20.3.2 数据统计 + §17.3.7 折叠
        └── body：表单 + table-toolbar + mini-table
```

| 层级 | 类名 | 视觉权重 |
|------|------|---------|
| 模块壳 | `detail-section.detail-module` | **唯一** border + shadow |
| 模块总结 | `detail-module-summary--inline` | 模块内灰底条，无二次模块名 |
| 子项 | `detail-module__subitem` | 无 shadow；`border-bottom` 分隔 |
| 子项标题 | `{子项实体} {序号}` | **禁止**重复模块名前缀（如 `模块名_1`）|
| 子项统计 | `.detail-data-stats` | §20.3.2，label 11px / val 12px |

| 规则 | 说明 |
|------|------|
| 组件 | `DetailModule.vue`：title + `#actions` + `#summary` + default 子项 slot |
| 模块操作 | 影响**全部子项**或**新增子项** → 模块 head |
| 子项操作 | 仅影响**当前子项** → 子项 body toolbar |
| N≥2 | 子项数量放入 `detail-module-summary--inline`，不放标题旁 badge |
| 最后一项 | `--last` 去掉底部分隔线 |

**禁止**：

- ❌ 每个子项独立 `detail-section` / 独立 shadow（视觉像 N 个模块）
- ❌ 模块总结区再写一遍模块标题
- ❌ 模块标题旁塞数量、统计、状态、说明文字；标题左侧只放模块名，右侧只放操作
- ❌ 子项标题 = 模块名 + 序号
- ❌ 用 Tab 隐藏其他子项（编辑需对照多条）

#### 17.3.7 子项折叠切换（`.detail-collapse-toggle`）

> **一类问题**：可重复子项默认可折叠以节省纵向空间；须**可感知**，禁止 icon-only；**交互须稳**，禁止 hover 引发布局抖动。

**展开态 head 布局**（单行 flex，高 32px）：

```
[序号] [子项标题 + 主标识 desc ellipsis] [§20.3.2 数据统计] [收起]
```

**收起态 head 布局**（禁止与模块 summary 重复堆数据）：

```
[序号] [子项标题 + 主标识 desc —— 占满中间] [已收起 tag · 展开]
```

| 元素 | 规范 |
|------|------|
| 控件 | `.detail-collapse-toggle`；文案 **展开 / 收起** + chevron |
| 形态 | **ghost 文字链**（F2 13px/500，无边框 pill）；hover 仅 `primary-1` 底 + `primary-6` 字色 |
| 热区 | 整行 `.detail-subitem__head` 可点；右侧 `.detail-subitem__actions` 固定不挤占 meta |
| 收起态 | **隐藏** `.detail-data-stats`（模块 summary 已有合计）|
| 展开/收起区分 | **序号 badge**：展开 = 实心 primary；收起 = 灰底 text-3（**禁止**左侧竖条）|
| 收起 tag | `.detail-subitem__state` 文案「已收起」，F6 灰底 pill |
| 展开态 | **显示** `.detail-data-stats` |

| 类名 | 用途 |
|------|------|
| `.detail-subitem__head` | 子项 head 容器（flex 单行）|
| `.detail-subitem__meta` | 标题 + 主标识 desc |
| `.detail-subitem__title` | `{子项实体} {序号}` |
| `.detail-subitem__desc` | 主标识字段 ellipsis（如名称/单号）|
| `.detail-subitem__stats` | 展开态才挂载 §20.3.2 |
| `.detail-subitem__state` | 收起态 tag |
| `.detail-subitem__actions` | 右侧「已收起 + 展开/收起」簇，`margin-left: auto` |

**交互稳定性（强制，防 hover 抖动）**：

| 允许 hover 变化 | 禁止 |
|----------------|------|
| `background-color`、`color`、`opacity` | `border-width` / `padding` / `margin` / `transform` 位移 |
| chevron `rotate`（仅展开态切换，非 hover）| 左侧竖条随 hover 变色 |
| head 底 `background: fill-1`（浅灰，非 primary 大面积）| head hover 联动 toggle 改 border（易抖）|

**禁止**：

- ❌ 收起态仍展示与模块 summary 相同的 `.detail-data-stats`（重复、撑乱布局）
- ❌ 用 `::after` 伪元素塞「已收起」（与 desc ellipsis 抢 flex）
- ❌ 仅 chevron、无文字；收起/展开无视觉差异
- ❌ 子项 head **左侧 3px 竖条**（展开 primary / 收起灰 / hover 变色）— 已废弃
- ❌ 22px 描边 pill 折叠按钮（与筛选展开链、Tab 风格割裂）

#### 17.3.8 只读/禁用态展示（查看模式）

> **一类问题**：详情抽屉查看模式为保持布局一致，常用 `disabled` 表单控件；**disabled ≠ 淡化数据**，只读内容须与可编辑态同级可读。

| 规则 | 说明 |
|------|------|
| 触发 | `mode === 'view'` → 表单 `:disabled="true"`（或等价 readonly）|
| 背景 | `var(--color-fill-2)`，与可编辑白底可区分 |
| 文字 | **`color-text-1` + font-weight 500**；禁止 text-3/text-4 洗成「空值感」|
| 选择器 | 已选标签同样 text-1/500 |
| 复选框 | 禁用仍清晰显示勾选态 |
| 作用域 | 仅 `.detail-drawer` 内覆盖；列表/工具栏 disabled 按钮仍按 §14 |

```css
/* global.css · detail-drawer 内 */
.detail-drawer .arco-input-wrapper.arco-input-disabled .arco-input,
.detail-drawer .arco-textarea-wrapper.arco-textarea-disabled .arco-textarea,
.detail-drawer .arco-select-view-disabled,
.detail-drawer .arco-picker-disabled input {
  color: var(--color-text-1);
  font-weight: 500;
  -webkit-text-fill-color: var(--color-text-1);
}
```

**禁止**：查看模式改用纯文本 `<div>` 重排（除非整页只读且无嵌套表）；disabled 输入对比度低于正文。

#### 17.3.9 详情密度与字号（对齐 §7 F1–F6）

> 详情各模块须按 **§7 功能分级** 取字号，禁止模块间自行放大。

| 元素 | 功能级别 | Token |
|------|---------|-------|
| 抽屉标题 | F3 | `--dense-font-title` / `--dense-weight-title` |
| 状态主标识 | F1 | `--dense-font-data` / `--dense-weight-data` |
| 分区标题 | F3 | 同上 |
| 表单 label | F4 | `--dense-font-field` / `--dense-weight-field` |
| 输入/选择值 | F1 | `--dense-font-data` |
| 模块汇总数值 | **F1** + 语义色 | 禁止 600/700 |
| 子项 title | F3 | 12px/600 |
| 子项 desc | F1 | 13px/500 |
| mini-table th / td | F3 / F1 | — |

**间距**（§6，禁止为字号紧凑而取消间距）：

| 元素 | Token |
|------|-------|
| 分区块间距 | `--dense-gap-module` 8px |
| section body | `--dense-pad-section-y/x` 10×12px |
| 表单 grid | row **8px** / col **12px** |
| label → 控件 | `--dense-gap-label` 4px |
| form-item 行距 | `--dense-gap-field-row` 8px |

**禁止**：

- ❌ Arco 默认抽屉标题 16px
- ❌ 状态条单号 14px bold
- ❌ 模块汇总数值 15px / 700
- ❌ form-item `margin-bottom: 0–4px` 且无 grid row-gap（贴靠无设计感）

#### 17.3.11 选项组与横排枚举（对照截图验收）

**问题 A — 虚线框内 checkbox 行（`.detail-option-group` / `.detail-order-flags`）**

| 现象 | 根因 | 规范 |
|------|------|------|
| label 与 checkbox 贴靠、选项挤成一团 | `gap: 6px 10px`、无 checkbox-group 内间距 | 容器 `gap: 8px 12px`；组内 **8×16px** |
| 选项文案偏小发虚 | checkbox label 未走 F1 | `.detail-drawer .arco-checkbox-label` → **F1 13px** |
| 组标题与分区标题混淆 | 组内 label 用了 F3 | 组标题 **F4 12px**；分区标题仍 F3 12/600 |

**结构**：

```html
<div class="detail-option-group">
  <span class="detail-option-group__label">订单类型</span>
  <a-checkbox-group>...</a-checkbox-group>
</div>
```

**问题 B — 分区内横排下拉（如清关四字段）**

| 现象 | 根因 | 规范 |
|------|------|------|
| label 与下拉横贴、列宽参差 | `a-form-item` **未包**在 `layout="vertical"` 的 `detail-form` 内 | 必须 `<a-form layout="vertical" class="detail-form">` + `detail-form-grid--N` |
| 像 inline 表单而非栅格 | Arco 默认 horizontal form-item | 垂直 label 在上、控件 `width:100%` |
| 是/否与条款下拉宽度逻辑不同 | 强行裸 flex 横排 | 统一 **grid 等分列**；枚举与文本下拉同列宽 |

**禁止**：

```
❌ 在 DetailSection 内裸放 a-form-item（无 detail-form 父级）
❌ 选项组 gap < 8px 或 checkbox 间距 < 12px
❌ 用虚线框替代 DetailSection 承载整块主表单（选项组仅用于补充标记类字段）
```

#### 17.3.10 复杂详情实现契约（自包含，无页面路径）

> AI 重建任意复杂详情时，只依赖本节 + `global.css` `.detail-*`，**禁止**引用具体 `src/views/**` 路径。

**DOM 壳**：

```
.detail-drawer
└── .detail-drawer-body
    ├── .detail-drawer-status
    ├── .detail-drawer-scroll
    │   ├── DetailSection × N
    │   └── DetailModule × M → .detail-module__subitem × N
    └── .detail-drawer-footer
```

**组件最小契约**：

| 组件 | props / slots |
|------|---------------|
| `DetailSection` | `title`；`#actions`；default = body |
| `DetailModule` | `title`、`badge?`；`#actions`、`#summary`；default = 子项列表 |
| `DetailSubitem` | `expanded`、`index`；head 折叠 + body 表单/嵌套表 |
| `DetailCollapseToggle` | `expanded`；emit toggle |

**样式源**：`src/styles/global.css` 中 `.detail-drawer`、`.detail-section`、`.detail-module`、`.detail-subitem__*`、`.detail-subitem__actions`、`.detail-form`、`.detail-option-group`、`.detail-mini-table`、`.detail-module-summary`、`.detail-data-stats`、`.detail-collapse-toggle`。

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

**统一使用 `.s-pill[data-s]`**（定义于 `global.css`）：

```html
<!-- ✅ 正确 -->
<span class="s-pill" :data-s="row.statusCode">{{ row.statusText }}</span>
```

| `data-s` 值 | 语义 | 配色 |
|-------------|------|------|
| `wait` | 待处理/待审核 | 橙黄背景 + 深橙字 |
| `op` | 操作中/进行中 | 蓝背景 + 蓝字 |
| `partial` | 部分完成 | 紫背景 + 紫字 |
| `draft` | 草稿/未提交 | 灰背景 + 灰字 |
| `acc` | 已接单/已通过 | 青背景 + 青字 |
| `rel` | 已放舱/已完成 | 绿背景 + 绿字 |
| `rej` | 已拒绝/异常 | 红背景 + 红字 |

> ⚠️ **旧体系已废弃**：`.status-pill[data-status="中文"]`（§4.1 旧文档）和 `arco-ui.css` 的 `.pill.p-*` 均不得在新页面使用。

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
// ✅ 使用 CSS Token，禁止硬编码 hex
const riskColors = {
  high:   { bg: 'var(--danger-1)',  text: 'var(--danger-7)'  },  // 高风险：红
  medium: { bg: 'var(--warning-1)', text: 'var(--warning-7)' },  // 中风险：橙
  low:    { bg: 'var(--success-1)', text: 'var(--success-7)' },  // 低风险：绿
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
.kpi-value { font-size:28px; font-weight:800; color:var(--color-text-1); font-variant-numeric:tabular-nums; line-height:1; letter-spacing:-.02em; }
.kpi-unit  { font-size:12px; color:var(--color-text-3); }
.kpi-footer { margin-top:8px; font-size:11.5px; }
.kpi-trend.up   { color: var(--success-7); }  /* ✅ Token，禁止 #16a34a */
.kpi-trend.down { color: var(--danger-7); }   /* ✅ Token，禁止 #dc2626 */
.kpi-trend.flat { color: var(--color-text-3); }
```

### 20.2 KPI 卡片列数规则

| 指标数量 | 列数 | gap |
|---------|------|-----|
| 3–4 个 | 4列（最后1格可空）| 8px |
| 5–6 个 | 3列 | 8px |
| 7–8 个 | 4列 | 8px |
| ≥9 个 | 分两行 4列 | 8px |

### 20.3 详情页两种统计（必须区分，禁止混用样式）

> **一类问题**：详情/表单内出现数字时，先判定是**跨子项汇总**还是**单条/单行随动统计**，再选类名；禁止混用视觉权重。

| 维度 | **模块总结统计** | **模块数据统计** |
|------|----------------|----------------|
| 含义 | 对整个业务模块的**汇总结论** | 单个子项/表格分组随数据变化的**明细统计** |
| 典型场景 | 模块全量合计（如总数量/总金额/总重量）| 某一子项 head 上的件数/重量、表头旁行数小计 |
| 数据范围 | 跨全部子项聚合（composable 层 `calc*Summary(allItems)`）| 单条 scope（`calc*Summary(oneItem)` 或行内 computed）|
| 类名 | `.detail-module-summary` + `--bar` / `--inline` | `.detail-data-stats` |
| 位置 | 模块顶汇总条；`DetailModule` 内用 `--inline`（§17.3.6）| 子项 head / 表格 cap / section 副标题 **inline** |
| 数值字号 | **13px / 600**，语义色 | **12px / 500**（val）+ **11px**（label），中性色 |
| 装饰 | 左侧色条 + 竖线分隔；可选 badge | 仅 `·` 分隔，**无色条/无语义色** |
| 操作按钮 | 可有模块级（添加子项/复制）| **无**，操作在 toolbar |
| 视觉权重 | 模块级「结论条」| 辅助阅读，不抢汇总条 |

> 列表页顶部 KPI 仍用 §20.1 `.zone-kpi`；与详情内两类统计均不可混用。

#### 20.3.1 模块总结统计（`.detail-module-summary`）

> 整模块汇总。高密度单行，总高 **≤ 32px**（§17.3.9）。

| 变体 | 何时用 |
|------|--------|
| `--bar` | 独立汇总条，**自带** `{模块名}` 标题 |
| `--inline` | 已在 `DetailModule` head 写过模块名，summary slot **不再重复标题** |

```html
<!-- --bar：独立汇总条 -->
<section class="detail-module-summary detail-module-summary--bar">
  <h3 class="detail-module-summary__title">
    {模块名}
    <span class="detail-module-summary__badge">{N} 项</span>
  </h3>
  <div class="detail-module-summary__stats">
    <div class="detail-module-summary__stat detail-module-summary__stat--{语义}">
      <span class="detail-module-summary__stat-label">{指标A}</span>
      <span class="detail-module-summary__stat-value">{值}</span>
      <span class="detail-module-summary__stat-unit">{单位}</span>
    </div>
    <!-- {指标B} / {指标C} -->
  </div>
  <div class="detail-module-summary__actions">…</div>
</section>

<!-- --inline：DetailModule 内，仅指标行 -->
<div class="detail-module-summary detail-module-summary--inline">
  <div class="detail-module-summary__stats">…</div>
</div>
```

- 布局：单行 flex「标题（--bar）| 汇总指标 | 操作」
- 标签 `--dense-font-aux` 11px 灰；数值 **`--dense-font-data` 13px 语义色**；单位 `--dense-font-micro` 10px
- N≥2 子项时 badge：`{N} 项` 或业务语义等价文案
- **禁止**用 `.detail-data-stats` 样式做全模块汇总

#### 20.3.2 模块数据统计（`.detail-data-stats`）

> 子项/块内随表单或表格数据实时变化的统计，贴在标题行或表头旁。

```html
<div class="detail-data-stats">
  <span class="detail-data-stats__item">
    <span class="detail-data-stats__label">{指标A}</span>
    <span class="detail-data-stats__val">{值}</span>
  </span>
  <span class="detail-data-stats__sep">·</span>
  <span class="detail-data-stats__item">
    <span class="detail-data-stats__label">{指标B}</span>
    <span class="detail-data-stats__val">{值}</span>
    <span class="detail-data-stats__unit">{单位}</span>
  </span>
</div>
```

- `--dense-font-aux` 11px 标签 + `--dense-font-label` 12px/500 数值，**中性色**，禁止 primary/orange/green
- `·` 分隔，无竖线/色条/卡片底
- 放在 `detail-module__subitem` head、`.detail-table-toolbar` 旁、section 副标题等 **inline** 位
- **禁止**放大到 13px 或加语义色（与模块总结混淆）

**禁止**：

- ❌ 子项/行内小计复用 `.detail-module-summary` 样式
- ❌ 模块汇总用 `.detail-data-stats` 或纯文本平铺
- ❌ 两类统计视觉权重相同、用户无法一眼区分「总计 vs 分块」

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
| 主内容 | **13px** (`--dense-font-data`) | color-text-1 | 表格数据、输入值、抽屉标题 |
| 分区/表头 | **12px** (`--dense-font-label`) | color-text-2 | 分区标题、mini-table |
| 辅助说明 | **11px** (`--dense-font-aux`) | color-text-3 | placeholder、统计 label、副文案 |
| 字段标签 | **12px** (`--dense-font-field`) | color-text-2 | 筛选顶标、detail form label |
| 结构标题 | **12px** (`--dense-font-title`) | color-text-1 / 600 | VXE 表头、分区 title |
| 禁用/无效 | **11px** | color-text-4 | 空值"—"、弱提示 |

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
- 必须由分页组件显示 total（"共 N 条"）
- 必须显示 page-size 切换（20/50/100/200）
- **位置**：表格卡片顶部 `table-card-cap`，分页靠**右上**；禁止在 table cap 左侧再放一份「共 N 条」

```vue
<div class="table-card-cap">
  <div class="table-card-cap__right">
  <!-- 列设置 -->
    <a-pagination class="table-card-cap__pager" size="small" show-page-size show-jumper />
  </div>
</div>
```

---

## 二十五、图标使用规范

> **与 §14.8 分工**：§14.8 规定按钮×图标 **形态与分区**；本章规定 **图标来源、语义映射、装饰性 icon**。

### 25.1 图标来源

所有图标用 `@arco-design/web-vue` 内置图标（`<icon-*>`），**不引入额外图标库**。

### 25.2 图标尺寸（与 §14.8 / §7.11 对齐）

| 场景 | 按钮形态 | 盒尺寸 | icon px |
|------|---------|--------|---------|
| 表格行操作 | **B2** `.row-action-btn` | 28×28 | 14 |
| table-card-cap 工具 | **B2** `.table-card-cap__tool` | 30×30 | 14 |
| 工具栏 small 图文按钮 | **B3** | 28 高 | 14 |
| 工具栏/页头 ghost 工具 | **B2** `type="text"` | 28 高 | 14 |
| 详情折叠 chevron | ghost 链（非 button）| — | 12–13 |
| KPI / 空状态装饰 | 非按钮 | — | 20–48 |

**禁止**：业务按钮内 icon 使用 15/16px；行内用 `size="mini"` 代替 `.row-action-btn`（§14.8.6）。

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

> 色彩目标：保持 Arco Design + `@arco-themes/vue-gi-demo` 的默认主题体系，但不能把页面做成大面积灰白。现代货代 SaaS 的质感来自「中性底 + 主色层级 + 语义色克制」三件事，而不是另起一套品牌色。

### 26.1 功能色

| 语义 | Token（禁止写裸 hex）| 用途 |
|------|---------------------|------|
| 主色 | `var(--primary-6)` #165DFF | 主按钮、激活状态、链接 |
| 成功 | `var(--success-6)` #00B42A / `var(--success-7)` #009A29 | 已通过、正值毛利率、↑趋势 |
| 警告 | `var(--warning-6)` #FF7D00 / `var(--warning-7)` #D25F00 | 警戒毛利率、中风险、即将超时 |
| 危险 | `var(--danger-6)` #F53F3F / `var(--danger-7)` #CB272D | 删除按钮、负值、高风险、错误 |
| 信息 | `var(--primary-6)` | 复核中、提示（同主色）|
| 禁用 | `var(--color-text-4)` | 禁用状态、空值 |

### 26.2 背景色

| Token | 用途 |
|-------|------|
| `var(--dense-page-bg)` | 页面背景，允许用 `primary-1 → color-bg-body` 的轻渐变建立层级 |
| `var(--color-bg-card)` | 卡片/面板/表格主体背景 |
| `var(--primary-1)` | 运输 Tab、表头、hover、选中、轻提示等低强度主色背景 |
| `var(--primary-2/3)` | 卡片重点边界、激活控件边界 |
| `var(--color-fill-1/2)` | 次级容器、disabled、弱分隔；禁止大面积全页铺灰 |

### 26.2-A 货代 SaaS 色彩节奏（强制）

| 层级 | 颜色策略 | 禁止 |
|------|----------|------|
| 页面底 | 使用 `--dense-page-bg`，顶部轻主色、下方回到 body 底色 | 整页只有 `color-bg-body` 灰底 |
| 业务卡片 | 主体白底，边界用 `color-border-1`；关键卡可用 `primary-2` 边界 | 每个卡片都加深灰背景 |
| 页面级 Tab / 表头 | 可用 `primary-1` 轻底 + `primary-6` 激活线/文字 | Tab、表头、工具栏全灰且无主次 |
| 工具栏 | 主操作 `primary`，次操作 `outline`，工具动作 `text/icon-only` | 刷新、创建、导出同一视觉权重 |
| 状态 | 只在 `.s-pill` / Tag / Tab 数量上使用功能色 | 行背景、整块面板按状态铺色 |

### 26.2-B 灰度预算

- `color-text-4` 只用于空值、禁用、副说明，不用于主要字段。
- `color-fill-1/2` 只做弱容器和 disabled，不做页面主视觉。
- 一屏内必须能看到稳定的主色锚点：当前菜单/Tab、查询主按钮、核心链接、表头或卡片重点边界。
- 视觉层级顺序：`primary-6` 交互主线 > `color-text-1` 关键数据 > `color-text-2/3` 普通信息 > `color-text-4` 辅助信息。

### 26.3 禁止直接写颜色值的地方

- 所有背景色必须用 token（`var(--color-bg-*)`），不写 `#fff`
- 所有主色必须用 `var(--primary-*)` token，不写 `#165DFF`
- 功能色（成功/警告/危险）**必须使用 Token**（`var(--success-6)` / `var(--warning-6)` / `var(--danger-6)`），禁止写裸 hex
- 禁止硬编码中性灰（如 `#8a94a6` / `#f8fafc`）；使用 `color-text-*` / `color-fill-*`

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
□ **禁止**「已筛选 / 已选条件」横条（§11.8）
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
| 当前激活的筛选条件 | 表单控件值 + Tab/chip 激活态；**禁止**底部横条（§11.8）|

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
复杂编辑（>5字段）   → 右侧超宽抽屉 `calc(100vw - 32px)`（§17.3）
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
| Drawer（常规）| 固定 px（400–640px），右侧滑入 | 固定 px，不变 |
| Drawer（复杂业务单）| `calc(100vw - 32px)` 近全屏（§17.3）| 同左，充分利用横向空间 |
| 禁止 | 常规详情用 `100vw` 相对宽度无上限 | 复杂业务单除外 |

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

> **规范行高与实现说明**：主工作台列表使用 `compact=36px / header=32px`。只有两行单元格或低频审阅页才使用 `standard=48px`。

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

  &[data-s="pending"]    { background: var(--warning-1); color: var(--warning-6); }
  &[data-s="processing"] { background: var(--primary-1); color: var(--primary-6); }
  &[data-s="done"]       { background: var(--success-1); color: var(--success-6); }
  &[data-s="rejected"]   { background: var(--danger-1); color: var(--danger-6); }
  &[data-s="draft"]      { background: var(--color-fill-2); color: var(--color-text-3); }
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
    ├── （禁止 FilterActiveStrip，§11.8）
    ├── StatusTabs         状态快速切换
    ├── Toolbar            工具栏（左:业务操作/批量, 右:工具图标）
    ├── DataTable          VXE Table（占主要空间）
    └── TableCap           表格顶栏：右上分页（含总数）+ 列设置
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

**复杂详情抽屉**（列表页内打开，§17.3）：

```
detail-drawer
├── 状态摘要条（首屏可见）
├── DetailSection × N（单次性分区）
├── DetailModule × M（可重复子项模块 §17.3.6）
│   ├── summary --inline（§20.3.1）
│   └── subitem × N（§20.3.2 + §17.3.7 折叠）
├── DetailSection × N（含嵌套表的分区）
└── detail-drawer-footer：取消 | 废弃 | 保存 | 提交
```

- 超宽抽屉内表单用 **4–6 列 CSS Grid**，非单列
- 嵌套表格操作列 **sticky right**
- 可重复模块：模块总结 §20.3.1 `--inline`；子项统计 §20.3.2，**禁止混用样式**
- 查看模式 disabled 可读性见 §17.3.8

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
✅ 无「已筛选」横条；条件由表单 + Tab/chip 表达（§11.8）
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
□ 是否误加「已筛选」横条？（应禁止，§11.8）
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
❌ 禁止列表页「已筛选 / 已选条件」横条（§11.8）
```

---

## 三十九、列表页体验完整性规范（统一索引）

> 本章将分散条款汇总为**一张交付标准**，新页面 / Code Review / AI 生成均以此为准。
> 规则均指向正文章节（§1.6 自包含），**不含**具体页面路径或「是否已落地」追踪。

### 39.1 区域结构（不变）

```
page-root
├── zone-filter     运输 Tab + 栅格筛选（禁止已筛选横条 §11.8）
└── zone-data       状态 Tab → 工具栏 → table-card-cap（右上分页）→ 表格
```

### 39.2 筛选区（§11.5 ~ §11.11）

| # | 必须项 | 章节 |
|---|--------|------|
| 1 | Tier 2：`a-form` + `a-row` span=6，右侧查询/重置 | §11.5 |
| 2 | 展开：`icon-down/up` + `(+N)` + 折叠 badge | §11.5 |
| 3 | 重置清空表单并重新查询 | §11.7 |
| 4 | **禁止**「已筛选」横条 | §11.8 |
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

### 39.5 工具栏（§14.5 / §14.8）

| # | 必须项 |
|---|--------|
| 1 | 导出下拉：当前页 / 全部筛选 / 已选 |
| 2 | 批量未选 `Message.warning` |
| 3 | 无文件显示 `—` |
| 4 | 右侧 **B2** 纯图标：列设置、刷新、密度 + tooltip |
| 5 | 左侧 **B3** 图文：新建/导出；批量 **B3 trailing ▼** |
| 6 | 行内仅 **B2** `.row-action-btn`，禁止 B3 |

### 39.6 复杂详情交付索引

| # | 必须项 | 章节 |
|---|--------|------|
| 1 | 超宽抽屉 + 固定底栏 | §17.3.1 |
| 2 | 可重复子项单卡 + 折叠 | §17.3.6 / §17.3.7 |
| 3 | 收起态隐藏子项 stats | §17.3.7 |
| 4 | 两种统计区分 | §20.3 |
| 5 | 字号/控件密度 | §17.3.9 / §7 / §7.7 |
| 6 | 只读 disabled 可读 | §17.3.8 |
| 7 | 实现契约（组件 + CSS 类名）| §17.3.10 |
| 8 | 选项组 / 横排枚举布局 | §17.3.11 |

---

## 四十、废弃组件与迁移指南

> 本章记录所有已废弃的 CSS 类和模式，新页面必须使用替代方案。

### 40.1 废弃对照表

| 废弃类/方案 | 替代方案 | 备注 |
|-------------|----------|------|
| `.status-pill[data-status="中文"]` | `.s-pill[data-s="英文简码"]` | 见 §19.1 |
| `.pill.p-wait/.p-acc/...`（arco-ui.css）| `.s-pill[data-s]` | 见 §19.1 |
| `.filters / .fgrid / .field / .factions` | `.filter-card / .filter-grid / .filter-field` | 见 §11 |
| `.freight-table`（VXE class）| 不需要类名，`global.css` 通过 `.vxe-table` 全局覆盖 | 见 §5.9 |
| 功能色裸 hex（`#16a34a` / `#dc2626` 等）| `var(--success-6)` / `var(--danger-6)` 等 | 见 §26.1 |
| `rgb(var(--orange-6))` / `rgb(var(--green-6))` | `var(--dense-warning-6)` / `var(--dense-success-6)` | 见 `src/styles/global.css` |
| `font-weight: 700` 普通文本 | 最高 600，KPI 例外可用 800 | 见 §7 |
| `.stab--active::after` 下划线 | pill 实心背景（global.css 已实现）| 见 §12.3 |

### 40.2 新建页面 CheckList（废弃检测）

```
□ 没有使用 .status-pill 或 .pill.p-* 类
□ 没有使用 .filters/.fgrid/.field/.factions 旧筛选类
□ VXE 表格没有加 class="freight-table"
□ 没有功能色裸 hex（git diff 中无 #16a34a / #d97706 / #dc2626 / #0284c7）
□ 没有 rgb(var(--orange-6)) 或 rgb(var(--green-6))
□ 没有 font-weight: 700（除 .kpi-value）
```

---

## 四十一、高密度五层全链路页面交付标准（PESDP Zone v2）

> 本章为货代 SaaS 列表页**项目级统一规范**，与 §11 / §12 / §5 / §14 互补。

### 41.1 设计 Token（色彩由 global.css 固定封装，禁止页面内另起 hex）

| Token | 值 | 用途 |
|-------|-----|------|
| 色彩源 | `src/styles/global.css` 的 `--dense-*` 固定项目主题 token | **唯一项目语义色定义层** |
| 主色别名 | `--dense-primary: var(--dense-primary-6)` | 链接、Tab 激活、自定义控件 |
| 深/浅主色 | `--dense-primary-deep` / `--dense-primary-soft` | hover、选中底 |
| 背景/边框 | `--dense-bg-*` / `--dense-border-*` | 卡片、分隔 |
| 圆角 | `--dense-radius: 6px` | 卡片、按钮、输入框、Tag |
| 行高 | `--dense-row-h: 36px` / `--dense-header-h: 32px` / `--dense-bar-h: 36px` | 表格行、表头、工具条 |
| 字号 | `--dense-font-data` / `--dense-font-nav` / `--dense-font-title` / `--dense-font-field` / `--dense-font-aux` / `--dense-font-micro` | §7 F1–F6 |
| 间距 | `--dense-gap-zone` 8 / `--dense-gap-module` 8 / `--dense-gap-field-row` 8 / `--dense-gap-field-col` 12 / `--dense-gap-label` 4 | §6.2，**禁止零间距** |
| 内边距 | `--dense-pad-section` 10×12 / `--dense-pad-head` 8×12 | 详情分区 |
| 筛选控件 | `--dense-control-h-filter: 32px` + `--dense-font-data` | filter-grid |
| 详情控件 | `--dense-control-h-detail: 28px` + `--dense-font-data` | detail-drawer 多列表单（§17.3.9）|
| VXE 表头 | `--dense-font-title` 12px | vxe-table header（见 §5.9 及 global.css）|
| 阴影 | `--dense-shadow-card` 中性灰 + inset 顶高光 | 卡片质感 |

> **禁止**在列表页写独立主色 hex（如 `#3d6fd9`），避免与 Arco 按钮/分页 `#165DFF` 割裂。

### 41.2 五层固定分区（DOM 顺序不可打乱）

```
page-root--dense（padding + gap 分隔各卡片）
├── L1 zone-l1-transport.zone-card     业务 Tab（海运/空运/铁路）
├── L2 zone-l2-filter-card.zone-card   筛选卡片（无标题栏、无已筛选横条 §11.8）
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
| 折叠提示 | 高级条件激活且折叠时操作列 badge + `a-tooltip`；**禁止**底部标签条（§11.8）|
| 人员字段 | 业务员/操作员/客服/发货人/收货人 `a-select` + `allow-search` |
| Tab 切换 | 运输 Tab → 清空筛选 + 收起高级区 + Toast |
| 交互 | 回车查询、下拉 auto-search、`allow-clear`、操作 Toast |

### 41.4 表格区（L4）

| 能力 | 实现 |
|------|------|
| 顶栏 | `table-card-cap`：右侧列设置 + **分页**（分页 `show-total` 承载总数） |
| 行高/字号 | 数据行 **36px**，表头 **32px**，正文 **13px**，表头 **12px** |
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
- Mock 权限配置控制按钮显隐（无权限则隐藏，不用 disabled）

### 41.6 微交互清单

- 输入/下拉 `:focus-within` 外发光 `3px`
- 表格行 hover `var(--primary-1)` / `rgba(var(--arcoblue-6), 0.08)`
- Filter Tag hover 使用对应语义 token（warning/primary），不写硬编码暖色
- **按钮禁止 hover 位移/浮起阴影**（仅底色/描边变化）
- 所有写操作配套 `Message` 反馈

### 41.8 高密度 × 高质感专项（优先于功能扩展）

**高密度**（§6.1，相对收紧而非零间距）：

- 表格行 **36px**、表头 **32px**、工具条 **36px**
- 间距走 Token：`--dense-gap-zone/module/field-row/field-col`（**8 / 8 / 8 / 12px**）
- 去掉无信息标题栏/空态 Strip
- **禁止**为密度把 form-item、分区块间距压到 0–4px

**高质感**（靠结构、层级、主题色节奏，不靠留白堆砌）：

- 页面底：`var(--dense-page-bg)`，轻主色顶部过渡到 `color-bg-body`，避免整页灰
- 卡片：`zone-card` 白底 + `--dense-shadow-card`；关键层级可用 `primary-2` 边界
- 表头：`primary-1 → color-bg-card` 轻底 + 主色底线，建立数据区入口
- 高级筛选：虚线顶分隔 + `primary-1/color-fill-1` 轻底，与基础白底区分
- 色彩：**全部映射 Arco**（`--primary-6` 等），禁止独立 hex 主色
- 灰度：`color-fill-1/2` 只做弱容器，不做大面积主视觉；`color-text-4` 只做空值/禁用/副说明
- 微交互：行 hover `var(--primary-1)`；按钮 **禁止 hover translateY/浮起阴影**

> 列表页迭代时**先过密度与质感自检**，再考虑新增业务能力。

### 41.7 自检清单（生成后必过）

- [ ] 筛选 Grid 四列 + **右侧固定操作列**（查询/重置位置不随展开变化）
- [ ] **无**「筛选条件」标题栏；**无**「已筛选 / 已选条件」横条（§11.8）
- [ ] 五层卡片独立圆角阴影，body 使用 `var(--color-bg-body)`
- [ ] 高级区虚线顶分隔 + 0.24s 动画
- [ ] 高级区折叠 badge `(+N)` + 重置按钮；**禁止** tag 横条单删
- [ ] 时间 chip + 人员模糊 Select 全覆盖
- [ ] 运输 Tab 切换清空+收起
- [ ] 危险品**仅**单元格 pill；**无** stripe / 整行橙底
- [ ] 表格行 36px、表头 32px；操作列 28px 方钮
- [ ] `--dense-*` 色彩映射 Arco，无独立 hex 主色
- [ ] 工具栏竖线分组，**无**「操作/跟踪/单据」文字标签
- [ ] 分页在 `table-card-cap` 右上；分页 `show-total` 承载总数，左侧不重复 summary
- [ ] 按钮 hover **无** translateY / 浮起阴影
- [ ] **复杂详情抽屉**：宽度 `calc(100vw - 32px)` + 固定底栏 + DetailSection 分节
- [ ] **模块总结统计**：`detail-module-summary--inline` 在模块内；**13px** 语义色（非 15px）
- [ ] **模块数据统计**：`.detail-data-stats` label 11px / val 12px；禁止与总结条同样式
- [ ] **间距 Token**：模块 gap 8px、表单 row 8/col 12、label 4px；禁止贴靠（§6）
- [ ] **字体 F1–F6**：Tab/表格/输入均 13px；标题 12px/600；禁止 700（§7）
- [ ] **可重复子项模块**：`DetailModule` 单卡；子项无 shadow；子项标题 `{子项实体} {序号}`，禁止 `{模块名}_{序号}`
- [ ] **折叠切换**：ghost 文字链 `.detail-collapse-toggle`（F2 13px，无边框 pill）；序号 badge 区分展开/收起（§17.3.7）
- [ ] **子项 head hover**：仅 background-color；禁止左侧竖条（§17.3.7）
- [ ] **收起态子项**：隐藏 `.detail-data-stats`；显示 `.detail-subitem__state`（§17.3.7）
- [ ] **字段标签统一**：列表 `filter-field__label` 与详情 `.detail-form` label 均为 F4 **12px**（§7.12）
- [ ] **筛选三级语义**：label 12 / 控件&chip 13 / placeholder 11（§7.12）
- [ ] **组件对照**：列表/详情各组件查 §7.8.1 / §7.8.2 表，Token 无硬编码 px
- [ ] **Arco 覆盖**：drawer 标题、input/select 值已覆盖为 F3/F1（§7.8.3）
- [ ] **筛选 placeholder**：F5 语义化文案，禁止裸「模糊搜索」（§11.5）
- [ ] **筛选栅格间距**：row-gap 10px、body padding 12px（§6.4）
- [ ] **详情横排枚举**：`detail-form` vertical + `detail-form-grid`（§17.3.11）
- [ ] **选项组**：`.detail-option-group` gap 8×12、checkbox 组内 8×16（§17.3.11）
- [ ] **详情只读 disabled**：`.detail-drawer` 内 disabled 文字 text-1/500（§17.3.8）
- [ ] **详情按钮**：全部 `small`；删除用 `outline danger`；表格 toolbar 在表上方右对齐
- [ ] **详情 mini 文字按钮**：禁止（10px 发糊）

---

## 四十二、VXE Table 批量勾选完整规范

> 批量操作的前提是正确配置 VXE Table 的 checkbox 列。本章给出完整技术配置。

### 42.1 VXE 勾选列配置

```vue
<vxe-table
  ref="tableRef"
  border="none"
  show-overflow="title"
  size="small"
  max-height="100%"
  :checkbox-config="{ checkStrictly: false, highlight: true }"
  :row-config="{ isHover: true, keyField: 'id' }"
  :data="rows"
  @checkbox-change="onCheckChange"
  @checkbox-all="onCheckAll"
>
  <!-- ① checkbox 列：固定左侧，宽度 40px -->
  <vxe-column type="checkbox" width="40" fixed="left" />
  <!-- ② 其余业务列 -->
  <vxe-column field="orderNo" title="订单号" width="160" fixed="left" />
  ...
</vxe-table>
```

### 42.2 勾选状态管理（Composition API）

```ts
const tableRef = ref<VxeTableInstance>()

// 获取已勾选行
const getSelected = () => tableRef.value!.getCheckboxRecords()

// 清空勾选
const clearSelected = () => tableRef.value!.clearCheckboxRow()

// 勾选变化回调
const onCheckChange = ({ records }: { records: RowData[] }) => {
  selectedRows.value = records
}
const onCheckAll = ({ records }: { records: RowData[] }) => {
  selectedRows.value = records
}
```

### 42.3 工具栏批量操作展示规则

```vue
<div class="toolbar">
  <div class="toolbar-left">
    <!-- 批量操作按钮：仅勾选后显示 -->
    <template v-if="selectedRows.length > 0">
      <span class="bulk-tip">已选 {{ selectedRows.length }} 条</span>
      <a-button size="small" type="primary" @click="bulkConfirm">批量确认</a-button>
      <a-button size="small" status="danger" type="outline" @click="bulkReject">批量拒绝</a-button>
      <a-button size="small" type="text" @click="clearSelected">取消选择</a-button>
    </template>
    <!-- 默认操作按钮 -->
    <template v-else>
      <a-button size="small" type="primary" @click="handleCreate">
        <template #icon><icon-plus /></template>新建
      </a-button>
    </template>
  </div>
</div>
```

```css
.bulk-tip {
  font-size: var(--dense-font-nav);
  color: var(--primary-6);
  font-weight: 600;
  margin-right: 8px;
}
```

### 42.4 批量操作规范

| 规则 | 内容 |
|------|------|
| 前置校验 | 未勾选时点击批量按钮：`Message.warning('请先选择单据')` |
| 数量上限 | 单次批量操作上限 **500 条**，超出提示分批 |
| 结果反馈 | 操作完成后：`Message.success('已成功处理 N 条')` + 自动刷新列表 + `clearSelected()` |
| 部分失败 | 显示 `Message.warning('N 条成功，M 条失败')` + 提供「查看失败明细」按钮 |
| 导出范围 | 批量导出必须下拉三选一：「当前页 / 全部筛选结果 / 已选 N 条」 |
| 危险操作 | 批量删除/废弃必须二次确认弹窗，展示条数 |

---

## 四十三、Uppy 文件上传规范

> 项目使用 **Uppy**（@uppy/core + @uppy/dashboard + @uppy/xhr-upload）替代 a-upload，支持拖拽、进度、多文件、断点续传。

### 43.1 安装与初始化

```bash
npm install @uppy/core @uppy/dashboard @uppy/xhr-upload @uppy/file-input
```

```ts
// composables/useUppy.ts
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import Chinese from '@uppy/locales/lib/zh_CN'

export function useUppy(options: {
  endpoint: string
  maxFileSize?: number      // 默认 50MB
  maxFiles?: number         // 默认 10
  allowedTypes?: string[]   // 默认 ['application/pdf', 'image/*', ...]
}) {
  const uppy = new Uppy({
    locale: Chinese,
    restrictions: {
      maxFileSize: options.maxFileSize ?? 50 * 1024 * 1024,
      maxNumberOfFiles: options.maxFiles ?? 10,
      allowedFileTypes: options.allowedTypes ?? [
        'application/pdf', 'image/jpeg', 'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    },
  }).use(XHRUpload, {
    endpoint: options.endpoint,
    headers: { Authorization: `Bearer ${getToken()}` },
    fieldName: 'file',
    formData: true,
  })
  return uppy
}
```

### 43.2 三种使用场景

#### 场景 A：单文件上传（表单内附件）

```vue
<template>
  <div class="uppy-inline">
    <div v-if="fileUrl" class="uppy-file-preview">
      <icon-file class="uppy-file-icon" />
      <span class="uppy-file-name">{{ fileName }}</span>
      <a-button type="text" size="mini" @click="removeFile">
        <template #icon><icon-close /></template>
      </a-button>
    </div>
    <a-button v-else size="small" type="dashed" @click="openUppy">
      <template #icon><icon-upload /></template>上传附件
    </a-button>
  </div>
</template>
```

```css
.uppy-inline { display: inline-flex; align-items: center; gap: 8px; }
.uppy-file-preview {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 8px; background: var(--color-fill-1);
  border: 1px solid var(--color-border-2); border-radius: var(--dense-radius);
  font-size: var(--dense-font-data); color: var(--color-text-1);
}
.uppy-file-icon { font-size: 14px; color: var(--primary-6); flex-shrink: 0; }
.uppy-file-name { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

#### 场景 B：多文件上传（文件管理 / 附件列表）

```vue
<template>
  <div class="uppy-list-zone" :class="{ dragging: isDragging }" @dragover.prevent="isDragging=true" @dragleave="isDragging=false" @drop.prevent="handleDrop">
    <div class="uppy-list-prompt">
      <icon-upload style="font-size:24px; color:var(--color-text-3)" />
      <p class="uppy-list-text">拖拽文件到此处，或 <a class="link-text" @click="openFileDialog">点击选择文件</a></p>
      <p class="uppy-list-hint">支持 PDF / Excel / Word / 图片，单文件不超过 50MB</p>
    </div>
  </div>
  <!-- 已上传文件列表 -->
  <div class="uppy-file-list">
    <div v-for="f in uploadedFiles" :key="f.id" class="uppy-file-row">
      <icon-file class="uppy-file-row__icon" />
      <span class="uppy-file-row__name">{{ f.name }}</span>
      <span class="uppy-file-row__size">{{ formatSize(f.size) }}</span>
      <a-progress v-if="f.progress < 100" :percent="f.progress" size="mini" style="width:80px" />
      <span v-else class="s-pill" data-s="acc">已上传</span>
      <a-button type="text" size="mini" @click="removeFile(f.id)">
        <template #icon><icon-delete /></template>
      </a-button>
    </div>
  </div>
</template>
```

```css
.uppy-list-zone {
  border: 2px dashed var(--color-border-2);
  border-radius: var(--dense-radius);
  padding: 24px; text-align: center;
  background: var(--color-fill-1); cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.uppy-list-zone.dragging {
  border-color: var(--primary-6);
  background: var(--primary-1);
}
.uppy-list-text { font-size: var(--dense-font-data); color: var(--color-text-2); margin: 8px 0 4px; }
.uppy-list-hint { font-size: var(--dense-font-aux); color: var(--color-text-3); margin: 0; }
.uppy-file-list { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.uppy-file-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; background: var(--color-fill-1);
  border: 1px solid var(--color-border-1); border-radius: var(--radius-md);
  font-size: var(--dense-font-data);
}
.uppy-file-row__icon { font-size: 14px; color: var(--primary-6); flex-shrink: 0; }
.uppy-file-row__name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text-1); }
.uppy-file-row__size { font-size: var(--dense-font-aux); color: var(--color-text-3); flex-shrink: 0; }
```

#### 场景 C：头像 / 印章图片上传（裁剪）

```ts
// 配合 @uppy/image-editor 使用，限制单文件 image/*，2MB
import ImageEditor from '@uppy/image-editor'
uppy.use(ImageEditor, { cropperOptions: { aspectRatio: 1 } })
```

### 43.3 上传规范

| 项目 | 规范 |
|------|------|
| 上传按钮样式 | `type="dashed"` + `<icon-upload />` + "上传附件"，尺寸 `size="small"` |
| 进度展示 | 用 `a-progress` 内联展示每个文件进度（见 §54） |
| 错误提示 | 超限 → `Message.error('文件超过 50MB 限制')`；格式不符 → `Message.error('仅支持 PDF/Excel/…')` |
| 成功回调 | `uppy.on('upload-success', (file, res) => { /* 存 fileId */ })` |
| Token 刷新 | XHRUpload 拦截 401，自动触发 refresh token |
| 删除 | 已上传文件调后端 DELETE 接口后再从列表移除，**禁止仅前端删除** |

---

## 四十四、Timeline 时间线规范

> 用于货物追踪里程碑、操作历史、审批记录、状态变更日志。

### 44.1 何时用 Timeline

| 场景 | 组件 |
|------|------|
| 货物节点（离港 → 到港 → 提货）| Timeline |
| 操作日志（谁/何时/做了什么）| Timeline（简洁型） |
| 审批历史 | Timeline（审批型） |
| 步骤进度（待确认→已接单→在途→到港）| `a-steps`（见 §47）|

### 44.2 使用 Arco Design Timeline

```vue
<template>
  <a-timeline>
    <a-timeline-item
      v-for="node in timeline"
      :key="node.id"
      :label="node.time"
      :dot-color="node.color"
    >
      <div class="tl-content">
        <span class="tl-event">{{ node.event }}</span>
        <span v-if="node.location" class="tl-loc">{{ node.location }}</span>
        <span v-if="node.operator" class="tl-op">{{ node.operator }}</span>
      </div>
    </a-timeline-item>
  </a-timeline>
</template>
```

```ts
// 数据结构
interface TimelineNode {
  id: string
  time: string          // 格式：'2024-01-15 14:30'
  event: string         // 事件名称
  location?: string     // 发生地点（港口代码/仓库名）
  operator?: string     // 操作人
  color?: string        // 节点色：默认 primary-6，异常 danger-6，完成 success-6
}

// 颜色语义
const dotColor = (status: string) => ({
  done:    'var(--success-6)',
  active:  'var(--primary-6)',
  pending: 'var(--color-border-3)',
  error:   'var(--danger-6)',
}[status] ?? 'var(--color-border-3)')
```

### 44.3 Timeline 样式覆盖（dense 风格）

```css
/* Timeline 整体 */
.detail-drawer .arco-timeline { padding: 0 0 0 8px; }
.detail-drawer .arco-timeline-item-label {
  font-size: var(--dense-font-aux);    /* 11px */
  color: var(--color-text-3);
  width: 110px !important;
  flex-shrink: 0;
}
.detail-drawer .arco-timeline-item-content { padding-bottom: 16px; }

/* 事件文本 */
.tl-content { display: flex; flex-direction: column; gap: 2px; }
.tl-event { font-size: var(--dense-font-data); font-weight: 500; color: var(--color-text-1); }
.tl-loc   { font-size: var(--dense-font-aux); color: var(--color-text-3); }
.tl-op    { font-size: var(--dense-font-aux); color: var(--color-text-3); }
```

### 44.4 Timeline 位置规范

- 在**复杂详情抽屉**（§17.3）中，Timeline 作为独立 `DetailSection`，标题「操作记录」或「货物节点」
- 默认**倒序**（最新在上）；货物节点允许正序（运输流程）
- 单次历史 > 20 条时，增加「展开全部 N 条记录」折叠

---

## 四十五、复制到剪贴板规范

> 货代系统最高频交互：单号、提单号、柜号的一键复制。

### 45.1 实现方式

```ts
// composables/useCopy.ts
export function useCopy() {
  const copy = async (text: string, label = '内容') => {
    try {
      await navigator.clipboard.writeText(text)
      Message.success(`${label}已复制`)
    } catch {
      // 降级：execCommand
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      Message.success(`${label}已复制`)
    }
  }
  return { copy }
}
```

### 45.2 触发方式与 UI 规范

#### 方式 A：单号列内联复制图标（最常用）

```vue
<template #default="{ row }">
  <div class="copy-cell">
    <span class="mono link-text" @click="toDetail(row)">{{ row.orderNo }}</span>
    <icon-copy
      class="copy-icon"
      title="复制单号"
      @click.stop="copy(row.orderNo, '单号')"
    />
  </div>
</template>
```

```css
.copy-cell { display: flex; align-items: center; gap: 4px; }
.copy-icon {
  font-size: 12px;
  color: var(--color-text-4);
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;
}
.vxe-body--row:hover .copy-icon { opacity: 1; }
.copy-icon:hover { color: var(--primary-6); }
```

#### 方式 B：详情头部单号 + 复制按钮

```vue
<span class="detail-drawer-status__id mono">{{ order.orderNo }}</span>
<a-tooltip content="复制单号">
  <icon-copy class="copy-btn-head" @click="copy(order.orderNo, '单号')" />
</a-tooltip>
```

```css
.copy-btn-head { font-size: 14px; color: var(--color-text-3); cursor: pointer; }
.copy-btn-head:hover { color: var(--primary-6); }
```

### 45.3 复制规范

| 规则 | 说明 |
|------|------|
| 反馈 | 始终用 `Message.success('XX已复制')`，不用 alert |
| 图标 | 统一用 `<icon-copy />`，悬停列时显示（opacity 0→1）|
| 多值复制 | 如同时复制多个单号：`copy(arr.join('\n'), '已选单号')` |
| 禁止 | 不得直接用浏览器默认 tooltip 说明复制功能，必须有 `a-tooltip` |

---

## 四十六、VXE Table 大数据量虚拟滚动

> 当列表数据量 > 500 行时必须启用 `scroll-y` 虚拟滚动，避免 DOM 卡顿。

### 46.1 配置方式

```vue
<vxe-table
  border="none"
  show-overflow="title"
  size="small"
  height="100%"           <!-- ⚠️ 必须用 height，不能用 max-height（虚拟滚动需固定高度）-->
  :scroll-x="{ enabled: true, gt: 0 }"
  :scroll-y="{ enabled: true, gt: 200 }"   <!-- 超过 200 行启用虚拟滚动 -->
  :row-config="{ isHover: true, keyField: 'id', height: 40 }"  <!-- 必须指定 height！ -->
  :data="rows"
>
```

### 46.2 关键约束

| 约束 | 说明 |
|------|------|
| `row-config.height` | **必须**与 CSS `--dense-row-h` 一致（36px），否则滚动位置错乱 |
| `height` vs `max-height` | 虚拟滚动必须用固定 `height`；非虚拟滚动用 `max-height` |
| 展开行 | 启用虚拟滚动后，展开行（expand）需额外配置 `expand-config.height` |
| 合并单元格 | 虚拟滚动与 `merge-cells` 不兼容，禁止同时使用 |
| 列宽变化 | 虚拟滚动 + 列宽拖动后需调用 `tableRef.value.refreshColumn()` |

### 46.3 何时用 max-height vs height

```
数据量 < 200 行  → max-height="calc(100vh - XXX)"，不启用虚拟滚动
数据量 ≥ 200 行  → height="100%"（配合 flex:1 父容器） + scroll-y enabled
分页列表（≤100条/页）→ max-height，不需虚拟滚动
```

---

## 四十七、多步骤流程规范（Steps / Wizard）

> 适用于：下单流程、报价填写、批量导入向导、账号注册等需要分步引导的场景。

### 47.1 何时用 Steps vs 普通表单

```
字段总数 < 12 个   → 单页表单（Modal 或 Drawer）
字段总数 ≥ 12 个，且逻辑上可分组 → Steps 多步骤
步骤间有强依赖（后步骤需前步骤数据计算）→ Steps
步骤可独立完成、无强依赖 → Tab 切换（非 Steps）
```

### 47.2 Steps 布局规范

```vue
<template>
  <!-- Step 头部：固定在顶部，不随内容滚动 -->
  <div class="wizard-header">
    <a-steps :current="currentStep" size="small" style="padding: 0 24px">
      <a-step title="基础信息" />
      <a-step title="货物信息" />
      <a-step title="费用报价" />
      <a-step title="确认提交" />
    </a-steps>
  </div>

  <!-- Step 内容区：可滚动 -->
  <div class="wizard-body">
    <keep-alive>
      <component :is="stepComponents[currentStep - 1]" v-model="formData" />
    </keep-alive>
  </div>

  <!-- 底部导航（固定） -->
  <div class="wizard-footer">
    <a-button v-if="currentStep > 1" @click="prevStep">上一步</a-button>
    <a-button v-if="currentStep < totalSteps" type="primary" @click="nextStep">下一步</a-button>
    <a-button v-if="currentStep === totalSteps" type="primary" :loading="submitting" @click="submit">提交</a-button>
    <a-button type="text" @click="handleCancel">取消</a-button>
  </div>
</template>
```

```css
/* Steps 向导：通常在全屏页面或超宽抽屉内使用 */
.wizard-header {
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--color-border-1);
  background: var(--color-bg-card);
  flex-shrink: 0;
}
.wizard-body {
  flex: 1; overflow-y: auto; padding: 16px 24px;
}
.wizard-footer {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 24px;
  border-top: 1px solid var(--color-border-1);
  background: var(--color-bg-card);
  flex-shrink: 0;
}
```

### 47.3 步骤校验规则

```ts
const nextStep = async () => {
  // 每步提交前校验当前步骤表单
  const valid = await currentFormRef.value?.validate()
  if (!valid) return
  // 若当前步骤需要后端校验（如校验单号唯一性），在此处调用
  currentStep.value++
}
```

| 规则 | 说明 |
|------|------|
| 每步独立校验 | 点「下一步」时校验当前步骤，通过后才跳转 |
| 返回上步 | 保留已填数据，**不清空** |
| 进度保存 | 超过 3 步的流程需支持「草稿保存」（接口 + 本地 sessionStorage 双保险）|
| 错误步骤 | 提交失败后，`a-steps` 对应 step 显示 `status="error"` |
| 步骤标题 | 最多 6 字，与业务节点语义对应 |

---

## 四十八、TreeSelect 树形选择规范

> 适用于：权限菜单树、货物品类树、仓库区域树、组织架构选择。

### 48.1 何时用 TreeSelect vs Select

```
数据为扁平列表（无父子关系）→ a-select
数据有 2 级以上父子层级 → a-tree-select
层级 > 4 级 → 考虑改用 Cascader（见 §49）
```

### 48.2 基本用法

```vue
<a-tree-select
  v-model="selectedCategory"
  :data="categoryTree"
  :field-names="{ key: 'id', title: 'name', children: 'children' }"
  placeholder="请选择品类"
  allow-search
  allow-clear
  size="small"
  style="width: 200px"
/>
```

```ts
// 树数据结构
interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  disabled?: boolean    // 不可选择的父节点
  selectable?: boolean  // false = 仅作分组，不可选
}
```

### 48.3 多选 TreeSelect（权限/批量分配）

```vue
<a-tree-select
  v-model="selectedMenus"
  :data="menuTree"
  multiple
  checkable                    <!-- 显示 checkbox -->
  check-strictly               <!-- true=父子独立勾选；false=联动（权限场景用 false）-->
  :default-expand-level="2"
  placeholder="请选择菜单权限"
  size="small"
/>
```

### 48.4 树节点图标规范

```vue
<!-- 在 a-tree-select 的 title slot 中自定义 -->
<template #title="node">
  <span class="tree-node-title">
    <icon-folder v-if="node.children?.length" class="tree-icon tree-icon--folder" />
    <icon-file   v-else                        class="tree-icon tree-icon--file" />
    {{ node.name }}
  </span>
</template>
```

```css
.tree-icon { font-size: 13px; flex-shrink: 0; }
.tree-icon--folder { color: var(--warning-6); }
.tree-icon--file   { color: var(--color-text-3); }
.tree-node-title   { display: inline-flex; align-items: center; gap: 5px;
                     font-size: var(--dense-font-data); }
```

---

## 四十九、Cascader 级联选择规范

> 适用于：国家/省/市地址选择、港口级联（大区→国家→港口）、货物分类级联。

### 49.1 基本用法

```vue
<a-cascader
  v-model="selectedPort"
  :options="portOptions"
  :field-names="{ value: 'code', label: 'name', children: 'ports' }"
  placeholder="请选择目的港"
  allow-search
  allow-clear
  size="small"
  style="width: 200px"
  check-strictly              <!-- 允许选中父级（中间级别也可确认）-->
/>
```

```ts
// 港口级联数据
interface PortCascader {
  code: string
  name: string
  ports?: PortCascader[]
}
// 示例：[{ code:'AS', name:'亚洲', ports:[{ code:'CN', name:'中国', ports:[{ code:'SHA', name:'上海' }] }] }]
```

### 49.2 规范

| 项目 | 规范 |
|------|------|
| 搜索 | 必须开启 `allow-search`（货代港口数量庞大） |
| 回显 | 仅显示末级（`display-render` 只显示最后一级名称）|
| 层级上限 | 建议不超过 4 级，超过时拆成两个独立 select |
| 远程加载 | 超大数据集（如全国城市）用 `load-data` 懒加载 |
| 禁用父级选中 | 地区选择中，省级不可选时设 `selectable: false` |

---

## 五十、财务模块规范

> 覆盖应收/应付账款、对账单、收费项、汇率换算等财务场景的专项设计规范。

### 50.1 金额格式化

```ts
// utils/money.ts

// 千分位 + 保留 2 位小数
export const fmtMoney = (v: number | string, currency = 'CNY') => {
  const n = Number(v)
  if (isNaN(n)) return '—'
  return new Intl.NumberFormat('zh-CN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

// 带币种符号
export const fmtCurrency = (v: number, currency = 'CNY') => {
  const symbols: Record<string, string> = {
    CNY: '¥', USD: '$', EUR: '€', JPY: '¥', GBP: '£', HKD: 'HK$', SGD: 'S$',
  }
  return `${symbols[currency] ?? currency} ${fmtMoney(v)}`
}

// 负值红色展示
export const moneyColor = (v: number) =>
  v < 0 ? 'var(--danger-6)' : v > 0 ? 'var(--color-text-1)' : 'var(--color-text-3)'
```

### 50.2 金额列展示规范

```vue
<!-- VXE 金额列 -->
<vxe-column field="amount" title="金额（元）" width="120" align="right">
  <template #default="{ row }">
    <span class="num-val" :style="{ color: moneyColor(row.amount) }">
      {{ fmtMoney(row.amount) }}
    </span>
  </template>
</vxe-column>

<!-- 多币种列（显示币种符号）-->
<vxe-column field="foreignAmount" title="外币金额" width="140" align="right">
  <template #default="{ row }">
    <div class="cell-two-line" style="align-items:flex-end">
      <span class="c2-main">{{ fmtMoney(row.foreignAmount) }}</span>
      <span class="c2-sub">{{ row.currency }}</span>
    </div>
  </template>
</vxe-column>
```

| 规范 | 内容 |
|------|------|
| 对齐 | 金额列必须**右对齐**（`align="right"`）|
| 字体 | 使用 `.num-val`（等宽数字 tabular-nums）|
| 负数 | `var(--danger-6)` 红色显示，正数默认 text-1 |
| 小数位 | 统一 2 位小数（货币）；费率 4 位；数量按业务定 |
| 汇总行 | 使用 VXE `footer-method` 配置合计行，字重 600 |

### 50.3 收费项目列表规范（费用明细）

```vue
<div class="fee-table">
  <div class="fee-table__head">
    <span class="fee-col-name">费用项</span>
    <span class="fee-col-qty">数量</span>
    <span class="fee-col-unit">单价</span>
    <span class="fee-col-currency">币种</span>
    <span class="fee-col-amount">金额</span>
  </div>
  <div v-for="fee in fees" :key="fee.id" class="fee-table__row">
    <span class="fee-col-name">{{ fee.name }}</span>
    <span class="fee-col-qty num-val">{{ fee.qty }}</span>
    <span class="fee-col-unit num-val">{{ fmtMoney(fee.unitPrice) }}</span>
    <span class="fee-col-currency">{{ fee.currency }}</span>
    <span class="fee-col-amount num-val" :style="{ color: moneyColor(fee.amount) }">
      {{ fmtMoney(fee.amount) }}
    </span>
  </div>
  <div class="fee-table__total">
    <span>合计（CNY）</span>
    <span class="num-val fee-total-val">{{ fmtMoney(totalCNY) }}</span>
  </div>
</div>
```

```css
.fee-table { font-size: var(--dense-font-data); }
.fee-table__head {
  display: grid;
  grid-template-columns: 1fr 60px 80px 60px 100px;
  padding: 6px 12px;
  background: var(--color-fill-1);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  font-weight: 500;
}
.fee-table__row {
  display: grid;
  grid-template-columns: 1fr 60px 80px 60px 100px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border-1);
}
.fee-col-qty, .fee-col-unit, .fee-col-amount { text-align: right; font-variant-numeric: tabular-nums; }
.fee-table__total {
  display: flex; justify-content: space-between;
  padding: 10px 12px;
  font-weight: 600;
  background: var(--color-fill-1);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}
.fee-total-val { font-size: 15px; color: var(--primary-6); }
```

### 50.4 财务状态色

| 状态 | `data-s` | 语义 |
|------|----------|------|
| 待付款 | `wait` | 橙黄 |
| 部分付款 | `partial` | 紫色 |
| 已付款 | `acc` | 青色 |
| 已结清 | `rel` | 绿色 |
| 已逾期 | `rej` | 红色（危险）|
| 草稿/未确认 | `draft` | 灰色 |

---

## 五十一、审批流 UI 规范

> 覆盖单据审批、多级审批历史、审批操作按钮。

### 51.1 审批状态展示

审批状态统一使用 `.s-pill[data-s]`，映射关系：

| 审批状态 | `data-s` | 说明 |
|---------|----------|------|
| 待审批 | `wait` | 提交后等待审批 |
| 审批中 | `op` | 多级审批进行中 |
| 已通过 | `acc` | 审批完成 |
| 已拒绝 | `rej` | 审批被驳回 |
| 已撤回 | `draft` | 申请人撤回 |

### 51.2 审批历史 Timeline

```vue
<a-timeline>
  <a-timeline-item
    v-for="record in approvalHistory"
    :key="record.id"
    :label="record.time"
    :dot-color="approvalDotColor(record.action)"
  >
    <div class="approval-node">
      <span class="approval-node__actor">{{ record.actorName }}</span>
      <span class="s-pill" :data-s="approvalActionToS(record.action)">
        {{ record.actionLabel }}
      </span>
      <p v-if="record.comment" class="approval-node__comment">
        "{{ record.comment }}"
      </p>
    </div>
  </a-timeline-item>
</a-timeline>
```

```ts
const approvalDotColor = (action: string) => ({
  pass:    'var(--success-6)',
  reject:  'var(--danger-6)',
  revoke:  'var(--color-text-3)',
  pending: 'var(--warning-6)',
}[action] ?? 'var(--color-border-3)')

const approvalActionToS = (action: string) => ({
  pass: 'acc', reject: 'rej', revoke: 'draft', pending: 'wait',
}[action] ?? 'draft')
```

```css
.approval-node { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.approval-node__actor { font-size: var(--dense-font-data); font-weight: 500; color: var(--color-text-1); }
.approval-node__comment {
  width: 100%; margin: 4px 0 0;
  font-size: var(--dense-font-aux); color: var(--color-text-2);
  font-style: italic; line-height: 1.5;
  padding: 4px 8px; background: var(--color-fill-1);
  border-left: 2px solid var(--color-border-2); border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
```

### 51.3 审批操作按钮（详情抽屉 Footer）

```vue
<!-- 当前用户是审批人且状态为「待审批/审批中」时显示 -->
<template v-if="canApprove">
  <a-button type="primary" :loading="approving" @click="handlePass">
    <template #icon><icon-check /></template>通过
  </a-button>
  <a-button status="danger" type="outline" @click="openRejectModal">
    <template #icon><icon-close /></template>拒绝
  </a-button>
</template>
<!-- 申请人可撤回（待审批状态） -->
<a-button v-if="canRevoke" type="text" @click="handleRevoke">撤回申请</a-button>
```

### 51.4 拒绝理由弹窗规范

```vue
<a-modal title="拒绝原因" :visible="rejectVisible" @ok="confirmReject" @cancel="rejectVisible=false">
  <a-form :model="rejectForm">
    <a-form-item field="reason" label="拒绝原因" :rules="[{ required: true, message: '请填写拒绝原因' }]">
      <a-textarea v-model="rejectForm.reason" placeholder="请说明拒绝原因（必填）" :max-length="200" show-word-limit :rows="3" />
    </a-form-item>
  </a-form>
</a-modal>
```

---

## 五十二、文件管理规范

> 覆盖附件列表、文件预览、文件夹树、批量下载等文件管理场景。

### 52.1 文件管理页面布局

```
┌─────────────────────────────────────────────────┐
│ [L1] 页面 Tab（全部文件 / 提单文件 / 报关文件…）  │
├───────────────┬─────────────────────────────────┤
│               │ [L2] 工具栏（上传 / 下载 / 删除）│
│  [左侧]       ├─────────────────────────────────┤
│  文件夹树     │ [L3] 文件列表（VXE Table）       │
│  TreeSelect   │                                 │
│  或 a-tree    │                                 │
│               │                                 │
└───────────────┴─────────────────────────────────┘
```

### 52.2 文件列表 VXE Table 列规范

| 列 | 宽度 | 内容 |
|----|------|------|
| checkbox | 40px | 批量勾选 |
| 文件名 | min-width | icon + 文件名（可点击预览）|
| 文件类型 | 80px | PDF / Excel / Image 等 |
| 文件大小 | 80px | 格式化：`1.2 MB` |
| 上传人 | 100px | 姓名 |
| 上传时间 | 150px | `YYYY-MM-DD HH:mm` |
| 操作 | 120px | 预览 / 下载 / 删除 |

```vue
<!-- 文件名列 -->
<vxe-column field="fileName" title="文件名" min-width="200">
  <template #default="{ row }">
    <div class="file-name-cell">
      <component :is="fileTypeIcon(row.fileType)" class="file-type-icon" />
      <span class="link-text" @click="previewFile(row)">{{ row.fileName }}</span>
    </div>
  </template>
</vxe-column>
```

```ts
const fileTypeIcon = (type: string) => ({
  pdf:   IconFilePdf,
  excel: IconFileExcel,
  word:  IconFile,
  image: IconImage,
}[type] ?? IconFile)

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`
  return `${(bytes/1024/1024).toFixed(1)} MB`
}
```

```css
.file-name-cell { display: flex; align-items: center; gap: 6px; }
.file-type-icon { font-size: 16px; flex-shrink: 0; }
```

### 52.3 文件预览规范

| 文件类型 | 预览方式 |
|---------|---------|
| PDF | 新标签页打开（`window.open(url, '_blank')`）或内嵌 `<iframe>` |
| 图片 | `a-image` 组件 preview 功能 |
| Excel / Word | 提供「下载后查看」按钮，不强制在线预览 |
| 视频 | `<video>` 标签 + 控件 |

### 52.4 文件大小与格式限制（统一规范）

```ts
export const FILE_LIMITS = {
  document: { maxSize: 50 * 1024 * 1024, types: ['pdf', 'doc', 'docx', 'xls', 'xlsx'] },
  image:    { maxSize: 10 * 1024 * 1024, types: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
  archive:  { maxSize: 100 * 1024 * 1024, types: ['zip', 'rar', '7z'] },
}
```

---

## 五十三、批量导入规范（Excel Import）

> 货代系统高频功能：批量导入订单、客户、航线、费率等。

### 53.1 批量导入标准流程（三步）

```
步骤 1：下载模板 → 步骤 2：上传填好的 Excel → 步骤 3：查看导入结果
```

### 53.2 导入入口

```vue
<!-- 工具栏「批量导入」按钮 -->
<a-button size="small" type="outline" @click="openImportModal">
  <template #icon><icon-import /></template>批量导入
</a-button>
```

### 53.3 导入弹窗（3 步）

```vue
<a-modal title="批量导入" width="560px" :visible="importVisible" :footer="false">
  <a-steps :current="importStep" size="small" style="margin-bottom:20px">
    <a-step title="下载模板" />
    <a-step title="上传文件" />
    <a-step title="导入结果" />
  </a-steps>

  <!-- Step 1 -->
  <template v-if="importStep === 1">
    <a-result status="info" title="请先下载模板" sub-title="按照模板格式填写后上传">
      <template #extra>
        <a-button type="primary" @click="downloadTemplate">
          <template #icon><icon-download /></template>下载导入模板
        </a-button>
        <a-button @click="importStep = 2">我已有模板，去上传</a-button>
      </template>
    </a-result>
  </template>

  <!-- Step 2 -->
  <template v-else-if="importStep === 2">
    <div class="uppy-list-zone" @click="openUppy">
      <icon-upload style="font-size:24px; color:var(--color-text-3)" />
      <p class="uppy-list-text">点击上传 Excel 文件</p>
      <p class="uppy-list-hint">仅支持 .xlsx / .xls，不超过 10MB</p>
    </div>
    <div v-if="importFile" class="uppy-file-row">
      <icon-file class="uppy-file-row__icon" />
      <span class="uppy-file-row__name">{{ importFile.name }}</span>
      <a-button type="primary" :loading="importing" @click="submitImport">开始导入</a-button>
    </div>
  </template>

  <!-- Step 3 -->
  <template v-else>
    <a-result
      :status="importResult.failCount === 0 ? 'success' : 'warning'"
      :title="`导入完成：成功 ${importResult.successCount} 条`"
      :sub-title="importResult.failCount > 0 ? `失败 ${importResult.failCount} 条，请下载错误明细` : ''"
    >
      <template #extra>
        <a-button v-if="importResult.failCount > 0" @click="downloadErrors">下载错误明细</a-button>
        <a-button type="primary" @click="closeImport">完成</a-button>
      </template>
    </a-result>
  </template>
</a-modal>
```

### 53.4 导入规范

| 规则 | 内容 |
|------|------|
| 模板格式 | Excel 第 1 行为表头，表头名称与字段说明同 template；必填列用红色标注 |
| 数据行上限 | 单次导入 **≤ 5000 行**，超出提示分批 |
| 错误明细 | 提供「下载错误明细」Excel，含原始数据 + 每行错误原因 |
| 重复数据 | 导入接口返回重复数据时，弹出「跳过重复 / 覆盖」二选一确认 |
| 进度展示 | 导入行数 > 500 时，接口改为异步，用 `a-progress` 展示进度 |

---

## 五十四、Progress 进度条规范

> 适用于：文件上传进度、批量导入进度、异步任务进度。

### 54.1 场景与组件选型

| 场景 | 组件 | 说明 |
|------|------|------|
| 文件上传单个文件 | `a-progress` size="mini" | 内联在文件行 |
| 批量操作异步进度 | `a-progress` 条形 | 弹窗或页面顶部 |
| 页面加载进度 | `a-progress` line，全宽 | 顶部薄条 |
| 步骤完成度 | `a-steps` | 见 §47 |

### 54.2 用法示例

```vue
<!-- 文件上传进度（内联，mini） -->
<a-progress :percent="file.progress" size="mini" style="width: 80px" :show-text="false" />

<!-- 批量任务进度（弹窗内，带文字） -->
<a-progress
  :percent="taskProgress"
  :status="taskProgress === 100 ? 'success' : 'normal'"
  :format-text="(p) => `${p}% (${doneCount}/${totalCount})`"
/>

<!-- 异步任务页面顶部进度条 -->
<div v-if="importing" class="page-progress-bar">
  <a-progress :percent="importProgress" :show-text="false" size="mini" status="normal" />
</div>
```

```css
.page-progress-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
  height: 3px;
}
.page-progress-bar .arco-progress-line { border-radius: 0; }
```

### 54.3 进度轮询规范

```ts
// 异步任务进度轮询（批量导入/导出）
const pollProgress = async (taskId: string) => {
  const timer = setInterval(async () => {
    const { progress, status, result } = await getTaskProgress(taskId)
    importProgress.value = progress
    if (status === 'done') {
      clearInterval(timer)
      importResult.value = result
      importStep.value = 3
    } else if (status === 'failed') {
      clearInterval(timer)
      Message.error('任务执行失败，请重试')
    }
  }, 1500)  // 1.5s 轮询一次
}
```

---

## 五十五、Collapse 折叠面板规范

> 适用于：详情抽屉分区折叠、高级筛选展开、权限模块分组。

### 55.1 何时用 Collapse vs 默认展开

```
信息量 ≤ 6 个字段    → 不折叠，直接显示
信息量 > 6 个字段且可分组 → 使用 Collapse
用户明确不常查看（如历史备注）→ 默认折叠
核心业务信息（基础信息/货物信息）→ 默认展开，允许折叠
```

### 55.2 详情抽屉内 Collapse

```vue
<a-collapse :default-active-keys="['basic', 'cargo']" :bordered="false">
  <a-collapse-item key="basic" header="基础信息">
    <div class="detail-form-grid--3">
      <!-- 字段 -->
    </div>
  </a-collapse-item>
  <a-collapse-item key="cargo" header="货物信息">
    <div class="detail-form-grid--4">
      <!-- 字段 -->
    </div>
  </a-collapse-item>
  <a-collapse-item key="remark" header="备注">
    <p class="detail-value">{{ detail.remark || '—' }}</p>
  </a-collapse-item>
</a-collapse>
```

```css
/* 详情抽屉内 Collapse 覆盖 */
.detail-drawer .arco-collapse-item {
  border-bottom: 1px solid var(--color-border-1) !important;
  border-top: none !important;
}
.detail-drawer .arco-collapse-item-header {
  padding: 8px 12px !important;
  font-size: var(--dense-font-title) !important;
  font-weight: 600 !important;
  color: var(--color-text-1) !important;
  background: var(--color-fill-1) !important;
}
.detail-drawer .arco-collapse-item-content { padding: 12px !important; }
```

### 55.3 与 DetailSection 的选择

| 方案 | 适用 |
|------|------|
| `DetailSection`（§17.3）| 超宽复杂详情抽屉，各区之间完全分离，无需折叠 |
| `a-collapse` | 标准宽度详情（400-600px），信息量大需要折叠收纳 |
| 二者混用 | DetailSection 内部的某些子区可以 Collapse，外层保持 DetailSection 框架 |

---

## 五十六、数据看板规范

> 覆盖运营看板、财务汇总、海外业务大屏等数据展示页。

### 56.1 看板页面布局

```
┌────────────────────────────────────────────────────┐
│ [L1] 页面标题 + 日期筛选 + 刷新                    │
├────────────────────────────────────────────────────┤
│ [KPI 统计行] 4-6 个核心指标卡片                    │
├─────────────────────┬──────────────────────────────┤
│ [图表区 1]          │ [图表区 2]                   │
│ 折线图/柱状图        │ 饼图/环形图                  │
│ 50%                 │ 50%                          │
├─────────────────────┴──────────────────────────────┤
│ [明细表格] 可选，展示明细数据                       │
└────────────────────────────────────────────────────┘
```

### 56.2 看板页 CSS 结构

```vue
<div class="dashboard-root">
  <!-- 顶部筛选行 -->
  <div class="dashboard-header zone-card">
    <span class="dashboard-title">运营看板</span>
    <div class="dashboard-filters">
      <a-radio-group v-model="period" type="button" size="small">
        <a-radio value="today">今天</a-radio>
        <a-radio value="week">本周</a-radio>
        <a-radio value="month">本月</a-radio>
        <a-radio value="quarter">本季度</a-radio>
      </a-radio-group>
      <a-range-picker v-if="period==='custom'" size="small" style="width:220px" />
      <a-button size="small" type="text" @click="refresh">
        <template #icon><icon-refresh /></template>
      </a-button>
    </div>
  </div>

  <!-- KPI 行 -->
  <div class="zone-kpi">
    <div class="kpi-card" v-for="kpi in kpiList" :key="kpi.key">
      <div class="kpi-label">{{ kpi.label }}</div>
      <div class="kpi-body">
        <span class="kpi-value" :class="kpi.colorClass">{{ kpi.value }}</span>
        <span class="kpi-unit">{{ kpi.unit }}</span>
      </div>
      <div class="kpi-footer">
        <span class="kpi-trend" :class="kpi.trend > 0 ? 'up' : 'down'">
          {{ kpi.trend > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}% 环比
        </span>
      </div>
    </div>
  </div>

  <!-- 图表区 -->
  <div class="dashboard-charts">
    <div class="zone-card dashboard-chart-card">
      <div class="chart-card-title">订单趋势</div>
      <div class="chart-wrap" ref="lineChartRef" />
    </div>
    <div class="zone-card dashboard-chart-card">
      <div class="chart-card-title">运输方式占比</div>
      <div class="chart-wrap" ref="pieChartRef" />
    </div>
  </div>
</div>
```

```css
.dashboard-root {
  display: flex; flex-direction: column;
  gap: var(--dense-gap-zone);
  padding: var(--dense-gap-zone);
  background: var(--color-bg-body);
  height: 100%; overflow-y: auto;
}
.dashboard-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
}
.dashboard-title { font-size: var(--dense-font-nav); font-weight: 600; color: var(--color-text-1); }
.dashboard-filters { display: flex; align-items: center; gap: 8px; }
.dashboard-charts {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--dense-gap-zone);
}
.dashboard-chart-card { padding: 14px 16px; }
.chart-card-title {
  font-size: var(--dense-font-title); font-weight: 600;
  color: var(--color-text-1); margin-bottom: 12px;
}
.chart-wrap { height: 260px; }
```

### 56.3 ECharts 主题 Token（与 §21 对齐）

```ts
// 统一色板
export const CHART_COLORS = [
  'var(--primary-6)',   // #165DFF
  'var(--success-6)',   // #00B42A
  'var(--warning-6)',   // #FF7D00
  'var(--danger-6)',    // #F53F3F
  'var(--purple-6)',    // #722ED1
  'var(--cyan-6)',      // #0FB6B6
  'var(--gold-6)',      // #D9A400
]

// 图表字体统一
export const CHART_TEXT_STYLE = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif',
  fontSize: 11,
  color: '#86909C',  // color-text-3
}
```

---

## 五十七、仓储模块规范

> 覆盖入库单、出库单、库存查询、货架管理等仓储场景。

### 57.1 仓储状态色

| 状态 | `data-s` | 语义 |
|------|----------|------|
| 待入库 | `wait` | 已创建，等待入库 |
| 在库 | `acc` | 已存入仓库 |
| 部分出库 | `partial` | 部分货物已出库 |
| 已出库 | `rel` | 全部出库 |
| 异常 | `rej` | 破损/丢失/差异 |
| 草稿 | `draft` | 未确认单据 |

### 57.2 库存数量展示规范

```vue
<!-- 库存数量列：超阈值预警 -->
<vxe-column field="stock" title="库存数量" width="100" align="right">
  <template #default="{ row }">
    <span class="num-val" :class="stockClass(row.stock, row.minStock)">
      {{ row.stock.toLocaleString() }}
      <span class="stock-unit">{{ row.unit }}</span>
    </span>
  </template>
</vxe-column>
```

```ts
const stockClass = (stock: number, minStock: number) => {
  if (stock === 0) return 'stock--empty'
  if (stock <= minStock) return 'stock--low'
  return ''
}
```

```css
.stock--empty { color: var(--danger-6) !important; font-weight: 600; }
.stock--low   { color: var(--warning-6) !important; }
.stock-unit   { font-size: var(--dense-font-micro); color: var(--color-text-3); margin-left: 2px; }
```

### 57.3 货架位置展示

```vue
<!-- 货架位置：区域-货架-层-列 -->
<span class="warehouse-loc mono">
  {{ row.area }}-{{ row.shelf }}-{{ row.level }}-{{ row.position }}
</span>
```

```css
.warehouse-loc {
  font-family: var(--mono);
  font-size: var(--dense-font-data);
  color: var(--color-text-1);
  background: var(--color-fill-2);
  padding: 1px 5px; border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
}
```

### 57.4 出入库单差异核对

差异数量 > 0 时，用红色 + 感叹号图标标注：

```vue
<span v-if="row.diff !== 0" class="diff-badge">
  <icon-exclamation-circle-fill />
  差异 {{ row.diff > 0 ? '+' : '' }}{{ row.diff }}
</span>
```

```css
.diff-badge {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: var(--dense-font-aux); font-weight: 600;
  color: var(--danger-6);
}
```

---

## 五十八、权限树规范（补充 §28）

> §28 已覆盖按钮级/页面级/字段级权限逻辑，本章补充权限管理 UI（角色管理、权限分配）的实现规范。

### 58.1 权限管理页面布局

```
┌──────────────┬─────────────────────────────────┐
│  角色列表     │  角色详情                        │
│  VXE Table  │  ┌─── 基础信息 ────────────────┐  │
│             │  │ 角色名称 / 描述 / 状态        │  │
│  [新建角色]  │  └──────────────────────────── ┘  │
│             │  ┌─── 菜单权限 ────────────────┐  │
│             │  │ TreeSelect（多选 + 联动）     │  │
│             │  └──────────────────────────── ┘  │
│             │  ┌─── 数据权限 ────────────────┐  │
│             │  │ 本人/本部门/全公司 Radio       │  │
│             │  └──────────────────────────── ┘  │
│             │  [保存]  [取消]                   │
└──────────────┴─────────────────────────────────┘
```

### 58.2 菜单权限树实现

```vue
<a-tree-select
  v-model="roleMenus"
  :data="menuPermTree"
  multiple
  checkable
  :check-strictly="false"    <!-- 父子联动 -->
  :default-expand-level="2"
  :field-names="{ key: 'permCode', title: 'permName', children: 'children' }"
  placeholder="请选择菜单权限"
  size="small"
  style="width: 100%"
/>
```

### 58.3 操作日志列表规范

```
操作日志页面 = 标准列表页，禁止新建/编辑，只有查询和导出。
```

| 列 | 内容 |
|----|------|
| 操作时间 | `YYYY-MM-DD HH:mm:ss`，mono 等宽 |
| 操作人 | 姓名 + 工号（双行 cell-two-line）|
| 操作模块 | 如「订单管理」「财务管理」|
| 操作类型 | 创建/修改/删除/审批/导出（用 a-tag 色块区分）|
| 操作内容 | 简短描述，超长 tooltip 展开 |
| 操作 IP | mono 等宽 |

---

## 五十九、国际化与时区规范

> 覆盖海外业务场景：多语言切换、时区展示、多币种、国际日期格式。

### 59.1 语言切换

```vue
<!-- App 顶部工具栏 -->
<a-dropdown>
  <a-button type="text" size="small">
    <template #icon><icon-language /></template>
    {{ currentLocale === 'zh-CN' ? '中文' : 'English' }}
  </a-button>
  <template #content>
    <a-doption @click="switchLocale('zh-CN')">中文（简体）</a-doption>
    <a-doption @click="switchLocale('en-US')">English</a-doption>
  </template>
</a-dropdown>
```

```ts
// i18n 配置（vue-i18n）
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  locale: localStorage.getItem('locale') ?? 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: { 'zh-CN': zhCN, 'en-US': enUS },
})
```

### 59.2 时区展示规范

```ts
// utils/datetime.ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

// 显示本地时间（带时区标识）
export const fmtLocalTime = (utcStr: string, tz?: string) => {
  const targetTz = tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  return dayjs.utc(utcStr).tz(targetTz).format('YYYY-MM-DD HH:mm')
}

// 显示多时区对比（海外业务）
export const fmtMultiTz = (utcStr: string) => ({
  beijing: dayjs.utc(utcStr).tz('Asia/Shanghai').format('MM/DD HH:mm'),
  local:   dayjs.utc(utcStr).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('MM/DD HH:mm'),
})
```

```vue
<!-- 时区标识展示 -->
<div class="cell-two-line">
  <span class="c2-main mono">{{ fmtLocalTime(row.etd) }}</span>
  <span class="c2-sub">{{ row.departureTimezone ?? 'UTC+8' }}</span>
</div>
```

### 59.3 国际化数字/货币规范

```ts
// 根据 locale 格式化数字
export const fmtIntlNumber = (v: number, locale = 'zh-CN') =>
  new Intl.NumberFormat(locale).format(v)

// 根据 locale 格式化货币
export const fmtIntlCurrency = (v: number, currency: string, locale = 'zh-CN') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(v)
// 示例：fmtIntlCurrency(1234.56, 'USD', 'en-US') → '$1,234.56'
```

### 59.4 港口/国家代码展示

```vue
<!-- 港口：代码（上）+ 中文名（下）-->
<div class="cell-two-line">
  <span class="c2-main mono">{{ row.portCode }}</span>
  <span class="c2-sub">{{ row.portName }}</span>
</div>

<!-- 国家旗帜（emoji）+ 国家代码 -->
<span class="country-cell">
  <span class="country-flag">{{ countryFlag(row.countryCode) }}</span>
  <span class="mono">{{ row.countryCode }}</span>
</span>
```

```ts
// 国家代码 → emoji flag
const countryFlag = (code: string) =>
  code.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
// 'CN' → '🇨🇳'
```

```css
.country-cell { display: inline-flex; align-items: center; gap: 5px; font-size: var(--dense-font-data); }
.country-flag { font-size: 14px; line-height: 1; }
```

---
