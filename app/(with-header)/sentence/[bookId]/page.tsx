import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BookReader from './_components/BookReader';
import { getBookWithSentences } from './_lib/get-book-with-sentences';

type Props = {
  params: Promise<{ bookId: string }>;
};

export default async function SentencePage({ params }: Props) {
  const { bookId } = await params;
  const book = await getBookWithSentences(Number(bookId));

  if (!book) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isLoggedIn = false;
  let hasAnsweredSurvey = false;

  if (user) {
    isLoggedIn = true;
    const { data } = await supabase
      .from('users')
      .select('survey_answered_at')
      .eq('id', user.id)
      .single();
    hasAnsweredSurvey = !!data?.survey_answered_at;
  }

  return (
    <main>
      <BookReader book={book} isLoggedIn={isLoggedIn} hasAnsweredSurvey={hasAnsweredSurvey} />
    </main>
  );
}
