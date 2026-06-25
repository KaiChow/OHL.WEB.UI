<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Modal } from '@arco-design/web-vue'
import type { VxeTableInstance } from 'vxe-table'
import {
  IconRefresh, IconSearch, IconEye, IconPlus, IconDown,
  IconMore, IconSettings, IconFilter
} from '@arco-design/web-vue/es/icon'

// ─── Types ───────────────────────────────────────────────────────────────────
interface MblOrderRow {
  id: number
  mblNo: string
  bizOrderNo: string
  dcgNo: string
  supplyStatus: string
  supplyStatusKey: string
  isPreDeparture: string
  isPreDepartureKey: string
  contractNo: string
  bizType: string
  transport: string
  packingType: string
  containerSpec: string
  pol: string
  pod: string
  eta: string
  etd: string
  atd: string
  ata: string
  carrier: string
  route: string
  vessel: string
}

// ─── Table ref ───────────────────────────────────────────────────────────────
const xTable = ref<VxeTableInstance>()
function openColSettings() { xTable.value?.openCustom() }

// ─── Transport Tab ────────────────────────────────────────────────────────────
const transportTab = ref('sea')

// ─── Filter ──────────────────────────────────────────────────────────────────
const advancedFilterVisible = ref(false)
const q = reactive({
  bizType: '',
  orderType: '',
  orderNoType: 'MBL主单号',
  orderNoKeyword: '',
  pol: '',
  pod: '',
  carrier: '',
  operator: '',
  vessel: '',
  voyage: '',
  containerType: '',
  contractNo: '',
  foreignAgent: '',
  etdRange: [] as string[],
  ataRange: [] as string[],
  atdRange: [] as string[],
  isCarrierMbl: '',
})

// ─── Status Tabs ─────────────────────────────────────────────────────────────
const scopeTab = ref('all')
const statusTab = ref('all')

