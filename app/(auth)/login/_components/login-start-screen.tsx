import Link from 'next/link';

export default function LoginStartScreen() {
  return (
    <main className="min-h-[100dvh] bg-background px-6 pb-24 pt-[20vh] sm:px-10 md:pl-[clamp(2rem,12vw,15rem)]">
      <div className="relative z-[1] mx-auto max-w-[960px]">
        <p className="pl-[1em] tracking-[1.8px] text-primary text-noto-subtitle-2">
          로그인이 완료되었습니다.
        </p>

        <h1 className="mt-3 tracking-[4.8px] text-primary text-noto-display">이제 시작합니다.</h1>

        <div className="mt-28">
          <Link
            prefetch
            href="/login/profile"
            className="group inline-flex flex-wrap items-center gap-[10px] pb-3 text-primary"
          >
            <span className="inline-block pb-px text-noto-title-2 tracking-[2.4px]">
              프로필 작성하기
            </span>
            <span
              className="font-semibold leading-none text-noto-title-2 tracking-[2.6px]"
              aria-hidden
            >
              →
            </span>
          </Link>
          <div className="h-px w-[min(240px,80vw)] bg-primary" aria-hidden />
        </div>
      </div>
    </main>
  );
}
