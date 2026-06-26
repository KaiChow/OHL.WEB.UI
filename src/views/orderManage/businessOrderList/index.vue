<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import type { VxeTableInstance } from 'vxe-table';
import {
  IconCopy,
  IconDown,
  IconDownload,
  IconFilter,
  IconMore,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
} from '@arco-design/web-vue/es/icon';

type TransportMode = 'sea' | 'air' | 'rail';
type FieldType = 'input' | 'select' | 'range' | 'checkbox' | 'textarea';

interface AdvancedField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  wide?: boolean;
}

interface AdvancedGroup {
  key: string;
  title: string;
  fields: AdvancedField[];
}

interface BusinessOrderRow {
  id: number;
  orderNo: string;
  submitTime: string;
  orderStatus: string;
  cabinetType: string;
  businessType: string;
  businessNo: string;
  warehouseNo: string;
  entryNo: string;
  salesman: string;
  sender: string;
  receiver: string;
  containerVolume: string;
  cabinetNo: string;
  pol: string;
  hblNo: string;
  mblNo: string;
  destinationPort: string;
  etd: string;
  fileReady: boolean;
  priority: 'normal' | 'warn' | 'risk';
}

const xTable = ref<VxeTableInstance>();
const queryEditorRef = ref<HTMLElement>();
const advancedVisible = ref(false);
const activeGroupKey = ref('identifiers');
const selectedRows = ref<BusinessOrderRow[]>([]);
const activeStatus = ref('all');
const page = ref(1);
const pageSize = ref(100);
const total = ref(9262);

const createQuery = () => ({
  transportMode: 'sea' as TransportMode,
  businessType: '',
  noType: 'businessNo',
  keyword: '',
  importExportType: '',
  salesman: '',
  operator: '',
  customerService: '',
  certNo: '',
  packingType: '',
  sender: '',
  receiver: '',
  quickTag: '',
  orderNo: '',
  businessNo: '',
  hblNo: '',
  mblNo: '',
  soNo: '',
  fbaNo: '',
  poNo: '',
  entryNo: '',
  warehouseNo: '',
  containerNo: '',
  cabinetNo: '',
  overseasNo: '',
  externalNo: '',
  documentNo: '',
  orderTimeRange: [] as string[],
  entryTimeRange: [] as string[],
  etdRange: [] as string[],
  sailingTimeRange: [] as string[],
  deliveryTimeRange: [] as string[],
  financePodRange: [] as string[],
  customer: '',
  bookingSender: '',
  cargoOwner: '',
  overseasAgent: '',
  collectionPlace: '',
  pol: '',
  pod: '',
  destinationPort: '',
  polCountry: '',
  podCountry: '',
  carrier: '',
  vessel: '',
  voyage: '',
  routeName: '',
  contractNo: '',
  market: '',
  serviceScope: '',
  customerType: '',
  tradeTerms: '',
  ownerCompany: '',
  orderStatus: '',
  customsMethod: '',
  feeRecorded: '',
  accountDept: '',
  cargoName: '',
  cargoType: '',
  containerType: '',
  sensitiveCargo: false,
  fullContainer: false,
  noCustomerServiceOrder: false,
  noContinueOrder: false,
  inboundUnsubmitted: false,
  lastShipmentNoReceipt: false,
  flashBox: false,
  sameCarrier: false,
  noBookingOrder: false,
  operationRemark: '',
  bookingContent: '',
});

const q = reactive<Record<string, any>>(createQuery());

