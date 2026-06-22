import type { TransportMode } from './types';

export const transportDetailTitle: Record<TransportMode, string> = {
  sea: '海运业务单',
  air: '空运业务单',
  rail: '铁路业务单'
};

export const serviceItemOptions = [
  '订舱',
  '驳船',
  '拖车',
  '仓库内装',
  '报关',
  '保险',
  '清关',
  '派送'
];

export const staffRoleOptions = ['业务', '操作', '客服', '单证'];
export const companyOptions = ['深圳点达', '宁波分公司', '上海分公司', '广州分公司'];

export const portOptions = ['NINGBO', 'SHANGHAI', 'YANTIAN', 'HAMBURG', 'LOS ANGELES', 'ROTTERDAM'];
export const carrierOptions = ['COSCO', 'MSC', 'MAERSK', 'CMA', 'ONE'];
export const tradeTermsOptions = ['FOB', 'CIF', 'DDP', 'EXW', 'FCA'];
export const transportTermsOptions = ['CY/CY', 'CFS/CFS', 'DOOR/DOOR'];
export const blFormatOptions = ['MBL', 'HBL', 'SWB'];
export const cargoTypeCheckboxOptions = ['普货', '危险货', '带电池', '化工品', '液体', '粉末', '带磁', '无'];
export const orderTypeFlagOptions = ['多家拼', '多家拼同一', '自拼', '外配', 'FBA', '传统'];
export const declareMethodOptions = ['一般贸易', '9710', '9810', '1039'];
export const deliveryMethodOptions = ['卡派', '快递', '自提', '海外仓'];
export const clearanceTermsOptions = ['DAP', 'DDP', 'DPU'];
export const yesNoOptions = ['是', '否'];

export const detailDrawerWidth = 'min(1120px, 96vw)';
