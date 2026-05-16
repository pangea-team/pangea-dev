import FeedUploadClient from '@/app/feed/upload/_components/FeedUploadClient';
import Header from '@/components/Header';

export default function FeedUploadPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-layout-feed flex-1 flex-col px-page-x pb-section-md">
          <div className="mt-section-sm flex shrink-0 flex-col gap-2">
            <h1 className="text-noto-heading-1">당신의 흔적을 기록하세요.</h1>
            <p className="text-noto-subtitle-2">누군가 이 흔적을 읽고, 당신을 선택합니다.</p>
          </div>
          <div className="flex flex-1 flex-col items-center pt-section-sm">
            <FeedUploadClient />
          </div>
        </div>
      </main>
    </div>
  );
}
