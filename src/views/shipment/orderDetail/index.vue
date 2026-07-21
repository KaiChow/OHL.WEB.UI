<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconDown, IconLeft, IconPlus, IconPrinter } from '@arco-design/web-vue/es/icon';
import OrderInfoTab from './components/OrderInfoTab.vue';
import { getShipmentOrderMock } from './mockData';
import type { ShipmentOrderDetailRecord } from './types';

const route = useRoute();
const router = useRouter();
const DETAIL_TABS = ['overview', 'execution', 'files', 'fees', 'control', 'collaboration'];
const activeTab = ref(
  typeof route.query.tab === 'string' && DETAIL_TABS.includes(route.query.tab)
    ? route.query.tab
    : 'overview',
);
const submitting = ref(false);
const statusModalVisible = ref(false);
const statusForm = reactive({ targetStatus: undefined as string | undefined, reason: '', notify: true, createNode: true });
const statusErrors = reactive({ targetStatus: '', reason: '' });
const executionForm = reactive({
  truckSupplier: '',
  loadingAddress: '',
  loadingTime: '',
  truckStatus: undefined as string | undefined,
  plateNo: '',
  customsMode: undefined as string | undefined,
  customsBroker: '',
  customsNo: '',
  customsStatus: undefined as string | undefined,
  hbl: '',
  mbl: '',
  blType: undefined as string | undefined,
  blConfirmStatus: undefined as string | undefined,
});
const communicationForm = reactive({ target: '', channel: undefined as string | undefined, customerVisible: false, content: '' });
const communicationError = ref('');

const loadRecord = (orderNo?: string) =>
  JSON.parse(JSON.stringify(getShipmentOrderMock(orderNo))) as ShipmentOrderDetailRecord;

const form = reactive<ShipmentOrderDetailRecord>(loadRecord(
  typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined,
));

const milestoneItems = computed(() => form.nodes.slice(0, 5));
const currentMilestoneIndex = computed(() => {
  const pendingIndex = milestoneItems.value.findIndex((item) => item.statusKey !== 'rel');
  return pendingIndex < 0 ? milestoneItems.value.length : pendingIndex + 1;
});
const fileMissingCount = computed(() => form.files.filter((item) => item.statusKey === 'rej').length);
const pendingFileConfirmCount = computed(() => form.files.filter((item) => item.statusKey === 'wait').length);
const pendingRiskCount = computed(() => form.risks.filter((item) => item.status !== '已关闭').length);
const pendingTodoCount = computed(() => form.todos.filter((item) => item.status !== '已完成').length);
const feePendingCount = computed(() => form.receivableFees.filter((item) => item.statusKey === 'wait').length + form.payableFees.filter((item) => item.statusKey === 'wait').length);
const currentNode = computed(() => form.nodes.find((item) => item.statusKey !== 'rel') ?? form.nodes[form.nodes.length - 1]);
const fileStatusSummary = computed(() => fileMissingCount.value > 0 ? `缺 ${fileMissingCount.value} 份` : pendingFileConfirmCount.value ? `${pendingFileConfirmCount.value} 份待确认` : '已齐套');
const riskSummary = computed(() => pendingRiskCount.value > 0 ? `${pendingRiskCount.value} 项待处理` : '无阻塞');
const feeStatusSummary = computed(() => feePendingCount.value > 0 ? `${feePendingCount.value} 项待确认` : '已确认');
const nextActionSummary = computed(() => currentNode.value?.name ?? '当前无待推进节点');
const requiredFileCount = computed(() => form.files.filter((item) => item.required).length);
const completedNodeCount = computed(() => form.nodes.filter((item) => item.statusKey === 'rel').length);
const openExceptionCount = computed(() => form.exceptions.filter((item) => item.statusKey !== 'rel').length);
const profitTone = computed(() => {
  if (form.profitStatusKey === 'acc' || form.profitStatusKey === 'rel') return 'rel';
  if (form.profitStatusKey === 'op') return 'op';
  return 'wait';
});

