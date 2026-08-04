# Arco Component Size Contract

Arco exposes `size?: 'mini' | 'small' | 'medium' | 'large'`. The application-level ConfigProvider sets the inherited default to `small`, so operational form controls do not fall back to Arco's standalone `medium` default.

This project uses **one business density**, not one literal size prop. Form and ordinary controls inherit `small`; controls inside compact VXE rows use `mini` so their rendered box fits the row. Forcing both surfaces to the same prop either clips table controls or makes page controls too small.

## Global Rule

| Arco `size` | Business modules | Why |
|-------------|------------------|-----|
| **`small`** | **Required default** — all operational UI outside tables | Matches PESDP dense ops UI |
| `medium` | **Forbidden** in `src/views/**` | Arco default; 14px text breaks typography contract |
| `large` | **Forbidden** in app business area | Marketing/landing only |
| `mini` | **Only inside `vxe-table` rows**（行操作按钮、可编辑单元格控件） | mini 行内容盒 24px，`small` 28px 会裁切 |

Form and ordinary business controls inherit `small` from `App.vue` (`<a-config-provider size="small">`). An explicit `size="small"` is optional documentation, not a requirement. **Arco controls rendered inside a `vxe-table` row write `size="mini"`**, because the table's compact row box does not inherit the page-control density safely.

## Form Controls（组件规范，非模块规范）

**完整规则 → [`form-field.md`](form-field.md)**

| 组件 | Template | Token | 高度 | 字号 |
|------|----------|-------|------|------|
| Input / Select / Picker / Number | `size="small"` | `--dense-control-h-form` | 28px | F4 12px |
| Textarea | `size="small"` | — | auto | F4 12px |
| Toolbar / footer 按钮 | `size="small"` | `--dense-control-h-nav` | 28px | F2 13px |

**不按** 列表筛选 / Modal / 详情 **分叉**控件尺寸。布局 class（`filter-field`、`detail-form-grid`）不参与控件皮肤。

## 其他 Surface Token

| 用途 | Token / class | 高度 |
|------|---------------|------|
| Table row action | `.row-action-btn` | 24×24px minimum target；直出为文字按钮（业务动词），`···` 为唯一 icon 触发器 |
| VXE 主表行 | 全局默认 `mini`（main.ts） | `mini`（36px）compact / `medium`（44px）standard override |
| VXE 详情子表行 | `size="mini"` | shared mini row; row controls explicitly use mini and must remain unclipped |
| Modal / Drawer 标题 | Arco native title slot | GI-owned |

## Inherited `small` surfaces

```
a-button (with visible label)
a-input / a-textarea / a-input-number
a-select / a-tree-select / a-cascader
a-date-picker / a-time-picker
a-pagination / a-tabs / a-steps
```

The controls above inherit `small`; declare it only when an explicit local override improves clarity.

## Must use `size="mini"`（仅限 vxe-table 行内）

```
行操作 a-button（row-actions 内）
可编辑单元格内的 a-input / a-select / a-date-picker
```

## Forbidden

```
❌ <a-input /> without size="small"
❌ size="medium" | size="large" in views
❌ vxe-table 行内出现 size="small" 或更大的 Arco 控件（mini 行内容盒 24px，会裁切）
❌ Per-module CSS for control height ( .detail-form .arco-input { height: … } )
❌ Row action target below 24×24px
```

## Verification

- `node scripts/check-spec.js`
- `rg 'size="medium"|size="large"' src/views`
