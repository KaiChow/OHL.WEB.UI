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
