<script setup lang="ts">
import { computed } from 'vue';
import type { DrawerMode } from '../../../../types/drawer';
import { getStatusLabel, getStatusPill, bizTypeOptions, importExportOptions, packingOptions } from '../config';
import type { SaleOrderFormModel, SaleOrderRecord } from '../types';

const props = defineProps<{
  visible: boolean;
  mode: DrawerMode;
  record: SaleOrderRecord | null;
  formModel: SaleOrderFormModel;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  save: [];
  edit: [];
}>();

const title = computed(() => {
  if (props.mode === 'create') return '创建业务单';
  if (props.mode === 'edit') return `编辑 · ${props.record?.DcgNo ?? ''}`;
  return props.record?.DcgNo ?? '业务单详情';
});

const close = () => emit('update:visible', false);
</script>

<template>
  <a-drawer
    :visible="visible"
    :width="640"
    :footer="false"
    unmount-on-close
    @cancel="close"
  >
    <template #title>{{ title }}</template>

    <div class="drawer-body">
      <div v-if="mode === 'view' && record" class="drawer-status-banner">
        <span class="s-pill" :data-s="getStatusPill(record.Status)">{{ getStatusLabel(record.Status) }}</span>
        <span class="mono sub-text">{{ record.OrderNo }}</span>
        <a-button size="small" type="outline" style="margin-left: auto" @click="emit('edit')">编辑</a-button>
      </div>

      <div class="drawer-content">
        <template v-if="mode === 'view' && record">
          <a-descriptions :column="2" size="small" bordered>
            <a-descriptions-item label="业务单号">{{ record.DcgNo }}</a-descriptions-item>
            <a-descriptions-item label="订单编号">{{ record.OrderNo }}</a-descriptions-item>
            <a-descriptions-item label="业务类型">{{ record.BizType }}</a-descriptions-item>
            <a-descriptions-item label="货物类型">{{ record.CargoType }}</a-descriptions-item>
            <a-descriptions-item label="进/出口">{{ record.ImportExport }}</a-descriptions-item>
            <a-descriptions-item label="装箱方式">{{ record.PackingMethod }}</a-descriptions-item>
            <a-descriptions-item label="业务员">{{ record.Salesman }}</a-descriptions-item>
            <a-descriptions-item label="操作员">{{ record.Operator }}</a-descriptions-item>
            <a-descriptions-item label="客服">{{ record.CustomerService }}</a-descriptions-item>
            <a-descriptions-item label="柜型柜量">{{ record.ContainerInfo }}</a-descriptions-item>
            <a-descriptions-item label="发货人" :span="2">{{ record.Shipper }}</a-descriptions-item>
            <a-descriptions-item label="收货人" :span="2">{{ record.Consignee }}</a-descriptions-item>
            <a-descriptions-item label="提交时间" :span="2">{{ record.SubmitTime }}</a-descriptions-item>
          </a-descriptions>
        </template>

        <a-form v-else layout="vertical" :model="formModel" size="small">
          <a-row :gutter="12">
            <a-col :span="12">
              <a-form-item label="业务单号" field="DcgNo">
                <a-input v-model="formModel.DcgNo" placeholder="留空自动生成" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="业务类型" field="BizType">
                <a-select v-model="formModel.BizType">
                  <a-option v-for="opt in bizTypeOptions.filter((o) => o !== '全部')" :key="opt" :value="opt">
                    {{ opt }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="货物类型" field="CargoType">
                <a-input v-model="formModel.CargoType" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="进/出口" field="ImportExport">
                <a-select v-model="formModel.ImportExport">
                  <a-option v-for="opt in importExportOptions.filter((o) => o !== '全部')" :key="opt" :value="opt">
                    {{ opt }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="装箱方式" field="PackingMethod">
                <a-select v-model="formModel.PackingMethod">
                  <a-option v-for="opt in packingOptions.filter((o) => o !== '全部')" :key="opt" :value="opt">
                    {{ opt }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="柜型柜量" field="ContainerInfo">
                <a-input v-model="formModel.ContainerInfo" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="业务员" field="Salesman">
                <a-input v-model="formModel.Salesman" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="操作员" field="Operator">
                <a-input v-model="formModel.Operator" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="客服" field="CustomerService">
                <a-input v-model="formModel.CustomerService" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="发货人" field="Shipper">
                <a-input v-model="formModel.Shipper" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="收货人" field="Consignee">
                <a-input v-model="formModel.Consignee" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="drawer-footer">
        <a-button @click="close">{{ mode === 'view' ? '关闭' : '取消' }}</a-button>
        <a-button v-if="mode !== 'view'" type="primary" @click="emit('save')">保存</a-button>
      </div>
    </div>
  </a-drawer>
</template>
