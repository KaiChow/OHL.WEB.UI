# Actions And Buttons

> Class names and --dense-* tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

Arco `a-button` has **5 types** and **4 statuses**. Status can combine with any type.

```vue
<a-button type="primary" status="danger">...</a-button>
```

All operational pages inherit `size="small"` from the application ConfigProvider unless a documented hero/empty-state exception exists. Full mapping: `references/form-field.md` Size Contract.

**Do not override form controls to `size="medium"` or `size="large"`** in `src/views`; table-row controls remain the explicit `size="mini"` exception.

---

## 1. Button Types (Arco)

| Type | Arco 写法 | 视觉 | 项目语义 |
|------|-----------|------|----------|
| **primary** | `type="primary"` | 实心主色 | 当前作用域内**唯一**的主正向操作 |
| **secondary** | 不写 `type`（默认） | 中性按钮 | 次要正向、取消、关闭、存草稿 |
| **dashed** | `type="dashed"` | 虚线边框 | 「继续添加 / 上传 / 占位引导」类扩容量操作 |
| **outline** | `type="outline"` | 线框主色 | 需要比 secondary 更显眼、但又不是主操作的流程/模块操作 |
| **text** | `type="text"` | 无边框文字/图标 | 工具、降权辅助、行内业务动词、重置/刷新 |

### Type Selection Rules

```
primary   → 每作用域最多 1 个：查询、新建、保存、提交、弹窗确定
secondary → 中性次要：导出、取消、关闭、存草稿、批量（非主流程）
outline   → 模块/流程次要：提交审批、打印、发送、模块内「添加联系人」
dashed    → 空状态/表格内「添加一行」「继续上传」；禁止做全局提交
text      → 重置、刷新、列设置、复制、清除；行内业务动词操作
```

**层级口诀**：`primary` 定锚点 → `outline` / `secondary` 承业务 → `text` 承工具 → `dashed` 承扩容。

---

## 2. Button Status (Arco)

| Status | Arco 写法 | 语义 | 项目用法 |
|--------|-----------|------|----------|
| **normal** | 默认 | 常规 | 绝大多数按钮 |
| **success** | `status="success"` | 成功态 | **极少用于按钮**；结果用 `Message.success`，状态用 `s-pill[data-s]` |
| **warning** | `status="warning"` | 警告态 | **禁止**用于工具栏/详情吸底；业务警示用 `s-pill` / 文案，不用高饱和 warning 按钮 |
| **danger** | `status="danger"` | 危险态 | 删除、废弃、撤销；必须配确认 |

### Status × Type Matrix（本项目允许组合）

| 场景 | 推荐组合 | 确认方式 |
|------|----------|----------|
| 全局提交 | `primary` + normal | — |
| 导出 | `outline` 或默认按钮（同一模块固定一种） | — |
| 取消/关闭 | 默认按钮；行编辑取消可用 `text` icon | — |
| 模块添加 | `outline` + normal | — |
| 空状态添加行 | `dashed` + normal | — |
| 重置/刷新/复制 | `text` + normal | — |
| 详情可编辑表的行内删除 | `text` + `danger` + `row-action-btn` | `a-popconfirm` |
| 列表行删除 | row More menu + final `danger-opt` | 独立 `Modal.confirm` / business Modal |
| 吸底废弃 | `text` + `danger` | `Modal.confirm` |
| 弹窗确定删除 | `primary` + `danger`（仅 confirm 弹窗内） | 已在 Modal 中 |
| 下拉危险项 | — | `a-doption class="danger-opt"` + 二次确认 |

### Forbidden Combinations

