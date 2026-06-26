<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Modal, Message } from '@arco-design/web-vue'
import type { VxeTableInstance } from 'vxe-table'
import {
  IconRefresh, IconSearch, IconEye, IconDownload, IconEdit,
  IconDown, IconSettings, IconFilter, IconMore, IconUpload, IconSwap
} from '@arco-design/web-vue/es/icon'

// ─── Types ───────────────────────────────────────────────────────────────────
interface PaymentRow {
  id: number
  unWrittenOff: number
  type: '应收' | '应付'
  inboundNo: string
  billNo: string
  billCompany: string
  currency: string
  amount: number
  preWriteOff: number
  actualWriteOff: number
  taxRate: number
  taxAmount: number
  mbl: string
  orderNo: string
  etd: string
  eta: string
  atd: string
  ata: string
  podTime: string
  podStatus: string
  c88: string
}

interface PendingWriteOffRow {
  id: number
  no: number
  type: '应收' | '应付'
  billNo: string
  billCompany: string
  currency: string
  selectedAmount: number
  writeOffStatus: string
  writeOffStatusKey: string
  etd: string
  eta: string
  hbl: string
  orderNo: string
  ownerCompany: string
  salesman: string
  operator: string
  fileCount: number
}

// ─── Table refs ───────────────────────────────────────────────────────────────
const xTable = ref<VxeTableInstance>()
const xSubTable = ref<VxeTableInstance>()

// ─── Filter state ─────────────────────────────────────────────────────────────
const advancedFilterVisible = ref(false)

const q = reactive({
  // visible row
  transportMode: 'sea',
  manageCo: '',
  payType: '',
  billCoType: 'include',   // include | exclude
  billCo: '',
  writeOffStatus: '',
  currency: '',
  noType: 'businessNo',
  noKeyword: '',
  noSingle: false,
  noPrecise: false,
  writeOffNo: '',
  billNo: '',
  billNoPrecise: true,
  // visible row - 时间节点
  etdRange: [] as string[],
  etaRange: [] as string[],
  atdRange: [] as string[],
  ataRange: [] as string[],
  podTimeRange: [] as string[],
  c88TimeRange: [] as string[],
  systemDueDateRange: [] as string[],
  financialConfirmRange: [] as string[],
  actualDeliveryRange: [] as string[],
  submitTimeRange: [] as string[],
  // drawer - 人员
  salesman: '',
  customerService: '',
  operator: '',
  // drawer - 财务
  amountMin: '',
  amountMax: '',
  taxRate: '',
  feeItem: '',
  feeItemExclude: false,
  isInvoiced: '',
  isFullTax: '',
  // drawer - 订单
  companyType: '',
  bizType: '',
  importExportType: '',
  businessNo: '',
  orderNo: '',
  fbaNo: '',
  poNo: '',
  sender: '',
  receiver: '',
  bookingSender: '',
  customer: '',
  originPlace: '',
  destinationPlace: '',
  pol: '',
  orderOwnerCo: '',
  soNo: '',
  pod: '',
  podCountry: '',
  polCountry: '',
  carrier: '',
  vessel: '',
  voyage: '',
  routeName: '',
  contractNo: '',
  overseasAgent: '',
  overseasNo: '',
  packingType: '',
  containerType: '',
  cargoName: '',
  cargoType: '',
  orderStatus: '',
  customsMethod: '',
  operationRemark: '',
  bookingContent: '',
  storageTimeRange: [] as string[],
  orderTimeRange: [] as string[],
  sailingTimeRange: [] as string[],
  financePodRange: [] as string[],
  documentKeyword: '',
  market: '',
  serviceScope: '',
  customerType: '',
  tradeTerms: '',
  oceanFreightRecorded: '',
  noBookingOrder: false,
  noContinueOrder: false,
  inboundUnsubmitted: false,
  lastShipmentNoReceipt: false,
  sensitiveCargo: false,
  fullContainer: false,
  flashBox: false,
  sameCarrier: false,
  containerNo: '',
  externalNo: '',
  invoiceNo: '',
  // drawer - 其他
  domesticFreight: '',
  operations: '',
  podStatus: '',
  billDept: '',
  excludeOp: '',
  preWriteOffCode: '',
  proxyBillDone: '',
  hblNo: '',
  mblNo: '',
})

// ─── Mock data ────────────────────────────────────────────────────────────────
const WRITE_OFF_STATUS: Record<string, { label: string; s: string }> = {
  pending:    { label: '未核销', s: 'wait' },
  partial:    { label: '部分核销', s: 'op' },
  done:       { label: '已核销', s: 'acc' },
  cancelled:  { label: '已取消', s: 'draft' },
}

