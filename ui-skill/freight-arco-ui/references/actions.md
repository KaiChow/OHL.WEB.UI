# Actions And Buttons

Arco `a-button` has **5 types** and **4 statuses**. Status can combine with any type.

```vue
<a-button type="primary" status="danger">...</a-button>
```

All operational pages use `size="small"` unless a documented hero/empty-state exception exists. Full mapping: `references/component-size.md`.

**Never omit `size` on form controls** — Arco defaults to `medium` (14px). **Never use `size="medium"` or `size="large"`** in `src/views`.

---

## 1. Button Types (Arco)

| Type | Arco 写法 | 视觉 | 项目语义 |
|------|-----------|------|----------|
| **primary** | `type="primary"` | 实心主色 | 当前作用域内**唯一**的主正向操作 |
| **secondary** | 不写 `type`（默认） | 灰底/中性填充 | 次要正向：导出、取消、关闭、存草稿 |
| **dashed** | `type="dashed"` | 虚线边框 | 「继续添加 / 上传 / 占位引导」类扩容量操作 |
| **outline** | `type="outline"` | 线框主色 | 需要比 secondary 更显眼、但又不是主操作的流程/模块操作 |
| **text** | `type="text"` | 无边框文字/图标 | 工具、降权辅助、行内 icon、重置/刷新 |

### Type Selection Rules

```
primary   → 每作用域最多 1 个：查询、新建、保存、提交、弹窗确定
secondary → 中性次要：导出、取消、关闭、存草稿、批量（非主流程）
outline   → 模块/流程次要：订舱、放舱、打印、发送、模块内「添加发货人」
dashed    → 空状态/表格内「添加一行」「继续上传」；禁止做全局提交
text      → 重置、刷新、列设置、复制、清除；行内 icon 操作
```

**层级口诀（PESDP）**：`primary` 定锚点 → `outline` / `secondary` 承业务 → `text` 承工具 → `dashed` 承扩容。

---

## 2. Button Status (Arco)

| Status | Arco 写法 | 语义 | 项目用法 |
|--------|-----------|------|----------|
| **normal** | 默认 | 常规 | 绝大多数按钮 |
| **success** | `status="success"` | 成功态 | **极少用于按钮**；结果用 `Message.success`，状态用 `s-pill[data-s="rel\|acc"]` |
| **warning** | `status="warning"` | 警告态 | **禁止**用于工具栏/详情吸底；业务警示用 `s-pill` / 文案，不用高饱和 warning 按钮 |
| **danger** | `status="danger"` | 危险态 | 删除、废弃、撤销；必须配确认 |

### Status × Type Matrix（本项目允许组合）

| 场景 | 推荐组合 | 确认方式 |
|------|----------|----------|
| 全局提交 | `primary` + normal | — |
| 导出/取消 | `secondary` 或 `outline` + normal | — |
| 模块添加 | `outline` + normal | — |
| 空状态添加行 | `dashed` + normal | — |
| 重置/刷新/复制 | `text` + normal | — |
| 行内删除 | `text` + `danger` + `row-action-btn` | `a-popconfirm` |
| 吸底废弃 | `text` + `danger` | `Modal.confirm` |
| 弹窗确定删除 | `primary` + `danger`（仅 confirm 弹窗内） | 已在 Modal 中 |
| 下拉危险项 | — | `a-doption class="danger-opt"` + 二次确认 |

### Forbidden Combinations

```
❌ primary + warning          — 主操作不应呈警告色
❌ outline + warning 做订舱/放舱 — 用 outline + normal；警示信息放 pill/文案
❌ status="warning" 在列表 toolbar / 详情 footer — 用 normal + 业务文案
❌ status="success" 做常驻操作按钮 — 用 Message / s-pill
❌ danger + primary 暴露在列表行/工具栏 — 危险进下拉或 text+danger+确认
❌ 同一作用域多个 primary
❌ btn-muted-warn 等自写警示类 — 已废弃，用 outline + normal
❌ 用颜色区分同作用域工具栏按钮 — 颜色在系统里承载状态语义（成功/警告/危险），
   把工作流按钮涂色会与 s-pill 状态系统冲突，产生「完成了？还是有问题？」的歧义
```

### Toolbar Visual Differentiation（不用颜色的区分机制）

工具栏多个同类按钮的区分依靠三层机制，不依靠 status 颜色：

**第一层 — Type 决定重要性**

