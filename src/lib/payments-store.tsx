"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PAYMENT_CHANNEL,
  paymentOrders as seed,
  type HandleOpinion,
  type HandleStage,
  type Currency,
  type PaymentChannel,
  type PaymentOrder,
  type PaymentStatus,
} from "@/lib/payments-data";

type Store = {
  orders: PaymentOrder[];
  getById: (id: string) => PaymentOrder | undefined;
  updateOrder: (id: string, patch: Partial<PaymentOrder>) => void;
  batchSubmit: (ids: string[]) => number;
  batchApprove: (
    ids: string[],
    channel?: PaymentChannel,
    proposedCurrency?: Currency
  ) => number;
  submitOne: (id: string, opinion?: string, transferMemo?: string) => boolean;
  voidOne: (id: string, remark?: string) => boolean;
  /** 初审引导页：确认已转他人并线下付款后，状态改为已完成 */
  markOfflinePaid: (id: string) => boolean;
  retryPay: (id: string) => boolean;
  batchVoid: (ids: string[]) => number;
  resyncOne: (id: string) => boolean;
  approve: (id: string, channel?: PaymentChannel, opinion?: string) => boolean;
  reject: (id: string, remark?: string) => boolean;
  markPaid: (id: string) => boolean;
  markReceiptDone: (id: string) => boolean;
};

const PaymentsContext = createContext<Store | null>(null);

function touch(patch: Partial<PaymentOrder> = {}): Partial<PaymentOrder> {
  return { ...patch, updatedAt: new Date().toISOString() };
}

