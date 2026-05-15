import Image from 'next/image';
import type { ExploreUser } from '@/app/explore/_lib/types';

type Props = {
  user: ExploreUser;
  showConnector: boolean;
};

const PROFILE_RING_PX = 72;
const PROFILE_AVATAR_INNER_PX = 44;

export default function ExploreProfileColumn({ user, showConnector }: Props) {
  return (
    <div className="flex h-full w-[72px] shrink-0 flex-col items-center gap-12">
      <span className="sr-only">{user.nickname}</span>
      <div className="relative size-[72px] shrink-0">
        <Image
          src={user.profileRingSrc}
          alt=""
          width={PROFILE_RING_PX}
          height={PROFILE_RING_PX}
          className="size-[72px]"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-[19%] flex items-center justify-center">
          <Image
            src={user.avatarSrc}
            alt=""
            width={PROFILE_AVATAR_INNER_PX}
            height={PROFILE_AVATAR_INNER_PX}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
      {showConnector ? (
        <div className="mx-auto min-h-0 w-px flex-1 bg-lilac-300" aria-hidden />
      ) : null}
    </div>
  );
}
