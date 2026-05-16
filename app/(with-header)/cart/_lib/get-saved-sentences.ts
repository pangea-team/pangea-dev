import { createClient } from '@/lib/supabase/server';

// 책 제목/표지는 배송 전까지 노출 금지 — books.title, books.cover_image는 select에서 제외
export async function getSavedSentences(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('saved_sentences')
    .select(`
      id, content_index, note, created_at,
      sentences (
        id, book_id, content,
        books ( id, book_no )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export type SavedSentenceRow = Awaited<ReturnType<typeof getSavedSentences>>[number];
