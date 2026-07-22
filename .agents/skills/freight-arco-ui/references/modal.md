# Modal And Overlay Patterns

## Modal vs Drawer

Choose the container based on the operation, not convenience.

| Container | Use when | Width |
|-----------|----------|-------|
| `a-modal` | Focused single action, short form (≤ 8 fields), confirmation | See **`overlay-dimensions.md`** (420–860px tiers) |
| `a-drawer` | Long multi-section form, detail with nested tables, advanced filters | See **`overlay-dimensions.md`** (D1–D4 tiers) |
| Inline expand | Filter expansion, inline table row edit | No overlay |

Do not use a modal for frequent advanced search — it interrupts the scan-and-adjust workflow.

Do not force a complex multi-section detail into a modal. If the content needs tabs, mini tables, or file lists, use a Drawer.

## Modal Dimensions

Full tier table and token names: **`overlay-dimensions.md`**.

| Content type | Width token |
|-------------|-------------|
| Confirmation / single field | `--dense-modal-w-confirm` (420px) |
| Short form (≤ 6 fields) | `--dense-modal-w-md` (560px) or `--dense-modal-w-lg` (640px) |
| Form with a mini table | `--dense-modal-w-xl`–`--dense-modal-w-max` (760–860px) |

Set `:width` explicitly on every `<a-modal>` to a token value. **Hard max 860px.**

## Modal Structure

```vue
<a-modal
  v-model:visible="visible"
  title="添加联系人"
  :width="560"
  :mask-closable="false"
  :on-before-ok="handleBeforeOk"
  @cancel="handleCancel"
>
  <a-form
    ref="formRef"
    :model="form"
    layout="vertical"
    size="small"
    class="detail-form"
  >
    <div class="filter-grid filter-grid--2col">
      <a-form-item field="name" label="姓名" :rules="[{ required: true }]">
        <a-input v-model="form.name" size="small" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item field="phone" label="电话">
        <a-input v-model="form.phone" size="small" placeholder="请输入电话" />
      </a-form-item>
    </div>
  </a-form>
</a-modal>
```

`handleBeforeOk` must return `true` only after validation and persistence succeed. Return `false` for validation, business rejection, or request failure so the modal remains open with the user's input preserved.

## Modal Footer Buttons

Use the `actions.md` section 4.7 recipe. Do not add extra buttons beyond cancel / confirm / delete.

```vue
<template #footer>
  <div style="display:flex; justify-content:space-between; align-items:center">
    <!-- Left: danger action only when editing existing record -->
    <a-button v-if="isEdit" type="text" status="danger" size="small" @click="handleDelete">
      删除
    </a-button>
    <div style="display:flex; gap:8px; margin-left:auto">
      <a-button size="small" @click="handleCancel">取消</a-button>
      <a-button size="small" type="primary" :loading="submitting" @click="handleOk">确定</a-button>
    </div>
  </div>
</template>
```

- Cancel = `secondary` (default, no `type`)
- Confirm = `primary` (one per modal)
- Delete = `text` + `danger` (left side, only in edit mode; triggers `Modal.confirm` inside)
- Do not add `outline` buttons to modal footer

## Confirmation Modal (`Modal.confirm`)

Use `Modal.confirm` (programmatic) for irreversible operations triggered from dropdown items, footer danger actions, or batch operations.

```ts
Modal.confirm({
  title: '确认废弃业务单',
  content: '废弃后业务单将无法恢复，是否继续？',
  okText: '确认废弃',
  okButtonProps: { status: 'danger', size: 'small' },
  cancelText: '取消',
  onOk: async () => { await doAbandon() },
})
```

Rules:

- `title` names the business action, not "确认操作".
- `content` describes the consequence, especially for irreversible operations.
- `okText` repeats the action verb: "确认废弃", "确认删除", "确认提交".
- `okButtonProps.status = 'danger'` for destructive confirm; normal for non-destructive.
- Do not use `window.confirm()` or `window.alert()`.

## Batch Operation Confirm

Batch operations that affect multiple records must show the count:

```ts
Modal.confirm({
  title: `确认批量提交 ${selectedCount} 票业务单？`,
  content: '提交后将推送至操作系统，请确认已核对数据。',
  okText: '确认提交',
  cancelText: '取消',
  onOk: async () => { await batchSubmit(selectedIds) },
})
```

## Form Validation Display

- Use Arco's `a-form` + `a-form-item` built-in validation. Do not write custom error `<div>` below inputs.
- Trigger validation on submit (`formRef.validate()`), not on every keystroke.
- Required mark: Arco adds `*` automatically via `:rules`. Do not duplicate it in the label text.
- After a failed submit, scroll to the first error field.
- After success: `Message.success('保存成功')` then close modal.
- After failure: `Message.error('保存失败，请稍后重试')` and keep modal open.

## Content Density Inside Modal

- Use `size="small"` on all Arco controls inside the modal form.
- Use `layout="vertical"` on the form — horizontal labels compress too much at modal widths.
- Use `class="detail-form"` on the `<a-form>` to inherit the 12px control token.
- Use `filter-grid--2col` or `filter-grid--3col` grid for multi-column layouts; do not use raw `display:grid` with inline gap values.
- Do not add section cards or nested cards inside modal content — one flat form surface.

## Modal Typography

- Modal title: F0 `--dense-font-overlay` **14px / 600** — overridden in `global.css` (`.arco-modal-title`). Must be larger than form body.
- Form inside modal: `a-form` + `class="detail-form"` + `size="small"` on all controls.
- Form labels: F4 12px / `color-text-2` / weight 500.
- Form values / placeholders: F4 Control 12px (same size; color/weight differ).
- Footer buttons: F2 Nav 13px.
- Do not hardcode 14px in modal content fields; 14px is reserved for F0 chrome title only.
