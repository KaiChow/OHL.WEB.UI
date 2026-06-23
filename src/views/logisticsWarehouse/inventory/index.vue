<script setup lang="ts">
import { ref, computed } from 'vue'
import type { VxeTableInstance } from 'vxe-table'
import { IconSearch, IconRefresh, IconDownload, IconExclamationCircle, IconPlus, IconMinus, IconApps } from '@arco-design/web-vue/es/icon'

// ── Types ──────────────────────────────────────────────────────
interface TreeNode { id: string; label: string; badge?: number; children?: TreeNode[] }
interface InventoryRow {
  Id: number; Sku: string; GoodsName: string; Client: string; Location: string
  Qty: number; Unit: string; InboundTime: string; AgeDays: number; Status: string; Low: boolean
}

// ── Mock Tree Data ─────────────────────────────────────────────
const warehouseTree = ref<TreeNode[]>([
  { id: 'W1', label: 'GZ 广州仓', badge: 12, children: [
    { id: 'W1-A', label: 'A 区', badge: 5, children: [
      { id: 'W1-A-01', label: 'A-01' }, { id: 'W1-A-02', label: 'A-02' },
      { id: 'W1-A-03', label: 'A-03' },
    ]},
    { id: 'W1-B', label: 'B 区', badge: 7, children: [
      { id: 'W1-B-01', label: 'B-01' }, { id: 'W1-B-02', label: 'B-02' },
    ]},
  ]},
  { id: 'W2', label: 'SH 上海仓', badge: 9, children: [
    { id: 'W2-C', label: 'C 区', badge: 4, children: [
      { id: 'W2-C-01', label: 'C-01' }, { id: 'W2-C-02', label: 'C-02' },
    ]},
    { id: 'W2-D', label: 'D 区', badge: 5, children: [
      { id: 'W2-D-01', label: 'D-01' },
    ]},
  ]},
  { id: 'W3', label: 'SZ 深圳仓', badge: 6, children: [
    { id: 'W3-E', label: 'E 区', badge: 6, children: [
      { id: 'W3-E-01', label: 'E-01' }, { id: 'W3-E-02', label: 'E-02' },
    ]},
  ]},
])

const expandedKeys = ref<Set<string>>(new Set(['W1', 'W2', 'W3']))
const selectedKey = ref('')
const treeSearch = ref('')

function toggleNode(id: string) {
  if (expandedKeys.value.has(id)) expandedKeys.value.delete(id)
  else expandedKeys.value.add(id)
}

function flatTree(nodes: TreeNode[], depth = 0): { node: TreeNode; depth: number }[] {
  const result: { node: TreeNode; depth: number }[] = []
  for (const n of nodes) {
    result.push({ node: n, depth })
    if (n.children && expandedKeys.value.has(n.id)) {
      result.push(...flatTree(n.children, depth + 1))
    }
  }
  return result
}

const filteredTree = computed(() => {
  const kw = treeSearch.value.trim().toLowerCase()
  if (!kw) return flatTree(warehouseTree.value)
  return flatTree(warehouseTree.value).filter(({ node }) => node.label.toLowerCase().includes(kw))
})

