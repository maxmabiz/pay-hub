"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { BatchReviewDialog } from "@/components/payments/batch-review-dialog";
import { ConfirmDialog } from "@/components/payments/confirm-dialog";
import { OrderTable } from "@/components/payments/order-table";
import {
  PaymentDetailDrawer,
  type DetailOpenMode,
} from "@/components/payments/payment-detail-panel";
import {
  DEFAULT_PAYMENT_CHANNEL,
  SELECT_REQUIRED_MESSAGE,
  type Currency,
} from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

export default function ReviewListPage() {
  const { orders, batchApprove } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<{
    id: string;
    mode: DetailOpenMode;
  } | null>(null);
  const [selectNoticeOpen, setSelectNoticeOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);

  /** 复核菜单仅展示待复核单据 */
  const filtered = useMemo(() => {
    return orders.filter((item) => {
      if (item.status !== "pending_review") return false;
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
      return true;
    });
  }, [orders, appliedQuery]);

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      setSelectNoticeOpen(true);
      return;
    }
    setBatchDialogOpen(true);
  };

  const confirmBatchApprove = (proposedCurrency: Currency) => {
    batchApprove(selectedIds, DEFAULT_PAYMENT_CHANNEL, proposedCurrency);
    setSelectedIds([]);
    setBatchDialogOpen(false);
  };

  return (
    <AppShell title="复核付款单">
      <QueryForm
        values={draftQuery}
        onChange={setDraftQuery}
        onSearch={() => {
          setAppliedQuery(draftQuery);
        }}
        onReset={() => {
          setDraftQuery(EMPTY_QUERY);
          setAppliedQuery(EMPTY_QUERY);
        }}
      />

      <Card>
        <CardContent className="pt-4">
          <div className="mb-3 flex items-center justify-end">
            <Button onClick={handleBatchApprove}>批量复核</Button>
          </div>
          <OrderTable
            rows={filtered}
            selectedIds={selectedIds}
            onToggle={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id]
              )
            }
            onToggleAll={(ids) => setSelectedIds(ids)}
            onOpenDetail={(id, mode) => setDetail({ id, mode })}
            showEdit={false}
            showReview
            showSelect
          />
        </CardContent>
      </Card>

      <PaymentDetailDrawer
        scene="review"
        detail={detail}
        onClose={() => setDetail(null)}
      />

      <ConfirmDialog
        open={selectNoticeOpen}
        description={SELECT_REQUIRED_MESSAGE}
        closeOnly
        onCancel={() => setSelectNoticeOpen(false)}
      />

      <BatchReviewDialog
        open={batchDialogOpen}
        onCancel={() => setBatchDialogOpen(false)}
        onConfirm={confirmBatchApprove}
      />
    </AppShell>
  );
}
