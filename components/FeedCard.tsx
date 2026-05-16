'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useState } from 'react';
import OrderPurchaseDialog from '@/components/OrderPurchaseDialog';
import ProfileRingAvatar from '@/components/ProfileRingAvatar';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  FEED_CARD_IMAGE_SIZES,
  FEED_CARD_TYPE_LABEL,
  FEED_CARD_WIDTH,
  FEED_IMAGE_HEIGHT,
  MAX_FEED_IMAGES,
} from '@/lib/feed-card-layout';
import FeedDotActive from '@/public/icons/feed-dot-active.svg';
import FeedDotInactive from '@/public/icons/feed-dot-inactive.svg';
import OrderQuestIcon from '@/public/icons/orderquest.svg';
import type { FeedItem } from '@/types/feed';

export type FeedCardHeaderAvatar = {
  profileRingSrc: string;
  avatarSrc: string;
  nickname: string;
};

const SLIDE_ALT_MAX_LEN = 60;

const CAROUSEL_ARROW_CLASS =
  'top-auto bottom-3.5 z-10 size-5 translate-y-0 border-0 bg-surface-0/40 shadow-card hover:bg-surface-0/55 focus-visible:ring-primary/40 [&_svg]:size-3';

type Slide = {
  id: string;
  src: string;
};

type Props = {
  feed: FeedItem;
  /** blob 미리보기 URL(순서는 feed.images 슬라이드와 동일). 지정 시 이미지 영역만 `<img>`로 렌더. */
  previewImageSrcs?: string[];
  /** 미리보기 등: 상단 타입/구매 버튼 줄 배경(선택 책 표지 톤) */
  headerBarBackgroundColor?: string;
  /** md 미만에서 TRACE CARD 왼쪽 인라인 아바타 (explore 등) */
  headerAvatar?: FeedCardHeaderAvatar;
};

function slideImageAlt(question: string, slideNumber: number, slideCount: number): string {
  const prefix =
    question.length > SLIDE_ALT_MAX_LEN ? `${question.slice(0, SLIDE_ALT_MAX_LEN)}…` : question;
  const base = prefix ? `피드 이미지: ${prefix}` : '피드 이미지';
  return slideCount > 1 ? `${base} (${slideNumber}/${slideCount})` : base;
}

function FeedCardSlideImage({
  slide,
  slideAlt,
  useBlobPreview,
}: {
  slide: Slide;
  slideAlt: string;
  useBlobPreview: boolean;
}) {
  const src = slide.src.trim();
  if (!src) return null;

  return (
    <div className="flex w-full items-center justify-center">
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
          draggable={false}
        />
      )}
    </div>
  );
}

