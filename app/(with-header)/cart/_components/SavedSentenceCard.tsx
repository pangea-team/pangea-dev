'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import Modal from '@/components/Modal';
import { PATH } from '@/constants/path';
import type { SavedSentenceRow } from '../_lib/get-saved-sentences';
import { deleteSavedSentence } from '../actions';

type Props = { row: SavedSentenceRow };

export default function SavedSentenceCard({ row }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sentence = row.sentences;
  const book = sentence?.books;
  if (!sentence || !book) return null;

  const paragraph = sentence.content[row.content_index] ?? '';
  // 책 제목/표지는 배송 전까지 노출 금지 — book_no만 익명 식별자로 노출
  const bookLabel = `No.${String(book.book_no).padStart(2, '0')}`;
  const savedDate = row.created_at.slice(0, 10).replaceAll('-', '.');

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await deleteSavedSentence({ id: row.id });
      if ('error' in result) return;
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    if (isPending) return;
    setIsModalOpen(false);
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-surface-50 p-6 shadow-sm">
      <span className="text-pretendard-caption text-purple3">{bookLabel}</span>

      <Link
        href={PATH.SENTENCE(String(sentence.book_id))}
        className="text-noto-subtitle-1 text-text transition-opacity hover:opacity-60"
      >
        “{paragraph}”
      </Link>

      <hr className="border-purple3/40 border-t" />

      <div className="flex gap-2">
        <span className="w-10 shrink-0 text-pretendard-caption text-purple3">My note</span>
        <p className="text-pretendard-body-2 text-text">{row.note}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-pretendard-caption text-purple3">
          <span>Saved</span>
          <span>{savedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              // TODO: 결제 흐름 연결
            }}
            className="bg-purple2 px-4 py-2 text-pretendard-body-2 text-white transition-opacity hover:opacity-80 rounded-md"
          >
            주문하기
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-pretendard-body-2 text-purple3 transition-opacity hover:opacity-60"
          >
            지우기
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        description="정말 지우시겠어요?"
        cancelText="취소"
        confirmText={isPending ? '지우는 중...' : '지우기'}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </article>
  );
}
