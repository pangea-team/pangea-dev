import { MOCK_EXPLORE_FEED_ITEMS } from '@/app/(with-header)/explore/_lib/mock-explore-feeds';
import type { ExploreFeedItem } from '@/app/(with-header)/explore/_lib/types';

/**
 * 피드 탐색 목록. 지금은 mock; API 연동 시 fetch + 매핑만 이 안에서 교체.
 */
export async function getExplorePageData(): Promise<ExploreFeedItem[]> {
  return MOCK_EXPLORE_FEED_ITEMS;
}