const companies = [
  'MCTBL INTERNA...', '西安世**********', 'AND***********',
  'JIA***********', 'SHA***********', 'YON***********',
]
const mbls = [
  'TRA2304270183', 'TRA2304170044', 'TRA2304250143', 'TRA2304200083',
]
const currencies = ['USD', 'CNY', 'EUR']
const statusKeys = ['pending', 'partial', 'done', 'cancelled']

function mockMainRows(n: number): PaymentRow[] {
  return Array.from({ length: n }, (_, i) => {
    const idx = i + 14
    const cur = currencies[i % currencies.length]
    const amt = [350, 7400, -14.44, 60, 3248, 7600, 8200, 50, 2450, 8356.6, 120, 10550, 15000, 112.8, 50, 14062.4][i % 16]
    return {
      id: idx,
      unWrittenOff: 0,
      type: i % 2 === 0 ? '应付' : '应收',
      inboundNo: '',
      billNo: `2305${String(439 + Math.floor(i / 3)).padStart(4, '0')}-${String((i % 3) + 1).padStart(3, '0')}`,
      billCompany: companies[i % companies.length],
      currency: cur,
      amount: amt,
      preWriteOff: 0,
      actualWriteOff: amt,
      taxRate: 0,
      taxAmount: 0,
      mbl: mbls[Math.floor(i / 3) % mbls.length],
      orderNo: mbls[Math.floor(i / 3) % mbls.length],
      etd: '2023-05-' + String(8 + (i % 5)).padStart(2, '0'),
      eta: '2023-05-' + String(18 + (i % 11)).padStart(2, '0'),
      atd: '2023-05-' + String(8 + (i % 5)).padStart(2, '0'),
      ata: '2023-05-' + String(18 + (i % 11)).padStart(2, '0'),
      podTime: '',
      podStatus: i % 4 === 0 ? '未上传' : '',
      c88: '',
    }
  })
}

function mockSubRows(n: number): PendingWriteOffRow[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    no: i + 1,
    type: i % 2 === 0 ? '应收' : '应付',
    billNo: `2305${String(500 + i).padStart(4, '0')}-001`,
    billCompany: companies[i % companies.length],
    currency: currencies[i % currencies.length],
    selectedAmount: [1200, 3500, 800, 6000, 450][i % 5],
    writeOffStatus: WRITE_OFF_STATUS[statusKeys[i % statusKeys.length]].label,
    writeOffStatusKey: WRITE_OFF_STATUS[statusKeys[i % statusKeys.length]].s,
    etd: '2023-05-08',
    eta: '2023-05-26',
    hbl: '',
    orderNo: mbls[i % mbls.length],
    ownerCompany: '西安世**********',
    salesman: ['张伟', '李娜', '王鹏'][i % 3],
    operator: ['陈静', '刘洋'][i % 2],
    fileCount: i % 3,
  }))
}

const allMainRows = mockMainRows(17)
const allSubRows = ref<PendingWriteOffRow[]>([])
const mainTableData = computed(() => allMainRows)
const subTableData = computed(() => allSubRows.value)
const total = computed(() => allMainRows.length)
const page = ref(1)
const pageSize = ref(50)
const selectedRows = ref<PaymentRow[]>([])
const selectedSubRows = ref<PendingWriteOffRow[]>([])

// ─── Handlers ─────────────────────────────────────────────────────────────────
function handleSearch() {
  Message.info('查询中...')
}

function handleReset() {
  Object.assign(q, {
    transportMode: 'sea', manageCo: '', payType: '', billCoType: 'include', billCo: '',
    writeOffStatus: '', currency: '', noType: 'businessNo', noKeyword: '',
    noSingle: false, noPrecise: false, writeOffNo: '',
    billNo: '', billNoPrecise: true,
    etdRange: [], etaRange: [], atdRange: [], ataRange: [],
    podTimeRange: [], c88TimeRange: [], systemDueDateRange: [],
    financialConfirmRange: [], actualDeliveryRange: [], submitTimeRange: [],
    salesman: '', customerService: '', operator: '',
    amountMin: '', amountMax: '', taxRate: '', feeItem: '', feeItemExclude: false,
    isInvoiced: '', isFullTax: '',
    companyType: '', bizType: '', importExportType: '', businessNo: '', orderNo: '',
    fbaNo: '', poNo: '', sender: '', receiver: '', bookingSender: '', customer: '',
    originPlace: '', destinationPlace: '', pol: '', orderOwnerCo: '', soNo: '', pod: '',
    podCountry: '', polCountry: '', carrier: '', vessel: '', voyage: '', routeName: '',
    contractNo: '', overseasAgent: '', overseasNo: '', packingType: '', containerType: '',
    cargoName: '', cargoType: '', orderStatus: '', customsMethod: '',
    operationRemark: '', bookingContent: '', storageTimeRange: [], orderTimeRange: [],
    sailingTimeRange: [], financePodRange: [], documentKeyword: '', market: '',
    serviceScope: '', customerType: '', tradeTerms: '', oceanFreightRecorded: '',
    noBookingOrder: false, noContinueOrder: false, inboundUnsubmitted: false,
    lastShipmentNoReceipt: false, sensitiveCargo: false, fullContainer: false,
    flashBox: false, sameCarrier: false, containerNo: '', externalNo: '', invoiceNo: '',
    domesticFreight: '', operations: '', podStatus: '',
    billDept: '', excludeOp: '', preWriteOffCode: '', proxyBillDone: '',
    hblNo: '', mblNo: '',
  })
}

