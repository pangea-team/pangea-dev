'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { FeedItem } from '@/app/feed/_lib/types';

const DOT_ACTIVE_SRC = '/icons/feed-dot-active.svg';
const DOT_INACTIVE_SRC = '/icons/feed-dot-inactive.svg';

const CARD_IMG_SIZES = '360px';

type Props = {
  feed: FeedItem;
};

export default function FeedCard({ feed }: Props) {
  const slides = feed.images.length > 0 ? feed.images : [{ id: `${feed.id}-placeholder`, src: '' }];

  const [index, setIndex] = useState(0);

  const src = slides[index]?.src?.trim();

  return (
    <article className="flex h-[600px] w-[360px] shrink-0 flex-col bg-surface-50 shadow-card">
      <div className="flex h-[50px] items-center p-4">
        <p className="text-noto-subtitle-2 text-primary">{feed.type}</p>
      </div>

      <div className="relative h-[252px] w-full shrink-0 overflow-hidden bg-feed-placeholder">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
          {src ? (
            <Image
              src={src}
              alt=""
              width={360}
              height={252}
              className="h-auto w-full"
              sizes={CARD_IMG_SIZES}
              style={{ width: '100%', height: 'auto' }}
            />
          ) : null}
        </div>
        <div className="pointer-events-auto absolute bottom-3.5 left-1/2 flex h-2.5 w-10 -translate-x-1/2 items-center justify-center gap-1">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className="flex size-2.5 items-center justify-center border-0 bg-transparent p-0"
              onClick={() => setIndex(i)}
              aria-label={`이미지 ${i + 1}번 보기`}
            >
              <Image
                src={i === index ? DOT_ACTIVE_SRC : DOT_INACTIVE_SRC}
                alt=""
                width={10}
                height={10}
                unoptimized
                className="size-2.5"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end pt-2">
        <span className="text-pretendard-label text-ink-100 px-2 py-1 whitespace-nowrap">
          {feed.date}
        </span>
        <span className="text-pretendard-label text-ink-100 py-1 pl-1 pr-3 text-right whitespace-nowrap">
          {feed.status}
        </span>
      </div>

      <div className="pl-4 pr-5 pt-1">
        <p className="text-noto-subtitle-2 text-primary whitespace-normal">{feed.question}</p>
      </div>

      <div className="flex-1 overflow-hidden px-5 pt-4">
        <p className="text-noto-body-1 text-primary whitespace-normal text-left">{feed.answer}</p>
      </div>
    </article>
  );
}
