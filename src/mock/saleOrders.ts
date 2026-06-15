export interface SaleOrderRecord {
  id: number;
  groupId: string;
  SubmitTime: string;
  DcgNo: string;
  FollowState: '待审核' | '操作待接单' | '未提交' | '已接单' | '已放舱' | '已拒绝';
  CargoTypes: string;
  BusinessTypeStr: string;
  OrderNo: string;
  WarehouseNo: string;
  Salesman: string;
  Shipper: string;
  Consignees: string;
  ContainerDataJson: string;
  ContainerNoStr: string;
  LoaddingPortEn: string;
  HblNo: string;
  MblNo: string;
  DeliveryPortEn: string;
  Etd: string;
  Eta: string;
  BargeEtd: string;
  ShipCompany: string;
  ShipCompanyAndVoyno: string;
  RouteName: string;
  OrderTypeStr: string;
  ServiceItemStr: string;
  ServiceScopeStr: string;
  SourceStr: string;
  ProductMass: string;
  ProductGrossWeight: string;
  ProductVolume: string;
  WarehousingTime: string;
  FbaTransportTypeStr: string;
  CustomerName: string;
  ContractName: string;
  CreatedTime: string;
  DAgent: string;
  LoaddingTypeStr: string;
  Agent: string;
  CustomersServesName: string;
  Operator: string;
  FilerName: string;
  WarehouseState: string;
  FbaNo: string;
  Po: string;
  CommissionTermsStr: string;
  BatchSendHblMailTemplateName: string;
  CalculateTCount: string;
  OrderProductName: string;
  ContractCompany: string;
  FinancePodTimeStr: string;
  BoatPreSendTimeStr: string;
  DownFile: string;
  Operation: string;
}
export interface SaleOrderColumn {
  title: string;
  field: keyof SaleOrderRecord;
  width: number;
  sortable?: boolean;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
}
export const seaSaleOrderColumns: SaleOrderColumn[] = [
  { title: '提交时间', field: 'SubmitTime', width: 150, sortable: true },
  { title: '订单编号', field: 'DcgNo', width: 180, sortable: true },
  { title: '订单状态', field: 'FollowState', width: 90 },
  { title: '货物类型', field: 'CargoTypes', width: 90 },
  { title: '业务类型', field: 'BusinessTypeStr', width: 70 },
  { title: '业务单号', field: 'OrderNo', width: 110, sortable: true },
  { title: '入仓单号', field: 'WarehouseNo', width: 120, sortable: true },
  { title: '业务员', field: 'Salesman', width: 110 },
  { title: '发货人', field: 'Shipper', width: 110 },
  { title: '收货人', field: 'Consignees', width: 120 },
  { title: '柜型柜量', field: 'ContainerDataJson', width: 120 },
  { title: '柜号', field: 'ContainerNoStr', width: 120 },
  { title: '起运港', field: 'LoaddingPortEn', width: 118 },
  { title: 'HBL单号', field: 'HblNo', width: 120, sortable: true },
  { title: 'MBL主单号', field: 'MblNo', width: 140, sortable: true },
  { title: '目的港', field: 'DeliveryPortEn', width: 118 },
  { title: 'ETD', field: 'Etd', width: 90, sortable: true },
  { title: 'ETA', field: 'Eta', width: 90, sortable: true },
  { title: '驳船ETD', field: 'BargeEtd', width: 90, sortable: true },
  { title: '船公司', field: 'ShipCompany', width: 90 },
  { title: '船名航次', field: 'ShipCompanyAndVoyno', width: 160 },
  { title: '航线', field: 'RouteName', width: 120 },
  { title: '订单类型', field: 'OrderTypeStr', width: 90 },
  { title: '服务项', field: 'ServiceItemStr', width: 150 },
  { title: '服务范围', field: 'ServiceScopeStr', width: 70 },
  { title: '来源', field: 'SourceStr', width: 100 },
  { title: '件数', field: 'ProductMass', width: 90, sortable: true },
  { title: '毛重', field: 'ProductGrossWeight', width: 90, sortable: true },
  { title: '体积', field: 'ProductVolume', width: 90, sortable: true },
  { title: '预计进仓时间', field: 'WarehousingTime', width: 140, sortable: true },
  { title: 'FBA运输方式', field: 'FbaTransportTypeStr', width: 90 },
  { title: '客户名称', field: 'CustomerName', width: 90 },
  { title: '合同名称', field: 'ContractName', width: 110 },
  { title: '创建时间', field: 'CreatedTime', width: 150, sortable: true },
  { title: '目的港代理', field: 'DAgent', width: 90 },
  { title: '装柜方式', field: 'LoaddingTypeStr', width: 120 },
  { title: '订舱代理', field: 'Agent', width: 170 },
  { title: '客服', field: 'CustomersServesName', width: 90 },
  { title: '操作员', field: 'Operator', width: 90 },
  { title: '文件员', field: 'FilerName', width: 90 },
  { title: '入仓状态', field: 'WarehouseState', width: 110 },
  { title: 'FBA号', field: 'FbaNo', width: 90 },
  { title: 'PO号', field: 'Po', width: 120 },
  { title: '委托条款', field: 'CommissionTermsStr', width: 70 },
  { title: 'HBL邮件模板', field: 'BatchSendHblMailTemplateName', width: 120 },
  { title: '计费数', field: 'CalculateTCount', width: 90 },
  { title: '品名', field: 'OrderProductName', width: 120 },
  { title: '合同公司', field: 'ContractCompany', width: 160 },
  { title: '财务POD', field: 'FinancePodTimeStr', width: 120 },
  { title: '船前发送时间', field: 'BoatPreSendTimeStr', width: 160 },
  { title: '文件下载', field: 'DownFile', width: 70, fixed: 'right', align: 'center' },
  { title: '操作', field: 'Operation', width: 70, fixed: 'right', align: 'center' }
];
const customers = [
  'PTP supply chain',
  'ALIK',
  'ZHANGSAN',
  'qian 测试公司 PTP',
  '宁波蓝民商业有限公司',
  'TA UNITED KINGDOM',
  'VEIL',
  'TEST'
];
const shipCompanies = ['OOCL', 'EVERGREEN', 'COSCOTTT', 'MSC', 'CMA', 'ONE'];
const vesselVoyages = ['OOCL GDYNIA/010W', 'EVER GENIUS/0815-031W', 'OOCL TURKIYE/011W', '123/321', '/', 'OOCL ABU DHABI/008W'];
const states: SaleOrderRecord['FollowState'][] = ['待审核', '操作待接单', '未提交', '已接单', '已放舱', '已拒绝'];
const serviceItems = ['仓储、报关', '自拖自报', '报关', '仓储、报关、拖车'];
const businessTypes = ['海运', '空运', '铁路'];
const baseSaleOrders: SaleOrderRecord[] = Array.from({ length: 18 }, (_, index) => {
  const no = 60079 + index;
  const customer = customers[index % customers.length];
  const shipCompany = shipCompanies[index % shipCompanies.length];
  const state = states[index % states.length];
  const etdDay = 10 + (index % 18);
  const etaDay = 12 + (index % 14);
  return {
    id: index + 1,
    groupId: `PTP260${no}`,
    SubmitTime: `2026-06-${String(15 - (index % 9)).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:30`,
    DcgNo: index % 5 === 0 ? `DCG260${no}` : `PTP260${no}`,
    FollowState: state,
    CargoTypes: index % 3 === 0 ? '普货' : '跨境电商',
    BusinessTypeStr: businessTypes[index % businessTypes.length],
    OrderNo: index % 7 === 0 ? `PTPPTP260${no}` : `PTP260${no}`,
    WarehouseNo: index % 4 === 0 ? `GPTP60${no}` : '',
    Salesman: ['王敏', '陈浩', '李妍', '赵凯'][index % 4],
    Shipper: index % 3 === 0 ? '宁波港配商业有限...' : customer,
    Consignees: customer,
    ContainerDataJson: index % 4 === 0 ? 'LCL' : index % 4 === 1 ? "1X20'GP" : "1X40'RF;1X45'RH",
    ContainerNoStr: index % 6 === 0 ? `GPTP60${no}` : '',
    LoaddingPortEn:
      index % 3 === 1 ? 'PVG' : index % 3 === 2 ? 'XI AN RAIL' : index % 5 === 0 ? 'SHANGHAI' : 'YANTIAN',
    HblNo: index % 3 === 0 ? `PTP260${no}` : index % 3 === 1 ? `UUKDCG2509${150 + index}` : '',
    MblNo: index % 2 === 0 ? `MBLPTP260${no}` : `MBL202606${String(10 + index).padStart(2, '0')}`,
    DeliveryPortEn: index % 3 === 1 ? 'LAX' : index % 3 === 2 ? 'DUISBURG' : index % 6 === 0 ? 'YANTIAN' : 'FELIXSTOWE',
    Etd: `2026-06-${String(etdDay).padStart(2, '0')}`,
    Eta: `2026-07-${String(etaDay).padStart(2, '0')}`,
    BargeEtd: index % 4 === 0 ? `2026-06-${String(etdDay - 2).padStart(2, '0')}` : '',
    ShipCompany: index % 3 === 1 ? 'CA' : index % 3 === 2 ? 'CRCT' : index % 5 === 0 ? '' : shipCompany,
    ShipCompanyAndVoyno:
      index % 3 === 1 ? `CA${980 + index}` : index % 3 === 2 ? `CHINA-EU RAIL ${120 + index}` : vesselVoyages[index % vesselVoyages.length],
    RouteName: index % 3 === 1 ? 'AIR-US' : index % 3 === 2 ? 'RAIL-EU' : index % 2 === 0 ? 'NE1' : 'AEU1',
    OrderTypeStr: index % 3 === 0 ? '合约' : '自拖自报',
    ServiceItemStr: serviceItems[index % serviceItems.length],
    ServiceScopeStr: '全程',
    SourceStr: index % 4 === 0 ? '客户端' : '后台操作系统',
    ProductMass: `${40 + index * 3} CTN`,
    ProductGrossWeight: `${(5.6 + index * 0.42).toFixed(2)} T`,
    ProductVolume: `${(18 + index * 1.8).toFixed(2)} CBM`,
    WarehousingTime: `2026-06-${String(8 + (index % 18)).padStart(2, '0')}`,
    FbaTransportTypeStr: index % 2 === 0 ? '海卡' : '',
    CustomerName: customer,
    ContractName: index % 3 === 0 ? '英国基础合约' : '欧洲标准价',
    CreatedTime: `2026-05-${String(18 + (index % 11)).padStart(2, '0')} 14:20`,
    DAgent: index % 2 === 0 ? 'UK AGENT' : '',
    LoaddingTypeStr: index % 2 === 0 ? '整柜' : '拼箱',
    Agent: index % 3 === 0 ? '测试订舱代理地址' : 'OHL Booking Agent',
    CustomersServesName: ['周宁', '刘洋', '孙杰'][index % 3],
    Operator: ['王敏', '陈浩', '李妍', '赵凯'][index % 4],
    FilerName: ['张琳', '吴越', '马骏'][index % 3],
    WarehouseState: index % 4 === 0 ? '已入仓' : '待入仓',
    FbaNo: index % 3 === 0 ? `FBA15${no}` : '',
    Po: index % 5 === 0 ? `PO-${no}` : '',
    CommissionTermsStr: index % 2 === 0 ? 'FOB' : 'CIF',
    BatchSendHblMailTemplateName: index % 3 === 0 ? '英国HBL模板' : '',
    CalculateTCount: `${(1 + index / 10).toFixed(1)}T`,
    OrderProductName: index % 2 === 0 ? '服装配件' : '电子配件',
    ContractCompany: index % 2 === 0 ? 'OHL GLOBAL LOGISTICS LTD' : 'OHL SUPPLY CHAIN',
    FinancePodTimeStr: index % 6 === 0 ? '2026-07-30' : '',
    BoatPreSendTimeStr: index % 3 === 0 ? '2026-06-18 10:30' : '',
    DownFile: 'download',
    Operation: '...'
  };
});
export const saleOrders: SaleOrderRecord[] = baseSaleOrders;
