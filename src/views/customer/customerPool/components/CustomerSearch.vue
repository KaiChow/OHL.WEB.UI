<script setup lang="ts">
import { ref } from 'vue';
import { IconDown, IconUp } from '@arco-design/web-vue/es/icon';
import {
  customerTypeOptions,
  customerLevelOptions,
  countryOptions,
  tradeTermsOptions,
  transportModeOptions,
  tagOptions,
  yesNoOptions
} from '../config';
import type { CustomerQuery } from '../types';

const props = defineProps<{
  query: CustomerQuery;
  filterExpanded: boolean;
}>();

const emit = defineEmits<{
  search: [];
  reset: [];
  'update:filterExpanded': [value: boolean];
}>();

const toggleExpand = () => {
  emit('update:filterExpanded', !props.filterExpanded);
};
</script>

<template>
  <div class="zone-l2-filter-card zone-card filter-card">
    <div class="filter-card__main">
      <div class="filter-card__fields">
        <!-- 基础行 -->
        <div class="filter-card__body--basic">
          <div class="filter-grid">
            <div class="filter-field">
              <label class="filter-field__label">客户名称</label>
              <a-input
                v-model="query.name"
                size="small"
                placeholder="请输入客户名称"
                allow-clear
                @press-enter="emit('search')"
              />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">客户类型</label>
              <a-select
                v-model="query.customerType"
                size="small"
                placeholder="请选择"
                allow-clear
                @change="emit('search')"
              >
                <a-option
                  v-for="opt in customerTypeOptions"
                  :key="opt.value"
                  :value="opt.value"
                >{{ opt.label }}</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">客户等级</label>
              <a-select
                v-model="query.level"
                size="small"
                placeholder="请选择"
                allow-clear
                @change="emit('search')"
              >
                <a-option
                  v-for="opt in customerLevelOptions"
                  :key="opt.value"
                  :value="opt.value"
                >{{ opt.label }}</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">国家</label>
              <a-select
                v-model="query.country"
                size="small"
                placeholder="请选择"
                allow-clear
                @change="emit('search')"
              >
                <a-option
                  v-for="opt in countryOptions"
                  :key="opt.value"
                  :value="opt.value"
                >{{ opt.label }}</a-option>
              </a-select>
            </div>
            <div class="filter-field">
              <label class="filter-field__label">邮箱</label>
              <a-input
                v-model="query.email"
                size="small"
                placeholder="联系人邮箱"
                allow-clear
                @press-enter="emit('search')"
              />
            </div>
            <div class="filter-field">
              <label class="filter-field__label">关键字</label>
              <a-input
                v-model="query.keyword"
                size="small"
                placeholder="客户名/联系人/品名"
                allow-clear
                @press-enter="emit('search')"
              />
            </div>
          </div>
        </div>

        <!-- 高级行 -->
        <div class="filter-card__advanced" :class="{ 'filter-card__advanced--open': filterExpanded }">
          <div class="filter-card__advanced-inner">
            <div class="filter-grid filter-grid--advanced">
              <div class="filter-field">
                <label class="filter-field__label">所在部门/组</label>
                <a-input v-model="query.department" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">对接销售</label>
                <a-input v-model="query.sales" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">对接运营</label>
                <a-input v-model="query.operation" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">含有标签</label>
                <a-select
                  v-model="query.includeTags"
                  size="small"
                  placeholder="请选择"
                  allow-clear
                  multiple
                >
                  <a-option v-for="tag in tagOptions" :key="tag" :value="tag">{{ tag }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">排除标签</label>
                <a-select
                  v-model="query.excludeTags"
                  size="small"
                  placeholder="请选择"
                  allow-clear
                  multiple
                >
                  <a-option v-for="tag in tagOptions" :key="tag" :value="tag">{{ tag }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">联系人职务</label>
                <a-input v-model="query.contactTitle" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">联系人</label>
                <a-input v-model="query.contactName" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">联系人电话</label>
                <a-input v-model="query.contactPhone" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">运输方式</label>
                <a-select v-model="query.transportMode" size="small" placeholder="请选择" allow-clear>
                  <a-option v-for="opt in transportModeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">贸易条款</label>
                <a-select v-model="query.tradeTerms" size="small" placeholder="请选择" allow-clear>
                  <a-option v-for="opt in tradeTermsOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
                </a-select>
              </div>
              <div class="filter-field">
                <label class="filter-field__label">品名</label>
                <a-input v-model="query.productName" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">自填POL</label>
                <a-input v-model="query.pol" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">自填POD</label>
                <a-input v-model="query.pod" size="small" placeholder="请输入" allow-clear />
              </div>
              <div class="filter-field">
                <label class="filter-field__label">是否含异常邮箱</label>
                <a-select v-model="query.hasAbnormalEmail" size="small" placeholder="请选择" allow-clear>
                  <a-option v-for="opt in yesNoOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-option>
                </a-select>
              </div>
              <div class="filter-field filter-field--span2">
                <label class="filter-field__label">最后更新时间</label>
                <a-range-picker
                  :model-value="[query.lastUpdatedStart, query.lastUpdatedEnd]"
                  size="small"
                  style="width:100%"
                  @change="(v: string[]) => { query.lastUpdatedStart = v?.[0] || ''; query.lastUpdatedEnd = v?.[1] || ''; }"
                />
              </div>
              <div class="filter-field filter-field--span2">
                <label class="filter-field__label">创建时间</label>
                <a-range-picker
                  :model-value="[query.createdStart, query.createdEnd]"
                  size="small"
                  style="width:100%"
                  @change="(v: string[]) => { query.createdStart = v?.[0] || ''; query.createdEnd = v?.[1] || ''; }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-card__actions-col">
        <div class="filter-card__actions-primary">
          <a-button size="small" type="primary" @click="emit('search')">查询</a-button>
          <a-button size="small" type="text" class="reset-btn" @click="emit('reset')">重置</a-button>
        </div>
        <div class="filter-expand-link--col">
          <button type="button" class="filter-expand-link" @click="toggleExpand">
            <template v-if="filterExpanded">
              收起 <icon-up />
            </template>
            <template v-else>
              展开 <icon-down />
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
