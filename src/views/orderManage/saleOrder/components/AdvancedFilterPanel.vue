<script setup lang="ts">
import { computed, ref } from 'vue';
import { filterGroups } from '../config';
import type { AdvancedFieldConfig } from '../types';

defineProps<{
  visible: boolean;
  activeAdvancedCount: number;
}>();

const advancedFilters = defineModel<Record<string, string | boolean | string[]>>('advancedFilters', { required: true });

defineEmits<{
  reset: [];
  apply: [];
  close: [];
}>();

const getPlaceholder = (field: AdvancedFieldConfig) => field.placeholder || `请输入${field.label}`;
const activeGroupKey = ref(filterGroups[0]?.title || '');
const activeGroup = computed(() => filterGroups.find((group) => group.title === activeGroupKey.value) || filterGroups[0]);
const allFields = computed(() => filterGroups.flatMap((group) => group.fields));
const activeFilterItems = computed(() =>
  Object.entries(advancedFilters.value)
    .filter(([, value]) => (Array.isArray(value) ? value.some(Boolean) : typeof value === 'boolean' ? value : String(value || '').trim()))
    .map(([key, value]) => ({
      key,
      label: allFields.value.find((field) => field.key === key)?.label || key,
      value: Array.isArray(value) ? value.filter(Boolean).join(' ~ ') : typeof value === 'boolean' ? '是' : String(value)
    }))
);

const getValue = (key: string) => advancedFilters.value[key];

const setValue = (key: string, value: string | boolean | string[] | undefined) => {
  advancedFilters.value[key] = value ?? '';
};

const setAnyValue = (key: string, value: unknown) => {
  if (Array.isArray(value)) {
    setValue(
      key,
      value
        .filter((item): item is string | number | boolean => item !== undefined && item !== null)
        .map((item) => String(item))
    );
    return;
  }

  if (typeof value === 'boolean') {
    setValue(key, value);
    return;
  }

  setValue(key, value === undefined || value === null ? '' : String(value));
};
</script>

<template>
  <a-drawer
    :visible="visible"
    :width="560"
    :footer="true"
    class="advanced-query-drawer"
    unmount-on-close
    @cancel="$emit('close')"
  >
    <template #title>
      <div class="advanced-drawer__title">
        <span>高级查询</span>
        <a-tag v-if="activeAdvancedCount" size="small" color="arcoblue">已填 {{ activeAdvancedCount }}</a-tag>
        <span class="advanced-drawer__subtitle">单号 / 客户 / 运输 / 标记</span>
      </div>
    </template>

    <div class="advanced-filter-panel__content">
      <aside class="advanced-filter-side">
        <button
          v-for="group in filterGroups"
          :key="group.title"
          class="advanced-filter-tab"
          :class="{ 'advanced-filter-tab--active': activeGroupKey === group.title }"
          type="button"
          @click="activeGroupKey = group.title"
        >
          <span>{{ group.title }}</span>
          <em>{{ group.fields.length }}</em>
        </button>
      </aside>

      <div class="advanced-filter-main">
        <section v-if="activeGroup" class="advanced-filter-section">
          <div class="advanced-filter-section__head">
            <strong>{{ activeGroup.title }}</strong>
            <span>{{ activeGroup.fields.length }} 个条件</span>
          </div>

          <div class="advanced-filter-grid">
            <label
              v-for="field in activeGroup.fields"
              :key="field.key"
              class="advanced-filter-item"
              :class="{
                'advanced-filter-item--checkbox': field.type === 'checkbox',
                'advanced-filter-item--span-2': field.span === 2
              }"
            >
              <span class="advanced-filter-label">{{ field.label }}</span>

              <a-range-picker
                v-if="field.type === 'dateRange'"
                :model-value="getValue(field.key) as string[]"
                size="small"
                class="advanced-filter-control"
                format="YYYY-MM-DD"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-select
                v-else-if="field.type === 'select'"
                :model-value="getValue(field.key) as string"
                size="small"
                allow-clear
                class="advanced-filter-control"
                :placeholder="field.placeholder"
                :options="field.options || []"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-checkbox
                v-else-if="field.type === 'checkbox'"
                :model-value="Boolean(getValue(field.key))"
                class="advanced-filter-checkbox"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-textarea
                v-else-if="field.type === 'textarea'"
                :model-value="getValue(field.key) as string"
                size="small"
                class="advanced-filter-control"
                :auto-size="{ minRows: 2, maxRows: 2 }"
                :placeholder="getPlaceholder(field)"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-input
                v-else
                :model-value="getValue(field.key) as string"
                size="small"
                allow-clear
                class="advanced-filter-control"
                :placeholder="getPlaceholder(field)"
                @update:model-value="setAnyValue(field.key, $event)"
              />
            </label>
          </div>
        </section>

        <div class="advanced-filter-summary">
          <span>已选条件</span>
          <template v-if="activeFilterItems.length">
            <a-tag
              v-for="item in activeFilterItems.slice(0, 12)"
              :key="item.key"
              size="small"
              color="arcoblue"
              class="advanced-filter-summary__tag"
            >
              {{ item.label }}：{{ item.value }}
            </a-tag>
            <em v-if="activeFilterItems.length > 12">+{{ activeFilterItems.length - 12 }}</em>
          </template>
          <em v-else>暂无已选条件</em>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="advanced-drawer__footer">
        <a-button @click="$emit('reset')">清空条件</a-button>
        <a-button type="primary" @click="$emit('apply')">应用查询</a-button>
      </div>
    </template>
  </a-drawer>
</template>
