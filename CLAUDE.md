# OHL 货代系统 — AI 编码规范

## 技术栈
Vue 3 + TypeScript + Arco Design Vue + VXE Table + Vite

---

## 第一原则：禁止自写 CSS，必须复用 global.css

`src/styles/global.css` 已实现完整的设计系统。**任何组件、页面在开发前，必须先阅读 global.css，优先使用已有类名，禁止另起炉灶写相同效果的 CSS。**

> **验证协议**：使用任何 CSS 类名前，确认它存在于 global.css。遇到不确定的类名，用 grep 验证：
> ```bash
> grep -n "\.filter-field" src/styles/global.css
> ```
> 若 grep 无结果，该类名不存在，禁止使用。

---

## 开发前必读文件（按顺序）

1. `src/styles/global.css` — Token、布局类、组件类全在这里
2. `src/views/orderManage/saleOrder/components/SaleOrderSearch.vue` — 搜索区标准实现
3. `src/views/orderManage/saleOrder/components/SaleOrderDetailDrawer.vue` — 详情抽屉标准实现
4. `src/views/orderManage/saleOrder/components/SaleOrderActionBar.vue` — 工具栏标准实现

**读完确认哪些类可直接复用后，再开始写代码。**

---

## 页面类型 → 必用骨架

### 列表页
```vue
<template>
  <div class="page-root page-root--dense">
    <!-- 搜索区：class="zone-l2-filter-card zone-card filter-card" -->
    <!-- 工具栏：class="toolbar toolbar--dense" -->
    <!-- 表格容器：class="table-wrap"（flex:1，不要加 height） -->
  </div>
</template>
<style scoped>
/* 禁止在此重写 page-root / toolbar / filter-card / table-wrap */
</style>
```

### 详情抽屉
```vue
<a-drawer class="detail-drawer" ...>
  <div class="detail-drawer-body">
    <div class="detail-drawer-status">   <!-- 顶部状态栏：单号 + pill -->
    <div class="detail-drawer-scroll">   <!-- 灰底滚动区 -->
      <div class="detail-section">       <!-- 白卡分区 -->
        <div class="detail-section__head">
          <h4 class="detail-section__title">分区标题</h4>
        </div>
        <div class="detail-section__body">
          <!-- 内容 -->
        </div>
      </div>
    </div>
    <div class="detail-drawer-footer">   <!-- 吸底操作栏（有阴影） -->
  </div>
</a-drawer>
```

---

## 已有类名速查（禁止重复实现）

### 布局
| 需求 | 用这个 global.css 类 |
|------|---------------------|
| 列表页根 | `.page-root.page-root--dense` |
| 搜索栏 | `.zone-l2-filter-card.zone-card.filter-card` |
| 搜索字段网格 | `.filter-card__main` > `.filter-card__fields` > `.filter-card__body--basic` > `.filter-grid` |
| 单个搜索字段 | `.filter-field` + `.filter-field__label` |
| 搜索操作列 | `.filter-card__actions-col` > `.filter-card__actions-primary` |
| 工具栏 | `.toolbar.toolbar--dense` |
| 工具栏左侧分组 | `.toolbar-group` |
| 工具栏中间撑开 | `.toolbar-group.toolbar-group--grow` |
| 工具栏分割线 | `.toolbar-divider` |
| 工具栏右侧（刷新/列设置） | `.toolbar-aside` |
| 表格容器 | `.table-wrap` |
| 详情抽屉根 | `.detail-drawer-body` |
| 详情状态栏 | `.detail-drawer-status` + `__no` + `__sub` |
| 详情滚动区 | `.detail-drawer-scroll` |
| 详情卡片 | `.detail-section` + `__head` + `__title` + `__body` + `__actions` |
| 详情字段栅格 | `.detail-form-grid.detail-form-grid--4`（或 --3 / --6） |
| 详情字段 | `.detail-field` + `.detail-field__label` + `.detail-field__val` |
| 详情 footer | `.detail-drawer-footer` |

### 数据展示
| 需求 | 用这个（全部来自 global.css） |
|------|--------|
| 状态标签 | `<span class="s-pill" :data-s="wait|op|partial|acc|rel|draft|rej">` |
| 双行单元格 | `.cell-two-line` + `.c2-main` + `.c2-sub` |
| 可点击单号（蓝色加粗）| `<span class="link-text link-text--strong mono">` |
| 可点击普通链接 | `<span class="link-text mono">` |
| 金额（正） | `.amt-val` |
| 金额（负/红冲） | `.amt-neg` |
| 金额（未付警告） | `.amt-unpaid` |
| 金额（零） | `.amt-zero` |
| 行内操作按钮 | `<a-button type="text" class="row-action-btn"><icon /></a-button>` + `<a-tooltip>` |
| 危险货物标签 | `<span class="s-pill" data-s="wait"><icon-exclamation-circle />危险品</span>`（禁止自写 danger-cargo-pill）|
| 状态/范围 Tab | `.stab` + `.stab--active`；计数用 `.stab-badge`（不是 stab-count）|
| Tab 计数—危险红色 | `.stab-badge.stab-badge--danger` |
| Tab 计数—警告橙色 | `.stab-badge.stab-badge--warn` |

