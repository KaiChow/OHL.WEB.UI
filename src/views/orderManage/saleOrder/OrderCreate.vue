<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  IconPlus, IconMinus, IconClose, IconUpload, IconFile
} from '@arco-design/web-vue/es/icon'
import { Message, Modal } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ── Form State ──────────────────────────────────────────────────
const submitting = ref(false)
const isDirty = ref(false)

// Group A
const formA = ref({
  customer: '',
  orderType: 'fcl',
  salesman: '',
  terms: '',
  remark: '',
})

// Group B
const formB = ref({
  transport: 'sea-fcl',
  pol: '',
  pod: '',
  blNo: '',
  etd: '',
  eta: '',
  needInsurance: false,
  insureAmt: '',
  services: [] as string[],
  containers: [{ type: '40HQ', qty: 1 }],
})

// Group C - dynamic cargo rows
const cargoRows = ref([
  { id:Date.now(), name:'', hs:'', qty:1, pkg:'CTN', gw:'', nw:'', cbm:'', mark:'' }
])
const cargoTotal = computed(() => ({
  qty: cargoRows.value.reduce((s,r)=>s+(Number(r.qty)||0),0),
  gw: cargoRows.value.reduce((s,r)=>s+(Number(r.gw)||0),0).toFixed(2),
  cbm: cargoRows.value.reduce((s,r)=>s+(Number(r.cbm)||0),0).toFixed(2),
}))

function addCargoRow() { cargoRows.value.push({ id:Date.now(), name:'', hs:'', qty:1, pkg:'CTN', gw:'', nw:'', cbm:'', mark:'' }) }
function removeCargoRow(id: number) {
  if (cargoRows.value.length <= 1) { Message.warning('至少保留一条货物明细'); return }
  cargoRows.value = cargoRows.value.filter(r=>r.id!==id)
}

// Group D
const contacts = ref({
  shipper:   { company:'', contact:'', tel:'', addr:'' },
  consignee: { company:'', contact:'', tel:'', addr:'' },
  notify:    { company:'', contact:'', tel:'', addr:'' },
})
function copyFromShipper(target: 'consignee'|'notify') {
  contacts.value[target] = { ...contacts.value.shipper }
}

// Group E - file upload
const fileList = ref<{ uid:string; name:string; size:number; status:'done'|'error'|'uploading' }[]>([])
function handleUpload(opt: any) {
  const f = opt.fileItem
  fileList.value.push({ uid: f.uid, name: f.name, size: f.file.size, status:'uploading' })
  setTimeout(()=>{
    const idx = fileList.value.findIndex(x=>x.uid===f.uid)
    if(idx>=0) fileList.value[idx].status = 'done'
  }, 1200)
  opt.onSuccess()
}
function removeFile(uid: string) { fileList.value = fileList.value.filter(f=>f.uid!==uid) }
function fmtSize(b: number) { return b > 1024*1024 ? (b/1024/1024).toFixed(1)+'MB' : (b/1024).toFixed(0)+'KB' }

// Container dynamics
function addContainer() { formB.value.containers.push({ type:'20GP', qty:1 }) }
function removeContainer(i: number) {
  if(formB.value.containers.length<=1) { Message.warning('至少保留一条箱型'); return }
  formB.value.containers.splice(i,1)
}

// Validation
const errors = ref<Record<string,string>>({})
function validate() {
  errors.value = {}
  if(!formA.value.customer) errors.value.customer = '请选择客户'
  if(!formB.value.pol) errors.value.pol = '请选择起运港'
  if(!formB.value.pod) errors.value.pod = '请选择目的港'
  if(formB.value.eta && formB.value.etd && formB.value.eta < formB.value.etd) errors.value.eta = 'ETA 不能早于 ETD'
  if(!cargoRows.value.some(r=>r.name)) errors.value.cargo = '请至少填写一条货物明细'
  return Object.keys(errors.value).length === 0
}

// Watch dirty
watch([formA, formB, cargoRows, contacts], () => { isDirty.value = true }, { deep: true })

async function handleSubmit(isDraft=false) {
  if(!isDraft && !validate()) {
    Message.error('请检查表单中的错误项')
    return
  }
  submitting.value = true
  await new Promise(r=>setTimeout(r,1200))
  submitting.value = false
  Message.success(isDraft ? '草稿已保存' : '订单提交成功')
  if(!isDraft) router.back()
}

