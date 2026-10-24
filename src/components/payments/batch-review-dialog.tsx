"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label, Select } from "@/components/ui/input";
import {
  CURRENCIES,
  DEFAULT_PAYMENT_CHANNEL,
  currencyOptionLabel,
  type Currency,
} from "@/lib/payments-data";

export function BatchReviewDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: (proposedCurrency: Currency) => void;
  onCancel: () => void;
}) {
  const [proposedCurrency, setProposedCurrency] = useState<Currency>("USD");

  useEffect(() => {
    if (open) setProposedCurrency("USD");
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">请选择付款渠道和提出币种</DialogTitle>
        <DialogDescription className="mt-0">
          请选择付款渠道和提出币种
        </DialogDescription>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="batch-review-channel">付款渠道</Label>
            <Select
              id="batch-review-channel"
              value={DEFAULT_PAYMENT_CHANNEL}
              disabled
              aria-label="付款渠道"
              className="cursor-default bg-slate-50 text-ink-1 disabled:opacity-100"
            >
              <option value={DEFAULT_PAYMENT_CHANNEL}>
                {DEFAULT_PAYMENT_CHANNEL}
              </option>
            </Select>
          </div>
          <div>
            <Label htmlFor="batch-review-currency">提出币种</Label>
            <Select
              id="batch-review-currency"
              value={proposedCurrency}
              aria-label="提出币种"
              onChange={(e) => setProposedCurrency(e.target.value as Currency)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {currencyOptionLabel(code)}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm(proposedCurrency);
            }}
          >
            确认
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
