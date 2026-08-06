<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Sortable from 'sortablejs';
import { IconDragDotVertical, IconSettings } from '@arco-design/web-vue/es/icon';

interface ColumnSettingOption {
  field: string;
  label: string;
  required?: boolean;
  orderLocked?: boolean;
}

const props = withDefaults(defineProps<{
  modelValue: string[];
  orderValue: string[];
  defaultValue: string[];
  options: ColumnSettingOption[];
  minimum?: number;
  disabled?: boolean;
  onBeforeApply: (value: { visibleFields: string[]; orderedFields: string[] }) => boolean | Promise<boolean>;
}>(), {
  minimum: 1,
  disabled: false,
});

const { t } = useI18n();
const popupVisible = ref(false);
const applying = ref(false);
const draftFields = ref<string[]>([]);
const draftOrder = ref<string[]>([]);
const triggerRef = ref<HTMLElement>();
const listRef = ref<HTMLElement>();
const panelMaxHeight = ref(620);
let sortable: Sortable | undefined;

const availableFields = computed(() => new Set(props.options.map((option) => option.field)));
const requiredFields = computed(() => props.options.filter((option) => option.required).map((option) => option.field));
const orderLockedFields = computed(() => new Set(props.options.filter((option) => option.orderLocked).map((option) => option.field)));
const optionByField = computed(() => new Map(props.options.map((option) => [option.field, option])));

const normalizeVisible = (fields: string[]) => Array.from(new Set([...requiredFields.value, ...fields]))
  .filter((field) => availableFields.value.has(field));

const normalizeOrder = (fields: string[]) => {
  const normalized = Array.from(new Set(fields)).filter((field) => availableFields.value.has(field));
  props.options.forEach((option) => {
    if (!normalized.includes(option.field)) normalized.push(option.field);
  });
  return normalized;
};

const orderedOptions = computed(() => draftOrder.value
  .map((field) => optionByField.value.get(field))
  .filter((option): option is ColumnSettingOption => Boolean(option)));

const syncDraft = () => {
  draftFields.value = normalizeVisible(props.modelValue);
  draftOrder.value = normalizeOrder(props.orderValue);
};

const showAll = () => {
  draftFields.value = props.options.map((option) => option.field);
};

const restoreDefault = () => {
  draftFields.value = normalizeVisible(props.defaultValue);
  draftOrder.value = props.options.map((option) => option.field);
};

const isOptionLocked = (option: ColumnSettingOption) => option.required
  || (draftFields.value.includes(option.field) && draftFields.value.length <= props.minimum);

const toggleOption = (field: string, checked: boolean) => {
  draftFields.value = checked
    ? normalizeVisible([...draftFields.value, field])
    : draftFields.value.filter((draftField) => draftField !== field);
};

const moveOption = (field: string, offset: -1 | 1) => {
  if (orderLockedFields.value.has(field)) return;
  const oldIndex = draftOrder.value.indexOf(field);
  const nextIndex = oldIndex + offset;
  if (oldIndex < 0 || nextIndex < 0 || nextIndex >= draftOrder.value.length) return;
  const targetField = draftOrder.value[nextIndex];
  if (orderLockedFields.value.has(targetField)) return;
  const nextOrder = [...draftOrder.value];
  nextOrder.splice(oldIndex, 1);
  nextOrder.splice(nextIndex, 0, field);
  draftOrder.value = nextOrder;
};

const applySelection = async () => {
  applying.value = true;
  try {
    const applied = await props.onBeforeApply({
      visibleFields: normalizeVisible(draftFields.value),
      orderedFields: normalizeOrder(draftOrder.value),
    });
    if (applied) popupVisible.value = false;
  } finally {
    applying.value = false;
  }
};

const updatePanelMaxHeight = () => {
  const triggerRect = triggerRef.value?.getBoundingClientRect();
  if (!triggerRect) return;

  panelMaxHeight.value = Math.max(160, Math.min(620, window.innerHeight - triggerRect.bottom - 40));
};

const setupSortable = () => {
  sortable?.destroy();
  if (!listRef.value) return;
  sortable = Sortable.create(listRef.value, {
    animation: 150,
    handle: '.column-settings-panel__drag',
    draggable: '.column-settings-panel__option',
    ghostClass: 'column-settings-panel__option--ghost',
    filter: '.column-settings-panel__option--order-locked',
    preventOnFilter: false,
    onMove: (event) => !event.related.classList.contains('column-settings-panel__option--order-locked'),
    onEnd: ({ oldIndex, newIndex }) => {
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
      const nextOrder = [...draftOrder.value];
      const [field] = nextOrder.splice(oldIndex, 1);
      nextOrder.splice(newIndex, 0, field);
      draftOrder.value = nextOrder;
    },
  });
};

