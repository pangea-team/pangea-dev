'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function OrderPurchaseDialog({ open, onClose, onConfirm }: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-primary/25"
        onClick={onClose}
        aria-label="구매 확인 닫기"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-purchase-title"
        className="relative w-full max-w-[300px] overflow-hidden rounded-[20px] bg-surface-50 px-10"
      >
        <div className="flex flex-col items-center gap-9 pt-6">
          <p id="order-purchase-title" className="text-pretendard-subtitle-1 text-center">
            이 책을 구매하시겠습니까?
          </p>
          <div className="flex h-[70px] w-full items-center justify-center gap-[78px] border-t-[0.5px] border-primary">
            <button
              type="button"
              className="bg-purple2 px-4 py-2 text-pretendard-body-2 text-white transition-opacity hover:opacity-80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              예
            </button>
            <button
              type="button"
              className="border border-gray-300 px-4 py-2 text-pretendard-body-2 text-gray-600 transition-opacity hover:opacity-80 rounded-md"
              onClick={onClose}
            >
              아니오
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
