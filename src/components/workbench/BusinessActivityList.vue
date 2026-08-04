<script setup lang="ts">
export interface BusinessActivityItem {
  id: string | number;
  title: string;
  actor?: string;
  time: string;
  dateTime?: string;
}

defineProps<{
  items: readonly BusinessActivityItem[];
  emptyText: string;
}>();
</script>

<template>
  <a-list v-if="items.length" class="business-activity-list" size="small" :bordered="false" :split="true">
    <a-list-item v-for="item in items" :key="item.id">
      <div class="business-activity-list__row">
        <span class="business-activity-list__event" :title="item.title">{{ item.title }}</span>
        <div class="business-activity-list__meta">
          <span v-if="item.actor" class="business-activity-list__actor" :title="item.actor">{{ item.actor }}</span>
          <time class="business-activity-list__time tabular" :datetime="item.dateTime || undefined">{{ item.time }}</time>
        </div>
      </div>
    </a-list-item>
  </a-list>
  <div v-else class="business-activity-list__empty" role="status">{{ emptyText }}</div>
</template>

<style scoped>
.business-activity-list {
  max-width: 860px;
}

.business-activity-list__row {
  width: 100%;
  min-width: 0;
  min-height: 32px;
  display: grid;
  grid-template-columns: minmax(220px, 520px) minmax(0, auto);
  align-items: center;
  justify-content: start;
  gap: 16px;
}

.business-activity-list__event {
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: var(--dense-font-data);
  font-weight: var(--dense-weight-control);
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-activity-list__meta {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(96px, 140px) 140px;
  align-items: center;
  gap: 12px;
}

.business-activity-list__actor,
.business-activity-list__time {
  overflow: hidden;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-activity-list__empty {
  min-height: 36px;
  display: flex;
  align-items: center;
  color: var(--color-text-3);
  font-size: var(--dense-font-aux);
}

@media (max-width: 760px) {
  .business-activity-list__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
    padding-block: 4px;
  }

  .business-activity-list__meta {
    grid-template-columns: minmax(88px, max-content) minmax(128px, max-content);
    justify-content: start;
  }
}
</style>