function handleCancel() {
  if(!isDirty.value) { router.back(); return }
  Modal.confirm({
    title: '离开页面',
    content: '当前页面有未保存的内容，确认离开？',
    okText: '确认离开', cancelText: '留在页面',
    onOk: () => router.back(),
  })
}

const customerOpts = ['深圳华贸国际', '上海通运物流', '广州跨境贸易', '宁波速运'].map(v=>({label:v,value:v}))
const salesmanOpts = ['张明','李婷','王芳','陈杰'].map(v=>({label:v,value:v}))
const termsOpts = ['FOB','CIF','EXW','CIP','CFR','DAP'].map(v=>({label:v,value:v}))
const portOpts = ['深圳 CNSZN','上海 CNSHA','广州 CNGUA','青岛 CNTAO','汉堡 DEHAM','洛杉矶 USLAX','鹿特丹 NLRTM'].map(v=>({label:v,value:v}))
const containerTypeOpts = ['20GP','40GP','40HQ','45HQ','20RF','40RF'].map(v=>({label:v,value:v}))
const pkgOpts = ['纸箱 CTN','托盘 PLT','袋 BAG','桶 DRM','散货 BULK'].map(v=>({label:v.split(' ')[1]||v,value:v.split(' ')[1]||v}))
const serviceOpts = [
  { label:'报关', value:'customs' }, { label:'拖车', value:'truck' },
  { label:'仓储', value:'storage' }, { label:'贴标', value:'label' },
]
</script>

