import FeedPageShell from '@/app/(with-header)/feed/_components/FeedPageShell';
import { getMyFeedPageData } from '@/app/(with-header)/feed/_lib/get-my-feed-page-data';

export default async function MyFeedPage() {
  const data = await getMyFeedPageData();

  return <FeedPageShell {...data} showAddFeedCard />;
}
