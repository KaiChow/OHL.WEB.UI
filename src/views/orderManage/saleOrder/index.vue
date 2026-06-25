<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Modal } from '@arco-design/web-vue'
import type { VxeTableInstance } from 'vxe-table'
import {
  IconRefresh, IconSearch, IconDownload, IconEye, IconPrinter,
  IconDown, IconMore, IconSettings, IconFilter
} from '@arco-design/web-vue/es/icon'

// ─── Types ───────────────────────────────────────────────────────────────────
interface SaleOrderRow {
  id: number
  orderNo: string
  orderStatus: string
  orderStatusKey: string
  boxType: string
  pieces: number
  weight: number
  volume: number
  containerType: string
  bizNo: string
  foreignNo: string
  customer: string
  salesman: string
  contractNo: string
  containerSpec: string
  pol: string
  pod: string
  hbl: string
  so: string
  mbl: string
}

// ─── Table ref (for column-config) ───────────────────────────────────────────
const xTable = ref<VxeTableInstance>()

// ─── Filter ──────────────────────────────────────────────────────────────────
const advancedFilterVisible = ref(false)
const q = reactive({
  bizType: '',
  orderNoType: '业务单号',
  orderNoKeyword: '',
  salesman: '',
  operator: '',
  packingType: '',
  // advanced fields
  customer: '',
  pol: '',
  pod: '',
  etdRange: [] as string[],
  etaRange: [] as string[],
  quickTag: '',
})

// ─── Scope / Status Tabs ──────────────────────────────────────────────────────
const scopeTab = ref('all')
const cargoTab = ref('all')
const statusTab = ref('all')

const scopeTabs = [
  { key: 'all', label: '全部单' },
  { key: 'personal', label: '个人单' },
  { key: 'permission', label: '权限单' },
]
const cargoTabs = [
  { key: 'all', label: '全部' },
  { key: 'fcl', label: '整柜' },
  { key: 'lcl', label: '散柜' },
]
// ★★★★★ 优化2：stat-tab 替代 stab 用于状态区，矩形卡片强调数字统计语义
const statusTabs = [
  { key: 'all',  label: '全部',   count: 0,   countClass: '' },
  { key: 'op',   label: '操作中', count: 312, countClass: '' },
  { key: 'done', label: '已完结', count: 420, countClass: 'stat-tab__count--ok' },
  { key: 'void', label: '已废弃', count: 71,  countClass: 'stat-tab__count--danger' },
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; s: string }> = {
  booking:   { label: '已放舱', s: 'wait' },
  accepted:  { label: '已接单', s: 'rel' },
  operating: { label: '操作中', s: 'op' },
  done:      { label: '已完结', s: 'acc' },
  void:      { label: '已废弃', s: 'draft' },
}

const customers  = ['深圳市大洋贸易有限公司', '广州恒盛进出口有限公司', '东莞欣宏电子科技有限公司', '上海联盛物流集团', '宁波远航国际货代']
const salesmen   = ['张伟', '李娜', '王鹏', '陈静', '刘洋']
const pols       = ['深圳', '广州', '上海', '宁波', '青岛', '天津']
const pods       = ['洛杉矶', '纽约', '汉堡', '鹿特丹', '迪拜', '新加坡']
const containerSpecs = ['20GP×1', '40HQ×1', '40GP×2', '20GP×2', '40HQ×2']
const statusKeys = ['booking', 'accepted', 'operating', 'done', 'void']

function mockRows(n: number): SaleOrderRow[] {
  return Array.from({ length: n }, (_, i) => {
    const statusKey = statusKeys[i % statusKeys.length]
    const idx = i + 1
    return {
      id: idx,
      orderNo:      `PTP260${String(64000 + idx).padStart(5, '0')}`,
      orderStatus:  STATUS_MAP[statusKey].label,
      orderStatusKey: STATUS_MAP[statusKey].s,
      boxType:      i % 3 === 0 ? '整柜' : '散柜',
      pieces:       Math.floor(Math.random() * 500) + 50,
      weight:       Math.floor(Math.random() * 10000) + 500,
      volume:       Math.floor(Math.random() * 100) + 10,
      containerType: i % 4 === 0 ? '危险品柜' : i % 3 === 0 ? '普通柜' : i % 2 === 0 ? '温控柜' : '混装柜',
      bizNo:        `OHL260${String(63000 + idx).padStart(5, '0')}`,
      foreignNo:    `FBL-2025-${String(10000 + idx).padStart(5, '0')}`,
      customer:     customers[i % customers.length],
      salesman:     salesmen[i % salesmen.length],
      contractNo:   i % 3 === 0 ? '' : `CN-2025-${String(1000 + idx).padStart(4, '0')}`,
      containerSpec: containerSpecs[i % containerSpecs.length],
      pol:          pols[i % pols.length],
      pod:          pods[i % pods.length],
      hbl:          `OHNB${String(260000 + idx).padStart(6, '0')}`,
      so:           `SO-${String(800000 + idx).padStart(6, '0')}`,
      mbl:          `MSK${String(26000000 + idx).padStart(9, '0')}`,
    }
  })
}

