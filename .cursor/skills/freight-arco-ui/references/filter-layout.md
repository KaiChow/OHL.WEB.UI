# Filter Layout By Field Count

筛选区（zone-l2）的布局模式由**有效查询字段数**决定。不同数量对应不同结构，不能用同一套模板套所有页面。

---

## 选型总表

| 字段数 | 级别 | 模式 | 标签 | 右侧操作列 | 展开/收起 |
|--------|------|------|------|------------|-----------|
| 0–3 | Tier 0 | **行内单行** (`filter-inline`) | ❌ placeholder 代替 | ❌ 按钮内联 | ❌ |
| 4–6 | Tier 1 | **标准卡片单区** (`filter-card`) | ✅ | ✅ 仅查询+重置 | ❌ |
| 7–12 | Tier 2 | **可展开卡片** (`filter-card` + advanced) | ✅ | ✅ 查询+重置+展开 | ✅ |
| 13–30 | Tier 3 | **分组可展开** (advanced 内加 `form-subgroup-label`) | ✅ | ✅ 查询+重置+展开 | ✅ |
| 31+ | Tier 4 | **高级筛选抽屉** (顶部常驻 Tier 0/1 + 抽屉分组) | ✅ 抽屉内 | ✅ 常驻+抽屉各一套 | ✅ 抽屉 |

---

## Tier 0 — 0-3 字段：行内单行

**何时用：** 页面主要靠单一标识符（单号/关键词）定位记录；字段极少，不值得独立 label 行。

**特征：**
- 整个筛选区高度 ≈ 48px（8px 上下 padding + 32px 控件）
- 无字段标签，placeholder 承担字段说明
- 查询按钮与字段同行，在行末
- 0-1 个字段时可不显示重置按钮；2-3 个字段时显示
- 无展开/收起

```vue
<!-- 0-1 字段：只有关键词搜索 -->
<div class="zone-l2-filter-card zone-card filter-inline">
  <a-input
    v-model="q.keyword"
    size="small"
    allow-clear
    placeholder="业务单号 / HBL / MBL"
    style="width: 300px; flex-shrink: 0"
    @press-enter="handleSearch"
  />
  <a-button size="small" type="primary" @click="handleSearch">
    <template #icon><icon-search /></template>查询
  </a-button>
</div>

<!-- 2-3 字段：关键词 + 一个筛选 -->
<div class="zone-l2-filter-card zone-card filter-inline">
  <a-input
    v-model="q.keyword"
    size="small"
    allow-clear
    placeholder="业务单号 / 客户名称"
    style="width: 260px; flex-shrink: 0"
    @press-enter="handleSearch"
  />
  <a-select
    v-model="q.status"
    size="small"
    allow-clear
    placeholder="状态"
    style="width: 140px; flex-shrink: 0"
  >
    <a-option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</a-option>
  </a-select>
  <div class="filter-inline__sep" />
  <a-button size="small" type="primary" @click="handleSearch">
    <template #icon><icon-search /></template>查询
  </a-button>
  <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
</div>
```

**禁止：**
- ❌ Tier 0 不使用 `filter-card__main` / `filter-card__actions-panel`（无右侧操作列）
- ❌ 不在控件上方加 label（用 placeholder）
- ❌ 不因为"设计感"强行加一行 label 变成两行

---

## Tier 1 — 4-6 字段：标准卡片单区

**何时用：** 所有字段高频、无需折叠，一屏能完整展示。

**特征：**
- 字段有上标签（`filter-field__label`）
- `filter-grid`：4 字段用 4 列，5-6 字段用 6 列或折 2 行 4 列
- 右侧操作列：**仅查询 + 重置**，无展开链接
- 全部字段始终可见

```vue
<div class="zone-l2-filter-card zone-card filter-card">
  <div class="filter-card__main">
    <div class="filter-card__fields">
      <div class="filter-card__body--basic">
        <!-- 4 列，4 个字段 -->
        <div class="filter-grid">
          <div class="filter-field">
            <label class="filter-field__label">业务类型</label>
            <a-select v-model="q.businessType" size="small" allow-clear placeholder="请选择业务类型">
              <a-option v-for="t in businessTypes" :key="t" :value="t">{{ t }}</a-option>
            </a-select>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">单号检索</label>
            <div class="filter-combo filter-combo--keyword">
              <a-select v-model="q.keywordField" size="small" class="filter-combo__select">
                <a-option value="businessNo">业务单号</a-option>
                <a-option value="hbl">HBL</a-option>
              </a-select>
              <a-input v-model="q.keyword" size="small" allow-clear placeholder="请输入单号" @press-enter="handleSearch" />
            </div>
          </div>
          <div class="filter-field">
            <label class="filter-field__label">客户</label>
            <a-select v-model="q.customer" size="small" allow-search allow-clear placeholder="请选择客户" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">业务员</label>
            <a-select v-model="q.salesman" size="small" allow-search allow-clear placeholder="请选择业务员" />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧操作列：仅查询 + 重置，无展开链接 -->
    <div class="filter-card__actions-panel">
      <a-button size="small" type="primary" class="filter-card__query-btn" title="查询" @click="handleSearch">
        <template #icon><icon-search /></template>查询
      </a-button>
      <a-button size="small" type="text" class="reset-btn" title="重置" @click="handleReset">重置</a-button>
    </div>
  </div>
</div>
```

