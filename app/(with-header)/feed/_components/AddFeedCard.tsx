import Link from 'next/link';
import { PATH } from '@/constants/path';
import FeedAddButton from '@/public/icons/feed-add-button.svg';

export default function AddFeedCard() {
  return (
    <div className="flex h-feed-card-h w-feed-card-w shrink-0 flex-col items-center justify-center bg-surface-50 shadow-card transition-shadow duration-200 ease-out has-[a:hover]:shadow-card">
      <Link
        href={PATH.FEED_UPLOAD}
        className="flex h-full w-full items-center justify-center outline-none ring-offset-2 ring-offset-surface-50 focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label="피드 추가하기"
      >
        <FeedAddButton width={88} height={88} className="shrink-0" aria-hidden />
      </Link>
    </div>
  );
}
