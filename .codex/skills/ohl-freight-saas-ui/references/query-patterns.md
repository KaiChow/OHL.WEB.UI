# Query Patterns

Rules for search panels, advanced filter panels, and all query controls.

---

## Component Size Rule

All query controls in list pages must use `size="small"`.
Never use `size="medium"` or `size="large"` for any control inside a search panel.

---

## Basic Query Layout

Use the `.sale-order-query-grid` CSS grid pattern:

```vue
<section class="toolbar query-panel sale-order-search">
  <!-- Top row: transport tabs + auxiliary toggle -->
  <div class="sale-order-search__top">
    <div class="transport-tabs">
      <button
        v-for="tab in transportTabs" :key="tab.value"
        class="transport-tab"
        :class="{ 'transport-tab--active': activeTransport === tab.value }"
        type="button"
        @click="activeTransport = tab.value"
      >{{ tab.label }}</button>
    </div>
  </div>

  <!-- Query grid -->
  <div class="sale-order-query-grid">
    <!-- Keyword search with type selector -->
    <div class="query-field query-field--search">
      <a-select v-model="quickSearchField" class="query-type-select" size="small" :options="quickSearchFields" />
      <a-input v-model="keyword" size="small" allow-clear placeholder="请输入">
        <template #prefix><icon-search /></template>
      </a-input>
    </div>

    <!-- Regular query fields -->
    <label class="query-field">
      <span>业务类型</span>
      <a-select v-model="businessType" size="small" allow-clear placeholder="请选择" :options="businessTypeOptions" />
    </label>

    <label class="query-field">
      <span>进/出口单</span>
      <a-select v-model="orderType" size="small" allow-clear placeholder="请选择" :options="orderTypeOptions" />
    </label>

    <label class="query-field">
      <span>业务员</span>
      <a-input v-model="salesman" size="small" allow-clear placeholder="请输入" />
    </label>

    <!-- Actions column -->
    <div class="query-actions sale-order-query-actions">
      <a-button size="small" type="primary" @click="$emit('search')">
        <template #icon><icon-search /></template>查询
      </a-button>
      <a-button size="small" @click="$emit('reset')">
        <template #icon><icon-refresh /></template>重置
      </a-button>
      <a-button size="small" type="text" @click="$emit('openAdvanced')">
        更多<a-badge v-if="activeAdvancedCount" :count="activeAdvancedCount" />
      </a-button>
    </div>
  </div>
</section>
```

### Query Field Label Rule

Labels use class `.query-field > span`:
- Font size: 12px
- Color: `var(--color-text-2)`
- Text-align: right
- White-space: nowrap

Label column width in `.query-field`: `grid-template-columns: 66px minmax(0, 1fr)`
For the search field with type selector: `grid-template-columns: 118px minmax(0, 1fr)`

---

## Field Selection Priority

In the basic query panel, always show high-frequency identifiers first:

1. Keyword type selector + keyword input (搜索字段 + 关键词)
2. 业务类型 (FCL / LCL / AIR etc.)
3. 进/出口单
4. 业务员
5. 操作员
6. 装箱方式 / 服务项

Date range and customer go into advanced query unless the user requests them in basic.

---

## Quick Search Field Options

Always include these identifiers in the type selector:

```typescript
export const quickSearchFields = [
  { label: '业务单号', value: 'OrderNo' },
  { label: '委托单号', value: 'DcgNo' },
  { label: 'HBL提单号', value: 'HblNo' },
  { label: 'MBL提单号', value: 'MblNo' },
  { label: '柜号', value: 'ContainerNo' },
  { label: 'SO号', value: 'SoNo' },
]
```

---

## Advanced Query Panel

Render inline below the basic search panel. Never use a modal or page overlay.

