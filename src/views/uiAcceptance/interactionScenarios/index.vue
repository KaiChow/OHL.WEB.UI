<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import { IconMore, IconPlus, IconRefresh } from '@arco-design/web-vue/es/icon';
import StandardListFrame from '../../../components/workbench/StandardListFrame.vue';
import WorkbenchEmptyState from '../../../components/workbench/WorkbenchEmptyState.vue';
import WorkbenchTableToolbar from '../../../components/workbench/WorkbenchTableToolbar.vue';
import { compactVerticalFormLabelStyle, denseFormGridGutter, denseFormItemStyle } from '../../../design-system/formLayout';
import { stableTableRowConfig } from '../../../design-system/tableConfig';
import { buildDateTimeStamp } from '../../../utils/mock-actions';
import { INTERACTION_SCENARIO_FEATURE_CONTRACTS } from './featureContracts';
import type {
  AcceptanceTaskRow,
  ActionBehavior,
  ContactForm,
  CustomerForm,
  FeedbackBehavior,
  FormBehavior,
  InteractionScenario,
  SettlementForm,
} from './types';

void INTERACTION_SCENARIO_FEATURE_CONTRACTS;

const props = defineProps<{ initialScenario: InteractionScenario }>();
const { t } = useI18n();
const router = useRouter();

const scenario = ref<InteractionScenario>(props.initialScenario);
const routeNames: Record<InteractionScenario, string> = {
  'form-overlays': 'InteractionFormOverlays',
  'action-hierarchy': 'InteractionActionHierarchy',
  'feedback-states': 'InteractionFeedbackStates',
};

const onScenarioChange = (value: string | number | boolean) => {
  if (value !== 'form-overlays' && value !== 'action-hierarchy' && value !== 'feedback-states') return;
  router.push({ name: routeNames[value] });
};

watch(() => props.initialScenario, (value) => { scenario.value = value; });

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const focusFirstError = async () => {
  await nextTick();
  document.querySelector<HTMLElement>('.arco-modal .arco-form-item-error input, .arco-modal .arco-form-item-error textarea')?.focus();
};

// Form and overlay scenario
const formBehavior = ref<FormBehavior>('normal');
const contactVisible = ref(false);
const customerVisible = ref(false);
const settlementVisible = ref(false);
const discardVisible = ref(false);
const discardTarget = ref<'contact' | 'customer' | 'settlement'>('contact');
const contactFormRef = ref<FormInstance>();
const customerFormRef = ref<FormInstance>();
const settlementFormRef = ref<FormInstance>();
const contactSubmitting = ref(false);
const customerSubmitting = ref(false);
const settlementSubmitting = ref(false);
const contactError = ref('');
const customerError = ref('');
const settlementError = ref('');
const formBaselines = reactive({ contact: '', customer: '', settlement: '' });

const contactForm = reactive<ContactForm>({ name: 'Lin Chen', phone: '138 0013 8000', email: 'lin.chen@example.com' });
const customerForm = reactive<CustomerForm>({ customerName: '华东精密设备有限公司', customerType: 'direct', owner: 'admin', phone: '021-6688 1024', email: 'ops@east-precision.example', address: '上海市浦东新区航运路 88 号' });
const settlementForm = reactive<SettlementForm>({ companyName: '华东精密设备有限公司', taxNo: '91310000MA1K3T8X2A', currency: 'CNY', paymentTerm: 'monthly', bankName: '中国银行上海分行', bankAccount: '4312 8800 1024 6688', invoiceTitle: '华东精密设备有限公司', invoiceEmail: 'finance@east-precision.example', billingAddress: '上海市浦东新区航运路 88 号', remark: '' });
const savedFormSummary = reactive({ contact: contactForm.name, customer: customerForm.customerName, settlement: settlementForm.paymentTerm });

const currentForm = (kind: 'contact' | 'customer' | 'settlement') => kind === 'contact' ? contactForm : kind === 'customer' ? customerForm : settlementForm;
const setFormBaseline = (kind: 'contact' | 'customer' | 'settlement') => { formBaselines[kind] = JSON.stringify(currentForm(kind)); };
const isFormDirty = (kind: 'contact' | 'customer' | 'settlement') => formBaselines[kind] !== JSON.stringify(currentForm(kind));
const setFormVisible = (kind: 'contact' | 'customer' | 'settlement', visible: boolean) => {
  if (kind === 'contact') contactVisible.value = visible;
  else if (kind === 'customer') customerVisible.value = visible;
  else settlementVisible.value = visible;
};
const isFormSubmitting = (kind: 'contact' | 'customer' | 'settlement') => kind === 'contact' ? contactSubmitting.value : kind === 'customer' ? customerSubmitting.value : settlementSubmitting.value;

const openForm = (kind: 'contact' | 'customer' | 'settlement') => {
  if (kind === 'contact') contactError.value = '';
  else if (kind === 'customer') customerError.value = '';
  else settlementError.value = '';
  setFormBaseline(kind);
  setFormVisible(kind, true);
  nextTick(() => {
    if (kind === 'contact') contactFormRef.value?.clearValidate();
    else if (kind === 'customer') customerFormRef.value?.clearValidate();
    else settlementFormRef.value?.clearValidate();
  });
};