const allRows = mockRows(35)
const tableData = computed(() => allRows)
const total = computed(() => allRows.length)
const page = ref(1)
const pageSize = ref(35)
const selectedRows = ref<SaleOrderRow[]>([])

// ─── Actions ──────────────────────────────────────────────────────────────────
function handleSearch() { page.value = 1 }
function handleReset() {
  Object.assign(q, { bizType: '', orderNoType: '业务单号', orderNoKeyword: '', salesman: '', operator: '', packingType: '', customer: '', pol: '', pod: '', etdRange: [], etaRange: [], quickTag: '' })
  scopeTab.value = 'all'
  cargoTab.value = 'all'
  statusTab.value = 'all'
  page.value = 1
}
function resetAdvancedFilter() {
  Object.assign(q, {
    bizType: '',
    salesman: '',
    operator: '',
    packingType: '',
    quickTag: '',
    etdRange: [],
    etaRange: [],
  })
}
function applyAdvancedFilter() {
  advancedFilterVisible.value = false
  handleSearch()
}
function handleRefresh() { handleSearch() }
function openColSettings() { xTable.value?.openCustom() }
// ★★★☆☆ 优化5：批量废弃需 Modal.confirm 二次确认（spec 🔴 修复）
function handleBatchVoid() {
  if (!selectedRows.value.length) return
  Modal.warning({
    title: '确认批量废弃',
    content: `已选 ${selectedRows.value.length} 条订单，废弃后不可恢复，是否继续？`,
    okButtonProps: { status: 'danger' },
    onOk: () => { /* call API */ },
  })
}
</script>

