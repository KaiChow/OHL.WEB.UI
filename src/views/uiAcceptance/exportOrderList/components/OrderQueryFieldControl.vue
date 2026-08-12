<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BatchValueQuery from '@/components/workbench/BatchValueQuery.vue';
import { denseFormItemStyle } from '@/design-system/formLayout';
import { EXPORT_ORDER_STATUSES } from '@/views/uiAcceptance/exportOrderList/orderFlow';
import type { ExportOrderQuery } from '@/views/uiAcceptance/exportOrderList/types';
import type { ExportQueryField } from '@/views/uiAcceptance/exportOrderList/queryFields';

const props = defineProps<{
  field: ExportQueryField;
  model: ExportOrderQuery;
  operatorOptions: string[];
  carrierOptions: string[];
  portOptions: { code: string; name: string }[];
  dense?: boolean;
}>();

const emit = defineEmits<{
  (event: 'submit'): void;
  (event: 'date-popup-change', field: 'etd' | 'closing' | 'created' | 'updated', value: boolean): void;
}>();

const { t } = useI18n();
const formItemStyle = computed(() => (props.dense ? denseFormItemStyle : undefined));
const statusOptions = EXPORT_ORDER_STATUSES;
const businessTypes = ['FCL', 'LCL', 'AIR', 'RAIL'];
const portSelectOptions = computed(() => props.portOptions.map((port) => ({
  value: port.code,
  label: `${port.code} · ${port.name}`,
})));
</script>

