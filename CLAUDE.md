# OHL 货代系统 — AI 编码规范

## 技术栈
Vue 3 + TypeScript + Arco Design Vue + VXE Table + Vite

---

## 第一原则：禁止自写 CSS，必须复用 global.css

`src/styles/global.css` 已实现完整的设计系统。**任何组件、页面在开发前，优先使用已有类名，禁止另起炉灶写相同效果的 CSS。**

> **验证协议**：使用任何 CSS 类名前，确认它存在于 global.css。遇到不确定的类名，用 grep 验证：
> ```bash
> grep -n "\.filter-field" src/styles/global.css
> ```
> 若 grep 无结果，该类名不存在，禁止使用。

---

## 列表页骨架（完整可用）

```vue
<template>
  <div class="page-root page-root--dense">

    <!-- ① 搜索区 -->
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__main">
        <div class="filter-card__fields">
          <div class="filter-card__body--basic">
            <div class="filter-grid">
              <div class="filter-field">
                <label class="filter-field__label">关键词</label>
                <a-input size="small" placeholder="请输入" allow-clear @press-enter="handleSearch" />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">状态</label>
                <a-select size="small" placeholder="请选择" allow-clear @change="handleSearch" />
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

    <!-- ② 工具栏 -->
    <div class="toolbar toolbar--dense">
      <div class="toolbar-group">
        <a-button size="small" type="primary">
          <template #icon><icon-plus /></template>新建
        </a-button>
      </div>
      <div class="toolbar-divider" />
      <div class="toolbar-group toolbar-group--grow">
        <a-button size="small" type="outline">导出</a-button>
      </div>
      <div class="toolbar-aside">
        <span v-if="selectedCount > 0" class="bulk-hint">已选 {{ selectedCount }} 条</span>
        <a-button size="small" type="text" @click="fetchList">
          <template #icon><icon-refresh /></template>
        </a-button>
      </div>
    </div>

    <!-- ③ 表格容器（flex:1 自动撑满，禁止加 height） -->
    <div class="table-wrap">
      <vxe-table
        border="none"
        size="small"
        height="100%"
        show-overflow="title"
        :row-config="{ isHover: true, keyField: 'Id' }"
        :data="rows"
      >
        <!-- 至少一列用 min-width，禁止全部用 width -->
        <vxe-column type="checkbox" width="40" fixed="left" />
        <vxe-column field="OrderNo" title="单号" width="160" fixed="left">
          <template #default="{ row }">
            <span class="link-text link-text--strong mono" @click="openDetail(row)">
              {{ row.OrderNo }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="Status" title="状态" width="80">
          <template #default="{ row }">
            <span class="s-pill" :data-s="row.statusKey">{{ row.statusLabel }}</span>
          </template>
        </vxe-column>
        <vxe-column field="Remark" title="备注" min-width="200" />
        <vxe-column title="操作" width="80" fixed="right">
          <template #default="{ row }">
            <a-tooltip content="查看">
              <a-button type="text" class="row-action-btn" @click="openDetail(row)">
                <icon-eye />
              </a-button>
            </a-tooltip>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

  </div>
</template>

<style scoped>
/* 禁止在此重写 page-root / toolbar / filter-card / table-wrap */
</style>
```

---

## 全页详情骨架（完整可用）

适用场景：有流程步骤 + Tab 多分区的详情页（如业务单详情、订单详情）。

```vue
<template>
  <div class="page-root page-root--dense xp-wrap">

    <!-- 页头：面包屑 + 单号 + 状态 + 操作按钮 -->
    <div class="xp-head zone-card">
      <div class="xp-head__left">
        <a-breadcrumb style="font-size:var(--dense-font-aux);margin-bottom:6px">
          <a-breadcrumb-item>模块名</a-breadcrumb-item>
          <a-breadcrumb-item>列表</a-breadcrumb-item>
          <a-breadcrumb-item>{{ order.no }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="xp-head__title-row">
          <span class="link-text link-text--strong mono">{{ order.no }}</span>
          <span class="s-pill" :data-s="order.status">{{ order.statusText }}</span>
        </div>
        <div class="xp-head__meta">
          <span>{{ order.customer }}</span>
          <span class="xp-sep">·</span>
          <span>{{ order.salesman }}</span>
        </div>
      </div>
      <div class="xp-head__actions">
        <a-button size="small" type="text"><template #icon><icon-printer /></template></a-button>
        <a-button size="small" type="outline"><template #icon><icon-edit /></template>编辑</a-button>
        <a-button size="small" type="primary">确认</a-button>
        <a-dropdown trigger="click">
          <a-button size="small" type="outline"><icon-more /></a-button>
          <template #content>
            <a-doption>复制</a-doption>
            <a-doption class="danger-opt">取消</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- 流程步骤条（可选） -->
    <div class="detail-section xp-steps-card">
      <div class="detail-section__body">
        <a-steps :current="currentStep" size="small">
          <a-step title="待确认" />
          <a-step title="已确认" />
          <a-step title="处理中" />
          <a-step title="已完成" />
        </a-steps>
      </div>
    </div>

    <!-- Tab 内容区（flex:1 撑满，内部滚动） -->
    <div class="xp-tabs-card zone-card">
      <a-tabs v-model:active-key="activeTab" size="small" class="xp-tabs">

        <a-tab-pane key="basic" title="基本信息">
          <div class="xp-tab-body">
            <!-- 多个 detail-section 纵向排列 -->
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">分区标题</h4>
              </div>
              <div class="detail-section__body">
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <span class="detail-field__label">字段名</span>
                    <span class="detail-field__val">字段值</span>
                  </div>
                  <!-- detail-field--wide 跨两列 -->
                  <div class="detail-field detail-field--wide">
                    <span class="detail-field__label">备注</span>
                    <span class="detail-field__val">{{ order.remark }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="fees" title="费用信息">
          <div class="xp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">应收费用</h4>
              </div>
              <div class="detail-section__body" style="padding:0">
                <vxe-table border="none" size="small" :data="receivable"
                  :row-config="{ isHover:true, keyField:'id' }">
                  <vxe-column field="item" title="费用项" min-width="120" />
                  <vxe-column field="currency" title="币种" width="72" />
                  <vxe-column field="amount" title="金额" width="110" align="right">
                    <template #default="{ row }">
                      <span class="amt-val">{{ row.amount }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="invoiced" title="状态" width="88" align="center">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="row.invoiced ? 'acc' : 'draft'">
                        {{ row.invoiced ? '已开票' : '未开票' }}
                      </span>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </div>
        </a-tab-pane>

      </a-tabs>
    </div>

  </div>
</template>

<style scoped>
/* 页面级 flex 布局 — 只管"框架"，不管组件 */
.xp-wrap  { display: flex; flex-direction: column; overflow: hidden; }
.xp-head  { padding: 12px 16px; flex-shrink: 0; display: flex; align-items: flex-start; justify-content: space-between; }
.xp-head__left  { display: flex; flex-direction: column; gap: 2px; }
.xp-head__title-row { display: flex; align-items: center; gap: 8px; }
.xp-head__meta  { font-size: var(--dense-font-aux); color: var(--color-text-3); display: flex; align-items: center; gap: 4px; }
.xp-head__actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.xp-sep { color: var(--color-border-2); }
.xp-steps-card { flex-shrink: 0; }
.xp-tabs-card  { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.xp-tabs  { height: 100%; display: flex; flex-direction: column; }
/* Tab body 内部滚动 */
:deep(.arco-tabs-content) { flex: 1; overflow: hidden; }
:deep(.arco-tabs-pane)    { height: 100%; overflow-y: auto; }
.xp-tab-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
</style>
```

