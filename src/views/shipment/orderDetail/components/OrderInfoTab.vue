<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import {
  IconCopy,
  IconDown,
  IconPlus,
  IconDelete,
  IconUpload,
} from '@arco-design/web-vue/es/icon';
import type {
  CabinetRow,
  CargoLine,
  CargoPartyBlock,
  CustomsRow,
  ShipmentOrderDetailRecord,
  WarehouseRow,
} from '../types';

const props = defineProps<{
  record: ShipmentOrderDetailRecord;
}>();

const basicFormModel = {};
const cargoFormModel = {};

const cloneRows = <T>(rows: T[]): T[] => JSON.parse(JSON.stringify(toRaw(rows))) as T[];

const cargoBlocks = ref<CargoPartyBlock[]>([]);
const cabinetRows = ref<CabinetRow[]>([]);
const customsRows = ref<CustomsRow[]>([]);
const warehouseRows = ref<WarehouseRow[]>([]);
const expandedCargoIds = ref<string[]>([]);

const resetRecordRows = (record: ShipmentOrderDetailRecord) => {
  cargoBlocks.value = cloneRows(record.cargoBlocks);
  cabinetRows.value = cloneRows(record.cabinetRows);
  customsRows.value = cloneRows(record.customsRows);
  warehouseRows.value = cloneRows(record.warehouseRows);
  expandedCargoIds.value = cargoBlocks.value.map((item) => item.id);
};

watch(() => props.record, resetRecordRows, { immediate: true });

const flowTabs = computed(() => props.record.flowTabs);

const toggleCargo = (id: string) => {
  expandedCargoIds.value = expandedCargoIds.value.includes(id)
    ? expandedCargoIds.value.filter((item) => item !== id)
    : [...expandedCargoIds.value, id];
};

const isCargoExpanded = (id: string) => expandedCargoIds.value.includes(id);

const copySplitData = () => Message.success('已复制分单数据');
const copySuborderData = () => Message.success('已复制分单数据到当前对象');
const handleInlineAction = (label: string) => Message.success(`${label}已加入本地预览流程`);
const handleUpload = (label: string) => Message.info(`${label}上传流程待接入后端`);

const confirmDelete = (label: string, onOk: () => void) => {
  Modal.confirm({
    title: `确认删除${label}`,
    content: `删除后将移除当前${label}，是否继续？`,
    okButtonProps: { status: 'danger', size: 'small' },
    onOk,
  });
};

const addCargoLine = (cargoId: string) => {
  cargoBlocks.value = cargoBlocks.value.map((block) =>
    block.id === cargoId
      ? {
          ...block,
          lines: [
            ...block.lines,
            {
              id: `${cargoId}-line-${Date.now()}`,
              zhName: '',
              enName: '',
              cartons: '',
              hsCode: '',
              containerNo: block.lines[0]?.containerNo ?? '',
              qty: 0,
              packageUnit: 'CTNS',
              grossWeight: 0,
              volume: 0,
            },
          ],
        }
      : block,
  );
  Message.success('已新增货物明细行');
};

const removeCargoLine = (cargoId: string, lineId: string) => {
  cargoBlocks.value = cargoBlocks.value.map((block) =>
    block.id === cargoId
      ? { ...block, lines: block.lines.filter((line) => line.id !== lineId) }
      : block,
  );
  Message.success('已删除货物明细行');
};

const addCabinetRow = () => {
  cabinetRows.value = [
    ...cabinetRows.value,
    {
      id: `cab-${Date.now()}`,
      containerType: 'LCL',
      containerNo: '',
      sealNo: '',
      soNo: '',
      qty: 0,
      packageUnit: 'CTNS',
      grossWeight: 0,
      volume: 0,
      planDeliveryTime: '',
      actualDeliveryTime: '',
      pickupTime: '',
      returnTime: '',
      loadingTime: '',
      releaseStatus: '否',
      weightVolumeRatio: '',
    },
  ];
  Message.success('已新增装柜行');
};

