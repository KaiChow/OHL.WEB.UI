# VXE Table

## Required Setup

```vue
<vxe-table
  border="none"
  size="small"
  height="100%"
  show-overflow="title"
  :row-config="{ isHover: true, keyField: 'Id' }"
>
</vxe-table>
```

## Column Rules

- At least one content column must use `min-width`.
- Do not set `width` on every column.
- Fixed left: checkbox, sequence, main identifier if needed.
- Fixed right: file/action only.
- Numeric columns align right.
- Status/action columns align center.
- Long text uses ellipsis/title or a two-line cell pattern.

## Cell Patterns

- Main links: `link-text link-text--strong mono`.
- Normal links: `link-text mono`.
- Status: `.s-pill[data-s]`.
- Two-line cell: `cell-two-line`, `c2-main`, `c2-sub`.
- Empty value: `—` with weak color.

## Row Interaction

- Hover and selected states must cover fixed columns consistently.
- Hover uses primary tint, not gray.
- Selection uses a stronger primary tint.
- Zebra stripes are optional and must remain low contrast.
- Do not merge cells for the main list unless the business explicitly requires grouped display.

## Row Actions

- Use `a-tooltip` + `a-button type="text" class="row-action-btn"`.
- Default visible actions: view/edit/more at most.
- Destructive actions go in dropdown with confirmation.
