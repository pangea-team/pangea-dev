import ExploreProfileColumn from '@/app/(with-header)/explore/_components/ExploreProfileColumn';
import { getExplorePageData } from '@/app/(with-header)/explore/_lib/get-explore-page-data';
import FeedCard from '@/components/FeedCard';

export default async function ExplorePage() {
  const items = await getExplorePageData();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-layout-explore flex-1 flex-col px-page-x pb-section-md pt-section-sm">
        <section className="flex flex-col gap-section-sm" aria-label="피드 탐색">
          {items.map((item, index) => {
            const showConnector = index < items.length - 1;
            return (
              <div key={item.feed.id} className="flex w-full justify-center">
                <div className="flex w-full flex-col items-center md:flex-row md:items-stretch md:justify-center md:gap-x-section-sm">
                  <div className="hidden justify-center md:flex md:h-full md:shrink-0 md:self-stretch">
                    <ExploreProfileColumn user={item.user} showConnector={showConnector} />
                  </div>
                  <div
                    className={`w-full max-w-feed-card-w shrink-0${showConnector ? ' md:pb-section-sm' : ''}`}
                  >
                    <FeedCard
                      feed={item.feed}
                      headerBarBackgroundColor={item.feed.headerBarBackgroundColor}
                      headerAvatar={{
                        profileRingSrc: item.user.profileRingSrc,
                        avatarSrc: item.user.avatarSrc,
                        nickname: item.user.nickname,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
