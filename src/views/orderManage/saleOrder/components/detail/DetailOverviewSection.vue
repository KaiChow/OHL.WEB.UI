<script setup lang="ts">
import { bizTypeOptions, importExportOptions, packingOptions } from '../../config';
import { serviceItemOptions } from '../../detailConfig';
import type { SaleOrderDetailModel } from '../../types';
import DetailSection from './DetailSection.vue';

const props = defineProps<{
  detail: SaleOrderDetailModel;
  readonly: boolean;
}>();

function toggleService(item: string) {
  if (props.readonly) return;
  const idx = props.detail.ServiceItems.indexOf(item);
  if (idx === -1) props.detail.ServiceItems.push(item);
  else props.detail.ServiceItems.splice(idx, 1);
}
</script>

<template>
  <detail-section title="业务概览">
    <a-form layout="vertical" :model="detail" size="small" class="detail-form">
      <div class="detail-form-grid detail-form-grid--4">
        <a-form-item label="业务类型" required>
          <a-select v-model="detail.BizType" :disabled="readonly">
            <a-option v-for="opt in bizTypeOptions.filter((o) => o !== '全部')" :key="opt" :value="opt">{{ opt }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="装箱方式" required>
          <a-select v-model="detail.PackingMethod" :disabled="readonly">
            <a-option v-for="opt in packingOptions.filter((o) => o !== '全部')" :key="opt" :value="opt">{{ opt }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="客户">
          <a-input v-model="detail.Customer" :disabled="readonly" placeholder="请输入客户" />
        </a-form-item>
        <a-form-item label="PO">
          <a-input v-model="detail.Po" :disabled="readonly" placeholder="请输入 PO" />
        </a-form-item>
        <a-form-item label="业务单号">
          <a-input v-model="detail.DcgNo" :disabled="readonly" placeholder="留空自动生成" />
        </a-form-item>
        <a-form-item label="进/出口">
          <a-select v-model="detail.ImportExport" :disabled="readonly">
            <a-option v-for="opt in importExportOptions.filter((o) => o !== '全部')" :key="opt" :value="opt">{{ opt }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="服务范围" class="detail-form-grid__span2">
          <a-input v-model="detail.ServiceScope" :disabled="readonly" placeholder="请输入服务范围" />
        </a-form-item>
      </div>
      <a-form-item label="服务项">
        <div class="svc-tags">
          <span
            v-for="item in serviceItemOptions"
            :key="item"
            role="checkbox"
            tabindex="0"
            class="svc-tag"
            :class="{ 'svc-tag--on': detail.ServiceItems.includes(item) }"
            :aria-checked="detail.ServiceItems.includes(item)"
            :aria-disabled="readonly"
            @click="toggleService(item)"
            @keydown.enter.prevent="toggleService(item)"
            @keydown.space.prevent="toggleService(item)"
          >{{ item }}</span>
        </div>
      </a-form-item>
    </a-form>
  </detail-section>
</template>
