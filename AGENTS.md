# OHL 货代系统 — AI Agent 开发规范

## 技术栈

Vue 3 · TypeScript · Arco Design Vue · VXE Table · Vite

## 最重要的一条规则

**`src/styles/global.css` 已实现完整 UI 设计系统。开发任何页面或组件前，必须先读该文件，复用已有类名，禁止另写等效 CSS。**

项目级 UI skill（源码 `ui-skill/freight-arco-ui/`，Codex 同步路径 `.agents/skills/freight-arco-ui/`）：

- 入口：`ui-skill/freight-arco-ui/SKILL.md` 或 `.agents/skills/freight-arco-ui/SKILL.md`
- 调用：`$freight-arco-ui`
- 维护：改源码后运行 `npm run sync-ui-skill`

涉及页面设计、布局、配色、表格、详情、表单、按钮、状态、质感问题时，先读该 skill，再按任务读取对应 `references/` 文件。

参考已有实现：`src/views/orderManage/saleOrder/` 目录（最完整的示例）。

---

## 列表页骨架（必须）

```vue
<template>
  <div class="page-root page-root--dense">
    <!-- 搜索区：必须用 filter-card，禁止用 .search-bar/.sf/.sf-label -->
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__main">
        <div class="filter-card__fields">
          <div class="filter-card__body--basic">
            <div class="filter-grid">
              <div class="filter-field">
                <label class="filter-field__label">字段名</label>
                <a-input size="small" placeholder="请输入" allow-clear @press-enter="handleSearch" />
              </div>
            </div>
          </div>
        </div>
        <div class="filter-card__actions-col">
          <div class="filter-card__actions-primary">
            <a-button size="small" type="primary" @click="handleSearch">查询</a-button>
            <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="toolbar toolbar--dense">
      <div class="toolbar-group">
        <a-button size="small" type="primary"><template #icon><icon-plus /></template>新建</a-button>
      </div>
      <div class="toolbar-group toolbar-group--grow"></div>
      <div class="toolbar-aside">
        <a-button size="small" type="text"><template #icon><icon-refresh /></template></a-button>
      </div>
    </div>
    <div class="table-wrap">
      <vxe-table border="none" size="small" height="100%" :data="rows"
        :row-config="{ isHover: true, keyField: 'Id' }">
        <vxe-column field="name" title="名称" min-width="160" />
        <!-- 至少一列必须用 min-width，否则右侧出现空白 -->
      </vxe-table>
    </div>
  </div>
</template>
```

---

## 详情抽屉骨架（必须）

```vue
<a-drawer class="detail-drawer" v-model:visible="visible" :width="560" :footer="false">
  <div class="detail-drawer-body">
    <div class="detail-drawer-status">
      <span class="detail-drawer-status__no mono">{{ row.No }}</span>
      <span class="s-pill" :data-s="statusCode">{{ statusText }}</span>
      <span class="detail-drawer-status__sub">{{ row.Customer }}</span>
    </div>
    <div class="detail-drawer-scroll">
      <div class="detail-section">
        <div class="detail-section__head">
          <h4 class="detail-section__title">基本信息</h4>
          <div class="detail-section__actions"><!-- 右侧操作按钮 --></div>
        </div>
        <div class="detail-section__body">
          <div class="detail-form-grid detail-form-grid--4">
            <div class="detail-field">
              <span class="detail-field__label">字段名</span>
              <span class="detail-field__val">值</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-drawer-footer">
      <a-button size="small">取消</a-button>
      <a-button size="small" type="primary">确认</a-button>
    </div>
  </div>
</a-drawer>
```

---

## 已有类名（禁止重复实现）

### 布局类