const beforeFormCancel = (kind: 'contact' | 'customer' | 'settlement') => {
  if (isFormSubmitting(kind)) return false;
  if (!isFormDirty(kind)) return true;
  discardTarget.value = kind;
  discardVisible.value = true;
  return false;
};

const confirmDiscard = () => {
  setFormVisible(discardTarget.value, false);
  formBaselines[discardTarget.value] = JSON.stringify(currentForm(discardTarget.value));
  return true;
};

const submitContact = async () => {
  const errors = await contactFormRef.value?.validate();
  if (errors) { await focusFirstError(); return false; }
  contactSubmitting.value = true;
  contactError.value = '';
  await wait(formBehavior.value === 'slow' ? 1400 : 260);
  if (formBehavior.value === 'failure') {
    contactError.value = t('interactionAcceptance.form.errors.contactConflict');
    contactSubmitting.value = false;
    return false;
  }
  savedFormSummary.contact = contactForm.name;
  setFormBaseline('contact');
  contactSubmitting.value = false;
  Message.success(t('interactionAcceptance.form.messages.contactSaved', { name: contactForm.name }));
  return true;
};

const submitCustomer = async () => {
  const errors = await customerFormRef.value?.validate();
  if (errors) { await focusFirstError(); return false; }
  customerSubmitting.value = true;
  customerError.value = '';
  await wait(formBehavior.value === 'slow' ? 1400 : 300);
  if (formBehavior.value === 'failure') {
    customerError.value = t('interactionAcceptance.form.errors.customerDuplicate');
    customerSubmitting.value = false;
    return false;
  }
  savedFormSummary.customer = customerForm.customerName;
  setFormBaseline('customer');
  customerSubmitting.value = false;
  Message.success(t('interactionAcceptance.form.messages.customerSaved', { name: customerForm.customerName }));
  return true;
};

const submitSettlement = async () => {
  const errors = await settlementFormRef.value?.validate();
  if (errors) { await focusFirstError(); return false; }
  settlementSubmitting.value = true;
  settlementError.value = '';
  await wait(formBehavior.value === 'slow' ? 1500 : 340);
  if (formBehavior.value === 'failure') {
    settlementError.value = t('interactionAcceptance.form.errors.bankRejected');
    settlementSubmitting.value = false;
    return false;
  }
  savedFormSummary.settlement = settlementForm.paymentTerm;
  setFormBaseline('settlement');
  settlementSubmitting.value = false;
  Message.success(t('interactionAcceptance.form.messages.settlementSaved'));
  return true;
};

// Button and action hierarchy scenario
const actionBehavior = ref<ActionBehavior>('normal');
const taskTable = ref<VxeTableInstance>();
const selectedTasks = ref<AcceptanceTaskRow[]>([]);
const taskPendingId = ref('');
const batchSubmitting = ref(false);
const batchConfirmVisible = ref(false);
const deleteTaskVisible = ref(false);
const deleteTaskTarget = ref<AcceptanceTaskRow>();
const batchFeedback = ref<{ success: number; failed: string[] }>();
const taskPage = reactive({ current: 1, size: 20 });
const tasks = ref<AcceptanceTaskRow[]>([
  { id: 'task-1', taskNo: 'SI-20260805-001', state: 'pending', customer: '华东精密设备有限公司', owner: '未分配', nextAction: '补充收货人信息', updatedAt: '2026-08-05 10:20:00' },
  { id: 'task-2', taskNo: 'SI-20260805-002', state: 'processing', customer: '宁波海创供应链有限公司', owner: 'Kevin', nextAction: '复核提单草稿', updatedAt: '2026-08-05 10:45:00' },
  { id: 'task-3', taskNo: 'SI-20260805-003', state: 'pending', customer: '苏州远航机电有限公司', owner: 'Alik', nextAction: '上传装箱资料', updatedAt: '2026-08-05 11:10:00' },
  { id: 'task-4', taskNo: 'SI-20260805-004', state: 'completed', customer: '上海博联国际贸易有限公司', owner: 'Chris', nextAction: '已完成', updatedAt: '2026-08-05 11:38:00' },
  { id: 'task-5', taskNo: 'SI-20260805-005', state: 'processing', customer: '杭州新桥科技有限公司', owner: 'Iris', nextAction: '确认通知方', updatedAt: '2026-08-05 12:06:00' },
  { id: 'task-6', taskNo: 'SI-20260805-006', state: 'pending', customer: '无锡联合制造有限公司', owner: '未分配', nextAction: '补充唛头信息', updatedAt: '2026-08-05 13:16:00' },
]);

const actionPermissionDenied = computed(() => actionBehavior.value === 'permission');
const actionForcedPending = computed(() => actionBehavior.value === 'pending');
const onTaskSelectionChange = () => { selectedTasks.value = (taskTable.value?.getCheckboxRecords() ?? []) as AcceptanceTaskRow[]; };
const clearTaskSelection = () => {
  taskTable.value?.clearCheckboxRow();
  selectedTasks.value = [];
};

const createTask = async () => {
  if (actionForcedPending.value) return;
  const sequence = tasks.value.length + 1;
  tasks.value.unshift({ id: `task-local-${Date.now()}`, taskNo: `SI-20260805-${String(sequence).padStart(3, '0')}`, state: 'pending', customer: t('interactionAcceptance.actions.newCustomer'), owner: '未分配', nextAction: t('interactionAcceptance.actions.newNextAction'), updatedAt: buildDateTimeStamp() });
  Message.success(t('interactionAcceptance.actions.messages.created'));
};

