# Page Patterns

Rules for layout, density, visual quality, and interaction on every page.

---

## List Page — Standard Zone Order

Always compose a list page in this exact order:

```
[SaleOrderSearchPanel]   ← .toolbar.query-panel  (search form)
[AdvancedFilterPanel]    ← conditionally rendered inline below search
[.table-wrap.data-section]
  [SaleOrderToolbar]     ← .operation-bar         (actions + top pagination)
  [SaleOrderStatusFilters] ← .list-filter-row     (phase / status chips)
  [SaleOrderTable]       ← vxe-table.freight-table
```

Never put pagination at the bottom. It belongs top-right inside `.operation-bar`.

---

## CSS Classes — Minimal Hooks

Prefer Arco components directly. Use these classes only as stable layout and density hooks.
Do not turn them into a second visual theme.

| Zone            | Class                          | Notes                                  |
|-----------------|--------------------------------|----------------------------------------|
| Search panel    | `.toolbar.query-panel`         | Layout wrapper, Arco bg/border         |
| Adv. filter     | `.advanced-filter-panel`       | Inline expanded query area             |
| Table container | `.table-wrap.data-section`     | Data section wrapper                   |
| Operation bar   | `.operation-bar`               | Toolbar layout inside `.table-wrap`    |
| Status chips    | `.list-filter-row`             | Filter chip row layout                 |
| Section label   | `.section-bar`                 | Compact table section header           |
| Table           | `vxe-table.freight-table`      | vxe-table aligned to Arco table        |
| Detail drawer   | `a-drawer.order-detail-drawer` | 720px right drawer                     |
| Detail header   | `.detail-header`               | White card with title + status tag     |
| Detail grid     | `.detail-grid` + `.detail-item`| 2-column grid of label+value cards     |
| Pagination      | `.top-pagination`              | Flex row, top-right of operation bar   |

---

## Visual Quality Rules

**Use Arco surfaces first:**
```css
.toolbar,
.table-wrap {
  background: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
}
```

**Use subtle separation only when needed:**
```css
.table-wrap {
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
```

**Content area background:**
```css
.content {
  background: var(--color-fill-2);
}
```

**Status tags inside the table — always use `.freight-table .arco-tag` pattern:**
```vue
<a-tag size="small" :color="statusColorMap[row.status]">
  <span class="status-dot" />
  {{ statusTextMap[row.status] }}
</a-tag>
```
Tag height is overridden to 18px by `.freight-table .arco-tag` in global.css.

---

## Compactness Rules

- All Arco components in list pages: `size="small"`.
- Drawer detail forms: `size="small"` or `size="medium"` max.
- Never use `size="large"` in any list or detail context.
- Table row height: 31px (set via `--vxe-ui-table-row-height-mini`).
- Table cell padding: 4px 8px (set via `--vxe-ui-table-cell-padding-mini`).
- Operation bar min-height: 40px, padding 6px 10px.
- Search panel padding: 8px 10px 9px.
- Status filter row min-height: 38px, padding 6px 10px.
- Section bar height: 34px.
- Do not add extra `margin-bottom` between zones — gaps are already set.

---

## Detail Drawer Pattern

### Width Rule

| Scenario | Width |
|---|---|
| Simple read-only detail (≤20 fields) | 720px |
| Complex editable form (50+ fields, multi-section) | `calc(100vw - 248px)` — subtracts the left sidebar (248px fixed) |
| Fullscreen toggle | `100vw` |

The left sidebar is always 248px (`BasicLayout.vue` sider `:width="248"`). Always subtract it so the drawer doesn't overlap the menu.

### Full-Screen Editable Detail (Standard Pattern)

Reference implementation: `SaleOrderDetailDrawer.vue`

Class system (`ds-*` prefix):

```
.order-detail-drawer        — a-drawer host, :header="false"
  .ds-topbar                — 48px fixed title bar (order no + status tag + fullscreen/close btn)
  .ds-body                  — flex row, flex:1, overflow:hidden
    .ds-scroll              — flex:1, overflow-y:auto, padding-right:72px (leaves room for anchor nav)
      .ds-scroll-spacer     — bottom scroll buffer, prevents last section being hidden by footer
      .ds-card              — flat card (no section head), used for top-level info + service items
      .ds-section           — card with .ds-sec-head (gradient header bar + blue 3px left marker)
        .ds-sec-head        — section header row
        .ds-sec-title::before — 3px blue bar (rgb(var(--primary-6)))
    .ds-anchor              — position:absolute right:0 top:0 bottom:0 width:64px anchor nav
      .ds-anchor-track      — frosted pill list
        .ds-anchor-item     — nav button, .ds-anchor-item--active for current section
        .ds-anchor-dot      — 6px circle, blue + scale(1.3) when active
  .ds-footer                — fixed 48px bottom bar, action buttons centered
```

Section layout inside `.ds-section`:

```
.ds-basic-grid              — grid-template-columns: repeat(4, 1fr), gap 8px 16px
.ds-top-grid                — repeat(3, 1fr) for the top card
.ds-cargo-cols              — 2-column layout inside cargo cards
.ds-table-wrap > .ds-table  — delivery/customs tables, min-width 1000px, overflow-x:auto
```