// ── Mock Inventory Data ────────────────────────────────────────
const allRows: InventoryRow[] = [
  { Id:1, Sku:'SKU-001', GoodsName:'电子元器件A', Client:'深圳华贸', Location:'W1-A-01', Qty:500, Unit:'pcs', InboundTime:'2024-05-12', AgeDays:40, Status:'normal', Low:false },
  { Id:2, Sku:'SKU-002', GoodsName:'服装棉料布匹', Client:'上海通运', Location:'W1-A-02', Qty:12, Unit:'匹', InboundTime:'2024-06-01', AgeDays:21, Status:'normal', Low:true },
  { Id:3, Sku:'SKU-003', GoodsName:'化妆品套装', Client:'广州跨境', Location:'W1-B-01', Qty:300, Unit:'盒', InboundTime:'2024-04-15', AgeDays:67, Status:'aging', Low:false },
  { Id:4, Sku:'SKU-004', GoodsName:'玩具积木套件', Client:'宁波速运', Location:'W1-B-02', Qty:8, Unit:'套', InboundTime:'2024-06-10', AgeDays:12, Status:'normal', Low:true },
  { Id:5, Sku:'SKU-005', GoodsName:'锂电池模组', Client:'青岛海通', Location:'W2-C-01', Qty:200, Unit:'组', InboundTime:'2024-05-20', AgeDays:32, Status:'normal', Low:false },
  { Id:6, Sku:'SKU-006', GoodsName:'运动器材配件', Client:'厦门汇丰', Location:'W2-C-02', Qty:3, Unit:'件', InboundTime:'2024-03-01', AgeDays:112, Status:'overdue', Low:true },
  { Id:7, Sku:'SKU-007', GoodsName:'办公家具零件', Client:'天津国货', Location:'W2-D-01', Qty:450, Unit:'件', InboundTime:'2024-06-05', AgeDays:17, Status:'normal', Low:false },
  { Id:8, Sku:'SKU-008', GoodsName:'包装材料纸箱', Client:'大连港运', Location:'W3-E-01', Qty:5, Unit:'件', InboundTime:'2024-05-25', AgeDays:27, Status:'normal', Low:true },
  { Id:9, Sku:'SKU-009', GoodsName:'机械零部件', Client:'成都西货', Location:'W3-E-02', Qty:180, Unit:'个', InboundTime:'2024-04-20', AgeDays:62, Status:'aging', Low:false },
  { Id:10, Sku:'SKU-010', GoodsName:'食品原料粉末', Client:'重庆通程', Location:'W1-A-03', Qty:2, Unit:'袋', InboundTime:'2024-02-10', AgeDays:130, Status:'overdue', Low:true },
  { Id:11, Sku:'SKU-011', GoodsName:'汽配零件总成', Client:'武汉中远', Location:'W1-A-01', Qty:90, Unit:'套', InboundTime:'2024-05-30', AgeDays:22, Status:'normal', Low:false },
  { Id:12, Sku:'SKU-012', GoodsName:'医疗器械配件', Client:'深圳华贸', Location:'W2-C-01', Qty:60, Unit:'件', InboundTime:'2024-06-12', AgeDays:10, Status:'normal', Low:false },
  { Id:13, Sku:'SKU-013', GoodsName:'钢铁原材料', Client:'上海通运', Location:'W3-E-01', Qty:7, Unit:'吨', InboundTime:'2024-04-01', AgeDays:81, Status:'aging', Low:true },
  { Id:14, Sku:'SKU-014', GoodsName:'塑料颗粒原料', Client:'广州跨境', Location:'W1-B-01', Qty:320, Unit:'kg', InboundTime:'2024-06-08', AgeDays:14, Status:'normal', Low:false },
  { Id:15, Sku:'SKU-015', GoodsName:'纸质印刷品', Client:'宁波速运', Location:'W2-D-01', Qty:1500, Unit:'张', InboundTime:'2024-05-18', AgeDays:34, Status:'normal', Low:false },
  { Id:16, Sku:'SKU-016', GoodsName:'电线电缆', Client:'青岛海通', Location:'W3-E-02', Qty:4, Unit:'卷', InboundTime:'2024-01-15', AgeDays:157, Status:'overdue', Low:true },
  { Id:17, Sku:'SKU-017', GoodsName:'机器人配件', Client:'厦门汇丰', Location:'W1-A-02', Qty:250, Unit:'件', InboundTime:'2024-06-15', AgeDays:7, Status:'normal', Low:false },
  { Id:18, Sku:'SKU-018', GoodsName:'纺织面料', Client:'天津国货', Location:'W1-B-02', Qty:45, Unit:'米', InboundTime:'2024-05-05', AgeDays:47, Status:'normal', Low:false },
  { Id:19, Sku:'SKU-019', GoodsName:'半导体芯片', Client:'大连港运', Location:'W2-C-02', Qty:10000, Unit:'片', InboundTime:'2024-06-20', AgeDays:2, Status:'normal', Low:false },
  { Id:20, Sku:'SKU-020', GoodsName:'工业润滑油', Client:'成都西货', Location:'W3-E-01', Qty:6, Unit:'桶', InboundTime:'2024-03-20', AgeDays:93, Status:'aging', Low:true },
]

const query = ref({ sku: '', name: '', status: '', ageMin: '', ageMax: '' })
const statusOpts = [
  { label: '正常', value: 'normal' },
  { label: '库龄超期', value: 'aging' },
  { label: '严重超期', value: 'overdue' },
]

const filteredRows = computed(() => {
  let rows = allRows
  if (selectedKey.value) rows = rows.filter(r => r.Location.startsWith(selectedKey.value))
  if (query.value.sku) rows = rows.filter(r => r.Sku.includes(query.value.sku))
  if (query.value.name) rows = rows.filter(r => r.GoodsName.includes(query.value.name))
  if (query.value.status) rows = rows.filter(r => r.Status === query.value.status)
  if (query.value.ageMin) rows = rows.filter(r => r.AgeDays >= Number(query.value.ageMin))
  if (query.value.ageMax) rows = rows.filter(r => r.AgeDays <= Number(query.value.ageMax))
  return rows
})