const progressTask = async (row: AcceptanceTaskRow) => {
  if (taskPendingId.value || actionForcedPending.value) return;
  taskPendingId.value = row.id;
  await wait(260);
  row.state = row.state === 'pending' ? 'processing' : 'completed';
  row.nextAction = row.state === 'processing' ? t('interactionAcceptance.actions.reviewNextAction') : t('interactionAcceptance.actions.completed');
  row.updatedAt = buildDateTimeStamp();
  taskPendingId.value = '';
  Message.success(t('interactionAcceptance.actions.messages.progressed', { no: row.taskNo }));
};

const assignTask = async (row: AcceptanceTaskRow) => {
  if (taskPendingId.value || actionForcedPending.value) return;
  taskPendingId.value = row.id;
  await wait(220);
  row.owner = 'admin';
  row.updatedAt = buildDateTimeStamp();
  taskPendingId.value = '';
  Message.success(t('interactionAcceptance.actions.messages.assigned', { no: row.taskNo }));
};

const openBatchConfirm = () => {
  if (!selectedTasks.value.length) { Message.warning(t('interactionAcceptance.actions.messages.selectFirst')); return; }
  batchConfirmVisible.value = true;
};

const confirmBatchProgress = async () => {
  if (!selectedTasks.value.length || batchSubmitting.value) return false;
  batchSubmitting.value = true;
  const submitted = [...selectedTasks.value];
  await wait(520);
  const failed = actionBehavior.value === 'partial' ? submitted.filter((_, index) => index % 2 === 0) : [];
  const failedIds = new Set(failed.map((row) => row.id));
  const succeeded = submitted.filter((row) => !failedIds.has(row.id));
  succeeded.forEach((row) => { row.state = 'processing'; row.nextAction = t('interactionAcceptance.actions.reviewNextAction'); row.updatedAt = buildDateTimeStamp(); });
  clearTaskSelection();
  if (failed.length) {
    taskTable.value?.setCheckboxRow(failed, true);
    selectedTasks.value = failed;
    batchFeedback.value = { success: succeeded.length, failed: failed.map((row) => row.taskNo) };
    Message.warning(t('interactionAcceptance.actions.messages.partial', { success: succeeded.length, failed: failed.length }));
  } else {
    batchFeedback.value = undefined;
    Message.success(t('interactionAcceptance.actions.messages.batchSuccess', { count: succeeded.length }));
  }
  batchSubmitting.value = false;
  return true;
};

const openDeleteTask = (row: AcceptanceTaskRow) => { deleteTaskTarget.value = row; deleteTaskVisible.value = true; };
const confirmDeleteTask = async () => {
  if (!deleteTaskTarget.value) return false;
  await wait(240);
  const no = deleteTaskTarget.value.taskNo;
  tasks.value = tasks.value.filter((row) => row.id !== deleteTaskTarget.value?.id);
  clearTaskSelection();
  Message.success(t('interactionAcceptance.actions.messages.deleted', { no }));
  return true;
};
const retryFailedTasks = () => { actionBehavior.value = 'normal'; batchFeedback.value = undefined; Message.success(t('interactionAcceptance.actions.messages.retryReady')); };
const downloadTask = (row: AcceptanceTaskRow) => Message.success(t('interactionAcceptance.actions.messages.downloaded', { no: row.taskNo }));
const refreshTasks = () => Message.success(t('interactionAcceptance.actions.messages.refreshed'));

watch(actionBehavior, () => {
  clearTaskSelection();
  batchFeedback.value = undefined;
});

// Feedback and state scenario
const feedbackBehavior = ref<FeedbackBehavior>('success');
const feedbackRetrying = ref(false);
const documentFormRef = ref<FormInstance>();
const documentForm = reactive({ consignee: '', notifyParty: '', remark: '' });
const submitDocumentValidation = async () => {
  const errors = await documentFormRef.value?.validate();
  if (errors) return;
  Message.success(t('interactionAcceptance.feedback.messages.submitted'));
};
const recoverFeedback = async () => {
  if (feedbackRetrying.value) return;
  feedbackRetrying.value = true;
  await wait(520);
  feedbackBehavior.value = 'success';
  feedbackRetrying.value = false;
  Message.success(t('interactionAcceptance.feedback.messages.recovered'));
};
const downloadFeedback = () => Message.success(t('interactionAcceptance.feedback.messages.downloaded'));
</script>