```
❌ primary + warning          — 主操作不应呈警告色
❌ outline + warning 做提交/审批 — 用 outline + normal；警示信息放 pill/文案
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
| 核心正向操作 | 新建、提交 | `primary` × 1 |
| 高频工作流 | 导出、导入、打印等 daily 操作 | `outline` |
| 中低频辅助 | 批量修改、刷新数据等 occasional 操作 | `text` |

**第二层 — Divider 决定功能归属**

同 type 的按钮按功能语义分组，组间使用 Arco vertical Divider：

```vue
<a-space :size="8">
  <!-- 新建主操作 -->
  <a-button size="small" type="primary" @click="handleCreate">新建工单</a-button>

  <a-divider direction="vertical" />

  <!-- 输出组：导出 + 打印 -->
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">导出<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>
  <a-button size="small" type="outline" @click="handlePrint">打印</a-button>

  <a-divider direction="vertical" />

  <!-- 数据组：导入 + 同步 -->
  <a-dropdown trigger="click">
    <a-button size="small" type="outline">导入<icon-down /></a-button>
    <template #content>...</template>
  </a-dropdown>

  <a-divider direction="vertical" />

  <!-- 维护组：降权为 text -->
  <a-button size="small" type="text" @click="handleBatchEdit">批量修改</a-button>
  <a-button size="small" type="text" @click="handleRefresh">刷新数据</a-button>
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
| 详情页头 | — | — | 复制/归档/更多 | — | 关闭 |
| 详情模块头 | — | 模块主操作（添加） | — | — | 复制、清除 |
| 子表/子面板头 | — | 添加明细、添加行 | — | 空状态「添加」 | — |
| 表格行内 | 行编辑保存 ×1 | — | 行编辑取消 | — | 主列表使用共享 icon + Tooltip 行操作；仅 More 入口打开文字下拉 |
| 详情吸底 | 保存 ×1 | — | 提交审核、发布、输出 | — | 废弃 danger |
| 弹窗 footer | 确定 ×1 | — | 取消 | — | 删除 danger（左侧） |

**同一作用域内**：primary ≤ 1。主表先按频率、风险、可识别性和权限判断合法动作，再按稳定的三入口规则呈现：1–3 个合法动作全部直出；4 个及以上只直出前两个合格动作，第三个入口固定为 More，其余进入下拉。危险或显式要求收纳的动作始终进入 More。

---

## 4. Button Content Form

Button content is decided by action scope and recognition cost, not by decoration.

| Content form | Use when | Required pattern | Forbidden |
|--------------|----------|------------------|-----------|
| Icon-only | row `···` More trigger, toolbar utilities, compact fixed-width tools | Arco icon + Tooltip + business-specific `aria-label`; `type="text"`; target ≥28×28px normally, ≥24×24px inside dense table rows | icon-only for direct row business verbs or module add/save/submit; Tooltip without an accessible name |
| Icon + text | primary creation, additive module actions, upload/import/export/download/print when the icon has a universal metaphor | icon first, text second, `size="small"`; trailing down icon only for dropdown trigger | forcing icons on every workflow action |
| Text-only | business workflow verbs, footer workflow, drawer head actions, modal footer, dropdown options | concise object/action text; stable button type by scope | adding vague icons when no precise metaphor exists |
| Text + trailing chevron | dropdown trigger such as `更多`, `导出`, `输出`, `流转` | text + `<icon-down />`; native Arco popup | standalone chevron without text except row `···` menu |

### Content Decision Rules

- Row operation column: expose only proven frequent, low-risk business verbs that remain readable on one line without competing with table data. The `···` More trigger is the only icon-only control in the column and requires Tooltip plus a business-specific `aria-label`.
- Every icon-only button also declares a concise business-specific `aria-label`; Tooltip is visual help and does not replace the accessible name.
- Toolbar utility actions: icon-only when the command is a familiar utility (`刷新`, `列设置`, `密度`, `全屏`). Add tooltip. Do not use framed outline buttons for utilities.
- Primary creation: icon + text when the action adds a new object (`新建`, `添加`, `上传`). Use plus/upload icon only when the metaphor is exact.
- Module/child add actions: icon + text is preferred for `添加...` because it improves scanning in module heads. Keep at most one outline add action per module head.
- Business workflow actions: text-only unless the icon is universally precise. Examples: `提交审核`, `发起审批`, `同步数据`, `发布`. These should not get decorative icons.
- Footer workflow actions are text-only in an Arco Space/Flex group; only dropdown triggers get a trailing chevron.
- Dropdown options: text-only by default. Do not add icons per option. Use an option icon only when it is a strong system metaphor and the whole menu stays visually even.
- Danger actions: main-list row danger is a text-only `danger-opt` in the final `···` group and opens an independent confirmation; the editable-detail-row exception may use one danger icon with Tooltip + `aria-label` + `a-popconfirm`; footer/header danger is text-only `text + danger` with confirmation.
- If an action has no precise icon, use text-only. Ambiguous icons increase recognition cost in an 8-hour operational system.

### Content Form By Scope

