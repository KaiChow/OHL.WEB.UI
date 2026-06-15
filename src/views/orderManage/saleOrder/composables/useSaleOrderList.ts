import { computed, ref, watch } from 'vue';
import { saleOrders } from '../../../../mock/saleOrders';
import { phaseStatusMap, saleOrderColumns, transportTypeMap } from '../config';
import type {
  PhaseFilter,
  QuickSearchField,
  SaleOrderListColumnKey,
  SaleOrderRow,
  ScopeFilter,
  TransportType
} from '../types';

const detailFields = new Set<SaleOrderListColumnKey>([
  'ContainerDataJson',
  'ContainerNoStr',
  'HblNo',
  'MblNo',
  'DownFile',
  'Operation'
]);

const mergeFields = new Set<SaleOrderListColumnKey>(
  saleOrderColumns.map((column) => column.field).filter((field) => !detailFields.has(field))
);

export const useSaleOrderList = () => {
  const keyword = ref('');
  const quickSearchField = ref<QuickSearchField>('OrderNo');
  const businessType = ref('');
  const importExportType = ref('');
  const salesmanKeyword = ref('');
  const operatorKeyword = ref('');
  const customerServiceKeyword = ref('');
  const serviceOrderNo = ref('');
  const loadingType = ref('');
  const shipperKeyword = ref('');
  const consigneeKeyword = ref('');
  const quickTag = ref('');
  const containerKeyword = ref('');
  const customerKeyword = ref('');
  const status = ref('');
  const mergeCells = ref(true);
  const advancedOpen = ref(false);
  const detailOpen = ref(false);
  const selectedOrder = ref<SaleOrderRow | null>(null);
  const hoveredGroupId = ref('');
  const currentGroupId = ref('');
  const advancedFilters = ref<Record<string, string | boolean | string[]>>({});
  const activeTransport = ref<TransportType>('sea');
  const scopeFilter = ref<ScopeFilter>('all');
  const phaseFilter = ref<PhaseFilter>('all');
  const currentPage = ref(1);
  const pageSize = ref(50);

  const readField = (item: SaleOrderRow, field: string) => {
    if (field === 'SoNo' || field === 'ExtraNo' || field === 'ExtraOrderNo') {
      return '';
    }

    return String((item as unknown as Record<string, string | number | undefined>)[field] || '');
  };

  const matchTextField = (item: SaleOrderRow, field: string, value: string) => {
    const text = value.trim().toLowerCase();

    return !text || readField(item, field).toLowerCase().includes(text);
  };

  const matchScope = (item: SaleOrderRow) => {
    if (scopeFilter.value === 'mine') {
      return item.Salesman === '王敏';
    }

    if (scopeFilter.value === 'permission') {
      return item.Salesman === '王敏' || item.Salesman === '赵凯' || item.FollowState === '待审核';
    }

    return true;
  };

  const matchPhase = (item: SaleOrderRow) => {
    const states = phaseStatusMap[phaseFilter.value];

    return !states.length || states.includes(item.FollowState);
  };

  const matchAdvancedFilters = (item: SaleOrderRow) =>
    Object.entries(advancedFilters.value).every(([field, rawValue]) => {
      if (Array.isArray(rawValue)) {
        return rawValue.every((value) => !value);
      }

      if (typeof rawValue === 'boolean') {
        return rawValue ? true : true;
      }

      const value = String(rawValue ?? '').trim();

      if (!value) {
        return true;
      }

      if (field.endsWith('Range')) {
        return true;
      }

      return readField(item, field).toLowerCase().includes(value.toLowerCase());
    });

  const filteredOrders = computed(() => {
    const containerText = containerKeyword.value.trim().toLowerCase();
    const customerText = customerKeyword.value.trim().toLowerCase();

    return saleOrders.filter((item) => {
      const matchedKeyword = matchTextField(item, quickSearchField.value, keyword.value);
      const matchedContainer =
        !containerText ||
        item.ContainerNoStr.toLowerCase().includes(containerText) ||
        item.ContainerDataJson.toLowerCase().includes(containerText);
      const matchedCustomer =
        !customerText ||
        item.CustomerName.toLowerCase().includes(customerText) ||
        item.Shipper.toLowerCase().includes(customerText) ||
        item.Consignees.toLowerCase().includes(customerText);
      const matchedStatus = !status.value || item.FollowState === status.value;
      const matchedTransport = item.BusinessTypeStr === transportTypeMap[activeTransport.value];
      const matchedBusinessType = !businessType.value || item.BusinessTypeStr === businessType.value;
      const matchedImportExport = !importExportType.value || importExportType.value === 'export';
      const matchedSalesman = matchTextField(item, 'Salesman', salesmanKeyword.value);
      const matchedOperator = matchTextField(item, 'Operator', operatorKeyword.value);
      const matchedService = matchTextField(item, 'CustomersServesName', customerServiceKeyword.value);
      const matchedServiceNo = matchTextField(item, 'OrderNo', serviceOrderNo.value);
      const matchedLoadingType = !loadingType.value || item.LoaddingTypeStr === loadingType.value;
      const matchedShipper = matchTextField(item, 'Shipper', shipperKeyword.value);
      const matchedConsignee = matchTextField(item, 'Consignees', consigneeKeyword.value);
      const matchedQuickTag = !quickTag.value || item.ServiceItemStr.includes(quickTag.value);

      return (
        matchedKeyword &&
        matchedContainer &&
        matchedCustomer &&
        matchedStatus &&
        matchedTransport &&
        matchedBusinessType &&
        matchedImportExport &&
        matchedSalesman &&
        matchedOperator &&
        matchedService &&
        matchedServiceNo &&
        matchedLoadingType &&
        matchedShipper &&
        matchedConsignee &&
        matchedQuickTag &&
        matchScope(item) &&
        matchPhase(item) &&
        matchAdvancedFilters(item)
      );
    });
  });

  const orderCount = computed(() => new Set(filteredOrders.value.map((item) => item.groupId)).size);
  const activeAdvancedCount = computed(
    () =>
      Object.values(advancedFilters.value).filter((value) =>
        Array.isArray(value) ? value.some(Boolean) : typeof value === 'boolean' ? value : String(value || '').trim()
      ).length
  );

  const transportOrders = computed(() =>
    saleOrders.filter((item) => item.BusinessTypeStr === transportTypeMap[activeTransport.value])
  );

  const phaseTabs = computed(() => {
    const rows = transportOrders.value.filter(matchScope);

    return [
      { label: '全部', value: 'all' as const, count: new Set(rows.map((item) => item.groupId)).size },
      {
        label: '待订舱',
        value: 'pending' as const,
        count: new Set(
          rows.filter((item) => phaseStatusMap.pending.includes(item.FollowState)).map((item) => item.groupId)
        ).size
      },
      {
        label: '运输中',
        value: 'processing' as const,
        count: new Set(
          rows.filter((item) => phaseStatusMap.processing.includes(item.FollowState)).map((item) => item.groupId)
        ).size
      },
      {
        label: '已放行',
        value: 'done' as const,
        count: new Set(
          rows.filter((item) => phaseStatusMap.done.includes(item.FollowState)).map((item) => item.groupId)
        ).size
      },
      {
        label: '异常',
        value: 'exception' as const,
        count: new Set(
          rows.filter((item) => phaseStatusMap.exception.includes(item.FollowState)).map((item) => item.groupId)
        ).size
      }
    ];
  });

  const pagedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;

    return filteredOrders.value.slice(start, start + pageSize.value);
  });

  const resetFilters = () => {
    keyword.value = '';
    quickSearchField.value = 'OrderNo';
    businessType.value = '';
    importExportType.value = '';
    salesmanKeyword.value = '';
    operatorKeyword.value = '';
    customerServiceKeyword.value = '';
    serviceOrderNo.value = '';
    loadingType.value = '';
    shipperKeyword.value = '';
    consigneeKeyword.value = '';
    quickTag.value = '';
    containerKeyword.value = '';
    customerKeyword.value = '';
    status.value = '';
    phaseFilter.value = 'all';
    scopeFilter.value = 'all';
  };

  const resetAdvancedFilters = () => {
    advancedFilters.value = {};
  };

  const openOrderDetail = (row: SaleOrderRow) => {
    selectedOrder.value = row;
    currentGroupId.value = row.groupId;
    detailOpen.value = true;
  };

  const setHoveredOrderGroup = (row: SaleOrderRow | null) => {
    hoveredGroupId.value = row?.groupId || '';
  };

  const setCurrentOrderGroup = (row: SaleOrderRow) => {
    currentGroupId.value = row.groupId;
  };

  const getRowClassName = ({ row }: { row: SaleOrderRow }) => {
    const classes = ['order-group-row'];

    if (row.detailCount <= 1) {
      classes.push('order-group-row--single');
    } else if (row.detailIndex === 0) {
      classes.push('order-group-row--start');
    } else if (row.detailIndex === row.detailCount - 1) {
      classes.push('order-group-row--end');
    } else {
      classes.push('order-group-row--middle');
    }

    if (hoveredGroupId.value && row.groupId === hoveredGroupId.value) {
      classes.push('order-group-row--hovered');
    }

    if (currentGroupId.value && row.groupId === currentGroupId.value) {
      classes.push('order-group-row--current');
    }

    return classes.join(' ');
  };

  const getCellClassName = ({ column }: { column: { field?: SaleOrderListColumnKey } }) => {
    const classes: string[] = [];

    if (column.field && mergeCells.value && mergeFields.has(column.field)) {
      classes.push('merged-master-cell');
    }

    if (column.field === 'DcgNo' || column.field === 'HblNo' || column.field === 'MblNo') {
      classes.push('cell-link');
    }

    if (column.field === 'DcgNo' || column.field === 'OrderNo' || column.field === 'WarehouseNo') {
      classes.push('cell-identity');
    }

    if (column.field === 'Etd' || column.field === 'Eta' || column.field === 'BargeEtd') {
      classes.push('cell-date');
    }

    if (column.field === 'LoaddingPortEn' || column.field === 'DeliveryPortEn') {
      classes.push('cell-route');
    }

    if (column.field === 'ContainerDataJson') {
      classes.push('cell-container');
    }

    return classes.join(' ');
  };

  const mergeCellConfig = computed(() => {
    if (!mergeCells.value) {
      return [];
    }

    const groups = new Map<string, { row: number; rowspan: number }>();

    pagedOrders.value.forEach((item, rowIndex) => {
      const group = groups.get(item.groupId);

      if (group) {
        group.rowspan += 1;
      } else {
        groups.set(item.groupId, { row: rowIndex, rowspan: 1 });
      }
    });

    const mergeColumnIndexes = saleOrderColumns
      .map((column, index) => (mergeFields.has(column.field) ? index + 1 : -1))
      .filter((index) => index > -1);

    return [...groups.values()].flatMap((group) => {
      if (group.rowspan <= 1) {
        return [];
      }

      return mergeColumnIndexes.map((col) => ({
        row: group.row,
        col,
        rowspan: group.rowspan,
        colspan: 1
      }));
    });
  });

  watch(
    [
      keyword,
      quickSearchField,
      businessType,
      importExportType,
      salesmanKeyword,
      operatorKeyword,
      customerServiceKeyword,
      serviceOrderNo,
      loadingType,
      shipperKeyword,
      consigneeKeyword,
      quickTag,
      containerKeyword,
      customerKeyword,
      status,
      activeTransport,
      scopeFilter,
      phaseFilter,
      advancedFilters
    ],
    () => {
      currentPage.value = 1;
    },
    { deep: true }
  );

  return {
    keyword,
    quickSearchField,
    businessType,
    importExportType,
    salesmanKeyword,
    operatorKeyword,
    customerServiceKeyword,
    serviceOrderNo,
    loadingType,
    shipperKeyword,
    consigneeKeyword,
    quickTag,
    containerKeyword,
    customerKeyword,
    status,
    mergeCells,
    advancedOpen,
    detailOpen,
    selectedOrder,
    hoveredGroupId,
    currentGroupId,
    advancedFilters,
    activeTransport,
    scopeFilter,
    phaseFilter,
    currentPage,
    pageSize,
    filteredOrders,
    orderCount,
    activeAdvancedCount,
    phaseTabs,
    pagedOrders,
    resetFilters,
    resetAdvancedFilters,
    openOrderDetail,
    setHoveredOrderGroup,
    setCurrentOrderGroup,
    getRowClassName,
    getCellClassName,
    mergeCellConfig
  };
};
