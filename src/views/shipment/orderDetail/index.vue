<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconDown, IconPlus, IconPrinter } from '@arco-design/web-vue/es/icon';
import OrderInfoTab from './components/OrderInfoTab.vue';
import { getShipmentOrderMock } from './mockData';
import type { ShipmentOrderDetailRecord } from './types';

const route = useRoute();
const router = useRouter();
const activeTab = ref('basic');
const submitting = ref(false);
const statusModalVisible = ref(false);
const statusForm = reactive({ targetStatus: undefined as string | undefined, reason: '', notify: true, createNode: true });

const loadRecord = (orderNo?: string) =>
  JSON.parse(JSON.stringify(getShipmentOrderMock(orderNo))) as ShipmentOrderDetailRecord;

const form = reactive<ShipmentOrderDetailRecord>(loadRecord(
  typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined,
));

const milestoneItems = computed(() => {
  const source = form.nodes.slice(0, 5);
  const firstPendingIndex = source.findIndex((item) => item.statusKey !== 'rel');

  return source.map((item, index) => ({
    id: item.id,
    label: item.name,
    state: item.statusKey === 'rel'
      ? 'done'
      : index === firstPendingIndex
        ? 'current'
        : 'upcoming',
  }));
});

const fileMissingCount = computed(() => form.files.filter((item) => item.statusKey === 'rej').length);
const pendingRiskCount = computed(() => form.risks.filter((item) => item.status !== '已关闭').length);
const pendingTodoCount = computed(() => form.todos.filter((item) => item.status !== '已完成').length);
const feePendingCount = computed(() => form.receivableFees.filter((item) => item.statusKey === 'wait').length + form.payableFees.filter((item) => item.statusKey === 'wait').length);
const currentNode = computed(() => form.nodes.find((item) => item.statusKey !== 'rel') ?? form.nodes[form.nodes.length - 1]);
const fileStatusSummary = computed(() => fileMissingCount.value > 0 ? `缺 ${fileMissingCount.value} 份` : '已齐套');
const riskSummary = computed(() => pendingRiskCount.value > 0 ? `${pendingRiskCount.value} 项待处理` : '无阻塞');
const feeStatusSummary = computed(() => feePendingCount.value > 0 ? `${feePendingCount.value} 项待确认` : '已确认');
const nextActionSummary = computed(() => currentNode.value?.name ?? '当前无待推进节点');
const pendingFileConfirmCount = computed(() => form.files.filter((item) => item.statusKey === 'wait').length);
const requiredFileCount = computed(() => form.files.filter((item) => item.required).length);
const completedNodeCount = computed(() => form.nodes.filter((item) => item.statusKey === 'rel').length);
const pendingNodeCount = computed(() => form.nodes.filter((item) => item.statusKey !== 'rel').length);
const openExceptionCount = computed(() => form.exceptions.filter((item) => item.statusKey !== 'rel').length);
const receivableLineCount = computed(() => form.receivableFees.length);
const payableLineCount = computed(() => form.payableFees.length);
const profitTone = computed(() => {
  if (form.profitStatusKey === 'acc' || form.profitStatusKey === 'rel') return 'rel';
  if (form.profitStatusKey === 'op') return 'op';
  return 'wait';
});

watch(
  () => route.query.orderNo,
  (orderNo) => {
    Object.assign(form, loadRecord(typeof orderNo === 'string' ? orderNo : undefined));
  },
);

const goBack = () => {
  router.push({ name: 'ShipmentOrderWorkbench' });
};

const handleSave = async () => {
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 400));
  submitting.value = false;
  Message.success('订单已保存');
};

const handleDiscard = () => {
  Object.assign(
    form,
    loadRecord(typeof route.query.orderNo === 'string' ? route.query.orderNo : undefined),
  );
  Message.info('已恢复为上次保存内容');
};

const openStatusModal = () => {
  statusForm.targetStatus = undefined;
  statusForm.reason = '';
  statusModalVisible.value = true;
};

