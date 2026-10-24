import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_META, type PaymentStatus } from "@/lib/payments-data";

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.bg,
        meta.tone
      )}
    >
      {meta.label}
    </span>
  );
}

export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600",
        className
      )}
    >
      {children}
    </span>
  );
}
