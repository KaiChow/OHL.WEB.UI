<script setup lang="ts">
import { IconClose, IconFullscreen, IconFullscreenExit, IconPlus } from '@arco-design/web-vue/es/icon';
import { nextTick, reactive, ref, watch } from 'vue';
import { statusColorMap, statusTextMap } from '../config';
import type { SaleOrderRow } from '../types';

const props = defineProps<{ selectedOrder: SaleOrderRow | null }>();
const visible = defineModel<boolean>('visible', { required: true });

const SIDER_WIDTH = 248;
const fullscreen = ref(false);
const drawerWidth = ref(`calc(100vw - ${SIDER_WIDTH}px)`);
watch(fullscreen, (v) => { drawerWidth.value = v ? '100vw' : `calc(100vw - ${SIDER_WIDTH}px)`; });

// ── 锚点导航
const anchors = [
  { key: 'top-info',   label: '基本信息', icon: '📋' },
  { key: 'personnel',  label: '权限人员', icon: '👥' },
  { key: 'basic-info', label: '基础信息', icon: '🚢' },
  { key: 'attachment', label: '附件',     icon: '📎' },
  { key: 'order-type', label: '订单类型', icon: '🏷️' },
  { key: 'cargo',      label: '货物信息', icon: '📦' },
  { key: 'delivery',   label: '尾端派送', icon: '🚚' },
  { key: 'customs',    label: '清关信息', icon: '🛃' },
];
const activeAnchor = ref('top-info');
const scrollRef = ref<HTMLElement | null>(null);

const scrollToAnchor = (key: string) => {
  activeAnchor.value = key;
  nextTick(() => {
    const el = document.getElementById(`ds-${key}`);
    if (el && scrollRef.value) {
      scrollRef.value.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
    }
  });
};

let raf: number | null = null;
const onScroll = () => {
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    if (!scrollRef.value) return;
    const top = scrollRef.value.scrollTop;
    let cur = anchors[0].key;
    for (const { key } of anchors) {
      const el = document.getElementById(`ds-${key}`);
      if (el && el.offsetTop - 40 <= top) cur = key;
    }
    activeAnchor.value = cur;
  });
};

watch(visible, async (v) => {
  if (v) {
    await nextTick();
    scrollRef.value?.addEventListener('scroll', onScroll);
  } else {
    scrollRef.value?.removeEventListener('scroll', onScroll);
    if (raf) cancelAnimationFrame(raf);
    activeAnchor.value = 'top-info';
  }
});

// ── 权限人员列表
const personnel = reactive([
  { id: 1, company: 'DCGSZ', role: '业务', name: 'yue' },
  { id: 2, company: 'PTPSZ', role: '操作', name: 'Yedda' },
  { id: 3, company: '', role: '客服', name: '' },
  { id: 4, company: '', role: '文件', name: '' },
  { id: 5, company: '', role: '单证客服', name: '' },
]);
const addPersonnel = () => personnel.push({ id: Date.now(), company: '', role: '业务', name: '' });
const removePersonnel = (id: number) => { const i = personnel.findIndex(p => p.id === id); if (i > -1) personnel.splice(i, 1); };

// ── 服务项
const serviceItems = reactive({
  订舱: true, 驳船: false, 拖车: false, 仓库内装: false,
  报关: true, 保险: false, 清关: true, 派送: true, 监管仓服务: false
});

