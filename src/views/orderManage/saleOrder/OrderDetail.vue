<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IconEdit, IconPrinter, IconMore, IconPlus, IconDownload, IconEye
} from '@arco-design/web-vue/es/icon'

// ── Mock Order ──────────────────────────────────────────────────
const order = {
  no: 'OHL-20240615-001',
  status: 'op' as const,
  statusText: '订舱中',
  customer: '深圳华贸国际贸易有限公司',
  transport: '海运FCL',
  salesman: '张明',
  shipper: { company: 'ABC Electronics Ltd.', contact: 'John Smith', tel: '+852-2345-6789', addr: 'Block A, Kowloon Industrial, Hong Kong' },
  consignee: { company: 'Global Trade GmbH', contact: 'Hans Müller', tel: '+49-89-123456', addr: 'Industriestr. 12, Hamburg, Germany' },
  notify: { company: 'Same as Consignee', contact: 'Hans Müller', tel: '+49-89-123456', addr: '' },
  pol: '深圳 CNSZN', pod: '汉堡 DEHAM', blNo: 'COSU1234567890', terms: 'FOB',
  etd: '2024-07-10', eta: '2024-08-15', agent: '南海国际订舱代理', remark: '货物含液晶屏，注意轻放。',
  cargo: [
    { id:1, name:'液晶显示屏', hs:'8528720000', qty:500, unit:'台', pkg:'纸箱', gw:1250.00, nw:1100.00, cbm:8.50, mark:'N/M' },
    { id:2, name:'电源适配器', hs:'8504401900', qty:1000, unit:'个', pkg:'纸箱', gw:350.00, nw:310.00, cbm:3.20, mark:'N/M' },
    { id:3, name:'连接线缆', hs:'8544492900', qty:2000, unit:'条', pkg:'纸箱', gw:120.00, nw:100.00, cbm:1.80, mark:'N/M' },
  ],
  receivable: [
    { id:1, item:'海运费', currency:'USD', unitPrice:2800.00, qty:1, tax:0, amount:2800.00, invoiced:false },
    { id:2, item:'燃油附加费', currency:'USD', unitPrice:350.00, qty:1, tax:0, amount:350.00, invoiced:true },
    { id:3, item:'文件费', currency:'CNY', unitPrice:200.00, qty:1, tax:0.06, amount:200.00, invoiced:false },
  ],
  payable: [
    { id:1, item:'船公司运费', currency:'USD', unitPrice:2200.00, qty:1, tax:0, amount:2200.00, invoiced:true },
    { id:2, item:'港杂费', currency:'CNY', unitPrice:800.00, qty:1, tax:0.06, amount:800.00, invoiced:false },
  ],
  timeline: [
    { time:'2024-07-01 09:30', place:'深圳', op:'李婷', remark:'接单并确认', status:'done' },
    { time:'2024-07-03 14:20', place:'深圳', op:'张明', remark:'完成订舱，箱号待定', status:'done' },
    { time:'2024-07-08 10:00', place:'深圳盐田港', op:'系统', remark:'货物进仓，SI已发送', status:'done' },
    { time:'2024-07-10 18:00', place:'盐田港 CNSZN', op:'系统', remark:'预计开船', status:'current' },
    { time:'2024-08-15 08:00', place:'汉堡 DEHAM', op:'—', remark:'预计到港', status:'pending' },
  ],
  docs: [
    { id:1, name:'提单草稿 BL_DRAFT.pdf', type:'pdf', size:'245 KB', uploader:'李婷', uploadTime:'2024-07-04 10:30' },
    { id:2, name:'装箱单 Packing List.xlsx', type:'xlsx', size:'38 KB', uploader:'张明', uploadTime:'2024-07-05 14:00' },
    { id:3, name:'商业发票 Invoice.pdf', type:'pdf', size:'186 KB', uploader:'张明', uploadTime:'2024-07-05 14:05' },
    { id:4, name:'货物照片01.jpg', type:'img', size:'1.2 MB', uploader:'仓管', uploadTime:'2024-07-08 11:20' },
  ],
  logs: [
    { time:'2024-07-01 09:30', op:'李婷', type:'创建', content:'创建业务单 OHL-20240615-001' },
    { time:'2024-07-01 11:00', op:'王总', type:'确认', content:'审核通过，订单状态变更为"已确认"' },
    { time:'2024-07-03 14:20', op:'张明', type:'订舱', content:'完成订舱，状态变更为"订舱中"' },
    { time:'2024-07-05 14:05', op:'张明', type:'上传', content:'上传单据：商业发票、装箱单' },
  ],
}

