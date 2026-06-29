# Icon System

## 图标体系

本项目使用**双图标库**：

| 图标库 | 包名 | 用途 |
|--------|------|------|
| Arco Design Icons | 随 `@arco-design/web-vue` 全局注册 | 通用操作图标：增删改查、刷新、设置、下载、上传 |
| IconPark | `@icon-park/vue-next` | 业务语义图标：货代场景、模块标识、状态标记 |

---

## 使用原则（PESDP）

图标的唯一职责是**降低识别成本**，不是装饰。

```
有精确隐喻 → 用图标
无精确隐喻 → 纯文字，禁止配凑图标
```

判断标准：**操作员闭眼能联想到这个图标代表什么业务含义** → 可用；否则 → 禁止。

---

## 引入方式

### 引入方式（按需引入，无全局注册函数）

CSS 在 `main.ts` 全局引入一次：

```ts
// main.ts
import '@icon-park/vue-next/styles/index.css'
```

组件在每个 `.vue` 文件内按需引入：

```vue
<script setup lang="ts">
import { Ship, ContainerFour, FileText, Stamp, Cube } from '@icon-park/vue-next'
</script>
```

### 默认参数规范

| 属性 | 值 | 说明 |
|------|----|------|
| `theme` | `outline` | 线框风格，与 Arco 内置图标统一 |
| `size` | `14` | 与 Arco small 尺寸按钮行内对齐 |
| `stroke-width` | `2.5` | 高密度界面下线条清晰 |
| `fill` | 继承 `currentColor` | 随父级颜色，不单独设色 |

---

## 场景规范

### 1. 按钮图标

#### 1.1 工具栏工具类按钮（icon-only）

使用 **Arco 内置图标**，不用 IconPark。

```vue
<!-- 刷新 -->
<a-button size="small" type="text">
  <template #icon><icon-refresh /></template>
</a-button>

<!-- 列设置 -->
<a-button size="small" type="text">
  <template #icon><icon-settings /></template>
</a-button>
```

规则：
- 只用 Arco 图标（`icon-refresh`、`icon-settings`、`icon-fullscreen`、`icon-filter`）
- 必须加 `a-tooltip` 说明功能
- 禁止 IconPark 图标用于纯工具栏工具（两个库的图标不能混排在同一 icon-only 组）

#### 1.2 主操作按钮（icon + 文字）

使用 **Arco 内置图标**，选择有通用隐喻的图标。

```vue
<!-- 新建 -->
<a-button size="small" type="primary">
  <template #icon><icon-plus /></template>新建业务单
</a-button>

<!-- 上传 -->
<a-button size="small" type="outline">
  <template #icon><icon-upload /></template>上传附件
</a-button>
```

规则：
- `新建 / 添加` → `<icon-plus />`
- `上传` → `<icon-upload />`
- `下载` → `<icon-download />`
- `打印` → `<icon-printer />`
- `搜索/查询` → `<icon-search />`
- **业务动词（订舱/放舱/流转/提单）→ 纯文字，禁止强配图标**

#### 1.3 行内操作图标（icon-only + tooltip）

使用 **Arco 内置图标**。

```vue
<!-- 列表主表：见 table.md Row Actions 矩阵；删除进 ···，不直出 icon -->
<div class="row-actions">
  <a-tooltip content="查看详情">
    <a-button size="small" type="text" class="row-action-btn row-action-btn--primary">
      <template #icon><icon-eye /></template>
    </a-button>
  </a-tooltip>
  <a-dropdown trigger="click" content-class="action-menu action-menu--row">
    <a-button size="small" type="text" class="row-action-btn row-action-btn--more" title="更多操作">
      <template #icon><icon-more /></template>
    </a-button>
    <template #content>
      <a-doption>编辑</a-doption>
      <a-divider class="action-menu__divider" />
      <a-popconfirm content="确认删除？">
        <a-doption class="danger-opt">删除</a-doption>
      </a-popconfirm>
    </template>
  </a-dropdown>
</div>
```