const scopeTabs = [
  { key: 'all', label: '全部单' },
  { key: 'personal', label: '个人单' },
  { key: 'permission', label: '权限单' },
]
const statusTabs = [
  { key: 'all',     label: '全部单' },
  { key: 'predep',  label: '已发船前' },
  { key: 'postdep', label: '未发船前' },
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const SUPPLY_MAP = [
  { label: '未补料', key: 'wait' },
  { label: '已补料', key: 'acc' },
  { label: '部分补料', key: 'partial' },
]
const DEP_MAP = [
  { label: '已发船', key: 'rel' },
  { label: '未发船', key: 'op' },
]

const carriers = ['MSC地中海航运', 'COSCO中远海运', 'MSK马士基航线', 'CMA-CGM达飞', 'EVERGREEN长荣海运']
const routes = ['跨太平洋航线', '欧亚线', '中东线', '东南亚线', '美西快线']
const pols = ['深圳盐田', '广州南沙', '上海洋山', '宁波北仑', '青岛前湾']
const pods = ['洛杉矶', '纽约', '汉堡', '鹿特丹', '迪拜', '新加坡']
const vessels = ['MSC AURORA', 'COSCO STAR', 'MSK SEALAND', 'CMA TITAN', 'EVER GIVEN']

function genDate(base: Date, offsetDays: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

const today = new Date('2026-06-24')

function mockMblRows(n: number): MblOrderRow[] {
  return Array.from({ length: n }, (_, i) => {
    const supply = SUPPLY_MAP[i % SUPPLY_MAP.length]
    const dep = DEP_MAP[i % DEP_MAP.length]
    const idx = i + 1
    return {
      id: idx,
      mblNo: `MSK${String(26000000 + idx).padStart(9, '0')}`,
      bizOrderNo: `PTP260${String(64000 + idx).padStart(5, '0')}`,
      dcgNo: `DCG-26-${String(10000 + idx).padStart(5, '0')}`,
      supplyStatus: supply.label,
      supplyStatusKey: supply.key,
      isPreDeparture: dep.label,
      isPreDepartureKey: dep.key,
      contractNo: i % 3 === 0 ? '' : `CN-2025-${String(1000 + idx).padStart(4, '0')}`,
      bizType: i % 2 === 0 ? '出口' : '进口',
      transport: '海运',
      packingType: i % 3 === 0 ? '整柜' : '散柜',
      containerSpec: ['20GP×1', '40HQ×1', '40GP×2'][i % 3],
      pol: pols[i % pols.length],
      pod: pods[i % pods.length],
      eta: genDate(today, i * 3 - 10),
      etd: genDate(today, i * 2 - 5),
      atd: dep.key === 'rel' ? genDate(today, i * 2 - 8) : '-',
      ata: dep.key === 'rel' && i % 3 === 0 ? genDate(today, i * 3 - 12) : '-',
      carrier: carriers[i % carriers.length],
      route: routes[i % routes.length],
      vessel: vessels[i % vessels.length],
    }
  })
}

const allRows = mockMblRows(30)
const tableData = computed(() => allRows)
const total = computed(() => allRows.length)
const page = ref(1)
const pageSize = ref(30)
const selectedRows = ref<MblOrderRow[]>([])

// ─── Actions ──────────────────────────────────────────────────────────────────
function handleSearch() { page.value = 1 }
function handleReset() {
  Object.assign(q, {
    bizType: '', orderType: '', orderNoType: 'MBL主单号', orderNoKeyword: '',
    pol: '', pod: '', carrier: '', operator: '', vessel: '', voyage: '',
    containerType: '', contractNo: '', foreignAgent: '',
    etdRange: [], ataRange: [], atdRange: [],
    isCarrierMbl: '',
  })
  page.value = 1
}
function resetAdvancedFilter() {
  Object.assign(q, {
    bizType: '',
    orderType: '',
    operator: '',
    vessel: '',
    voyage: '',
    containerType: '',
    contractNo: '',
    foreignAgent: '',
    etdRange: [],
    ataRange: [],
    atdRange: [],
    isCarrierMbl: '',
  })
}
function applyAdvancedFilter() {
  advancedFilterVisible.value = false
  handleSearch()
}
function handleRefresh() { handleSearch() }
function handleBatchVoid() {
  if (!selectedRows.value.length) return
  Modal.warning({
    title: '确认批量废弃',
    content: `已选 ${selectedRows.value.length} 条主单，废弃后不可恢复，是否继续？`,
    okButtonProps: { status: 'danger' },
    onOk: () => { /* call API */ },
  })
}
</script>

<template>
  <div class="page-root page-root--dense mbl-order-page">
    <!-- ── L1 Transport Tabs ───────────────────────────────────────────────── -->
    <div class="zone-l1-transport zone-card">
      <button class="seg-btn" :class="{ 'seg-btn--active': transportTab === 'sea' }" type="button" @click="transportTab = 'sea'">海运</button>
      <button class="seg-btn" :class="{ 'seg-btn--active': transportTab === 'air' }" type="button" @click="transportTab = 'air'">空运</button>
    </div>

    <!-- ── L2 Filter — 目标导向查询：核心定位行 + 更多筛选抽屉 -->
    <div class="zone-l2-filter-card zone-card filter-card">
      <!-- 基础行：slim layout，label 上 / control 下 / actions 内联底对齐 -->
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">单号检索</label>
          <div class="filter-combo arco-input-group">
            <a-select v-model="q.orderNoType" size="small" class="filter-combo__select filter-combo--keyword">
              <a-option value="MBL主单号">MBL主单号</a-option>
              <a-option value="订单编号">订单编号</a-option>
              <a-option value="DCG单号">DCG单号</a-option>
              <a-option value="HBL单号">HBL单号</a-option>
            </a-select>
            <a-input v-model="q.orderNoKeyword" size="small" allow-clear placeholder="请输入单号" @press-enter="handleSearch" />
          </div>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">起运港</label>
          <a-input v-model="q.pol" size="small" allow-clear placeholder="请输入" @press-enter="handleSearch" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">目的港</label>
          <a-input v-model="q.pod" size="small" allow-clear placeholder="请输入" @press-enter="handleSearch" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">船公司</label>
          <a-select v-model="q.carrier" size="small" allow-clear placeholder="请选择">
            <a-option value="msc">MSC 地中海</a-option>
            <a-option value="cosco">COSCO 中远</a-option>
            <a-option value="msk">MSK 马士基</a-option>
            <a-option value="cma">CMA-CGM 达飞</a-option>
          </a-select>
        </div>
        <!-- 内联操作区 -->
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
      title="主单筛选"
      :width="560"
      placement="right"
      class="query-filter-drawer"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="q">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">订单信息</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="业务类型">
                  <a-select v-model="q.bizType" size="small" allow-clear placeholder="请选择">
                    <a-option value="export">出口</a-option>
                    <a-option value="import">进口</a-option>
                    <a-option value="transit">转运</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="订单类型">
                  <a-select v-model="q.orderType" size="small" allow-clear placeholder="请选择">
                    <a-option value="normal">普通单</a-option>
                    <a-option value="combined">拼柜单</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="操作员">
                  <a-input v-model="q.operator" size="small" allow-clear placeholder="请输入姓名" @press-enter="handleSearch" />
                </a-form-item>
                <a-form-item label="是否船司主单">
                  <a-select v-model="q.isCarrierMbl" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">航线信息</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="船名">
                  <a-input v-model="q.vessel" size="small" allow-clear placeholder="船名" @press-enter="handleSearch" />
                </a-form-item>
                <a-form-item label="航次">
                  <a-input v-model="q.voyage" size="small" allow-clear placeholder="航次" @press-enter="handleSearch" />
                </a-form-item>
                <a-form-item label="柜子类型">
                  <a-select v-model="q.containerType" size="small" allow-clear placeholder="请选择">
                    <a-option value="normal">普通柜</a-option>
                    <a-option value="reefer">温控柜</a-option>
                    <a-option value="dg">危险品柜</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="合约号">
                  <a-input v-model="q.contractNo" size="small" allow-clear placeholder="合约号" @press-enter="handleSearch" />
                </a-form-item>
                <a-form-item label="境外代理">
                  <a-input v-model="q.foreignAgent" size="small" allow-clear placeholder="境外代理" @press-enter="handleSearch" />
                </a-form-item>
              </div>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">时间范围</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="ETD 范围">
                  <a-range-picker v-model="q.etdRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ATA 范围">
                  <a-range-picker v-model="q.ataRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ATD 范围">
                  <a-range-picker v-model="q.atdRange" size="small" style="width:100%" />
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
      </div>
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
          <a-button size="small" type="primary" @click="">
            <template #icon><icon-plus /></template>新建主单
          </a-button>
          <a-button size="small" type="outline" @click="">拼柜主单</a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">导出<icon-down /></a-button>
            <template #content>
              <a-doption @click="">导出 Excel</a-doption>
              <a-doption @click="">导出 PDF</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="text">更多<icon-down /></a-button>
            <template #content>
              <a-doption @click="">柜子类型查询</a-doption>
              <a-doption @click="">上传MBL COPY件</a-doption>
              <a-doption @click="">下载MBL COPY件</a-doption>
              <a-doption @click="">批量核准</a-doption>
              <a-doption @click="">批量修改租柜</a-doption>
              <a-doption @click="">批量修改装载升柜</a-doption>
              <a-divider class="action-menu__divider" />
              <a-doption class="danger-opt" @click="handleBatchVoid">批量废弃</a-doption>
            </template>
          </a-dropdown>
        </div>
        <span class="bar-sep"></span>
        <!-- 范围 tabs -->
        <div class="stab-group">
          <button
            v-for="t in scopeTabs" :key="t.key"
            class="stab" :class="{ 'stab--active': scopeTab === t.key }"
            type="button" @click="scopeTab = t.key"
          >{{ t.label }}</button>
        </div>
        <span class="bar-sep"></span>
        <!-- 状态 stabs（大单没有数字统计，用 stab pill 而非 stat-tab） -->
        <div class="stab-group">
          <button
            v-for="t in statusTabs" :key="t.key"
            class="stab" :class="{ 'stab--active': statusTab === t.key }"
            type="button" @click="statusTab = t.key"
          >{{ t.label }}</button>
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
          <a-tooltip content="列设置">
            <a-button size="small" type="text" @click="openColSettings">
              <template #icon><icon-settings /></template>
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
            :page-size-options="[20, 30, 50, 100]"
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
          <vxe-column type="seq" title="序号" width="52" fixed="left" />

          <!-- 默认显示列 -->
          <vxe-column field="mblNo" title="MBL单号" min-width="150" fixed="left" sortable>
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer">{{ row.mblNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="bizOrderNo" title="主单订单编号" min-width="140">
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer">{{ row.bizOrderNo }}</span>
            </template>
          </vxe-column>
          <vxe-column field="dcgNo" title="DCG单号" min-width="130" />
          <vxe-column field="supplyStatus" title="补料状态" min-width="80">
            <template #default="{ row }">
              <span class="s-pill s-pill--dot" :data-s="row.supplyStatusKey">{{ row.supplyStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="isPreDeparture" title="发船状态" min-width="80">
            <template #default="{ row }">
              <span class="s-pill s-pill--dot" :data-s="row.isPreDepartureKey">{{ row.isPreDeparture }}</span>
            </template>
          </vxe-column>
          <vxe-column field="contractNo" title="合约号" min-width="110" sortable />
          <vxe-column field="bizType" title="业务类型" min-width="70" />
          <vxe-column field="containerSpec" title="柜型柜量" min-width="90" />
          <vxe-column field="pol" title="起运港" min-width="100" />
          <vxe-column field="pod" title="目的港" min-width="100" />
          <vxe-column field="eta" title="ETA" min-width="95" sortable />
          <vxe-column field="etd" title="ETD" min-width="95" sortable />

          <!-- 默认隐藏列 -->
          <vxe-column field="transport" title="运输方式" min-width="70" :visible="false" />
          <vxe-column field="packingType" title="装箱方式" min-width="70" :visible="false" />
          <vxe-column field="atd" title="ATD" min-width="95" sortable :visible="false" />
          <vxe-column field="ata" title="ATA" min-width="95" :visible="false" />
          <vxe-column field="carrier" title="船公司" min-width="130" :visible="false" />
          <vxe-column field="route" title="航线" min-width="110" :visible="false" />
          <vxe-column field="vessel" title="船名" min-width="120" :visible="false" />

          <vxe-column title="操作" width="88" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看详情">
                  <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="">
                    <template #icon><icon-eye /></template>
                  </a-button>
                </a-tooltip>
                <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
                  <a-tooltip content="更多操作">
                    <a-button size="small" type="text" class="row-action-btn row-action-btn--more">
                      <template #icon><icon-more /></template>
                    </a-button>
                  </a-tooltip>
                  <template #content>
                    <a-doption @click="">编辑</a-doption>
                    <a-doption @click="">上传COPY件</a-doption>
                    <a-doption @click="">下载COPY件</a-doption>
                    <a-divider class="action-menu__divider" />
                    <a-popconfirm
                      :content="`确认废弃主单 ${row.mblNo}？此操作不可恢复。`"
                      @ok=""
                    >
                      <a-doption class="danger-opt">废弃</a-doption>
                    </a-popconfirm>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mbl-order-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}
</style>
