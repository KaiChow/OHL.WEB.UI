<script setup lang="ts">
import { computed } from 'vue';
import { IconDown, IconUp } from '@arco-design/web-vue/es/icon';
import {
  ADVANCED_FILTER_COUNT,
  bizTypeOptions,
  consigneeOptions,
  importExportOptions,
  packingOptions,
  quickTagOptions,
  shipperOptions,
  staffOptions,
  timeQuickOptions,
  transportTabs
} from '../config';
import type { SaleOrderQuery, TransportMode } from '../types';

const props = defineProps<{
  query: SaleOrderQuery;
  filterExpanded: boolean;
  hiddenAdvancedActive: number;
}>();

const emit = defineEmits<{
  search: [];
  reset: [];
  'update:filterExpanded': [value: boolean];
  'transport-change': [mode: TransportMode];
  'time-quick-change': [value: SaleOrderQuery['timeQuick']];
}>();

const expandTooltip = computed(() => {
  if (props.hiddenAdvancedActive <= 0 || props.filterExpanded) return '';
  return `高级筛选已启用 ${props.hiddenAdvancedActive} 项`;
});

const toggleExpand = () => {
  emit('update:filterExpanded', !props.filterExpanded);
};

const onTimeChip = (value: SaleOrderQuery['timeQuick']) => {
  emit('time-quick-change', value);
};
</script>

<template>
  <div class="zone-l1-transport zone-card">
    <button
      v-for="tab in transportTabs"
      :key="tab.value"
      type="button"
      class="seg-btn"
      :class="{ 'seg-btn--active': query.transportMode === tab.value }"
      @click="emit('transport-change', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>

  <div class="zone-l2-filter-card zone-card filter-card">
    <div class="filter-card__main">
      <div class="filter-card__fields">
        <div class="filter-card__body filter-card__body--basic">
          <div class="filter-grid">
            <div class="filter-field">
              <label class="filter-field__label">业务单号</label>
              <a-input
                v-model="query.dcgNo"
                allow-clear
                size="small"
                placeholder="单号 / HBL"
                @press-enter="emit('search')"
              />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">业务类型</label>
              <a-select v-model="query.bizType" allow-clear size="small" placeholder="请选择" @change="emit('search')">
                <a-option v-for="opt in bizTypeOptions" :key="opt" :value="opt">{{ opt }}</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">进/出口</label>
              <a-select v-model="query.importExport" allow-clear size="small" placeholder="请选择" @change="emit('search')">
                <a-option v-for="opt in importExportOptions" :key="opt" :value="opt">{{ opt }}</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">业务员</label>
              <a-select
                v-model="query.salesman"
                allow-clear
                allow-search
                size="small"
                placeholder="请输入业务员"
                @change="emit('search')"
              >
                <a-option v-for="opt in staffOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
              </a-select>
            </div>

            <div class="filter-field">
              <label class="filter-field__label">操作员</label>
              <a-select
                v-model="query.operator"
                allow-clear
                allow-search
                size="small"
                placeholder="请输入操作员"
                @change="emit('search')"
              >
                <a-option v-for="opt in staffOptions" :key="'op-' + opt.value" :value="opt.value">{{ opt.label }}</a-option>
              </a-select>
            </div>
            <div class="filter-field filter-field--span3">
              <label class="filter-field__label">提交时间</label>
              <div class="time-chip-group">
                <button
                  v-for="chip in timeQuickOptions"
                  :key="chip.value || 'all'"
                  type="button"
                  class="time-chip"
                  :class="{ 'time-chip--active': query.timeQuick === chip.value }"
                  @click="onTimeChip(chip.value)"
                >
                  {{ chip.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="filter-card__advanced"
          :class="{ 'filter-card__advanced--open': filterExpanded }"
        >
          <div class="filter-card__advanced-inner">
            <div class="filter-grid filter-grid--advanced">
              <div class="filter-field">
                <label class="filter-field__label">客服</label>
                <a-select
                  v-model="query.customerService"
                  allow-clear
                  allow-search
                  size="small"
                  placeholder="请输入客服"
                  @change="emit('search')"
                >
                  <a-option v-for="opt in staffOptions" :key="'cs-' + opt.value" :value="opt.value">{{ opt.label }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">客服单证</label>
                <a-input v-model="query.csDocument" allow-clear size="small" @press-enter="emit('search')" />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">装箱方式</label>
                <a-select v-model="query.packingMethod" allow-clear size="small" placeholder="请选择" @change="emit('search')">
                  <a-option v-for="opt in packingOptions" :key="opt" :value="opt">{{ opt }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">发货人</label>
                <a-select
                  v-model="query.shipper"
                  allow-clear
                  allow-search
                  size="small"
                  placeholder="请输入发货人"
                  @change="emit('search')"
                >
                  <a-option v-for="opt in shipperOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">收货人</label>
                <a-select
                  v-model="query.consignee"
                  allow-clear
                  allow-search
                  size="small"
                  placeholder="请输入收货人"
                  @change="emit('search')"
                >
                  <a-option v-for="opt in consigneeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">快捷标签</label>
                <a-select v-model="query.quickTag" allow-clear size="small" @change="emit('search')">
                  <a-option v-for="opt in quickTagOptions" :key="opt" :value="opt">{{ opt }}</a-option>
                </a-select>
              </div>
              <div class="filter-field filter-field--span2">
                <label class="filter-field__label">关键词</label>
                <a-input
                  v-model="query.keyword"
                  allow-clear
                  size="small"
                  placeholder="单号 / 客户 / 入仓单号"
                  @press-enter="emit('search')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-card__actions-col">
        <div class="filter-card__actions-primary">
          <a-button size="small" type="primary" @click="emit('search')">查询</a-button>
          <a-button size="small" type="text" class="reset-btn" @click="emit('reset')">重置</a-button>
        </div>
        <a-tooltip :content="expandTooltip" :disabled="!expandTooltip">
          <button type="button" class="filter-expand-link filter-expand-link--col" @click="toggleExpand">
            <icon-up v-if="filterExpanded" />
            <icon-down v-else />
            <span>{{ filterExpanded ? '收起' : `展开(+${ADVANCED_FILTER_COUNT})` }}</span>
            <a-badge
              v-if="!filterExpanded && hiddenAdvancedActive > 0"
              :count="hiddenAdvancedActive"
              :max-count="9"
              class="filter-expand-badge"
            />
          </button>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-expand-badge {
  margin-left: 2px;
}
</style>