<template>
  <StandardListFrame page-id="ui-acceptance-interaction-scenarios" data-pesdp-page="ui-acceptance-interaction-scenarios" :command-visible="false">
    <template #pageMode>
      <a-radio-group type="button" size="small" :model-value="scenario" :aria-label="t('interactionAcceptance.scenarioLabel')" @change="onScenarioChange">
        <a-radio value="form-overlays">{{ t('interactionAcceptance.scenarios.form') }}</a-radio>
        <a-radio value="action-hierarchy">{{ t('interactionAcceptance.scenarios.actions') }}</a-radio>
        <a-radio value="feedback-states">{{ t('interactionAcceptance.scenarios.feedback') }}</a-radio>
      </a-radio-group>
    </template>

    <template #toolbar>
      <div v-if="scenario === 'form-overlays'" class="scenario-toolbar">
        <div class="scenario-toolbar__identity">
          <strong>{{ t('interactionAcceptance.form.object') }}</strong>
          <span class="s-pill" data-s="draft">{{ t('interactionAcceptance.form.state') }}</span>
        </div>
        <a-radio-group v-model="formBehavior" type="button" size="mini" :aria-label="t('interactionAcceptance.form.behaviorLabel')">
          <a-radio value="normal">{{ t('interactionAcceptance.behaviors.normal') }}</a-radio>
          <a-radio value="slow">{{ t('interactionAcceptance.behaviors.slow') }}</a-radio>
          <a-radio value="failure">{{ t('interactionAcceptance.behaviors.failure') }}</a-radio>
        </a-radio-group>
      </div>

      <WorkbenchTableToolbar v-else-if="scenario === 'action-hierarchy'" :current="taskPage.current" :page-size="taskPage.size" :total="tasks.length">
        <template #commands>
          <div class="table-command-group">
            <a-button v-if="!actionPermissionDenied" size="small" type="primary" :loading="actionForcedPending" @click="createTask">
              <template #icon><icon-plus /></template>{{ t('interactionAcceptance.actions.create') }}
            </a-button>
            <a-button v-if="!actionPermissionDenied" size="small" type="outline" :disabled="!selectedTasks.length || actionForcedPending" @click="openBatchConfirm">{{ t('interactionAcceptance.actions.batch') }}</a-button>
            <div v-if="selectedTasks.length" class="selection-context">
              <span class="selection-tip">{{ t('common.selected', { count: selectedTasks.length }) }}</span>
              <a-button size="small" type="text" @click="clearTaskSelection">{{ t('common.clear') }}</a-button>
            </div>
          </div>
        </template>
        <template #utilities>
          <a-select v-model="actionBehavior" size="small" class="behavior-select" :aria-label="t('interactionAcceptance.actions.behaviorLabel')">
            <a-option value="normal">{{ t('interactionAcceptance.behaviors.normal') }}</a-option>
            <a-option value="permission">{{ t('interactionAcceptance.behaviors.permission') }}</a-option>
            <a-option value="pending">{{ t('interactionAcceptance.behaviors.pending') }}</a-option>
            <a-option value="partial">{{ t('interactionAcceptance.behaviors.partial') }}</a-option>
          </a-select>
          <a-tooltip :content="t('common.refresh')">
            <a-button size="small" type="text" class="table-cap-tool" :aria-label="t('common.refresh')" @click="refreshTasks"><icon-refresh /></a-button>
          </a-tooltip>
        </template>
      </WorkbenchTableToolbar>

      <div v-else class="scenario-toolbar">
        <div class="scenario-toolbar__identity">
          <strong>{{ t('interactionAcceptance.feedback.object') }}</strong>
          <span class="s-pill" data-s="op">{{ t('interactionAcceptance.feedback.state') }}</span>
        </div>
        <a-select v-model="feedbackBehavior" size="small" class="feedback-state-select" :aria-label="t('interactionAcceptance.feedback.behaviorLabel')">
          <a-option value="success">{{ t('interactionAcceptance.feedback.states.success') }}</a-option>
          <a-option value="loading">{{ t('interactionAcceptance.feedback.states.loading') }}</a-option>
          <a-option value="slow">{{ t('interactionAcceptance.feedback.states.slow') }}</a-option>
          <a-option value="empty">{{ t('interactionAcceptance.feedback.states.empty') }}</a-option>
          <a-option value="permission">{{ t('interactionAcceptance.feedback.states.permission') }}</a-option>
          <a-option value="network">{{ t('interactionAcceptance.feedback.states.network') }}</a-option>
          <a-option value="validation">{{ t('interactionAcceptance.feedback.states.validation') }}</a-option>
          <a-option value="partial">{{ t('interactionAcceptance.feedback.states.partial') }}</a-option>
          <a-option value="long">{{ t('interactionAcceptance.feedback.states.long') }}</a-option>
        </a-select>
      </div>
    </template>

    <template #feedback>
      <a-alert v-if="scenario === 'action-hierarchy' && batchFeedback" type="warning" class="batch-result-alert">
        {{ t('interactionAcceptance.actions.partialAlert', { success: batchFeedback.success, failed: batchFeedback.failed.length, tasks: batchFeedback.failed.join('、') }) }}
        <template #action><a-button size="mini" type="text" @click="retryFailedTasks">{{ t('interactionAcceptance.actions.retry') }}</a-button></template>
      </a-alert>
    </template>

    <template #table>
      <div v-if="scenario === 'form-overlays'" class="scenario-canvas form-canvas">
        <section class="preview-module">
          <div class="preview-module__head">
            <div><h3>{{ t('interactionAcceptance.form.modules.contact') }}</h3><span>{{ savedFormSummary.contact }}</span></div>
            <a-button size="small" type="outline" @click="openForm('contact')"><template #icon><icon-plus /></template>{{ t('interactionAcceptance.form.actions.contact') }}</a-button>
          </div>
          <a-descriptions :column="3" size="small" bordered>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.contactName')">Lin Chen</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.phone')">138 0013 8000</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.email')">lin.chen@example.com</a-descriptions-item>
          </a-descriptions>
        </section>
        <section class="preview-module">
          <div class="preview-module__head">
            <div><h3>{{ t('interactionAcceptance.form.modules.customer') }}</h3><span>{{ savedFormSummary.customer }}</span></div>
            <a-button size="small" type="outline" @click="openForm('customer')">{{ t('interactionAcceptance.form.actions.customer') }}</a-button>
          </div>
          <a-descriptions :column="3" size="small" bordered>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.customerType')">{{ t('interactionAcceptance.form.options.direct') }}</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.owner')">admin</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.address')">{{ customerForm.address }}</a-descriptions-item>
          </a-descriptions>
        </section>
        <section class="preview-module">
          <div class="preview-module__head">
            <div><h3>{{ t('interactionAcceptance.form.modules.settlement') }}</h3><span>{{ t(`interactionAcceptance.form.options.${savedFormSummary.settlement}`) }}</span></div>
            <a-button size="small" type="outline" @click="openForm('settlement')">{{ t('interactionAcceptance.form.actions.settlement') }}</a-button>
          </div>
          <a-descriptions :column="3" size="small" bordered>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.currency')">CNY</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.bankName')">{{ settlementForm.bankName }}</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.form.fields.invoiceEmail')">{{ settlementForm.invoiceEmail }}</a-descriptions-item>
          </a-descriptions>
        </section>
      </div>

      <vxe-table
        v-else-if="scenario === 'action-hierarchy'"
        ref="taskTable"
        :data="tasks"
        height="100%"
        auto-resize
        fit
        show-overflow="title"
        :loading="actionForcedPending"
        :row-config="stableTableRowConfig"
        @checkbox-change="onTaskSelectionChange"
        @checkbox-all="onTaskSelectionChange"
      >
        <vxe-column v-if="!actionPermissionDenied" type="checkbox" width="40" fixed="left" />
        <vxe-column type="seq" :title="t('common.sequence')" width="52" fixed="left" align="center" />
        <vxe-column field="taskNo" :title="t('interactionAcceptance.actions.columns.taskNo')" min-width="168" fixed="left" class-name="mono" />
        <vxe-column field="state" :title="t('interactionAcceptance.actions.columns.state')" min-width="100" align="center">
          <template #default="{ row }"><span class="s-pill" :data-s="row.state === 'pending' ? 'wait' : row.state === 'processing' ? 'op' : 'acc'">{{ t(`interactionAcceptance.actions.states.${row.state}`) }}</span></template>
        </vxe-column>
        <vxe-column field="customer" :title="t('interactionAcceptance.actions.columns.customer')" min-width="220" />
        <vxe-column field="owner" :title="t('interactionAcceptance.actions.columns.owner')" min-width="110" />
        <vxe-column field="nextAction" :title="t('interactionAcceptance.actions.columns.nextAction')" min-width="180" />
        <vxe-column field="updatedAt" :title="t('interactionAcceptance.actions.columns.updatedAt')" min-width="150" class-name="mono" />
        <vxe-column v-if="!actionPermissionDenied" :title="t('common.operations')" width="196" fixed="right" align="left" header-align="center">
          <template #default="{ row }">
            <a-space class="row-actions" :size="2">
              <a-button v-if="row.state !== 'completed'" size="mini" type="text" class="row-action-btn" :loading="taskPendingId === row.id" :disabled="actionForcedPending" @click="progressTask(row)">{{ t('interactionAcceptance.actions.progress') }}</a-button>
              <a-button size="mini" type="text" class="row-action-btn row-action-btn--secondary" :disabled="actionForcedPending || row.owner === 'admin'" @click="assignTask(row)">{{ t('interactionAcceptance.actions.assignMe') }}</a-button>
              <a-dropdown trigger="click" position="br">
                <a-tooltip :content="t('common.moreActions')"><a-button size="mini" type="text" class="row-action-btn row-action-btn--more" :aria-label="t('common.moreActions')" :disabled="actionForcedPending"><icon-more /></a-button></a-tooltip>
                <template #content>
                  <a-doption @click="downloadTask(row)">{{ t('interactionAcceptance.actions.download') }}</a-doption>
                  <a-divider :margin="4" />
                  <a-doption class="danger-opt" @click="openDeleteTask(row)">{{ t('interactionAcceptance.actions.delete') }}</a-doption>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </vxe-column>
      </vxe-table>

      <div v-else class="scenario-canvas feedback-canvas">
        <a-spin v-if="feedbackBehavior === 'loading' || feedbackBehavior === 'slow'" :loading="true" :tip="feedbackBehavior === 'slow' ? t('interactionAcceptance.feedback.copy.slow') : t('interactionAcceptance.feedback.copy.loading')" class="feedback-spin">
          <a-skeleton :animation="true"><a-skeleton-line :rows="6" /></a-skeleton>
        </a-spin>

        <WorkbenchEmptyState v-else-if="feedbackBehavior === 'empty'" kind="empty" :title="t('interactionAcceptance.feedback.copy.emptyTitle')" :description="t('interactionAcceptance.feedback.copy.emptyDesc')">
          <template #actions><a-button size="small" type="primary" @click="recoverFeedback">{{ t('interactionAcceptance.feedback.actions.create') }}</a-button></template>
        </WorkbenchEmptyState>

        <WorkbenchEmptyState v-else-if="feedbackBehavior === 'permission'" kind="permission" :title="t('interactionAcceptance.feedback.copy.permissionTitle')" :description="t('interactionAcceptance.feedback.copy.permissionDesc')" />

        <WorkbenchEmptyState v-else-if="feedbackBehavior === 'network'" kind="error" :title="t('interactionAcceptance.feedback.copy.networkTitle')" :description="t('interactionAcceptance.feedback.copy.networkDesc')">
          <template #actions><a-button size="small" type="text" :loading="feedbackRetrying" @click="recoverFeedback">{{ t('interactionAcceptance.feedback.actions.retry') }}</a-button></template>
        </WorkbenchEmptyState>

        <section v-else-if="feedbackBehavior === 'validation'" class="feedback-work-surface">
          <div class="feedback-work-surface__head"><div><h3>{{ t('interactionAcceptance.feedback.copy.validationTitle') }}</h3><span class="s-pill" data-s="rej">{{ t('interactionAcceptance.feedback.states.validation') }}</span></div><a-button size="small" type="primary" @click="submitDocumentValidation">{{ t('interactionAcceptance.feedback.actions.submit') }}</a-button></div>
          <a-form ref="documentFormRef" :model="documentForm" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
            <a-row :gutter="denseFormGridGutter">
              <a-col :span="12"><a-form-item field="consignee" :label="t('interactionAcceptance.feedback.fields.consignee')" :rules="[{ required: true, message: t('interactionAcceptance.feedback.validation.consignee') }]" :style="denseFormItemStyle"><a-input v-model="documentForm.consignee" /></a-form-item></a-col>
              <a-col :span="12"><a-form-item field="notifyParty" :label="t('interactionAcceptance.feedback.fields.notifyParty')" :rules="[{ required: true, message: t('interactionAcceptance.feedback.validation.notifyParty') }]" :style="denseFormItemStyle"><a-input v-model="documentForm.notifyParty" /></a-form-item></a-col>
              <a-col :span="24"><a-form-item field="remark" :label="t('interactionAcceptance.feedback.fields.remark')" :style="denseFormItemStyle"><a-textarea v-model="documentForm.remark" :max-length="200" /></a-form-item></a-col>
            </a-row>
          </a-form>
        </section>

        <section v-else-if="feedbackBehavior === 'partial'" class="feedback-work-surface">
          <a-alert type="warning">{{ t('interactionAcceptance.feedback.copy.partialAlert') }}<template #action><a-button size="small" type="text" :loading="feedbackRetrying" @click="recoverFeedback">{{ t('interactionAcceptance.feedback.actions.retryFailed') }}</a-button></template></a-alert>
          <div class="feedback-result-list">
            <div><span class="mono">SI-20260805-002</span><span>{{ t('interactionAcceptance.feedback.documents.consignee') }}</span><span class="s-pill" data-s="acc">{{ t('interactionAcceptance.feedback.result.success') }}</span></div>
            <div><span class="mono">SI-20260805-003</span><span>{{ t('interactionAcceptance.feedback.documents.notifyParty') }}</span><span class="s-pill" data-s="rej">{{ t('interactionAcceptance.feedback.result.failed') }}</span></div>
            <div><span class="mono">SI-20260805-006</span><span>{{ t('interactionAcceptance.feedback.documents.marks') }}</span><span class="s-pill" data-s="rej">{{ t('interactionAcceptance.feedback.result.failed') }}</span></div>
          </div>
        </section>

        <section v-else class="feedback-work-surface">
          <div class="feedback-work-surface__head"><div><h3>{{ t('interactionAcceptance.feedback.copy.successTitle') }}</h3><span class="s-pill" :data-s="feedbackBehavior === 'long' ? 'wait' : 'acc'">{{ feedbackBehavior === 'long' ? t('interactionAcceptance.feedback.states.long') : t('interactionAcceptance.feedback.result.success') }}</span></div><a-button size="small" type="outline" @click="downloadFeedback">{{ t('interactionAcceptance.feedback.actions.download') }}</a-button></div>
          <a-descriptions :column="2" size="small" bordered>
            <a-descriptions-item :label="t('interactionAcceptance.feedback.fields.taskNo')"><span class="mono">SI-20260805-001</span></a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.feedback.fields.owner')">admin</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.feedback.fields.customer')">{{ feedbackBehavior === 'long' ? t('interactionAcceptance.feedback.long.customer') : '华东精密设备有限公司' }}</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.feedback.fields.route')">SHANGHAI, CN → HAMBURG, DE</a-descriptions-item>
            <a-descriptions-item :label="t('interactionAcceptance.feedback.fields.remark')" :span="2">{{ feedbackBehavior === 'long' ? t('interactionAcceptance.feedback.long.remark') : t('interactionAcceptance.feedback.copy.successRemark') }}</a-descriptions-item>
          </a-descriptions>
        </section>
      </div>
    </template>
  </StandardListFrame>

  <a-modal v-model:visible="contactVisible" :title="t('interactionAcceptance.form.modal.contactTitle')" :width="480" :mask-closable="false" :esc-to-close="false" :unmount-on-close="true" :ok-text="t('common.save')" :ok-loading="contactSubmitting" :ok-button-props="{ size: 'small' }" :cancel-button-props="{ size: 'small' }" :on-before-ok="submitContact" :on-before-cancel="() => beforeFormCancel('contact')">
    <a-alert v-if="contactError" type="error" class="overlay-error">{{ contactError }}</a-alert>
    <a-form ref="contactFormRef" :model="contactForm" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
      <a-row :gutter="denseFormGridGutter">
        <a-col :span="24"><a-form-item field="name" :label="t('interactionAcceptance.form.fields.contactName')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.contactName') }]" :style="denseFormItemStyle"><a-input v-model="contactForm.name" /></a-form-item></a-col>
        <a-col :span="24"><a-form-item field="phone" :label="t('interactionAcceptance.form.fields.phone')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.phone') }]" :style="denseFormItemStyle"><a-input v-model="contactForm.phone" /></a-form-item></a-col>
        <a-col :span="24"><a-form-item field="email" :label="t('interactionAcceptance.form.fields.email')" :rules="[{ type: 'email', message: t('interactionAcceptance.form.validation.email') }]" :style="denseFormItemStyle"><a-input v-model="contactForm.email" /></a-form-item></a-col>
      </a-row>
    </a-form>
  </a-modal>

  <a-modal v-model:visible="customerVisible" :title="t('interactionAcceptance.form.modal.customerTitle')" :width="560" :mask-closable="false" :esc-to-close="false" :unmount-on-close="true" :ok-text="t('common.save')" :ok-loading="customerSubmitting" :ok-button-props="{ size: 'small' }" :cancel-button-props="{ size: 'small' }" :on-before-ok="submitCustomer" :on-before-cancel="() => beforeFormCancel('customer')">
    <a-alert v-if="customerError" type="error" class="overlay-error">{{ customerError }}</a-alert>
    <a-form ref="customerFormRef" :model="customerForm" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
      <a-row :gutter="denseFormGridGutter">
        <a-col :span="12"><a-form-item field="customerName" :label="t('interactionAcceptance.form.fields.customerName')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.customerName') }]" :style="denseFormItemStyle"><a-input v-model="customerForm.customerName" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="customerType" :label="t('interactionAcceptance.form.fields.customerType')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.customerType') }]" :style="denseFormItemStyle"><a-select v-model="customerForm.customerType"><a-option value="direct">{{ t('interactionAcceptance.form.options.direct') }}</a-option><a-option value="peer">{{ t('interactionAcceptance.form.options.peer') }}</a-option></a-select></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="owner" :label="t('interactionAcceptance.form.fields.owner')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.owner') }]" :style="denseFormItemStyle"><a-select v-model="customerForm.owner"><a-option value="admin">admin</a-option><a-option value="Kevin">Kevin</a-option></a-select></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="phone" :label="t('interactionAcceptance.form.fields.phone')" :style="denseFormItemStyle"><a-input v-model="customerForm.phone" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="email" :label="t('interactionAcceptance.form.fields.email')" :rules="[{ type: 'email', message: t('interactionAcceptance.form.validation.email') }]" :style="denseFormItemStyle"><a-input v-model="customerForm.email" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="address" :label="t('interactionAcceptance.form.fields.address')" :style="denseFormItemStyle"><a-input v-model="customerForm.address" /></a-form-item></a-col>
      </a-row>
    </a-form>
  </a-modal>

  <a-modal v-model:visible="settlementVisible" :title="t('interactionAcceptance.form.modal.settlementTitle')" :width="760" :mask-closable="false" :esc-to-close="false" :unmount-on-close="true" :ok-text="t('common.save')" :ok-loading="settlementSubmitting" :ok-button-props="{ size: 'small' }" :cancel-button-props="{ size: 'small' }" :on-before-ok="submitSettlement" :on-before-cancel="() => beforeFormCancel('settlement')">
    <a-alert v-if="settlementError" type="error" class="overlay-error">{{ settlementError }}</a-alert>
    <a-form ref="settlementFormRef" :model="settlementForm" layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle">
      <section class="overlay-section"><h3>{{ t('interactionAcceptance.form.groups.billing') }}</h3><a-row :gutter="denseFormGridGutter">
        <a-col :span="12"><a-form-item field="companyName" :label="t('interactionAcceptance.form.fields.companyName')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.companyName') }]" :style="denseFormItemStyle"><a-input v-model="settlementForm.companyName" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="taxNo" :label="t('interactionAcceptance.form.fields.taxNo')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.taxNo') }]" :style="denseFormItemStyle"><a-input v-model="settlementForm.taxNo" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="currency" :label="t('interactionAcceptance.form.fields.currency')" :style="denseFormItemStyle"><a-select v-model="settlementForm.currency"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="paymentTerm" :label="t('interactionAcceptance.form.fields.paymentTerm')" :style="denseFormItemStyle"><a-select v-model="settlementForm.paymentTerm"><a-option value="monthly">{{ t('interactionAcceptance.form.options.monthly') }}</a-option><a-option value="prepaid">{{ t('interactionAcceptance.form.options.prepaid') }}</a-option></a-select></a-form-item></a-col>
      </a-row></section>
      <section class="overlay-section"><h3>{{ t('interactionAcceptance.form.groups.bankInvoice') }}</h3><a-row :gutter="denseFormGridGutter">
        <a-col :span="12"><a-form-item field="bankName" :label="t('interactionAcceptance.form.fields.bankName')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.bankName') }]" :style="denseFormItemStyle"><a-input v-model="settlementForm.bankName" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="bankAccount" :label="t('interactionAcceptance.form.fields.bankAccount')" :rules="[{ required: true, message: t('interactionAcceptance.form.validation.bankAccount') }]" :style="denseFormItemStyle"><a-input v-model="settlementForm.bankAccount" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="invoiceTitle" :label="t('interactionAcceptance.form.fields.invoiceTitle')" :style="denseFormItemStyle"><a-input v-model="settlementForm.invoiceTitle" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="invoiceEmail" :label="t('interactionAcceptance.form.fields.invoiceEmail')" :rules="[{ type: 'email', message: t('interactionAcceptance.form.validation.email') }]" :style="denseFormItemStyle"><a-input v-model="settlementForm.invoiceEmail" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="billingAddress" :label="t('interactionAcceptance.form.fields.billingAddress')" :style="denseFormItemStyle"><a-input v-model="settlementForm.billingAddress" /></a-form-item></a-col>
        <a-col :span="12"><a-form-item field="remark" :label="t('interactionAcceptance.form.fields.remark')" :style="denseFormItemStyle"><a-input v-model="settlementForm.remark" /></a-form-item></a-col>
      </a-row></section>
    </a-form>
  </a-modal>

  <a-modal v-model:visible="discardVisible" :title="t('interactionAcceptance.form.discard.title')" :width="420" :mask-closable="false" :ok-text="t('interactionAcceptance.form.discard.ok')" :ok-button-props="{ status: 'danger', size: 'small' }" :cancel-button-props="{ size: 'small' }" :on-before-ok="confirmDiscard"><p class="confirm-copy">{{ t('interactionAcceptance.form.discard.copy') }}</p></a-modal>

  <a-modal v-model:visible="batchConfirmVisible" :title="t('interactionAcceptance.actions.batchConfirm.title')" :width="420" :mask-closable="false" :ok-text="t('interactionAcceptance.actions.batchConfirm.ok')" :ok-loading="batchSubmitting" :ok-button-props="{ size: 'small' }" :cancel-button-props="{ size: 'small' }" :on-before-ok="confirmBatchProgress"><p class="confirm-copy">{{ t('interactionAcceptance.actions.batchConfirm.copy', { count: selectedTasks.length }) }}</p></a-modal>

  <a-modal v-model:visible="deleteTaskVisible" :title="t('interactionAcceptance.actions.deleteConfirm.title')" :width="420" :mask-closable="false" :ok-text="t('interactionAcceptance.actions.deleteConfirm.ok')" :ok-button-props="{ status: 'danger', size: 'small' }" :cancel-button-props="{ size: 'small' }" :on-before-ok="confirmDeleteTask"><p class="confirm-copy">{{ t('interactionAcceptance.actions.deleteConfirm.copy', { no: deleteTaskTarget?.taskNo }) }}</p></a-modal>
