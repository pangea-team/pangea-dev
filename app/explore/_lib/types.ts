import type { FeedItem } from '@/app/feed/_lib/types';

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
