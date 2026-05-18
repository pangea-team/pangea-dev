'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import OrderPurchaseDialog from '@/components/OrderPurchaseDialog';
import {
  FEED_CARD_IMAGE_SIZES,
  FEED_CARD_WIDTH,
  FEED_IMAGE_HEIGHT,
  MAX_FEED_IMAGES,
} from '@/lib/feed-card-layout';
import FeedDotActive from '@/public/icons/feed-dot-active.svg';
import FeedDotInactive from '@/public/icons/feed-dot-inactive.svg';
import OrderQuestIcon from '@/public/icons/orderquest.svg';
import type { FeedItem } from '@/types/feed';

const SLIDE_ALT_MAX_LEN = 60;

type Props = {
  feed: FeedItem;
  /** blob 미리보기 URL(순서는 feed.images 슬라이드와 동일). 지정 시 이미지 영역만 `<img>`로 렌더. */
  previewImageSrcs?: string[];
  /** 미리보기 등: 상단 타입/구매 버튼 줄 배경(선택 책 표지 톤) */
  headerBarBackgroundColor?: string;
};

function slideImageAlt(question: string, slideNumber: number, slideCount: number): string {
  const prefix =
    question.length > SLIDE_ALT_MAX_LEN ? `${question.slice(0, SLIDE_ALT_MAX_LEN)}…` : question;
  const base = prefix ? `피드 이미지: ${prefix}` : '피드 이미지';
  return slideCount > 1 ? `${base} (${slideNumber}/${slideCount})` : base;
}

export default function FeedCard({ feed, previewImageSrcs, headerBarBackgroundColor }: Props) {
  const previewUrls = previewImageSrcs
    ?.slice(0, MAX_FEED_IMAGES)
    .filter((u) => u.trim().length > 0);
  const useBlobPreview = Boolean(previewUrls && previewUrls.length > 0);

  const slides = useBlobPreview
    ? (previewUrls ?? []).map((url, i) => ({
        id: feed.images[i]?.id ?? `preview-${i}`,
        src: url,
      }))
    : feed.images.length > 0
      ? feed.images.slice(0, MAX_FEED_IMAGES)
      : [{ id: `${feed.id}-placeholder`, src: '' }];

  const [index, setIndex] = useState(0);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const slideIndex = Math.min(index, slides.length - 1);
  const src = slides[slideIndex]?.src?.trim();
  const showPager = slides.length > 1;
  const slideAlt = slideImageAlt(feed.question, slideIndex + 1, slides.length);

  return (
    <>
      <article className="relative flex h-feed-card-h w-feed-card-w shrink-0 flex-col bg-surface-50 shadow-card">
        <div
          className="flex h-[50px] items-center justify-between p-4"
          style={
            headerBarBackgroundColor ? { backgroundColor: headerBarBackgroundColor } : undefined
          }
        >
          <p className="text-noto-subtitle-2 text-black">{feed.type}</p>
          {feed.orderPurchasable ? (
            <button
              type="button"
              className={
                headerBarBackgroundColor
                  ? 'flex size-5 shrink-0 items-center justify-center rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary/40'
                  : 'flex size-5 shrink-0 items-center justify-center rounded-full outline-none ring-offset-2 ring-offset-surface-50 focus-visible:ring-2 focus-visible:ring-primary/40'
              }
              style={
                headerBarBackgroundColor
                  ? ({
                      '--tw-ring-offset-color': headerBarBackgroundColor,
                    } as CSSProperties)
                  : undefined
              }
              onClick={() => setIsPurchaseOpen(true)}
              aria-label="책 구매 요청"
            >
              <OrderQuestIcon width={20} height={20} className="size-5" aria-hidden />
            </button>
          ) : (
            <span
              className="size-5 shrink-0 rounded-full bg-purple3"
              aria-label="구매 불가"
              role="img"
            />
          )}
        </div>

        <div
          className="relative h-feed-image-h w-full shrink-0 overflow-hidden bg-feed-placeholder"
          aria-live="polite"
          aria-atomic="true"
        >
          {src ? (
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
              {useBlobPreview ? (
                /* biome-ignore lint/performance/noImgElement: draft blob: URL은 next/image 최적화와 함께 쓰지 않음 */
                <img src={src} alt={slideAlt} className="h-auto w-full" width={FEED_CARD_WIDTH} />
              ) : (
                <Image
                  src={src}
                  alt={slideAlt}
                  width={FEED_CARD_WIDTH}
                  height={FEED_IMAGE_HEIGHT}
                  className="h-auto w-full"
                  sizes={FEED_CARD_IMAGE_SIZES}
                />
              )}
            </div>
          ) : null}
          {showPager ? (
            <div className="pointer-events-auto absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className="flex size-2.5 items-center justify-center border-0 bg-transparent p-0 outline-none ring-offset-2 ring-offset-feed-placeholder focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={() => setIndex(i)}
                  aria-label={`이미지 ${i + 1}번 보기`}
                  aria-current={i === slideIndex ? 'true' : undefined}
                >
                  {i === slideIndex ? (
                    <FeedDotActive width={10} height={10} className="size-2.5" aria-hidden />
                  ) : (
                    <FeedDotInactive width={10} height={10} className="size-2.5" aria-hidden />
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end pt-2">
          <span className="text-pretendard-body-3 text-ink-100 px-2 py-1 whitespace-nowrap">
            {feed.date}
          </span>
          <span className="text-pretendard-body-3 text-ink-100 py-1 pl-1 pr-3 text-right whitespace-nowrap">
            {feed.status}
          </span>
        </div>

        <div className="pl-4 pr-5 pt-1">
          <p className="text-noto-subtitle-2 whitespace-normal">{feed.question}</p>
        </div>

        <div className="flex-1 overflow-hidden px-5 pt-4">
          <p className="text-noto-body-1 whitespace-normal text-left">{feed.answer}</p>
        </div>
      </article>

      <OrderPurchaseDialog open={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
    </>
  );
}
