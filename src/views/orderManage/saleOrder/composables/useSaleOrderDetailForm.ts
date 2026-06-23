import type {
  DetailAttachmentRow,
  DetailCargoBlock,
  DetailCargoItemRow,
  SaleOrderDetailModel,
  SaleOrderRecord,
  TransportMode
} from '../types';

let uidSeq = 0;
export function detailUid() {
  uidSeq += 1;
  return `d_${uidSeq}_${Date.now()}`;
}

function emptyCargoItem(): DetailCargoItemRow {
  return {
    id: detailUid(),
    cnName: '',
    enName: '',
    mark: '',
    hsCode: '',
    qty: 0,
    unit: 'CTNS',
    grossWeight: 0,
    volume: 0
  };
}

function defaultCargoBlock(shipper = '', consignee = ''): DetailCargoBlock {
  return {
    id: detailUid(),
    shipper,
    consignee,
    notifyParty: 'SAME AS CONSIGNEE',
    overseasAgent: '',
    vatNo: '',
    eoriNo: '',
    remark: '',
    items: [
      {
        id: detailUid(),
        cnName: '电子配件',
        enName: 'ELECTRONIC PARTS',
        mark: 'N/M',
        hsCode: '8543709990',
        qty: 100,
        unit: 'CTNS',
        grossWeight: 1200,
        volume: 8.5
      },
      {
        id: detailUid(),
        cnName: '塑料外壳',
        enName: 'PLASTIC CASE',
        mark: 'N/M',
        hsCode: '3926909090',
        qty: 102,
        unit: 'CTNS',
        grossWeight: 1020,
        volume: 11.5
      }
    ]
  };
}

function defaultAttachments(hasFiles = false): DetailAttachmentRow[] {
  return [
    {
      id: detailUid(),
      docType: '订舱委托书',
      fileName: hasFiles ? 'booking-instruction.pdf' : '',
      files: hasFiles
        ? [{
            id: detailUid(),
            name: 'booking-instruction.pdf',
            size: '246 KB',
            uploader: '操作A',
            uploadTime: '2026-06-18 10:24',
            status: 'uploaded'
          }]
        : [],
      required: true,
      multiple: false,
      status: hasFiles ? 'uploaded' : 'missing',
      uploader: hasFiles ? '操作A' : '',
      uploadTime: hasFiles ? '2026-06-18 10:24' : ''
    },
    {
      id: detailUid(),
      docType: '报关资料',
      fileName: hasFiles ? 'customs-docs.zip' : '',
      files: hasFiles
        ? [
            {
              id: detailUid(),
              name: 'commercial-invoice.pdf',
              size: '512 KB',
              uploader: '客服B',
              uploadTime: '2026-06-18 11:06',
              status: 'review'
            },
            {
              id: detailUid(),
              name: 'packing-list.xlsx',
              size: '88 KB',
              uploader: '客服B',
              uploadTime: '2026-06-18 11:08',
              status: 'uploaded'
            }
          ]
        : [],
      required: true,
      multiple: true,
      status: hasFiles ? 'review' : 'missing',
      uploader: hasFiles ? '客服B' : '',
      uploadTime: hasFiles ? '2026-06-18 11:06' : ''
    },
    {
      id: detailUid(),
      docType: '提单文件',
      fileName: hasFiles ? 'hbl-draft.pdf' : '',
      files: hasFiles
        ? [{
            id: detailUid(),
            name: 'hbl-draft.pdf',
            size: '324 KB',
            uploader: '单证C',
            uploadTime: '2026-06-19 09:18',
            status: 'uploaded'
          }]
        : [],
      required: false,
      multiple: true,
      status: hasFiles ? 'uploaded' : 'missing',
      uploader: hasFiles ? '单证C' : '',
      uploadTime: hasFiles ? '2026-06-19 09:18' : ''
    }
  ];
}

export function createEmptyDetail(mode: TransportMode): SaleOrderDetailModel {
  return {
    DcgNo: '',
    OrderNo: '',
    BizType: 'FBA',
    PackingMethod: 'LCL GROUP (自拼)',
    Customer: '',
    Po: '',
    ServiceScope: '',
    ServiceItems: ['订舱', '报关', '拖车'],
    OwnerCompany: '深圳点达',
    ImportExport: '出口',
    CargoTypes: ['普货'],
    Pol: '',
    Pod: '',
    Pot: '',
    FinalDestination: '',
    Carrier: '',
    Route: '',
    VesselVoyage: '',
    Etd: '',
    Eta: '',
    TransportTerms: 'CY/CY',
    TransportModeLabel: '海运',
    TradeTerms: 'FOB',
    BlFormat: 'MBL',
    MblFormat: 'MBL',
    NeedHandoverHeader: false,
    EstWarehouse: '',
    EstInboundTime: '',
    EstOutboundTime: '',
    NeedInboundPhoto: false,
    CustomerRemark: '',
    OverseasRemark: '',
    AttachmentRemark: '',
    AttachmentRows: defaultAttachments(false),
    OrderTypeFlags: [],
    StaffRows: [
      { id: detailUid(), company: '深圳点达', role: '业务', userName: '' },
      { id: detailUid(), company: '深圳点达', role: '操作', userName: '' }
    ],
    CargoBlocks: [defaultCargoBlock()],
    CustomsRows: [],
    DeliveryRows: [],
    ClearanceRows: [],
    ClearanceTerms: 'DDP',
    PrepaidTax: '否',
    PvaDefer: '否',
    OverseasAgentFee: '否',
    CustomerPaysCustoms: '否',
    Status: 'draft',
    TransportMode: mode,
    Salesman: '',
    Operator: '',
    CustomerService: '',
    Shipper: '',
    Consignee: '',
    ContainerInfo: '',
    CargoType: '普货'
  };
}

