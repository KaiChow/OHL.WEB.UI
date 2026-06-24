<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconCopy,
  IconDownload,
  IconDown,
  IconEdit,
  IconEye,
  IconFile,
  IconMore,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconSearch,
  IconUpload,
} from '@arco-design/web-vue/es/icon';
import SaleOrderTableCap from './components/SaleOrderTableCap.vue';
import SaleOrderDetailDrawer from './SaleOrderDetailDrawer.vue';

type TransportMode = 'sea' | 'air' | 'rail';
type ScopeKey = 'all' | 'mine' | 'permission';
type StatusKey = 'all' | 'wait' | 'handoff' | 'unsubmitted' | 'submitted' | 'accepted' | 'released' | 'rejected' | 'abandoned';
type PillStatus = 'wait' | 'op' | 'partial' | 'acc' | 'rel' | 'draft' | 'rej';

interface SaleOrderRow {
  id: number;
  orderNo: string;
  orderNoMark?: string;
  submittedAt: string;
  statusKey: StatusKey;
  statusText: string;
  pill: PillStatus;
  cargoType: string;
  cargoRisk?: 'danger' | 'battery';
  businessType: 'FOB' | 'FBA' | 'EXW' | 'DDP';
  businessNo: string;
  inboundNo: string;
  salesman: string;
  customerService: string;
  operator: string;
  shipper: string;
  consignee: string;
  containerQty: string;
  containerNo: string;
  pol: string;
  pod: string;
  hblNo: string;
  mblNo: string;
  etd: string;
  eta: string;
  carrierEtd: string;
  fileCount: number;
  scope: ScopeKey[];
  transport: TransportMode;
}

interface ColumnOption {
  key: string;
  title: string;
}

const transportModes: Array<{ key: TransportMode; label: string }> = [
  { key: 'sea', label: '海运' },
  { key: 'air', label: '空运' },
  { key: 'rail', label: '铁路' },
];

const scopeTabs: Array<{ key: ScopeKey; label: string }> = [
  { key: 'all', label: '全部单' },
  { key: 'mine', label: '个人单' },
  { key: 'permission', label: '权限单' },
];

const statusTabs: Array<{ key: StatusKey; label: string; badge?: 'warn' | 'danger' | 'ok' }> = [
  { key: 'all', label: '全部' },
  { key: 'wait', label: '待审单', badge: 'warn' },
  { key: 'handoff', label: '操作待接单', badge: 'warn' },
  { key: 'unsubmitted', label: '未提交' },
  { key: 'submitted', label: '已提交' },
  { key: 'accepted', label: '已接单', badge: 'ok' },
  { key: 'released', label: '已放舱', badge: 'ok' },
  { key: 'rejected', label: '已拒绝', badge: 'danger' },
  { key: 'abandoned', label: '已废弃' },
];

const selectOptions = {
  businessTypes: ['FOB', 'FBA', 'EXW', 'DDP'],
  cargoTypes: ['普货', '液体/粉末', '带电池', '危险货', '化工品'],
  staff: ['NadiaZeng', 'AmayYu', 'BrianSu', 'CrystalShi', 'DUSTINDU', 'AllanQiu', 'KateXiao'],
  ports: ['YANTIAN', 'NINGBO', 'QINGDAO', 'SHANGHAI', 'CHONGQING', 'WUHAN'],
  pod: ['ROTTERDAM', 'FELIXSTOWE', 'LONG BEACH', 'HAMBURG', 'SOUTHAMPTON', 'MIAMI'],
};

