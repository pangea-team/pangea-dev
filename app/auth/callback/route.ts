import { NextResponse } from 'next/server';
import { PATH } from '@/constants/path';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // 로그인 후 돌아갈 페이지 (없으면 홈)
  let next = searchParams.get('next') ?? PATH.HOME;
  if (!next.startsWith('/')) {
    next = PATH.LOGIN;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 페이지로 보냄
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
