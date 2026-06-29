<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import {
  IconClose,
  IconCopy,
  IconDelete,
  IconEdit,
  IconExpand,
  IconPlus,
  IconShrink,
  IconUpload,
} from '@arco-design/web-vue/es/icon';

interface StaffRow {
  id: number;
  role: string;
  name: string;
}

interface CargoLine {
  id: number;
  nameCn: string;
  nameEn: string;
  mark: string;
  hsCode: string;
  pieces: number | undefined;
  unit: string;
  weight: number | undefined;
  volume: number | undefined;
}

interface CargoParty {
  id: number;
  expanded: boolean;
  shipperMain: string;
  shipperSub: string;
  consigneeMain: string;
  consigneeSub: string;
  notifyMain: string;
  notifySub: string;
  agentMain: string;
  agentSub: string;
  vat: string;
  eori: string;
  remark: string;
  lines: CargoLine[];
}

interface CustomsRow {
  id: number;
  declarant: string;
  method: string;
  uploadTime: string;
  submitStatus: '' | 'uploaded';
}

interface BlRow {
  id: number;
  hblNo: string;
  containerSeal: string;
  vehicleSpec: string;
  packingMethod: string;
  pickupOrder: string;
  courierNo: string;
  mblNo: string;
  pieces: number | undefined;
  unit: string;
  quantity: number | undefined;
  weight: number | undefined;
  volume: number | undefined;
  dimensions: string;
}

interface ClearanceRow {
  id: number;
  importer: string;
  eoriCode: string;
  vatNo: string;
  invoiceNo: string;
  address: string;
  fasCustoms: string;
}

const props = withDefaults(
  defineProps<{
    visible: boolean;
    mode?: 'create' | 'edit';
    businessNo?: string;
  }>(),
  { mode: 'create' }
);

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const isFullscreen = ref(false);
const submitting = ref(false);
const isEditing = ref(true);
const isDirty = ref(false);
const activeSection = ref('sec-core');
const editingBlRowId = ref<number | null>(null);
const scrollRoot = ref<HTMLElement>();

const staffDraft = reactive({ role: '业务', name: '' });

let idSeq = 30;

const drawerWidth = computed(() => (isFullscreen.value ? '100vw' : 'calc(100vw - 32px)'));

const sectionNav = [
  { key: 'sec-core', label: '下单' },
  { key: 'sec-staff', label: '人员' },
  { key: 'sec-basic', label: '基础' },
  { key: 'sec-cargo', label: '货物' },
  { key: 'sec-customs', label: '报关' },
  { key: 'sec-bl', label: '提单' },
  { key: 'sec-clearance', label: '清关' },
] as const;

const serviceItems = reactive([
  { key: 'booking', label: '订舱', checked: true },
  { key: 'release', label: '放舱', checked: false },
  { key: 'trucking', label: '拖车', checked: false },
  { key: 'warehouse', label: '仓库内装', checked: true },
  { key: 'customs', label: '报关', checked: true },
  { key: 'insurance', label: '保险', checked: false },
  { key: 'clearance', label: '清关', checked: true },
  { key: 'delivery', label: '派送', checked: true },
]);

const form = reactive({
  businessType: 'FBA',
  packingType: 'LCL GROUP (自拼)',
  customer: '385981-深圳市东和国际物流有限公司',
  po: '',
  businessNo: 'LCL23092576',
  ownerCompany: 'PTPSZ · 深圳东和国际',
  serviceScope: '',
  placeOfReceipt: '',
  destination: '',
  etd: '2023-09-25',
  tradeTerms: 'FOB',
  estimatedFreight: 'SHENZHEN HAIHENGTONG S...',
  mblSignMode: '',
  storage: '',
  needWarehouseImage: false,
  cargoTypes: ['普货'] as string[],
  customerRemark: '复制单',
  pol: 'CNYTN YANTIAN, CHINA',
  carrier: 'None',
  eta: '',
  demurrageMode: 'OHL',
  estWarehouseTime: '',
  paymentMethod: 'FREIGHT COLLECT',
  dmDt: '',
  overseasAgentRemark: '',
  transitPort: '',
  route: '',
  vessel: '',
  voyage: '',
  carriageTerms: 'CY-CY',
  blMode: 'OHL提单',
  outboundTime: '',
  orderItemName: '',
  weightVolumeRatio: '1:500',
  pod: 'GBFXT FELIXSTOWE, UNITED KINGDOM',
  transportMode: '海运',
  hasCarrierFee: '否',
  hblSignMode: '',
  needDeliveryHeader: 'yes',
  containerType: '',
  orderType: 'single',
  ticketCount: '',
  triangularTrade: false,
  insertOrder: false,
  shipperMain: 'SEA FREIGHT LOGISTICS CO., LTD',
  shipperSub: 'ANJI FURNITURE MANUFACTURING',
  notifyMain: 'SAME AS CONSIGNEE',
  notifySub: 'SAME AS CONSIGNEE',
  consigneeMain: 'AMAZON EU SARL UK BRANCH',
  consigneeSub: 'AMAZON FULFILLMENT CENTRE',
  agentMain: '',
  agentSub: '',
  vat: '',
  eori: '',
  cargoRemark: '',
  clearanceTerms: '',
  prepaidTax: '否',
  pvaDeferral: '否',
  entrustFiling: '否',
  customerSelfUse: '',
});

const staffRows = ref<StaffRow[]>([
  { id: 1, role: '业务', name: 'Sandy' },
  { id: 2, role: '操作', name: 'Amy' },
  { id: 3, role: '客服', name: 'Linda' },
  { id: 4, role: '文件', name: 'Tom' },
  { id: 5, role: '单证客服', name: 'Kate' },
]);

const cargoParties = ref<CargoParty[]>([
  {
    id: 1,
    expanded: true,
    shipperMain: 'SEA FREIGHT LOGISTICS CO., LTD',
    shipperSub: 'ANJI FURNITURE MANUFACTURING',
    consigneeMain: 'AMAZON EU SARL UK BRANCH',
    consigneeSub: 'AMAZON FULFILLMENT CENTRE',
    notifyMain: 'SAME AS CONSIGNEE',
    notifySub: 'SAME AS CONSIGNEE',
    agentMain: '',
    agentSub: '',
    vat: '',
    eori: '',
    remark: '',
    lines: [
      {
        id: 1,
        nameCn: '办公椅',
        nameEn: 'OFFICE CHAIR',
        mark: 'SB-YWS-2023-001',
        hsCode: '9401300000',
        pieces: 200,
        unit: 'CTNS',
        weight: 2300,
        volume: 20,
      },
    ],
  },
  {
    id: 2,
    expanded: false,
    shipperMain: 'NINGBO EAST SUPPLY CHAIN CO., LTD',
    shipperSub: 'YIWU HOMEWARE FACTORY',
    consigneeMain: 'AMAZON EU SARL UK BRANCH',
    consigneeSub: 'UK FULFILLMENT CENTRE',
    notifyMain: 'SAME AS CONSIGNEE',
    notifySub: '',
    agentMain: 'PTP UK AGENT',
    agentSub: '',
    vat: '',
    eori: '',
    remark: '',
    lines: [
      {
        id: 2,
        nameCn: '置物架',
        nameEn: 'STORAGE RACK',
        mark: 'NB-RACK-2601',
        hsCode: '9403200000',
        pieces: 120,
        unit: 'CTNS',
        weight: 860,
        volume: 8.6,
      },
    ],
  },
]);

const customsRows = ref<CustomsRow[]>([
  {
    id: 1,
    declarant: 'SEA FREIGHT LOGISTICS CO.',
    method: '正式退税报关',
    uploadTime: '',
    submitStatus: '',
  },
]);