const sourceRows: SaleOrderRow[] = [
  {
    id: 148,
    orderNo: '',
    submittedAt: '2026-06-23 14:55:30',
    statusKey: 'handoff',
    statusText: '操作待接单',
    pill: 'op',
    cargoType: '液体/粉末',
    businessType: 'FOB',
    businessNo: 'FCL26065912',
    inboundNo: '',
    salesman: 'NadiaZeng',
    customerService: 'LilyChen',
    operator: 'OceanOps',
    shipper: 'GUANGZHOU TOPMAY INDUSTRIAL CO., LTD',
    consignee: 'DAJA LOGISTICS',
    containerQty: '1X40HQ',
    containerNo: '',
    pol: 'YANTIAN',
    pod: 'ROTTERDAM',
    hblNo: '',
    mblNo: '',
    etd: '2026-07-05',
    eta: '2026-07-30',
    carrierEtd: '2026-07-04',
    fileCount: 2,
    scope: ['all', 'mine'],
    transport: 'sea',
  },
  {
    id: 149,
    orderNo: '',
    submittedAt: '2026-06-23 14:55:16',
    statusKey: 'released',
    statusText: '已放舱',
    pill: 'rel',
    cargoType: '普货',
    businessType: 'FOB',
    businessNo: 'FCL26065910',
    inboundNo: '',
    salesman: 'AmayYu',
    customerService: 'MiaZhou',
    operator: 'OceanOps',
    shipper: 'NINGBO AUTOPARTS EXPORT CO., LTD',
    consignee: 'JRP DISTRIBUTION',
    containerQty: '2X40HQ',
    containerNo: '',
    pol: 'NINGBO',
    pod: 'SOUTHAMPTON',
    hblNo: '',
    mblNo: '',
    etd: '2026-06-29',
    eta: '',
    carrierEtd: '2026-06-29',
    fileCount: 1,
    scope: ['all', 'permission'],
    transport: 'sea',
  },
  {
    id: 150,
    orderNo: '',
    submittedAt: '2026-06-23 14:51:44',
    statusKey: 'unsubmitted',
    statusText: '未提交',
    pill: 'draft',
    cargoType: '普货',
    businessType: 'FOB',
    businessNo: 'FCL26065909',
    inboundNo: '',
    salesman: 'BrianSu',
    customerService: 'LilyChen',
    operator: 'DocsTeam',
    shipper: 'EASEGLORY INTERNATIONAL LIMITED',
    consignee: 'AKULA LIVING LIMITED',
    containerQty: '1X45HQ',
    containerNo: '',
    pol: 'YANTIAN',
    pod: 'LONG BEACH',
    hblNo: '',
    mblNo: '',
    etd: '2026-07-04',
    eta: '',
    carrierEtd: '2026-07-03',
    fileCount: 0,
    scope: ['all'],
    transport: 'sea',
  },
  {
    id: 151,
    orderNo: 'PTP26065298',
    orderNoMark: '危',
    submittedAt: '',
    statusKey: 'submitted',
    statusText: '已提交',
    pill: 'acc',
    cargoType: '普货',
    cargoRisk: 'danger',
    businessType: 'FBA',
    businessNo: 'LCL26065906',
    inboundNo: 'NLSZ26065298',
    salesman: 'CrystalShi',
    customerService: 'MayLiu',
    operator: 'OceanOps',
    shipper: '深圳市顶欣科技有限公司',
    consignee: 'DIM2',
    containerQty: 'LCL',
    containerNo: '',
    pol: 'YANTIAN',
    pod: 'ROTTERDAM',
    hblNo: 'PTP26065298',
    mblNo: '',
    etd: '2026-06-28',
    eta: '2026-07-29',
    carrierEtd: '2026-06-28',
    fileCount: 4,
    scope: ['all', 'mine'],
    transport: 'sea',
  },
  {
    id: 152,
    orderNo: 'PTP26065297',
    orderNoMark: '带',
    submittedAt: '',
    statusKey: 'released',
    statusText: '已放舱',
    pill: 'rel',
    cargoType: '普货',
    cargoRisk: 'battery',
    businessType: 'FBA',
    businessNo: 'LCL26065904',
    inboundNo: 'UKSZ26065297',
    salesman: 'DUSTINDU',
    customerService: 'MayLiu',
    operator: 'OceanOps',
    shipper: '深圳市优之生活用品有限公司',
    consignee: 'BHX4',
    containerQty: 'LCL',
    containerNo: '',
    pol: 'YANTIAN',
    pod: 'FELIXSTOWE',
    hblNo: 'PTP26065297',
    mblNo: '',
    etd: '2026-06-26',
    eta: '2026-08-04',
    carrierEtd: '2026-06-26',
    fileCount: 3,
    scope: ['all', 'permission'],
    transport: 'sea',
  },
  {
    id: 153,
    orderNo: 'DCG26065367',
    submittedAt: '2026-06-23 14:45:08',
    statusKey: 'released',
    statusText: '已放舱',
    pill: 'rel',
    cargoType: '普货',
    businessType: 'FOB',
    businessNo: 'FCL26065902',
    inboundNo: '',
    salesman: 'KyrieYi',
    customerService: 'MiaZhou',
    operator: 'DocsTeam',
    shipper: 'CORUPRO INDUSTRIAL LIMITED',
    consignee: 'ITES GUMMI-UND KUNSTSTOFFTECHNIK GMBH',
    containerQty: '1X40HQ',
    containerNo: '',
    pol: 'QINGDAO',
    pod: 'BREMERHAVEN',
    hblNo: '',
    mblNo: '',
    etd: '2026-07-05',
    eta: '2026-08-19',
    carrierEtd: '2026-07-05',
    fileCount: 2,
    scope: ['all'],
    transport: 'sea',
  },
  {
    id: 154,
    orderNo: 'DCG26065338',
    submittedAt: '2026-06-23 14:40:01',
    statusKey: 'accepted',
    statusText: '已接单',
    pill: 'op',
    cargoType: '普货',
    businessType: 'FOB',
    businessNo: 'LCL26065896',
    inboundNo: '',
    salesman: 'BrianSu',
    customerService: 'LilyChen',
    operator: 'OceanOps',
    shipper: 'EASEGLORY INTERNATIONAL LIMITED',
    consignee: 'AKULA LIVING LIMITED',
    containerQty: 'LCL',
    containerNo: '',
    pol: 'YANTIAN',
    pod: 'MIAMI',
    hblNo: 'DCG26065338',
    mblNo: '',
    etd: '2026-07-02',
    eta: '',
    carrierEtd: '2026-07-02',
    fileCount: 1,
    scope: ['all', 'mine'],
    transport: 'sea',
  },
  {
    id: 155,
    orderNo: '',
    submittedAt: '2026-06-23 14:39:40',
    statusKey: 'released',
    statusText: '已放舱',
    pill: 'rel',
    cargoType: '普货',
    businessType: 'FOB',
    businessNo: 'FCL26065895',
    inboundNo: '',
    salesman: 'JulinZhu',
    customerService: 'MiaZhou',
    operator: 'OceanOps',
    shipper: 'HUBEI SOLL NEW MATERIALS CO., LTD',
    consignee: 'VULCOR INSULATION LIMITED',
    containerQty: '1X40HQ',
    containerNo: '',
    pol: 'WUHAN',
    pod: 'CLEVELAND',
    hblNo: '',
    mblNo: '',
    etd: '2026-06-26',
    eta: '',
    carrierEtd: '2026-06-26',
    fileCount: 1,
    scope: ['all'],
    transport: 'sea',
  },
  {
    id: 156,
    orderNo: 'PTP26065292',
    orderNoMark: '3C',
    submittedAt: '',
    statusKey: 'released',
    statusText: '已放舱',
    pill: 'rel',
    cargoType: '带电池',
    cargoRisk: 'battery',
    businessType: 'FBA',
    businessNo: 'LCL26065891',
    inboundNo: 'UKSZ26065292',
    salesman: 'AllanQiu',
    customerService: 'MayLiu',
    operator: 'OceanOps',
    shipper: '深圳市一想电子有限公司',
    consignee: 'ORANGE CENTRAL',
    containerQty: 'LCL',
    containerNo: '',
    pol: 'YANTIAN',
    pod: 'FELIXSTOWE',
    hblNo: 'PTP26065292',
    mblNo: '',
    etd: '2026-06-26',
    eta: '2026-08-04',
    carrierEtd: '2026-06-26',
    fileCount: 5,
    scope: ['all', 'mine'],
    transport: 'sea',
  },
  {
    id: 157,
    orderNo: 'AIR26065301',
    submittedAt: '2026-06-23 13:52:12',
    statusKey: 'wait',
    statusText: '待审核',
    pill: 'wait',
    cargoType: '普货',
    businessType: 'DDP',
    businessNo: 'AIR26065901',
    inboundNo: '',
    salesman: 'KateXiao',
    customerService: 'IvyWu',
    operator: 'AirOps',
    shipper: 'SHENZHEN SKY SUPPLY CHAIN CO., LTD',
    consignee: 'DUS AIR CARGO GMBH',
    containerQty: '325KG',
    containerNo: '',
    pol: 'CAN',
    pod: 'FRA',
    hblNo: 'HAWB26065301',
    mblNo: 'MAWB26065301',
    etd: '2026-06-30',
    eta: '2026-07-02',
    carrierEtd: '2026-06-30',
    fileCount: 2,
    scope: ['all', 'permission'],
    transport: 'air',
  },
  {
    id: 158,
    orderNo: 'RAIL26065302',
    submittedAt: '2026-06-23 12:41:36',
    statusKey: 'accepted',
    statusText: '已接单',
    pill: 'op',
    cargoType: '普货',
    businessType: 'EXW',
    businessNo: 'RCL26065901',
    inboundNo: '',
    salesman: 'NadiaZeng',
    customerService: 'IvyWu',
    operator: 'RailOps',
    shipper: 'CHONGQING INTELLIGENT TECH CO., LTD',
    consignee: 'DUISBURG TRADING GMBH',
    containerQty: '2X40GP',
    containerNo: 'TGHU2606529',
    pol: 'CHONGQING',
    pod: 'DUISBURG',
    hblNo: 'RAIL26065302',
    mblNo: '',
    etd: '2026-07-01',
    eta: '2026-07-18',
    carrierEtd: '2026-07-01',
    fileCount: 3,
    scope: ['all', 'mine'],
    transport: 'rail',
  },
];