watch(popupVisible, async (visible) => {
  if (visible) {
    syncDraft();
    await nextTick();
    updatePanelMaxHeight();
    setupSortable();
  } else {
    sortable?.destroy();
    sortable = undefined;
  }
});

watch(() => props.modelValue, () => {
  if (!popupVisible.value) syncDraft();
}, { immediate: true, deep: true });

onMounted(() => window.addEventListener('resize', updatePanelMaxHeight));
onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePanelMaxHeight);
  sortable?.destroy();
});
</script>

<template>
  <a-popover v-model:popup-visible="popupVisible" trigger="click" position="br">
    <span ref="triggerRef" class="column-settings-trigger">
      <a-tooltip :content="t('common.columnSettings')" :disabled="popupVisible">
        <a-button
          size="small"
          type="text"
          class="table-cap-tool"
          :title="t('common.columnSettings')"
          :aria-label="t('common.columnSettings')"
          :disabled="disabled"
        >
          <template #icon><icon-settings /></template>
        </a-button>
      </a-tooltip>
    </span>

    <template #content>
      <div
        class="column-settings-panel"
        data-ui-surface="column-settings"
        :style="{ maxHeight: `${panelMaxHeight}px` }"
      >
        <div class="column-settings-panel__head">
          <div>
            <div class="column-settings-panel__title">{{ t('common.columnSettings') }}</div>
            <div class="column-settings-panel__summary">{{ t('common.columnsSelected', { count: draftFields.length }) }}</div>
          </div>
          <a-space :size="4">
            <a-button size="small" type="text" @click="showAll">{{ t('common.showAllColumns') }}</a-button>
            <a-button size="small" type="text" @click="restoreDefault">{{ t('common.restoreDefaults') }}</a-button>
          </a-space>
        </div>

        <div ref="listRef" class="column-settings-panel__list">
          <div
            v-for="option in orderedOptions"
            :key="option.field"
            class="column-settings-panel__option"
            :class="{ 'column-settings-panel__option--order-locked': option.orderLocked }"
            :data-column-field="option.field"
          >
            <a-tooltip :content="t('common.dragColumn', { column: option.label })">
              <a-button
                size="mini"
                type="text"
                class="column-settings-panel__drag"
                :class="{ 'column-settings-panel__drag--disabled': option.orderLocked }"
                :disabled="option.orderLocked"
                :aria-label="t('common.dragColumn', { column: option.label })"
                @keydown.alt.up.prevent="moveOption(option.field, -1)"
                @keydown.alt.down.prevent="moveOption(option.field, 1)"
              >
                <template #icon><icon-drag-dot-vertical /></template>
              </a-button>
            </a-tooltip>
            <a-checkbox
              :model-value="draftFields.includes(option.field)"
              :disabled="isOptionLocked(option)"
              @change="toggleOption(option.field, $event)"
            >
              {{ option.label }}
            </a-checkbox>
          </div>
        </div>

        <div class="column-settings-panel__footer">
          <a-button size="small" @click="popupVisible = false">{{ t('common.cancel') }}</a-button>
          <a-button size="small" type="primary" :loading="applying" @click="applySelection">
            {{ t('common.saveColumnSettings') }}
          </a-button>
        </div>
      </div>
    </template>
  </a-popover>
</template>

<style scoped>
.column-settings-trigger {
  display: inline-flex;
}

.column-settings-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(380px, calc(100vw - 48px));
}

.column-settings-panel__head,
.column-settings-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.column-settings-panel__head {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-1);
}

.column-settings-panel__title {
  color: var(--color-text-1);
  font-size: var(--dense-font-title);
  font-weight: var(--dense-weight-title);
  line-height: 18px;
}

.column-settings-panel__summary {
  margin-top: 2px;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 16px;
}

.column-settings-panel__list {
  min-height: min(160px, 20vh);
  padding-right: 4px;
  overflow-y: auto;
}

.column-settings-panel__option {
  display: flex;
  align-items: center;
  min-height: 30px;
}

.column-settings-panel__drag {
  flex: 0 0 auto;
  margin-right: 2px;
  color: var(--color-text-3);
  cursor: grab;
}

.column-settings-panel__drag:active {
  cursor: grabbing;
}

.column-settings-panel__drag--disabled {
  cursor: default;
}

.column-settings-panel__option--ghost {
  background: var(--color-fill-2);
}

.column-settings-panel__footer {
  padding-top: 8px;
  border-top: 1px solid var(--color-border-1);
}
</style>
