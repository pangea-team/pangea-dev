import Image from 'next/image';
import Link from 'next/link';
import type { BookCardData } from '../_lib/get-season-books';

type Props = {
  book: BookCardData;
};

export default function BookCard({ book }: Props) {
  return (
    <Link href={`/books/${book.id}`} className="block">
      <div className="relative mt-10 flex w-full max-w-4xl flex-col gap-comp-sm px-content-x md:flex-row md:gap-20">
        <div className="relative h-70 w-50 shrink-0 md:h-122.5 md:w-87.5">
          <Image
            src={book.cover_image}
            alt={`${book.title} 표지`}
            width={350}
            height={490}
            sizes="(max-width: 768px) 200px, 350px"
            className="h-full w-full object-cover shadow-[-3px_6px_12px_0_rgba(0,0,0,0.25)]"
          />
        </div>
        <div className="relative flex flex-col">
          <span className="text-noto-subtitle-2 px-1 py-2">No.{book.book_no}</span>
          <div className="flex flex-col flex-wrap gap-section-sm pt-section-sm md:gap-12 md:pt-15">
            <div className="flex flex-col gap-2">
              <span className="text-noto-body-1">MOOD</span>
              <p className="text-noto-subtitle-2 whitespace-nowrap">{book.mood}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-noto-body-1">KEYWORD</span>
              <p className="text-noto-subtitle-2 whitespace-nowrap">{book.keyword.join(' / ')}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-noto-body-1">TYPE</span>
              <p className="text-noto-subtitle-2 whitespace-nowrap">{book.type}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
