import Image from 'next/image';
import bookImage from '@/public/images/book_covers/season-1/book_cover_1.webp';

export default function BookCard() {
  return (
    <div className="w-full max-w-87.5">
      <Image
        src={bookImage}
        alt="Book Cover"
        sizes="(max-width: 768px) 100vw, 350px"
        className="w-full h-auto"
      />
    </div>
  );
}
