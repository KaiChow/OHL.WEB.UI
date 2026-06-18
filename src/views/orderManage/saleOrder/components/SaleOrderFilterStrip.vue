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
  <div class="filter-active-strip" :class="{ 'filter-active-strip--empty': tags.length === 0 }">
    <span class="filter-active-strip__label">已选条件</span>
    <template v-if="tags.length > 0">
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
    </template>
    <span v-else class="filter-active-strip__placeholder">当前无筛选条件</span>
  </div>
</template>
