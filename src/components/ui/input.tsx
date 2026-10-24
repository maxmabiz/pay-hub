import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm text-ink-1 placeholder:text-ink-4 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 overflow-hidden text-clip",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[88px] w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-ink-1 placeholder:text-ink-4 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs text-ink-3", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const empty = props.value === "" || props.value === undefined;
  return (
    <select
      className={cn(
        "flex h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 overflow-hidden text-clip",
        empty ? "text-ink-4" : "text-ink-1",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
