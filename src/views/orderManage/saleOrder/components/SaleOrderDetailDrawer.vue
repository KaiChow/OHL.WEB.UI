<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import type { DrawerMode } from '../../../../types/drawer';
import { getStatusLabel, getStatusPill, bizTypeOptions, importExportOptions, packingOptions } from '../config';
import {
  blFormatOptions,
  cargoTypeCheckboxOptions,
  carrierOptions,
  clearanceTermsOptions,
  companyOptions,
  declareMethodOptions,
  deliveryMethodOptions,
  orderTypeFlagOptions,
  portOptions,
  serviceItemOptions,
  staffRoleOptions,
  tradeTermsOptions,
  transportDetailTitle,
  transportTermsOptions,
  yesNoOptions
} from '../detailConfig';
import { calcCargoSummary, detailUid, emptyCargoItem } from '../composables/useSaleOrderDetailForm';
import type { SaleOrderDetailModel, SaleOrderRecord } from '../types';
import DetailSection from './detail/DetailSection.vue';
import DetailModule from './detail/DetailModule.vue';
import DetailCargoBlock from './detail/DetailCargoBlock.vue';

const props = defineProps<{
  visible: boolean;
  mode: DrawerMode;
  record: SaleOrderRecord | null;
  detail: SaleOrderDetailModel;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  save: [];
  submit: [];
  abandon: [];
  edit: [];
}>();

const readonly = computed(() => props.mode === 'view');

const drawerTitle = computed(() => {
  const prefix = transportDetailTitle[props.detail.TransportMode] ?? '业务单';
  if (props.mode === 'create') return `新建${prefix}`;
  return `${prefix} · ${props.detail.DcgNo || '—'}`;
});

const cargoSummary = computed(() => calcCargoSummary(props.detail.CargoBlocks));

const cargoExpanded = reactive<Record<string, boolean>>({});

watch(
  () => props.detail.CargoBlocks.map((b) => b.id),
  (ids) => {
    ids.forEach((id) => {
      if (cargoExpanded[id] === undefined) cargoExpanded[id] = true;
    });
    Object.keys(cargoExpanded).forEach((id) => {
      if (!ids.includes(id)) delete cargoExpanded[id];
    });
  },
  { immediate: true }
);

const isCargoExpanded = (id: string) => cargoExpanded[id] !== false;

const setCargoExpanded = (id: string, open: boolean) => {
  cargoExpanded[id] = open;
};

const close = () => emit('update:visible', false);

const addStaff = () => {
  props.detail.StaffRows.push({
    id: detailUid(),
    company: '深圳点达',
    role: '操作',
    userName: ''
  });
};

const removeStaff = (id: string) => {
  props.detail.StaffRows = props.detail.StaffRows.filter((r) => r.id !== id);
};

const addCargoBlock = () => {
  const block = {
    id: detailUid(),
    shipper: props.detail.Shipper,
    consignee: props.detail.Consignee,
    notifyParty: 'SAME AS CONSIGNEE',
    overseasAgent: '',
    vatNo: '',
    eoriNo: '',
    remark: '',
    items: [emptyCargoItem()]
  };
  props.detail.CargoBlocks.push(block);
  cargoExpanded[block.id] = true;
};

const addCargoItem = (blockId: string) => {
  const block = props.detail.CargoBlocks.find((b) => b.id === blockId);
  block?.items.push(emptyCargoItem());
};

const removeCargoItem = (blockId: string, itemId: string) => {
  const block = props.detail.CargoBlocks.find((b) => b.id === blockId);
  if (!block) return;
  block.items = block.items.filter((i) => i.id !== itemId);
};

const addCustoms = () => {
  props.detail.CustomsRows.push({
    id: detailUid(),
    shipper: props.detail.Shipper,
    declareMethod: '一般贸易',
    uploadTime: ''
  });
};

const addDelivery = () => {
  props.detail.DeliveryRows.push({
    id: detailUid(),
    hblNo: props.detail.DcgNo,
    destination: '',
    deliveryMethod: '卡派',
    expressCo: '',
    expressNo: '',
    privateWhNo: ''
  });
};

