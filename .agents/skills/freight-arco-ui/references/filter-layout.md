# Query Filter Layout

List query design is driven by the user's job, not by showing every field that exists.

Core target: keep the default top work area compact so the first viewport is dominated by the VXE table. In a normal freight workbench, the query area plus toolbar/status row should stay near 112px.

Density is created by removing low-value fields and decorative space, not by erasing the field rhythm. A query field is a small "name / input surface" unit: the label identifies the business dimension, the control is the input plane, and the gap between them lets operators scan the row without the label visually merging into the control border.

## Query Goals

Classify every query field before layout:

| Layer | Purpose | Default surface |
|------|---------|-----------------|
| Locate | Find one record or a small set quickly | Always visible query row |
| Narrow | Reduce a working set by route, party, status, owner | Visible only when used many times per day |
| Investigate | Low-frequency attributes, date ranges, flags | Right-side filter drawer |
| Reuse | Power-user saved conditions | Saved query workspace, not a flat form |

Default visible filters should answer: "What do operators type first when they need this record now?"

For freight list pages, this usually means:

- one combined identifier search: 业务单号 / 订单编号 / HBL / MBL / SO / 柜号
- two to three route or party filters if they are daily scan keys: 客户, 起运港, 目的港, 船公司 / 航司
- query, reset, and filter entry in a stable right-side position

## Query Count Decision Matrix

Do not decide drawer usage by "one row vs two rows" alone. Decide by field count, field frequency, and whether the user needs repeated scan-adjust work.

| Total query fields | Visible area | Advanced surface | Use this when | Forbidden fallback |
|--------------------|--------------|------------------|---------------|--------------------|
| `1-3` | `filter-inline` or compact `filter-card__slim-row` | none | one keyword/identifier dominates | opening a drawer just for two secondary fields |
| `4-8` | one `filter-card__slim-row` | optional drawer only for rare flags | all fields are daily high-frequency filters | showing 8 unrelated fields because they fit technically |
| `9-16` | one core row, 3-5 fields visible | `query-filter-drawer` grouped by business meaning | a few secondary filters are useful but not first-scan keys | inline gray form wall |
| `17-24` | one core row | `query-filter-drawer query-filter-drawer--grouped` | advanced filters span 4-6 business groups | two-line visible query unless all visible fields are daily high-frequency |
| `25-32` | one core row + optional saved preset entry | `query-filter-drawer query-filter-drawer--wide` with grouped sections | many advanced filters, but still usable as a drawer | flat drawer with no grouping |
| `33-50` | core row + saved filters / recent filters entry | `query-filter-drawer--wide` with group navigation and sticky footer | power users need many occasional fields | one long 50-field drawer without navigation |
| `50+` | quick search + saved query workspace entry | saved query workspace / advanced query page or tab | reusable query schemes, cross-module conditions, or admin-level search | showing all fields at once in a drawer or page wall |

Two visible rows are allowed only when all conditions are true:

- The total visible field count is `6-10`.
- Every visible field is a high-frequency daily filter for this business object.
- The second row does not push the VXE table below the first useful viewport on common desktop screens.
- Query/reset/filter actions remain in a stable command area, not repeated per row.
- The layout uses `filter-card--two-row` and `filter-grid filter-grid--two-row`, not repeated `filter-card__slim-row`.

If these conditions are not true, keep one core row and move secondary filters to the drawer.

For `30+ / 40+ / 50+` filters:

- Do not expose all fields as a visible filter area.
- Group fields by business object: identifiers, parties, route, schedule, cargo, container, finance, document, owner, audit/system.
- Provide local group scan anchors. For 33-50 fields, use a group navigation rail or sticky group index inside the wide drawer.
- Provide "clear current group" and "clear all" semantics; do not make reset ambiguous.
- Preserve applied filters after closing. Reopening the surface must show the active values.
- For 50+ fields, use saved query schemes: name, save, update, duplicate, set default, and recent queries. Treat this as a query workspace, not a bigger drawer.

## Default Pattern

Use a compact single visible row:

