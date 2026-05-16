import { createClient } from '@/lib/supabase/server';

// 책 제목은 배송 전까지 노출 금지 — books.title은 select에서 제외
export async function getOrderContext(savedSentenceId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('saved_sentences')
    .select(`
      id, content_index, note,
      sentences (
        id, book_id, content,
        books ( id, book_no, mood, keyword, cover_image, price )
      )
    `)
    .eq('id', savedSentenceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type OrderContext = NonNullable<Awaited<ReturnType<typeof getOrderContext>>>;