const columnOptions: ColumnOption[] = [
  { key: 'submittedAt', title: '提交时间' },
  { key: 'status', title: '订单状态' },
  { key: 'cargoType', title: '货物类型' },
  { key: 'businessType', title: '业务类型' },
  { key: 'businessNo', title: '业务编号' },
  { key: 'inboundNo', title: '入仓单号' },
  { key: 'salesman', title: '业务员' },
  { key: 'shipper', title: '发货人' },
  { key: 'consignee', title: '收货人' },
  { key: 'containerQty', title: '柜型柜量' },
  { key: 'containerNo', title: '柜号' },
  { key: 'pol', title: '起运港' },
  { key: 'pod', title: '目的港' },
  { key: 'hblNo', title: 'HBL 单号' },
  { key: 'mblNo', title: 'MBL 单号' },
  { key: 'etd', title: 'ETD' },
  { key: 'eta', title: 'ETA' },
  { key: 'carrierEtd', title: '驳船ETD' },
  { key: 'files', title: '文件下载' },
];

const visibleColumns = reactive<Record<string, boolean>>(
  Object.fromEntries(columnOptions.map((column) => [column.key, true]))
);

const query = reactive({
  transport: 'sea' as TransportMode,
  scope: 'all' as ScopeKey,
  status: 'all' as StatusKey,
  businessType: '',
  keywordField: 'businessNo',
  keyword: '',
  importExportType: '',
  salesman: '',
  operator: '',
  customerService: '',
  serviceDoc: '',
  cargoType: '',
  shipper: '',
  consignee: '',
  quickTag: '',
});