const advancedGroups: AdvancedGroup[] = [
  {
    key: 'identifiers',
    title: '单号信息',
    fields: [
      { key: 'orderNo', label: '订单编号', type: 'input', placeholder: '请输入订单编号' },
      { key: 'businessNo', label: '业务单号', type: 'input', placeholder: '请输入业务单号' },
      { key: 'hblNo', label: 'HBL NO', type: 'input', placeholder: '请输入 HBL 单号' },
      { key: 'mblNo', label: 'MBL NO', type: 'input', placeholder: '请输入 MBL 单号' },
      { key: 'soNo', label: 'SO NO', type: 'input', placeholder: '请输入 SO 号' },
      { key: 'fbaNo', label: 'FBA NO', type: 'input', placeholder: '请输入 FBA 号' },
      { key: 'poNo', label: 'PO', type: 'input', placeholder: '请输入 PO' },
      { key: 'entryNo', label: '入仓单号', type: 'input', placeholder: '请输入入仓单号' },
      { key: 'warehouseNo', label: '入仓编号', type: 'input', placeholder: '请输入入仓编号' },
      { key: 'containerNo', label: '柜号', type: 'input', placeholder: '请输入柜号' },
      { key: 'overseasNo', label: '境外单号', type: 'input', placeholder: '请输入境外单号' },
      { key: 'documentNo', label: '文件', type: 'input', placeholder: '请输入文件关键字' },
    ],
  },
  {
    key: 'schedule',
    title: '时间节点',
    fields: [
      { key: 'entryTimeRange', label: '进仓时间', type: 'range' },
      { key: 'orderTimeRange', label: '下单时间', type: 'range' },
      { key: 'etdRange', label: 'ETD', type: 'range' },
      { key: 'sailingTimeRange', label: '船前时间', type: 'range' },
      { key: 'deliveryTimeRange', label: '提单时间', type: 'range' },
      { key: 'financePodRange', label: '财务 POD', type: 'range' },
    ],
  },
  {
    key: 'parties',
    title: '客户往来',
    fields: [
      { key: 'sender', label: '发货人', type: 'input', placeholder: '请选择发货人' },
      { key: 'receiver', label: '收货人', type: 'input', placeholder: '请选择收货人' },
      { key: 'bookingSender', label: '提单发货人', type: 'input', placeholder: '请选择提单发货人' },
      { key: 'customer', label: '客户', type: 'input', placeholder: '请选择客户' },
      { key: 'cargoOwner', label: '货主', type: 'input', placeholder: '请输入货主' },
      { key: 'overseasAgent', label: '境外代理', type: 'input', placeholder: '请选择境外代理' },
    ],
  },
  {
    key: 'route',
    title: '港口航线',
    fields: [
      { key: 'collectionPlace', label: '收货地', type: 'input', placeholder: '请选择' },
      { key: 'pol', label: '起运港', type: 'input', placeholder: '请选择' },
      { key: 'pod', label: '目的港', type: 'input', placeholder: '请选择' },
      { key: 'destinationPort', label: '目的地', type: 'input', placeholder: '请选择' },
      { key: 'polCountry', label: '起运港国家', type: 'input', placeholder: '请选择' },
      { key: 'podCountry', label: '目的港国家', type: 'input', placeholder: '请选择' },
      { key: 'carrier', label: '船公司', type: 'input', placeholder: '请选择船司' },
      { key: 'vessel', label: '船名', type: 'input', placeholder: '请输入船名' },
      { key: 'voyage', label: '航次', type: 'input', placeholder: '请输入航次' },
      { key: 'routeName', label: '航线', type: 'input', placeholder: '请输入航线' },
      { key: 'contractNo', label: '合约号', type: 'input', placeholder: '请选择合约号' },
    ],
  },
  {
    key: 'people',
    title: '人员归属',
    fields: [
      { key: 'salesman', label: '业务员', type: 'input', placeholder: '请输入业务员' },
      { key: 'customerService', label: '客服', type: 'input', placeholder: '请输入客服' },
      { key: 'operator', label: '操作员', type: 'input', placeholder: '请输入操作员' },
      { key: 'ownerCompany', label: '归属公司', type: 'select', placeholder: '请选择归属公司', options: ['PTP supply chain', 'GLS DE', 'ALIK'] },
      { key: 'market', label: '市场', type: 'select', placeholder: '请选择市场', options: ['华南', '华东', '欧洲线'] },
    ],
  },
  {
    key: 'business',
    title: '业务属性',
    fields: [
      { key: 'businessType', label: '业务类型', type: 'select', placeholder: '请选择业务类型', options: ['FBA', 'FOB', 'DDP'] },
      { key: 'importExportType', label: '进/出口单', type: 'select', placeholder: '请选择进/出口单类型', options: ['进口', '出口'] },
      { key: 'packingType', label: '装箱方式', type: 'select', placeholder: '请选择装箱方式', options: ['LCL', 'FCL', '空运'] },
      { key: 'serviceScope', label: '服务范围', type: 'select', placeholder: '请选择服务范围', options: ['门到门', '港到港', '仓到门'] },
      { key: 'customerType', label: '客户类型', type: 'select', placeholder: '请选择客户类型', options: ['直客', '同行', '代理'] },
      { key: 'tradeTerms', label: '贸易条款', type: 'select', placeholder: '请选择条款', options: ['FOB', 'CIF', 'EXW', 'DDP'] },
      { key: 'orderStatus', label: '订单状态', type: 'select', placeholder: '请选择订单状态', options: ['操作待接单', '已接单', '放舱', '草稿'] },
      { key: 'customsMethod', label: '报关方式', type: 'select', placeholder: '请选择报关方式', options: ['买单报关', '单证报关', '无需报关'] },
      { key: 'feeRecorded', label: '海运费是否已录入', type: 'select', placeholder: '请选择', options: ['已录入', '未录入'] },
      { key: 'accountDept', label: '账号归属部门', type: 'select', placeholder: '请选择部门', options: ['销售一部', '销售二部', '操作部'] },
    ],
  },
  {
    key: 'cargo',
    title: '货物柜量',
    fields: [
      { key: 'cargoName', label: '品名', type: 'input', placeholder: '请输入品名' },
      { key: 'cargoType', label: '货物类型', type: 'select', placeholder: '请选择货物类型', options: ['普货', '化工品', '带电'] },
      { key: 'containerType', label: '框型柜量', type: 'select', placeholder: '请选择', options: ['LCL', '1X20GP', '1X40HQ', '1X20RF'] },
    ],
  },
  {
    key: 'flags',
    title: '业务标记',
    fields: [
      { key: 'noCustomerServiceOrder', label: '无客服订单', type: 'checkbox' },
      { key: 'noContinueOrder', label: '不含继承单', type: 'checkbox' },
      { key: 'inboundUnsubmitted', label: '入仓未核实', type: 'checkbox' },
      { key: 'lastShipmentNoReceipt', label: '最后一单(未回款)', type: 'checkbox' },
      { key: 'sensitiveCargo', label: '是否敏感货物', type: 'checkbox' },
      { key: 'fullContainer', label: '是否用柜', type: 'checkbox' },
      { key: 'flashBox', label: '是否闪送柜', type: 'checkbox' },
      { key: 'sameCarrier', label: '是否同行', type: 'checkbox' },
      { key: 'noBookingOrder', label: '无订舱单', type: 'checkbox' },
    ],
  },
  {
    key: 'remarks',
    title: '备注内容',
    fields: [
      { key: 'operationRemark', label: '操作备注', type: 'textarea', placeholder: '请输入操作备注', wide: true },
      { key: 'bookingContent', label: '提单内容', type: 'textarea', placeholder: '请输入提单内容', wide: true },
    ],
  },
];

