import { getBooksWithQuestions } from '@/app/(with-header)/feed/_lib/get-feeds';
import FeedUploadPreviewClient from '@/app/(with-header)/feed/upload/_components/FeedUploadPreviewClient';

export default async function FeedUploadPreviewPage() {
  const books = await getBooksWithQuestions();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-page-x pb-section-md">
        <div className="mt-section-sm flex shrink-0 flex-col gap-2">
          <h1 className="text-noto-heading-1">Left trace</h1>
          <p className="text-noto-subtitle-2">당신의 흔적을 기록하면, 누군가 그것을 읽게 됩니다.</p>
        </div>
        <div className="flex flex-1 flex-col items-stretch pt-section-sm">
          <FeedUploadPreviewClient books={books ?? []} />
        </div>
      </div>
    </main>
  );
}
