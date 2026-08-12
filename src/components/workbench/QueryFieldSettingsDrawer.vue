<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Sortable from 'sortablejs';
import {
  IconArrowDown,
  IconArrowUp,
  IconDragDotVertical,
  IconLock,
  IconQuestionCircle,
} from '@arco-design/web-vue/es/icon';
import {
  normalizeQueryFieldPlacement,
  queryFieldRows,
  queryFieldUnitUsage,
} from '@/design-system/queryFieldPreferences';
import { QUERY_GRID_ITEM_SPANS } from '@/design-system/queryLayout';
import type {
  QueryFieldPlacement,
  QueryFieldPreferenceOption,
} from '@/design-system/queryFieldPreferences';

const props = defineProps<{
  options: QueryFieldPreferenceOption[];
  modelValue: QueryFieldPlacement;
  defaultValue: QueryFieldPlacement;
  capacityUnits: number;
  minimumUnits: number;
  actionUnits: 2 | 3;
  maxRows: 2;
  onBeforeApply: (value: QueryFieldPlacement) => boolean | Promise<boolean>;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const { t } = useI18n();
const applying = ref(false);
const searchKeyword = ref('');
const draft = ref<QueryFieldPlacement>({ pageFields: [], drawerFields: [] });
const pageListRef = ref<HTMLElement>();
const drawerListRef = ref<HTMLElement>();
let sortables: Sortable[] = [];

const optionByField = computed(() => new Map(props.options.map((option) => [option.field, option])));
const pageOptions = computed(() => draft.value.pageFields
  .map((field) => optionByField.value.get(field))
  .filter((option): option is QueryFieldPreferenceOption => Boolean(option)));
const drawerOptions = computed(() => draft.value.drawerFields
  .map((field) => optionByField.value.get(field))
  .filter((option): option is QueryFieldPreferenceOption => Boolean(option)));
const normalizedSearchKeyword = computed(() => searchKeyword.value.trim().toLocaleLowerCase());
const matchesSearch = (option: QueryFieldPreferenceOption) => !normalizedSearchKeyword.value
  || option.label.toLocaleLowerCase().includes(normalizedSearchKeyword.value);
const visibleDrawerOptions = computed(() => drawerOptions.value.filter(matchesSearch));
const isSearching = computed(() => Boolean(normalizedSearchKeyword.value));
const usedUnits = computed(() => queryFieldUnitUsage(draft.value.pageFields, props.options));
const usedRows = computed(() => queryFieldRows(draft.value.pageFields, props.options, props.minimumUnits, props.actionUnits));
const overCapacity = computed(() => usedUnits.value > props.capacityUnits || usedRows.value > props.maxRows);
const appliedPlacement = computed(() => normalizeQueryFieldPlacement(
  props.modelValue,
  props.options,
  props.defaultValue,
));
const hasChanges = computed(() => (
  draft.value.pageFields.join('\u0000') !== appliedPlacement.value.pageFields.join('\u0000')
  || draft.value.drawerFields.join('\u0000') !== appliedPlacement.value.drawerFields.join('\u0000')
));
const capacityPercent = computed(() => Math.min(usedUnits.value / props.capacityUnits, 1));
const wideCatalog = computed(() => props.options.length >= 24);
const drawerWidth = computed(() => wideCatalog.value
  ? 'min(var(--dense-drawer-w-filter-wide), calc(100vw - var(--dense-drawer-filter-pad)))'
  : 'min(var(--dense-drawer-w-standard), calc(100vw - var(--dense-drawer-filter-pad)))');
const optionTracks = (option: QueryFieldPreferenceOption) => QUERY_GRID_ITEM_SPANS[option.width];

const syncDraft = (value = props.modelValue) => {
  draft.value = normalizeQueryFieldPlacement(value, props.options, props.defaultValue);
};

const fieldsFromElement = (element?: HTMLElement) => element
  ? Array.from(element.querySelectorAll<HTMLElement>('[data-query-field]')).map((item) => item.dataset.queryField ?? '').filter(Boolean)
  : [];

const syncDraftFromDom = () => {
  draft.value = normalizeQueryFieldPlacement({
    pageFields: fieldsFromElement(pageListRef.value),
    drawerFields: fieldsFromElement(drawerListRef.value),
  }, props.options, props.defaultValue);
};

const destroySortables = () => {
  sortables.forEach((sortable) => sortable.destroy());
  sortables = [];
};

const setupSortables = () => {
  destroySortables();
  if (isSearching.value) return;
  [pageListRef.value, drawerListRef.value].forEach((element) => {
    if (!element) return;
    sortables.push(Sortable.create(element, {
      animation: 150,
      group: 'query-field-placement',
      handle: '.query-field-settings__drag',
      draggable: '.query-field-settings__item',
      ghostClass: 'query-field-settings__item--ghost',
      chosenClass: 'query-field-settings__item--chosen',
      filter: '.query-field-settings__item--locked',
      preventOnFilter: false,
      onMove: (event) => !event.dragged.classList.contains('query-field-settings__item--locked'),
      onEnd: syncDraftFromDom,
    }));
  });
};

const moveWithin = (field: string, area: keyof QueryFieldPlacement, offset: -1 | 1) => {
  if (isSearching.value) return;
  const fields = [...draft.value[area]];
  const index = fields.indexOf(field);
  const nextIndex = index + offset;
  if (index < 0 || nextIndex < 0 || nextIndex >= fields.length) return;
  const target = optionByField.value.get(fields[nextIndex]);
  if (target?.orderLocked) return;
  fields.splice(index, 1);
  fields.splice(nextIndex, 0, field);
  draft.value = { ...draft.value, [area]: fields };
};

const moveAcross = (field: string, target: keyof QueryFieldPlacement) => {
  const option = optionByField.value.get(field);
  if (option?.requiredPage && target === 'drawerFields') return;
  const source: keyof QueryFieldPlacement = target === 'pageFields' ? 'drawerFields' : 'pageFields';
  draft.value = {
    ...draft.value,
    [source]: draft.value[source].filter((item) => item !== field),
    [target]: [...draft.value[target], field],
  };
};

const restoreDefault = () => {
  searchKeyword.value = '';
  syncDraft(props.defaultValue);
};

const apply = async () => {
  if (overCapacity.value || !hasChanges.value || applying.value) return;
  applying.value = true;
  try {
    const applied = await props.onBeforeApply(normalizeQueryFieldPlacement(draft.value, props.options, props.defaultValue));
    if (applied) visible.value = false;
  } finally {
    applying.value = false;
  }
};

watch(visible, async (isVisible) => {
  if (!isVisible) {
    destroySortables();
    return;
  }
  searchKeyword.value = '';
  syncDraft();
  await nextTick();
  setupSortables();
});

watch(searchKeyword, async () => {
  if (!visible.value) return;
  await nextTick();
  setupSortables();
});

onBeforeUnmount(destroySortables);
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :data-ui-surface="wideCatalog ? 'query-field-settings-wide' : 'query-field-settings'"
    :width="drawerWidth"
    :mask-closable="false"
    :closable="!applying"
  >
    <template #title>
      <div class="query-field-settings__title">
        <span>{{ t('shipment.querySettings.title') }}</span>
        <span class="query-field-settings__title-note">{{ t('shipment.querySettings.description') }}</span>
      </div>
    </template>

    <div class="query-field-settings__workspace">
      <section class="query-field-settings__section query-field-settings__section--page" aria-labelledby="query-page-fields-title">
        <div class="query-field-settings__section-head">
          <div class="query-field-settings__section-title">
            <div class="query-field-settings__heading-line">
              <h3 id="query-page-fields-title">{{ t('shipment.querySettings.page') }}</h3>
              <span class="query-field-settings__count">{{ t('shipment.querySettings.pageCount', { count: pageOptions.length }) }}</span>
            </div>
            <span class="query-field-settings__section-note">{{ t('shipment.querySettings.pageHint') }}</span>
          </div>
          <div class="query-field-settings__capacity" :class="{ 'query-field-settings__capacity--error': overCapacity }">
            <div class="query-field-settings__capacity-label">
              <span>{{ t('shipment.querySettings.capacityLabel') }}</span>
              <strong class="tabular">{{ usedUnits }}/{{ capacityUnits }}</strong>
              <a-tooltip :content="t('shipment.querySettings.capacity', { used: usedUnits, capacity: capacityUnits, rows: usedRows })">
                <icon-question-circle class="query-field-settings__help" />
              </a-tooltip>
            </div>
            <a-progress
              size="small"
              :percent="capacityPercent"
              :show-text="false"
              :status="overCapacity ? 'danger' : 'normal'"
            />
          </div>
        </div>

        <a-alert v-if="overCapacity" type="error" class="query-field-settings__error">
          {{ t('shipment.querySettings.capacityError', { used: usedUnits, capacity: capacityUnits, rows: usedRows }) }}
        </a-alert>

        <div ref="pageListRef" class="query-field-settings__page-preview" :class="{ 'query-field-settings__page-preview--error': overCapacity }">
          <div
            v-for="(option, index) in pageOptions"
            :key="option.field"
            class="query-field-settings__item query-field-settings__page-item"
            :class="{ 'query-field-settings__item--locked': option.orderLocked }"
            :data-query-field="option.field"
            :style="{ gridColumn: `span ${optionTracks(option)}` }"
          >
            <span class="query-field-settings__index tabular">{{ String(index + 1).padStart(2, '0') }}</span>
            <a-tooltip :content="isSearching ? t('shipment.querySettings.clearSearchToSort') : t('shipment.querySettings.drag', { field: option.label })">
              <a-button
                class="query-field-settings__drag"
                size="mini"
                type="text"
                :disabled="option.orderLocked || isSearching"
                :aria-label="t('shipment.querySettings.drag', { field: option.label })"
                @keydown.alt.left.prevent="moveWithin(option.field, 'pageFields', -1)"
                @keydown.alt.right.prevent="moveWithin(option.field, 'pageFields', 1)"
                @keydown.alt.up.prevent="moveWithin(option.field, 'pageFields', -1)"
                @keydown.alt.down.prevent="moveWithin(option.field, 'pageFields', 1)"
              >
                <template #icon><icon-drag-dot-vertical /></template>
              </a-button>
            </a-tooltip>
            <span class="query-field-settings__label" :title="option.label">{{ option.label }}</span>
            <a-tooltip :content="option.requiredPage ? t('shipment.querySettings.fixedPage') : t('shipment.querySettings.toDrawer')">
              <span class="query-field-settings__move-wrap">
                <a-button
                  class="query-field-settings__move"
                  size="mini"
                  type="text"
                  :disabled="option.requiredPage"
                  :aria-label="option.requiredPage ? t('shipment.querySettings.fixedPage') : t('shipment.querySettings.toDrawerField', { field: option.label })"
                  @click="moveAcross(option.field, 'drawerFields')"
                >
                  <template #icon>
                    <icon-lock v-if="option.requiredPage" />
                    <icon-arrow-down v-else />
                  </template>
                </a-button>
              </span>
            </a-tooltip>
          </div>
        </div>
      </section>

      <section class="query-field-settings__section query-field-settings__section--drawer" aria-labelledby="query-drawer-fields-title">
        <div class="query-field-settings__section-head">
          <div class="query-field-settings__section-title">
            <div class="query-field-settings__heading-line">
              <h3 id="query-drawer-fields-title">{{ t('shipment.querySettings.drawer') }}</h3>
              <span class="query-field-settings__count">{{ t('shipment.querySettings.drawerCount', { count: drawerOptions.length }) }}</span>
            </div>
            <span class="query-field-settings__section-note">{{ t('shipment.querySettings.drawerHint') }}</span>
          </div>
          <a-input-search
            v-model="searchKeyword"
            size="small"
            allow-clear
            class="query-field-settings__search"
            :placeholder="t('shipment.querySettings.searchPlaceholder')"
            :aria-label="t('shipment.querySettings.search')"
          />
        </div>
        <div ref="drawerListRef" class="query-field-settings__catalog">
          <div
            v-for="(option, index) in visibleDrawerOptions"
            :key="option.field"
            class="query-field-settings__item query-field-settings__catalog-item"
            :data-query-field="option.field"
          >
            <span class="query-field-settings__index tabular">{{ String(index + 1).padStart(2, '0') }}</span>
            <a-tooltip :content="isSearching ? t('shipment.querySettings.clearSearchToSort') : t('shipment.querySettings.drag', { field: option.label })">
              <a-button
                class="query-field-settings__drag"
                size="mini"
                type="text"
                :disabled="isSearching"
                :aria-label="t('shipment.querySettings.drag', { field: option.label })"
                @keydown.alt.up.prevent="moveWithin(option.field, 'drawerFields', -1)"
                @keydown.alt.down.prevent="moveWithin(option.field, 'drawerFields', 1)"
                @keydown.alt.left.prevent="moveWithin(option.field, 'drawerFields', -1)"
                @keydown.alt.right.prevent="moveWithin(option.field, 'drawerFields', 1)"
              >
                <template #icon><icon-drag-dot-vertical /></template>
              </a-button>
            </a-tooltip>
            <span class="query-field-settings__label" :title="option.label">{{ option.label }}</span>
            <a-tooltip :content="t('shipment.querySettings.toPage')">
              <a-button
                class="query-field-settings__move"
                size="mini"
                type="text"
                :aria-label="t('shipment.querySettings.toPageField', { field: option.label })"
                @click="moveAcross(option.field, 'pageFields')"
              >
                <template #icon><icon-arrow-up /></template>
              </a-button>
            </a-tooltip>
          </div>
          <div v-if="!visibleDrawerOptions.length" class="query-field-settings__empty">{{ t('shipment.querySettings.noResults') }}</div>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="query-field-settings__footer">
        <a-button size="small" type="text" :disabled="applying" @click="restoreDefault">
          {{ t('common.restoreDefaults') }}
        </a-button>
        <a-space :size="8">
          <a-button size="small" :disabled="applying" @click="visible = false">{{ t('common.cancel') }}</a-button>
          <a-button size="small" type="primary" :loading="applying" :disabled="overCapacity || !hasChanges" @click="apply">
            {{ t('shipment.querySettings.save') }}
          </a-button>
        </a-space>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped>
.query-field-settings__workspace {
  display: grid;
  gap: 20px;
  padding-top: 2px;
}

.query-field-settings__section {
  min-width: 0;
}

.query-field-settings__section-head,
.query-field-settings__section-title,
.query-field-settings__capacity-label,
.query-field-settings__item,
.query-field-settings__footer {
  display: flex;
  align-items: center;
}

.query-field-settings__section-head {
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  min-height: 42px;
  margin-bottom: 10px;
}

.query-field-settings__section-title {
  display: grid;
  gap: 3px;
}

.query-field-settings__heading-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.query-field-settings__section-title h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: var(--dense-weight-title);
  line-height: 20px;
}

