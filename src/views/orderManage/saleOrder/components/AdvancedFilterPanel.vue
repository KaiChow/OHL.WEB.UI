<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { filterGroups } from '../config';
import type { AdvancedFieldConfig } from '../types';

defineProps<{
  visible: boolean;
  activeAdvancedCount: number;
}>();

const advancedFilters = defineModel<Record<string, string | boolean | string[]>>('advancedFilters', { required: true });

defineEmits<{ reset: []; apply: []; close: [] }>();

const scrollRef = ref<HTMLElement | null>(null);
const activeGroupKey = ref(filterGroups[0]?.title || '');
const allFields = computed(() => filterGroups.flatMap((g) => g.fields));

const activeFilterItems = computed(() =>
  Object.entries(advancedFilters.value)
    .filter(([, v]) => (Array.isArray(v) ? v.some(Boolean) : typeof v === 'boolean' ? v : String(v || '').trim()))
    .map(([key, v]) => ({
      key,
      label: allFields.value.find((f) => f.key === key)?.label || key,
      value: Array.isArray(v) ? v.filter(Boolean).join(' ~ ') : typeof v === 'boolean' ? '是' : String(v)
    }))
);

const groupActiveCount = (groupTitle: string) => {
  const group = filterGroups.find((g) => g.title === groupTitle);
  if (!group) return 0;
  return group.fields.filter(({ key }) => {
    const v = advancedFilters.value[key];
    return Array.isArray(v) ? v.some(Boolean) : typeof v === 'boolean' ? v : String(v || '').trim();
  }).length;
};

// 滚动到指定分组
const scrollToGroup = (title: string) => {
  activeGroupKey.value = title;
  const el = document.getElementById(`adv-group-${title}`);
  if (el && scrollRef.value) {
    scrollRef.value.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' });
  }
};

// Scroll spy：监听右侧滚动，高亮当前分组
let rafId: number | null = null;
const onScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (!scrollRef.value) return;
    const container = scrollRef.value;
    const scrollTop = container.scrollTop;
    let current = filterGroups[0]?.title || '';
    for (const group of filterGroups) {
      const el = document.getElementById(`adv-group-${group.title}`);
      if (el && el.offsetTop - 24 <= scrollTop) current = group.title;
    }
    activeGroupKey.value = current;
  });
};

onMounted(() => scrollRef.value?.addEventListener('scroll', onScroll));
onBeforeUnmount(() => {
  scrollRef.value?.removeEventListener('scroll', onScroll);
  if (rafId) cancelAnimationFrame(rafId);
});

// 每次打开时重置滚动位置
watch(
  () => [filterGroups[0]?.title],
  () => { activeGroupKey.value = filterGroups[0]?.title || ''; }
);

const getPlaceholder = (field: AdvancedFieldConfig) => field.placeholder || `请输入${field.label}`;
const getValue = (key: string) => advancedFilters.value[key];
const setValue = (key: string, value: string | boolean | string[] | undefined) => {
  advancedFilters.value[key] = value ?? '';
};
const setAnyValue = (key: string, value: unknown) => {
  if (Array.isArray(value)) {
    setValue(key, value.filter((i): i is string | number | boolean => i != null).map(String));
    return;
  }
  if (typeof value === 'boolean') { setValue(key, value); return; }
  setValue(key, value == null ? '' : String(value));
};
</script>

