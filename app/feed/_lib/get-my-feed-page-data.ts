import { MOCK_FEEDS } from '@/app/feed/_lib/mock-feeds';
import type { MyFeedPageData, MyFeedProfile } from '@/app/feed/_lib/types';

const MOCK_PROFILE: MyFeedProfile = {
  nickname: 'Michelle',
  profileRingSrc: '/icons/profile-ring.svg',
  avatarSrc: '/icons/profile-avatar.svg',
};

/**
 * 내 피드 페이지 데이터. 지금은 mock; API 연동 시 fetch + `mapApiToMyFeedPageData` 등만 이 안에서 교체.
 */
export async function getMyFeedPageData(): Promise<MyFeedPageData> {
  return {
    profile: MOCK_PROFILE,
    feeds: MOCK_FEEDS,
  };
}
