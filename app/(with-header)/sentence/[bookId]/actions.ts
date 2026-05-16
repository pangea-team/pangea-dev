'use server';

import { createClient } from '@/lib/supabase/server';

type CreateMemoInput = {
  sentenceId: number;
  contentIndex: number;
  note: string;
};

type CreateMemoResult = { error: string } | { success: true };

export async function createMemo({
  sentenceId,
  contentIndex,
  note,
}: CreateMemoInput): Promise<CreateMemoResult> {
  const trimmedNote = note.trim();

  if (!trimmedNote) {
    return { error: '메모를 입력해주세요.' };
  }
  if (trimmedNote.length > 160) {
    return { error: '메모는 160자 이하로 입력해주세요.' };
  }
  if (!Number.isInteger(contentIndex) || contentIndex < 0) {
    return { error: '유효하지 않은 문단입니다.' };
  }
  if (!Number.isInteger(sentenceId) || sentenceId <= 0) {
    return { error: '유효하지 않은 문장입니다.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인이 필요합니다.' };
  }

  const { error: dbError } = await supabase.from('saved_sentences').insert({
    id: crypto.randomUUID(),
    user_id: user.id,
    sentence_id: sentenceId,
    content_index: contentIndex,
    note: trimmedNote,
  });

  if (dbError) {
    return { error: '저장에 실패했습니다. 다시 시도해주세요.' };
  }

  return { success: true };
}

type AnswerSurveyInput = {
  wantsToSeeOthers: boolean;
};

type AnswerSurveyResult = { error: string } | { success: true };

export async function answerSurvey({
  wantsToSeeOthers,
}: AnswerSurveyInput): Promise<AnswerSurveyResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인이 필요합니다.' };
  }

  const { error: dbError } = await supabase
    .from('users')
    .update({
      wants_to_see_others: wantsToSeeOthers,
      survey_answered_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (dbError) {
    return { error: '저장에 실패했습니다.' };
  }

  return { success: true };
}