> **命名约定**：页面专属类用 2-3 字母前缀（`xp-`/`odp-`/`inv-`），防止污染全局。scoped 只写页面骨架，不重写 global.css 已有类。

---

## 全页表单骨架（完整可用）

适用场景：分组填写 + 吸底保存的新建/编辑表单页（如新建订单、新建对账单）。

```vue
<template>
  <div class="page-root page-root--dense xf-wrap">

    <!-- 页头：面包屑 + 标题 -->
    <div class="xf-head zone-card">
      <a-breadcrumb style="font-size:var(--dense-font-aux);margin-bottom:4px">
        <a-breadcrumb-item>模块名</a-breadcrumb-item>
        <a-breadcrumb-item>列表</a-breadcrumb-item>
        <a-breadcrumb-item>新建</a-breadcrumb-item>
      </a-breadcrumb>
      <div style="font-size:var(--dense-font-title);font-weight:600;color:var(--color-text-1)">新建业务单</div>
    </div>

    <!-- 表单主体：flex:1 纵向滚动，底部留 footer 空间 -->
    <div class="xf-body">

      <!-- A 组 -->
      <div class="detail-section">
        <div class="detail-section__head">
          <h4 class="detail-section__title">A · 基础信息</h4>
        </div>
        <div class="detail-section__body">
          <div class="xf-grid">
            <div class="xf-field">
              <label class="xf-label">客户 <span class="xf-req">*</span></label>
              <a-select v-model="form.customer" size="small" placeholder="请选择客户"
                allow-search allow-clear />
              <div v-if="errors.customer" class="xf-err">{{ errors.customer }}</div>
            </div>
            <div class="xf-field">
              <label class="xf-label">业务员</label>
              <a-select v-model="form.salesman" size="small" placeholder="请选择" allow-clear />
            </div>
            <!-- xf-field--wide 跨两列 -->
            <div class="xf-field xf-field--wide">
              <label class="xf-label">备注</label>
              <a-textarea v-model="form.remark" size="small" :max-length="500"
                show-word-limit :auto-size="{ minRows:2, maxRows:4 }" />
            </div>
          </div>
        </div>
      </div>

      <!-- B 组：含动态行 -->
      <div class="detail-section">
        <div class="detail-section__head">
          <h4 class="detail-section__title">B · 明细（动态行）</h4>
          <div class="detail-section__actions">
            <a-button size="small" type="outline" @click="addRow">
              <template #icon><icon-plus /></template>添加
            </a-button>
          </div>
        </div>
        <div class="detail-section__body" style="padding:0">
          <vxe-table border="none" size="small" :data="rows"
            :row-config="{ keyField:'id', isHover:true }">
            <vxe-column field="name" title="品名 *" min-width="140">
              <template #default="{ row }">
                <a-input v-model="row.name" size="small" placeholder="请输入" allow-clear />
              </template>
            </vxe-column>
            <vxe-column field="qty" title="数量" width="100">
              <template #default="{ row }">
                <a-input-number v-model="row.qty" size="small" :min="1" />
              </template>
            </vxe-column>
            <vxe-column title="操作" width="56" fixed="right" align="center">
              <template #default="{ row }">
                <a-tooltip content="删除">
                  <a-button type="text" class="row-action-btn" @click="removeRow(row.id)">
                    <icon-minus />
                  </a-button>
                </a-tooltip>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>

    </div><!-- /xf-body -->

    <!-- 吸底操作栏：复用 detail-drawer-footer -->
    <div class="detail-drawer-footer xf-footer">
      <a-button size="small" @click="handleCancel">取消</a-button>
      <a-button size="small" type="outline" @click="handleSaveDraft">存草稿</a-button>
      <a-button size="small" type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
    </div>

  </div>
</template>

<style scoped>
/* 页面级 flex 布局 — 只管"框架"，不管组件 */
.xf-wrap   { display: flex; flex-direction: column; overflow: hidden; }
.xf-head   { padding: 12px 16px; flex-shrink: 0; }
.xf-body   { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; padding-bottom: 0; }
.xf-footer { flex-shrink: 0; display: flex; justify-content: flex-end; gap: 8px; }

/* 表单字段网格（4列，含跨列） */
.xf-grid          { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px 16px; }
.xf-field         { display: flex; flex-direction: column; gap: 4px; }
.xf-field--wide   { grid-column: span 2; }
.xf-label         { font-size: var(--dense-font-field); color: var(--color-text-2); font-weight: 500; }
.xf-req           { color: var(--danger-6); margin-left: 2px; }
.xf-err           { font-size: var(--dense-font-aux); color: var(--danger-6); }
</style>
```

