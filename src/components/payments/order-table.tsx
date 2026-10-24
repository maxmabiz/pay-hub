"use client";

import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { TablePagination } from "@/components/ui/pagination";
import {
  currencyLabel,
  paymentMethodTypeLabel,
  reviewSettlement,
  type PaymentOrder,
} from "@/lib/payments-data";
import { formatAmount, formatDate } from "@/lib/utils";

export function OrderTable({
  rows,
  selectedIds,
  onToggle,
  onToggleAll,
  onOpenDetail,
  showEdit,
  showReview,
  showVoid,
  showOfflinePay,
  showQueryOps,
  showPayResult,
  showSelect,
  /** 查询引导页：收款币种后展示提出金额、提出币种 */
  showProposed,
  onVoid,
  onOfflinePay,
  onRetryPay,
}: {
  rows: PaymentOrder[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  /** 初审 / 复核 / 查看以抽屉打开 */
  onOpenDetail: (id: string, action: "edit" | "review" | "view") => void;
  showEdit?: boolean;
  /** 复核引导页：待复核单据显示【复核】入口 */
  showReview?: boolean;
  /** 初审引导页：待初审单据显示【作废】 */
  showVoid?: boolean;
  /** 初审引导页：待初审单据显示【已线下付款】 */
  showOfflinePay?: boolean;
  /** 查询引导页：待支付且支付失败时显示【作废】【重新支付】 */
  showQueryOps?: boolean;
  /** 查询引导页：付款单状态右侧展示支付状态、支付失败原因 */
  showPayResult?: boolean;
  showSelect?: boolean;
  /** 查询引导页：收款币种后展示提出金额、提出币种 */
  showProposed?: boolean;
  onVoid?: (id: string) => void;
  onOfflinePay?: (id: string) => void;
  onRetryPay?: (id: string) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize) || 1);
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize]
  );
  const columnCount =
    (showProposed ? 22 : 20) + (showSelect ? 1 : 0) + (showPayResult ? 2 : 0);
  const allIds = pagedRows.map((r) => r.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-[#f5f6f8] text-xs text-ink-2">
            {showSelect ? (
              <th className="sticky left-0 z-20 whitespace-nowrap border-b border-slate-200 bg-[#f5f6f8] px-3 py-2.5 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleAll(allSelected ? [] : allIds)}
                  aria-label="全选"
                />
              </th>
            ) : null}
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款单号
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              审批单号
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              审批单名称
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款申请类型
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款事由
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              审批金额
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              审批币种
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款金额
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款币种
            </th>
            {showProposed ? (
              <>
                <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
                  提出金额
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
                  提出币种
                </th>
              </>
            ) : null}
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款人/户名
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款账户
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款银行
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款方式类型
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              申请人ID
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              申请人名称
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              申请时间
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款单状态
            </th>
            {showPayResult ? (
              <>
                <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
                  支付状态
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
                  支付失败原因
                </th>
              </>
            ) : null}
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              创建时间
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              更新时间
            </th>
            <th className="sticky right-0 z-20 whitespace-nowrap border-b border-l border-slate-200 bg-[#f5f6f8] px-3 py-2.5 text-center font-medium shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.08)]">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((item, idx) => {
            const rowBg = idx % 2 === 1 ? "bg-[#fafbfc]" : "bg-white";
            return (
              <tr key={item.id}>
                {showSelect ? (
                  <td
                    className={`sticky left-0 z-10 whitespace-nowrap border-b border-slate-100 px-3 py-2.5 ${rowBg}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggle(item.id)}
                      aria-label={`选择 ${item.orderNo}`}
                    />
                  </td>
                ) : null}
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 font-medium text-ink-1 ${rowBg}`}
                >
                  {item.orderNo}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.feishuNo}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.approvalFlowName}
                >
                  {item.approvalFlowName}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 ${rowBg}`}
                >
                  <span className="inline-flex rounded-full bg-[#e8f1ff] px-2 py-0.5 text-xs text-brand-600">
                    {item.applyType}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.purpose}
                >
                  {item.purpose}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-right tabular-nums text-ink-1 ${rowBg}`}
                >
                  {formatAmount(item.amount)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {currencyLabel(item.currency)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-right tabular-nums text-ink-1 ${rowBg}`}
                >
                  {formatAmount(reviewSettlement(item).receiveAmount)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {currencyLabel(reviewSettlement(item).receiveCurrency)}
                </td>
                {showProposed ? (
                  <>
                    <td
                      className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-right tabular-nums text-ink-1 ${rowBg}`}
                    >
                      {formatAmount(reviewSettlement(item).proposedAmount)}
                    </td>
                    <td
                      className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                    >
                      {currencyLabel(reviewSettlement(item).proposedCurrency)}
                    </td>
                  </>
                ) : null}
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.payeeName}
                >
                  {item.payeeName || "—"}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.payeeAccountNo}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.payeeBank || "—"}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {paymentMethodTypeLabel(item.paymentMethodType)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.applicantId || "—"}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.applicant}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-3 ${rowBg}`}
                >
                  {formatDate(item.appliedAt)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 ${rowBg}`}
                >
                  <StatusBadge status={item.status} />
                </td>
                {showPayResult ? (
                  <>
                    <td
                      className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                    >
                      {item.payResultStatus || "—"}
                    </td>
                    <td
                      className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                      title={item.payFailReason}
                    >
                      {item.payFailReason || "—"}
                    </td>
                  </>
                ) : null}
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-3 ${rowBg}`}
                >
                  {formatDate(item.createdAt)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-3 ${rowBg}`}
                >
                  {formatDate(item.updatedAt)}
                </td>
                <td
                  className={`sticky right-0 z-10 whitespace-nowrap border-b border-l border-slate-100 px-3 py-2.5 text-right shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.08)] ${rowBg}`}
                >
                  <div className="flex flex-nowrap items-center justify-end gap-2">
                    {showEdit && item.status === "pending_submit" ? (
                      <button
                        type="button"
                        onClick={() => onOpenDetail(item.id, "edit")}
                        className="inline-flex h-7 items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-ink-2 hover:border-brand-200 hover:text-brand-600"
                      >
                        初审
                      </button>
                    ) : null}
                    {showOfflinePay && item.status === "pending_submit" ? (
                      <button
                        type="button"
                        onClick={() => onOfflinePay?.(item.id)}
                        className="inline-flex h-7 items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-ink-2 hover:border-brand-200 hover:text-brand-600"
                      >
                        已线下付款
                      </button>
                    ) : null}
                    {showVoid && item.status === "pending_submit" ? (
                      <button
                        type="button"
                        onClick={() => onVoid?.(item.id)}
                        className="inline-flex h-7 items-center rounded border border-rose-200 bg-white px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        作废
                      </button>
                    ) : null}
                    {showQueryOps &&
                    item.status === "pending_pay" &&
                    item.payResultStatus === "支付失败" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onVoid?.(item.id)}
                          className="inline-flex h-7 items-center rounded border border-rose-200 bg-white px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          作废
                        </button>
                        <button
                          type="button"
                          onClick={() => onRetryPay?.(item.id)}
                          className="inline-flex h-7 items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-ink-2 hover:border-brand-200 hover:text-brand-600"
                        >
                          重新支付
                        </button>
                      </>
                    ) : null}
                    {showReview && item.status === "pending_review" ? (
                      <button
                        type="button"
                        onClick={() => onOpenDetail(item.id, "review")}
                        className="inline-flex h-7 items-center rounded border border-brand-200 bg-white px-2.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                      >
                        复核
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item.id, "view")}
                      className="inline-flex h-7 items-center rounded bg-brand-500 px-2.5 text-xs font-medium text-white hover:bg-brand-600"
                    >
                      查看
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-3 py-14 text-center text-ink-4"
              >
                暂无符合条件的付款单
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
    <TablePagination
      className="mt-3"
      total={rows.length}
      page={safePage}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
    />
    </div>
  );
}