const stats = computed(() => ({
  total: filteredRows.value.length,
  low: filteredRows.value.filter(r => r.Low).length,
  aging: filteredRows.value.filter(r => r.Status !== 'normal').length,
}))

// ── Status Pill ────────────────────────────────────────────────
const statusPillMap: Record<string, string> = { normal: 'acc', aging: 'wait', overdue: 'rej' }
const statusTextMap: Record<string, string> = { normal: '正常', aging: '库龄超期', overdue: '严重超期' }

// ── Outbound Drawer ────────────────────────────────────────────
const drawerVisible = ref(false)
const drawerRow = ref<InventoryRow | null>(null)
const outForm = ref({ qty: '', purpose: '', handler: '', remark: '' })
const outFormErr = ref({ qty: '' })

function openOutbound(row: InventoryRow) {
  drawerRow.value = row
  outForm.value = { qty: '', purpose: '', handler: '', remark: '' }
  outFormErr.value = { qty: '' }
  drawerVisible.value = true
}

function validateOutQty() {
  const v = Number(outForm.value.qty)
  if (!outForm.value.qty) { outFormErr.value.qty = '请填写数量'; return false }
  if (isNaN(v) || v <= 0) { outFormErr.value.qty = '数量须大于0'; return false }
  if (drawerRow.value && v > drawerRow.value.Qty) { outFormErr.value.qty = `不能超过可用库存 ${drawerRow.value.Qty}`; return false }
  outFormErr.value.qty = ''
  return true
}

function submitOutbound() {
  if (!validateOutQty()) return
  drawerVisible.value = false
}

const tableRef = ref<VxeTableInstance>()
</script>

