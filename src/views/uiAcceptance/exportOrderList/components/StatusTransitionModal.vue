<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { compactVerticalFormLabelStyle } from '@/design-system/formLayout';
import { getExportStatusTransitions } from '@/views/uiAcceptance/exportOrderList/orderFlow';
import type { ExportStatusTransition } from '@/views/uiAcceptance/exportOrderList/orderFlow';
import type { ExportOrderRow, ExportOrderStatusKey } from '@/views/uiAcceptance/exportOrderList/types';

const props = defineProps<{
  visible: boolean;
  rows: ExportOrderRow[];
  submitting: boolean;
  submitError: string;
  onSubmit: (payload: { targetStatus: ExportOrderStatusKey; reason: string }) => Promise<boolean>;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const { t } = useI18n();
const labelStyle = compactVerticalFormLabelStyle;
const form = reactive({ targetStatus: undefined as ExportOrderStatusKey | undefined, reason: '' });
const errors = reactive({ targetStatus: '', reason: '' });

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const transitionOptions = computed<ExportStatusTransition[]>(() => {
  const rows = props.rows;
  if (!rows.length) return [];
  if (rows.length === 1) return getExportStatusTransitions(rows[0]);
  const merged = new Map<ExportOrderStatusKey, ExportStatusTransition>();
  rows.forEach((row) => {
    getExportStatusTransitions(row).forEach((transition) => {
      if (!merged.has(transition.value)) merged.set(transition.value, transition);
    });
  });
  return Array.from(merged.values());
});

const isCancelTarget = computed(() => form.targetStatus === 'cancelled');
const singleRow = computed(() => (props.rows.length === 1 ? props.rows[0] : null));

watch(() => props.visible, (visible) => {
  if (!visible) return;
  form.targetStatus = undefined;
  form.reason = '';
  errors.targetStatus = '';
  errors.reason = '';
});

const beforeOk = async () => {
  errors.targetStatus = form.targetStatus ? '' : t('exportOrderList.messages.targetRequired');
  errors.reason = form.reason.trim() ? '' : t('exportOrderList.messages.reasonRequired');
  if (errors.targetStatus || errors.reason || !form.targetStatus) return false;
  return props.onSubmit({ targetStatus: form.targetStatus, reason: form.reason.trim() });
};
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="t('exportOrderList.modal.statusTitle')"
    :width="560"
    :mask-closable="false"
    :ok-loading="submitting"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="beforeOk"
  >
    <a-alert v-if="submitError" type="error" class="modal-context-alert">{{ submitError }}</a-alert>
    <a-alert v-if="isCancelTarget" type="warning" class="modal-context-alert">
      {{ t('exportOrderList.modal.cancelConfirmCopy', { orderNo: singleRow?.orderNo ?? String(rows.length) }) }}
    </a-alert>
    <a-form :model="form" layout="vertical" size="small" :label-col-style="labelStyle" class="detail-form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('exportOrderList.modal.currentStatus')">
            <span v-if="singleRow">{{ t(`exportOrderList.statuses.${singleRow.orderStatus}`) }}</span>
            <span v-else>{{ t('common.selected', { count: rows.length }) }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="t('exportOrderList.modal.targetStatus')"
            field="targetStatus"
            required
            :validate-status="errors.targetStatus ? 'error' : undefined"
            :help="errors.targetStatus"
          >
            <a-select
              v-model="form.targetStatus"
              size="small"
              allow-clear
              :placeholder="t('exportOrderList.advanced.select')"
              @change="errors.targetStatus = ''"
            >
              <a-option v-for="option in transitionOptions" :key="option.value" :value="option.value">
                {{ t(`exportOrderList.statuses.${option.value}`) }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            :label="t('exportOrderList.modal.reason')"
            field="reason"
            required
            :validate-status="errors.reason ? 'error' : undefined"
            :help="errors.reason"
          >
            <a-textarea
              v-model="form.reason"
              size="small"
              :auto-size="{ minRows: 2, maxRows: 4 }"
              :placeholder="t('exportOrderList.modal.reasonPlaceholder')"
              @input="errors.reason = ''"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style scoped>
.modal-context-alert {
  margin-bottom: 16px;
}
</style>
