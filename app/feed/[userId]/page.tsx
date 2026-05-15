import { notFound } from 'next/navigation';
import UserProfile from '@/app/feed/_components/UserProfile';
import { getYourFeedPageData } from '@/app/feed/[userId]/_lib/get-your-feed-page-data';
import FeedCard from '@/components/FeedCard';
import Header from '@/components/Header';

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function YourFeedPage({ params }: Props) {
  const { userId } = await params;
  const data = await getYourFeedPageData(userId);

  if (!data) {
    notFound();
  }

  const { profile, feeds } = data;

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col">
          <UserProfile {...profile} />
          <section
            className="grid flex-1 grid-cols-3 justify-items-start gap-x-section-sm gap-y-comp-sm px-page-x pb-section-md"
            aria-label="피드"
          >
            {feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
