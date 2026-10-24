"use client";

import type { ReactNode } from "react";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const PAGE_SIZE_OPTIONS = [10, 20, 50];
const PAGE_JUMP = 5;

export function TablePagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const current = Math.min(Math.max(1, page), pageCount);
  const pages = visiblePages(current, pageCount);

  const go = (next: number) => {
    const clamped = Math.min(pageCount, Math.max(1, next));
    if (clamped !== current) onPageChange(clamped);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-ink-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span>共 {total} 条记录</span>
        <select
          value={pageSize}
          aria-label="每页行数"
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-ink-2 outline-none focus:border-brand-400"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}条/页
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-0.5">
        <PagerIcon
          label="第一页"
          disabled={current <= 1}
          onClick={() => go(1)}
        >
          <ChevronFirst className="h-3.5 w-3.5" />
        </PagerIcon>
        <PagerIcon
          label="向前翻页"
          disabled={current <= 1}
          onClick={() => go(current - PAGE_JUMP)}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </PagerIcon>
        <PagerIcon
          label="上一页"
          disabled={current <= 1}
          onClick={() => go(current - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </PagerIcon>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            className={cn(
              "inline-flex h-7 min-w-7 items-center justify-center px-1.5 text-xs",
              p === current
                ? "rounded-full bg-brand-500 font-medium text-white"
                : "text-ink-2 hover:text-brand-600"
            )}
          >
            {p}
          </button>
        ))}
        <PagerIcon
          label="下一页"
          disabled={current >= pageCount}
          onClick={() => go(current + 1)}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </PagerIcon>
        <PagerIcon
          label="向后翻页"
          disabled={current >= pageCount}
          onClick={() => go(current + PAGE_JUMP)}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </PagerIcon>
        <PagerIcon
          label="最后一页"
          disabled={current >= pageCount}
          onClick={() => go(pageCount)}
        >
          <ChevronLast className="h-3.5 w-3.5" />
        </PagerIcon>
      </div>
    </div>
  );
}

function PagerIcon({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center text-ink-3 disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:text-brand-600"
    >
      {children}
    </button>
  );
}

function visiblePages(current: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const start = Math.max(1, Math.min(current - 2, pageCount - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}