> **吸底栏**：全页表单复用 `detail-drawer-footer`（已在 global.css 定义阴影和 padding），只需加页面专属 class 控制对齐。

---

## 详情抽屉骨架（完整可用）

```vue
<a-drawer class="detail-drawer" :width="900" v-model:visible="visible">
  <div class="detail-drawer-body">

    <!-- 顶部状态栏 -->
    <div class="detail-drawer-status">
      <div class="detail-drawer-status__no">
        <span class="link-text link-text--strong mono">PTP2024000001</span>
      </div>
      <div class="detail-drawer-status__sub">
        <span class="s-pill" data-s="wait">待处理</span>
      </div>
    </div>

    <!-- 灰底滚动区 -->
    <div class="detail-drawer-scroll">

      <!-- 白卡分区 -->
      <div class="detail-section">
        <div class="detail-section__head">
          <h4 class="detail-section__title">基本信息</h4>
          <div class="detail-section__actions">
            <a-button size="small" type="outline">编辑</a-button>
          </div>
        </div>
        <div class="detail-section__body">
          <!-- 字段栅格：--4 / --3 / --6 可选 -->
          <div class="detail-form-grid detail-form-grid--4">
            <div class="detail-field">
              <span class="detail-field__label">客户名称</span>
              <span class="detail-field__val">深圳某某公司</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">业务类型</span>
              <span class="detail-field__val">整箱</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 吸底操作栏 -->
    <div class="detail-drawer-footer">
      <a-button type="primary" size="small" @click="handleSave">保存</a-button>
      <a-button size="small" @click="visible = false">关闭</a-button>
    </div>

  </div>
</a-drawer>
```

---

## 弹窗表单骨架（完整可用）

适用场景：行内快速编辑、新增单条记录、审批备注等轻量操作。

```vue
<!-- width: 单列字段用 520，双列字段用 680 -->
<a-modal
  v-model:visible="visible"
  :title="isEdit ? '编辑记录' : '新建记录'"
  :width="680"
  :mask-closable="false"
  @before-ok="handleOk"
  @cancel="handleCancel"
>
  <!-- 字段区：直接用 xf-grid（无需 detail-section，modal 层级已足够） -->
  <div class="xf-grid xf-grid--modal">
    <div class="xf-field">
      <label class="xf-label">字段名 <span class="xf-req">*</span></label>
      <a-input v-model="form.name" size="small" placeholder="请输入" allow-clear />
      <div v-if="errors.name" class="xf-err">{{ errors.name }}</div>
    </div>
    <div class="xf-field">
      <label class="xf-label">状态</label>
      <a-select v-model="form.status" size="small" placeholder="请选择" allow-clear />
    </div>
    <div class="xf-field xf-field--wide">
      <label class="xf-label">备注</label>
      <a-textarea v-model="form.remark" size="small" :max-length="500"
        show-word-limit :auto-size="{ minRows:2, maxRows:4 }" />
    </div>
  </div>

  <!-- footer slot：危险操作放左侧 -->
  <template #footer>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <!-- 危险操作（如删除）放左侧，非必须时省略此 div -->
        <a-button v-if="isEdit" type="text" status="danger" size="small" @click="handleDelete">删除</a-button>
      </div>
      <div style="display:flex;gap:8px">
        <a-button size="small" @click="handleCancel">取消</a-button>
        <a-button size="small" type="primary" :loading="submitting" @click="handleOk">确定</a-button>
      </div>
    </div>
  </template>
</a-modal>

<style scoped>
/* modal 内字段网格：2列（宽 modal 用），1列（窄 modal 用） */
.xf-grid--modal { grid-template-columns: repeat(2, 1fr); }
</style>
```

**Modal 规范要点：**
```
✅ :mask-closable="false" — 防止误触关闭丢失数据
✅ 危险操作（删除）放 footer 左侧，用 status="danger"
✅ 提交按钮带 :loading，防止重复提交
✅ 校验失败不关闭弹窗（在 @before-ok 里 return false）
❌ 禁止在 modal 内套 detail-section（层级过重）
❌ 禁止 width > 860（超宽 modal 改用全页表单）
```

---

## 数据概览页骨架（完整可用）

适用场景：首页 Dashboard、模块数据汇总、运营大屏。

