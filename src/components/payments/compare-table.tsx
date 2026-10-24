"use client";

import { useEffect, useMemo, useState } from "react";
import { TablePagination } from "@/components/ui/pagination";
import {
  compareMismatch,
  compareOutcome,
  type CompareResult,
} from "@/lib/compare-data";
import { currencyLabel } from "@/lib/payments-data";
import { cn, formatAmount } from "@/lib/utils";

const CELL =
  "whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2";
const HEAD =
  "whitespace-nowrap border-b border-slate-200 px-3 py-2 font-medium";

export function CompareTable({ rows }: { rows: CompareResult[] }) {
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

  return (
    <div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            <th
              colSpan={5}
              className="border-b border-r-2 border-slate-200 bg-[#e8f1ff] px-3 py-2 text-center text-sm font-semibold text-brand-700"
            >
              付款单
            </th>
            <th
              colSpan={5}
              className="border-b border-r-2 border-slate-200 bg-[#fff4e8] px-3 py-2 text-center text-sm font-semibold text-amber-800"
            >
              审批单
            </th>
            <th
              rowSpan={2}
              className="border-b border-slate-200 bg-[#f0fdf4] px-3 py-2 text-center text-sm font-semibold text-emerald-800 align-middle"
            >
              比对结果
            </th>
          </tr>
          <tr className="bg-[#f5f6f8] text-xs text-ink-2">
            <th className={HEAD}>付款单号</th>
            <th className={HEAD}>审批金额</th>
            <th className={HEAD}>审批币种</th>
            <th className={HEAD}>收款人</th>
            <th className={`${HEAD} border-r-2`}>收款账号</th>
            <th className={HEAD}>审批单号</th>
            <th className={HEAD}>审批金额</th>
            <th className={HEAD}>审批币种</th>
            <th className={HEAD}>收款人</th>
            <th className={`${HEAD} border-r-2`}>收款账号</th>
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((item, idx) => {
            const rowBg = idx % 2 === 1 ? "bg-[#fafbfc]" : "bg-white";
            const miss = compareMismatch(item.payment, item.approval);
            const outcome = compareOutcome(item.payment, item.approval);
            return (
              <tr key={item.id}>
                <td className={cn(CELL, rowBg, "font-medium text-ink-1")}>
                  {item.payment.docNo}
                </td>
                <td className={cn(CELL, rowBg, miss.amount && "bg-rose-50 text-rose-700")}>
                  {formatAmount(item.payment.amount)}
                </td>
                <td className={cn(CELL, rowBg, miss.currency && "bg-rose-50 text-rose-700")}>
                  {currencyLabel(item.payment.currency)}
                </td>
                <td className={cn(CELL, rowBg, miss.payeeName && "bg-rose-50 text-rose-700")}>
                  {item.payment.payeeName}
                </td>
                <td
                  className={cn(
                    CELL,
                    rowBg,
                    "border-r-2",
                    miss.payeeAccountNo && "bg-rose-50 text-rose-700"
                  )}
                >
                  {item.payment.payeeAccountNo}
                </td>
                <td className={cn(CELL, rowBg, "font-medium text-ink-1")}>
                  {item.approval.docNo}
                </td>
                <td className={cn(CELL, rowBg, miss.amount && "bg-rose-50 text-rose-700")}>
                  {formatAmount(item.approval.amount)}
                </td>
                <td className={cn(CELL, rowBg, miss.currency && "bg-rose-50 text-rose-700")}>
                  {currencyLabel(item.approval.currency)}
                </td>
                <td className={cn(CELL, rowBg, miss.payeeName && "bg-rose-50 text-rose-700")}>
                  {item.approval.payeeName}
                </td>
                <td
                  className={cn(
                    CELL,
                    rowBg,
                    "border-r-2",
                    miss.payeeAccountNo && "bg-rose-50 text-rose-700"
                  )}
                >
                  {item.approval.payeeAccountNo}
                </td>
                <td className={cn(CELL, rowBg, "text-center")}>
                  <span
                    className={cn(
                      "inline-flex rounded px-2 py-0.5 text-xs font-medium",
                      outcome === "一致"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    )}
                  >
                    {outcome}
                  </span>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-3 py-14 text-center text-ink-4">
                暂无比对结果
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
