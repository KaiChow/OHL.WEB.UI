# Modal And Overlay Patterns

> Class names and --dense-* tokens in this document are the reference implementation; the rules are the contract, the symbols are replaceable.

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

Tier selection criteria and width values: **`overlay-dimensions.md`**.

| Content type | Width token |
|-------------|-------------|
| Confirmation / single field | `--dense-modal-w-confirm` |
| Short form | `--dense-modal-w-md` by default; move up a tier only per `overlay-dimensions.md` |
| Form with a mini table | `--dense-modal-w-xl`–`--dense-modal-w-max` |

Set `:width` explicitly on every `<a-modal>` to one declared tier. Choose the smallest tier that preserves readable labels, validation, and footer actions without horizontal overflow. **Hard max 860px.**

## Overlay Intent And Close Policy

Declare every Modal or Drawer as one interaction intent before choosing close behavior. The intent is a contract; a component name or wrapper is not required.

| Intent | Mask close | Escape | Footer | Close contract |
| --- | --- | --- | --- | --- |
| Confirm | No | Yes | Cancel + named confirm/danger action | Cancel leaves the underlying state unchanged; destructive confirm focuses the safer action first |
| View | Yes | Yes | Close only, or no footer when the native close control is sufficient | Closing returns focus and list context to the trigger |
| Edit | No | No | Cancel + one primary save/submit | Pending blocks every close path; dirty cancel, close, and route leave require discard confirmation |

Use `unmount-on-close` for task overlays unless a documented state-preservation contract requires otherwise. Validation or persistence failure keeps an Edit overlay open with its values and error owner intact. Advanced-filter drawers follow `filter-layout.md`: Escape must not close the drawer while a portaled picker owns the key event, and unapplied draft conditions require an explicit apply/discard decision.

Custom interactive overlays may be at most two layers deep. A Drawer may open one selector or confirmation Modal; a third layer requires restructuring into one Drawer, tabs/steps, fullscreen, or a routed page. Closing the second layer returns focus to the control that opened it inside the first layer.

## Modal Submit Contract

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
  title: '确认废弃工单',
  content: '废弃后工单将无法恢复，是否继续？',
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

- Modal-form controls inherit the app-wide `small`; declare it only when an explicit local override improves clarity.
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
- [ ] Confirm, View, or Edit intent is explicit; mask, Escape, pending-close, dirty-close, footer, and focus-return behavior match the intent.
- [ ] Open focuses a useful control, validation focuses the first invalid field, close returns focus to the trigger, and nested overlays never exceed two interactive layers.
- [ ] GI owns modal chrome; no page/global selector rewrites header, body, footer, radius, shadow, or typography.