<template>
  <a-form-item v-if="field === 'keyword'" :label="t('exportOrderList.queryFields.keyword')" :style="formItemStyle">
    <BatchValueQuery
      v-model="model.keyword"
      :label="t('exportOrderList.queryFields.keyword')"
      @submit="emit('submit')"
    />
  </a-form-item>

  <a-form-item v-else-if="field === 'customerName'" field="customerName" :label="t('exportOrderList.queryFields.customerName')" :style="formItemStyle">
    <a-input v-model="model.customerName" size="small" allow-clear :placeholder="t('exportOrderList.placeholders.customerName')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'pol'" field="pol" :label="t('exportOrderList.queryFields.pol')" :style="formItemStyle">
    <a-select
      v-model="model.pol"
      size="small"
      allow-clear
      allow-search
      :options="portSelectOptions"
      :placeholder="t('exportOrderList.placeholders.port')"
    />
  </a-form-item>

  <a-form-item v-else-if="field === 'pod'" field="pod" :label="t('exportOrderList.queryFields.pod')" :style="formItemStyle">
    <a-select
      v-model="model.pod"
      size="small"
      allow-clear
      allow-search
      :options="portSelectOptions"
      :placeholder="t('exportOrderList.placeholders.port')"
    />
  </a-form-item>

  <a-form-item v-else-if="field === 'orderStatus'" field="orderStatus" :label="t('exportOrderList.queryFields.orderStatus')" :style="formItemStyle">
    <a-select v-model="model.orderStatus" size="small" multiple allow-clear allow-search :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.multi')">
      <a-option v-for="status in statusOptions" :key="status" :value="status">{{ t(`exportOrderList.statuses.${status}`) }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'exceptionStatus'" field="exceptionStatus" :label="t('exportOrderList.queryFields.exceptionStatus')" :style="formItemStyle">
    <a-select v-model="model.exceptionStatus" size="small" multiple allow-clear :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.multi')">
      <a-option value="normal">{{ t('exportOrderList.exceptionStatus.normal') }}</a-option>
      <a-option value="open">{{ t('exportOrderList.exceptionStatus.open') }}</a-option>
      <a-option value="resolved">{{ t('exportOrderList.exceptionStatus.resolved') }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'fileStatus'" field="fileStatus" :label="t('exportOrderList.queryFields.fileStatus')" :style="formItemStyle">
    <a-select v-model="model.fileStatus" size="small" multiple allow-clear :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.multi')">
      <a-option value="complete">{{ t('exportOrderList.fileStatus.complete') }}</a-option>
      <a-option value="missing">{{ t('exportOrderList.fileStatus.missing') }}</a-option>
      <a-option value="pending">{{ t('exportOrderList.fileStatus.pending') }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'feeStatus'" field="feeStatus" :label="t('exportOrderList.queryFields.feeStatus')" :style="formItemStyle">
    <a-select v-model="model.feeStatus" size="small" multiple allow-clear :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.multi')">
      <a-option value="none">{{ t('exportOrderList.feeStatus.none') }}</a-option>
      <a-option value="pending">{{ t('exportOrderList.feeStatus.pending') }}</a-option>
      <a-option value="confirmed">{{ t('exportOrderList.feeStatus.confirmed') }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'businessType'" field="businessType" :label="t('exportOrderList.queryFields.businessType')" :style="formItemStyle">
    <a-select v-model="model.businessType" size="small" multiple allow-clear :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.multi')">
      <a-option v-for="businessType in businessTypes" :key="businessType" :value="businessType">{{ businessType }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'operator'" field="operator" :label="t('exportOrderList.queryFields.operator')" :style="formItemStyle">
    <a-select v-model="model.operator" size="small" multiple allow-clear allow-search :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.multi')">
      <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">{{ operator }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'carrier'" field="carrier" :label="t('exportOrderList.queryFields.carrier')" :style="formItemStyle">
    <a-select v-model="model.carrier" size="small" multiple allow-clear allow-search :max-tag-count="2" :placeholder="t('exportOrderList.placeholders.carrier')">
      <a-option v-for="carrier in carrierOptions" :key="carrier" :value="carrier">{{ carrier }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'vesselVoyage'" field="vesselVoyage" :label="t('exportOrderList.queryFields.vesselVoyage')" :style="formItemStyle">
    <a-input v-model="model.vesselVoyage" size="small" allow-clear :placeholder="t('exportOrderList.placeholders.vessel')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'etdRange'" field="etdRange" :label="t('exportOrderList.queryFields.etdRange')" :style="formItemStyle">
    <a-range-picker v-model="model.etdRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'etd', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'closingRange'" field="closingRange" :label="t('exportOrderList.queryFields.closingRange')" :style="formItemStyle">
    <a-range-picker v-model="model.closingRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'closing', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'createdRange'" field="createdRange" :label="t('exportOrderList.queryFields.createdRange')" :style="formItemStyle">
    <a-range-picker v-model="model.createdRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'created', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'updatedRange'" field="updatedRange" :label="t('exportOrderList.queryFields.updatedRange')" :style="formItemStyle">
    <a-range-picker v-model="model.updatedRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'updated', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'hasException'" field="hasException" :label="t('exportOrderList.queryFields.hasException')" :style="formItemStyle">
    <a-radio-group v-model="model.hasException" type="button" size="small" class="query-field-choice">
      <a-radio value="">{{ t('exportOrderList.advanced.all') }}</a-radio>
      <a-radio value="yes">{{ t('exportOrderList.advanced.yes') }}</a-radio>
      <a-radio value="no">{{ t('exportOrderList.advanced.no') }}</a-radio>
    </a-radio-group>
  </a-form-item>

  <a-form-item v-else-if="field === 'isOverdue'" field="isOverdue" :label="t('exportOrderList.queryFields.isOverdue')" :style="formItemStyle">
    <a-radio-group v-model="model.isOverdue" type="button" size="small" class="query-field-choice">
      <a-radio value="">{{ t('exportOrderList.advanced.all') }}</a-radio>
      <a-radio value="yes">{{ t('exportOrderList.advanced.yes') }}</a-radio>
      <a-radio value="no">{{ t('exportOrderList.advanced.no') }}</a-radio>
    </a-radio-group>
  </a-form-item>
</template>

<style scoped>
.query-field-choice {
  display: flex;
  width: 100%;
}

.query-field-choice :deep(.arco-radio-button) {
  flex: 1;
  text-align: center;
}
</style>
