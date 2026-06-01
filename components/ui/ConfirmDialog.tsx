'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${destructive ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <AlertTriangle size={24} className={destructive ? 'text-red-600' : 'text-yellow-600'} />
            </div>
            <Dialog.Title className="text-lg font-bold text-gray-900">{title}</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600">{description}</Dialog.Description>
            <div className="flex gap-3 w-full mt-2">
              <Dialog.Close asChild>
                <button className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm">
                  {cancelLabel}
                </button>
              </Dialog.Close>
              <button
                onClick={() => { onConfirm(); onOpenChange(false); }}
                className={`flex-1 h-12 rounded-xl font-semibold text-sm text-white ${
                  destructive ? 'bg-red-600 active:bg-red-700' : 'bg-[#C0392B] active:bg-[#a93226]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
