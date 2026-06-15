# Component Patterns

Concrete Arco Design component usage rules for this project.
These rules directly drive visual quality, compactness, and professional feel.

---

## Global Size Rule

| Context               | Size rule                     |
|-----------------------|-------------------------------|
| List page query form  | `size="small"` on everything  |
| Table operation bar   | `size="small"` on everything  |
| Status filter chips   | Custom CSS `.filter-chip`     |
| Detail drawer form    | `size="small"` preferred      |
| Modal form            | `size="small"` preferred      |
| Page-level primary CTA| `size="medium"` is acceptable |

**Never use `size="large"` anywhere in this system.**

---

## a-button

```vue
<!-- List page: primary action -->
<a-button type="primary" size="small">新建</a-button>

<!-- List page: secondary action -->
<a-button size="small">导出</a-button>

<!-- List page: icon-only refresh -->
<a-button size="small">
  <template #icon><icon-refresh /></template>
</a-button>

<!-- Table row action (uses custom class) -->
<a-button class="table-action-btn" size="mini" type="text">查看</a-button>

<!-- Table row more menu trigger (uses custom class) -->
<a-button class="table-more-btn" size="mini" type="text">
  <template #icon><icon-more /></template>
</a-button>

<!-- Table file button (uses custom class) -->
<a-button class="table-file-btn" size="mini" type="text">
  <template #icon><icon-file /></template>文件
</a-button>
```

Button placement rule:
- Primary button goes **last** in a group (right side).
- Danger/destructive action never placed at the far right of a group.

---

## a-input

```vue
<!-- Basic input with search icon -->
<a-input v-model="value" size="small" allow-clear placeholder="请输入">
  <template #prefix><icon-search /></template>
</a-input>

<!-- Compact input without icon -->
<a-input v-model="value" size="small" allow-clear placeholder="请输入" />
```

---

## a-select

```vue
<!-- Standard select -->
<a-select
  v-model="value"
  size="small"
  allow-clear
  placeholder="请选择"
  :options="options"
/>

<!-- Searchable select (for customers, ports, vessels) -->
<a-select
  v-model="value"
  size="small"
  allow-search
  allow-clear
  placeholder="输入搜索"
  :options="options"
/>

<!-- Multi-select -->
<a-select
  v-model="values"
  size="small"
  multiple
  allow-clear
  placeholder="请选择（可多选）"
  :options="options"
/>
```

---

## a-date-picker / a-range-picker

```vue
<!-- Single date -->
<a-date-picker
  v-model="date"
  size="small"
  format="YYYY-MM-DD"
  value-format="YYYY-MM-DD"
  allow-clear
  style="width: 100%"
/>

<!-- Date range -->
<a-range-picker
  v-model="dateRange"
  size="small"
  format="YYYY-MM-DD"
  value-format="YYYY-MM-DD"
  allow-clear
  style="width: 100%"
  :shortcuts="dateShortcuts"
/>
```

Date shortcuts for range pickers:
```typescript
export const dateShortcuts = [
  { label: '今天',   value: () => [dayjs(), dayjs()] },
  { label: '本周',   value: () => [dayjs().startOf('week'), dayjs().endOf('week')] },
  { label: '本月',   value: () => [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: '近7天',  value: () => [dayjs().subtract(6, 'day'), dayjs()] },
  { label: '近30天', value: () => [dayjs().subtract(29, 'day'), dayjs()] },
  { label: '近90天', value: () => [dayjs().subtract(89, 'day'), dayjs()] },
]
```

---

## a-tag (Status Display)

Inside `.freight-table`, tag height is overridden to 18px by `global.css`.
Always pair with `.status-dot`:

```vue
<a-tag size="small" :color="statusColorMap[value]">
  <span class="status-dot" />
  {{ statusTextMap[value] }}
</a-tag>
```

Outside of a table (e.g. in drawer header):
```vue
<a-tag :color="statusColorMap[value]">
  <span class="status-dot" />
  {{ statusTextMap[value] }}
</a-tag>
```

---

## a-drawer

```vue
<!-- Standard detail drawer -->
<a-drawer
  v-model:visible="visible"
  class="order-detail-drawer"
  title="业务单详情"
  :width="720"
  :footer="false"
  unmount-on-close
>
  <template #title>
    <span style="font-size:15px;font-weight:700;">业务单详情</span>
  </template>
  <!-- content -->
</a-drawer>
```

Width guide:
- Quick view / summary: 480px
- Standard detail: 720px
- Complex multi-section detail: 960px
- Never exceed 960px for a drawer

The `.order-detail-drawer .arco-drawer-body` override sets `padding: 14px` and `background: var(--color-fill-2)`.

---

## a-modal

```vue
<a-modal
  v-model:visible="visible"
  title="操作名称"
  :width="560"
  @ok="handleOk"
  @cancel="visible = false"
>
  <!-- content -->
</a-modal>
```

Width guide:
- Simple confirm / single field: 480px
- Standard form: 560px – 680px
- Complex form: 800px
- Never use modal for advanced query

---

## a-pagination

Always placed **top-right** inside `.operation-bar`, never at the bottom.

```vue
<a-pagination
  v-model:current="currentPage"
  v-model:page-size="pageSize"
  :total="total"
  size="small"
  show-jumper
  show-page-size
  :page-size-options="[20, 50, 100]"
/>
```

---

## a-tabs (Detail Page Tabs)

Used inside drawer or detail page to switch between sections:

```vue
<a-tabs v-model:active-key="activeTab" size="small" type="line">
  <a-tab-pane key="basic" title="基本信息" />
  <a-tab-pane key="cargo" title="货物信息" />
  <a-tab-pane key="finance" title="费用" />
  <a-tab-pane key="docs" title="单证" />
  <a-tab-pane key="log" title="操作日志" />
</a-tabs>
```

---

## a-form (in Drawer / Modal)

```vue
<a-form :model="form" layout="inline" size="small" auto-label-width>
  <a-row :gutter="[12, 8]">
    <a-col :span="12">
      <a-form-item field="CustomerName" label="客户名称" required>
        <a-input v-model="form.CustomerName" placeholder="请输入" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item field="Salesman" label="业务员">
        <a-input v-model="form.Salesman" placeholder="请输入" allow-clear />
      </a-form-item>
    </a-col>
  </a-row>
</a-form>
```

Form layout rule:
- Drawer body: 2-column grid (`span="12"`)
- Simple modal: 1-column (`span="24"`)
- Complex modal: 2-column (`span="12"`)
- Label width: use `auto-label-width` or fixed `80px`

---

## a-badge (Active Filter Count)

Show active advanced filter count on the "更多" button:

```vue
<a-button size="small" type="text" @click="$emit('openAdvanced')">
  更多<a-badge v-if="activeCount" :count="activeCount" />
</a-button>
```

---

## a-switch

```vue
<a-switch v-model="mergeCells" size="small" />
```

Always `size="small"` when used inline with text in a toolbar or search panel.

---

## a-message / a-notification

For operation feedback:

```typescript
import { Message } from '@arco-design/web-vue'

// Success — short, auto-dismiss
Message.success('操作成功')

// Error — explicit
Message.error('操作失败，请重试')

// Warning
Message.warning('请先选择数据')
```

Never use `a-alert` inside a form for inline operation result — use `Message` instead.