| 层级 | 场景 | Type |
|------|------|------|
| 核心正向操作 | 选择销账、新建、提交 | `primary` × 1 |
| 高频工作流 | 导出、对中、账单下载等 daily 操作 | `outline` |
| 中低频辅助 | 账单修改、刷新日期等 occasional 操作 | `text` |

**第二层 — Divider 决定功能归属**

同 type 的按钮按功能语义分组，组间插入 `toolbar-divider`（竖线分隔）：

```vue
<div class="toolbar-group">
  <!-- 核销主操作 -->
  <a-button size="small" type="primary" @click="handleWriteOff">选择销账</a-button>

  <div class="toolbar-divider" />

  <!-- 输出组：导出 + 下载 -->
  <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
    <a-button size="small" type="outline">导出<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
    <a-button size="small" type="outline">账单下载<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>

  <div class="toolbar-divider" />

  <!-- 对账组：对中 + 导入 -->
  <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
    <a-button size="small" type="outline">对中<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
    <a-button size="small" type="outline">上对比导入<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>

  <div class="toolbar-divider" />

  <!-- 维护组：降权为 text -->
  <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
    <a-button size="small" type="text">账单修改<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-button size="small" type="text" @click="handleRefreshDueDate">刷新DueDate</a-button>
</div>
```

**第三层 — Icon 提供形状识别**

为 outline/text 操作按钮加精确图标（下载用 `icon-download`，上传用 `icon-upload`，同步用 `icon-refresh`，编辑用 `icon-edit`），让操作员通过图标形状而非颜色快速定位。无精确图标时宁可不加，禁止用模糊图标制造视觉噪声。

**记忆口诀**

> Type 分级别 → Divider 分功能 → Icon 给形状 → 颜色只给锚点和危险

---

## 3. Scope Model（作用域）

按钮层级由**作用域**决定，不是由页面决定。

| 作用域 | 允许 primary | outline | secondary | dashed | text |
|--------|-------------|---------|-----------|--------|------|
| 筛选区 | 查询 ×1 | — | — | — | 重置 |
| 列表 toolbar | 新建 ×1 | 导出、批量 | 导出（可与 outline 二选一） | — | 刷新、列设置 |
| 详情页头 | — | — | 并单/归档/更多 | — | 关闭 |
| 详情模块头 | — | 模块主操作（添加） | — | — | 复制、清除 |
| 子表/子面板头 | — | 添加品名、添加行 | — | 空状态「添加」 | — |
| 表格行内 | 行编辑保存 ×1 | — | 行编辑取消 | — | 查看/编辑/删除 icon |
| 详情吸底 | 保存 ×1 | — | 订舱、放舱、输出 | — | 废弃 danger |
| 弹窗 footer | 确定 ×1 | — | 取消 | — | 删除 danger（左侧） |

**同一作用域内**：primary ≤ 1；直接可见业务按钮 ≤ 3（超出收入 dropdown）。

---

## 4. Button Content Form

Button content is decided by action scope and recognition cost, not by decoration.

| Content form | Use when | Required pattern | Forbidden |
|--------------|----------|------------------|-----------|
| Icon-only | row actions, toolbar utilities, compact fixed-width tools | Arco/lucide icon + tooltip/accessible label; `type="text"` except documented row dock variants | icon-only for module add/save/submit or business workflow verbs |
| Icon + text | primary creation, additive module actions, upload/import/export/download/print when the icon has a universal metaphor | icon first, text second, `size="small"`; trailing down icon only for dropdown trigger | forcing icons on every workflow action |
| Text-only | business workflow verbs, footer workflow, drawer head actions, modal footer, dropdown options | concise object/action text; stable button type by scope | adding vague icons when no precise metaphor exists |
| Text + trailing chevron | dropdown trigger such as `更多`, `导出`, `输出`, `流转` | text + `<icon-down />`; use `content-class="action-menu ..."` | standalone chevron without text except row `···` menu |

### Content Decision Rules

