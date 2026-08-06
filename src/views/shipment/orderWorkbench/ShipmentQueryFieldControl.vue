<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BatchValueQuery from '@/components/workbench/BatchValueQuery.vue';
import { denseFormItemStyle } from '@/design-system/formLayout';
import type {
  ShipmentKeywordType,
  ShipmentOrderQuery,
} from '@/views/shipment/orderWorkbench/types';
import type { ShipmentQueryField } from '@/views/shipment/orderWorkbench/queryFields';

const props = defineProps<{
  field: ShipmentQueryField;
  model: ShipmentOrderQuery;
  operatorOptions: string[];
  carrierOptions: string[];
  dense?: boolean;
}>();

const emit = defineEmits<{
  (event: 'submit'): void;
  (event: 'date-popup-change', field: 'etd' | 'closing' | 'updated', value: boolean): void;
}>();

const { t } = useI18n();
const formItemStyle = computed(() => (props.dense ? denseFormItemStyle : undefined));
const keywordOptions: { key: string; value: ShipmentKeywordType }[] = [
  { key: 'orderNo', value: 'orderNo' },
  { key: 'blNo', value: 'blNo' },
  { key: 'bookingNo', value: 'bookingNo' },
];
const selectedKeywordLabel = computed(() => {
  const selected = keywordOptions.find((option) => option.value === props.model.keywordType) ?? keywordOptions[0];
  return t(`shipment.keywordTypes.${selected.key}`);
});
const businessTypes = ['FCL', 'LCL'];
const statusOptions = ['waitBooking', 'booking', 'released', 'waitTruck', 'trucking', 'waitCustoms', 'customs', 'sailed', 'completed'];
</script>

