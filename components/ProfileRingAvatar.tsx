import Image from 'next/image';

type Size = 'explore' | 'card-header';

/** explore 사이드(72×44) 기준 — 링·안쪽 아바타 비율은 size와 무관하게 동일 */
const RING_PX_EXPLORE = 72;
const INNER_PX_EXPLORE = 44;
const RING_TO_INNER_RATIO = INNER_PX_EXPLORE / RING_PX_EXPLORE;

const SIZE: Record<Size, { ringPx: number; className: string }> = {
  explore: { ringPx: RING_PX_EXPLORE, className: 'size-avatar-explore' },
  'card-header': { ringPx: 44, className: 'size-avatar-card-header' },
};

function innerPx(ringPx: number): number {
  return Math.round(ringPx * RING_TO_INNER_RATIO);
}

type Props = {
  profileRingSrc: string;
  avatarSrc: string;
  nickname: string;
  size?: Size;
  className?: string;
};

function isSvgSrc(src: string): boolean {
  return src.endsWith('.svg');
}

export default function ProfileRingAvatar({
  profileRingSrc,
  avatarSrc,
  nickname,
  size = 'explore',
  className = '',
}: Props) {
  const { ringPx, className: sizeClass } = SIZE[size];
  const inner = innerPx(ringPx);

  return (
    <div className={`relative shrink-0 ${sizeClass} ${className}`.trim()}>
      <span className="sr-only">{nickname}</span>
      {isSvgSrc(profileRingSrc) ? (
        // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
        <img src={profileRingSrc} alt="" width={ringPx} height={ringPx} className="size-full" />
      ) : (
        <Image src={profileRingSrc} alt="" width={ringPx} height={ringPx} className="size-full" />
      )}
      <div className="pointer-events-none absolute inset-[19%] flex items-center justify-center">
        {isSvgSrc(avatarSrc) ? (
          // biome-ignore lint/performance/noImgElement: 목업 프로필 SVG — next/image는 SVG 기본 비허용
          <img src={avatarSrc} alt="" width={inner} height={inner} className="object-contain" />
        ) : (
          <Image src={avatarSrc} alt="" width={inner} height={inner} className="object-contain" />
        )}
      </div>
    </div>
  );
}
