import { createClient } from '@/lib/supabase/server';

/**
 * 보안 중요 페이지용 — Auth 서버 호출로 세션 검증.
 * 결제, 본인 데이터 수정 등에 사용.
 */
export async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

/**
 * 일반 페이지용 — JWT 토큰만 디코드 (빠름).
 * RLS로 보호되는 작업에 사용.
 */
export async function getUserIdFromClaims(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;
  return typeof sub === 'string' ? sub : null;
}
