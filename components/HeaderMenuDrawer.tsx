'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import Icon from '@/components/Icon';
import { PATH } from '@/constants/path';
import { createClient } from '@/lib/supabase/client';

const MENU_ITEMS = [
  {
    href: PATH.CART,
    label: '담아둔 것들',
    requiresAuth: true,
  },
  { href: PATH.FEED, label: '내 서재', requiresAuth: false },
  // { href: PATH.EXPLORE, label: '탐험', requiresAuth: false },
] as const;

export default function HeaderMenuDrawer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleMenuClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    requiresAuth: boolean,
  ) => {
    if (!requiresAuth) {
      setOpen(false);
      return;
    }

    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setOpen(false);
    if (user) {
      router.push(href);
    } else {
      router.push(PATH.KAKAO_LOGIN);
    }
  };

  return (
    <>
      <button
        type="button"
        className="flex shrink-0 items-center justify-center pr-2"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
      >
        <Icon name="menubar" width={20} height={20} />
      </button>

      <div
        className={
          open
            ? 'pointer-events-auto fixed inset-0 z-40 flex justify-end'
            : 'pointer-events-none fixed inset-0 z-40 flex justify-end'
        }
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-primary/25 transition-opacity duration-300 ease-out ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        />
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
          className={`relative z-10 flex h-full min-h-dvh w-[min(280px,85vw)] flex-col bg-surface-50 pt-9 shadow-card transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <nav className="flex flex-col gap-4 px-4" aria-label="주요 메뉴">
            {MENU_ITEMS.map(({ href, label, requiresAuth }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-1 text-pretendard-subtitle-1 text-primary whitespace-nowrap"
                onClick={(e) => handleMenuClick(e, href, requiresAuth)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
