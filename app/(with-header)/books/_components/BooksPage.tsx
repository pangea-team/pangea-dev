import { CONTAINER_CLASS } from '@/constants/styles';
import { getCurrentSeasonBooks } from '../_lib/get-season-books';
import BookCard from './BookCard';

function BookList({ books }: { books: Awaited<ReturnType<typeof getCurrentSeasonBooks>> }) {
  if (books.length === 0) {
    return <p className="text-noto-body-1 py-section-lg">이번 시즌 책이 준비 중입니다.</p>;
  }

  return (
    <>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </>
  );
}

export default async function BooksPage() {
  const books = await getCurrentSeasonBooks();

  return (
    <div>
      <section className={`${CONTAINER_CLASS} py-content-y`}>
        <h1 className="text-noto-title-1 py-4">이달의 북 큐레이션</h1>
        <p className="text-noto-subtitle-2 py-4">지금 마음이 끌리는 책으로 들어가보세요.</p>
      </section>
      <section className={CONTAINER_CLASS}>
        <BookList books={books} />
      </section>
    </div>
  );
}