| Scope | Default content form | Examples |
|-------|----------------------|----------|
| Filter | 查询用搜索 icon + text；重置保留 text，可配 `icon-undo` / `icon-rotate-left` 表达恢复条件；高级筛选用 filter icon + text | `查询`, `重置`, `筛选` |
| Toolbar primary create | Icon + text | `+ 新建工单` |
| Toolbar direct business action | Text-only or icon + text if universal | `打印工单`, `导出` |
| Toolbar utility | Icon-only + tooltip | refresh, column settings |
| Detail head | Text-only secondary | `复制合同`, `打印`, `关闭` |
| Detail module head | Icon + text for add; text-only for workflow; text for auxiliary | `+ 添加明细`, `同步数据`, `客户档案` |
| Child/table local add | Icon + text; dashed only in empty state | `+ 添加明细行` |
| Detail footer | Text-only secondary + one primary | `保存草稿`, `提交审核` |
| Row action | Business-verb text buttons; only More is icon-only + tooltip | `编辑`, `分配给我`, `···` |
| Dropdown option | Text-only | `批量关闭`, `一键下载`, `批量删除` |

---

### Label Lexicon（按钮文案词汇表）

Button labels come from this table only; no surface invents synonyms. `modal.md` and `full-page-form.md` reference this lexicon instead of redefining labels.

| 场景 | 放弃/退出 | 主操作 | 规则 |
|------|-----------|--------|------|
| 新建/编辑弹窗、浮层编辑器 | `取消` | `确定`（保存类可用业务动词，如 `保存`、`使用这些值`） | footer 禁止 `提交`/`确认`/`关闭` |
| 整页表单、详情吸底 | `取消` | `提交`（流程节点用业务动词，如 `提交审核`；草稿用 `保存草稿`） | 禁止把弹窗的 `确定` 搬到整页表单 |
| `Modal.confirm` 确认框 | `取消` | `确认` + 动作动词（`确认废弃`、`确认删除`、`确认提交`） | okText 禁止裸 `确定`/`确认` |
| 只读查看弹窗/抽屉 | — | `关闭` 唯一入口或无 footer | 禁止 `取消` |
| 危险动作本体 | — | 动作动词本身（`删除`、`废弃`） | `确认` 只出现在确认框内 |

- `取消`/`确定`/`提交`/`关闭` 四个词分工唯一；同一场景禁止混用、替换或并列。
- 业务动作使用业务动词（`同步数据`、`分配给我`），不从这张表造词；词表变更只能改本节，禁止页面就地发明同义词。

---

## 5. Scene Recipes

### 5.1 列表页筛选

```vue
<a-button size="small" type="primary" @click="handleSearch">查询</a-button>
<a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
```

- 查询 = `primary`
- 重置 = `text`（禁止 `outline`），始终保留文字；可使用 `icon-undo` / `icon-rotate-left` 强化“恢复默认条件”的识别，不得使用 `icon-refresh`。刷新当前结果仍只使用 `icon-refresh`，两者不可共用图形语义。

### 5.2 列表页工具栏

**收纳决策：按「频率 × 风险」分类，不按个数限制。**

旧规则「≤ 3 个可见按钮」针对的反模式是：大量等权重无分组按钮堆叠、主操作失焦。它不适用于中后台 SaaS 的高密度工作台——操作员全天使用同一工具栏，隐藏高频操作会造成大量额外点击。真正的设计目标是：层次清晰、危险隔离、视觉有锚点，而不是限制个数。

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
- A frequent, permission-visible batch command keeps a stable toolbar position and is disabled with a concise reason until an eligible selection exists. Contextual appearance is reserved for rare selection-only commands inside a dedicated selection surface; it must not shift stable neighboring commands.
- Refresh, column settings, density, and pagination stay beside the table. Do not create an otherwise empty cap band for one icon.
- Selected count and Clear appear once beside the batch commands while selection exists. Batch trigger labels remain action-only and never repeat the selected count. Pagination owns the result total count.
- The shared workbench toolbar aligns its command group to the same horizontal frame edge as the table. Do not leave an unexplained leading gap or add page-local padding/offsets; any inset must be owned and applied by the shared frame.
- In the standard workbench head, the workflow-to-toolbar transition is flush and the toolbar control group is optically centered with equal top and bottom breathing room. Do not introduce a page-local inter-card gap that shifts commands downward.
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
      <a-divider :margin="4" />
      <a-doption class="danger-opt">批量删除</a-doption>
    </template>
  </a-dropdown>
