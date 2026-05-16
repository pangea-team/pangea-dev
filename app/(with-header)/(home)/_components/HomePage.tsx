import { getCurrentSeasonBooks } from '../_lib/get-season-books';
import BookCard from './BookCard';

export default async function HomePage() {
  const books = await getCurrentSeasonBooks();

  return (
    <div>
      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl px-content-x py-content-y">
        <p className="text-noto-title-1 py-4">5월의 문장들</p>
        <p className="text-noto-subtitle-2 py-4">
          "<span className="text-noto-subtitle-1">동심</span>, 당신이 믿었던 세계는 무엇인가"
        </p>
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
