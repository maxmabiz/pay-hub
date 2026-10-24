"use client";

import { Label, Textarea } from "@/components/ui/input";

export function OpinionSection({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange?: (next: string) => void;
  className?: string;
}) {
  return (
    <div className={className ?? "space-y-2"}>
      <Label>处理意见</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="填写本次处理意见"
      />
    </div>
  );
}