<template>
  <div class="inv-page">
    <!-- Left Tree -->
    <div class="inv-tree-panel">
      <div class="tree-search-bar">
        <a-input v-model="treeSearch" size="small" placeholder="搜索仓库/库区/库位" allow-clear>
          <template #prefix><icon-search style="font-size:13px"/></template>
        </a-input>
      </div>
      <div class="tree-body">
        <div
          v-for="{ node, depth } in filteredTree" :key="node.id"
          class="tree-node"
          :class="{ 'tree-node--active': selectedKey === node.id }"
          :style="{ paddingLeft: (12 + depth * 16) + 'px' }"
          @click="selectedKey = node.id">
          <span v-if="node.children" class="tree-arrow" @click.stop="toggleNode(node.id)">
            {{ expandedKeys.has(node.id) ? '▾' : '▸' }}
          </span>
          <span v-else class="tree-leaf-pad"></span>
          <span class="tree-lbl">{{ node.label }}</span>
          <span v-if="node.badge" class="tree-badge">{{ node.badge }}</span>
        </div>
      </div>
    </div>

    <!-- Right Content -->
    <div class="inv-content">
      <!-- Search Bar -->
      <div v-if="selectedKey" class="zone-l2-filter-card zone-card filter-card">
        <div class="filter-card__main">
          <div class="filter-card__fields">
            <div class="filter-card__body--basic">
              <div class="filter-grid">
                <div class="filter-field">
                  <label class="filter-field__label">SKU</label>
                  <a-input v-model="query.sku" size="small" placeholder="请输入SKU" allow-clear @press-enter="handleSearch" />
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">货物名称</label>
                  <a-input v-model="query.name" size="small" placeholder="模糊搜索" allow-clear @press-enter="handleSearch" />
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">库存状态</label>
                  <a-select v-model="query.status" size="small" placeholder="全部" :options="statusOpts" allow-clear @change="handleSearch" />
                </div>
                <div class="filter-field">
                  <label class="filter-field__label">库龄(天)</label>
                  <div style="display:flex;align-items:center;gap:4px">
                    <a-input-number v-model="query.ageMin" size="small" placeholder="最小" style="width:72px" :min="0" @press-enter="handleSearch" />
                    <span style="color:var(--color-text-4);font-size:var(--dense-font-aux)">—</span>
                    <a-input-number v-model="query.ageMax" size="small" placeholder="最大" style="width:72px" :min="0" @press-enter="handleSearch" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="filter-card__actions-col">
            <div class="filter-card__actions-primary">
              <a-button size="small" type="primary" @click="handleSearch">查询</a-button>
              <a-button size="small" type="text" class="reset-btn" @click="handleReset">重置</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toolbar / Stats strip -->
      <div v-if="selectedKey" class="toolbar">
        <div class="toolbar-group">
          <a-button size="small" type="outline"><template #icon><icon-download /></template>导出</a-button>
          <div class="stats-strip">
            <span class="stat-item">全部 <strong>{{ stats.total }}</strong></span>
            <span class="stat-sep">·</span>
            <span class="stat-item warn">低库存 <strong>{{ stats.low }}</strong></span>
            <span class="stat-sep">·</span>
            <span class="stat-item danger">超期 <strong>{{ stats.aging }}</strong></span>
          </div>
        </div>
        <div class="toolbar-aside">
          <a-button size="small" type="text" @click="tableRef?.recalculate()"><template #icon><icon-refresh /></template></a-button>
        </div>
      </div>

      <!-- Table -->
      <div v-if="selectedKey" class="table-wrap">
        <vxe-table ref="tableRef" border="none" size="small" height="100%"
          :data="filteredRows" :row-config="{ isHover: true, keyField: 'Id' }"
          :scroll-x="{ enabled: true, gt: 0 }" show-overflow="title">
          <vxe-column type="seq" title="序号" width="52" fixed="left"/>
          <vxe-column field="Sku" title="SKU" width="110" fixed="left">
            <template #default="{ row }">
              <span class="link-text mono">{{ row.Sku }}</span>
            </template>
          </vxe-column>
          <vxe-column field="GoodsName" title="货物名称" min-width="140">
            <template #default="{ row }">
              <span>{{ row.GoodsName }}</span>
            </template>
          </vxe-column>
          <vxe-column field="Client" title="所属客户" width="110">
            <template #default="{ row }">
              <span class="c-main">{{ row.Client }}</span>
            </template>
          </vxe-column>
          <vxe-column field="Location" title="库位" width="88">
            <template #default="{ row }">
              <span class="mono" style="font-size:var(--dense-font-aux)">{{ row.Location }}</span>
            </template>
          </vxe-column>
          <vxe-column field="Qty" title="数量" width="90">
            <template #default="{ row }">
              <span :class="row.Low ? 'qty-low' : ''">
                <icon-exclamation-circle v-if="row.Low" style="color:var(--warning-6);font-size:12px;margin-right:2px"/>
                {{ row.Qty }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="Unit" title="单位" width="60"/>
          <vxe-column field="InboundTime" title="入库时间" width="110" sortable/>
          <vxe-column field="AgeDays" title="库龄(天)" width="80" sortable>
            <template #default="{ row }">
              <span :class="row.AgeDays > 90 ? 'age-danger' : row.AgeDays > 60 ? 'age-warn' : ''">{{ row.AgeDays }}</span>
            </template>
          </vxe-column>
          <vxe-column field="Status" title="状态" width="96">
            <template #default="{ row }">
              <span class="s-pill" :data-s="statusPillMap[row.Status]">{{ statusTextMap[row.Status] }}</span>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="72" fixed="right">
            <template #default="{ row }">
              <a-tooltip content="出库">
                <a-button type="text" class="row-action-btn" @click="openOutbound(row)"><icon-minus /></a-button>
              </a-tooltip>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <!-- Empty State -->
      <div v-else class="inv-empty">
        <div class="empty-illus"><icon-apps style="font-size:40px;color:var(--color-text-4)" /></div>
        <div class="empty-title">请选择仓库节点</div>
        <div class="empty-sub">从左侧树形结构选择仓库、库区或库位，查看对应库存数据</div>
      </div>
    </div>

    <!-- Outbound Drawer -->
    <a-drawer v-model:visible="drawerVisible" title="出库登记" :width="400" :footer="false">
      <div v-if="drawerRow" class="out-form">
        <div class="out-info-bar">
          <div class="cell-two-line">
            <span class="c2-main">{{ drawerRow.GoodsName }}</span>
            <span class="c2-sub">{{ drawerRow.Sku }} · {{ drawerRow.Location }}</span>
          </div>
          <span class="out-avail">可用: <strong>{{ drawerRow.Qty }} {{ drawerRow.Unit }}</strong></span>
        </div>

        <div class="out-section-title">出库信息</div>

        <div class="form-item">
          <div class="form-label">出库数量 <span class="req">*</span></div>
          <a-input-number v-model="outForm.qty" size="small" :min="1" :max="drawerRow.Qty"
            placeholder="请输入数量" style="width:100%"
            @change="validateOutQty"/>
          <div v-if="outFormErr.qty" class="form-err">{{ outFormErr.qty }}</div>
        </div>
        <div class="form-item">
          <div class="form-label">出库目的</div>
          <a-select v-model="outForm.purpose" size="small" style="width:100%" placeholder="请选择" :options="[
            { label: '客户提货', value: 'pickup' },
            { label: '装柜出运', value: 'load' },
            { label: '调拨转库', value: 'transfer' },
            { label: '报废处理', value: 'scrap' },
          ]"/>
        </div>
        <div class="form-item">
          <div class="form-label">领用人</div>
          <a-input v-model="outForm.handler" size="small" placeholder="请填写领用人姓名" style="width:100%"/>
        </div>
        <div class="form-item">
          <div class="form-label">备注</div>
          <a-textarea v-model="outForm.remark" size="small" placeholder="选填备注" :max-length="200" :auto-size="{ minRows: 2, maxRows: 4 }"/>
        </div>

        <div class="out-footer">
          <a-button size="small" @click="drawerVisible=false">取消</a-button>
          <a-button size="small" type="primary" @click="submitOutbound">确认出库</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped>
