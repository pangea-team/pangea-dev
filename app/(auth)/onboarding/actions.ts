'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';
import { createClient } from '@/lib/supabase/server';

type OnboardingInput = {
  name: string;
  trace: string;
};

type OnboardingResult = { error: string } | undefined;

export async function completeOnboarding({
  name,
  trace,
}: OnboardingInput): Promise<OnboardingResult> {
  const trimmedName = name.trim();
  const trimmedTrace = trace.trim();

  if (!trimmedName || !trimmedTrace) {
    return { error: '이름과 한 줄의 흔적을 모두 입력해주세요.' };
  }
  if (trimmedName.length > 10) {
    return { error: '이름은 10자 이하로 입력해주세요.' };
  }
  if (trimmedTrace.length > 60) {
    return { error: '한 줄의 흔적은 60자 이하로 입력해주세요.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인이 필요합니다.' };
  }

  const meta = user.user_metadata;
  const kakaoName = meta.name ?? meta.full_name ?? null;

  const { error: dbError } = await supabase.from('users').upsert({
    id: user.id,
    kakao_id: String(meta.sub),
    name: trimmedName,
    kakao_name: kakaoName,
    trace: trimmedTrace,
  });

  if (dbError) {
    return { error: '저장에 실패했습니다. 다시 시도해주세요.' };
  }

  revalidatePath(PATH.LANDING);
  redirect(PATH.LANDING);
}