规则：
- 1–N 分档 → [`table.md`](table.md) Row Actions
- 主操作 → `row-action-btn--primary`（eye / edit）
- 更多 → `row-action-btn--more`（`<icon-more />`）
- 列表删除用菜单项 `danger-opt`，不用直出 `<icon-delete />`；仅 `detail-mini-vxe--editable` 可直出 danger icon
- **行内禁止文字按钮**，必须 icon-only + tooltip

---

### 2. 模块标题图标（IconPark 核心场景）

`detail-section__title` 左侧配业务语义图标，用于快速识别模块。图标放在标题文字**左侧**，不替代标题。

```vue
<div class="detail-section__title">
  <ship theme="outline" size="14" class="section-icon" />
  航线订舱
</div>
```

```css
/* global.css 已有 detail-section__title，补充 icon 对齐 */
.detail-section__title .section-icon {
  flex-shrink: 0;
  color: var(--dense-primary-6);
  opacity: 0.75;
}
```

#### 货代模块图标映射表

| 模块名 | IconPark 组件 | 备注 |
|--------|--------------|------|
| 客户委托 | `<Peoples />` | 委托人/客户关系 |
| 航线订舱 | `<Ship />` | 船运核心 |
| 货物信息 | `<Cube />` | 货物/箱体 |
| 箱型柜量 | `<ContainerFour />` | 集装箱 |
| 收发通关 | `<Stamp />` | 报关/清关 |
| 费用预估 | `<CalculatorOne />` | 费用计算 |
| 单证资料 | `<FileText />` | 文件单证 |
| 业务跟进 | `<MessageEmoji />` | 跟进沟通 |
| 费用明细 | `<Currency />` | 金额相关 |
| 仓库库存 | `<Warehouse />` | 仓储 |
| 卡车/陆运 | `<TruckOne />` | 地面运输 |
| 附件上传 | `<Paperclip />` | 附件 |
| 时间轴 | `<Timeline />` | 操作历史 |
| 审批记录 | `<CheckCorrect />` | 审批流 |

规则：
- 图标颜色：`color: var(--dense-primary-6); opacity: 0.75` — 有色但不抢眼
- 图标尺寸：`size="14"` — 与标题字号对齐
- 禁止在模块标题用 filled/two-tone 风格（与 Arco outline 图标不统一）
- 禁止给每个 `detail-section` 都加图标（只给**一级大模块**加，子面板标题不加）

---

### 3. 统计数字场景

统计芯片（`detail-data-stats__item`）内**不加图标**，数字本身即信息，图标是冗余。

```vue
<!-- ✓ 正确 -->
<div class="detail-data-stats__item">
  <span class="detail-data-stats__label">总量</span>
  <span class="detail-data-stats__val">{{ cargoTotal }}</span>
  <span class="detail-data-stats__unit">件</span>
</div>

<!-- ✗ 禁止：图标 + 数字冗余，密度下视觉噪音 -->
<div class="detail-data-stats__item">
  <cube size="12" />
  <span class="detail-data-stats__label">总量</span>
  <span class="detail-data-stats__val">{{ cargoTotal }}</span>
</div>
```

**例外**：`detail-module-summary--bar` 独立汇总条（非 head 内嵌）可在每项前加 14px outline 图标作分类标识，但每项图标必须不同（不能全部用同一个图标）。

---

### 4. 状态徽标（s-pill）

`s-pill[data-s]` 内**禁止加图标**，颜色语义已足够。

**唯一例外**：风险/异常状态 pill 可加告警图标，且只用 `<attention-fill />` 或 `<close-one />` 两种。

```vue
<!-- ✓ 风险属性可加图标 -->
<span class="s-pill" data-s="warn">
  <attention-fill size="11" />危险品
</span>

<!-- ✗ 禁止：正常状态加图标 -->
<span class="s-pill" data-s="acc">
  <check-one size="11" />已放舱
</span>
```

---

### 5. 下拉菜单选项

默认**不加图标**。下拉选项是文字列表，图标增加视觉噪音。

