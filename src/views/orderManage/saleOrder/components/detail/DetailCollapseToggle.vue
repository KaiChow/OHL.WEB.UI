<script setup lang="ts">
import { IconDown } from '@arco-design/web-vue/es/icon';

defineProps<{
  expanded: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    type="button"
    class="detail-collapse-toggle"
    :class="{ 'detail-collapse-toggle--expanded': expanded }"
    :aria-expanded="expanded"
    :aria-label="expanded ? '收起详情' : '展开详情'"
    @click="$emit('click', $event)"
  >
    <span class="detail-collapse-toggle__text">{{ expanded ? '收起' : '展开' }}</span>
    <icon-down class="detail-collapse-toggle__icon" />
  </button>
</template>
