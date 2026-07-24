# Arco Form Controls — 组件统一规范

**控件基础：** Arco Design Vue form controls.

**样式所有者：** GI Arco theme. Project CSS must not normalize or reskin framework control internals globally.

规范按 **Arco 组件 + 使用场景** 组织，**不按** 列表 / 详情 / Modal / 筛选等业务模块分叉。  
同一 `a-input` / `a-select` / `a-date-picker` 在任意页面须呈现相同尺寸与字号。

## 原则

1. 模板统一 `size="small"`（见 `component-size.md`）
2. 先使用 Arco 原生控件、props、插槽与表单布局；不以全局 CSS 修正框架内部字号或皮肤
3. 控件外观由 GI 负责；`filter-field` / `detail-form` / `detail-drawer` 等布局 class 只管理排列、间距和宽度
4. 布局 class（`filter-field`、`detail-form-grid`）只管 **排列与栅格**，不管控件皮肤
5. **同一 Arco 组件在任意业务场景使用同一字号层级**：`a-input` / `a-select` / `a-date-picker` / `a-input-number` / `a-textarea` 的值与 placeholder 一律 F4 Control 12px；不得因为它出现在列表筛选、弹窗表单、详情编辑或查询抽屉里就切换成另一档字号
6. **同一信息角色使用同一字号层级**：业务内容（label、字段值、表格单元格、链接）一律 **12px**；导航与按钮文字一律 F2 **13px**

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
| 外框与字号 | GI `size="small"` 原生值 |
| 边框、Hover / Focus | GI 原生交互状态，不覆盖 |

## 字段名（Field label）

| 写法 | 说明 |
|------|------|
| `.field-label` | 推荐通用 class |
| `.filter-field__label` | 与 `.field-label` 同规范（布局 BEM 别名） |
| `.arco-form-item-label > label` | `a-form layout="vertical"` 内置 label |

手写业务标签使用 F4 token；`a-form-item` 标签保持 GI 原生层级。两者靠结构、间距和明确分组保持一致，不通过全局内部选择器强制同字号。

## 使用场景（Scenario）

仅以下 **场景** 允许覆盖 Default；不得按业务模块新增场景。

| 场景 | 选择器 / 条件 | 差异 |
|------|----------------|------|
| **Textarea 多行** | `.arco-textarea-size-small` | 不固定 28px 高；行高 1.45 |
| **Disabled / 只读** | `.arco-*-disabled` | 灰底；文字仍 `text-1` 可读 |
| **Form-item 列宽** | `.arco-form-item-content >` | 控件 `width: 100%` |
| **表格行内编辑** | `.detail-mini-vxe` | 控件使用原生 small 外观；单元格内只读值勿用 `link-text`（见 `table.md`） |
| **组合控件** | `.filter-combo` / `.detail-combo` | 多控件拼接圆角（布局 struct，非模块） |
| **分页跳转等** | `.table-card-cap__pager` | 分页专用（非表单字段） |

### Typography Contract By Role

| Role | Token | Size |
|------|-------|------|
| Field label | `--dense-font-field` | 12px |
| Editable control value | `--dense-font-control` | 12px |
| Editable control placeholder | `--dense-font-control` | 12px |
| Read-only detail value (`.detail-field__val`) | `--dense-font-control` | 12px |
| Table cell / link text | `--dense-font-data` | 12px |
| Button / tab / pager trigger | `--dense-font-nav` | 13px |
| Pager summary / helper / weak meta | `--dense-font-aux` | 11px |

Do not create page-local variants such as “drawer select uses 13px” or “toolbar button uses 12px”. The surface may change; the component role does not.

## 禁止

```
❌ 在 global.css 为 .detail-drawer / .detail-form / .filter-field 单独写控件 height、font-size
❌ 在 src/views scoped 覆盖 .arco-input-wrapper 尺寸
❌ 以「列表筛选」「Modal 表单」为由建立第二套控件 token
❌ xf-grid / xf-label 自写表单控件样式
❌ 因为控件所在页面不同，就把同一 Arco 组件切成 12px / 13px 两套值文字
❌ 把按钮文字写成 F4 12px；按钮/Tab/分页触发器属于 F2 Nav 13px
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