const confirmStatusChange = () => {
  if (!statusForm.targetStatus || !statusForm.reason.trim()) {
    Message.warning('请选择目标状态并填写修改原因');
    return;
  }
  Message.success('状态已更新');
  statusModalVisible.value = false;
};

const handleGenerateFee = () => {
  activeTab.value = 'fees';
  Message.info('请在费用信息 Tab 维护费用明细');
};

const handleUploadFile = () => {
  activeTab.value = 'files';
  Message.info('请在文件资料 Tab 上传文件');
};

const handleNotify = () => {
  Message.success('通知已发送（模拟）');
};

const handleMarkException = () => {
  activeTab.value = 'exceptions';
  addExceptionRow();
};

const handleCancelOrder = () => {
  Message.success('订单已作废');
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
  <div class="shipment-detail-page detail-workbench">
    <a-page-header class="shipment-detail-page__head" @back="goBack">
      <template #title>
        <a-space align="center">
          <span class="link-text link-text--strong mono">{{ form.orderNo }}</span>
          <span class="s-pill" :data-s="form.statusPill">{{ form.orderStatusLabel }}</span>
        </a-space>
      </template>
      <template #subtitle>
        {{ form.customerName }} · {{ form.businessType }} · 操作 {{ form.operator }}
      </template>
      <template #extra>
        <a-space>
          <a-tooltip content="打印">
            <a-button size="small" type="text"><template #icon><icon-printer /></template></a-button>
          </a-tooltip>
          <a-button size="small" @click="openStatusModal">修改状态</a-button>
          <a-button size="small" @click="handleGenerateFee">生成费用</a-button>
          <a-button size="small" @click="handleUploadFile">上传文件</a-button>
          <a-dropdown trigger="click">
            <a-button size="small">
              更多
              <template #icon><icon-down /></template>
            </a-button>
            <template #content>
              <a-doption @click="handleNotify">发送通知</a-doption>
              <a-doption @click="handleMarkException">标记异常</a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </a-page-header>

    <a-card class="shipment-detail-page__hero" size="small">
      <div class="hero-top">
        <div class="hero-route">
          <div class="hero-route__ports">
            <span class="hero-port">{{ form.pol }}</span>
            <span class="hero-arrow">→</span>
            <span class="hero-port">{{ form.pod }}</span>
          </div>
          <span class="hero-sub">{{ form.carrier }} / {{ form.vessel }} {{ form.voyage }}</span>
        </div>
        <div class="hero-dates">
          <div class="hero-fact">
            <span class="hero-fact__label">开船</span>
            <span class="hero-fact__value mono">{{ form.etd }}</span>
          </div>
          <div class="hero-fact">
            <span class="hero-fact__label">截关</span>
            <span class="hero-fact__value mono">{{ form.closingTime }}</span>
          </div>
        </div>
      </div>

      <a-row :gutter="[12, 0]" class="hero-metrics">
        <a-col :span="6">
          <div class="hero-metric">
            <span class="hero-metric__label">利润状态</span>
            <span class="s-pill" :data-s="profitTone">{{ form.profitStatus }}</span>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="hero-metric">
            <span class="hero-metric__label">文件齐套</span>
            <span class="hero-metric__value">{{ fileStatusSummary }}</span>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="hero-metric">
            <span class="hero-metric__label">异常风险</span>
            <span class="hero-metric__value" :class="{ 'hero-metric__value--warn': pendingRiskCount > 0 }">{{ riskSummary }}</span>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="hero-metric">
            <span class="hero-metric__label">下一动作</span>
            <span class="hero-metric__value hero-metric__value--primary">{{ nextActionSummary }}</span>
          </div>
        </a-col>
      </a-row>

      <div class="hero-milestone">
        <span
          v-for="item in milestoneItems"
          :key="item.id"
          class="hero-milestone__item"
          :data-state="item.state"
        >{{ item.label }}</span>
      </div>
    </a-card>

    <div class="shipment-detail-page__body">
      <a-card class="shipment-detail-page__main" size="small" :body-style="{ padding: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }">
        <a-tabs v-model:active-key="activeTab" size="small" class="detail-tabs">
          <a-tab-pane key="basic" title="基本信息">
            <div class="tab-body">
              <order-info-tab v-model:form="form" />
            </div>
          </a-tab-pane>

          <a-tab-pane key="booking" title="订舱信息">
            <div class="tab-body">
              <a-card size="small">
                <template #title>订舱信息</template>
                <template #extra>
                  <a-space size="small">
                    <span class="card-stat">订舱号 {{ form.bookingNo || '待回传' }}</span>
                    <span class="card-stat">舱位 {{ form.spaceStatus }}</span>
                  </a-space>
                </template>

                <a-form layout="vertical" size="small" :model="form">
                  <a-divider orientation="left">订舱主体</a-divider>
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6"><a-form-item label="订舱号"><a-input v-model="form.bookingNo" size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="船公司"><a-input v-model="form.carrier" size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="订舱代理"><a-input v-model="form.bookingAgent" size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="合约号"><a-input v-model="form.contractNo" size="small" allow-clear /></a-form-item></a-col>
                  </a-row>
                  <a-divider orientation="left">节点控制</a-divider>
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6"><a-form-item label="运价编号"><a-input v-model="form.rateNo" size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="舱位状态"><a-input v-model="form.spaceStatus" size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="放舱时间"><a-date-picker v-model="form.releaseTime" size="small" show-time style="width:100%" /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="截 VGM"><a-date-picker v-model="form.vgmCutoff" size="small" show-time style="width:100%" /></a-form-item></a-col>
                    <a-col :span="24"><a-form-item label="订舱备注"><a-textarea v-model="form.bookingRemark" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" /></a-form-item></a-col>
                  </a-row>
                </a-form>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="container" title="柜货信息">
            <div class="tab-body">
              <a-form layout="vertical" size="small" :model="form">
                <a-card title="柜型柜量" size="small">
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6">
                      <a-form-item label="柜型柜量汇总">
                        <a-input v-model="form.containerSummary" size="small" allow-clear placeholder="如 2×40HQ" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-card>
              </a-form>
            </div>
          </a-tab-pane>

          <a-tab-pane key="truck" title="拖车信息">
            <div class="tab-body">
              <a-form layout="vertical" size="small">
                <a-card title="拖车安排" size="small">
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6"><a-form-item label="拖车供应商"><a-input size="small" allow-clear placeholder="请选择供应商" /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="装柜地址"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="装柜时间"><a-date-picker size="small" show-time style="width:100%" /></a-form-item></a-col>
                    <a-col :span="6">
                      <a-form-item label="拖车状态">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="未安排">未安排</a-option>
                          <a-option value="已派车">已派车</a-option>
                          <a-option value="已到厂">已到厂</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6"><a-form-item label="联系人"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="联系电话"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="车牌号"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="箱号"><a-input size="small" allow-clear /></a-form-item></a-col>
                  </a-row>
                </a-card>
              </a-form>
            </div>
          </a-tab-pane>

          <a-tab-pane key="customs" title="报关信息">
            <div class="tab-body">
              <a-form layout="vertical" size="small">
                <a-card title="报关信息" size="small">
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6">
                      <a-form-item label="报关方式">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="一般贸易">一般贸易</a-option>
                          <a-option value="跨境电商">跨境电商</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6"><a-form-item label="报关行"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="报关单号"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6">
                      <a-form-item label="报关状态">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="未提交">未提交</a-option>
                          <a-option value="已提交">已提交</a-option>
                          <a-option value="已放行">已放行</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6"><a-form-item label="截关时间"><a-date-picker v-model="form.closingTime" size="small" show-time style="width:100%" /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="放行时间"><a-date-picker size="small" show-time style="width:100%" /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="查验状态"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="24"><a-form-item label="报关备注"><a-textarea size="small" :auto-size="{ minRows: 2, maxRows: 4 }" /></a-form-item></a-col>
                  </a-row>
                </a-card>
              </a-form>
            </div>
          </a-tab-pane>

          <a-tab-pane key="bl" title="提单信息">
            <div class="tab-body">
              <a-form layout="vertical" size="small">
                <a-card title="提单资料" size="small">
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6"><a-form-item label="MBL No."><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6"><a-form-item label="HBL No."><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6">
                      <a-form-item label="提单类型">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="正本">正本</a-option>
                          <a-option value="电放">电放</a-option>
                          <a-option value="Sea Waybill">Sea Waybill</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6"><a-form-item label="放单方式"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="12"><a-form-item label="Shipper"><a-textarea size="small" :auto-size="{ minRows: 2 }" /></a-form-item></a-col>
                    <a-col :span="12"><a-form-item label="Consignee"><a-textarea size="small" :auto-size="{ minRows: 2 }" /></a-form-item></a-col>
                    <a-col :span="6">
                      <a-form-item label="SI 状态">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="待补料">待补料</a-option>
                          <a-option value="已补料">已补料</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="提单确认状态">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="客户待确认">客户待确认</a-option>
                          <a-option value="客户已确认">客户已确认</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-card>
              </a-form>
            </div>
          </a-tab-pane>

          <a-tab-pane key="files" title="文件资料">
            <div class="tab-body">
              <a-card size="small">
                <template #title>
                  <a-space size="small">
                    <span>文件列表</span>
                    <span class="card-stat">必传 {{ requiredFileCount }}</span>
                    <span class="card-stat">缺失 {{ fileMissingCount }}</span>
                    <span class="card-stat">待确认 {{ pendingFileConfirmCount }}</span>
                  </a-space>
                </template>
                <template #extra>
                  <a-button size="small" type="outline">上传文件</a-button>
                </template>
                <a-descriptions :column="2" size="small" class="card-descriptions">
                  <a-descriptions-item label="齐套状态">{{ fileStatusSummary }}</a-descriptions-item>
                  <a-descriptions-item label="当前重点">{{ fileMissingCount > 0 ? '先补必传资料' : '推进文件确认' }}</a-descriptions-item>
                </a-descriptions>
                <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.files" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                  <vxe-column type="seq" width="52" align="center" />
                  <vxe-column field="name" title="文件名" min-width="160">
                    <template #default="{ row }"><a-input v-model="row.name" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="category" title="分类" min-width="100">
                    <template #default="{ row }"><a-input v-model="row.category" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="uploader" title="上传人" min-width="80" />
                  <vxe-column field="uploadedAt" title="上传时间" min-width="130" />
                  <vxe-column field="status" title="状态" min-width="100">
                    <template #default="{ row }">
                      <a-select v-model="row.status" size="small">
                        <a-option value="已上传">已上传</a-option>
                        <a-option value="待确认">待确认</a-option>
                        <a-option value="缺失">缺失</a-option>
                      </a-select>
                    </template>
                  </vxe-column>
                </vxe-table>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="fees" title="费用信息">
            <div class="tab-body">
              <a-space direction="vertical" fill size="small">
                <a-card size="small">
                  <template #title>利润概览</template>
                  <template #extra>
                    <a-space size="small">
                      <span class="card-stat">待确认 {{ feePendingCount }}</span>
                      <span class="card-stat">{{ feeStatusSummary }}</span>
                    </a-space>
                  </template>
                  <a-descriptions :column="4" size="small" class="card-descriptions">
                    <a-descriptions-item label="应收合计">{{ form.feeSummary.receivableTotal.toLocaleString() }}</a-descriptions-item>
                    <a-descriptions-item label="应付合计">{{ form.feeSummary.payableTotal.toLocaleString() }}</a-descriptions-item>
                    <a-descriptions-item label="毛利">{{ form.feeSummary.grossProfit.toLocaleString() }}</a-descriptions-item>
                    <a-descriptions-item label="毛利率">{{ form.feeSummary.grossMargin }}%</a-descriptions-item>
                  </a-descriptions>
                </a-card>

                <a-card size="small">
                  <template #title>
                    <a-space size="small">
                      <span>应收费用</span>
                      <span class="card-stat">条数 {{ receivableLineCount }}</span>
                    </a-space>
                  </template>
                  <template #extra>
                    <a-button size="small" type="outline" @click="addReceivableRow"><template #icon><icon-plus /></template>新增</a-button>
                  </template>
                  <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.receivableFees" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                    <vxe-column type="seq" width="52" align="center" />
                    <vxe-column field="name" title="费用名称" min-width="100">
                      <template #default="{ row }"><a-input v-model="row.name" size="small" /></template>
                    </vxe-column>
                    <vxe-column field="currency" title="币种" min-width="72">
                      <template #default="{ row }">
                        <a-select v-model="row.currency" size="small"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select>
                      </template>
                    </vxe-column>
                    <vxe-column field="amount" title="金额" min-width="100">
                      <template #default="{ row }"><a-input-number v-model="row.amount" size="small" :min="0" style="width:100%" /></template>
                    </vxe-column>
                    <vxe-column field="party" title="客户" min-width="120">
                      <template #default="{ row }"><a-input v-model="row.party" size="small" /></template>
                    </vxe-column>
                    <vxe-column field="status" title="状态" min-width="100">
                      <template #default="{ row }">
                        <a-select v-model="row.status" size="small"><a-option value="待确认">待确认</a-option><a-option value="已确认">已确认</a-option></a-select>
                      </template>
                    </vxe-column>
                  </vxe-table>
                </a-card>

                <a-card size="small">
                  <template #title>
                    <a-space size="small">
                      <span>应付费用</span>
                      <span class="card-stat">条数 {{ payableLineCount }}</span>
                    </a-space>
                  </template>
                  <template #extra>
                    <a-button size="small" type="outline" @click="addPayableRow"><template #icon><icon-plus /></template>新增</a-button>
                  </template>
                  <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.payableFees" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                    <vxe-column type="seq" width="52" align="center" />
                    <vxe-column field="name" title="费用名称" min-width="100">
                      <template #default="{ row }"><a-input v-model="row.name" size="small" /></template>
                    </vxe-column>
                    <vxe-column field="currency" title="币种" min-width="72">
                      <template #default="{ row }">
                        <a-select v-model="row.currency" size="small"><a-option value="CNY">CNY</a-option><a-option value="USD">USD</a-option></a-select>
                      </template>
                    </vxe-column>
                    <vxe-column field="amount" title="金额" min-width="100">
                      <template #default="{ row }"><a-input-number v-model="row.amount" size="small" :min="0" style="width:100%" /></template>
                    </vxe-column>
                    <vxe-column field="party" title="供应商" min-width="120">
                      <template #default="{ row }"><a-input v-model="row.party" size="small" /></template>
                    </vxe-column>
                    <vxe-column field="status" title="状态" min-width="100">
                      <template #default="{ row }">
                        <a-select v-model="row.status" size="small"><a-option value="待确认">待确认</a-option><a-option value="已确认">已确认</a-option></a-select>
                      </template>
                    </vxe-column>
                  </vxe-table>
                </a-card>
              </a-space>
            </div>
          </a-tab-pane>

          <a-tab-pane key="nodes" title="物流节点">
            <div class="tab-body">
              <a-card size="small">
                <template #title>
                  <a-space size="small">
                    <span>物流节点</span>
                    <span class="card-stat">已完成 {{ completedNodeCount }}</span>
                    <span class="card-stat">待推进 {{ pendingNodeCount }}</span>
                  </a-space>
                </template>
                <template #extra>
                  <a-button size="small" type="outline" @click="addNodeRow"><template #icon><icon-plus /></template>新增节点</a-button>
                </template>
                <a-descriptions :column="2" size="small" class="card-descriptions">
                  <a-descriptions-item label="当前节点">{{ currentNode?.name ?? '已完成' }}</a-descriptions-item>
                  <a-descriptions-item label="当前责任人">{{ currentNode?.owner ?? form.operator }}</a-descriptions-item>
                </a-descriptions>
                <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.nodes" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                  <vxe-column type="seq" width="52" align="center" />
                  <vxe-column field="name" title="节点名称" min-width="100">
                    <template #default="{ row }"><a-input v-model="row.name" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="planTime" title="计划时间" min-width="150">
                    <template #default="{ row }"><a-input v-model="row.planTime" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="actualTime" title="实际时间" min-width="150">
                    <template #default="{ row }"><a-input v-model="row.actualTime" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="status" title="状态" min-width="100">
                    <template #default="{ row }">
                      <a-select v-model="row.status" size="small"><a-option value="待完成">待完成</a-option><a-option value="已完成">已完成</a-option></a-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="owner" title="负责人" min-width="80">
                    <template #default="{ row }"><a-input v-model="row.owner" size="small" /></template>
                  </vxe-column>
                </vxe-table>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="exceptions" title="异常记录">
            <div class="tab-body">
              <a-card size="small">
                <template #title>
                  <a-space size="small">
                    <span>异常列表</span>
                    <span class="card-stat">待处理 {{ openExceptionCount }}</span>
                    <span class="card-stat">页面风险 {{ pendingRiskCount }}</span>
                  </a-space>
                </template>
                <template #extra>
                  <a-button size="small" type="outline" @click="addExceptionRow"><template #icon><icon-plus /></template>新增异常</a-button>
                </template>
                <vxe-table class="detail-mini-vxe detail-mini-vxe--editable" border="none" size="small" height="auto" :data="form.exceptions" :row-config="{ isHover: true, keyField: 'id', height: 38 }">
                  <vxe-column field="no" title="异常编号" min-width="120" />
                  <vxe-column field="type" title="类型" min-width="100">
                    <template #default="{ row }">
                      <a-select v-model="row.type" size="small">
                        <a-option value="订舱异常">订舱异常</a-option>
                        <a-option value="拖车异常">拖车异常</a-option>
                        <a-option value="报关异常">报关异常</a-option>
                      </a-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="level" title="等级" min-width="80">
                    <template #default="{ row }">
                      <a-select v-model="row.level" size="small"><a-option value="低">低</a-option><a-option value="中">中</a-option><a-option value="高">高</a-option></a-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="description" title="描述" min-width="160">
                    <template #default="{ row }"><a-input v-model="row.description" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="owner" title="责任人" min-width="80">
                    <template #default="{ row }"><a-input v-model="row.owner" size="small" /></template>
                  </vxe-column>
                  <vxe-column field="status" title="状态" min-width="100">
                    <template #default="{ row }">
                      <a-select v-model="row.status" size="small"><a-option value="待处理">待处理</a-option><a-option value="处理中">处理中</a-option><a-option value="已关闭">已关闭</a-option></a-select>
                    </template>
                  </vxe-column>
                </vxe-table>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="comm" title="沟通记录">
            <div class="tab-body">
              <a-form layout="vertical" size="small">
                <a-card title="新增沟通" size="small">
                  <a-row :gutter="[16, 0]">
                    <a-col :span="6"><a-form-item label="沟通对象"><a-input size="small" allow-clear /></a-form-item></a-col>
                    <a-col :span="6">
                      <a-form-item label="沟通方式">
                        <a-select size="small" allow-clear placeholder="请选择">
                          <a-option value="电话">电话</a-option>
                          <a-option value="邮件">邮件</a-option>
                          <a-option value="微信">微信</a-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6"><a-form-item label="是否客户可见"><a-switch size="small" /></a-form-item></a-col>
                    <a-col :span="24">
                      <a-form-item label="沟通内容">
                        <a-textarea size="small" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="记录沟通内容" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-card>
              </a-form>
            </div>
          </a-tab-pane>

          <a-tab-pane key="logs" title="操作日志">
            <div class="tab-body">
              <a-card title="操作日志" size="small">
                <vxe-table class="detail-mini-vxe detail-mini-vxe--readonly" border="none" size="small" height="auto" :data="form.logs" :row-config="{ isHover: true, keyField: 'id', height: 34 }">
                  <vxe-column field="time" title="操作时间" min-width="130" />
                  <vxe-column field="operator" title="操作人" min-width="80" />
                  <vxe-column field="module" title="模块" min-width="80" />
                  <vxe-column field="action" title="操作类型" min-width="90" />
                  <vxe-column field="before" title="变更前" min-width="80" />
                  <vxe-column field="after" title="变更后" min-width="80" />
                  <vxe-column field="source" title="来源" min-width="60" />
                </vxe-table>
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <aside class="shipment-detail-page__aside">
        <a-card title="风控总览" size="small">
          <a-row :gutter="8" class="aside-metrics">
            <a-col :span="8">
              <div class="aside-metric">
                <span class="aside-metric__label">待处理风险</span>
                <strong class="aside-metric__value aside-metric__value--danger">{{ pendingRiskCount }}</strong>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="aside-metric">
                <span class="aside-metric__label">待办节点</span>
                <strong class="aside-metric__value aside-metric__value--primary">{{ pendingTodoCount }}</strong>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="aside-metric">
                <span class="aside-metric__label">待确认费用</span>
                <strong class="aside-metric__value aside-metric__value--warn">{{ feePendingCount }}</strong>
              </div>
            </a-col>
          </a-row>
          <a-space direction="vertical" fill size="small" class="aside-list">
            <a-card
              v-for="risk in form.risks"
              :key="risk.id"
              size="small"
              class="aside-item aside-item--warn"
            >
              <a-space direction="vertical" fill size="small">
                <a-space align="center" fill>
                  <span class="aside-item__title">{{ risk.type }}</span>
                  <span class="s-pill" :data-s="risk.level === 'danger' ? 'rej' : 'wait'">{{ risk.status }}</span>
                </a-space>
                <span class="aside-item__body">{{ risk.message }}</span>
                <span class="aside-item__meta">责任人 {{ risk.owner }} · 截止 {{ risk.dueAt }}</span>
              </a-space>
            </a-card>
          </a-space>
        </a-card>

        <a-card title="当前待办" size="small">
          <a-space direction="vertical" fill size="small" class="aside-list">
            <a-card v-for="todo in form.todos" :key="todo.id" size="small" class="aside-item">
              <a-space direction="vertical" fill size="small">
                <a-space align="center" fill>
                  <span class="aside-item__title">{{ todo.type }}</span>
                  <span class="s-pill" :data-s="todo.status === '进行中' ? 'op' : 'wait'">{{ todo.status }}</span>
                </a-space>
                <span class="aside-item__meta">负责人 {{ todo.owner }}</span>
                <span class="aside-item__meta">截止 {{ todo.dueAt }}</span>
              </a-space>
            </a-card>
            <a-space direction="vertical" fill>
              <a-button size="small" type="outline" long @click="handleGenerateFee">进入费用</a-button>
              <a-button size="small" type="outline" long @click="handleUploadFile">进入文件</a-button>
              <a-button size="small" long @click="openStatusModal">修改状态</a-button>
            </a-space>
          </a-space>
        </a-card>
      </aside>
    </div>

    <footer class="shipment-detail-page__footer">
      <a-popconfirm content="确认作废该订单？此操作不可撤销。" @ok="handleCancelOrder">
        <a-button size="small" type="text" status="danger">作废订单</a-button>
      </a-popconfirm>
      <a-space>
        <a-button size="small" @click="handleNotify">发送通知</a-button>
        <a-button size="small" @click="handleGenerateFee">生成费用</a-button>
        <a-button size="small" @click="handleDiscard">取消修改</a-button>
        <a-button size="small" type="primary" :loading="submitting" @click="handleSave">保存</a-button>
      </a-space>
    </footer>

    <a-modal
      v-model:visible="statusModalVisible"
      title="修改订单状态"
      :width="560"
      :mask-closable="false"
      @ok="confirmStatusChange"
    >
      <a-form layout="vertical" size="small">
        <a-row :gutter="[16, 0]">
          <a-col :span="12">
            <a-form-item label="当前状态">
              <span>{{ form.orderStatusLabel }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="目标状态" required>
              <a-select v-model="statusForm.targetStatus" size="small" allow-clear placeholder="请选择">
                <a-option value="released">已放舱</a-option>
                <a-option value="customs">报关中</a-option>
                <a-option value="sailed">已开船</a-option>
                <a-option value="completed">已完成</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="修改原因" required>
              <a-textarea v-model="statusForm.reason" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请填写修改原因" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item hide-label>
              <a-checkbox v-model="statusForm.notify">同步通知相关人员</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item hide-label>
              <a-checkbox v-model="statusForm.createNode">生成节点记录</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.shipment-detail-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 12px;
  gap: 10px;
  box-sizing: border-box;
}

.shipment-detail-page__head {
  flex-shrink: 0;
  padding: 12px 16px;
  background: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
}

.shipment-detail-page__hero {
  flex-shrink: 0;
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.hero-route {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hero-route__ports {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-dates {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex-shrink: 0;
}

.hero-fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.hero-fact__label {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
  line-height: 1.3;
}

.hero-fact__value {
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  color: var(--color-text-1);
  line-height: 1.4;
  white-space: nowrap;
}

.hero-metrics {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-1);
}

.hero-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hero-metric__label {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
  line-height: 1.3;
}

.hero-metric__value {
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-title);
  color: var(--color-text-1);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-metric__value--warn {
  color: var(--dense-warning-6);
}

.hero-metric__value--primary {
  color: var(--dense-primary-6);
}

.hero-port {
  font-size: var(--dense-font-overlay);
  font-weight: 600;
  color: var(--color-text-1);
}

.hero-arrow {
  color: var(--color-text-3);
}

.hero-sub {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
}

.hero-milestone {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.hero-milestone__item {
  padding: 3px 10px;
  border-radius: var(--border-radius-small);
  font-size: var(--dense-font-aux);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-2);
  background: var(--color-bg-1);
}

.hero-milestone__item[data-state='done'] {
  color: var(--dense-success-6);
  border-color: var(--dense-success-2);
  background: var(--dense-success-1);
}

.hero-milestone__item[data-state='current'] {
  color: var(--dense-primary-6);
  border-color: var(--dense-primary-2);
  background: var(--dense-primary-1);
  font-weight: 600;
}

.shipment-detail-page__body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 292px;
  gap: 10px;
  overflow: hidden;
}

.shipment-detail-page__main {
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.detail-tabs .arco-tabs-content) {
  flex: 1;
  overflow: hidden;
}

:deep(.detail-tabs .arco-tabs-pane) {
  height: 100%;
  overflow-y: auto;
}

.tab-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-stat {
  font-size: var(--dense-font-aux);
  color: var(--color-text-3);
  font-weight: 400;
}

.card-descriptions {
  margin-bottom: 12px;
}

.shipment-detail-page__aside {
  min-width: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.aside-metrics {
  margin-bottom: 10px;
}

.aside-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-small);
  background: var(--color-fill-1);
}

.aside-metric__label {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
}

.aside-metric__value {
  font-size: var(--dense-font-overlay);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-1);
}

.aside-metric__value--danger {
  color: var(--dense-danger-6);
}

.aside-metric__value--primary {
  color: var(--dense-primary-6);
}

.aside-metric__value--warn {
  color: var(--dense-warning-6);
}

.aside-list {
  width: 100%;
}

.aside-item {
  background: var(--color-fill-1);
}

.aside-item--warn {
  border-color: var(--dense-warning-2);
  background: var(--dense-warning-1);
}

.aside-item__title {
  font-size: var(--dense-font-field);
  font-weight: 600;
  color: var(--color-text-1);
}

.aside-item__body {
  font-size: var(--dense-font-aux);
  color: var(--color-text-2);
  line-height: 1.5;
}

.aside-item__meta {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
}

.shipment-detail-page__footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  background: var(--color-bg-2);
}

:deep(.arco-form-item) {
  margin-bottom: 12px;
}

@media (max-width: 1280px) {
  .hero-top {
    flex-direction: column;
    gap: 12px;
  }

  .hero-dates {
    width: 100%;
  }

  .shipment-detail-page__body {
    grid-template-columns: 1fr;
  }

  .shipment-detail-page__aside {
    max-height: 240px;
  }
}
</style>
