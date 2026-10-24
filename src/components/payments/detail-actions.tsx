"use client";

import { cn } from "@/lib/utils";

/**
 * 明细页底部操作条：居中上浮，宽度与正文卡片齐平。
 * 上浮间距与页面主内容区内边距一致（p-3 / sm:p-4）。
 */
export function DetailActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-3 z-30 mt-3 w-full sm:bottom-4 sm:mt-4",
        className
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white/95 px-4 py-2.5 shadow-[0_8px_28px_rgba(15,23,42,0.12)] backdrop-blur">
        {children}
      </div>
    </div>
  );
}