---

## 搜索区规范（唯一合法结构）

参考 `src/views/orderManage/saleOrder/components/SaleOrderSearch.vue`。

```html
<div class="zone-l2-filter-card zone-card filter-card">
  <div class="filter-card__main">
    <div class="filter-card__fields">
      <div class="filter-card__body--basic">
        <div class="filter-grid">                      <!-- 4列 grid，已在 global.css 定义 -->
          <div class="filter-field">
            <label class="filter-field__label">字段名</label>
            <a-input size="small" placeholder="请输入" allow-clear @press-enter="handleSearch" />
          </div>
          <div class="filter-field">
            <label class="filter-field__label">状态</label>
            <a-select size="small" placeholder="请选择" allow-clear @change="handleSearch" />
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧操作列：固定 84px，竖排查询/重置 -->
    <div class="filter-card__actions-col">
      <div class="filter-card__actions-primary">
        <a-button size="small" type="primary" @click="handleSearch">查询</a-button>
        <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
      </div>
    </div>
  </div>
</div>
```

```
❌ 禁止用 .search-bar / .sf / .sf-label（这些类不在 global.css 里）
❌ 重置按钮加图标
❌ 重置按钮 type="outline"
✅ 下拉选择变更 → @change="handleSearch" 自动查询
✅ 文本输入 → @press-enter="handleSearch"，不 auto-search
```

---

## 工具栏规范（唯一合法结构）

参考 `src/views/orderManage/saleOrder/components/SaleOrderActionBar.vue`。

```html
<div class="toolbar toolbar--dense">
  <!-- 左：主操作分组 -->
  <div class="toolbar-group">
    <a-button size="small" type="primary"><template #icon><icon-plus /></template>新建</a-button>
  </div>
  <div class="toolbar-divider" />
  <!-- 中：次要操作分组（flex:1 撑开） -->
  <div class="toolbar-group toolbar-group--grow">
    <a-button size="small" type="outline">复制</a-button>
    <a-button size="small" type="outline">导出</a-button>
  </div>
  <!-- 右：已选提示 + 工具按钮（刷新/列设置必须在这里，type="text"，icon-only） -->
  <div class="toolbar-aside">
    <span v-if="selectedCount > 0" class="bulk-hint">已选 {{ selectedCount }} 条</span>
    <a-button size="small" type="text"><template #icon><icon-refresh /></template></a-button>
  </div>
</div>
```

```
❌ 禁止 .toolbar-left / .toolbar-right（用 toolbar-group / toolbar-aside）
❌ 刷新按钮 type="outline"（必须 type="text"，且放 toolbar-aside 右侧）
❌ 在 <style scoped> 重写 .toolbar（global.css 已定义）
```

---

## 按钮规范

| 场景 | 写法 |
|------|------|
| 工具栏主操作（新建/创建） | `<a-button type="primary" size="small"><template #icon><icon-plus /></template>新建</a-button>` |
| 工具栏次操作（复制/打印/导出） | `<a-button type="outline" size="small">` |
| 工具栏工具按钮（**刷新必须是 text**） | `<a-button type="text" size="small"><template #icon><icon-refresh /></template></a-button>` |
| 搜索区重置 | `<a-button type="text" size="small" class="reset-btn">重置</a-button>`（不加图标） |
| 表格行内操作 | `<a-button type="text" class="row-action-btn" @click="..."><icon-eye /></a-button>` + `<a-tooltip>` |
| 危险操作 | 放入 `<a-dropdown>` 下拉菜单，`<a-doption class="danger-opt">`，禁止直接暴露 |

---

## 字体规范（禁止硬编码 px）

| 场景 | Token | 实际值 |
|------|-------|--------|
| 表格单元格、输入值、链接 | `var(--dense-font-data)` | 13px/500 |
| 按钮、Tab、chip | `var(--dense-font-nav)` | 13px/500 |
| 表头、分区标题、抽屉标题 | `var(--dense-font-title)` | 12px/600 |
| 筛选标签、form label | `var(--dense-font-field)` | 12px/500 |
| placeholder、副信息 | `var(--dense-font-aux)` | 11px/400 |
| 序号、badge | `var(--dense-font-micro)` | 10px/400 |

**禁止出现 14px、15px、16px 的业务区文字。禁止 font-weight: 700。**

---