export default function FeedCard({
  feed,
  previewImageSrcs,
  headerBarBackgroundColor,
  headerAvatar,
}: Props) {
  const previewUrls = previewImageSrcs
    ?.slice(0, MAX_FEED_IMAGES)
    .filter((u) => u.trim().length > 0);
  const useBlobPreview = Boolean(previewUrls && previewUrls.length > 0);

  const slides: Slide[] = useBlobPreview
    ? (previewUrls ?? []).map((url, i) => ({
        id: feed.images[i]?.id ?? `preview-${i}`,
        src: url,
      }))
    : feed.images.length > 0
      ? feed.images.slice(0, MAX_FEED_IMAGES)
      : [{ id: `${feed.id}-placeholder`, src: '' }];

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const isUploadPreview = useBlobPreview;
  const showPager = slides.length > 1;
  const singleSlide = slides[0];
  const singleSrc = singleSlide?.src?.trim();
  const singleAlt = slideImageAlt(feed.question, 1, 1);

  const cardGridRows = isUploadPreview
    ? 'grid-rows-[50px_252px_minmax(0,1fr)]'
    : 'grid-rows-[50px_42%_minmax(0,1fr)]';

  const onCarouselSelect = useCallback((api: CarouselApi | undefined) => {
    if (!api) return;
    setSlideIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    onCarouselSelect(carouselApi);
    carouselApi.on('select', onCarouselSelect);
    carouselApi.on('reInit', onCarouselSelect);
    return () => {
      carouselApi.off('select', onCarouselSelect);
      carouselApi.off('reInit', onCarouselSelect);
    };
  }, [carouselApi, onCarouselSelect]);

  return (
    <>
      <article
        className={`relative grid aspect-3/5 w-full max-w-feed-card-w shrink-0 overflow-hidden bg-surface-50 shadow-card ${cardGridRows}`}
      >
        <div
          className="flex items-center justify-between p-4"
          style={
            headerBarBackgroundColor ? { backgroundColor: headerBarBackgroundColor } : undefined
          }
        >
          <div className="flex min-w-0 items-center gap-2">
            {headerAvatar ? (
              <ProfileRingAvatar
                profileRingSrc={headerAvatar.profileRingSrc}
                avatarSrc={headerAvatar.avatarSrc}
                nickname={headerAvatar.nickname}
                size="card-header"
                className="md:hidden"
              />
            ) : null}
            <p className="text-noto-subtitle-2 text-black">{FEED_CARD_TYPE_LABEL}</p>
          </div>
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
          className="relative flex min-h-0 w-full items-center justify-center overflow-hidden bg-feed-placeholder"
          aria-live="polite"
          aria-atomic="true"
        >
          {showPager ? (
            <Carousel className="h-full w-full" opts={{ loop: false }} setApi={setCarouselApi}>
              <CarouselContent className="ml-0 h-full items-center">
                {slides.map((slide, i) => (
                  <CarouselItem
                    key={slide.id}
                    className="flex h-full basis-full items-center justify-center pl-0"
                  >
                    <FeedCardSlideImage
                      slide={slide}
                      slideAlt={slideImageAlt(feed.question, i + 1, slides.length)}
                      useBlobPreview={useBlobPreview}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {slideIndex > 0 ? (
                <CarouselPrevious
                  variant="outline"
                  size="icon-sm"
                  className={`${CAROUSEL_ARROW_CLASS} left-2`}
                  aria-label="이전 이미지"
                />
              ) : null}
              {slideIndex < slides.length - 1 ? (
                <CarouselNext
                  variant="outline"
                  size="icon-sm"
                  className={`${CAROUSEL_ARROW_CLASS} right-2`}
                  aria-label="다음 이미지"
                />
              ) : null}
              <div className="pointer-events-auto absolute bottom-3.5 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-1">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    className="flex size-2.5 items-center justify-center border-0 bg-transparent p-0 outline-none ring-offset-2 ring-offset-feed-placeholder focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={() => carouselApi?.scrollTo(i)}
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
            </Carousel>
          ) : singleSrc ? (
            <FeedCardSlideImage
              slide={singleSlide}
              slideAlt={singleAlt}
              useBlobPreview={useBlobPreview}
            />
          ) : null}
        </div>

        <div className="grid min-h-0 grid-rows-[auto_auto_1fr] overflow-hidden">
          <div className="flex items-center justify-end pt-2">
            <span className="text-pretendard-label text-ink-100 px-2 py-1 whitespace-nowrap">
              {feed.date}
            </span>
            <span className="text-pretendard-label text-ink-100 py-1 pl-1 pr-3 text-right whitespace-nowrap">
              {feed.status}
            </span>
          </div>

          <div className="pl-4 pr-5 pt-1">
            <p className="text-noto-subtitle-2 overflow-hidden">{feed.question}</p>
          </div>

          <div className="min-h-0 overflow-hidden px-5 pt-4 pb-5">
            <p className="text-noto-body-1 text-left">{feed.answer}</p>
          </div>
        </div>
      </article>

      <OrderPurchaseDialog open={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
    </>
  );
}
