import Image from 'next/image';
import Link from 'next/link';
import type { BookCardData } from '../_lib/get-season-books';

type Props = {
  book: BookCardData;
};

export default function BookCard({ book }: Props) {
  return (
    <Link href={`/sentence/${book.id}`} className="block">
      <div className="relative mt-10 flex w-full max-w-4xl flex-col gap-comp-sm px-content-x md:flex-row md:gap-comp-md">
        <div className="relative w-full max-w-87.5 shrink-0 self-center md:self-auto">
          <Image
            src={book.cover_image}
            alt={`${book.title} 표지`}
            width={350}
            height={490}
            sizes="(max-width: 768px) 100vw, 350px"
            className="h-auto w-full shadow-[-3px_6px_12px_0_rgba(0,0,0,0.25)]"
          />
        </div>
        <div className="relative flex flex-col">
          <span className="text-noto-subtitle-2 px-1 py-2">No.{book.book_no}</span>
          <div className="flex flex-col flex-wrap gap-comp-md pt-comp-sm md:pt-comp-md">
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