const page = reactive({ current: 1, size: 100, total: 0 });
const loading = ref(false);
const showAdvanced = ref(false);
const selectedRows = ref<SaleOrderRow[]>([]);
const detailVisible = ref(false);
const currentRow = ref<SaleOrderRow | null>(null);

const keywordFields = [
  { label: '业务单号', value: 'orderNo' },
  { label: '业务编号', value: 'businessNo' },
  { label: 'HBL 单号', value: 'hblNo' },
  { label: 'MBL 单号', value: 'mblNo' },
];

const statusCounts = computed(() => {
  const rows = sourceRows.filter((row) => row.transport === query.transport && row.scope.includes(query.scope));
  return statusTabs.reduce<Record<StatusKey, number>>((acc, tab) => {
    acc[tab.key] = tab.key === 'all' ? rows.length : rows.filter((row) => row.statusKey === tab.key).length;
    return acc;
  }, {} as Record<StatusKey, number>);
});

const filteredRows = computed(() => {
  const keyword = query.keyword.trim().toLowerCase();
  return sourceRows.filter((row) => {
    const keywordTarget = String(row[query.keywordField as keyof SaleOrderRow] ?? '').toLowerCase();
    const matchesKeyword = !keyword || keywordTarget.includes(keyword);
    return (
      row.transport === query.transport &&
      row.scope.includes(query.scope) &&
      (query.status === 'all' || row.statusKey === query.status) &&
      (!query.businessType || row.businessType === query.businessType) &&
      (!query.salesman || row.salesman === query.salesman) &&
      (!query.operator || row.operator === query.operator) &&
      (!query.customerService || row.customerService === query.customerService) &&
      (!query.cargoType || row.cargoType === query.cargoType) &&
      (!query.shipper || row.shipper.toLowerCase().includes(query.shipper.toLowerCase())) &&
      (!query.consignee || row.consignee.toLowerCase().includes(query.consignee.toLowerCase())) &&
      matchesKeyword
    );
  });
});

