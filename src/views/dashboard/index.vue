<script setup lang="ts">
import { ref } from 'vue'
import { IconRise, IconFall, IconRight } from '@arco-design/web-vue/es/icon'

const kpiCards = ref([
  { label: '今日新增订单', value: 86, unit: '单', change: 12.5, up: true, progress: 72, color: 'var(--primary-6)', hasAlert: false, sparkline: [40,55,48,63,70,58,86] },
  { label: '在途订单', value: 234, unit: '单', change: 3.2, up: true, progress: 58, color: 'var(--cyan-6)', hasAlert: false, sparkline: [180,200,215,220,230,225,234] },
  { label: '待办事项', value: 17, unit: '项', change: 5.1, up: false, progress: 34, color: 'var(--warning-6)', hasAlert: true, sparkline: [22,18,25,20,19,21,17] },
  { label: '本月应收', value: 128600, unit: '元', change: 8.8, up: true, progress: 64, color: 'var(--success-6)', hasAlert: false, sparkline: [80000,95000,102000,108000,115000,122000,128600] },
])

const todoBadge = [
  { label: '待确认', count: 8, tab: 'confirm' },
  { label: '待订舱', count: 5, tab: 'booking' },
  { label: '待付款', count: 4, tab: 'payment' },
]
const todoTab = ref('confirm')
const todoItems: Record<string, { id: string; client: string; route: string; time: string }[]> = {
  confirm: [
    { id: 'SO2024001', client: '深圳华贸', route: 'SHA→LAX', time: '10:25' },
    { id: 'SO2024002', client: '上海通运', route: 'PVG→SYD', time: '09:10' },
    { id: 'SO2024003', client: '广州跨境', route: 'CAN→LHR', time: '08:42' },
    { id: 'SO2024004', client: '宁波速运', route: 'NGB→DXB', time: '08:20' },
    { id: 'SO2024005', client: '青岛海通', route: 'TAO→HKG', time: '07:55' },
  ],
  booking: [
    { id: 'SO2024006', client: '厦门汇丰', route: 'XMN→SEA', time: '11:00' },
    { id: 'SO2024007', client: '天津国货', route: 'TSN→AMS', time: '09:30' },
    { id: 'SO2024008', client: '大连港运', route: 'DLC→YVR', time: '08:15' },
  ],
  payment: [
    { id: 'SO2024009', client: '成都西货', route: 'TFU→FRA', time: '10:55' },
    { id: 'SO2024010', client: '重庆通程', route: 'CKG→CDG', time: '09:45' },
    { id: 'SO2024011', client: '武汉中远', route: 'WUH→JFK', time: '09:00' },
  ],
}

const topPorts = [
  { port: 'LAX 洛杉矶', count: 128, pct: 100 },
  { port: 'LHR 伦敦', count: 104, pct: 81 },
  { port: 'SYD 悉尼', count: 97, pct: 76 },
  { port: 'JFK 纽约', count: 89, pct: 70 },
  { port: 'AMS 阿姆斯特丹', count: 82, pct: 64 },
  { port: 'DXB 迪拜', count: 75, pct: 59 },
  { port: 'FRA 法兰克福', count: 68, pct: 53 },
  { port: 'SEA 西雅图', count: 60, pct: 47 },
  { port: 'HKG 香港', count: 55, pct: 43 },
  { port: 'CDG 巴黎', count: 48, pct: 38 },
]

const shortcuts = [
  { icon: '📦', label: '新建业务单' },
  { icon: '🚢', label: '查找舱位' },
  { icon: '📋', label: '入仓管理' },
  { icon: '💰', label: '财务对账' },
  { icon: '📊', label: '库存查看' },
  { icon: '📈', label: '运输跟踪' },
]

