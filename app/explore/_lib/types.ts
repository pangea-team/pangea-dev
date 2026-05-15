import type { FeedItem } from '@/types/feed';

export type ExploreUser = {
  id: string;
  nickname: string;
  profileRingSrc: string;
  avatarSrc: string;
};

export type ExploreFeedItem = {
  user: ExploreUser;
  feed: FeedItem;
};
