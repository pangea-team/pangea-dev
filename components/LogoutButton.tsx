'use client';

import { useState, useTransition } from 'react';
import { signOut } from '@/app/auth/actions';
import ConfirmModal from '@/components/ConfirmModal';

export default function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await signOut();
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer whitespace-nowrap px-3 py-2 text-pretendard-nav"
      >
        Logout
      </button>
      <ConfirmModal
        isOpen={isOpen}
        title="로그아웃하시겠어요?"
        description="언제든 다시 로그인할 수 있어요."
        cancelText="취소"
        confirmText="로그아웃"
        onCancel={() => {
          if (!isPending) setIsOpen(false);
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
