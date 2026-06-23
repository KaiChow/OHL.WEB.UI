import { computed, reactive, ref } from 'vue';
import { customerMockRecords } from '../../../../mock/customers';
import type { CustomerQuery, CustomerRecord } from '../types';

const defaultQuery = (): CustomerQuery => ({
  coopStatus: '',
  name: '',
  customerType: '',
  level: '',
  country: '',
  email: '',
  department: '',
  sales: '',
  operation: '',
  includeTags: [],
  excludeTags: [],
  contactTitle: '',
  contactName: '',
  contactPhone: '',
  transportMode: '',
  tradeTerms: '',
  productName: '',
  pol: '',
  pod: '',
  hasAbnormalEmail: '',
  lastUpdatedStart: '',
  lastUpdatedEnd: '',
  createdStart: '',
  createdEnd: '',
  lastSentStart: '',
  lastSentEnd: '',
  keyword: ''
});

export function useCustomerList() {
  const records = ref<CustomerRecord[]>([...customerMockRecords]);
  const query = reactive<CustomerQuery>(defaultQuery());
  const loading = ref(false);
  const selectedIds = ref<number[]>([]);
  const filterExpanded = ref(false);
  const page = reactive({ current: 1, size: 50, total: 0 });

  const drawerVisible = ref(false);
  const currentRecord = ref<CustomerRecord | null>(null);

  const filtered = computed(() => {
    return records.value.filter((row) => {
      if (query.coopStatus && row.CoopStatus !== query.coopStatus) return false;
      if (query.name && !row.Name.toLowerCase().includes(query.name.toLowerCase())) return false;
      if (query.customerType && row.CustomerType !== query.customerType) return false;
      if (query.level && row.Level !== query.level) return false;
      if (query.country && row.Country !== query.country) return false;
      if (query.email) {
        const emailMatch = row.Contacts.some((c) =>
          c.email.toLowerCase().includes(query.email.toLowerCase())
        );
        if (!emailMatch) return false;
      }
      if (query.keyword) {
        const kw = query.keyword.toLowerCase();
        const match =
          row.Name.toLowerCase().includes(kw) ||
          row.ProductName.toLowerCase().includes(kw) ||
          row.Contacts.some((c) => c.name.toLowerCase().includes(kw));
        if (!match) return false;
      }
      if (query.productName && !row.ProductName.toLowerCase().includes(query.productName.toLowerCase())) return false;
      if (query.tradeTerms && row.TradeTerms !== query.tradeTerms) return false;
      if (query.transportMode && row.TransportMode !== query.transportMode) return false;
      if (query.sales && row.SalesContact !== query.sales) return false;
      if (query.operation && row.OperationContact !== query.operation) return false;
      if (query.includeTags.length > 0) {
        const hasAll = query.includeTags.every((tag) => row.Tags.includes(tag));
        if (!hasAll) return false;
      }
      if (query.excludeTags.length > 0) {
        const hasAny = query.excludeTags.some((tag) => row.Tags.includes(tag));
        if (hasAny) return false;
      }
      return true;
    });
  });

  const pagedRows = computed(() => {
    page.total = filtered.value.length;
    const start = (page.current - 1) * page.size;
    return filtered.value.slice(start, start + page.size);
  });

  const fetchList = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 400);
  };

  const handleSearch = () => {
    page.current = 1;
    fetchList();
  };

  const handleReset = () => {
    Object.assign(query, defaultQuery());
    page.current = 1;
    fetchList();
  };

  const handlePageChange = () => {
    fetchList();
  };

  const openDetail = (row: CustomerRecord) => {
    currentRecord.value = row;
    drawerVisible.value = true;
  };

  const toggleStar = (row: CustomerRecord) => {
    const found = records.value.find((r) => r.Id === row.Id);
    if (found) found.IsStarred = !found.IsStarred;
  };

  const deleteRecord = (row: CustomerRecord) => {
    records.value = records.value.filter((r) => r.Id !== row.Id);
  };

  return {
    query,
    loading,
    selectedIds,
    filterExpanded,
    page,
    drawerVisible,
    currentRecord,
    pagedRows,
    fetchList,
    handleSearch,
    handleReset,
    handlePageChange,
    openDetail,
    toggleStar,
    deleteRecord
  };
}