function handleDrawerApply() {
  advancedFilterVisible.value = false
  handleSearch()
}

function handleDrawerClear() {
  Object.assign(q, {
    etdRange: [], etaRange: [], atdRange: [], ataRange: [],
    podTimeRange: [], c88TimeRange: [], systemDueDateRange: [],
    financialConfirmRange: [], actualDeliveryRange: [], submitTimeRange: [],
    salesman: '', customerService: '', operator: '',
    amountMin: '', amountMax: '', taxRate: '', feeItem: '', feeItemExclude: false,
    isInvoiced: '', isFullTax: '',
    companyType: '', bizType: '', importExportType: '', businessNo: '', orderNo: '',
    fbaNo: '', poNo: '', sender: '', receiver: '', bookingSender: '', customer: '',
    originPlace: '', destinationPlace: '', pol: '', orderOwnerCo: '', soNo: '', pod: '',
    podCountry: '', polCountry: '', carrier: '', vessel: '', voyage: '', routeName: '',
    contractNo: '', overseasAgent: '', overseasNo: '', packingType: '', containerType: '',
    cargoName: '', cargoType: '', orderStatus: '', customsMethod: '',
    operationRemark: '', bookingContent: '', storageTimeRange: [], orderTimeRange: [],
    sailingTimeRange: [], financePodRange: [], documentKeyword: '', market: '',
    serviceScope: '', customerType: '', tradeTerms: '', oceanFreightRecorded: '',
    noBookingOrder: false, noContinueOrder: false, inboundUnsubmitted: false,
    lastShipmentNoReceipt: false, sensitiveCargo: false, fullContainer: false,
    flashBox: false, sameCarrier: false, containerNo: '', externalNo: '', invoiceNo: '',
    domesticFreight: '', operations: '', podStatus: '',
    billDept: '', excludeOp: '', preWriteOffCode: '', proxyBillDone: '',
    hblNo: '', mblNo: '',
  })
}

function handleWriteOff() {
  if (!selectedRows.value.length) {
    Message.warning('请先选择账单')
    return
  }
  allSubRows.value = mockSubRows(selectedRows.value.length * 2)
  Message.success(`已加载 ${allSubRows.value.length} 条待核销账单`)
}

function handleBatchCancelBill() {
  Modal.confirm({
    title: '批量取消账单',
    content: `确认取消选中的 ${selectedRows.value.length} 条账单？此操作不可撤销。`,
    onOk: () => { Message.success('已取消选中账单') },
  })
}

function handleWriteOffSubmit() {
  if (!selectedSubRows.value.length) {
    Message.warning('请先选择待核销账单')
    return
  }
  Message.success('核销成功')
  allSubRows.value = []
}

function handleReleasePre() {
  Modal.confirm({
    title: '释放预选记录',
    content: '确认释放所有预选记录？',
    onOk: () => { Message.success('已释放预选记录') },
  })
}

function handleSubRefresh() {
  allSubRows.value = mockSubRows(allSubRows.value.length)
}

function handleSubRemoveBatch() {
  if (!selectedSubRows.value.length) {
    Message.warning('请先选择')
    return
  }
  allSubRows.value = []
}

function handleViewDetail(row: PaymentRow) {
  Message.info(`查看账单 ${row.billNo}`)
}
</script>

