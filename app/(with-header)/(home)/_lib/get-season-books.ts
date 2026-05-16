import { createClient } from '@/lib/supabase/server';

export async function getCurrentSeasonBooks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('books')
    .select('id, book_no, mood, keyword, type, cover_image, title')
    .eq('season', 1)
    .order('book_no', { ascending: true });

  if (error) throw error;
  return data;
}

export type BookCardData = Awaited<ReturnType<typeof getCurrentSeasonBooks>>[number];