const addClearance = () => {
  props.detail.ClearanceRows.push({
    id: detailUid(),
    importer: '',
    eoriInfo: '',
    vatNo: '',
    invoiceNo: '',
    address: ''
  });
};

const removeCustoms = (id: string) => {
  props.detail.CustomsRows = props.detail.CustomsRows.filter((r) => r.id !== id);
};

const removeDelivery = (id: string) => {
  props.detail.DeliveryRows = props.detail.DeliveryRows.filter((r) => r.id !== id);
};

const removeClearance = (id: string) => {
  props.detail.ClearanceRows = props.detail.ClearanceRows.filter((r) => r.id !== id);
};

const removeCargoBlock = (id: string) => {
  if (props.detail.CargoBlocks.length <= 1) {
    Message.warning('至少保留一个货物块');
    return;
  }
  props.detail.CargoBlocks = props.detail.CargoBlocks.filter((b) => b.id !== id);
  delete cargoExpanded[id];
};

const onCopySplit = () => Message.info('复制分单数据（Mock）');

/** 复杂业务单详情：近全屏宽型抽屉（§17.1 全屏 / 大型复杂流程） */
const drawerWidth = 'calc(100vw - 32px)';
</script>

<template>
  <a-drawer
    :visible="visible"
    :width="drawerWidth"
    :footer="false"
    unmount-on-close
    class="detail-drawer"
    @cancel="close"
  >
    <template #title>{{ drawerTitle }}</template>

    <div class="detail-drawer-body">
      <div class="detail-drawer-status">
        <span v-if="record || mode !== 'create'" class="s-pill" :data-s="getStatusPill(detail.Status)">
          {{ getStatusLabel(detail.Status) }}
        </span>
        <span class="detail-drawer-status__no mono">{{ detail.DcgNo || '待生成单号' }}</span>
        <span class="detail-drawer-status__sub">归属公司：{{ detail.OwnerCompany }}</span>
        <a-button
          v-if="mode === 'view'"
          size="small"
          type="outline"
          class="detail-drawer-status__edit"
          @click="emit('edit')"
        >
          编辑
        </a-button>
      </div>

      <div class="detail-drawer-scroll">
        <!-- 概览 -->
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
              <a-checkbox-group v-model="detail.ServiceItems" :disabled="readonly">
                <a-checkbox v-for="item in serviceItemOptions" :key="item" :value="item">{{ item }}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </detail-section>

        <!-- 权限人员 -->
        <detail-section title="权限人员列表">
          <template #actions>
            <a-button v-if="!readonly" size="small" type="primary" @click="addStaff">
              <template #icon><icon-plus /></template>
              添加
            </a-button>
          </template>
          <div class="detail-mini-table-wrap">
            <table class="detail-mini-table">
              <thead>
                <tr>
                  <th>公司</th>
                  <th>角色</th>
                  <th>人员</th>
                  <th v-if="!readonly" class="detail-mini-table__op">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in detail.StaffRows" :key="row.id">
                  <td>
                    <a-select v-model="row.company" :disabled="readonly" size="small">
                      <a-option v-for="c in companyOptions" :key="c" :value="c">{{ c }}</a-option>
                    </a-select>
                  </td>
                  <td>
                    <a-select v-model="row.role" :disabled="readonly" size="small">
                      <a-option v-for="r in staffRoleOptions" :key="r" :value="r">{{ r }}</a-option>
                    </a-select>
                  </td>
                  <td>
                    <a-input v-model="row.userName" :disabled="readonly" size="small" placeholder="请选择人员" />
                  </td>
                  <td v-if="!readonly" class="detail-mini-table__op">
                    <a-button size="small" type="outline" status="danger" @click="removeStaff(row.id)">删除</a-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </detail-section>

        <!-- 基础信息 -->
        <detail-section title="基础信息">
          <a-form layout="vertical" :model="detail" size="small" class="detail-form">
            <div class="detail-form-grid detail-form-grid--6">
              <a-form-item label="收货地" required>
                <a-select v-model="detail.Pol" :disabled="readonly" allow-search>
                  <a-option v-for="p in portOptions" :key="'pol-' + p" :value="p">{{ p }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="起运港" required>
                <a-select v-model="detail.Pol" :disabled="readonly" allow-search>
                  <a-option v-for="p in portOptions" :key="'pol2-' + p" :value="p">{{ p }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="中转港">
                <a-select v-model="detail.Pot" :disabled="readonly" allow-clear allow-search>
                  <a-option v-for="p in portOptions" :key="'pot-' + p" :value="p">{{ p }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="目的港" required>
                <a-select v-model="detail.Pod" :disabled="readonly" allow-search>
                  <a-option v-for="p in portOptions" :key="'pod-' + p" :value="p">{{ p }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="目的地" required>
                <a-input v-model="detail.FinalDestination" :disabled="readonly" />
              </a-form-item>
              <a-form-item label="船公司">
                <a-select v-model="detail.Carrier" :disabled="readonly" allow-search>
                  <a-option v-for="c in carrierOptions" :key="c" :value="c">{{ c }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="航线">
                <a-input v-model="detail.Route" :disabled="readonly" />
              </a-form-item>
              <a-form-item label="船名航次">
                <a-input v-model="detail.VesselVoyage" :disabled="readonly" />
              </a-form-item>
              <a-form-item label="ETD" required>
                <a-date-picker v-model="detail.Etd" :disabled="readonly" style="width: 100%" />
              </a-form-item>
              <a-form-item label="ETA">
                <a-date-picker v-model="detail.Eta" :disabled="readonly" style="width: 100%" />
              </a-form-item>
              <a-form-item label="运输条款">
                <a-select v-model="detail.TransportTerms" :disabled="readonly">
                  <a-option v-for="t in transportTermsOptions" :key="t" :value="t">{{ t }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="贸易条款" required>
                <a-select v-model="detail.TradeTerms" :disabled="readonly">
                  <a-option v-for="t in tradeTermsOptions" :key="t" :value="t">{{ t }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="提单格式">
                <a-select v-model="detail.BlFormat" :disabled="readonly">
                  <a-option v-for="b in blFormatOptions" :key="b" :value="b">{{ b }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="预计仓库" required>
                <a-input v-model="detail.EstWarehouse" :disabled="readonly" />
              </a-form-item>
              <a-form-item label="预计进仓时间" required>
                <a-date-picker v-model="detail.EstInboundTime" :disabled="readonly" style="width: 100%" />
              </a-form-item>
              <a-form-item label="预计出仓时间">
                <a-date-picker v-model="detail.EstOutboundTime" :disabled="readonly" style="width: 100%" />
              </a-form-item>
              <a-form-item label="是否需要交接单抬头">
                <a-radio-group v-model="detail.NeedHandoverHeader" :disabled="readonly">
                  <a-radio :value="true">是</a-radio>
                  <a-radio :value="false">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="是否需要进仓拍照">
                <a-checkbox v-model="detail.NeedInboundPhoto" :disabled="readonly">需要</a-checkbox>
              </a-form-item>
              <a-form-item label="货物类型" class="detail-form-grid__span6">
                <a-checkbox-group v-model="detail.CargoTypes" :disabled="readonly">
                  <a-checkbox v-for="c in cargoTypeCheckboxOptions" :key="c" :value="c">{{ c }}</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="客户备注" class="detail-form-grid__span3">
                <a-textarea v-model="detail.CustomerRemark" :disabled="readonly" :auto-size="{ minRows: 2, maxRows: 4 }" />
              </a-form-item>
              <a-form-item label="海外代理备注" class="detail-form-grid__span3">
                <a-textarea v-model="detail.OverseasRemark" :disabled="readonly" :auto-size="{ minRows: 2, maxRows: 4 }" />
              </a-form-item>
            </div>
          </a-form>
        </detail-section>

        <!-- 附件 -->
        <detail-section title="附件">
          <a-form layout="vertical" :model="detail" size="small" class="detail-form">
            <a-form-item label="其他必传文件">
              <a-upload v-if="!readonly" action="/" :auto-upload="false">
                <template #upload-button>
                  <a-button size="small" type="outline">点击上传</a-button>
                </template>
              </a-upload>
              <span v-else class="sub-text">暂无附件</span>
            </a-form-item>
            <a-form-item label="备注">
              <a-textarea v-model="detail.AttachmentRemark" :disabled="readonly" :auto-size="{ minRows: 2 }" />
            </a-form-item>
          </a-form>
        </detail-section>

        <!-- 货物信息（可重复子项模块 §17.3.8） -->
        <detail-module
          title="货物信息"
          :badge="detail.CargoBlocks.length > 1 ? `${detail.CargoBlocks.length} 个发货人` : undefined"
        >
          <template #actions>
            <a-button size="small" type="outline" @click="onCopySplit">复制分单数据</a-button>
            <a-button v-if="!readonly" size="small" type="primary" @click="addCargoBlock">
              <template #icon><icon-plus /></template>
              添加发货人
            </a-button>
          </template>
          <template #summary>
            <div class="detail-module-summary detail-module-summary--inline">
              <div class="detail-module-summary__stats">
                <div class="detail-module-summary__stat detail-module-summary__stat--qty">
                  <span class="detail-module-summary__stat-label">总件数</span>
                  <span class="detail-module-summary__stat-value">{{ cargoSummary.qty.toLocaleString() }}</span>
                  <span class="detail-module-summary__stat-unit">件</span>
                </div>
                <div class="detail-module-summary__stat detail-module-summary__stat--weight">
                  <span class="detail-module-summary__stat-label">总毛重</span>
                  <span class="detail-module-summary__stat-value">{{ cargoSummary.weight.toLocaleString() }}</span>
                  <span class="detail-module-summary__stat-unit">KG</span>
                </div>
                <div class="detail-module-summary__stat detail-module-summary__stat--volume">
                  <span class="detail-module-summary__stat-label">总体积</span>
                  <span class="detail-module-summary__stat-value">{{ cargoSummary.volume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) }}</span>
                  <span class="detail-module-summary__stat-unit">CBM</span>
                </div>
              </div>
            </div>
          </template>

          <detail-cargo-block
            v-for="(block, idx) in detail.CargoBlocks"
            :key="block.id"
            :block="block"
            :index="idx"
            :readonly="readonly"
            :expanded="isCargoExpanded(block.id)"
            :can-delete="detail.CargoBlocks.length > 1"
            :is-last="idx === detail.CargoBlocks.length - 1"
            @update:expanded="setCargoExpanded(block.id, $event)"
            @add-item="addCargoItem(block.id)"
            @remove-item="removeCargoItem(block.id, $event)"
            @remove-block="removeCargoBlock(block.id)"
          />
        </detail-module>

        <!-- 报关 -->
        <detail-section title="报关信息">
          <template #actions>
            <a-button v-if="!readonly" size="small" type="primary" @click="addCustoms">
              <template #icon><icon-plus /></template>
              添加
            </a-button>
          </template>
          <div class="detail-mini-table-wrap">
            <table class="detail-mini-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>发货人</th>
                  <th>报关方式</th>
                  <th>上传时间</th>
                  <th v-if="!readonly" class="detail-mini-table__op">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in detail.CustomsRows" :key="row.id">
                  <td>{{ i + 1 }}</td>
                  <td><a-input v-model="row.shipper" :disabled="readonly" size="small" /></td>
                  <td>
                    <a-select v-model="row.declareMethod" :disabled="readonly" size="small">
                      <a-option v-for="m in declareMethodOptions" :key="m" :value="m">{{ m }}</a-option>
                    </a-select>
                  </td>
                  <td><a-input v-model="row.uploadTime" :disabled="readonly" size="small" /></td>
                  <td v-if="!readonly" class="detail-mini-table__op">
                    <a-button size="small" type="outline" status="danger" @click="removeCustoms(row.id)">删除</a-button>
                  </td>
                </tr>
                <tr v-if="detail.CustomsRows.length === 0">
                  <td :colspan="readonly ? 4 : 5" class="detail-mini-table__empty">暂无报关信息</td>
                </tr>
              </tbody>
            </table>
          </div>
        </detail-section>

        <!-- 尾端派送 -->
        <detail-section title="尾端派送信息">
          <template #actions>
            <a-button v-if="!readonly" size="small" type="primary" @click="addDelivery">
              <template #icon><icon-plus /></template>
              添加
            </a-button>
          </template>
          <div class="detail-mini-table-wrap">
            <table class="detail-mini-table detail-mini-table--wide">
              <thead>
                <tr>
                  <th>HBL 单号</th>
                  <th>目的地</th>
                  <th>派送方式</th>
                  <th>快递公司</th>
                  <th>快递单号</th>
                  <th>私人仓单号</th>
                  <th v-if="!readonly" class="detail-mini-table__op">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in detail.DeliveryRows" :key="row.id">
                  <td><a-input v-model="row.hblNo" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.destination" :disabled="readonly" size="small" /></td>
                  <td>
                    <a-select v-model="row.deliveryMethod" :disabled="readonly" size="small">
                      <a-option v-for="m in deliveryMethodOptions" :key="m" :value="m">{{ m }}</a-option>
                    </a-select>
                  </td>
                  <td><a-input v-model="row.expressCo" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.expressNo" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.privateWhNo" :disabled="readonly" size="small" /></td>
                  <td v-if="!readonly" class="detail-mini-table__op">
                    <a-button size="small" type="outline" status="danger" @click="removeDelivery(row.id)">删除</a-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </detail-section>

        <!-- 清关 -->
        <detail-section title="清关信息">
          <template #actions>
            <a-button v-if="!readonly" size="small" type="primary" @click="addClearance">
              <template #icon><icon-plus /></template>
              添加
            </a-button>
          </template>
          <a-form layout="vertical" :model="detail" size="small" class="detail-form">
            <div class="detail-form-grid detail-form-grid--4 detail-form-grid--compact">
              <a-form-item label="清关条款">
                <a-select v-model="detail.ClearanceTerms" :disabled="readonly" size="small" placeholder="请选择">
                  <a-option v-for="t in clearanceTermsOptions" :key="t" :value="t">{{ t }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="预付税金">
                <a-select v-model="detail.PrepaidTax" :disabled="readonly" size="small" placeholder="请选择">
                  <a-option v-for="y in yesNoOptions" :key="'pt-' + y" :value="y">{{ y }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="PVA 递延">
                <a-select v-model="detail.PvaDefer" :disabled="readonly" size="small" placeholder="请选择">
                  <a-option v-for="y in yesNoOptions" :key="'pv-' + y" :value="y">{{ y }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="海外代理费">
                <a-select v-model="detail.OverseasAgentFee" :disabled="readonly" size="small" placeholder="请选择">
                  <a-option v-for="y in yesNoOptions" :key="'oa-' + y" :value="y">{{ y }}</a-option>
                </a-select>
              </a-form-item>
            </div>
          </a-form>
          <div class="detail-mini-table-wrap">
            <table class="detail-mini-table detail-mini-table--wide">
              <thead>
                <tr>
                  <th>进口商</th>
                  <th>EORI 信息</th>
                  <th>VAT 号</th>
                  <th>发票号</th>
                  <th>注册地址</th>
                  <th v-if="!readonly" class="detail-mini-table__op">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in detail.ClearanceRows" :key="row.id">
                  <td><a-input v-model="row.importer" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.eoriInfo" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.vatNo" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.invoiceNo" :disabled="readonly" size="small" /></td>
                  <td><a-input v-model="row.address" :disabled="readonly" size="small" /></td>
                  <td v-if="!readonly" class="detail-mini-table__op">
                    <a-button size="small" type="outline" status="danger" @click="removeClearance(row.id)">删除</a-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </detail-section>

        <div class="detail-order-flags">
          <span class="detail-order-flags__label">订单类型</span>
          <a-checkbox-group v-model="detail.OrderTypeFlags" :disabled="readonly">
            <a-checkbox v-for="f in orderTypeFlagOptions" :key="f" :value="f">{{ f }}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>

      <!-- 固定底栏 §37.4 -->
      <footer class="detail-drawer-footer">
        <template v-if="mode === 'view'">
          <a-button @click="close">关闭</a-button>
          <a-button type="primary" @click="emit('edit')">编辑</a-button>
        </template>
        <template v-else>
          <a-button @click="close">取消</a-button>
          <a-button type="outline" status="danger" @click="emit('abandon')">废弃</a-button>
          <a-button type="outline" @click="emit('save')">保存</a-button>
          <a-button type="primary" @click="emit('submit')">提交</a-button>
        </template>
      </footer>
    </div>
  </a-drawer>
</template>