watch(
  () => route.query.orderNo,
  (orderNo) => Object.assign(form, loadRecord(typeof orderNo === 'string' ? orderNo : undefined)),
);

watch(
  () => route.query.tab,
  (tab) => {
    if (typeof tab === 'string' && DETAIL_TABS.includes(tab)) activeTab.value = tab;
  },
);

const goBack = () => router.push({ name: 'ShipmentOrderWorkbench' });

const handleSave = async () => {
  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 450));
  submitting.value = false;
  Message.success(`订单 ${form.orderNo} 已保存`);
};

const handleDiscard = () => {
  Object.assign(form, loadRecord(typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined));
  Message.info('已恢复为上次保存内容');
};

const handlePrint = () => window.print();

const openStatusModal = () => {
  statusForm.targetStatus = undefined;
  statusForm.reason = '';
  statusForm.notify = true;
  statusForm.createNode = true;
  statusErrors.targetStatus = '';
  statusErrors.reason = '';
  statusModalVisible.value = true;
};

const confirmStatusChange = () => {
  statusErrors.targetStatus = statusForm.targetStatus ? '' : '请选择目标状态';
  statusErrors.reason = statusForm.reason.trim() ? '' : '请填写修改原因';
  if (statusErrors.targetStatus || statusErrors.reason) return false;

  const statusLabelMap: Record<string, string> = {
    released: '已放舱',
    customs: '报关中',
    sailed: '已开船',
    completed: '已完成',
  };
  form.orderStatus = statusForm.targetStatus!;
  form.orderStatusLabel = statusLabelMap[statusForm.targetStatus!] ?? form.orderStatusLabel;
  Message.success(`订单状态已更新为${form.orderStatusLabel}`);
  statusModalVisible.value = false;
  return true;
};

const switchTab = (key: string) => {
  activeTab.value = key;
};

const handleGenerateFee = () => {
  switchTab('fees');
  Message.info('已定位到待确认费用');
};

const handleUploadFile = () => {
  switchTab('files');
  Message.info('已定位到文件资料');
};

const handleNotify = () => Message.success(`订单 ${form.orderNo} 的通知已发送（模拟）`);

const handleMarkException = () => {
  switchTab('control');
  addExceptionRow();
};

const handleCancelOrder = () => {
  form.orderStatus = 'cancelled';
  form.orderStatusLabel = '已作废';
  form.statusPill = 'rej';
  Message.success(`订单 ${form.orderNo} 已作废`);
};

const handleRisk = (risk: ShipmentOrderDetailRecord['risks'][number]) => {
  risk.status = '已关闭';
  Message.success(`风险“${risk.type}”已关闭`);
};

const handleAddCommunication = () => {
  communicationError.value = communicationForm.content.trim() ? '' : '请填写沟通内容';
  if (communicationError.value) return;
  form.logs.unshift({
    id: `log-${Date.now()}`,
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    operator: form.operator,
    module: '沟通',
    action: communicationForm.channel || '记录',
    before: '—',
    after: communicationForm.content.trim(),
    source: communicationForm.customerVisible ? '客户可见' : '内部',
  });
  communicationForm.target = '';
  communicationForm.channel = undefined;
  communicationForm.customerVisible = false;
  communicationForm.content = '';
  Message.success('沟通记录已保存');
};

const addReceivableRow = () => {
  form.receivableFees.push({
    id: `rf-${Date.now()}`,
    name: '',
    currency: 'CNY',
    unitPrice: 0,
    qty: 1,
    unit: '票',
    amount: 0,
    taxRate: 0,
    taxAmount: 0,
    party: form.customerName,
    status: '待确认',
    statusKey: 'wait',
  });
};

const addPayableRow = () => {
  form.payableFees.push({
    id: `pf-${Date.now()}`,
    name: '',
    currency: 'CNY',
    unitPrice: 0,
    qty: 1,
    unit: '票',
    amount: 0,
    taxRate: 0,
    taxAmount: 0,
    party: '',
    status: '待确认',
    statusKey: 'wait',
    paymentStatus: '未付款',
  });
};