Field pattern (all detail forms):

```vue
<div class="ds-field ds-field--req">
  <span class="ds-label">字段名</span>
  <a-input size="small" class="ds-ctrl ds-ctrl--req" />
</div>
```

`ds-label` is 80px fixed width, right-aligned. `ds-ctrl--req` adds red border tint.

### Anchor Navigation

8 sections with IDs `ds-{key}`:

| key | label |
|---|---|
| top-info | 基本信息 |
| personnel | 权限人员 |
| basic-info | 基础信息 |
| attachment | 附件 |
| order-type | 订单类型 |
| cargo | 货物信息 |
| delivery | 尾端派送 |
| customs | 清关信息 |

Scroll spy uses `requestAnimationFrame` on the `.ds-scroll` scroll event. `scrollToAnchor(key)` calls `scrollRef.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' })`.

Drawer opens/closes with `watch(visible, ...)` to attach/detach the scroll listener. Use `nextTick()` after open to ensure DOM is ready.

The scroll area must reserve footer and anchor space:

```css
.ds-scroll {
  padding-right: 88px;
  scroll-padding-bottom: 96px;
}
.ds-scroll-spacer {
  flex: 0 0 96px;
}
```

Always put `<div class="ds-scroll-spacer" aria-hidden="true" />` as the final child of `.ds-scroll`. Do not use an inline height spacer.

### Fullscreen Toggle

```typescript
const SIDER_WIDTH = 248;
const fullscreen = ref(false);
const drawerWidth = ref(`calc(100vw - ${SIDER_WIDTH}px)`);
watch(fullscreen, (v) => {
  drawerWidth.value = v ? '100vw' : `calc(100vw - ${SIDER_WIDTH}px)`;
});
```

Bind `:width="drawerWidth"` on `a-drawer`.

### Simple Read-only Detail (Legacy Pattern — for small drawers only)

Use only when the detail has ≤20 fields and is read-only:

```vue
<a-drawer class="order-detail-drawer" :width="720" :footer="false" unmount-on-close>
  <div class="detail-header">
    <div class="detail-title">{{ order.OrderNo }}</div>
    <a-tag size="small" :color="statusColorMap[order.status]">
      <span class="status-dot" />{{ statusTextMap[order.status] }}
    </a-tag>
  </div>
  <div class="detail-grid">
    <div class="detail-item"><span>字段名</span><strong>{{ order.field }}</strong></div>
  </div>
</a-drawer>
```

Do NOT use this pattern for editable forms or forms with 20+ fields.

---

## Transport Mode Tabs

Always render as a custom segmented button group, not an `<a-tabs>` or `<a-select>`:

```vue
<div class="transport-tabs">
  <button
    v-for="tab in transportTabs"
    :key="tab.value"
    class="transport-tab"
    :class="{ 'transport-tab--active': activeTransport === tab.value }"
    type="button"
    @click="activeTransport = tab.value"
  >{{ tab.label }}</button>
</div>
```

---

## Status Filter Row Pattern

Render phase/status scope as segmented filter chips inside `.list-filter-row`:

```vue
<div class="list-filter-row">
  <div class="list-filter-groups">
    <span class="list-filter-label">状态</span>
    <div class="segmented-filter segmented-filter--status">
      <button
        v-for="chip in phaseOptions"
        :key="chip.value"
        class="filter-chip"
        :class="{ 'filter-chip--active': phaseFilter === chip.value }"
        type="button"
        @click="phaseFilter = chip.value"
      >
        {{ chip.label }}
        <span>{{ chip.count }}</span>
      </button>
    </div>
  </div>
</div>
```

---

## Operation Bar Pattern

```vue
<div class="operation-bar">
  <div class="operation-bar__actions">
    <a-button size="small" type="primary">创建业务单</a-button>
    <a-button size="small">批量操作</a-button>
    <a-button size="small">导出</a-button>
    <a-button size="small">打印</a-button>
    <a-button size="small" title="刷新"><template #icon><icon-refresh /></template></a-button>
  </div>
  <div class="top-pagination">
    <span class="top-pagination__total">共 {{ total }} 条</span>
    <a-pagination
      v-model:current="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      size="small"
      show-jumper
      :page-size-options="[20, 50, 100]"
      show-page-size
    />
  </div>
</div>
```

Toolbar order rule:

```text
Primary create action → batch actions → import/export/print → refresh/settings utility icons
```

Do not put refresh before the primary business action. Do not make export/print use primary or outline style unless they are the main task of the page.

---

## Forbidden Page Patterns

- Do not wrap every area in decorative cards. Use Arco panels or minimal wrappers.
- Do not use dashboard-style KPI cards on list pages unless the user explicitly asks.
- Do not put pagination below the table.
- Do not use a modal for advanced query.
- Do not add custom gradients or heavy shadows by default.
- Do not use `size="medium"` or `size="large"` for list page controls.
- Do not add `margin-top` between `.table-wrap` and the search panel — use the established gap.
- Do not use `<a-divider>` inside the table wrap or operation bar.
- Do not use `<a-space>` as the main layout wrapper for zones.
