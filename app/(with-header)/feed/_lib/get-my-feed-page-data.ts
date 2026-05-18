// import { MOCK_FEEDS } from '@/app/(with-header)/feed/_lib/mock-feeds';
import { getFeeds } from '@/app/(with-header)/feed/_lib/get-feeds';
import type { MyFeedPageData } from '@/app/(with-header)/feed/_lib/types';
import { getUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import type { FeedImageSlide, FeedItem } from '@/types/feed';

function formatFeedDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}.`;
}

export async function getMyFeedPageData(): Promise<MyFeedPageData> {
  const claims = await getUser();
  const userId = claims?.sub as string | undefined;

  if (!userId) {
    return {
      profile: {
        nickname: '',
        profileSrc: '/images/profile_1.webp',
      },
      feeds: [],
    };
  }

  const supabase = await createClient();
  const [{ data: userData }, feeds] = await Promise.all([
    supabase.from('users').select('name').eq('id', userId).single(),
    getFeeds(userId),
  ]);

  const mappedFeeds: FeedItem[] = (feeds ?? []).map((feed) => {
    const images: FeedImageSlide[] = (feed.images ?? []).map((url, i) => ({
      id: `${feed.id}-${i}`,
      src: url,
    }));

    return {
      id: feed.id,
      type: 'WONDER NOTE',
      images,
      date: formatFeedDate(feed.created_at),
      status: '게시',
      question: feed.questions?.content ?? '',
      answer: feed.answer,
      orderPurchasable: false,
      headerBarBackgroundColor: feed.books?.cover_color ?? undefined,
    };
  });

  return {
    profile: {
      nickname: userData?.name ?? '',
      profileSrc: '/images/profile_1.webp',
    },
    feeds: mappedFeeds,
  };
}
