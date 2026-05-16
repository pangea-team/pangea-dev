import Image from 'next/image';
import type { ExploreUser } from '@/app/(with-header)/explore/_lib/types';

type Props = {
  user: ExploreUser;
  showConnector: boolean;
};

const PROFILE_RING_PX = 72;
const PROFILE_AVATAR_INNER_PX = 44;

function isSvgSrc(src: string): boolean {
  return src.endsWith('.svg');
}

export default function ExploreProfileColumn({ user, showConnector }: Props) {
  return (
    <div className="flex h-full w-[72px] shrink-0 flex-col items-center gap-12">
      <span className="sr-only">{user.nickname}</span>
      <div className="relative size-[72px] shrink-0">
        {isSvgSrc(user.profileRingSrc) ? (
          // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
          <img
            src={user.profileRingSrc}
            alt=""
            width={PROFILE_RING_PX}
            height={PROFILE_RING_PX}
            className="size-[72px]"
          />
        ) : (
          <Image
            src={user.profileRingSrc}
            alt=""
            width={PROFILE_RING_PX}
            height={PROFILE_RING_PX}
            className="size-[72px]"
          />
        )}
        <div className="pointer-events-none absolute inset-[19%] flex items-center justify-center">
          {isSvgSrc(user.avatarSrc) ? (
            // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
            <img
              src={user.avatarSrc}
              alt=""
              width={PROFILE_AVATAR_INNER_PX}
              height={PROFILE_AVATAR_INNER_PX}
              className="object-contain"
            />
          ) : (
            <Image
              src={user.avatarSrc}
              alt=""
              width={PROFILE_AVATAR_INNER_PX}
              height={PROFILE_AVATAR_INNER_PX}
              className="object-contain"
            />
          )}
        </div>
      </div>
      {showConnector ? (
        <div className="mx-auto min-h-0 w-px flex-1 bg-lilac-300" aria-hidden />
      ) : null}
    </div>
  );
}
