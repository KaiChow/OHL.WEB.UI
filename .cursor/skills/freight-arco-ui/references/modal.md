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
| Short form (≤ 6 fields) | `--dense-modal-w-md` (560px) by default; use `--dense-modal-w-lg` (640px) only for two-column fields, long bilingual labels, or persistent validation/help copy |
| Form with a mini table | `--dense-modal-w-xl`–`--dense-modal-w-max` (760–860px) |

Set `:width` explicitly on every `<a-modal>` to one declared tier. Choose the smallest tier that preserves readable labels, validation, and footer actions without horizontal overflow. **Hard max 860px.**

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
    <a-row :gutter="[16, 8]">
      <a-col :span="12"><a-form-item field="name" label="姓名" :rules="[{ required: true }]">
        <a-input v-model="form.name" size="small" placeholder="请输入姓名" />
      </a-form-item></a-col>
      <a-col :span="12"><a-form-item field="phone" label="电话">
        <a-input v-model="form.phone" size="small" placeholder="请输入电话" />
      </a-form-item></a-col>
    </a-row>
  </a-form>
</a-modal>
```

`handleBeforeOk` must return `true` only after validation and persistence succeed. Return `false` for validation, business rejection, or request failure so the modal remains open with the user's input preserved.

## Modal Footer Buttons

Use the `actions.md` section 4.7 recipe. Do not add extra buttons beyond cancel / confirm / delete.

```vue
<template #footer>
  <a-row justify="space-between" align="center">
    <a-col><a-button v-if="isEdit" type="text" status="danger" size="small" @click="handleDelete">删除</a-button></a-col>
    <a-col><a-space :size="8"><a-button size="small" @click="handleCancel">取消</a-button><a-button size="small" type="primary" :loading="submitting" @click="handleOk">确定</a-button></a-space></a-col>
  </a-row>
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
- After success: close only after persistence succeeds, then refresh the feature-contract owner and show concise success feedback there or by Message.
- After failure: keep the modal and user input, show field errors at fields and unknown/business errors in the modal surface; Message may summarize but cannot be the sole error owner.

## Content Density Inside Modal

- Use `size="small"` on all Arco controls inside the modal form.
- Use `layout="vertical"` on the form — horizontal labels compress too much at modal widths.
- Use `class="detail-form"` only as a local form-layout hook; GI owns label/control styling.
- Use Arco `a-row` / `a-col` for multi-column layouts. Page-local grid is allowed only for a proven relationship Arco Grid cannot express.
- Do not add section cards or nested cards inside modal content — one flat form surface.

## Modal Typography

- Modal title uses Arco's native title slot and GI typography; do not override `.arco-modal-title` globally.
- Form inside modal: `a-form` + `class="detail-form"` + `size="small"` on all controls.
- Form labels, values, placeholders, and footer buttons keep GI native small typography.
- Custom helper/meta text uses project typography tokens; do not override modal or form-control internals.

## Release Gate

- [ ] The overlay owns one focused job; content that needs tabs, many sections, or large child tables routes to Drawer/full page.
- [ ] Width comes from the declared tier and remains within the viewport inset without internal horizontal overflow.
- [ ] Form submit uses `on-before-ok`, one primary action, button loading, duplicate-submit protection, and preserved input on failure.
- [ ] Destructive confirmation names the object, action, and consequence; batch confirmation includes the affected count.
- [ ] Open focuses a useful control, validation focuses the first invalid field, close returns focus to the trigger, and dirty close is confirmed.
- [ ] GI owns modal chrome; no page/global selector rewrites header, body, footer, radius, shadow, or typography.