const blRows = ref<BlRow[]>([
  {
    id: 1,
    hblNo: '',
    containerSeal: '',
    vehicleSpec: '',
    packingMethod: '',
    pickupOrder: '',
    courierNo: '',
    mblNo: '',
    pieces: 200,
    unit: 'CTNS',
    quantity: 200,
    weight: 2300,
    volume: 20,
    dimensions: '',
  },
  {
    id: 2,
    hblNo: '',
    containerSeal: '',
    vehicleSpec: '',
    packingMethod: '',
    pickupOrder: '',
    courierNo: '',
    mblNo: '',
    pieces: undefined,
    unit: 'CTNS',
    quantity: undefined,
    weight: undefined,
    volume: undefined,
    dimensions: '',
  },
  {
    id: 3,
    hblNo: '',
    containerSeal: '',
    vehicleSpec: '',
    packingMethod: '',
    pickupOrder: '',
    courierNo: '',
    mblNo: '',
    pieces: undefined,
    unit: 'CTNS',
    quantity: undefined,
    weight: undefined,
    volume: undefined,
    dimensions: '',
  },
]);

const clearanceRows = ref<ClearanceRow[]>([]);

const cargoTypeOptions = ['普货', '危险品', '电池', '化工品', '液体/粉末', '食品', '查验'];
const roleOptions = ['业务', '操作', '客服', '文件', '单证客服'];

const checkedServices = computed(() => serviceItems.filter((i) => i.checked));

const portShort = (port: string) => {
  const code = port.match(/^([A-Z]{3,5})/)?.[1];
  if (code) return code;
  const name = port.split(',')[0]?.trim();
  return name && name.length > 12 ? `${name.slice(0, 10)}…` : name || '—';
};

const polShort = computed(() => portShort(form.pol));
const podShort = computed(() => portShort(form.pod));

const summarizeCargoLines = (rows: CargoLine[]) => ({
  pieces: rows.reduce((s, r) => s + (r.pieces || 0), 0),
  weight: rows.reduce((s, r) => s + (r.weight || 0), 0),
  volume: rows.reduce((s, r) => s + (r.volume || 0), 0),
});

const cargoSummary = computed(() => {
  const rows = cargoParties.value.flatMap((party) => party.lines);
  return summarizeCargoLines(rows);
});

const cargoPartySummary = (party: CargoParty) => summarizeCargoLines(party.lines);

const cargoPartyLabel = (index: number) => `发货人 ${String.fromCharCode(65 + index)}`;

const blSummary = computed(() => {
  const pieces = blRows.value.reduce((s, r) => s + (r.pieces || 0), 0);
  const packs = blRows.value.reduce((s, r) => s + (r.quantity || 0), 0);
  const weight = blRows.value.reduce((s, r) => s + (r.weight || 0), 0);
  const volume = blRows.value.reduce((s, r) => s + (r.volume || 0), 0);
  return { pieces, packs, weight, volume };
});

const isBlRowEditing = (id: number) => editingBlRowId.value === id;

const displayVal = (val: string | number | undefined, fallback = '—') => {
  if (val === undefined || val === null || val === '') return fallback;
  return String(val);
};

watch(
  () => props.visible,
  (open) => {
    if (!open) {
      isFullscreen.value = false;
      return;
    }
    if (props.businessNo) form.businessNo = props.businessNo;
    isEditing.value = true;
    isDirty.value = false;
    editingBlRowId.value = null;
    activeSection.value = 'sec-core';
  }
);

watch(
  [form, staffRows, cargoParties, customsRows, blRows, clearanceRows, serviceItems],
  () => {
    if (props.visible) isDirty.value = true;
  },
  { deep: true }
);

const closeDrawer = () => {
  if (isDirty.value && isEditing.value) {
    Modal.confirm({
      title: '未保存的更改',
      content: '当前有未保存的修改，确认关闭？',
      onOk: () => {
        isDirty.value = false;
        emit('update:visible', false);
      },
    });
    return;
  }
  emit('update:visible', false);
};

const scrollToSection = (key: string) => {
  activeSection.value = key;
  const root = scrollRoot.value;
  const el = root?.querySelector<HTMLElement>(`#${key}`);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const toggleService = (item: (typeof serviceItems)[number]) => {
  if (!isEditing.value) return;
  item.checked = !item.checked;
};

const onServiceKeydown = (e: KeyboardEvent, item: (typeof serviceItems)[number]) => {
  if (!isEditing.value) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleService(item);
  }
};

const addStaffFromDraft = () => {
  if (!staffDraft.name.trim()) {
    Message.warning('请填写人员姓名');
    return;
  }
  staffRows.value.push({ id: ++idSeq, role: staffDraft.role, name: staffDraft.name.trim() });
  staffDraft.name = '';
};

const removeStaff = (id: number) => {
  if (staffRows.value.length <= 1) {
    Message.warning('至少保留一条权限人员');
    return;
  }
  staffRows.value = staffRows.value.filter((r) => r.id !== id);
};

const toggleCargoParty = (party: CargoParty) => {
  party.expanded = !party.expanded;
};

const addCargoParty = () => {
  cargoParties.value.push({
    id: ++idSeq,
    expanded: true,
    shipperMain: '',
    shipperSub: '',
    consigneeMain: form.consigneeMain,
    consigneeSub: form.consigneeSub,
    notifyMain: 'SAME AS CONSIGNEE',
    notifySub: '',
    agentMain: '',
    agentSub: '',
    vat: '',
    eori: '',
    remark: '',
    lines: [],
  });
};

const removeCargoParty = (id: number) => {
  if (cargoParties.value.length <= 1) {
    Message.warning('至少保留一位发货人');
    return;
  }
  cargoParties.value = cargoParties.value.filter((party) => party.id !== id);
};

const addCargoLine = (party: CargoParty) => {
  party.expanded = true;
  party.lines.push({
    id: ++idSeq,
    nameCn: '',
    nameEn: '',
    mark: '',
    hsCode: '',
    pieces: undefined,
    unit: 'CTNS',
    weight: undefined,
    volume: undefined,
  });
};

const removeCargoLine = (party: CargoParty, id: number) => {
  party.lines = party.lines.filter((r) => r.id !== id);
};

const addCustomsRow = () => {
  customsRows.value.push({ id: ++idSeq, declarant: '', method: '正式退税报关', uploadTime: '', submitStatus: '' });
};

const removeCustomsRow = (id: number) => {
  customsRows.value = customsRows.value.filter((r) => r.id !== id);
};

const addBlRow = () => {
  const id = ++idSeq;
  blRows.value.push({
    id,
    hblNo: '',
    containerSeal: '',
    vehicleSpec: '',
    packingMethod: '',
    pickupOrder: '',
    courierNo: '',
    mblNo: '',
    pieces: undefined,
    unit: 'CTNS',
    quantity: undefined,
    weight: undefined,
    volume: undefined,
    dimensions: '',
  });
  editingBlRowId.value = id;
};

const removeBlRow = (id: number) => {
  blRows.value = blRows.value.filter((r) => r.id !== id);
  if (editingBlRowId.value === id) editingBlRowId.value = null;
};

const startEditBlRow = (id: number) => {
  editingBlRowId.value = id;
};

const finishEditBlRow = () => {
  editingBlRowId.value = null;
};

const addClearanceRow = () => {
  clearanceRows.value.push({
    id: ++idSeq,
    importer: '',
    eoriCode: '',
    vatNo: '',
    invoiceNo: '',
    address: '',
    fasCustoms: '',
  });
};

const removeClearanceRow = (id: number) => {
  clearanceRows.value = clearanceRows.value.filter((r) => r.id !== id);
};

const handleUploadPlaceholder = (label: string) => {
  Message.info(`${label}：上传组件待接入`);
};

const handleCustomsUpload = (row: CustomsRow) => {
  handleUploadPlaceholder('报关资料');
  row.submitStatus = 'uploaded';
  row.uploadTime = new Date().toISOString().slice(0, 10);
};

const handleDiscard = () => {
  Modal.confirm({
    title: '废弃业务单',
    content: '确认废弃当前业务单？废弃后不可恢复。',
    okButtonProps: { status: 'danger' },
    onOk: () => {
      Message.success('业务单已废弃');
      isDirty.value = false;
      closeDrawer();
    },
  });
};

const handleSave = () => {
  submitting.value = true;
  setTimeout(() => {
    submitting.value = false;
    isDirty.value = false;
    Message.success('业务单已保存');
  }, 600);
};