```vue
<template>
  <div class="page-root page-root--dense db-wrap">

    <!-- ① KPI 指标行（global.css 已定义 kpi-card 系列） -->
    <div class="zone-card db-kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">待处理单量</div>
        <div class="kpi-body">
          <span class="kpi-value kpi-value--warn">12</span>
          <span class="kpi-unit">票</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">本月营收</div>
        <div class="kpi-body">
          <span class="kpi-value kpi-value--primary">328,400</span>
          <span class="kpi-unit">CNY</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">在途货物</div>
        <div class="kpi-body">
          <span class="kpi-value">56</span>
          <span class="kpi-unit">票</span>
        </div>
      </div>
      <!-- kpi-card--danger：左侧红色竖线，用于告警指标 -->
      <div class="kpi-card kpi-card--danger">
        <div class="kpi-label">逾期未处理</div>
        <div class="kpi-body">
          <span class="kpi-value kpi-value--danger">3</span>
          <span class="kpi-unit">票</span>
        </div>
      </div>
    </div>

    <!-- ② 内容区：左主右侧（或全宽单列） -->
    <div class="db-content">

      <!-- 主列：图表 + 列表 -->
      <div class="db-main">
        <!-- 图表卡片：detail-section 作容器，图表组件放 body 内 -->
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">近 30 天业务量趋势</h4>
            <div class="detail-section__actions">
              <a-radio-group v-model="chartRange" size="small" type="button">
                <a-radio value="7">近7天</a-radio>
                <a-radio value="30">近30天</a-radio>
              </a-radio-group>
            </div>
          </div>
          <div class="detail-section__body db-chart-body">
            <!-- 图表组件占位，固定高度 -->
            <div class="db-chart-placeholder"><!-- <v-chart :option="chartOption" /> --></div>
          </div>
        </div>

        <!-- 待办列表：detail-section + vxe-table（复用列表页表格规范） -->
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">待处理事项</h4>
            <div class="detail-section__actions">
              <a-button size="small" type="text">查看全部</a-button>
            </div>
          </div>
          <div class="detail-section__body" style="padding:0">
            <vxe-table border="none" size="small" :data="todoList"
              :row-config="{ isHover:true, keyField:'id' }">
              <vxe-column field="orderNo" title="单号" width="160">
                <template #default="{ row }">
                  <span class="link-text link-text--strong mono">{{ row.orderNo }}</span>
                </template>
              </vxe-column>
              <vxe-column field="type" title="类型" width="80" />
              <vxe-column field="status" title="状态" width="80">
                <template #default="{ row }">
                  <span class="s-pill" :data-s="row.statusKey">{{ row.statusLabel }}</span>
                </template>
              </vxe-column>
              <vxe-column field="deadline" title="截止时间" min-width="120" />
              <vxe-column title="操作" width="60" fixed="right">
                <template #default="{ row }">
                  <a-tooltip content="处理">
                    <a-button type="text" class="row-action-btn" @click="handleTodo(row)">
                      <icon-arrow-right />
                    </a-button>
                  </a-tooltip>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </div>

      <!-- 侧列：快捷入口 + 通知 -->
      <div class="db-aside">
        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">快捷操作</h4>
          </div>
          <div class="detail-section__body db-shortcuts">
            <a-button size="small" type="outline" long @click="$router.push('/order/create')">
              <template #icon><icon-plus /></template>新建业务单
            </a-button>
            <a-button size="small" type="outline" long>
              <template #icon><icon-upload /></template>批量导入
            </a-button>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section__head">
            <h4 class="detail-section__title">系统通知</h4>
          </div>
          <div class="detail-section__body db-notices">
            <div v-for="n in notices" :key="n.id" class="db-notice-item">
              <span class="s-pill" :data-s="n.level">{{ n.tag }}</span>
              <span class="db-notice-text">{{ n.content }}</span>
              <span class="db-notice-time">{{ n.time }}</span>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /db-content -->
  </div>
</template>

<style scoped>
/* 页面骨架 */
.db-wrap    { overflow-y: auto; }
.db-kpi-row { display: flex; flex-shrink: 0; }   /* kpi-card 内联排列 */

/* 双列布局：主 + 侧 */
.db-content { display: grid; grid-template-columns: 1fr 280px; gap: 8px; padding: 0; margin-top: 8px; }
.db-main    { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.db-aside   { display: flex; flex-direction: column; gap: 8px; }

/* 图表区 */
.db-chart-body        { padding: 0 16px 16px; }
.db-chart-placeholder { height: 220px; display: flex; align-items: center; justify-content: center;
                        background: var(--color-fill-1); border-radius: var(--dense-radius);
                        color: var(--color-text-4); font-size: var(--dense-font-aux); }

/* 快捷操作 */
.db-shortcuts { display: flex; flex-direction: column; gap: 8px; }

/* 通知列表 */
.db-notices      { display: flex; flex-direction: column; gap: 10px; }
.db-notice-item  { display: flex; align-items: flex-start; gap: 6px; }
.db-notice-text  { flex: 1; font-size: var(--dense-font-aux); color: var(--color-text-2); line-height: 1.5; }
.db-notice-time  { font-size: var(--dense-font-micro); color: var(--color-text-4); flex-shrink: 0; }
</style>
```

