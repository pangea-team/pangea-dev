import { mockFeedImages } from '@/app/feed/_lib/mock-feed-images';
import { MOCK_HEADER_BAR_BACKGROUNDS } from '@/app/feed/_lib/mock-header-bar-backgrounds';
import type { FeedItem } from '@/app/feed/_lib/types';

const MOCK_IMAGE_COUNTS = [1, 2, 3, 1, 3, 2, 1, 2, 3, 2];

const baseFeed = (
  id: string,
  orderPurchasable: boolean,
  imageCount: number,
  colorIndex: number,
): FeedItem => ({
  id,
  images: mockFeedImages(id, imageCount),
  date: '2026.05.02.',
  status: '게시',
  question: `내가 선택한 질문 (${id})`,
  answer: '답변이 들어갑니다.',
  orderPurchasable,
  headerBarBackgroundColor:
    MOCK_HEADER_BAR_BACKGROUNDS[colorIndex % MOCK_HEADER_BAR_BACKGROUNDS.length],
});

/** 목업마다 구매 가능 여부를 섞어 둔다 */
const MOCK_ORDER_PURCHASABLE = [true, true, false, true, false, false, true, false, true, false];

export const MOCK_FEEDS: FeedItem[] = Array.from({ length: 10 }, (_, i) =>
  baseFeed(String(i + 1), MOCK_ORDER_PURCHASABLE[i] ?? i % 2 === 0, MOCK_IMAGE_COUNTS[i] ?? 1, i),
);
