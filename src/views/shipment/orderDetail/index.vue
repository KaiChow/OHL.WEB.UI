<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { Message, Modal } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue';
import {
  IconCheck,
  IconClose,
  IconDelete,
  IconDown,
  IconEdit,
  IconLeft,
  IconPlus,
  IconPrinter,
} from '@arco-design/web-vue/es/icon';
import OrderInfoTab from './components/OrderInfoTab.vue';
import { getShipmentOrderMock } from './mockData';
import type {
  ShipmentExceptionItem,
  ShipmentFeeLine,
  ShipmentNodeItem,
  ShipmentOrderDetailRecord,
} from './types';
import { getOrderStatusTransitions, resolveShipmentUiScenario } from '../featureContracts';
import { formatLocalMinute } from '../../../utils/date-time';

const route = useRoute();
const router = useRouter();
const DETAIL_TABS = ['overview', 'execution', 'files', 'fees', 'control', 'collaboration'];
const activeTab = ref(
  typeof route.query.tab === 'string' && DETAIL_TABS.includes(route.query.tab)
    ? route.query.tab
    : 'overview',
);
const submitting = ref(false);
const isDetailEditing = ref(false);
const detailSnapshot = ref<ShipmentOrderDetailRecord>();
const uiScenario = computed(() => resolveShipmentUiScenario(route.query.uiState));
const detailLoading = ref(false);
const detailErrorRecovered = ref(false);
const canEdit = computed(() => uiScenario.value !== 'permission');
const statusModalVisible = ref(false);
const statusFormRef = ref<FormInstance>();
const statusForm = reactive({ targetStatus: undefined as string | undefined, reason: '', notify: true, createNode: true });
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
const executionSnapshot = ref<typeof executionForm>();
const communicationForm = reactive({ target: '', channel: undefined as string | undefined, customerVisible: false, content: '' });
const communicationFormRef = ref<FormInstance>();

type RowEditScope = 'receivable' | 'payable' | 'node' | 'exception';
type EditableDetailRow = ShipmentFeeLine | ShipmentNodeItem | ShipmentExceptionItem;

const rowEdit = reactive({
  scope: undefined as RowEditScope | undefined,
  id: '',
  isNew: false,
  saving: false,
  errors: {} as Record<string, string>,
});
const rowSnapshots = new Map<string, EditableDetailRow>();

const loadRecord = (orderNo?: string) =>
  JSON.parse(JSON.stringify(getShipmentOrderMock(orderNo))) as ShipmentOrderDetailRecord;

const form = reactive<ShipmentOrderDetailRecord>(loadRecord(
  typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined,
));
const statusTransitionOptions = computed(() => getOrderStatusTransitions(form.orderStatus));
const canTransitionStatus = computed(() => canEdit.value
  && !isDetailEditing.value
  && !rowEdit.id
  && statusTransitionOptions.value.length > 0);

const milestoneItems = computed(() => form.nodes.slice(0, 6));
const currentMilestoneIndex = computed(() => {
  const pendingIndex = milestoneItems.value.findIndex((item) => item.statusKey !== 'rel');
  return pendingIndex < 0 ? milestoneItems.value.length - 1 : pendingIndex;
});
const fileMissingCount = computed(() => form.files.filter((item) => item.statusKey === 'rej').length);
const pendingFileConfirmCount = computed(() => form.files.filter((item) => item.statusKey === 'wait').length);
const pendingRiskCount = computed(() => form.risks.filter((item) => item.status !== '已关闭').length);
const feePendingCount = computed(() => form.receivableFees.filter((item) => item.statusKey === 'wait').length + form.payableFees.filter((item) => item.statusKey === 'wait').length);
const currentNode = computed(() => form.nodes.find((item) => item.statusKey !== 'rel') ?? form.nodes[form.nodes.length - 1]);
const nextActionSummary = computed(() => currentNode.value?.name ?? '当前无待推进节点');
const primaryRisk = computed(() => form.risks.find((item) => item.status !== '已关闭'));
const latestLog = computed(() => form.logs[0]);
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
  (orderNo) => {
    Object.assign(form, loadRecord(typeof orderNo === 'string' ? orderNo : undefined));
    isDetailEditing.value = false;
    detailSnapshot.value = undefined;
    executionSnapshot.value = undefined;
  },
);

watch(
  () => route.query.tab,
  (tab) => {
    if (typeof tab === 'string' && DETAIL_TABS.includes(tab)) activeTab.value = tab;
  },
);

watch(activeTab, (tab) => {
  if (route.query.tab === tab) return;
  router.replace({ query: { ...route.query, tab } });
});

watch(uiScenario, async (scenario) => {
  detailErrorRecovered.value = false;
  if (scenario === 'loading') {
    detailLoading.value = true;
    return;
  }
  if (scenario === 'slow') {
    detailLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1600));
    if (uiScenario.value === 'slow') detailLoading.value = false;
    return;
  }
  detailLoading.value = false;
}, { immediate: true });

const goBack = () => router.push({ name: 'ShipmentOrderWorkbench' });

