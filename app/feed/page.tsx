import FeedPageShell from '@/app/feed/_components/FeedPageShell';
import { getMyFeedPageData } from '@/app/feed/_lib/get-my-feed-page-data';

export default async function MyFeedPage() {
  const data = await getMyFeedPageData();

  return <FeedPageShell {...data} showAddFeedCard />;
}
