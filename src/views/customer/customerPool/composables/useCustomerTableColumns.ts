import { ref } from 'vue';

export interface ColumnOption {
  key: string;
  label: string;
  defaultVisible: boolean;
}

export const allColumnOptions: ColumnOption[] = [
  { key: 'Tags', label: '标签', defaultVisible: true },
  { key: 'CustomerType', label: '客户类型', defaultVisible: true },
  { key: 'Country', label: '国家', defaultVisible: true },
  { key: 'ProductName', label: '品名', defaultVisible: true },
  { key: 'TradeTerms', label: '贸易条款', defaultVisible: false },
  { key: 'TransportMode', label: '运输方式', defaultVisible: false },
  { key: 'SalesContact', label: '对接销售', defaultVisible: false },
  { key: 'OperationContact', label: '对接运营', defaultVisible: false }
];

export function useCustomerTableColumns() {
  const visibleColumns = ref<string[]>(
    allColumnOptions.filter((c) => c.defaultVisible).map((c) => c.key)
  );

  const isVisible = (key: string) => visibleColumns.value.includes(key);

  const toggleColumn = (key: string) => {
    if (isVisible(key)) {
      visibleColumns.value = visibleColumns.value.filter((k) => k !== key);
    } else {
      visibleColumns.value = [...visibleColumns.value, key];
    }
  };

  return {
    columnOptions: allColumnOptions,
    visibleColumns,
    isVisible,
    toggleColumn
  };
}
