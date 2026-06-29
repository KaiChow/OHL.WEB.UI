# Arco Component Size Contract

Arco exposes `size?: 'mini' | 'small' | 'medium' | 'large'`. **Omitting `size` defaults to `medium` (14px body, taller controls)** — that leaks consumer-SaaS density into this freight ops product.

This project uses **one business density**. Map Arco `size` in templates; map real heights in `global.css` via `--dense-control-h-*` tokens.

## Global Rule

| Arco `size` | Business modules | Why |
|-------------|------------------|-----|
| **`small`** | **Required default** — list, filter, toolbar, drawer, form, table-in-cell, pagination, tabs, steps | Matches PESDP dense ops UI; `global.css` binds it to F4/F2 tokens |
| `medium` | **Forbidden** in `src/views/**` | Arco default; 14px text breaks typography contract |
| `large` | **Forbidden** in app business area | Marketing/landing only, not freight consoles |
| `mini` | **Do not set in templates** | Popconfirm/footer may render mini internally — normalize in `global.css`, not per page |

**Write `size="small"` explicitly** on inputs, selects, date pickers, textareas, buttons (with label), pagination, tabs, steps, tags in operational pages. Do not rely on omission.

## Size → Token Mapping (`global.css`)

**表单字段统一规范见 [`form-field.md`](form-field.md)** — CSS 区块 `§ Form Field Contract`。

| Surface | Template `size` | Height token | Value | Typography |
|---------|-----------------|--------------|-------|------------|
| **All form fields**（filter / detail / modal / search） | `small` | `--dense-control-h-form` | **28px** | F4 Control 12px |
| Toolbar / footer / section actions | `small` | `--dense-control-h-nav` | 28px | F2 Nav 13px (buttons) |
| Detail / table cell editors | `small` | `--dense-control-h-form` | 28px | F4 Control 12px |
| Table row icon actions | *(no size or `small`)* | `.row-action-btn` | 22×22px | icon token 14px |
| VXE main list table | `size="small"` + `class="compact"` | `--dense-row-h` | 36px row | F1 13px cells |
| VXE detail mini table | `size="small"` + `detail-mini-vxe` | row-config `height` | 38px row | F1 13px / F4 in cells |
| Overlay confirm buttons | *(Arco mini internally)* | override in `global.css` | 28px | F2 Nav 13px |
| Overlay modal/popover title | *(portal)* | `.arco-modal-title` | — | F0 Overlay **14px** |
| Overlay modal body / dropdown options | *(portal)* | match trigger | 28px row | F4 Control 12px |

Legacy aliases `--dense-control-h-filter` / `--dense-control-h-detail` both point to `--dense-control-h-form`. Do not assign them different values.

Heights are **not** Arco's stock small/medium table — they are project overrides. Always pair template `size="small"` with the correct surface class (`filter-field`, `detail-form`, `detail-drawer`, `detail-mini-vxe`).

## By Component

### Must use `size="small"`

```
a-button (with visible label)
a-input / a-textarea / a-input-number
a-select / a-tree-select / a-cascader
a-date-picker / a-time-picker
a-pagination
a-tabs / a-steps
a-tag (in tables and forms)
a-radio-group / a-checkbox-group (when not icon-only)
vxe-table (list + detail mini)
```

### Exceptions

| Component | Size rule |
|-----------|-----------|
| `row-action-btn` icon-only | Fixed 22px in `global.css`; `size` optional |
| `a-button type="text"` close/back in drawer head | May omit `size` when using `row-action-btn` |
| Shell / layout chrome (`BasicLayout`) | Out of scope unless it enters business forms |
| `Modal` / `Drawer` | No `size` prop — typography via `global.css` on `.arco-modal-*` / `.detail-drawer` |

### Forbidden patterns

```
❌ <a-input />                    → defaults medium
❌ <a-button>保存</a-button>     → defaults medium
❌ size="medium" in views
❌ size="large" in views
❌ size="mini" on labeled buttons in drawer/forms
❌ Mixing medium filter + small table on same list page
```

### Correct patterns

```vue
<!-- List filter -->
<a-input v-model="q" size="small" allow-clear />
<a-select v-model="status" size="small" allow-clear />

<!-- Toolbar -->
<a-button size="small" type="primary">查询</a-button>
<a-button size="small" type="text" class="reset-btn">重置</a-button>

<!-- Detail form -->
<a-form class="detail-form" layout="vertical" size="small">

<!-- Table in cell -->
<a-select v-model="row.unit" size="small" />

<!-- Row icon -->
<a-button type="text" class="row-action-btn" status="danger">
  <icon-delete />
</a-button>
```

## Relationship To Typography

| Token | Size | Bound to Arco |
|-------|------|----------------|
| F1 `--dense-font-data` | 13px | VXE cells, links — **not** a substitute for control `size` |
| F2 `--dense-font-nav` | 13px | `arco-btn-size-small`, overlay footer buttons |
| F4 `--dense-font-control` | 12px | `arco-*-size-small` inputs/selects/pickers |
| F6 `--dense-font-micro` | 10px | badges, units — **never** button labels |

See `typography.md` for weight/color; this file owns **which Arco `size` to pass**.

## Verification

- `node scripts/check-spec.js` — fails on `size="medium"`, `size="large"`, `size="mini"` in `src/views`
- Grep audit: `rg 'size="medium"|size="large"|size="mini"' src/views`

## AI / Codegen

When generating operational pages:

1. Default every Arco control to `size="small"`.
2. Never emit `medium` or omit `size` on form controls.
3. VXE list tables: `size="small"` + `class="compact workbench-table"`.
4. VXE detail tables: `size="small"` + `class="detail-mini-vxe"`.
5. Do not use `mini` to “save space” — use `row-action-btn` + tooltip for row actions.