**5-6 字段布局选择：**
- 5 字段 → `filter-grid` 默认 4 列，第 5 字段单独占第 2 行（留白 3 列）
- 或改用 `filter-grid` `grid-template-columns: repeat(3, 1fr)` 使 5-6 字段整齐排列两行

**禁止：**
- ❌ Tier 1 不加展开/收起链接（无隐藏字段无需折叠）
- ❌ 不用单列布局把 4-6 个字段竖排

---

## Tier 2 — 7-12 字段：可展开卡片

**何时用：** 字段有主次之分，高频 4-6 个，低频 3-6 个折叠。

**特征：**
- 默认展示前 4-6 个高频字段
- 右侧操作列：查询 + 重置 + 展开/收起链接
- 展开后显示剩余字段（`filter-card__advanced`）
- 查询/重置位置在展开前后保持不变

```vue
<div class="zone-l2-filter-card zone-card filter-card">
  <div class="filter-card__main">
    <div class="filter-card__fields">
      <!-- 默认可见区：高频 4-6 字段 -->
      <div class="filter-card__body--basic">
        <div class="filter-grid">
          <!-- 4-6 个高频字段 -->
          <div class="filter-field">...</div>
          <div class="filter-field">...</div>
          <div class="filter-field">...</div>
          <div class="filter-field">...</div>
        </div>
      </div>

      <!-- 展开区：低频字段 -->
      <div class="filter-card__advanced" :class="{ 'filter-card__advanced--open': showAdvanced }">
        <div class="filter-card__advanced-inner">
          <div class="filter-grid filter-grid--advanced">
            <!-- 3-6 个低频字段 -->
            <div class="filter-field">...</div>
            <div class="filter-field">...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧操作列：查询 + 重置 + 展开 -->
    <div class="filter-card__actions-panel">
      <a-button size="small" type="primary" class="filter-card__query-btn" title="查询" @click="handleSearch">
        <template #icon><icon-search /></template>查询
      </a-button>
      <a-button size="small" type="text" class="reset-btn" title="重置" @click="handleReset">重置</a-button>
      <button
        class="filter-expand-link filter-expand-link--panel"
        type="button"
        :title="showAdvanced ? '收起' : '更多'"
        @click="showAdvanced = !showAdvanced"
      >
        <span class="filter-expand-link__text">{{ showAdvanced ? '收起' : '更多' }}</span>
        <icon-down />
      </button>
    </div>
  </div>
</div>
```

**字段分配原则（Tier 2）：**
- 默认显示：排序号最靠前的高频字段（业务单号、客户、状态、日期范围等）
- 折叠隐藏：操作员、客服、发货人、收货人、快捷标签等低频
- 折叠区字段数 ≤ 8；超过 8 个改用 Tier 3

---

## Tier 3 — 13-30 字段：分组可展开

**何时用：** 字段多且有明显业务分组（单号类、人员类、时间类、货物类、港口类）。

**特征：**
- 默认区同 Tier 2（4-6 高频字段 + 右侧操作列含展开）
- 展开区内部用 `form-subgroup-label` 分组，每组 4-6 字段
- 展开区各分组有独立标题，方便用户定位

```vue
<!-- 展开区内部：分组 -->
<div class="filter-card__advanced-inner">
  <div class="form-subgroup-label">单号信息</div>
  <div class="filter-grid filter-grid--advanced">
    <div class="filter-field">
      <label class="filter-field__label">HBL 单号</label>
      <a-input v-model="q.hbl" size="small" allow-clear placeholder="请输入 HBL" />
    </div>
    <div class="filter-field">
      <label class="filter-field__label">MBL 单号</label>
      <a-input v-model="q.mbl" size="small" allow-clear placeholder="请输入 MBL" />
    </div>
    <div class="filter-field">
      <label class="filter-field__label">柜号</label>
      <a-input v-model="q.containerNo" size="small" allow-clear placeholder="请输入柜号" />
    </div>
  </div>

  <div class="form-subgroup-label">人员信息</div>
  <div class="filter-grid filter-grid--advanced">
    <div class="filter-field">
      <label class="filter-field__label">操作员</label>
      <a-select v-model="q.operator" size="small" allow-search allow-clear placeholder="请选择操作员" />
    </div>
    <div class="filter-field">
      <label class="filter-field__label">客服</label>
      <a-select v-model="q.customerService" size="small" allow-search allow-clear placeholder="请选择客服" />
    </div>
  </div>

  <div class="form-subgroup-label">时间范围</div>
  <div class="filter-grid filter-grid--advanced">
    <div class="filter-field">
      <label class="filter-field__label">ETD</label>
      <a-range-picker v-model="q.etdRange" size="small" style="width:100%" />
    </div>
    <div class="filter-field">
      <label class="filter-field__label">创建时间</label>
      <a-range-picker v-model="q.createdRange" size="small" style="width:100%" />
    </div>
  </div>
</div>
```

