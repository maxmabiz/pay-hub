import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-600",
        secondary:
          "bg-white text-ink-2 border border-slate-200 hover:bg-slate-50",
        ghost: "text-ink-2 hover:bg-slate-100 hover:text-ink-1",
        outline:
          "border border-slate-200 bg-white text-ink-1 hover:border-brand-200 hover:text-brand-600",
        link: "h-auto rounded-none px-0 py-0 text-brand-500 hover:text-brand-600",
        danger: "bg-rose-500 text-white hover:bg-rose-600",
      },
      size: {
        default: "h-8 px-3.5",
        sm: "h-7 rounded px-2.5 text-xs",
        lg: "h-9 rounded-md px-4",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