- Row operation column: icon-only + tooltip. It is a repeated dense column; text buttons make the table noisy and wide.
- Toolbar utility actions: icon-only when the command is a familiar utility (`刷新`, `列设置`, `密度`, `全屏`). Add tooltip. Do not use framed outline buttons for utilities.
- Primary creation: icon + text when the action adds a new object (`新建`, `添加`, `上传`). Use plus/upload icon only when the metaphor is exact.
- Module/child add actions: icon + text is preferred for `添加...` because it improves scanning in module heads. Keep at most one outline add action per module head.
- Business workflow actions: text-only unless the icon is universally precise. Examples: `查船期`, `申请舱位`, `同步报价`, `提交审核`, `转操作接单`, `放舱`. These should not get decorative icons.
- Footer workflow actions: text-only secondary buttons inside `detail-drawer-footer__cluster`; only dropdown triggers get trailing chevron.
- Dropdown options: text-only by default. Do not add icons per option. Use an option icon only when it is a strong system metaphor and the whole menu stays visually even.
- Danger actions: row danger is icon-only + tooltip + confirm; footer/header danger is text-only `text + danger` with confirm; dropdown danger is text-only `danger-opt` in final group.
- If an action has no precise icon, use text-only. Ambiguous icons increase recognition cost in an 8-hour operational system.

### Content Form By Scope

| Scope | Default content form | Examples |
|-------|----------------------|----------|
| Filter | Text-only primary/query, text-only reset/filter entry | `查询`, `重置`, `筛选` |
| Toolbar primary create | Icon + text | `+ 新建业务单` |
| Toolbar direct business action | Text-only or icon + text if universal | `打印业务单`, `导出` |
| Toolbar utility | Icon-only + tooltip | refresh, column settings |
| Detail head | Text-only secondary | `复制委托`, `打印托书`, `关闭` |
| Detail module head | Icon + text for add; text-only for workflow; text for auxiliary | `+ 添加货物`, `同步报价`, `客户档案` |
| Child/table local add | Icon + text; dashed only in empty state | `+ 添加箱型` |
| Detail footer | Text-only secondary + one primary | `保存草稿`, `提交审核` |
| Row action | Icon-only + tooltip | view/edit/delete/more |
| Dropdown option | Text-only | `批量关单`, `一键下载`, `批量废弃` |

---

## 5. Scene Recipes

### 5.1 列表页筛选

```vue
<a-button size="small" type="primary" @click="handleSearch">查询</a-button>
<a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
```

- 查询 = `primary`
- 重置 = `text`（禁止 `outline`）

### 5.2 列表页工具栏

**收纳决策：按「频率 × 风险」分类，不按个数限制。**

旧规则「≤ 3 个可见按钮」针对的反模式是：大量等权重无分组按钮堆叠、主操作失焦。它不适用于货代 SaaS 的高密度工作台——操作员全天使用同一工具栏，隐藏高频操作会造成大量额外点击。真正的设计目标是：层次清晰、危险隔离、视觉有锚点，而不是限制个数。

#### 分类决策表

在实现工具栏前，先对每个操作做以下三问：

| 问题 | 高 → 可见 | 低/危 → 隐藏或隔离 |
|------|----------|--------------------|
| **频率**：操作员每天是否会用到？ | 是 → 放左侧工作流区，`outline` | 否 → 收入右侧 `···` 菜单 |
| **风险**：操作是否不可逆/批量破坏？ | 否 → 正常显示 | 是 → 强制放右侧 `···` + 二次确认，无论频率高低 |
| **空间**：工具栏是否还有余量？ | 是 → 展示 | 否 → 按频率从后往前收入 `···` |

#### 结构模型

```
左侧 toolbar-group（工作流区）
  [主操作 primary] [高频操作A outline↓] [高频操作B outline↓] [高频操作C outline] ...

右侧 toolbar-aside（页面/表格工具 + 危险隔离）
  [已选N条]  [刷新 icon]  [列设置 icon]  [··· 低频/危险操作]

表格 table-card-cap（可选：表格上下文 + 分页）
  [非重复上下文]  [分页]  [列设置 icon]  [密度 icon]
```

关键规则：
- `primary` 锚点 ×1，是当前页面最核心的正向操作。
- 工作流区只放**高频**（每天使用）+ **低风险**操作，类型统一为 `outline`。个数无硬限，以工具栏不折行为限（通常 1280px 下不超过 6–7 个 outline 按钮）。
- **dropdown 按钮（带 ↓）是一个操作组，不是多个按钮**。`导出↓` 内含 Excel/PDF 两个子选项，视觉权重等同一个按钮，不应计入「按钮数量」。
- 右侧 `···` 专门盛放：页面级低频操作 + 所有不可逆/破坏性操作（无论频率）。
- 页面级刷新 = `text` icon-only，放 `toolbar-aside`，禁止 `outline`。
- 列设置、密度调整、表格全屏等表格工具可以放 `toolbar-aside`；当页面启用 `table-card-cap` 且 cap 内有分页或非重复上下文时，也可以放在 cap 分页旁边。
- 禁止为了放列设置单独生成一条空 `table-card-cap`；这会在 toolbar 和表头之间制造无效双层横条。
- 已选 N 条反馈放 `toolbar-aside` 左侧，`v-if="selectedRows.length"`。

