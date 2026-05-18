'use client';

import Image from 'next/image';
import type { BookWithQuestions } from '@/app/(with-header)/feed/_lib/get-feeds';

type Props = {
  books: BookWithQuestions[];
  selectedBook: BookWithQuestions | null;
  onSelect: (book: BookWithQuestions) => void;
};

export default function StepBookSelect({ books, selectedBook, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-section-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-noto-subtitle-1">어떤 책을 읽으셨나요?</h2>
      </div>

      {books.length === 0 ? (
        <p className="text-pretendard-body-2 text-primary/60 ">등록된 책이 없습니다.</p>
      ) : (
        <div className="mx-auto grid w-full max-w-[800px] grid-cols-2 gap-comp-sm sm:grid-cols-4 justify-items-center">
          {books.map((book) => {
            const selected = selectedBook?.id === book.id;
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelect(book)}
                className={`flex w-full flex-col gap-2 rounded-none border-2 bg-transparent p-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 ${
                  selected ? 'border-primary' : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="relative aspect-[5/7] w-full overflow-hidden bg-feed-placeholder shadow-[-3px_6px_12px_0_rgba(0,0,0,0.15)]">
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, 180px"
                  />
                </div>
                <span className="text-pretendard-body-2 line-clamp-2 text-ink-100">
                  {book.title}
                </span>
                <span className="text-pretendard-caption text-primary/60">
                  No.{book.book_no} · {book.mood}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