唯一允许加图标的条件：**整个 menu 的每个选项都有精确无歧义图标**（实际上货代下拉菜单极少满足此条件）。

```vue
<!-- ✓ 正确：纯文字选项 -->
<template #content>
  <a-doption @click="handleExportExcel">导出 Excel</a-doption>
  <a-doption @click="handleExportPdf">导出 PDF</a-doption>
  <a-divider class="action-menu__divider" />
  <a-doption class="danger-opt">批量废弃</a-doption>
</template>

<!-- ✗ 禁止：部分选项有图标、部分没有 -->
<template #content>
  <a-doption><icon-download />导出 Excel</a-doption>
  <a-doption>导出 PDF</a-doption>
</template>
```

---

### 6. 空状态插图

用 IconPark 大图标（`size="48"`，`theme="outline"`，`color="var(--color-text-4)"`）配合提示文案，替代纯文字空状态。

```vue
<!-- 列表空状态 -->
<div class="empty-state">
  <file-search-one theme="outline" :size="48" :stroke-width="1.5" color="var(--color-text-4)" />
  <p class="empty-state__text">暂无符合条件的数据</p>
  <a-button size="small" type="text" @click="handleReset">清空筛选</a-button>
</div>

<!-- 子表空状态 -->
<div class="empty-state empty-state--mini">
  <cube theme="outline" :size="32" :stroke-width="1.5" color="var(--color-text-4)" />
  <p class="empty-state__text">暂无货物明细</p>
</div>
```

规则：
- 列表空状态：`size="48"`，`stroke-width="1.5"`（轻量感）
- 子表/模块内空状态：`size="32"`
- 颜色固定用 `color-text-4`，禁止用主色
- 图标须与业务对象语义相关（货物模块空状态用 Cube，不用通用 inbox）

---

### 7. 导航菜单

侧边栏导航菜单图标用 **IconPark `outline` 风格**，`size="16"`，统一颜色由 Arco 菜单主题控制（不单独设色）。

```vue
<a-menu-item key="sale-order">
  <template #icon><file-text theme="outline" :size="16" /></template>
  销售订单
</a-menu-item>
```

---

## 禁止清单

```
✗ 两个库的 icon-only 按钮在同一操作组内混用（视觉风格不一致）
✗ 业务动词按钮强配无隐喻图标（订舱/放舱/流转不加图标）
✗ 统计芯片 detail-data-stats__item 内加图标
✗ 正常状态 s-pill 内加图标
✗ 下拉菜单部分项有图标、部分没有（不统一）
✗ 模块子面板标题加图标（只有一级 detail-section 加）
✗ filled / two-tone 主题图标混入 outline 图标按钮组
✗ 给图标单独设色（覆盖 currentColor），应继承父级颜色
✗ icon size 大于 16px 用于按钮内（超出 dense 行高）
```

---

## 快速决策树

```
需要图标？
├── 操作类
│   ├── 通用工具（刷新/设置/下载/上传/删除/查看）→ Arco 内置
│   ├── 业务动词（订舱/放舱/流转/审核）→ 纯文字，不加图标
│   └── 新建/添加 → Arco <icon-plus />
├── 模块标题
│   ├── 一级 detail-section → IconPark outline 14px，查映射表
│   └── 子面板/子表标题 → 不加图标
├── 状态
│   ├── 普通状态 pill → 不加图标
│   └── 风险/异常 pill → IconPark attention-fill / close-one
├── 统计数字
│   └── 不加图标
├── 空状态
│   └── IconPark outline，size 32~48，color-text-4
└── 导航菜单
    └── IconPark outline size 16
```

---

## 与现有规范的关系

| 规范文件 | 关联点 |
|----------|--------|
| `actions.md` | 按钮内图标的选用依据本文 §1；内容形式规则不变 |
| `detail-form.md` | 模块标题图标按本文 §2 添加；section 结构不变 |
| `table.md` | 行内操作图标按本文 §1.3；row-action-btn 不变 |
| `visual-system.md` | 图标颜色使用 dense-primary-6 / color-text-4，符合单锚点原则 |
