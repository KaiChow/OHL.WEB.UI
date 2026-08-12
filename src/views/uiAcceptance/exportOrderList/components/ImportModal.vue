<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { IconDownload, IconUpload } from '@arco-design/web-vue/es/icon';
import { stableTableRowConfig } from '@/design-system/tableConfig';
import { downloadCsvFile } from '@/utils/mock-actions';

export interface ImportParsedRow {
  lineNo: number;
  orderNo: string;
  customerName: string;
  businessType: string;
  pol: string;
  pod: string;
  etd: string;
  errors: string[];
}

export interface ImportResult {
  success: number;
  failures: { orderNo: string; reason: string }[];
}

const props = defineProps<{
  visible: boolean;
  existingOrderNos: string[];
  knownCustomers: string[];
  knownPorts: string[];
  restrictedCustomers: string[];
  importing: boolean;
  onImport: (rows: ImportParsedRow[]) => Promise<ImportResult>;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const { t } = useI18n();
const rowConfig = stableTableRowConfig;

const step = ref(0);
const activeTab = ref<'upload' | 'paste'>('upload');
const pasteText = ref('');
const fileName = ref('');
const fileText = ref('');
const fileInputRef = ref<HTMLInputElement>();
const parsedRows = ref<ImportParsedRow[]>([]);
const parseError = ref('');
const importResult = ref<ImportResult | null>(null);
const lastFailedRows = ref<ImportParsedRow[]>([]);

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const stepCurrent = computed(() => (step.value === 0 ? 0 : step.value === 1 ? 2 : 3));
const validRows = computed(() => parsedRows.value.filter((row) => !row.errors.length));
const invalidRows = computed(() => parsedRows.value.filter((row) => row.errors.length));
const canParse = computed(() => Boolean(fileText.value.trim() || pasteText.value.trim()));

const resetWizard = () => {
  step.value = 0;
  activeTab.value = 'upload';
  pasteText.value = '';
  fileName.value = '';
  fileText.value = '';
  parsedRows.value = [];
  parseError.value = '';
  importResult.value = null;
  lastFailedRows.value = [];
};

watch(() => props.visible, (visible) => {
  if (visible) resetWizard();
});

const downloadTemplate = () => {
  downloadCsvFile(
    t('exportOrderList.importTask.templateFile'),
    ['orderNo', 'customerName', 'businessType', 'pol', 'pod', 'etd'],
    [['SO202608129001', props.knownCustomers[0] ?? '', 'FCL', 'CNSHA', 'USLAX', '2026-08-20']],
  );
};

const pickFile = () => fileInputRef.value?.click();

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  fileName.value = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    fileText.value = String(reader.result ?? '');
  };
  reader.readAsText(file);
};

const validateRow = (row: ImportParsedRow, seenOrderNos: Set<string>) => {
  const missing = (['orderNo', 'customerName', 'pol', 'pod'] as const).filter((field) => !row[field].trim());
  if (missing.length) {
    row.errors.push(t('exportOrderList.importTask.reasons.required', { fields: missing.join(', ') }));
  }
  if (row.etd && !/^\d{4}-\d{2}-\d{2}$/.test(row.etd.trim())) {
    row.errors.push(t('exportOrderList.importTask.reasons.dateFormat', { fields: 'etd' }));
  }
  if (row.customerName && !props.knownCustomers.includes(row.customerName.trim())) {
    row.errors.push(t('exportOrderList.importTask.reasons.customer', { value: row.customerName }));
  }
  if (row.customerName && props.restrictedCustomers.includes(row.customerName.trim())) {
    row.errors.push(t('exportOrderList.importTask.reasons.permission', { value: row.customerName }));
  }
  const unknownPorts = [row.pol, row.pod].filter((port) => port.trim() && !props.knownPorts.includes(port.trim()));
  if (unknownPorts.length) {
    row.errors.push(t('exportOrderList.importTask.reasons.port', { value: unknownPorts.join(', ') }));
  }
  if (row.orderNo.trim()) {
    const orderNo = row.orderNo.trim();
    if (props.existingOrderNos.includes(orderNo) || seenOrderNos.has(orderNo)) {
      row.errors.push(t('exportOrderList.importTask.reasons.duplicate', { value: orderNo }));
    }
    seenOrderNos.add(orderNo);
  }
};