const pagedRows = computed(() => {
  page.total = filteredRows.value.length;
  const maxPage = Math.max(1, Math.ceil(page.total / page.size));
  if (page.current > maxPage) page.current = maxPage;
  const start = (page.current - 1) * page.size;
  return filteredRows.value.slice(start, start + page.size);
});

const selectedCount = computed(() => selectedRows.value.length);

watch(
  () => [query.transport, query.scope, query.status],
  () => {
    page.current = 1;
    selectedRows.value = [];
  }
);

const handleSearch = () => {
  page.current = 1;
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    Message.success('业务单查询完成');
  }, 240);
};

const handleReset = () => {
  Object.assign(query, {
    scope: 'all',
    status: 'all',
    businessType: '',
    keywordField: 'businessNo',
    keyword: '',
    importExportType: '',
    salesman: '',
    operator: '',
    customerService: '',
    serviceDoc: '',
    cargoType: '',
    shipper: '',
    consignee: '',
    quickTag: '',
  });
  page.current = 1;
};

const setTransport = (mode: TransportMode) => {
  query.transport = mode;
  query.status = 'all';
  query.scope = 'all';
};

const setScope = (scope: ScopeKey) => {
  query.scope = scope;
};

const setStatus = (status: StatusKey) => {
  query.status = status;
};

const handleRefresh = () => {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
    Message.success('业务单列表已刷新');
  }, 240);
};

const onCheckboxChange = ({ records }: { records: SaleOrderRow[] }) => {
  selectedRows.value = records;
};

const openDetail = (row: SaleOrderRow) => {
  currentRow.value = row;
  detailVisible.value = true;
};

const toggleColumn = (key: string, checked: boolean) => {
  visibleColumns[key] = checked;
};

const handlePageChange = (current: number) => {
  page.current = current;
};

const handlePageSizeChange = (size: number) => {
  page.size = size;
  page.current = 1;
};

const feedback = (text: string) => {
  Message.success(text);
};

const downloadFile = (row: SaleOrderRow) => {
  if (!row.fileCount) {
    Message.warning('当前业务单暂无可下载单证');
    return;
  }
  Message.success(`${row.orderNo || row.businessNo} 单证下载已创建`);
};

const selectedLabel = computed(() => selectedRows.value.map((row) => row.orderNo || row.businessNo).join('、'));

const getCargoTypeText = (row: SaleOrderRow) => {
  if (row.cargoRisk === 'danger') return '危险货';
  if (row.cargoRisk === 'battery') return '带电池';
  return row.cargoType;
};

nextTick(() => {
  loading.value = false;
});
</script>

