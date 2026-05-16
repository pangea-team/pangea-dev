'use client';

import { motion } from 'motion/react';

const MOTION_PATH =
  'M0 0.149939C409.163 0.149939 497.522 351.888 742.016 482.42C986.51 612.952 1421.85 593.796 1421.85 908.373C1421.85 1379.68 678.498 1329.74 423.722 1480.34C32.6326 1711.51 86.853 2351.22 880.579 2478.76';

/** path·점 공통 — 왼쪽 시작점을 아래로 내림 (viewBox 단위) */
const PATH_Y_OFFSET = 440;
const VIEWBOX_HEIGHT = 2519 + PATH_Y_OFFSET;

const DURATION = 80;
const DOT_COUNT = 3;

const DOTS = Array.from({ length: DOT_COUNT }, (_, index) => ({
  id: `dot-${index + 1}`, // 'dot-1', 'dot-2', 'dot-3'
  delay: -(DURATION / DOT_COUNT) * index,
}));

export default function BackgroundPath() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox={`0 0 1462 ${VIEWBOX_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin slice"
        aria-hidden="true"
        className="absolute inset-0 size-full text-ink-400"
      >
        <g transform={`translate(0 ${PATH_Y_OFFSET})`}>
          {/* 메인 path — xMinYMin slice: 좌상단 기준으로 뷰포트를 채우며 크롭 */}
          <path
            id="motion-path"
            d={MOTION_PATH}
            stroke="currentColor"
            strokeWidth="0.3"
            vectorEffect="non-scaling-stroke"
          />

          {/* 움직이는 노란 점들 */}
          {DOTS.map(({ id, delay }) => (
            <motion.circle
              key={id}
              r="10"
              fill="#FCD34D"
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{
                duration: DURATION,
                repeat: Infinity,
                ease: 'linear',
                delay,
              }}
              style={{
                offsetPath: `path("${MOTION_PATH}")`,
                offsetRotate: '0deg',
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