const addNodeRow = () => {
  form.nodes.push({
    id: `n-${Date.now()}`,
    name: '',
    planTime: '',
    actualTime: '',
    status: '待完成',
    statusKey: 'wait',
    owner: form.operator,
    source: '手工',
    overdue: false,
  });
};

const addExceptionRow = () => {
  form.exceptions.push({
    id: `e-${Date.now()}`,
    no: `EX${Date.now()}`,
    type: '订舱异常',
    level: '中',
    levelKey: 'partial',
    description: '',
    department: '操作部',
    owner: form.operator,
    occurredAt: '',
    expectedResolveAt: '',
    status: '待处理',
    statusKey: 'wait',
  });
};
</script>

<template>
  <div class="shipment-detail-page">
    <a-card class="detail-context" size="small" :body-style="{ padding: 0 }">
      <header class="detail-context__command">
        <div class="detail-context__identity">
          <a-tooltip content="返回订单列表">
            <a-button size="small" type="text" class="detail-context__back" @click="goBack">
              <template #icon><icon-left /></template>
            </a-button>
          </a-tooltip>
          <div class="detail-context__title">
            <div>
              <strong class="mono">{{ form.orderNo }}</strong>
              <span class="s-pill" :data-s="form.statusPill">{{ form.orderStatusLabel }}</span>
            </div>
            <span>{{ form.customerName }} · {{ form.businessType }} · 操作 {{ form.operator }}</span>
          </div>
        </div>
        <a-space :size="6" class="detail-context__actions">
          <a-tooltip content="打印">
            <a-tooltip content="打印订单">
              <a-button size="small" type="text" title="打印订单" aria-label="打印订单" @click="handlePrint"><template #icon><icon-printer /></template></a-button>
            </a-tooltip>
          </a-tooltip>
          <a-button size="small" @click="openStatusModal">修改状态</a-button>
          <a-button size="small" @click="handleGenerateFee">生成费用</a-button>
          <a-button size="small" @click="handleUploadFile">补充文件</a-button>
          <a-dropdown trigger="click">
            <a-button size="small">更多<icon-down /></a-button>
            <template #content>
              <a-doption @click="handleNotify">发送通知</a-doption>
              <a-doption @click="handleMarkException">标记异常</a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </header>

      <div class="detail-context__overview">
        <div class="detail-route">
          <div class="detail-route__ports">
            <strong>{{ form.pol }}</strong>
            <span>→</span>
            <strong>{{ form.pod }}</strong>
          </div>
          <span>{{ form.carrier }} / {{ form.vessel }} {{ form.voyage }}</span>
        </div>

        <div class="detail-facts">
          <div><span>ETD / ETA</span><strong class="mono">{{ form.etd }} / {{ form.eta }}</strong></div>
          <div><span>截关时间</span><strong class="mono">{{ form.closingTime }}</strong></div>
          <div><span>柜型柜量</span><strong>{{ form.containerSummary }}</strong></div>
          <div><span>下一动作</span><strong class="detail-fact--primary">{{ nextActionSummary }}</strong></div>
        </div>

        <div class="detail-attention">
          <button type="button" :data-alert="fileMissingCount > 0" @click="switchTab('files')">
            <span>文件</span><strong>{{ fileStatusSummary }}</strong>
          </button>
          <button type="button" :data-alert="feePendingCount > 0" @click="switchTab('fees')">
            <span>费用</span><strong>{{ feeStatusSummary }}</strong>
          </button>
          <button type="button" :data-alert="pendingRiskCount > 0" @click="switchTab('control')">
            <span>风险</span><strong>{{ riskSummary }}</strong>
          </button>
        </div>
      </div>

      <div class="detail-progress">
        <a-steps :current="currentMilestoneIndex" size="small" label-placement="vertical">
          <a-step v-for="node in milestoneItems" :key="node.id" :title="node.name" :description="node.planTime.slice(5, 16)" />
        </a-steps>
      </div>
    </a-card>

    <a-card class="detail-work-surface" size="small" :body-style="{ padding: 0, height: '100%' }">
      <a-tabs v-model:active-key="activeTab" size="small" class="detail-work-tabs">
        <a-tab-pane key="overview" title="订单概览">
          <div class="detail-pane"><order-info-tab v-model:form="form" /></div>
        </a-tab-pane>

        <a-tab-pane key="execution" title="运输执行">
          <div class="detail-pane detail-pane--sections">
            <section class="detail-section-local">
              <header><div><strong>订舱与舱位</strong><span>船司、代理与关键截点</span></div><span class="s-pill" data-s="wait">{{ form.spaceStatus }}</span></header>
              <a-form :model="form" layout="vertical" size="small">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item field="bookingNo" label="订舱号"><a-input v-model="form.bookingNo" allow-clear placeholder="待船司回传" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="carrier" label="船公司"><a-input v-model="form.carrier" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="bookingAgent" label="订舱代理"><a-input v-model="form.bookingAgent" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="contractNo" label="合约号"><a-input v-model="form.contractNo" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="rateNo" label="运价编号"><a-input v-model="form.rateNo" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="spaceStatus" label="舱位状态"><a-input v-model="form.spaceStatus" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="releaseTime" label="放舱时间"><a-date-picker v-model="form.releaseTime" show-time style="width: 100%" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="vgmCutoff" label="截 VGM"><a-date-picker v-model="form.vgmCutoff" show-time style="width: 100%" /></a-form-item></a-col>
                  <a-col :span="24"><a-form-item field="bookingRemark" label="订舱备注"><a-textarea v-model="form.bookingRemark" :auto-size="{ minRows: 2, maxRows: 4 }" /></a-form-item></a-col>
                </a-row>
              </a-form>
            </section>

            <section class="detail-section-local">
              <header><div><strong>柜货与拖车</strong><span>装柜资源和现场执行</span></div><span>{{ form.containerSummary }}</span></header>
              <a-form :model="executionForm" layout="vertical" size="small">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item label="柜型柜量"><a-input v-model="form.containerSummary" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="拖车供应商"><a-input v-model="executionForm.truckSupplier" allow-clear placeholder="请选择供应商" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="装柜地址"><a-input v-model="executionForm.loadingAddress" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="装柜时间"><a-date-picker v-model="executionForm.loadingTime" show-time style="width: 100%" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="拖车状态"><a-select v-model="executionForm.truckStatus" placeholder="请选择"><a-option value="未安排">未安排</a-option><a-option value="已派车">已派车</a-option><a-option value="已到厂">已到厂</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="车牌号"><a-input v-model="executionForm.plateNo" allow-clear /></a-form-item></a-col>
                </a-row>
              </a-form>
            </section>

            <section class="detail-section-local">
              <header><div><strong>报关与提单</strong><span>申报、放行和提单确认</span></div><span>{{ form.bookingNo || '待回传订舱号' }}</span></header>
              <a-form :model="executionForm" layout="vertical" size="small">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item label="报关方式"><a-select v-model="executionForm.customsMode" placeholder="请选择"><a-option value="一般贸易">一般贸易</a-option><a-option value="跨境电商">跨境电商</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="报关行"><a-input v-model="executionForm.customsBroker" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="报关单号"><a-input v-model="executionForm.customsNo" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="报关状态"><a-select v-model="executionForm.customsStatus" placeholder="请选择"><a-option value="未提交">未提交</a-option><a-option value="已提交">已提交</a-option><a-option value="已放行">已放行</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="HBL"><a-input v-model="executionForm.hbl" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="MBL"><a-input v-model="executionForm.mbl" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="提单类型"><a-select v-model="executionForm.blType" placeholder="请选择"><a-option value="正本">正本</a-option><a-option value="电放">电放</a-option><a-option value="海运单">海运单</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="提单确认状态"><a-select v-model="executionForm.blConfirmStatus" placeholder="请选择"><a-option value="待确认">待确认</a-option><a-option value="已确认">已确认</a-option></a-select></a-form-item></a-col>
                </a-row>
              </a-form>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="files">
          <template #title><span class="detail-tab-title">文件资料 <b :data-alert="fileMissingCount > 0">{{ form.files.length }}</b></span></template>
          <div class="detail-pane">
            <section class="detail-section-local detail-section-local--table">
              <header><div><strong>文件清单</strong><span>必传 {{ requiredFileCount }} · 缺失 {{ fileMissingCount }} · 待确认 {{ pendingFileConfirmCount }}</span></div><a-button size="small" type="outline" @click="handleUploadFile"><template #icon><icon-plus /></template>添加文件</a-button></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--readonly" border="none" size="small" height="auto" :data="form.files" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="文件名" min-width="180" />
                <vxe-column field="category" title="分类" min-width="100" />
                <vxe-column field="uploader" title="上传人" min-width="80" />
                <vxe-column field="uploadedAt" title="上传时间" min-width="130" />
                <vxe-column field="status" title="状态" min-width="100"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
              </vxe-table>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="fees">
          <template #title><span class="detail-tab-title">费用结算 <b :data-alert="feePendingCount > 0">{{ feePendingCount }}</b></span></template>
          <div class="detail-pane detail-pane--sections">
            <div class="fee-summary-strip">
              <div><span>应收合计</span><strong>{{ form.feeSummary.receivableTotal.toLocaleString() }}</strong></div>
              <div><span>应付合计</span><strong>{{ form.feeSummary.payableTotal.toLocaleString() }}</strong></div>
              <div><span>毛利</span><strong>{{ form.feeSummary.grossProfit.toLocaleString() }}</strong></div>
              <div><span>毛利率</span><strong>{{ form.feeSummary.grossMargin }}%</strong></div>
              <div><span>利润状态</span><span class="s-pill" :data-s="profitTone">{{ form.profitStatus }}</span></div>
            </div>

            <section class="detail-section-local detail-section-local--table">
              <header><div><strong>应收费用</strong><span>{{ form.receivableFees.length }} 条 · 待确认 {{ form.receivableFees.filter((item) => item.statusKey === 'wait').length }}</span></div><a-button size="small" type="outline" @click="addReceivableRow"><template #icon><icon-plus /></template>新增应收</a-button></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.receivableFees" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="费用名称" min-width="110"><template #default="{ row }"><a-input v-model="row.name" size="small" /></template></vxe-column>
                <vxe-column field="currency" title="币种" min-width="72"><template #default="{ row }"><a-select v-model="row.currency" size="small"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select></template></vxe-column>
                <vxe-column field="amount" title="金额" min-width="100"><template #default="{ row }"><a-input-number v-model="row.amount" size="small" hide-button /></template></vxe-column>
                <vxe-column field="party" title="客户" min-width="140"><template #default="{ row }"><a-input v-model="row.party" size="small" /></template></vxe-column>
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
              </vxe-table>
            </section>

            <section class="detail-section-local detail-section-local--table">
              <header><div><strong>应付费用</strong><span>{{ form.payableFees.length }} 条 · 待确认 {{ form.payableFees.filter((item) => item.statusKey === 'wait').length }}</span></div><a-button size="small" type="outline" @click="addPayableRow"><template #icon><icon-plus /></template>新增应付</a-button></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.payableFees" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="费用名称" min-width="110"><template #default="{ row }"><a-input v-model="row.name" size="small" /></template></vxe-column>
                <vxe-column field="currency" title="币种" min-width="72"><template #default="{ row }"><a-select v-model="row.currency" size="small"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select></template></vxe-column>
                <vxe-column field="amount" title="金额" min-width="100"><template #default="{ row }"><a-input-number v-model="row.amount" size="small" hide-button /></template></vxe-column>
                <vxe-column field="party" title="供应商" min-width="140"><template #default="{ row }"><a-input v-model="row.party" size="small" /></template></vxe-column>
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
              </vxe-table>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="control">
          <template #title><span class="detail-tab-title">节点与异常 <b :data-alert="pendingRiskCount > 0">{{ pendingRiskCount }}</b></span></template>
          <div class="detail-pane detail-pane--sections">
            <section v-if="form.risks.length" class="detail-section-local">
              <header><div><strong>当前风险</strong><span>异常在原位置处理，不用全局提示替代</span></div><span>{{ pendingRiskCount }} 项待处理</span></header>
              <div class="detail-risk-list">
                <div v-for="risk in form.risks" :key="risk.id" class="detail-risk-row">
                  <span class="s-pill" :data-s="risk.status === '已关闭' ? 'rel' : risk.level === 'danger' ? 'rej' : 'wait'">{{ risk.status }}</span>
                  <div><strong>{{ risk.type }}</strong><span>{{ risk.message }}</span></div>
                  <div><span>{{ risk.owner }}</span><span class="mono">{{ risk.dueAt }}</span></div>
                  <a-button size="small" type="text" :disabled="risk.status === '已关闭'" @click="handleRisk(risk)">{{ risk.status === '已关闭' ? '已处理' : '处理' }}</a-button>
                </div>
              </div>
            </section>

            <section class="detail-section-local detail-section-local--table">
              <header><div><strong>物流节点</strong><span>已完成 {{ completedNodeCount }} · 待推进 {{ form.nodes.length - completedNodeCount }}</span></div><a-button size="small" type="outline" @click="addNodeRow"><template #icon><icon-plus /></template>新增节点</a-button></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.nodes" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="节点名称" min-width="110"><template #default="{ row }"><a-input v-model="row.name" size="small" /></template></vxe-column>
                <vxe-column field="planTime" title="计划时间" min-width="150"><template #default="{ row }"><a-date-picker v-model="row.planTime" size="small" show-time style="width: 100%" /></template></vxe-column>
                <vxe-column field="actualTime" title="实际时间" min-width="150"><template #default="{ row }"><a-date-picker v-model="row.actualTime" size="small" show-time style="width: 100%" /></template></vxe-column>
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
                <vxe-column field="owner" title="负责人" min-width="90" />
              </vxe-table>
            </section>

            <section class="detail-section-local detail-section-local--table">
              <header><div><strong>异常记录</strong><span>未关闭 {{ openExceptionCount }} 条</span></div><a-button size="small" type="outline" @click="addExceptionRow"><template #icon><icon-plus /></template>登记异常</a-button></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.exceptions" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="no" title="异常编号" min-width="130" />
                <vxe-column field="type" title="类型" min-width="110"><template #default="{ row }"><a-input v-model="row.type" size="small" /></template></vxe-column>
                <vxe-column field="level" title="等级" min-width="80"><template #default="{ row }"><span class="s-pill" :data-s="row.levelKey">{{ row.level }}</span></template></vxe-column>
                <vxe-column field="description" title="描述" min-width="180"><template #default="{ row }"><a-input v-model="row.description" size="small" /></template></vxe-column>
                <vxe-column field="owner" title="责任人" min-width="90" />
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
              </vxe-table>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="collaboration" title="沟通与日志">
          <div class="detail-pane detail-pane--sections">
            <section class="detail-section-local">
              <header><div><strong>新增沟通</strong><span>记录客户与协作方沟通结果</span></div><a-button size="small" type="primary" @click="handleAddCommunication">保存记录</a-button></header>
              <a-form :model="communicationForm" layout="vertical" size="small">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item label="沟通对象"><a-input v-model="communicationForm.target" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="沟通方式"><a-select v-model="communicationForm.channel" placeholder="请选择"><a-option value="电话">电话</a-option><a-option value="邮件">邮件</a-option><a-option value="微信">微信</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item label="客户可见"><a-switch v-model="communicationForm.customerVisible" size="small" /></a-form-item></a-col>
                  <a-col :span="24"><a-form-item label="沟通内容" :validate-status="communicationError ? 'error' : undefined" :help="communicationError"><a-textarea v-model="communicationForm.content" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="记录沟通内容" @input="communicationError = ''" /></a-form-item></a-col>
                </a-row>
              </a-form>
            </section>
            <section class="detail-section-local detail-section-local--table">
              <header><div><strong>操作日志</strong><span>关键变更保留前后值与来源</span></div></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--readonly" border="none" size="small" height="auto" :data="form.logs" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column field="time" title="操作时间" min-width="140" />
                <vxe-column field="operator" title="操作人" min-width="90" />
                <vxe-column field="module" title="模块" min-width="80" />
                <vxe-column field="action" title="操作类型" min-width="100" />
                <vxe-column field="before" title="变更前" min-width="100" />
                <vxe-column field="after" title="变更后" min-width="100" />
                <vxe-column field="source" title="来源" min-width="70" />
              </vxe-table>
            </section>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <footer class="detail-footer">
      <a-popconfirm content="确认作废该订单？此操作不可撤销。" @ok="handleCancelOrder">
        <a-button size="small" type="text" status="danger">作废订单</a-button>
      </a-popconfirm>
      <a-space :size="8">
        <a-button size="small" @click="handleNotify">发送通知</a-button>
        <a-button size="small" @click="handleDiscard">放弃修改</a-button>
        <a-button size="small" type="primary" :loading="submitting" @click="handleSave">保存订单</a-button>
      </a-space>
    </footer>

    <a-modal v-model:visible="statusModalVisible" title="修改订单状态" :width="560" :mask-closable="false" :on-before-ok="confirmStatusChange">
      <a-form :model="statusForm" layout="vertical" size="small">
        <a-row :gutter="[16, 8]">
          <a-col :span="12"><a-form-item label="当前状态"><span class="s-pill" :data-s="form.statusPill">{{ form.orderStatusLabel }}</span></a-form-item></a-col>
          <a-col :span="12">
            <a-form-item label="目标状态" required :validate-status="statusErrors.targetStatus ? 'error' : undefined" :help="statusErrors.targetStatus">
              <a-select v-model="statusForm.targetStatus" allow-clear placeholder="请选择" @change="statusErrors.targetStatus = ''">
                <a-option value="released">已放舱</a-option><a-option value="customs">报关中</a-option><a-option value="sailed">已开船</a-option><a-option value="completed">已完成</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="修改原因" required :validate-status="statusErrors.reason ? 'error' : undefined" :help="statusErrors.reason">
              <a-textarea v-model="statusForm.reason" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请填写修改原因" @input="statusErrors.reason = ''" />
            </a-form-item>
          </a-col>
          <a-col :span="12"><a-form-item hide-label><a-checkbox v-model="statusForm.notify">同步通知相关人员</a-checkbox></a-form-item></a-col>
          <a-col :span="12"><a-form-item hide-label><a-checkbox v-model="statusForm.createNode">生成节点记录</a-checkbox></a-form-item></a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.shipment-detail-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
}

