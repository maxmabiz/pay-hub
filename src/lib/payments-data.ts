export type PaymentStatus =
  | "pending_submit"
  | "pending_review"
  | "pending_pay"
  | "pending_receipt"
  | "completed"
  | "review_rejected"
  | "voided";

export type PaymentApplyType =
  | "证书费用"
  | "备用金付款（采购专用）"
  | "客户相关费用"
  | "备用金冲销（采购专用）"
  | "商品运费"
  | "样品费"
  | "其他费用"
  | "商品采购（无合同）【金额1万以下】"
  | "拍摄费用"
  | "1688采购合同（需盖章，无需付款）"
  | "商品采购（有合同）";

/** 收款方式类型编码：1 银行卡、2 支付宝 */
export type PaymentMethodType = "1" | "2";

/** 付款渠道。明细页只读；复核确认时由系统写入，默认万里汇 */
export type PaymentChannel = "万里汇" | "连连国际" | "PingPong" | "银行直连";

/** 支付状态（仅查询引导页列表，位于付款单状态右侧） */
export type PayResultStatus = "未支付" | "支付中" | "支付成功" | "支付失败";

/** 收款人账户类型 */
export type PayeeAccountType =
  | "对公账户"
  | "对私账户"
  | "第三方支付账户";

/** 收款银行所在：境内或境外 */
export type BankScope = "境内" | "境外";

export type Currency = "USD" | "CNY" | "HKD";

export const CURRENCIES: Currency[] = ["USD", "CNY", "HKD"];

export const CURRENCY_META: Record<Currency, { code: Currency; label: string }> = {
  USD: { code: "USD", label: "美元" },
  CNY: { code: "CNY", label: "人民币" },
  HKD: { code: "HKD", label: "港币" },
};

export function currencyLabel(code: Currency | string) {
  return CURRENCY_META[code as Currency]?.label ?? code;
}

export function currencyOptionLabel(code: Currency | string) {
  const meta = CURRENCY_META[code as Currency];
  return meta ? `${meta.code}（${meta.label}）` : code;
}

/**
 * 1 美元折合的万里汇牌价。原型不接实时接口，用本地牌价模拟万里汇汇率。
 * 提出金额 = 收款金额 / 汇率，汇率 = 收款币种牌价 / 提出币种牌价。同币种为 1。
 */
export const WORLDFIRST_PER_USD: Record<Currency, number> = {
  USD: 1,
  CNY: 7.1026,
  HKD: 7.7823,
};

export function worldfirstRate(receiveCurrency: Currency, proposedCurrency: Currency) {
  if (receiveCurrency === proposedCurrency) return 1;
  return WORLDFIRST_PER_USD[receiveCurrency] / WORLDFIRST_PER_USD[proposedCurrency];
}

/** 收款金额 = 审批金额，收款币种 = 审批币种，提出金额 = 收款金额 / 万里汇汇率 + 手续费 */
export function reviewSettlement(
  order: Pick<PaymentOrder, "amount" | "currency" | "proposedCurrency" | "fee">
) {
  const receiveAmount = order.amount;
  const receiveCurrency = order.currency;
  const proposedCurrency = order.proposedCurrency ?? order.currency;
  const exchangeRate = worldfirstRate(receiveCurrency, proposedCurrency);
  const fee = order.fee ?? 0;
  const proposedAmount =
    Math.round((receiveAmount / exchangeRate + fee) * 100) / 100;
  return {
    receiveAmount,
    receiveCurrency,
    proposedAmount,
    proposedCurrency,
    exchangeRate,
    fee,
  };
}

export const DEFAULT_PAYMENT_CHANNEL: PaymentChannel = "万里汇";

export const PAYMENT_CHANNELS: PaymentChannel[] = [
  "万里汇",
  "连连国际",
  "PingPong",
  "银行直连",
];