## VXE Table 必须遵守

```vue
<vxe-table
  border="none"
  size="small"
  height="100%"
  show-overflow="title"
  :row-config="{ isHover: true, keyField: 'Id' }"
  :data="rows"
>
  <!-- 必须至少有一列用 min-width（不是 width），让表格撑满容器 -->
  <vxe-column field="name" title="名称" min-width="160" />
</vxe-table>
```

- 禁止 `border="default"` 或不写 border
- 禁止所有列都用 `width`（会出现右侧空白）
- 固定列：左固定 checkbox/序号/主单号；右固定操作列

---

## 颜色语义（禁止整行铺背景色）

状态颜色只在 `.s-pill[data-s]` 上体现，禁止对表格行用 `row-class-name` 铺底色。

| data-s | 语义 | 颜色 |
|--------|------|------|
| `wait` | 待处理/待确认 | 橙 |
| `op` | 操作中/应付 | 蓝 |
| `partial` | 部分完成 | 紫 |
| `acc` | 已接单/已收/应收 | 青 |
| `rel` | 已放舱/进行中 | 绿 |
| `draft` | 草稿 | 灰 |
| `rej` | 拒绝/异常/逾期 | 红 |

---

## 禁止项清单

### 布局
```
❌ .search-bar / .sf / .sf-label（不在 global.css，必须用 filter-card 体系）
❌ .toolbar-left / .toolbar-right（不在 global.css，用 toolbar-group / toolbar-aside）
❌ 在 <style scoped> 里重写 global.css 已有类（toolbar/detail-section/filter-field 等）
❌ 详情抽屉自写 .meta-bar / .info-card（用 .detail-section）
❌ 抽屉不加 class="detail-drawer"（Arco 默认 16px 标题不会被覆盖）
```

### 按钮
```
❌ 刷新按钮 type="outline"（刷新 = 工具操作，必须 type="text"）
❌ 重置按钮 type="outline" 或携带图标（必须 type="text" 纯文字）
❌ 行内操作用文字或原生 <button>（必须 a-button type="text" + row-action-btn + a-tooltip）
```

### 颜色（禁止 hex，必须用 CSS 变量）
```
❌ color: #ff7d00  →  color: var(--warning-6)
❌ color: #f53f3f  →  color: var(--danger-6)
❌ background: #faf0e6  →  background: var(--warning-1)
❌ 自写危险货 pill 样式  →  用 s-pill[data-s="wait"] + icon
❌ 表格行 row-class-name 铺背景色（状态色只在 s-pill 上）
```

### 类名错误（容易写错的）
```
❌ class="freight-table"（已废弃，直接删掉）
❌ .stab-count（不存在，用 .stab-badge）
❌ .stab-count--danger（不存在，用 .stab-badge--danger）
❌ font-weight: 700（最大 600，仅 F3 标题）
❌ font-size: 14px / 16px 硬编码
```

### 表格
```
❌ VXE Table 所有列用 width（至少一列用 min-width 撑满容器）
❌ emoji 作为空状态图标（用 Arco icon + state-center 类）
```

---

## 颜色变量速查

| 含义 | 变量 |
|------|------|
| 警告橙（危险货/待处理/icon 警示） | `var(--warning-6)` |
| 危险红（异常/拒绝/逾期） | `var(--danger-6)` |
| 成功绿 | `var(--success-6)` |
| 主色蓝 | `var(--primary-6)` |
| 警告浅底色 | `var(--warning-1)` |
| 危险浅底色 | `var(--danger-1)` |

---

## 新页面开发流程

1. **先读** `src/styles/global.css` 确认已有哪些类
2. **先读** 同模块已有页面（如 `src/views/orderManage/saleOrder/`）确认代码风格
3. 按页面类型套用骨架（列表页 / 详情抽屉 / 表单弹窗）
4. 从"已有类名速查表"选用类名，**不自写等效 CSS**
5. Mock 数据覆盖各状态（加载/空/失败/无权限）
6. **写文件用 Python**（Windows 路径下禁止直接 Write tool 写 .vue，避免 null byte）

```python
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
```

---

## 上线前自查清单

```
□ 搜索区：用 filter-card 体系，无 .sf/.sf-label
□ 工具栏：刷新在 toolbar-aside 且 type="text"，重置无图标
□ 表格：border="none" size="small" height="100%"，至少一列 min-width
□ 抽屉：有 class="detail-drawer"，用 detail-section 分区
□ 状态：全用 s-pill[data-s]，无硬编码状态色
□ 颜色：无 hex 颜色，全用 CSS 变量
□ 字体：无 14px/16px 硬编码，无 font-weight:700
□ 类名：无 freight-table/stab-count/search-bar 废弃类
□ scoped style：无重写 global.css 已有类
```