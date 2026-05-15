import { notFound } from 'next/navigation';
import FeedPageShell from '@/app/feed/_components/FeedPageShell';
import { getYourFeedPageData } from '@/app/feed/_lib/get-your-feed-page-data';

type Props = {
  params: Promise<{ userId: string }>;
};

/** 다른 사람 피드 (목업). 내 피드는 `/feed`. */
export default async function OtherUserFeedPage({ params }: Props) {
  const { userId } = await params;
  const data = await getYourFeedPageData(userId);

  if (!data) {
    notFound();
  }

  return <FeedPageShell {...data} />;
}
