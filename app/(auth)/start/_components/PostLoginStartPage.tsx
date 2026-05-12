import Link from 'next/link';

export default function PostLoginStartPage() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-page-x">
      <div className="flex aspect-[1440/1024] w-full max-w-[90rem] flex-col justify-center">
        <div className="flex w-full flex-col items-start pl-[16.667%]">
          <p className="text-noto-subtitle-2 tracking-body">로그인이 완료되었습니다.</p>
          <h1 className="text-noto-display mt-4 tracking-body">이제 시작합니다.</h1>
          <Link
            className="border-text mt-section-sm inline-flex w-60 max-w-full items-center gap-2.5 border-b pb-3 tracking-body"
            href="/login"
          >
            <span className="text-noto-title-2 whitespace-nowrap">프로필 작성하기</span>
            <span aria-hidden className="text-noto-title-1 text-text">
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
