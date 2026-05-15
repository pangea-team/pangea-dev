import Image from 'next/image';
import type { ReactNode } from 'react';
import type { MyFeedProfile } from '@/app/feed/_lib/types';

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
      <div className="flex w-full min-w-0 items-end gap-comp-sm py-section-sm">
        <div className="flex min-w-0 flex-1 items-center gap-comp-sm">
          <div className="relative size-30 shrink-0">
            {isSvgSrc(profileRingSrc) ? (
              // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
              <img
                src={profileRingSrc}
                alt=""
                width={PROFILE_RING_PX}
                height={PROFILE_RING_PX}
                className="size-30"
              />
            ) : (
              <Image
                src={profileRingSrc}
                alt=""
                width={PROFILE_RING_PX}
                height={PROFILE_RING_PX}
                className="size-30"
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
            <p className="text-noto-heading-1 wrap-break-word">{nickname}</p>
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch">{children}</div>
      </div>
    </section>
  );
}
