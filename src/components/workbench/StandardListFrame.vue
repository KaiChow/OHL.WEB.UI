<script setup lang="ts">
withDefaults(defineProps<{
  pageId: string;
  commandVisible?: boolean;
}>(), {
  commandVisible: true,
});
</script>

<template>
  <div class="standard-list-frame" :data-pesdp-page="pageId">
    <div class="standard-list-frame__stack">
      <div v-if="$slots.pageMode" class="standard-list-frame__page-mode">
        <slot name="pageMode" />
      </div>

      <a-card
        v-if="commandVisible && ($slots.query || $slots.workflow)"
        size="small"
        :bordered="true"
        class="standard-list-frame__command"
        :body-style="{ padding: 0 }"
      >
        <div v-if="$slots.query" class="standard-list-frame__query">
          <slot name="query" />
        </div>
        <div v-if="$slots.workflow" class="standard-list-frame__workflow">
          <slot name="workflow" />
        </div>
      </a-card>

      <a-card
        class="standard-list-frame__data"
        size="small"
        :bordered="false"
        :header-style="{ minHeight: '40px', padding: '0 12px', borderBottom: 'none' }"
        :body-style="{ minHeight: 0, padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }"
      >
        <template v-if="$slots.toolbar" #title>
          <slot name="toolbar" />
        </template>
        <slot name="feedback" />
        <div class="standard-list-frame__table">
          <slot name="table" />
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.standard-list-frame {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
}

.standard-list-frame__stack {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--dense-gap-zone);
  min-height: 0;
}

.standard-list-frame__page-mode {
  flex: 0 0 auto;
  min-width: 0;
}

.standard-list-frame__query {
  padding: 10px 12px 8px;
}

.standard-list-frame__query :deep(.arco-form-item) {
  margin-bottom: 0;
}

.standard-list-frame__query :deep(.query-actions) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--dense-gap-inline);
  padding-bottom: 1px;
  white-space: nowrap;
}

.standard-list-frame__workflow {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 42px;
  padding: 0 12px;
  border-top: 1px solid var(--color-border-1);
}

.standard-list-frame__data {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.standard-list-frame__table {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--color-bg-card);
}

.standard-list-frame :deep(.table-cap-start),
.standard-list-frame :deep(.table-command-group),
.standard-list-frame :deep(.selection-context) {
  display: flex;
  align-items: center;
  min-width: 0;
}

.standard-list-frame :deep(.table-cap-start),
.standard-list-frame :deep(.table-command-group) {
  gap: 8px;
}

.standard-list-frame :deep(.table-command-group) {
  flex: 0 0 auto;
}

.standard-list-frame :deep(.selection-context) {
  gap: 2px;
}

.standard-list-frame :deep(.table-cap-tool),
.standard-list-frame :deep(.selection-tip) {
  color: var(--color-text-3);
}

.standard-list-frame :deep(.selection-tip) {
  font-size: var(--dense-font-aux);
}

.standard-list-frame :deep(.batch-result-alert) {
  flex-shrink: 0;
  margin: 8px 12px;
}

@media (max-width: 1199px) {
  .standard-list-frame__workflow,
  .standard-list-frame :deep(.table-command-group) {
    gap: 6px;
  }
}
</style>