.detail-context,
.detail-work-surface {
  border-color: var(--dense-card-border);
  border-radius: var(--dense-radius);
}

.detail-context {
  flex-shrink: 0;
}

.detail-context__command,
.detail-context__identity,
.detail-context__title > div,
.detail-context__overview,
.detail-section-local > header,
.detail-section-local > header > div,
.detail-tab-title,
.detail-footer {
  display: flex;
  align-items: center;
}

.detail-context__command {
  justify-content: space-between;
  gap: 16px;
  min-height: 48px;
  padding: 0 12px;
  border-bottom: 1px solid var(--color-border-1);
}

.detail-context__identity {
  gap: 8px;
  min-width: 0;
}

.detail-context__back {
  flex-shrink: 0;
}

.detail-context__title {
  min-width: 0;
}

.detail-context__title > div {
  gap: 8px;
}

.detail-context__title strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
}

.detail-context__title > span {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-context__actions {
  flex-shrink: 0;
}

.detail-context__overview {
  gap: 24px;
  min-height: 70px;
  padding: 10px 12px;
}

.detail-route {
  flex: 0 0 210px;
  min-width: 0;
}

.detail-route__ports {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-1);
  font-size: 16px;
  line-height: 22px;
}

.detail-route > span {
  display: block;
  margin-top: 3px;
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-facts {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  min-width: 0;
}

.detail-facts > div,
.fee-summary-strip > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.detail-facts span,
.fee-summary-strip span:not(.s-pill) {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.detail-facts strong,
.fee-summary-strip strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-variant-numeric: tabular-nums;
  font-weight: var(--dense-weight-title);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-fact--primary {
  color: var(--dense-primary-7) !important;
}

.detail-attention {
  display: grid;
  flex: 0 0 250px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--color-border-1);
  border-radius: var(--dense-radius);
  overflow: hidden;
}

.detail-attention button {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  padding: 6px 8px;
  border: 0;
  border-right: 1px solid var(--color-border-1);
  background: var(--color-bg-1);
  color: var(--color-text-3);
  cursor: pointer;
  text-align: left;
}

.detail-attention button:last-child {
  border-right: 0;
}

.detail-attention button:hover {
  background: var(--color-fill-1);
}

.detail-attention button span {
  font-size: var(--dense-font-micro);
}

.detail-attention button strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-aux);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-attention button[data-alert='true'] strong {
  color: var(--dense-warning-7);
}