```vue
<div class="zone-l2-filter-card zone-card filter-card">
  <div class="filter-card__slim-row">
    <div class="filter-field filter-field--span2">
      <label class="filter-field__label">单号检索</label>
      <div class="filter-combo arco-input-group">
        <a-select v-model="q.noType" size="small" class="filter-combo__select filter-combo--keyword">
          <a-option value="mbl">MBL 主单号</a-option>
          <a-option value="orderNo">订单编号</a-option>
          <a-option value="hbl">HBL 单号</a-option>
        </a-select>
        <a-input v-model="q.keyword" size="small" allow-clear placeholder="请输入单号" />
      </div>
    </div>

    <div class="filter-field">
      <label class="filter-field__label">起运港</label>
      <a-input v-model="q.pol" size="small" allow-clear placeholder="请输入" />
    </div>

    <div class="filter-field">
      <label class="filter-field__label">目的港</label>
      <a-input v-model="q.pod" size="small" allow-clear placeholder="请输入" />
    </div>

    <div class="filter-field">
      <label class="filter-field__label">船公司</label>
      <a-select v-model="q.carrier" size="small" allow-clear placeholder="请选择" />
    </div>

    <div class="filter-card__inline-actions">
      <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
        <template #icon><icon-search /></template>查询
      </a-button>
      <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
      <a-button size="small" type="text" class="reset-btn" @click="advancedFilterVisible = true">
        <template #icon><icon-filter /></template>筛选
      </a-button>
    </div>
  </div>
</div>
```

### Field Rhythm

The visible row should read as ordered field units, not as a strip of attached labels and boxes.

- Each `filter-field` is vertical: label above, control below, both left-aligned.
- Label uses metadata strength (`color-text-3`, F4 control size); the control carries the active input surface.
- The label-to-control gap is the smallest visible grouping interval in the query row. Use 5-6px in `filter-card__slim-row`; detail forms use `--dense-gap-label`.
- If the gap is reduced until the label touches the control frame, the field loses its name/value hierarchy and the row feels mechanically compressed rather than premium dense.

Rules:

- Visible row: 3-5 fields plus actions. A span2 combo counts as two field units.
- Use `filter-card__slim-row`; height target is 64px.
- Preserve the field rhythm above; the query row should look compact but still show clear name/input separation.
- Query and reset must stay in the visible row.
- The visible row should stay one line on standard desktop widths (`>= 1440px`). Below the responsive breakpoints in `responsive.md`, it may wrap according to the global CSS contract; do not solve small-screen pressure by removing label/control spacing.
- Do not show a page-level title/description band above operational list filters.

## Two-Row Visible Query

Use this only for `6-10` high-frequency fields. It is not a replacement for advanced search.

```vue
<div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
  <div class="filter-card__matrix">
    <div class="filter-grid filter-grid--two-row">
      <div class="filter-field">...</div>
      <div class="filter-field">...</div>
    </div>
    <div class="filter-card__inline-actions filter-card__inline-actions--matrix">...</div>
  </div>
</div>
```

Rules:

- Use exactly one query command area for both rows.
- Keep fields grouped by reading order; do not put route fields in row one and their paired dates far away in row two.
- Do not use two visible rows for low-frequency "just in case" filters.
- Do not exceed 10 visible fields. Above 10, use a drawer.

## More Filter Drawer

Use a drawer when filters are not daily first-scan keys, even if the total field count is only 9-16.

```vue
<a-drawer v-model:visible="advancedFilterVisible" title="主单筛选" :width="640" class="query-filter-drawer">
  <div class="query-filter-drawer__shell">
    <div class="query-filter-drawer__body">
      <a-form class="detail-form" layout="vertical" size="small" :model="q">
        <div class="query-filter-drawer__group">
          <div class="query-filter-drawer__group-head">订单信息</div>
          <div class="detail-form-grid detail-form-grid--2">
            <a-form-item label="业务类型"><a-select size="small" /></a-form-item>
            <a-form-item label="订单类型"><a-select size="small" /></a-form-item>
          </div>
        </div>

        <div class="query-filter-drawer__group">
          <div class="query-filter-drawer__group-head">航线信息</div>
          <div class="detail-form-grid detail-form-grid--2">
            <a-form-item label="船名"><a-input size="small" /></a-form-item>
            <a-form-item label="航次"><a-input size="small" /></a-form-item>
          </div>
        </div>

        <div class="query-filter-drawer__group">
          <div class="query-filter-drawer__group-head">时间范围</div>
          <div class="detail-form-grid detail-form-grid--2">
            <a-form-item label="ETD 范围"><a-range-picker size="small" style="width:100%" /></a-form-item>
          </div>
        </div>
      </a-form>
    </div>
  </div>

  <template #footer>
    <div class="detail-drawer-footer">
      <div class="detail-drawer-footer__start">
        <a-button size="small" type="text" class="reset-btn">清空更多筛选</a-button>
      </div>
      <div class="detail-drawer-footer__end">
        <a-button size="small">取消</a-button>
        <a-button size="small" type="primary">应用筛选</a-button>
      </div>
    </div>
  </template>
</a-drawer>
```

Drawer rules:

- Use `class="query-filter-drawer"` on the drawer.
- Body structure is fixed: `query-filter-drawer__shell` → scrollable `__body` → repeated `__group`.
- Each business group uses `query-filter-drawer__group` + `query-filter-drawer__group-head` + inner `detail-form-grid`.
- Use `detail-form` + `detail-form-grid` for drawer filter fields.
- Group by business meaning: 单号信息 / 订单信息 / 人员信息 / 客户往来 / 港口路线 / 航线信息 / 时间范围 / 货物信息.
- Drawer footer uses left clear + right cancel/apply.
- Applying drawer filters closes the drawer and triggers search.
- Do not put table, KPI, charts, instruction copy, descriptive summaries, or usage hints in the filter drawer. The drawer title, business group heads, field labels, and footer actions already provide the hierarchy.
- Do not render drawer fields as one flat white form wall; grouping surfaces provide scan anchors and keep long drawers usable.

## Large Query Surfaces

### Grouped Drawer: 17-32 Fields

Use `query-filter-drawer query-filter-drawer--grouped`.

- Width: standard drawer width, usually `640px`.
- Body: repeated `query-filter-drawer__group`.
- Interaction: clear all in footer; optional clear group inside each group head when group-level reset is implemented.
- Field grid: 2 columns by default.

### Wide Drawer: 33-50 Fields

Use `query-filter-drawer query-filter-drawer--wide`.

Required structure:

```vue
<a-drawer class="query-filter-drawer query-filter-drawer--wide">
  <div class="query-filter-drawer__shell query-filter-drawer__shell--with-nav">
    <aside class="query-filter-drawer__nav">...</aside>
    <div class="query-filter-drawer__body">...</div>
  </div>
</a-drawer>
```

Rules:

- Add `query-filter-drawer__nav` for group anchors when there are 7+ groups or 33+ fields.
- The nav shows group names only; no filters inside the nav.
- The body still uses `query-filter-drawer__group` and `detail-form-grid`.
- Footer is sticky and contains clear all, cancel, and apply.
- Do not make the drawer full-screen unless the product explicitly enters an advanced query workspace.

### Saved Query Workspace: 50+ Fields

Use a dedicated advanced query workspace, not a giant drawer. It can be a tab/panel within the list page, but must keep the table reachable.

Required capabilities:

- Quick search remains visible in the normal filter row.
- Saved schemes: save, rename, duplicate, delete, set default.
- Recent queries.
- Grouped advanced editor with collapse/expand by group.
- Applied filters summary by business group, not by a long comma string.
- Clear current group and clear all.

Forbidden:

- 50+ fields in one drawer.
- 50+ fields in one flat page form above the table.
- Hiding table and pagination behind a full-page filter wall for normal list work.

## Field Selection

### Main order / shipment

Visible:

- 单号检索
- 客户 or 起运港/目的港
- 船公司/航司 when carrier is a daily scan key
- 业务员/操作员 only if ownership is the main work split

Drawer:

- 业务类型, 订单类型
- 船名, 航次, 合约号, 境外代理
- ETD/ETA/ATD/ATA ranges
- 是否船司主单, 柜子类型, 快捷标签

### Finance

Visible:

- 账单号 / 业务单号 combo
- 往来单位
- 确认状态 or 到期状态
- 币种 when finance users scan by currency

Drawer:

- 开票/核销状态
- 金额区间
- 到期日/确认日/创建日
- 业务员, 客服, 操作员

### Customer

Visible:

- 客户名称/编码
- 客户状态
- 负责人
- 客户类型 or 等级

Drawer:

- 来源, 信用, 最近跟进, 国家/地区, 标签

## When Inline Expansion Is Allowed

Inline expansion is now an exception. Use the right-side filter drawer by default for low-frequency conditions.

Inline expansion is allowed only when all conditions are true:

- The expanded area adds at most one compact row.
- It uses `filter-grid filter-grid--advanced`, not `filter-card__slim-row`.
- It does not push the table below the first viewport at 1280px height.
- The extra filters are closely related to the visible query row.

If any condition fails, use the drawer.

## Prohibited

- Showing 7+ fields as a flat visible query wall.
- Using `filter-card__advanced-inner` with `filter-card__slim-row`.
- Using `filter-card__actions-panel` as a vertical command column on list pages.
- Using a modal for frequent filters.
- Mixing unrelated fields into one combo. A combo is for related identifiers only.
- Duplicating status filters in both tabs and query fields.
- Hiding the table below the first viewport with query controls.
- Removing label/control spacing in the name of density.
- Omitting `size="small"` on Arco query controls.
