'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  isOpen: boolean;
  title?: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function Modal({
  isOpen,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      <div className="relative flex h-45 w-75 flex-col overflow-hidden rounded-3xl bg-surface-50">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          {title && <p className="text-noto-subtitle-1 text-primary">{title}</p>}
          <p className="text-pretendard-body-2 text-neutral-800">{description}</p>
        </div>
        <div className="flex border-purple3 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer py-4 text-pretendard-body-1 text-neutral-800"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer border-purple3 border-l py-4 text-pretendard-body-1 text-primary"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
