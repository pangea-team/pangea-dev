import Image from 'next/image';
import type { ReactNode } from 'react';
import type { MyFeedProfile } from '@/app/(with-header)/feed/_lib/types';

type Props = MyFeedProfile & {
  children?: ReactNode;
};

export default function UserProfile({ nickname, profileSrc, children }: Props) {
  return (
    <section className="bg-background w-full shrink-0">
      <div className="flex w-full min-w-0 items-center gap-comp-sm px-page-x py-section-sm">
        <div className="relative size-12 shrink-0 md:size-30">
          <Image src={profileSrc} alt="" fill className="object-contain" priority />
        </div>
        <p className="text-noto-title-2 min-w-0 flex-1 truncate md:text-noto-title-1">{nickname}</p>
        {children}
      </div>
    </section>
  );
}
