import ExploreProfileColumn from '@/app/explore/_components/ExploreProfileColumn';
import { getExplorePageData } from '@/app/explore/_lib/get-explore-page-data';
import FeedCard from '@/components/FeedCard';
import Header from '@/components/Header';

export default async function ExplorePage() {
  const items = await getExplorePageData();

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col px-page-x pb-section-md pt-section-sm">
          <section className="flex flex-col gap-y-12" aria-label="피드 탐색">
            {items.map((item, index) => {
              const showConnector = index < items.length - 1;
              return (
                <div key={item.feed.id} className="flex justify-center">
                  <div
                    className={`relative flex shrink-0 items-start ${showConnector ? 'h-feed-explore-row-h' : 'h-feed-card-h'}`}
                  >
                    <div className="absolute inset-y-0 right-full flex h-full pr-section-sm">
                      <ExploreProfileColumn user={item.user} showConnector={showConnector} />
                    </div>
                    <FeedCard
                      feed={item.feed}
                      headerBarBackgroundColor={item.feed.headerBarBackgroundColor}
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}
