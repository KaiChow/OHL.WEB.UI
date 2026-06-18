import type { SaleOrderRecord, TransportMode } from '../views/orderManage/saleOrder/types';

const cargoTypes = ['普货', '化工品', '危险货', '冷藏货', '超大件'];
const bizTypes = ['FBA', 'FOB', 'CIF', 'DDP'];
const shippers = [
  'SHENZHEN OHL LOGISTICS CO.,LTD',
  'NINGBO FREIGHT INT\'L CO., LTD',
  'GUANGZHOU STAR TRADING LTD',
  'SHANGHAI OCEAN SUPPLY CHAIN'
];
const consignees = [
  'AMAZON FBA WAREHOUSE',
  'HAMBURG TRADING GMBH',
  'LOS ANGELES IMPORT INC.',
  'ROTTERDAM LOGISTICS BV'
];
const salesmen = ['张三', '李四', '王五', '赵六', '陈七'];
const operators = ['操作A', '操作B', '操作C', '操作D'];
const statuses = [
  'pending_audit',
  'op_pending',
  'unsubmitted',
  'submitted',
  'accepted',
  'released',
  'rejected',
  'abandoned',
  'sailed',
  'draft'
] as const;
const containers = ['LCL', "1X20'GP", "1X40'HQ", "2X40'HQ", "1X45'HQ"];
const scopes = ['all', 'personal', 'permission'] as const;
const modes: TransportMode[] = ['sea', 'air', 'rail'];

function pad(n: number, len = 2) {
  return String(n).padStart(len, '0');
}

function randomPick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeTime(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day} ${h}:${min}:00`;
}

export const saleOrderMockRecords: SaleOrderRecord[] = Array.from({ length: 120 }, (_, i) => {
  const idx = i + 1;
  const prefix = idx % 3 === 0 ? 'DCG' : 'PTP';
  const orderNo = `${prefix}${2024}${pad(Math.floor(idx / 3) + 1, 4)}${pad(idx % 1000, 4)}`;
  const dcgNo = `DCG${2024}${pad(idx, 6)}`;
  const whNo = idx % 4 === 0 ? `WH${2024}${pad(idx, 5)}` : '';
  return {
    Id: idx,
    OrderNo: orderNo,
    SubmitTime: makeTime(idx % 30),
    Status: randomPick(statuses),
    CargoType: randomPick(cargoTypes),
    BizType: randomPick(bizTypes),
    DcgNo: dcgNo,
    WarehouseNo: whNo,
    Salesman: randomPick(salesmen),
    Shipper: randomPick(shippers),
    Consignee: randomPick(consignees),
    ContainerInfo: randomPick(containers),
    TransportMode: randomPick(modes),
    ImportExport: idx % 2 === 0 ? '出口' : '进口',
    Operator: randomPick(operators),
    CustomerService: randomPick(salesmen),
    CsDocument: `单证${(idx % 5) + 1}`,
    PackingMethod: idx % 3 === 0 ? 'LCL' : 'FCL',
    QuickTag: idx % 7 === 0 ? '加急' : idx % 11 === 0 ? 'VIP' : '',
    HasRemark: idx % 6 === 0,
    HasFiles: idx % 3 !== 0,
    Scope: randomPick(scopes)
  };
});