#### 代码结构

```vue
<div class="toolbar">
  <div class="toolbar-group">
    <!-- primary ×1：最核心正向操作 -->
    <a-button size="small" type="primary">
      <template #icon><icon-plus /></template>新建
    </a-button>

    <!-- 高频低风险操作：全部用 outline，dropdown 内含子操作 -->
    <a-button size="small" type="outline" @click="handlePrint">打印</a-button>

    <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
      <a-button size="small" type="outline">导出<icon-down /></a-button>
      <template #content>
        <a-doption>导出 Excel</a-doption>
        <a-doption>导出 PDF</a-doption>
      </template>
    </a-dropdown>

    <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
      <a-button size="small" type="outline">账单修改<icon-down /></a-button>
      <template #content>
        <a-doption>修改金额</a-doption>
        <a-doption>修改币种</a-doption>
      </template>
    </a-dropdown>
  </div>

  <div class="toolbar-aside">
    <span v-if="selectedRows.length" class="toolbar-selected-tip">已选 {{ selectedRows.length }} 条</span>

    <!-- 页面级工具：icon-only + tooltip -->
    <a-tooltip content="刷新">
      <a-button size="small" type="text" @click="fetchList">
        <template #icon><icon-refresh /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip content="列设置">
      <a-button size="small" type="text" @click="xTable?.openCustom()">
        <template #icon><icon-settings /></template>
      </a-button>
    </a-tooltip>

    <!-- 危险/低频操作：物理隔离到最右端 ··· -->
    <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
      <a-tooltip content="更多操作">
        <a-button size="small" type="text"><icon-more /></a-button>
      </a-tooltip>
      <template #content>
        <a-doption>低频操作A</a-doption>
        <a-divider class="action-menu__divider" />
        <a-doption class="danger-opt" @click="handleDanger">批量废弃</a-doption>
      </template>
    </a-dropdown>
  </div>
</div>
```

当列表启用 `table-card-cap` 承载分页或非重复表格上下文时，表格级工具也可以放在 cap 内，与分页同属表格控制面：

```vue
<div class="table-card-cap">
  <div class="table-card-cap__right">
    <a-pagination ... />
    <a-tooltip content="列设置">
      <a-button size="small" type="text" class="table-card-cap__tool" @click="xTable?.openCustom()">
        <template #icon><icon-settings /></template>
      </a-button>
    </a-tooltip>
  </div>
</div>
```

规则补充：
- 危险操作只放 `toolbar-aside` 右端 `···` 菜单，禁止出现在左侧 `toolbar-group`。
- 危险项必须是菜单末尾，用 `action-menu__divider` 与其他选项分隔，并触发 `Modal.confirm`。
- 页面级刷新 = `text` icon-only + `toolbar-aside`（禁止 `outline`）。
- 表格级列设置/密度/全屏 = `text` icon-only。默认跟随 `toolbar-aside`；只有已有 `table-card-cap` 承载分页/上下文时，才使用 `table-card-cap__tool` 与分页相邻。
- 无新建时不写 `primary`，改从 `outline` 开始。

### 5.3 详情页头

```vue
<a-button size="small">并单</a-button>
<a-button size="small">归档</a-button>
<a-dropdown>
  <a-button size="small">更多 <icon-down /></a-button>
</a-dropdown>
```

- 页头禁止 `primary`
- 页头用 **secondary**（默认），不用 `outline`（与模块线框操作拉开层级）

### 5.4 详情模块头

```vue
<div class="detail-section__actions">
  <!-- 高频模块主操作 -->
  <a-button size="small" type="outline" @click="addParty">
    <template #icon><icon-plus /></template>添加发货人
  </a-button>
  <!-- 低频辅助：用 text 降权，不用 outline -->
  <a-button size="small" type="text" @click="copyData">
    <template #icon><icon-copy /></template>复制分单数据
  </a-button>
</div>
```

- 每个模块头：**最多 1 个 `outline`**（模块主操作）
- 复制 / 清除 / 三方仓数据 = `text`
- 超过 2 个操作 → 第三个起收入 `outline` 下拉「更多」

