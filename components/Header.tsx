import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';

export default function Header() {
  return (
    <header className="flex h-15 shrink-0 items-center justify-between px-page-x py-2">
      <Link href="/" className="flex items-center gap-5">
        <Image src="/icons/logo.png" alt="" width={60} height={60} className="shrink-0" priority />
        <span className="whitespace-nowrap uppercase leading-9 tracking-logo text-cormorant-logo">
          PANGEA
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/kakaologin"
          className="whitespace-nowrap px-3 py-2 tracking-body text-pretendard-nav"
        >
          Login
        </Link>
        <button
          type="button"
          className="flex shrink-0 items-center justify-center"
          aria-label="메뉴 열기"
        >
          <Icon name="menubar" width={90} height={60} className="text-primary" />
        </button>
      </div>
    </header>
  );
}