onBeforeRouteLeave(() => {
  if (!rowEdit.id && !isDetailEditing.value) return true;
  return new Promise<boolean>((resolve) => {
    Modal.confirm({
      title: '放弃未保存的修改？',
      content: '当前订单仍在编辑中，离开后本次输入将丢失。',
      okText: '放弃并离开',
      cancelText: '继续编辑',
      okButtonProps: { status: 'danger', size: 'small' },
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
});

const retryDetail = async () => {
  detailLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  detailErrorRecovered.value = true;
  detailLoading.value = false;
};

const handleSave = async () => {
  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, uiScenario.value === 'slow' ? 1500 : 450));
  if (uiScenario.value === 'error') {
    submitting.value = false;
    Message.error('订单保存失败，请检查网络后重试；当前修改已保留');
    return;
  }
  submitting.value = false;
  isDetailEditing.value = false;
  detailSnapshot.value = undefined;
  executionSnapshot.value = undefined;
  Message.success(`订单 ${form.orderNo} 已保存`);
};

const handleDiscard = () => {
  Object.assign(form, detailSnapshot.value ?? loadRecord(typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined));
  if (executionSnapshot.value) Object.assign(executionForm, executionSnapshot.value);
  rowSnapshots.clear();
  rowEdit.scope = undefined;
  rowEdit.id = '';
  rowEdit.isNew = false;
  rowEdit.saving = false;
  rowEdit.errors = {};
  isDetailEditing.value = false;
  detailSnapshot.value = undefined;
  executionSnapshot.value = undefined;
  Message.info('已取消编辑并恢复上次保存内容');
};

const startDetailEdit = () => {
  detailSnapshot.value = JSON.parse(JSON.stringify(form)) as ShipmentOrderDetailRecord;
  executionSnapshot.value = JSON.parse(JSON.stringify(executionForm)) as typeof executionForm;
  isDetailEditing.value = true;
};

const handlePrint = () => window.print();

const openStatusModal = () => {
  statusForm.targetStatus = undefined;
  statusForm.reason = '';
  statusForm.notify = true;
  statusForm.createNode = true;
  statusFormRef.value?.clearValidate();
  statusModalVisible.value = true;
};

const syncMilestonesForStatus = (status: string) => {
  const activeIndexByStatus: Record<string, number> = {
    draft: 0,
    waitBooking: 1,
    booking: 1,
    released: 2,
    waitTruck: 2,
    trucking: 2,
    waitCustoms: 3,
    customs: 3,
    cleared: 4,
    waitSail: 4,
    sailed: 5,
    inTransit: 5,
    arrived: 5,
    completed: form.nodes.length,
  };
  const activeIndex = activeIndexByStatus[status];
  if (activeIndex === undefined) return;
  form.nodes.forEach((node, index) => {
    if (index < activeIndex || activeIndex >= form.nodes.length) {
      node.status = '已完成';
      node.statusKey = 'rel';
      return;
    }
    if (index === activeIndex) {
      node.status = '推进中';
      node.statusKey = 'op';
      return;
    }
    node.status = '待完成';
    node.statusKey = 'wait';
  });
};

const confirmStatusChange = async () => {
  const errors = await statusFormRef.value?.validate();
  if (errors) return false;
  const nextStatus = statusTransitionOptions.value.find((item) => item.value === statusForm.targetStatus);
  if (!nextStatus) return false;
  const previousStatus = form.orderStatusLabel;
  form.orderStatus = nextStatus.value;
  form.orderStatusLabel = nextStatus.label;
  form.statusPill = nextStatus.tone;
  syncMilestonesForStatus(nextStatus.value);
  form.logs.unshift({
    id: `log-${Date.now()}`,
    time: formatLocalMinute(),
    operator: form.operator,
    module: '订单节点',
    action: statusForm.reason.trim(),
    before: previousStatus,
    after: nextStatus.label,
    source: 'Web',
  });
  Message.success(`订单状态已更新为${form.orderStatusLabel}`);
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
};

const handleNotify = () => Message.success(`订单 ${form.orderNo} 的通知已发送`);

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

const confirmCancelOrder = () => {
  Modal.confirm({
    title: '确认作废该订单？',
    content: `订单 ${form.orderNo} 作废后不可继续推进，请确认业务已终止。`,
    okText: '确认作废',
    cancelText: '取消',
    okButtonProps: { status: 'danger', size: 'small' },
    onOk: handleCancelOrder,
  });
};

const handleRisk = (risk: ShipmentOrderDetailRecord['risks'][number]) => {
  risk.status = '已关闭';
  Message.success(`风险“${risk.type}”已关闭`);
};

const handleAddCommunication = async () => {
  const errors = await communicationFormRef.value?.validate();
  if (errors) return;
  form.logs.unshift({
    id: `log-${Date.now()}`,
    time: formatLocalMinute(),
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

const getEditableRows = (scope: RowEditScope): EditableDetailRow[] => {
  if (scope === 'receivable') return form.receivableFees;
  if (scope === 'payable') return form.payableFees;
  if (scope === 'node') return form.nodes;
  return form.exceptions;
};

const isEditingRow = (scope: RowEditScope, row: EditableDetailRow) =>
  rowEdit.scope === scope && rowEdit.id === row.id;

const startRowEdit = (scope: RowEditScope, row: EditableDetailRow, isNew = false) => {
  if (rowEdit.id && !isEditingRow(scope, row)) {
    Message.warning('请先保存或取消当前编辑行');
    return false;
  }
  const key = `${scope}:${row.id}`;
  if (!isNew && !rowSnapshots.has(key)) {
    rowSnapshots.set(key, JSON.parse(JSON.stringify(row)) as EditableDetailRow);
  }
  rowEdit.scope = scope;
  rowEdit.id = row.id;
  rowEdit.isNew = isNew;
  rowEdit.saving = false;
  rowEdit.errors = {};
  return true;
};

const validateDetailRow = (scope: RowEditScope, row: EditableDetailRow) => {
  const errors: Record<string, string> = {};
  if (scope === 'receivable' || scope === 'payable') {
    const fee = row as ShipmentFeeLine;
    if (!fee.name.trim()) errors.name = '费用名称不能为空';
    if (!(fee.amount > 0)) errors.amount = '费用金额必须大于 0';
    if (!fee.party.trim()) errors.party = scope === 'receivable' ? '客户不能为空' : '供应商不能为空';
  } else if (scope === 'node') {
    const node = row as ShipmentNodeItem;
    if (!node.name.trim()) errors.name = '节点名称不能为空';
    if (!node.planTime) errors.planTime = '计划时间不能为空';
  } else {
    const exception = row as ShipmentExceptionItem;
    if (!exception.type.trim()) errors.type = '异常类型不能为空';
    if (!exception.description.trim()) errors.description = '异常描述不能为空';
  }
  rowEdit.errors = errors;
  return Object.keys(errors).length === 0;
};

const saveDetailRow = async (scope: RowEditScope, row: EditableDetailRow) => {
  if (!validateDetailRow(scope, row)) return;
  rowEdit.saving = true;
  await new Promise((resolve) => setTimeout(resolve, uiScenario.value === 'slow' ? 1200 : 260));
  if (uiScenario.value === 'error') {
    rowEdit.saving = false;
    rowEdit.errors = { _row: '保存失败，请检查网络后重试；当前输入已保留' };
    return;
  }
  rowSnapshots.delete(`${scope}:${row.id}`);
  rowEdit.scope = undefined;
  rowEdit.id = '';
  rowEdit.isNew = false;
  rowEdit.saving = false;
  rowEdit.errors = {};
  Message.success('明细已保存');
};

const cancelDetailRow = (scope: RowEditScope, row: EditableDetailRow) => {
  const rows = getEditableRows(scope);
  if (rowEdit.isNew) {
    const index = rows.findIndex((item) => item.id === row.id);
    if (index >= 0) rows.splice(index, 1);
  } else {
    const snapshot = rowSnapshots.get(`${scope}:${row.id}`);
    if (snapshot) Object.assign(row, snapshot);
  }
  rowSnapshots.delete(`${scope}:${row.id}`);
  rowEdit.scope = undefined;
  rowEdit.id = '';
  rowEdit.isNew = false;
  rowEdit.saving = false;
  rowEdit.errors = {};
};

const removeDetailRow = (scope: RowEditScope, row: EditableDetailRow) => {
  const rows = getEditableRows(scope);
  const index = rows.findIndex((item) => item.id === row.id);
  if (index >= 0) rows.splice(index, 1);
  Message.success('明细已删除');
};

const addReceivableRow = () => {
  const row: ShipmentFeeLine = {
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
  };
  form.receivableFees.push(row);
  nextTick(() => startRowEdit('receivable', row, true));
};

const addPayableRow = () => {
  const row: ShipmentFeeLine = {
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
  };
  form.payableFees.push(row);
  nextTick(() => startRowEdit('payable', row, true));
};

const addNodeRow = () => {
  const row: ShipmentNodeItem = {
    id: `n-${Date.now()}`,
    name: '',
    planTime: '',
    actualTime: '',
    status: '待完成',
    statusKey: 'wait',
    owner: form.operator,
    source: '手工',
    overdue: false,
  };
  form.nodes.push(row);
  nextTick(() => startRowEdit('node', row, true));
};

const addExceptionRow = () => {
  const row: ShipmentExceptionItem = {
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
  };
  form.exceptions.push(row);
  nextTick(() => startRowEdit('exception', row, true));
};
</script>

<template>
  <div class="shipment-detail-page" data-pesdp-page="shipment-export-order-detail">
    <a-card v-if="detailLoading" class="detail-state-card" size="small">
      <a-skeleton animation><a-skeleton-line :rows="12" /></a-skeleton>
    </a-card>
    <a-result
      v-else-if="uiScenario === 'permission'"
      class="detail-state-card"
      status="403"
      title="暂无订单详情查看权限"
      subtitle="请联系管理员开通海运出口订单的数据权限。"
    >
      <template #extra><a-button size="small" type="primary" @click="goBack">返回订单列表</a-button></template>
    </a-result>
    <a-result
      v-else-if="uiScenario === 'empty'"
      class="detail-state-card"
      status="404"
      title="未找到该海运出口订单"
      subtitle="订单可能已删除，或当前链接已失效。"
    >
      <template #extra><a-button size="small" type="primary" @click="goBack">返回订单列表</a-button></template>
    </a-result>
    <a-result
      v-else-if="uiScenario === 'error' && !detailErrorRecovered"
      class="detail-state-card"
      status="error"
      title="订单详情加载失败"
      subtitle="网络请求未完成，当前页面没有写入任何数据。"
    >
      <template #extra><a-button size="small" type="primary" @click="retryDetail">重新加载</a-button></template>
    </a-result>
    <div v-else class="detail-workspace" data-detail-workspace="shipment-order">
    <a-card class="detail-context" size="small" :body-style="{ padding: 0 }">
      <header class="detail-context__command">
        <div class="detail-context__identity">
          <a-tooltip content="返回订单列表">
            <a-button size="small" type="text" class="detail-context__back" aria-label="返回订单列表" @click="goBack">
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
          <a-tooltip content="打印订单">
            <a-button size="small" type="text" title="打印订单" aria-label="打印订单" @click="handlePrint"><template #icon><icon-printer /></template></a-button>
          </a-tooltip>
          <a-button v-if="canEdit && !isDetailEditing && !rowEdit.id" size="small" @click="startDetailEdit">编辑订单</a-button>
          <a-button v-if="canEdit && !isDetailEditing && !rowEdit.id" size="small" @click="handleGenerateFee">生成费用</a-button>
          <a-button v-if="!isDetailEditing && !rowEdit.id" size="small" @click="handleUploadFile">文件资料</a-button>
          <a-dropdown v-if="canEdit && !isDetailEditing && !rowEdit.id" trigger="click">
            <a-button size="small">更多<icon-down /></a-button>
            <template #content>
              <a-doption @click="handleNotify">发送通知</a-doption>
              <a-doption @click="handleMarkException">标记异常</a-doption>
              <a-divider :margin="4" />
              <a-doption class="danger-opt" @click="confirmCancelOrder">作废订单</a-doption>
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

      </div>

      <section class="detail-focus" aria-label="当前执行焦点">
        <div class="detail-focus__main">
          <span>当前待办</span>
          <strong>{{ nextActionSummary }}</strong>
          <small>{{ currentNode?.owner || form.operator }} 负责 · 计划 {{ currentNode?.planTime || '待排期' }}</small>
        </div>
        <button
          type="button"
          class="detail-focus__risk"
          :data-alert="Boolean(primaryRisk)"
          @click="switchTab('control')"
        >
          <span>{{ primaryRisk ? primaryRisk.type : '执行状态' }}</span>
          <strong>{{ primaryRisk ? primaryRisk.message : '当前无阻塞异常' }}</strong>
          <small>{{ primaryRisk ? `${primaryRisk.owner} · ${primaryRisk.dueAt}` : '按计划推进' }}</small>
        </button>
        <div class="detail-focus__recent">
          <span>最近变更</span>
          <strong>{{ latestLog ? `${latestLog.module} · ${latestLog.action}` : '暂无变更记录' }}</strong>
          <small>{{ latestLog ? `${latestLog.operator} · ${latestLog.time}` : '—' }}</small>
        </div>
        <div class="detail-focus__action">
          <span>下一节点</span>
          <strong>{{ statusTransitionOptions[0]?.label || '暂无可推进状态' }}</strong>
          <a-button v-if="canTransitionStatus" size="small" type="primary" @click="openStatusModal">推进节点</a-button>
        </div>
      </section>

      <div class="detail-milestone-bar" aria-label="订单里程碑">
        <div
          v-for="(node, index) in milestoneItems"
          :key="node.id"
          class="detail-milestone-bar__item"
          :data-state="node.statusKey === 'rel' ? 'done' : index === currentMilestoneIndex ? 'current' : 'next'"
        >
          <span class="detail-milestone-bar__dot" />
          <div><strong>{{ node.name }}</strong><small>{{ node.planTime.slice(5, 16) }}</small></div>
        </div>
      </div>
    </a-card>

    <a-card class="detail-work-surface" size="small" :body-style="{ padding: 0, height: '100%' }">
      <a-tabs v-model:active-key="activeTab" size="small" class="detail-work-tabs">
        <a-tab-pane key="overview" title="订单概览" :disabled="Boolean(rowEdit.id) && activeTab !== 'overview'">
          <div class="detail-pane"><order-info-tab v-model:form="form" :editable="isDetailEditing" /></div>
        </a-tab-pane>

        <a-tab-pane key="execution" title="运输执行" :disabled="Boolean(rowEdit.id) && activeTab !== 'execution'">
          <div class="detail-pane detail-pane--sections">
            <section class="detail-section-local">
              <header><strong>订舱与舱位</strong><span class="s-pill" data-s="wait">{{ form.spaceStatus }}</span></header>
              <a-form v-if="isDetailEditing" :model="form" layout="vertical" size="small" class="detail-form">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item field="bookingNo" label="订舱号"><a-input v-model="form.bookingNo" size="small" allow-clear placeholder="待船司回传" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="carrier" label="船公司"><a-input v-model="form.carrier" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="bookingAgent" label="订舱代理"><a-input v-model="form.bookingAgent" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="contractNo" label="合约号"><a-input v-model="form.contractNo" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="rateNo" label="运价编号"><a-input v-model="form.rateNo" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="spaceStatus" label="舱位状态"><a-input v-model="form.spaceStatus" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="releaseTime" label="放舱时间"><a-date-picker v-model="form.releaseTime" size="small" show-time style="width: 100%" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="vgmCutoff" label="截 VGM"><a-date-picker v-model="form.vgmCutoff" size="small" show-time style="width: 100%" /></a-form-item></a-col>
                  <a-col :span="24"><a-form-item field="bookingRemark" label="订舱备注"><a-textarea v-model="form.bookingRemark" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" /></a-form-item></a-col>
                </a-row>
              </a-form>
              <a-descriptions v-else class="detail-display" :bordered="false" layout="vertical" :column="4" size="small">
                <a-descriptions-item label="订舱号"><span class="mono">{{ form.bookingNo || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="船公司">{{ form.carrier || '—' }}</a-descriptions-item>
                <a-descriptions-item label="订舱代理">{{ form.bookingAgent || '—' }}</a-descriptions-item>
                <a-descriptions-item label="合约号"><span class="mono">{{ form.contractNo || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="运价编号"><span class="mono">{{ form.rateNo || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="舱位状态">{{ form.spaceStatus || '—' }}</a-descriptions-item>
                <a-descriptions-item label="放舱时间"><span class="mono">{{ form.releaseTime || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="截 VGM"><span class="mono">{{ form.vgmCutoff || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="订舱备注" :span="2">{{ form.bookingRemark || '—' }}</a-descriptions-item>
              </a-descriptions>
            </section>

            <section class="detail-section-local">
              <header><strong>柜货与拖车</strong><span>{{ form.containerSummary }}</span></header>
              <a-form v-if="isDetailEditing" :model="executionForm" layout="vertical" size="small" class="detail-form">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item label="柜型柜量"><a-input v-model="form.containerSummary" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="truckSupplier" label="拖车供应商"><a-input v-model="executionForm.truckSupplier" size="small" allow-clear placeholder="请选择供应商" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="loadingAddress" label="装柜地址"><a-input v-model="executionForm.loadingAddress" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="loadingTime" label="装柜时间"><a-date-picker v-model="executionForm.loadingTime" size="small" show-time style="width: 100%" /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="truckStatus" label="拖车状态"><a-select v-model="executionForm.truckStatus" size="small" placeholder="请选择"><a-option value="未安排">未安排</a-option><a-option value="已派车">已派车</a-option><a-option value="已到厂">已到厂</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="plateNo" label="车牌号"><a-input v-model="executionForm.plateNo" size="small" allow-clear /></a-form-item></a-col>
                </a-row>
              </a-form>
              <a-descriptions v-else class="detail-display" :bordered="false" layout="vertical" :column="4" size="small">
                <a-descriptions-item label="柜型柜量">{{ form.containerSummary || '—' }}</a-descriptions-item>
                <a-descriptions-item label="拖车供应商">{{ executionForm.truckSupplier || '—' }}</a-descriptions-item>
                <a-descriptions-item label="装柜地址" :span="2">{{ executionForm.loadingAddress || '—' }}</a-descriptions-item>
                <a-descriptions-item label="装柜时间"><span class="mono">{{ executionForm.loadingTime || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="拖车状态">{{ executionForm.truckStatus || '—' }}</a-descriptions-item>
                <a-descriptions-item label="车牌号"><span class="mono">{{ executionForm.plateNo || '—' }}</span></a-descriptions-item>
              </a-descriptions>
            </section>

            <section class="detail-section-local">
              <header><strong>报关与提单</strong><span>{{ form.bookingNo || '待回传订舱号' }}</span></header>
              <a-form v-if="isDetailEditing" :model="executionForm" layout="vertical" size="small" class="detail-form">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item field="customsMode" label="报关方式"><a-select v-model="executionForm.customsMode" size="small" placeholder="请选择"><a-option value="一般贸易">一般贸易</a-option><a-option value="跨境电商">跨境电商</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="customsBroker" label="报关行"><a-input v-model="executionForm.customsBroker" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="customsNo" label="报关单号"><a-input v-model="executionForm.customsNo" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="customsStatus" label="报关状态"><a-select v-model="executionForm.customsStatus" size="small" placeholder="请选择"><a-option value="未提交">未提交</a-option><a-option value="已提交">已提交</a-option><a-option value="已放行">已放行</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="hbl" label="HBL"><a-input v-model="executionForm.hbl" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="mbl" label="MBL"><a-input v-model="executionForm.mbl" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="blType" label="提单类型"><a-select v-model="executionForm.blType" size="small" placeholder="请选择"><a-option value="正本">正本</a-option><a-option value="电放">电放</a-option><a-option value="海运单">海运单</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="blConfirmStatus" label="提单确认状态"><a-select v-model="executionForm.blConfirmStatus" size="small" placeholder="请选择"><a-option value="待确认">待确认</a-option><a-option value="已确认">已确认</a-option></a-select></a-form-item></a-col>
                </a-row>
              </a-form>
              <a-descriptions v-else class="detail-display" :bordered="false" layout="vertical" :column="4" size="small">
                <a-descriptions-item label="报关方式">{{ executionForm.customsMode || '—' }}</a-descriptions-item>
                <a-descriptions-item label="报关行">{{ executionForm.customsBroker || '—' }}</a-descriptions-item>
                <a-descriptions-item label="报关单号"><span class="mono">{{ executionForm.customsNo || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="报关状态">{{ executionForm.customsStatus || '—' }}</a-descriptions-item>
                <a-descriptions-item label="HBL"><span class="mono">{{ executionForm.hbl || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="MBL"><span class="mono">{{ executionForm.mbl || '—' }}</span></a-descriptions-item>
                <a-descriptions-item label="提单类型">{{ executionForm.blType || '—' }}</a-descriptions-item>
                <a-descriptions-item label="提单确认状态">{{ executionForm.blConfirmStatus || '—' }}</a-descriptions-item>
              </a-descriptions>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="files" :disabled="isDetailEditing || (Boolean(rowEdit.id) && activeTab !== 'files')">
          <template #title><span class="detail-tab-title">文件资料 <b :data-alert="fileMissingCount > 0">{{ form.files.length }}</b></span></template>
          <div class="detail-pane">
            <section class="detail-section-local detail-section-local--table">
              <header><strong>文件清单</strong><a-space :size="8"><span>必传 {{ requiredFileCount }} · 缺失 {{ fileMissingCount }} · 待确认 {{ pendingFileConfirmCount }}</span><a-tooltip content="上传服务尚未配置"><span><a-button size="small" type="outline" disabled><template #icon><icon-plus /></template>添加文件</a-button></span></a-tooltip></a-space></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--readonly" border="none" size="small" :data="form.files" :row-config="{ isHover: true, keyField: 'id' }">
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

        <a-tab-pane key="fees" :disabled="isDetailEditing || (Boolean(rowEdit.id) && activeTab !== 'fees')">
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
              <header><strong>应收费用</strong><a-space :size="8"><span>{{ form.receivableFees.length }} 条 · 待确认 {{ form.receivableFees.filter((item) => item.statusKey === 'wait').length }}</span><a-button size="small" type="outline" :disabled="Boolean(rowEdit.id)" @click="addReceivableRow"><template #icon><icon-plus /></template>新增应收</a-button></a-space></header>
              <div v-if="rowEdit.scope === 'receivable' && Object.keys(rowEdit.errors).length" class="detail-row-validation">{{ Object.values(rowEdit.errors).join('；') }}</div>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" :data="form.receivableFees" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="费用名称" min-width="110"><template #default="{ row }"><a-input v-if="isEditingRow('receivable', row)" v-model="row.name" size="small" :error="Boolean(rowEdit.errors.name)" /><span v-else>{{ row.name || '—' }}</span></template></vxe-column>
                <vxe-column field="currency" title="币种" min-width="72"><template #default="{ row }"><a-select v-if="isEditingRow('receivable', row)" v-model="row.currency" size="small"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select><span v-else class="mono">{{ row.currency }}</span></template></vxe-column>
                <vxe-column field="amount" title="金额" min-width="100" align="right"><template #default="{ row }"><a-input-number v-if="isEditingRow('receivable', row)" v-model="row.amount" size="small" :error="Boolean(rowEdit.errors.amount)" hide-button /><span v-else class="mono">{{ row.amount.toLocaleString() }}</span></template></vxe-column>
                <vxe-column field="party" title="客户" min-width="140"><template #default="{ row }"><a-input v-if="isEditingRow('receivable', row)" v-model="row.party" size="small" :error="Boolean(rowEdit.errors.party)" /><span v-else>{{ row.party || '—' }}</span></template></vxe-column>
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
                <vxe-column title="操作" width="88" fixed="right" align="center"><template #default="{ row }"><div class="row-actions"><template v-if="isEditingRow('receivable', row)"><a-tooltip content="保存"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="保存应收费用" :loading="rowEdit.saving" @click="saveDetailRow('receivable', row)"><icon-check /></a-button></a-tooltip><a-tooltip content="取消"><a-button size="small" type="text" class="row-action-btn" aria-label="取消编辑应收费用" :disabled="rowEdit.saving" @click="cancelDetailRow('receivable', row)"><icon-close /></a-button></a-tooltip></template><template v-else><a-tooltip content="编辑"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="编辑应收费用" @click="startRowEdit('receivable', row)"><icon-edit /></a-button></a-tooltip><a-popconfirm content="确认删除该应收费用？" @ok="removeDetailRow('receivable', row)"><a-tooltip content="删除"><a-button size="small" type="text" status="danger" class="row-action-btn" aria-label="删除应收费用"><icon-delete /></a-button></a-tooltip></a-popconfirm></template></div></template></vxe-column>
              </vxe-table>
            </section>

            <section class="detail-section-local detail-section-local--table">
              <header><strong>应付费用</strong><a-space :size="8"><span>{{ form.payableFees.length }} 条 · 待确认 {{ form.payableFees.filter((item) => item.statusKey === 'wait').length }}</span><a-button size="small" type="outline" :disabled="Boolean(rowEdit.id)" @click="addPayableRow"><template #icon><icon-plus /></template>新增应付</a-button></a-space></header>
              <div v-if="rowEdit.scope === 'payable' && Object.keys(rowEdit.errors).length" class="detail-row-validation">{{ Object.values(rowEdit.errors).join('；') }}</div>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" :data="form.payableFees" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="费用名称" min-width="110"><template #default="{ row }"><a-input v-if="isEditingRow('payable', row)" v-model="row.name" size="small" :error="Boolean(rowEdit.errors.name)" /><span v-else>{{ row.name || '—' }}</span></template></vxe-column>
                <vxe-column field="currency" title="币种" min-width="72"><template #default="{ row }"><a-select v-if="isEditingRow('payable', row)" v-model="row.currency" size="small"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select><span v-else class="mono">{{ row.currency }}</span></template></vxe-column>
                <vxe-column field="amount" title="金额" min-width="100" align="right"><template #default="{ row }"><a-input-number v-if="isEditingRow('payable', row)" v-model="row.amount" size="small" :error="Boolean(rowEdit.errors.amount)" hide-button /><span v-else class="mono">{{ row.amount.toLocaleString() }}</span></template></vxe-column>
                <vxe-column field="party" title="供应商" min-width="140"><template #default="{ row }"><a-input v-if="isEditingRow('payable', row)" v-model="row.party" size="small" :error="Boolean(rowEdit.errors.party)" /><span v-else>{{ row.party || '—' }}</span></template></vxe-column>
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
                <vxe-column title="操作" width="88" fixed="right" align="center"><template #default="{ row }"><div class="row-actions"><template v-if="isEditingRow('payable', row)"><a-tooltip content="保存"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="保存应付费用" :loading="rowEdit.saving" @click="saveDetailRow('payable', row)"><icon-check /></a-button></a-tooltip><a-tooltip content="取消"><a-button size="small" type="text" class="row-action-btn" aria-label="取消编辑应付费用" :disabled="rowEdit.saving" @click="cancelDetailRow('payable', row)"><icon-close /></a-button></a-tooltip></template><template v-else><a-tooltip content="编辑"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="编辑应付费用" @click="startRowEdit('payable', row)"><icon-edit /></a-button></a-tooltip><a-popconfirm content="确认删除该应付费用？" @ok="removeDetailRow('payable', row)"><a-tooltip content="删除"><a-button size="small" type="text" status="danger" class="row-action-btn" aria-label="删除应付费用"><icon-delete /></a-button></a-tooltip></a-popconfirm></template></div></template></vxe-column>
              </vxe-table>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="control" :disabled="isDetailEditing || (Boolean(rowEdit.id) && activeTab !== 'control')">
          <template #title><span class="detail-tab-title">节点与异常 <b :data-alert="pendingRiskCount > 0">{{ pendingRiskCount }}</b></span></template>
          <div class="detail-pane detail-pane--sections">
            <section v-if="form.risks.length" class="detail-section-local">
              <header><strong>当前风险</strong><span>{{ pendingRiskCount }} 项待处理</span></header>
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
              <header><strong>物流节点</strong><a-space :size="8"><span>已完成 {{ completedNodeCount }} · 待推进 {{ form.nodes.length - completedNodeCount }}</span><a-button size="small" type="outline" :disabled="Boolean(rowEdit.id)" @click="addNodeRow"><template #icon><icon-plus /></template>新增节点</a-button></a-space></header>
              <div v-if="rowEdit.scope === 'node' && Object.keys(rowEdit.errors).length" class="detail-row-validation">{{ Object.values(rowEdit.errors).join('；') }}</div>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" :data="form.nodes" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="name" title="节点名称" min-width="110"><template #default="{ row }"><a-input v-if="isEditingRow('node', row)" v-model="row.name" size="small" :error="Boolean(rowEdit.errors.name)" /><span v-else>{{ row.name || '—' }}</span></template></vxe-column>
                <vxe-column field="planTime" title="计划时间" min-width="150"><template #default="{ row }"><a-date-picker v-if="isEditingRow('node', row)" v-model="row.planTime" size="small" :error="Boolean(rowEdit.errors.planTime)" show-time style="width: 100%" /><span v-else class="mono">{{ row.planTime || '—' }}</span></template></vxe-column>
                <vxe-column field="actualTime" title="实际时间" min-width="150"><template #default="{ row }"><a-date-picker v-if="isEditingRow('node', row)" v-model="row.actualTime" size="small" show-time style="width: 100%" /><span v-else class="mono">{{ row.actualTime || '—' }}</span></template></vxe-column>
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
                <vxe-column field="owner" title="负责人" min-width="90" />
                <vxe-column title="操作" width="88" fixed="right" align="center"><template #default="{ row }"><div class="row-actions"><template v-if="isEditingRow('node', row)"><a-tooltip content="保存"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="保存物流节点" :loading="rowEdit.saving" @click="saveDetailRow('node', row)"><icon-check /></a-button></a-tooltip><a-tooltip content="取消"><a-button size="small" type="text" class="row-action-btn" aria-label="取消编辑物流节点" :disabled="rowEdit.saving" @click="cancelDetailRow('node', row)"><icon-close /></a-button></a-tooltip></template><template v-else><a-tooltip content="编辑"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="编辑物流节点" @click="startRowEdit('node', row)"><icon-edit /></a-button></a-tooltip><a-popconfirm content="确认删除该物流节点？" @ok="removeDetailRow('node', row)"><a-tooltip content="删除"><a-button size="small" type="text" status="danger" class="row-action-btn" aria-label="删除物流节点"><icon-delete /></a-button></a-tooltip></a-popconfirm></template></div></template></vxe-column>
              </vxe-table>
            </section>

            <section class="detail-section-local detail-section-local--table">
              <header><strong>异常记录</strong><a-space :size="8"><span>未关闭 {{ openExceptionCount }} 条</span><a-button size="small" type="outline" :disabled="Boolean(rowEdit.id)" @click="addExceptionRow"><template #icon><icon-plus /></template>登记异常</a-button></a-space></header>
              <div v-if="rowEdit.scope === 'exception' && Object.keys(rowEdit.errors).length" class="detail-row-validation">{{ Object.values(rowEdit.errors).join('；') }}</div>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" :data="form.exceptions" :row-config="{ isHover: true, keyField: 'id' }">
                <vxe-column type="seq" title="序号" width="52" align="center" />
                <vxe-column field="no" title="异常编号" min-width="130" />
                <vxe-column field="type" title="类型" min-width="110"><template #default="{ row }"><a-input v-if="isEditingRow('exception', row)" v-model="row.type" size="small" :error="Boolean(rowEdit.errors.type)" /><span v-else>{{ row.type || '—' }}</span></template></vxe-column>
                <vxe-column field="level" title="等级" min-width="80"><template #default="{ row }"><span class="s-pill" :data-s="row.levelKey">{{ row.level }}</span></template></vxe-column>
                <vxe-column field="description" title="描述" min-width="180"><template #default="{ row }"><a-input v-if="isEditingRow('exception', row)" v-model="row.description" size="small" :error="Boolean(rowEdit.errors.description)" /><span v-else>{{ row.description || '—' }}</span></template></vxe-column>
                <vxe-column field="owner" title="责任人" min-width="90" />
                <vxe-column field="status" title="状态" min-width="96"><template #default="{ row }"><span class="s-pill" :data-s="row.statusKey">{{ row.status }}</span></template></vxe-column>
                <vxe-column title="操作" width="88" fixed="right" align="center"><template #default="{ row }"><div class="row-actions"><template v-if="isEditingRow('exception', row)"><a-tooltip content="保存"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="保存异常记录" :loading="rowEdit.saving" @click="saveDetailRow('exception', row)"><icon-check /></a-button></a-tooltip><a-tooltip content="取消"><a-button size="small" type="text" class="row-action-btn" aria-label="取消编辑异常记录" :disabled="rowEdit.saving" @click="cancelDetailRow('exception', row)"><icon-close /></a-button></a-tooltip></template><template v-else><a-tooltip content="编辑"><a-button size="small" type="text" class="row-action-btn row-action-btn--primary" aria-label="编辑异常记录" @click="startRowEdit('exception', row)"><icon-edit /></a-button></a-tooltip><a-popconfirm content="确认删除该异常记录？" @ok="removeDetailRow('exception', row)"><a-tooltip content="删除"><a-button size="small" type="text" status="danger" class="row-action-btn" aria-label="删除异常记录"><icon-delete /></a-button></a-tooltip></a-popconfirm></template></div></template></vxe-column>
              </vxe-table>
            </section>
          </div>
        </a-tab-pane>

        <a-tab-pane key="collaboration" title="沟通与日志" :disabled="isDetailEditing || (Boolean(rowEdit.id) && activeTab !== 'collaboration')">
          <div class="detail-pane detail-pane--sections">
            <section class="detail-section-local">
              <header><strong>新增沟通</strong><a-button size="small" type="primary" @click="handleAddCommunication">保存记录</a-button></header>
              <a-form ref="communicationFormRef" :model="communicationForm" layout="vertical" size="small" class="detail-form">
                <a-row :gutter="[16, 8]">
                  <a-col :md="8" :lg="6"><a-form-item field="target" label="沟通对象"><a-input v-model="communicationForm.target" size="small" allow-clear /></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="channel" label="沟通方式"><a-select v-model="communicationForm.channel" size="small" placeholder="请选择"><a-option value="电话">电话</a-option><a-option value="邮件">邮件</a-option><a-option value="微信">微信</a-option></a-select></a-form-item></a-col>
                  <a-col :md="8" :lg="6"><a-form-item field="customerVisible" label="客户可见"><a-switch v-model="communicationForm.customerVisible" size="small" /></a-form-item></a-col>
                  <a-col :span="24"><a-form-item field="content" label="沟通内容" :rules="[{ required: true, message: '请填写沟通内容' }]"><a-textarea v-model="communicationForm.content" size="small" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="记录沟通内容" /></a-form-item></a-col>
                </a-row>
              </a-form>
            </section>
            <section class="detail-section-local detail-section-local--table">
              <header><strong>操作日志</strong></header>
              <vxe-table class="detail-mini-vxe detail-mini-vxe--readonly" border="none" size="small" :data="form.logs" :row-config="{ isHover: true, keyField: 'id' }">
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

    <footer v-if="canEdit && isDetailEditing" class="detail-footer">
      <span>编辑订单信息</span>
      <a-space :size="8">
        <a-button size="small" :disabled="submitting" @click="handleDiscard">取消</a-button>
        <a-button size="small" type="primary" :loading="submitting" @click="handleSave">保存修改</a-button>
      </a-space>
    </footer>

    <a-modal v-model:visible="statusModalVisible" title="修改订单状态" :width="560" :mask-closable="false" :on-before-ok="confirmStatusChange">
      <a-form ref="statusFormRef" :model="statusForm" layout="vertical" size="small" class="detail-form">
        <a-row :gutter="[16, 8]">
          <a-col :span="12"><a-form-item label="当前状态"><span class="s-pill" :data-s="form.statusPill">{{ form.orderStatusLabel }}</span></a-form-item></a-col>
          <a-col :span="12">
            <a-form-item field="targetStatus" label="目标状态" :rules="[{ required: true, message: '请选择目标状态' }]">
              <a-select v-model="statusForm.targetStatus" size="small" allow-clear placeholder="请选择">
                <a-option v-for="option in statusTransitionOptions" :key="option.value" :value="option.value">{{ option.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="reason" label="修改原因" :rules="[{ required: true, message: '请填写修改原因' }]">
              <a-textarea v-model="statusForm.reason" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请填写修改原因" />
            </a-form-item>
          </a-col>
          <a-col :span="12"><a-form-item hide-label><a-checkbox v-model="statusForm.notify">同步通知相关人员</a-checkbox></a-form-item></a-col>
          <a-col :span="12"><a-form-item hide-label><a-checkbox v-model="statusForm.createNode">生成节点记录</a-checkbox></a-form-item></a-col>
        </a-row>
      </a-form>
    </a-modal>
    </div>
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

.detail-workspace {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.detail-state-card {
  flex: 1;
  min-height: 0;
  border-color: var(--dense-card-border);
  border-radius: var(--dense-radius);
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
  font-size: var(--dense-font-hero);
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

.detail-focus {
  display: grid;
  grid-template-columns: minmax(170px, 0.8fr) minmax(250px, 1.4fr) minmax(170px, 0.8fr) 160px;
  min-height: 68px;
  border-top: 1px solid var(--color-border-1);
  background: var(--color-fill-1);
}

.detail-focus__main,
.detail-focus__risk,
.detail-focus__recent,
.detail-focus__action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  padding: 8px 12px;
}

.detail-focus__main > span,
.detail-focus__risk > span,
.detail-focus__recent > span,
.detail-focus__action > span {
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
}

.detail-focus__main > strong,
.detail-focus__risk > strong,
.detail-focus__recent > strong,
.detail-focus__action > strong {
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-focus small {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-focus__risk {
  border: 0;
  border-left: 1px solid var(--color-border-1);
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.detail-focus__recent {
  border-left: 1px solid var(--color-border-1);
}

.detail-focus__risk:hover,
.detail-focus__risk:focus-visible {
  background: var(--color-fill-2);
}

.detail-focus__risk:focus-visible {
  outline: 2px solid var(--dense-primary-3);
  outline-offset: -2px;
}

.detail-focus__risk[data-alert='true'] > strong {
  color: var(--dense-warning-7);
}

.detail-focus__action {
  align-items: flex-start;
}

.detail-focus__action .arco-btn {
  margin-top: 3px;
}

.detail-milestone-bar {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  padding: 8px 12px 9px;
  border-top: 1px solid var(--color-border-1);
}

.detail-milestone-bar__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.detail-milestone-bar__item::after {
  position: absolute;
  top: 7px;
  right: 8px;
  left: 20px;
  height: 1px;
  background: var(--color-border-2);
  content: '';
}

.detail-milestone-bar__item:last-child::after {
  display: none;
}

.detail-milestone-bar__dot {
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border: 2px solid var(--color-border-3);
  border-radius: 50%;
  background: var(--color-bg-1);
}

.detail-milestone-bar__item[data-state='done'] .detail-milestone-bar__dot {
  border-color: var(--dense-primary-6);
  background: var(--dense-primary-6);
}

.detail-milestone-bar__item[data-state='current'] .detail-milestone-bar__dot {
  border-color: var(--dense-primary-6);
}

.detail-milestone-bar__item > div {
  min-width: 0;
}

.detail-milestone-bar__item strong,
.detail-milestone-bar__item small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-milestone-bar__item strong {
  color: var(--color-text-2);
  font-size: var(--dense-font-control);
  font-weight: var(--dense-weight-title);
}

.detail-milestone-bar__item[data-state='current'] strong {
  color: var(--dense-primary-7);
}

.detail-milestone-bar__item small {
  color: var(--color-text-3);
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

.detail-work-tabs :deep(.arco-tabs-content-list),
.detail-work-tabs :deep(.arco-tabs-content-item) {
  height: 100%;
  min-height: 0;
}

.detail-work-tabs :deep(.arco-tabs-content-item) {
  overflow: hidden;
}

.detail-work-tabs :deep(.arco-tabs-pane) {
  height: 100%;
  min-height: 0;
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
  gap: var(--dense-gap-module);
}

.detail-section-local + .detail-section-local {
  padding-top: var(--dense-gap-module);
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
  padding: 8px 0;
  border-top: 1px solid var(--color-border-1);
  border-bottom: 1px solid var(--color-border-1);
  background: transparent;
}

.detail-row-validation {
  margin: -2px 0 6px;
  color: var(--dense-danger-7);
  font-size: var(--dense-font-aux);
  line-height: 18px;
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

.detail-footer > span {
  color: var(--color-text-2);
  font-size: var(--dense-font-control);
  font-weight: var(--dense-weight-title);
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

  .detail-focus {
    grid-template-columns: minmax(145px, 0.8fr) minmax(205px, 1.3fr) minmax(150px, 0.8fr) 140px;
  }

}

@media (max-width: 1080px) {
  .detail-context__command {
    gap: 8px;
  }

  .detail-context__actions {
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
  }

  .detail-route {
    flex-basis: 180px;
  }

  .detail-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
  }

  .fee-summary-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .detail-milestone-bar {
    overflow-x: auto;
    grid-template-columns: repeat(6, minmax(112px, 1fr));
  }
}
</style>
