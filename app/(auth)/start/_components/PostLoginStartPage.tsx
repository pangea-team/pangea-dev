import Link from 'next/link';

export default function PostLoginStartPage() {
  return (
    <main className="grid h-dvh w-full grid-cols-[240fr_minmax(0,auto)_874fr] overflow-hidden">
      <div aria-hidden className="min-w-0" />
      <div className="flex min-w-0 flex-col pt-hero">
        <p className="text-noto-subtitle-1">로그인이 완료되었습니다.</p>
        <h1 className="text-noto-display mt-comp-sm">이제 시작합니다.</h1>
        <Link
          className="border-primary mt-section-md inline-flex w-60 max-w-full items-center gap-2.5 border-b pb-1.5"
          href="/login"
        >
          <span className="text-noto-title-2 whitespace-nowrap">프로필 작성하기</span>
          <span aria-hidden className="text-noto-title-2">
            →
          </span>
        </Link>
      </div>
      <div aria-hidden className="min-w-0" />
    </main>
  );
}
