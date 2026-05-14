'use client';

import { motion } from 'motion/react';

const MOTION_PATH =
  'M0 0.149939C409.163 0.149939 497.522 351.888 742.016 482.42C986.51 612.952 1421.85 593.796 1421.85 908.373C1421.85 1379.68 678.498 1329.74 423.722 1480.34C32.6326 1711.51 86.853 2351.22 880.579 2478.76';

const DURATION = 80;
const DOT_COUNT = 3;

const DOTS = Array.from({ length: DOT_COUNT }, (_, index) => ({
  id: `dot-${index + 1}`, // 'dot-1', 'dot-2', 'dot-3'
  delay: -(DURATION / DOT_COUNT) * index,
}));

export default function BackgroundPath() {
  return (
    <div className="absolute inset-0 ">
      <div className="absolute left-1/2 -translate-x-1/2 top-148.5 w-full max-w-355.5 aspect-1422/2479">
        <svg
          viewBox="0 0 1422 2479"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="block w-full h-full"
        >
          {/* 메인 path */}
          <path
            id="motion-path"
            d={MOTION_PATH}
            stroke="#251E2E"
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
        </svg>
      </div>
    </div>
  );
}
