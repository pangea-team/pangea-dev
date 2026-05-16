import { notFound } from 'next/navigation';
import BookReader from './_components/BookReader';
import { getBookWithSentences } from './_lib/get-book-with-sentences';

type Props = {
  params: Promise<{ bookId: string }>;
};

export default async function SentencePage({ params }: Props) {
  const { bookId } = await params;
  const book = await getBookWithSentences(Number(bookId));

  if (!book) notFound();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <BookReader book={book} />
    </main>
  );
}