.detail-progress {
  padding: 8px 16px 6px;
  border-top: 1px solid var(--color-border-1);
}

.detail-progress :deep(.arco-steps-item-title) {
  font-size: var(--dense-font-control);
}

.detail-progress :deep(.arco-steps-item-description) {
  font-size: var(--dense-font-micro);
}

.detail-work-surface {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.detail-work-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-work-tabs :deep(.arco-tabs-nav) {
  flex-shrink: 0;
  margin-bottom: 0;
  padding: 0 12px;
}

.detail-work-tabs :deep(.arco-tabs-content) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.detail-work-tabs :deep(.arco-tabs-pane) {
  height: 100%;
}

.detail-tab-title {
  gap: 5px;
}

.detail-tab-title b {
  min-width: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--color-fill-2);
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
  line-height: 16px;
  text-align: center;
}

.detail-tab-title b[data-alert='true'] {
  background: var(--dense-warning-1);
  color: var(--dense-warning-7);
}

.detail-pane {
  height: 100%;
  padding: 14px 16px 18px;
  overflow: auto;
  box-sizing: border-box;
}

.detail-pane--sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-section-local + .detail-section-local {
  padding-top: 16px;
  border-top: 1px solid var(--color-border-1);
}

.detail-section-local > header {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.detail-section-local > header > div {
  gap: 8px;
  min-width: 0;
}

.detail-section-local > header strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-nav);
  font-weight: var(--dense-weight-title);
}

