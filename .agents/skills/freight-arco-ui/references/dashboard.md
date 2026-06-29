# Dashboard & BI (Archetype G)

## Use When

- BI、经营分析、运营看板、管理驾驶舱
- 财务/业务 **汇总** 页（非高频操作台）

User job is **analyze**, not scan-edit loops. Spacing may be slightly looser than list workbench; tokens stay the same.

## Structure: `db-wrap`

```vue
<div class="page-root page-root--dense db-wrap">
  <!-- Scope / time filter -->
  <div class="zone-l2-filter-card zone-card filter-card">
    <div class="filter-card__main">
      <div class="filter-card__fields">
        <div class="filter-card__body--basic">
          <div class="filter-grid">
            <div class="filter-field">
              <label class="filter-field__label">统计周期</label>
              <a-range-picker size="small" style="width:100%" />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">所属公司</label>
              <a-select size="small" allow-clear />
            </div>
          </div>
        </div>
      </div>
      <div class="filter-card__actions-col">
        <div class="filter-card__actions-primary">
          <a-button size="small" type="primary">查询</a-button>
          <a-button size="small" type="text" class="reset-btn">重置</a-button>
        </div>
      </div>
    </div>
  </div>

  <!-- KPI row -->
  <div class="zone-card db-kpi-row">
    <div class="kpi-card">
      <div class="kpi-label">待处理</div>
      <div class="kpi-body">
        <span class="kpi-value kpi-value--warn">128</span>
        <span class="kpi-unit">票</span>
      </div>
    </div>
    <div class="kpi-card kpi-card--danger">
      <div class="kpi-label">逾期</div>
      <div class="kpi-body">
        <span class="kpi-value kpi-value--danger">9</span>
        <span class="kpi-unit">票</span>
      </div>
    </div>
    <!-- 3–6 KPIs max per row -->
  </div>

  <!-- Main + aside -->
  <div class="db-content">
    <div class="db-main">
      <div class="detail-section">
        <div class="detail-section__head"><h4 class="detail-section__title">业务量趋势</h4></div>
        <div class="detail-section__body db-chart-body">
          <div ref="chartRef" class="db-chart-host" />
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section__head"><h4 class="detail-section__title">明细</h4></div>
        <div class="detail-section__body detail-section__body--table">
          <vxe-table border="none" size="small" class="compact workbench-table" height="auto"
            :row-config="{ isHover: true, keyField: 'Id', height: 36 }" :data="drillRows">
            <!-- drill-down columns -->
          </vxe-table>
        </div>
      </div>
    </div>
    <aside class="db-aside">
      <div class="detail-section">
        <div class="detail-section__head"><h4 class="detail-section__title">快捷入口</h4></div>
        <div class="detail-section__body db-shortcuts">
          <a-button size="small" type="outline" long>业务单列表</a-button>
        </div>
      </div>
    </aside>
  </div>
</div>
```

Classes: `db-wrap`, `db-kpi-row`, `db-content`, `db-main`, `db-aside`, `db-chart-body`, `db-chart-host`, `db-shortcuts` in `global.css`.

## KPI Rules

| Rule | Detail |
|------|--------|
| Count | 3–6 per row; each answers one management question |
| Value | `.kpi-value` + semantic modifier `--warn` `--danger` `--ok` `--primary` |
| Unit | `.kpi-unit` — 票 / 万元 / % |
| Label | `.kpi-label` — short business noun |
| Click | Optional drill to filtered list — KPI is not decorative |

## Charts (ECharts or other)

- Host: `.db-chart-host` min-height **220px** (trend), **200px** (pie).
- Colors: use Arco palette tokens (`--dense-primary-6`, `--dense-warning-6`, etc.) — max **5** series colors visible.
- Resize: `ResizeObserver` on chart host; `dispose` on unmount.
- No chart without **time scope** in filter — label the period in section title or subtitle.
- Empty chart data: `state-center` inside `db-chart-body` — `当前周期暂无数据`.

## Drill-Down

Every KPI or chart segment that promises detail must link to:

- Filtered **Archetype A** list, or
- `workbench-table` section below on same page.

Do not trap users in chart-only views without table path.

## Density vs Operations

| Aspect | Workbench list | Dashboard |
|--------|----------------|-----------|
| Row height | 36px | 36px in drill table only |
| First viewport | 70–80% table | KPI + one chart + start of drill table |
| Toolbar | heavy | light — query + export only |
| Status tabs | daily ops | optional summary chips only |

## Forbidden

- Decorative charts with no owner metric or time range.
- KPI row &gt; 8 tiles.
- `a-table` for drill-down.
- Neon gradients / non-token colors.
- Using dashboard layout for daily order operations — use Archetype A.

## Verification

- [ ] `db-wrap` + `db-kpi-row` + `db-content`
- [ ] KPI uses `kpi-card` / `kpi-value` tokens
- [ ] Drill table uses `workbench-table` + `border="none"`
- [ ] Chart container has min-height and resize handling