const trendGran = ref<'day'|'week'>('day')
const allTrendData = {
  day: { labels: ['6/1','6/4','6/7','6/10','6/13','6/16','6/19','6/22','6/25','6/28','7/1','7/4','7/7','7/10','7/13','7/16','7/19','7/22','7/25','7/28'], data: [42,38,55,61,49,70,68,52,63,74,80,66,71,58,65,72,68,77,82,86] },
  week: { labels: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13'], data: [280,310,295,340,320,355,370,345,390,410,395,425,440] },
}
const transportData = [
  { name: '海运FCL', pct: 38, color: '#165dff' },
  { name: '海运LCL', pct: 22, color: '#36cfc9' },
  { name: '空运', pct: 20, color: '#ff7d00' },
  { name: '铁路', pct: 12, color: '#722ed1' },
  { name: '快递', pct: 8, color: '#52c41a' },
]

function sparkPath(arr: number[]) {
  const mn = Math.min(...arr); const mx = Math.max(...arr)
  return arr.map((v, i) => {
    const x = (i / (arr.length - 1)) * 64
    const y = 27 - ((v - mn) / (mx - mn || 1)) * 25
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)
  }).join(' ')
}

function buildTrend() {
  const src = allTrendData[trendGran.value]
  const W = 460; const H = 110
  const mn = Math.min(...src.data); const mx = Math.max(...src.data)
  const pts = src.data.map((v, i) => ({
    x: 16 + (i / (src.data.length - 1)) * (W - 20),
    y: H - 14 - ((v - mn) / (mx - mn || 1)) * (H - 26)
  }))
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')
  const area = line + ' L' + pts[pts.length-1].x.toFixed(1) + ',' + (H-14) + ' L' + pts[0].x.toFixed(1) + ',' + (H-14) + ' Z'
  const step = Math.ceil(src.labels.length / 7)
  const lblIdx = src.labels.map((_, i) => i).filter(i => i % step === 0)
  return { pts, line, area, labels: src.labels, lblIdx, W, H }
}

function donutSegs() {
  let start = -90
  return transportData.map(d => {
    const angle = (d.pct / 100) * 360
    const r = 50; const cx = 65; const cy = 65
    const x1 = cx + r * Math.cos(start * Math.PI / 180)
    const y1 = cy + r * Math.sin(start * Math.PI / 180)
    const end = start + angle
    const x2 = cx + r * Math.cos(end * Math.PI / 180)
    const y2 = cy + r * Math.sin(end * Math.PI / 180)
    const lg = angle > 180 ? 1 : 0
    const path = `M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`
    start += angle
    return { ...d, path }
  })
}

function fmtVal(v: number, unit: string) {
  if (unit === '元' && v >= 10000) return (v / 10000).toFixed(1) + '万'
  return String(v)
}
</script>

