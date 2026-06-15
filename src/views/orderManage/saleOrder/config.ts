import type {
  AdvancedFieldGroup,
  PhaseFilter,
  QuickSearchField,
  SaleOrderListColumn,
  ScopeFilter,
  TransportType
} from './types';

export const saleOrderColumns: SaleOrderListColumn[] = [
  { title: '订单编号', field: 'DcgNo', width: 148 },
  { title: '状态', field: 'FollowState', width: 108 },
  { title: '业务单号', field: 'OrderNo', width: 128 },
  { title: '提交时间', field: 'SubmitTime', width: 142 },
  { title: '货物类型', field: 'CargoTypes', width: 92 },
  { title: '业务类型', field: 'BusinessTypeStr', width: 82 },
  { title: '入仓单号', field: 'WarehouseNo', width: 122 },
  { title: '客户', field: 'CustomerName', width: 156 },
  { title: '业务员', field: 'Salesman', width: 86 },
  { title: '发货人', field: 'Shipper', width: 150 },
  { title: '收货人', field: 'Consignees', width: 150 },
  { title: '起运港', field: 'LoaddingPortEn', width: 106 },
  { title: '目的港', field: 'DeliveryPortEn', width: 116 },
  { title: 'ETD', field: 'Etd', width: 96 },
  { title: 'ETA', field: 'Eta', width: 96 },
  { title: '驳船ETD', field: 'BargeEtd', width: 100 },
  { title: '船公司', field: 'ShipCompany', width: 94 },
  { title: '船名航次', field: 'ShipCompanyAndVoyno', width: 162 },
  { title: '航线', field: 'RouteName', width: 96 },
  { title: '装箱方式', field: 'LoaddingTypeStr', width: 96 },
  { title: '柜量', field: 'ContainerDataJson', width: 116 },
  { title: '柜号', field: 'ContainerNoStr', width: 124 },
  { title: 'HBL', field: 'HblNo', width: 150 },
  { title: 'MBL', field: 'MblNo', width: 170 },
  { title: '订单类型', field: 'OrderTypeStr', width: 96 },
  { title: '服务项', field: 'ServiceItemStr', width: 132 },
  { title: '服务范围', field: 'ServiceScopeStr', width: 88 },
  { title: '来源', field: 'SourceStr', width: 118 },
  { title: '文件', field: 'DownFile', width: 76, align: 'center' },
  { title: '操作', field: 'Operation', width: 88, align: 'center' }
];

export const transportTabs: Array<{ label: string; value: TransportType }> = [
  { label: '海运', value: 'sea' },
  { label: '空运', value: 'air' },
  { label: '铁路', value: 'rail' }
];

export const transportTypeMap: Record<TransportType, string> = {
  sea: '海运',
  air: '空运',
  rail: '铁路'
};

export const quickSearchFields: Array<{ label: string; value: QuickSearchField }> = [
  { label: '业务单号', value: 'OrderNo' },
  { label: '订单编号', value: 'DcgNo' },
  { label: '入仓单号', value: 'WarehouseNo' },
  { label: 'SO号', value: 'SoNo' },
  { label: '柜号', value: 'ContainerNoStr' },
  { label: 'MBL单号', value: 'MblNo' },
  { label: 'HBL单号', value: 'HblNo' },
  { label: 'FBA号', value: 'FbaNo' },
  { label: 'PO', value: 'Po' },
  { label: '境外单号', value: 'ExtraNo' },
  { label: '境外业务单号', value: 'ExtraOrderNo' }
];

export const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待订舱', value: '待审核' },
  { label: '待接单', value: '操作待接单' },
  { label: '待放行', value: '未提交' },
  { label: '运输中', value: '已接单' },
  { label: '已放行', value: '已放舱' },
  { label: '异常', value: '已拒绝' }
];

export const statusTextMap: Record<string, string> = {
  待审核: '待订舱',
  操作待接单: '待接单',
  未提交: '待放行',
  已接单: '运输中',
  已放舱: '已放行',
  已拒绝: '异常'
};

