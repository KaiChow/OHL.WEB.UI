import { ref, watch } from 'vue';

export interface TableColumnOption {
  key: string;
  title: string;
  locked?: boolean;
}

const STORAGE_KEY = 'sale-order-visible-columns';

const defaultColumns: TableColumnOption[] = [
  { key: 'CargoType', title: '货物类型' },
  { key: 'BizType', title: '业务类型' },
  { key: 'DcgNo', title: '业务单号' },
  { key: 'WarehouseNo', title: '入仓单号' },
  { key: 'Salesman', title: '业务员' },
  { key: 'ContainerInfo', title: '柜型柜量' }
];

export function useSaleOrderTableColumns() {
  const loadVisible = (): Record<string, boolean> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Record<string, boolean>;
    } catch {
      /* ignore */
    }
    const map: Record<string, boolean> = {};
    for (const col of defaultColumns) map[col.key] = true;
    return map;
  };

  const visibleColumns = ref<Record<string, boolean>>(loadVisible());

  watch(
    visibleColumns,
    (v) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    },
    { deep: true }
  );

  const isVisible = (key: string) => visibleColumns.value[key] !== false;

  const toggleColumn = (key: string, checked: boolean) => {
    visibleColumns.value[key] = checked;
  };

  return { columnOptions: defaultColumns, visibleColumns, isVisible, toggleColumn };
}
