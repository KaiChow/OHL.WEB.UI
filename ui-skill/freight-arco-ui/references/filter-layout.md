# Query Filter Layout

List query design is driven by the user's job, not by showing every field that exists.

Core target: keep the default top work area compact so the first viewport is dominated by the VXE table. In a normal freight workbench, the query area plus toolbar/status row should stay near 112px.

For production workbench pages used all day by sales/operators/coordinators, visible filters are judged by daily frequency, not by visual minimalism. A two-row query area is acceptable when every visible field is used repeatedly and the table still dominates the first viewport. The design failure to avoid is a gray 50-field form wall, not the existence of high-frequency visible filters.

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
| `4-8` | one `filter-card__slim-row`, or `filter-card--two-row` + `filter-grid` when 6-10 daily fields | none (Tier 1) | all fields are daily high-frequency | drawer for Tier-1 fields; stacked slim-rows |
| `9-16` | one core row, 3-5 fields visible | `query-filter-drawer` grouped by business meaning | a few secondary filters are useful but not first-scan keys | inline gray form wall |
| `17-24` | one core row | `query-filter-drawer query-filter-drawer--grouped` | advanced filters span 4-6 business groups | two-line visible query unless all visible fields are daily high-frequency |
| `25-32` | one core row + optional saved preset entry | `query-filter-drawer query-filter-drawer--wide` with grouped sections | many advanced filters, but still usable as a drawer | flat drawer with no grouping |
| `33-50` | core row + saved filters / recent filters entry | `query-filter-drawer--wide` with group navigation and sticky footer | power users need many occasional fields | one long 50-field drawer without navigation |
| `50+` | quick search + saved query workspace entry | saved query workspace / advanced query page or tab | reusable query schemes, cross-module conditions, or admin-level search | showing all fields at once in a drawer or page wall |

### Visible Row Count Decision（核心判断规则）

不要用「最多 N 行」来判断可见字段数量。正确的判断标准是：

> **这些字段，目标用户在日常工作中多久用一次？**

| 用户角色 & 使用场景 | 可见行数 | 说明 |
|---|---|---|
| 普通列表浏览（采购/销售一般列表） | 1 行（3-5 字段） | 多数用户只用 1-2 个条件，其余字段属于偶发 |
| 中等频率列表（运单列表、舱位列表） | 1-2 行（5-10 字段） | 日常高频字段可见，其余进抽屉 |
| **专项重型工作台**（财务核销、操作稽核、对账中心） | **3-4 行（10-16 字段）** | 操作员全天在此页工作，每个可见字段每天都会用到 |
| 全量高级搜索 | 抽屉/独立搜索页 | 字段多、用户多样，不适合全部平铺 |

**判断是否可增加可见行：**

1. **使用频率**：所有可见字段都是目标用户每天必用的。若有字段只是「偶尔会用」，它属于抽屉。
2. **表格可见性**：增加一行筛选后，VXE 表格的首行是否仍在 1440px 屏幕的首屏视口内？如是，则可加行。
3. **空间利用率**：当前筛选行是否有肉眼可见的大块空白区？有空白就是在浪费操作员的空间效率。

### Visible layout structure（结构选型）

| 可见字段数 | DOM 结构 |
|-----------|----------|
| 1 行（约 3–5 个字段） | `filter-card__slim-row` + 行末 `filter-card__inline-actions` |
| 2 行（6–10 个高频字段，仍 Tier 1 全 inline） | `filter-card--two-row` → `filter-card__matrix` → **`filter-grid`（4 列）** + `filter-card__inline-actions--matrix` |

禁止：

- 多个独立 `filter-card__slim-row` 堆叠拼双行（列无法对齐、按钮错位）
- 在 `filter-card--two-row` 内叠加 `filter-grid--two-row`（与 4 列 `filter-grid` 规则冲突）

字段宽度：主标识 combo / 日期范围用 `filter-field--span2`；维度过滤器 span1。操作按钮在双行模式下只放在 **`inline-actions--matrix`**，不要塞进第二行字段末尾。

For `30+ / 40+ / 50+` filters:

