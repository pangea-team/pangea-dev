import FeedUploadPreviewClient from '@/app/(with-header)/feed/upload/_components/FeedUploadPreviewClient';

export default function FeedUploadPreviewPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-page-x pb-section-md">
        <div className="mt-section-sm flex shrink-0 flex-col gap-2">
          <h1 className="text-noto-heading-1">미리보기 · 질문과 답변</h1>
          <p className="text-noto-subtitle-2">
            책과 질문을 고르고 답을 작성하면 오른쪽에서 카드처럼 보입니다.
          </p>
        </div>
        <div className="flex flex-1 flex-col items-stretch pt-section-sm">
          <FeedUploadPreviewClient />
        </div>
      </div>
    </main>
  );
}