const savedQueries = [
  { name: '默认列表', meta: '业务单号 + 状态 + ETD' },
  { name: '今日待接单', meta: '操作待接单 / 今日' },
  { name: '欧洲线未放舱', meta: 'FELIXSTOWE / 未放舱' },
];

const totalAdvancedFields = computed(() => advancedGroups.reduce((sum, group) => sum + group.fields.length, 0));

const allRows = computed<BusinessOrderRow[]>(() => Array.from({ length: 26 }, (_, index) => {
  const no = 26050017 - index;
  const statusList = ['操作待接单', '已接单', '放舱', '草稿'];
  const ports = ['YANTIAN', 'NINGBO', '港口英文名'];
  const destinations = ['FELIXSTOWE', 'ROTTERDAM', 'TILBURY', 'RAUMA'];
  const sender = index % 5 === 0 ? 'PTP supply chain' : index % 3 === 0 ? 'GLS DE' : 'ALIK';
  return {
    id: index + 1,
    orderNo: index % 4 === 0 ? `PTPPTP${no}` : index % 7 === 0 ? `DCG${no}` : `PTP${no}`,
    submitTime: index < 7 ? `2026-0${(index % 5) + 2}-${String(17 + index).padStart(2, '0')} ${index % 2 ? '16:06:36' : '17:24:26'}` : `2026-06-${String(26 - (index % 12)).padStart(2, '0')} 09:${String(30 + index).padStart(2, '0')}:22`,
    orderStatus: statusList[index % statusList.length],
    cabinetType: index % 6 === 0 ? '化工品' : '普货',
    businessType: index % 4 === 0 ? 'FOB' : 'FBA',
    businessNo: index % 5 === 0 ? '' : `LCL260${String(30068 - index).padStart(5, '0')}`,
    warehouseNo: index % 4 === 0 ? '' : `UKSZ260${String(50017 - index).padStart(5, '0')}`,
    entryNo: index % 6 === 0 ? `FCL260${String(60099 - index).padStart(5, '0')}` : `UKSZ260${String(50017 - index).padStart(5, '0')}`,
    salesman: index % 3 === 0 ? 'admin' : index % 4 === 0 ? 'BellaZhou' : '15207451196',
    sender,
    receiver: index % 3 === 0 ? 'PTP supply chain' : index % 2 === 0 ? 'qian 测试公司 PP...' : 'ALIK',
    containerVolume: index % 7 === 0 ? '1X20RF' : index % 5 === 0 ? '1X40HQ' : 'LCL',
    cabinetNo: index % 8 === 0 ? `GPTP${no}` : '',
    pol: ports[index % ports.length],
    hblNo: index % 3 === 0 ? `PTP${no}` : index % 5 === 0 ? `UPVN${no}` : '',
    mblNo: index % 4 === 0 ? `SPTP${no}` : '',
    destinationPort: destinations[index % destinations.length],
    etd: index % 4 === 0 ? '' : `2026-0${(index % 5) + 2}-${String(15 + index).padStart(2, '0')}`,
    fileReady: index % 2 === 0,
    priority: index < 7 ? 'risk' : index % 5 === 0 ? 'warn' : 'normal',
  };
}));

