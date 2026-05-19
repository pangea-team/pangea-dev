'use client';

import type { FeedUploadDraftImage } from '@/app/(with-header)/feed/upload/_lib/types';
import { MAX_FEED_IMAGES } from '@/lib/feed-card-layout';

type Props = {
  images: FeedUploadDraftImage[];
  bookTitle: string;
  bookAuthor: string;
  onOpenCrop: () => void;
  onRemove: (id: string) => void;
};

export default function StepImageUpload({
  images,
  bookTitle,
  bookAuthor,
  onOpenCrop,
  onRemove,
}: Props) {
  const canAddMore = images.length < MAX_FEED_IMAGES;

  return (
    <div className="flex flex-col gap-section-sm">
      <div className="flex flex-col gap-1">
        <p className="text-noto-subtitle-2 pb-2 text-purple2">
          [{bookTitle}]{bookAuthor ? ` - ${bookAuthor}` : ''}
        </p>
        <h2 className="text-noto-subtitle-1">당신이 머물렀던 페이지를 올려주세요.</h2>
        <p className="text-pretendard-body-2 whitespace-pre-line text-primary/60">
          {'밑줄과 메모, 오래 바라본 문장들.\n나누고 싶은 부분이 잘 보이게 올려주세요.'}
        </p>
      </div>

      <div className="flex flex-col gap-comp-sm">
        {images.length > 0 ? (
          <ul className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <li
                key={image.id}
                className="relative h-[126px] w-[180px] shrink-0 overflow-hidden bg-feed-placeholder"
              >
                {/* biome-ignore lint/performance/noImgElement: blob 미리보기 */}
                <img
                  src={image.previewUrl}
                  alt={`선택한 이미지 ${index + 1}`}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-primary/80 text-pretendard-caption text-surface-50"
                  aria-label={`이미지 ${index + 1} 삭제`}
                  onClick={() => onRemove(image.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {canAddMore ? (
          <button
            type="button"
            onClick={onOpenCrop}
            className="flex h-[64px] w-full items-center justify-center gap-2 rounded-md border border-dashed border-primary/30 bg-feed-placeholder/50 text-pretendard-body-2 text-primary/60 outline-none transition-colors hover:border-primary/50 hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50"
          >
            + 이미지 추가 ({images.length}/{MAX_FEED_IMAGES})
          </button>
        ) : null}

        <p className="text-pretendard-caption text-primary/40">
          최대 3장까지 업로드 가능합니다. <br />
          개인정보가 포함된 이미지는 업로드할 수 없습니다.
        </p>
      </div>
    </div>
  );
}
