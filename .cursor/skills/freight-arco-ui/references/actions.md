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
| 行内删除（`detail-mini-vxe--editable`） | `text` + `danger` + `row-action-btn` | `a-popconfirm` |
| 列表行删除 | row More menu + final `danger-opt` | 独立 `Modal.confirm` / business Modal |
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
❌ 为了“现代 SaaS 感”给导入/下载/对账等普通 workflow 动作分配绿色、橙色、紫色
```

### Toolbar Visual Differentiation（现代 SaaS 不靠彩色按钮）

工具栏多个同类按钮的区分依靠三层机制，不依靠 status 颜色。现代感来自层级、分组、留白和图标识别，不来自把每个动词涂成不同颜色。

生产作业台例外：如果业务员/操作员每天反复使用某些动作，它们可以保持直接可见。不要为了“极简 SaaS 感”把高频动作藏进更多菜单。正确做法是降低按钮色彩强度、按业务组分隔、保留一个 primary，而不是减少必要操作入口。

**第一层 — Type 决定重要性**

| 层级 | 场景 | Type |
|------|------|------|
| 核心正向操作 | 选择销账、新建、提交 | `primary` × 1 |
| 高频工作流 | 导出、对中、账单下载等 daily 操作 | `outline` |
| 中低频辅助 | 账单修改、刷新日期等 occasional 操作 | `text` |

**第二层 — Divider 决定功能归属**

同 type 的按钮按功能语义分组，组间使用 Arco vertical Divider：

```vue
<a-space :size="8">
  <!-- 核销主操作 -->
  <a-button size="small" type="primary" @click="handleWriteOff">选择销账</a-button>

  <a-divider direction="vertical" />

  <!-- 输出组：导出 + 下载 -->
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">导出<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">账单下载<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>

  <a-divider direction="vertical" />

  <!-- 对账组：对中 + 导入 -->
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">对中<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">上对比导入<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>

  <a-divider direction="vertical" />

  <!-- 维护组：降权为 text -->
  <a-dropdown trigger="click">
    <a-button size="small" type="text">账单修改<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-button size="small" type="text" @click="handleRefreshDueDate">刷新DueDate</a-button>
</a-space>
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

**同一作用域内**：primary ≤ 1；简单平铺按钮通常 ≤ 3。生产作业台的高频可逆动作可以超过 3，但必须通过 Arco Divider、dropdown group、neutral type、右侧 utilities 分区控制噪音，并且不能换行。危险、低频、不可逆动作仍然收入 dropdown 或确认流。

---

## 4. Button Content Form

Button content is decided by action scope and recognition cost, not by decoration.

| Content form | Use when | Required pattern | Forbidden |
|--------------|----------|------------------|-----------|
| Icon-only | row actions, toolbar utilities, compact fixed-width tools | Arco icon + Tooltip + business-specific `aria-label`; `type="text"` except documented row dock variants; target at least 24×24px | icon-only for module add/save/submit or business workflow verbs; Tooltip without an accessible name |
| Icon + text | primary creation, additive module actions, upload/import/export/download/print when the icon has a universal metaphor | icon first, text second, `size="small"`; trailing down icon only for dropdown trigger | forcing icons on every workflow action |
| Text-only | business workflow verbs, footer workflow, drawer head actions, modal footer, dropdown options | concise object/action text; stable button type by scope | adding vague icons when no precise metaphor exists |
| Text + trailing chevron | dropdown trigger such as `更多`, `导出`, `输出`, `流转` | text + `<icon-down />`; native Arco popup | standalone chevron without text except row `···` menu |

### Content Decision Rules

- Row operation column: icon-only + tooltip. It is a repeated dense column; text buttons make the table noisy and wide.
- Every icon-only button also declares a concise business-specific `aria-label`; Tooltip is visual help and does not replace the accessible name.
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

1. Business command group: one primary action plus visible daily reversible actions.
2. Scope/status group: queue switching used during daily processing.
3. Data utilities: refresh, pagination, columns, density, and selected-row context stay in the table surface.
4. More menu: low-frequency or dangerous page actions only.

Use Arco Space/Grid/Card slots to express these roles. Exact toolbar/cap class names are not a shared API unless grep proves an implementation.

Key rules:

- One `primary` anchor represents the page's core positive action; when no such action exists, do not invent one.
- Daily low-risk actions remain visible and neutral. They may exceed three when the group stays on one line at 1280px.
- A dropdown trigger is one operation group, regardless of its option count.
- Selected-row batch actions stay with business commands, not in the utility area.
- Refresh, column settings, density, and pagination stay beside the table. Do not create an otherwise empty cap band for one icon.
- Selected count and Clear appear only while selection exists. Pagination owns the total count.
- The final danger group follows an Arco Divider and requires confirmation.

```vue
<a-space :size="8">
  <a-button size="small" type="primary">
    <template #icon><icon-plus /></template>新建
  </a-button>
  <a-button size="small" type="outline">打印</a-button>
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">批量操作<icon-down /></a-button>
    <template #content>
      <a-doption>批量修改</a-doption>
      <a-divider />
      <a-doption class="danger-opt">批量废弃</a-doption>
    </template>
  </a-dropdown>
</a-space>
```

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

**1–N 分档决策表** → [`table.md`](table.md) **Row Actions**（先分类 A/B/C/D，再查矩阵）。

