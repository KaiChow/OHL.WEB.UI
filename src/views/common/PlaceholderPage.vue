<script setup lang="ts">
defineProps<{
  title: string;
  objectName: string;
}>();
</script>

<template>
  <div class="page-root page-root--dense">
    <div class="zone-l2-filter-card zone-card filter-card">
      <div class="filter-card__main">
        <div class="filter-card__fields">
          <div class="filter-card__body--basic">
            <div class="filter-grid">
              <div class="filter-field">
                <label class="filter-field__label">{{ objectName }}关键词</label>
                <a-input size="small" placeholder="请输入关键词" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">状态</label>
                <a-select size="small" placeholder="请选择状态" allow-clear />
              </div>
            </div>
          </div>
        </div>
        <div class="filter-card__actions-col">
          <div class="filter-card__actions-primary">
            <a-button size="small" type="primary">查询</a-button>
            <a-button size="small" type="text" class="reset-btn">重置</a-button>
          </div>
        </div>
      </div>
    </div>

    <div class="zone-l4-table-card zone-card">
      <div class="table-card-cap">
        <div class="table-card-cap__right">
          <a-button type="text" class="table-card-cap__tool" title="列显示">
            <template #icon><icon-settings /></template>
          </a-button>
        </div>
      </div>
      <div class="table-wrap">
        <div class="state-center">
          <icon-file class="state-empty-icon" />
          <span>{{ title }}页面待按业务对象补充</span>
        </div>
      </div>
    </div>
  </div>
</template>