<template>
  <div class="page-root page-root--dense">

    <!-- ① 业务单模式：海运/空运/铁路会改变查询项和业务语义，作为 L1 页面段 -->
    <div class="zone-l1-transport zone-card">
      <button class="seg-btn" :class="{ 'seg-btn--active': q.transportMode === 'sea' }" @click="q.transportMode = 'sea'">海运</button>
      <button class="seg-btn" :class="{ 'seg-btn--active': q.transportMode === 'air' }" @click="q.transportMode = 'air'">空运</button>
      <button class="seg-btn" :class="{ 'seg-btn--active': q.transportMode === 'rail' }" @click="q.transportMode = 'rail'">铁路</button>
    </div>

    <!-- ① 筛选区：收付款账单工作台只露出高频定位/收窄条件；专项条件进入筛选抽屉 -->
    <div class="zone-l2-filter-card zone-card filter-card">

      <!-- 行1：账单归属 + 往来单位 -->
      <div class="filter-card__slim-row">
        <div class="filter-field">
          <label class="filter-field__label">管理公司</label>
          <a-select v-model="q.manageCo" size="small" allow-clear placeholder="请选择管理公司" />
        </div>
        <div class="filter-field">
          <label class="filter-field__label">收付类型</label>
          <a-select v-model="q.payType" size="small" allow-clear placeholder="请选择">
            <a-option value="receivable">应收</a-option>
            <a-option value="payable">应付</a-option>
          </a-select>
        </div>
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">往来单位</label>
          <div class="filter-combo arco-input-group">
            <a-select v-model="q.billCoType" size="small" class="filter-combo__select filter-combo--keyword">
              <a-option value="include">包含单位</a-option>
              <a-option value="exclude">排除单位</a-option>
            </a-select>
            <a-select v-model="q.billCo" size="small" class="filter-combo__fill" allow-clear placeholder="请选择往来单位" />
          </div>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">核销状态</label>
          <a-select v-model="q.writeOffStatus" size="small" allow-clear placeholder="请选择">
            <a-option value="pending">未核销</a-option>
            <a-option value="partial">部分核销</a-option>
            <a-option value="done">已核销</a-option>
            <a-option value="cancelled">已取消</a-option>
          </a-select>
        </div>
      </div>

      <!-- 行2：业务单定位 + 操作按钮 -->
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span3">
          <label class="filter-field__label">业务单检索</label>
          <div class="filter-combo arco-input-group">
            <a-select v-model="q.noType" size="small" class="filter-combo__select filter-combo--keyword">
              <a-option value="businessNo">业务单号</a-option>
              <a-option value="orderNo">订单编号</a-option>
              <a-option value="billNo">账单编号</a-option>
              <a-option value="writeOffNo">核销编号</a-option>
              <a-option value="hbl">HBL NO</a-option>
              <a-option value="mbl">MBL NO</a-option>
              <a-option value="preCode">预核销码</a-option>
            </a-select>
            <a-input v-model="q.noKeyword" size="small" allow-clear placeholder="请输入业务单号 / 订单号 / HBL / MBL" />
          </div>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">币种</label>
          <a-select v-model="q.currency" size="small" allow-clear placeholder="请选择">
            <a-option value="USD">USD</a-option>
            <a-option value="CNY">CNY</a-option>
            <a-option value="EUR">EUR</a-option>
          </a-select>
        </div>
        <div class="filter-card__inline-actions">
          <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          <a-button size="small" type="text" class="reset-btn" @click="advancedFilterVisible = true">
            <template #icon><icon-filter /></template>
            筛选
          </a-button>
        </div>
      </div>

    </div>

    <!-- ② 工具栏 -->
    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="toolbar">
        <!-- Type 分级 + Divider 分组 + Icon 形状识别；颜色只给 primary 锚点和危险 -->
        <div class="toolbar-group">
          <!-- 核销主操作 -->
          <a-button size="small" type="primary" @click="handleWriteOff">选择销账</a-button>
          <span v-if="selectedRows.length" class="toolbar-selected-tip toolbar-selected-tip--near-action">已选 {{ selectedRows.length }} 条</span>

          <div class="toolbar-divider" />

          <!-- 输出组：高频，outline -->
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              <template #icon><icon-download /></template>导出<icon-down />
            </a-button>
            <template #content>
              <a-doption>导出 Excel</a-doption>
              <a-doption>导出 PDF</a-doption>
              <a-doption>导出账单明细</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              <template #icon><icon-download /></template>账单下载<icon-down />
            </a-button>
            <template #content>
              <a-doption>下载账单</a-doption>
              <a-doption>批量下载</a-doption>
            </template>
          </a-dropdown>

          <div class="toolbar-divider" />

          <!-- 对账组：高频，outline -->
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              <template #icon><icon-swap /></template>对中<icon-down />
            </a-button>
            <template #content>
              <a-doption>自动对中</a-doption>
              <a-doption>手动对中</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              <template #icon><icon-upload /></template>上对比导入<icon-down />
            </a-button>
            <template #content>
              <a-doption>导入模板下载</a-doption>
              <a-doption>上传对比文件</a-doption>
            </template>
          </a-dropdown>

          <div class="toolbar-divider" />

          <!-- 维护组：中低频，降权为 text -->
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="text">
              <template #icon><icon-edit /></template>账单修改<icon-down />
            </a-button>
            <template #content>
              <a-doption>修改金额</a-doption>
              <a-doption>修改币种</a-doption>
              <a-doption>修改账单公司</a-doption>
              <a-doption>修改费用项目</a-doption>
            </template>
          </a-dropdown>
          <a-button size="small" type="text" @click="handleSearch">
            <template #icon><icon-refresh /></template>刷新DueDate
          </a-button>
        </div>
        <div class="toolbar-aside">
          <a-tooltip content="刷新">
            <a-button size="small" type="text" @click="handleSearch">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <!-- 低频/危险操作物理隔离：放右端减少误触 -->
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-tooltip content="更多操作">
              <a-button size="small" type="text"><icon-more /></a-button>
            </a-tooltip>
            <template #content>
              <a-divider class="action-menu__divider" />
              <a-doption class="danger-opt" @click="handleBatchCancelBill">批量取消账单</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <!-- ③ 主表格 -->
    <div class="zone-l4-table-card payment-main-table">
      <div class="table-card-cap table-card-cap--primary">
        <div class="table-card-cap__start">
          <span class="table-card-cap__title">账单列表</span>
        </div>
        <div class="table-card-cap__right">
          <a-pagination
            v-model:current="page"
            v-model:page-size="pageSize"
            :total="total"
            size="small"
            class="table-card-cap__pager"
            show-total
            show-page-size
            :page-size-options="[50, 100, 200]"
          />
          <a-tooltip content="列设置">
            <a-button size="small" type="text" class="table-card-cap__tool" @click="xTable?.openCustom()">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="table-wrap" style="flex:1;min-height:0">
        <vxe-table
          ref="xTable"
          border="none"
          size="small"
          class="compact workbench-table"
          height="100%"
          show-overflow="title"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ checkField: 'checked', highlight: true }"
          :data="mainTableData"
          @checkbox-change="({ records }) => (selectedRows = records)"
          @checkbox-all="({ records }) => (selectedRows = records)"
        >
          <vxe-column type="checkbox" width="36" fixed="left" />
          <vxe-column type="seq" title="序号" width="52" fixed="left" align="center" />
          <vxe-column field="unWrittenOff" title="未核销金额" min-width="104" align="right" />
          <vxe-column field="type" title="类型" min-width="64">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.type === '应收' ? 'op' : 'wait'">{{ row.type }}</span>
            </template>
          </vxe-column>
          <vxe-column field="inboundNo" title="入仓编号" min-width="104" />
          <vxe-column field="billNo" title="账单编号" min-width="140">
            <template #default="{ row }">
              <a class="link-primary">{{ row.billNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="billCompany" title="账单公司" min-width="140" />
          <vxe-column field="currency" title="币种" min-width="64" />
          <vxe-column field="amount" title="金额" min-width="92" align="right" />
          <vxe-column field="preWriteOff" title="预核销" min-width="84" align="right" />
          <vxe-column field="actualWriteOff" title="实际核销" min-width="92" align="right" />
          <vxe-column field="taxRate" title="税率" min-width="64" align="right" />
          <vxe-column field="taxAmount" title="税额" min-width="72" align="right" />
          <vxe-column field="mbl" title="MBL" min-width="140" />
          <vxe-column field="orderNo" title="订单号" min-width="140">
            <template #default="{ row }">
              <a class="link-primary">{{ row.orderNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="etd" title="ETD" min-width="92" />
          <vxe-column field="eta" title="ETA" min-width="92" />
          <vxe-column field="atd" title="ATD" min-width="92" />
          <vxe-column field="ata" title="ATA" min-width="92" />
          <vxe-column field="podTime" title="POD时间" min-width="92" />
          <vxe-column field="podStatus" title="POD状态" min-width="84">
            <template #default="{ row }">
              <span v-if="row.podStatus" class="s-pill" data-s="wait">{{ row.podStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="c88" title="C88" min-width="92" />
          <vxe-column title="操作" width="60" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看">
                  <a-button type="text" class="row-action-btn row-action-btn--primary" @click="handleViewDetail(row)">
                    <icon-eye />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <!-- ④ 待核销账单子表 -->
    <div class="workbench-subpanel payment-writeoff-panel">
      <div class="subpanel-cap">
        <div class="subpanel-cap__main">
          <span class="subpanel-cap__title">待核销账单</span>
          <span class="subpanel-cap__meta">{{ subTableData.length }} 条</span>
          <span v-if="selectedSubRows.length" class="toolbar-selected-tip">已选 {{ selectedSubRows.length }} 条</span>
        </div>
        <div class="subpanel-cap__actions">
          <a-button size="small" type="primary" @click="handleWriteOffSubmit">核销</a-button>
          <a-button size="small" type="secondary">预核销</a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="text">更多处理<icon-down /></a-button>
            <template #content>
              <a-doption>预核销销账</a-doption>
              <a-doption>待核销账单一键对冲</a-doption>
              <a-doption>标记环整</a-doption>
              <a-doption>未分配利润</a-doption>
            </template>
          </a-dropdown>
          <a-button size="small" type="text">
            <template #icon><icon-upload /></template>导入
          </a-button>
          <a-tooltip content="刷新">
            <a-button size="small" type="text" @click="handleSubRefresh">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="列设置">
            <a-button size="small" type="text" @click="xSubTable?.openCustom()">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="text" status="danger">风险操作<icon-down /></a-button>
            <template #content>
              <a-doption class="danger-opt" @click="handleSubRemoveBatch">移除选中账单</a-doption>
              <a-doption class="danger-opt" @click="handleReleasePre">释放预选记录</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="table-wrap" style="flex:1;min-height:0">
        <vxe-table
          ref="xSubTable"
          border="none"
          size="small"
          class="compact workbench-table"
          height="100%"
          show-overflow="title"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ checkField: 'checked', highlight: true }"
          :data="subTableData"
          :empty-render="{ name: 'NotData' }"
          @checkbox-change="({ records }) => (selectedSubRows = records)"
          @checkbox-all="({ records }) => (selectedSubRows = records)"
        >
          <vxe-column type="checkbox" width="36" fixed="left" />
          <vxe-column type="seq" title="No" width="52" fixed="left" align="center" />
          <vxe-column field="type" title="类型" min-width="64">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.type === '应收' ? 'op' : 'wait'">{{ row.type }}</span>
            </template>
          </vxe-column>
          <vxe-column field="billNo" title="账单编号" min-width="140">
            <template #default="{ row }">
              <a class="link-primary">{{ row.billNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="billCompany" title="账单公司" min-width="130" />
          <vxe-column field="currency" title="币种" min-width="64" />
          <vxe-column field="selectedAmount" title="选择金额" min-width="92" align="right" />
          <vxe-column field="writeOffStatus" title="核销状态" min-width="84">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.writeOffStatusKey">{{ row.writeOffStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="etd" title="ETD" min-width="92" />
          <vxe-column field="eta" title="ETA" min-width="92" />
          <vxe-column field="hbl" title="HBL" min-width="120" />
          <vxe-column field="orderNo" title="订单编号" min-width="140" />
          <vxe-column field="ownerCompany" title="归属公司" min-width="120" />
          <vxe-column field="salesman" title="业务员" min-width="72" />
          <vxe-column field="operator" title="操作员" min-width="72" />
          <vxe-column field="fileCount" title="文件" min-width="64" align="center" />
          <vxe-column title="操作" width="60" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="查看">
                  <a-button type="text" class="row-action-btn row-action-btn--primary" @click="Message.info(row.billNo)">
                    <icon-eye />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <!-- ⑤ 更多筛选抽屉 -->
    <a-drawer
      v-model:visible="advancedFilterVisible"
      title="业务单查询项"
      :width="920"
      class="query-filter-drawer query-filter-drawer--wide"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="q">

            <!-- 单号信息 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">单号信息</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="业务单号">
                  <a-input v-model="q.businessNo" size="small" allow-clear placeholder="请输入业务单号" />
                </a-form-item>
                <a-form-item label="订单编号">
                  <a-input v-model="q.orderNo" size="small" allow-clear placeholder="请输入订单编号" />
                </a-form-item>
                <a-form-item label="账单编号">
                  <a-input v-model="q.billNo" size="small" allow-clear placeholder="多个请用英文分号分隔" />
                </a-form-item>
                <a-form-item label="HBL NO">
                  <a-input v-model="q.hblNo" size="small" allow-clear placeholder="请输入 HBL 单号" />
                </a-form-item>
                <a-form-item label="MBL NO">
                  <a-input v-model="q.mblNo" size="small" allow-clear placeholder="请输入 MBL 单号" />
                </a-form-item>
                <a-form-item label="FBA NO">
                  <a-input v-model="q.fbaNo" size="small" allow-clear placeholder="请输入 FBA 单号" />
                </a-form-item>
                <a-form-item label="SO NO">
                  <a-input v-model="q.soNo" size="small" allow-clear placeholder="请输入 SO 号" />
                </a-form-item>
                <a-form-item label="PO">
                  <a-input v-model="q.poNo" size="small" allow-clear placeholder="请输入 PO" />
                </a-form-item>
                <a-form-item label="合约号">
                  <a-input v-model="q.contractNo" size="small" allow-clear placeholder="请输入合约号" />
                </a-form-item>
              </div>
            </div>

            <!-- 时间范围 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">时间范围</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="进仓时间">
                  <a-range-picker v-model="q.storageTimeRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="下单时间">
                  <a-range-picker v-model="q.orderTimeRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ETD">
                  <a-range-picker v-model="q.etdRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="财务POD">
                  <a-range-picker v-model="q.financePodRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="船前时间">
                  <a-range-picker v-model="q.sailingTimeRange" size="small" style="width:100%" />
                </a-form-item>
              </div>
            </div>

            <!-- 人员与往来方 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">人员与往来方</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="发货人">
                  <a-select v-model="q.sender" size="small" allow-clear placeholder="请选择发货人" />
                </a-form-item>
                <a-form-item label="收货人">
                  <a-select v-model="q.receiver" size="small" allow-clear placeholder="请选择收货人" />
                </a-form-item>
                <a-form-item label="提单发货人">
                  <a-select v-model="q.bookingSender" size="small" allow-clear placeholder="请选择提单发货人" />
                </a-form-item>
                <a-form-item label="客户">
                  <a-select v-model="q.customer" size="small" allow-clear placeholder="请选择客户" />
                </a-form-item>
                <a-form-item label="业务员">
                  <a-input v-model="q.salesman" size="small" allow-clear placeholder="请输入业务员" />
                </a-form-item>
                <a-form-item label="客服">
                  <a-input v-model="q.customerService" size="small" allow-clear placeholder="请输入客服" />
                </a-form-item>
                <a-form-item label="操作员">
                  <a-input v-model="q.operator" size="small" allow-clear placeholder="请输入操作员" />
                </a-form-item>
                <a-form-item label="运营">
                  <a-select v-model="q.operations" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="排除操作">
                  <a-select v-model="q.excludeOp" size="small" allow-clear placeholder="关联数据" />
                </a-form-item>
              </div>
            </div>

            <!-- 港口路线 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">港口路线</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="收货地">
                  <a-select v-model="q.originPlace" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="起运港">
                  <a-select v-model="q.pol" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="目的港">
                  <a-select v-model="q.pod" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="目的地">
                  <a-select v-model="q.destinationPlace" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="起运港国家">
                  <a-select v-model="q.polCountry" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="目的港国家">
                  <a-select v-model="q.podCountry" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
              </div>
            </div>

            <!-- 航线信息 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">航线信息</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="船公司">
                  <a-select v-model="q.carrier" size="small" allow-clear placeholder="请选择船司" />
                </a-form-item>
                <a-form-item label="船名">
                  <a-input v-model="q.vessel" size="small" allow-clear placeholder="请输入船名" />
                </a-form-item>
                <a-form-item label="航次">
                  <a-input v-model="q.voyage" size="small" allow-clear placeholder="请输入航次" />
                </a-form-item>
                <a-form-item label="航线">
                  <a-input v-model="q.routeName" size="small" allow-clear placeholder="请输入航线" />
                </a-form-item>
                <a-form-item label="境外代理">
                  <a-select v-model="q.overseasAgent" size="small" allow-clear placeholder="请选择境外代理" />
                </a-form-item>
                <a-form-item label="境外单号">
                  <a-input v-model="q.overseasNo" size="small" allow-clear placeholder="请输入境外单号" />
                </a-form-item>
                <a-form-item label="柜号">
                  <a-input v-model="q.containerNo" size="small" allow-clear placeholder="请输入柜号" />
                </a-form-item>
                <a-form-item label="柜型柜量">
                  <a-select v-model="q.containerType" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
              </div>
            </div>

            <!-- 订单属性 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">订单属性</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="进/出口单">
                  <a-select v-model="q.importExportType" size="small" allow-clear placeholder="请选择进/出口单类型">
                    <a-option value="import">进口</a-option>
                    <a-option value="export">出口</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="业务类型">
                  <a-select v-model="q.bizType" size="small" allow-clear placeholder="请选择业务类型" />
                </a-form-item>
                <a-form-item label="订单状态">
                  <a-select v-model="q.orderStatus" size="small" allow-clear placeholder="请选择订单状态" />
                </a-form-item>
                <a-form-item label="报关方式">
                  <a-select v-model="q.customsMethod" size="small" allow-clear placeholder="请选择报关方式" />
                </a-form-item>
                <a-form-item label="装箱方式">
                  <a-select v-model="q.packingType" size="small" allow-clear placeholder="请选择装箱方式" />
                </a-form-item>
                <a-form-item label="货物类型">
                  <a-select v-model="q.cargoType" size="small" allow-clear placeholder="请选择货物类型" />
                </a-form-item>
                <a-form-item label="品名">
                  <a-input v-model="q.cargoName" size="small" allow-clear placeholder="请输入品名" />
                </a-form-item>
                <a-form-item label="操作备注">
                  <a-input v-model="q.operationRemark" size="small" allow-clear placeholder="请输入操作备注" />
                </a-form-item>
                <a-form-item label="提单内容">
                  <a-input v-model="q.bookingContent" size="small" allow-clear placeholder="请输入提单内容" />
                </a-form-item>
              </div>
            </div>

            <!-- 财务与客户属性 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">财务与客户属性</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="费用项目">
                  <div style="display:flex;gap:4px">
                    <a-select v-model="q.feeItem" size="small" allow-clear placeholder="选择费用项目" style="flex:1" />
                    <a-button size="small" type="text" class="reset-btn">排除</a-button>
                  </div>
                </a-form-item>
                <a-form-item label="金额区间">
                  <div style="display:flex;gap:4px;align-items:center">
                    <a-input v-model="q.amountMin" size="small" placeholder="min" />
                    <span style="flex-shrink:0;color:var(--color-text-3)">~</span>
                    <a-input v-model="q.amountMax" size="small" placeholder="max" />
                  </div>
                </a-form-item>
                <a-form-item label="税率">
                  <a-select v-model="q.taxRate" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="是否开票">
                  <a-select v-model="q.isInvoiced" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="是否税全">
                  <a-select v-model="q.isFullTax" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="国内收运费">
                  <a-select v-model="q.domesticFreight" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="代收付账单是否核完">
                  <a-select v-model="q.proxyBillDone" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="发票号">
                  <a-input v-model="q.invoiceNo" size="small" allow-clear placeholder="请输入" />
                </a-form-item>
                <a-form-item label="文件">
                  <a-input v-model="q.documentKeyword" size="small" allow-clear placeholder="请输入文件" />
                </a-form-item>
                <a-form-item label="订单归属公司">
                  <a-select v-model="q.orderOwnerCo" size="small" allow-clear placeholder="请选择订单归属公司" />
                </a-form-item>
                <a-form-item label="市场">
                  <a-select v-model="q.market" size="small" allow-clear placeholder="请选择市场" />
                </a-form-item>
                <a-form-item label="服务范围">
                  <a-select v-model="q.serviceScope" size="small" allow-clear placeholder="请选择服务范围" />
                </a-form-item>
                <a-form-item label="客户类型">
                  <a-select v-model="q.customerType" size="small" allow-clear placeholder="请选择客户类型" />
                </a-form-item>
                <a-form-item label="贸易条款">
                  <a-select v-model="q.tradeTerms" size="small" allow-clear placeholder="请选择条款" />
                </a-form-item>
                <a-form-item label="海运费是否已录入">
                  <a-select v-model="q.oceanFreightRecorded" size="small" allow-clear placeholder="请选择">
                    <a-option value="yes">是</a-option>
                    <a-option value="no">否</a-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>

            <!-- 业务标记 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">业务标记</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="无客服订单">
                  <a-checkbox v-model="q.noBookingOrder" size="small" />
                </a-form-item>
                <a-form-item label="不含继承单">
                  <a-checkbox v-model="q.noContinueOrder" size="small" />
                </a-form-item>
                <a-form-item label="入仓未核实">
                  <a-checkbox v-model="q.inboundUnsubmitted" size="small" />
                </a-form-item>
                <a-form-item label="最后一单(未回款)">
                  <a-checkbox v-model="q.lastShipmentNoReceipt" size="small" />
                </a-form-item>
                <a-form-item label="是否敏感货物">
                  <a-checkbox v-model="q.sensitiveCargo" size="small" />
                </a-form-item>
                <a-form-item label="是否甩柜">
                  <a-checkbox v-model="q.fullContainer" size="small" />
                </a-form-item>
                <a-form-item label="是否闪送柜">
                  <a-checkbox v-model="q.flashBox" size="small" />
                </a-form-item>
                <a-form-item label="是否同行">
                  <a-checkbox v-model="q.sameCarrier" size="small" />
                </a-form-item>
              </div>
            </div>

          </a-form>
        </div>
      </div>

      <template #footer>
        <div class="detail-drawer-footer">
          <div class="detail-drawer-footer__start">
            <a-button size="small" type="text" class="reset-btn" @click="handleDrawerClear">清空更多筛选</a-button>
          </div>
          <div class="detail-drawer-footer__end">
            <a-button size="small" @click="advancedFilterVisible = false">取消</a-button>
            <a-button size="small" type="primary" @click="handleDrawerApply">应用筛选</a-button>
          </div>
        </div>
      </template>
    </a-drawer>

  </div>
</template>

<style scoped>
.page-root--dense {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.table-card-cap__title {
  font-size: var(--dense-font-aux);
  font-weight: 500;
  color: var(--color-text-2);
  white-space: nowrap;
}
</style>
