"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailActions } from "@/components/payments/detail-actions";
import { DetailForm } from "@/components/payments/detail-form";
import { HandleHistoryPanel } from "@/components/payments/handle-history-panel";
import { PayeeAccountPanel } from "@/components/payments/payee-account-panel";
import { OpinionSection } from "@/components/payments/opinion-section";
import { ReceiptInfoPanel } from "@/components/payments/receipt-info-panel";
import {
  DEFAULT_PAYMENT_CHANNEL,
  type Currency,
  type PaymentOrder,
} from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

export type DetailScene = "submit" | "review" | "query";
export type DetailOpenMode = "edit" | "review" | "view";

export function PaymentDetailDrawer({
  scene,
  detail,
  onClose,
}: {
  scene: DetailScene;
  detail: { id: string; mode: DetailOpenMode } | null;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={detail !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={detail ? detailTitle(scene, detail.mode) : "付款单明细"}
    >
      {detail ? (
        <PaymentDetailPanel
          key={`${detail.id}-${detail.mode}`}
          orderId={detail.id}
          scene={scene}
          mode={detail.mode}
          onClose={onClose}
          layout="drawer"
        />
      ) : null}
    </Drawer>
  );
}

export function detailTitle(scene: DetailScene, mode: DetailOpenMode) {
  if (scene === "submit" && mode === "edit") return "初审付款单明细";
  if (scene === "query") return "查询付款单详情";
  if (scene === "review") return "付款单明细";
  return "查看付款单";
}

export function PaymentDetailPanel({
  orderId,
  scene,
  mode,
  onClose,
  layout = "page",
}: {
  orderId: string;
  scene: DetailScene;
  mode: DetailOpenMode;
  onClose: () => void;
  layout?: "page" | "drawer";
}) {
  const { getById, submitOne, resyncOne, updateOrder, approve, reject } =
    usePayments();
  const order = getById(orderId);
  const [draft, setDraft] = useState<PaymentOrder | undefined>(order);
  const [opinion, setOpinion] = useState("");

  useEffect(() => {
    setDraft(order);
  }, [order]);

  if (!order || !draft) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-ink-4">
          付款单不存在
          <div className="mt-4">
            <Button variant="secondary" onClick={onClose}>
              关闭
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEditMode =
    scene === "submit" && mode === "edit" && order.status === "pending_submit";
  const isReviewMode =
    scene === "review" &&
    mode === "review" &&
    order.status === "pending_review";

  const cards = (
      <div className={layout === "drawer" ? "space-y-1 p-3 sm:p-4" : "space-y-1"}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基础信息</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailForm
              order={order}
              draft={isEditMode ? draft : undefined}
              editable={false}
              memoEditable={isEditMode}
              channelBesideStatus={scene !== "query"}
              showPayStatus={scene === "query"}
              channelReadOnlySelect={scene === "review"}
              channelValue={
                scene === "review"
                  ? (order.paymentChannel ?? DEFAULT_PAYMENT_CHANNEL)
                  : undefined
              }
              showSettlement
              blankProposed={scene === "submit"}
              proposedCurrencyEditable={isReviewMode}
              onProposedCurrencyChange={
                isReviewMode
                  ? (currency: Currency) =>
                      updateOrder(order.id, { proposedCurrency: currency })
                  : undefined
              }
              onChange={
                isEditMode
                  ? (next) => {
                      setDraft(next);
                      updateOrder(order.id, {
                        transferMemo: next.transferMemo,
                      });
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>

        <PayeeAccountPanel order={order} />

        {scene === "query" ? <ReceiptInfoPanel order={order} /> : null}

        <HandleHistoryPanel history={order.handleOpinions} />

        {isEditMode || isReviewMode ? (
          <Card>
            <CardContent className="pt-4">
              <OpinionSection
                value={opinion}
                onChange={setOpinion}
                className="space-y-2"
              />
            </CardContent>
          </Card>
        ) : null}
      </div>
  );

  const actions = (
      <DetailActions
        className={
          layout === "drawer"
            ? "static bottom-auto m-0 shrink-0 rounded-none border-x-0 border-b-0 shadow-none"
            : undefined
        }
      >
        {isEditMode ? (
          <Button
            variant="secondary"
            onClick={() => {
              resyncOne(order.id);
            }}
          >
            重新同步
          </Button>
        ) : null}
        {isEditMode ? (
          <Button
            onClick={() => {
              submitOne(order.id, opinion, draft.transferMemo);
              onClose();
            }}
          >
            初审通过
          </Button>
        ) : null}
        {isReviewMode ? (
          <Button
            onClick={() => {
              approve(
                order.id,
                order.paymentChannel ?? DEFAULT_PAYMENT_CHANNEL,
                opinion
              );
              onClose();
            }}
          >
            复核确认
          </Button>
        ) : null}
        {isReviewMode ? (
          <Button
            variant="danger"
            onClick={() => {
              reject(order.id, opinion);
              onClose();
            }}
          >
            退回
          </Button>
        ) : null}
        <Button variant="secondary" onClick={onClose}>
          关闭
        </Button>
      </DetailActions>
  );

  if (layout === "drawer") {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">{cards}</div>
        {actions}
      </div>
    );
  }

  return (
    <>
      {cards}
      {actions}
    </>
  );
}