### 5.5 子表面板（品名明细等）

```vue
<!-- 有数据时 -->
<a-button size="small" type="outline" @click="addLine">
  <template #icon><icon-plus /></template>添加品名
</a-button>

<!-- 空状态时可用 dashed 强化「可添加」 -->
<a-button size="small" type="dashed" long @click="addLine">
  <template #icon><icon-plus /></template>添加品名
</a-button>
```

### 5.6 详情吸底

```vue
<div class="detail-drawer-footer">
  <div class="detail-drawer-footer__start">
    <a-button size="small" type="text" status="danger" @click="confirmAbandon">废弃</a-button>
  </div>
  <div class="detail-drawer-footer__end">
    <div class="detail-drawer-footer__cluster">
      <a-dropdown>
        <a-button size="small">输出 <icon-down /></a-button>
      </a-dropdown>
      <a-button size="small">订舱</a-button>
      <a-button size="small">放舱</a-button>
      <span class="detail-drawer-footer__sep" aria-hidden="true" />
      <a-button size="small" type="primary" :loading="submitting">保存</a-button>
    </div>
  </div>
</div>
```

- 仅「保存」= `primary`，与 workflow 按钮用 `detail-drawer-footer__sep` 分隔
- 吸底流程 = **secondary**（默认），收入 `detail-drawer-footer__cluster` 浅底操作组

### 5.7 弹窗 Footer

```vue
<template #footer>
  <div style="display:flex;justify-content:space-between;align-items:center">
    <a-button v-if="isEdit" type="text" status="danger" size="small" @click="handleDelete">删除</a-button>
    <div style="display:flex;gap:8px;margin-left:auto">
      <a-button size="small" @click="handleCancel">取消</a-button>
      <a-button size="small" type="primary" :loading="submitting" @click="handleOk">确定</a-button>
    </div>
  </div>
</template>
```

- 取消 = `secondary`
- 确定 = `primary`
- 删除 = `text` + `danger`（左侧）

### 5.8 表格行内

```vue
<a-tooltip content="查看">
  <a-button type="text" class="row-action-btn row-action-btn--primary" @click="openDetail(row)"><icon-eye /></a-button>
</a-tooltip>
<a-popconfirm content="确认删除？" @ok="remove(row)">
  <a-button type="text" class="row-action-btn" status="danger"><icon-delete /></a-button>
</a-popconfirm>
```

- 行内禁止文字按钮（「查看」「编辑」字样）
- 操作列内按钮必须放在 `row-actions` dock 中；直接主操作加 `row-action-btn--primary`，更多菜单加 `row-action-btn--more`
- 删除 = `text` + `danger` + `a-popconfirm`
- 禁止 `outline` 铺满操作列

---

## 6. Action Menu And Danger

Dropdown is an **action menu**, not a plain list of links. It should feel like a compact freight operation panel: clear trigger hierarchy, stable option rhythm, light Arco-native surface, and a separated danger zone.

### 6.1 Variants

| Variant | Usage | Required content class | Trigger |
|---------|-------|----------------------|---------|
| Toolbar action menu | `导出`, `更多`, batch/low-frequency workflow actions | `content-class="action-menu action-menu--toolbar"` | visible text button with trailing `<icon-down />` |
| Footer action menu | detail sticky footer `输出`, `流转`, secondary workflow actions | `content-class="action-menu action-menu--footer"` | footer secondary text button with trailing `<icon-down />` |
| Row action menu | operation-column `···` menu | `content-class="action-menu action-menu--row"` | `row-action-btn row-action-btn--more` |

`a-dropdown` must use `content-class`, not `popup-class`. `popup-class` is not a valid Arco Dropdown prop in this project and will not style the floating menu. `row-action-menu` is legacy-compatible only. New code must use the variant that matches the trigger scope: toolbar → `action-menu--toolbar`; sticky detail footer → `action-menu--footer`; row operation → `action-menu--row`.

### 6.2 Option Order

1. Direct business workflow: close, approve, push, assign.
2. File/output: export, download, print, import template.
3. Maintenance/secondary workflow: batch modify, copy, reuse.
4. `action-menu__divider`.
5. Dangerous or irreversible actions with `danger-opt`.

Keep options task-oriented. Do not add section labels inside dense menus unless there are more than 8 items and the groups cannot be understood from verbs.

### 6.3 Visual Contract

