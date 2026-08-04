<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  current: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
}>(), {
  pageSizeOptions: () => [20, 50, 100],
});

const emit = defineEmits<{
  change: [page: number];
  pageSizeChange: [pageSize: number];
}>();

const root = ref<HTMLElement>();
const width = ref(0);
let resizeObserver: ResizeObserver | undefined;

const pageCount = computed(() => Math.ceil(props.total / props.pageSize));
const profile = computed(() => width.value < 880 ? 'compact' : width.value < 1120 ? 'regular' : 'wide');
const showTotal = computed(() => width.value >= 700);
const showPageSize = computed(() => width.value >= 880);
const showJumper = computed(() => width.value >= 1120 && pageCount.value > 7);

onMounted(() => {
  if (!root.value) return;
  width.value = root.value.getBoundingClientRect().width;
  resizeObserver = new ResizeObserver(([entry]) => {
    width.value = entry.contentRect.width;
  });
  resizeObserver.observe(root.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <div ref="root" class="workbench-table-toolbar" :data-toolbar-profile="profile">
    <div class="workbench-table-toolbar__commands">
      <slot name="commands" />
    </div>
    <div class="workbench-table-toolbar__aside">
      <div v-if="$slots.utilities" class="workbench-table-toolbar__utilities">
        <slot name="utilities" />
      </div>
      <a-divider v-if="$slots.utilities" direction="vertical" :margin="0" />
      <a-pagination
        :current="current"
        :page-size="pageSize"
        :total="total"
        :page-size-options="pageSizeOptions"
        size="mini"
        :show-total="showTotal"
        :show-page-size="showPageSize"
        :show-jumper="showJumper"
        @change="emit('change', $event)"
        @page-size-change="emit('pageSizeChange', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.workbench-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.workbench-table-toolbar__commands {
  flex: 1 1 auto;
  min-width: 0;
}

.workbench-table-toolbar__aside,
.workbench-table-toolbar__utilities {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
}

.workbench-table-toolbar__aside {
  gap: 8px;
}

.workbench-table-toolbar__utilities {
  gap: 4px;
}

.workbench-table-toolbar[data-toolbar-profile='compact'] :deep(.table-command-label--optional) {
  display: none;
}

.workbench-table-toolbar[data-toolbar-profile='compact'] :deep(.table-command--compact-icon) {
  width: 28px;
  min-width: 28px;
  padding-inline: 0;
}
</style>