export interface PaymentOrder {
  id: string;
  /** 付款单号 */
  orderNo: string;
  /** 审批单号 */
  feishuNo: string;
  /** 审批单名称 */
  approvalFlowName: string;
  /** 付款申请类型 */
  applyType: PaymentApplyType;
  /** 付款事由 */
  purpose: string;
  /** 审批金额 */
  amount: number;
  /** 审批币种 */
  currency: Currency;
  /** 提出币种。复核明细页选择，未选择时与审批币种相同 */
  proposedCurrency?: Currency;
  /** 手续费。与提出金额同币种，参与提出金额计算 */
  fee?: number;
  /** 申请人ID */
  applicantId: string;
  /** 申请人名称 */
  applicant: string;
  /** 申请时间 */
  appliedAt: string;
  /** 付款单状态 */
  status: PaymentStatus;
  /** 对应审批单是否已驳回。作废时据此决定是否真正作废 */
  approvalRejected?: boolean;
  /** 支付状态（查询列表） */
  payResultStatus?: PayResultStatus;
  /** 支付失败原因（查询列表；仅支付失败时有值） */
  payFailReason?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 收款方式类型 */
  paymentMethodType: PaymentMethodType;
  /** 收款人账户类型 */
  payeeAccountType: PayeeAccountType;
  /** 收款账号 */
  payeeAccountNo: string;
  /** 收款银行 */
  payeeBank: string;
  /** 银行所在地区 */
  bankRegion: string;
  /** 银行支行 */
  bankBranch: string;
  /** 联行号。境外可空 */
  cnapsCode?: string;
  /** 清算系统 SWIFT/BIC */
  swiftCode?: string;
  /** 收款银行（境内/境外） */
  bankScope?: BankScope;
  /** 转账附言（默认审批单号） */
  transferMemo: string;
  /** 付款渠道（明细只读；复核确认时系统写入） */
  paymentChannel?: PaymentChannel;
  /** 收款方名称 */
  payeeName?: string;
  /** 收款人身份证号码 */
  payeeIdNo: string;
  /** 收款人邮箱号码 */
  payeeEmail: string;
  /** 收款人手机号码 */
  payeeMobile: string;
  remark?: string;
  /** 初审/复核处理意见记录 */
  handleOpinions?: HandleOpinion[];
  worldfirstTxId?: string;
  receiptNo?: string;
  /** 付款流水号（出款后生成，回单信息中位于回单字段之前） */
  paymentSerialNo?: string;
  /** 回单时间 */
  receiptAt?: string;
  /** 付款回单附件文件名 */
  receiptFileName?: string;
}

export type HandleStage = "初审" | "复核" | "作废" | "重试支付";

/** 初审、查询引导页作废弹窗。确认后将付款单改为已作废 */
export const VOID_CONFIRM_MESSAGE =
  "即将作废付款单，请确认！确认后请同步驳回审批单。";

/** 初审引导页【已线下付款】。确认后将付款单改为已完成 */
export const OFFLINE_PAID_CONFIRM_MESSAGE =
  "请确认该笔审批是否已转他人并线下付款？";

export const REPAY_NOTICE_MESSAGE = "已成功提交支付，请稍等。";

export const SELECT_REQUIRED_MESSAGE = "请先勾选数据！";

export interface HandleOpinion {
  stage: HandleStage;
  content: string;
  at: string;
}

/** 处理历史示例：环节为初审、复核 */
export const SAMPLE_HANDLE_HISTORY: HandleOpinion[] = [
  {
    stage: "初审",
    content: "初审提交",
    at: "2026-03-28T09:00:00+08:00",
  },
  {
    stage: "复核",
    content: "复核确认",
    at: "2026-03-28T11:00:00+08:00",
  },
];

export const STATUS_META: Record<
  PaymentStatus,
  { label: string; tone: string; bg: string }
