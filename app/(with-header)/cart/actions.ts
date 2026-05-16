'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type DeleteSavedSentenceInput = { id: string };
type DeleteSavedSentenceResult = { error: string } | { success: true };

export async function deleteSavedSentence({
  id,
}: DeleteSavedSentenceInput): Promise<DeleteSavedSentenceResult> {
  if (!id) {
    return { error: '유효하지 않은 항목입니다.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인이 필요합니다.' };
  }

  const { error: dbError } = await supabase
    .from('saved_sentences')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (dbError) {
    return { error: '삭제에 실패했습니다. 다시 시도해주세요.' };
  }

  revalidatePath('/cart');
  return { success: true };
}
