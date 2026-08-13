<script setup lang="ts">
import { IconBookmark } from '@arco-design/web-vue/es/icon';

export interface SavedQueryMenuItem {
  id: string;
  name: string;
  isDefault?: boolean;
}

const props = withDefaults(defineProps<{
  items: readonly SavedQueryMenuItem[];
  label: string;
  saveLabel: string;
  manageLabel: string;
  emptyLabel: string;
  defaultLabel: string;
  disabled?: boolean;
}>(), { disabled: false });

const emit = defineEmits<{
  select: [id: string];
  save: [];
  manage: [];
}>();
</script>

<template>
  <a-dropdown trigger="click" :disabled="props.disabled" content-class="saved-query-menu__content">
    <a-tooltip :content="props.label">
      <a-button
        size="small"
        type="text"
        class="saved-query-menu__trigger"
        :disabled="props.disabled"
        :aria-label="props.label"
        :title="props.label"
      >
        <template #icon><icon-bookmark /></template>
      </a-button>
    </a-tooltip>
    <template #content>
      <a-doption v-for="item in props.items" :key="item.id" @click="emit('select', item.id)">
        <span class="saved-query-menu__item"><span>{{ item.name }}</span><span v-if="item.isDefault" class="saved-query-menu__default">{{ props.defaultLabel }}</span></span>
      </a-doption>
      <span v-if="!props.items.length" class="saved-query-menu__empty">{{ props.emptyLabel }}</span>
      <a-divider :margin="4" />
      <a-doption @click="emit('save')">{{ props.saveLabel }}</a-doption>
      <a-doption @click="emit('manage')">{{ props.manageLabel }}</a-doption>
    </template>
  </a-dropdown>
</template>

<style scoped>
.saved-query-menu__trigger { width: 28px; }
.saved-query-menu__item { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 160px; }
.saved-query-menu__default { color: var(--color-text-3); font-size: var(--dense-font-aux); }
.saved-query-menu__empty { display: block; padding: 6px 12px; color: var(--color-text-3); font-size: var(--dense-font-aux); }
</style>