export function detailFromRecord(row: SaleOrderRecord): SaleOrderDetailModel {
  const base = createEmptyDetail(row.TransportMode);
  return {
    ...base,
    DcgNo: row.DcgNo,
    OrderNo: row.OrderNo,
    BizType: row.BizType,
    PackingMethod: row.PackingMethod || 'LCL GROUP (自拼)',
    Customer: row.Shipper.slice(0, 24) || '安迪测试',
    ImportExport: row.ImportExport,
    Pol: 'NINGBO',
    Pod: 'LOS ANGELES',
    Pot: '',
    FinalDestination: 'LOS ANGELES, CA',
    Carrier: 'COSCO',
    Route: 'PNW',
    VesselVoyage: 'COSCO SHIPPING / 042E',
    Etd: row.SubmitTime.slice(0, 10),
    Eta: '',
    TradeTerms: row.BizType === 'DDP' ? 'DDP' : 'FOB',
    EstWarehouse: '宁波仓',
    EstInboundTime: row.SubmitTime.slice(0, 10),
    Salesman: row.Salesman,
    Operator: row.Operator,
    CustomerService: row.CustomerService,
    Shipper: row.Shipper,
    Consignee: row.Consignee,
    ContainerInfo: row.ContainerInfo,
    CargoType: row.CargoType,
    CargoTypes: row.CargoType ? [row.CargoType] : ['普货'],
    AttachmentRows: defaultAttachments(row.HasFiles),
    Status: row.Status,
    TransportMode: row.TransportMode,
    StaffRows: [
      { id: detailUid(), company: '深圳点达', role: '业务', userName: row.Salesman },
      { id: detailUid(), company: '深圳点达', role: '操作', userName: row.Operator },
      { id: detailUid(), company: '深圳点达', role: '客服', userName: row.CustomerService }
    ],
    CargoBlocks: [
      defaultCargoBlock(row.Shipper, row.Consignee),
      ...(row.PackingMethod !== 'LCL'
        ? []
        : [
            {
              ...defaultCargoBlock(`${row.Shipper.slice(0, 12)}（分单）`, row.Consignee),
              items: [
                {
                  id: detailUid(),
                  cnName: '家居用品',
                  enName: 'HOME SUPPLIES',
                  mark: 'N/M',
                  hsCode: '9403609990',
                  qty: 50,
                  unit: 'CTNS',
                  grossWeight: 680,
                  volume: 4.2
                }
              ]
            }
          ])
    ],
    CustomsRows: row.PackingMethod !== 'LCL'
      ? []
      : [
          {
            id: detailUid(),
            shipper: row.Shipper,
            declareMethod: '一般贸易',
            uploadTime: row.SubmitTime.slice(0, 10)
          }
        ],
    DeliveryRows: [
      {
        id: detailUid(),
        hblNo: row.DcgNo,
        destination: row.Consignee.slice(0, 20),
        deliveryMethod: '卡派',
        expressCo: '',
        expressNo: '',
        privateWhNo: ''
      }
    ],
    ClearanceRows: [
      {
        id: detailUid(),
        importer: row.Consignee.slice(0, 20),
        eoriInfo: '',
        vatNo: '',
        invoiceNo: '',
        address: ''
      }
    ]
  };
}

export function detailToFormModel(d: SaleOrderDetailModel) {
  return {
    DcgNo: d.DcgNo,
    OrderNo: d.OrderNo,
    BizType: d.BizType,
    CargoType: d.CargoTypes[0] ?? d.CargoType,
    ImportExport: d.ImportExport,
    Salesman: d.Salesman,
    Operator: d.Operator,
    CustomerService: d.CustomerService,
    Shipper: d.Shipper || d.CargoBlocks[0]?.shipper || '',
    Consignee: d.Consignee || d.CargoBlocks[0]?.consignee || '',
    ContainerInfo: d.ContainerInfo,
    PackingMethod: d.PackingMethod,
    Status: d.Status,
    TransportMode: d.TransportMode
  };
}

export function calcCargoSummary(blocks: DetailCargoBlock[]) {
  let qty = 0;
  let weight = 0;
  let volume = 0;
  blocks.forEach((b) => {
    b.items.forEach((it) => {
      qty += it.qty || 0;
      weight += it.grossWeight || 0;
      volume += it.volume || 0;
    });
  });
  return { qty, weight, volume };
}

export function calcBlockSummary(block: DetailCargoBlock) {
  let qty = 0;
  let weight = 0;
  let volume = 0;
  block.items.forEach((it) => {
    qty += it.qty || 0;
    weight += it.grossWeight || 0;
    volume += it.volume || 0;
  });
  return { qty, weight, volume };
}

export { emptyCargoItem };
