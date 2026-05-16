'use client';

import { useState } from 'react';

type Props = {
  value: string;
};

export default function CopyAccountButton({ value }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      // 클립보드 API 미지원/거부 — 사용자에게 노출되는 alert로 폴백
      window.prompt('계좌번호를 복사해주세요.', value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border border-purple3 px-3 py-1 text-pretendard-body-2 text-primary transition-opacity hover:opacity-70"
    >
      {isCopied ? '복사됨' : '복사'}
    </button>
  );
}
