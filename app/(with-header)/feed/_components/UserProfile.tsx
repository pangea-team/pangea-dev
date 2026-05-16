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
    <section className="bg-background w-full shrink-0 px-page-x">
      <div className="flex w-full min-w-0 flex-col gap-comp-sm py-section-sm md:flex-row md:items-end">
        <div className="flex min-w-0 flex-1 items-center gap-comp-sm">
          <div className="relative size-avatar-feed-sm shrink-0 md:size-avatar-feed-lg">
            {isSvgSrc(profileRingSrc) ? (
              // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
              <img
                src={profileRingSrc}
                alt=""
                width={PROFILE_RING_PX}
                height={PROFILE_RING_PX}
                className="size-full"
              />
            ) : (
              <Image
                src={profileRingSrc}
                alt=""
                width={PROFILE_RING_PX}
                height={PROFILE_RING_PX}
                className="size-full"
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
          <div className="min-w-0 flex-1 text-left">
            <p className="text-noto-profile-name">{nickname}</p>
          </div>
        </div>
        {children ? (
          <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