<template>
  <div class="page-root page-root--dense ocf-wrap">

    <!-- ── 页头 ─────────────────────────────────────────────── -->
    <div class="ocf-head zone-card">
      <div>
        <a-breadcrumb style="font-size:var(--dense-font-aux);margin-bottom:4px">
          <a-breadcrumb-item>下单模块</a-breadcrumb-item>
          <a-breadcrumb-item>业务单</a-breadcrumb-item>
          <a-breadcrumb-item>新建订单</a-breadcrumb-item>
        </a-breadcrumb>
        <div style="font-size:var(--dense-font-title);font-weight:600;color:var(--color-text-1)">新建业务单</div>
      </div>
    </div>

    <!-- ── 表单主体 ───────────────────────────────────────────── -->
    <div class="ocf-body">

      <!-- Group A: 客户与基础 -->
      <div class="detail-section" id="section-a">
        <div class="detail-section__head">
          <h4 class="detail-section__title">A · 客户与基础信息</h4>
        </div>
        <div class="detail-section__body">
          <div class="ocf-form-grid">
            <div class="ocf-field">
              <label class="ocf-label">客户 <span class="req">*</span></label>
              <a-select v-model="formA.customer" :options="customerOpts" size="small" placeholder="请选择或搜索客户"
                allow-search allow-clear :class="{ 'field-error': errors.customer }" />
              <div v-if="errors.customer" class="field-err-msg">{{ errors.customer }}</div>
            </div>
            <div class="ocf-field">
              <label class="ocf-label">订单类型</label>
              <a-radio-group v-model="formA.orderType" size="small" type="button">
                <a-radio value="fcl">整箱 FCL</a-radio>
                <a-radio value="lcl">拼箱 LCL</a-radio>
                <a-radio value="air">空运</a-radio>
              </a-radio-group>
            </div>
            <div class="ocf-field">
              <label class="ocf-label">业务员</label>
              <a-select v-model="formA.salesman" :options="salesmanOpts" size="small" placeholder="请选择" allow-clear />
            </div>
            <div class="ocf-field">
              <label class="ocf-label">贸易条款</label>
              <a-select v-model="formA.terms" :options="termsOpts" size="small" placeholder="请选择" allow-clear />
            </div>
            <div class="ocf-field ocf-field--wide">
              <label class="ocf-label">备注</label>
              <a-textarea v-model="formA.remark" size="small" placeholder="请输入订单备注" :max-length="500"
                show-word-limit :auto-size="{ minRows:2, maxRows:4 }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Group B: 运输信息 -->
      <div class="detail-section" id="section-b">
        <div class="detail-section__head">
          <h4 class="detail-section__title">B · 运输信息</h4>
        </div>
        <div class="detail-section__body">
          <!-- 运输方式卡片选择 -->
          <div style="margin-bottom:14px">
            <div class="ocf-label" style="margin-bottom:6px">运输方式</div>
            <div class="transport-card-group">
              <div v-for="t in [{val:'sea-fcl',label:'海运 FCL'},{val:'sea-lcl',label:'海运 LCL'},{val:'air',label:'空运'},{val:'rail',label:'铁路'},{val:'express',label:'快递'}]"
                :key="t.val"
                class="transport-card"
                :class="{ 'transport-card--active': formB.transport===t.val }"
                @click="formB.transport=t.val">
                {{ t.label }}
              </div>
            </div>
          </div>

          <div class="ocf-form-grid">
            <div class="ocf-field">
              <label class="ocf-label">起运港 <span class="req">*</span></label>
              <a-select v-model="formB.pol" :options="portOpts" size="small" placeholder="请选择" allow-search allow-clear
                :class="{ 'field-error': errors.pol }" @change="errors.pol=''" />
              <div v-if="errors.pol" class="field-err-msg">{{ errors.pol }}</div>
            </div>
            <div class="ocf-field">
              <label class="ocf-label">目的港 <span class="req">*</span></label>
              <a-select v-model="formB.pod" :options="portOpts" size="small" placeholder="请选择" allow-search allow-clear
                :class="{ 'field-error': errors.pod }" @change="errors.pod=''" />
              <div v-if="errors.pod" class="field-err-msg">{{ errors.pod }}</div>
            </div>
            <div class="ocf-field">
              <label class="ocf-label">提单号</label>
              <a-input v-model="formB.blNo" size="small" placeholder="提单号（可后续填写）" allow-clear />
            </div>
            <div class="ocf-field">
              <label class="ocf-label">ETD（预计开船）</label>
              <a-date-picker v-model="formB.etd" size="small" style="width:100%" placeholder="选择日期" />
            </div>
            <div class="ocf-field">
              <label class="ocf-label">ETA（预计到港）</label>
              <a-date-picker v-model="formB.eta" size="small" style="width:100%" placeholder="选择日期"
                :disabled-date="(d:any)=>formB.etd?d<new Date(formB.etd):false" />
              <div v-if="errors.eta" class="field-err-msg">{{ errors.eta }}</div>
            </div>
          </div>

          <!-- 箱型箱量（动态行） -->
          <div v-if="formB.transport==='sea-fcl'" class="ocf-dynamic-block">
            <div class="ocf-dynamic-head">
              <span class="ocf-label">箱型箱量</span>
              <a-button size="mini" type="text" @click="addContainer"><template #icon><icon-plus /></template>添加</a-button>
            </div>
            <div v-for="(c, i) in formB.containers" :key="i" class="ocf-row">
              <a-select v-model="c.type" :options="containerTypeOpts" size="small" style="width:120px" />
              <span class="ocf-row-sep">×</span>
              <a-input-number v-model="c.qty" size="small" :min="1" style="width:80px" />
              <span class="ocf-row-unit">箱</span>
              <a-button v-if="formB.containers.length>1" size="mini" type="text" status="danger"
                @click="removeContainer(i)"><icon-minus /></a-button>
            </div>
          </div>

          <!-- 增值服务 -->
          <div style="margin-top:12px">
            <div class="ocf-label" style="margin-bottom:6px">增值服务</div>
            <a-checkbox-group v-model="formB.services" :options="serviceOpts" />
          </div>

          <!-- 保险开关 -->
          <div class="ocf-switch-row" style="margin-top:12px">
            <a-switch v-model="formB.needInsurance" size="small" />
            <span class="ocf-label">需要货物保险</span>
            <a-input-number v-if="formB.needInsurance" v-model="formB.insureAmt"
              size="small" placeholder="投保金额（USD）" style="width:180px;margin-left:12px" :min="0" />
          </div>
        </div>
      </div>

      <!-- Group C: 货物明细（动态表格） -->
      <div class="detail-section" id="section-c">
        <div class="detail-section__head">
          <h4 class="detail-section__title">C · 货物明细</h4>
          <div class="detail-section__actions">
            <a-button size="small" type="outline" @click="addCargoRow"><template #icon><icon-plus /></template>添加货物</a-button>
          </div>
        </div>
        <div class="detail-section__body" style="padding:0">
          <div v-if="errors.cargo" style="padding:8px 16px">
            <a-alert type="error" :message="errors.cargo" :show-icon="true" />
          </div>
          <vxe-table border="none" size="small" :data="cargoRows"
            :row-config="{ keyField:'id', isHover:true }">
            <vxe-column type="seq" title="#" width="44" />
            <vxe-column field="name" title="品名 *" min-width="140">
              <template #default="{ row }">
                <a-input v-model="row.name" size="small" placeholder="请输入品名" allow-clear />
              </template>
            </vxe-column>
            <vxe-column field="hs" title="HS编码" width="130">
              <template #default="{ row }">
                <a-input v-model="row.hs" size="small" placeholder="10位HS编码" allow-clear class="mono" />
              </template>
            </vxe-column>
            <vxe-column field="qty" title="件数" width="90">
              <template #default="{ row }">
                <a-input-number v-model="row.qty" size="small" :min="1" />
              </template>
            </vxe-column>
            <vxe-column field="pkg" title="包装" width="100">
              <template #default="{ row }">
                <a-select v-model="row.pkg" :options="pkgOpts" size="small" />
              </template>
            </vxe-column>
            <vxe-column field="gw" title="毛重(KG)" width="110">
              <template #default="{ row }">
                <a-input-number v-model="row.gw" size="small" :min="0" :precision="2" placeholder="0.00" />
              </template>
            </vxe-column>
            <vxe-column field="cbm" title="体积(CBM)" width="110">
              <template #default="{ row }">
                <a-input-number v-model="row.cbm" size="small" :min="0" :precision="2" placeholder="0.00" />
              </template>
            </vxe-column>
            <vxe-column field="mark" title="唛头" width="100">
              <template #default="{ row }">
                <a-input v-model="row.mark" size="small" placeholder="N/M" allow-clear />
              </template>
            </vxe-column>
            <vxe-column title="操作" width="56" fixed="right" align="center">
              <template #default="{ row }">
                <a-tooltip content="删除本行">
                  <a-button type="text" class="row-action-btn" @click="removeCargoRow(row.id)"><icon-minus /></a-button>
                </a-tooltip>
              </template>
            </vxe-column>
          </vxe-table>
          <div class="cargo-total-row">
            合计：件数 <strong>{{ cargoTotal.qty }}</strong> · 毛重 <strong>{{ cargoTotal.gw }} KG</strong> · 体积 <strong>{{ cargoTotal.cbm }} CBM</strong>
          </div>
        </div>
      </div>

      <!-- Group D: 联系人 -->
      <div class="detail-section" id="section-d">
        <div class="detail-section__head">
          <h4 class="detail-section__title">D · 联系人信息</h4>
        </div>
        <div class="detail-section__body">
          <div v-for="(key, label) in { shipper:'发货人', consignee:'收货人', notify:'通知人' }" :key="key">
            <div class="contact-group-head">
              <span class="contact-group-title">{{ label }}</span>
              <a-button v-if="key!=='shipper'" size="mini" type="text" @click="copyFromShipper(key as any)">同发货人</a-button>
            </div>
            <div class="ocf-form-grid" style="margin-bottom:12px">
              <div class="ocf-field">
                <label class="ocf-label">公司名称</label>
                <a-input v-model="contacts[key].company" size="small" placeholder="Company Name" allow-clear />
              </div>
              <div class="ocf-field">
                <label class="ocf-label">联系人</label>
                <a-input v-model="contacts[key].contact" size="small" placeholder="Contact Name" allow-clear />
              </div>
              <div class="ocf-field">
                <label class="ocf-label">电话</label>
                <a-input v-model="contacts[key].tel" size="small" placeholder="+86-xxx-xxxx" allow-clear class="mono" />
              </div>
              <div class="ocf-field ocf-field--wide">
                <label class="ocf-label">地址</label>
                <a-textarea v-model="contacts[key].addr" size="small" placeholder="详细地址" :auto-size="{ minRows:1, maxRows:3 }" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Group E: 单据上传 -->
      <div class="detail-section" id="section-e">
        <div class="detail-section__head">
          <h4 class="detail-section__title">E · 单据上传</h4>
        </div>
        <div class="detail-section__body">
          <a-upload
            multiple drag :show-file-list="false"
            accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.doc,.docx"
            :custom-request="handleUpload">
            <template #upload-button>
              <div class="upload-drop-area">
                <icon-upload style="font-size:28px;color:var(--color-text-4)" />
                <div class="upload-drop-title">拖拽文件到此处上传</div>
                <div class="upload-drop-sub">支持 PDF、Excel、Word、图片；单文件不超过 20MB</div>
              </div>
            </template>
          </a-upload>
          <div v-if="fileList.length" class="file-list">
            <div v-for="f in fileList" :key="f.uid" class="file-item">
              <icon-file style="color:var(--primary-6);font-size:var(--dense-font-nav);flex-shrink:0" />
              <div class="file-item__info">
                <span class="file-item__name">{{ f.name }}</span>
                <span class="file-item__size">{{ fmtSize(f.size) }}</span>
              </div>
              <span class="s-pill" :data-s="f.status==='done'?'acc':f.status==='error'?'rej':'op'">
                {{ f.status==='done'?'已上传':f.status==='error'?'失败':'上传中' }}
              </span>
              <a-button type="text" class="row-action-btn" @click="removeFile(f.uid)"><icon-close /></a-button>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /ocf-body -->

    <!-- ── 吸底操作栏 ─────────────────────────────────────────── -->
    <div class="detail-drawer-footer ocf-footer">
      <a-button size="small" @click="handleCancel">取消</a-button>
      <a-button size="small" type="outline" :loading="submitting" @click="handleSubmit(true)">存为草稿</a-button>
      <a-button size="small" type="primary" :loading="submitting" @click="handleSubmit(false)">提交订单</a-button>
    </div>

  </div>
