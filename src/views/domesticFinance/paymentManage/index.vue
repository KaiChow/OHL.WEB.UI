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
  manageCo: '',
  payType: '',
  billCoType: 'include',   // include | exclude
  billCo: '',
  writeOffStatus: '',
  currency: '',
  noType: 'orderNo',
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
  orderOwnerCo: '',
  soNo: '',
  pod: '',
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
    manageCo: '', payType: '', billCoType: 'include', billCo: '',
    writeOffStatus: '', currency: '', noType: 'orderNo', noKeyword: '',
    noSingle: false, noPrecise: false, writeOffNo: '',
    billNo: '', billNoPrecise: true,
    etdRange: [], etaRange: [], atdRange: [], ataRange: [],
    podTimeRange: [], c88TimeRange: [], systemDueDateRange: [],
    financialConfirmRange: [], actualDeliveryRange: [], submitTimeRange: [],
    salesman: '', customerService: '', operator: '',
    amountMin: '', amountMax: '', taxRate: '', feeItem: '', feeItemExclude: false,
    isInvoiced: '', isFullTax: '',
    companyType: '', bizType: '', orderOwnerCo: '', soNo: '', pod: '',
    containerNo: '', externalNo: '', invoiceNo: '',
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
    companyType: '', bizType: '', orderOwnerCo: '', soNo: '', pod: '',
    containerNo: '', externalNo: '', invoiceNo: '',
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

      <!-- 行2：主标识符检索 + 操作按钮 -->
      <div class="filter-card__slim-row">
        <div class="filter-field filter-field--span3">
          <label class="filter-field__label">单号检索</label>
          <div class="filter-combo arco-input-group">
            <a-select v-model="q.noType" size="small" class="filter-combo__select filter-combo--keyword">
              <a-option value="orderNo">订单编号</a-option>
              <a-option value="billNo">账单编号</a-option>
              <a-option value="writeOffNo">核销编号</a-option>
              <a-option value="hbl">HBL NO</a-option>
              <a-option value="mbl">MBL NO</a-option>
              <a-option value="preCode">预核销码</a-option>
            </a-select>
            <a-input v-model="q.noKeyword" size="small" allow-clear placeholder="多个请用空格分隔" />
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
          <span v-if="selectedRows.length" class="toolbar-selected-tip">已选 {{ selectedRows.length }} 条</span>
          <a-pagination
            v-model:current="page"
            v-model:page-size="pageSize"
            :total="total"
            size="small"
            class="toolbar-pager"
            show-total
            show-page-size
            :page-size-options="[50, 100, 200]"
          />
          <a-tooltip content="刷新">
            <a-button size="small" type="text" @click="handleSearch">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="列设置">
            <a-button size="small" type="text" @click="xTable?.openCustom()">
              <template #icon><icon-settings /></template>
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
    <div class="zone-l4-table-card" style="flex:1;min-height:0;display:flex;flex-direction:column">
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
          <vxe-column field="seq" title="序号" width="52" fixed="left" align="center">
            <template #default="{ rowIndex }">{{ page > 1 ? (page - 1) * pageSize + rowIndex + 1 : rowIndex + 1 }}</template>
          </vxe-column>
          <vxe-column field="unWrittenOff" title="未核销金额" width="100" align="right" />
          <vxe-column field="type" title="类型" width="60">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.type === '应收' ? 'op' : 'wait'">{{ row.type }}</span>
            </template>
          </vxe-column>
          <vxe-column field="inboundNo" title="入仓编号" width="100" />
          <vxe-column field="billNo" title="账单编号" width="140">
            <template #default="{ row }">
              <a class="link-primary">{{ row.billNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="billCompany" title="账单公司" min-width="140" />
          <vxe-column field="currency" title="币种" width="60" />
          <vxe-column field="amount" title="金额" width="90" align="right" />
          <vxe-column field="preWriteOff" title="预核销" width="80" align="right" />
          <vxe-column field="actualWriteOff" title="实际核销" width="90" align="right" />
          <vxe-column field="taxRate" title="税率" width="60" align="right" />
          <vxe-column field="taxAmount" title="税额" width="70" align="right" />
          <vxe-column field="mbl" title="MBL" width="140" />
          <vxe-column field="orderNo" title="订单号" width="140">
            <template #default="{ row }">
              <a class="link-primary">{{ row.orderNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="etd" title="ETD" width="90" />
          <vxe-column field="eta" title="ETA" width="90" />
          <vxe-column field="atd" title="ATD" width="90" />
          <vxe-column field="ata" title="ATA" width="90" />
          <vxe-column field="podTime" title="POD时间" width="90" />
          <vxe-column field="podStatus" title="POD状态" width="80">
            <template #default="{ row }">
              <span v-if="row.podStatus" class="s-pill" data-s="wait">{{ row.podStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="c88" title="C88" width="90" />
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
    <div class="zone-l4-table-card" style="flex:0 0 260px;display:flex;flex-direction:column">
      <div class="table-card-cap">
        <div class="table-card-cap__start" style="display:flex;align-items:center;gap:4px">
          <span class="table-card-cap__title">待核销账单：</span>
          <a-button size="small" type="primary" @click="handleWriteOffSubmit">核销</a-button>
          <a-button size="small" type="outline">预核销</a-button>
          <a-button size="small" type="outline">预核销销账</a-button>
          <a-button size="small" type="outline">待核销账单一键对冲</a-button>
          <a-button size="small" type="outline">标记环整</a-button>
          <a-button size="small" type="outline">
            <template #icon><icon-upload /></template>导入
          </a-button>
          <a-button size="small" type="outline" status="danger" @click="handleSubRemoveBatch">
            批量移除
          </a-button>
          <a-button size="small" type="outline">未分配利润</a-button>
          <a-tooltip content="刷新">
            <a-button size="small" type="text" @click="handleSubRefresh">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <a-button size="small" type="text" status="danger" @click="handleReleasePre">释放预选记录</a-button>
        </div>
        <div class="table-card-cap__end">
          <a-tooltip content="列设置">
            <a-button size="small" type="text" @click="xSubTable?.openCustom()">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
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
          <vxe-column field="no" title="No" width="52" fixed="left" align="center" />
          <vxe-column field="type" title="类型" width="60">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.type === '应收' ? 'op' : 'wait'">{{ row.type }}</span>
            </template>
          </vxe-column>
          <vxe-column field="billNo" title="账单编号" width="140">
            <template #default="{ row }">
              <a class="link-primary">{{ row.billNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="billCompany" title="账单公司" min-width="130" />
          <vxe-column field="currency" title="币种" width="60" />
          <vxe-column field="selectedAmount" title="选择金额" width="90" align="right" />
          <vxe-column field="writeOffStatus" title="核销状态" width="80">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.writeOffStatusKey">{{ row.writeOffStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="etd" title="ETD" width="90" />
          <vxe-column field="eta" title="ETA" width="90" />
          <vxe-column field="hbl" title="HBL" width="120" />
          <vxe-column field="orderNo" title="订单编号" width="140" />
          <vxe-column field="ownerCompany" title="归属公司" width="120" />
          <vxe-column field="salesman" title="业务员" width="70" />
          <vxe-column field="operator" title="操作员" width="70" />
          <vxe-column field="fileCount" title="文件" width="60" align="center" />
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
      title="收付款筛选"
      :width="720"
      class="query-filter-drawer query-filter-drawer--grouped"
    >
      <div class="query-filter-drawer__shell">
        <div class="query-filter-drawer__body">
          <a-form class="detail-form" layout="vertical" size="small" :model="q">

            <!-- 账单编号 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">账单编号</div>
              <div class="detail-form-grid detail-form-grid--2">
                <a-form-item label="账单编号" style="grid-column:span 2">
                  <div style="display:flex;gap:8px;align-items:center">
                    <a-input v-model="q.billNo" size="small" allow-clear placeholder="多个请用英文分号分隔" style="flex:1" />
                    <a-checkbox v-model="q.billNoPrecise" size="small">精准查询</a-checkbox>
                  </div>
                </a-form-item>
              </div>
            </div>

            <!-- 账单时间 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">账单时间</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="ETD">
                  <a-range-picker v-model="q.etdRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ETA">
                  <a-range-picker v-model="q.etaRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ATD">
                  <a-range-picker v-model="q.atdRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="ATA">
                  <a-range-picker v-model="q.ataRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="POD时间">
                  <a-range-picker v-model="q.podTimeRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="C88时间">
                  <a-range-picker v-model="q.c88TimeRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="System Due Date">
                  <a-range-picker v-model="q.systemDueDateRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="提交时间">
                  <a-range-picker v-model="q.submitTimeRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="财务确认时间">
                  <a-range-picker v-model="q.financialConfirmRange" size="small" style="width:100%" />
                </a-form-item>
                <a-form-item label="实际派送时间">
                  <a-range-picker v-model="q.actualDeliveryRange" size="small" style="width:100%" />
                </a-form-item>
              </div>
            </div>

            <!-- 人员信息 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">人员信息</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="业务员">
                  <a-select v-model="q.salesman" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="客服">
                  <a-select v-model="q.customerService" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="操作员">
                  <a-select v-model="q.operator" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="运营">
                  <a-select v-model="q.operations" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="排除操作">
                  <a-select v-model="q.excludeOp" size="small" allow-clear placeholder="关联数据" />
                </a-form-item>
              </div>
            </div>

            <!-- 财务信息 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">财务信息</div>
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
                <a-form-item label="国内收收运费">
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
              </div>
            </div>

            <!-- 订单信息 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">订单信息</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="公司类型">
                  <a-select v-model="q.companyType" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="业务类型">
                  <a-select v-model="q.bizType" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="订单归属公司">
                  <a-select v-model="q.orderOwnerCo" size="small" allow-clear placeholder="请选择订单归属公司" />
                </a-form-item>
                <a-form-item label="SO NO">
                  <a-input v-model="q.soNo" size="small" allow-clear placeholder="请输入" />
                </a-form-item>
                <a-form-item label="目的港">
                  <a-select v-model="q.pod" size="small" allow-clear placeholder="请选择目的港" />
                </a-form-item>
                <a-form-item label="柜号">
                  <a-input v-model="q.containerNo" size="small" allow-clear placeholder="请输入" />
                </a-form-item>
                <a-form-item label="墙外单号">
                  <a-input v-model="q.externalNo" size="small" allow-clear placeholder="请输入" />
                </a-form-item>
              </div>
            </div>

            <!-- 系统信息 -->
            <div class="query-filter-drawer__group">
              <div class="query-filter-drawer__group-head">系统信息</div>
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item label="账号归属部门">
                  <a-select v-model="q.billDept" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="POD状态">
                  <a-select v-model="q.podStatus" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
                <a-form-item label="预核销码">
                  <a-input v-model="q.preWriteOffCode" size="small" allow-clear placeholder="请输入" />
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