<template>
  <div class="dash-page">
    <div class="dash-kpi-row">
      <div v-for="card in kpiCards" :key="card.label" class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-lbl">{{ card.label }}</span>
          <span v-if="card.hasAlert" class="kpi-dot"></span>
        </div>
        <div class="kpi-vrow">
          <span class="kpi-val">{{ fmtVal(card.value, card.unit) }}</span>
          <span class="kpi-unit">{{ card.unit }}</span>
          <span class="kpi-chg" :class="card.up ? 'up' : 'dn'">
            <icon-rise v-if="card.up" style="font-size:10px"/>
            <icon-fall v-else style="font-size:10px"/>
            {{ card.change }}%
          </span>
        </div>
        <svg class="spark" viewBox="0 0 64 28" preserveAspectRatio="none">
          <path :d="sparkPath(card.sparkline)" fill="none" :stroke="card.color" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
        <div class="kpi-track"><div class="kpi-bar" :style="{ width: card.progress+'%', background: card.color }"></div></div>
      </div>
    </div>

    <div class="dash-chart-row">
      <div class="dc">
        <div class="dc-head">
          <span class="dc-title">30 天订单趋势</span>
          <div class="gran-sw">
            <button class="gb" :class="{ active: trendGran==='day' }" @click="trendGran='day'">日</button>
            <button class="gb" :class="{ active: trendGran==='week' }" @click="trendGran='week'">周</button>
          </div>
        </div>
        <svg class="trend-svg" :viewBox="`0 0 ${buildTrend().W} ${buildTrend().H}`" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#165dff" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#165dff" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path :d="buildTrend().area" fill="url(#tg)"/>
          <path :d="buildTrend().line" fill="none" stroke="#165dff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
          <text v-for="i in buildTrend().lblIdx" :key="i"
            :x="16 + (i/(buildTrend().labels.length-1))*(buildTrend().W-20)"
            :y="buildTrend().H-1" text-anchor="middle" font-size="8" fill="var(--color-text-4)">{{ buildTrend().labels[i] }}</text>
        </svg>
      </div>
      <div class="dc">
        <div class="dc-head"><span class="dc-title">运输方式占比</span></div>
        <div class="pie-body">
          <svg viewBox="0 0 130 130" class="pie-svg">
            <path v-for="seg in donutSegs()" :key="seg.name" :d="seg.path" :fill="seg.color" opacity="0.85"/>
            <circle cx="65" cy="65" r="32" fill="var(--color-bg-card)"/>
            <text x="65" y="62" text-anchor="middle" font-size="10" font-weight="600" fill="var(--color-text-1)">运输</text>
            <text x="65" y="74" text-anchor="middle" font-size="9" fill="var(--color-text-3)">占比</text>
          </svg>
          <div class="pie-lg">
            <div v-for="seg in donutSegs()" :key="seg.name" class="pie-row">
              <span class="pie-dot" :style="{ background: seg.color }"></span>
              <span class="pie-nm">{{ seg.name }}</span>
              <span class="pie-pc">{{ seg.pct }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dash-bot-row">
      <div class="dc">
        <div class="dc-head"><span class="dc-title">Top 10 目的港</span></div>
        <div class="port-list">
          <div v-for="(p, i) in topPorts" :key="p.port" class="port-item">
            <span class="port-rk" :class="i < 3 ? 'top3' : ''">{{ i+1 }}</span>
            <span class="port-nm">{{ p.port }}</span>
            <div class="port-track"><div class="port-fill" :style="{ width: p.pct+'%' }"></div></div>
            <span class="port-ct">{{ p.count }}</span>
          </div>
        </div>
      </div>
      <div class="dc">
        <div class="dc-head">
          <span class="dc-title">待办列表</span>
          <div class="todo-tabs">
            <button v-for="t in todoBadge" :key="t.tab" class="todo-tab" :class="{ active: todoTab===t.tab }" @click="todoTab=t.tab">
              {{ t.label }}<span class="todo-bdg">{{ t.count }}</span>
            </button>
          </div>
        </div>
        <div class="todo-body">
          <div v-for="item in todoItems[todoTab]" :key="item.id" class="todo-row">
            <div class="cell-two-line" style="flex:1;min-width:0">
              <span class="c2-main link-text">{{ item.id }}</span>
              <span class="c2-sub">{{ item.client }}</span>
            </div>
            <span class="todo-rt">{{ item.route }}</span>
            <span class="todo-tm">{{ item.time }}</span>
            <icon-right style="font-size:12px;color:var(--color-text-4)"/>
          </div>
        </div>
      </div>
      <div class="dc">
        <div class="dc-head"><span class="dc-title">快捷入口</span></div>
        <div class="sc-grid">
          <div v-for="sc in shortcuts" :key="sc.label" class="sc-item">
            <span class="sc-icon">{{ sc.icon }}</span>
            <span class="sc-lbl">{{ sc.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-page { display:flex; flex-direction:column; height:100%; background:var(--color-bg-body); padding:12px; gap:10px; overflow-y:auto; box-sizing:border-box; }
.dash-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; flex-shrink:0; }
.kpi-card { background:var(--color-bg-card); border-radius:6px; border:1px solid var(--color-border-1); padding:12px 14px 10px; display:flex; flex-direction:column; gap:5px; }
.kpi-top { display:flex; align-items:center; gap:6px; }
.kpi-lbl { font-size:var(--dense-font-field); color:var(--color-text-2); font-weight:500; }
.kpi-dot { width:6px; height:6px; border-radius:50%; background:var(--danger-6); }
.kpi-vrow { display:flex; align-items:baseline; gap:4px; }
.kpi-val { font-size:22px; font-weight:600; color:var(--color-text-1); line-height:1.2; }
.kpi-unit { font-size:var(--dense-font-aux); color:var(--color-text-3); }
.kpi-chg { font-size:var(--dense-font-aux); display:flex; align-items:center; gap:1px; margin-left:4px; }
.kpi-chg.up { color:var(--success-6); } .kpi-chg.dn { color:var(--danger-6); }
.spark { width:64px; height:26px; align-self:flex-end; }
.kpi-track { height:3px; background:var(--color-fill-2); border-radius:2px; overflow:hidden; }
.kpi-bar { height:100%; border-radius:2px; }
.dash-chart-row { display:grid; grid-template-columns:1fr 260px; gap:10px; flex-shrink:0; }
.dc { background:var(--color-bg-card); border-radius:6px; border:1px solid var(--color-border-1); display:flex; flex-direction:column; overflow:hidden; }
.dc-head { display:flex; align-items:center; justify-content:space-between; padding:8px 14px; border-bottom:1px solid var(--color-border-1); flex-shrink:0; }
.dc-title { font-size:var(--dense-font-title); font-weight:600; color:var(--color-text-1); }
.trend-svg { width:100%; height:130px; padding:4px 4px 0; box-sizing:border-box; }
.gran-sw { display:flex; }
.gb { padding:2px 9px; font-size:var(--dense-font-aux); border:1px solid var(--color-border-2); background:none; cursor:pointer; color:var(--color-text-2); }
.gb:first-child { border-radius:3px 0 0 3px; } .gb:last-child { border-radius:0 3px 3px 0; border-left:0; }
.gb.active { background:var(--primary-1); color:var(--primary-6); font-weight:600; border-color:var(--primary-3); }
.pie-body { display:flex; align-items:center; padding:10px 12px; gap:12px; }
.pie-svg { width:90px; height:90px; flex-shrink:0; }
.pie-lg { display:flex; flex-direction:column; gap:5px; flex:1; }
.pie-row { display:flex; align-items:center; gap:5px; }
.pie-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.pie-nm { font-size:var(--dense-font-aux); color:var(--color-text-2); flex:1; }
.pie-pc { font-size:var(--dense-font-aux); color:var(--color-text-1); font-weight:600; }
.dash-bot-row { display:grid; grid-template-columns:1fr 1.3fr 190px; gap:10px; flex-shrink:0; }
.port-list { padding:8px 14px; display:flex; flex-direction:column; gap:5px; }
.port-item { display:flex; align-items:center; gap:7px; }
.port-rk { width:16px; font-size:var(--dense-font-micro); font-weight:600; color:var(--color-text-4); text-align:center; flex-shrink:0; }
.port-rk.top3 { color:var(--primary-6); }
.port-nm { font-size:var(--dense-font-aux); color:var(--color-text-2); width:86px; flex-shrink:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.port-track { flex:1; height:6px; background:var(--color-fill-2); border-radius:3px; overflow:hidden; }
.port-fill { height:100%; background:var(--primary-3); border-radius:3px; }
.port-ct { font-size:var(--dense-font-aux); color:var(--color-text-1); font-weight:500; width:28px; text-align:right; }
.todo-tabs { display:flex; }
.todo-tab { padding:2px 9px; font-size:var(--dense-font-aux); border:1px solid var(--color-border-2); background:none; cursor:pointer; color:var(--color-text-2); }
.todo-tab:first-child { border-radius:3px 0 0 3px; } .todo-tab:last-child { border-radius:0 3px 3px 0; border-left:0; }
.todo-tab.active { background:var(--primary-1); color:var(--primary-6); font-weight:600; border-color:var(--primary-3); }
.todo-bdg { font-size:var(--dense-font-micro); background:var(--danger-6); color:white; border-radius:8px; padding:0 4px; margin-left:3px; }
.todo-body { overflow-y:auto; }
.todo-row { display:flex; align-items:center; gap:8px; padding:6px 14px; border-bottom:1px solid var(--color-border-1); cursor:pointer; }
.todo-row:hover { background:var(--color-fill-1); }
.todo-rt { font-size:var(--dense-font-aux); color:var(--color-text-3); white-space:nowrap; }
.todo-tm { font-size:var(--dense-font-micro); color:var(--color-text-4); white-space:nowrap; }
.sc-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:10px; }
.sc-item { display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px; border-radius:5px; cursor:pointer; border:1px solid var(--color-border-1); background:var(--color-fill-1); transition:background .12s; }
.sc-item:hover { background:var(--primary-1); border-color:var(--primary-3); }
.sc-icon { font-size:18px; }
.sc-lbl { font-size:var(--dense-font-aux); color:var(--color-text-2); text-align:center; }
</style>