</template>

<style scoped>
.ocf-wrap { overflow: hidden; display: flex; flex-direction: column; }
.ocf-head { padding: 12px 16px; flex-shrink: 0; }
.ocf-body { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; padding-bottom: 0; }
.ocf-footer { flex-shrink: 0; display: flex; justify-content: flex-end; gap: 8px; }

/* Form grid */
.ocf-form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px 16px; }
.ocf-field { display: flex; flex-direction: column; gap: 4px; }
.ocf-field--wide { grid-column: span 2; }
.ocf-label { font-size: var(--dense-font-field); color: var(--color-text-2); font-weight: 500; }
.req { color: var(--danger-6); margin-left: 2px; }
.field-err-msg { font-size: var(--dense-font-aux); color: var(--danger-6); }

/* Transport cards */
.transport-card-group { display: flex; gap: 8px; flex-wrap: wrap; }
.transport-card { padding: 6px 16px; border: 1px solid var(--color-border-2); border-radius: var(--dense-radius); font-size: var(--dense-font-nav); cursor: pointer; color: var(--color-text-2); transition: all .15s; }
.transport-card:hover { border-color: var(--primary-3); color: var(--primary-6); }
.transport-card--active { border-color: var(--primary-6); background: var(--primary-1); color: var(--primary-6); font-weight: 500; }

