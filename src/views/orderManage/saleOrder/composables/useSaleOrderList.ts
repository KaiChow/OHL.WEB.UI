import { computed, reactive, ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { saleOrderMockRecords } from '../../../../mock/saleOrders';
import type { DrawerMode } from '../../../../types/drawer';
import { useSaleOrderFilterTags } from './useSaleOrderFilterTags';
import type {
  SaleOrderFormModel,
  SaleOrderQuery,
  SaleOrderRecord,
  TransportMode
} from '../types';

const defaultQuery = (): SaleOrderQuery => ({
  transportMode: 'sea',
  bizType: '全部',
  dcgNo: '',
  importExport: '全部',
  salesman: '',
  operator: '',
  customerService: '',
  csDocument: '',
  packingMethod: '全部',
  shipper: '',
  consignee: '',
  quickTag: '全部',
  scope: 'all',
  status: '',
  keyword: '',
  timeQuick: ''
});

const FILTER_EXPANDED_KEY = 'sale-order-filter-expanded';

function matchTimeQuick(submitTime: string, timeQuick: SaleOrderQuery['timeQuick']) {
  if (!timeQuick) return true;
  const d = new Date(submitTime.replace(' ', 'T'));
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (timeQuick === 'today') return d >= startOfToday;
  if (timeQuick === 'last7') {
    const weekAgo = new Date(startOfToday);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return d >= weekAgo;
  }
  return true;
}

export function useSaleOrderList() {
  const records = ref<SaleOrderRecord[]>([...saleOrderMockRecords]);
  const query = reactive<SaleOrderQuery>(defaultQuery());
  const loading = ref(false);
  const selectedIds = ref<number[]>([]);
  const filterExpanded = ref(localStorage.getItem(FILTER_EXPANDED_KEY) === 'true');
  const page = reactive({ current: 1, size: 100, total: 0 });

  const { activeFilterTags, hiddenAdvancedActive } = useSaleOrderFilterTags(query);

  watch(filterExpanded, (v) => {
    localStorage.setItem(FILTER_EXPANDED_KEY, String(v));
  });

  const drawerVisible = ref(false);
  const drawerMode = ref<DrawerMode>('view');
  const currentRecord = ref<SaleOrderRecord | null>(null);
  const formModel = ref<SaleOrderFormModel>(createEmptyForm('sea'));

  function createEmptyForm(mode: TransportMode): SaleOrderFormModel {
    return {
      DcgNo: '',
      OrderNo: '',
      BizType: 'FBA',
      CargoType: '普货',
      ImportExport: '出口',
      Salesman: '',
      Operator: '',
      CustomerService: '',
      Shipper: '',
      Consignee: '',
      ContainerInfo: "1X40'HQ",
      PackingMethod: 'FCL',
      Status: 'draft',
      TransportMode: mode
    };
  }

  const baseFiltered = computed(() => {
    const kw = query.keyword.trim().toLowerCase();
    return records.value.filter((row) => {
      if (row.TransportMode !== query.transportMode) return false;
      if (query.scope !== 'all' && row.Scope !== query.scope) return false;
      if (query.bizType !== '全部' && row.BizType !== query.bizType) return false;
      if (query.importExport !== '全部' && row.ImportExport !== query.importExport) return false;
      if (query.packingMethod !== '全部' && row.PackingMethod !== query.packingMethod) return false;
      if (query.quickTag !== '全部' && row.QuickTag !== query.quickTag) return false;
      if (query.dcgNo && !row.DcgNo.toLowerCase().includes(query.dcgNo.toLowerCase())) return false;
      if (query.salesman && !row.Salesman.includes(query.salesman)) return false;
      if (query.operator && !row.Operator.includes(query.operator)) return false;
      if (query.customerService && !row.CustomerService.includes(query.customerService)) return false;
      if (query.csDocument && !row.CsDocument.includes(query.csDocument)) return false;
      if (query.shipper && !row.Shipper.toLowerCase().includes(query.shipper.toLowerCase())) return false;
      if (query.consignee && !row.Consignee.toLowerCase().includes(query.consignee.toLowerCase())) return false;
      if (!matchTimeQuick(row.SubmitTime, query.timeQuick)) return false;
      if (
        kw &&
        ![
          row.OrderNo,
          row.DcgNo,
          row.WarehouseNo,
          row.Shipper,
          row.Consignee,
          row.Salesman
        ].some((v) => v.toLowerCase().includes(kw))
      ) {
        return false;
      }
      return true;
    });
  });

  const filteredSource = computed(() => {
    if (!query.status) return baseFiltered.value;
    return baseFiltered.value.filter((row) => row.Status === query.status);
  });

  const statusCounts = computed(() => {
    const counts: Record<string, number> = { '': baseFiltered.value.length };
    for (const row of baseFiltered.value) {
      counts[row.Status] = (counts[row.Status] ?? 0) + 1;
    }
    return counts;
  });

  const pagedRows = computed(() => {
    page.total = filteredSource.value.length;
    const start = (page.current - 1) * page.size;
    return filteredSource.value.slice(start, start + page.size);
  });

  const fetchList = async () => {
    loading.value = true;
    selectedIds.value = [];
    await new Promise((r) => setTimeout(r, 180));
    loading.value = false;
  };

  const handleSearch = () => {
    page.current = 1;
    fetchList();
    Message.success('查询完成');
  };

  const handleReset = () => {
    const mode = query.transportMode;
    Object.assign(query, defaultQuery());
    query.transportMode = mode;
    page.current = 1;
    fetchList();
    Message.info('筛选已重置');
  };

  const handleTransportChange = (mode: TransportMode) => {
    Object.assign(query, defaultQuery());
    query.transportMode = mode;
    filterExpanded.value = false;
    page.current = 1;
    fetchList();
    Message.info(`已切换至${mode === 'sea' ? '海运' : mode === 'air' ? '空运' : '铁路'}，筛选已清空`);
  };

  const handleScopeChange = (scope: SaleOrderQuery['scope']) => {
    query.scope = scope;
    page.current = 1;
    fetchList();
  };

  const handleStatusChange = (status: string) => {
    query.status = status;
    page.current = 1;
    fetchList();
  };

  const handleClearStatus = () => {
    query.status = '';
    page.current = 1;
    fetchList();
  };

  const handleTimeQuickChange = (value: SaleOrderQuery['timeQuick']) => {
    query.timeQuick = value;
    page.current = 1;
    fetchList();
  };

  const handlePageChange = () => fetchList();

  const removeFilterTag = (key: string) => {
    switch (key) {
      case 'dcgNo':
        query.dcgNo = '';
        break;
      case 'bizType':
        query.bizType = '全部';
        break;
      case 'importExport':
        query.importExport = '全部';
        break;
      case 'salesman':
        query.salesman = '';
        break;
      case 'operator':
        query.operator = '';
        break;
      case 'customerService':
        query.customerService = '';
        break;
      case 'csDocument':
        query.csDocument = '';
        break;
      case 'packingMethod':
        query.packingMethod = '全部';
        break;
      case 'shipper':
        query.shipper = '';
        break;
      case 'consignee':
        query.consignee = '';
        break;
      case 'quickTag':
        query.quickTag = '全部';
        break;
      case 'keyword':
        query.keyword = '';
        break;
      case 'scope':
        query.scope = 'all';
        break;
      case 'status':
        query.status = '';
        break;
      case 'timeQuick':
        query.timeQuick = '';
        break;
      default:
        break;
    }
    page.current = 1;
    fetchList();
  };

  const clearAllFilterTags = () => {
    handleReset();
  };

  const handleExport = (scope: 'page' | 'all' | 'selected') => {
    const label =
      scope === 'page' ? '当前页' : scope === 'all' ? '全部筛选结果' : `已选 ${selectedIds.value.length} 条`;
    Message.success(`已导出${label}`);
  };

  const handleBatch = (action: string) => {
    const labels: Record<string, string> = {
      submit: '批量提交',
      export: '批量导出',
      abandon: '批量废弃'
    };
    Message.success(`${labels[action] ?? action}已提交`);
  };

  const openDetail = (row: SaleOrderRecord, mode: DrawerMode = 'view') => {
    currentRecord.value = row;
    drawerMode.value = mode;
    if (mode === 'edit') {
      formModel.value = {
        DcgNo: row.DcgNo,
        OrderNo: row.OrderNo,
        BizType: row.BizType,
        CargoType: row.CargoType,
        ImportExport: row.ImportExport,
        Salesman: row.Salesman,
        Operator: row.Operator,
        CustomerService: row.CustomerService,
        Shipper: row.Shipper,
        Consignee: row.Consignee,
        ContainerInfo: row.ContainerInfo,
        PackingMethod: row.PackingMethod,
        Status: row.Status,
        TransportMode: row.TransportMode
      };
    }
    drawerVisible.value = true;
  };

  const openCreate = () => {
    currentRecord.value = null;
    drawerMode.value = 'create';
    formModel.value = createEmptyForm(query.transportMode);
    drawerVisible.value = true;
  };

  const saveRecord = () => {
    if (drawerMode.value === 'create') {
      const nextId = Math.max(...records.value.map((r) => r.Id), 0) + 1;
      const orderNo = `PTP${2024}${String(nextId).padStart(6, '0')}`;
      records.value.unshift({
        Id: nextId,
        OrderNo: orderNo,
        SubmitTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Status: 'draft',
        CargoType: formModel.value.CargoType,
        BizType: formModel.value.BizType,
        DcgNo: formModel.value.DcgNo || `DCG${2024}${String(nextId).padStart(6, '0')}`,
        WarehouseNo: '',
        Salesman: formModel.value.Salesman,
        Shipper: formModel.value.Shipper,
        Consignee: formModel.value.Consignee,
        ContainerInfo: formModel.value.ContainerInfo,
        TransportMode: formModel.value.TransportMode,
        ImportExport: formModel.value.ImportExport,
        Operator: formModel.value.Operator,
        CustomerService: formModel.value.CustomerService,
        CsDocument: '',
        PackingMethod: formModel.value.PackingMethod,
        QuickTag: '',
        HasRemark: false,
        HasFiles: false,
        Scope: 'personal'
      });
      Message.success('业务单创建成功');
    } else if (drawerMode.value === 'edit' && currentRecord.value) {
      const idx = records.value.findIndex((r) => r.Id === currentRecord.value!.Id);
      if (idx >= 0) {
        records.value[idx] = {
          ...records.value[idx],
          ...formModel.value
        };
      }
      Message.success('保存成功');
    }
    drawerVisible.value = false;
    fetchList();
  };

  fetchList();

  return {
    records,
    query,
    loading,
    selectedIds,
    filterExpanded,
    page,
    drawerVisible,
    drawerMode,
    currentRecord,
    formModel,
    statusCounts,
    pagedRows,
    activeFilterTags,
    hiddenAdvancedActive,
    fetchList,
    handleSearch,
    handleReset,
    handleTransportChange,
    handleScopeChange,
    handleStatusChange,
    handleClearStatus,
    handleTimeQuickChange,
    handlePageChange,
    removeFilterTag,
    clearAllFilterTags,
    handleExport,
    handleBatch,
    openDetail,
    openCreate,
    saveRecord
  };
}