const activeTab = ref('basic')
const currentStep = ref(2)

const cargoTotal = computed(() => ({
  qty: order.cargo.reduce((s, r) => s + r.qty, 0),
  gw: order.cargo.reduce((s, r) => s + r.gw, 0).toFixed(2),
  nw: order.cargo.reduce((s, r) => s + r.nw, 0).toFixed(2),
  cbm: order.cargo.reduce((s, r) => s + r.cbm, 0).toFixed(2),
}))
const recTotal = computed(() => order.receivable.reduce((s, r) => s + r.amount, 0).toFixed(2))
const payTotal = computed(() => order.payable.reduce((s, r) => s + r.amount, 0).toFixed(2))
const profit = computed(() => (Number(recTotal.value) - Number(payTotal.value)).toFixed(2))

// Confirm cancel
const cancelVisible = ref(false)
function fmtAmt(n: number) { return n.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }
</script>

<template>
  <div class="page-root page-root--dense odp-wrap">

    <!-- ── 页头 ─────────────────────────────────────────────── -->
    <div class="odp-head zone-card">
      <div class="odp-head__left">
        <a-breadcrumb :max-count="3" style="font-size:var(--dense-font-aux);margin-bottom:6px">
          <a-breadcrumb-item>下单模块</a-breadcrumb-item>
          <a-breadcrumb-item>业务单</a-breadcrumb-item>
          <a-breadcrumb-item>{{ order.no }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="odp-head__title-row">
          <span class="link-text link-text--strong mono odp-head__no">{{ order.no }}</span>
          <span class="s-pill" :data-s="order.status">{{ order.statusText }}</span>
        </div>
        <div class="odp-head__meta">
          <span>{{ order.customer }}</span>
          <span class="odp-sep">·</span>
          <span>{{ order.transport }}</span>
          <span class="odp-sep">·</span>
          <span>{{ order.salesman }}</span>
        </div>
      </div>
      <div class="odp-head__actions">
        <a-button size="small" type="text"><template #icon><icon-printer /></template></a-button>
        <a-button size="small" type="outline"><template #icon><icon-edit /></template>编辑</a-button>
        <a-button size="small" type="primary">确认订单</a-button>
        <a-dropdown trigger="click">
          <a-button size="small" type="outline"><icon-more /></a-button>
          <template #content>
            <a-doption>复制下单</a-doption>
            <a-doption class="danger-opt" @click="cancelVisible=true">取消订单</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- ── 流程步骤 ──────────────────────────────────────────── -->
    <div class="detail-section odp-steps-card">
      <div class="detail-section__body">
        <a-steps :current="currentStep" size="small">
          <a-step title="待确认" />
          <a-step title="已确认" />
          <a-step title="订舱中" />
          <a-step title="已开船" />
          <a-step title="到港" />
          <a-step title="已清关" />
          <a-step title="已签收" />
        </a-steps>
      </div>
    </div>

    <!-- ── Tab 内容区 ────────────────────────────────────────── -->
    <div class="odp-tabs-card zone-card">
      <a-tabs v-model:active-key="activeTab" size="small" class="odp-tabs">

        <!-- Tab 1 基本信息 -->
        <a-tab-pane key="basic" title="基本信息">
          <div class="odp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">发货方信息</h4>
              </div>
              <div class="detail-section__body">
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <span class="detail-field__label">公司名称</span>
                    <span class="detail-field__val">{{ order.shipper.company }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">联系人</span>
                    <span class="detail-field__val">{{ order.shipper.contact }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">联系电话</span>
                    <span class="detail-field__val mono">{{ order.shipper.tel }}</span>
                  </div>
                  <div class="detail-field detail-field--wide">
                    <span class="detail-field__label">地址</span>
                    <span class="detail-field__val">{{ order.shipper.addr }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">收货方信息</h4>
              </div>
              <div class="detail-section__body">
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <span class="detail-field__label">公司名称</span>
                    <span class="detail-field__val">{{ order.consignee.company }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">联系人</span>
                    <span class="detail-field__val">{{ order.consignee.contact }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">联系电话</span>
                    <span class="detail-field__val mono">{{ order.consignee.tel }}</span>
                  </div>
                  <div class="detail-field detail-field--wide">
                    <span class="detail-field__label">地址</span>
                    <span class="detail-field__val">{{ order.consignee.addr }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">运输信息</h4>
              </div>
              <div class="detail-section__body">
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <span class="detail-field__label">起运港</span>
                    <span class="detail-field__val mono">{{ order.pol }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">目的港</span>
                    <span class="detail-field__val mono">{{ order.pod }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">提单号</span>
                    <span class="detail-field__val mono">{{ order.blNo }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">贸易条款</span>
                    <span class="detail-field__val">{{ order.terms }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">ETD</span>
                    <span class="detail-field__val mono">{{ order.etd }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">ETA</span>
                    <span class="detail-field__val mono">{{ order.eta }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">订舱代理</span>
                    <span class="detail-field__val">{{ order.agent }}</span>
                  </div>
                  <div class="detail-field detail-field--wide">
                    <span class="detail-field__label">备注</span>
                    <span class="detail-field__val">{{ order.remark }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tab 2 货物明细 -->
        <a-tab-pane key="cargo" title="货物明细">
          <div class="odp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">货物明细</h4>
              </div>
              <div class="detail-section__body" style="padding:0">
                <vxe-table border="none" size="small" :data="order.cargo"
                  :row-config="{ isHover:true, keyField:'id' }"
                  show-footer :footer-method="()=>[[null,'合计',null,cargoTotal.qty,null,cargoTotal.gw,cargoTotal.nw,cargoTotal.cbm,null]]">
                  <vxe-column type="seq" title="#" width="44" />
                  <vxe-column field="name" title="品名" min-width="160" />
                  <vxe-column field="hs" title="HS编码" width="120">
                    <template #default="{ row }"><span class="mono">{{ row.hs }}</span></template>
                  </vxe-column>
                  <vxe-column field="qty" title="件数" width="80" align="right" />
                  <vxe-column field="pkg" title="包装" width="80" />
                  <vxe-column field="gw" title="毛重(KG)" width="100" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ row.gw.toFixed(2) }}</span></template>
                  </vxe-column>
                  <vxe-column field="nw" title="净重(KG)" width="100" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ row.nw.toFixed(2) }}</span></template>
                  </vxe-column>
                  <vxe-column field="cbm" title="体积(CBM)" width="100" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ row.cbm.toFixed(2) }}</span></template>
                  </vxe-column>
                  <vxe-column field="mark" title="唛头" width="80" />
                </vxe-table>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tab 3 费用信息 -->
        <a-tab-pane key="fees" title="费用信息">
          <div class="odp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">应收费用</h4>
              </div>
              <div class="detail-section__body" style="padding:0">
                <vxe-table border="none" size="small" :data="order.receivable"
                  :row-config="{ isHover:true, keyField:'id' }">
                  <vxe-column field="item" title="费用项" min-width="120" />
                  <vxe-column field="currency" title="币种" width="72" />
                  <vxe-column field="unitPrice" title="单价" width="100" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ fmtAmt(row.unitPrice) }}</span></template>
                  </vxe-column>
                  <vxe-column field="qty" title="数量" width="72" align="right" />
                  <vxe-column field="tax" title="税率" width="72" align="right">
                    <template #default="{ row }">{{ row.tax ? (row.tax*100)+'%' : '—' }}</template>
                  </vxe-column>
                  <vxe-column field="amount" title="金额" width="110" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ fmtAmt(row.amount) }}</span></template>
                  </vxe-column>
                  <vxe-column field="invoiced" title="开票" width="88" align="center">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="row.invoiced ? 'acc' : 'draft'">{{ row.invoiced ? '已开票' : '未开票' }}</span>
                    </template>
                  </vxe-column>
                </vxe-table>
                <div class="fee-subtotal">应收小计：<span class="amt-val">USD {{ fmtAmt(Number(recTotal)) }}</span></div>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">应付费用</h4>
              </div>
              <div class="detail-section__body" style="padding:0">
                <vxe-table border="none" size="small" :data="order.payable"
                  :row-config="{ isHover:true, keyField:'id' }">
                  <vxe-column field="item" title="费用项" min-width="120" />
                  <vxe-column field="currency" title="币种" width="72" />
                  <vxe-column field="unitPrice" title="单价" width="100" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ fmtAmt(row.unitPrice) }}</span></template>
                  </vxe-column>
                  <vxe-column field="qty" title="数量" width="72" align="right" />
                  <vxe-column field="tax" title="税率" width="72" align="right">
                    <template #default="{ row }">{{ row.tax ? (row.tax*100)+'%' : '—' }}</template>
                  </vxe-column>
                  <vxe-column field="amount" title="金额" width="110" align="right">
                    <template #default="{ row }"><span class="amt-val">{{ fmtAmt(row.amount) }}</span></template>
                  </vxe-column>
                  <vxe-column field="invoiced" title="开票" width="88" align="center">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="row.invoiced ? 'acc' : 'draft'">{{ row.invoiced ? '已开票' : '未开票' }}</span>
                    </template>
                  </vxe-column>
                </vxe-table>
                <div class="fee-subtotal">应付小计：<span class="amt-val">USD {{ fmtAmt(Number(payTotal)) }}</span></div>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section__body">
                <div class="fee-profit-row">
                  <span class="fee-profit-label">预计利润（应收 - 应付）</span>
                  <span :class="Number(profit) >= 0 ? 'amt-val' : 'amt-neg'" class="fee-profit-val">
                    USD {{ fmtAmt(Number(profit)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tab 4 物流轨迹 -->
        <a-tab-pane key="tracking" title="物流轨迹">
          <div class="odp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">运输节点</h4>
              </div>
              <div class="detail-section__body">
                <a-timeline>
                  <a-timeline-item
                    v-for="(item, i) in order.timeline" :key="i"
                    :dot-color="item.status==='done' ? 'var(--success-6)' : item.status==='current' ? 'var(--primary-6)' : 'var(--color-border-2)'">
                    <div class="tl-item" :class="{ 'tl-item--current': item.status==='current', 'tl-item--pending': item.status==='pending' }">
                      <div class="tl-item__head">
                        <span class="tl-item__time mono">{{ item.time }}</span>
                        <span class="tl-item__place">{{ item.place }}</span>
                        <span v-if="item.status==='current'" class="s-pill" data-s="op">当前节点</span>
                      </div>
                      <div class="tl-item__remark">{{ item.remark }}</div>
                      <div class="tl-item__op">操作人：{{ item.op }}</div>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tab 5 单据附件 -->
        <a-tab-pane key="docs" title="单据附件">
          <div class="odp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">单据列表</h4>
                <div class="detail-section__actions">
                  <a-button size="small" type="outline"><template #icon><icon-plus /></template>上传单据</a-button>
                </div>
              </div>
              <div class="detail-section__body" style="padding:0">
                <vxe-table border="none" size="small" :data="order.docs"
                  :row-config="{ isHover:true, keyField:'id' }">
                  <vxe-column field="name" title="文件名" min-width="200">
                    <template #default="{ row }">
                      <div class="cell-two-line">
                        <span class="c2-main link-text">{{ row.name }}</span>
                        <span class="c2-sub">{{ row.size }}</span>
                      </div>
                    </template>
                  </vxe-column>
                  <vxe-column field="type" title="类型" width="72" align="center">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="row.type==='pdf' ? 'rej' : row.type==='img' ? 'acc' : 'draft'">
                        {{ row.type.toUpperCase() }}
                      </span>
                    </template>
                  </vxe-column>
                  <vxe-column field="uploader" title="上传人" width="88" />
                  <vxe-column field="uploadTime" title="上传时间" width="148">
                    <template #default="{ row }"><span class="date-val mono">{{ row.uploadTime }}</span></template>
                  </vxe-column>
                  <vxe-column title="操作" width="88" align="center" fixed="right">
                    <template #default>
                      <a-tooltip content="预览">
                        <a-button type="text" class="row-action-btn"><icon-eye /></a-button>
                      </a-tooltip>
                      <a-tooltip content="下载">
                        <a-button type="text" class="row-action-btn"><icon-download /></a-button>
                      </a-tooltip>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tab 6 操作日志 -->
        <a-tab-pane key="log" title="操作日志">
          <div class="odp-tab-body">
            <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">操作记录</h4>
              </div>
              <div class="detail-section__body">
                <a-timeline>
                  <a-timeline-item v-for="(log, i) in order.logs" :key="i" dot-color="var(--color-border-3)">
                    <div class="log-item">
                      <div class="log-item__head">
                        <span class="s-pill" data-s="draft">{{ log.type }}</span>
                        <span class="log-item__op">{{ log.op }}</span>
                        <span class="log-item__time mono">{{ log.time }}</span>
                      </div>
                      <div class="log-item__content">{{ log.content }}</div>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </div>
          </div>
        </a-tab-pane>

      </a-tabs>
    </div>

    <!-- ── 取消确认弹窗 ───────────────────────────────────────── -->
    <a-modal v-model:visible="cancelVisible" title="取消订单" :width="400">
      <div style="font-size:var(--dense-font-data);color:var(--color-text-1)">
        确定要取消订单 <strong class="mono">{{ order.no }}</strong> 吗？<br/>
        <span style="color:var(--danger-6);font-size:var(--dense-font-aux);margin-top:6px;display:block">
          此操作不可撤销，订单状态将变更为"已取消"。
        </span>
      </div>
      <template #footer>
        <a-button @click="cancelVisible=false">暂不取消</a-button>
        <a-button type="primary" status="danger" @click="cancelVisible=false">确认取消</a-button>
      </template>
    </a-modal>

  </div>
</template>

<style scoped>
.odp-wrap { overflow-y: auto; padding: 12px; gap: 8px; display: flex; flex-direction: column; }

/* 页头 */
.odp-head { display:flex; align-items:flex-start; justify-content:space-between; padding:14px 16px; }
.odp-head__title-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.odp-head__no { font-size:var(--dense-font-nav); }
.odp-head__meta { display:flex; align-items:center; gap:6px; font-size:var(--dense-font-aux); color:var(--color-text-3); }
.odp-head__actions { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.odp-sep { color:var(--color-border-2); }

/* Steps */
.odp-steps-card .detail-section__body { padding: 14px 20px; }

/* Tabs */
.odp-tabs-card { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; }
.odp-tab-body { display:flex; flex-direction:column; gap:8px; padding:12px; overflow-y:auto; }

/* Timeline */
.tl-item { padding-bottom:4px; }
.tl-item__head { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.tl-item__time { font-size:var(--dense-font-aux); color:var(--color-text-3); }
.tl-item__place { font-size:var(--dense-font-data); font-weight:500; color:var(--color-text-1); }
.tl-item__remark { font-size:var(--dense-font-data); color:var(--color-text-2); }
.tl-item__op { font-size:var(--dense-font-aux); color:var(--color-text-4); margin-top:2px; }
.tl-item--pending .tl-item__remark { color:var(--color-text-4); }

/* Log */
.log-item { padding-bottom:4px; }
.log-item__head { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
.log-item__op { font-size:var(--dense-font-data); font-weight:500; color:var(--color-text-1); }
.log-item__time { font-size:var(--dense-font-aux); color:var(--color-text-4); margin-left:auto; }
.log-item__content { font-size:var(--dense-font-aux); color:var(--color-text-3); }

/* Fee */
.fee-subtotal { padding:8px 16px; font-size:var(--dense-font-aux); color:var(--color-text-3); text-align:right; border-top:1px solid var(--color-border-1); }
.fee-subtotal .amt-val { font-size:var(--dense-font-data); font-weight:600; margin-left:6px; }
.fee-profit-row { display:flex; align-items:center; justify-content:flex-end; gap:12px; }
.fee-profit-label { font-size:var(--dense-font-aux); color:var(--color-text-3); }
.fee-profit-val { font-size:var(--dense-font-nav); font-weight:600; }
</style>