- 列表页根：`page-root page-root--dense`
- 搜索栏：`zone-l2-filter-card filter-card` / `filter-card__main` / `filter-grid` / `filter-field` / `filter-field__label`（禁止 `search-bar`/`sf`/`sf-label`）
- 工具栏：`toolbar` / `toolbar-group` / `toolbar-group--grow` / `toolbar-aside`（禁止 `toolbar-left`/`toolbar-right`）
- 工具栏分割线：`toolbar-divider`
- 表格容器：`table-wrap`
- 详情抽屉：`detail-drawer-body` / `detail-drawer-status` / `detail-drawer-scroll` / `detail-drawer-footer`
- 详情分区：`detail-section` / `detail-section__head` / `detail-section__title` / `detail-section__body` / `detail-section__actions`
- 详情内嵌子表容器：`detail-section__body--table`（padding:0，横向滚动）
- 详情可编辑子表：`detail-mini-vxe`（禁止 `show-overflow`，`row-config.height: 38`）
- 详情字段：`detail-field` / `detail-field__label` / `detail-field__val`
- 详情栅格：`detail-form-grid detail-form-grid--4`（或 --3 / --6）

### 数据展示类

- 状态标签：`s-pill` + `data-s="wait|op|partial|acc|rel|draft|rej"`
- 双行单元格：`cell-two-line` / `c2-main` / `c2-sub`
- 单号链接（蓝粗）：`link-text link-text--strong mono`
- 普通链接：`link-text mono`
- 行内操作按钮：`<a-button type="text" class="row-action-btn"><icon /></a-button>` + `<a-tooltip>`（禁止原生 `<button>`）
- 金额：`amt-val`（正）/ `amt-neg`（负/红冲）/ `amt-unpaid`（未结）/ `amt-zero`（零）
- 状态 Tab 计数：`stab-badge`（禁止 `stab-count`）/ `stab-badge--danger` / `stab-badge--warn`

---

## 字体规范

| 场景 | 必用 Token | 值 |
|------|-----------|-----|
| 表格值、输入值、链接 | `--dense-font-data` | 13px/500 |
| 按钮文字、Tab、chip | `--dense-font-nav` | 13px/500 |
| 表头、分区标题 | `--dense-font-title` | 12px/600 |
| 筛选标签、form label | `--dense-font-field` | 12px/500 |
| placeholder、副信息 | `--dense-font-aux` | 11px/400 |
| 序号、badge | `--dense-font-micro` | 10px/400 |

**禁止 14px/15px/16px 业务区文字。禁止 font-weight: 700。**

---

## 状态颜色语义

| data-s | 颜色 | 语义 |
|--------|------|------|
| `wait` | 橙 | 待处理、待确认、待付款 |
| `op` | 蓝 | 操作中、进行中、应付 |
| `partial` | 紫 | 部分完成 |
| `acc` | 青 | 已接单、应收、已完成 |
| `rel` | 绿 | 已放舱、已结清 |
| `draft` | 灰 | 草稿 |
| `rej` | 红 | 拒绝、异常、逾期、红冲 |

**禁止对表格行使用 row-class-name 铺底色。状态颜色只在 s-pill 上体现。**

---

## 禁止清单

### 布局

```
❌ .search-bar / .sf / .sf-label（用 filter-card / filter-field / filter-field__label）
❌ .toolbar-left / .toolbar-right（用 toolbar-group / toolbar-aside）
❌ 自写 .meta-bar / .info-card / .status-bar 等等效于已有 global.css 类
❌ 抽屉不加 class="detail-drawer"（全局样式覆盖依赖此类名）
```

### 按钮

```
❌ 刷新按钮 type="outline"（必须 type="text"）
❌ 重置按钮 type="outline" 或带图标（必须 type="text"，纯文字）
❌ 行内操作用文字（必须 icon-only + row-action-btn + tooltip）
❌ 行内操作用原生 <button>（用 <a-button type="text" class="row-action-btn">）
```

### 颜色（禁止 hex，用 CSS 变量）

```
❌ color: #ff7d00  →  var(--warning-6)
❌ color: #f53f3f  →  var(--danger-6)
❌ 整行铺状态背景色（状态色只在 s-pill 上）
❌ 自写危险货 pill 样式（用 s-pill[data-s="wait"] + icon）
```

### 类名（容易写错）

```
❌ class="freight-table"（已废弃，直接删掉）
❌ .stab-count / .stab-count--danger（用 .stab-badge / .stab-badge--danger）
❌ font-size: 14px / 16px 硬编码
❌ font-weight: 700（最大 600）
❌ VXE Table 所有列 width（至少一列 min-width）
```