export const statusColorMap: Record<string, string> = {
  待审核: 'orange',
  操作待接单: 'arcoblue',
  未提交: 'gray',
  已接单: 'blue',
  已放舱: 'green',
  已拒绝: 'red'
};

export const scopeTabs: Array<{ label: string; value: ScopeFilter }> = [
  { label: '全部单', value: 'all' },
  { label: '个人单', value: 'mine' },
  { label: '权限单', value: 'permission' }
];

export const phaseStatusMap: Record<PhaseFilter, string[]> = {
  all: [],
  pending: ['待审核', '操作待接单'],
  processing: ['未提交', '已接单'],
  done: ['已放舱'],
  exception: ['已拒绝']
};

export const simpleSelectOptions = {
  businessType: [
    { label: '海运', value: '海运' },
    { label: '空运', value: '空运' },
    { label: '铁路', value: '铁路' }
  ],
  orderType: [
    { label: '出口单', value: 'export' },
    { label: '进口单', value: 'import' }
  ],
  loadingType: [
    { label: '整柜', value: '整柜' },
    { label: '拼箱', value: '拼箱' }
  ],
  serviceScope: [
    { label: '全程', value: '全程' },
    { label: '港到港', value: '港到港' },
    { label: '门到门', value: '门到门' }
  ],
  customerType: [
    { label: '直客', value: 'direct' },
    { label: '同行', value: 'peer' },
    { label: '代理', value: 'agent' }
  ],
  tradeTerms: [
    { label: 'FOB', value: 'FOB' },
    { label: 'CIF', value: 'CIF' },
    { label: 'EXW', value: 'EXW' }
  ],
  status: statusOptions.filter((item) => item.value),
  cargoType: [
    { label: '普货', value: '普货' },
    { label: '跨境电商', value: '跨境电商' },
    { label: '危险货', value: '危险货' }
  ],
  declarationType: [
    { label: '报关', value: '报关' },
    { label: '自拖自报', value: '自拖自报' }
  ]
};

