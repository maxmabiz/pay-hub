import type { Currency, PaymentOrder } from "@/lib/payments-data";

export type CompareSide = {
  docNo: string;
  amount: number;
  currency: Currency;
  payeeName: string;
  payeeAccountNo: string;
};

export type CompareResult = {
  id: string;
  payment: CompareSide;
  approval: CompareSide;
};

/** 审批单侧示例差异：用于展示比对不一致 */
const APPROVAL_DIFFS: Record<string, Partial<CompareSide>> = {
  "pay-003": { amount: 185000 },
  "pay-004": { payeeAccountNo: "072034567700" },
  "pay-005": { payeeName: "Tokyo Media Agency" },
  "pay-009": { amount: 41800, currency: "HKD" },
};

export function toCompareResults(orders: PaymentOrder[]): CompareResult[] {
  return orders
    .filter((order) => order.status !== "voided")
    .map((order) => {
      const payment: CompareSide = {
        docNo: order.orderNo,
        amount: order.amount,
        currency: order.currency,
        payeeName: order.payeeName ?? "—",
        payeeAccountNo: order.payeeAccountNo,
      };
      const approval: CompareSide = {
        docNo: order.feishuNo,
        amount: order.amount,
        currency: order.currency,
        payeeName: order.payeeName ?? "—",
        payeeAccountNo: order.payeeAccountNo,
        ...APPROVAL_DIFFS[order.id],
      };
      return { id: order.id, payment, approval };
    });
}

export function compareMismatch(left: CompareSide, right: CompareSide) {
  return {
    amount: left.amount !== right.amount,
    currency: left.currency !== right.currency,
    payeeName: left.payeeName !== right.payeeName,
    payeeAccountNo: left.payeeAccountNo !== right.payeeAccountNo,
  };
}

export type CompareOutcome = "一致" | "不一致";

export function compareOutcome(left: CompareSide, right: CompareSide): CompareOutcome {
  const miss = compareMismatch(left, right);
  return miss.amount || miss.currency || miss.payeeName || miss.payeeAccountNo
    ? "不一致"
    : "一致";
}
