import type { CustomerRecord } from '../views/customer/customerPool/types';

export const customerMockRecords: CustomerRecord[] = [
  {
    Id: 1,
    Name: 'Mueller GmbH & Co. KG',
    CustomerType: '贸易商',
    Level: 'A',
    Country: '德国',
    Tags: ['REPLIED', 'keep follow up', 'VIP'],
    Contacts: [
      { id: 'c1-1', name: 'Hans Mueller', email: 'hans@mueller-gmbh.de', phone: '+49 30 12345678', title: 'CEO' },
      { id: 'c1-2', name: 'Anna Schmidt', email: 'anna@mueller-gmbh.de', phone: '+49 30 87654321', title: 'Purchasing Manager' },
      { id: 'c1-3', name: 'Klaus Weber', email: 'k.weber@mueller-gmbh.de', phone: '+49 30 11112222', title: 'Logistics Coordinator' },
      { id: 'c1-4', name: 'Eva Braun', email: 'e.braun@mueller-gmbh.de', phone: '+49 30 33334444', title: 'Finance Director' }
    ],
    LatestFollowUp: '客户对Q3报价感兴趣，要求提供FOB汉堡价格，预计下单量20GP',
    LastUpdated: '2026-06-20',
    ProductName: '家用电器',
    CoopStatus: 'cooperated',
    Department: '欧洲一部',
    SalesContact: '张三',
    OperationContact: '李四',
    TradeTerms: 'FOB',
    TransportMode: 'sea',
    Pol: '深圳',
    Pod: '汉堡',
    CreatedAt: '2025-03-15',
    Remark: '长期稳定客户，每季度固定下单',
    FollowUps: [
      { id: 'f1-1', content: '发送Q3报价单，客户表示需要内部审批', createdAt: '2026-06-20 14:30', createdBy: '张三' },
      { id: 'f1-2', content: '电话沟通运输时效，客户要求35天以内', createdAt: '2026-06-15 10:00', createdBy: '张三' }
    ],
    IsStarred: true
  },
  {
    Id: 2,
    Name: 'Van Den Berg Trading BV',
    CustomerType: '货主',
    Level: 'B',
    Country: '比利时',
    Tags: ['INQUIRIED', 'BAU'],
    Contacts: [
      { id: 'c2-1', name: 'Pieter Van Den Berg', email: 'p.vandenberg@vdb-trading.be', phone: '+32 2 5551234', title: 'Owner' },
      { id: 'c2-2', name: 'Sophie Dubois', email: 'sophie@vdb-trading.be', phone: '+32 2 5555678', title: 'Import Manager' },
      { id: 'c2-3', name: 'Marc Lefevre', email: 'marc@vdb-trading.be', phone: '+32 2 5559012', title: 'Warehouse Manager' }
    ],
    LatestFollowUp: '已发送最新运费报价，等待客户回复',
    LastUpdated: '2026-06-18',
    ProductName: '工业零件',
    CoopStatus: 'cooperated',
    Department: '欧洲二部',
    SalesContact: '王五',
    OperationContact: '赵六',
    TradeTerms: 'CIF',
    TransportMode: 'sea',
    Pol: '上海',
    Pod: '安特卫普',
    CreatedAt: '2025-06-01',
    Remark: '新客户，正在建立合作关系',
    FollowUps: [
      { id: 'f2-1', content: '首次合作完成，客户满意度较高', createdAt: '2026-06-18 16:00', createdBy: '王五' }
    ],
    IsStarred: false
  },
  {
    Id: 3,
    Name: 'Dupont Logistique SAS',
    CustomerType: '货主',
    Level: 'A',
    Country: '法国',
    Tags: ['REPLIED', '重点跟进', 'VIP'],
    Contacts: [
      { id: 'c3-1', name: 'Jean Dupont', email: 'j.dupont@dupont-logistique.fr', phone: '+33 1 45678901', title: 'Director' },
      { id: 'c3-2', name: 'Marie Leclerc', email: 'm.leclerc@dupont-logistique.fr', phone: '+33 1 45678902', title: 'Supply Chain Manager' }
    ],
    LatestFollowUp: '客户要求提供DDP巴黎价格，数量约50CBM',
    LastUpdated: '2026-06-22',
    ProductName: '服装面料',
    CoopStatus: 'cooperated',
    Department: '欧洲一部',
    SalesContact: '张三',
    OperationContact: '李四',
    TradeTerms: 'DDP',
    TransportMode: 'sea',
    Pol: '广州',
    Pod: '勒阿弗尔',
    CreatedAt: '2024-11-20',
    Remark: 'VIP客户，优先服务',
    FollowUps: [
      { id: 'f3-1', content: '提供DDP报价，客户正在审核', createdAt: '2026-06-22 09:00', createdBy: '张三' },
      { id: 'f3-2', content: '客户确认上季度货物已全部到达', createdAt: '2026-06-10 11:30', createdBy: '张三' },
      { id: 'f3-3', content: '跟进新季度合作计划', createdAt: '2026-06-01 14:00', createdBy: '李四' }
    ],
    IsStarred: true
  },
  {
    Id: 4,
    Name: 'Rossi International Srl',
    CustomerType: '工厂',
    Level: 'B',
    Country: '意大利',
    Tags: ['邮件已读', 'keep follow up'],
    Contacts: [
      { id: 'c4-1', name: 'Marco Rossi', email: 'marco@rossi-intl.it', phone: '+39 02 12345678', title: 'Export Manager' },
      { id: 'c4-2', name: 'Giulia Ferrari', email: 'g.ferrari@rossi-intl.it', phone: '+39 02 87654321', title: 'Sales Director' },
      { id: 'c4-3', name: 'Luca Bianchi', email: 'l.bianchi@rossi-intl.it', phone: '+39 02 11223344', title: 'Accountant' },
      { id: 'c4-4', name: 'Sofia Conti', email: 's.conti@rossi-intl.it', phone: '+39 02 55667788', title: 'Operations' },
      { id: 'c4-5', name: 'Alessandro Gallo', email: 'a.gallo@rossi-intl.it', phone: '+39 02 99001122', title: 'CEO' }
    ],
    LatestFollowUp: '已读邮件但未回复，需要电话跟进',
    LastUpdated: '2026-06-19',
    ProductName: '机械配件',
    CoopStatus: 'not_cooperated',
    Department: '欧洲二部',
    SalesContact: '王五',
    OperationContact: '赵六',
    TradeTerms: 'EXW',
    TransportMode: 'sea',
    Pol: '宁波',
    Pod: '热那亚',
    CreatedAt: '2026-01-10',
    Remark: '潜在大客户，积极跟进',
    FollowUps: [
      { id: 'f4-1', content: '发送公司介绍和服务方案', createdAt: '2026-06-19 10:00', createdBy: '王五' }
    ],
    IsStarred: false
  },
  {
    Id: 5,
    Name: 'De Groot Logistics BV',
    CustomerType: '同行',
    Level: 'C',
    Country: '荷兰',
    Tags: ['BAU', '长期合作'],
    Contacts: [
      { id: 'c5-1', name: 'Jan De Groot', email: 'jan@degroot-logistics.nl', phone: '+31 20 1234567', title: 'Partner' },
      { id: 'c5-2', name: 'Lisa Van Dam', email: 'lisa@degroot-logistics.nl', phone: '+31 20 7654321', title: 'Operations Manager' }
    ],
    LatestFollowUp: '常规合作，月结账期无异常',
    LastUpdated: '2026-06-17',
    ProductName: '综合货物',
    CoopStatus: 'cooperated',
    Department: '欧洲一部',
    SalesContact: '张三',
    OperationContact: '李四',
    TradeTerms: 'FOB',
    TransportMode: 'sea',
    Pol: '深圳',
    Pod: '鹿特丹',
    CreatedAt: '2023-08-01',
    Remark: '同行互助，稳定合作3年',
    FollowUps: [
      { id: 'f5-1', content: '月度对账完成，无异议', createdAt: '2026-06-17 16:30', createdBy: '李四' }
    ],
    IsStarred: false
  },
  {
    Id: 6,
    Name: 'Garcia Exportaciones SL',
    CustomerType: '贸易商',
    Level: 'B',
    Country: '西班牙',
    Tags: ['INQUIRIED', '潜在客户'],
    Contacts: [
      { id: 'c6-1', name: 'Carlos Garcia', email: 'carlos@garcia-export.es', phone: '+34 91 1234567', title: 'CEO' },
      { id: 'c6-2', name: 'Isabel Martinez', email: 'isabel@garcia-export.es', phone: '+34 91 7654321', title: 'Purchasing' },
      { id: 'c6-3', name: 'Diego Lopez', email: 'd.lopez@garcia-export.es', phone: '+34 91 2345678', title: 'Logistics' }
    ],
    LatestFollowUp: '客户询问FCL价格，深圳到巴塞罗那，月均3-5票',
    LastUpdated: '2026-06-21',
    ProductName: '家具',
    CoopStatus: 'not_cooperated',
    Department: '欧洲二部',
    SalesContact: '王五',
    OperationContact: '赵六',
    TradeTerms: 'CFR',
    TransportMode: 'sea',
    Pol: '深圳',
    Pod: '巴塞罗那',
    CreatedAt: '2026-04-05',
    Remark: '通过展会获取，积极开发中',
    FollowUps: [
      { id: 'f6-1', content: '发送FCL报价，等待回复', createdAt: '2026-06-21 14:00', createdBy: '王五' },
      { id: 'f6-2', content: '展会上交换名片，初步了解需求', createdAt: '2026-05-15 10:00', createdBy: '王五' }
    ],
    IsStarred: false
  },
  {
    Id: 7,
    Name: 'Kowalski Import Export Sp. z o.o.',
    CustomerType: '货主',
    Level: 'C',
    Country: '波兰',
    Tags: ['keep follow up'],
    Contacts: [
      { id: 'c7-1', name: 'Marek Kowalski', email: 'm.kowalski@kowalski-ie.pl', phone: '+48 22 1234567', title: 'Owner' },
      { id: 'c7-2', name: 'Anna Wisniewska', email: 'a.wisniewska@kowalski-ie.pl', phone: '+48 22 7654321', title: 'Manager' }
    ],
    LatestFollowUp: '价格敏感，需要继续跟进降低运价',
    LastUpdated: '2026-06-14',
    ProductName: '消费电子',
    CoopStatus: 'not_cooperated',
    Department: '欧洲二部',
    SalesContact: '王五',
    OperationContact: '赵六',
    TradeTerms: 'FOB',
    TransportMode: 'sea',
    Pol: '上海',
    Pod: '格但斯克',
    CreatedAt: '2026-02-18',
    Remark: '价格敏感型客户',
    FollowUps: [
      { id: 'f7-1', content: '再次联系，客户对价格不满意', createdAt: '2026-06-14 11:00', createdBy: '王五' }
    ],
    IsStarred: false
  },
  {
    Id: 8,
    Name: 'Novak & Syn s.r.o.',
    CustomerType: '工厂',
    Level: 'A',
    Country: '捷克',
    Tags: ['REPLIED', 'VIP', '重点跟进'],
    Contacts: [
      { id: 'c8-1', name: 'Petr Novak', email: 'p.novak@novak-syn.cz', phone: '+420 2 12345678', title: 'Director' },
      { id: 'c8-2', name: 'Jana Novakova', email: 'j.novakova@novak-syn.cz', phone: '+420 2 87654321', title: 'Supply Chain' },
      { id: 'c8-3', name: 'Tomas Dvorak', email: 't.dvorak@novak-syn.cz', phone: '+420 2 11223344', title: 'Finance' }
    ],
    LatestFollowUp: '确认Q2订单已安排装箱，客户满意',
    LastUpdated: '2026-06-23',
    ProductName: '汽车配件',
    CoopStatus: 'cooperated',
    Department: '欧洲一部',
    SalesContact: '张三',
    OperationContact: '李四',
    TradeTerms: 'DDP',
    TransportMode: 'sea',
    Pol: '宁波',
    Pod: '汉堡',
    CreatedAt: '2024-05-20',
    Remark: 'A级战略客户，汽配行业',
    FollowUps: [
      { id: 'f8-1', content: 'Q2装箱计划已确认，共5票40HQ', createdAt: '2026-06-23 09:30', createdBy: '张三' },
      { id: 'f8-2', content: '客户审厂顺利通过', createdAt: '2026-06-01 15:00', createdBy: '李四' }
    ],
    IsStarred: true
  },
  {
    Id: 9,
    Name: 'American Consumer Goods LLC',
    CustomerType: '贸易商',
    Level: 'A',
    Country: '美国',
    Tags: ['REPLIED', 'BAU', '长期合作'],
    Contacts: [
      { id: 'c9-1', name: 'Robert Johnson', email: 'r.johnson@acg-us.com', phone: '+1 213 5551234', title: 'VP Purchasing' },
      { id: 'c9-2', name: 'Emily Davis', email: 'e.davis@acg-us.com', phone: '+1 213 5555678', title: 'Import Coordinator' },
      { id: 'c9-3', name: 'Michael Brown', email: 'm.brown@acg-us.com', phone: '+1 213 5559012', title: 'Logistics Manager' },
      { id: 'c9-4', name: 'Sarah Wilson', email: 's.wilson@acg-us.com', phone: '+1 213 5553456', title: 'Finance' }
    ],
    LatestFollowUp: '月度回顾会议完成，Q3计划20个40HC',
    LastUpdated: '2026-06-22',
    ProductName: '玩具',
    CoopStatus: 'cooperated',
    Department: '美洲部',
    SalesContact: '陈七',
    OperationContact: '林八',
    TradeTerms: 'FOB',
    TransportMode: 'sea',
    Pol: '深圳',
    Pod: '洛杉矶',
    CreatedAt: '2022-12-01',
    Remark: '美洲核心客户，合作4年',
    FollowUps: [
      { id: 'f9-1', content: 'Q3计划20个40HC，需要提前订舱', createdAt: '2026-06-22 20:00', createdBy: '陈七' },
      { id: 'f9-2', content: '讨论旺季涨价方案', createdAt: '2026-06-10 09:00', createdBy: '陈七' }
    ],
    IsStarred: true
  },
  {
    Id: 10,
    Name: 'British Retail Consortium Ltd',
    CustomerType: '货主',
    Level: 'B',
    Country: '英国',
    Tags: ['邮件已读', 'INQUIRIED'],
    Contacts: [
      { id: 'c10-1', name: 'James Thompson', email: 'j.thompson@brc-uk.co.uk', phone: '+44 20 71234567', title: 'Head of Procurement' },
      { id: 'c10-2', name: 'Charlotte Evans', email: 'c.evans@brc-uk.co.uk', phone: '+44 20 77654321', title: 'Logistics Director' }
    ],
    LatestFollowUp: '脱欧后进关税率有变化，需重新报价',
    LastUpdated: '2026-06-16',
    ProductName: '日用百货',
    CoopStatus: 'not_cooperated',
    Department: '欧洲一部',
    SalesContact: '张三',
    OperationContact: '李四',
    TradeTerms: 'CIF',
    TransportMode: 'sea',
    Pol: '广州',
    Pod: '费利克斯托',
    CreatedAt: '2026-03-22',
    Remark: '英国市场，需注意清关手续',
    FollowUps: [
      { id: 'f10-1', content: '确认最新进口税率，重新报价中', createdAt: '2026-06-16 14:00', createdBy: '张三' }
    ],
    IsStarred: false
  }
];