- Do not expose all fields as a visible filter area.
- Group fields by business object slots: identifiers, parties/context, location/route when owned by the object, schedule/time, repeated entity attributes, finance, document, owner, audit/system.
- Provide local group scan anchors. For 33-50 fields, use a group navigation rail or sticky group index inside the wide drawer.
- Provide "clear current group" and "clear all" semantics; do not make reset ambiguous.
- Preserve applied filters after closing. Reopening the surface must show the active values.
- For 50+ fields, use saved query schemes: name, save, update, duplicate, set default, and recent queries. Treat this as a query workspace, not a bigger drawer.
- In 50+ query workspaces, group navigation should be anchors over all condition modules, not exclusive tabs that hide other groups. Operators often combine identifiers, time ranges, parties, route, and flags in one query session.

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
- Label → control gap: **`--dense-gap-label` (4px)** everywhere — see `form-field.md` § Form Field Contract.
- If the gap is reduced until the label touches the control frame, the field loses its name/value hierarchy and the row feels mechanically compressed rather than premium dense.

Rules:

- Visible row: 3-5 fields plus actions. A span2 combo counts as two field units.
- Use `filter-card__slim-row`; height target is 64px.
- Preserve the field rhythm above; the query row should look compact but still show clear name/input separation.
- Query and reset must stay in the visible row.
- The visible row should stay one line on standard desktop widths (`>= 1440px`). Below the responsive breakpoints in `responsive.md`, it may wrap according to the global CSS contract; do not solve small-screen pressure by removing label/control spacing.
- Do not show a page-level title/description band above operational list filters.

### Filter Field Visual Hierarchy（字段宽度与业务权重）

同一可见筛选行内，字段宽度必须反映其业务权重，不能让所有字段等宽平铺。

| 字段类型 | 业务角色 | 宽度 | 理由 |
|---------|---------|------|------|
| 主标识符检索 combo | 定位记录的首要维度（单号/账单号/订单号） | `filter-field--span2` | combo 内含 type 选择器 + 输入框，需空间；是用户最先输入的字段 |
| 业务对象 combo | 往来方/公司 + 包含/排除切换 | `filter-field--span2` | 两控件并排，span1 显示过窄 |
| 维度过滤器 | 状态/类型/币种/日期 等单一下拉 | `filter-field`（span1） | 单一控件，紧凑即可 |

实现规则：

- 使用 `filter-grid`（4列，`repeat(4, minmax(0, 1fr))`）而不是 `filter-grid filter-grid--two-row`——后者 class 叠加时 4列规则覆盖 5列规则，导致 span3 溢出产生第三行。
- 两行网格的标准结构：Row1 = 维度(1)+维度(1)+业务对象combo(span2)，Row2 = 维度(1)+维度(1)+主标识符combo(span2)，合计每行恰好 4 列。
- `filter-card--two-row` 的外层 matrix 仍然使用，它负责将 `filter-grid` 和 `filter-card__inline-actions--matrix` 左右排列。
- 所有字段等宽 = 视觉无层次（PESDP 违规）。主标识符 span2 是结构语义，不是为了美观。
- `filter-combo` uses explicit control roles: the leading selector is `filter-combo__select` (fixed width), and the trailing control fills the remaining space. Text inputs inherit the fill behavior from `global.css`; trailing selects must add `filter-combo__fill`.
- `filter-combo` is a connected control: adjacent controls share one visual surface, use `margin-left:-1px`, and all joined inner corners must be radius `0`. If two controls should keep independent rounded corners, separate them with an explicit gap and do not use `filter-combo`.
- Never render `select + input` or `select + select` with both joined corners rounded. That double-radius seam reads as two unrelated controls and fails the dense workbench standard.
- Do not style every `.arco-select` inside `filter-combo` as `width:auto`; this breaks `select + select` combos such as party include/exclude + party selector.