**Dashboard 规范要点：**
```
✅ KPI 数值用 global.css 的 kpi-value / kpi-value--warn / kpi-value--danger 等修饰类
✅ 图表容器用 detail-section 包裹，标题行可放时间范围切换
✅ 待办列表直接套列表页的 vxe-table 规范（border="none" size="small"）
✅ 侧栏快捷操作用 a-button type="outline" long（撑满宽度）
❌ kpi-value 字号（28px）是 global.css 定义值，不是硬编码，此处豁免
❌ 禁止自定义大数字样式（必须用 kpi-value 系列类）
❌ 图表高度固定（如 220px），不要随内容撑开
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
| 详情字段（只读展示） | `.detail-field` + `.detail-field__label` + `.detail-field__val` |
| 详情字段（可编辑） | `<a-form layout="vertical" class="detail-form">` + `<a-form-item label="...">` |
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
| 自定义标签（如 CRM 标签池） | `<span class="s-pill" :data-s="tagPill(tag)">` + 组件内定义 `TAG_PILL_MAP` |

### 标签颜色语义（TAG_PILL_MAP 参考）

```ts
// 在组件内定义，不抽到全局（各业务模块语义不同）
const TAG_PILL_MAP: Record<string, string> = {
  VIP: 'rel',         // 绿：高价值/长期
  '长期合作': 'rel',
  REPLIED: 'acc',     // 青：已回复/已收
  '已返佣': 'acc',
  INQUIRIED: 'op',    // 蓝：进行中/询盘
  '报价中': 'op',
  '重点跟进': 'wait', // 橙：待处理
  'keep follow up': 'wait',
  BAU: 'partial',     // 紫：部分/一般
  '异常邮箱': 'rej',  // 红：异常/已流失
  '已流失': 'rej',
};
function tagPill(tag: string): string { return TAG_PILL_MAP[tag] ?? 'draft'; }
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

> **强制要求**：项目所有表格必须使用 `vxe-table`，**禁止使用 `a-table`**（Arco 原生表格）。
> 包括：列表页主表格、详情内子表格、弹窗内表格、Dashboard 待办列表，全部统一用 vxe-table。

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

### 必填属性
| 属性 | 必填值 | 说明 |
|------|--------|------|
| `border` | `"none"` | 禁止 `"default"` 或不写 |
| `size` | `"small"` | 统一紧凑尺寸 |
| `height` | `"100%"` | 列表页主表格必填；弹窗/详情内子表格可用 `"auto"` |
| `show-overflow` | `"title"` | 溢出显示 tooltip |
| `:row-config` | `{ isHover: true, keyField: 'Id' }` | keyField 对应数据主键字段名 |

### 列宽规则
- **至少一列用 `min-width`**（让表格撑满容器，禁止全部用 `width`）
- 固定宽度列：checkbox(40) / 序号(44) / 状态(80) / 操作(56-80)
- 内容列：主单号(160) / 名称(min-width:140+) / 备注(min-width:200+)
- 固定列：左固定 checkbox/序号/主单号；右固定操作列

### 场景对应写法
```vue
<!-- ① 列表页主表格（height="100%"，放在 table-wrap 内） -->
<div class="table-wrap">
  <vxe-table border="none" size="small" height="100%" show-overflow="title"
    :row-config="{ isHover:true, keyField:'Id' }" :data="rows" :loading="loading">
    <vxe-column type="checkbox" width="40" fixed="left" />
    <vxe-column field="OrderNo" title="单号" width="160" fixed="left">
      <template #default="{ row }">
        <span class="link-text link-text--strong mono" @click="openDetail(row)">{{ row.OrderNo }}</span>
      </template>
    </vxe-column>
    <vxe-column field="Remark" title="备注" min-width="200" />
    <vxe-column title="操作" width="80" fixed="right">
      <template #default="{ row }">
        <a-tooltip content="查看">
          <a-button type="text" class="row-action-btn" @click="openDetail(row)"><icon-eye /></a-button>
        </a-tooltip>
      </template>
    </vxe-column>
  </vxe-table>
</div>

<!-- ② 详情/弹窗内子表格（height="auto"，放在 detail-section__body style="padding:0" 内） -->
<div class="detail-section__body" style="padding:0">
  <vxe-table border="none" size="small" height="auto" show-overflow="title"
    :row-config="{ isHover:true, keyField:'id' }" :data="subRows">
    <vxe-column field="item" title="费用项" min-width="120" />
    <vxe-column field="amount" title="金额" width="110" align="right">
      <template #default="{ row }"><span class="amt-val">{{ row.amount }}</span></template>
    </vxe-column>
  </vxe-table>
</div>

<!-- ③ 可编辑表格（行内有输入框，同样 vxe-table） -->
<vxe-table border="none" size="small" height="auto"
  :row-config="{ keyField:'id', isHover:true }" :data="editRows">
  <vxe-column field="name" title="品名 *" min-width="140">
    <template #default="{ row }">
      <a-input v-model="row.name" size="small" placeholder="请输入" allow-clear />
    </template>
  </vxe-column>
  <vxe-column field="qty" title="数量" width="100">
    <template #default="{ row }">
      <a-input-number v-model="row.qty" size="small" :min="1" />
    </template>
  </vxe-column>
  <vxe-column title="操作" width="56" fixed="right" align="center">
    <template #default="{ row }">
      <a-tooltip content="删除">
        <a-button type="text" class="row-action-btn" @click="removeRow(row.id)"><icon-minus /></a-button>
      </a-tooltip>
    </template>
  </vxe-column>
</vxe-table>
```

```
❌ 禁止 <a-table>（Arco 原生表格）
❌ 禁止 border="default" 或不写 border
❌ 禁止全列 width（至少一列 min-width）
❌ 禁止 table-wrap 外层套 overflow:auto（双滚动条）
❌ 禁止 emoji 作为空状态图标
```

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

## 颜色变量速查（禁止 hex，必须用变量）

