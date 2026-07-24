# Feedback: Loading, Empty, Error, Success

## Purpose

Unified interaction feedback across **all domains** (operations, CRM, settings, BI). Use Arco components first; use a shared project class only when grep proves its implementation. No `alert()` / `window.confirm`.

## Success & Warning

| Scenario | Component | Copy pattern |
|----------|-----------|--------------|
| Save/submit OK | `Message.success` | `保存成功` / `已提交` / `已发布 N 条` |
| Partial batch OK | `Message.warning` | `N 条成功，M 条失败` + link/button 查看失败明细 |
| Irreversible done | `Message.success` | Repeat verb: `已停用` / `已删除` |
| Background job started | `Notification.info` | `导出任务已开始，完成后将通知您` |

Rules:

- Mention the **business object** in copy: `业务单保存成功`, not `操作成功`.
- Destructive success still uses `success`, not `warning`.

## Error

| Scenario | Component | Copy |
|----------|-----------|------|
| API/network | Owning surface error + optional `Message.error` summary | `业务单保存失败，请重试` |
| Validation | Arco `a-form-item` inline | Field rule `message` |
| Permission | Hidden/disabled action or local no-permission state from contract | `无权限执行此操作` |
| Upload | Upload item/field error + optional Message summary | `文件超过 20MB 限制` / `仅支持 PDF、Excel…` |

Keep modal/drawer **open** after save failure.

## Exception Locality

An error appears where the user can fix it. A global Message may summarize failure, but it never replaces the local marker.

| Error owner | Required placement | Required behavior |
|-------------|--------------------|-------------------|
| Form field | Arco Form Item validation | retain input; focus or scroll to the first invalid field |
| Table cell/row | affected cell or a status/action area inside the row | keep row identity visible; offer retry/fix/view-detail beside the error |
| Batch subset | marked failed rows plus a compact batch summary | preserve selection of failed items; expose failure reason per row |
| Section/module | the section head/body that owns the request | keep other sections usable; retry locally |
| Modal/drawer submit | inside the open overlay | keep the overlay and entered values; do not close on failure |
| Permission | disabled/hidden action or local no-permission state according to contract | explain why when showing a disabled action; do not reveal forbidden data |

API field paths must map to the corresponding form item. Unknown/global errors stay in the owning surface and include a retry or trace identifier when the backend provides one.

For Arco Modal validation, bind `:on-before-ok="submit"` and return `false` when local validation or the request fails. Do not use `@ok` for a submit that can fail: Arco will continue its default close flow, briefly show errors, then destroy the user's context. Return `true` only after success; preserve input and focus the first invalid field on `false`.

## Loading

| Surface | Pattern |
|---------|---------|
| Workbench table | `vxe-table :loading="loading"` |
| Submit button | `:loading="submitting"` — block double click |
| Full page first paint | Arco Skeleton rows or table loading — not blank white |
| Panel refresh | Arco Spin on the owning panel only |
| Button async | `:loading` on that button |

Forbidden: full-screen spinner that hides filter + toolbar on every refresh.

## Empty States

Use Arco Empty or a small local empty-state layout. Do not assume a shared empty-state class exists without grep. Icon: Arco icon only — no emoji.

| Context | Condition | Content |
|---------|-----------|---------|
| List no data (no filter) | `!loading && rows.length===0` | Object-specific: `暂无业务单` + 新建 `primary` |
| List no match | has active filter | `未找到匹配的{对象}，请调整筛选条件` + 重置 `text` |
| Table in card | inside the table body | compact Arco Empty with reset/create action when legal |
| Detail section | no child rows | local section empty text plus `outline` add action when legal |
| Tree | no nodes | Arco Empty in the tree pane |
| Permission | no role selected | `请选择左侧角色` |

```vue
<div v-if="!loading && rows.length === 0" class="state-center--in-table">
  <icon-empty class="state-empty-icon" />
  <span>暂无通知</span>
  <a-button size="small" type="primary" @click="openCreate">新建通知</a-button>
</div>
```

## Confirmation

| Risk | Pattern |
|------|---------|
| Reversible | Direct action + `Message.success` |
| Irreversible single | `Modal.confirm` — `okText` repeats verb |
| Batch | Title includes count: `确认批量删除 12 条记录？` |
| Unsaved leave | `Modal.confirm` on route change / drawer close |

Use `okButtonProps: { status: 'danger', size: 'small' }` for destructive confirm.

## Batch Selection Guard

```ts
if (!selectedCount) {
  Message.warning('请先选择记录')
  return
}
```

Toolbar shows `bulk-hint` — `已选 N 条` when `selectedCount > 0`.

## Workbench Inline Notices（工具栏常驻提示）

List/workbench 内数据异常或持续操作说明使用 compact Arco `a-alert`，放在拥有该问题的数据 surface 内。

- Alert 文案说明业务对象、原因和恢复动作；不要只写“数据异常”。
- Alert 不与按钮混在同一个 baseline，也不伪装成 `warning` 按钮。
- 表格级 Alert 放在 table cap 与数据体之间；模块级 Alert 留在模块内。
- 多条可操作问题使用一条摘要加“查看明细”，不要堆叠整屏 Alert。
- 瞬时操作结果仍用 Message/Notification；持续问题不得只用瞬时 Message。

## Forbidden

- `alert()` / `window.confirm()`
- Empty table with no message (white void)
- Generic `暂无数据` when filter is active — must distinguish no rows vs no match
- Success behavior that contradicts the feature contract: close only when the contract completes the overlay job; otherwise keep the surface open and expose the updated result locally.

## Verification

- [ ] Submit buttons use `:loading`
- [ ] Tables use `:loading`
- [ ] Empty uses Arco Empty or a grep-proven/local state layout with object-specific recovery
- [ ] Batch without selection → `Message.warning`
- [ ] Danger → `Modal.confirm`
- [ ] Validation, business rejection, network failure, timeout, permission loss, and partial batch failure each have an owner-local state and recovery action
- [ ] Failed submit preserves entered values, selection, scroll context, and the open modal/drawer when the job is incomplete
- [ ] Retry affects only the owning field, row, section, or request; unrelated work remains usable
- [ ] Message/Notification is never the sole owner of a persistent or actionable failure
