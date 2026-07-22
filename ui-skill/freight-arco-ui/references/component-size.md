# Arco Component Size Contract

Arco exposes `size?: 'mini' | 'small' | 'medium' | 'large'`. **Omitting `size` defaults to `medium` (14px body, taller controls)** — that leaks consumer-SaaS density into this freight ops product.

This project uses **one business density**. Map Arco `size` in templates; map real heights in `global.css` via tokens.

## Global Rule

| Arco `size` | Business modules | Why |
|-------------|------------------|-----|
| **`small`** | **Required default** — all operational UI | Matches PESDP dense ops UI |
| `medium` | **Forbidden** in `src/views/**` | Arco default; 14px text breaks typography contract |
| `large` | **Forbidden** in app business area | Marketing/landing only |
| `mini` | **Do not set in templates** | Popconfirm/footer may render mini internally — normalize in `global.css` |

**Write `size="small"` explicitly** on inputs, selects, date pickers, textareas, buttons (with label), pagination, tabs, steps, tags.

## Form Controls（组件规范，非模块规范）

**完整规则 → [`form-field.md`](form-field.md)** · CSS → `global.css` **`§ Arco Form Controls`**

| 组件 | Template | Token | 高度 | 字号 |
|------|----------|-------|------|------|
| Input / Select / Picker / Number | `size="small"` | `--dense-control-h-form` | 28px | F4 12px |
| Textarea | `size="small"` | — | auto | F4 12px |
| Toolbar / footer 按钮 | `size="small"` | `--dense-control-h-nav` | 28px | F2 13px |

**不按** 列表筛选 / Modal / 详情 **分叉**控件尺寸。布局 class（`filter-field`、`detail-form-grid`）不参与控件皮肤。

## 其他 Surface Token

| 用途 | Token / class | 高度 |
|------|---------------|------|
| Table row icon | `.row-action-btn` | 22×22px |
| VXE 主表行 | `--dense-row-h` + `workbench-table` | 36px |
| VXE 详情子表行 | `detail-mini-vxe--editable` + global density variables | 38px |
| Modal / Drawer 标题 | `.arco-modal-title` | F0 14px |

## Must use `size="small"`

```
a-button (with visible label)
a-input / a-textarea / a-input-number
a-select / a-tree-select / a-cascader
a-date-picker / a-time-picker
a-pagination / a-tabs / a-steps
vxe-table (list + detail mini)
```

## Forbidden

```
❌ <a-input /> without size="small"
❌ size="medium" | size="large" in views
❌ Per-module CSS for control height ( .detail-form .arco-input { height: … } )
```

## Verification

- `node scripts/check-spec.js`
- `rg 'size="medium"|size="large"' src/views`
