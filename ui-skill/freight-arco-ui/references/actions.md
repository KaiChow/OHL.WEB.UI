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
