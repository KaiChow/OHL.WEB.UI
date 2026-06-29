# Overlay Dimensions (Modal & Drawer Width)

## Goal

Modal and drawer widths must follow a **fixed tier system**. Pick the tier from content type and field count — do not invent arbitrary values (`900`, `1080`, etc.).

Viewport baseline: **min 1280px**, design **1440px**. All responsive widths use `min(token, calc(100vw - pad))` so overlays never touch the viewport edge.

## Decision Flow

```
Need overlay?
├─ Short form / confirm / status change (≤8 fields, no mini table) → Modal
├─ Advanced list filters (Tier 2+) → Drawer + query-filter-drawer
└─ Record detail / long form / mini tables → Drawer + detail-drawer*
```

## Width Tokens (`global.css`)

All widths are CSS variables. Pages pass tier via **class + documented token value** on `:width` for modals; drawers with project classes get width from `global.css` (`!important` overrides inline `:width`).

| Token | Value | Use |
|-------|-------|-----|
| `--dense-drawer-viewport-pad` | 32px | Side inset for detail drawers (`16px` each side) |
| `--dense-drawer-filter-pad` | 24px | Side inset for filter drawers |
| `--dense-modal-w-confirm` | 420px | `Modal.confirm`, single-line confirm |
| `--dense-modal-w-sm` | 480px | Modal ≤3 fields, single column |
| `--dense-modal-w-md` | 560px | Modal 4–6 fields, 2-column grid |
| `--dense-modal-w-lg` | 640px | Modal 7–8 fields, 2-column grid |
| `--dense-modal-w-xl` | 760px | Modal with textarea block or 9–12 fields |
| `--dense-modal-w-max` | 860px | Modal with small sub-table — **hard ceiling** |
| `--dense-drawer-w-filter` | 640px | Standard advanced-filter drawer |
| `--dense-drawer-w-filter-wide` | 1120px | Wide business-query drawer (50+ fields) |
| `--dense-drawer-w-standard` | 720px | Read-only detail, ≤4 sections, no wide mini-table |
| `--dense-drawer-w-complex-max` | 1200px | Complex detail upper cap |

## Modal Width

Set `:width` explicitly on every `<a-modal>`. Use **token values only**.

| Tier | Width token | When |
|------|-------------|------|
| Confirm | `420` (`--dense-modal-w-confirm`) | `Modal.confirm`, irreversible ack, ≤2 sentences body |
| SM | `480` | 1–3 fields, single column |
| MD | `560` | 4–6 fields, `filter-grid--2col` |
| LG | `640` | 7–8 fields, 2-column |
| XL | `760` | 9–12 fields, or form + one textarea span-2 |
| MAX | `760`–`860` | Form + embedded mini read-only table; **never exceed 860** |

Rules:

- Default Arco `520px` is forbidden when it does not match the tier.
- Modal width is **fixed px** — do not use `vw` on modals.
- If content needs tabs, multiple `detail-section`, or `detail-mini-vxe`, use a **drawer**, not a wider modal.
- `:mask-closable="false"` on all business modals (see `modal.md`).

```vue
<!-- 5 fields, 2-col → MD 560 -->
<a-modal title="添加联系人" :width="560" :mask-closable="false">

<!-- 7 fields → LG 640 -->
<a-modal title="新建通知" :width="640" :mask-closable="false">
```

## Drawer Width

Drawers use **surface class** to bind width in `global.css`. Inline `:width` on classified drawers is **documentation only** — CSS wins.

| Tier | Class | Computed width | When |
|------|-------|----------------|------|
| D1 Filter | `query-filter-drawer` | `min(640px, 100vw - 24px)` | Tier 2 list «更多筛选», grouped filter form |
| D2 Filter wide | `query-filter-drawer query-filter-drawer--wide` | `min(1120px, 100vw - 24px)` | Business query 50+ fields, nav + groups |
| D3 Detail standard | `detail-drawer detail-drawer--standard` | `min(720px, 100vw - 32px)` | Read-only detail, few sections, attachment list only |
| D4 Detail complex | `detail-drawer` (no `--standard`) | `min(1200px, 100vw - 32px)` | Multi-section, tabs, `detail-mini-vxe`, editable footer |

### Complex drawer fullscreen (exception)

Only **order-level operational drawers** with dense mini-tables may expose fullscreen:

```ts
const drawerWidth = computed(() =>
  isFullscreen.value ? '100vw' : 'min(1200px, calc(100vw - 32px))'
)
```

- Fullscreen is optional UX, not the default width.
- Do not use `100vw` on filter drawers or read-only detail.

### Class + width examples

```vue
<!-- D1 高级筛选 -->
<a-drawer
  v-model:visible="advancedVisible"
  title="更多筛选"
  class="query-filter-drawer"
  :width="640"
>

<!-- D3 通知详情（只读） -->
<a-drawer
  class="detail-drawer detail-drawer--standard"
  :width="720"
  :footer="false"
>

<!-- D4 业务单详情（复杂） -->
<a-drawer
  class="detail-drawer"
  :width="drawerWidth"
  :footer="false"
>
```

## Modal vs Drawer (width angle)

| Signal | Container | Typical width |
|--------|-----------|---------------|
| ≤8 fields, one flat form | Modal | 480–640px |
| Confirm / delete / batch ack | `Modal.confirm` | 420px (Arco default OK) |
| 9–16 filter fields, grouped | Drawer D1 | 640px |
| Read-only record, ≤4 sections | Drawer D3 | 720px |
| Tabs + mini tables + footer workflow | Drawer D4 | up to 1200px |
| Order console, fullscreen editing | Drawer D4 + fullscreen | 100vw optional |

## Forbidden

```
❌ Arbitrary widths: 900, 1080, 680 when tier says 640 or 720
❌ Modal > 860px
❌ Modal with vw units
❌ detail-drawer for a 3-field read-only view (use --standard or modal)
❌ Relying only on :width without the correct drawer class
❌ Filter workflow in modal (use query-filter-drawer)
❌ Complex multi-section detail squeezed into modal because "drawer feels heavy"
```

## Verification

- [ ] Modal `:width` matches a token tier for field count / content type
- [ ] Drawer has correct class (`query-filter-drawer` / `detail-drawer` / `--standard`)
- [ ] No `:width` values outside the token table except documented fullscreen
- [ ] At 1280px viewport, drawer still leaves ≥16px margin (no horizontal page scroll)
- [ ] At 1920px, complex drawer caps at 1200px unless fullscreen
