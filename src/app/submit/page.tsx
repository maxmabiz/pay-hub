"use client";

import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { ConfirmDialog } from "@/components/payments/confirm-dialog";
import { OrderTable } from "@/components/payments/order-table";
import {
  PaymentDetailDrawer,
  type DetailOpenMode,
} from "@/components/payments/payment-detail-panel";
import {
  SELECT_REQUIRED_MESSAGE,
  OFFLINE_PAID_CONFIRM_MESSAGE,
  VOID_CONFIRM_MESSAGE,
} from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

export default function SubmitListPage() {
  const { orders, batchSubmit, voidOne, markOfflinePaid } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<{
    id: string;
    mode: DetailOpenMode;
  } | null>(null);
  const [voidId, setVoidId] = useState<string | null>(null);
  const [offlinePayId, setOfflinePayId] = useState<string | null>(null);
  const [selectNoticeOpen, setSelectNoticeOpen] = useState(false);
  const voidIdRef = useRef<string | null>(null);
  const offlinePayIdRef = useRef<string | null>(null);
  voidIdRef.current = voidId;
  offlinePayIdRef.current = offlinePayId;

  /** 初审菜单仅展示待初审单据；复核退回后的单也会回到本列表 */
  const filtered = useMemo(() => {
    return orders.filter((item) => {
      if (item.status !== "pending_submit") return false;
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

  const handleBatchSubmit = () => {
    if (selectedIds.length === 0) {
      setSelectNoticeOpen(true);
      return;
    }
    batchSubmit(selectedIds);
    setSelectedIds([]);
  };

  const handleVoidOne = (id: string) => {
    setVoidId(id);
  };

  const confirmVoid = () => {
    const id = voidIdRef.current;
    if (!id) return;
    voidOne(id);
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    setVoidId(null);
  };

  const confirmOfflinePaid = () => {
    const id = offlinePayIdRef.current;
    if (!id) return;
    markOfflinePaid(id);
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    setOfflinePayId(null);
  };

  return (
    <AppShell title="初审付款单">
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
          <div className="mb-3 flex items-center justify-end gap-2">
            <Button onClick={handleBatchSubmit}>批量初审</Button>
          </div>
          <OrderTable
            rows={filtered}
            selectedIds={selectedIds}
            showSelect
            showEdit
            showVoid
            showOfflinePay
            onOpenDetail={(id, mode) => setDetail({ id, mode })}
            onVoid={handleVoidOne}
            onOfflinePay={setOfflinePayId}
            onToggle={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id]
              )
            }
            onToggleAll={(ids) => setSelectedIds(ids)}
          />
        </CardContent>
      </Card>

      <PaymentDetailDrawer
        scene="submit"
        detail={detail}
        onClose={() => setDetail(null)}
      />

      <ConfirmDialog
        open={voidId !== null}
        description={VOID_CONFIRM_MESSAGE}
        confirmText="确认"
        confirmVariant="danger"
        onConfirm={confirmVoid}
        onCancel={() => setVoidId(null)}
      />

      <ConfirmDialog
        open={offlinePayId !== null}
        description={OFFLINE_PAID_CONFIRM_MESSAGE}
        confirmText="确认"
        onConfirm={confirmOfflinePaid}
        onCancel={() => setOfflinePayId(null)}
      />

      <ConfirmDialog
        open={selectNoticeOpen}
        description={SELECT_REQUIRED_MESSAGE}
        closeOnly
        onCancel={() => setSelectNoticeOpen(false)}
      />
    </AppShell>
  );
}
