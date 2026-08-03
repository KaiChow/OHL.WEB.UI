<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { compactVerticalFormLabelStyle } from '../../../../design-system/formLayout';
import type { ProfitReviewRow } from '../types';
import { REVIEW_STATUS_META } from '../displayMeta';

const props = defineProps<{
  visible: boolean;
  row: ProfitReviewRow | null;
  submitting: boolean;
  serverError: string;
  ownerOptions: string[];
}>();
const { t } = useI18n();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [payload: { reviewNote: string; owner: string }];
}>();

const drawerVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const draft = reactive({ reviewNote: '', owner: undefined as string | undefined });
const errors = reactive({ reviewNote: '', owner: '' });

const statusMeta = computed(() => (props.row ? REVIEW_STATUS_META[props.row.reviewStatus] : null));

watch(() => props.visible, (visible) => {
  if (!visible || !props.row) return;
  draft.reviewNote = props.row.reviewNote;
  draft.owner = props.row.owner;
  errors.reviewNote = '';
  errors.owner = '';
});

const handleSubmit = () => {
  if (props.submitting) return;
  errors.reviewNote = draft.reviewNote.trim() ? '' : t('profit.form.noteRequired');
  errors.owner = draft.owner ? '' : t('profit.form.ownerRequired');
  if (errors.reviewNote || errors.owner || !draft.owner) return;
  emit('submit', { reviewNote: draft.reviewNote.trim(), owner: draft.owner });
};

const handleCancel = () => {
  if (props.submitting) return;
  emit('update:visible', false);
};
</script>

<template>
  <a-drawer
    v-model:visible="drawerVisible"
    width="min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-viewport-pad)))"
    :mask-closable="false"
    :closable="!submitting"
    unmount-on-close
    @cancel="handleCancel"
  >
    <template #title>{{ t('profit.form.title') }}</template>
    <div v-if="row && statusMeta" class="edit-body">
      <div class="edit-context">
        <span class="edit-context__identity mono">{{ row.orderNo }}</span>
        <span class="s-pill" :data-s="statusMeta.tone">{{ t(`profit.status.${row.reviewStatus}`) }}</span>
        <span class="edit-context__meta">{{ row.customer }}</span>
      </div>
      <a-alert v-if="serverError" type="error" class="edit-server-error">{{ serverError }}</a-alert>
      <a-form layout="vertical" size="small" :label-col-style="compactVerticalFormLabelStyle" class="edit-form">
        <a-row :gutter="[16, 0]">
          <a-col :span="12">
            <a-form-item
              :label="t('profit.form.owner')"
              required
              :validate-status="errors.owner ? 'error' : undefined"
              :help="errors.owner"
            >
              <a-select
                v-model="draft.owner"
                size="small"
                allow-search
                :placeholder="t('profit.form.ownerPlaceholder')"
                @change="errors.owner = ''"
              >
                <a-option v-for="owner in ownerOptions" :key="owner" :value="owner">{{ owner }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              :label="t('profit.form.note')"
              required
              :validate-status="errors.reviewNote ? 'error' : undefined"
              :help="errors.reviewNote"
            >
              <a-textarea
                v-model="draft.reviewNote"
                size="small"
                :auto-size="{ minRows: 3, maxRows: 6 }"
                :max-length="200"
                show-word-limit
                :placeholder="t('profit.form.notePlaceholder')"
                @input="errors.reviewNote = ''"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <template #footer>
      <div class="form-drawer-footer">
        <a-button size="small" :disabled="submitting" @click="handleCancel">{{ t('common.cancel') }}</a-button>
        <a-button size="small" type="primary" :loading="submitting" @click="handleSubmit">{{ t('common.save') }}</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped>
.edit-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.edit-context {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  margin-bottom: 12px;
}

.edit-context__identity {
  color: var(--color-text-1);
  font-size: var(--dense-font-hero);
  font-weight: var(--dense-weight-title);
  line-height: 22px;
}

.edit-context__meta {
  color: var(--color-text-2);
  font-size: var(--dense-font-data);
}

.edit-server-error {
  margin-bottom: 12px;
}

.edit-form {
  width: 100%;
  min-width: 0;
}

.form-drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}
</style>
