<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BatchValueQuery from '../../../../components/workbench/BatchValueQuery.vue';
import type { ScenarioField } from '../scenarioFields';

const props = defineProps<{
  field: ScenarioField;
  modelValue?: string | string[];
  keywordType?: string;
}>();

const { t } = useI18n();
const fieldLabel = computed(() => t(`queryScenario.fields.${props.field.key}`));

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]];
  'update:keywordType': [value: string];
  submit: [];
}>();

const textValue = computed({
  get: () => typeof props.modelValue === 'string' ? props.modelValue : '',
  set: (value: string) => emit('update:modelValue', value),
});

const rangeValue = computed({
  get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
  set: (value: string[]) => emit('update:modelValue', value),
});

const keywordTypeValue = computed({
  get: () => props.keywordType ?? 'orderNo',
  set: (value: string) => emit('update:keywordType', value),
});
</script>

<template>
  <a-form-item :label="fieldLabel">
    <a-input-group v-if="field.kind === 'composite'">
      <a-select v-model="keywordTypeValue" size="small" :style="{ width: '104px' }">
        <a-option value="orderNo">{{ t('queryScenario.keywordType') }}</a-option>
        <a-option value="hblNo">HBL</a-option>
        <a-option value="mblNo">MBL</a-option>
      </a-select>
      <a-input v-model="textValue" size="small" allow-clear :placeholder="t('queryScenario.inputNumber')" @press-enter="emit('submit')" />
    </a-input-group>
    <a-range-picker v-else-if="field.kind === 'range'" v-model="rangeValue" size="small" style="width: 100%" />
    <BatchValueQuery v-else-if="field.kind === 'batch'" v-model="rangeValue" :label="fieldLabel" @submit="emit('submit')" />
    <a-select v-else-if="field.kind === 'select'" v-model="textValue" size="small" allow-clear :placeholder="t('queryScenario.all')">
      <a-option value="option-a">{{ t('queryScenario.optionA') }}</a-option>
      <a-option value="option-b">{{ t('queryScenario.optionB') }}</a-option>
      <a-option value="option-c">{{ t('queryScenario.optionC') }}</a-option>
    </a-select>
    <a-input v-else v-model="textValue" size="small" allow-clear :placeholder="t('queryScenario.inputField', { label: fieldLabel })" @press-enter="emit('submit')" />
  </a-form-item>
</template>