export const filterGroups: AdvancedFieldGroup[] = [
  {
    title: '单号信息',
    columns: 4,
    fields: [
      { label: '订单编号', key: 'DcgNo', placeholder: '请输入订单编号' },
      { label: '业务单号', key: 'OrderNo', placeholder: '请输入业务单号' },
      { label: '进仓时间', key: 'WarehousingTimeRange', type: 'dateRange' },
      { label: '下单时间', key: 'CreatedTimeRange', type: 'dateRange' },
      { label: 'HBL NO', key: 'HblNo', placeholder: '请输入Hbl单号' },
      { label: 'FBA NO', key: 'FbaNo', placeholder: '请输入Fba号' },
      { label: 'ETD', key: 'EtdRange', type: 'dateRange' },
      { label: '财务POD', key: 'FinancePodTimeRange', type: 'dateRange' },
      { label: 'SO NO', key: 'SoNo', placeholder: '请输入So号' },
      { label: 'MBL NO', key: 'MblNo', placeholder: '请输入Mbl单号' },
      { label: '船前时间', key: 'BoatPreSendTimeRange', type: 'dateRange' },
      { label: 'PO', key: 'Po', placeholder: '请输入PO', span: 2 }
    ]
  },
  {
    title: '客户与角色',
    columns: 4,
    fields: [
      { label: '发货人', key: 'Shipper', placeholder: '请选择发货人' },
      { label: '收货人', key: 'Consignees', placeholder: '请选择收货人' },
      { label: '业务员', key: 'Salesman', placeholder: '请输入业务员' },
      { label: '业务类型', key: 'BusinessTypeStr', type: 'select', placeholder: '请选择业务类型', options: simpleSelectOptions.businessType },
      { label: '提单发货人', key: 'BillShipper', placeholder: '请选择提单发货人' },
      { label: '客户', key: 'CustomerName', placeholder: '请选择客户' },
      { label: '客服', key: 'CustomersServesName', placeholder: '请输入客服' },
      { label: '装箱方式', key: 'LoaddingTypeStr', type: 'select', placeholder: '请选择装箱方式', options: simpleSelectOptions.loadingType },
      { label: '收货地', key: 'ReceiptPlace', placeholder: '请选择' },
      { label: '起运港', key: 'LoaddingPortEn', placeholder: '请选择' },
      { label: '运营', key: 'Operator', placeholder: '请选择运营' },
      { label: '服务范围', key: 'ServiceScopeStr', type: 'select', placeholder: '请选择服务范围', options: simpleSelectOptions.serviceScope },
      { label: '目的港', key: 'DeliveryPortEn', placeholder: '请选择' },
      { label: '目的地', key: 'Destination', placeholder: '请选择' },
      { label: '操作员', key: 'OperatorName', placeholder: '请输入操作员' },
      { label: '归属公司', key: 'ContractCompany', type: 'select', placeholder: '请选择归属公司', options: [] },
      { label: '起运港国家', key: 'LoadCountry', placeholder: '请选择' },
      { label: '目的港国家', key: 'DeliveryCountry', placeholder: '请选择' },
      { label: '文件', key: 'FilerName', placeholder: '请输入文件' },
      { label: '客户类型', key: 'CustomerType', type: 'select', placeholder: '请选择客户类型', options: simpleSelectOptions.customerType }
    ]
  },
  {
    title: '运输与合同',
    columns: 4,
    fields: [
      { label: '船公司', key: 'ShipCompany', placeholder: '请选择船司' },
      { label: '柜号', key: 'ContainerNoStr', placeholder: '请输入柜号' },
      { label: '市场', key: 'Market', type: 'select', placeholder: '请选择市场', options: [] },
      { label: '贸易条款', key: 'CommissionTermsStr', type: 'select', placeholder: '请选择条款', options: simpleSelectOptions.tradeTerms },
      { label: '船名', key: 'ShipName', placeholder: '请输入船名' },
      { label: '航次', key: 'ShipCompanyAndVoyno', placeholder: '请输入航次' },
      { label: '合约号', key: 'ContractName', placeholder: '请选择合约号' },
      { label: '航线', key: 'RouteName', placeholder: '请输入航线' },
      { label: '境外代理', key: 'DAgent', placeholder: '请选择境外代理' },
      { label: '境外单号', key: 'ExtraNo', placeholder: '请输入境外单号' },
      { label: '入仓单号', key: 'WarehouseNo', placeholder: '请输入入仓单号' },
      { label: '柜型柜量', key: 'ContainerDataJson', placeholder: '请选择' },
      { label: '品名', key: 'OrderProductName', placeholder: '请输入品名' },
      { label: '账号归属部门', key: 'Department', type: 'select', placeholder: '请选择部门', options: [] },
      { label: '订单状态', key: 'FollowState', type: 'select', placeholder: '请选择订单状态', options: simpleSelectOptions.status },
      { label: '货物类型', key: 'CargoTypes', type: 'select', placeholder: '请选择货物类型', options: simpleSelectOptions.cargoType },
      { label: '报关方式', key: 'ServiceItemStr', type: 'select', placeholder: '请选择报关方式', options: simpleSelectOptions.declarationType },
      { label: '操作备注', key: 'OperationRemark', placeholder: '请输入操作备注', span: 2 },
      { label: '提单内容', key: 'BillContent', type: 'textarea', placeholder: '请输入提单内容', span: 2 }
    ]
  },
  {
    title: '业务标记',
    columns: 4,
    fields: [
      { label: '无客服订单', key: 'NoServiceOrder', type: 'checkbox' },
      { label: '不含继承单', key: 'ExcludeInheritOrder', type: 'checkbox' },
      { label: '入仓未核实', key: 'WarehouseUnchecked', type: 'checkbox' },
      { label: '最后一单(未回款)', key: 'LastUnpaidOrder', type: 'checkbox' },
      { label: '是否敏感货物', key: 'SensitiveCargo', type: 'checkbox' },
      { label: '是否甩柜', key: 'ContainerRolled', type: 'checkbox' },
      { label: '是否闪送柜', key: 'FlashDelivery', type: 'checkbox' },
      { label: '是否同行', key: 'PeerOrder', type: 'checkbox' }
    ]
  }
];