<template>
  <div class="page-root page-root--dense sale-order-page">
    <div class="zone-l1-transport zone-card">
      <button
        v-for="mode in transportModes"
        :key="mode.key"
        class="seg-btn"
        :class="{ 'seg-btn--active': query.transport === mode.key }"
        type="button"
        @click="setTransport(mode.key)"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__main">
        <div class="filter-card__fields">
          <div class="filter-card__body--basic">
            <div class="filter-grid">
              <div class="filter-field">
                <label class="filter-field__label">业务类型</label>
                <a-select v-model="query.businessType" size="small" placeholder="请选择业务类型" allow-clear>
                  <a-option v-for="item in selectOptions.businessTypes" :key="item" :value="item">{{ item }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">单号检索</label>
                <a-input-group compact class="filter-combo filter-combo--keyword">
                  <a-select v-model="query.keywordField" size="small" class="filter-combo__select">
                    <a-option v-for="item in keywordFields" :key="item.value" :value="item.value">{{ item.label }}</a-option>
                  </a-select>
                  <a-input
                    v-model="query.keyword"
                    size="small"
                    placeholder="业务单号 / 业务编号 / HBL / MBL"
                    allow-clear
                    @press-enter="handleSearch"
                  />
                </a-input-group>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">进/出口单</label>
                <a-select v-model="query.importExportType" size="small" placeholder="请选择进/出口单类型" allow-clear>
                  <a-option value="export">出口单</a-option>
                  <a-option value="import">进口单</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">业务员</label>
                <a-select v-model="query.salesman" size="small" placeholder="请选择业务员" allow-search allow-clear>
                  <a-option v-for="item in selectOptions.staff" :key="item" :value="item">{{ item }}</a-option>
                </a-select>
              </div>
            </div>
          </div>
          <div class="filter-card__advanced" :class="{ 'filter-card__advanced--open': showAdvanced }">
            <div class="filter-card__advanced-inner">
              <div class="filter-grid filter-grid--advanced">
                <div class="filter-field">
                  <label class="filter-field__label">客服</label>
                  <a-select v-model="query.customerService" size="small" placeholder="请选择客服" allow-clear>
                    <a-option value="LilyChen">LilyChen</a-option>
                    <a-option value="MiaZhou">MiaZhou</a-option>
                    <a-option value="MayLiu">MayLiu</a-option>
                    <a-option value="IvyWu">IvyWu</a-option>
                  </a-select>
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">客服单证</label>
                  <a-input v-model="query.serviceDoc" size="small" placeholder="请输入客服单证" allow-clear @press-enter="handleSearch" />
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">操作员</label>
                  <a-select v-model="query.operator" size="small" placeholder="请选择操作员" allow-clear>
                    <a-option value="OceanOps">OceanOps</a-option>
                    <a-option value="AirOps">AirOps</a-option>
                    <a-option value="RailOps">RailOps</a-option>
                    <a-option value="DocsTeam">DocsTeam</a-option>
                  </a-select>
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">快捷标签</label>
                  <a-select v-model="query.quickTag" size="small" placeholder="请选择快捷标签" allow-clear>
                    <a-option value="urgent">急单</a-option>
                    <a-option value="docs">待补单证</a-option>
                    <a-option value="danger">危险货</a-option>
                  </a-select>
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">货物类型</label>
                  <a-select v-model="query.cargoType" size="small" placeholder="请选择货物类型" allow-clear>
                    <a-option v-for="item in selectOptions.cargoTypes" :key="item" :value="item">{{ item }}</a-option>
                  </a-select>
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">发货人</label>
                  <a-input v-model="query.shipper" size="small" placeholder="请输入发货人" allow-clear @press-enter="handleSearch" />
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">收货人</label>
                  <a-input v-model="query.consignee" size="small" placeholder="请输入收货人" allow-clear @press-enter="handleSearch" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-card__actions-panel">
          <a-button size="small" type="primary" class="filter-card__query-btn" title="查询" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button size="small" type="text" class="reset-btn" title="重置" @click="handleReset">重置</a-button>
          <button
            class="filter-expand-link filter-expand-link--panel"
            type="button"
            :title="showAdvanced ? '收起' : '更多'"
            :aria-label="showAdvanced ? '收起更多筛选' : '展开更多筛选'"
            @click="showAdvanced = !showAdvanced"
          >
            <span class="filter-expand-link__text">{{ showAdvanced ? '收起' : '更多' }}</span>
            <icon-down />
          </button>
        </div>
      </div>
    </div>

    <div class="zone-l3-action zone-card zone-card--stack">
      <div class="toolbar toolbar--dense">
        <div class="toolbar-group">
          <button
            v-for="tab in scopeTabs"
            :key="tab.key"
            class="stab"
            :class="{ 'stab--active': query.scope === tab.key }"
            type="button"
            @click="setScope(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="toolbar-divider" />
        <div class="toolbar-group">
          <a-button size="small" type="primary" @click="feedback('新建业务单入口已打开')">
            <template #icon><icon-plus /></template>
            创建业务单
          </a-button>
          <a-button size="small" @click="feedback('业务单导出已创建')">
            <template #icon><icon-download /></template>
            导出
          </a-button>
          <a-dropdown trigger="click">
            <a-button size="small">
              批量操作
              <icon-down />
            </a-button>
            <template #content>
              <a-doption :disabled="!selectedCount" @click="feedback(`已复制 ${selectedCount} 票业务单`)">
                <template #icon><icon-copy /></template>
                复制业务单
              </a-doption>
              <a-doption :disabled="!selectedCount" @click="feedback(`已创建 ${selectedCount} 票打印任务`)">
                <template #icon><icon-printer /></template>
                打印业务单
              </a-doption>
              <a-doption :disabled="!selectedCount" @click="feedback(`已提交 ${selectedCount} 票业务单`)">批量提交</a-doption>
              <a-doption :disabled="!selectedCount" @click="feedback(`已关闭 ${selectedCount} 票特殊跟踪`)">关闭特殊跟踪</a-doption>
              <a-doption :disabled="!selectedCount">分配操作员</a-doption>
            </template>
          </a-dropdown>
        </div>
        <div class="toolbar-group toolbar-group--grow" />
        <div class="toolbar-aside">
          <span v-if="selectedCount > 0" class="bulk-hint" :title="selectedLabel">已选 {{ selectedCount }} 条</span>
          <a-tooltip content="刷新列表">
            <a-button size="small" type="text" @click="handleRefresh">
              <template #icon><icon-refresh /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <div class="scope-status-bar">
        <div class="scope-status-bar__status">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            class="stab"
            :class="{ 'stab--active': query.status === tab.key }"
            type="button"
            @click="setStatus(tab.key)"
          >
            {{ tab.label }}
            <span
              class="stab-badge"
              :class="{
                'stab-badge--warn': tab.badge === 'warn',
                'stab-badge--danger': tab.badge === 'danger',
                'stab-badge--ok': tab.badge === 'ok',
              }"
            >
              {{ statusCounts[tab.key] }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="zone-l4-table-card zone-card">
      <sale-order-table-cap
        :page="page"
        :column-options="columnOptions"
        :visible-columns="visibleColumns"
        @toggle-column="toggleColumn"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <div class="table-wrap">
        <vxe-table
          class="compact workbench-table"
          border="none"
          size="small"
          height="100%"
          show-overflow="title"
          show-header-overflow="title"
          :loading="loading"
          :stripe="true"
          :data="pagedRows"
          :row-config="{ isHover: true, keyField: 'id', height: 36 }"
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onCheckboxChange"
          @checkbox-all="onCheckboxChange"
        >
          <template #empty>
            <div class="state-center--in-table">
              <icon-file class="state-empty-icon" />
              <span>暂无业务单</span>
            </div>
          </template>
          <vxe-column type="checkbox" width="40" fixed="left" />
          <vxe-column type="seq" title="序号" width="56" fixed="left" />
          <vxe-column field="orderNo" title="订单编号" width="150" fixed="left" sortable>
            <template #default="{ row }">
              <span v-if="row.orderNo" class="so-order-cell">
                <span class="link-text link-text--strong mono" @click="openDetail(row)">{{ row.orderNo }}</span>
                <span v-if="row.orderNoMark" class="so-order-mark">{{ row.orderNoMark }}</span>
              </span>
              <span v-else class="sub-text">未生成</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.submittedAt" field="submittedAt" title="提交时间" width="152" sortable />
          <vxe-column v-if="visibleColumns.status" field="statusText" title="订单状态" width="112" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.pill">{{ row.statusText }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.cargoType" field="cargoType" title="货物类型" width="112">
            <template #default="{ row }">
              <span class="cargo-type-token" :class="{ 'cargo-type-token--risk': row.cargoRisk }" :title="getCargoTypeText(row)">
                {{ getCargoTypeText(row) }}
              </span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.businessType" field="businessType" title="业务类型" width="82" />
          <vxe-column v-if="visibleColumns.businessNo" field="businessNo" title="业务编号" width="132" sortable>
            <template #default="{ row }">
              <span class="mono">{{ row.businessNo }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.inboundNo" field="inboundNo" title="入仓单号" width="138">
            <template #default="{ row }">
              <span v-if="row.inboundNo" class="mono">{{ row.inboundNo }}</span>
              <span v-else class="sub-text">-</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.salesman" field="salesman" title="业务员" width="98" />
          <vxe-column v-if="visibleColumns.shipper" field="shipper" title="发货人" min-width="190">
            <template #default="{ row }">
              <span class="cell-strong ellipsis" :title="row.shipper">{{ row.shipper }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.consignee" field="consignee" title="收货人" min-width="190">
            <template #default="{ row }">
              <span class="cell-strong ellipsis" :title="row.consignee">{{ row.consignee }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.containerQty" field="containerQty" title="柜型柜量" width="104" />
          <vxe-column v-if="visibleColumns.containerNo" field="containerNo" title="柜号" width="124">
            <template #default="{ row }">
              <span v-if="row.containerNo" class="mono">{{ row.containerNo }}</span>
              <span v-else class="sub-text">-</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.pol" field="pol" title="起运港" width="118">
            <template #default="{ row }">
              <span class="cell-strong mono">{{ row.pol }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.pod" field="pod" title="目的港" width="126">
            <template #default="{ row }">
              <span class="cell-strong mono">{{ row.pod }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.hblNo" field="hblNo" title="HBL 单号" width="138" sortable>
            <template #default="{ row }">
              <span v-if="row.hblNo" class="link-text mono" @click="openDetail(row)">{{ row.hblNo }}</span>
              <span v-else class="sub-text">-</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.mblNo" field="mblNo" title="MBL 单号" width="138" sortable>
            <template #default="{ row }">
              <span v-if="row.mblNo" class="link-text mono">{{ row.mblNo }}</span>
              <span v-else class="sub-text">-</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.etd" field="etd" title="ETD" width="112" sortable>
            <template #default="{ row }">
              <span class="date-val">{{ row.etd || '-' }}</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.eta" field="eta" title="ETA" width="112" sortable>
            <template #default="{ row }">
              <span v-if="row.eta" class="date-val">{{ row.eta }}</span>
              <span v-else class="sub-text">-</span>
            </template>
          </vxe-column>
          <vxe-column v-if="visibleColumns.carrierEtd" field="carrierEtd" title="驳船ETD" width="112" />
          <vxe-column v-if="visibleColumns.files" field="fileCount" title="文件下载" width="88" align="center">
            <template #default="{ row }">
              <a-tooltip :content="row.fileCount ? `下载 ${row.fileCount} 份单证` : '暂无单证'">
                <a-button
                  type="text"
                  class="row-action-btn"
                  :class="{ 'btn-download-disabled': !row.fileCount }"
                  @click="downloadFile(row)"
                >
                  <icon-download />
                </a-button>
              </a-tooltip>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="88" fixed="right" align="center">
            <template #default="{ row }">
              <span class="row-actions">
                <a-tooltip content="查看">
                  <a-button type="text" class="row-action-btn row-action-btn--primary" @click="openDetail(row)">
                    <icon-eye />
                  </a-button>
                </a-tooltip>
                <a-dropdown trigger="click">
                  <a-button type="text" class="row-action-btn row-action-btn--more">
                    <icon-more />
                  </a-button>
                  <template #content>
                    <a-doption @click="feedback(`${row.orderNo || row.businessNo} 已进入编辑`)">
                      <template #icon><icon-edit /></template>
                      编辑业务单
                    </a-doption>
                    <a-doption @click="feedback(`${row.orderNo || row.businessNo} 已复制`)">
                      <template #icon><icon-copy /></template>
                      复制业务单
                    </a-doption>
                    <a-doption @click="feedback(`${row.orderNo || row.businessNo} 单证上传入口已打开`)">
                      <template #icon><icon-upload /></template>
                      上传单证
                    </a-doption>
                  </template>
                </a-dropdown>
              </span>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <sale-order-detail-drawer v-model:visible="detailVisible" :row="currentRow" />
  </div>
</template>

<style scoped>
.sale-order-page {
  min-width: 0;
}

.so-order-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  min-height: 22px;
  padding: 0;
  border-radius: var(--dense-radius);
  background: transparent;
  box-shadow: none;
}

.so-order-mark {
  flex-shrink: 0;
  height: 16px;
  min-width: 16px;
  padding: 0 3px;
  border-radius: 8px;
  color: var(--dense-warning-7);
  background: var(--dense-warning-1);
  border: 1px solid var(--dense-warning-3);
  font-size: var(--dense-font-micro);
  font-weight: 600;
  line-height: 15px;
  text-align: center;
}
</style>
