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
  <div class="page-root page-root--dense xf-wrap shipment-detail-page">
    <div class="dds-head zone-card">
      <div class="dds-head__main">
        <a-button size="small" type="text" class="dds-head__back" @click="goBack">返回列表</a-button>
        <div class="dds-head__identity">
          <span class="dds-order-no mono">{{ form.orderNo }}</span>
          <span class="dds-status-badge" :data-s="form.statusPill">{{ form.orderStatusLabel }}</span>
          <span class="dds-company">{{ form.customerName }}</span>
          <span class="dds-head__meta dds-head__meta--owner">{{ form.businessType }}</span>
          <span class="dds-head__meta-sep">·</span>
          <span class="dds-head__meta dds-head__meta--owner">操作 {{ form.operator }}</span>
        </div>
      </div>
      <div class="dds-head__actions">
        <a-tooltip content="打印">
          <a-button size="small" type="text"><template #icon><icon-printer /></template></a-button>
        </a-tooltip>
        <a-button size="small" @click="openStatusModal">修改状态</a-button>
        <a-button size="small" @click="handleGenerateFee">生成费用</a-button>
        <a-button size="small" @click="handleUploadFile">上传文件</a-button>
        <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
          <a-button size="small">
            更多
            <template #icon><icon-down /></template>
          </a-button>
          <template #content>
            <a-doption @click="handleNotify">发送通知</a-doption>
            <a-doption @click="handleMarkException">标记异常</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>

    <div class="dds-hero dds-hero--compact zone-card shipment-detail-page__hero">
      <div class="dds-hero__route">
        <div class="dds-hero__route-main">
          <span class="dds-hero__port">{{ form.pol }}</span>
          <span class="dds-hero__arrow">→</span>
          <span class="dds-hero__port">{{ form.pod }}</span>
        </div>
        <div class="dds-hero__sub">{{ form.carrier }} / {{ form.vessel }} {{ form.voyage }}</div>
      </div>
      <div class="dds-hero__facts">
        <div class="dds-hero-fact">
          <div class="dds-hero-fact__label">开船</div>
          <span class="dds-hero-fact__value dds-hero-fact__value--date mono">{{ form.etd }}</span>
        </div>
        <div class="dds-hero-fact">
          <div class="dds-hero-fact__label">截关</div>
          <span class="dds-hero-fact__value dds-hero-fact__value--date mono">{{ form.closingTime }}</span>
        </div>
        <div class="dds-hero-fact">
          <div class="dds-hero-fact__label">利润状态</div>
          <span class="dds-hero-fact__value">
            <span class="s-pill" :data-s="profitTone">{{ form.profitStatus }}</span>
          </span>
        </div>
        <div class="dds-hero-fact">
          <div class="dds-hero-fact__label">文件齐套</div>
          <span class="dds-hero-fact__value">{{ fileStatusSummary }}</span>
        </div>
        <div class="dds-hero-fact">
          <div class="dds-hero-fact__label">异常风险</div>
          <span class="dds-hero-fact__value">{{ riskSummary }}</span>
        </div>
        <div class="dds-hero-fact dds-hero-fact--trailing">
          <div class="dds-hero-fact__label">下一动作</div>
          <span class="dds-hero-fact__value">{{ nextActionSummary }}</span>
        </div>
      </div>
      <div class="dds-milestone">
        <div
          v-for="item in milestoneItems"
          :key="item.id"
          class="dds-milestone__item"
          :data-state="item.state"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div class="shipment-detail-layout">
      <div class="shipment-detail-layout__main">
        <div class="shipment-detail-tabs zone-card">
          <a-tabs v-model:active-key="activeTab" size="small" class="xp-tabs">
            <a-tab-pane key="basic" title="基本信息">
              <div class="xp-tab-body">
                <order-info-tab v-model:form="form" />
              </div>
            </a-tab-pane>

            <a-tab-pane key="booking" title="订舱信息">
              <div class="xp-tab-body">
                <a-form class="detail-form" layout="vertical" size="small" :model="form">
                  <div class="detail-section">
                    <div class="detail-section__head">
                      <div class="detail-section__title-group">
                        <h4 class="detail-section__title">订舱信息</h4>
                        <div class="detail-data-stats">
                          <span class="detail-data-stats__item"><span class="detail-data-stats__label">订舱号</span><span class="detail-data-stats__val">{{ form.bookingNo || '待回传' }}</span></span>
                          <span class="detail-data-stats__item"><span class="detail-data-stats__label">舱位</span><span class="detail-data-stats__val">{{ form.spaceStatus }}</span></span>
                        </div>
                      </div>
                    </div>
                    <div class="detail-module-summary detail-module-summary--inline">
                      <div class="detail-module-summary__stats">
                        <div class="detail-module-summary__stat">
                          <span class="detail-module-summary__stat-label">放舱时间</span>
                          <span class="detail-module-summary__stat-value">{{ form.releaseTime }}</span>
                        </div>
                        <div class="detail-module-summary__stat">
                          <span class="detail-module-summary__stat-label">截 VGM</span>
                          <span class="detail-module-summary__stat-value">{{ form.vgmCutoff }}</span>
                        </div>
                        <div class="detail-module-summary__stat">
                          <span class="detail-module-summary__stat-label">运价编号</span>
                          <span class="detail-module-summary__stat-value">{{ form.rateNo }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="detail-section__body">
                      <div class="form-subgroup">
                        <div class="form-subgroup__head"><span class="form-subgroup__title">订舱主体</span></div>
                        <div class="detail-form-grid detail-form-grid--4">
                          <a-form-item label="订舱号"><a-input v-model="form.bookingNo" size="small" allow-clear /></a-form-item>
                          <a-form-item label="船公司"><a-input v-model="form.carrier" size="small" allow-clear /></a-form-item>
                          <a-form-item label="订舱代理"><a-input v-model="form.bookingAgent" size="small" allow-clear /></a-form-item>
                          <a-form-item label="合约号"><a-input v-model="form.contractNo" size="small" allow-clear /></a-form-item>
                        </div>
                      </div>
                      <div class="form-subgroup">
                        <div class="form-subgroup__head"><span class="form-subgroup__title">节点控制</span></div>
                        <div class="detail-form-grid detail-form-grid--4">
                          <a-form-item label="运价编号"><a-input v-model="form.rateNo" size="small" allow-clear /></a-form-item>
                          <a-form-item label="舱位状态"><a-input v-model="form.spaceStatus" size="small" allow-clear /></a-form-item>
                          <a-form-item label="放舱时间"><a-date-picker v-model="form.releaseTime" size="small" show-time style="width:100%" /></a-form-item>
                          <a-form-item label="截 VGM"><a-date-picker v-model="form.vgmCutoff" size="small" show-time style="width:100%" /></a-form-item>
                          <a-form-item label="订舱备注" class="detail-form-grid__span4">
                            <a-textarea v-model="form.bookingRemark" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" />
                          </a-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="container" title="柜货信息">
              <div class="xp-tab-body">
                <a-form class="detail-form" layout="vertical" size="small" :model="form">
                  <div class="detail-section">
                    <div class="detail-section__head"><h4 class="detail-section__title">柜型柜量</h4></div>
                    <div class="detail-section__body">
                      <div class="detail-form-grid detail-form-grid--4">
                        <a-form-item label="柜型柜量汇总"><a-input v-model="form.containerSummary" size="small" allow-clear placeholder="如 2×40HQ" /></a-form-item>
                      </div>
                    </div>
                  </div>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="truck" title="拖车信息">
              <div class="xp-tab-body">
                <a-form class="detail-form" layout="vertical" size="small">
                  <div class="detail-section">
                    <div class="detail-section__head"><h4 class="detail-section__title">拖车安排</h4></div>
                    <div class="detail-section__body">
                      <div class="detail-form-grid detail-form-grid--4">
                        <a-form-item label="拖车供应商"><a-input size="small" allow-clear placeholder="请选择供应商" /></a-form-item>
                        <a-form-item label="装柜地址"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="装柜时间"><a-date-picker size="small" show-time style="width:100%" /></a-form-item>
                        <a-form-item label="拖车状态">
                          <a-select size="small" allow-clear placeholder="请选择">
                            <a-option value="未安排">未安排</a-option>
                            <a-option value="已派车">已派车</a-option>
                            <a-option value="已到厂">已到厂</a-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item label="联系人"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="联系电话"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="车牌号"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="箱号"><a-input size="small" allow-clear /></a-form-item>
                      </div>
                    </div>
                  </div>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="customs" title="报关信息">
              <div class="xp-tab-body">
                <a-form class="detail-form" layout="vertical" size="small">
                  <div class="detail-section">
                    <div class="detail-section__head"><h4 class="detail-section__title">报关信息</h4></div>
                    <div class="detail-section__body">
                      <div class="detail-form-grid detail-form-grid--4">
                        <a-form-item label="报关方式">
                          <a-select size="small" allow-clear placeholder="请选择">
                            <a-option value="一般贸易">一般贸易</a-option>
                            <a-option value="跨境电商">跨境电商</a-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item label="报关行"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="报关单号"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="报关状态">
                          <a-select size="small" allow-clear placeholder="请选择">
                            <a-option value="未提交">未提交</a-option>
                            <a-option value="已提交">已提交</a-option>
                            <a-option value="已放行">已放行</a-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item label="截关时间"><a-date-picker v-model="form.closingTime" size="small" show-time style="width:100%" /></a-form-item>
                        <a-form-item label="放行时间"><a-date-picker size="small" show-time style="width:100%" /></a-form-item>
                        <a-form-item label="查验状态"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="报关备注" class="detail-form-grid__span4">
                          <a-textarea size="small" :auto-size="{ minRows: 2, maxRows: 4 }" />
                        </a-form-item>
                      </div>
                    </div>
                  </div>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="bl" title="提单信息">
              <div class="xp-tab-body">
                <a-form class="detail-form" layout="vertical" size="small">
                  <div class="detail-section">
                    <div class="detail-section__head"><h4 class="detail-section__title">提单资料</h4></div>
                    <div class="detail-section__body">
                      <div class="detail-form-grid detail-form-grid--4">
                        <a-form-item label="MBL No."><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="HBL No."><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="提单类型">
                          <a-select size="small" allow-clear placeholder="请选择">
                            <a-option value="正本">正本</a-option>
                            <a-option value="电放">电放</a-option>
                            <a-option value="Sea Waybill">Sea Waybill</a-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item label="放单方式"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="Shipper" class="detail-form-grid__span2"><a-textarea size="small" :auto-size="{ minRows: 2 }" /></a-form-item>
                        <a-form-item label="Consignee" class="detail-form-grid__span2"><a-textarea size="small" :auto-size="{ minRows: 2 }" /></a-form-item>
                        <a-form-item label="SI 状态"><a-select size="small" allow-clear placeholder="请选择"><a-option value="待补料">待补料</a-option><a-option value="已补料">已补料</a-option></a-select></a-form-item>
                        <a-form-item label="提单确认状态"><a-select size="small" allow-clear placeholder="请选择"><a-option value="客户待确认">客户待确认</a-option><a-option value="客户已确认">客户已确认</a-option></a-select></a-form-item>
                      </div>
                    </div>
                  </div>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="files" title="文件资料">
              <div class="xp-tab-body">
                <div class="detail-section">
                  <div class="detail-section__head">
                    <div class="detail-section__title-group">
                      <h4 class="detail-section__title">文件列表</h4>
                      <div class="detail-data-stats">
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">必传</span><span class="detail-data-stats__val">{{ requiredFileCount }}</span></span>
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">缺失</span><span class="detail-data-stats__val">{{ fileMissingCount }}</span></span>
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">待确认</span><span class="detail-data-stats__val">{{ pendingFileConfirmCount }}</span></span>
                      </div>
                    </div>
                    <div class="detail-section__actions">
                      <a-button size="small" type="outline">上传文件</a-button>
                    </div>
                  </div>
                  <div class="detail-module-summary detail-module-summary--inline">
                    <div class="detail-module-summary__stats">
                      <div class="detail-module-summary__stat">
                        <span class="detail-module-summary__stat-label">齐套状态</span>
                        <span class="detail-module-summary__stat-value">{{ fileStatusSummary }}</span>
                      </div>
                      <div class="detail-module-summary__stat">
                        <span class="detail-module-summary__stat-label">当前重点</span>
                        <span class="detail-module-summary__stat-value">{{ fileMissingCount > 0 ? '先补必传资料' : '推进文件确认' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="detail-section__body detail-section__body--table">
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
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="fees" title="费用信息">
              <div class="xp-tab-body">
                <div class="detail-section">
                  <div class="detail-section__head">
                    <div class="detail-section__title-group">
                      <h4 class="detail-section__title">利润概览</h4>
                      <div class="detail-data-stats">
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">待确认</span><span class="detail-data-stats__val">{{ feePendingCount }}</span></span>
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">状态</span><span class="detail-data-stats__val">{{ feeStatusSummary }}</span></span>
                      </div>
                    </div>
                  </div>
                  <div class="detail-module-summary detail-module-summary--inline">
                    <div class="detail-module-summary__stats">
                      <div class="detail-module-summary__stat detail-module-summary__stat--qty">
                        <span class="detail-module-summary__stat-label">应收合计</span>
                        <span class="detail-module-summary__stat-value">{{ form.feeSummary.receivableTotal.toLocaleString() }}</span>
                      </div>
                      <div class="detail-module-summary__stat detail-module-summary__stat--weight">
                        <span class="detail-module-summary__stat-label">应付合计</span>
                        <span class="detail-module-summary__stat-value">{{ form.feeSummary.payableTotal.toLocaleString() }}</span>
                      </div>
                      <div class="detail-module-summary__stat">
                        <span class="detail-module-summary__stat-label">毛利</span>
                        <span class="detail-module-summary__stat-value">{{ form.feeSummary.grossProfit.toLocaleString() }}</span>
                      </div>
                      <div class="detail-module-summary__stat">
                        <span class="detail-module-summary__stat-label">毛利率</span>
                        <span class="detail-module-summary__stat-value">{{ form.feeSummary.grossMargin }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="detail-section">
                  <div class="detail-section__head">
                    <div class="detail-section__title-group">
                      <h4 class="detail-section__title">应收费用</h4>
                      <div class="detail-data-stats">
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">条数</span><span class="detail-data-stats__val">{{ receivableLineCount }}</span></span>
                      </div>
                    </div>
                    <div class="detail-section__actions">
                      <a-button size="small" type="outline" @click="addReceivableRow"><template #icon><icon-plus /></template>新增</a-button>
                    </div>
                  </div>
                  <div class="detail-section__body detail-section__body--table">
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
                  </div>
                </div>
                <div class="detail-section">
                  <div class="detail-section__head">
                    <div class="detail-section__title-group">
                      <h4 class="detail-section__title">应付费用</h4>
                      <div class="detail-data-stats">
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">条数</span><span class="detail-data-stats__val">{{ payableLineCount }}</span></span>
                      </div>
                    </div>
                    <div class="detail-section__actions">
                      <a-button size="small" type="outline" @click="addPayableRow"><template #icon><icon-plus /></template>新增</a-button>
                    </div>
                  </div>
                  <div class="detail-section__body detail-section__body--table">
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
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="nodes" title="物流节点">
              <div class="xp-tab-body">
                <div class="detail-section">
                  <div class="detail-section__head">
                    <div class="detail-section__title-group">
                      <h4 class="detail-section__title">物流节点</h4>
                      <div class="detail-data-stats">
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">已完成</span><span class="detail-data-stats__val">{{ completedNodeCount }}</span></span>
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">待推进</span><span class="detail-data-stats__val">{{ pendingNodeCount }}</span></span>
                      </div>
                    </div>
                    <div class="detail-section__actions">
                      <a-button size="small" type="outline" @click="addNodeRow"><template #icon><icon-plus /></template>新增节点</a-button>
                    </div>
                  </div>
                  <div class="detail-module-summary detail-module-summary--inline">
                    <div class="detail-module-summary__stats">
                      <div class="detail-module-summary__stat">
                        <span class="detail-module-summary__stat-label">当前节点</span>
                        <span class="detail-module-summary__stat-value">{{ currentNode?.name ?? '已完成' }}</span>
                      </div>
                      <div class="detail-module-summary__stat">
                        <span class="detail-module-summary__stat-label">当前责任人</span>
                        <span class="detail-module-summary__stat-value">{{ currentNode?.owner ?? form.operator }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="detail-section__body detail-section__body--table">
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
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="exceptions" title="异常记录">
              <div class="xp-tab-body">
                <div class="detail-section">
                  <div class="detail-section__head">
                    <div class="detail-section__title-group">
                      <h4 class="detail-section__title">异常列表</h4>
                      <div class="detail-data-stats">
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">待处理</span><span class="detail-data-stats__val">{{ openExceptionCount }}</span></span>
                        <span class="detail-data-stats__item"><span class="detail-data-stats__label">页面风险</span><span class="detail-data-stats__val">{{ pendingRiskCount }}</span></span>
                      </div>
                    </div>
                    <div class="detail-section__actions">
                      <a-button size="small" type="outline" @click="addExceptionRow"><template #icon><icon-plus /></template>新增异常</a-button>
                    </div>
                  </div>
                  <div class="detail-section__body detail-section__body--table">
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
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="comm" title="沟通记录">
              <div class="xp-tab-body">
                <a-form class="detail-form" layout="vertical" size="small">
                  <div class="detail-section">
                    <div class="detail-section__head"><h4 class="detail-section__title">新增沟通</h4></div>
                    <div class="detail-section__body">
                      <div class="detail-form-grid detail-form-grid--4">
                        <a-form-item label="沟通对象"><a-input size="small" allow-clear /></a-form-item>
                        <a-form-item label="沟通方式">
                          <a-select size="small" allow-clear placeholder="请选择">
                            <a-option value="电话">电话</a-option>
                            <a-option value="邮件">邮件</a-option>
                            <a-option value="微信">微信</a-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item label="是否客户可见"><a-switch size="small" /></a-form-item>
                        <a-form-item label="沟通内容" class="detail-form-grid__span4">
                          <a-textarea size="small" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="记录沟通内容" />
                        </a-form-item>
                      </div>
                    </div>
                  </div>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="logs" title="操作日志">
              <div class="xp-tab-body">
                <div class="detail-section">
                  <div class="detail-section__head"><h4 class="detail-section__title">操作日志</h4></div>
                  <div class="detail-section__body detail-section__body--table">
                    <vxe-table class="detail-mini-vxe detail-mini-vxe--readonly" border="none" size="small" height="auto" :data="form.logs" :row-config="{ isHover: true, keyField: 'id', height: 34 }">
                      <vxe-column field="time" title="操作时间" min-width="130" />
                      <vxe-column field="operator" title="操作人" min-width="80" />
                      <vxe-column field="module" title="模块" min-width="80" />
                      <vxe-column field="action" title="操作类型" min-width="90" />
                      <vxe-column field="before" title="变更前" min-width="80" />
                      <vxe-column field="after" title="变更后" min-width="80" />
                      <vxe-column field="source" title="来源" min-width="60" />
                    </vxe-table>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <aside class="shipment-detail-layout__aside">
        <div class="detail-section shipment-detail-aside__section">
          <div class="detail-section__head"><h4 class="detail-section__title">风控总览</h4></div>
          <div class="detail-section__body shipment-aside-stack">
            <div class="shipment-aside-metrics">
              <div class="shipment-aside-metric">
                <span class="shipment-aside-metric__label">待处理风险</span>
                <strong class="shipment-aside-metric__value shipment-aside-metric__value--danger">{{ pendingRiskCount }}</strong>
              </div>
              <div class="shipment-aside-metric">
                <span class="shipment-aside-metric__label">待办节点</span>
                <strong class="shipment-aside-metric__value shipment-aside-metric__value--primary">{{ pendingTodoCount }}</strong>
              </div>
              <div class="shipment-aside-metric">
                <span class="shipment-aside-metric__label">待确认费用</span>
                <strong class="shipment-aside-metric__value shipment-aside-metric__value--warn">{{ feePendingCount }}</strong>
              </div>
            </div>

            <div v-for="risk in form.risks" :key="risk.id" class="shipment-aside-card shipment-aside-card--warn">
              <div class="shipment-aside-card__head">
                <span class="shipment-aside-card__title">{{ risk.type }}</span>
                <span class="s-pill" :data-s="risk.level === 'danger' ? 'rej' : 'wait'">{{ risk.status }}</span>
              </div>
              <div class="shipment-aside-card__body">{{ risk.message }}</div>
              <div class="shipment-aside-card__meta">责任人 {{ risk.owner }} · 截止 {{ risk.dueAt }}</div>
            </div>
          </div>
        </div>

        <div class="detail-section shipment-detail-aside__section">
          <div class="detail-section__head"><h4 class="detail-section__title">当前待办</h4></div>
          <div class="detail-section__body shipment-aside-stack">
            <div v-for="todo in form.todos" :key="todo.id" class="shipment-aside-card">
              <div class="shipment-aside-card__head">
                <span class="shipment-aside-card__title">{{ todo.type }}</span>
                <span class="s-pill" :data-s="todo.status === '进行中' ? 'op' : 'wait'">{{ todo.status }}</span>
              </div>
              <div class="shipment-aside-card__meta">负责人 {{ todo.owner }}</div>
              <div class="shipment-aside-card__meta">截止 {{ todo.dueAt }}</div>
            </div>

            <div class="shipment-aside-actions">
              <a-button size="small" type="outline" long @click="handleGenerateFee">进入费用</a-button>
              <a-button size="small" type="outline" long @click="handleUploadFile">进入文件</a-button>
              <a-button size="small" long @click="openStatusModal">修改状态</a-button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <footer class="detail-drawer-footer xf-footer">
      <div class="detail-drawer-footer__start">
        <a-popconfirm content="确认作废该订单？此操作不可撤销。" @ok="handleCancelOrder">
          <a-button size="small" type="text" status="danger">作废订单</a-button>
        </a-popconfirm>
      </div>
      <div class="detail-drawer-footer__end">
        <div class="detail-drawer-footer__cluster">
          <a-button size="small" @click="handleNotify">发送通知</a-button>
          <a-button size="small" @click="handleGenerateFee">生成费用</a-button>
          <span class="detail-drawer-footer__sep" aria-hidden="true" />
          <a-button size="small" @click="goBack">取消</a-button>
          <a-button size="small" type="primary" :loading="submitting" @click="handleSave">保存</a-button>
        </div>
      </div>
    </footer>

    <a-modal
      v-model:visible="statusModalVisible"
      title="修改订单状态"
      :width="560"
      :mask-closable="false"
      @ok="confirmStatusChange"
    >
      <div class="status-modal-grid">
        <div class="status-modal-field">
          <label class="status-modal-label">当前状态</label>
          <span class="detail-field__val">{{ form.orderStatusLabel }}</span>
        </div>
        <div class="status-modal-field">
          <label class="status-modal-label">目标状态 <span class="status-modal-req">*</span></label>
          <a-select v-model="statusForm.targetStatus" size="small" allow-clear placeholder="请选择">
            <a-option value="released">已放舱</a-option>
            <a-option value="customs">报关中</a-option>
            <a-option value="sailed">已开船</a-option>
            <a-option value="completed">已完成</a-option>
          </a-select>
        </div>
        <div class="status-modal-field status-modal-field--wide">
          <label class="status-modal-label">修改原因 <span class="status-modal-req">*</span></label>
          <a-textarea v-model="statusForm.reason" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请填写修改原因" />
        </div>
        <div class="status-modal-field">
          <a-checkbox v-model="statusForm.notify">同步通知相关人员</a-checkbox>
        </div>
        <div class="status-modal-field">
          <a-checkbox v-model="statusForm.createNode">生成节点记录</a-checkbox>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.shipment-detail-page__hero {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.shipment-detail-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 292px;
  gap: 10px;
  overflow: hidden;
}

.shipment-detail-layout__main {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.shipment-detail-layout__aside {
  min-width: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shipment-detail-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.xp-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.arco-tabs-content) {
  flex: 1;
  overflow: hidden;
}
:deep(.arco-tabs-pane) {
  height: 100%;
  overflow-y: auto;
}
.xp-tab-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shipment-detail-aside__section {
  margin-bottom: 0;
}

.shipment-aside-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shipment-aside-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.shipment-aside-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 10px 9px;
  border: 1px solid var(--dense-border-subtle);
  border-radius: var(--dense-radius);
  background: linear-gradient(180deg, #FBFCFE 0%, #FFFFFF 100%);
}

.shipment-aside-metric__label {
  font-size: var(--dense-font-micro);
  color: var(--color-text-3);
  line-height: 1.2;
}

.shipment-aside-metric__value {
  font-size: var(--dense-font-overlay);
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-1);
}

.shipment-aside-metric__value--danger {
  color: var(--dense-danger-7);
}

.shipment-aside-metric__value--primary {
  color: var(--dense-primary-7);
}

.shipment-aside-metric__value--warn {
  color: var(--dense-warning-7);
}

.shipment-aside-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 11px;
  border: 1px solid var(--dense-border-subtle);
  border-radius: var(--dense-radius);
  background: linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%);
}

.shipment-aside-card--warn {
  border-color: var(--dense-warning-2);
  background: linear-gradient(180deg, #FFFDF8 0%, #FFFFFF 100%);
}

.shipment-aside-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.shipment-aside-card__title {
  font-size: var(--dense-font-field);
  font-weight: 600;
  color: var(--color-text-1);
}

.shipment-aside-card__body {
  font-size: var(--dense-font-aux);
  line-height: 1.5;
  color: var(--color-text-2);
}

.shipment-aside-card__meta {
  font-size: var(--dense-font-micro);
  line-height: 1.3;
  color: var(--color-text-3);
}

.shipment-aside-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
}
.status-modal-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.status-modal-field--wide {
  grid-column: span 2;
}
.status-modal-label {
  font-size: var(--dense-font-field);
  color: var(--color-text-2);
  font-weight: 500;
}
.status-modal-req {
  color: var(--danger-6);
}
@media (max-width: 1280px) {
  .shipment-detail-layout {
    grid-template-columns: 1fr;
  }

  .shipment-detail-layout__aside {
    max-height: 240px;
  }
}
</style>