.query-field-settings__count {
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--color-fill-2);
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 18px;
}

.query-field-settings__section-note {
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 16px;
}

.query-field-settings__title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.query-field-settings__title > span:first-child {
  color: var(--color-text-1);
  font-size: var(--dense-font-overlay);
  font-weight: var(--dense-weight-title);
}

.query-field-settings__title-note {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.query-field-settings__capacity {
  display: grid;
  grid-template-columns: auto 116px;
  align-items: center;
  gap: 10px;
  min-width: 224px;
  padding: 7px 10px;
  border: 1px solid var(--color-border-2);
  border-radius: 6px;
  background: var(--color-fill-1);
}

.query-field-settings__capacity--error {
  border-color: var(--dense-danger-3);
  background: var(--dense-danger-1);
}

.query-field-settings__capacity-label {
  gap: var(--dense-gap-inline);
  color: var(--color-text-2);
  font-size: var(--dense-font-aux);
}

.query-field-settings__capacity-label strong {
  color: var(--color-text-1);
  font-weight: var(--dense-weight-title);
}

.query-field-settings__capacity--error .query-field-settings__capacity-label strong {
  color: var(--dense-danger-6);
}

.query-field-settings__help {
  color: var(--color-text-3);
  cursor: help;
}

.query-field-settings__search {
  width: 240px;
}

.query-field-settings__error {
  margin-bottom: var(--dense-gap-zone);
}

.query-field-settings__page-preview {
  display: grid;
  grid-template-columns: repeat(15, minmax(0, 1fr));
  gap: 8px;
  min-height: 82px;
  padding: 10px;
  border: 1px solid var(--color-border-1);
  border-radius: 8px;
  background: var(--color-fill-1);
}

.query-field-settings__page-preview--error {
  border-color: var(--dense-danger-3);
}

.query-field-settings__catalog {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 42px;
  min-height: clamp(300px, calc(100vh - 430px), 520px);
  overflow: hidden;
  border: 1px solid var(--color-border-1);
  border-radius: 8px;
  background: var(--color-fill-1);
}

.query-field-settings__item {
  min-width: 0;
  min-height: 40px;
}

.query-field-settings__page-item {
  gap: 2px;
  padding: 4px 7px 4px 5px;
  overflow: hidden;
  border: 1px solid var(--dense-primary-3);
  border-radius: 6px;
  background: var(--dense-primary-1);
  box-shadow: 0 1px 1px rgb(29 78 216 / 5%);
}

.query-field-settings__page-item .query-field-settings__label {
  font-size: var(--dense-font-aux);
}

.query-field-settings__page-item .query-field-settings__drag,
.query-field-settings__page-item .query-field-settings__move {
  width: 24px;
  min-width: 24px;
  height: 24px;
  padding: 0;
}

.query-field-settings__catalog-item {
  gap: 4px;
  padding-inline: 10px;
  border-bottom: 1px solid var(--color-border-1);
}

.query-field-settings__catalog-item:nth-child(odd) {
  border-right: 1px solid var(--color-border-1);
}

.query-field-settings__catalog-item:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.query-field-settings__catalog-item:hover,
.query-field-settings__catalog-item:focus-within {
  background: var(--color-fill-1);
}

.query-field-settings__page-item:hover,
.query-field-settings__page-item:focus-within {
  background: var(--dense-primary-2);
}

.query-field-settings__drag {
  flex: 0 0 auto;
  color: var(--color-text-3);
  cursor: grab;
}

.query-field-settings__drag:active {
  cursor: grabbing;
}

.query-field-settings__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-control);
}

