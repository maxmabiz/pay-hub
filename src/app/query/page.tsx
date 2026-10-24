"use client";

import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/payments/confirm-dialog";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { OrderTable } from "@/components/payments/order-table";
import {
  PaymentDetailDrawer,
  type DetailOpenMode,
} from "@/components/payments/payment-detail-panel";
import {
  REPAY_NOTICE_MESSAGE,
  STATUS_META,
  VOID_CONFIRM_MESSAGE,
  type PaymentStatus,
} from "@/lib/payments-data";
import { Select, Label } from "@/components/ui/input";
import { usePayments } from "@/lib/payments-store";

const STATUS_OPTIONS: Array<PaymentStatus | ""> = [
  "",
  "pending_submit",
  "pending_review",
  "pending_pay",
  "pending_receipt",
  "completed",
  "voided",
];

export default function QueryListPage() {
  const { orders, retryPay, voidOne } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [draftStatus, setDraftStatus] = useState<PaymentStatus | "">("");
  const [appliedStatus, setAppliedStatus] = useState<PaymentStatus | "">("");
  const [detail, setDetail] = useState<{
    id: string;
    mode: DetailOpenMode;
  } | null>(null);
  const [voidId, setVoidId] = useState<string | null>(null);
  const [repayNoticeOpen, setRepayNoticeOpen] = useState(false);
  const voidIdRef = useRef<string | null>(null);
  voidIdRef.current = voidId;

  const filtered = useMemo(() => {
    return orders.filter((item) => {
      const q = appliedQuery;
      if (
        q.orderNo &&
        !item.orderNo.toLowerCase().includes(q.orderNo.toLowerCase())
      )
        return false;
      if (
        q.feishuNo &&
        !item.feishuNo.toLowerCase().includes(q.feishuNo.toLowerCase())
      )
        return false;
      if (q.applyType && item.applyType !== q.applyType) return false;
      if (q.purpose && !item.purpose.includes(q.purpose)) return false;
      if (q.amount && !String(item.amount).includes(q.amount)) return false;
      if (
        q.paymentMethodType &&
        item.paymentMethodType !== q.paymentMethodType
      )
        return false;
      if (appliedStatus && item.status !== appliedStatus) return false;
      return true;
    });
  }, [orders, appliedQuery, appliedStatus]);

  return (
    <AppShell title="查询付款单">
      <QueryForm
        values={draftQuery}
        onChange={setDraftQuery}
        onSearch={() => {
          setAppliedQuery(draftQuery);
          setAppliedStatus(draftStatus);
        }}
        onReset={() => {
          setDraftQuery(EMPTY_QUERY);
          setAppliedQuery(EMPTY_QUERY);
          setDraftStatus("");
          setAppliedStatus("");
        }}
        extraFields={
          <div>
            <Label>付款单状态</Label>
            <Select
              value={draftStatus}
              onChange={(e) =>
                setDraftStatus((e.target.value || "") as PaymentStatus | "")
              }
            >
              <option value="">请选择</option>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s as PaymentStatus].label}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      <Card>
        <CardContent className="pt-4">
          <OrderTable
            rows={filtered}
            selectedIds={[]}
            onToggle={() => undefined}
            onToggleAll={() => undefined}
            onOpenDetail={(id, mode) => setDetail({ id, mode })}
            showEdit={false}
            showSelect={false}
            showQueryOps
            showPayResult
            showProposed
            onVoid={setVoidId}
            onRetryPay={(id) => {
              retryPay(id);
              setRepayNoticeOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <PaymentDetailDrawer
        scene="query"
        detail={detail}
        onClose={() => setDetail(null)}
      />

      <ConfirmDialog
        open={voidId !== null}
        description={VOID_CONFIRM_MESSAGE}
        confirmText="确认"
        confirmVariant="danger"
        onConfirm={() => {
          const id = voidIdRef.current;
          if (id) voidOne(id, "查询作废");
          setVoidId(null);
        }}
        onCancel={() => setVoidId(null)}
      />

      <ConfirmDialog
        open={repayNoticeOpen}
        description={REPAY_NOTICE_MESSAGE}
        closeOnly
        onCancel={() => setRepayNoticeOpen(false)}
      />
    </AppShell>
  );
}
