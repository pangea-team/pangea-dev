import { mockFeedImages } from '@/app/(with-header)/feed/_lib/mock-feed-images';
import { MOCK_HEADER_BAR_BACKGROUNDS } from '@/app/(with-header)/feed/_lib/mock-header-bar-backgrounds';
import type { FeedItem, MyFeedProfile } from '@/app/(with-header)/feed/_lib/types';

const MOCK_IMAGE_COUNTS = [2, 1, 3, 2, 1, 3, 1, 2, 3, 1];

const baseFeed = (
  id: string,
  orderPurchasable: boolean,
  imageCount: number,
  colorIndex: number,
): FeedItem => ({
  id,
  type: 'WONDER NOTE',
  images: mockFeedImages(id, imageCount),
  date: '2026.05.02.',
  status: '게시',
  question: `내가 선택한 질문 (${id})`,
  answer: '답변이 들어갑니다.',
  orderPurchasable,
  headerBarBackgroundColor:
    MOCK_HEADER_BAR_BACKGROUNDS[colorIndex % MOCK_HEADER_BAR_BACKGROUNDS.length],
});

const MOCK_ORDER_PURCHASABLE = [false, true, true, false, true, false, true, true, false, true];

/** 타인 피드 목업 — `/feed/jay` 등 */
export const MOCK_YOUR_FEED_PROFILE_JAY: MyFeedProfile = {
  nickname: 'Jay',
  profileSrc: '/images/profile_1.webp',
};

export const MOCK_YOUR_FEED_ITEMS_JAY: FeedItem[] = Array.from({ length: 10 }, (_, i) =>
  baseFeed(`jay-${i + 1}`, MOCK_ORDER_PURCHASABLE[i] ?? i % 3 !== 1, MOCK_IMAGE_COUNTS[i] ?? 1, i),
);
