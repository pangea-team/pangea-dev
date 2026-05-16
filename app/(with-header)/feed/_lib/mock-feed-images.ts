import type { FeedImageSlide } from '@/types/feed';

/** 피드 카드 슬라이드 목업 — API 연동 전에는 src 비움(회색 placeholder만 표시) */
export function mockFeedImages(id: string, count: number): FeedImageSlide[] {
  return Array.from({ length: count }, (_, j) => ({
    id: `${id}-slide-${j}`,
    src: '',
  }));
}
