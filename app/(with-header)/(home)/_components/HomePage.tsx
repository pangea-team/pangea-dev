import { getCurrentSeasonBooks } from '../_lib/get-season-books';
import BookCard from './BookCard';

export default async function HomePage() {
  const books = await getCurrentSeasonBooks();

  return (
    <div>
      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x py-content-y">
        <p className="text-noto-title-1 py-4">이달의 북 큐레이션</p>
        <p className="text-noto-subtitle-2 py-4">지금 마음이 끌리는 책으로 들어가보세요.</p>
      </div>
      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x ">
        {books.length === 0 ? (
          <p className="text-noto-body-1 py-section-lg">이번 시즌 책이 준비 중입니다.</p>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
}