> = {
  pending_submit: {
    label: "待初审",
    tone: "text-slate-700",
    bg: "bg-slate-100",
  },
  pending_review: {
    label: "待复核",
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  pending_pay: {
    label: "待支付",
    tone: "text-sky-700",
    bg: "bg-sky-50",
  },
  pending_receipt: {
    label: "待回单",
    tone: "text-brand-700",
    bg: "bg-brand-50",
  },
  completed: {
    label: "已完成",
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  review_rejected: {
    label: "复核驳回",
    tone: "text-rose-700",
    bg: "bg-rose-50",
  },
  voided: {
    label: "已作废",
    tone: "text-rose-700",
    bg: "bg-rose-50",
  },
};

export const APPLY_TYPES: PaymentApplyType[] = [
  "证书费用",
  "备用金付款（采购专用）",
  "客户相关费用",
  "备用金冲销（采购专用）",
  "商品运费",
  "样品费",
  "其他费用",
  "商品采购（无合同）【金额1万以下】",
  "拍摄费用",
  "1688采购合同（需盖章，无需付款）",
  "商品采购（有合同）",
];

export const PAYMENT_METHOD_TYPES: PaymentMethodType[] = ["1", "2"];

export const PAYMENT_METHOD_TYPE_META: Record<
  PaymentMethodType,
  { code: PaymentMethodType; label: string }
> = {
  "1": { code: "1", label: "银行卡" },
  "2": { code: "2", label: "支付宝" },
};

export function paymentMethodTypeLabel(code: PaymentMethodType | string) {
  return (
    PAYMENT_METHOD_TYPE_META[code as PaymentMethodType]?.label ?? code
  );
}

export const PAYEE_ACCOUNT_TYPES: PayeeAccountType[] = [
  "对公账户",
  "对私账户",
  "第三方支付账户",
];

export const STATUS_FLOW = [
  { key: "pending_submit", label: "待初审", desc: "承接飞书审批后生成" },
  { key: "pending_review", label: "待复核", desc: "初审提交后" },
  { key: "pending_pay", label: "待支付", desc: "复核通过后" },
  { key: "pending_receipt", label: "待回单", desc: "万里汇付款成功后" },
  { key: "completed", label: "已完成", desc: "获取回单并回传飞书" },
  { key: "voided", label: "已作废", desc: "初审作废（逻辑删除，单据保留）" },
] as const;

/** 可变内存数据，供原型交互更新状态 */
export let paymentOrders: PaymentOrder[] = [
  {
    id: "pay-001",
    orderNo: "PAY20260328001",
    feishuNo: "FS20260328001",
    approvalFlowName: "跨境仓储费用审批",
    applyType: "商品运费",
    purpose: "FBA仓储与尾程费用 · 2026-03 上半月",
    amount: 12850,
    currency: "USD",
    applicantId: "A10001",
    applicant: "王晓雯",
    appliedAt: "2026-03-28T09:05:00+08:00",
    status: "pending_submit",
    approvalRejected: true,
    createdAt: "2026-03-28T09:12:00+08:00",
    updatedAt: "2026-03-28T09:12:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    bankRegion: "美国",
    bankBranch: "New York Branch",
    transferMemo: "FS20260328001",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeIdNo: "440301198803152618",
    payeeEmail: "ap@amazon-fulfillment.example",
    payeeMobile: "13800138001",
    remark: "复核退回：请补充尾程费用明细后重新提交",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-28T09:20:00+08:00",
      },
      {
        stage: "复核",
        content: "复核退回",
        at: "2026-03-28T10:05:00+08:00",
      },
    ],
  },
  {
    id: "pay-002",
    orderNo: "PAY20260328002",
    feishuNo: "FS20260328002",
    approvalFlowName: "物流费用付款审批",
    applyType: "备用金付款（采购专用）",
    purpose: "欧洲仓一件代发服务费",
    amount: 6420.5,
    currency: "CNY",
    applicantId: "A10002",
    applicant: "李明轩",
    appliedAt: "2026-03-28T10:20:00+08:00",
    status: "pending_submit",
    createdAt: "2026-03-28T10:25:00+08:00",
    updatedAt: "2026-03-28T10:25:00+08:00",
    paymentMethodType: "2",
    payeeAccountType: "对公账户",
    payeeAccountNo: "DE89370400440532011776",
    payeeBank: "Deutsche Bank",
    bankRegion: "德国",
    bankBranch: "Frankfurt am Main",
    transferMemo: "FS20260328002",
    payeeName: "EuroPack Logistics GmbH",
    payeeIdNo: "310101199105063214",
    payeeEmail: "billing@europack.example",
    payeeMobile: "13900139002",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-28T10:30:00+08:00",
      },
      {
        stage: "复核",
        content: "复核确认",
        at: "2026-03-28T11:10:00+08:00",
      },
    ],
  },
  {
    id: "pay-003",
    orderNo: "PAY20260328003",
    feishuNo: "FS20260328003",
    approvalFlowName: "采购货款付款审批",
    applyType: "商品采购（有合同）",
    purpose: "采购货款-3月批次",
    amount: 186000,
    currency: "HKD",
    applicantId: "A10001",
    applicant: "王晓雯",
    appliedAt: "2026-03-28T11:00:00+08:00",
    status: "pending_submit",
    createdAt: "2026-03-28T11:10:00+08:00",
    updatedAt: "2026-03-28T11:10:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "012875903301",
    payeeBank: "招商银行香港分行",
    bankRegion: "中国香港",
    bankBranch: "中环支行",
    transferMemo: "FS20260328003",
    payeeName: "Shenzhen Huaqiang Supply Co.",
    payeeIdNo: "440304198612084512",
    payeeEmail: "finance@huaqiang-supply.example",
    payeeMobile: "13700137003",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-28T11:20:00+08:00",
      },
      {
        stage: "复核",
        content: "复核确认",
        at: "2026-03-28T14:00:00+08:00",
      },
    ],
  },
  {
    id: "pay-004",
    orderNo: "PAY20260327018",
    feishuNo: "FS20260327018",
    approvalFlowName: "广告投放费用审批",
    applyType: "客户相关费用",
    purpose: "东南亚广告投放结算",
    amount: 9800,
    currency: "HKD",
    applicantId: "A10003",
    applicant: "赵一诺",
    appliedAt: "2026-03-27T16:40:00+08:00",
    status: "pending_review",
    createdAt: "2026-03-27T16:50:00+08:00",
    updatedAt: "2026-03-28T08:30:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "072034567742",
    payeeBank: "DBS Bank",
    bankRegion: "新加坡",
    bankBranch: "Marina Bay Branch",
    transferMemo: "FS20260327018",
    payeeName: "Singapore Ads Pte. Ltd.",
    payeeIdNo: "320106199208176028",
    payeeEmail: "accounts@sg-ads.example",
    payeeMobile: "13600136004",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-27T18:10:00+08:00",
      },
      {
        stage: "复核",
        content: "复核退回",
        at: "2026-03-27T20:15:00+08:00",
      },
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-28T08:30:00+08:00",
      },
    ],
  },
  {
    id: "pay-005",
    orderNo: "PAY20260327009",
    feishuNo: "FS20260327009",
    approvalFlowName: "市场服务费审批",
    applyType: "其他费用",
    purpose: "日本站内容营销服务费",
    amount: 450000,
    currency: "CNY",
    applicantId: "A10004",
    applicant: "孙可",
    appliedAt: "2026-03-27T14:10:00+08:00",
    status: "pending_review",
    createdAt: "2026-03-27T14:20:00+08:00",
    updatedAt: "2026-03-27T15:00:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "1002455201",
    payeeBank: "MUFG Bank",
    bankRegion: "日本",
    bankBranch: "Tokyo Main Office",
    transferMemo: "FS20260327009",
    payeeName: "Tokyo Media Agency KK",
    payeeIdNo: "110105199411223046",
    payeeEmail: "invoice@tokyo-media.example",
    payeeMobile: "13500135005",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-27T14:40:00+08:00",
      },
      {
        stage: "复核",
        content: "复核退回",
        at: "2026-03-27T16:20:00+08:00",
      },
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-27T17:05:00+08:00",
      },
    ],
  },
  {
    id: "pay-006",
    orderNo: "PAY20260326011",
    feishuNo: "FS20260326011",
    approvalFlowName: "跨境仓储费用审批",
    applyType: "样品费",
    purpose: "仓储超期费补缴",
    amount: 5200,
    currency: "USD",
    applicantId: "A10002",
    applicant: "李明轩",
    appliedAt: "2026-03-26T09:10:00+08:00",
    status: "pending_pay",
    createdAt: "2026-03-26T09:20:00+08:00",
    updatedAt: "2026-03-26T11:00:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    bankRegion: "美国",
    bankBranch: "New York Branch",
    transferMemo: "FS20260326011",
    paymentChannel: "万里汇",
    payResultStatus: "支付失败",
    payFailReason: "收款账户校验失败",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeIdNo: "440301198803152618",
    payeeEmail: "ap@amazon-fulfillment.example",
    payeeMobile: "13800138001",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-26T09:40:00+08:00",
      },
      {
        stage: "复核",
        content: "复核确认",
        at: "2026-03-26T11:00:00+08:00",
      },
    ],
  },
  {
    id: "pay-007",
    orderNo: "PAY20260325007",
    feishuNo: "FS20260325007",
    approvalFlowName: "物流费用付款审批",
    applyType: "拍摄费用",
    purpose: "美国尾程配送结算",
    amount: 3200,
    currency: "USD",
    applicantId: "A10005",
    applicant: "周然",
    appliedAt: "2026-03-25T10:00:00+08:00",
    status: "pending_receipt",
    createdAt: "2026-03-25T10:15:00+08:00",
    updatedAt: "2026-03-26T16:40:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    bankRegion: "美国",
    bankBranch: "New York Branch",
    transferMemo: "FS20260325007",
    paymentChannel: "万里汇",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeIdNo: "440301198803152618",
    payeeEmail: "ap@amazon-fulfillment.example",
    payeeMobile: "13800138001",
    worldfirstTxId: "WF202603261640001",
    paymentSerialNo: "LS202603261640001",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-25T10:40:00+08:00",
      },
      {
        stage: "复核",
        content: "复核确认",
        at: "2026-03-25T14:20:00+08:00",
      },
    ],
  },
  {
    id: "pay-008",
    orderNo: "PAY20260324003",
    feishuNo: "FS20260324003",
    approvalFlowName: "广告投放费用审批",
    applyType: "证书费用",
    purpose: "北美站投放月结",
    amount: 15600,
    currency: "USD",
    applicantId: "A10003",
    applicant: "赵一诺",
    appliedAt: "2026-03-24T13:20:00+08:00",
    status: "completed",
    createdAt: "2026-03-24T13:30:00+08:00",
    updatedAt: "2026-03-25T09:10:00+08:00",
    paymentMethodType: "2",
    payeeAccountType: "第三方支付账户",
    payeeAccountNo: "META-PAY-8891",
    payeeBank: "Meta Payments",
    bankRegion: "爱尔兰",
    bankBranch: "Dublin Office",
    transferMemo: "FS20260324003",
    paymentChannel: "万里汇",
    payeeName: "Meta Platforms Ireland Ltd.",
    payeeIdNo: "440106199607124028",
    payeeEmail: "billing@meta-ads.example",
    payeeMobile: "13400134008",
    worldfirstTxId: "WF202603241800002",
    receiptNo: "WFR-20260325-0002",
    paymentSerialNo: "LS202603241800002",
    receiptAt: "2026-03-25T09:05:00+08:00",
    receiptFileName: "WFR-20260325-0002.pdf",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-24T13:50:00+08:00",
      },
      {
        stage: "复核",
        content: "复核确认",
        at: "2026-03-24T16:10:00+08:00",
      },
    ],
  },
  {
    id: "pay-009",
    orderNo: "PAY20260323015",
    feishuNo: "FS20260323015",
    approvalFlowName: "采购货款付款审批",
    applyType: "备用金冲销（采购专用）",
    purpose: "深圳供应商货款补差",
    amount: 42000,
    currency: "HKD",
    applicantId: "A10001",
    applicant: "王晓雯",
    appliedAt: "2026-03-23T11:00:00+08:00",
    status: "pending_submit",
    approvalRejected: true,
    createdAt: "2026-03-23T11:10:00+08:00",
    updatedAt: "2026-03-23T16:20:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "012875903301",
    payeeBank: "招商银行香港分行",
    bankRegion: "中国香港",
    bankBranch: "中环支行",
    transferMemo: "FS20260323015",
    payeeName: "Shenzhen Huaqiang Supply Co.",
    payeeIdNo: "440304198612084512",
    payeeEmail: "finance@huaqiang-supply.example",
    payeeMobile: "13700137003",
    remark: "复核退回：合同附件缺失，请补充后重新提交",
    handleOpinions: [
      {
        stage: "初审",
        content: "初审提交",
        at: "2026-03-23T11:30:00+08:00",
      },
      {
        stage: "复核",
        content: "复核退回",
        at: "2026-03-23T16:20:00+08:00",
      },
    ],
  },
  {
    id: "pay-010",
    orderNo: "PAY20260322008",
    feishuNo: "FS20260322008",
    approvalFlowName: "仓储费用付款审批",
    applyType: "1688采购合同（需盖章，无需付款）",
    purpose: "海外仓月结费用重复申请，已作废",
    amount: 2800,
    currency: "USD",
    applicantId: "A10005",
    applicant: "周然",
    appliedAt: "2026-03-22T09:30:00+08:00",
    status: "voided",
    approvalRejected: true,
    createdAt: "2026-03-22T09:40:00+08:00",
    updatedAt: "2026-03-22T11:00:00+08:00",
    paymentMethodType: "1",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    bankRegion: "美国",
    bankBranch: "New York Branch",
    transferMemo: "FS20260322008",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeIdNo: "440301198803152618",
    payeeEmail: "ap@amazon-fulfillment.example",
    payeeMobile: "13800138001",
    remark: "初审作废",
    handleOpinions: [
      {
        stage: "初审",
        content: "作废",
        at: "2026-03-22T11:00:00+08:00",
      },
    ],
  },
];

