import type { ExploreFeedItem, ExploreUser } from '@/app/explore/_lib/types';
import type { FeedItem } from '@/app/feed/_lib/types';

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

const baseFeed = (id: string): FeedItem => ({
  id,
  type: 'WONDER NOTE',
  images: [
    { id: `${id}-slide-a`, src: '' },
    { id: `${id}-slide-b`, src: '' },
    { id: `${id}-slide-c`, src: '' },
  ],
  date: '2026.05.02.',
  status: '게시',
  question: `내가 선택한 질문 (${id})`,
  answer: '답변이 들어갑니다.',
});

/** 10개 피드, 작성자는 3명이 순환 — API 연동 시 교체 */
export const MOCK_EXPLORE_FEED_ITEMS: ExploreFeedItem[] = Array.from({ length: 10 }, (_, i) => ({
  user: MOCK_EXPLORE_USERS[i % MOCK_EXPLORE_USERS.length],
  feed: baseFeed(`explore-${i + 1}`),
}));
