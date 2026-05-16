import AddFeedCard from '@/app/feed/_components/AddFeedCard';
import UserProfile from '@/app/feed/_components/UserProfile';
import type { MyFeedPageData } from '@/app/feed/_lib/types';
import FeedCard from '@/components/FeedCard';
import Header from '@/components/Header';

type Props = MyFeedPageData & {
  showAddFeedCard?: boolean;
};

export default function FeedPageShell({ profile, feeds, showAddFeedCard }: Props) {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex min-h-0 w-full max-w-layout-feed flex-1 flex-col">
          <UserProfile {...profile} />
          <section
            className="grid flex-1 grid-cols-1 justify-items-center gap-x-comp-sm gap-y-comp-sm px-page-x pb-section-md md:grid-cols-2 md:justify-items-start md:gap-x-section-sm xl:grid-cols-3"
            aria-label="피드"
          >
            {showAddFeedCard ? <AddFeedCard /> : null}
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
    </div>
  );
}
