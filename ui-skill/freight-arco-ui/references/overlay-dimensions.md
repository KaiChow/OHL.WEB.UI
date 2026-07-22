# Overlay Dimensions

## Goal

Modal and drawer dimensions follow content tiers so users see stable, readable overlays instead of arbitrary page-by-page widths.

Viewport baseline: supported minimum `1024px`, release gate `1366px`, design evidence `1440px`. Drawer widths use `min(token, calc(100vw - pad))` so the overlay keeps a viewport inset.

## Ownership

- Arco owns overlay chrome, accessibility, mask, focus, portal, header, body, footer, and close behavior.
- The component `width` prop is authoritative for the rendered width.
- `global.css` owns only reusable dimension tokens. It does not override Drawer inline width with `!important`.
- A surface class may identify a documented shared structure, but the class does not imply width unless `rg` proves an implementation exists.
- Page CSS may arrange content inside the body; it must not create a second overlay skin.

## Container Decision

```text
Need an overlay?
|- confirmation, short state change, or compact form -> Modal
|- advanced list conditions that must preserve list context -> Drawer D1/D2
|- record detail, long form, tabs, or mini tables -> Drawer D3/D4
`- 50+ query conditions with saved/recent schemes -> query workspace, not an overlay
```

## Dimension Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--dense-drawer-viewport-pad` | 32px | Detail drawer viewport inset |
| `--dense-drawer-filter-pad` | 24px | Filter drawer viewport inset |
| `--dense-modal-w-confirm` | 420px | Confirm or short acknowledgement |
| `--dense-modal-w-sm` | 480px | Modal with 1-3 fields |
| `--dense-modal-w-md` | 560px | Modal with 4-6 fields |
| `--dense-modal-w-lg` | 640px | Modal with 7-8 fields |
| `--dense-modal-w-xl` | 760px | Modal with 9-12 fields or textarea block |
| `--dense-modal-w-max` | 860px | Modal hard ceiling with a small read-only sub-table |
| `--dense-drawer-w-filter` | 640px | Standard grouped advanced filter |
| `--dense-drawer-w-filter-wide` | 1120px | 33-50 conditions with group anchors |
| `--dense-drawer-w-standard` | 720px | Read-only detail with few sections |
| `--dense-drawer-w-complex-max` | 1200px | Complex detail upper cap |

## Modal Tiers

Set `:width` explicitly on every `a-modal` and select only a documented tier.

| Tier | Width | Use |
|------|-------|-----|
| Confirm | `420` | Irreversible acknowledgement or at most two short sentences |
| SM | `480` | 1-3 fields, one column |
| MD | `560` | 4-6 fields, one or two columns |
| LG | `640` | 7-8 fields, two columns |
| XL | `760` | 9-12 fields or one span-two textarea |
| MAX | `760-860` | Form plus one small read-only table; never exceed 860 |

Rules:

- Default Arco `520px` is not a project tier; set the intended tier.
- Modal width remains a tiered pixel value at supported desktop widths.
- Content with tabs, several business sections, or editable child rows belongs in a drawer.
- Business form modals use `:mask-closable="false"` and the submit contract from `modal.md`.

```vue
<a-modal title="添加记录" :width="560" :mask-closable="false" />
```

## Drawer Tiers

Pass the responsive expression directly to `width`.

| Tier | Evidence hook / shared class | Width expression | Use |
|------|------------------------------|------------------|-----|
| D1 Filter | `data-ui-surface="advanced-filter"` | `min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))` | Standard grouped advanced filter |
| D2 Filter wide | `data-ui-surface="advanced-filter-wide"` | `min(var(--dense-drawer-w-filter-wide), calc(100vw - var(--dense-drawer-filter-pad)))` | 33-50 fields with anchor rail |
| D3 Detail standard | `detail-drawer detail-drawer--standard` | `min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))` | Read-only detail, few sections, no wide mini-table |
| D4 Detail complex | `detail-drawer` | `min(var(--dense-drawer-w-complex-max), calc(100vw - var(--dense-drawer-viewport-pad)))` | Tabs, sections, child tables, or editable footer |

```vue
<!-- D1 advanced filter -->
<a-drawer
  data-ui-surface="advanced-filter"
  width="min(var(--dense-drawer-w-filter), calc(100vw - var(--dense-drawer-filter-pad)))"
  :mask-closable="false"
/>

<!-- D3 standard detail -->
<a-drawer
  class="detail-drawer detail-drawer--standard"
  width="min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))"
  :footer="false"
/>

<!-- D4 complex detail -->
<a-drawer
  class="detail-drawer"
  :width="drawerWidth"
  :footer="false"
/>
```

```ts
const drawerWidth = computed(() =>
  isFullscreen.value
    ? '100vw'
    : 'min(var(--dense-drawer-w-complex-max), calc(100vw - var(--dense-drawer-viewport-pad)))'
)
```

## Scroll Ownership

The overlay must have one content scroll owner.

- Standard Modal: native Modal body owns content overflow.
- D1 and D3: native Drawer body owns content overflow.
- D2: a fixed anchor rail may sit beside one scrolling editor; do not also scroll the outer body.
- D4: the documented detail body owns business-content scrolling while the object header and action footer remain stable.
- Never create horizontal scrolling to compensate for an invalid grid, child width, or footer box model.

For every overlay, inspect the root, body, content shell, form/grid, table wrapper, and footer. Each non-horizontal-data surface must satisfy `scrollWidth === clientWidth`.

## Fullscreen Exception

Only dense object-level operational drawers with large editable child tables may offer fullscreen.

- Fullscreen is an explicit user mode, not the default width.
- Filter drawers and simple read-only detail drawers do not use `100vw`.
- Entering or leaving fullscreen preserves active tab, scroll context, draft edits, and validation state.

## Container Selection By Content

| Signal | Container | Typical tier |
|--------|-----------|--------------|
| Up to 8 fields, one compact form | Modal | SM-LG |
| Confirm/delete/batch acknowledgement | `Modal.confirm` | Confirm |
| Grouped advanced conditions | Drawer | D1 |
| 33-50 advanced conditions with anchors | Drawer | D2 |
| Read-only record with few sections | Drawer | D3 |
| Tabs, child tables, and footer workflow | Drawer | D4 |
| 50+ query conditions and scheme management | Query workspace | page-owned |

## Verification

At `1024x768`, `1366x768`, and `1440x900`:

- [ ] The rendered width matches the selected tier expression.
- [ ] The overlay rectangle keeps its documented viewport inset unless fullscreen.
- [ ] Root/body/content/footer do not have horizontal overflow.
- [ ] Footer buttons are entirely inside the overlay rectangle.
- [ ] Exactly one vertical content scroll owner exists.
- [ ] Long labels, validation errors, popup menus, date panels, and child tables remain usable.
- [ ] D4 caps at 1200px on wide screens unless fullscreen is active.

## Forbidden

- Arbitrary widths outside the tier table without a recorded content reason.
- Modal width above 860px.
- Treating a class name as an invisible width override.
- `!important` width rules that compete with the component prop.
- A standard drawer with nested full-height scroll shells.
- Footer `width: 100%` plus unaccounted horizontal padding.
- D2 for 50+ fields; use a query workspace.
- Filter workflow in a Modal only because a Drawer implementation is inconvenient.
- Complex detail compressed into a Modal only to reduce implementation work.

## Related References

- Advanced filter scenarios and state: `filter-layout.md`
- Modal submit and validation: `modal.md`
- Detail drawer composition: `detail-form.md`
- Responsive release evidence: `responsive.md`