```vue
<!-- 正确：4列网格，span2 体现业务权重 -->
<div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
  <div class="filter-card__matrix">
    <div class="filter-grid">
      <!-- Row 1 -->
      <div class="filter-field"><label class="filter-field__label">管理公司</label>...</div>       <!-- 1 -->
      <div class="filter-field"><label class="filter-field__label">收付类型</label>...</div>       <!-- 1 -->
      <div class="filter-field filter-field--span2">
        <label class="filter-field__label">往来单位</label>
        <div class="filter-combo arco-input-group">
          <a-select size="small" class="filter-combo__select filter-combo--keyword">...</a-select>
          <a-select size="small" class="filter-combo__fill" allow-clear placeholder="请选择往来单位" />
        </div>
      </div> <!-- 2 -->
      <!-- Row 2 -->
      <div class="filter-field"><label class="filter-field__label">核销状态</label>...</div>       <!-- 1 -->
      <div class="filter-field"><label class="filter-field__label">币种</label>...</div>           <!-- 1 -->
      <div class="filter-field filter-field--span2"><label class="filter-field__label">单号检索</label><!-- combo --></div> <!-- 2 -->
    </div>
    <div class="filter-card__inline-actions filter-card__inline-actions--matrix">
      <a-button size="small" type="primary" class="filter-card__query-btn">查询</a-button>
      <a-button size="small" type="text" class="reset-btn">重置</a-button>
      <a-button size="small" type="text" class="reset-btn">更多</a-button>
    </div>
  </div>
</div>
```

## Two-Row Visible Query (6–10 fields)

Use only when every visible field is daily high-frequency and total visible count is 6–10. Structure: see **Visible layout structure** above.

```vue
<div class="zone-l2-filter-card zone-card filter-card filter-card--two-row">
  <div class="filter-card__matrix">
    <div class="filter-grid">
      <div class="filter-field">...</div>
      <!-- 4-column grid; use filter-field--span2 for wide fields -->
    </div>
    <div class="filter-card__inline-actions filter-card__inline-actions--matrix">
      <a-button size="small" type="primary" class="filter-card__query-btn">查询</a-button>
      <a-button size="small" type="text" class="reset-btn">重置</a-button>
    </div>
  </div>
</div>
```

Rules:

- One query command area (`inline-actions--matrix`) for both rows.
- Do not use two visible rows for low-frequency filters.
- Above 10 visible fields, use Tier 2+ drawer — not more visible rows.

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
- Group by business meaning, not backend order. Example group labels for freight objects include 单号信息 / 订单信息 / 人员信息 / 客户往来 / 港口路线 / 航线信息 / 时间范围 / 货物信息. These labels are examples; choose equivalent groups from the current object's slots.
- Drawer footer uses left clear + right cancel/apply.
- Applying drawer filters closes the drawer and triggers search.
- Do not put table, KPI, charts, instruction copy, descriptive summaries, or usage hints in the filter drawer. The drawer title, business group heads, field labels, and footer actions already provide the hierarchy.
- Do not render drawer fields as one flat white form wall; grouping surfaces provide scan anchors and keep long drawers usable.

## Large Query Surfaces

### Grouped Drawer: 17-32 Fields

Use `query-filter-drawer query-filter-drawer--grouped`.

- Width: **`--dense-drawer-w-filter` (640px)** — see `overlay-dimensions.md` tier D1.
- Body: repeated `query-filter-drawer__group`.
- Interaction: clear all in footer; optional clear group inside each group head when group-level reset is implemented.
- Field grid: 2 columns by default.

### Wide Drawer: 33-50 Fields

Use `query-filter-drawer query-filter-drawer--wide`.

- Width: **`--dense-drawer-w-filter-wide` (1120px)** — tier D2 in `overlay-dimensions.md`.

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

Alignment contract:

- Use one 8px-based spacing system for the whole workspace. Do not mix ad hoc 10px, 12px, 14px, and 16px padding per column.
- The drawer header, saved-query column, group-anchor column, and editor column must share the same left/right outer inset token (`--query-ws-pad-x`) so vertical start lines feel intentional.
- The three-column workspace uses fixed rail widths plus a flexible editor: saved schemes around `224px`, group anchors around `152px`, editor `minmax(0, 1fr)`.
- Column internal rhythm is fixed: outer padding `16px`, nav inner item inset `8px`, group/card gap `12px`, group body gap `12px`.
- Section title anchors (`subpanel-cap__title`, `query-filter-drawer__group-head`) use the same short primary rail style. Avoid stacking multiple unrelated blue rails in the same vertical band.
- Cards and nav items align their text to the same local content start. Active indicators may sit inside the item, but must not push the text column.

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
