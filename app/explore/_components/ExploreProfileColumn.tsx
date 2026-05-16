import type { ExploreUser } from '@/app/explore/_lib/types';
import ProfileRingAvatar from '@/components/ProfileRingAvatar';

type Props = {
  user: ExploreUser;
  showConnector: boolean;
};

export default function ExploreProfileColumn({ user, showConnector }: Props) {
  return (
    <div
      className={`relative flex h-auto w-avatar-explore shrink-0 flex-col items-center gap-comp-sm md:h-full md:gap-0${showConnector ? ' md:pb-section-sm' : ''}`}
    >
      <ProfileRingAvatar
        profileRingSrc={user.profileRingSrc}
        avatarSrc={user.avatarSrc}
        nickname={user.nickname}
        size="explore"
      />
      {showConnector ? (
        <div
          className="absolute top-[calc(var(--spacing-avatar-explore)+var(--spacing-section-sm))] bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-lilac-300 md:block"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
