import type { ExploreFeedItem, ExploreUser } from '@/app/(with-header)/explore/_lib/types';
import { mockFeedImages } from '@/app/(with-header)/feed/_lib/mock-feed-images';
import { MOCK_HEADER_BAR_BACKGROUNDS } from '@/app/(with-header)/feed/_lib/mock-header-bar-backgrounds';
import type { FeedItem } from '@/app/(with-header)/feed/_lib/types';

const MOCK_IMAGE_COUNTS = [3, 1, 2, 1, 3, 2, 1, 3, 2, 1];

const MOCK_EXPLORE_USERS: ExploreUser[] = [
  {
    id: 'explore-u1',
    nickname: 'Michelle',
    profileRingSrc: '/icons/profile-ring.svg',
    avatarSrc: '/icons/profile-avatar.svg',
  },
  {
    id: 'explore-u2',
    nickname: 'Jay',
    profileRingSrc: '/icons/profile-ring.svg',
    avatarSrc: '/icons/profile-avatar.svg',
  },
  {
    id: 'explore-u3',
    nickname: 'Alex',
    profileRingSrc: '/icons/profile-ring.svg',
    avatarSrc: '/icons/profile-avatar.svg',
  },
];

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

const MOCK_ORDER_PURCHASABLE = [true, false, false, true, true, false, true, false, true, false];

/** 10개 피드, 작성자는 3명이 순환 — API 연동 시 교체 */
export const MOCK_EXPLORE_FEED_ITEMS: ExploreFeedItem[] = Array.from({ length: 10 }, (_, i) => ({
  user: MOCK_EXPLORE_USERS[i % MOCK_EXPLORE_USERS.length],
  feed: baseFeed(
    `explore-${i + 1}`,
    MOCK_ORDER_PURCHASABLE[i] ?? i % 2 === 0,
    MOCK_IMAGE_COUNTS[i] ?? 1,
    i,
  ),
}));