const parseSource = () => {
  const source = (activeTab.value === 'upload' ? fileText.value : pasteText.value).trim();
  if (!source) {
    parseError.value = t('exportOrderList.importTask.parseEmpty');
    return;
  }
  parseError.value = '';
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const body = lines.length > 1 && /orderno/i.test(lines[0]) ? lines.slice(1) : lines;
  const seenOrderNos = new Set<string>();
  parsedRows.value = body.map((line, index) => {
    const cells = line.split(/[,，;\t]/).map((cell) => cell.trim().replace(/^"|"$/g, ''));
    const row: ImportParsedRow = {
      lineNo: index + 1,
      orderNo: cells[0] ?? '',
      customerName: cells[1] ?? '',
      businessType: cells[2] ?? '',
      pol: cells[3] ?? '',
      pod: cells[4] ?? '',
      etd: cells[5] ?? '',
      errors: [],
    };
    validateRow(row, seenOrderNos);
    return row;
  });
  if (!parsedRows.value.length) {
    parseError.value = t('exportOrderList.importTask.parseEmpty');
    return;
  }
  step.value = 1;
};

const confirmImport = async () => {
  if (props.importing || importResult.value || !validRows.value.length) return;
  const result = await props.onImport(validRows.value.map((row) => ({ ...row })));
  importResult.value = result;
  const failedOrderNos = new Set(result.failures.map((failure) => failure.orderNo));
  lastFailedRows.value = parsedRows.value
    .filter((row) => failedOrderNos.has(row.orderNo))
    .map((row) => ({ ...row, errors: [] }));
  Message.info(t('exportOrderList.importTask.importedMessage', { success: result.success, failed: result.failures.length }));
  step.value = 2;
};

const retryFailedOnly = () => {
  parsedRows.value = lastFailedRows.value;
  importResult.value = null;
  step.value = 1;
};

const backToUpload = () => {
  importResult.value = null;
  step.value = 0;
};

