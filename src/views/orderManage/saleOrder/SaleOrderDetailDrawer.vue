<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconArchive,
  IconCopy,
  IconDelete,
  IconDownload,
  IconDown,
  IconFile,
  IconLeft,
  IconPlus,
  IconPrinter,
  IconSave,
  IconSend,
  IconUpload,
} from '@arco-design/web-vue/es/icon';

type PillStatus = 'wait' | 'op' | 'partial' | 'acc' | 'rel' | 'draft' | 'rej';

interface CargoLine {
  id: number;
  chineseName: string;
  englishName: string;
  marks: string;
  hsCode: string;
  cartonNo: string;
  quantity: number;
  unit: string;
  weight: number;
  volume: number;
}

interface CargoParty {
  id: number;
  title: string;
  shipper: string;
  shipperAddress: string;
  consignee: string;
  consigneeAddress: string;
  notifyParty: string;
  overseasAgent: string;
  terms: string;
  payTerm: string;
  expanded: boolean;
  lines: CargoLine[];
}

interface DetailSourceRow {
  orderNo?: string;
  businessNo?: string;
  hblNo?: string;
  mblNo?: string;
  inboundNo?: string;
  statusText?: string;
  pill?: PillStatus;
  customer?: string;
  businessType?: string;
  salesman?: string;
  customerService?: string;
  operator?: string;
  shipper?: string;
  consignee?: string;
  pol?: string;
  pod?: string;
  etd?: string;
  eta?: string;
  containerQty?: string;
  cargoType?: string;
}

