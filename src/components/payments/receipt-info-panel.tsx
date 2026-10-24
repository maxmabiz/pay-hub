"use client";

import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import type { PaymentOrder } from "@/lib/payments-data";
import { cn, formatDate } from "@/lib/utils";

export function ReceiptInfoPanel({
  order,
  className,
}: {
  order: PaymentOrder;
  className?: string;
}) {
  const fileName = order.receiptFileName;

  return (
    <Card className={cn(className)}>
      <CardHeader className="py-2.5">
        <CardTitle className="text-base">回单信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="付款流水号">
              <Value>{order.paymentSerialNo || "—"}</Value>
            </Field>
            <Field label="回单时间">
              <Value>{order.receiptAt ? formatDate(order.receiptAt) : "—"}</Value>
            </Field>
            <Field label="付款回单附件">
              {fileName ? (
                <a
                  href={`/receipts/${encodeURIComponent(fileName)}`}
                  download={fileName}
                  className="inline-flex min-h-8 items-center gap-1.5 text-sm leading-6 text-brand-600 hover:underline"
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{fileName}</span>
                </a>
              ) : (
                <Value>—</Value>
              )}
            </Field>
          </div>
          <Field label="支付失败原因" className="w-full">
            <Value>{order.payFailReason || "—"}</Value>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Value({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-8 text-sm leading-6 text-ink-1">{children || "—"}</div>
  );
}