function withOpinion(
  order: PaymentOrder,
  stage: HandleStage,
  content?: string
): HandleOpinion[] {
  const prev = order.handleOpinions ?? [];
  const text = content?.trim();
  if (!text) return prev;
  return [
    ...prev,
    { stage, content: text, at: new Date().toISOString() },
  ];
}

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PaymentOrder[]>(() =>
    seed.map((o) => ({ ...o }))
  );

  const getById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const updateOrder = useCallback((id: string, patch: Partial<PaymentOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...touch(patch) } : o))
    );
  }, []);

  const setStatus = useCallback((id: string, status: PaymentStatus, extra?: Partial<PaymentOrder>) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, ...touch({ status, ...extra }) } : o
      )
    );
  }, []);

  const batchSubmit = useCallback((ids: string[]) => {
    let count = 0;
    setOrders((prev) =>
      prev.map((o) => {
        if (ids.includes(o.id) && o.status === "pending_submit") {
          count += 1;
          return {
            ...o,
            ...touch({
              status: "pending_review",
              handleOpinions: withOpinion(o, "初审", "初审提交"),
            }),
          };
        }
        return o;
      })
    );
    return count;
  }, []);

  const batchApprove = useCallback(
    (
      ids: string[],
      channel: PaymentChannel = DEFAULT_PAYMENT_CHANNEL,
      proposedCurrency?: Currency
    ) => {
      let count = 0;
      setOrders((prev) =>
        prev.map((o) => {
          if (ids.includes(o.id) && o.status === "pending_review") {
            count += 1;
            return {
              ...o,
              ...touch({
                status: "pending_pay",
                paymentChannel: channel,
                ...(proposedCurrency ? { proposedCurrency } : {}),
              }),
            };
          }
          return o;
        })
      );
      return count;
    },
    []
  );

  const submitOne = useCallback(
    (id: string, opinion?: string, transferMemo?: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_submit") return false;
      setStatus(id, "pending_review", {
        transferMemo: transferMemo ?? target.transferMemo,
        handleOpinions: withOpinion(target, "初审", opinion || "初审提交"),
      });
      return true;
    },
    [orders, setStatus]
  );

  /** 作废：状态改为已作废（逻辑删除），不从列表数据中移除单据 */
  const voidOne = useCallback((id: string, remark = "初审作废") => {
    let ok = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id && o.status !== "voided") {
          ok = true;
          return {
            ...o,
            ...touch({
              status: "voided",
              remark,
              handleOpinions: withOpinion(
                o,
                remark === "查询作废" ? "作废" : "初审",
                "作废"
              ),
            }),
          };
        }
        return o;
      })
    );
    return ok;
  }, []);

  const batchVoid = useCallback((ids: string[]) => {
    let count = 0;
    setOrders((prev) =>
      prev.map((o) => {
        if (ids.includes(o.id) && o.status === "pending_submit") {
          count += 1;
          return {
            ...o,
            ...touch({
              status: "voided",
              remark: "初审作废",
              handleOpinions: withOpinion(o, "初审", "作废"),
            }),
          };
        }
        return o;
      })
    );
    return count;
  }, []);

  const resyncOne = useCallback(
    (id: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target) return false;
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...touch() } : o))
      );
      return true;
    },
    []
  );

  const approve = useCallback(
    (
      id: string,
      channel: PaymentChannel = DEFAULT_PAYMENT_CHANNEL,
      opinion?: string
    ) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_review") return false;
      setStatus(id, "pending_pay", {
        paymentChannel: channel,
        handleOpinions: withOpinion(target, "复核", opinion || "复核确认"),
      });
      return true;
    },
    [orders, setStatus]
  );

  /** 退回：状态回退为待初审 */
  const reject = useCallback(
    (id: string, remark?: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_review") return false;
      setStatus(id, "pending_submit", {
        remark: remark || "复核退回，请修正后重新提交",
        paymentChannel: undefined,
        handleOpinions: withOpinion(target, "复核", remark || "复核退回"),
      });
      return true;
    },
    [orders, setStatus]
  );

  /** 初审已线下付款：待初审直接改为已完成，并记处理历史 */
  const markOfflinePaid = useCallback((id: string) => {
    let ok = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id || o.status !== "pending_submit") return o;
        ok = true;
        return {
          ...o,
          ...touch({
            status: "completed",
            handleOpinions: withOpinion(o, "初审", "已线下付款"),
          }),
        };
      })
    );
    return ok;
  }, []);

  /** 查询页重新支付：仅待支付且支付失败时再次出款，成功后进入待回单 */
  const retryPay = useCallback((id: string) => {
    let ok = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (
          o.id !== id ||
          o.status !== "pending_pay" ||
          o.payResultStatus !== "支付失败"
        ) {
          return o;
        }
        ok = true;
        const txSuffix = Date.now().toString().slice(-10);
        return {
          ...o,
          ...touch({
            status: "pending_receipt",
            payResultStatus: "支付成功",
            payFailReason: undefined,
            worldfirstTxId: `WF${txSuffix}`,
            paymentSerialNo: `LS${txSuffix}`,
            handleOpinions: withOpinion(o, "重试支付", "重试支付"),
          }),
        };
      })
    );
    return ok;
  }, []);

  const markPaid = useCallback(
    (id: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_pay") return false;
      const txSuffix = Date.now().toString().slice(-10);
      setStatus(id, "pending_receipt", {
        worldfirstTxId: `WF${txSuffix}`,
        paymentSerialNo: `LS${txSuffix}`,
        payResultStatus: "支付成功",
        payFailReason: undefined,
      });
      return true;
    },
    [orders, setStatus]
  );

  const markReceiptDone = useCallback(
    (id: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_receipt") return false;
      const receiptNo = `WFR-${Date.now().toString().slice(-8)}`;
      setStatus(id, "completed", {
        receiptNo,
        receiptAt: new Date().toISOString(),
        receiptFileName: `${receiptNo}.pdf`,
      });
      return true;
    },
    [orders, setStatus]
  );

  const value = useMemo(
    () => ({
      orders,
      getById,
      updateOrder,
      batchSubmit,
      batchApprove,
      submitOne,
      voidOne,
      markOfflinePaid,
      retryPay,
      batchVoid,
      resyncOne,
      approve,
      reject,
      markPaid,
      markReceiptDone,
    }),
    [
      orders,
      getById,
      updateOrder,
      batchSubmit,
      batchApprove,
      submitOne,
      voidOne,
      markOfflinePaid,
      retryPay,
      batchVoid,
      resyncOne,
      approve,
      reject,
      markPaid,
      markReceiptDone,
    ]
  );

  return (
    <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error("usePayments must be used within PaymentsProvider");
  return ctx;
}
