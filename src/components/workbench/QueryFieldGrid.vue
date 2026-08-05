<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getQueryGridTrackCount } from '../../design-system/queryLayout';

const emit = defineEmits<{
  (event: 'track-count-change', value: number): void;
}>();

const grid = ref<HTMLElement>();
const trackCount = ref(24);
let resizeObserver: ResizeObserver | undefined;

const updateTrackCount = (width: number) => {
  const next = getQueryGridTrackCount(width);
  if (next === trackCount.value) return;
  trackCount.value = next;
  emit('track-count-change', next);
};

onMounted(() => {
  if (!grid.value) return;
  updateTrackCount(grid.value.getBoundingClientRect().width);
  resizeObserver = new ResizeObserver(([entry]) => updateTrackCount(entry.contentRect.width));
  resizeObserver.observe(grid.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <div
    ref="grid"
    class="query-field-grid"
    data-query-layout="semantic-grid-v1"
    :style="{ '--query-grid-tracks': trackCount }"
  >
    <slot />
  </div>
</template>

<style scoped>
.query-field-grid {
  display: grid;
  grid-template-columns: repeat(var(--query-grid-tracks), minmax(0, 1fr));
  align-items: end;
  gap: var(--dense-gap-field-row) var(--dense-gap-field-col);
  width: 100%;
}
</style>
