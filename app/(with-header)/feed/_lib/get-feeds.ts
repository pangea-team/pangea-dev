import { createClient } from '@/lib/supabase/server';

export async function getFeeds(userId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('feeds')
    .select(`
      id, user_id, book_id, question_id, answer, images, created_at,
      books ( id, title, cover_image, cover_color ),
      questions ( id, content ),
      users ( id, name )
    `)
    .order('created_at', { ascending: false });
  if (userId) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export type Feed = NonNullable<Awaited<ReturnType<typeof getFeeds>>>[number];

export async function getBooksWithQuestions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('books')
    .select(`
      id, book_no, title, cover_image, cover_color, mood, author,
      questions ( id, order_no, content )
    `)
    .order('book_no', { ascending: true })
    .order('order_no', { referencedTable: 'questions', ascending: true });
  if (error) throw error;
  return data;
}

export type BookWithQuestions = NonNullable<
  Awaited<ReturnType<typeof getBooksWithQuestions>>
>[number];
