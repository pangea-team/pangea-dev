import type { FeedItem, MyFeedProfile } from '@/app/feed/_lib/types';

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

/** Jay 프로필 — `/feed/jay` 등 모의 사용자 피드용 */
export const MOCK_YOUR_FEED_PROFILE_JAY: MyFeedProfile = {
  nickname: 'Jay',
  profileRingSrc: '/icons/profile-ring.svg',
  avatarSrc: '/icons/profile-avatar.svg',
};

export const MOCK_YOUR_FEED_ITEMS_JAY: FeedItem[] = Array.from({ length: 10 }, (_, i) =>
  baseFeed(`jay-${i + 1}`),
);