.inv-page { display:flex; height:100%; background:var(--color-bg-card); overflow:hidden; }

/* Tree */
.inv-tree-panel { width:220px; flex-shrink:0; border-right:1px solid var(--color-border-1); display:flex; flex-direction:column; overflow:hidden; }
.tree-search-bar { padding:8px 10px; border-bottom:1px solid var(--color-border-1); flex-shrink:0; }
.tree-body { flex:1; overflow-y:auto; padding:4px 0; }
.tree-node { display:flex; align-items:center; gap:4px; padding:5px 12px; cursor:pointer; font-size:var(--dense-font-data); color:var(--color-text-2); transition:background .1s; }
.tree-node:hover { background:var(--color-fill-1); }
.tree-node--active { background:var(--primary-1); color:var(--primary-6); font-weight:600; }
.tree-arrow { font-size:10px; width:14px; flex-shrink:0; cursor:pointer; }
.tree-leaf-pad { width:14px; flex-shrink:0; }
.tree-lbl { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tree-badge { font-size:var(--dense-font-micro); background:var(--primary-1); color:var(--primary-6); border-radius:8px; padding:0 5px; font-weight:600; }

/* Right */
.inv-content { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; }
.stats-strip { display:flex; align-items:center; gap:6px; font-size:var(--dense-font-aux); }
.stat-item { color:var(--color-text-2); } .stat-item strong { color:var(--color-text-1); font-weight:600; }
.stat-item.warn strong { color:var(--warning-6); }
.stat-item.danger strong { color:var(--danger-6); }
.stat-sep { color:var(--color-text-4); }
.table-wrap { flex:1; min-height:0; overflow:hidden; }

/* Cell states */
.qty-low { color:var(--warning-6); font-weight:600; display:inline-flex; align-items:center; }
.age-warn { color:var(--warning-6); font-weight:600; }
.age-danger { color:var(--danger-6); font-weight:600; }

/* Empty */
.inv-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; }
.empty-illus { font-size:48px; }
.empty-title { font-size:var(--dense-font-data); font-weight:600; color:var(--color-text-2); }
.empty-sub { font-size:var(--dense-font-aux); color:var(--color-text-4); text-align:center; max-width:260px; }

/* Drawer form */
.out-form { display:flex; flex-direction:column; gap:12px; }
.out-info-bar { display:flex; align-items:center; justify-content:space-between; background:var(--color-fill-1); border-radius:6px; padding:10px 12px; }
.out-avail { font-size:var(--dense-font-aux); color:var(--color-text-3); white-space:nowrap; }
.out-avail strong { color:var(--color-text-1); font-weight:600; }
.out-section-title { font-size:var(--dense-font-title); font-weight:600; color:var(--color-text-1); border-bottom:1px solid var(--color-border-1); padding-bottom:6px; }
.form-item { display:flex; flex-direction:column; gap:4px; }
.form-label { font-size:var(--dense-font-field); color:var(--color-text-2); font-weight:500; }
.req { color:var(--danger-6); margin-left:2px; }
.form-err { font-size:var(--dense-font-aux); color:var(--danger-6); }
.out-footer { display:flex; justify-content:flex-end; gap:8px; padding-top:8px; border-top:1px solid var(--color-border-1); margin-top:4px; }
</style>