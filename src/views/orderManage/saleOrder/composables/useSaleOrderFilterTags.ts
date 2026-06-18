import { computed } from 'vue';
import { scopeTabs, statusTabs, timeQuickOptions } from '../config';
import type { SaleOrderQuery } from '../types';

export interface FilterTag {
  key: string;
  label: string;
  display: string;
}

export function useSaleOrderFilterTags(query: SaleOrderQuery) {
  const activeFilterTags = computed<FilterTag[]>(() => {
    const tags: FilterTag[] = [];
    const q = query;
    if (q.dcgNo.trim()) tags.push({ key: 'dcgNo', label: '业务单号', display: q.dcgNo.trim() });
    if (q.bizType !== '全部') tags.push({ key: 'bizType', label: '业务类型', display: q.bizType });
    if (q.importExport !== '全部') tags.push({ key: 'importExport', label: '进/出口', display: q.importExport });
    if (q.salesman) tags.push({ key: 'salesman', label: '业务员', display: q.salesman });
    if (q.operator) tags.push({ key: 'operator', label: '操作员', display: q.operator });
    if (q.customerService) tags.push({ key: 'customerService', label: '客服', display: q.customerService });
    if (q.csDocument) tags.push({ key: 'csDocument', label: '客服单证', display: q.csDocument });
    if (q.packingMethod !== '全部') tags.push({ key: 'packingMethod', label: '装箱方式', display: q.packingMethod });
    if (q.shipper.trim()) tags.push({ key: 'shipper', label: '发货人', display: q.shipper.trim() });
    if (q.consignee.trim()) tags.push({ key: 'consignee', label: '收货人', display: q.consignee.trim() });
    if (q.quickTag !== '全部') tags.push({ key: 'quickTag', label: '快捷标签', display: q.quickTag });
    if (q.keyword.trim()) tags.push({ key: 'keyword', label: '关键词', display: q.keyword.trim() });

    if (q.timeQuick) {
      const timeLabel = timeQuickOptions.find((t) => t.value === q.timeQuick)?.label ?? q.timeQuick;
      tags.push({ key: 'timeQuick', label: '提交时间', display: timeLabel });
    }

    const scopeLabel = scopeTabs.find((t) => t.value === q.scope)?.label;
    if (q.scope !== 'all' && scopeLabel) tags.push({ key: 'scope', label: '范围', display: scopeLabel });

    const statusLabel = statusTabs.find((t) => t.value === q.status)?.label;
    if (q.status && statusLabel) tags.push({ key: 'status', label: '状态', display: statusLabel });

    return tags;
  });

  const hiddenAdvancedActive = computed(() => {
    const keys = new Set([
      'customerService',
      'csDocument',
      'packingMethod',
      'shipper',
      'consignee',
      'quickTag',
      'keyword'
    ]);
    return activeFilterTags.value.filter((t) => keys.has(t.key)).length;
  });

  return { activeFilterTags, hiddenAdvancedActive };
}