</template>

<style scoped>
.scenario-toolbar,
.scenario-toolbar__identity,
.preview-module__head,
.feedback-work-surface__head {
  display: flex;
  align-items: center;
}

.scenario-toolbar,
.preview-module__head,
.feedback-work-surface__head {
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.scenario-toolbar__identity {
  gap: 8px;
  min-width: 0;
}

.scenario-toolbar__identity strong {
  color: var(--color-text-1);
  font-size: var(--dense-font-field);
}

.scenario-canvas {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  background: var(--color-bg-card);
}

.form-canvas {
  padding: 0 12px 12px;
}

.preview-module {
  padding: 12px 0;
}

.preview-module + .preview-module {
  border-top: 1px solid var(--color-border-1);
}

.preview-module__head {
  margin-bottom: 10px;
}

.preview-module__head h3,
.feedback-work-surface__head h3,
.overlay-section h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: var(--dense-font-field);
  font-weight: var(--dense-weight-title);
  line-height: 20px;
}

.preview-module__head span {
  display: block;
  margin-top: 2px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.behavior-select {
  width: 116px;
}

.feedback-state-select {
  width: 156px;
}

.row-actions {
  white-space: nowrap;
}

.row-action-btn {
  padding-inline: 5px;
}

.row-action-btn--secondary {
  color: var(--color-text-2);
}

.row-action-btn--more {
  width: 24px;
  padding-inline: 0;
  color: var(--color-text-3);
}

.feedback-canvas {
  padding: 12px;
}

.feedback-spin {
  display: block;
  min-height: 320px;
  padding: 20px;
}

.feedback-work-surface {
  min-height: 260px;
}

.feedback-work-surface__head {
  margin-bottom: 12px;
}

.feedback-work-surface__head > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-result-list {
  margin-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.feedback-result-list > div {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) 88px;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  border-bottom: 1px solid var(--color-border-1);
}

.overlay-error {
  margin-bottom: 12px;
}

.overlay-section + .overlay-section {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.overlay-section h3 {
  margin-bottom: 8px;
  color: var(--color-text-2);
}

.confirm-copy {
  margin: 0;
  color: var(--color-text-2);
  line-height: 20px;
}

@media (max-width: 1199px) {
  .feedback-result-list > div {
    grid-template-columns: 150px minmax(0, 1fr) 76px;
  }
}
</style>
