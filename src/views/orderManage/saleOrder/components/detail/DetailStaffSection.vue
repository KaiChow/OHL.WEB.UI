<script setup lang="ts">
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { companyOptions, staffRoleOptions } from '../../detailConfig';
import type { SaleOrderDetailModel } from '../../types';
import DetailSection from './DetailSection.vue';

defineProps<{
  detail: SaleOrderDetailModel;
  readonly: boolean;
}>();

const emit = defineEmits<{
  add: [];
  remove: [id: string];
}>();
</script>

<template>
  <detail-section title="责任人员">
    <template #actions>
      <a-button v-if="!readonly" size="small" type="outline" @click="emit('add')">
        <template #icon><icon-plus /></template>
        添加责任人
      </a-button>
    </template>

    <div v-if="readonly" class="staff-list">
      <span v-if="detail.StaffRows.length === 0" class="staff-inline__empty">暂未分配</span>
      <div v-for="row in detail.StaffRows" :key="row.id" class="staff-card">
        <span class="staff-card__role">{{ row.role }}</span>
        <span class="staff-card__name">{{ row.userName || '—' }}</span>
        <span class="staff-card__company" :title="row.company">{{ row.company }}</span>
      </div>
    </div>

    <div v-else class="detail-mini-table-wrap">
      <table class="detail-mini-table">
        <thead>
          <tr>
            <th>公司</th>
            <th>角色</th>
            <th>人员</th>
            <th class="detail-mini-table__op">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in detail.StaffRows" :key="row.id">
            <td>
              <a-select v-model="row.company" size="small">
                <a-option v-for="c in companyOptions" :key="c" :value="c">{{ c }}</a-option>
              </a-select>
            </td>
            <td>
              <a-select v-model="row.role" size="small">
                <a-option v-for="r in staffRoleOptions" :key="r" :value="r">{{ r }}</a-option>
              </a-select>
            </td>
            <td>
              <a-input v-model="row.userName" size="small" placeholder="请选择人员" />
            </td>
            <td class="detail-mini-table__op">
              <a-popconfirm content="确认删除该责任人员？" @ok="emit('remove', row.id)">
                <a-button size="small" type="text" status="danger">删除</a-button>
              </a-popconfirm>
            </td>
          </tr>
          <tr v-if="detail.StaffRows.length === 0">
            <td colspan="4" class="detail-mini-table__empty">点击“添加”分配责任人</td>
          </tr>
        </tbody>
      </table>
    </div>
  </detail-section>
</template>
