import AddFeedCard from '@/app/(with-header)/feed/_components/AddFeedCard';
import UserProfile from '@/app/(with-header)/feed/_components/UserProfile';
import type { MyFeedPageData } from '@/app/(with-header)/feed/_lib/types';
import FeedCard from '@/components/FeedCard';

type Props = MyFeedPageData & {
  showAddFeedCard?: boolean;
};

export default function FeedPageShell({ profile, feeds, showAddFeedCard }: Props) {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col justify-between">
        <UserProfile {...profile}>{showAddFeedCard ? <AddFeedCard /> : null}</UserProfile>

        <section
          className="grid flex-1 grid-cols-1 justify-items-center gap-x-section-sm gap-y-comp-sm px-page-x pb-section-md md:grid-cols-2 md:justify-items-start lg:grid-cols-3"
          aria-label="피드"
        >
          {feeds.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              headerBarBackgroundColor={feed.headerBarBackgroundColor}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
