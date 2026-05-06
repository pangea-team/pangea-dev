'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import MenuGlyphThin from '@/components/menu-glyph-thin';
import { cn } from '@/lib/cn';

export type SiteSlideMenuLink = {
  readonly href: string;
  readonly label: string;
};

const DEFAULT_ITEMS: readonly SiteSlideMenuLink[] = [
  { href: '/cart', label: '담아둔 것들' },
  { href: '/my/feed', label: '나의 대륙' },
  { href: '/feed', label: '탐험' },
] as const;

type Props = {
  readonly items?: readonly SiteSlideMenuLink[];
};

export default function SiteSlideMenu({ items = DEFAULT_ITEMS }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const reactId = useId();
  const idSuffix = reactId.replace(/:/g, '');
  const panelId = `site-slide-menu-panel-${idSuffix}`;
  const titleId = `site-slide-menu-title-${idSuffix}`;

  const closeMenu = useCallback(() => {
    setOpen(false);
    queueMicrotask(() => btnRef.current?.focus());
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (open) {
      window.addEventListener('keydown', onEsc);
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.documentElement.style.overflow = '';
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        panelRef.current?.querySelector('a')?.focus();
      });
    }
  }, [open]);

  const toggleMenu = () => {
    setOpen((prev) => {
      if (prev) {
        queueMicrotask(() => btnRef.current?.focus());
        return false;
      }
      return true;
    });
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="-mr-2 p-2 text-primary"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        <MenuGlyphThin />
      </button>

      <div
        role="presentation"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-40 bg-primary/25 transition-opacity duration-200 motion-reduce:transition-none',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMenu}
      />

      <aside
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-full min-h-[100dvh] w-[min(20rem,calc(100vw-3rem))] flex-col shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none',
          'border-primary/10 border-l bg-surface-50 text-primary',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <nav aria-labelledby={titleId} className="flex flex-col gap-4 px-4 pb-8 pt-9">
          <h2 className="sr-only" id={titleId}>
            메뉴
          </h2>
          {items.map(({ href, label }) => (
            <Link
              key={href}
              prefetch
              href={href}
              onClick={closeMenu}
              className={cn(
                'rounded px-4 py-1 font-light tracking-[0] text-primary text-pretendard-subtitle-1 outline-none hover:bg-background',
                'focus-visible:ring-2 focus-visible:ring-primary/40',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