</a-space>
```

### 5.3 详情页头

```vue
<a-button size="small">复制</a-button>
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
  <a-button size="small" type="outline" @click="addContact">
    <template #icon><icon-plus /></template>添加联系人
  </a-button>
  <!-- 低频辅助：用 text 降权，不用 outline -->
  <a-button size="small" type="text" @click="copyData">
    <template #icon><icon-copy /></template>复制明细数据
  </a-button>
</div>
```

- 每个模块头：**最多 1 个 `outline`**（模块主操作）
- 复制 / 清除 / 外部数据同步 = `text`
- 当操作开始换行、难以扫读或挤压模块内容时，按频率和风险将较低优先级动作收入 `outline` 下拉「更多」

### 5.5 子表面板（明细行等）

```vue
<!-- 有数据时 -->
<a-button size="small" type="outline" @click="addLine">
  <template #icon><icon-plus /></template>添加明细
</a-button>

<!-- 空状态时可用 dashed 强化「可添加」 -->
<a-button size="small" type="dashed" long @click="addLine">
  <template #icon><icon-plus /></template>添加明细
</a-button>
```

### 5.6 详情吸底

```vue
<template #footer>
  <a-row justify="space-between" align="center">
    <a-col>
    <a-button size="small" type="text" status="danger" @click="confirmAbandon">废弃</a-button>
    </a-col>
    <a-col>
      <a-space :size="8">
      <a-dropdown>
        <a-button size="small">输出 <icon-down /></a-button>
      </a-dropdown>
      <a-button size="small">提交审核</a-button>
      <a-button size="small">发布</a-button>
      <a-button size="small" type="primary" :loading="submitting">保存</a-button>
      </a-space>
    </a-col>
  </a-row>