```vue
<div v-if="advancedOpen" class="advanced-filter-panel">
  <!-- Top bar: title + group tabs + actions -->
  <div class="advanced-filter-panel__top">
    <div class="advanced-filter-panel__title">
      <strong>高级查询</strong>
      <span v-if="activeCount > 0">已设置 {{ activeCount }} 个条件</span>
    </div>
    <div class="advanced-filter-side" style="display:flex;flex-direction:row;gap:4px;">
      <button
        v-for="tab in filterGroups" :key="tab.key"
        class="advanced-filter-tab"
        :class="{ 'advanced-filter-tab--active': activeGroup === tab.key }"
        type="button"
        @click="activeGroup = tab.key"
      >
        {{ tab.label }}
        <em>{{ tab.count }}</em>
      </button>
    </div>
    <div class="advanced-filter-panel__actions">
      <a-button size="small" type="text" @click="$emit('reset')">清空条件</a-button>
      <a-button size="small" @click="$emit('close')">收起</a-button>
      <a-button size="small" type="primary" @click="$emit('apply')">应用查询</a-button>
    </div>
  </div>

  <!-- Content: side group nav + filter grid -->
  <div class="advanced-filter-panel__content">
    <div class="advanced-filter-side">
      <button
        v-for="tab in filterGroups" :key="tab.key"
        class="advanced-filter-tab"
        :class="{ 'advanced-filter-tab--active': activeGroup === tab.key }"
        type="button"
        @click="activeGroup = tab.key"
      >
        {{ tab.label }}<em>{{ tab.count }}</em>
      </button>
    </div>
    <div class="advanced-filter-main">
      <div class="advanced-filter-section__head">
        <strong>{{ currentGroup.label }}</strong>
        <span>{{ currentGroup.description }}</span>
      </div>
      <div class="advanced-filter-grid">
        <div v-for="field in currentGroup.fields" :key="field.key"
          class="advanced-filter-item"
          :class="{ 'advanced-filter-item--span-2': field.span2 }">
          <label class="advanced-filter-label">{{ field.label }}</label>
          <div class="advanced-filter-control">
            <!-- render input / select / date-range based on field.type -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Summary: active filter chips -->
  <div v-if="activeCount > 0" class="advanced-filter-summary">
    <span>已选条件：</span>
    <a-tag v-for="chip in activeChips" :key="chip.key"
      class="advanced-filter-summary__tag"
      size="small" closable
      @close="clearField(chip.key)">
      {{ chip.label }}：{{ chip.value }}
    </a-tag>
  </div>
</div>
```

### Advanced Filter Group Structure

Group the 50+ fields into these logical sections:

| Group key    | Label      | Contains                                    |
|--------------|------------|---------------------------------------------|
| `identifier` | 单号信息   | 业务单号、委托单号、HBL、MBL、柜号、SO号     |
| `role`       | 客户与角色 | 客户、业务员、操作员、客服、发货人、收货人    |
| `transport`  | 运输与节点 | 船公司、船名、航次、起运港、目的港、ETD、ETA  |
| `time`       | 时间节点   | 截关日、开船日、到港日、提货日、完成日        |
| `business`   | 业务标记   | 业务类型、进出口、装箱方式、服务项、快捷标签  |

---

## Field Component Rules

| Field type        | Component                | Notes                              |
|-------------------|--------------------------|------------------------------------|
| Identifier / name | `<a-input size="small">` | allow-clear                        |
| Option list       | `<a-select size="small">`| allow-clear, placeholder="请选择" |
| Date single       | `<a-date-picker size="small">` | format="YYYY-MM-DD"         |
| Date range        | `<a-range-picker size="small">` | format="YYYY-MM-DD"        |
| Boolean flag      | `<a-switch size="small">` or checkbox group            |
| Port search       | `<a-select size="small" allow-search remote>` | supports typing  |

---

## Forbidden Query Patterns

- Never use a modal or drawer for advanced query.
- Never put all 50+ fields visible at once without grouping.
- Never use `size="medium"` or `size="large"` on any query control.
- Never make the search panel taller than ~120px in collapsed state.
- Never label fields with generic placeholders only — always show a label element.
- Never show the advanced query open by default.