| 含义 | 变量 |
|------|------|
| 警告橙（危险货/待处理/icon 警示） | `var(--warning-6)` |
| 危险红（异常/拒绝/逾期） | `var(--danger-6)` |
| 成功绿 | `var(--success-6)` |
| 主色蓝 | `var(--primary-6)` |
| 警告浅底色 | `var(--warning-1)` |
| 危险浅底色 | `var(--danger-1)` |

---

## 禁止项清单

### 布局
```
❌ .search-bar / .sf / .sf-label（不在 global.css，必须用 filter-card 体系）
❌ .toolbar-left / .toolbar-right（不在 global.css，用 toolbar-group / toolbar-aside）
❌ 在 <style scoped> 里重写 global.css 已有类（toolbar/detail-section/filter-field 等）
❌ 详情抽屉自写 .meta-bar / .info-card（用 .detail-section）
❌ 抽屉不加 class="detail-drawer"（Arco 默认 16px 标题不会被覆盖）
❌ scope-status-bar 在 tab ≤ 4 个时单独占一行（tab 少时嵌入 toolbar 同行，见下方规则）
```

### scope-status-bar 使用判断
| Tab 数量 | 做法 |
|---------|------|
| **≤ 4 个**（如：全部/未合作/已合作） | 把 stab 直接放入 `toolbar-group`，**不使用** scope-status-bar |
| **5 个及以上**（如：销售单有 3 个范围 + 8 个状态） | 使用 `scope-status-bar`，分 `__scope` + `__status` 两区 |

```vue
<!-- ✅ tab ≤ 4：直接嵌入 toolbar -->
<div class="toolbar toolbar--dense">
  <div class="toolbar-group">
    <button class="stab" :class="{ 'stab--active': !query.scope }" @click="query.scope = ''">全部</button>
    <button class="stab" :class="{ 'stab--active': query.scope === 'mine' }" @click="query.scope = 'mine'">我的</button>
  </div>
  <div class="toolbar-divider" />
  <div class="toolbar-group">
    <a-button size="small" type="primary">新建</a-button>
  </div>
  <!-- ... -->
</div>
```

### 按钮
```
❌ 刷新按钮 type="outline"（刷新 = 工具操作，必须 type="text"）
❌ 重置按钮 type="outline" 或携带图标（必须 type="text" 纯文字）
❌ 行内操作用文字或原生 <button>（必须 a-button type="text" + row-action-btn + a-tooltip）
```

### 颜色
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
❌ <a-table>（禁止使用 Arco 原生表格，全项目统一用 vxe-table）
❌ VXE Table 所有列用 width（至少一列用 min-width 撑满容器）
❌ emoji 作为空状态图标（用 Arco icon + state-center 类）
```

---

## 分页规范

列表页分页使用封装好的 `SaleOrderTableCap` 模式，通过 `table-card-cap` 实现。**禁止直接裸用 `<a-pagination>`。**

### 标准用法（复用 table-card-cap 组件）

```vue
<!-- 放在 zone-l4-table-card 内，vxe-table 上方 -->
<div class="zone-l4-table-card zone-card">
  <div class="table-card-cap">
    <div class="table-card-cap__left">
      <span class="table-card-cap__summary">共 <b>{{ page.total }}</b> 条</span>
    </div>
    <div class="table-card-cap__right">
      <!-- 列显示设置（可选） -->
      <a-popover trigger="click" position="bl">
        <a-button type="text" class="table-card-cap__tool" title="列显示">
          <template #icon><icon-settings /></template>
        </a-button>
        <template #content>
          <div class="column-settings">
            <div class="column-settings__title">列显示</div>
            <a-checkbox v-for="col in columnOptions" :key="col.key"
              :model-value="visibleColumns[col.key] !== false"
              @change="(v) => toggleColumn(col.key, v === true)">
              {{ col.title }}
            </a-checkbox>
          </div>
        </template>
      </a-popover>
      <!-- 分页器 -->
      <a-pagination
        class="table-card-cap__pager"
        :current="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-size-options="[50, 100, 200, 500]"
        size="small"
        show-page-size
        show-jumper
        @change="(p) => { page.current = p; fetchList(); }"
        @page-size-change="(s) => { page.size = s; fetchList(); }"
      />
    </div>
  </div>

  <div class="table-wrap">
    <vxe-table ...>...</vxe-table>
  </div>
</div>

<style scoped>
.column-settings { display:flex; flex-direction:column; gap:8px; min-width:140px; padding:4px 0; }
.column-settings__title { font-size:var(--dense-font-title); font-weight:600; color:var(--color-text-2); padding-bottom:4px; border-bottom:1px solid var(--color-border-1); }
</style>
```

### 分页参数规范
```ts
// composable 里统一用 reactive
const page = reactive({ current: 1, size: 100, total: 0 })

// pagedRows 计算属性
const pagedRows = computed(() => {
  page.total = filteredSource.value.length
  const start = (page.current - 1) * page.size
  return filteredSource.value.slice(start, start + page.size)
})
```

```
✅ 默认每页 100 条（后台系统数据量大，100 是合理起点）
✅ page-size-options: [50, 100, 200, 500]
✅ 显示总条数（show-jumper + show-page-size）
❌ 禁止直接裸用 <a-pagination>（样式不统一）
❌ 禁止在 toolbar 里放分页（分页属于 table-card-cap 区域）
```

---

## 文件上传规范（Uppy）

项目使用 **Uppy** 作为统一上传组件。**禁止使用 Arco 的 `<a-upload>`。**

### 安装

```bash
npm install @uppy/core @uppy/dashboard @uppy/xhr-upload @uppy/locales
```

### 引入样式（在 main.ts 或 global.css 引入一次）

```ts
// main.ts
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
```

### 标准封装（复用此组件，禁止每个页面自己初始化 Uppy）

```vue
<!-- components/UppyUploader.vue — 全局复用组件 -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import XHRUpload from '@uppy/xhr-upload'
import zh_CN from '@uppy/locales/lib/zh_CN'

