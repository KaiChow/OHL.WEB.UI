<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Modal } from '@arco-design/web-vue'
import type { VxeTableInstance } from 'vxe-table'
import {
  IconRefresh, IconSearch, IconDownload, IconEye, IconPrinter,
  IconDown, IconMore, IconSettings, IconFilter, IconPlus, IconDelete
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

interface CargoLine {
  id: number
  goodsName: string
  packageType: string
  pieces: number
  grossWeight: number
  volume: number
  cargoMark: string
}

interface ContainerLine {
  id: number
  containerType: string
  qty: number
  pickupPlace: string
  returnPlace: string
  soNo: string
}

interface FeeLine {
  id: number
  direction: '应收' | '应付'
  feeName: string
  currency: string
  amount: number
  counterparty: string
  settlement: string
}

interface DocLine {
  id: number
  docName: string
  owner: string
  status: string
  dueDate: string
}

interface FollowLine {
  id: number
  node: string
  owner: string
  planTime: string
  status: string
  remark: string
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

// ─── Order detail / sales order entry workspace ──────────────────────────────
const orderDetailVisible = ref(false)
const orderDetailMode = ref<'create' | 'edit'>('create')

const orderForm = reactive({
  orderNo: '',
  bizNo: '',
  orderStatus: '草稿',
  orderStatusKey: 'draft',
  customer: '',
  customerContact: '',
  customerEmail: '',
  salesman: '张伟',
  operator: '',
  bizType: '出口',
  transportMode: '海运',
  packingType: 'FCL',
  tradeTerm: 'FOB',
  transportTerm: 'CY-CY',
  quoteNo: '',
  customerRefNo: '',
  creditStatus: '额度正常',
  polCode: 'CNSZX',
  pol: '深圳',
  podCode: 'USLAX',
  pod: '洛杉矶',
  destination: 'Los Angeles, CA',
  carrier: 'COSCO',
  vessel: 'COSCO SHIPPING ROSE',
  voyage: '062E',
  etd: '2026-06-19',
  eta: '2026-07-08',
  cyCut: '2026-06-16 17:00',
  siCut: '2026-06-15 12:00',
  bookingAgent: '深圳订舱中心',
  soNo: '',
  shipper: '深圳市大洋贸易有限公司',
  consignee: 'OCEAN PACIFIC TRADING LLC',
  notifyParty: 'SAME AS CONSIGNEE',
  customsBroker: '深圳华通报关行',
  customsMode: '一般贸易',
  docRequirement: '提单草稿需客户确认后再签发正本',
  remark: '客户要求优先匹配直航船期，价格按已确认报价执行。',
})

const cargoLines = ref<CargoLine[]>([])
const containerLines = ref<ContainerLine[]>([])
const feeLines = ref<FeeLine[]>([])
const docLines = ref<DocLine[]>([])
const followLines = ref<FollowLine[]>([])

const orderDrawerTitle = computed(() => orderDetailMode.value === 'create' ? '业务员下单' : '订单详情')
const cargoTotal = computed(() => cargoLines.value.reduce((sum, item) => sum + Number(item.pieces || 0), 0))
const weightTotal = computed(() => cargoLines.value.reduce((sum, item) => sum + Number(item.grossWeight || 0), 0))
const volumeTotal = computed(() => cargoLines.value.reduce((sum, item) => sum + Number(item.volume || 0), 0))
const receivableTotal = computed(() => feeLines.value.filter((item) => item.direction === '应收').reduce((sum, item) => sum + Number(item.amount || 0), 0))
const payableTotal = computed(() => feeLines.value.filter((item) => item.direction === '应付').reduce((sum, item) => sum + Number(item.amount || 0), 0))
const profitEstimate = computed(() => receivableTotal.value - payableTotal.value)
const orderMilestones = computed(() => {
  const activeIndex = orderForm.orderStatusKey === 'draft' ? 0 : orderForm.orderStatusKey === 'wait' ? 1 : 2
  return ['接单', '审核', '订舱', '进仓', '报关', '开船'].map((label, index) => ({
    label,
    state: index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'todo',
  }))
})

function seedOrderDetail(row?: SaleOrderRow) {
  const source = row ?? allRows[0]
  Object.assign(orderForm, {
    orderNo: row ? source.orderNo : 'PTP2606NEW',
    bizNo: row ? source.bizNo : 'OHL2606NEW',
    orderStatus: row ? source.orderStatus : '草稿',
    orderStatusKey: row ? source.orderStatusKey : 'draft',
    customer: row ? source.customer : '深圳市大洋贸易有限公司',
    salesman: row ? source.salesman : '张伟',
    packingType: row ? source.boxType : 'FCL',
    customerRefNo: row ? source.foreignNo : 'PO-SEA-260601',
    pol: row ? source.pol : '深圳',
    pod: row ? source.pod : '洛杉矶',
    soNo: row ? source.so : '',
  })
  cargoLines.value = [
    { id: 1, goodsName: 'LED 显示屏配件', packageType: 'CTN', pieces: row ? source.pieces : 320, grossWeight: row ? source.weight : 8600, volume: row ? source.volume : 42, cargoMark: '普通货' },
    { id: 2, goodsName: '安装支架', packageType: 'PLT', pieces: 18, grossWeight: 1280, volume: 6.4, cargoMark: '木托已熏蒸' },
  ]
  containerLines.value = [
    { id: 1, containerType: row?.containerSpec?.split('×')[0] || '40HQ', qty: 1, pickupPlace: '盐田空箱堆场', returnPlace: '盐田国际码头', soNo: row ? source.so : '' },
  ]
  feeLines.value = [
    { id: 1, direction: '应收', feeName: '海运费', currency: 'USD', amount: 1680, counterparty: row ? source.customer : '深圳市大洋贸易有限公司', settlement: '月结' },
    { id: 2, direction: '应收', feeName: '文件费', currency: 'CNY', amount: 450, counterparty: row ? source.customer : '深圳市大洋贸易有限公司', settlement: '现结' },
    { id: 3, direction: '应付', feeName: '订舱成本', currency: 'USD', amount: 1420, counterparty: '深圳订舱中心', settlement: '票结' },
  ]
  docLines.value = [
    { id: 1, docName: '托书', owner: '业务员', status: '已收到', dueDate: '2026-06-12' },
    { id: 2, docName: '装箱单/发票', owner: '客户', status: '待补充', dueDate: '2026-06-14' },
    { id: 3, docName: '报关资料', owner: '报关行', status: '待确认', dueDate: '2026-06-15' },
  ]
  followLines.value = [
    { id: 1, node: '客户托书确认', owner: '张伟', planTime: '2026-06-12 10:30', status: '已完成', remark: '客户确认按 40HQ 出运' },
    { id: 2, node: '订舱提交', owner: '李娜', planTime: '2026-06-13 14:00', status: '待跟进', remark: '等客户确认 SI 截单时间' },
  ]
}

function openCreateOrder() {
  orderDetailMode.value = 'create'
  seedOrderDetail()
  orderDetailVisible.value = true
}

function openOrderDetail(row: SaleOrderRow) {
  orderDetailMode.value = 'edit'
  seedOrderDetail(row)
  orderDetailVisible.value = true
}

function addCargoLine() {
  cargoLines.value.push({ id: Date.now(), goodsName: '', packageType: 'CTN', pieces: 0, grossWeight: 0, volume: 0, cargoMark: '普通货' })
}

function removeCargoLine(row: CargoLine) {
  cargoLines.value = cargoLines.value.filter((item) => item.id !== row.id)
}

function addContainerLine() {
  containerLines.value.push({ id: Date.now(), containerType: '40HQ', qty: 1, pickupPlace: '', returnPlace: '', soNo: orderForm.soNo })
}

function removeContainerLine(row: ContainerLine) {
  containerLines.value = containerLines.value.filter((item) => item.id !== row.id)
}

function addFeeLine(direction: '应收' | '应付') {
  feeLines.value.push({ id: Date.now(), direction, feeName: '', currency: direction === '应收' ? 'USD' : 'CNY', amount: 0, counterparty: direction === '应收' ? orderForm.customer : '', settlement: '票结' })
}

function removeFeeLine(row: FeeLine) {
  feeLines.value = feeLines.value.filter((item) => item.id !== row.id)
}

function addFollowLine() {
  followLines.value.push({ id: Date.now(), node: '', owner: orderForm.salesman, planTime: '', status: '待跟进', remark: '' })
}

function saveOrderDetail() {
  Modal.success({
    title: '业务单已保存',
    content: `${orderForm.orderNo || '新业务单'} 已保存为草稿。`,
  })
}

function submitOrderDetail() {
  orderForm.orderStatus = '待审核'
  orderForm.orderStatusKey = 'wait'
  Modal.success({
    title: '已提交审核',
    content: '客户委托、航线、货物、费用和单证信息已提交给审核人员。',
  })
}

function handoffToOperation() {
  orderForm.orderStatus = '操作待接单'
  orderForm.orderStatusKey = 'op'
  Modal.success({
    title: '已转操作接单',
    content: '业务单已流转给操作岗位，等待操作接单并继续订舱。',
  })
}

function submitBooking() {
  Modal.success({
    title: '订舱已提交',
    content: `${orderForm.carrier} / ${orderForm.vessel} ${orderForm.voyage} 已提交订舱申请。`,
  })
}

function confirmAbandonOrder() {
  Modal.warning({
    title: '确认废弃业务单',
    content: `业务单 ${orderForm.orderNo} 废弃后将停止后续订舱、报关和费用流转，是否继续？`,
    okButtonProps: { status: 'danger' },
    onOk: () => {
      orderForm.orderStatus = '已废弃'
      orderForm.orderStatusKey = 'draft'
    },
  })
}

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
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="q">
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">订单信息</div>
              <div class="detail-form-grid detail-form-grid--2">
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
              </div>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">业务标记</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="快捷标签">
                  <a-select v-model="q.quickTag" size="small" allow-clear placeholder="请选择">
                    <a-option value="urgent">加急</a-option>
                    <a-option value="vip">VIP客户</a-option>
                    <a-option value="overdue">逾期</a-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>

            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">时间范围</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="ETD 范围">
                  <a-range-picker v-model="q.etdRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ETA 范围">
                  <a-range-picker v-model="q.etaRange" size="small" style="width:100%" />
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
          <a-button size="small" type="primary" title="新建业务单" @click="openCreateOrder">
            <template #icon><icon-plus /></template>新建业务单
          </a-button>
          <a-button size="small" type="outline" title="打印业务单" @click="">
            <template #icon><icon-printer /></template>打印业务单
          </a-button>
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
              <a-doption @click="">批量关单</a-doption>
              <a-doption @click="">推送到档期通知</a-doption>
              <a-doption @click="">一键下载</a-doption>
              <a-doption @click="">关单导入</a-doption>
              <a-divider class="action-menu__divider" />
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
          <vxe-column type="seq" title="序号" width="52" fixed="left" />

          <!-- 默认显示列（核心） -->
          <vxe-column field="orderNo" title="订单编号" min-width="148" fixed="left" sortable>
            <template #default="{ row }">
              <span class="dds-order-no" style="color:var(--dense-primary);cursor:pointer" @click="openOrderDetail(row)">{{ row.orderNo }}</span>
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
              <div class="row-actions">
                <a-tooltip content="查看详情">
                  <a-button size="small" type="text" class="row-action-btn row-action-btn--primary" @click="openOrderDetail(row)">
                    <template #icon><icon-eye /></template>
                  </a-button>
                </a-tooltip>
                <!-- ★★★☆☆ 优化5：a-tooltip 替代 title 属性（spec 🟡 修复） -->
                <a-dropdown trigger="click" position="br" content-class="action-menu action-menu--row">
                  <a-tooltip content="更多操作">
                    <a-button size="small" type="text" class="row-action-btn row-action-btn--more">
                      <template #icon><icon-more /></template>
                    </a-button>
                  </a-tooltip>
                  <template #content>
                    <a-doption @click="">编辑</a-doption>
                    <a-doption @click="">打印业务单</a-doption>
                    <a-doption @click="">下载文件</a-doption>
                    <a-divider class="action-menu__divider" />
                    <a-popconfirm content="确认废弃该订单？此操作不可恢复。" @ok="">
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

    <a-drawer
      v-model:visible="orderDetailVisible"
      :title="orderDrawerTitle"
      width="calc(100vw - 32px)"
      placement="right"
      class="detail-drawer"
      :footer="false"
    >
      <div class="detail-drawer-body">
        <div class="dds-head">
          <div class="dds-head__main">
            <div class="dds-head__identity">
              <span class="dds-status-badge dds-status-badge--dot" :data-s="orderForm.orderStatusKey">{{ orderForm.orderStatus }}</span>
              <span class="dds-order-no">{{ orderForm.orderNo }}</span>
              <span class="dds-head__meta">{{ orderForm.customer }}</span>
              <span class="dds-head__meta-sep">/</span>
              <span class="dds-head__meta">{{ orderForm.salesman }} 负责</span>
            </div>
          </div>
          <div class="dds-head__actions">
            <a-button size="small" type="secondary">复制委托</a-button>
            <a-button size="small" type="secondary">打印托书</a-button>
            <a-button size="small" type="text" @click="orderDetailVisible = false">关闭</a-button>
          </div>
        </div>

        <div class="dds-hero dds-hero--compact">
          <div class="dds-hero__route">
            <div class="dds-hero__label">运输路线</div>
            <div class="dds-hero__route-main">
              <span class="dds-hero__port">{{ orderForm.pol }}</span>
              <span class="dds-hero__arrow">→</span>
              <span class="dds-hero__port">{{ orderForm.pod }}</span>
            </div>
            <div class="dds-hero__sub">{{ orderForm.transportMode }} / {{ orderForm.packingType }} / {{ orderForm.tradeTerm }}</div>
          </div>
          <div class="dds-hero__facts">
            <div class="dds-hero-fact">
              <span class="dds-hero-fact__label">ETD</span>
              <span class="dds-hero-fact__value dds-hero-fact__value--date">{{ orderForm.etd }}</span>
            </div>
            <div class="dds-hero-fact">
              <span class="dds-hero-fact__label">ETA</span>
              <span class="dds-hero-fact__value dds-hero-fact__value--date">{{ orderForm.eta }}</span>
            </div>
            <div class="dds-hero-fact">
              <span class="dds-hero-fact__label">船公司</span>
              <span class="dds-hero-fact__value">{{ orderForm.carrier }}</span>
            </div>
            <div class="dds-hero-fact">
              <span class="dds-hero-fact__label">大船船名/航次</span>
              <span class="dds-hero-fact__value">{{ orderForm.vessel }} / {{ orderForm.voyage }}</span>
            </div>
            <div class="dds-hero-fact dds-hero-fact--customer">
              <span class="dds-hero-fact__label">客户</span>
              <span class="dds-hero-fact__value">{{ orderForm.customer }}</span>
            </div>
          </div>
        </div>

        <div class="dds-milestone-bar">
          <div class="dds-milestone">
            <span
              v-for="item in orderMilestones"
              :key="item.label"
              class="dds-milestone__item"
              :data-state="item.state"
            >{{ item.label }}</span>
          </div>
        </div>

        <div class="detail-drawer-scroll">
          <div class="detail-section detail-section--core">
            <div class="detail-section__head">
              <div class="detail-section__title">客户委托</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline">同步报价</a-button>
                <a-button size="small" type="text">客户档案</a-button>
              </div>
            </div>
            <div class="detail-section__body">
              <a-form class="detail-form" layout="vertical" size="small" :model="orderForm">
                <div class="detail-form-grid detail-form-grid--4">
                  <a-form-item label="客户">
                    <a-select v-model="orderForm.customer" size="small" allow-search>
                      <a-option v-for="name in customers" :key="name" :value="name">{{ name }}</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="联系人">
                    <a-input v-model="orderForm.customerContact" size="small" placeholder="客户联系人" />
                  </a-form-item>
                  <a-form-item label="联系邮箱">
                    <a-input v-model="orderForm.customerEmail" size="small" placeholder="name@example.com" />
                  </a-form-item>
                  <a-form-item label="客户信用">
                    <a-input v-model="orderForm.creditStatus" size="small" disabled />
                  </a-form-item>
                  <a-form-item label="业务员">
                    <a-select v-model="orderForm.salesman" size="small">
                      <a-option v-for="name in salesmen" :key="name" :value="name">{{ name }}</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="操作员">
                    <a-input v-model="orderForm.operator" size="small" placeholder="提交后分配" />
                  </a-form-item>
                  <a-form-item label="客户委托号">
                    <a-input v-model="orderForm.customerRefNo" size="small" placeholder="PO / 客户单号" />
                  </a-form-item>
                  <a-form-item label="报价号">
                    <a-input v-model="orderForm.quoteNo" size="small" placeholder="报价单号" />
                  </a-form-item>
                  <a-form-item label="委托备注" class="detail-form-grid__span4">
                    <a-textarea v-model="orderForm.remark" size="small" :auto-size="{ minRows: 2 }" />
                  </a-form-item>
                </div>
              </a-form>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">航线订舱</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline">查船期</a-button>
                <a-button size="small" type="outline">申请舱位</a-button>
              </div>
            </div>
            <div class="detail-section__body">
              <a-form class="detail-form" layout="vertical" size="small" :model="orderForm">
                <div class="form-subgroup">
                  <div class="form-subgroup__head">
                    <span class="form-subgroup__title">路线</span>
                  </div>
                  <div class="detail-form-grid detail-form-grid--4">
                    <a-form-item label="起运港">
                      <div class="detail-combo detail-combo--code-name">
                        <a-input v-model="orderForm.polCode" size="small" placeholder="代码" />
                        <a-input v-model="orderForm.pol" size="small" placeholder="港口名称" />
                      </div>
                    </a-form-item>
                    <a-form-item label="目的港">
                      <div class="detail-combo detail-combo--code-name">
                        <a-input v-model="orderForm.podCode" size="small" placeholder="代码" />
                        <a-input v-model="orderForm.pod" size="small" placeholder="港口名称" />
                      </div>
                    </a-form-item>
                    <a-form-item label="目的地">
                      <a-input v-model="orderForm.destination" size="small" placeholder="最终目的地" />
                    </a-form-item>
                    <a-form-item label="运输条款">
                      <a-select v-model="orderForm.transportTerm" size="small">
                        <a-option value="CY-CY">CY-CY</a-option>
                        <a-option value="CY-DOOR">CY-DOOR</a-option>
                        <a-option value="CFS-CFS">CFS-CFS</a-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </div>
                <div class="form-subgroup">
                  <div class="form-subgroup__head">
                    <span class="form-subgroup__title">船期</span>
                  </div>
                  <div class="detail-form-grid detail-form-grid--4">
                    <a-form-item label="船公司">
                      <a-input v-model="orderForm.carrier" size="small" />
                    </a-form-item>
                    <a-form-item label="大船船名/航次">
                      <div class="detail-combo">
                        <a-input v-model="orderForm.vessel" size="small" placeholder="船名" />
                        <a-input v-model="orderForm.voyage" size="small" placeholder="航次" />
                      </div>
                    </a-form-item>
                    <a-form-item label="ETD">
                      <a-date-picker v-model="orderForm.etd" size="small" style="width:100%" />
                    </a-form-item>
                    <a-form-item label="ETA">
                      <a-date-picker v-model="orderForm.eta" size="small" style="width:100%" />
                    </a-form-item>
                    <a-form-item label="截关时间">
                      <a-input v-model="orderForm.cyCut" size="small" />
                    </a-form-item>
                    <a-form-item label="SI 截单">
                      <a-input v-model="orderForm.siCut" size="small" />
                    </a-form-item>
                    <a-form-item label="订舱代理">
                      <a-input v-model="orderForm.bookingAgent" size="small" />
                    </a-form-item>
                    <a-form-item label="SO 号">
                      <a-input v-model="orderForm.soNo" size="small" />
                    </a-form-item>
                  </div>
                </div>
              </a-form>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">货物信息</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline" @click="addCargoLine">
                  <template #icon><icon-plus /></template>添加货物
                </a-button>
              </div>
            </div>
            <div class="detail-module-summary detail-module-summary--inline detail-module-summary--cargo">
              <div class="detail-module-summary__stats">
                <div class="detail-module-summary__stat detail-module-summary__stat--qty">
                  <span class="detail-module-summary__stat-label">货量</span>
                  <span class="detail-module-summary__stat-value">{{ cargoTotal }}</span>
                  <span class="detail-module-summary__stat-unit">件</span>
                </div>
                <div class="detail-module-summary__stat detail-module-summary__stat--weight">
                  <span class="detail-module-summary__stat-label">毛重</span>
                  <span class="detail-module-summary__stat-value">{{ weightTotal }}</span>
                  <span class="detail-module-summary__stat-unit">kg</span>
                </div>
                <div class="detail-module-summary__stat detail-module-summary__stat--volume">
                  <span class="detail-module-summary__stat-label">体积</span>
                  <span class="detail-module-summary__stat-value">{{ volumeTotal }}</span>
                  <span class="detail-module-summary__stat-unit">CBM</span>
                </div>
              </div>
            </div>
            <div class="detail-section__body detail-section__body--table">
              <vxe-table
                :data="cargoLines"
                border="none"
                size="small"
                class="detail-mini-vxe detail-mini-vxe--editable"
                :row-config="{ isHover: true, keyField: 'id', height: 38 }"
              >
                <vxe-column type="seq" title="序号" width="52" />
                <vxe-column field="goodsName" title="品名" min-width="180">
                  <template #default="{ row }"><a-input v-model="row.goodsName" size="small" placeholder="中文/英文品名" /></template>
                </vxe-column>
                <vxe-column field="packageType" title="包装" min-width="90">
                  <template #default="{ row }"><a-input v-model="row.packageType" size="small" /></template>
                </vxe-column>
                <vxe-column field="pieces" title="件数" min-width="90">
                  <template #default="{ row }"><a-input-number v-model="row.pieces" size="small" :min="0" /></template>
                </vxe-column>
                <vxe-column field="grossWeight" title="毛重 KG" min-width="100">
                  <template #default="{ row }"><a-input-number v-model="row.grossWeight" size="small" :min="0" /></template>
                </vxe-column>
                <vxe-column field="volume" title="体积 CBM" min-width="100">
                  <template #default="{ row }"><a-input-number v-model="row.volume" size="small" :min="0" /></template>
                </vxe-column>
                <vxe-column field="cargoMark" title="货物属性" min-width="130">
                  <template #default="{ row }"><a-input v-model="row.cargoMark" size="small" /></template>
                </vxe-column>
                <vxe-column title="操作" width="72" fixed="right" align="center">
                  <template #default="{ row }">
                    <div class="row-actions">
                      <a-tooltip content="删除货物">
                        <a-popconfirm content="确认删除该货物明细？" @ok="removeCargoLine(row)">
                          <a-button size="small" type="text" status="danger" class="row-action-btn">
                            <template #icon><icon-delete /></template>
                          </a-button>
                        </a-popconfirm>
                      </a-tooltip>
                    </div>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">箱型柜量</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline" @click="addContainerLine">
                  <template #icon><icon-plus /></template>添加箱型
                </a-button>
              </div>
            </div>
            <div class="detail-section__body detail-section__body--table">
              <vxe-table :data="containerLines" border="none" size="small" class="detail-mini-vxe detail-mini-vxe--editable" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                <vxe-column type="seq" title="序号" width="52" />
                <vxe-column field="containerType" title="箱型" min-width="100">
                  <template #default="{ row }">
                    <a-select v-model="row.containerType" size="small">
                      <a-option value="20GP">20GP</a-option>
                      <a-option value="40GP">40GP</a-option>
                      <a-option value="40HQ">40HQ</a-option>
                      <a-option value="45HQ">45HQ</a-option>
                    </a-select>
                  </template>
                </vxe-column>
                <vxe-column field="qty" title="数量" min-width="80">
                  <template #default="{ row }"><a-input-number v-model="row.qty" size="small" :min="1" /></template>
                </vxe-column>
                <vxe-column field="pickupPlace" title="提空地点" min-width="180">
                  <template #default="{ row }"><a-input v-model="row.pickupPlace" size="small" /></template>
                </vxe-column>
                <vxe-column field="returnPlace" title="还重地点" min-width="180">
                  <template #default="{ row }"><a-input v-model="row.returnPlace" size="small" /></template>
                </vxe-column>
                <vxe-column field="soNo" title="SO 号" min-width="140">
                  <template #default="{ row }"><a-input v-model="row.soNo" size="small" /></template>
                </vxe-column>
                <vxe-column title="操作" width="72" fixed="right" align="center">
                  <template #default="{ row }">
                    <div class="row-actions">
                      <a-tooltip content="删除箱型">
                        <a-popconfirm content="确认删除该箱型柜量？" @ok="removeContainerLine(row)">
                          <a-button size="small" type="text" status="danger" class="row-action-btn">
                            <template #icon><icon-delete /></template>
                          </a-button>
                        </a-popconfirm>
                      </a-tooltip>
                    </div>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">收发通关</div>
            </div>
            <div class="detail-section__body">
              <a-form class="detail-form" layout="vertical" size="small" :model="orderForm">
                <div class="detail-form-grid detail-form-grid--4">
                  <a-form-item label="发货人" class="detail-form-grid__span2">
                    <a-textarea v-model="orderForm.shipper" size="small" :auto-size="{ minRows: 2 }" />
                  </a-form-item>
                  <a-form-item label="收货人" class="detail-form-grid__span2">
                    <a-textarea v-model="orderForm.consignee" size="small" :auto-size="{ minRows: 2 }" />
                  </a-form-item>
                  <a-form-item label="通知人" class="detail-form-grid__span2">
                    <a-textarea v-model="orderForm.notifyParty" size="small" :auto-size="{ minRows: 2 }" />
                  </a-form-item>
                  <a-form-item label="报关要求" class="detail-form-grid__span2">
                    <a-textarea v-model="orderForm.docRequirement" size="small" :auto-size="{ minRows: 2 }" />
                  </a-form-item>
                  <a-form-item label="报关行">
                    <a-input v-model="orderForm.customsBroker" size="small" />
                  </a-form-item>
                  <a-form-item label="报关方式">
                    <a-select v-model="orderForm.customsMode" size="small">
                      <a-option value="一般贸易">一般贸易</a-option>
                      <a-option value="买单报关">买单报关</a-option>
                      <a-option value="转关">转关</a-option>
                    </a-select>
                  </a-form-item>
                </div>
              </a-form>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">费用预估</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline" @click="addFeeLine('应收')">添加应收</a-button>
                <a-button size="small" type="outline" @click="addFeeLine('应付')">添加应付</a-button>
              </div>
            </div>
            <div class="detail-module-summary detail-module-summary--inline">
              <div class="detail-module-summary__stats">
                <div class="detail-module-summary__stat">
                  <span class="detail-module-summary__stat-label">应收</span>
                  <span class="detail-module-summary__stat-value">USD {{ receivableTotal }}</span>
                </div>
                <div class="detail-module-summary__stat">
                  <span class="detail-module-summary__stat-label">应付</span>
                  <span class="detail-module-summary__stat-value">USD {{ payableTotal }}</span>
                </div>
                <div class="detail-module-summary__stat detail-module-summary__stat--qty">
                  <span class="detail-module-summary__stat-label">利润预估</span>
                  <span class="detail-module-summary__stat-value">USD {{ profitEstimate }}</span>
                </div>
              </div>
            </div>
            <div class="detail-section__body detail-section__body--table">
              <vxe-table :data="feeLines" border="none" size="small" class="detail-mini-vxe detail-mini-vxe--editable" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                <vxe-column field="direction" title="收付" min-width="78">
                  <template #default="{ row }">
                    <a-select v-model="row.direction" size="small">
                      <a-option value="应收">应收</a-option>
                      <a-option value="应付">应付</a-option>
                    </a-select>
                  </template>
                </vxe-column>
                <vxe-column field="feeName" title="费用名称" min-width="140">
                  <template #default="{ row }"><a-input v-model="row.feeName" size="small" /></template>
                </vxe-column>
                <vxe-column field="currency" title="币种" min-width="80">
                  <template #default="{ row }"><a-input v-model="row.currency" size="small" /></template>
                </vxe-column>
                <vxe-column field="amount" title="金额" min-width="110">
                  <template #default="{ row }"><a-input-number v-model="row.amount" size="small" :min="0" /></template>
                </vxe-column>
                <vxe-column field="counterparty" title="结算对象" min-width="190">
                  <template #default="{ row }"><a-input v-model="row.counterparty" size="small" /></template>
                </vxe-column>
                <vxe-column field="settlement" title="结算方式" min-width="100">
                  <template #default="{ row }"><a-input v-model="row.settlement" size="small" /></template>
                </vxe-column>
                <vxe-column title="操作" width="72" fixed="right" align="center">
                  <template #default="{ row }">
                    <div class="row-actions">
                      <a-tooltip content="删除费用">
                        <a-popconfirm content="确认删除该费用明细？" @ok="removeFeeLine(row)">
                          <a-button size="small" type="text" status="danger" class="row-action-btn">
                            <template #icon><icon-delete /></template>
                          </a-button>
                        </a-popconfirm>
                      </a-tooltip>
                    </div>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">单证资料</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline">上传附件</a-button>
                <a-button size="small" type="text">生成 HBL 草稿</a-button>
              </div>
            </div>
            <div class="detail-section__body detail-section__body--table">
              <vxe-table :data="docLines" border="none" size="small" class="detail-mini-vxe detail-mini-vxe--readonly" :row-config="{ isHover: true, keyField: 'id', height: 34 }">
                <vxe-column field="docName" title="资料名称" min-width="160" />
                <vxe-column field="owner" title="责任方" min-width="120" />
                <vxe-column field="status" title="状态" min-width="100">
                  <template #default="{ row }"><span class="s-pill" :data-s="row.status === '已收到' ? 'acc' : 'wait'">{{ row.status }}</span></template>
                </vxe-column>
                <vxe-column field="dueDate" title="要求时间" min-width="120" />
              </vxe-table>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__head">
              <div class="detail-section__title">业务跟进</div>
              <div class="detail-section__actions">
                <a-button size="small" type="outline" @click="addFollowLine">
                  <template #icon><icon-plus /></template>添加跟进
                </a-button>
              </div>
            </div>
            <div class="detail-section__body detail-section__body--table">
              <vxe-table :data="followLines" border="none" size="small" class="detail-mini-vxe detail-mini-vxe--editable" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                <vxe-column field="node" title="跟进事项" min-width="160">
                  <template #default="{ row }"><a-input v-model="row.node" size="small" /></template>
                </vxe-column>
                <vxe-column field="owner" title="负责人" min-width="100">
                  <template #default="{ row }"><a-input v-model="row.owner" size="small" /></template>
                </vxe-column>
                <vxe-column field="planTime" title="计划时间" min-width="140">
                  <template #default="{ row }"><a-input v-model="row.planTime" size="small" /></template>
                </vxe-column>
                <vxe-column field="status" title="状态" min-width="100">
                  <template #default="{ row }">
                    <a-select v-model="row.status" size="small">
                      <a-option value="待跟进">待跟进</a-option>
                      <a-option value="跟进中">跟进中</a-option>
                      <a-option value="已完成">已完成</a-option>
                    </a-select>
                  </template>
                </vxe-column>
                <vxe-column field="remark" title="记录" min-width="260">
                  <template #default="{ row }"><a-input v-model="row.remark" size="small" /></template>
                </vxe-column>
              </vxe-table>
            </div>
          </div>
        </div>

        <div class="detail-drawer-footer">
          <div class="detail-drawer-footer__start">
            <a-button size="small" type="text" status="danger" @click="confirmAbandonOrder">废弃</a-button>
          </div>
          <div class="detail-drawer-footer__end">
            <div class="detail-drawer-footer__cluster">
              <a-dropdown trigger="click" content-class="action-menu action-menu--footer">
                <a-button size="small" type="secondary">输出<icon-down /></a-button>
                <template #content>
                  <a-doption>打印托书</a-doption>
                  <a-doption>导出费用预估</a-doption>
                  <a-doption>生成客户确认单</a-doption>
                </template>
              </a-dropdown>
              <a-dropdown trigger="click" content-class="action-menu action-menu--footer">
                <a-button size="small" type="secondary">流转<icon-down /></a-button>
                <template #content>
                  <a-doption @click="handoffToOperation">转操作接单</a-doption>
                  <a-doption @click="submitBooking">提交订舱</a-doption>
                </template>
              </a-dropdown>
              <span class="detail-drawer-footer__sep" aria-hidden="true" />
              <a-button size="small" @click="orderDetailVisible = false">取消</a-button>
              <a-button size="small" type="outline" @click="saveOrderDetail">保存草稿</a-button>
              <a-button size="small" type="primary" @click="submitOrderDetail">提交审核</a-button>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
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
