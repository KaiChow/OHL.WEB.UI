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

## CSS Classes — Reuse, Do Not Reinvent

These classes exist in `global.css`. Always use them; never duplicate with inline styles.

| Zone            | Class                          | Notes                                  |
|-----------------|--------------------------------|----------------------------------------|
| Search panel    | `.toolbar.query-panel`         | White card with shadow + border        |
| Adv. filter     | `.advanced-filter-panel`       | Elevated card, inline below search     |
| Table container | `.table-wrap.data-section`     | Elevated card with gradient border     |
| Operation bar   | `.operation-bar`               | Gradient header inside `.table-wrap`   |
| Status chips    | `.list-filter-row`             | Light gradient row inside `.table-wrap`|
| Section label   | `.section-bar`                 | Gradient mini-bar inside table area    |
| Table           | `vxe-table.freight-table`      | Full vxe-table with custom CSS vars    |
| Detail drawer   | `a-drawer.order-detail-drawer` | 720px right drawer                     |
| Detail header   | `.detail-header`               | White card with title + status tag     |
| Detail grid     | `.detail-grid` + `.detail-item`| 2-column grid of label+value cards     |
| Pagination      | `.top-pagination`              | Flex row, top-right of operation bar   |

---

## Visual Quality Rules

**Search panel must have layered shadow:**
```css
/* Applied via .sale-order-search override of .toolbar */
box-shadow:
  0 10px 24px rgba(15, 23, 42, 0.07),
  0 1px 2px rgba(15, 23, 42, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.92);
```

**Table wrap must have elevated shadow:**
```css
/* Applied via .table-wrap */
box-shadow:
  0 16px 34px rgba(15, 23, 42, 0.09),
  0 1px 2px rgba(15, 23, 42, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.88);
```

**Content area background — not flat white, always use the gradient:**
```css
.content {
  background: linear-gradient(180deg, #f4f7fb 0%, #eef3f8 46%, #edf2f7 100%);
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

Width: 720px for most detail drawers. Use 960px only for complex multi-tab detail.

```vue
<a-drawer
  v-model:visible="visible"
  class="order-detail-drawer"
  title="业务单详情"
  :width="720"
  :footer="false"
  unmount-on-close
>
  <!-- Header: order number + status -->
  <div class="detail-header">
    <div>
      <div class="detail-title">{{ order.OrderNo }}</div>
      <div class="detail-subtitle">{{ order.LoaddingPortEn }} → {{ order.DeliveryPortEn }}</div>
    </div>
    <a-tag size="small" :color="statusColorMap[order.status]">
      <span class="status-dot" />{{ statusTextMap[order.status] }}
    </a-tag>
  </div>

  <!-- Body: 2-column grid of labeled fields -->
  <div class="detail-grid">
    <div class="detail-item">
      <span>字段名</span>
      <strong>{{ order.field }}</strong>
    </div>
    ...
  </div>
</a-drawer>
```

Drawer body background is `var(--color-fill-2)` (light gray), set by `.order-detail-drawer .arco-drawer-body`.

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
    <a-button size="small" type="primary">新建</a-button>
    <a-button size="small">导出</a-button>
    <a-button size="small" @click="refresh">
      <template #icon><icon-refresh /></template>
    </a-button>
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

---

## Forbidden Page Patterns

- Do not use `<a-card>` as a page wrapper — use `.toolbar` or `.table-wrap` instead.
- Do not use dashboard-style KPI cards on list pages unless the user explicitly asks.
- Do not put pagination below the table.
- Do not use a modal for advanced query.
- Do not leave flat gray backgrounds — always use the gradient content background.
- Do not use `size="medium"` or `size="large"` for list page controls.
- Do not add `margin-top` between `.table-wrap` and the search panel — use the established gap.
- Do not use `<a-divider>` inside the table wrap or operation bar.
- Do not use `<a-space>` as the main layout wrapper for zones.
