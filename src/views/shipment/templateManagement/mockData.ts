import type { TemplateRecord } from './types';

const carriers = ['MAERSK', 'COSCO', 'CMA CGM', 'ONE', 'EVERGREEN', 'HAPAG-LLOYD'];
const ports = ['SHANGHAI, CN', 'NINGBO, CN', 'YANTIAN, CN', 'QINGDAO, CN', 'XIAMEN, CN'];
const destinations = ['FELIXSTOWE, GB', 'HAMBURG, DE', 'ROTTERDAM, NL', 'LOS ANGELES, US', 'SINGAPORE, SG'];
const creators = ['admin', 'salesmanSZ', 'GNYW_IT', 'xia'];
const names = ['欧洲基础模板', '美西标准模板', '华东公共模板', '同行出单模板', '电放提单模板', '客户专用模板'];

export const createTemplateMockRows = (): TemplateRecord[] => Array.from({ length: 46 }, (_, index) => {
  const sequence = index + 1;
  const createdMonth = String((index % 9) + 1).padStart(2, '0');
  const createdDay = String((index % 25) + 1).padStart(2, '0');
  const updatedDay = String(((index + 3) % 25) + 1).padStart(2, '0');
  return {
    id: `tpl-${sequence}`,
    templateType: index % 5 === 0 ? 'supplement' : 'master',
    templateName: `${names[index % names.length]}${sequence > names.length ? ` ${sequence}` : ''}`,
    carrier: carriers[index % carriers.length],
    contractNo: index % 4 === 0 ? `TEST-${264480 + sequence}` : `${carriers[index % carriers.length].slice(0, 3)}-${202600 + sequence}`,
    pol: ports[index % ports.length],
    pod: destinations[index % destinations.length],
    peer: index % 3 === 0 ? ['COSCO', 'MSC', 'TSL'][index % 3] : '',
    creator: creators[index % creators.length],
    createdAt: `2026-${createdMonth}-${createdDay} ${String(9 + (index % 9)).padStart(2, '0')}:${String(10 + (index % 40)).padStart(2, '0')}:00`,
    updatedAt: `2026-${createdMonth}-${updatedDay} ${String(10 + (index % 8)).padStart(2, '0')}:${String(12 + (index % 40)).padStart(2, '0')}:00`,
    viewers: index % 4 === 0 ? ['Chris', 'Link', 'GNYW', 'Iris'] : index % 4 === 1 ? ['Alik'] : [],
    isPublic: index % 3 !== 0,
    isSwitchBill: index % 7 === 0,
  };
});
