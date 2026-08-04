<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { IconCloseCircle, IconEdit } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
  modelValue: string[];
  label: string;
  caseMode?: 'preserve' | 'upper' | 'lower';
  validateValue?: (value: string) => boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  submit: [];
}>();

const { t } = useI18n();
const MAX_IDENTIFIERS = 100;
const popupVisible = ref(false);
const draftText = ref('');
const preserveDraftOnOpen = ref(false);
const wrapperPairs: Array<[string, string]> = [['"', '"'], ["'", "'"], ['`', '`'], ['“', '”'], ['‘', '’']];

const normalizeValue = (value: string) => {
  const normalized = value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/gu, '')
    .trim();
  const wrapper = wrapperPairs.find(([start, end]) => normalized.startsWith(start) && normalized.endsWith(end));
  const unquoted = wrapper ? normalized.slice(wrapper[0].length, -wrapper[1].length).trim() : normalized;
  if (props.caseMode === 'upper') return unquoted.toUpperCase();
  if (props.caseMode === 'lower') return unquoted.toLowerCase();
  return unquoted;
};

const parseValues = (source: string) => {
  const tokens = source
    .normalize('NFKC')
    .split(/[\s,;，；、]+/u)
    .map(normalizeValue)
    .filter(Boolean);
  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  let duplicateCount = 0;

  for (const token of tokens) {
    if (props.validateValue && !props.validateValue(token)) {
      invalid.push(token);
      continue;
    }
    if (seen.has(token)) {
      duplicateCount += 1;
      continue;
    }
    seen.add(token);
    valid.push(token);
  }

  return { valid, invalid, duplicateCount };
};

const parsedDraft = computed(() => parseValues(draftText.value));

const overLimit = computed(() => parsedDraft.value.valid.length > MAX_IDENTIFIERS);
const canApply = computed(() => !parsedDraft.value.invalid.length && !overLimit.value);
const displayValue = computed(() => props.modelValue.join(', '));

const handleDirectInput = (value: string) => {
  emit('update:modelValue', value ? [value] : []);
};

const handlePaste = (event: ClipboardEvent) => {
  const source = event.clipboardData?.getData('text') ?? '';
  const parsed = parseValues(source);
  const tokenCount = parsed.valid.length + parsed.invalid.length + parsed.duplicateCount;
  event.preventDefault();
  draftText.value = source;
  if (parsed.invalid.length || parsed.valid.length > MAX_IDENTIFIERS) {
    preserveDraftOnOpen.value = true;
    popupVisible.value = true;
    return;
  }
  emit('update:modelValue', parsed.valid);
  if (tokenCount > 1) {
    Message.info(parsed.duplicateCount
      ? t('queryScenario.batch.pasteAcceptedWithDuplicates', { count: parsed.valid.length, duplicate: parsed.duplicateCount })
      : t('queryScenario.batch.pasteAccepted', { count: parsed.valid.length }));
  }
};

const commitDirectValue = (submit: boolean) => {
  if (props.modelValue.length > 1) {
    if (submit) emit('submit');
    return;
  }
  const source = props.modelValue[0] ?? '';
  if (!source) {
    if (submit) emit('submit');
    return;
  }
  const parsed = parseValues(source);
  if (parsed.invalid.length || parsed.valid.length !== 1) {
    draftText.value = source;
    preserveDraftOnOpen.value = true;
    popupVisible.value = true;
    return;
  }
  emit('update:modelValue', parsed.valid);
  if (submit) emit('submit');
};

const clearValue = () => {
  draftText.value = '';
  popupVisible.value = false;
  emit('update:modelValue', []);
};

const handleVisibleChange = (visible: boolean) => {
  popupVisible.value = visible;
  if (visible && !preserveDraftOnOpen.value) draftText.value = props.modelValue.join('\n');
  preserveDraftOnOpen.value = false;
};

const applyDraft = () => {
  if (!canApply.value) return;
  emit('update:modelValue', parsedDraft.value.valid);
  popupVisible.value = false;
};
</script>

<template>
  <a-input-group class="batch-query-control">
    <a-input
      :model-value="displayValue"
      size="small"
      :readonly="modelValue.length > 1"
      :placeholder="t('queryScenario.batch.placeholder')"
      :aria-label="label"
      @input="handleDirectInput"
      @paste="handlePaste"
      @blur="commitDirectValue(false)"
      @press-enter="commitDirectValue(true)"
    >
    </a-input>
    <a-tooltip v-if="modelValue.length" :content="t('queryScenario.batch.clearValues', { field: label })">
      <a-button
        size="small"
        :aria-label="t('queryScenario.batch.clearValues', { field: label })"
        @click="clearValue"
      ><icon-close-circle /></a-button>
    </a-tooltip>
    <a-popover
      :popup-visible="popupVisible"
      trigger="click"
      position="bl"
      :content-style="{ width: 'min(360px, calc(100vw - 32px))' }"
      @popup-visible-change="handleVisibleChange"
    >
      <a-tooltip :content="t('queryScenario.batch.open', { field: label })">
        <a-badge :count="modelValue.length > 1 ? modelValue.length : 0" :max-count="99" :offset="[-2, 2]">
          <a-button
            size="small"
            :aria-label="modelValue.length > 1
              ? t('queryScenario.batch.openWithCount', { field: label, count: modelValue.length })
              : t('queryScenario.batch.open', { field: label })"
          ><icon-edit /></a-button>
        </a-badge>
      </a-tooltip>
      <template #title>{{ t('queryScenario.batch.title', { field: label }) }}</template>
      <template #content>
        <div class="batch-query-editor">
          <a-textarea
            v-model="draftText"
            class="batch-query-editor__input"
            :auto-size="{ minRows: 5, maxRows: 8 }"
            :placeholder="t('queryScenario.batch.editorPlaceholder')"
          />
          <div class="batch-query-editor__stats" aria-live="polite">
            {{ t('queryScenario.batch.stats', {
              valid: parsedDraft.valid.length,
              duplicate: parsedDraft.duplicateCount,
              invalid: parsedDraft.invalid.length,
            }) }}
          </div>
          <div v-if="parsedDraft.invalid.length" class="batch-query-editor__error">
            {{ t('queryScenario.batch.invalid', { values: parsedDraft.invalid.slice(0, 3).join(', ') }) }}
          </div>
          <div v-else-if="overLimit" class="batch-query-editor__error">
            {{ t('queryScenario.batch.overLimit', { max: MAX_IDENTIFIERS }) }}
          </div>
          <div class="batch-query-editor__footer">
            <a-button size="small" type="text" @click="draftText = ''">{{ t('common.clear') }}</a-button>
            <div class="batch-query-editor__commands">
              <a-button size="small" @click="popupVisible = false">{{ t('common.cancel') }}</a-button>
              <a-button size="small" type="primary" :disabled="!canApply" @click="applyDraft">
                {{ t('queryScenario.batch.useValues') }}
              </a-button>
            </div>
          </div>
        </div>
      </template>
    </a-popover>
  </a-input-group>
</template>

<style scoped>
.batch-query-control {
  width: 100%;
}

.batch-query-editor {
  display: grid;
  gap: 8px;
}

.batch-query-editor__input {
  width: 100%;
}

.batch-query-editor__stats {
  color: var(--color-text-2);
  font-size: var(--dense-font-aux);
  font-variant-numeric: tabular-nums;
}

.batch-query-editor__error {
  color: var(--dense-danger-6);
  font-size: var(--dense-font-aux);
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.batch-query-editor__footer,
.batch-query-editor__commands {
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-query-editor__footer {
  justify-content: space-between;
}
</style>