const removeCabinetRow = (rowId: string) => {
  cabinetRows.value = cabinetRows.value.filter((row) => row.id !== rowId);
  Message.success('已删除装柜行');
};

const addCustomsRow = () => {
  customsRows.value = [
    ...customsRows.value,
    {
      id: `customs-${Date.now()}`,
      company: '',
      sender: '',
      customsFile: '',
      customsNo: '',
      qty: '',
      packageUnit: '',
      grossWeight: '',
      volume: '',
      customsMethod: '代理报关',
      customsStatus: '未报关',
      releaseStatus: '否',
      uploadTime: '',
      releaseBookingTime: '',
      customsSheet: '点击上传',
      finalConfirmTime: '',
    },
  ];
  Message.success('已新增报关信息行');
};

const removeCustomsRow = (rowId: string) => {
  customsRows.value = customsRows.value.filter((row) => row.id !== rowId);
  Message.success('已删除报关信息行');
};

const addWarehouseRow = () => {
  warehouseRows.value = [
    ...warehouseRows.value,
    {
      id: `warehouse-${Date.now()}`,
      storageNo: '',
      checkSheet: '点击上传',
      sender: '',
      destination: '',
      actualInboundDate: '',
      fbaNo: '',
      pickupLabel: '',
      qty: 0,
      packageUnit: '包装单位',
      grossWeight: 0,
      volume: 0,
      driverPhone: '',
      storageImage: '',
      actionLabel: '删除',
    },
  ];
  Message.success('已新增入仓信息行');
};

const removeWarehouseRow = (rowId: string) => {
  warehouseRows.value = warehouseRows.value.filter((row) => row.id !== rowId);
  Message.success('已删除入仓信息行');
};

const serviceActive = (label: string) => props.record.enabledServices.includes(label);
const orderTypeActive = (label: string) =>
  props.record.basicInfo.orderTypeTags.some((item) => item.label === label && item.active);
</script>