/* Dynamic rows */
.ocf-dynamic-block { margin-top: 12px; }
.ocf-dynamic-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.ocf-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.ocf-row-sep { color: var(--color-text-4); font-size: var(--dense-font-data); }
.ocf-row-unit { font-size: var(--dense-font-aux); color: var(--color-text-3); }
.ocf-switch-row { display: flex; align-items: center; gap: 8px; }

/* Contacts */
.contact-group-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--color-border-1); padding-bottom: 6px; }
.contact-group-title { font-size: var(--dense-font-field); font-weight: 600; color: var(--color-text-1); }

/* Cargo total */
.cargo-total-row { padding: 7px 16px; border-top: 1px solid var(--color-border-1); font-size: var(--dense-font-aux); color: var(--color-text-3); text-align: right; }
.cargo-total-row strong { color: var(--color-text-1); font-weight: 600; margin: 0 2px; }

/* Upload */
.upload-drop-area { padding: 24px 0; text-align: center; }
.upload-drop-title { font-size: var(--dense-font-data); color: var(--color-text-2); margin: 8px 0 4px; font-weight: 500; }
.upload-drop-sub { font-size: var(--dense-font-aux); color: var(--color-text-4); }
.file-list { margin-top: 10px; display: flex; flex-direction: column; gap: 4px; }
.file-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: var(--color-fill-1); border-radius: var(--dense-radius); }
.file-item__info { flex: 1; min-width: 0; }
.file-item__name { display: block; font-size: var(--dense-font-data); color: var(--color-text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-item__size { font-size: var(--dense-font-aux); color: var(--color-text-4); }
</style>