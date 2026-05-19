'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PATH } from '@/constants/path';
import { INTRO_SECTIONS } from '../_lib/constants';

const TRANSITION_DURATION = 0.8;
const Y_OFFSET = 30;
const TOUCH_THRESHOLD = 50;
const TRANSITION_LOCK_MS = TRANSITION_DURATION * 2 * 1000;

type Direction = 'next' | 'prev';

export default function IntroSequence() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('next');
  const [showButton, setShowButton] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  // Mutable ref so event handlers always see fresh state without re-registering
  const stateRef = useRef({ currentIndex: 0, showButton: false, isTransitioning: false });

  useEffect(() => {
    stateRef.current.currentIndex = currentIndex;
    stateRef.current.showButton = showButton;
  }, [currentIndex, showButton]);

  // Lock body scroll for the duration of the intro
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const navigate = useCallback((dir: Direction) => {
    const s = stateRef.current;
    if (s.isTransitioning) return;

    if (dir === 'next') {
      if (s.showButton) return;
      s.isTransitioning = true;
      setDirection('next');
      if (s.currentIndex === INTRO_SECTIONS.length - 1) {
        setShowButton(true);
        s.showButton = true;
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      if (s.currentIndex === 0 && !s.showButton) return;
      s.isTransitioning = true;
      setDirection('prev');
      if (s.showButton) {
        setShowButton(false);
        s.showButton = false;
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    const isButtonTransition =
      (dir === 'next' && s.currentIndex === INTRO_SECTIONS.length - 1) ||
      (dir === 'prev' && s.showButton);
    setTimeout(
      () => {
        s.isTransitioning = false;
      },
      isButtonTransition ? 700 : TRANSITION_LOCK_MS,
    );
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      navigate(e.deltaY > 0 ? 'next' : 'prev');
    },
    [navigate],
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      navigate(delta > 0 ? 'next' : 'prev');
    },
    [navigate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        navigate('next');
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        navigate('prev');
      }
    },
    [navigate],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);

  const yOffset = shouldReduceMotion ? 0 : Y_OFFSET;
  const duration = shouldReduceMotion ? 0.3 : TRANSITION_DURATION;

  // variant functions receive the `custom` value (direction) from AnimatePresence
  const variants = {
    enter: (dir: Direction) => ({ opacity: 0, y: dir === 'next' ? yOffset : -yOffset }),
    visible: { opacity: 1, y: 0 },
    exit: (dir: Direction) => ({ opacity: 0, y: dir === 'next' ? -yOffset : yOffset }),
  };

  return (
    <section
      ref={containerRef}
      aria-label="PANGEA 소개. 방향키 또는 휠로 탐색"
      className="relative flex h-[calc(100dvh-3.75rem)] items-center justify-center text-center touch-none pb-20"
    >
      <div className="relative w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="visible"
            exit="exit"
            transition={{ duration, ease: 'easeOut' }}
            aria-live="polite"
          >
            {currentIndex === 0 ? (
              <p className="text-pretendard-body-1 leading-loose sm:text-pretendard-body-2 md:text-pretendard-subtitle-1 lg:text-pretendard-subtitle-1 text-primary whitespace-pre-line">
                <span className="block font-bold text-pretendard-subtitle-1 sm:text-pretendard-subtitle-1 md:text-pretendard-title-2 lg:text-pretendard-title-1 mb-4">
                  Welcome to PANGEA.
                </span>
                {INTRO_SECTIONS[0].replace('Welcome to PANGEA.', '')}
              </p>
            ) : (
              <p className="text-pretendard-body-1 leading-loose sm:text-pretendard-body-2 md:text-pretendard-subtitle-1 lg:text-pretendard-subtitle-1 text-primary whitespace-pre-line">
                {INTRO_SECTIONS[currentIndex]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 버튼을 텍스트 컨테이너 기준 absolute로 배치 */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-x-0 top-full mt-2"
            >
              <Link
                href={PATH.BOOKS}
                className="inline-block border border-primary px-10 py-3 text-noto-body-1 text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
              >
                입장하기
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
