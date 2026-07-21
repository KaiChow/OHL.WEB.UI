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
| API/network | `Message.error` | `保存失败，请稍后重试` |
| Validation | Arco `a-form-item` inline | Field rule `message` |
| Permission | `Message.error` or inline `state-center` | `无权限执行此操作` |
| Upload | `Message.error` | `文件超过 20MB 限制` / `仅支持 PDF、Excel…` |

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

List/workbench `merged-bar` 内数据异常、操作说明等**常驻**提示，使用 `global.css` 的 `workbench-notice`，禁止裸 `span` + `style`。

| 语义 | Class | 用途 |
|------|-------|------|
| 警告 / 数据异常 | `workbench-notice workbench-notice--warn` | 缺 ATD、金额无法折算、权限受限等 |
| 操作说明 / 轻提示 | `workbench-notice workbench-notice--info` | 双击置顶、列操作说明等 |

结构（图标 + 文案，`title` 放完整句）：

```vue
<div class="merged-bar">
  <div class="toolbar-group">…业务按钮…</div>
  <div v-if="showWarn" class="bar-sep" />
  <div v-if="showWarn" class="workbench-notice-group">
    <div class="workbench-notice workbench-notice--warn" title="完整说明">
      <icon-exclamation-circle-fill class="workbench-notice__icon" />
      <span class="workbench-notice__text">存在订单无 ATD 时间，无法计算折合金额，请先维护数据</span>
    </div>
  </div>
  <div class="toolbar-aside">
    <div class="workbench-notice workbench-notice--info" title="双击 ★ 可置顶">
      <icon-info-circle class="workbench-notice__icon" />
      <span class="workbench-notice__text">双击 ★ 可置顶</span>
    </div>
  </div>
</div>
```

Rules:

- 警告放 `workbench-notice-group`（`bar-sep` 后与按钮区分）；说明类放 `toolbar-aside` 右对齐。
- 文案 F5 `var(--dense-font-aux)`；过长 `ellipsis`，完整句放 `title`。
- 瞬时操作结果仍用 `Message` / `Notification`，不用 `workbench-notice`。
- 禁止 `a-alert banner` 占满工具栏行高；禁止 `status="warning"` 按钮代替提示。

## Forbidden

- `alert()` / `window.confirm()`
- Empty table with no message (white void)
- Generic `暂无数据` when filter is active — must distinguish no rows vs no match
- Success without closing modal when user expects close — save success → close + message

## Verification

- [ ] Submit buttons use `:loading`
- [ ] Tables use `:loading`
- [ ] Empty uses `state-center` classes
- [ ] Batch without selection → `Message.warning`
- [ ] Danger → `Modal.confirm`
