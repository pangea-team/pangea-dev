import Image from 'next/image';
import type { ReactNode } from 'react';
import type { MyFeedProfile } from '@/app/(with-header)/feed/_lib/types';

type Props = MyFeedProfile & {
  children?: ReactNode;
};

const PROFILE_RING_PX = 120;
const PROFILE_AVATAR_INNER_PX = 74;

function isSvgSrc(src: string): boolean {
  return src.endsWith('.svg');
}

export default function UserProfile({ nickname, profileRingSrc, avatarSrc, children }: Props) {
  return (
    <section className="bg-background w-full shrink-0">
      <div className="flex w-full min-w-0 items-center gap-comp-sm px-page-x py-section-sm">
        <div className="relative size-12 shrink-0 md:size-30">
          {isSvgSrc(profileRingSrc) ? (
            // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
            <img
              src={profileRingSrc}
              alt=""
              width={PROFILE_RING_PX}
              height={PROFILE_RING_PX}
              className="size-12 md:size-25"
            />
          ) : (
            <Image
              src={profileRingSrc}
              alt=""
              width={PROFILE_RING_PX}
              height={PROFILE_RING_PX}
              className="size-12 md:size-25"
              priority
            />
          )}
          <div className="pointer-events-none absolute inset-[19%] flex items-center justify-center">
            {isSvgSrc(avatarSrc) ? (
              // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
              <img
                src={avatarSrc}
                alt=""
                width={PROFILE_AVATAR_INNER_PX}
                height={PROFILE_AVATAR_INNER_PX}
                className="object-contain"
              />
            ) : (
              <Image
                src={avatarSrc}
                alt=""
                width={PROFILE_AVATAR_INNER_PX}
                height={PROFILE_AVATAR_INNER_PX}
                className="object-contain"
              />
            )}
          </div>
        </div>
        <p className="text-noto-title-2 min-w-0 flex-1 truncate md:text-noto-title-1">{nickname}</p>
        {children}
      </div>
    </section>
  );
}
