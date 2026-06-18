<script setup lang="ts">
import type { FilterTag } from '../composables/useSaleOrderFilterTags';

defineProps<{
  tags: FilterTag[];
}>();

const emit = defineEmits<{
  remove: [key: string];
  'clear-all': [];
}>();
</script>

<template>
  <div v-if="tags.length > 0" class="filter-active-strip">
    <span class="filter-active-strip__label">已选条件</span>
    <a-tag
      v-for="tag in tags"
      :key="tag.key"
      closable
      size="small"
      class="filter-tag"
      @close="emit('remove', tag.key)"
    >
      {{ tag.label }}：{{ tag.display }}
    </a-tag>
    <a-button type="text" size="mini" class="filter-strip-clear" @click="emit('clear-all')">
      清空全部
    </a-button>
  </div>
</template>
