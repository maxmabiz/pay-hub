"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmDialog({
  open,
  title = "提示",
  description,
  confirmText = "确认",
  cancelText = "取消",
  confirmVariant = "default",
  closeOnly = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "danger";
  /** 仅一个【关闭】按钮 */
  closeOnly?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          {closeOnly ? (
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel();
              }}
            >
              关闭
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCancel();
                }}
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={confirmVariant}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConfirm?.();
                }}
              >
                {confirmText}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
