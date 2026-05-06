import Image from 'next/image';
import Link from 'next/link';
import SiteSlideMenu, { type SiteSlideMenuLink } from '@/components/site-slide-menu';
import { cn } from '@/lib/cn';

type Props = {
  readonly className?: string;
  /** 기본값 `/login`. 인증 후에는 `/my` 등으로 교체 가능. */
  readonly loginHref?: string;
  readonly menuItems?: readonly SiteSlideMenuLink[];
};

/**
 * 전역 상단 헤더 (피그마 541:902). 홈 로고 · Login · 슬라이드 메뉴 탭.
 */
export default function SiteHeader({ className, loginHref = '/login', menuItems }: Props) {
  return (
    <header
      className={cn(
        'flex h-[100px] shrink-0 items-center justify-between bg-background px-[clamp(1.25rem,4vw,2.5rem)]',
        className,
      )}
    >
      <Link href="/" className="flex min-w-0 items-center gap-0 hover:opacity-90">
        <Image
          src="/auth/header-mark.webp"
          alt=""
          width={100}
          height={100}
          className="size-[60px] shrink-0 object-cover sm:size-[76px] md:size-[100px]"
        />
        <span className="-ml-[6px] text-cormorant-logo tracking-[6px] text-primary whitespace-nowrap sm:ml-0">
          PANGEA
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <Link
          href={loginHref}
          className="px-3 py-2 tracking-[4px] text-primary text-pretendard-nav-login hover:underline"
        >
          Login
        </Link>

        <SiteSlideMenu items={menuItems} />
      </div>
    </header>
  );
}