| 场景 | 直出 | 危险操作 |
|------|------|----------|
| **列表主表** `workbench-table` | 最多 2 个 affordance；N≥3 或含 D → `[A] + ···` | 永远在 `···` 内 + `danger-opt`，点击后打开独立确认 Modal |
| **详情可编辑子表** `detail-mini-vxe--editable` | 同上上限 | 允许 1 个直出 danger icon + `a-popconfirm`（行编辑场景） |

```vue
<!-- 列表：主操作 + 更多（含删除） -->
<div class="row-actions">
  <a-tooltip content="查看">
    <a-button type="text" class="row-action-btn row-action-btn--primary" @click="openDetail(row)"><icon-eye /></a-button>
  </a-tooltip>
  <a-dropdown trigger="click">
    <a-button type="text" class="row-action-btn row-action-btn--more" title="更多操作"><icon-more /></a-button>
    <template #content>
      <a-divider />
      <a-doption class="danger-opt" @click="openRemoveConfirm(row)">删除</a-doption>
    </template>
  </a-dropdown>
</div>
```

- 行内禁止文字按钮（「查看」「编辑」字样）
- 操作列内按钮必须放在 `row-actions` 中；主操作 `row-action-btn--primary`，更多 `row-action-btn--more`
- `row-actions` 只是对齐容器，不画常驻边框/背景/阴影
- 列表主表禁止直出 `status="danger"` 删除 icon；禁止 `outline` 铺满操作列
- 列宽：`56`（1  affordance）/ `88`（2 affordance）；禁止 `>88`

---

## 6. Action Menu And Danger

Use Arco Dropdown and Doption with the GI theme's native popup surface. Do not add a custom menu skin merely to differentiate toolbar, footer, and row triggers.

### 6.1 Trigger Roles

| Role | Usage | Trigger |
|------|-------|---------|
| Toolbar menu | export, batch, and low-frequency workflow groups | visible text button with trailing `<icon-down />` |
| Footer menu | output, transition, and secondary detail workflow | secondary text button with trailing `<icon-down />` |
| Row menu | operation-column overflow | icon-only `···` button with tooltip/accessible label |

`popup-class` is not a valid Arco Dropdown prop in this project. Use `content-class` only when grep proves a real shared or local popup rule exists; do not attach inert class names.

### 6.2 Option Order

1. Direct business workflow: close, approve, push, assign.
2. File/output: export, download, print, import template.
3. Maintenance/secondary workflow: batch modify, copy, reuse.
4. Arco Divider.
5. Dangerous or irreversible actions with `danger-opt`.

Keep options task-oriented. Do not add section labels inside dense menus unless there are more than 8 items and the groups cannot be understood from verbs.

### 6.3 Visual Contract

- Keep the GI/Arco popup surface, radius, border, shadow, padding, and interaction states.
- Options are text-first. Do not force an icon for every freight operation.
- Long labels remain readable; introduce a scoped width rule only when real i18n content proves the native popup insufficient.
- The menu must not create horizontal scrolling or look like a dialog card.
- Dropdown options are text-first. Do not add icons by default and do not force an icon for every operation; many freight operations do not have a precise icon. Use an option icon only when the action has a strong, unambiguous system metaphor and the whole menu still remains visually even.
- Arco Divider separates semantic danger, not every two options.
- `danger-opt` must be the final group and must not look like a normal option.
- Do not write page-scoped dropdown shadows, radii, item padding, or alternate popup colors.

Danger rules:

- Toolbar, footer, and row menus share Arco popup styling; trigger form communicates the scope.
- Use Arco Divider before the final danger group.
- 下拉危险项：`class="danger-opt"`，点击后 `Modal.confirm` 或业务确认，禁止直接执行。
- 禁止在 Dropdown 内容中嵌套 `a-popconfirm`：下拉层会先销毁，确认浮层可能无法出现。先保存目标对象，再打开独立 Modal 或调用 `Modal.confirm`。
- 非 Dropdown 内的详情行内删除：可用 `a-popconfirm`；列表 More 菜单内必须使用独立 Modal。
- 批量/不可逆：`Modal.confirm({ type: 'warning' })`。
- 禁止 `alert()` / `confirm()`。

---

## 7. Toolbar Rules (summary)

- Left: business actions.
- Right: utilities and selected count.
- No more than one `primary` per toolbar.
- More than four visible actions → group by workflow. Daily reversible actions may remain visible as neutral buttons/dropdown triggers; low-frequency or risky actions go into dropdown.
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
- Semantic colors are for state and risk, not workflow decoration. Import/export/download/reconcile/refresh stay in type hierarchy unless they are truly success/warning/danger states.
- **Three action tiers in detail drawers** (Arco props, not a global skin):
  - **Page/footer workflow** → default/secondary commands plus one `primary` submit
  - **Module action** → `outline` or default in the owning section head
  - **Auxiliary** → `text`; destructive work uses `status="danger"` plus confirmation
- Neutral surfaces (search/toolbar/table cap) stay white/gray; primary appears in active nav, links, focus, selection, one primary button, and thin anchors.
- Keep GI native hover/focus behavior; do not add transform or floating shadows in page CSS.

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
□ icon-only = Tooltip + 业务化 aria-label + 点击目标不小于 24×24px
□ 高频可逆动作可见；低频/危险动作 → dropdown
```
