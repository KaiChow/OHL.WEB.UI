# States Patterns

Rules for loading, empty, and error states. These appear on every page and directly affect perceived quality.

---

## Loading State

### Table Loading

Wrap the vxe-table with a `v-loading` directive or use vxe-table's built-in loading prop:

```vue
<div class="table-wrap data-section" v-arco-loading="loading">
  <sale-order-toolbar ... />
  <sale-order-status-filters ... />
  <vxe-table class="freight-table" :loading="loading" :data="rows" ...>
    ...
  </vxe-table>
</div>
```

Or using Arco Design Spin:

```vue
<a-spin :loading="loading" tip="数据加载中...">
  <vxe-table class="freight-table" :data="rows" ...>
    ...
  </vxe-table>
</a-spin>
```

Rules:
- Show loading state immediately on any data fetch.
- The loading overlay should cover only the data area, not the search panel.
- Never show a blank white area while loading.
- Operation buttons should be disabled while loading to prevent double submit.

### Button Loading

```vue
<a-button type="primary" size="small" :loading="submitting" @click="handleSubmit">
  提交
</a-button>
```

Always set `:loading="true"` on the triggered button during async operations. This prevents double-click and gives immediate feedback.

---

## Empty State

### Table Empty State

vxe-table shows empty state automatically when `:data="[]"`. Override its appearance:

```vue
<vxe-table class="freight-table" :data="rows" ...>
  <template #empty>
    <div class="table-empty-state">
      <icon-search style="font-size: 36px; color: var(--color-text-4); margin-bottom: 8px;" />
      <div class="table-empty-state__title">暂无数据</div>
      <div class="table-empty-state__desc">请调整查询条件后重新搜索</div>
      <a-button size="small" style="margin-top: 12px;" @click="$emit('reset')">重置条件</a-button>
    </div>
  </template>
  ...
</vxe-table>
```

```css
/* Add to global.css */
.table-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--color-text-3);
}

.table-empty-state__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-2);
  margin-bottom: 4px;
}

.table-empty-state__desc {
  font-size: 12px;
  color: var(--color-text-3);
}
```

### Differentiate Empty Reasons

Use different messages depending on context:

| Situation                  | Icon           | Title          | Description                        |
|----------------------------|----------------|----------------|------------------------------------|
| No search results          | icon-search    | 暂无数据       | 请调整查询条件后重新搜索             |
| No data yet (new module)   | icon-file      | 暂无业务单     | 点击「创建业务单」开始              |
| Permission denied          | icon-lock      | 无访问权限     | 请联系管理员申请权限                 |
| Filter active, no results  | icon-filter    | 当前筛选无数据 | 点击「全部」查看完整列表             |

---

## Error State

### Network / API Error in Table

```vue
<template v-if="error">
  <div class="table-error-state">
    <icon-wifi-off style="font-size: 36px; color: var(--color-text-4); margin-bottom: 8px;" />
    <div class="table-empty-state__title">数据加载失败</div>
    <div class="table-empty-state__desc">{{ error }}</div>
    <a-button size="small" type="outline" style="margin-top: 12px;" @click="$emit('retry')">
      <template #icon><icon-refresh /></template>
      重新加载
    </a-button>
  </div>
</template>
```

```css
.table-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--color-text-3);
}
```

### Operation Feedback (Message)

```typescript
import { Message } from '@arco-design/web-vue'

// Success — 2s auto dismiss
Message.success('操作成功')

// Error — show reason, 4s
Message.error('保存失败：' + errorMessage)

// Warning — needs attention
Message.warning('请先选择要操作的数据')

// Info
Message.info('数据刷新中...')
```

Rules:
- Success messages: auto-dismiss after 2–3s.
- Error messages: show specific reason, not just "操作失败".
- Never use `window.alert()`.
- Never silently fail — every async operation must have at least a success or error message.

### Destructive Operation Confirm

```vue
<a-popconfirm
  content="确认删除该记录？删除后不可恢复。"
  type="warning"
  ok-text="确认删除"
  cancel-text="取消"
  @ok="handleDelete"
>
  <a-button size="small" status="danger" type="text">删除</a-button>
</a-popconfirm>
```

Always use `a-popconfirm` for destructive actions. Never use `window.confirm()`.

---

## Form Validation State

```vue
<a-form ref="formRef" :model="form" :rules="rules" size="small">
  <a-form-item field="CustomerName" label="客户名称" required>
    <a-input v-model="form.CustomerName" placeholder="请输入客户名称" allow-clear />
  </a-form-item>
</a-form>
```

Validation rules:
- Validate on blur, not on every keystroke.
- Show error message below the field in red.
- On submit: validate all fields, scroll to first error automatically.
- Required fields: show red asterisk via Arco Design's built-in `required` prop.

---

## Skeleton / Placeholder

For detail drawers that load data asynchronously:

```vue
<template v-if="loading">
  <a-skeleton :animation="true">
    <a-skeleton-line :rows="6" />
  </a-skeleton>
</template>
<template v-else>
  <!-- actual content -->
</template>
```

Use skeleton for:
- Detail drawer content loading
- Dashboard card loading
- First-time page load

Use spin overlay for:
- Table data refreshing (data is already visible underneath)
- Form submitting
