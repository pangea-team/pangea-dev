'use client';

import Link from 'next/dist/client/link';
import { useState } from 'react';
import { PATH } from '@/constants/path';
import type { BookWithSentences } from '../_lib/get-book-with-sentences';
import MemoPanel from './MemoPanel';
import SentenceContent from './SentenceContent';

type Props = {
  book: BookWithSentences;
};

export default function BookReader({ book }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedContentIndex, setSelectedContentIndex] = useState<number | null>(null);

  const sentences = book.sentences ?? [];
  const currentSentence = sentences[pageIndex];
  const total = sentences.length;

  const goToPrev = () => {
    setPageIndex((i) => Math.max(0, i - 1));
    setSelectedContentIndex(null);
  };

  const goToNext = () => {
    setPageIndex((i) => Math.min(total - 1, i + 1));
    setSelectedContentIndex(null);
  };

  const handleSelect = (index: number) => {
    setSelectedContentIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="px-content-x py-content-y mb-section-sm">
      <div className="mb-section-sm flex items-center justify-between">
        <span className="text-noto-body-1 text-purple3">
          {pageIndex + 1} / {total}
        </span>
        <div className="flex gap-6">
          <button
            type="button"
            onClick={goToPrev}
            disabled={pageIndex === 0}
            className="text-pretendard-body-2 text-text transition-opacity hover:opacity-60 disabled:opacity-25"
          >
            이전
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={pageIndex === total - 1}
            className="text-pretendard-body-2 text-text transition-opacity hover:opacity-60 disabled:opacity-25"
          >
            다음
          </button>
        </div>
      </div>

      {currentSentence ? (
        <div className="flex flex-col gap-section-sm lg:flex-row lg:gap-20">
          <div className="flex-1">
            <SentenceContent
              bookId={book.id}
              content={currentSentence.content}
              selectedIndex={selectedContentIndex}
              onSelect={handleSelect}
            />
          </div>
          <div className="w-full shrink-0 lg:w-72">
            <MemoPanel
              key={`${currentSentence.id}-${selectedContentIndex}`}
              selectedSentenceId={selectedContentIndex !== null ? currentSentence.id : null}
              selectedContentIndex={selectedContentIndex}
            />
          </div>
        </div>
      ) : (
        <p className="text-noto-body-1 text-purple3">문장이 없습니다.</p>
      )}
    </div>
  );
}
