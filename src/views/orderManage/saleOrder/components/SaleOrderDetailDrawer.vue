<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import type { DrawerMode } from '../../../../types/drawer';
import { getStatusPill } from '../config';
import {
  clearanceTermsOptions,
  declareMethodOptions,
  deliveryMethodOptions,
  orderTypeFlagOptions,
  transportDetailTitle,
  yesNoOptions
} from '../detailConfig';
import { calcCargoSummary, detailUid, emptyCargoItem } from '../composables/useSaleOrderDetailForm';
import type { SaleOrderDetailModel, SaleOrderRecord } from '../types';
import DetailSection from './detail/DetailSection.vue';
import DetailModule from './detail/DetailModule.vue';
import DetailCargoBlock from './detail/DetailCargoBlock.vue';
import DetailAttachmentSection from './detail/DetailAttachmentSection.vue';
import DetailHeaderHero from './detail/DetailHeaderHero.vue';
import DetailOverviewSection from './detail/DetailOverviewSection.vue';
import DetailStaffSection from './detail/DetailStaffSection.vue';
import DetailBasicSection from './detail/DetailBasicSection.vue';
import type { DetailAttachmentRow } from '../types';

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
  'view-full': [];
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

const uploadAttachment = (row: DetailAttachmentRow) => {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const fileNo = row.files.length + 1;
  const file = {
    id: `${row.id}-${Date.now()}`,
    name: row.multiple ? `${row.docType}-${fileNo}.pdf` : `${row.docType}.pdf`,
    size: row.multiple ? '328 KB' : '246 KB',
    uploader: props.detail.Operator || '操作A',
    uploadTime: now,
    status: 'uploaded' as const
  };
  row.files = row.multiple ? [...row.files, file] : [file];
  row.fileName = row.files.length === 1 ? row.files[0].name : `${row.files.length} 个文件`;
  row.status = 'uploaded';
  row.uploader = file.uploader;
  row.uploadTime = file.uploadTime;
  Message.success(`${row.docType}已上传`);
};

const removeAttachment = (rowId: string, fileId?: string) => {
  const row = props.detail.AttachmentRows.find((item) => item.id === rowId);
  if (!row) return;
  row.files = fileId ? row.files.filter((file) => file.id !== fileId) : [];
  const lastFile = row.files.at(-1);
  row.fileName = row.files.length > 1 ? `${row.files.length} 个文件` : (lastFile?.name ?? '');
  row.status = lastFile?.status ?? 'missing';
  row.uploader = lastFile?.uploader ?? '';
  row.uploadTime = lastFile?.uploadTime ?? '';
  Message.success(`${row.docType}已删除`);
};

/** 复杂业务单详情：近全屏宽型抽屉（§17.1 全屏 / 大型复杂流程） */
const drawerWidth = 'calc(100vw - 32px)';

/** 当前流程步骤（0-based）基于业务单状态 */
const STEP_STATUS_MAP: Record<string, number> = {
  draft: 0, wait: 0,
  booked: 1,
  so: 2, inbound: 2,
  customs: 3,
  sailing: 4, op: 4,
  arrived: 5, acc: 5,
  partial: 4, rel: 4,
};
const currentStep = computed(() => STEP_STATUS_MAP[getStatusPill(props.detail.Status)] ?? 0);
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

      <detail-header-hero
        :detail="detail"
        :mode="mode"
        :record="record"
        :current-step="currentStep"
        @edit="emit('edit')"
        @view-full="emit('view-full')"
      />

      <!-- ④ 主体：顶部摘要已承载关键资料，主体只保留业务录入内容 -->
      <div class="dds-body">

        <div class="detail-drawer-scroll dds-main">
        <detail-overview-section :detail="detail" :readonly="readonly" />

        <detail-staff-section
          :detail="detail"
          :readonly="readonly"
          @add="addStaff"
          @remove="removeStaff"
        />

        <detail-basic-section :detail="detail" :readonly="readonly" />

        <!-- 附件 -->
        <detail-section title="附件">
          <detail-attachment-section
            :rows="detail.AttachmentRows"
            :remark="detail.AttachmentRemark"
            :readonly="readonly"
            @upload="uploadAttachment"
            @remove="removeAttachment"
            @update:remark="detail.AttachmentRemark = $event"
          />
        </detail-section>

        <!-- 货物信息（可重复子项模块 §17.3.8） -->
        <detail-module
          title="货物信息"
        >
          <template #actions>
            <a-button size="small" type="outline" @click="onCopySplit">复制分单数据</a-button>
            <a-button v-if="!readonly" size="small" type="outline" @click="addCargoBlock">
              <template #icon><icon-plus /></template>
              添加发货人
            </a-button>
          </template>
          <template #summary>
            <div class="detail-module-summary detail-module-summary--inline detail-module-summary--cargo">
              <div class="detail-module-summary__stats">
                <div class="detail-module-summary__stat">
                  <span class="detail-module-summary__stat-label">发货人</span>
                  <span class="detail-module-summary__stat-value">{{ detail.CargoBlocks.length }}</span>
                  <span class="detail-module-summary__stat-unit">个</span>
                </div>
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
            <a-button v-if="!readonly" size="small" type="outline" @click="addCustoms">
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
                    <a-popconfirm content="确认删除该报关信息？" @ok="removeCustoms(row.id)">
                      <a-button size="small" type="text" status="danger">删除</a-button>
                    </a-popconfirm>
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
            <a-button v-if="!readonly" size="small" type="outline" @click="addDelivery">
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
                    <a-popconfirm content="确认删除该派送信息？" @ok="removeDelivery(row.id)">
                      <a-button size="small" type="text" status="danger">删除</a-button>
                    </a-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </detail-section>

        <!-- 清关 -->
        <detail-section title="清关信息">
          <template #actions>
            <a-button v-if="!readonly" size="small" type="outline" @click="addClearance">
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
                    <a-popconfirm content="确认删除该清关进口商？" @ok="removeClearance(row.id)">
                      <a-button size="small" type="text" status="danger">删除</a-button>
                    </a-popconfirm>
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
        </div><!-- /dds-main -->

      </div><!-- /dds-body -->

      <!-- 固定底栏 §37.4 -->
      <footer class="detail-drawer-footer">
        <template v-if="mode === 'view'">
          <a-button @click="close">关闭</a-button>
          <a-button type="primary" @click="emit('edit')">编辑</a-button>
        </template>
        <template v-else>
          <a-button @click="close">取消</a-button>
          <a-popconfirm content="确认废弃该业务单？" @ok="emit('abandon')">
            <a-button status="danger">废弃</a-button>
          </a-popconfirm>
          <a-button @click="emit('save')">保存</a-button>
          <a-button type="primary" @click="emit('submit')">提交</a-button>
        </template>
      </footer>
    </div>
  </a-drawer>
</template>

<style scoped>
/* ══════════════════════════════════════════════════════════
   布局骨架
   ══════════════════════════════════════════════════════════ */

/* 主体：单列内容区。顶部摘要已展示关键资料，避免右侧重复摘要挤压表单。 */
.dds-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.dds-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
</style>
