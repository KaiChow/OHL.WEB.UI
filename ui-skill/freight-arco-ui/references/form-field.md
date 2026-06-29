# Arco Form Controls — 组件统一规范

**CSS 唯一事实源：** `src/styles/global.css` → **`§ Arco Form Controls`**

规范按 **Arco 组件 + 使用场景** 组织，**不按** 列表 / 详情 / Modal / 筛选等业务模块分叉。  
同一 `a-input` / `a-select` / `a-date-picker` 在任意页面须呈现相同尺寸与字号。

## 原则

1. 模板统一 `size="small"`（见 `component-size.md`）
2. 控件外观只改 `§ Arco Form Controls`，禁止在 `filter-field` / `detail-form` / `detail-drawer` 等布局 class 下重复写 height / font-size
3. 布局 class（`filter-field`、`detail-form-grid`）只管 **排列与栅格**，不管控件皮肤

## Token

| Token | 值 | 用途 |
|-------|-----|------|
| `--dense-control-h-form` | 28px | 单行控件外框高度 |
| `--dense-control-lh-form` | 26px | 内文行高（h − 2px） |
| `--dense-font-field` | 12px / 500 | 字段名 label |
| `--dense-font-control` | 12px | 输入值 / placeholder |
| `--dense-gap-label` | 4px | 字段名 → 控件 |

## 组件默认态（Default）

适用：**所有** `size="small"` 单行控件，与所在页面无关。

| 组件 | Arco 类名（节选） |
|------|-------------------|
| Input | `.arco-input-wrapper.arco-input-size-small` |
| Select | `.arco-select-view-single.arco-select-size-small` |
| Date / Range | `.arco-picker-size-small` / `.arco-picker-range.arco-picker-size-small` |
| InputNumber | `.arco-input-number.arco-input-number-size-small` |

| 属性 | 值 |
|------|-----|
| 外框高度 | 28px |
| 字号 | 12px |
| 边框 | `var(--dense-border)` |
| Hover / Focus | primary 边框 + focus ring |

## 字段名（Field label）

| 写法 | 说明 |
|------|------|
| `.field-label` | 推荐通用 class |
| `.filter-field__label` | 与 `.field-label` 同规范（布局 BEM 别名） |
| `.arco-form-item-label > label` | `a-form layout="vertical"` 内置 label |

统一：12px / 500 / `text-2` / label→控件 **4px**。

**Arco 泄漏：** `a-form size="small"` 时 Arco 内置 label 为 **14px**（`.arco-form-size-small .arco-form-item-label`），须由 `global.css` § Arco Form Controls 压回 `--dense-font-field`。**列表 `filter-field__label` 与 Modal `a-form-item` label 必须同为 12px。**

**14px 仅用于 F0 浮层标题**（`.arco-modal-title`），不是字段 label。

## 使用场景（Scenario）

仅以下 **场景** 允许覆盖 Default；不得按业务模块新增场景。

| 场景 | 选择器 / 条件 | 差异 |
|------|----------------|------|
| **Textarea 多行** | `.arco-textarea-size-small` | 不固定 28px 高；行高 1.45 |
| **Disabled / 只读** | `.arco-*-disabled` | 灰底；文字仍 `text-1` 可读 |
| **Form-item 列宽** | `.arco-form-item-content >` | 控件 `width: 100%` |
| **表格行内编辑** | `.detail-mini-vxe` | 透明边框；hover/focus 才显形；单元格内只读值勿用 `link-text`（见 `table.md`） |
| **组合控件** | `.filter-combo` / `.detail-combo` | 多控件拼接圆角（布局 struct，非模块） |
| **分页跳转等** | `.table-card-cap__pager` | 分页专用（非表单字段） |

## 禁止

```
❌ 在 global.css 为 .detail-drawer / .detail-form / .filter-field 单独写控件 height、font-size
❌ 在 src/views scoped 覆盖 .arco-input-wrapper 尺寸
❌ 以「列表筛选」「Modal 表单」为由建立第二套控件 token
❌ xf-grid / xf-label 自写表单控件样式
```

## 模板示例

```vue
<!-- 手写 label + 控件：任意场景相同 -->
<div class="filter-field">
  <label class="filter-field__label">客户名称</label>
  <a-input v-model="q.name" size="small" allow-clear />
</div>

<!-- Arco Form：控件仍走同一套 Default -->
<a-form class="detail-form" layout="vertical" size="small" :model="form">
  <a-form-item field="name" label="客户名称">
    <a-input v-model="form.name" size="small" />
  </a-form-item>
</a-form>
```

## 相关 Reference

- Arco 写法 / 校验：`form-rules.md`
- 表单栅格布局：`detail-form.md`
- 筛选区布局（不含控件皮肤）：`filter-layout.md`
- `size="small"` 枚举：`component-size.md`