const props = defineProps<{
  uploadUrl: string          // 上传接口地址
  maxFileSize?: number       // 单文件最大字节数，默认 20MB
  maxFiles?: number          // 最大文件数，默认 10
  allowedTypes?: string[]    // ['image/*', '.pdf', '.xlsx']
}>()

const emit = defineEmits<{
  'upload-success': [file: { name: string; url: string }]
  'upload-error':   [file: { name: string; error: string }]
}>()

const containerRef = ref<HTMLElement>()
let uppy: Uppy | null = null

onMounted(() => {
  uppy = new Uppy({
    locale: zh_CN,
    restrictions: {
      maxFileSize: props.maxFileSize ?? 20 * 1024 * 1024,
      maxNumberOfFiles: props.maxFiles ?? 10,
      allowedFileTypes: props.allowedTypes ?? ['.pdf', '.xlsx', '.xls', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
    },
  })
    .use(Dashboard, {
      inline: true,
      target: containerRef.value,
      height: 260,
      showProgressDetails: true,
      proudlyDisplayPoweredByUppy: false,
    })
    .use(XHRUpload, {
      endpoint: props.uploadUrl,
      fieldName: 'file',
      headers: {
        // Authorization: `Bearer ${useAuthStore().token}`
      },
    })

  uppy.on('upload-success', (file, response) => {
    emit('upload-success', { name: file!.name, url: response.body?.url ?? '' })
  })
  uppy.on('upload-error', (file, error) => {
    emit('upload-error', { name: file!.name, error: error.message })
  })
})

onBeforeUnmount(() => {
  uppy?.destroy()
  uppy = null
})
</script>

<template>
  <div ref="containerRef" class="uppy-container" />
</template>

<style scoped>
.uppy-container { width: 100%; }
/* 覆盖 Uppy Dashboard 主题色为项目主色 */
:deep(.uppy-Dashboard-inner) {
  border: 1px solid var(--color-border-2);
  border-radius: var(--dense-radius);
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
:deep(.uppy-Dashboard-AddFiles-title) { font-size: var(--dense-font-data); }
:deep(.uppy-Dashboard-browse)         { color: var(--primary-6); }
</style>
```

### 页面使用方式

```vue
<!-- 在表单页 / 详情抽屉 / 弹窗内使用 -->
<div class="detail-section">
  <div class="detail-section__head">
    <h4 class="detail-section__title">单据上传</h4>
  </div>
  <div class="detail-section__body">
    <uppy-uploader
      upload-url="/api/upload/order-docs"
      :max-file-size="20 * 1024 * 1024"
      :max-files="20"
      :allowed-types="['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png']"
      @upload-success="handleUploadSuccess"
      @upload-error="handleUploadError"
    />
  </div>
</div>

<!-- 已上传文件列表（用 vxe-table 展示，状态用 s-pill） -->
<div class="detail-section__body" style="padding:0">
  <vxe-table border="none" size="small" height="auto"
    :row-config="{ isHover:true, keyField:'uid' }" :data="fileList">
    <vxe-column field="name" title="文件名" min-width="200" />
    <vxe-column field="size" title="大小" width="88" />
    <vxe-column field="uploader" title="上传人" width="88" />
    <vxe-column field="status" title="状态" width="80" align="center">
      <template #default="{ row }">
        <span class="s-pill" :data-s="row.status === 'done' ? 'acc' : row.status === 'error' ? 'rej' : 'op'">
          {{ row.status === 'done' ? '已上传' : row.status === 'error' ? '失败' : '上传中' }}
        </span>
      </template>
    </vxe-column>
    <vxe-column title="操作" width="80" fixed="right" align="center">
      <template #default="{ row }">
        <a-tooltip content="下载"><a-button type="text" class="row-action-btn" @click="downloadFile(row)"><icon-download /></a-button></a-tooltip>
        <a-tooltip content="删除"><a-button type="text" class="row-action-btn" @click="deleteFile(row)"><icon-delete /></a-button></a-tooltip>
      </template>
    </vxe-column>
  </vxe-table>
</div>
```

```
✅ 统一封装为 UppyUploader 组件，禁止每个页面自己 new Uppy()
✅ 文件列表用 vxe-table 展示，状态用 s-pill[data-s]
✅ 单文件限制 20MB，接受格式在组件 props 传入
❌ 禁止使用 <a-upload>（样式和功能均不满足需求）
❌ 禁止 Uppy Dashboard 显示 "Powered by Uppy" 标志
❌ 禁止在多个页面各自 new Uppy 实例（必须封装复用）
```

---

## 权限控制规范

```
待项目接入权限系统后在此定义。
占位规范：按钮/操作用 v-if="hasPermission('module:action')" 控制显隐，
禁止用 disabled 替代权限隐藏（disabled 会泄露操作存在）。
```

---

## 交互规范（UI Interaction）

### 表单校验时机
```
✅ 必填字段：失焦（blur）触发单字段校验
✅ 提交时：全量校验，第一个错误字段自动 scroll into view
✅ 用户修正后：实时清除该字段的错误提示
❌ 禁止输入时实时校验（体验差，打字就报错）
❌ 禁止仅在提交时校验（用户不知道哪里错）
```

### 加载状态
```
✅ 列表查询：vxe-table :loading="loading"
✅ 提交按钮：:loading="submitting"，同时 disabled 防重复点击
✅ 抽屉/弹窗打开时若需加载数据：在 body 内用 <a-spin> 包裹内容区
❌ 禁止在加载时隐藏整个页面或组件（用 skeleton / spin 替代）
```

### 危险操作确认
```
✅ 删除单条：a-popconfirm（行内确认气泡）
✅ 删除批量 / 废弃 / 撤销等不可逆：Modal.confirm({ type:'warning', ... })
✅ 离开有未保存数据的页面：Modal.confirm 拦截 router 跳转
✅ 危险按钮放 a-dropdown 下拉菜单，<a-doption class="danger-opt">
❌ 禁止直接 confirm() 系统弹窗
❌ 禁止将删除按钮直接暴露在工具栏主操作区
```

### 空状态
```html
<!-- 表格内空状态 -->
<div class="state-center--in-table">
  <icon-inbox class="state-empty-icon" />
  <span>暂无数据</span>
</div>

<!-- 整页空状态（如无权限、404） -->
<div class="state-center">
  <icon-exclamation-circle class="state-empty-icon" />
  <span>暂无数据</span>
  <a-button size="small" type="outline" @click="fetchList">重新加载</a-button>
</div>
```
```
✅ 空状态图标用 Arco Design icon
✅ 操作引导：有操作权限时显示"新建"按钮
❌ 禁止 emoji 作为空状态图标（🏭 ❌）
❌ 禁止仅显示"暂无数据"文字，无任何操作引导
```

### 消息反馈
```
✅ 操作成功：Message.success('xxx成功')
✅ 操作失败：Message.error('xxx失败：' + err.message)
✅ 需要用户注意的非阻断提示：Message.warning(...)
✅ 表单校验错误汇总：在字段下方内联显示（xf-err），不用 Message
❌ 禁止成功后不给任何反馈
❌ 禁止用 alert()
```

---

## 适配规范（Responsive & Compatibility）

### 后台系统宽度基准
```
最小支持宽度：1280px（典型笔记本分辨率）
推荐设计宽度：1440px
超宽屏（>1920px）：内容区最大宽度不限，让列表自然撑宽
```

### 列数适配规则
| 容器 | 默认列数 | 最小宽度触发降列 |
|------|---------|---------------|
| `filter-grid` | 4列 | ≤1280px 降为 3 列（global.css 已处理） |
| `detail-form-grid--4` | 4列 | ≤1280px 降为 2 列（global.css 已处理） |
| `xf-grid`（表单网格） | 4列 | 在 scoped 中手动加 @media |
| `db-content`（Dashboard） | 主+侧双列 | ≤1280px 改为单列 |

```css
/* 表单网格响应式（在 scoped style 里加） */
@media (max-width: 1280px) {
  .xf-grid { grid-template-columns: repeat(2, 1fr); }
  .db-content { grid-template-columns: 1fr; }
}
```

### 表格宽度策略
```
✅ 至少一列 min-width（内容自动撑宽）
✅ 固定宽度列（单号/状态/操作）用 width
✅ 内容较多的文本列（备注/地址）用 min-width
❌ 全列 width 会出现右侧空白
❌ 禁止在 table-wrap 外层再套 overflow:auto（双滚动条）
```

### 抽屉宽度规范
| 场景 | width |
|------|-------|
| 轻量查看（只读字段） | 640 |
| 标准详情（含编辑） | 900 |
| 复杂详情（含子表格） | 1100 |
| 最大不超过 | `min(1200px, 90vw)` |

---

## 上线前自查清单

### 样式规范
```
□ 搜索区：用 filter-card 体系，无 .sf/.sf-label/.search-bar
□ 工具栏：toolbar-group + toolbar-aside，刷新 type="text" icon-only
□ 表格：border="none" size="small" height="100%"，至少一列 min-width
□ 抽屉：有 class="detail-drawer"，detail-section 分区
□ 状态：全用 s-pill[data-s]，无行背景色
□ 颜色：无 hex，全用 CSS 变量
□ 字体：无 14px/16px，无 font-weight:700
□ 废弃类：无 freight-table、无 stab-count、无 search-bar
□ scoped：无重写 global.css 已有类
```

### 组件规范
```
□ 表格：全部用 vxe-table，无 <a-table>
□ 分页：用 table-card-cap 结构，无裸 <a-pagination>
□ 上传：用 UppyUploader 组件，无 <a-upload>
□ 已上传文件列表：用 vxe-table + s-pill 展示状态
```

### 交互规范
```
□ 表单：失焦校验 + 提交全量校验 + 成功后清除错误
□ 加载：列表有 :loading，提交按钮有 :loading + 防重复
□ 危险操作：行内删除用 a-popconfirm，批量/不可逆用 Modal.confirm
□ 离开脏表单：router 跳转前 Modal.confirm 拦截
□ 空状态：用 state-center + Arco icon，有操作引导
□ 操作反馈：成功/失败用 Message，无 alert()
□ Modal：:mask-closable="false"，危险操作放 footer 左侧
```

### 适配规范
```
□ 最小宽度 1280px 下字段不溢出（filter-grid / detail-form-grid 已处理）
□ 自写的 xf-grid / db-content 加了 @media (max-width:1280px) 降列
□ 抽屉宽度不超过 min(1200px, 90vw)
□ 表格无双层滚动条（table-wrap 外层无 overflow:auto）
```
