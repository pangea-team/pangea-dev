import KakaoLoginButton from './KakaoLoginButton';

export default function KakaoLoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-content-y text-center ">
      <p className="text-cormorant-display-2 pt-section-lg">PANGEA</p>
      <p className="text-noto-subtitle-1 pt-section-md">이 세계에는</p>
      <p className="text-noto-subtitle-1 pt-comp-sm">당신을 읽는 사람이 있습니다.</p>
      <div className="mt-auto max-h-40 flex flex-col items-center">
        <KakaoLoginButton />
      </div>
    </main>
  );
}