</template>
```

- 仅「保存」= `primary`；其他流程按钮保持默认层级并按业务关系分组
- 不用自定义浅底胶囊、阴影或分隔皮肤包装 footer 按钮

### 5.7 弹窗 Footer

Footer 布局与完整示例见 `modal.md`；本节只约束按钮层级。

- 取消 = `secondary`
- 确定 = `primary`
- 删除 = `text` + `danger`（左侧）

### 5.8 表格行内

行操作的直出与收纳按 [`table.md`](table.md) 的频率、风险、识别成本和空间证据决策，不使用按钮数量公式。

| 场景 | 直出 | 危险操作 |
|------|------|----------|
| **列表主表** | 高频、低风险动作的 Arco icon-only button + Tooltip；最多两个直出动作（有 More 时） | 永远在 More 内 + `danger-opt`，点击后打开独立确认 Modal |
| **详情可编辑子表** | 与行编辑任务直接相关且保持紧凑可辨识的动作 | 允许明确的 danger icon + `a-popconfirm`（行编辑场景） |

```vue
<!-- 列表：共享组件负责 1–3 直出、4+ 两个直出 + More，以及危险动作收纳。 -->
<WorkbenchRowActions :actions="getRowActions(row)" :more-label="t('common.moreActions')" />
```

- 直出使用 Arco icon-only button，必须由 Tooltip 和业务化 `aria-label` 提供可发现性；图标只表达明确的系统动作，菜单选项保持文字优先。
- 1–3 个合法动作全部直出；4 个及以上只直出前两个，第三个可见入口固定为 More；危险动作始终进入 More。
- 行内控件必须 `size="mini"`；共享行操作使用 16px 图标与 28×28px 命中区，保持 mini 行密度而不牺牲可发现性。
- 操作列统一使用共享 `WorkbenchRowActions`，其内部使用 Arco `a-space.row-actions` 和原生 Dropdown。
- 主列表操作单元格统一左对齐，动作顺序固定为 A → B → `···`；条件动作缺失时禁止重新居中剩余按钮
- `row-actions` 只负责水平节奏，不画常驻边框/背景/阴影，也不写页面局部居中 CSS
- 列表主表禁止直出 `status="danger"`；禁止 `outline` 铺满操作列
- 操作列按共享组件的可见入口和最长合法本地化内容确定一个稳定宽度；禁止按单一语言或单个词临时量列宽。

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
- Options are text-first. Do not force an icon for every business operation.
- Long labels remain readable; introduce a scoped width rule only when real i18n content proves the native popup insufficient.
- The menu must not create horizontal scrolling or look like a dialog card.
- Dropdown options are text-first. Do not add icons by default and do not force an icon for every operation; many business operations do not have a precise icon. Use an option icon only when the action has a strong, unambiguous system metaphor and the whole menu still remains visually even.
- Arco Divider separates semantic danger, not every two options.
- In a compact Dropdown, the Divider must use Arco's public `margin` prop so adjacent options remain one scannable menu; inheriting the page-section Divider rhythm is a defect. Choose the value from the active menu rhythm, not from a project-wide pixel formula.
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

- Left: business actions and the adjacent selected-row context when selection exists.
- Right: pagination and table utilities.
- No more than one `primary` per toolbar.
- More than four visible actions → group by workflow. Daily reversible actions may remain visible as neutral buttons/dropdown triggers; low-frequency or risky actions go into dropdown.
- Refresh / settings / column config = `text` icon-only.
- Keep available refresh/column/density tools in one group; render density only with an explicit page contract, then separate tools from one rightmost `size="mini"` pagination cluster.

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

## 10. Visual Restraint

- Primary tint is an **anchor**, not wallpaper. Do not make every action `outline`.
- Semantic colors are for state and risk, not workflow decoration. Import/export/download/reconcile/refresh stay in type hierarchy unless they are truly success/warning/danger states.
- **Three action tiers in detail drawers** (Arco props, not a global skin):
  - **Page/footer workflow** → default/secondary commands plus one `primary` submit
  - **Module action** → `outline` or default in the owning section head
  - **Auxiliary** → `text`; destructive work uses `status="danger"` plus confirmation
- Neutral surfaces (search/toolbar/table cap) stay neutral; primary appears in active navigation, links, focus, selection, and the one primary button, not decorative lines.
- Keep GI native hover/focus behavior; do not add transform or floating shadows in page CSS.

---

## 11. Quick Checklist

```
层级与位置
□ 同一视觉作用域 primary ≤ 1；页面、查询区、模块、弹窗分别计算
□ Primary 只给当前作用域最重要且明确的下一步；没有主动作时不制造 Primary
□ 查询 = primary；重置 = text；普通刷新 = icon-only 或 text（按频率和空间统一）；列设置/密度 = icon-only tool
□ 页面核心新建可用 primary；模块添加 = outline/default；dashed 只用于空状态或容器内新增
□ 导出 = outline/default；低频或多格式导出进入 dropdown
□ 取消/关闭统一用默认按钮；行编辑取消可用 text icon，禁止 danger
□ success/warning 只给真实状态型动作，不作为普通常驻按钮

可见性与收纳
□ 高频、低风险、可逆动作直接可见；低频动作进入 dropdown；危险动作隔离到末组
□ 高密度主表只直出有频率证据、低风险、单行可读且不挤压业务数据的动作；其余进入 More
□ 主表行操作统一使用 Arco icon + Tooltip + 业务 `aria-label`；1–3 个直出，4 个及以上为两个直出 + More
□ 窄工作区先把熟悉工具图标化，再收纳低频动作；不得隐藏 Primary 或造成控件重叠/换行

内容与可访问性
□ icon-only = Arco icon + Tooltip + 业务化 aria-label；不能只靠 title 或颜色
□ icon 16px；常规点击热区 ≥ 28×28px，高密度表格的共享行操作也保持 ≥ 28×28px
□ Dropdown 选项默认文字；危险项使用 danger 语义、位于末组并与普通项分隔
□ 文案必须包含对象或结果，禁止“处理/确定/操作”等脱离上下文的泛化动词

状态与风险
□ 每个动作都有权限可见性、enablement、pending 防重、成功、失败保留与刷新归属
□ pending 使用原按钮 loading，标签和宽度稳定；提交期间禁用冲突动作
□ 错误显示在可修复的 owning surface；Message 只能总结，不能替代局部错误
□ 删除/废弃等高影响动作 = danger + 确认；确认文案说明对象与影响
□ Undo 只在后端存在可恢复时窗和真实恢复接口时提供，禁止前端假撤销
□ 禁止仅依赖颜色表达按钮语义；危险、禁用、选中和 loading 都必须有结构或文字信号
```
