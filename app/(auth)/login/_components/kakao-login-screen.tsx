import Link from 'next/link';

import { cn } from '@/lib/cn';

type Props = {
  className?: string;
};

/** 카카오 말풍선 심볼 실루엣 (viewBox 0 0 256 256). 기하만 사용, 채움은 currentColor. */
const KAKAO_BUBBLE_PATH =
  'M128 36C70.56 36 24 72.71 24 118c0 29.28 19.47 54.97 48.75 69.48-1.6 5.5-10.24 35.34-10.58 37.69 0 0-.21 1.76.93 2.43s2.48.15 2.48.15c3.28-.46 37.95-24.81 43.95-29.04 6 .85 12.17 1.29 18.47 1.29 57.44 0 104-36.71 104-82s-46.56-82-104-82z';

/**
 * 카카오 로그인 버튼 — 디자인 가이드(컨테이너·심볼·레이블 색, 12px radius, 완성형 문구).
 * 래스터 확대 시 깨짐을 피하려고 SVG 심볼 + 텍스트로 구성합니다.
 *
 * @see https://developers.kakao.com/docs/ko/kakaologin/design-guide
 */
export default function KakaoLoginScreen({ className }: Props) {
  return (
    <main
      className={cn(
        'relative flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 py-16',
        className,
      )}
    >
      <h1 className="text-center text-cormorant-display-2 tracking-[8.4px] text-primary">PANGEA</h1>

      <div className="mt-[76px] text-center tracking-[1.8px] text-primary">
        <p className="text-noto-subtitle-2">이 세계에는</p>
        <p className="text-noto-subtitle-2">당신을 읽는 사람이 있습니다.</p>
      </div>

      <Link
        prefetch
        href="/login/start"
        className={cn(
          'mx-auto mt-16 block w-full max-w-[618px] overflow-hidden rounded-[12px] outline-none transition-opacity hover:opacity-90',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none',
        )}
      >
        <span
          className={cn(
            'flex w-full items-center justify-center gap-2 bg-[#FEE500] px-[max(1rem,29.17%)] pt-4 pb-[14px]',
            'rounded-[12px] tracking-normal select-none',
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            width={22}
            height={22}
            aria-hidden
            className="shrink-0 text-black"
          >
            <title>카카오 심볼</title>
            <path fill="currentColor" d={KAKAO_BUBBLE_PATH} />
          </svg>
          <span className="text-pretendard-body-1 font-medium text-black/85">카카오 로그인</span>
        </span>
      </Link>

      <p className="mt-8 text-center text-pretendard-body-2 tracking-[1.4px] text-ink-400/90">
        로그인이 필요합니다.
      </p>
    </main>
  );
}
