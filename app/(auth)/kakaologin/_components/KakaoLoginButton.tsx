'use client';
import { createClient } from '@/lib/supabase/client';

function KakaoSpeechBubbleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 26" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 0C6.268 0 0 4.84 0 10.814C0 14.73 2.656 18.094 6.556 19.907L5.19 25.101C5.083 25.511 5.54 25.845 5.894 25.602L12.115 21.365C12.733 21.539 13.361 21.628 14 21.628C21.732 21.628 28 16.788 28 10.814C28 4.84 21.732 0 14 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function KakaoLoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };
  return (
    <button
      type="button"
      aria-label="카카오 로그인"
      className="flex h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#251e2e]"
      onClick={handleLogin}
    >
      <KakaoSpeechBubbleMark className="h-[22px] w-[22px] shrink-0" />
      <span className="font-[family-name:var(--font-pretendard)] text-[20px] leading-[24px] font-medium tracking-[-0.02em]">
        카카오 로그인
      </span>
    </button>
  );
}
