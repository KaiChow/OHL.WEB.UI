<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { compactVerticalFormLabelStyle } from '@/design-system/formLayout';
import type { ExportExceptionLevel } from '@/views/uiAcceptance/exportOrderList/types';

export interface ExceptionFormPayload {
  type: string;
  level: ExportExceptionLevel;
  description: string;
  owner: string;
  deadline: string;
}

const props = defineProps<{
  visible: boolean;
  count: number;
  operatorOptions: string[];
  submitting: boolean;
  submitError: string;
  onSubmit: (payload: ExceptionFormPayload) => Promise<boolean>;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const { t } = useI18n();
const labelStyle = compactVerticalFormLabelStyle;
const exceptionTypes = ['customs', 'trucking', 'vessel', 'document', 'fee', 'other'];
const exceptionLevels: ExportExceptionLevel[] = ['low', 'medium', 'high', 'critical'];

const blankForm = (): ExceptionFormPayload => ({
  type: '',
  level: 'medium',
  description: '',
  owner: '',
  deadline: '',
});

const form = reactive<ExceptionFormPayload>(blankForm());
const errors = reactive({ type: '', description: '', owner: '', deadline: '' });

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

watch(() => props.visible, (visible) => {
  if (!visible) return;
  Object.assign(form, blankForm());
  errors.type = '';
  errors.description = '';
  errors.owner = '';
  errors.deadline = '';
});

const beforeOk = async () => {
  errors.type = form.type ? '' : t('exportOrderList.advanced.select');
  errors.description = form.description.trim() ? '' : t('exportOrderList.messages.reasonRequired');
  errors.owner = form.owner ? '' : t('exportOrderList.modal.operatorRequired');
  errors.deadline = form.deadline ? '' : t('exportOrderList.advanced.select');
  if (errors.type || errors.description || errors.owner || errors.deadline) return false;
  return props.onSubmit({
    type: form.type,
    level: form.level,
    description: form.description.trim(),
    owner: form.owner,
    deadline: form.deadline,
  });
};
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="t('exportOrderList.modal.exceptionTitle')"
    :width="640"
    :mask-closable="false"
    :ok-loading="submitting"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    :on-before-ok="beforeOk"
  >
    <a-alert v-if="submitError" type="error" class="modal-context-alert">{{ submitError }}</a-alert>
    <a-form :model="form" layout="vertical" size="small" :label-col-style="labelStyle" class="detail-form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            :label="t('exportOrderList.modal.exceptionType')"
            field="type"
            required
            :validate-status="errors.type ? 'error' : undefined"
            :help="errors.type"
          >
            <a-select v-model="form.type" size="small" allow-clear :placeholder="t('exportOrderList.advanced.select')" @change="errors.type = ''">
              <a-option v-for="type in exceptionTypes" :key="type" :value="type">{{ t(`exportOrderList.exceptionTypes.${type}`) }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('exportOrderList.modal.exceptionLevel')" field="level" required>
            <a-radio-group v-model="form.level" type="button" size="small">
              <a-radio v-for="level in exceptionLevels" :key="level" :value="level">{{ t(`exportOrderList.exceptionLevels.${level}`) }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            :label="t('exportOrderList.modal.exceptionDesc')"
            field="description"
            required
            :validate-status="errors.description ? 'error' : undefined"
            :help="errors.description"
          >
            <a-textarea
              v-model="form.description"
              size="small"
              :auto-size="{ minRows: 2, maxRows: 4 }"
              :placeholder="t('exportOrderList.modal.exceptionDescPlaceholder')"
              @input="errors.description = ''"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="t('exportOrderList.modal.exceptionOwner')"
            field="owner"
            required
            :validate-status="errors.owner ? 'error' : undefined"
            :help="errors.owner"
          >
            <a-select v-model="form.owner" size="small" allow-search allow-clear :placeholder="t('exportOrderList.modal.exceptionOwnerPlaceholder')" @change="errors.owner = ''">
              <a-option v-for="operator in operatorOptions" :key="operator" :value="operator">{{ operator }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="t('exportOrderList.modal.exceptionDeadline')"
            field="deadline"
            required
            :validate-status="errors.deadline ? 'error' : undefined"
            :help="errors.deadline"
          >
            <a-date-picker v-model="form.deadline" size="small" style="width: 100%" @change="errors.deadline = ''" />
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
