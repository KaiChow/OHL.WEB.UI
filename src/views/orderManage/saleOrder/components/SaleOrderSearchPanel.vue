<script setup lang="ts">
import { IconRefresh, IconSearch } from '@arco-design/web-vue/es/icon';
import { quickSearchFields, simpleSelectOptions, transportTabs } from '../config';
import type { QuickSearchField, TransportType } from '../types';

defineProps<{
  activeAdvancedCount: number;
}>();

const keyword = defineModel<string>('keyword', { required: true });
const quickSearchField = defineModel<QuickSearchField>('quickSearchField', { required: true });
const businessType = defineModel<string>('businessType', { required: true });
const importExportType = defineModel<string>('importExportType', { required: true });
const salesmanKeyword = defineModel<string>('salesmanKeyword', { required: true });
const operatorKeyword = defineModel<string>('operatorKeyword', { required: true });
const customerServiceKeyword = defineModel<string>('customerServiceKeyword', { required: true });
const serviceOrderNo = defineModel<string>('serviceOrderNo', { required: true });
const loadingType = defineModel<string>('loadingType', { required: true });
const shipperKeyword = defineModel<string>('shipperKeyword', { required: true });
const consigneeKeyword = defineModel<string>('consigneeKeyword', { required: true });
const quickTag = defineModel<string>('quickTag', { required: true });
const mergeCells = defineModel<boolean>('mergeCells', { required: true });
const activeTransport = defineModel<TransportType>('activeTransport', { required: true });

defineEmits<{
  search: [];
  reset: [];
  openAdvanced: [];
}>();
</script>

<template>
  <section class="toolbar query-panel sale-order-search">
    <div class="sale-order-search__top">
      <div class="transport-tabs">
        <button
          v-for="tab in transportTabs"
          :key="tab.value"
          class="transport-tab"
          :class="{ 'transport-tab--active': activeTransport === tab.value }"
          type="button"
          @click="activeTransport = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="query-merge-toggle">
        <span>合并单元格</span>
        <a-switch v-model="mergeCells" size="small" />
      </div>
    </div>

    <div class="sale-order-query-grid">
      <div class="query-field query-field--search">
        <a-select v-model="quickSearchField" class="query-type-select" size="small" :options="quickSearchFields" />
        <a-input v-model="keyword" size="small" allow-clear placeholder="请输入">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
      </div>

      <label class="query-field">
        <span>业务类型</span>
        <a-select
          v-model="businessType"
          size="small"
          allow-clear
          placeholder="请选择业务类型"
          :options="simpleSelectOptions.businessType"
        />
      </label>

      <label class="query-field">
        <span>进/出口单</span>
        <a-select
          v-model="importExportType"
          size="small"
          allow-clear
          placeholder="请选择进/出口单类型"
          :options="simpleSelectOptions.orderType"
        />
      </label>

      <label class="query-field">
        <span>业务员</span>
        <a-input v-model="salesmanKeyword" size="small" allow-clear placeholder="请输入业务员" />
      </label>

      <label class="query-field">
        <span>操作员</span>
        <a-input v-model="operatorKeyword" size="small" allow-clear placeholder="请输入操作员" />
      </label>

      <label class="query-field">
        <span>装箱方式</span>
        <a-select
          v-model="loadingType"
          size="small"
          allow-clear
          placeholder="请选择装箱方式"
          :options="simpleSelectOptions.loadingType"
        />
      </label>

      <div class="query-actions sale-order-query-actions">
        <a-button size="small" type="primary" @click="$emit('search')">
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>

        <a-button size="small" @click="$emit('reset')">
          <template #icon>
            <icon-refresh />
          </template>
          重置
        </a-button>

        <a-button size="small" type="text" @click="$emit('openAdvanced')">
          更多
          <a-badge v-if="activeAdvancedCount" :count="activeAdvancedCount" />
        </a-button>
      </div>
    </div>
  </section>
</template>
