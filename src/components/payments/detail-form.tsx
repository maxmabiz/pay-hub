"use client";

import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  APPLY_TYPES,
  PAYMENT_METHOD_TYPES,
  PAYMENT_METHOD_TYPE_META,
  paymentMethodTypeLabel,
  type PaymentApplyType,
  type PaymentChannel,
  CURRENCIES,
  currencyLabel,
  currencyOptionLabel,
  DEFAULT_PAYMENT_CHANNEL,
  PAYMENT_CHANNELS,
  reviewSettlement,
  type Currency,
  type PaymentOrder,
  type PaymentMethodType,
} from "@/lib/payments-data";
import { cn, formatAmount, formatDate } from "@/lib/utils";

export function DetailForm({
  order,
  editable,
  memoEditable = false,
  draft,
  onChange,
  channelBesideStatus = false,
  showPayStatus = false,
  channelValue,
  channelReadOnlySelect = false,
  showSettlement = false,
  proposedCurrencyEditable = false,
  blankProposed = false,
  onProposedCurrencyChange,
}: {
  order: PaymentOrder;
  editable: boolean;
  /** 仅初审编辑态开放转账附言 */
  memoEditable?: boolean;
  draft?: PaymentOrder;
  onChange?: (next: PaymentOrder) => void;
  /** 初审、复核明细：付款渠道放在付款单状态右侧，只读 */
  channelBesideStatus?: boolean;
  /** 查询明细：支付状态放在付款单状态右侧 */
  showPayStatus?: boolean;
  /** 只读展示值；不传则用单据已有付款渠道，没有则空 */
  channelValue?: PaymentChannel;
  /** 复核明细：付款渠道为下拉框，默认万里汇，不可修改 */
  channelReadOnlySelect?: boolean;
  /** 审批币种后展示收款金额、收款币种、提出金额、提出币种 */
  showSettlement?: boolean;
  /** 复核编辑态可选择提出币种；查看态为只读文字 */
  proposedCurrencyEditable?: boolean;
  /** 初审明细：提出金额、提出币种为空 */
  blankProposed?: boolean;
  onProposedCurrencyChange?: (currency: Currency) => void;
}) {
  const data = draft ?? order;
  const settlement = reviewSettlement(data);

  const set = <K extends keyof PaymentOrder>(key: K, value: PaymentOrder[K]) => {
    if (!onChange) return;
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 付款单号、审批单号、审批单名称：始终不可修改 */}
        <Field label="付款单号">
          <Value>{data.orderNo}</Value>
        </Field>
        <Field label="审批单号">
          <Value>{data.feishuNo}</Value>
        </Field>
        <Field label="审批单名称">
          <Value>{data.approvalFlowName}</Value>
        </Field>
        <Field label="付款申请类型">
          {editable ? (
            <Select
              value={data.applyType}
              onChange={(e) =>
                set("applyType", e.target.value as PaymentApplyType)
              }
            >
              {APPLY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{data.applyType}</Value>
          )}
        </Field>
        <Field label="付款单状态">
          <div className="flex h-8 items-center">
            <StatusBadge status={data.status} />
          </div>
        </Field>
        {showPayStatus ? (
          <Field label="支付状态">
            <Value>{data.payResultStatus}</Value>
          </Field>
        ) : null}
        {channelBesideStatus ? (
          <Field label="付款渠道">
            {channelReadOnlySelect ? (
              <Select
                value={
                  channelValue || data.paymentChannel || DEFAULT_PAYMENT_CHANNEL
                }
                disabled
                aria-label="付款渠道"
                className="cursor-default bg-slate-50 text-ink-1 disabled:opacity-100"
              >
                {PAYMENT_CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </Select>
            ) : (
              <Value>{channelValue || data.paymentChannel}</Value>
            )}
          </Field>
        ) : null}
        <Field label="付款事由" className="sm:col-span-2 lg:col-span-3">
          {editable ? (
            <Textarea
              value={data.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            />
          ) : (
            <Value>{data.purpose}</Value>
          )}
        </Field>
        <Field label="转账附言" className="sm:col-span-2 lg:col-span-3">
          {editable || memoEditable ? (
            <Input
              value={data.transferMemo}
              onChange={(e) => set("transferMemo", e.target.value)}
              aria-label="转账附言"
            />
          ) : (
            <Value>{data.transferMemo || data.feishuNo}</Value>
          )}
        </Field>
        <Field label="审批金额">
          {editable ? (
            <Input
              value={String(data.amount)}
              onChange={(e) => set("amount", Number(e.target.value) || 0)}
              inputMode="decimal"
            />
          ) : (
            <Value>{formatAmount(data.amount)}</Value>
          )}
        </Field>
        <Field label="审批币种">
          {editable ? (
            <Select
              value={data.currency}
              onChange={(e) =>
                set("currency", e.target.value as PaymentOrder["currency"])
              }
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {currencyLabel(c)}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{currencyLabel(data.currency)}</Value>
          )}
        </Field>
        {showSettlement ? (
          <>
            <Field label="收款金额">
              <Value>{formatAmount(settlement.receiveAmount)}</Value>
            </Field>
            <Field label="收款币种">
              <Value>{currencyLabel(settlement.receiveCurrency)}</Value>
            </Field>
            <Field label="手续费">
              <Value>{formatAmount(settlement.fee)}</Value>
            </Field>
            <Field label="提出金额">
              <Value>
                {blankProposed ? "—" : formatAmount(settlement.proposedAmount)}
              </Value>
            </Field>
            <Field label="提出币种">
              {blankProposed ? (
                <Value>—</Value>
              ) : proposedCurrencyEditable ? (
                <Select
                  value={settlement.proposedCurrency}
                  aria-label="提出币种"
                  onChange={(e) =>
                    onProposedCurrencyChange?.(e.target.value as Currency)
                  }
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {currencyOptionLabel(c)}
                    </option>
                  ))}
                </Select>
              ) : (
                <Value>{currencyLabel(settlement.proposedCurrency)}</Value>
              )}
            </Field>
          </>
        ) : null}
        <Field label="收款方式类型">
          {editable ? (
            <Select
              value={data.paymentMethodType}
              onChange={(e) =>
                set("paymentMethodType", e.target.value as PaymentMethodType)
              }
            >
              {PAYMENT_METHOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PAYMENT_METHOD_TYPE_META[t].label}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{paymentMethodTypeLabel(data.paymentMethodType)}</Value>
          )}
        </Field>
        <Field label="申请人ID">
          {editable ? (
            <Input
              value={data.applicantId}
              onChange={(e) => set("applicantId", e.target.value)}
            />
          ) : (
            <Value>{data.applicantId || "—"}</Value>
          )}
        </Field>
        <Field label="申请人名称">
          {editable ? (
            <Input
              value={data.applicant}
              onChange={(e) => set("applicant", e.target.value)}
            />
          ) : (
            <Value>{data.applicant}</Value>
          )}
        </Field>
        <Field label="申请时间">
          {editable ? (
            <Input
              type="datetime-local"
              value={toLocalInputValue(data.appliedAt)}
              onChange={(e) =>
                set("appliedAt", fromLocalInputValue(e.target.value))
              }
            />
          ) : (
            <Value>{formatDate(data.appliedAt)}</Value>
          )}
        </Field>
        {!channelBesideStatus && data.paymentChannel ? (
          <Field label="付款渠道">
            <Value>{data.paymentChannel}</Value>
          </Field>
        ) : null}
      </div>

      {!editable && (order.worldfirstTxId || order.receiptNo) ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {order.worldfirstTxId ? (
            <Field label="万里汇交易号">
              <Value>{order.worldfirstTxId}</Value>
            </Field>
          ) : null}
          {order.receiptNo ? (
            <Field label="万里汇回单号">
              <Value>{order.receiptNo}</Value>
            </Field>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(local: string) {
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? local : d.toISOString();
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Value({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-8 text-sm leading-6 text-ink-1", className)}>
      {children || "—"}
    </div>
  );
}
