# Query Filter Layout

List query design is driven by the user's job, not by showing every field that exists.

Core target: keep the default top work area compact so the first viewport is dominated by the VXE table. In a normal freight workbench, the query area plus toolbar/status row should stay near 112px.

High density does not mean zero spacing. Query labels and controls need visible breathing room so the page feels precise rather than cramped.

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

Rules:

- Visible row: 3-5 fields plus actions. A span2 combo counts as two field units.
- Use `filter-card__slim-row`; height target is 64px.
- Keep 5-6px between `filter-field__label` and the control. Do not collapse this gap to 0-2px.
- Query and reset must stay in the visible row.
- The visible row must not wrap. If it wraps, move lower-frequency fields into the drawer.
- Do not show a page-level title/description band above operational list filters.

## More Filter Drawer

Use a drawer when filters are not daily first-scan keys, even if the total field count is only 9-16.

```vue
<a-drawer v-model:visible="advancedFilterVisible" title="主单筛选" :width="560">
  <a-form class="detail-form" layout="vertical" size="small" :model="q">
    <div class="detail-form-grid detail-form-grid--2">
      <div class="form-subgroup-label detail-form-grid__span2">订单信息</div>
      <a-form-item label="业务类型"><a-select size="small" /></a-form-item>
      <a-form-item label="订单类型"><a-select size="small" /></a-form-item>

      <div class="form-subgroup-label detail-form-grid__span2 form-subgroup-label--mt">航线信息</div>
      <a-form-item label="船名"><a-input size="small" /></a-form-item>
      <a-form-item label="航次"><a-input size="small" /></a-form-item>

      <div class="form-subgroup-label detail-form-grid__span2 form-subgroup-label--mt">时间范围</div>
      <a-form-item label="ETD 范围"><a-range-picker size="small" style="width:100%" /></a-form-item>
    </div>
  </a-form>

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

- Use `detail-form` + `detail-form-grid` for drawer filter fields.
- Group by business meaning: 单号信息 / 订单信息 / 人员信息 / 客户往来 / 港口路线 / 航线信息 / 时间范围 / 货物信息.
- Drawer footer uses left clear + right cancel/apply.
- Applying drawer filters closes the drawer and triggers search.
- Do not put table, KPI, charts, or instructions in the filter drawer.

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
