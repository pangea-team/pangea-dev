'use client';
import KakaoLoginButton from './KakaoLoginButton';

export default function KakaoLoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center">
      <p className="text-cormorant-display-2 pt-hero">PANGEA</p>
      <p className="text-noto-subtitle-1 pt-section-md">이 세계에는</p>
      <p className="text-noto-subtitle-1 pt-comp-sm pb-section-md">당신을 읽는 사람이 있습니다.</p>
      <KakaoLoginButton />
      <p className="text-pretendard-body-2 text-text/90 pt-comp-sm">로그인이 필요합니다.</p>
    </main>
  );
}