const BANK_CLEARING: Record<
  string,
  { bankScope: BankScope; swiftCode: string; cnapsCode?: string }
> = {
  "JPMorgan Chase": { bankScope: "境外", swiftCode: "CHASUS33" },
  "Deutsche Bank": { bankScope: "境外", swiftCode: "DEUTDEFF" },
  "招商银行香港分行": { bankScope: "境外", swiftCode: "CMBCHKHH" },
  "DBS Bank": { bankScope: "境外", swiftCode: "DBSSSGSG" },
  "MUFG Bank": { bankScope: "境外", swiftCode: "BOTKJPJT" },
  "Meta Payments": { bankScope: "境外", swiftCode: "CITIIE2X" },
};

/** 示例手续费。未列出的单据为 0，提出金额保持原计算结果 */
const DEMO_FEE: Record<string, number> = {
  "pay-001": 12.5,
  "pay-002": 35,
  "pay-003": 80,
  "pay-004": 50,
  "pay-005": 20,
  "pay-006": 8,
  "pay-008": 15,
  "pay-010": 6,
};

function appendListDemoOrders() {
  const base = paymentOrders.slice();
  const extras: PaymentOrder[] = [];
  let seq = 11;

  const push = (status: PaymentStatus, count: number) => {
    for (let i = 0; i < count; i += 1) {
      const src = base[i % base.length];
      const n = seq;
      seq += 1;
      extras.push({
        ...src,
        id: `pay-${String(n).padStart(3, "0")}`,
        orderNo: `PAY202604${String(n).padStart(5, "0")}`,
        feishuNo: `FS202604${String(n).padStart(5, "0")}`,
        transferMemo: `FS202604${String(n).padStart(5, "0")}`,
        status,
        amount: Math.round((src.amount + i * 37.5) * 100) / 100,
        remark: undefined,
        worldfirstTxId: undefined,
        receiptNo: undefined,
        paymentSerialNo: undefined,
        receiptAt: undefined,
        receiptFileName: undefined,
        paymentChannel:
          status === "pending_submit" || status === "pending_review"
            ? undefined
            : (src.paymentChannel ?? "万里汇"),
        payResultStatus: "未支付",
        payFailReason: undefined,
        handleOpinions: [
          { stage: "初审", content: "初审提交", at: src.createdAt },
          ...(status === "pending_submit"
            ? []
            : [
                {
                  stage: "复核" as const,
                  content: "复核确认",
                  at: src.updatedAt,
                },
              ]),
        ],
      });
    }
  };

  push("pending_submit", 20);
  push("pending_review", 20);
  paymentOrders = paymentOrders.concat(extras).map((order) => {
    const clearing = BANK_CLEARING[order.payeeBank] ?? {
      bankScope: "境外" as const,
      swiftCode: "",
    };
    const withClearing = {
      ...order,
      fee: DEMO_FEE[order.id] ?? order.fee ?? 0,
      cnapsCode: clearing.cnapsCode ?? "",
      swiftCode: clearing.swiftCode,
      bankScope: clearing.bankScope,
    };
    if (withClearing.payResultStatus) return withClearing;
    if (
      withClearing.status === "pending_receipt" ||
      withClearing.status === "completed"
    ) {
      return { ...withClearing, payResultStatus: "支付成功" as const };
    }
    if (withClearing.status === "pending_pay") {
      return { ...withClearing, payResultStatus: "支付中" as const };
    }
    return { ...withClearing, payResultStatus: "未支付" as const };
  });
}

appendListDemoOrders();

/** 静态导出用：预生成明细页路径 */
export function paymentIdStaticParams() {
  return paymentOrders.map((o) => ({ id: o.id }));
}

export function getPaymentById(id: string) {
  return paymentOrders.find((item) => item.id === id);
}

export function updatePayment(
  id: string,
  patch: Partial<PaymentOrder>
): PaymentOrder | undefined {
  const idx = paymentOrders.findIndex((item) => item.id === id);
  if (idx < 0) return undefined;
  paymentOrders[idx] = {
    ...paymentOrders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return paymentOrders[idx];
}

export function batchSubmit(ids: string[]) {
  const now = new Date().toISOString();
  paymentOrders = paymentOrders.map((item) =>
    ids.includes(item.id) && item.status === "pending_submit"
      ? { ...item, status: "pending_review" as const, updatedAt: now }
      : item
  );
}

export function approveReview(id: string) {
  return updatePayment(id, { status: "pending_pay" });
}

export function rejectReview(id: string, remark?: string) {
  return updatePayment(id, {
    status: "pending_submit",
    remark: remark || "复核退回，请修正后重新提交",
  });
}