.detail-section-local > header span:not(.s-pill) {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.detail-section-local :deep(.arco-form-item) {
  margin-bottom: 0;
}

.detail-section-local :deep(.arco-form-item-label-col) {
  margin-bottom: 4px;
  line-height: 20px;
}

.detail-section-local--table {
  min-width: 0;
}

.fee-summary-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--color-border-1);
  border-radius: var(--dense-radius);
  background: var(--color-fill-1);
}

.detail-risk-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border-1);
}

.detail-risk-row {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 150px 48px;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  border-bottom: 1px solid var(--color-border-1);
}

.detail-risk-row > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail-risk-row strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
}

.detail-risk-row div span {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-footer {
  flex-shrink: 0;
  justify-content: space-between;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--dense-card-border);
  border-radius: var(--dense-radius);
  background: var(--color-bg-1);
}

@media (max-width: 1199px) {
  .detail-context__overview {
    flex-wrap: wrap;
  }

  .detail-route {
    flex-basis: 180px;
  }

  .detail-facts {
    min-width: 520px;
  }

  .detail-attention {
    flex-basis: 100%;
  }
}

@media (max-width: 1080px) {
  .detail-context__command {
    align-items: flex-start;
    flex-direction: column;
    padding: 8px 12px;
  }

  .detail-context__actions {
    width: 100%;
    overflow-x: auto;
  }

  .detail-route {
    flex-basis: 100%;
  }

  .detail-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
  }

  .fee-summary-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
