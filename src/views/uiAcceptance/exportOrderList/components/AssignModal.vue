<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { compactVerticalFormLabelStyle } from '@/design-system/formLayout';

const props = defineProps<{
  visible: boolean;
  count: number;
  operatorOptions: string[];
  submitting: boolean;
  submitError: string;
  onSubmit: (payload: { operator: string }) => Promise<boolean>;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const { t } = useI18n();
const labelStyle = compactVerticalFormLabelStyle;
const form = reactive({ operator: '' });
const error = ref('');

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

watch(() => props.visible, (visible) => {
  if (!visible) return;
  form.operator = '';
  error.value = '';
});

const beforeOk = async () => {
  error.value = form.operator ? '' : t('exportOrderList.modal.operatorRequired');
  if (error.value) return false;
  return props.onSubmit({ operator: form.operator });
};
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="t('exportOrderList.modal.assignTitle')"
    :width="480"
    :mask-closable="false"
    :ok-loading="submitting"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="beforeOk"
  >
    <a-alert v-if="submitError" type="error" class="modal-context-alert">{{ submitError }}</a-alert>
    <a-alert v-else type="info" class="modal-context-alert">
      {{ t('exportOrderList.modal.assignCopy', { count }) }}
    </a-alert>
    <a-form :model="form" layout="vertical" size="small" :label-col-style="labelStyle" class="detail-form">
      <a-form-item
        field="operator"
        :label="t('exportOrderList.modal.operator')"
        required
        :validate-status="error ? 'error' : undefined"
        :help="error"
      >
        <a-select
          v-model="form.operator"
          size="small"
          allow-search
          :placeholder="t('exportOrderList.modal.operatorPlaceholder')"
          @change="error = ''"
        >
          <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">{{ operator }}</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.modal-context-alert {
  margin-bottom: 16px;
}
</style>