<template>
  <a-form-item v-if="field === 'keyword'" :label="t('shipment.queryFields.keyword')" :style="formItemStyle">
    <BatchValueQuery v-model="model.keyword" :label="selectedKeywordLabel" @submit="emit('submit')">
      <template #prefix>
        <a-select
          v-model="model.keywordType"
          size="small"
          :aria-label="t('shipment.queryFields.keyword')"
          :style="{ width: '116px' }"
        >
          <a-option v-for="option in keywordOptions" :key="option.value" :value="option.value">
            {{ t(`shipment.keywordTypes.${option.key}`) }}
          </a-option>
        </a-select>
      </template>
    </BatchValueQuery>
  </a-form-item>

  <a-form-item v-else-if="field === 'businessType'" field="businessType" :label="t('shipment.queryFields.businessType')" :style="formItemStyle">
    <a-select v-model="model.businessType" size="small" allow-clear :placeholder="t('shipment.placeholders.businessType')">
      <a-option v-for="businessType in businessTypes" :key="businessType" :value="businessType">{{ businessType }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'customerName'" field="customerName" :label="t('shipment.queryFields.customerName')" :style="formItemStyle">
    <a-input v-model="model.customerName" size="small" allow-clear :placeholder="t('shipment.placeholders.customer')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'operator'" field="operator" :label="t('shipment.queryFields.operator')" :style="formItemStyle">
    <a-select v-model="model.operator" size="small" allow-clear allow-search :placeholder="t('shipment.placeholders.operator')">
      <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">{{ operator }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'pol'" field="pol" :label="t('shipment.queryFields.pol')" :style="formItemStyle">
    <a-input v-model="model.pol" size="small" allow-clear :placeholder="t('shipment.advanced.portPlaceholder')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'pod'" field="pod" :label="t('shipment.queryFields.pod')" :style="formItemStyle">
    <a-input v-model="model.pod" size="small" allow-clear :placeholder="t('shipment.advanced.portPlaceholder')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'carrier'" field="carrier" :label="t('shipment.queryFields.carrier')" :style="formItemStyle">
    <a-select v-model="model.carrier" size="small" allow-clear allow-search :placeholder="t('shipment.advanced.carrierPlaceholder')">
      <a-option v-for="carrier in carrierOptions" :key="carrier" :value="carrier">{{ carrier }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'vesselVoyage'" field="vesselVoyage" :label="t('shipment.queryFields.vesselVoyage')" :style="formItemStyle">
    <a-input v-model="model.vesselVoyage" size="small" allow-clear :placeholder="t('shipment.advanced.vesselPlaceholder')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'blNo'" field="blNo" :label="t('shipment.queryFields.blNo')" :style="formItemStyle">
    <a-input v-model="model.blNo" size="small" allow-clear :placeholder="t('shipment.advanced.blPlaceholder')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'bookingNo'" field="bookingNo" :label="t('shipment.queryFields.bookingNo')" :style="formItemStyle">
    <a-input v-model="model.bookingNo" size="small" allow-clear :placeholder="t('shipment.advanced.bookingPlaceholder')" @press-enter="emit('submit')" />
  </a-form-item>

  <a-form-item v-else-if="field === 'etdRange'" field="etdRange" :label="t('shipment.queryFields.etdRange')" :style="formItemStyle">
    <a-range-picker v-model="model.etdRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'etd', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'closingRange'" field="closingRange" :label="t('shipment.queryFields.closingRange')" :style="formItemStyle">
    <a-range-picker v-model="model.closingRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'closing', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'updatedRange'" field="updatedRange" :label="t('shipment.queryFields.updatedRange')" :style="formItemStyle">
    <a-range-picker v-model="model.updatedRange" size="small" style="width: 100%" @popup-visible-change="emit('date-popup-change', 'updated', $event)" />
  </a-form-item>

  <a-form-item v-else-if="field === 'orderStatus'" field="orderStatus" :label="t('shipment.queryFields.orderStatus')" :style="formItemStyle">
    <a-select v-model="model.orderStatus" size="small" allow-clear :placeholder="t('shipment.advanced.select')">
      <a-option v-for="status in statusOptions" :key="status" :value="status">{{ t(`shipment.statuses.${status}`) }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'hasException'" field="hasException" :label="t('shipment.queryFields.hasException')" :style="formItemStyle">
    <a-radio-group v-model="model.hasException" type="button" size="small" class="query-field-choice">
      <a-radio value="">{{ t('shipment.advanced.all') }}</a-radio>
      <a-radio value="yes">{{ t('shipment.advanced.yes') }}</a-radio>
      <a-radio value="no">{{ t('shipment.advanced.no') }}</a-radio>
    </a-radio-group>
  </a-form-item>

  <a-form-item v-else-if="field === 'isOverdue'" field="isOverdue" :label="t('shipment.queryFields.isOverdue')" :style="formItemStyle">
    <a-radio-group v-model="model.isOverdue" type="button" size="small" class="query-field-choice">
      <a-radio value="">{{ t('shipment.advanced.all') }}</a-radio>
      <a-radio value="yes">{{ t('shipment.advanced.yes') }}</a-radio>
      <a-radio value="no">{{ t('shipment.advanced.no') }}</a-radio>
    </a-radio-group>
  </a-form-item>

  <a-form-item v-else-if="field === 'fileStatus'" field="fileStatus" :label="t('shipment.queryFields.fileStatus')" :style="formItemStyle">
    <a-select v-model="model.fileStatus" size="small" allow-clear :placeholder="t('shipment.advanced.select')">
      <a-option value="missing">{{ t('shipment.advanced.missing') }}</a-option>
      <a-option value="pending">{{ t('shipment.fileStatus.pending') }}</a-option>
      <a-option value="complete">{{ t('shipment.advanced.complete') }}</a-option>
    </a-select>
  </a-form-item>

  <a-form-item v-else-if="field === 'feeStatus'" field="feeStatus" :label="t('shipment.queryFields.feeStatus')" :style="formItemStyle">
    <a-select v-model="model.feeStatus" size="small" allow-clear :placeholder="t('shipment.advanced.select')">
      <a-option value="none">{{ t('shipment.feeStatus.none') }}</a-option>
      <a-option value="pending">{{ t('shipment.feeStatus.pending') }}</a-option>
      <a-option value="confirmed">{{ t('shipment.feeStatus.confirmed') }}</a-option>
    </a-select>
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