// ── 基础信息
const basicInfo = reactive({
  loadPort: '', loadPortEn: '', transitPort: '', destPort: '', destPlace: '',
  shipCompany: '', contractNo: '', route: '', shipName: '', shipVoyage: '',
  etd: '', eta: '', termsCarriage: 'CY-CY', transportMode: '海运',
  tradeTerms: 'DAP', billFormat: 'PTP', blFormat: 'OHL提单', freightFee: '',
  warehouse: '', hblSign: '', mblSign: '', paymentMode: 'FREIGHT PREPAID',
  readyTime: '', dmdt: '', productName: '', needHandover: '需要',
  storage: '', containerType: '',
  cargoTypes: { 普货: false, 危险货: true, 电池: false, 化工品: false, '液体/粉末': false, 食品: false },
  customerRemark: '', overseasRemark: ''
});
const attachments = reactive([
  { label: '海运运输鉴定报告', required: true },
  { label: 'MSDS', required: true },
  { label: 'UN.38.3电池检测报告', required: false },
  { label: '急包证', required: false },
  { label: 'MDGF', required: false },
  { label: '所需其它文件', required: false },
]);
const attachmentRemark = ref('');
const orderType = ref('多家拼');

// ── 货物信息
const cargoList = reactive([{
  id: 1, expanded: true,
  shipper: '', shipperDetail: '', consignee: '', consigneeDetail: '',
  notifyParty: 'SAME AS CONSIGNEE', overseasAgent: '', overseasAgentDetail: '',
  vat: '', eori: '', contactName: '', contactEmail: '', contactPhone: '', remark: ''
}]);
const addCargo = () => cargoList.push({ id: Date.now(), expanded: true, shipper: '', shipperDetail: '', consignee: '', consigneeDetail: '', notifyParty: 'SAME AS CONSIGNEE', overseasAgent: '', overseasAgentDetail: '', vat: '', eori: '', contactName: '', contactEmail: '', contactPhone: '', remark: '' });
const removeCargo = (id: number) => { const i = cargoList.findIndex(c => c.id === id); if (i > -1) cargoList.splice(i, 1); };

// ── 尾端派送
const deliveryList = reactive([
  { id: 1, hbl: '', dest: '亚马逊', needReturn: false, returnPoint: '', label: 'A4B1', deliveryMode: '卡车', courier: '', courierNo: '', privateWarehouse: '', qty: '', unit: 'CTNS', count: '', weight: '' }
]);
const addDelivery = () => deliveryList.push({ id: Date.now(), hbl: '', dest: '', needReturn: false, returnPoint: '', label: '', deliveryMode: '', courier: '', courierNo: '', privateWarehouse: '', qty: '', unit: 'CTNS', count: '', weight: '' });
const removeDelivery = (id: number) => { const i = deliveryList.findIndex(d => d.id === id); if (i > -1) deliveryList.splice(i, 1); };

// ── 清关信息
const customsInfo = reactive({ terms: 'FOB', prepayTax: '否', pvaDeferred: '否', overseasFee: '', customerPay: '' });
const customsImporters = reactive([
  { id: 1, importer: '', eori: '', vat: '', invoiceNo: '', address: '', fasCustoms: '', authDoc: '', packingInvoice: '' }
]);
const addImporter = () => customsImporters.push({ id: Date.now(), importer: '', eori: '', vat: '', invoiceNo: '', address: '', fasCustoms: '', authDoc: '', packingInvoice: '' });
const removeImporter = (id: number) => { const i = customsImporters.findIndex(c => c.id === id); if (i > -1) customsImporters.splice(i, 1); };