const props = defineProps<{
  visible: boolean;
  row?: DetailSourceRow | null;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const orderForm = reactive({
  orderNo: 'PTP26060094',
  businessNo: 'LCL26060098',
  hblNo: 'PTP26060094',
  mblNo: 'SPTP26060094',
  inboundNo: 'UKSZ26060094',
  overseasNo: 'UUKDCG25091499',
  statusText: '已放舱',
  statusKey: 'rel' as PillStatus,
  customer: '艾力克',
  businessType: 'FBA',
  serviceScope: '全程',
  sales: 'CrystalShi',
  operator: 'OceanOps',
  customerService: 'MayLiu',
  bookingAgent: 'DCG LOGISTICS UK LTD',
  loadingType: 'LCL GROUP（自拼）',
  polCode: 'CNYTN',
  pol: 'YANTIAN',
  podCode: 'GBFXT',
  pod: 'FELIXSTOWE',
  destinationCode: 'GBFXT',
  destination: 'FELIXSTOWE',
  carrier: 'EVERGREEN',
  contractNo: 'SQE369977',
  vessel: 'EVERGREEN OCEAN',
  voyage: '321',
  etd: '2026-06-22',
  eta: '2026-07-25',
  atd: '2026-06-22',
  ata: '2026-07-25',
  transportTerm: 'CFS-CFS',
  blTerm: 'PTP提单',
  containerType: '亚马逊柜',
  warehouse: '东荣宝安仓库',
  warehouseMode: '仓库建付',
  storage: '',
  dm: '',
  dt: '',
  dmDt: '',
  goodsTypes: ['普货', '报关', '清关', '派送'],
  cargoAttrs: ['普货'],
  customerRemark: '',
  operationRemark: '',
  serviceRemark: '',
  overseasRemark: '',
  totalPieces: 100,
  totalWeight: 100,
  totalVolume: 100,
});

const milestones = ['接单', '订舱', '进仓', '报关', '开船', '到港'];
const currentStep = 3;

const serviceOptions = ['订舱', '驳船', '拖车', '仓库内装', '报关', '保险', '清关', '派送'];
const cargoOptions = ['普货', '危险货', '电池', '化工品', '液体/粉末', '食品', '商检'];

const cargoParties = reactive<CargoParty[]>([
  {
    id: 1,
    title: '货物信息 1',
    shipper: '艾力克',
    shipperAddress: '11111111111123213123',
    consignee: 'ZHANGSAN',
    consigneeAddress: 'AK47',
    notifyParty: 'SAME AS CONSIGNEE',
    overseasAgent: 'DCG LOGISTICS UK LTD',
    terms: 'DAP',
    payTerm: '',
    expanded: true,
    lines: [
      {
        id: 101,
        chineseName: '塑料收纳盒',
        englishName: 'PLASTIC STORAGE BOX',
        marks: 'N/M',
        hsCode: '3926909090',
        cartonNo: 'GPTP26060094',
        quantity: 100,
        unit: 'CTNS',
        weight: 100,
        volume: 100,
      },
    ],
  },
  {
    id: 2,
    title: '货物信息 2',
    shipper: '艾力克',
    shipperAddress: '11111111111123213123',
    consignee: 'ZHANGSAN',
    consigneeAddress: 'AK47',
    notifyParty: 'SAME AS CONSIGNEE',
    overseasAgent: 'DCG LOGISTICS UK LTD',
    terms: 'FOB',
    payTerm: 'FREIGHT COLLECT',
    expanded: true,
    lines: [
      {
        id: 201,
        chineseName: '',
        englishName: '',
        marks: '',
        hsCode: '',
        cartonNo: '',
        quantity: 0,
        unit: 'CTNS',
        weight: 0,
        volume: 0,
      },
    ],
  },
]);

const containerRows = reactive([
  {
    id: 1,
    containerType: 'LCL',
    cartonNo: 'GPTP26060094',
    sealNo: 'FPTP26060094',
    soNo: 'SPTP26060094',
    quantity: 100,
    unit: 'CTNS',
    weight: 100,
    volume: 100,
    planTime: '',
    actualTime: '',
    loadingTime: '',
    cutOffTime: '',
    customsTravel: '否',
    chargeWeight: 0.2,
  },
]);

const customsRows = reactive([
  {
    id: 1,
    shipper: '艾力克',
    documentName: '',
    declarationNo: '',
    quantity: 100,
    unit: 'CTNS',
    weight: 100,
    volume: 100,
    method: '代理报关',
    status: '未报关',
    travel: '否',
    fileStatus: '点击上传',
  },
]);

const warehouseRows = reactive([
  {
    id: 1,
    inboundNo: 'UKSZ26060094',
    checkFile: '点击上传',
    status: '已核实',
    shipper: '艾力克',
    destination: 'FELIXSTOWE',
    actualDate: '',
    fbaNo: '',
    labels: '',
    quantity: 100,
    unit: 'CTNS',
    weight: 100,
    volume: 100,
    driverPhone: '',
  },
]);

const formatTotal = computed(() => ({
  pieces: cargoParties.reduce((sum, item) => sum + item.lines.reduce((lineSum, line) => lineSum + Number(line.quantity || 0), 0), 0),
  weight: cargoParties.reduce((sum, item) => sum + item.lines.reduce((lineSum, line) => lineSum + Number(line.weight || 0), 0), 0),
  volume: cargoParties.reduce((sum, item) => sum + item.lines.reduce((lineSum, line) => lineSum + Number(line.volume || 0), 0), 0),
}));

const toggleOption = (target: string[], value: string) => {
  const index = target.indexOf(value);
  if (index >= 0) target.splice(index, 1);
  else target.push(value);
};

const addCargoParty = () => {
  cargoParties.push({
    id: Date.now(),
    title: `货物信息 ${cargoParties.length + 1}`,
    shipper: '',
    shipperAddress: '',
    consignee: '',
    consigneeAddress: '',
    notifyParty: '',
    overseasAgent: '',
    terms: '',
    payTerm: '',
    expanded: true,
    lines: [],
  });
};

const addCargoLine = (party: CargoParty) => {
  party.lines.push({
    id: Date.now(),
    chineseName: '',
    englishName: '',
    marks: '',
    hsCode: '',
    cartonNo: '',
    quantity: 0,
    unit: 'CTNS',
    weight: 0,
    volume: 0,
  });
};

const removeCargoLine = (party: CargoParty, row: CargoLine) => {
  party.lines = party.lines.filter((line) => line.id !== row.id);
};

const feedback = (text: string) => {
  Message.success(text);
};

const syncOrderForm = (row?: DetailSourceRow | null) => {
  if (!row) return;
  orderForm.orderNo = row.orderNo || row.businessNo || 'PTP26060094';
  orderForm.businessNo = row.businessNo || orderForm.businessNo;
  orderForm.hblNo = row.hblNo || orderForm.hblNo;
  orderForm.mblNo = row.mblNo || orderForm.mblNo;
  orderForm.inboundNo = row.inboundNo || orderForm.inboundNo;
  orderForm.statusText = row.statusText || orderForm.statusText;
  orderForm.statusKey = row.pill || orderForm.statusKey;
  orderForm.customer = row.customer || row.shipper || orderForm.customer;
  orderForm.businessType = row.businessType || orderForm.businessType;
  orderForm.sales = row.salesman || orderForm.sales;
  orderForm.customerService = row.customerService || orderForm.customerService;
  orderForm.operator = row.operator || orderForm.operator;
  orderForm.pol = row.pol || orderForm.pol;
  orderForm.pod = row.pod || orderForm.pod;
  orderForm.etd = row.etd || orderForm.etd;
  orderForm.eta = row.eta || orderForm.eta;
  if (cargoParties[0] && (row.shipper || row.consignee)) {
    cargoParties[0].shipper = row.shipper || cargoParties[0].shipper;
    cargoParties[0].consignee = row.consignee || cargoParties[0].consignee;
  }
};

watch(() => props.row, syncOrderForm, { immediate: true });

const closeDrawer = () => {
  emit('update:visible', false);
};
</script>

<template>
  <a-drawer
    class="detail-drawer"
    :visible="visible"
    width="calc(100vw - 32px)"
    :footer="false"
    unmount-on-close
    @update:visible="emit('update:visible', $event)"
  >
  <div class="detail-drawer-body order-detail-page">
    <div class="dds-head">
      <div class="dds-head__left">
        <a-tooltip content="关闭详情">
          <a-button type="text" class="row-action-btn" @click="closeDrawer">
            <icon-left />
          </a-button>
        </a-tooltip>
        <span class="dds-order-no mono">{{ orderForm.orderNo }}</span>
        <span class="s-pill" :data-s="orderForm.statusKey">{{ orderForm.statusText }}</span>
        <span class="dds-company" :title="orderForm.customer">{{ orderForm.customer }}</span>
        <span class="detail-drawer-status__sub">境外单号：{{ orderForm.overseasNo }}</span>
      </div>
      <div class="dds-head__actions">
        <a-button size="small" @click="feedback('并单窗口已打开')">并单</a-button>
        <a-button size="small" @click="feedback('归档完成')">
          <template #icon><icon-archive /></template>
          归档
        </a-button>
        <a-dropdown trigger="click">
          <a-button size="small">
            更多
            <icon-down />
          </a-button>
          <template #content>
            <a-doption @click="feedback('业务单已复制')">
              <template #icon><icon-copy /></template>
              复制业务单
            </a-doption>
            <a-doption @click="feedback('打印任务已创建')">
              <template #icon><icon-printer /></template>
              打印业务单
            </a-doption>
            <a-divider class="row-action-menu__divider" />
            <a-doption class="danger-opt" @click="feedback('废弃前需要二次确认')">
              <template #icon><icon-delete /></template>
              废弃
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>

    <div class="dds-hero">
      <div class="dds-hero__route">
        <span class="dds-hero__label">航线</span>
        <div class="dds-hero__route-main">
          <span class="dds-hero__port">{{ orderForm.pol }}</span>
          <span class="dds-hero__arrow">→</span>
          <span class="dds-hero__port">{{ orderForm.pod }}</span>
        </div>
        <div class="dds-hero__sub">{{ orderForm.polCode }} / {{ orderForm.podCode }} · {{ orderForm.transportTerm }}</div>
      </div>
      <div class="dds-hero__facts">
        <div class="dds-hero-fact">
          <span class="dds-hero-fact__label">HBL 单号</span>
          <span class="dds-hero-fact__value mono">{{ orderForm.hblNo }}</span>
        </div>
        <div class="dds-hero-fact">
          <span class="dds-hero-fact__label">入仓单号</span>
          <span class="dds-hero-fact__value mono">{{ orderForm.inboundNo }}</span>
        </div>
        <div class="dds-hero-fact">
          <span class="dds-hero-fact__label">ETD / ETA</span>
          <span class="dds-hero-fact__value dds-hero-fact__value--date">{{ orderForm.etd }} / {{ orderForm.eta }}</span>
        </div>
        <div class="dds-hero-fact">
          <span class="dds-hero-fact__label">船公司</span>
          <span class="dds-hero-fact__value">{{ orderForm.carrier }}</span>
        </div>
        <div class="dds-hero-fact dds-hero-fact--customer">
          <span class="dds-hero-fact__label">客户 / 业务类型</span>
          <span class="dds-hero-fact__value" :title="`${orderForm.customer} / ${orderForm.businessType}`">
            {{ orderForm.customer }} / {{ orderForm.businessType }}
          </span>
        </div>
      </div>
    </div>

    <div class="dds-steps-bar">
      <a-steps class="od-steps" size="small" :current="currentStep">
        <a-step v-for="item in milestones" :key="item" :title="item" />
      </a-steps>
    </div>

    <div class="detail-drawer-scroll od-detail-scroll">
      <div>
        <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">订单信息</h4>
                <div class="detail-section__actions">
                  <a-button size="small" @click="feedback('订单信息已复制')">
                    <template #icon><icon-copy /></template>
                    复制
                  </a-button>
                </div>
              </div>
              <div class="detail-section__body">
                <a-form class="detail-form" layout="vertical" :model="orderForm">
                  <div class="detail-form-grid detail-form-grid--4">
                    <a-form-item label="业务单号">
                      <a-input v-model="orderForm.businessNo" size="small" disabled />
                    </a-form-item>
                    <a-form-item label="HBL 单号">
                      <a-input v-model="orderForm.hblNo" size="small" disabled />
                    </a-form-item>
                    <a-form-item label="MBL 单号">
                      <a-input v-model="orderForm.mblNo" size="small" />
                    </a-form-item>
                    <a-form-item label="入仓单号">
                      <a-input v-model="orderForm.inboundNo" size="small" />
                    </a-form-item>
                    <a-form-item label="客户">
                      <a-input-group compact>
                        <a-input v-model="orderForm.customer" size="small" />
                        <a-button size="small" type="primary">复制</a-button>
                      </a-input-group>
                    </a-form-item>
                    <a-form-item label="业务类型">
                      <a-select v-model="orderForm.businessType" size="small">
                        <a-option value="FOB">FOB</a-option>
                        <a-option value="FBA">FBA</a-option>
                        <a-option value="EXW">EXW</a-option>
                        <a-option value="DDP">DDP</a-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="服务范围">
                      <a-input v-model="orderForm.serviceScope" size="small" disabled />
                    </a-form-item>
                    <a-form-item label="装箱方式">
                      <a-select v-model="orderForm.loadingType" size="small">
                        <a-option value="LCL GROUP（自拼）">LCL GROUP（自拼）</a-option>
                        <a-option value="FCL">FCL</a-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-form>

                <div class="detail-option-group">
                  <span class="detail-option-group__label">服务项</span>
                  <div class="svc-tags">
                    <button
                      v-for="item in serviceOptions"
                      :key="item"
                      class="svc-tag"
                      :class="{ 'svc-tag--on': orderForm.goodsTypes.includes(item) }"
                      type="button"
                      role="checkbox"
                      :aria-checked="orderForm.goodsTypes.includes(item)"
                      @click="toggleOption(orderForm.goodsTypes, item)"
                    >
                      {{ item }}
                    </button>
                  </div>
                </div>
              </div>
        </div>

        <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">基础信息</h4>
              </div>
              <div class="detail-section__body">
                <a-form class="detail-form" layout="vertical" :model="orderForm">
                  <div class="form-subgroup-label">港口与航线</div>
                  <div class="detail-form-grid detail-form-grid--4">
                    <a-form-item label="起运港" required>
                      <a-input-group compact>
                        <a-input v-model="orderForm.polCode" size="small" />
                        <a-input v-model="orderForm.pol" size="small" />
                      </a-input-group>
                    </a-form-item>
                    <a-form-item label="目的港" required>
                      <a-input-group compact>
                        <a-input v-model="orderForm.podCode" size="small" />
                        <a-input v-model="orderForm.pod" size="small" />
                      </a-input-group>
                    </a-form-item>
                    <a-form-item label="目的地">
                      <a-input-group compact>
                        <a-input v-model="orderForm.destinationCode" size="small" />
                        <a-input v-model="orderForm.destination" size="small" />
                      </a-input-group>
                    </a-form-item>
                    <a-form-item label="船公司">
                      <a-input v-model="orderForm.carrier" size="small" />
                    </a-form-item>
                    <a-form-item label="大船船名/航次" class="detail-form-grid__span2">
                      <a-input-group compact>
                        <a-input v-model="orderForm.vessel" size="small" />
                        <a-input v-model="orderForm.voyage" size="small" />
                      </a-input-group>
                    </a-form-item>
                    <a-form-item label="合约号" class="detail-form-grid__span2">
                      <a-input v-model="orderForm.contractNo" size="small" />
                    </a-form-item>
                  </div>

                  <div class="form-subgroup-label form-subgroup-label--mt">时间与条款</div>
                  <div class="detail-form-grid detail-form-grid--4">
                    <a-form-item label="ETD" required>
                      <a-date-picker v-model="orderForm.etd" size="small" />
                    </a-form-item>
                    <a-form-item label="ETA">
                      <a-date-picker v-model="orderForm.eta" size="small" />
                    </a-form-item>
                    <a-form-item label="ATD">
                      <a-date-picker v-model="orderForm.atd" size="small" />
                    </a-form-item>
                    <a-form-item label="ATA">
                      <a-date-picker v-model="orderForm.ata" size="small" />
                    </a-form-item>
                    <a-form-item label="运输条款">
                      <a-select v-model="orderForm.transportTerm" size="small">
                        <a-option value="CFS-CFS">CFS-CFS</a-option>
                        <a-option value="CY-CY">CY-CY</a-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="提单格式" required>
                      <a-select v-model="orderForm.blTerm" size="small">
                        <a-option value="PTP提单">PTP提单</a-option>
                        <a-option value="船东单">船东单</a-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="柜子类型">
                      <a-select v-model="orderForm.containerType" size="small">
                        <a-option value="亚马逊柜">亚马逊柜</a-option>
                        <a-option value="普通柜">普通柜</a-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="下单品名">
                      <a-input v-model="orderForm.carrier" size="small" />
                    </a-form-item>
                  </div>

                  <div class="form-subgroup-label form-subgroup-label--mt">仓库与备注</div>
                  <div class="detail-form-grid detail-form-grid--4">
                    <a-form-item label="预计仓库" required>
                      <a-input-group compact>
                        <a-input v-model="orderForm.warehouse" size="small" />
                        <a-input v-model="orderForm.warehouseMode" size="small" />
                      </a-input-group>
                    </a-form-item>
                    <a-form-item label="STORAGE">
                      <a-input v-model="orderForm.storage" size="small" placeholder="请输入 STORAGE" />
                    </a-form-item>
                    <a-form-item label="D/M">
                      <a-input v-model="orderForm.dm" size="small" placeholder="D/M" />
                    </a-form-item>
                    <a-form-item label="D/T">
                      <a-input v-model="orderForm.dt" size="small" placeholder="D/T" />
                    </a-form-item>
                    <a-form-item label="客户备注" class="detail-form-grid__span2">
                      <a-textarea v-model="orderForm.customerRemark" size="small" placeholder="请输入客户备注" />
                    </a-form-item>
                    <a-form-item label="操作备注" class="detail-form-grid__span2">
                      <a-textarea v-model="orderForm.operationRemark" size="small" placeholder="请输入操作备注" />
                    </a-form-item>
                  </div>
                </a-form>

                <div class="detail-option-group">
                  <span class="detail-option-group__label">货物类型</span>
                  <div class="svc-tags">
                    <button
                      v-for="item in cargoOptions"
                      :key="item"
                      class="svc-tag"
                      :class="{
                        'svc-tag--on': orderForm.cargoAttrs.includes(item),
                        'svc-tag--risk': ['危险货', '电池', '化工品', '液体/粉末'].includes(item),
                      }"
                      type="button"
                      role="checkbox"
                      :aria-checked="orderForm.cargoAttrs.includes(item)"
                      @click="toggleOption(orderForm.cargoAttrs, item)"
                    >
                      {{ item }}
                    </button>
                  </div>
                </div>
              </div>
        </div>
      </div>

      <div>
        <div class="detail-section detail-module">
              <div class="detail-section__head">
                <h4 class="detail-section__title">货物信息</h4>
                <div class="detail-section__actions">
                  <a-button size="small" @click="feedback('分单数据已复制')">
                    <template #icon><icon-copy /></template>
                    复制分单数据
                  </a-button>
                  <a-button size="small" @click="addCargoParty">
                    <template #icon><icon-plus /></template>
                    添加发货人
                  </a-button>
                </div>
              </div>

              <div class="detail-module-summary detail-module-summary--inline detail-module-summary--cargo">
                <div class="detail-module-summary__stats">
                  <span class="detail-module-summary__stat detail-module-summary__stat--qty">
                    <span class="detail-module-summary__stat-label">总件数</span>
                    <span class="detail-module-summary__stat-value">{{ formatTotal.pieces }}</span>
                    <span class="detail-module-summary__stat-unit">件</span>
                  </span>
                  <span class="detail-module-summary__stat detail-module-summary__stat--weight">
                    <span class="detail-module-summary__stat-label">总重量</span>
                    <span class="detail-module-summary__stat-value">{{ formatTotal.weight }}</span>
                    <span class="detail-module-summary__stat-unit">KG</span>
                  </span>
                  <span class="detail-module-summary__stat detail-module-summary__stat--volume">
                    <span class="detail-module-summary__stat-label">总体积</span>
                    <span class="detail-module-summary__stat-value">{{ formatTotal.volume }}</span>
                    <span class="detail-module-summary__stat-unit">CBM</span>
                  </span>
                </div>
              </div>

              <div class="detail-module__sublist">
                <div
                  v-for="(party, index) in cargoParties"
                  :key="party.id"
                  class="detail-module__subitem"
                  :class="[
                    party.expanded ? 'detail-module__subitem--expanded' : 'detail-module__subitem--collapsed',
                    { 'detail-module__subitem--last': index === cargoParties.length - 1 },
                  ]"
                >
                  <div class="detail-subitem__head" @click="party.expanded = !party.expanded">
                    <span class="detail-subitem__index">{{ index + 1 }}</span>
                    <div class="detail-subitem__meta">
                      <span class="detail-subitem__title">{{ party.title }}</span>
                      <span class="detail-subitem__desc" :title="party.shipper">{{ party.shipper || '未维护发货人' }}</span>
                    </div>
                    <div class="detail-subitem__stats">
                      <span class="detail-data-stats">
                        <span class="detail-data-stats__item">
                          <span class="detail-data-stats__label">品名</span>
                          <span class="detail-data-stats__val">{{ party.lines.length }}</span>
                        </span>
                        <span class="detail-data-stats__item">
                          <span class="detail-data-stats__label">重量</span>
                          <span class="detail-data-stats__val">{{ party.lines.reduce((sum, line) => sum + line.weight, 0) }}</span>
                          <span class="detail-data-stats__unit">KG</span>
                        </span>
                      </span>
                    </div>
                    <button
                      class="detail-collapse-toggle"
                      :class="{ 'detail-collapse-toggle--expanded': party.expanded }"
                      type="button"
                      @click.stop="party.expanded = !party.expanded"
                    >
                      <span class="detail-collapse-toggle__text">{{ party.expanded ? '收起' : '展开' }}</span>
                      <icon-down class="detail-collapse-toggle__icon" />
                    </button>
                  </div>

                  <div v-if="party.expanded" class="detail-subitem__body">
                    <div class="detail-child-pane">
                      <div class="detail-child-pane__head">
                        <div>
                          <div class="detail-child-pane__title">收发货方</div>
                          <div class="detail-child-pane__desc">维护该发货人名下的通知人、收货人和海外代理。</div>
                        </div>
                      </div>
                      <a-form class="detail-form" layout="vertical" :model="party">
                        <div class="detail-form-grid detail-form-grid--4">
                          <a-form-item label="发货人" required class="detail-form-grid__span2">
                            <a-textarea v-model="party.shipper" size="small" />
                          </a-form-item>
                          <a-form-item label="收货人" required class="detail-form-grid__span2">
                            <a-textarea v-model="party.consignee" size="small" />
                          </a-form-item>
                          <a-form-item label="发货人地址" class="detail-form-grid__span2">
                            <a-textarea v-model="party.shipperAddress" size="small" />
                          </a-form-item>
                          <a-form-item label="收货人地址" class="detail-form-grid__span2">
                            <a-textarea v-model="party.consigneeAddress" size="small" />
                          </a-form-item>
                          <a-form-item label="通知人" class="detail-form-grid__span2">
                            <a-textarea v-model="party.notifyParty" size="small" />
                          </a-form-item>
                          <a-form-item label="海外代理" class="detail-form-grid__span2">
                            <a-textarea v-model="party.overseasAgent" size="small" />
                          </a-form-item>
                          <a-form-item label="贸易条款" required>
                            <a-select v-model="party.terms" size="small">
                              <a-option value="DAP">DAP</a-option>
                              <a-option value="FOB">FOB</a-option>
                              <a-option value="EXW">EXW</a-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item label="付款方式">
                            <a-input v-model="party.payTerm" size="small" placeholder="请选择付款方式" />
                          </a-form-item>
                        </div>
                      </a-form>
                    </div>

                    <div class="detail-child-pane detail-child-pane--lines">
                      <div class="detail-child-pane__head">
                        <div>
                          <div class="detail-child-pane__title">品名明细</div>
                          <div class="detail-child-pane__desc">品名、件数、重量和体积归属于当前发货人。</div>
                        </div>
                        <a-button size="small" @click="addCargoLine(party)">
                          <template #icon><icon-plus /></template>
                          添加品名
                        </a-button>
                      </div>
                      <div class="detail-child-pane__table">
                        <vxe-table
                          class="detail-mini-vxe"
                          border="none"
                          size="small"
                          :data="party.lines"
                          :row-config="{ isHover: true, keyField: 'id', height: 38 }"
                        >
                          <template #empty>
                            <div class="detail-mini-empty">暂无品名明细，点击添加品名录入该发货人名下货物</div>
                          </template>
                          <vxe-column type="checkbox" width="42" />
                          <vxe-column field="chineseName" title="中文品名" width="260">
                            <template #default="{ row }">
                              <a-input v-model="row.chineseName" size="small" placeholder="请输入中文品名" />
                            </template>
                          </vxe-column>
                          <vxe-column field="englishName" title="英文品名" min-width="200">
                            <template #default="{ row }">
                              <a-input v-model="row.englishName" size="small" placeholder="请输入英文品名" />
                            </template>
                          </vxe-column>
                          <vxe-column field="marks" title="唛头" width="180">
                            <template #default="{ row }">
                              <a-input v-model="row.marks" size="small" placeholder="请输入唛头" />
                            </template>
                          </vxe-column>
                          <vxe-column field="hsCode" title="HS CODE" width="150">
                            <template #default="{ row }">
                              <a-input v-model="row.hsCode" size="small" placeholder="请输入 HS Code" />
                            </template>
                          </vxe-column>
                          <vxe-column field="cartonNo" title="柜号" width="180">
                            <template #default="{ row }">
                              <a-input v-model="row.cartonNo" size="small" />
                            </template>
                          </vxe-column>
                          <vxe-column field="quantity" title="件数" width="110" align="right">
                            <template #default="{ row }">
                              <a-input-number v-model="row.quantity" size="small" :min="0" />
                            </template>
                          </vxe-column>
                          <vxe-column field="unit" title="包装单位" width="130">
                            <template #default="{ row }">
                              <a-select v-model="row.unit" size="small">
                                <a-option value="CTNS">CTNS</a-option>
                                <a-option value="PLTS">PLTS</a-option>
                              </a-select>
                            </template>
                          </vxe-column>
                          <vxe-column field="weight" title="毛重(KG)" width="120" align="right">
                            <template #default="{ row }">
                              <a-input-number v-model="row.weight" size="small" :min="0" />
                            </template>
                          </vxe-column>
                          <vxe-column field="volume" title="体积(CBM)" width="120" align="right">
                            <template #default="{ row }">
                              <a-input-number v-model="row.volume" size="small" :min="0" />
                            </template>
                          </vxe-column>
                          <vxe-column title="操作" width="74" fixed="right" align="center">
                            <template #default="{ row }">
                              <a-tooltip content="删除品名">
                                <a-button type="text" class="row-action-btn" status="danger" @click="removeCargoLine(party, row)">
                                  <icon-delete />
                                </a-button>
                              </a-tooltip>
                            </template>
                          </vxe-column>
                        </vxe-table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>

      <div>
        <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">装柜信息</h4>
                <div class="detail-section__actions">
                  <a-button size="small" @click="feedback('封号已清除')">清除柜封号</a-button>
                </div>
              </div>
              <div class="detail-section__body detail-section__body--table">
                <vxe-table
                  class="detail-mini-vxe"
                  border="none"
                  size="small"
                  :data="containerRows"
                  :row-config="{ isHover: true, keyField: 'id', height: 38 }"
                >
                  <vxe-column field="containerType" title="柜型" width="88">
                    <template #default="{ row }">
                      <a-select v-model="row.containerType" size="small">
                        <a-option value="LCL">LCL</a-option>
                        <a-option value="40HQ">40HQ</a-option>
                      </a-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="cartonNo" title="柜号" width="160" />
                  <vxe-column field="sealNo" title="封号" width="160" />
                  <vxe-column field="soNo" title="SO号" min-width="140">
                    <template #default="{ row }">
                      <a-input v-model="row.soNo" size="small" />
                    </template>
                  </vxe-column>
                  <vxe-column field="quantity" title="件数" width="72" align="right" />
                  <vxe-column field="unit" title="包装单位" width="72" />
                  <vxe-column field="weight" title="毛重(KG)" width="100" align="right" />
                  <vxe-column field="volume" title="体积(CBM)" width="100" align="right" />
                  <vxe-column field="planTime" title="预计派送时间" width="148">
                    <template #default="{ row }">
                      <a-date-picker v-model="row.planTime" size="small" />
                    </template>
                  </vxe-column>
                  <vxe-column field="actualTime" title="实际派送时间" width="148">
                    <template #default="{ row }">
                      <a-date-picker v-model="row.actualTime" size="small" />
                    </template>
                  </vxe-column>
                  <vxe-column field="customsTravel" title="海关放行状态" width="100">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="row.customsTravel === '否' ? 'wait' : 'acc'">{{ row.customsTravel }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="chargeWeight" title="重量体积比" width="100" align="right" />
                </vxe-table>
              </div>
        </div>

        <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">报关信息</h4>
                <div class="detail-section__actions">
                  <a-button size="small">
                    <template #icon><icon-upload /></template>
                    发送报关资料
                  </a-button>
                  <a-button size="small">
                    <template #icon><icon-plus /></template>
                    新增报关票数
                  </a-button>
                </div>
              </div>
              <div class="detail-section__body detail-section__body--table">
                <vxe-table
                  class="detail-mini-vxe"
                  border="none"
                  size="small"
                  :data="customsRows"
                  :row-config="{ isHover: true, keyField: 'id', height: 38 }"
                >
                  <vxe-column field="shipper" title="发货人" width="120">
                    <template #default="{ row }">
                      <a-select v-model="row.shipper" size="small">
                        <a-option value="艾力克">艾力克</a-option>
                      </a-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="documentName" title="报关资料" min-width="160">
                    <template #default="{ row }">
                      <a-input v-model="row.documentName" size="small" placeholder="报关资料名称" />
                    </template>
                  </vxe-column>
                  <vxe-column field="declarationNo" title="关单号" width="148">
                    <template #default="{ row }">
                      <a-input v-model="row.declarationNo" size="small" placeholder="关单号" />
                    </template>
                  </vxe-column>
                  <vxe-column field="quantity" title="件数" width="80" align="right" />
                  <vxe-column field="unit" title="包装单位" width="80" />
                  <vxe-column field="weight" title="毛重(KG)" width="100" align="right" />
                  <vxe-column field="volume" title="体积(CBM)" width="100" align="right" />
                  <vxe-column field="method" title="报关方式" width="120">
                    <template #default="{ row }">
                      <a-select v-model="row.method" size="small">
                        <a-option value="代理报关">代理报关</a-option>
                        <a-option value="买单报关">买单报关</a-option>
                      </a-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="status" title="报关状态" width="88">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="{ '未报关': 'draft', '报关中': 'op', '已报关': 'acc' }[row.status] ?? 'draft'">
                        {{ row.status }}
                      </span>
                    </template>
                  </vxe-column>
                  <vxe-column field="travel" title="是否放行" width="84">
                    <template #default="{ row }">
                      <span class="s-pill" :data-s="row.travel === '否' ? 'wait' : 'acc'">{{ row.travel }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="fileStatus" title="报关单" width="120">
                    <template #default="{ row }">
                      <span class="link-text">{{ row.fileStatus }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="操作" width="56" fixed="right" align="center">
                    <template #default>
                      <a-tooltip content="删除报关行">
                        <a-button type="text" class="row-action-btn" status="danger">
                          <icon-delete />
                        </a-button>
                      </a-tooltip>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
        </div>

        <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">入仓信息</h4>
                <div class="detail-section__actions">
                  <a-button size="small">三方仓入仓数据</a-button>
                </div>
              </div>
              <div class="detail-section__body detail-section__body--table">
                <vxe-table
                  class="detail-mini-vxe"
                  border="none"
                  size="small"
                  :data="warehouseRows"
                  :row-config="{ isHover: true, keyField: 'id', height: 38 }"
                >
                  <vxe-column field="inboundNo" title="入仓单号" width="148" />
                  <vxe-column field="checkFile" title="入仓核实单" width="100">
                    <template #default="{ row }">
                      <span class="link-text">{{ row.checkFile }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="status" title="状态" width="84">
                    <template #default="{ row }">
                      <span class="s-pill" data-s="acc">{{ row.status }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="shipper" title="发货人" width="120" />
                  <vxe-column field="destination" title="目的地" width="120" />
                  <vxe-column field="actualDate" title="实际进仓日期" width="148">
                    <template #default="{ row }">
                      <a-date-picker v-model="row.actualDate" size="small" />
                    </template>
                  </vxe-column>
                  <vxe-column field="fbaNo" title="FBA号" width="148">
                    <template #default="{ row }">
                      <a-input v-model="row.fbaNo" size="small" placeholder="FBA货件编号" />
                    </template>
                  </vxe-column>
                  <vxe-column field="labels" title="理货标签" width="120">
                    <template #default="{ row }">
                      <a-input v-model="row.labels" size="small" placeholder="标签备注" />
                    </template>
                  </vxe-column>
                  <vxe-column field="quantity" title="件数" width="72" align="right" />
                  <vxe-column field="unit" title="包装单位" width="72" />
                  <vxe-column field="weight" title="毛重(KG)" width="100" align="right" />
                  <vxe-column field="volume" title="体积(CBM)" width="100" align="right" />
                  <vxe-column field="driverPhone" title="司机电话" min-width="120">
                    <template #default="{ row }">
                      <a-input v-model="row.driverPhone" size="small" placeholder="请输入司机电话" />
                    </template>
                  </vxe-column>
                  <vxe-column title="操作" width="56" fixed="right" align="center">
                    <template #default>
                      <a-tooltip content="删除入仓行">
                        <a-button type="text" class="row-action-btn" status="danger">
                          <icon-delete />
                        </a-button>
                      </a-tooltip>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
        </div>
      </div>

      <div>
        <div class="detail-section">
              <div class="detail-section__head">
                <h4 class="detail-section__title">提单管理</h4>
                <div class="detail-section__actions">
                  <a-button size="small">
                    <template #icon><icon-upload /></template>
                    上传 MBL COPY 件
                  </a-button>
                </div>
              </div>
              <div class="detail-section__body">
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <span class="detail-field__label">HBL 单号</span>
                    <span class="detail-field__val mono">{{ orderForm.hblNo }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">MBL 单号</span>
                    <span class="detail-field__val mono">{{ orderForm.mblNo }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">提单格式</span>
                    <span class="detail-field__val">{{ orderForm.blTerm }}</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-field__label">文件状态</span>
                    <span class="detail-field__val"><span class="s-pill" data-s="wait">待补料</span></span>
                  </div>
                  <div class="detail-field detail-field--wide">
                    <span class="detail-field__label">补料说明</span>
                    <span class="detail-field__val">核对发货人、收货人、唛头和品名明细后生成补料单。</span>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>

    <div class="detail-drawer-footer od-footer">
      <a-button size="small" @click="feedback('入仓单和理货标签已下载')">
        <template #icon><icon-download /></template>
        下载入仓单和理货标签
      </a-button>
      <a-button size="small" class="btn-muted-warn" @click="feedback('订舱已提交')">订舱</a-button>
      <a-button size="small" class="btn-muted-warn" @click="feedback('放舱已提交')">放舱</a-button>
      <a-button size="small" @click="feedback('打印任务已创建')">
        <template #icon><icon-printer /></template>
        打印业务单
      </a-button>
      <a-button size="small" @click="feedback('提单打印任务已创建')">
        <template #icon><icon-file /></template>
        提单打印
      </a-button>
      <a-button size="small" @click="feedback('发送舱前通知')">
        <template #icon><icon-send /></template>
        发送舱前
      </a-button>
      <a-button size="small" type="primary" @click="feedback('订单详情已保存')">
        <template #icon><icon-save /></template>
        保存
      </a-button>
      <a-button size="small" status="danger" @click="feedback('废弃前需要二次确认')">废弃</a-button>
    </div>
  </div>
  </a-drawer>
</template>

<style scoped>
.order-detail-page {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.od-steps {
  max-width: 760px;
}

.od-detail-scroll {
  display: flex;
  flex-direction: column;
  gap: var(--dense-gap-module);
}

.od-footer {
  justify-content: flex-end;
}

@media (max-width: 1280px) {
  .od-footer {
    flex-wrap: wrap;
  }
}
</style>