<template>
  <div class="page-root page-root--dense sale-order-page">
    <!-- ── L2 Filter — 目标导向查询：核心定位行 + 更多筛选抽屉 -->
    <div class="zone-l2-filter-card zone-card filter-card">
      <!-- 基础行：label 在上 / control 在下 / 内联 actions 底部对齐 control 行 -->
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">单号检索</label>
          <div class="filter-combo arco-input-group">
            <a-select v-model="q.orderNoType" size="small" class="filter-combo__select filter-combo--keyword">
              <a-option value="业务单号">业务单号</a-option>
              <a-option value="订单编号">订单编号</a-option>
              <a-option value="HBL单号">HBL单号</a-option>
              <a-option value="MBL主单号">MBL主单号</a-option>
              <a-option value="SO号">SO号</a-option>
            </a-select>
            <a-input v-model="q.orderNoKeyword" size="small" allow-clear placeholder="请输入单号" @press-enter="handleSearch" />
          </div>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">客户</label>
          <a-input v-model="q.customer" size="small" allow-clear placeholder="客户名称" @press-enter="handleSearch" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">起运港</label>
          <a-input v-model="q.pol" size="small" allow-clear placeholder="起运港" @press-enter="handleSearch" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">目的港</label>
          <a-input v-model="q.pod" size="small" allow-clear placeholder="目的港" @press-enter="handleSearch" />
        </div>
        <!-- 内联操作区：height=32px，与 control 行 bottom-align 后自然平齐 -->
        <div class="filter-card__inline-actions">
          <a-button size="small" type="primary" class="filter-card__query-btn" title="查询" @click="handleSearch">
            <template #icon><icon-search /></template>查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" title="重置" @click="handleReset">重置</a-button>
          <a-button size="small" type="text" class="reset-btn" title="更多筛选" @click="advancedFilterVisible = true">
            <template #icon><icon-filter /></template>筛选
          </a-button>
        </div>
      </div>
    </div>

    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="业务单筛选"
      :width="560"
      placement="right"
      class="query-filter-drawer"
    >
      <a-form class="detail-form" layout="vertical" size="small" :model="q">
        <div class="detail-form-grid detail-form-grid--2">
          <div class="form-subgroup-label form-subgroup-label--span">订单信息</div>
          <a-form-item label="业务类型">
            <a-select v-model="q.bizType" size="small" allow-clear placeholder="请选择">
              <a-option value="import">进口</a-option>
              <a-option value="export">出口</a-option>
              <a-option value="transit">转运</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="装箱方式">
            <a-select v-model="q.packingType" size="small" allow-clear placeholder="请选择">
              <a-option value="fcl">整柜 (FCL)</a-option>
              <a-option value="lcl">散柜 (LCL)</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="业务员">
            <a-input v-model="q.salesman" size="small" allow-clear placeholder="姓名" @press-enter="handleSearch" />
          </a-form-item>
          <a-form-item label="操作员">
            <a-input v-model="q.operator" size="small" allow-clear placeholder="姓名" @press-enter="handleSearch" />
          </a-form-item>

          <div class="form-subgroup-label form-subgroup-label--span form-subgroup-label--mt">业务标记</div>
          <a-form-item label="快捷标签">
            <a-select v-model="q.quickTag" size="small" allow-clear placeholder="请选择">
              <a-option value="urgent">加急</a-option>
              <a-option value="vip">VIP客户</a-option>
              <a-option value="overdue">逾期</a-option>
            </a-select>
          </a-form-item>

          <div class="form-subgroup-label form-subgroup-label--span form-subgroup-label--mt">时间范围</div>
          <a-form-item label="ETD 范围">
            <a-range-picker v-model="q.etdRange" size="small" style="width:100%" />
          </a-form-item>
          <a-form-item label="ETA 范围">
            <a-range-picker v-model="q.etaRange" size="small" style="width:100%" />
          </a-form-item>
        </div>
      </a-form>
      <template #footer>
        <div class="detail-drawer-footer">
          <div class="detail-drawer-footer__start">
            <a-button size="small" type="text" class="reset-btn" @click="resetAdvancedFilter">清空更多筛选</a-button>
          </div>
          <div class="detail-drawer-footer__end">
            <a-button size="small" @click="advancedFilterVisible = false">取消</a-button>
            <a-button size="small" type="primary" @click="applyAdvancedFilter">应用筛选</a-button>
          </div>
        </div>
      </template>
    </a-drawer>

    <!-- ── L3 Merged Bar：工具栏 + Tab 合并单行 48px ──────────────────────── -->
    <div class="zone-l3-action zone-card">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" type="outline" title="打印业务单" @click="">
            <template #icon><icon-printer /></template>打印业务单
          </a-button>
          <a-dropdown trigger="click" popup-class="row-action-menu">
            <a-button size="small" type="outline">导出<icon-down style="margin-left:2px" /></a-button>
            <template #content>
              <a-doption @click="">导出 Excel</a-doption>
              <a-doption @click="">导出 PDF</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" popup-class="row-action-menu">
            <a-button size="small" type="text">更多<icon-down style="margin-left:2px" /></a-button>
            <template #content>
              <a-doption @click="">批量关单</a-doption>
              <a-doption @click="">推送到档期通知</a-doption>
              <a-doption @click="">
                <template #icon><icon-download /></template>
                一键下载
              </a-doption>
              <a-doption @click="">关单导入</a-doption>
              <a-divider style="margin:4px 0" />
              <a-doption class="danger-opt" @click="handleBatchVoid">批量废弃</a-doption>
            </template>
          </a-dropdown>
        </div>
        <span class="bar-sep"></span>
        <!-- 范围 tabs：全部单 / 个人单 / 权限单 -->
        <div class="stab-group">
          <button
            v-for="t in scopeTabs" :key="t.key"
            class="stab" :class="{ 'stab--active': scopeTab === t.key }"
            type="button" @click="scopeTab = t.key"
          >{{ t.label }}</button>
        </div>
        <span class="bar-sep"></span>
        <!-- 货型 tabs：全部 / 整柜 / 散柜 -->
        <div class="stab-group">
          <button
            v-for="t in cargoTabs" :key="t.key"
            class="stab" :class="{ 'stab--active': cargoTab === t.key }"
            type="button" @click="cargoTab = t.key"
          >{{ t.label }}</button>
        </div>
        <span class="bar-sep"></span>
        <!-- 状态 stat-tabs：矩形卡片 + 数字 -->
        <div class="stat-tab-group">
          <button
            v-for="t in statusTabs" :key="t.key"
            class="stat-tab" :class="{ 'stat-tab--active': statusTab === t.key }"
            type="button" @click="statusTab = t.key"
          >
            <span class="stat-tab__name">{{ t.label }}</span>
            <span v-if="t.count" class="stat-tab__count" :class="t.countClass">{{ t.count }}</span>
          </button>
        </div>
        <!-- 右侧工具 -->
        <div class="toolbar-aside">
          <span v-if="selectedRows.length" style="font-size:var(--dense-font-aux);color:var(--color-text-3);margin-right:4px">
            已选 {{ selectedRows.length }} 项
          </span>
          <a-tooltip content="刷新">
            <a-button size="small" type="text" @click="handleRefresh">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
    </div>

    <!-- ── L4 Table ───────────────────────────────────────────────────────── -->
    <div class="zone-l4-table-card">
      <div class="table-card-cap">
        <div class="table-card-cap__right">
          <a-pagination
            class="table-card-cap__pager"
            v-model:current="page"
            v-model:page-size="pageSize"
            :total="total"
            :page-size-options="[20, 35, 50, 100]"
            show-page-size
            show-total
            size="small"
          />
          <a-tooltip content="列设置">
            <a-button size="small" type="text" class="table-card-cap__tool" @click="openColSettings">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="table-wrap">
        <vxe-table
          ref="xTable"
          :data="tableData"
          border="none"
          size="small"
          height="100%"
          show-overflow="title"
          class="compact workbench-table"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          :custom-config="{ storage: true }"
          @checkbox-change="({ records }) => (selectedRows = records)"
          @checkbox-all="({ records }) => (selectedRows = records)"
        >
          <vxe-column type="checkbox" width="40" fixed="left" />
          <vxe-column type="seq" title="序号" width="55" fixed="left" />

          <!-- 默认显示列（核心） -->
          <vxe-column field="orderNo" title="订单编号" min-width="148" fixed="left" sortable>
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer">{{ row.orderNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="orderStatus" title="订单状态" min-width="84">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.orderStatusKey">{{ row.orderStatus }}</span>
            </template>
          </vxe-column>
          <!-- ★★★☆☆ 优化4：加宽客户列，继承表级 show-overflow="title" -->
          <vxe-column field="customer" title="客户" min-width="180" />
          <vxe-column field="bizNo" title="业务单号" min-width="140" sortable>
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer">{{ row.bizNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="boxType" title="柜型" min-width="70" />
          <vxe-column field="pieces" title="件数" min-width="64" />
          <vxe-column field="pol" title="起运港" min-width="88" />
          <vxe-column field="pod" title="目的港" min-width="88" />
          <vxe-column field="salesman" title="业务员" min-width="80" />
          <vxe-column field="hbl" title="HBL单号" min-width="140">
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer">{{ row.hbl }}</span>
            </template>
          </vxe-column>

          <!-- 默认隐藏列（可通过列设置开启） -->
          <vxe-column field="weight" title="毛重(kg)" min-width="88" :visible="false" />
          <vxe-column field="volume" title="体积(m³)" min-width="88" :visible="false" />
          <vxe-column field="containerType" title="柜子类型" min-width="88" :visible="false" />
          <vxe-column field="foreignNo" title="境外单号" min-width="148" :visible="false" />
          <vxe-column field="contractNo" title="合约号" min-width="110" sortable :visible="false" />
          <vxe-column field="containerSpec" title="柜型柜量" min-width="90" sortable :visible="false" />
          <vxe-column field="so" title="SO号" min-width="120" :visible="false" />
          <vxe-column field="mbl" title="MBL主单号" min-width="148" :visible="false">
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer">{{ row.mbl }}</span>
            </template>
          </vxe-column>

          <!-- 文件 + 操作 -->
          <vxe-column title="文件下载" min-width="70" align="center">
            <template #default="">
              <a-tooltip content="下载文件">
                <a-button size="small" type="text" class="row-action-btn">
                  <template #icon><icon-download /></template>
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="88" fixed="right" align="center">
            <template #default="{ row }">
              <a-tooltip content="查看详情">
                <a-button size="small" type="text" class="row-action-btn" @click="">
                  <template #icon><icon-eye /></template>
                </a-button>
              </a-tooltip>
              <!-- ★★★☆☆ 优化5：a-tooltip 替代 title 属性（spec 🟡 修复） -->
              <a-dropdown trigger="click" position="br" popup-class="row-action-menu">
                <a-tooltip content="更多操作">
                  <a-button size="small" type="text" class="row-action-btn">
                    <template #icon><icon-more /></template>
                  </a-button>
                </a-tooltip>
                <template #content>
                  <a-doption @click="">编辑</a-doption>
                  <a-doption @click="">打印业务单</a-doption>
                  <a-doption @click="">下载文件</a-doption>
                  <a-divider style="margin:4px 0" />
                  <a-popconfirm content="确认废弃该订单？此操作不可恢复。" @ok="">
                    <a-doption class="danger-opt">废弃</a-doption>
                  </a-popconfirm>
                </template>
              </a-dropdown>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sale-order-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}
</style>
