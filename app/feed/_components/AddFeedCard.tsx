import Image from 'next/image';
import Link from 'next/link';

const ADD_FEED_BUTTON_SRC = '/icons/feed-add-button.svg';

export default function AddFeedCard() {
  return (
    <div className="flex h-[600px] w-[360px] shrink-0 flex-col items-center justify-center bg-surface-50 shadow-card transition-shadow duration-200 ease-out has-[a:hover]:shadow-[3px_3px_10px_rgba(0,0,0,0.32)]">
      <Link
        href="/feed/edit"
        className="flex items-center justify-center outline-none ring-offset-2 ring-offset-surface-50 focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label="피드 추가하기"
      >
        <Image src={ADD_FEED_BUTTON_SRC} alt="" width={88} height={88} unoptimized priority />
      </Link>
    </div>
  );
}
