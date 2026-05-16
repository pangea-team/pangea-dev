import { createClient } from '@/lib/supabase/server';

export async function getBookWithSentences(bookId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('books')
    .select(`
      id, book_no, mood, keyword, type, cover_image, title, season,
      sentences ( id, order_no, page_no, content )
    `)
    .eq('id', bookId)
    .order('order_no', { referencedTable: 'sentences', ascending: true })
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type BookWithSentences = NonNullable<Awaited<ReturnType<typeof getBookWithSentences>>>;
