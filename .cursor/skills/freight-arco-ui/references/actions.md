# Actions And Buttons

Arco `a-button` has **5 types** and **4 statuses**. Status can combine with any type.

```vue
<a-button type="primary" status="danger">...</a-button>
```

All operational pages use `size="small"` unless a documented hero/empty-state exception exists.

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
```

---

## 3. Scope Model（作用域）

按钮层级由**作用域**决定，不是由页面决定。

| 作用域 | 允许 primary | outline | secondary | dashed | text |
|--------|-------------|---------|-----------|--------|------|
| 筛选区 | 查询 ×1 | — | — | — | 重置 |
| 列表 toolbar | 新建 ×1 | 导出、批量 | 导出（可与 outline 二选一） | — | 刷新、列设置 |
| 详情页头 | — | 并单、归档、更多 | — | — | 关闭 |
| 详情模块头 | — | 模块主操作（添加） | 复制、清除等辅助 | — | 复制、清除（推荐） |
| 子表/子面板头 | — | 添加品名、添加行 | — | 空状态「添加」 | — |
| 表格行内 | 行编辑保存 ×1 | — | 行编辑取消 | — | 查看/编辑/删除 icon |
| 详情吸底 | 保存 ×1 | 订舱、放舱、输出 | 取消（若有） | — | 废弃 danger |
| 弹窗 footer | 确定 ×1 | — | 取消 | — | 删除 danger（左侧） |

**同一作用域内**：primary ≤ 1；直接可见业务按钮 ≤ 3（超出收入 dropdown）。

---

## 4. Scene Recipes

### 4.1 列表页筛选

```vue
<a-button size="small" type="primary" @click="handleSearch">查询</a-button>
<a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
```

- 查询 = `primary`
- 重置 = `text`（禁止 `outline`）

### 4.2 列表页工具栏

```vue
<div class="toolbar-group">
  <a-button size="small" type="primary"><template #icon><icon-plus /></template>新建</a-button>
</div>
<div class="toolbar-divider" />
<div class="toolbar-group toolbar-group--grow">
  <a-button size="small" @click="handleExport">导出</a-button>
  <a-dropdown><!-- 批量操作 --></a-dropdown>
</div>
<div class="toolbar-aside">
  <a-button size="small" type="text" @click="fetchList"><template #icon><icon-refresh /></template></a-button>
</div>
```

- 新建 = `primary`
- 导出 = `secondary`（默认）或 `outline`（二选一，模块内统一即可）
- 刷新 = `text` icon-only（禁止 `outline`）

### 4.3 详情页头

```vue
<a-button size="small" type="outline">并单</a-button>
<a-button size="small" type="outline">归档</a-button>
<a-dropdown>
  <a-button size="small" type="outline">更多 <icon-down /></a-button>
  <!-- 复制、打印；危险项用 danger-opt + confirm -->
</a-dropdown>
```

- 页头禁止 `primary`
- 全局危险操作不要与吸底重复

### 4.4 详情模块头

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

### 4.5 子表面板（品名明细等）

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

### 4.6 详情吸底

```vue
<div class="detail-drawer-footer">
  <div class="detail-drawer-footer__start">
    <a-button size="small" type="text" status="danger" @click="confirmAbandon">废弃</a-button>
  </div>
  <div class="detail-drawer-footer__end">
    <a-dropdown>
      <a-button size="small" type="outline">输出 <icon-down /></a-button>
      <!-- 下载 / 打印 / 发送 -->
    </a-dropdown>
    <a-button size="small" type="outline">订舱</a-button>
    <a-button size="small" type="outline">放舱</a-button>
    <a-button size="small" type="primary" :loading="submitting">保存</a-button>
  </div>
</div>
```

- 仅「保存」= `primary`
- 流程操作 = `outline` + normal
- 废弃 = `text` + `danger` + `Modal.confirm`

### 4.7 弹窗 Footer

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

### 4.8 表格行内

```vue
<a-tooltip content="查看">
  <a-button type="text" class="row-action-btn" @click="openDetail(row)"><icon-eye /></a-button>
</a-tooltip>
<a-popconfirm content="确认删除？" @ok="remove(row)">
  <a-button type="text" class="row-action-btn" status="danger"><icon-delete /></a-button>
</a-popconfirm>
```

- 行内禁止文字按钮（「查看」「编辑」字样）
- 删除 = `text` + `danger` + `a-popconfirm`
- 禁止 `outline` 铺满操作列

---

## 5. Dropdown And Danger

Dropdown order:

1. 文件/下载
2. 打印/输出
3. 复制/复用
4. Divider
5. 危险操作（`danger-opt`）

Danger rules:

- 下拉危险项：`class="danger-opt"`，点击后 `Modal.confirm` 或业务确认，禁止直接执行
- 行内删除：`a-popconfirm`
- 批量/不可逆：`Modal.confirm({ type: 'warning' })`
- 禁止 `alert()` / `confirm()`

---

## 6. Toolbar Rules (summary)

- Left: business actions.
- Right: utilities and selected count.
- No more than one `primary` per toolbar.
- More than four visible actions → group into dropdown.
- Refresh / settings / column config = `text` icon-only.

---

## 7. Permissions And Feedback

- No permission → hide button (do not use `disabled` to hide existence unless business requires).
- Success → `Message.success`
- Failure → `Message.error`
- Async → `:loading` on the triggering button

---

## 8. Table Edit Modes

### Row edit mode

- `保存` = `primary`（仅该行作用域）
- `取消` = `secondary` 或 `text`，禁止 `danger`

### Batch edit toolbar

- `保存更改` = `primary`
- `取消编辑` = `secondary`
- Show `已修改 N 行` near actions
- Block pagination/filter/leave while dirty

---

## 9. Visual Restraint (PESDP)

- Primary tint is an **anchor**, not wallpaper. Do not make every action `outline`.
- `detail-section__actions`：模块主操作用 `outline`，辅助用 `text`。
- Neutral surfaces (search/toolbar/table cap) stay white/gray; primary appears in active nav, links, focus, selection, one primary button, and thin anchors.
- Hover: no transform/shadow float on dense toolbars (see `global.css` toolbar/detail-drawer overrides).

---

## 10. Quick Checklist

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