- Menu panel uses `action-menu`: white-to-subtle surface, restrained border, soft elevation, no decorative color block.
- Action menus are attached operation surfaces, not floating dialog cards. The panel must visually belong to its trigger: compact radius, restrained shadow, no large blank inset, no heavy card border, and no detached "modal card" feeling.
- Toolbar and footer menus use content-based width with `width: max-content`, compact variant minimum widths, and `--dense-action-menu-max-w` as the upper bound so Chinese labels stay compact while longer English/i18n labels can expand before truncation.
- Footer menus are closest to the sticky action bar. They use `action-menu--footer`, smaller minimum width than toolbar menus, and option height around 31px to keep click targets comfortable without creating a bulky popup.
- Row menus remain compact but cannot drop below a 32px option hit area.
- Menu content must not create horizontal scrollbars. Use bounded adaptive panel width, `overflow-x: hidden`, no wrapping, and ellipsis only after the max width is reached.
- Dropdown options are text-first. Do not add icons by default and do not force an icon for every operation; many freight operations do not have a precise icon. Use an option icon only when the action has a strong, unambiguous system metaphor and the whole menu still remains visually even.
- `action-menu__divider` separates semantic danger, not every two options.
- `danger-opt` must be the final group and must not look like a normal option.
- Do not write page-scoped dropdown shadows, radii, item padding, danger colors, or inline divider margins.

Danger rules:

- Toolbar dropdowns use `content-class="action-menu action-menu--toolbar"`; row dropdowns use `content-class="action-menu action-menu--row"`.
- Detail sticky footer dropdowns use `content-class="action-menu action-menu--footer"`. Do not reuse toolbar dropdown style in a sticky footer because it reads too wide and visually detached from the footer button group.
- Divider uses `action-menu__divider`; `row-action-menu__divider` is legacy-compatible only.
- 下拉危险项：`class="danger-opt"`，点击后 `Modal.confirm` 或业务确认，禁止直接执行。
- 行内删除：`a-popconfirm`。
- 批量/不可逆：`Modal.confirm({ type: 'warning' })`。
- 禁止 `alert()` / `confirm()`。

---

## 7. Toolbar Rules (summary)

- Left: business actions.
- Right: utilities and selected count.
- No more than one `primary` per toolbar.
- More than four visible actions → group into dropdown.
- Refresh / settings / column config = `text` icon-only.

---

## 8. Permissions And Feedback

- No permission → hide button (do not use `disabled` to hide existence unless business requires).
- Success → `Message.success`
- Failure → `Message.error`
- Async → `:loading` on the triggering button

---

## 9. Table Edit Modes

### Row edit mode

- `保存` = `primary`（仅该行作用域）
- `取消` = `secondary` 或 `text`，禁止 `danger`

### Batch edit toolbar

- `保存更改` = `primary`
- `取消编辑` = `secondary`
- Show `已修改 N 行` near actions
- Block pagination/filter/leave while dirty

---

## 10. Visual Restraint (PESDP)

- Primary tint is an **anchor**, not wallpaper. Do not make every action `outline`.
- **Three visual tiers in detail drawers** (implemented in `global.css`):
  - **Page head + footer workflow** → `secondary` in white micro-shadow chips; footer grouped in `detail-drawer-footer__cluster` with `__sep` before primary
  - **Module / child-pane main action** → `outline` in `detail-section__actions` action bar (light tint border box)
  - **Auxiliary** → `text` link-blue in action bar: 复制、清除、发送报关资料
  - **Section title** → left primary accent bar on `detail-section__title::before`
  - **Danger** → row delete muted gray until hover; footer abandon stays `text` + `danger`
  - **Global submit** → `primary` with soft elevation in cluster
  - **Mini table header** → flat `#F7FAFF`, **no** `header-wrapper` bottom border
- Neutral surfaces (search/toolbar/table cap) stay white/gray; primary appears in active nav, links, focus, selection, one primary button, and thin anchors.
- Hover: no transform/shadow float on dense toolbars (see `global.css` toolbar/detail-drawer overrides).

---

## 11. Quick Checklist

```
□ 每个作用域 primary ≤ 1
□ 重置/刷新 = text，不是 outline
□ 复制/清除 = text，不是 outline
□ 导出/取消 = secondary 或 outline（模块内统一）
□ 模块添加 = outline；空状态添加可用 dashed
□ 删除/废弃 = text + danger + 确认
□ 禁止 warning/success 常驻按钮
□ 行内 = icon + tooltip + row-action-btn
□ 超过 3 个直接按钮 → dropdown
```
