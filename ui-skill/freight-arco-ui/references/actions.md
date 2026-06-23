# Actions And Buttons

## Button Priority

| Priority | Arco style | Usage |
|----------|------------|-------|
| Primary | `type="primary"` | One main action per scope |
| Secondary | `type="outline"` or default | Export, print, batch, add local item |
| Utility | `type="text"` icon-only | Refresh, settings, density, column config |
| Danger | `status="danger"` | Delete, abandon, irreversible operations |

## Toolbar Rules

- Left side: business actions.
- Right side: utilities and selected count.
- No more than one primary button in a toolbar.
- More than four visible actions should be grouped.
- Use dropdown for low-frequency or dangerous operations.
- Primary business action normally appears before secondary actions.
- Refresh, settings, column config, and density are utilities; they should not compete with create/submit.

## Detail/Form Rules

- Footer submit is the only global primary action.
- Save draft is default/outline, not primary.
- Local section add/copy is outline/default, not primary.
- Delete uses text danger plus `a-popconfirm`.
- Do not use `mini` text buttons in complex detail pages.
- Section header left contains only the module title. Section header right contains only actions.
- Module stats, file counts, helper text, upload state, and status belong inside the module body or summary row.

## Permissions

- No permission: hide the button.
- Do not render disabled buttons for unavailable permission unless the business needs explicit visibility.

## Feedback

- Success: `Message.success`.
- Failure: `Message.error`.
- Warning/precondition: `Message.warning`.
- Async button must use `:loading`.

## Table Editing Actions

Inline table editing changes the action priority of the current scope.

## Table Row Action Menu

Row actions must be fast to scan and must not turn the operation column into a text toolbar.

Default row view mode:

- Direct actions: `查看`, `编辑`, `更多` at most.
- Direct actions use icon-only `a-button type="text" class="row-action-btn"` with tooltip.
- The operation column should normally be 88-120px for `查看 + 编辑 + 更多`.
- Low-frequency actions go into the `更多` dropdown.
- Direct row actions should sit in one compact action dock (`row-actions`) so the fixed operation column reads as a deliberate action area, not scattered icons.
- The operation fixed column may use a subtle surface/left boundary to separate actions from data, but it must not become a heavy card or colored status area.
- The `更多` menu should use grouped content: normal actions first, divider, danger actions last. Dangerous options must be visually separated even when there is only one danger action.

Dropdown order:

1. File/document actions such as `下载附件`.
2. Output actions such as `打印`.
3. Object reuse actions such as `复制业务单`.
4. Divider.
5. Dangerous actions such as `废弃`, `删除`, `撤销`.

Danger rules:

- Dangerous menu options use danger styling.
- Dangerous row actions require confirmation with business impact copy.
- Do not execute `废弃`, `删除`, or irreversible actions directly from the dropdown click.
- Disabled actions should explain why through text or tooltip when the reason is not obvious.
- Disabled menu options should remain readable but clearly inactive; do not hide a disabled file/download action when its absence would make the menu jump between rows.

### Row Edit

Row view mode:

- Direct actions: view/edit/more at most.
- `编辑` is secondary row action unless editing is the primary job of the table.
- Delete/cancel/revoke stays in more menu or uses danger confirmation.

Row edit mode:

- Direct actions become `保存` and `取消`.
- `保存` is the primary action only inside that row scope.
- `取消` is default/text and must not look destructive.
- If save is async, use row-level loading on `保存`.
- Do not keep the original `编辑` action visible while the row is already editing.

### Batch Edit

Toolbar before edit:

- Keep normal business actions.
- `批量编辑` is secondary unless it is the page's main workflow.

Toolbar during batch edit:

- Replace normal toolbar context with edit context where practical.
- Required order: `保存更改` → `取消编辑` → changed count / validation summary.
- Disable unrelated destructive or navigation actions while dirty edits exist.
- Keep utilities such as column settings and refresh separated; refresh must warn if unsaved changes exist.

### Dirty State

- Show changed count near the edit actions: `已修改 N 行`.
- Row dirty marker or cell dirty marker is required for unsaved edits.
- Unsaved edits must block silent pagination, filtering, route leave, and drawer close.