<template>
  <div class="detail-drawer-scroll">
    <div class="detail-section detail-section--core">
      <div class="detail-section__head">
        <div class="detail-section__title-group">
          <h4 class="detail-section__title">订单信息</h4>
        </div>
        <div class="detail-section__actions">
          <a-button size="small" type="outline" @click="copySplitData">
            <template #icon><icon-copy /></template>
            复制
          </a-button>
        </div>
      </div>
      <div class="detail-section__body">
        <div class="dds-milestone-bar">
          <div class="dds-milestone">
            <div
              v-for="item in flowTabs"
              :key="item.label"
              class="dds-milestone__item"
              :data-state="item.state"
            >
              {{ item.label }}
            </div>
          </div>
        </div>

        <a-form class="detail-form" layout="vertical" size="small" :model="basicFormModel">
          <div class="form-subgroup">
            <div class="form-subgroup__head">
              <span class="form-subgroup__title">订单信息</span>
            </div>
            <div class="detail-form-grid detail-form-grid--4">
              <a-form-item label="业务单号">
                <a-input :model-value="props.record.orderNo" size="small" disabled />
              </a-form-item>
              <a-form-item label="HBL单号">
                <a-input :model-value="props.record.hblNo" size="small" />
              </a-form-item>
              <a-form-item label="入仓单号">
                <a-input :model-value="props.record.inStorageNo" size="small" />
              </a-form-item>
              <a-form-item label="下单日期">
                <a-input :model-value="props.record.orderDate" size="small" disabled />
              </a-form-item>

              <a-form-item label="截包时间">
                <a-input :model-value="props.record.operationOrderDate" size="small" disabled />
              </a-form-item>
              <a-form-item label="MBL单号">
                <a-input :model-value="props.record.mblNo" size="small" />
              </a-form-item>
              <a-form-item label="业务类型">
                <a-select :model-value="props.record.businessType" size="small">
                  <a-option value="FBA">FBA</a-option>
                  <a-option value="海运整箱">海运整箱</a-option>
                  <a-option value="海运拼箱">海运拼箱</a-option>
                </a-select>
              </a-form-item>
              <a-form-item label="装箱方式">
                <a-select :model-value="props.record.packageMode" size="small">
                  <a-option value="LCL GROUP（自拼）">LCL GROUP（自拼）</a-option>
                  <a-option value="FCL">FCL</a-option>
                </a-select>
              </a-form-item>

              <a-form-item label="客户订单编号" class="detail-form-grid__span2">
                <a-input :model-value="props.record.customerOrderNo" size="small" />
              </a-form-item>
              <a-form-item label="客户">
                <div class="detail-combo detail-combo--action">
                  <a-input :model-value="props.record.customerName" size="small" />
                  <a-button size="small" type="outline" @click="handleInlineAction('复制客户')">
                    复制
                  </a-button>
                </div>
              </a-form-item>
              <a-form-item label="不统计统计">
                <div class="svc-tags">
                  <button
                    v-for="stat in props.record.orderStats"
                    :key="stat.label"
                    type="button"
                    class="svc-tag"
                    :class="{ 'svc-tag--on': stat.value }"
                  >
                    {{ stat.label }}
                  </button>
                </div>
              </a-form-item>

              <a-form-item label="服务范围">
                <a-input :model-value="props.record.serviceScope" size="small" disabled />
              </a-form-item>
              <a-form-item label="工厂电放时间" class="detail-form-grid__span2">
                <a-input :model-value="props.record.billModifyTime" size="small" disabled />
              </a-form-item>
              <a-form-item label="船前时间" class="detail-form-grid__span2">
                <a-input :model-value="props.record.vesselTime" size="small" disabled />
              </a-form-item>
            </div>

            <div class="form-subgroup">
              <div class="form-subgroup__head">
                <span class="form-subgroup__title">服务项</span>
              </div>
              <div class="svc-tags">
                <button
                  v-for="label in ['订舱', '驳船', '拖车', '仓库内装', '报关', '保险', '清关', '派送']"
                  :key="label"
                  type="button"
                  class="svc-tag"
                  :class="{ 'svc-tag--on': serviceActive(label) }"
                >
                  {{ label }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-subgroup">
            <div class="form-subgroup__head">
              <span class="form-subgroup__title">基础信息</span>
            </div>
            <div class="detail-form-grid detail-form-grid--4">
              <template v-for="field in props.record.basicInfo.firstRow" :key="`${field.label}-${field.value}`">
                <a-form-item :label="field.required ? `* ${field.label}` : field.label">
                  <div v-if="field.code" class="detail-combo detail-combo--code-name">
                    <a-input :model-value="field.code" size="small" />
                    <a-input :model-value="field.value" size="small" />
                  </div>
                  <a-input v-else :model-value="field.value" size="small" />
                </a-form-item>
              </template>

              <template v-for="field in props.record.basicInfo.secondRow" :key="`${field.label}-${field.value}`">
                <a-form-item :label="field.required ? `* ${field.label}` : field.label">
                  <a-input :model-value="field.value" size="small" />
                </a-form-item>
              </template>

              <template v-for="field in props.record.basicInfo.thirdRow" :key="`${field.label}-${field.value}`">
                <a-form-item :label="field.required ? `* ${field.label}` : field.label">
                  <a-input :model-value="field.value" size="small" />
                </a-form-item>
              </template>

              <template v-for="field in props.record.basicInfo.fourthRow" :key="`${field.label}-${field.value}`">
                <a-form-item :label="field.required ? `* ${field.label}` : field.label">
                  <a-input :model-value="field.value" size="small" />
                </a-form-item>
              </template>

              <template v-for="field in props.record.basicInfo.fifthRow" :key="`${field.label}-${field.value}`">
                <a-form-item :label="field.required ? `* ${field.label}` : field.label">
                  <a-input :model-value="field.value" size="small" />
                </a-form-item>
              </template>

              <template v-for="field in props.record.basicInfo.sixthRow" :key="`${field.label}-${field.value}`">
                <a-form-item :label="field.required ? `* ${field.label}` : field.label">
                  <a-input :model-value="field.value" size="small" />
                </a-form-item>
              </template>
            </div>

            <div class="form-subgroup">
              <div class="form-subgroup__head">
                <span class="form-subgroup__title">货物类型</span>
              </div>
              <div class="svc-tags">
                <button
                  v-for="type in props.record.basicInfo.goodsTypes"
                  :key="type.label"
                  type="button"
                  class="svc-tag"
                  :class="{ 'svc-tag--on': type.active, 'svc-tag--risk': type.risk }"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>

            <div class="detail-form-grid detail-form-grid--4">
              <a-form-item
                v-for="remark in props.record.basicInfo.bottomRemarks"
                :key="remark.label"
                :label="remark.label"
                class="detail-form-grid__span2"
              >
                <a-textarea :model-value="remark.value" size="small" :auto-size="{ minRows: 2, maxRows: 3 }" />
              </a-form-item>
              <a-form-item label="订单类型" class="detail-form-grid__span4">
                <div class="svc-tags">
                  <button
                    v-for="tag in props.record.basicInfo.orderTypeTags"
                    :key="tag.label"
                    type="button"
                    class="svc-tag"
                    :class="{ 'svc-tag--on': orderTypeActive(tag.label) }"
                  >
                    {{ tag.label }}
                  </button>
                </div>
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__head">
        <div class="detail-section__title-group">
          <h4 class="detail-section__title">货物信息</h4>
          <div class="detail-data-stats">
            <div class="detail-data-stats__item">
              <span class="detail-data-stats__label">总件数</span>
              <span class="detail-data-stats__val">100</span>
            </div>
            <div class="detail-data-stats__item">
              <span class="detail-data-stats__label">总毛重</span>
              <span class="detail-data-stats__val">100KG</span>
            </div>
            <div class="detail-data-stats__item">
              <span class="detail-data-stats__label">总体积</span>
              <span class="detail-data-stats__val">10CBM</span>
            </div>
          </div>
        </div>
        <div class="detail-section__actions">
          <a-button size="small" type="outline" @click="copySuborderData">
            <template #icon><icon-copy /></template>
            复制分单数据
          </a-button>
        </div>
      </div>
      <div class="detail-section__body">
        <div class="detail-module__summary">
          <div class="detail-module-summary--inline detail-module-summary--cargo">
            <div class="detail-module-summary__stats">
              <div class="detail-module-summary__stat detail-module-summary__stat--qty">
                <span class="detail-module-summary__stat-label">总件数</span>
                <span class="detail-module-summary__stat-value">100</span>
              </div>
              <div class="detail-module-summary__stat detail-module-summary__stat--weight">
                <span class="detail-module-summary__stat-label">总毛重</span>
                <span class="detail-module-summary__stat-value">100</span>
                <span class="detail-module-summary__stat-unit">KG</span>
              </div>
              <div class="detail-module-summary__stat detail-module-summary__stat--volume">
                <span class="detail-module-summary__stat-label">总体积</span>
                <span class="detail-module-summary__stat-value">10</span>
                <span class="detail-module-summary__stat-unit">CBM</span>
              </div>
            </div>
            <div class="detail-module-summary__actions">
              <a-button size="small" type="outline" @click="handleInlineAction('新增货物信息')">
                <template #icon><icon-plus /></template>
                添加货物信息
              </a-button>
            </div>
          </div>
        </div>

        <div class="detail-module__sublist">
          <div
            v-for="(block, index) in cargoBlocks"
            :key="block.id"
            class="detail-module__subitem"
            :class="{
              'detail-module__subitem--expanded': isCargoExpanded(block.id),
              'detail-module__subitem--collapsed': !isCargoExpanded(block.id),
            }"
          >
            <div class="detail-cargo-block__head detail-cargo-block__head--compact" @click="toggleCargo(block.id)">
              <div class="detail-cargo-block__index">{{ index + 1 }}</div>
              <div class="detail-cargo-block__meta">
                <div class="detail-cargo-block__title">{{ block.title }}</div>
                <div class="detail-data-stats">
                  <div class="detail-data-stats__item">
                    <span class="detail-data-stats__label">总件数</span>
                    <span class="detail-data-stats__val">{{ block.totalQty }}</span>
                  </div>
                  <div class="detail-data-stats__item">
                    <span class="detail-data-stats__label">总毛重</span>
                    <span class="detail-data-stats__val">{{ block.totalWeight }}KG</span>
                  </div>
                  <div class="detail-data-stats__item">
                    <span class="detail-data-stats__label">总体积</span>
                    <span class="detail-data-stats__val">{{ block.totalVolume }}CBM</span>
                  </div>
                </div>
              </div>
              <a-button size="small" type="text" class="row-action-btn row-action-btn--more">
                <template #icon><icon-down /></template>
              </a-button>
            </div>

            <div v-if="isCargoExpanded(block.id)" class="detail-cargo-block__body detail-cargo-block__body--compact">
              <a-form class="detail-form" layout="vertical" size="small" :model="cargoFormModel">
                <div class="detail-form-grid detail-form-grid--4">
                  <a-form-item label="* 发货人" class="detail-form-grid__span2">
                    <a-textarea :model-value="`${block.senderName}\n${block.senderAddress}`" size="small" :auto-size="{ minRows: 2, maxRows: 3 }" />
                  </a-form-item>
                  <a-form-item label="* 收货人" class="detail-form-grid__span2">
                    <a-textarea :model-value="`${block.consigneeName}\n${block.consigneeAddress}`" size="small" :auto-size="{ minRows: 2, maxRows: 3 }" />
                  </a-form-item>
                  <a-form-item label="* 通知人" class="detail-form-grid__span2">
                    <a-textarea :model-value="`${block.notifyName}\n${block.notifyAddress}`" size="small" :auto-size="{ minRows: 2, maxRows: 3 }" />
                  </a-form-item>
                  <a-form-item label="* 海外代理" class="detail-form-grid__span2">
                    <a-textarea :model-value="`${block.overseasAgent}\n${block.overseasAgentAddress}`" size="small" :auto-size="{ minRows: 2, maxRows: 3 }" />
                  </a-form-item>
                  <a-form-item label="VAT">
                    <a-input :model-value="block.vat" size="small" />
                  </a-form-item>
                  <a-form-item label="EORI">
                    <a-input :model-value="block.eori" size="small" />
                  </a-form-item>
                  <a-form-item label="备注" class="detail-form-grid__span4">
                    <a-textarea :model-value="block.remark" size="small" :auto-size="{ minRows: 2, maxRows: 3 }" />
                  </a-form-item>
                </div>
              </a-form>

              <div class="detail-child-pane detail-child-pane--compact detail-child-pane--lines">
                <div class="detail-child-pane__head">
                  <div>
                    <div class="detail-child-pane__title">货物明细</div>
                    <div class="detail-child-pane__desc">每条货物明细归属于当前发货人/收货人组合</div>
                  </div>
                  <div class="detail-section__actions">
                    <a-button size="small" type="outline" @click="addCargoLine(block.id)">
                      <template #icon><icon-plus /></template>
                      添加品名
                    </a-button>
                    <a-button size="small" type="text" @click="handleInlineAction('复制货物信息')">
                      <template #icon><icon-copy /></template>
                      复制货物
                    </a-button>
                  </div>
                </div>
                <div class="detail-child-pane__table detail-child-pane__table--fit">
                  <vxe-table :row-config="{ isHover: true, keyField: 'id', height: 38 }"
                    border="none"
                    size="small"
                    class="detail-mini-vxe detail-mini-vxe--editable detail-mini-vxe--fit"
                    :data="block.lines"
                  >
                    <vxe-column type="seq" title="序号" width="52" align="center" />
                    <vxe-column field="zhName" title="中文品名" min-width="160">
                      <template #default="{ row }">
                        <a-input :model-value="row.zhName" size="small" placeholder="请输入中文品名" />
                      </template>
                    </vxe-column>
                    <vxe-column field="enName" title="英文品名" min-width="160">
                      <template #default="{ row }">
                        <a-input :model-value="row.enName" size="small" placeholder="请输入英文品名" />
                      </template>
                    </vxe-column>
                    <vxe-column field="cartons" title="唛头" min-width="120">
                      <template #default="{ row }">
                        <a-input :model-value="row.cartons" size="small" placeholder="请输入唛头" />
                      </template>
                    </vxe-column>
                    <vxe-column field="hsCode" title="HS CODE" min-width="120">
                      <template #default="{ row }">
                        <a-input :model-value="row.hsCode" size="small" placeholder="请输入HsCode" />
                      </template>
                    </vxe-column>
                    <vxe-column field="containerNo" title="柜号" min-width="120">
                      <template #default="{ row }">
                        <a-select :model-value="row.containerNo" size="small">
                          <a-option :value="row.containerNo">{{ row.containerNo }}</a-option>
                        </a-select>
                      </template>
                    </vxe-column>
                    <vxe-column field="qty" title="* 件数" min-width="90">
                      <template #default="{ row }">
                        <a-input-number :model-value="row.qty" size="small" :min="0" />
                      </template>
                    </vxe-column>
                    <vxe-column field="packageUnit" title="包装单位" min-width="110">
                      <template #default="{ row }">
                        <a-select :model-value="row.packageUnit" size="small">
                          <a-option value="CTNS">CTNS</a-option>
                          <a-option value="PLTS">PLTS</a-option>
                        </a-select>
                      </template>
                    </vxe-column>
                    <vxe-column field="grossWeight" title="* 毛重(KG)" min-width="100">
                      <template #default="{ row }">
                        <a-input-number :model-value="row.grossWeight" size="small" :min="0" />
                      </template>
                    </vxe-column>
                    <vxe-column field="volume" title="* 体积(CBM)" min-width="100">
                      <template #default="{ row }">
                        <a-input-number :model-value="row.volume" size="small" :min="0" />
                      </template>
                    </vxe-column>
                    <vxe-column title="操作" width="88" fixed="right" align="center">
                      <template #default="{ row }">
                        <div class="row-actions">
                          <a-tooltip content="添加混装">
                            <a-button size="small" type="text" class="row-action-btn" @click="handleInlineAction('添加混装')">
                              <template #icon><icon-plus /></template>
                            </a-button>
                          </a-tooltip>
                          <a-popconfirm content="确认删除该货物明细？" @ok="removeCargoLine(block.id, row.id)">
                            <a-tooltip content="删除">
                              <a-button size="small" type="text" status="danger" class="row-action-btn">
                                <template #icon><icon-delete /></template>
                              </a-button>
                            </a-tooltip>
                          </a-popconfirm>
                        </div>
                      </template>
                    </vxe-column>
                  </vxe-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__head">
        <div class="detail-section__title-group">
          <h4 class="detail-section__title">装柜信息</h4>
        </div>
        <div class="detail-section__actions">
          <a-button size="small" type="outline" @click="addCabinetRow">
            <template #icon><icon-plus /></template>
            清除柜封号
          </a-button>
        </div>
      </div>
      <div class="detail-section__body detail-section__body--table">
        <vxe-table :row-config="{ isHover: true, keyField: 'id', height: 38 }"
          border="none"
          size="small"
          class="detail-mini-vxe detail-mini-vxe--editable"
          :data="cabinetRows"
        >
          <vxe-column field="containerType" title="柜型" min-width="80">
            <template #default="{ row }">
              <a-select :model-value="row.containerType" size="small">
                <a-option value="LCL">LCL</a-option>
                <a-option value="40HQ">40HQ</a-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="containerNo" title="柜号" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.containerNo" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="sealNo" title="封号" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.sealNo" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="soNo" title="SO号" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.soNo" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="qty" title="件数" min-width="80">
            <template #default="{ row }">
              <a-input-number :model-value="row.qty" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="packageUnit" title="包装单位" min-width="100">
            <template #default="{ row }">
              <a-select :model-value="row.packageUnit" size="small">
                <a-option value="CTNS">CTNS</a-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="grossWeight" title="毛重(KG)" min-width="100">
            <template #default="{ row }">
              <a-input-number :model-value="row.grossWeight" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="volume" title="体积(CBM)" min-width="100">
            <template #default="{ row }">
              <a-input-number :model-value="row.volume" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="planDeliveryTime" title="预计派送时间" min-width="140">
            <template #default="{ row }">
              <a-input :model-value="row.planDeliveryTime || '请选择时间'" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="actualDeliveryTime" title="实际派送时间" min-width="140">
            <template #default="{ row }">
              <a-input :model-value="row.actualDeliveryTime || '请选择时间'" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="pickupTime" title="起运港提柜时间" min-width="150">
            <template #default="{ row }">
              <a-input :model-value="row.pickupTime || '请选择时间'" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="returnTime" title="起运港还柜时间" min-width="150">
            <template #default="{ row }">
              <a-input :model-value="row.returnTime || '请选择时间'" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="loadingTime" title="装船时间" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.loadingTime || '请选择时间'" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="releaseStatus" title="海关放行状态" min-width="100" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.releaseStatus === '否' ? 'wait' : 'rel'">{{ row.releaseStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="weightVolumeRatio" title="重量体积比" min-width="90">
            <template #default="{ row }">
              <a-input :model-value="row.weightVolumeRatio" size="small" />
            </template>
          </vxe-column>
          <vxe-column title="操作" width="72" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-popconfirm content="确认删除当前装柜信息？" @ok="removeCabinetRow(row.id)">
                  <a-tooltip content="删除">
                    <a-button size="small" type="text" status="danger" class="row-action-btn">
                      <template #icon><icon-delete /></template>
                    </a-button>
                  </a-tooltip>
                </a-popconfirm>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__head">
        <div class="detail-section__title-group">
          <h4 class="detail-section__title">报关信息</h4>
        </div>
        <div class="detail-section__actions">
          <a-button size="small" type="outline" @click="addCustomsRow">
            <template #icon><icon-plus /></template>
            新增报关票数
          </a-button>
        </div>
      </div>
      <div class="detail-section__body detail-section__body--table">
        <vxe-table :row-config="{ isHover: true, keyField: 'id', height: 38 }"
          border="none"
          size="small"
          class="detail-mini-vxe detail-mini-vxe--editable"
          :data="customsRows"
        >
          <vxe-column field="company" title="报关公司" min-width="140">
            <template #default="{ row }">
              <a-input :model-value="row.company" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="sender" title="发货人" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.sender" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="customsNo" title="关单号" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.customsNo" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="qty" title="件数" min-width="80">
            <template #default="{ row }">
              <a-input :model-value="row.qty" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="packageUnit" title="包装单位" min-width="100">
            <template #default="{ row }">
              <a-select :model-value="row.packageUnit" size="small">
                <a-option value="请选择">请选择</a-option>
                <a-option value="CTNS">CTNS</a-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="grossWeight" title="毛重(KG)" min-width="100">
            <template #default="{ row }">
              <a-input :model-value="row.grossWeight" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="volume" title="体积(CBM)" min-width="100">
            <template #default="{ row }">
              <a-input :model-value="row.volume" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="customsMethod" title="报关方式" min-width="110">
            <template #default="{ row }">
              <a-select :model-value="row.customsMethod" size="small">
                <a-option value="代理报关">代理报关</a-option>
                <a-option value="自理报关">自理报关</a-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="customsStatus" title="报关状态" min-width="90" align="center">
            <template #default="{ row }">
              <a-select :model-value="row.customsStatus" size="small">
                <a-option value="未报关">未报关</a-option>
                <a-option value="已报关">已报关</a-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="releaseStatus" title="是否放行" min-width="90" align="center">
            <template #default="{ row }">
              <span class="s-pill" :data-s="row.releaseStatus === '否' ? 'wait' : 'rel'">{{ row.releaseStatus }}</span>
            </template>
          </vxe-column>
          <vxe-column field="customsSheet" title="报关单" min-width="120">
            <template #default="{ row }">
              <span class="link-text" @click="handleUpload('报关单')">{{ row.customsSheet }}</span>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="72" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-popconfirm content="确认删除当前报关信息？" @ok="removeCustomsRow(row.id)">
                  <a-tooltip content="删除">
                    <a-button size="small" type="text" status="danger" class="row-action-btn">
                      <template #icon><icon-delete /></template>
                    </a-button>
                  </a-tooltip>
                </a-popconfirm>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__head">
        <div class="detail-section__title-group">
          <h4 class="detail-section__title">入仓信息</h4>
          <div class="detail-data-stats">
            <div class="detail-data-stats__item">
              <span class="detail-data-stats__label">总件数</span>
              <span class="detail-data-stats__val">100</span>
            </div>
            <div class="detail-data-stats__item">
              <span class="detail-data-stats__label">总毛重</span>
              <span class="detail-data-stats__val">100.000KG</span>
            </div>
            <div class="detail-data-stats__item">
              <span class="detail-data-stats__label">总体积</span>
              <span class="detail-data-stats__val">10.0000CBM</span>
            </div>
          </div>
        </div>
        <div class="detail-section__actions">
          <a-button size="small" type="outline" @click="addWarehouseRow">
            <template #icon><icon-plus /></template>
            三方仓入仓数据
          </a-button>
        </div>
      </div>
      <div class="detail-section__body detail-section__body--table">
        <vxe-table :row-config="{ isHover: true, keyField: 'id', height: 38 }"
          border="none"
          size="small"
          class="detail-mini-vxe detail-mini-vxe--editable"
          :data="warehouseRows"
        >
          <vxe-column field="storageNo" title="入仓单号" min-width="120" />
          <vxe-column field="checkSheet" title="入仓核实单" min-width="120">
            <template #default="{ row }">
              <span class="link-text" @click="handleUpload('入仓核实单')">{{ row.checkSheet }}</span>
            </template>
          </vxe-column>
          <vxe-column field="sender" title="发货人" min-width="120" />
          <vxe-column field="destination" title="目的地" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.destination" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="actualInboundDate" title="实际进仓日期" min-width="140">
            <template #default="{ row }">
              <a-input :model-value="row.actualInboundDate || '请选择时间'" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="fbaNo" title="FBA号" min-width="100">
            <template #default="{ row }">
              <a-input :model-value="row.fbaNo" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="pickupLabel" title="理货标签" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.pickupLabel" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="qty" title="件数" min-width="80">
            <template #default="{ row }">
              <a-input-number :model-value="row.qty" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="packageUnit" title="包装单位" min-width="100">
            <template #default="{ row }">
              <a-select :model-value="row.packageUnit" size="small">
                <a-option value="包装单位">包装单位</a-option>
                <a-option value="CTNS">CTNS</a-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="grossWeight" title="毛重(KG)" min-width="100">
            <template #default="{ row }">
              <a-input-number :model-value="row.grossWeight" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="volume" title="体积(CBM)" min-width="100">
            <template #default="{ row }">
              <a-input-number :model-value="row.volume" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="driverPhone" title="司机电话" min-width="120">
            <template #default="{ row }">
              <a-input :model-value="row.driverPhone" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="storageImage" title="进仓图片" min-width="100">
            <template #default>
              <a-checkbox size="small" />
            </template>
          </vxe-column>
          <vxe-column title="操作" width="72" fixed="right" align="center">
            <template #default="{ row }">
              <div class="row-actions">
                <a-popconfirm content="确认删除当前入仓信息？" @ok="removeWarehouseRow(row.id)">
                  <a-tooltip content="删除">
                    <a-button size="small" type="text" status="danger" class="row-action-btn">
                      <template #icon><icon-delete /></template>
                    </a-button>
                  </a-tooltip>
                </a-popconfirm>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
