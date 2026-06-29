# Form Field Contract — 统一表单字段规范

**CSS 唯一事实源：** `src/styles/global.css` → `§ Form Field Contract`

列表筛选、筛选抽屉、Modal、详情、高级查询 **共用同一套** label / 控件尺寸 / 间距。禁止在页面 scoped 或各 surface 区块重复写控件高度与字号。

## Surface（容器类名）

| Surface | 用途 | 模板写法 |
|---------|------|----------|
| `.filter-field` | 列表顶栏筛选 | `<div class="filter-field"><label class="filter-field__label">…</label><a-input size="small" /></div>` |
| `.filter-inline` | 1–3 字段紧凑筛选 | 外层 `filter-inline` + 内嵌控件 |
| `.detail-form` | Modal / Drawer / 详情 / 筛选抽屉表单 | `<a-form class="detail-form" layout="vertical" size="small">` |
| `.search-form` | 旧式横向搜索区（仍须遵守本 contract） | `<a-form class="search-form">` |

**Must:** 所有业务表单控件 `size="small"`。  
**Must not:** 在 `src/views/**` 为 input/select/picker 单独写 height / font-size。

## Token（`:root`）

| Token | 值 | 用途 |
|-------|-----|------|
| `--dense-control-h-form` | **28px** | 单行控件外框高度（**唯一高度源**） |
| `--dense-control-lh-form` | 26px | 控件内文字行高（h − 2px） |
| `--dense-font-field` | 12px / 500 | Label（F4 Field） |
| `--dense-font-control` | 12px / 400–500 | 输入值、placeholder（F4 Control） |
| `--dense-gap-label` | **4px** | Label → 控件间距 |
| `--dense-gap-field-row` | 8px | `a-form-item` 行间距 |
| `--dense-gap-field-col` | 12px | `detail-form-grid` 列间距 |

别名（兼容旧引用，勿在新代码中单独改值）：

- `--dense-control-h-filter` → `var(--dense-control-h-form)`
- `--dense-control-h-detail` → `var(--dense-control-h-form)`

## 统一尺寸

| 项 | 规范 |
|----|------|
| Label | F4 · 12px · 500 · `text-2` · `line-height: 1.35` |
| Label → 控件 | `--dense-gap-label`（4px） |
| Input / Select / Date / Number | 外框 **28px**，内文 **12px**，行高 **26px** |
| Textarea | 12px，行高 1.45，**不参与** 28px 固定高 |
| Placeholder | 12px，字重降级，颜色 `text-3` |
| Hover / Focus | 全 surface 同一套 primary 边框 + focus ring |

## 例外 Surface（特殊需求）

| Surface | 差异 | 原因 |
|---------|------|------|
| `.detail-mini-vxe` | 单元格内透明边框，hover 才显形 | 表格行内编辑 |
| `.filter-field` | 控件多一层 inset box-shadow | 列表筛选扫描区轻强调 |
| Toolbar `a-button` | `--dense-control-h-nav` 28px · F2 13px | 按钮非表单字段 |
| VXE 主表 | 行高 36px · F1 13px | 数据阅读，非表单 |

**禁止** 为 Modal / 详情 / 筛选抽屉单独写一套控件 CSS。

## 正确示例

```vue
<!-- 列表筛选 -->
<div class="filter-field">
  <label class="filter-field__label">客户名称</label>
  <a-input v-model="q.name" size="small" allow-clear />
</div>

<!-- Modal / Drawer -->
<a-form class="detail-form" layout="vertical" size="small" :model="form">
  <div class="detail-form-grid detail-form-grid--2">
    <a-form-item field="name" label="客户名称">
      <a-input v-model="form.name" size="small" />
    </a-form-item>
    <a-form-item field="country" label="国家">
      <a-select v-model="form.country" size="small" allow-clear />
    </a-form-item>
  </div>
</a-form>
```

## 禁止

```
❌ xf-grid / xf-label 自写表单（用 detail-form）
❌ 在 filter-field / detail-form 外裸放 a-form-item 且无 surface class
❌ 各页面 scoped 写 .arco-input-wrapper { height: … }
❌ 筛选 32px + 表单 28px 双标准（已统一为 --dense-control-h-form）
❌ query-filter-drawer 单独改 label margin（走 --dense-gap-label）
```

## 相关 Reference

- 表单 Arco 写法：`form-rules.md`
- 栅格与分区：`detail-form.md`
- 筛选布局：`filter-layout.md`
- Arco size 枚举：`component-size.md`
