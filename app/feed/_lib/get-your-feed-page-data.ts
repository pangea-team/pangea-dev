import {
  MOCK_YOUR_FEED_ITEMS_JAY,
  MOCK_YOUR_FEED_PROFILE_JAY,
} from '@/app/feed/_lib/mock-your-feed-data';
import type { MyFeedPageData } from '@/app/feed/_lib/types';

/**
 * 다른 사람 피드 페이지 데이터. 지금은 mock; API 연동 시 fetch + 매핑만 이 안에서 교체.
 */
export async function getYourFeedPageData(userId: string): Promise<MyFeedPageData | null> {
  if (userId === 'jay') {
    return {
      profile: MOCK_YOUR_FEED_PROFILE_JAY,
      feeds: MOCK_YOUR_FEED_ITEMS_JAY,
    };
  }

  return null;
}
