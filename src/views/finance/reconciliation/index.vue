<script setup lang="ts">
import { ref, computed } from 'vue'
import type { VxeTableInstance } from 'vxe-table'
import { IconSearch, IconRefresh, IconDownload, IconPlus, IconEye } from '@arco-design/web-vue/es/icon'

// ── Types ──────────────────────────────────────────────────────
interface ReconciliationRow {
  Id: number; BillNo: string; Partner: string; Type: 'receivable'|'payable'
  Period: string; TotalAmt: number; PaidAmt: number; UnpaidAmt: number
  Status: string; CreateTime: string
}
interface FeeDetail { Id: number; FeeType: string; Amount: number; OrderNo: string; Note: string }

// ── Mock Data ──────────────────────────────────────────────────
const allRows: ReconciliationRow[] = [
  { Id:1,  BillNo:'RC-2024060001', Partner:'深圳华贸有限公司',     Type:'receivable', Period:'2024-06', TotalAmt:85000,  PaidAmt:85000,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-01' },
  { Id:2,  BillNo:'RC-2024060002', Partner:'上海通运物流',         Type:'payable',    Period:'2024-06', TotalAmt:42000,  PaidAmt:20000,  UnpaidAmt:22000,  Status:'partial',  CreateTime:'2024-06-02' },
  { Id:3,  BillNo:'RC-2024060003', Partner:'广州跨境电商',         Type:'receivable', Period:'2024-06', TotalAmt:123500, PaidAmt:0,      UnpaidAmt:123500, Status:'pending',  CreateTime:'2024-06-03' },
  { Id:4,  BillNo:'RC-2024060004', Partner:'宁波速运集团',         Type:'receivable', Period:'2024-06', TotalAmt:67800,  PaidAmt:67800,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-04' },
  { Id:5,  BillNo:'RC-2024060005', Partner:'青岛海通国际',         Type:'payable',    Period:'2024-06', TotalAmt:35000,  PaidAmt:35000,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-05' },
  { Id:6,  BillNo:'RC-2024060006', Partner:'厦门汇丰货运',         Type:'receivable', Period:'2024-06', TotalAmt:-8500,  PaidAmt:0,      UnpaidAmt:-8500,  Status:'pending',  CreateTime:'2024-06-06' },
  { Id:7,  BillNo:'RC-2024060007', Partner:'天津国货代理',         Type:'payable',    Period:'2024-06', TotalAmt:58000,  PaidAmt:30000,  UnpaidAmt:28000,  Status:'partial',  CreateTime:'2024-06-07' },
  { Id:8,  BillNo:'RC-2024060008', Partner:'大连港运公司',         Type:'receivable', Period:'2024-06', TotalAmt:92300,  PaidAmt:92300,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-08' },
  { Id:9,  BillNo:'RC-2024060009', Partner:'成都西货物流',         Type:'receivable', Period:'2024-05', TotalAmt:44000,  PaidAmt:0,      UnpaidAmt:44000,  Status:'overdue',  CreateTime:'2024-05-31' },
  { Id:10, BillNo:'RC-2024060010', Partner:'重庆通程国际',         Type:'payable',    Period:'2024-05', TotalAmt:29000,  PaidAmt:29000,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-05-28' },
  { Id:11, BillNo:'RC-2024060011', Partner:'武汉中远货代',         Type:'receivable', Period:'2024-06', TotalAmt:76500,  PaidAmt:50000,  UnpaidAmt:26500,  Status:'partial',  CreateTime:'2024-06-10' },
  { Id:12, BillNo:'RC-2024060012', Partner:'郑州航空货运',         Type:'receivable', Period:'2024-06', TotalAmt:31200,  PaidAmt:31200,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-12' },
  { Id:13, BillNo:'RC-2024060013', Partner:'南京跨境仓',           Type:'payable',    Period:'2024-06', TotalAmt:18000,  PaidAmt:0,      UnpaidAmt:18000,  Status:'pending',  CreateTime:'2024-06-13' },
  { Id:14, BillNo:'RC-2024060014', Partner:'合肥空运中转',         Type:'receivable', Period:'2024-06', TotalAmt:-12000, PaidAmt:0,      UnpaidAmt:-12000, Status:'pending',  CreateTime:'2024-06-14' },
  { Id:15, BillNo:'RC-2024060015', Partner:'杭州电商物流',         Type:'receivable', Period:'2024-06', TotalAmt:56700,  PaidAmt:56700,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-15' },
  { Id:16, BillNo:'RC-2024060016', Partner:'苏州工业区货代',       Type:'payable',    Period:'2024-06', TotalAmt:38400,  PaidAmt:20000,  UnpaidAmt:18400,  Status:'partial',  CreateTime:'2024-06-16' },
  { Id:17, BillNo:'RC-2024060017', Partner:'无锡铁路货运',         Type:'payable',    Period:'2024-06', TotalAmt:25000,  PaidAmt:25000,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-17' },
  { Id:18, BillNo:'RC-2024060018', Partner:'温州出口货代',         Type:'receivable', Period:'2024-06', TotalAmt:65000,  PaidAmt:0,      UnpaidAmt:65000,  Status:'overdue',  CreateTime:'2024-05-25' },
  { Id:19, BillNo:'RC-2024060019', Partner:'佛山集装箱服务',       Type:'receivable', Period:'2024-06', TotalAmt:43200,  PaidAmt:43200,  UnpaidAmt:0,      Status:'settled',  CreateTime:'2024-06-19' },
  { Id:20, BillNo:'RC-2024060020', Partner:'东莞跨境电商仓',       Type:'payable',    Period:'2024-06', TotalAmt:19800,  PaidAmt:10000,  UnpaidAmt:9800,   Status:'partial',  CreateTime:'2024-06-20' },
]

const mockFeeDetails: FeeDetail[] = [
  { Id:1, FeeType:'海运运费', Amount:48000, OrderNo:'SO2024001', Note:'' },
  { Id:2, FeeType:'目的港费用', Amount:12000, OrderNo:'SO2024001', Note:'THC+B/L' },
  { Id:3, FeeType:'报关费', Amount:3000, OrderNo:'SO2024002', Note:'' },
  { Id:4, FeeType:'装卸费', Amount:5000, OrderNo:'SO2024002', Note:'' },
  { Id:5, FeeType:'文件费', Amount:500, OrderNo:'SO2024003', Note:'' },
  { Id:6, FeeType:'保险费', Amount:1800, OrderNo:'SO2024003', Note:'' },
  { Id:7, FeeType:'代理费', Amount:2000, OrderNo:'SO2024004', Note:'' },
  { Id:8, FeeType:'仓储费', Amount:3200, OrderNo:'SO2024004', Note:'超期7天' },
]

// ── Query ──────────────────────────────────────────────────────
const query = ref({ billNo: '', partner: '', period: '', status: '' })
const statusOpts = [
  { label: '待结算', value: 'pending' },
  { label: '部分结算', value: 'partial' },
  { label: '已结清', value: 'settled' },
  { label: '已逾期', value: 'overdue' },
]

const filteredRows = computed(() => {
  let rows = allRows
  if (query.value.billNo) rows = rows.filter(r => r.BillNo.includes(query.value.billNo))
  if (query.value.partner) rows = rows.filter(r => r.Partner.includes(query.value.partner))
  if (query.value.period) rows = rows.filter(r => r.Period === query.value.period)
  if (query.value.status) rows = rows.filter(r => r.Status === query.value.status)
  return rows
})

// ── Summary ────────────────────────────────────────────────────
const summary = computed(() => ({
  totalAmt: filteredRows.value.reduce((s, r) => s + r.TotalAmt, 0),
  paidAmt: filteredRows.value.reduce((s, r) => s + r.PaidAmt, 0),
  unpaidAmt: filteredRows.value.reduce((s, r) => s + r.UnpaidAmt, 0),
}))

// ── Status Pill ────────────────────────────────────────────────
const statusPillMap: Record<string, string> = { pending: 'wait', partial: 'partial', settled: 'acc', overdue: 'rej' }
const statusTextMap: Record<string, string> = { pending: '待结算', partial: '部分结算', settled: '已结清', overdue: '已逾期' }

// ── Detail Drawer ──────────────────────────────────────────────
const detailVisible = ref(false)
const detailRow = ref<ReconciliationRow | null>(null)
const selectedFeeIds = ref<number[]>([])

function openDetail(row: ReconciliationRow) {
  detailRow.value = row
  selectedFeeIds.value = []
  detailVisible.value = true
}

// ── Invoice Modal ──────────────────────────────────────────────
const invoiceVisible = ref(false)
const invoiceForm = ref({ title: '', taxNo: '', type: 'special', taxRate: '13%' })

function openInvoice() {
  invoiceForm.value = { title: '', taxNo: '', type: 'special', taxRate: '13%' }
  invoiceVisible.value = true
}

function submitInvoice() {
  invoiceVisible.value = false
}

function fmtAmt(v: number) {
  const abs = Math.abs(v).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
  return v < 0 ? '-' + abs : abs
}

const tableRef = ref<VxeTableInstance>()

const periodOpts = [
  { label: '2024-06', value: '2024-06' },
  { label: '2024-05', value: '2024-05' },
  { label: '2024-04', value: '2024-04' },
]

function handleSearch() { /* filteredRows 是 computed，自动响应 query 变化 */ }
function handleReset() {
  query.value.billNo = ''
  query.value.partner = ''
  query.value.period = ''
  query.value.status = ''
}
</script>

<template>
  <div class="list-page">
    <!-- 搜索区：使用 global.css zone-l2-filter-card + filter-card 规范结构 -->
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__main">
        <div class="filter-card__fields">
          <div class="filter-card__body--basic">
            <div class="filter-grid">
              <div class="filter-field">
                <label class="filter-field__label">对账单号</label>
                <a-input v-model="query.billNo" size="small" placeholder="请输入单号" allow-clear @press-enter="handleSearch" />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">往来单位</label>
                <a-input v-model="query.partner" size="small" placeholder="请输入公司名称" allow-clear @press-enter="handleSearch" />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">账期</label>
                <a-select v-model="query.period" size="small" placeholder="请选择" :options="periodOpts" allow-clear @change="handleSearch" />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">状态</label>
                <a-select v-model="query.status" size="small" placeholder="请选择" :options="statusOpts" allow-clear @change="handleSearch" />
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

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <a-button size="small" type="primary"><template #icon><icon-plus /></template>新建对账单</a-button>
        <a-button size="small" type="outline"><template #icon><icon-download /></template>导出</a-button>
      </div>
      <div class="toolbar-right">
        <a-button size="small" type="text" @click="tableRef?.recalculate()"><template #icon><icon-refresh /></template></a-button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <vxe-table ref="tableRef" border="none" size="small" height="100%"
        :data="filteredRows" :row-config="{ isHover: true, keyField: 'Id' }"
        :checkbox-config="{ highlight: true }"
        :scroll-x="{ enabled: true, gt: 0 }" show-overflow="title"
        :footer-data="[{ BillNo: '合计', TotalAmt: summary.totalAmt, PaidAmt: summary.paidAmt, UnpaidAmt: summary.unpaidAmt }]"
        show-footer>
        <vxe-column type="checkbox" width="44" fixed="left"/>
        <vxe-column type="seq" title="序号" width="52" fixed="left"/>
        <vxe-column field="BillNo" title="对账单号" width="148" fixed="left" sortable>
          <template #default="{ row }">
            <span class="link-text mono">{{ row.BillNo }}</span>
          </template>
        </vxe-column>
        <vxe-column field="Partner" title="往来单位" min-width="160">
          <template #default="{ row }">
            <span class="c-main">{{ row.Partner }}</span>
          </template>
        </vxe-column>
        <vxe-column field="Type" title="类型" width="88">
          <template #default="{ row }">
            <span class="s-pill" :data-s="row.Type === 'receivable' ? 'acc' : 'op'">
              {{ row.Type === 'receivable' ? '应收' : '应付' }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="Period" title="账期" width="88" sortable/>
        <vxe-column field="TotalAmt" title="应收付总额" width="120" sortable>
          <template #default="{ row }">
            <span :class="row.TotalAmt < 0 ? 'amt-neg' : 'amt-val'">{{ fmtAmt(row.TotalAmt) }}</span>
          </template>
          <template #footer="{ data }">
            <span class="foot-sum">{{ fmtAmt(data[0].TotalAmt) }}</span>
          </template>
        </vxe-column>
        <vxe-column field="PaidAmt" title="已收付" width="110">
          <template #default="{ row }">
            <span class="amt-val">{{ fmtAmt(row.PaidAmt) }}</span>
          </template>
          <template #footer="{ data }">
            <span class="foot-sum">{{ fmtAmt(data[0].PaidAmt) }}</span>
          </template>
        </vxe-column>
        <vxe-column field="UnpaidAmt" title="未收付" width="110">
          <template #default="{ row }">
            <span :class="row.UnpaidAmt < 0 ? 'amt-neg' : row.UnpaidAmt > 0 ? 'amt-unpaid' : 'amt-zero'">{{ fmtAmt(row.UnpaidAmt) }}</span>
          </template>
          <template #footer="{ data }">
            <span class="foot-sum unpaid">{{ fmtAmt(data[0].UnpaidAmt) }}</span>
          </template>
        </vxe-column>
        <vxe-column field="Status" title="状态" width="96">
          <template #default="{ row }">
            <span class="s-pill" :data-s="statusPillMap[row.Status]">{{ statusTextMap[row.Status] }}</span>
          </template>
        </vxe-column>
        <vxe-column field="CreateTime" title="创建时间" width="110" sortable/>
        <vxe-column title="操作" width="80" fixed="right">
          <template #default="{ row }">
            <a-tooltip content="查看明细">
              <button class="row-action-btn" @click="openDetail(row)"><icon-eye style="font-size:13px"/></button>
            </a-tooltip>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <!-- Detail Drawer -->
    <a-drawer class="detail-drawer" v-model:visible="detailVisible" :title="detailRow ? `对账明细 · ${detailRow.BillNo}` : '对账明细'" :width="560" :footer="false">
      <div v-if="detailRow" class="detail-drawer-body">

        <!-- 状态栏：单号 + 状态 pill + 关键副信息 -->
        <div class="detail-drawer-status">
          <span class="detail-drawer-status__no mono">{{ detailRow.BillNo }}</span>
          <span class="s-pill" :data-s="statusPillMap[detailRow.Status]">{{ statusTextMap[detailRow.Status] }}</span>
          <span class="s-pill" :data-s="detailRow.Type === 'receivable' ? 'acc' : 'op'">
            {{ detailRow.Type === 'receivable' ? '应收' : '应付' }}
          </span>
          <span class="detail-drawer-status__sub">{{ detailRow.Partner }}</span>
          <span class="detail-drawer-status__sub" style="margin-left:auto">账期 {{ detailRow.Period }}</span>
        </div>

        <!-- 可滚动内容区（灰底 + 间距） -->
        <div class="detail-drawer-scroll">

          <!-- 基本信息卡片 -->
          <div class="detail-section">
            <div class="detail-section__head">
              <h4 class="detail-section__title">基本信息</h4>
            </div>
            <div class="detail-section__body">
              <div class="detail-form-grid detail-form-grid--4">
                <div class="detail-field">
                  <span class="detail-field__label">往来单位</span>
                  <span class="detail-field__val">{{ detailRow.Partner }}</span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">账期</span>
                  <span class="detail-field__val mono">{{ detailRow.Period }}</span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">类型</span>
                  <span class="s-pill" :data-s="detailRow.Type === 'receivable' ? 'acc' : 'op'">
                    {{ detailRow.Type === 'receivable' ? '应收' : '应付' }}
                  </span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">状态</span>
                  <span class="s-pill" :data-s="statusPillMap[detailRow.Status]">{{ statusTextMap[detailRow.Status] }}</span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">应收付总额</span>
                  <span :class="detailRow.TotalAmt < 0 ? 'amt-neg' : 'amt-val'">{{ fmtAmt(detailRow.TotalAmt) }}</span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">已收付</span>
                  <span class="amt-val">{{ fmtAmt(detailRow.PaidAmt) }}</span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">未收付</span>
                  <span :class="detailRow.UnpaidAmt > 0 ? 'amt-unpaid' : detailRow.UnpaidAmt < 0 ? 'amt-neg' : 'amt-zero'">
                    {{ fmtAmt(detailRow.UnpaidAmt) }}
                  </span>
                </div>
                <div class="detail-field">
                  <span class="detail-field__label">创建时间</span>
                  <span class="detail-field__val mono">{{ detailRow.CreateTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 费用明细卡片 -->
          <div class="detail-section">
            <div class="detail-section__head">
              <h4 class="detail-section__title">费用明细</h4>
              <div class="detail-section__actions">
                <span class="sel-tip">已选 {{ selectedFeeIds.length }} 项</span>
                <a-button size="small" type="primary" :disabled="selectedFeeIds.length === 0" @click="openInvoice">批量开票</a-button>
              </div>
            </div>
            <table class="fee-table">
              <thead>
                <tr>
                  <th style="width:36px"><a-checkbox v-model="(selectedFeeIds as any)" :value="'all'" /></th>
                  <th>费用类型</th>
                  <th>关联订单</th>
                  <th style="text-align:right">金额(元)</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fee in mockFeeDetails" :key="fee.Id">
                  <td><a-checkbox :model-value="selectedFeeIds.includes(fee.Id)" @change="(v: boolean) => { if(v) selectedFeeIds.push(fee.Id); else selectedFeeIds.splice(selectedFeeIds.indexOf(fee.Id),1); }" /></td>
                  <td>{{ fee.FeeType }}</td>
                  <td><span class="link-text mono">{{ fee.OrderNo }}</span></td>
                  <td style="text-align:right" :class="fee.Amount < 0 ? 'amt-neg' : 'amt-val'">{{ fmtAmt(fee.Amount) }}</td>
                  <td class="fee-note">{{ fee.Note || '—' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="foot-label">合计</td>
                  <td style="text-align:right" class="amt-val foot-sum">{{ fmtAmt(mockFeeDetails.reduce((s,f) => s+f.Amount, 0)) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      </div>
    </a-drawer>

    <!-- Invoice Modal -->
    <a-modal v-model:visible="invoiceVisible" title="开票申请" width="440px" @ok="submitInvoice">
      <div class="inv-form">
        <div class="form-item">
          <div class="form-label">发票抬头 <span class="req">*</span></div>
          <a-input v-model="invoiceForm.title" size="small" placeholder="请填写公司全称"/>
        </div>
        <div class="form-item">
          <div class="form-label">税号</div>
          <a-input v-model="invoiceForm.taxNo" size="small" placeholder="纳税人识别号" class="mono"/>
        </div>
        <div class="form-item">
          <div class="form-label">发票类型 <span class="req">*</span></div>
          <a-radio-group v-model="invoiceForm.type" size="small">
            <a-radio value="special">增值税专用发票</a-radio>
            <a-radio value="ordinary">增值税普通发票</a-radio>
          </a-radio-group>
        </div>
        <div class="form-item">
          <div class="form-label">税率</div>
          <a-select v-model="invoiceForm.taxRate" size="small" style="width:120px" :options="[
            { label: '13%', value: '13%' }, { label: '9%', value: '9%' },
            { label: '6%', value: '6%' }, { label: '0%', value: '0%' },
          ]"/>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.list-page { display:flex; flex-direction:column; height:100%; background:var(--color-bg-card); }
.toolbar { display:flex; align-items:center; justify-content:space-between; padding:7px 16px; border-bottom:1px solid var(--color-border-1); flex-shrink:0; }
.toolbar-left { display:flex; align-items:center; gap:6px; }
.toolbar-right { display:flex; align-items:center; gap:4px; }
.table-wrap { flex:1; min-height:0; overflow:hidden; }

.amt-val { color:var(--color-text-1); font-size:var(--dense-font-data); font-weight:500; font-variant-numeric:tabular-nums; }
.amt-neg { color:var(--danger-6); font-size:var(--dense-font-data); font-weight:600; font-variant-numeric:tabular-nums; }
.amt-unpaid { color:var(--warning-6); font-size:var(--dense-font-data); font-weight:600; font-variant-numeric:tabular-nums; }
.amt-zero { color:var(--color-text-4); font-size:var(--dense-font-data); }
.foot-sum { font-size:var(--dense-font-data); font-weight:600; color:var(--color-text-1); }
.foot-sum.unpaid { color:var(--warning-6); }
.row-action-btn { width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--color-border-2); border-radius:4px; background:none; cursor:pointer; color:var(--color-text-2); }
.row-action-btn:hover { background:var(--color-fill-1); color:var(--primary-6); border-color:var(--primary-3); }

/* Detail Drawer — 使用 global.css 规范类，此处仅补充页面专属样式 */
.detail-field { display:flex; flex-direction:column; gap:var(--dense-gap-label); }
.detail-field__label { font-size:var(--dense-font-field); font-weight:var(--dense-weight-field); color:var(--color-text-3); }
.detail-field__val { font-size:var(--dense-font-data); font-weight:500; color:var(--color-text-1); }

.fee-table { width:100%; border-collapse:collapse; }
.fee-table th { font-size:var(--dense-font-title); font-weight:600; color:var(--color-text-2); background:var(--color-fill-1); padding:6px 10px; text-align:left; border-bottom:1px solid var(--color-border-2); }
.fee-table td { font-size:var(--dense-font-data); font-weight:500; color:var(--color-text-1); padding:7px 10px; border-bottom:1px solid var(--color-border-1); }
.fee-table tfoot td { background:var(--color-fill-1); border-top:1px solid var(--color-border-2); border-bottom:none; }
.fee-note { font-size:var(--dense-font-aux); color:var(--color-text-3); }
.foot-label { font-size:var(--dense-font-title); font-weight:600; color:var(--color-text-2); }
.sel-tip { font-size:var(--dense-font-aux); color:var(--color-text-3); }

/* Invoice Modal */
.inv-form { display:flex; flex-direction:column; gap:12px; }
.form-item { display:flex; flex-direction:column; gap:4px; }
.form-label { font-size:var(--dense-font-field); color:var(--color-text-2); font-weight:500; }
.req { color:var(--danger-6); margin-left:2px; }

/* 覆盖 Arco Drawer 默认 16px 标题 → F3 12px/600（§7.4）*/
.detail-drawer :deep(.arco-drawer-header-title) {
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  color: var(--color-text-1);
}
</style>