**分组命名（货代场景）：**

| 分组名 | 典型字段 |
|--------|---------|
| 单号信息 | HBL、MBL、柜号、入仓单号、SO 号 |
| 人员信息 | 操作员、客服、单证、报关员 |
| 客户/往来 | 发货人、收货人、通知人、承运商 |
| 时间范围 | ETD、ETA、创建时间、入仓时间 |
| 港口/路线 | 起运港、目的港、目的地、中转港 |
| 货物信息 | 货物类型、包装类型、危险品标志 |

---

## Tier 4 — 31+ 字段：高级筛选抽屉

**何时用：** 超级用户需要跨多业务维度查询；字段太多无法在卡片内展示。

**特征：**
- 顶部常驻 Tier 0/1 筛选行（最核心 3-6 个字段）
- "高级筛选"按钮打开 Drawer
- Drawer 内字段分组（同 Tier 3 分组规则）
- Drawer 底部有独立「应用筛选」+「重置」操作
- 常驻区的「查询」只触发当前可见字段；Drawer 「应用筛选」后关闭并自动查询

```vue
<!-- 常驻顶部：Tier 1 结构（4-6 核心字段）-->
<div class="zone-l2-filter-card zone-card filter-card">
  <div class="filter-card__main">
    <div class="filter-card__fields">
      <div class="filter-card__body--basic">
        <div class="filter-grid">
          <!-- 3-4 个核心字段 -->
        </div>
      </div>
    </div>
    <div class="filter-card__actions-panel">
      <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
        <template #icon><icon-search /></template>查询
      </a-button>
      <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
      <!-- 展开改为「高级筛选」入口 -->
      <a-button size="small" type="text" class="reset-btn" title="高级筛选" @click="openAdvancedDrawer">
        筛选
        <icon-filter />
      </a-button>
    </div>
  </div>
</div>

<!-- 高级筛选 Drawer -->
<a-drawer
  v-model:visible="advancedDrawerVisible"
  title="高级筛选"
  :width="480"
  placement="right"
  :footer="true"
>
  <!-- 分组字段，同 Tier 3 结构 -->
  <a-form class="detail-form" layout="vertical" size="small" :model="advancedQuery">
    <div class="form-subgroup-label">单号信息</div>
    <div class="detail-form-grid detail-form-grid--2">
      <a-form-item label="HBL 单号">
        <a-input v-model="advancedQuery.hbl" size="small" allow-clear />
      </a-form-item>
      <!-- ... -->
    </div>
    <!-- 更多分组 -->
  </a-form>

  <template #footer>
    <div style="display:flex; justify-content:space-between">
      <a-button size="small" type="text" @click="resetAdvanced">重置</a-button>
      <div style="display:flex; gap:8px">
        <a-button size="small" @click="advancedDrawerVisible = false">取消</a-button>
        <a-button size="small" type="primary" @click="applyAdvanced">应用筛选</a-button>
      </div>
    </div>
  </template>
</a-drawer>
```

---

## 各 Tier 操作列对照

| Tier | 查询 | 重置 | 展开/高级筛选 |
|------|------|------|---------------|
| Tier 0 | 行内 `primary` 按钮 | 行内 `text` 按钮（≥2字段） | ❌ |
| Tier 1 | 右列 `primary` | 右列 `text` | ❌ |
| Tier 2 | 右列 `primary` | 右列 `text` | 右列展开链接 |
| Tier 3 | 右列 `primary` | 右列 `text` | 右列展开链接 |
| Tier 4 | 右列 `primary` | 右列 `text` | 右列「筛选」`text` 按钮打开 Drawer |

**操作列三个控件必须统一：**
- 高度：`var(--dense-control-h-filter)` = **32px**
- 字号：`var(--dense-font-nav)` = **13px**
- 查询：`type="primary"` + icon + `class="filter-card__query-btn"`
- 重置：`type="text"` + `class="reset-btn"`（无图标）
- 展开/筛选：原生 `<button>` + `class="filter-expand-link filter-expand-link--panel"`

---

## 布局通用禁止项

- ❌ 1-3 字段不得使用 `filter-card__main` + 右侧操作列（显得空旷多余）
- ❌ 7+ 字段不得把所有字段平铺不折叠（首屏被筛选区占满，表格看不到）
- ❌ 展开/收起链接不出现在 Tier 1（无折叠内容时无意义）
- ❌ 展开区不允许用 `a-modal`（中断扫描工作流）
- ❌ 不允许全局一律用同一套 Tier 2 模板，忽略字段数量
- ❌ Tier 4 高级筛选 Drawer 内禁止放 VXE 表格、图表等非筛选内容
- ❌ 操作列三个元素（查询/重置/展开）不能各自字号不同
