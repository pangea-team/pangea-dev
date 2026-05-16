import KakaoLoginButton from './KakaoLoginButton';

export default function KakaoLoginPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center px-page-x">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-section-sm text-center">
        <div className="flex flex-col items-center gap-comp-sm">
          <p className="text-cormorant-display-2">PANGEA</p>
          <div className="flex flex-col gap-comp-sm">
            <p className="text-noto-subtitle-1">이 세계에는</p>
            <p className="text-noto-subtitle-1">당신을 읽는 사람이 있습니다.</p>
          </div>
        </div>
        <KakaoLoginButton />
        <p className="text-pretendard-body-2 text-text/90">로그인이 필요합니다.</p>
      </div>
    </main>
  );
}