const handleSubmit = () => {
  if (!form.estWarehouseTime) {
    Message.error('请填写预计进仓时间');
    scrollToSection('sec-basic');
    return;
  }
  submitting.value = true;
  setTimeout(() => {
    submitting.value = false;
    isDirty.value = false;
    Message.success('业务单已提交');
    emit('update:visible', false);
  }, 600);
};
</script>

<template>
  <a-drawer
    :visible="visible"
    class="detail-drawer"
    :width="drawerWidth"
    :footer="false"
    :mask-closable="false"
    :esc-to-close="false"
    unmount-on-close
    @cancel="closeDrawer"
  >
    <div class="detail-drawer-body">
      <div class="dds-head">
        <div class="dds-head__main">
          <div class="dds-head__identity">
            <span class="link-text link-text--strong">海运业务单</span>
            <span class="s-pill" data-s="draft">{{ mode === 'create' ? '新建' : '编辑' }}</span>
            <span class="dds-head__meta mono">{{ form.businessNo }}</span>
          </div>
        </div>
        <div class="dds-head__actions">
          <a-tooltip :content="isFullscreen ? '退出全屏' : '全屏'">
            <a-button size="small" type="text" @click="isFullscreen = !isFullscreen">
              <template #icon>
                <icon-shrink v-if="isFullscreen" />
                <icon-expand v-else />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="关闭">
            <a-button size="small" type="text" @click="closeDrawer">
              <template #icon><icon-close /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <div class="dds-hero dds-hero--compact">
        <div class="dds-hero__route">
          <div class="dds-hero__label">航线</div>
          <div class="dds-hero__route-main">
            <span class="dds-hero__port" :title="form.pol">{{ polShort }}</span>
            <span class="dds-hero__arrow">→</span>
            <span class="dds-hero__port" :title="form.pod">{{ podShort }}</span>
          </div>
          <div class="dds-hero__sub">{{ form.businessType }} · {{ form.packingType }}</div>
        </div>
        <div class="dds-hero__facts">
          <div class="dds-hero-fact">
            <div class="dds-hero-fact__label">ETD</div>
            <div class="dds-hero-fact__value dds-hero-fact__value--date">{{ form.etd || '—' }}</div>
          </div>
          <div class="dds-hero-fact">
            <div class="dds-hero-fact__label">船司</div>
            <div class="dds-hero-fact__value">{{ form.carrier || '—' }}</div>
          </div>
          <div class="dds-hero-fact">
            <div class="dds-hero-fact__label">贸易条款</div>
            <div class="dds-hero-fact__value">{{ form.tradeTerms }}</div>
          </div>
          <div class="dds-hero-fact dds-hero-fact--trailing">
            <div class="dds-hero-fact__label">客户</div>
            <div class="dds-hero-fact__value" :title="form.customer">{{ form.customer }}</div>
          </div>
        </div>
        <div class="dds-milestone">
          <span class="dds-milestone__item" data-state="done">下单</span>
          <span class="dds-milestone__item" data-state="current">填单</span>
          <span class="dds-milestone__item">提交</span>
          <span class="dds-milestone__item">审核</span>
          <span class="dds-milestone__item">订舱</span>
        </div>
      </div>

      <div class="bo-drawer-nav bo-drawer-nav--compact zone-card">
        <div class="stat-tab-group">
          <button
            v-for="item in sectionNav"
            :key="item.key"
            type="button"
            class="stat-tab"
            :class="{ 'stat-tab--active': activeSection === item.key }"
            @click="scrollToSection(item.key)"
          >
            <span class="stat-tab__name">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div ref="scrollRoot" class="detail-drawer-scroll">
        <!-- 下单信息：hero 事实在此编辑，不在基础信息重复 -->
        <div id="sec-core" class="detail-section detail-section--core">
          <div class="detail-section__head">
            <div class="detail-section__title">下单信息</div>
          </div>
          <div class="detail-section__body">
            <template v-if="!isEditing">
              <div class="detail-form-grid detail-form-grid--4">
                <div class="detail-field">
                  <div class="detail-field__label">业务类型</div>
                  <div class="detail-field__val">{{ form.businessType }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">装箱方式</div>
                  <div class="detail-field__val">{{ form.packingType }}</div>
                </div>
                <div class="detail-field detail-field--wide">
                  <div class="detail-field__label">客户</div>
                  <div class="detail-field__val" :title="form.customer">{{ form.customer }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">PO</div>
                  <div class="detail-field__val">{{ displayVal(form.po) }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">起运港</div>
                  <div class="detail-field__val" :title="form.pol">{{ form.pol }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">目的港</div>
                  <div class="detail-field__val" :title="form.pod">{{ form.pod }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">ETD</div>
                  <div class="detail-field__val">{{ form.etd }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">贸易条款</div>
                  <div class="detail-field__val">{{ form.tradeTerms }}</div>
                </div>
              </div>
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">服务项</span>
                </div>
                <div class="svc-tags">
                  <span
                    v-for="item in checkedServices"
                    :key="item.key"
                    class="svc-tag svc-tag--on"
                    aria-disabled="true"
                  >{{ item.label }}</span>
                  <span v-if="!checkedServices.length" class="staff-inline__empty">未选择服务项</span>
                </div>
              </div>
            </template>
            <a-form v-else class="detail-form" layout="vertical" size="small" :model="form">
              <div class="detail-form-grid detail-form-grid--4">
                <a-form-item label="业务类型">
                  <a-select v-model="form.businessType" size="small" allow-clear>
                    <a-option value="FBA">FBA</a-option>
                    <a-option value="FOB">FOB</a-option>
                    <a-option value="DDP">DDP</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="装箱方式" required>
                  <a-select v-model="form.packingType" size="small" allow-clear>
                    <a-option value="LCL GROUP (自拼)">LCL GROUP (自拼)</a-option>
                    <a-option value="FCL">FCL</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="客户" required>
                  <a-select v-model="form.customer" size="small" allow-search allow-clear />
                </a-form-item>
                <a-form-item label="PO">
                  <a-input v-model="form.po" size="small" allow-clear placeholder="请输入 PO" />
                </a-form-item>
                <a-form-item label="业务单号">
                  <a-input v-model="form.businessNo" size="small" disabled />
                </a-form-item>
                <a-form-item label="服务范围">
                  <a-select v-model="form.serviceScope" size="small" allow-clear placeholder="请选择服务范围" />
                </a-form-item>
                <a-form-item label="起运港" required>
                  <a-input v-model="form.pol" size="small" allow-clear />
                </a-form-item>
                <a-form-item label="目的港" required>
                  <a-input v-model="form.pod" size="small" allow-clear />
                </a-form-item>
                <a-form-item label="ETD" required>
                  <a-date-picker v-model="form.etd" size="small" />
                </a-form-item>
                <a-form-item label="ETA">
                  <a-date-picker v-model="form.eta" size="small" placeholder="请选择 ETA" />
                </a-form-item>
                <a-form-item label="船司">
                  <a-select v-model="form.carrier" size="small" allow-clear>
                    <a-option value="None">None</a-option>
                    <a-option value="MSK">MSK</a-option>
                    <a-option value="CMA">CMA</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="贸易条款" required>
                  <a-select v-model="form.tradeTerms" size="small" allow-clear>
                    <a-option value="FOB">FOB</a-option>
                    <a-option value="CIF">CIF</a-option>
                    <a-option value="DDP">DDP</a-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">服务项</span>
                </div>
                <div class="svc-tags" role="group" aria-label="服务项">
                  <span
                    v-for="item in serviceItems"
                    :key="item.key"
                    class="svc-tag"
                    :class="{ 'svc-tag--on': item.checked }"
                    role="checkbox"
                    :aria-checked="item.checked"
                    tabindex="0"
                    @click="toggleService(item)"
                    @keydown="onServiceKeydown($event, item)"
                  >{{ item.label }}</span>
                </div>
              </div>
            </a-form>
          </div>
        </div>

        <!-- 权限人员 -->
        <div id="sec-staff" class="detail-section">
          <div class="detail-section__head">
            <div class="detail-section__title">权限人员</div>
            <div v-if="isEditing" class="detail-section__actions">
              <a-button size="small" type="outline" @click="addStaffFromDraft">
                <template #icon><icon-plus /></template>
                添加
              </a-button>
            </div>
          </div>
          <div class="detail-section__body">
            <div class="staff-compact-row">
              <div class="staff-owner">
                <span class="staff-owner__label">归属公司</span>
                <span class="staff-owner__value" :title="form.ownerCompany">{{ form.ownerCompany }}</span>
              </div>
              <div class="staff-inline">
                <span v-for="row in staffRows" :key="row.id" class="staff-chip">
                  <span class="staff-chip__role">{{ row.role }}</span>
                  <span class="staff-chip__name">{{ row.name }}</span>
                  <a-popconfirm content="确认删除该权限人员？" @ok="removeStaff(row.id)">
                    <a-button type="text" class="row-action-btn" status="danger" size="small">×</a-button>
                  </a-popconfirm>
                </span>
              </div>
              <div class="staff-add-inline">
                <a-select v-model="staffDraft.role" size="small" allow-clear>
                  <a-option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</a-option>
                </a-select>
                <a-input v-model="staffDraft.name" size="small" allow-clear placeholder="姓名" />
              </div>
            </div>
          </div>
        </div>

        <!-- 基础信息：不含 hero 已展示字段 -->
        <div id="sec-basic" class="detail-section">
          <div class="detail-section__head">
            <div class="detail-section__title">基础信息</div>
          </div>
          <div class="detail-section__body">
            <template v-if="!isEditing">
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">路线补充</span>
                </div>
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <div class="detail-field__label">收货地</div>
                    <div class="detail-field__val">{{ displayVal(form.placeOfReceipt) }}</div>
                  </div>
                  <div class="detail-field">
                    <div class="detail-field__label">中转港</div>
                    <div class="detail-field__val">{{ displayVal(form.transitPort) }}</div>
                  </div>
                  <div class="detail-field">
                    <div class="detail-field__label">目的地</div>
                    <div class="detail-field__val">{{ displayVal(form.destination) }}</div>
                  </div>
                  <div class="detail-field">
                    <div class="detail-field__label">大船船名/航次</div>
                    <div class="detail-field__val">{{ displayVal(form.vessel) }} / {{ displayVal(form.voyage) }}</div>
                  </div>
                </div>
              </div>
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">条款与费用</span>
                </div>
                <div class="detail-form-grid detail-form-grid--4">
                  <div class="detail-field">
                    <div class="detail-field__label">预计进仓时间</div>
                    <div class="detail-field__val">{{ displayVal(form.estWarehouseTime) }}</div>
                  </div>
                  <div class="detail-field">
                    <div class="detail-field__label">预计运费</div>
                    <div class="detail-field__val">{{ form.estimatedFreight }}</div>
                  </div>
                  <div class="detail-field">
                    <div class="detail-field__label">付款方式</div>
                    <div class="detail-field__val">{{ form.paymentMethod }}</div>
                  </div>
                  <div class="detail-field">
                    <div class="detail-field__label">货物类型</div>
                    <div class="detail-field__val">{{ form.cargoTypes.join('、') }}</div>
                  </div>
                </div>
              </div>
            </template>
            <a-form v-else class="detail-form" layout="vertical" size="small" :model="form">
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">路线补充</span>
                </div>
                <div class="detail-form-grid detail-form-grid--4">
                  <a-form-item label="收货地">
                    <a-input v-model="form.placeOfReceipt" size="small" allow-clear />
                  </a-form-item>
                  <a-form-item label="中转港">
                    <a-input v-model="form.transitPort" size="small" allow-clear placeholder="请输入中转港" />
                  </a-form-item>
                  <a-form-item label="目的地">
                    <a-input v-model="form.destination" size="small" allow-clear placeholder="请输入目的地" />
                  </a-form-item>
                  <a-form-item label="航线">
                    <a-select v-model="form.route" size="small" allow-clear placeholder="请选择航线" />
                  </a-form-item>
                  <a-form-item label="运输方式">
                    <a-select v-model="form.transportMode" size="small" allow-clear>
                      <a-option value="海运">海运</a-option>
                      <a-option value="空运">空运</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="大船船名/航次">
                    <div class="detail-combo">
                      <a-input v-model="form.vessel" size="small" placeholder="请输入大船船名" />
                      <a-input v-model="form.voyage" size="small" placeholder="请输入航次" />
                    </div>
                  </a-form-item>
                  <a-form-item label="是否有船司费用">
                    <a-select v-model="form.hasCarrierFee" size="small" allow-clear>
                      <a-option value="是">是</a-option>
                      <a-option value="否">否</a-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">条款与费用</span>
                </div>
                <div class="detail-form-grid detail-form-grid--4">
                  <a-form-item label="免堆模式">
                    <a-select v-model="form.demurrageMode" size="small" allow-clear>
                      <a-option value="OHL">OHL</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="承运条款">
                    <a-select v-model="form.carriageTerms" size="small" allow-clear>
                      <a-option value="CY-CY">CY-CY</a-option>
                      <a-option value="CFS-CFS">CFS-CFS</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="提单模式">
                    <a-select v-model="form.blMode" size="small" allow-clear>
                      <a-option value="OHL提单">OHL提单</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="预计运费" required>
                    <a-select v-model="form.estimatedFreight" size="small" allow-clear />
                  </a-form-item>
                  <a-form-item label="预计进仓时间" required>
                    <a-date-picker v-model="form.estWarehouseTime" size="small" />
                  </a-form-item>
                  <a-form-item label="付款方式">
                    <a-select v-model="form.paymentMethod" size="small" allow-clear>
                      <a-option value="FREIGHT COLLECT">FREIGHT COLLECT</a-option>
                      <a-option value="FREIGHT PREPAID">FREIGHT PREPAID</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="HBL 签单方式">
                    <a-select v-model="form.hblSignMode" size="small" allow-clear placeholder="请选择签单方式" />
                  </a-form-item>
                  <a-form-item label="MBL 签单方式">
                    <a-select v-model="form.mblSignMode" size="small" allow-clear placeholder="请选择 MBL 签单方式" />
                  </a-form-item>
                  <a-form-item label="STORAGE">
                    <a-input v-model="form.storage" size="small" allow-clear placeholder="请输入 STORAGE" />
                  </a-form-item>
                  <a-form-item label="DM+DT">
                    <a-input v-model="form.dmDt" size="small" allow-clear placeholder="请输入 DM+DT" />
                  </a-form-item>
                  <a-form-item label="出库时间">
                    <a-date-picker v-model="form.outboundTime" size="small" placeholder="请选择出库时间" />
                  </a-form-item>
                  <a-form-item label="下单品名">
                    <a-input v-model="form.orderItemName" size="small" allow-clear placeholder="请输入下单品名" />
                  </a-form-item>
                  <a-form-item label="重量体积比">
                    <a-select v-model="form.weightVolumeRatio" size="small" allow-clear>
                      <a-option value="1:500">1:500</a-option>
                      <a-option value="1:300">1:300</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="柜子类型">
                    <a-select v-model="form.containerType" size="small" allow-clear placeholder="请选择柜子类型" />
                  </a-form-item>
                  <a-form-item label="HBL 电放提单">
                    <a-button size="small" type="outline" @click="handleUploadPlaceholder('HBL 电放提单')">
                      <template #icon><icon-upload /></template>
                      上传文件
                    </a-button>
                  </a-form-item>
                  <a-form-item label="需要进仓单图片">
                    <a-checkbox v-model="form.needWarehouseImage">需要</a-checkbox>
                  </a-form-item>
                  <a-form-item label="是否需要交货单抬头">
                    <a-radio-group v-model="form.needDeliveryHeader" size="small">
                      <a-radio value="yes">需要</a-radio>
                      <a-radio value="no">不需要</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="货物类型" required class="detail-form-grid__span4">
                    <a-checkbox-group v-model="form.cargoTypes" size="small">
                      <a-checkbox v-for="t in cargoTypeOptions" :key="t" :value="t">{{ t }}</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="客户备注" class="detail-form-grid__span2">
                    <a-textarea v-model="form.customerRemark" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" />
                  </a-form-item>
                  <a-form-item label="境外代理备注" class="detail-form-grid__span2">
                    <a-textarea
                      v-model="form.overseasAgentRemark"
                      size="small"
                      :auto-size="{ minRows: 2, maxRows: 4 }"
                      placeholder="请输入境外代理备注（仅支持英文、数字、空格）"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="form-subgroup">
                <div class="form-subgroup__head">
                  <span class="form-subgroup__title">订单属性</span>
                </div>
                <div class="detail-form-grid detail-form-grid--4">
                  <a-form-item label="订单类型">
                    <a-radio-group v-model="form.orderType" size="small">
                      <a-radio value="single">单票单</a-radio>
                      <a-radio value="multi">多票单</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item v-if="form.orderType === 'multi'" label="票数">
                    <a-input v-model="form.ticketCount" size="small" allow-clear />
                  </a-form-item>
                  <a-form-item label="业务标记">
                    <a-space size="small">
                      <a-checkbox v-model="form.triangularTrade">三方贸易</a-checkbox>
                      <a-checkbox v-model="form.insertOrder">插单</a-checkbox>
                    </a-space>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
        </div>

        <!-- 货物信息 -->
        <div id="sec-cargo" class="detail-section detail-module">
          <div class="detail-section__head">
            <div class="detail-section__title">货物信息</div>
            <div v-if="isEditing" class="detail-section__actions">
              <a-button size="small" type="outline" @click="addCargoParty">
                <template #icon><icon-plus /></template>
                添加发货人
              </a-button>
              <a-button size="small" type="text">
                <template #icon><icon-copy /></template>
                复制分单数据
              </a-button>
            </div>
          </div>
          <div class="detail-section__body">
            <div class="detail-module-summary--inline detail-module-summary--cargo detail-module-summary--compact">
              <div class="detail-module-summary__stats">
                <div class="detail-module-summary__stat">
                  <span class="detail-module-summary__stat-label">总件数</span>
                  <span class="detail-module-summary__stat-value">{{ cargoSummary.pieces }}</span>
                </div>
                <div class="detail-module-summary__stat">
                  <span class="detail-module-summary__stat-label">总毛重</span>
                  <span class="detail-module-summary__stat-value">{{ cargoSummary.weight }}</span>
                  <span class="detail-module-summary__stat-unit">KG</span>
                </div>
                <div class="detail-module-summary__stat">
                  <span class="detail-module-summary__stat-label">总体积</span>
                  <span class="detail-module-summary__stat-value">{{ cargoSummary.volume }}</span>
                  <span class="detail-module-summary__stat-unit">CBM</span>
                </div>
              </div>
            </div>
            <div class="detail-module__sublist">
              <div
                v-for="(party, partyIndex) in cargoParties"
                :key="party.id"
                class="detail-module__subitem"
                :class="{
                  'detail-module__subitem--expanded': party.expanded,
                  'detail-module__subitem--collapsed': !party.expanded,
                  'detail-module__subitem--last': partyIndex === cargoParties.length - 1,
                }"
              >
                <div class="detail-cargo-block__head detail-cargo-block__head--compact" @click="toggleCargoParty(party)">
                  <span class="detail-cargo-block__index">{{ partyIndex + 1 }}</span>
                  <div class="detail-cargo-block__meta">
                    <span class="detail-cargo-block__title">{{ cargoPartyLabel(partyIndex) }}</span>
                    <span class="detail-cargo-block__shipper" :title="party.shipperMain">{{ displayVal(party.shipperMain, '未填写发货人') }}</span>
                    <span class="detail-cargo-block__route">
                      <span :title="form.pol">{{ polShort }}</span>
                      <span class="detail-cargo-block__arrow">→</span>
                      <span :title="form.pod">{{ podShort }}</span>
                    </span>
                  </div>
                  <div class="detail-data-stats">
                    <span class="detail-data-stats__item">
                      <span class="detail-data-stats__label">品名</span>
                      <span class="detail-data-stats__val">{{ party.lines.length }}</span>
                    </span>
                    <span class="detail-data-stats__item">
                      <span class="detail-data-stats__label">件数</span>
                      <span class="detail-data-stats__val">{{ cargoPartySummary(party).pieces }}</span>
                    </span>
                    <span class="detail-data-stats__item">
                      <span class="detail-data-stats__label">毛重</span>
                      <span class="detail-data-stats__val">{{ cargoPartySummary(party).weight }}</span>
                      <span class="detail-data-stats__unit">KG</span>
                    </span>
                    <span class="detail-data-stats__item">
                      <span class="detail-data-stats__label">体积</span>
                      <span class="detail-data-stats__val">{{ cargoPartySummary(party).volume }}</span>
                      <span class="detail-data-stats__unit">CBM</span>
                    </span>
                  </div>
                  <div v-if="isEditing" class="detail-subitem__actions" @click.stop>
                    <a-popconfirm content="确认删除该发货人及其品名明细？" @ok="removeCargoParty(party.id)">
                      <a-tooltip content="删除发货人">
                        <a-button size="small" type="text" class="row-action-btn" status="danger">
                          <template #icon><icon-delete /></template>
                        </a-button>
                      </a-tooltip>
                    </a-popconfirm>
                  </div>
                </div>
                <div v-if="party.expanded" class="detail-cargo-block__body detail-cargo-block__body--compact">
                  <div class="detail-child-pane detail-child-pane--compact">
                    <div class="detail-child-pane__head">
                      <span class="detail-child-pane__title">收发货方</span>
                    </div>
                    <template v-if="!isEditing">
                      <div class="detail-form-grid detail-form-grid--2">
                        <div class="detail-field">
                          <div class="detail-field__label">发货人</div>
                          <div class="detail-field__val">{{ displayVal(party.shipperMain) }}<br>{{ displayVal(party.shipperSub) }}</div>
                        </div>
                        <div class="detail-field">
                          <div class="detail-field__label">收货人</div>
                          <div class="detail-field__val">{{ displayVal(party.consigneeMain) }}<br>{{ displayVal(party.consigneeSub) }}</div>
                        </div>
                        <div class="detail-field">
                          <div class="detail-field__label">通知人</div>
                          <div class="detail-field__val">{{ displayVal(party.notifyMain) }}</div>
                        </div>
                        <div class="detail-field">
                          <div class="detail-field__label">海外代理</div>
                          <div class="detail-field__val">{{ displayVal(party.agentMain) }}</div>
                        </div>
                      </div>
                    </template>
                    <a-form v-else class="detail-form" layout="vertical" size="small" :model="party">
                      <div class="detail-form-grid detail-form-grid--2">
                        <a-form-item label="发货人" required>
                          <div class="detail-combo">
                            <a-input v-model="party.shipperMain" size="small" allow-clear />
                            <a-input v-model="party.shipperSub" size="small" allow-clear />
                          </div>
                        </a-form-item>
                        <a-form-item label="收货人" required>
                          <div class="detail-combo">
                            <a-input v-model="party.consigneeMain" size="small" allow-clear />
                            <a-input v-model="party.consigneeSub" size="small" allow-clear />
                          </div>
                        </a-form-item>
                        <a-form-item label="通知人" required>
                          <div class="detail-combo">
                            <a-input v-model="party.notifyMain" size="small" allow-clear />
                            <a-input v-model="party.notifySub" size="small" allow-clear />
                          </div>
                        </a-form-item>
                        <a-form-item label="海外代理" required>
                          <div class="detail-combo">
                            <a-input v-model="party.agentMain" size="small" allow-clear placeholder="请选择海外代理" />
                            <a-input v-model="party.agentSub" size="small" allow-clear placeholder="请填写具体信息" />
                          </div>
                        </a-form-item>
                        <a-form-item label="VAT">
                          <a-input v-model="party.vat" size="small" allow-clear />
                        </a-form-item>
                        <a-form-item label="EORI">
                          <a-input v-model="party.eori" size="small" allow-clear />
                        </a-form-item>
                        <a-form-item label="备注" class="detail-form-grid__span2">
                          <a-textarea v-model="party.remark" size="small" :auto-size="{ minRows: 2, maxRows: 4 }" />
                        </a-form-item>
                      </div>
                    </a-form>
                  </div>
                  <div class="detail-child-pane detail-child-pane--compact detail-child-pane--lines">
                    <div class="detail-child-pane__head">
                      <span class="detail-child-pane__title">品名明细</span>
                      <div v-if="isEditing" class="detail-section__actions">
                        <a-button size="small" type="outline" @click="addCargoLine(party)">
                          <template #icon><icon-plus /></template>
                          添加品名
                        </a-button>
                      </div>
                    </div>
                    <div class="detail-child-pane__table detail-child-pane__table--fit">
                      <vxe-table
                        v-if="isEditing"
                        class="detail-mini-vxe detail-mini-vxe--editable"
                        border="none"
                        size="small"
                        height="auto"
                        :data="party.lines"
                        :row-config="{ height: 38, isHover: true, keyField: 'id' }"
                      >
                        <vxe-column field="nameCn" title="中文品名" min-width="100">
                          <template #default="{ row }">
                            <a-input v-model="row.nameCn" size="small" />
                          </template>
                        </vxe-column>
                        <vxe-column field="nameEn" title="英文品名" min-width="120">
                          <template #default="{ row }">
                            <a-input v-model="row.nameEn" size="small" />
                          </template>
                        </vxe-column>
                        <vxe-column field="mark" title="唛头" min-width="120">
                          <template #default="{ row }">
                            <a-input v-model="row.mark" size="small" />
                          </template>
                        </vxe-column>
                        <vxe-column field="hsCode" title="HS CODE" min-width="100">
                          <template #default="{ row }">
                            <a-input v-model="row.hsCode" size="small" />
                          </template>
                        </vxe-column>
                        <vxe-column field="pieces" title="件数" min-width="80">
                          <template #default="{ row }">
                            <a-input-number v-model="row.pieces" size="small" :min="0" hide-button />
                          </template>
                        </vxe-column>
                        <vxe-column field="unit" title="包装单位" min-width="90">
                          <template #default="{ row }">
                            <a-select v-model="row.unit" size="small">
                              <a-option value="CTNS">CTNS</a-option>
                              <a-option value="PLTS">PLTS</a-option>
                            </a-select>
                          </template>
                        </vxe-column>
                        <vxe-column field="weight" title="毛重 KG" min-width="90">
                          <template #default="{ row }">
                            <a-input-number v-model="row.weight" size="small" :min="0" hide-button />
                          </template>
                        </vxe-column>
                        <vxe-column field="volume" title="体积 CBM" min-width="90">
                          <template #default="{ row }">
                            <a-input-number v-model="row.volume" size="small" :min="0" hide-button />
                          </template>
                        </vxe-column>
                        <vxe-column title="操作" width="60" fixed="right" align="center">
                          <template #default="{ row }">
                            <div class="row-actions">
                              <a-popconfirm content="确认删除该品名？" @ok="removeCargoLine(party, row.id)">
                                <a-tooltip content="删除">
                                  <a-button type="text" class="row-action-btn" status="danger">
                                    <icon-delete />
                                  </a-button>
                                </a-tooltip>
                              </a-popconfirm>
                            </div>
                          </template>
                        </vxe-column>
                      </vxe-table>
                      <vxe-table
                        v-else
                        class="detail-mini-vxe detail-mini-vxe--readonly detail-mini-vxe--fit"
                        border="none"
                        size="small"
                        height="auto"
                        :data="party.lines"
                        :row-config="{ height: 34, isHover: true, keyField: 'id' }"
                      >
                        <vxe-column field="nameCn" title="中文品名" min-width="100" />
                        <vxe-column field="nameEn" title="英文品名" min-width="120" />
                        <vxe-column field="mark" title="唛头" min-width="120" />
                        <vxe-column field="hsCode" title="HS CODE" min-width="100" />
                        <vxe-column field="pieces" title="件数" min-width="80" />
                        <vxe-column field="unit" title="包装单位" min-width="90" />
                        <vxe-column field="weight" title="毛重 KG" min-width="90" />
                        <vxe-column field="volume" title="体积 CBM" min-width="90" />
                        <template #empty>
                          <div class="state-center state-center--in-table">暂无品名明细</div>
                        </template>
                      </vxe-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 报关清单 -->
        <div id="sec-customs" class="detail-section">
          <div class="detail-section__head">
            <div class="detail-section__title">报关清单</div>
            <div v-if="isEditing" class="detail-section__actions">
              <a-button size="small" type="outline" @click="addCustomsRow">
                <template #icon><icon-plus /></template>
                添加
              </a-button>
            </div>
          </div>
          <div class="detail-section__body detail-section__body--table">
            <vxe-table
              v-if="isEditing"
              class="detail-mini-vxe detail-mini-vxe--editable"
              border="none"
              size="small"
              height="auto"
              :data="customsRows"
              :row-config="{ height: 38, isHover: true, keyField: 'id' }"
            >
              <vxe-column type="seq" title="序号" width="52" align="center" />
              <vxe-column field="declarant" title="报关人" min-width="180">
                <template #default="{ row }">
                  <a-select
                    v-model="row.declarant"
                    size="small"
                    allow-clear
                    allow-search
                    placeholder="请选择报关人"
                  />
                </template>
              </vxe-column>
              <vxe-column field="method" title="报关方式" min-width="140">
                <template #default="{ row }">
                  <a-select v-model="row.method" size="small" allow-clear>
                    <a-option value="正式退税报关">正式退税报关</a-option>
                    <a-option value="买单报关">买单报关</a-option>
                  </a-select>
                </template>
              </vxe-column>
              <vxe-column field="uploadTime" title="上传时间" min-width="120">
                <template #default="{ row }">{{ displayVal(row.uploadTime) }}</template>
              </vxe-column>
              <vxe-column field="submitStatus" title="提交时间" min-width="120">
                <template #default="{ row }">
                  <button
                    type="button"
                    class="s-pill"
                    data-s="wait"
                    @click="handleCustomsUpload(row)"
                  >待上传</button>
                </template>
              </vxe-column>
              <vxe-column title="操作" width="60" fixed="right" align="center">
                <template #default="{ row }">
                  <div class="row-actions">
                    <a-popconfirm content="确认删除该报关记录？" @ok="removeCustomsRow(row.id)">
                      <a-tooltip content="删除">
                        <a-button type="text" class="row-action-btn" status="danger">
                          <icon-delete />
                        </a-button>
                      </a-tooltip>
                    </a-popconfirm>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
            <vxe-table
              v-else
              class="detail-mini-vxe detail-mini-vxe--readonly"
              border="none"
              size="small"
              height="auto"
              :data="customsRows"
              :row-config="{ height: 34, isHover: true, keyField: 'id' }"
            >
              <vxe-column type="seq" title="序号" width="52" align="center" />
              <vxe-column field="declarant" title="报关人" min-width="180">
                <template #default="{ row }">{{ row.declarant || '—' }}</template>
              </vxe-column>
              <vxe-column field="method" title="报关方式" min-width="140" />
              <vxe-column field="uploadTime" title="上传时间" min-width="120">
                <template #default="{ row }">{{ displayVal(row.uploadTime) }}</template>
              </vxe-column>
              <vxe-column field="submitStatus" title="提交时间" min-width="120">
                <template #default="{ row }">
                  <span v-if="row.submitStatus === 'uploaded'" class="s-pill" data-s="acc">已上传</span>
                  <span v-else class="s-pill" data-s="wait">待上传</span>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>

        <!-- 提单明细：默认只读，行内编辑 -->
        <div id="sec-bl" class="detail-section">
          <div class="detail-section__head">
            <div class="detail-section__title-group">
              <div class="detail-section__title">提单明细</div>
              <div class="detail-data-stats">
                <span class="detail-data-stats__item">
                  <span class="detail-data-stats__label">件数</span>
                  <span class="detail-data-stats__val">{{ blSummary.pieces }}</span>
                </span>
                <span class="detail-data-stats__item">
                  <span class="detail-data-stats__label">包装</span>
                  <span class="detail-data-stats__val">{{ blSummary.packs }}</span>
                </span>
                <span class="detail-data-stats__item">
                  <span class="detail-data-stats__label">毛重</span>
                  <span class="detail-data-stats__val">{{ blSummary.weight.toFixed(2) }}</span>
                  <span class="detail-data-stats__unit">KG</span>
                </span>
                <span class="detail-data-stats__item">
                  <span class="detail-data-stats__label">体积</span>
                  <span class="detail-data-stats__val">{{ blSummary.volume.toFixed(2) }}</span>
                  <span class="detail-data-stats__unit">CBM</span>
                </span>
              </div>
            </div>
            <div v-if="isEditing" class="detail-section__actions">
              <a-button size="small" type="outline" @click="addBlRow">
                <template #icon><icon-plus /></template>
                添加
              </a-button>
            </div>
          </div>
          <div class="detail-section__body detail-section__body--table">
              <vxe-table
                v-if="isEditing"
                class="detail-mini-vxe detail-mini-vxe--editable"
                border="none"
                size="small"
                height="auto"
                :data="blRows"
                :row-config="{ height: 38, isHover: true, keyField: 'id' }"
              >
                <vxe-column field="hblNo" title="HBL No." min-width="110">
                  <template #default="{ row }">
                    <a-input v-if="isBlRowEditing(row.id)" v-model="row.hblNo" size="small" allow-clear />
                    <span v-else>{{ displayVal(row.hblNo) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="containerSeal" title="柜号/封号" min-width="120">
                  <template #default="{ row }">
                    <a-input v-if="isBlRowEditing(row.id)" v-model="row.containerSeal" size="small" allow-clear />
                    <span v-else>{{ displayVal(row.containerSeal) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="vehicleSpec" title="车牌/柜型" min-width="110">
                  <template #default="{ row }">
                    <a-select v-if="isBlRowEditing(row.id)" v-model="row.vehicleSpec" size="small" allow-clear placeholder="请选择" />
                    <span v-else>{{ displayVal(row.vehicleSpec) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="packingMethod" title="装箱方式" min-width="100">
                  <template #default="{ row }">
                    <a-select v-if="isBlRowEditing(row.id)" v-model="row.packingMethod" size="small" allow-clear placeholder="请选择" />
                    <span v-else>{{ displayVal(row.packingMethod) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="pickupOrder" title="提货指令" min-width="100">
                  <template #default="{ row }">
                    <a-input v-if="isBlRowEditing(row.id)" v-model="row.pickupOrder" size="small" allow-clear />
                    <span v-else>{{ displayVal(row.pickupOrder) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="courierNo" title="快递单号" min-width="110">
                  <template #default="{ row }">
                    <a-input v-if="isBlRowEditing(row.id)" v-model="row.courierNo" size="small" allow-clear />
                    <span v-else>{{ displayVal(row.courierNo) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="mblNo" title="船东提单号" min-width="120">
                  <template #default="{ row }">
                    <a-input v-if="isBlRowEditing(row.id)" v-model="row.mblNo" size="small" allow-clear />
                    <span v-else>{{ displayVal(row.mblNo) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="pieces" title="件数" min-width="80">
                  <template #default="{ row }">
                    <a-input-number v-if="isBlRowEditing(row.id)" v-model="row.pieces" size="small" :min="0" hide-button />
                    <span v-else>{{ displayVal(row.pieces) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="unit" title="包装单位" min-width="90">
                  <template #default="{ row }">
                    <a-select v-if="isBlRowEditing(row.id)" v-model="row.unit" size="small">
                      <a-option value="CTNS">CTNS</a-option>
                    </a-select>
                    <span v-else>{{ row.unit }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="quantity" title="数量" min-width="80">
                  <template #default="{ row }">
                    <a-input-number v-if="isBlRowEditing(row.id)" v-model="row.quantity" size="small" :min="0" hide-button />
                    <span v-else>{{ displayVal(row.quantity) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="weight" title="毛重 KG" min-width="90">
                  <template #default="{ row }">
                    <a-input-number v-if="isBlRowEditing(row.id)" v-model="row.weight" size="small" :min="0" hide-button />
                    <span v-else>{{ displayVal(row.weight) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="volume" title="体积 CBM" min-width="90">
                  <template #default="{ row }">
                    <a-input-number v-if="isBlRowEditing(row.id)" v-model="row.volume" size="small" :min="0" hide-button />
                    <span v-else>{{ displayVal(row.volume) }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="dimensions" title="尺寸 CM" min-width="100">
                  <template #default="{ row }">
                    <a-input v-if="isBlRowEditing(row.id)" v-model="row.dimensions" size="small" allow-clear />
                    <span v-else>{{ displayVal(row.dimensions) }}</span>
                  </template>
                </vxe-column>
                <vxe-column title="操作" width="88" fixed="right" align="center">
                  <template #default="{ row }">
                    <div class="row-actions">
                      <a-tooltip v-if="!isBlRowEditing(row.id)" content="编辑">
                        <a-button type="text" class="row-action-btn" @click="startEditBlRow(row.id)">
                          <icon-edit />
                        </a-button>
                      </a-tooltip>
                      <a-tooltip v-else content="完成">
                        <a-button type="text" class="row-action-btn" @click="finishEditBlRow">完成</a-button>
                      </a-tooltip>
                      <a-popconfirm content="确认删除该提单记录？" @ok="removeBlRow(row.id)">
                        <a-tooltip content="删除">
                          <a-button type="text" class="row-action-btn" status="danger">
                            <icon-delete />
                          </a-button>
                        </a-tooltip>
                      </a-popconfirm>
                    </div>
                  </template>
                </vxe-column>
              </vxe-table>
              <vxe-table
                v-else
                class="detail-mini-vxe detail-mini-vxe--readonly"
                border="none"
                size="small"
                height="auto"
                :data="blRows"
                :row-config="{ height: 34, isHover: true, keyField: 'id' }"
              >
                <vxe-column field="hblNo" title="HBL No." min-width="110">
                  <template #default="{ row }">{{ displayVal(row.hblNo) }}</template>
                </vxe-column>
                <vxe-column field="containerSeal" title="柜号/封号" min-width="120">
                  <template #default="{ row }">{{ displayVal(row.containerSeal) }}</template>
                </vxe-column>
                <vxe-column field="vehicleSpec" title="车牌/柜型" min-width="110">
                  <template #default="{ row }">{{ displayVal(row.vehicleSpec) }}</template>
                </vxe-column>
                <vxe-column field="packingMethod" title="装箱方式" min-width="100">
                  <template #default="{ row }">{{ displayVal(row.packingMethod) }}</template>
                </vxe-column>
                <vxe-column field="pickupOrder" title="提货指令" min-width="100">
                  <template #default="{ row }">{{ displayVal(row.pickupOrder) }}</template>
                </vxe-column>
                <vxe-column field="courierNo" title="快递单号" min-width="110">
                  <template #default="{ row }">{{ displayVal(row.courierNo) }}</template>
                </vxe-column>
                <vxe-column field="mblNo" title="船东提单号" min-width="120">
                  <template #default="{ row }">{{ displayVal(row.mblNo) }}</template>
                </vxe-column>
                <vxe-column field="pieces" title="件数" min-width="80">
                  <template #default="{ row }">{{ displayVal(row.pieces) }}</template>
                </vxe-column>
                <vxe-column field="unit" title="包装单位" min-width="90" />
                <vxe-column field="quantity" title="数量" min-width="80">
                  <template #default="{ row }">{{ displayVal(row.quantity) }}</template>
                </vxe-column>
                <vxe-column field="weight" title="毛重 KG" min-width="90">
                  <template #default="{ row }">{{ displayVal(row.weight) }}</template>
                </vxe-column>
                <vxe-column field="volume" title="体积 CBM" min-width="90">
                  <template #default="{ row }">{{ displayVal(row.volume) }}</template>
                </vxe-column>
                <vxe-column field="dimensions" title="尺寸 CM" min-width="100">
                  <template #default="{ row }">{{ displayVal(row.dimensions) }}</template>
                </vxe-column>
              </vxe-table>
            </div>
          </div>
        </div>

        <!-- 清关信息 -->
        <div id="sec-clearance" class="detail-section">
          <div class="detail-section__head">
            <div class="detail-section__title">清关信息</div>
            <div v-if="isEditing" class="detail-section__actions">
              <a-button size="small" type="outline" @click="addClearanceRow">
                <template #icon><icon-plus /></template>
                添加
              </a-button>
            </div>
          </div>
          <div class="detail-section__body">
            <template v-if="!isEditing">
              <div class="detail-form-grid detail-form-grid--4">
                <div class="detail-field">
                  <div class="detail-field__label">清关条款</div>
                  <div class="detail-field__val">{{ displayVal(form.clearanceTerms) }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">是否预付税金</div>
                  <div class="detail-field__val">{{ form.prepaidTax }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">是否 PVA 递延</div>
                  <div class="detail-field__val">{{ form.pvaDeferral }}</div>
                </div>
                <div class="detail-field">
                  <div class="detail-field__label">是否委托代办备案</div>
                  <div class="detail-field__val">{{ form.entrustFiling }}</div>
                </div>
              </div>
            </template>
            <a-form v-else class="detail-form" layout="vertical" size="small" :model="form">
              <div class="detail-form-grid detail-form-grid--4">
                <a-form-item label="清关条款">
                  <a-select v-model="form.clearanceTerms" size="small" allow-clear placeholder="请选择清关条款" />
                </a-form-item>
                <a-form-item label="是否预付税金">
                  <a-select v-model="form.prepaidTax" size="small" allow-clear>
                    <a-option value="是">是</a-option>
                    <a-option value="否">否</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="是否 PVA 递延">
                  <a-select v-model="form.pvaDeferral" size="small" allow-clear>
                    <a-option value="是">是</a-option>
                    <a-option value="否">否</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="是否委托代办备案">
                  <a-select v-model="form.entrustFiling" size="small" allow-clear>
                    <a-option value="是">是</a-option>
                    <a-option value="否">否</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="是否客户自用单">
                  <a-select v-model="form.customerSelfUse" size="small" allow-clear placeholder="请选择" />
                </a-form-item>
              </div>
            </a-form>
            <div class="detail-section__body--table">
              <vxe-table
                v-if="isEditing"
                class="detail-mini-vxe detail-mini-vxe--editable"
                border="none"
                size="small"
                height="auto"
                :data="clearanceRows"
                :row-config="{ height: 38, isHover: true, keyField: 'id' }"
              >
                <vxe-column field="importer" title="进口商" min-width="120">
                  <template #default="{ row }">
                    <a-input v-model="row.importer" size="small" allow-clear />
                  </template>
                </vxe-column>
                <vxe-column field="eoriCode" title="EORI 编码" min-width="120">
                  <template #default="{ row }">
                    <a-input v-model="row.eoriCode" size="small" allow-clear />
                  </template>
                </vxe-column>
                <vxe-column field="vatNo" title="VAT No." min-width="100">
                  <template #default="{ row }">
                    <a-input v-model="row.vatNo" size="small" allow-clear />
                  </template>
                </vxe-column>
                <vxe-column field="invoiceNo" title="Invoice No." min-width="110">
                  <template #default="{ row }">
                    <a-input v-model="row.invoiceNo" size="small" allow-clear />
                  </template>
                </vxe-column>
                <vxe-column field="address" title="注册地址" min-width="140">
                  <template #default="{ row }">
                    <a-input v-model="row.address" size="small" allow-clear />
                  </template>
                </vxe-column>
                <vxe-column field="fasCustoms" title="FAS 海关" min-width="100">
                  <template #default="{ row }">
                    <a-input v-model="row.fasCustoms" size="small" allow-clear />
                  </template>
                </vxe-column>
                <vxe-column title="POA 授权书" min-width="100">
                  <template #default>
                    <a-button
                      size="small"
                      type="text"
                      class="link-text"
                      @click="handleUploadPlaceholder('POA 授权书')"
                    >点击上传</a-button>
                  </template>
                </vxe-column>
                <vxe-column title="海关联络书" min-width="100">
                  <template #default>
                    <a-button
                      size="small"
                      type="text"
                      class="link-text"
                      @click="handleUploadPlaceholder('海关联络书')"
                    >点击上传</a-button>
                  </template>
                </vxe-column>
                <vxe-column title="提单副本" min-width="100">
                  <template #default>
                    <a-button
                      size="small"
                      type="text"
                      class="link-text"
                      @click="handleUploadPlaceholder('提单副本')"
                    >点击上传</a-button>
                  </template>
                </vxe-column>
                <vxe-column title="操作" width="60" fixed="right" align="center">
                  <template #default="{ row }">
                    <div class="row-actions">
                      <a-popconfirm content="确认删除该清关记录？" @ok="removeClearanceRow(row.id)">
                        <a-tooltip content="删除">
                          <a-button type="text" class="row-action-btn" status="danger">
                            <icon-delete />
                          </a-button>
                        </a-tooltip>
                      </a-popconfirm>
                    </div>
                  </template>
                </vxe-column>
              </vxe-table>
              <vxe-table
                v-else
                class="detail-mini-vxe detail-mini-vxe--readonly"
                border="none"
                size="small"
                height="auto"
                :data="clearanceRows"
                :row-config="{ height: 34, isHover: true, keyField: 'id' }"
              >
                <vxe-column field="importer" title="进口商" min-width="120">
                  <template #default="{ row }">{{ displayVal(row.importer) }}</template>
                </vxe-column>
                <vxe-column field="eoriCode" title="EORI 编码" min-width="120">
                  <template #default="{ row }">{{ displayVal(row.eoriCode) }}</template>
                </vxe-column>
                <vxe-column field="vatNo" title="VAT No." min-width="100">
                  <template #default="{ row }">{{ displayVal(row.vatNo) }}</template>
                </vxe-column>
                <vxe-column field="invoiceNo" title="Invoice No." min-width="110">
                  <template #default="{ row }">{{ displayVal(row.invoiceNo) }}</template>
                </vxe-column>
                <vxe-column field="address" title="注册地址" min-width="140">
                  <template #default="{ row }">{{ displayVal(row.address) }}</template>
                </vxe-column>
                <vxe-column field="fasCustoms" title="FAS 海关" min-width="100">
                  <template #default="{ row }">{{ displayVal(row.fasCustoms) }}</template>
                </vxe-column>
                <vxe-column title="POA 授权书" min-width="100">
                  <template #default>
                    <span class="s-pill" data-s="wait">待上传</span>
                  </template>
                </vxe-column>
                <vxe-column title="海关联络书" min-width="100">
                  <template #default>
                    <span class="s-pill" data-s="wait">待上传</span>
                  </template>
                </vxe-column>
                <vxe-column title="提单副本" min-width="100">
                  <template #default>
                    <span class="s-pill" data-s="wait">待上传</span>
                  </template>
                </vxe-column>
                <template #empty>
                  <div class="state-center state-center--in-table">暂无数据</div>
                </template>
              </vxe-table>
          </div>
        </div>
      </div>

      <div class="detail-drawer-footer">
        <div class="detail-drawer-footer__start">
          <a-button size="small" type="text" status="danger" @click="handleDiscard">废弃</a-button>
        </div>
        <div class="detail-drawer-footer__end">
          <a-button size="small" type="outline">批量下单</a-button>
          <a-button size="small" :loading="submitting" @click="handleSave">保存</a-button>
          <a-button size="small" type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
.bo-drawer-nav {
  flex-shrink: 0;
  padding: 3px 12px;
  border-bottom: 1px solid var(--dense-border-subtle);
  background: var(--color-bg-card);
}

.bo-drawer-nav--compact {
  padding: 2px 12px;
}

.bo-drawer-nav .stat-tab-group {
  gap: 2px;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.bo-drawer-nav--compact .stat-tab {
  height: 22px;
  min-height: 22px;
  padding: 0 9px;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  line-height: 22px;
}

.bo-drawer-nav--compact .stat-tab--active {
  border-color: var(--dense-primary-3);
  background: var(--dense-primary-1);
  box-shadow: inset 0 0 0 1px var(--dense-primary-2);
}
</style>