<template>
  <a-drawer
    :visible="visible"
    class="adv-filter-drawer"
    :width="820"
    :footer="false"
    :mask-closable="true"
    placement="right"
    unmount-on-close
    @cancel="$emit('close')"
  >
    <template #title>
      <div class="adv-drawer-title">
        <span>高级查询</span>
        <a-tag v-if="activeAdvancedCount" size="small" color="arcoblue">
          已设置 {{ activeAdvancedCount }} 项
        </a-tag>
      </div>
    </template>

    <div class="adv-drawer-body">
      <!-- 左侧锚点导航 -->
      <nav class="adv-nav">
        <div class="adv-nav-inner">
          <button
            v-for="group in filterGroups"
            :key="group.title"
            class="adv-nav-item"
            :class="{ 'adv-nav-item--active': activeGroupKey === group.title }"
            type="button"
            @click="scrollToGroup(group.title)"
          >
            <span class="adv-nav-label">{{ group.title }}</span>
            <span v-if="groupActiveCount(group.title)" class="adv-nav-badge">
              {{ groupActiveCount(group.title) }}
            </span>
            <span v-else class="adv-nav-total">{{ group.fields.length }}</span>
          </button>
        </div>

        <!-- 已选汇总 -->
        <div class="adv-nav-summary">
          <div class="adv-nav-summary-title">
            <span>已选条件</span>
            <em>{{ activeFilterItems.length }}</em>
          </div>
          <div v-if="activeFilterItems.length" class="adv-nav-tags">
            <a-tag
              v-for="item in activeFilterItems.slice(0, 10)"
              :key="item.key"
              size="small"
              color="arcoblue"
              closable
              @close="setValue(item.key, '')"
            >
              {{ item.label }}
            </a-tag>
            <span v-if="activeFilterItems.length > 10" class="adv-nav-tags-more">
              +{{ activeFilterItems.length - 10 }}
            </span>
          </div>
          <div v-else class="adv-nav-empty">暂无已选条件</div>
        </div>
      </nav>

      <!-- 右侧连续滚动表单 -->
      <div ref="scrollRef" class="adv-form-scroll">
        <section
          v-for="group in filterGroups"
          :id="`adv-group-${group.title}`"
          :key="group.title"
          class="adv-group"
        >
          <div class="adv-group-head">
            <strong>{{ group.title }}</strong>
            <span>{{ group.fields.length }} 个条件</span>
            <span v-if="groupActiveCount(group.title)" class="adv-group-active-count">
              已填 {{ groupActiveCount(group.title) }} 项
            </span>
          </div>

          <div class="adv-grid">
            <label
              v-for="field in group.fields"
              :key="field.key"
              class="adv-field"
              :class="{
                'adv-field--checkbox': field.type === 'checkbox',
                'adv-field--span2': field.span === 2,
                'adv-field--active': !!getValue(field.key) && getValue(field.key) !== '' && getValue(field.key) !== false
              }"
            >
              <span class="adv-field-label">{{ field.label }}</span>

              <a-range-picker
                v-if="field.type === 'dateRange'"
                :model-value="getValue(field.key) as string[]"
                size="small"
                class="adv-field-control"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-select
                v-else-if="field.type === 'select'"
                :model-value="getValue(field.key) as string"
                size="small"
                allow-clear
                class="adv-field-control"
                :placeholder="field.placeholder"
                :options="field.options || []"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-checkbox
                v-else-if="field.type === 'checkbox'"
                :model-value="Boolean(getValue(field.key))"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-textarea
                v-else-if="field.type === 'textarea'"
                :model-value="getValue(field.key) as string"
                size="small"
                class="adv-field-control"
                :auto-size="{ minRows: 2, maxRows: 3 }"
                :placeholder="getPlaceholder(field)"
                @update:model-value="setAnyValue(field.key, $event)"
              />

              <a-input
                v-else
                :model-value="getValue(field.key) as string"
                size="small"
                allow-clear
                class="adv-field-control"
                :placeholder="getPlaceholder(field)"
                @update:model-value="setAnyValue(field.key, $event)"
              />
            </label>
          </div>
        </section>

        <!-- 底部安全区 -->
        <div style="height: 24px" />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="adv-drawer-footer">
      <a-button type="text" @click="$emit('reset')">清空全部条件</a-button>
      <div style="flex: 1" />
      <a-button @click="$emit('close')">取消</a-button>
      <a-button type="primary" @click="$emit('apply')">应用查询</a-button>
    </div>
  </a-drawer>
</template>
