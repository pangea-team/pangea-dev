import Link from 'next/link';
import { PATH } from '@/constants/path';

export default function PostLoginStartPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col px-page-x py-section-md md:grid md:h-dvh md:grid-cols-[240fr_minmax(0,auto)_874fr] md:overflow-hidden md:p-0">
      <div aria-hidden className="hidden min-w-0 md:block" />
      <div className="mx-auto flex w-full max-w-layout-content min-w-0 flex-col md:mx-0 md:max-w-none md:pt-hero">
        <p className="text-noto-subtitle-1">로그인이 완료되었습니다.</p>
        <h1 className="text-noto-display mt-comp-sm">이제 시작합니다.</h1>
        <Link
          className="border-primary mt-section-md inline-flex w-60 max-w-full min-w-0 items-center gap-2.5 border-b pb-1.5"
          href={PATH.LOGIN}
        >
          <span className="text-noto-title-2 sm:whitespace-nowrap">프로필 작성하기</span>
          <span aria-hidden className="text-noto-title-2">
            →
          </span>
        </Link>
      </div>
      <div aria-hidden className="hidden min-w-0 md:block" />
    </main>
  );
}