const statusTabs = computed(() => {
  const list = allRows.value;
  const count = (predicate: (row: BusinessOrderRow) => boolean) => list.filter(predicate).length;
  return [
    { key: 'all', label: '全部单', count: list.length },
    { key: 'pending', label: '操作待接单', count: count((row) => row.orderStatus === '操作待接单'), tone: 'danger' },
    { key: 'file', label: '待补文件', count: count((row) => !row.fileReady), tone: 'warn' },
    { key: 'accepted', label: '已接单', count: count((row) => row.orderStatus === '已接单'), tone: 'ok' },
    { key: 'released', label: '放舱', count: count((row) => row.orderStatus === '放舱'), tone: 'ok' },
    { key: 'draft', label: '草稿', count: count((row) => row.orderStatus === '草稿'), tone: 'warn' },
  ];
});

const rows = computed<BusinessOrderRow[]>(() => {
  const list = allRows.value;
  switch (activeStatus.value) {
    case 'pending':
      return list.filter((row) => row.orderStatus === '操作待接单');
    case 'file':
      return list.filter((row) => !row.fileReady);
    case 'accepted':
      return list.filter((row) => row.orderStatus === '已接单');
    case 'released':
      return list.filter((row) => row.orderStatus === '放舱');
    case 'draft':
      return list.filter((row) => row.orderStatus === '草稿');
    default:
      return list;
  }
});

const getStatusToken = (status: string) => {
  if (status === '已接单') return 'acc';
  if (status === '放舱') return 'rel';
  if (status === '草稿') return 'wait';
  return 'op';
};

const handleSearch = () => {
  Message.success('已按当前条件刷新业务单列表');
};

const handleReset = () => {
  Object.assign(q, createQuery());
};

const clearAdvanced = () => {
  const base = createQuery();
  for (const group of advancedGroups) {
    for (const field of group.fields) q[field.key] = base[field.key];
  }
};

const clearAdvancedGroup = (group: AdvancedGroup) => {
  const base = createQuery();
  for (const field of group.fields) q[field.key] = base[field.key];
};