watch(() => props.selectedOrder, (order) => {
  if (!order) return;
  basicInfo.loadPort = order.LoaddingPortEn || '';
  basicInfo.destPort = order.DeliveryPortEn || '';
  basicInfo.shipCompany = order.ShipCompany || '';
  basicInfo.etd = order.Etd || '';
  basicInfo.eta = order.Eta || '';
  basicInfo.route = order.RouteName || '';
}, { immediate: true });
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    class="order-detail-drawer"
    :width="drawerWidth"
    :footer="false"
    :header="false"
    unmount-on-close
    @cancel="visible = false"
  >
    <!-- ── 顶部标题栏 -->
    <div class="ds-topbar">
      <div class="ds-topbar-left">
        <span class="ds-topbar-type">海运业务单</span>
        <span class="ds-topbar-divider">/</span>
        <span class="ds-topbar-no">{{ selectedOrder?.DcgNo || selectedOrder?.OrderNo || '-' }}</span>
        <a-tag v-if="selectedOrder" size="small" :color="statusColorMap[selectedOrder.FollowState]">
          <span class="status-dot" />{{ statusTextMap[selectedOrder.FollowState] }}
        </a-tag>
      </div>
      <div class="ds-topbar-right">
        <a-button type="text" size="small" @click="fullscreen = !fullscreen">
          <template #icon><icon-fullscreen-exit v-if="fullscreen" /><icon-fullscreen v-else /></template>
        </a-button>
        <a-button type="text" size="small" @click="visible = false">
          <template #icon><icon-close /></template>
        </a-button>
      </div>
    </div>

    <!-- ── 主体：滚动内容 + 锚点侧栏 -->
    <div class="ds-body">

      <!-- 滚动内容区 -->
      <div ref="scrollRef" class="ds-scroll">

        <!-- 基本信息 -->
        <div id="ds-top-info" class="ds-card">
          <div class="ds-top-grid">
            <div class="ds-field"><span class="ds-label">业务类型</span>
              <a-select size="small" class="ds-ctrl" placeholder="请选择业务类型" default-value="FBA">
                <a-option value="FBA">FBA</a-option><a-option value="自营">自营</a-option>
              </a-select>
            </div>
            <div class="ds-field ds-field--req"><span class="ds-label">装箱方式</span>
              <a-select size="small" class="ds-ctrl" default-value="FCL">
                <a-option value="FCL">FCL</a-option><a-option value="LCL">LCL</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">客户</span>
              <a-input size="small" class="ds-ctrl" :model-value="selectedOrder?.CustomerName" placeholder="请选择客户" />
            </div>
            <div class="ds-field"><span class="ds-label">PO</span>
              <a-input size="small" class="ds-ctrl" placeholder="请输入PO" />
            </div>
            <div class="ds-field"><span class="ds-label">业务单号</span>
              <a-input size="small" class="ds-ctrl" :model-value="selectedOrder?.OrderNo" readonly />
            </div>
            <div class="ds-field"><span class="ds-label">服务范围</span>
              <a-input size="small" class="ds-ctrl" placeholder="请选择服务范围" />
            </div>
          </div>
          <div class="ds-service-row">
            <span class="ds-label-sm">服务项</span>
            <div class="ds-checks">
              <a-checkbox v-for="(_, key) in serviceItems" :key="key" v-model="serviceItems[key]" size="small">{{ key }}</a-checkbox>
            </div>
          </div>
        </div>

        <!-- 权限人员列表 -->
        <div id="ds-personnel" class="ds-section">
          <div class="ds-sec-head">
            <span class="ds-sec-title">权限人员列表</span>
            <span class="ds-sec-sub">归属公司：</span>
            <div style="flex:1"/>
            <a-button size="mini" type="primary" @click="addPersonnel"><template #icon><icon-plus /></template>添加</a-button>
          </div>
          <div class="ds-personnel-list">
            <div v-for="p in personnel" :key="p.id" class="ds-personnel-row">
              <span class="ds-label-sm">公司：</span>
              <a-select v-model="p.company" size="small" style="width:110px" placeholder="请选择">
                <a-option value="DCGSZ">DCGSZ</a-option><a-option value="PTPSZ">PTPSZ</a-option>
              </a-select>
              <a-select v-model="p.role" size="small" style="width:90px">
                <a-option v-for="r in ['业务','操作','客服','文件','单证客服']" :key="r" :value="r">{{ r }}</a-option>
              </a-select>
              <a-input v-model="p.name" size="small" style="width:120px" placeholder="姓名" />
              <a-button size="mini" status="danger" @click="removePersonnel(p.id)">删除</a-button>
            </div>
          </div>
        </div>

        <!-- 基础信息 -->
        <div id="ds-basic-info" class="ds-section">
          <div class="ds-sec-head"><span class="ds-sec-title">基础信息</span></div>
          <div class="ds-basic-grid">
            <div class="ds-field ds-field--req"><span class="ds-label">起运港</span>
              <div style="display:flex;gap:4px">
                <a-input v-model="basicInfo.loadPort" size="small" style="width:72px" placeholder="代码" />
                <a-input v-model="basicInfo.loadPortEn" size="small" style="flex:1" placeholder="全称" />
              </div>
            </div>
            <div class="ds-field"><span class="ds-label">中转港</span><a-input v-model="basicInfo.transitPort" size="small" class="ds-ctrl" placeholder="请选择中转港" /></div>
            <div class="ds-field ds-field--req"><span class="ds-label">目的港</span><a-input v-model="basicInfo.destPort" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择目的港" /></div>
            <div class="ds-field"><span class="ds-label">目的地</span><a-input v-model="basicInfo.destPlace" size="small" class="ds-ctrl" placeholder="请选择目的地" /></div>

            <div class="ds-field ds-field--req"><span class="ds-label">船司</span><a-input v-model="basicInfo.shipCompany" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择船司" /></div>
            <div class="ds-field"><span class="ds-label">合约号</span><a-input v-model="basicInfo.contractNo" size="small" class="ds-ctrl" placeholder="请选择船司合约号" /></div>
            <div class="ds-field"><span class="ds-label">航线</span><a-input v-model="basicInfo.route" size="small" class="ds-ctrl" placeholder="请选择航线" /></div>
            <div class="ds-field"><span class="ds-label ds-label--accent">大船船名/航次</span>
              <div style="display:flex;gap:4px">
                <a-input v-model="basicInfo.shipName" size="small" style="flex:1" placeholder="请选择船名" />
                <a-input v-model="basicInfo.shipVoyage" size="small" style="width:90px" placeholder="请选择航次" />
              </div>
            </div>

            <div class="ds-field ds-field--req"><span class="ds-label">ETD</span><a-date-picker v-model="basicInfo.etd" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择ETD" format="YYYY-MM-DD" /></div>
            <div class="ds-field"><span class="ds-label">ETA</span><a-date-picker v-model="basicInfo.eta" size="small" class="ds-ctrl" placeholder="请选择ETA" format="YYYY-MM-DD" /></div>
            <div class="ds-field"><span class="ds-label">承运条款</span>
              <a-select v-model="basicInfo.termsCarriage" size="small" class="ds-ctrl">
                <a-option v-for="t in ['CY-CY','CY-CFS','CFS-CY']" :key="t" :value="t">{{ t }}</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">运输方式</span>
              <a-select v-model="basicInfo.transportMode" size="small" class="ds-ctrl">
                <a-option v-for="t in ['海运','空运','铁路']" :key="t" :value="t">{{ t }}</a-option>
              </a-select>
            </div>

            <div class="ds-field"><span class="ds-label">贸易条款</span>
              <a-select v-model="basicInfo.tradeTerms" size="small" class="ds-ctrl">
                <a-option v-for="t in ['DAP','FOB','CIF','EXW']" :key="t" :value="t">{{ t }}</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">账单格式</span>
              <a-select v-model="basicInfo.billFormat" size="small" class="ds-ctrl">
                <a-option value="PTP">PTP</a-option><a-option value="OHL">OHL</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">提单格式</span>
              <a-select v-model="basicInfo.blFormat" size="small" class="ds-ctrl">
                <a-option value="OHL提单">OHL提单</a-option><a-option value="船司提单">船司提单</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">是否有船前费用</span><a-select v-model="basicInfo.freightFee" size="small" class="ds-ctrl" placeholder="请选择" /></div>

            <div class="ds-field"><span class="ds-label">预计仓库</span><a-input v-model="basicInfo.warehouse" size="small" class="ds-ctrl" placeholder="请选择预计仓库" /></div>
            <div class="ds-field"><span class="ds-label">HBL签单方式</span><a-select v-model="basicInfo.hblSign" size="small" class="ds-ctrl" placeholder="请选择" /></div>
            <div class="ds-field"><span class="ds-label">MBL签单方式</span><a-select v-model="basicInfo.mblSign" size="small" class="ds-ctrl" placeholder="请选择" /></div>
            <div class="ds-field"><span class="ds-label">付款方式</span>
              <a-select v-model="basicInfo.paymentMode" size="small" class="ds-ctrl">
                <a-option value="FREIGHT PREPAID">FREIGHT PREPAID</a-option>
                <a-option value="FREIGHT COLLECT">FREIGHT COLLECT</a-option>
              </a-select>
            </div>

            <div class="ds-field ds-field--req"><span class="ds-label">货好时间</span><a-date-picker v-model="basicInfo.readyTime" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择货好时间" format="YYYY-MM-DD" /></div>
            <div class="ds-field"><span class="ds-label">DM+DT</span><a-input v-model="basicInfo.dmdt" size="small" class="ds-ctrl" placeholder="请输入DM+DT" /></div>
            <div class="ds-field"><span class="ds-label">下单品名</span><a-input v-model="basicInfo.productName" size="small" class="ds-ctrl" placeholder="请输入下单品名" /></div>
            <div class="ds-field"><span class="ds-label">是否需要交接单抬头</span>
              <div style="display:flex;gap:12px;align-items:center">
                <a-radio v-model="basicInfo.needHandover" value="需要" size="small">需要</a-radio>
                <a-radio v-model="basicInfo.needHandover" value="不需要" size="small">不需要</a-radio>
              </div>
            </div>

            <div class="ds-field"><span class="ds-label">STORAGE</span><a-input v-model="basicInfo.storage" size="small" class="ds-ctrl" placeholder="请输入STORAGE" /></div>
            <div class="ds-field"><span class="ds-label">柜子类型</span><a-select v-model="basicInfo.containerType" size="small" class="ds-ctrl" placeholder="请选择" /></div>
            <div class="ds-field"><span class="ds-label">HBL电放提单</span>
              <a-button size="mini" type="text" style="color:rgb(var(--primary-6));padding:0">点击上传文件</a-button>
            </div>
            <div />
          </div>

          <div class="ds-sub-row">
            <span class="ds-label ds-label--req">货物类型</span>
            <div class="ds-checks">
              <a-checkbox v-for="(_, key) in basicInfo.cargoTypes" :key="key" v-model="basicInfo.cargoTypes[key]" size="small">{{ key }}</a-checkbox>
            </div>
          </div>
          <div class="ds-sub-row">
            <span class="ds-label ds-label--req">柜型</span>
            <a-select size="small" style="width:130px" placeholder="请选择" />
            <span class="ds-label ds-label--req" style="margin-left:12px">柜量</span>
            <a-input size="small" style="width:90px" placeholder="柜量" />
            <a-input size="small" style="width:90px" placeholder="柜量" />
            <a-button size="mini" shape="circle" type="primary" style="margin-left:6px"><template #icon><icon-plus /></template></a-button>
          </div>
          <div class="ds-remark-row">
            <div class="ds-remark-item">
              <span class="ds-label">客户备注</span>
              <a-textarea v-model="basicInfo.customerRemark" size="small" :auto-size="{ minRows:2, maxRows:3 }" placeholder="请输入客户备注" />
            </div>
            <div class="ds-remark-item">
              <span class="ds-label">境外代理备注</span>
              <a-textarea v-model="basicInfo.overseasRemark" size="small" :auto-size="{ minRows:2, maxRows:3 }" placeholder="请输入境外代理备注（仅支持输入英文、数字、全角）" />
            </div>
          </div>
        </div>

        <!-- 附件 -->
        <div id="ds-attachment" class="ds-section">
          <div class="ds-sec-head"><span class="ds-sec-title">附件</span></div>
          <div class="ds-att-list">
            <div v-for="att in attachments" :key="att.label" class="ds-att-row">
              <span class="ds-att-label" :class="{'ds-att-label--req': att.required}">{{ att.label }}</span>
              <a-button size="mini" type="text" style="color:rgb(var(--primary-6));padding:0">点击上传</a-button>
            </div>
            <div class="ds-att-remark">
              <span class="ds-label">备注</span>
              <a-textarea v-model="attachmentRemark" size="small" :auto-size="{ minRows:2, maxRows:3 }" placeholder="请输入附件备注" />
            </div>
          </div>
        </div>

        <!-- 订单类型 -->
        <div id="ds-order-type" class="ds-card">
          <span class="ds-label" style="flex-shrink:0">订单类型</span>
          <a-radio-group v-model="orderType" size="small">
            <a-radio v-for="t in ['多家拼','家拼','三方贸易','换单']" :key="t" :value="t">{{ t }}</a-radio>
          </a-radio-group>
        </div>

        <!-- 货物信息 -->
        <div id="ds-cargo" class="ds-section">
          <div class="ds-sec-head">
            <span class="ds-sec-title">货物信息
              <span class="ds-sec-meta">总件数：0 &nbsp; 总毛重：0KG &nbsp; 总体积：0CBM</span>
            </span>
            <div style="display:flex;align-items:center;gap:6px">
              <span class="ds-label-sm">舱单：</span>
              <a-button size="mini" type="text" style="color:rgb(var(--primary-6));padding:0">点击上传</a-button>
              <a-button size="mini" type="primary">复制分单数据</a-button>
            </div>
          </div>
          <div v-for="cargo in cargoList" :key="cargo.id" class="ds-cargo-card">
            <div class="ds-cargo-head" @click="cargo.expanded = !cargo.expanded">
              <span class="ds-cargo-toggle">{{ cargo.expanded ? '▾' : '▸' }}</span>
              <span class="ds-cargo-name">货物信息_{{ cargoList.indexOf(cargo) + 1 }}</span>
              <a-button size="mini" status="danger" style="margin-left:auto" @click.stop="removeCargo(cargo.id)">删除发货人</a-button>
            </div>
            <div v-if="cargo.expanded" class="ds-cargo-body">
              <div class="ds-cargo-cols">
                <div class="ds-cargo-col">
                  <div class="ds-field ds-field--req"><span class="ds-label">发货人</span><a-input v-model="cargo.shipper" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择发货人" /></div>
                  <a-textarea v-model="cargo.shipperDetail" size="small" :auto-size="{ minRows:2, maxRows:3 }" placeholder="请填写具体信息" style="width:100%;margin-top:4px" />
                  <div class="ds-field" style="margin-top:6px"><span class="ds-label">通知人</span>
                    <a-textarea v-model="cargo.notifyParty" size="small" :auto-size="{ minRows:2, maxRows:2 }" class="ds-ctrl" />
                  </div>
                </div>
                <div class="ds-cargo-col">
                  <div class="ds-field ds-field--req"><span class="ds-label">收货人</span><a-input v-model="cargo.consignee" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择收货人" /></div>
                  <a-textarea v-model="cargo.consigneeDetail" size="small" :auto-size="{ minRows:2, maxRows:3 }" placeholder="请填写具体信息" style="width:100%;margin-top:4px" />
                  <div style="display:flex;align-items:center;gap:6px;margin-top:6px">
                    <div class="ds-field ds-field--req" style="flex:1"><span class="ds-label">海外代理</span><a-input v-model="cargo.overseasAgent" size="small" class="ds-ctrl ds-ctrl--req" placeholder="请选择海外代理" /></div>
                    <a-button size="mini" type="outline" style="flex-shrink:0">船司主单</a-button>
                  </div>
                  <a-textarea v-model="cargo.overseasAgentDetail" size="small" :auto-size="{ minRows:2, maxRows:2 }" placeholder="请填写具体信息" style="width:100%;margin-top:4px" />
                  <div style="display:flex;gap:10px;margin-top:6px">
                    <div class="ds-field" style="flex:1"><span class="ds-label">VAT</span><a-input v-model="cargo.vat" size="small" class="ds-ctrl" /></div>
                    <div class="ds-field" style="flex:1"><span class="ds-label">EORI</span><a-input v-model="cargo.eori" size="small" class="ds-ctrl" /></div>
                  </div>
                </div>
              </div>
              <div class="ds-cargo-contact">
                <div class="ds-field"><span class="ds-label">发货联系人</span><a-input v-model="cargo.contactName" size="small" class="ds-ctrl" placeholder="请输入联系人" /></div>
                <div class="ds-field" style="flex:2"><span class="ds-label">发货联系人邮箱</span><a-input v-model="cargo.contactEmail" size="small" class="ds-ctrl" placeholder="请输入联系人邮箱" /></div>
                <a-button size="mini" type="outline" style="flex-shrink:0">复制</a-button>
              </div>
              <div class="ds-cargo-contact">
                <div class="ds-field"><span class="ds-label">发货联系人电话</span><a-input v-model="cargo.contactPhone" size="small" class="ds-ctrl" placeholder="请输入联系人电话" /></div>
              </div>
              <div class="ds-field" style="margin-top:6px"><span class="ds-label">备注</span><a-textarea v-model="cargo.remark" size="small" :auto-size="{ minRows:1, maxRows:2 }" placeholder="备注" class="ds-ctrl" /></div>
            </div>
          </div>
          <div style="padding:6px 14px 10px">
            <a-button size="small" type="dashed" @click="addCargo"><template #icon><icon-plus /></template>添加发货人</a-button>
          </div>
        </div>

        <!-- 尾端派送信息 -->
        <div id="ds-delivery" class="ds-section">
          <div class="ds-sec-head">
            <span class="ds-sec-title">尾端派送信息
              <span class="ds-sec-meta">总件数：0 &nbsp; 总数量：0 &nbsp; 总毛重：0.00(KG) &nbsp; 总体积：0.00(CBM)</span>
            </span>
            <div style="display:flex;align-items:center;gap:6px">
              <span class="ds-label-sm">ICP文件：无</span>
              <a-button size="mini" type="primary" @click="addDelivery">添加</a-button>
            </div>
          </div>
          <div class="ds-table-wrap">
            <table class="ds-table">
              <thead><tr>
                <th>HBL单号</th><th class="ds-th-req">目的地</th><th>是否需要异地还柜</th>
                <th>异地还柜点</th><th>提货标签</th><th class="ds-th-req">派送方式</th>
                <th>快递公司</th><th>快递单号</th><th>私人仓单号</th>
                <th class="ds-th-req">件数</th><th>包装单位</th><th>数量</th>
                <th class="ds-th-req">毛重(KG)</th><th>操作</th>
              </tr></thead>
              <tbody>
                <tr v-for="row in deliveryList" :key="row.id">
                  <td><a-select v-model="row.hbl" size="mini" class="ds-td-sel" allow-clear /></td>
                  <td><a-select v-model="row.dest" size="mini" class="ds-td-sel ds-td-req"><a-option value="亚马逊">亚马逊</a-option></a-select></td>
                  <td style="text-align:center"><a-checkbox v-model="row.needReturn" size="small" /></td>
                  <td><a-select v-model="row.returnPoint" size="mini" class="ds-td-sel" allow-clear /></td>
                  <td><a-input v-model="row.label" size="mini" class="ds-td-inp" /></td>
                  <td><a-select v-model="row.deliveryMode" size="mini" class="ds-td-sel ds-td-req"><a-option value="卡车">卡车</a-option><a-option value="快递">快递</a-option></a-select></td>
                  <td><a-input v-model="row.courier" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.courierNo" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.privateWarehouse" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.qty" size="mini" class="ds-td-inp ds-td-req" placeholder="件数" /></td>
                  <td><a-select v-model="row.unit" size="mini" class="ds-td-sel"><a-option value="CTNS">CTNS</a-option><a-option value="PCS">PCS</a-option></a-select></td>
                  <td><a-input v-model="row.count" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.weight" size="mini" class="ds-td-inp ds-td-req" placeholder="毛重" /></td>
                  <td><a-button size="mini" status="danger" @click="removeDelivery(row.id)">删除</a-button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 清关信息 -->
        <div id="ds-customs" class="ds-section">
          <div class="ds-sec-head">
            <span class="ds-sec-title">清关信息</span>
            <a-button size="mini" type="primary" @click="addImporter">添加</a-button>
          </div>
          <div class="ds-customs-top">
            <div class="ds-field"><span class="ds-label">清关条款</span>
              <a-select v-model="customsInfo.terms" size="small" class="ds-ctrl">
                <a-option v-for="t in ['FOB','CIF','DAP']" :key="t" :value="t">{{ t }}</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">是否预付税金</span>
              <a-select v-model="customsInfo.prepayTax" size="small" class="ds-ctrl">
                <a-option value="是">是</a-option><a-option value="否">否</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">是否PVA递延</span>
              <a-select v-model="customsInfo.pvaDeferred" size="small" class="ds-ctrl">
                <a-option value="是">是</a-option><a-option value="否">否</a-option>
              </a-select>
            </div>
            <div class="ds-field"><span class="ds-label">是否墙外代理收费</span><a-select v-model="customsInfo.overseasFee" size="small" class="ds-ctrl" placeholder="请选择" /></div>
            <div class="ds-field"><span class="ds-label">是否客户付海关</span><a-select v-model="customsInfo.customerPay" size="small" class="ds-ctrl" placeholder="请选择" /></div>
          </div>
          <div class="ds-table-wrap">
            <table class="ds-table">
              <thead><tr>
                <th>进口商</th><th>EORI信息</th><th>VAT.No</th><th>Invoice No.</th>
                <th>注册地址</th><th>FAS清关</th><th>清关授权书</th><th>箱单发票</th><th>操作</th>
              </tr></thead>
              <tbody>
                <tr v-for="row in customsImporters" :key="row.id">
                  <td><a-select v-model="row.importer" size="mini" class="ds-td-sel" placeholder="请选择进口商" /></td>
                  <td><a-input v-model="row.eori" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.vat" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.invoiceNo" size="mini" class="ds-td-inp" /></td>
                  <td><a-input v-model="row.address" size="mini" class="ds-td-inp" /></td>
                  <td style="text-align:center"><a-button size="mini" type="primary" status="warning" style="font-size:11px;padding:0 8px">查</a-button></td>
                  <td><a-button size="mini" type="text" style="color:rgb(var(--primary-6));padding:0">点击上传</a-button></td>
                  <td><a-button size="mini" type="text" style="color:rgb(var(--primary-6));padding:0">点击上传</a-button></td>
                  <td><a-button size="mini" status="danger" @click="removeImporter(row.id)">删除</a-button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="ds-scroll-spacer" aria-hidden="true" />
      </div>

      <!-- ── 右侧锚点导航 -->
      <nav class="ds-anchor">
        <div class="ds-anchor-track">
          <button
            v-for="a in anchors"
            :key="a.key"
            class="ds-anchor-item"
            :class="{ 'ds-anchor-item--active': activeAnchor === a.key }"
            type="button"
            @click="scrollToAnchor(a.key)"
          >
            <span class="ds-anchor-dot" />
            <span class="ds-anchor-label">{{ a.label }}</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- ── 底部操作栏 -->
    <div class="ds-footer">
      <a-button size="small" type="primary" status="warning">批量下单</a-button>
      <a-button size="small" type="primary" status="success">保存</a-button>
      <a-button size="small" type="primary">提交</a-button>
      <a-button size="small" type="primary" status="danger">废弃</a-button>
    </div>
  </a-drawer>
</template>
