# Status System

Freight industry status vocabulary and color mapping.
Always use these exact terms. Never use generic words like "进行中", "处理中", "步骤1".

---

## Status Tag Pattern

```vue
<a-tag size="small" :color="statusColorMap[row.status]">
  <span class="status-dot" />
  {{ statusTextMap[row.status] }}
</a-tag>
```

---

## Order / Business Status

```typescript
export const statusColorMap: Record<string, string> = {
  // Draft / unconfirmed
  '草稿':     'gray',
  '待确认':   'orange',
  '已确认':   'blue',

  // Booking
  '待订舱':   'orange',
  '订舱中':   'arcoblue',
  '已订舱':   'blue',
  '已确舱':   'blue',
  '订舱取消': 'gray',

  // Pickup / customs
  '待提柜':   'orange',
  '已提柜':   'cyan',
  '待报关':   'orange',
  '报关中':   'arcoblue',
  '已放行':   'green',
  '查验中':   'red',

  // Transport
  '已装船':   'blue',
  '运输中':   'blue',
  '已到港':   'cyan',
  '待提货':   'orange',
  '已提货':   'green',
  '已签收':   'green',

  // Done / exception
  '已完成':   'green',
  '已关闭':   'gray',
  '已取消':   'gray',
  '异常':     'red',
  '延误':     'red',
  '滞港':     'red',
}
```

**Color semantics:**
- `orange` — requires action / pending
- `arcoblue` / `blue` — in progress
- `cyan` — milestone reached, continuing
- `green` — completed / success
- `gray` — cancelled / closed / inactive
- `red` — exception / error / needs urgent attention

---

## Finance / Bill Status

```typescript
export const billStatusColorMap: Record<string, string> = {
  '待对账':   'orange',
  '对账中':   'arcoblue',
  '已对账':   'blue',
  '待开票':   'orange',
  '已开票':   'blue',
  '待收款':   'orange',
  '部分收款': 'gold',
  '已收款':   'green',
  '待付款':   'orange',
  '部分付款': 'gold',
  '已付款':   'green',
  '逾期':     'red',
  '坏账':     'red',
  '已核销':   'gray',
  '已取消':   'gray',
}
```

---

## Transport Mode

```typescript
export const transportTabs = [
  { label: '全部', value: 'all' },
  { label: '海运', value: 'sea' },
  { label: '空运', value: 'air' },
  { label: '铁路', value: 'rail' },
  { label: '陆运', value: 'truck' },
]

export const businessTypeMap: Record<string, string> = {
  'FCL':       '整箱',
  'LCL':       '拼箱',
  'AIR':       '空运',
  'RAIL':      '铁运',
  'CUSTOMS':   '报关',
  'TRUCK':     '拖车',
  'WAREHOUSE': '仓储',
}
```

---

## Quick Search Fields

```typescript
export const quickSearchFields = [
  { label: '业务单号', value: 'OrderNo' },
  { label: '委托单号', value: 'DcgNo' },
  { label: 'HBL提单号', value: 'HblNo' },
  { label: 'MBL提单号', value: 'MblNo' },
  { label: '柜号',     value: 'ContainerNo' },
  { label: 'SO号',     value: 'SoNo' },
  { label: '客户单号', value: 'CustomerOrderNo' },
  { label: '船名航次', value: 'VesselVoyage' },
]
```

---

## Phase Filter Labels

For the status scope chips in `.list-filter-row`:

```typescript
export const phaseFilterOptions = [
  { label: '全部',   value: 'all',       count: 0 },
  { label: '在操',   value: 'active',    count: 0 },
  { label: '待处理', value: 'pending',   count: 0 },
  { label: '异常',   value: 'exception', count: 0 },
  { label: '本月完成', value: 'done',    count: 0 },
  { label: '历史',   value: 'history',   count: 0 },
]
```