const scrollToAdvancedGroup = (groupKey: string) => {
  activeGroupKey.value = groupKey;
  const groupEl = queryEditorRef.value?.querySelector<HTMLElement>(`[data-query-group="${groupKey}"]`);
  groupEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleDanger = (label: string) => {
  Modal.confirm({
    title: label,
    content: `确认对选中的 ${selectedRows.value.length} 条业务单执行「${label}」？`,
    onOk: () => Message.success('操作已提交'),
  });
};
</script>

<template>
  <div class="page-root page-root--dense">
    <div class="zone-l1-transport zone-card">
      <button class="seg-btn" :class="{ 'seg-btn--active': q.transportMode === 'sea' }" @click="q.transportMode = 'sea'">海运</button>
      <button class="seg-btn" :class="{ 'seg-btn--active': q.transportMode === 'air' }" @click="q.transportMode = 'air'">空运</button>
      <button class="seg-btn" :class="{ 'seg-btn--active': q.transportMode === 'rail' }" @click="q.transportMode = 'rail'">铁路</button>
    </div>

    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__slim-row">
        <div class="filter-field">
          <label class="filter-field__label">业务类型</label>
          <a-select v-model="q.businessType" size="small" allow-clear placeholder="请选择业务类型">
            <a-option value="FBA">FBA</a-option>
            <a-option value="FOB">FOB</a-option>
            <a-option value="DDP">DDP</a-option>
          </a-select>
        </div>
        <div class="filter-field filter-field--span2">
          <label class="filter-field__label">单号检索</label>
          <div class="filter-combo arco-input-group">
            <a-select v-model="q.noType" size="small" class="filter-combo__select filter-combo--keyword">
              <a-option value="businessNo">业务单号</a-option>
              <a-option value="orderNo">订单编号</a-option>
              <a-option value="hblNo">HBL NO</a-option>
              <a-option value="mblNo">MBL NO</a-option>
              <a-option value="soNo">SO NO</a-option>
            </a-select>
            <a-input v-model="q.keyword" size="small" allow-clear placeholder="请输入业务单号 / 订单号 / HBL / MBL" />
          </div>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">进/出口单</label>
          <a-select v-model="q.importExportType" size="small" allow-clear placeholder="请选择进/出口单类型">
            <a-option value="import">进口</a-option>
            <a-option value="export">出口</a-option>
          </a-select>
        </div>
        <div class="filter-field">
          <label class="filter-field__label">业务员</label>
          <a-input v-model="q.salesman" size="small" allow-clear placeholder="请输入业务员" />
        </div>
        <div class="filter-card__inline-actions">
          <a-button size="small" type="primary" class="filter-card__query-btn" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
          <a-button size="small" type="text" class="reset-btn" @click="advancedVisible = true">
            <template #icon><icon-filter /></template>
            高级
          </a-button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="merged-bar">
        <div class="toolbar-group">
          <a-button size="small" type="primary">
            <template #icon><icon-plus /></template>
            创建业务单
          </a-button>
          <a-button size="small" type="outline">特殊跟踪</a-button>
          <a-button size="small" type="text">
            <template #icon><icon-copy /></template>
            复制业务单
          </a-button>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">
              输出<icon-down />
            </a-button>
            <template #content>
              <a-doption>打印业务单</a-doption>
              <a-doption>导出 Excel</a-doption>
              <a-doption>导出文件清单</a-doption>
            </template>
          </a-dropdown>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-button size="small" type="outline">批量操作<icon-down /></a-button>
            <template #content>
              <a-doption>批量修改</a-doption>
              <a-doption>批量废弃</a-doption>
              <a-doption>批量推送邮件</a-doption>
            </template>
          </a-dropdown>
        </div>
        <span class="bar-sep" aria-hidden="true" />
        <div class="stat-tab-group">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            type="button"
            class="stat-tab"
            :class="{ 'stat-tab--active': activeStatus === tab.key }"
            @click="activeStatus = tab.key"
          >
            <span class="stat-tab__name">{{ tab.label }}</span>
            <span
              class="stat-tab__count"
              :class="{
                'stat-tab__count--danger': tab.tone === 'danger',
                'stat-tab__count--warn': tab.tone === 'warn',
                'stat-tab__count--ok': tab.tone === 'ok',
              }"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
        <div class="toolbar-aside">
          <span v-if="selectedRows.length" class="toolbar-selected-tip">已选 {{ selectedRows.length }} 条</span>
          <a-tooltip content="刷新">
            <a-button size="small" type="text" @click="handleSearch">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
          <a-dropdown trigger="click" content-class="action-menu action-menu--toolbar">
            <a-tooltip content="更多操作">
              <a-button size="small" type="text"><icon-more /></a-button>
            </a-tooltip>
            <template #content>
              <a-doption>关闭特殊跟踪</a-doption>
              <a-doption>同步文件状态</a-doption>
              <a-doption>刷新物流节点</a-doption>
              <a-divider class="action-menu__divider" />
              <a-doption class="danger-opt" @click="handleDanger('批量废弃')">批量废弃</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <div class="zone-l4-table-card">
      <div class="table-card-cap table-card-cap--primary">
        <div class="table-card-cap__start" />
        <div class="table-card-cap__right">
          <a-pagination
            v-model:current="page"
            v-model:page-size="pageSize"
            :total="total"
            size="small"
            class="table-card-cap__pager"
            show-total
            show-page-size
            :page-size-options="[50, 100, 200]"
          />
          <a-tooltip content="列设置">
            <a-button size="small" type="text" class="table-card-cap__tool" @click="xTable?.openCustom()">
              <template #icon><icon-settings /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="table-wrap" style="flex:1;min-height:0">
        <vxe-table
          ref="xTable"
          border="none"
          size="small"
          class="compact workbench-table"
          height="100%"
          show-overflow="title"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          :data="rows"
          @checkbox-change="({ records }) => (selectedRows = records)"
          @checkbox-all="({ records }) => (selectedRows = records)"
        >
          <vxe-column type="checkbox" width="36" fixed="left" />
          <vxe-column type="seq" title="序号" width="52" fixed="left" align="center" />
          <vxe-column field="orderNo" title="订单编号" min-width="150" sortable fixed="left">
            <template #default="{ row }">
              <div class="cell-two-line">
                <a class="link-text link-text--strong c2-main">{{ row.orderNo }}</a>
                <span class="c2-sub">{{ row.fileReady ? '文件已同步' : '待补文件' }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="submitTime" title="提交时间" min-width="150" sortable />
          <vxe-column field="orderStatus" title="订单状态" min-width="98">
            <template #default="{ row }">
              <span class="s-pill" :data-s="getStatusToken(row.orderStatus)">{{ row.orderStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="cabinetType" title="货物类型" min-width="86">
            <template #default="{ row }">
              <span class="cargo-type-token" :class="{ 'cargo-type-token--risk': row.cabinetType === '化工品' }">
                {{ row.cabinetType }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="businessType" title="业务类型" min-width="86" />
          <vxe-column field="businessNo" title="业务单号" min-width="132" />
          <vxe-column field="warehouseNo" title="入仓编号" min-width="132" />
          <vxe-column field="entryNo" title="入仓单号" min-width="132" />
          <vxe-column field="salesman" title="业务员" min-width="110" />
          <vxe-column field="sender" title="发货人" min-width="120" />
          <vxe-column field="receiver" title="收货人" min-width="120" />
          <vxe-column field="containerVolume" title="框型柜量" min-width="96" />
          <vxe-column field="cabinetNo" title="柜号" min-width="110" />
          <vxe-column field="pol" title="起运港" min-width="100" />
          <vxe-column field="hblNo" title="HBL单号" min-width="130">
            <template #default="{ row }">
              <a v-if="row.hblNo" class="link-primary">{{ row.hblNo }}</a>
            </template>
          </vxe-column>
          <vxe-column field="mblNo" title="MBL主单号" min-width="130" />
          <vxe-column field="destinationPort" title="目的港" min-width="112" />
          <vxe-column field="etd" title="ETD" min-width="98" sortable />
          <vxe-column field="fileReady" title="文件下载" min-width="72" align="center" fixed="right">
            <template #default>
              <a-tooltip content="下载文件">
                <a-button type="text" class="row-action-btn row-action-btn--primary">
                  <icon-download />
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="60" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-tooltip content="更多">
                  <a-button type="text" class="row-action-btn row-action-btn--more" @click="Message.info(row.orderNo)">
                    <icon-more />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <a-drawer
      v-model:visible="advancedVisible"
      title="业务单高级查询"
      :width="1080"
      class="query-filter-drawer query-filter-drawer--wide"
    >
      <div class="query-filter-drawer__shell query-filter-drawer__shell--with-nav saved-query-workspace business-query-shell">
        <aside class="saved-query-workspace__side business-query-schemes">
          <div class="business-query-side__head">
            <span class="subpanel-cap__title">查询方案</span>
            <span class="subpanel-cap__meta">{{ savedQueries.length }} 个</span>
          </div>
          <button
            v-for="(scheme, index) in savedQueries"
            :key="scheme.name"
            type="button"
            class="query-scheme"
            :class="{ 'query-scheme--active': index === 0 }"
          >
            <span class="query-scheme__name">{{ scheme.name }}</span>
            <span class="query-scheme__meta">{{ scheme.meta }}</span>
          </button>
          <a-button size="small" type="outline" long>保存当前方案</a-button>
          <div class="business-query-recent">
            <div class="business-query-recent__title">最近查询</div>
            <button type="button" class="business-query-recent__item">YANTIAN / 未放舱 / 本周 ETD</button>
            <button type="button" class="business-query-recent__item">FBA / admin / 文件未同步</button>
          </div>
        </aside>

        <aside class="query-filter-drawer__nav business-query-nav">
          <div class="business-query-nav__title">
            <span>条件分组</span>
            <span>{{ totalAdvancedFields }}</span>
          </div>
          <button
            v-for="group in advancedGroups"
            :key="group.key"
            type="button"
            class="query-filter-drawer__nav-item"
            :class="{ 'query-filter-drawer__nav-item--active': activeGroupKey === group.key }"
            @click="scrollToAdvancedGroup(group.key)"
          >
            <span>{{ group.title }}</span>
            <span class="business-query-nav-count">{{ group.fields.length }}</span>
          </button>
        </aside>

        <div ref="queryEditorRef" class="query-filter-drawer__body business-query-editor">
          <div class="business-query-editor__head">
            <div>
              <div class="business-query-editor__title">全部高级条件</div>
              <div class="business-query-editor__meta">按业务模块连续展示，共 {{ totalAdvancedFields }} 项</div>
            </div>
            <a-button size="small" type="text" class="reset-btn" @click="clearAdvanced">清空全部</a-button>
          </div>

          <div
            v-for="group in advancedGroups"
            :key="group.key"
            class="query-filter-drawer__group business-query-group-card"
            :data-query-group="group.key"
          >
            <div class="query-filter-drawer__group-head">
              <span>{{ group.title }}</span>
              <span class="subpanel-cap__meta">{{ group.fields.length }} 项</span>
              <a-button size="small" type="text" class="reset-btn business-query-group-clear" @click="clearAdvancedGroup(group)">清空本组</a-button>
            </div>
            <a-form class="detail-form" layout="vertical" size="small" :model="q">
              <div class="detail-form-grid detail-form-grid--3">
                <a-form-item
                  v-for="field in group.fields"
                  :key="field.key"
                  :label="field.type === 'checkbox' ? ' ' : field.label"
                  :class="{ 'detail-field--span3': field.wide }"
                >
                  <a-input
                    v-if="field.type === 'input'"
                    v-model="q[field.key]"
                    size="small"
                    allow-clear
                    :placeholder="field.placeholder || '请输入'"
                  />
                  <a-select
                    v-else-if="field.type === 'select'"
                    v-model="q[field.key]"
                    size="small"
                    allow-clear
                    :placeholder="field.placeholder || '请选择'"
                  >
                    <a-option v-for="option in field.options || []" :key="option" :value="option">{{ option }}</a-option>
                  </a-select>
                  <a-range-picker
                    v-else-if="field.type === 'range'"
                    v-model="q[field.key]"
                    size="small"
                    style="width:100%"
                  />
                  <a-checkbox v-else-if="field.type === 'checkbox'" v-model="q[field.key]">
                    {{ field.label }}
                  </a-checkbox>
                  <a-textarea
                    v-else
                    v-model="q[field.key]"
                    size="small"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    :placeholder="field.placeholder || '请输入'"
                  />
                </a-form-item>
              </div>
            </a-form>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="detail-drawer-footer">
          <div class="detail-drawer-footer__start">
            <a-button size="small" type="text" class="reset-btn" @click="clearAdvanced">清空高级条件</a-button>
          </div>
          <div class="detail-drawer-footer__end">
            <a-button size="small" @click="advancedVisible = false">取消</a-button>
            <a-button size="small" type="primary" @click="advancedVisible = false; handleSearch()">应用查询</a-button>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>