const downloadFailureDetail = () => {
  const failures = importResult.value?.failures ?? [];
  downloadCsvFile(
    `import-failures-${failures.length}.csv`,
    ['orderNo', 'reason'],
    failures.map((failure) => [failure.orderNo, failure.reason]),
  );
};
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="t('exportOrderList.importTask.title')"
    :width="760"
    :mask-closable="false"
    :ok-button-props="{ size: 'small' }"
    :cancel-button-props="{ size: 'small' }"
    hide-cancel
    :closable="!importing"
  >
    <a-steps :current="stepCurrent" size="small" class="import-steps">
      <a-step>{{ t('exportOrderList.importTask.steps.template') }}</a-step>
      <a-step>{{ t('exportOrderList.importTask.steps.parse') }}</a-step>
      <a-step>{{ t('exportOrderList.importTask.steps.preview') }}</a-step>
      <a-step>{{ t('exportOrderList.importTask.steps.result') }}</a-step>
    </a-steps>

    <div v-if="step === 0" class="import-stage">
      <a-button size="small" type="outline" @click="downloadTemplate">
        <template #icon><icon-download /></template>
        {{ t('exportOrderList.importTask.downloadTemplate') }}
      </a-button>
      <a-tabs v-model:active-key="activeTab" size="small" class="import-tabs">
        <a-tab-pane key="upload" :title="t('exportOrderList.importTask.uploadTab')">
          <div class="import-upload">
            <input
              ref="fileInputRef"
              type="file"
              accept=".csv,text/csv"
              class="import-upload__input"
              @change="onFileChange"
            />
            <a-button size="small" @click="pickFile">
              <template #icon><icon-upload /></template>
              {{ t('exportOrderList.importTask.pickFile') }}
            </a-button>
            <span v-if="fileName" class="import-upload__name">{{ fileName }}</span>
            <div class="import-upload__hint">{{ t('exportOrderList.importTask.fileHint') }}</div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="paste" :title="t('exportOrderList.importTask.pasteTab')">
          <a-textarea
            v-model="pasteText"
            :auto-size="{ minRows: 6, maxRows: 10 }"
            :placeholder="t('exportOrderList.importTask.pastePlaceholder')"
          />
        </a-tab-pane>
      </a-tabs>
      <a-alert v-if="parseError" type="error" class="import-alert">{{ parseError }}</a-alert>
    </div>

    <div v-else-if="step === 1" class="import-stage">
      <div class="import-stats">
        <span class="s-pill" data-s="op">{{ t('exportOrderList.importTask.previewTotal', { total: parsedRows.length }) }}</span>
        <span class="s-pill" data-s="acc">{{ t('exportOrderList.importTask.previewValid', { valid: validRows.length }) }}</span>
        <span v-if="invalidRows.length" class="s-pill" data-s="rej">{{ t('exportOrderList.importTask.previewInvalid', { invalid: invalidRows.length }) }}</span>
      </div>
      <vxe-table
        id="ua-export-order-import-preview"
        size="small"
        max-height="320"
        :data="parsedRows"
        :row-config="rowConfig"
      >
        <vxe-column field="lineNo" title="#" min-width="56" />
        <vxe-column field="orderNo" :title="t('exportOrderList.importTask.columns.orderNo')" min-width="150" />
        <vxe-column field="customerName" :title="t('exportOrderList.importTask.columns.customerName')" min-width="180" show-overflow="title" />
        <vxe-column field="businessType" :title="t('exportOrderList.importTask.columns.businessType')" min-width="90" />
        <vxe-column field="pol" :title="t('exportOrderList.importTask.columns.pol')" min-width="90" />
        <vxe-column field="pod" :title="t('exportOrderList.importTask.columns.pod')" min-width="90" />
        <vxe-column field="etd" :title="t('exportOrderList.importTask.columns.etd')" min-width="100" />
        <vxe-column field="errors" :title="t('exportOrderList.importTask.errorInfo')" min-width="220">
          <template #default="{ row }">
            <span v-if="row.errors.length" class="import-error-text">{{ row.errors.join('；') }}</span>
            <span v-else>—</span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <div v-else class="import-stage">
      <a-alert
        :type="importResult && importResult.failures.length ? (importResult.success ? 'warning' : 'error') : 'success'"
        class="import-alert"
      >
        {{ t('exportOrderList.importTask.resultTitle') }}：
        {{ t('exportOrderList.importTask.resultSuccess', { success: importResult?.success ?? 0 }) }}，
        {{ t('exportOrderList.importTask.resultFailed', { failed: importResult?.failures.length ?? 0 }) }}
      </a-alert>
      <div v-if="importResult?.failures.length" class="import-result-actions">
        <a-button size="small" type="text" @click="downloadFailureDetail">{{ t('exportOrderList.importTask.downloadDetail') }}</a-button>
        <a-button size="small" @click="retryFailedOnly">{{ t('exportOrderList.importTask.retryFailed') }}</a-button>
      </div>
    </div>

    <template #footer>
      <a-space :size="8">
        <template v-if="step === 0">
          <a-button size="small" @click="modalVisible = false">{{ t('common.cancel') }}</a-button>
          <a-button size="small" type="primary" :disabled="!canParse" @click="parseSource">
            {{ t('exportOrderList.importTask.parseAction') }}
          </a-button>
        </template>
        <template v-else-if="step === 1">
          <a-button size="small" :disabled="importing" @click="backToUpload">{{ t('exportOrderList.importTask.backToUpload') }}</a-button>
          <a-button size="small" type="primary" :loading="importing" :disabled="!validRows.length" @click="confirmImport">
            {{ t('exportOrderList.importTask.confirmImport', { count: validRows.length }) }}
          </a-button>
        </template>
        <template v-else>
          <a-button size="small" @click="modalVisible = false">{{ t('common.cancel') }}</a-button>
        </template>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped>
.import-steps {
  margin-bottom: 16px;
}

.import-stage {
  min-width: 0;
}

.import-tabs {
  margin-top: 12px;
}

.import-upload {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.import-upload__input {
  display: none;
}

.import-upload__name {
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
}

.import-upload__hint {
  width: 100%;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.import-alert {
  margin-top: 12px;
}

.import-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.import-error-text {
  color: var(--dense-danger-6);
}

.import-result-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
