"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** 右侧抽屉，用于引导页打开明细 */
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 left-auto z-50 flex h-full w-[min(760px,100vw)] flex-col border-l border-slate-200 bg-[#f5f6f8] shadow-[-12px_0_32px_rgba(15,23,42,0.12)] outline-none",
            "animate-drawer-in"
          )}
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
            <DialogPrimitive.Title className="text-base font-semibold text-ink-1">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-3 hover:bg-slate-100 hover:text-ink-1"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