.query-field-settings__index {
  flex: 0 0 22px;
  color: var(--color-text-3);
  font-size: var(--dense-font-micro);
  text-align: center;
}

.query-field-settings__page-item .query-field-settings__index {
  color: var(--dense-primary-6);
  font-weight: var(--dense-weight-title);
}

.query-field-settings__move-wrap {
  display: inline-flex;
}

.query-field-settings__move {
  flex: 0 0 auto;
  color: var(--color-text-3);
}

.query-field-settings__item:hover .query-field-settings__move:not([disabled]),
.query-field-settings__item:focus-within .query-field-settings__move:not([disabled]) {
  color: var(--dense-primary-6);
}

.query-field-settings__empty {
  display: grid;
  grid-column: 1 / -1;
  min-height: 96px;
  place-items: center;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

.query-field-settings__item--ghost {
  background: var(--dense-primary-1);
  opacity: .45;
}

.query-field-settings__item--chosen {
  background: var(--dense-primary-1);
  box-shadow: inset 2px 0 0 var(--dense-primary-6);
}

.query-field-settings__footer {
  justify-content: space-between;
  width: 100%;
}

@media (max-width: 560px) {
  .query-field-settings__section-head {
    align-items: stretch;
    flex-wrap: wrap;
    gap: var(--dense-gap-inline);
  }

  .query-field-settings__capacity {
    width: 100%;
  }

  .query-field-settings__search {
    width: 100%;
  }

  .query-field-settings__catalog {
    grid-template-columns: minmax(0, 1fr);
  }

  .query-field-settings__catalog-item:nth-child(odd) {
    border-right: 0;
  }
}
</style>
